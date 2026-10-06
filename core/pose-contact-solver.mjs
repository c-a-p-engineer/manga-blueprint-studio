// Deterministic articulated pose / prop / contact solver v3.
const pt=(x,y)=>({x,y}),copy=p=>pt(p.x,p.y),mix=(a,b,t=.5)=>pt(a.x+(b.x-a.x)*t,a.y+(b.y-a.y)*t),lower=(v='')=>String(v).toLowerCase();
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const lerpJoint=(a,b,t)=>mix(a,b,t);
const propKind=pose=>/spear|staff|槍|棒/.test(pose)?'staff':/shield|盾/.test(pose)?'shield':/phone|smartphone|スマホ|携帯/.test(pose)?'phone':/bag|バッグ|鞄/.test(pose)?'bag':/sword|blade|slash|剣|刀/.test(pose)?'sword':/hold|grip|prop|持/.test(pose)?'generic':null;

function facingFor(c,panel){
  const pose=lower(c.poseId),gaze=lower(c.gaze?.target);
  if(/left|左向/.test(pose))return-1;
  if(/right|右向/.test(pose))return 1;
  const target=panel.characters.find(o=>o!==c&&(gaze.startsWith(lower(o.name))||gaze.startsWith(lower(o.referenceKey))));
  if(target)return target.x<c.x?-1:1;
  return c.x>(panel.rect.x+panel.rect.w/2)?-1:1;
}

function angle(a,b,c){
  if(!a||!b||!c)return null;
  const ux=a.x-b.x,uy=a.y-b.y,vx=c.x-b.x,vy=c.y-b.y;
  const den=Math.hypot(ux,uy)*Math.hypot(vx,vy);
  if(!den)return null;
  return Math.acos(clamp((ux*vx+uy*vy)/den,-1,1))*180/Math.PI;
}

function postureFor(pose,support){
  if(/lie|lying|prone|supine|寝|倒れ|横た/.test(pose))return'lying';
  if(/sit|seated|座/.test(pose))return'seated';
  if(/crouch|squat|しゃが|屈/.test(pose))return'crouched';
  if(/lean|もたれ|寄りかか/.test(pose)||support==='supported')return'leaning';
  return'standing';
}

function bodyMetrics(plan,support){
  const j=plan.joints,feet=[j.leftFoot,j.rightFoot].filter(Boolean),centerOfMass=mix(j.chest,j.hip,.58);
  const minX=feet.length?Math.min(...feet.map(p=>p.x)):j.hip.x,maxX=feet.length?Math.max(...feet.map(p=>p.x)):j.hip.x;
  const pad=Math.max(10,(maxX-minX)*.18);
  const supportPolygon={minX:minX-pad,maxX:maxX+pad,y:Math.max(...feet.map(p=>p.y),j.hip.y)};
  const balance=support==='airborne'||plan.posture==='lying'||plan.posture==='seated'
    ?'supported'
    :centerOfMass.x>=supportPolygon.minX&&centerOfMass.x<=supportPolygon.maxX?'stable':'unstable';
  const torsoLeanDegrees=Math.atan2(j.chest.x-j.hip.x,Math.max(1,j.hip.y-j.chest.y))*180/Math.PI;
  return{
    torsoOrientation:{facing:plan.facing,leanDegrees:torsoLeanDegrees,posture:plan.posture},
    pelvisOrientation:{facing:plan.facing,rotationDegrees:plan.posture==='lying'?90:0},
    centerOfMass,
    supportPolygon,
    balance
  };
}

function skeleton(c,panel){
  const s=Number(c.scale)||1,f=facingFor(c,panel),pose=lower(c.poseId),phase=lower(c.motionPhase),support=lower(c.supportState);
  const attack=/slash|attack|lunge|strike|punch|kick|power|counter|突進|攻撃|斬/.test(pose)||/launch|impact/.test(phase);
  const recoil=/recoil|off-balance|broken|knockback|のけぞ|後退/.test(pose)||/recovery/.test(phase);
  const guard=/guard|ready|brace|構え|防御/.test(pose);
  const airborne=support==='airborne'||phase==='airborne';
  const posture=postureFor(pose,support);
  const perspective=panel.camera?.foreshortening||'normal';
  const perspectiveFactor=perspective==='extreme'?1.28:perspective==='strong'?1.14:1;
  const baseLean=attack?16:recoil?-10:guard?5:/lean-forward|前傾/.test(pose)?10:/lean-back|後傾/.test(pose)?-8:0;
  const lean=clamp(baseLean,-12,18)*f*s;
  const hip=pt(c.x,c.y-(airborne?32:0)*s);

  if(posture==='lying'){
    const chest=pt(hip.x-58*f*s,hip.y-8*s),neck=pt(chest.x-25*f*s,chest.y-2*s),head=pt(neck.x-27*f*s,neck.y);
    const leftShoulder=pt(chest.x, chest.y-15*s),rightShoulder=pt(chest.x,chest.y+15*s);
    const leftHand=pt(chest.x-20*f*s,chest.y-44*s),rightHand=pt(chest.x+20*f*s,chest.y+44*s);
    const leftElbow=mix(leftShoulder,leftHand,.52),rightElbow=mix(rightShoulder,rightHand,.52);
    const leftFoot=pt(hip.x+78*f*s,hip.y-18*s),rightFoot=pt(hip.x+82*f*s,hip.y+20*s);
    const leftKnee=mix(hip,leftFoot,.52),rightKnee=mix(hip,rightFoot,.52);
    const joints={head,neck,chest,hip,leftShoulder,rightShoulder,leftElbow,rightElbow,leftHand,rightHand,leftKnee,rightKnee,leftFoot,rightFoot};
    const plan={version:3,facing:f,lean,airborne:false,posture,joints,props:[],perspective:{foreshortening:perspective,factor:perspectiveFactor}};
    plan.body=bodyMetrics(plan,'supported');
    const xs=Object.values(joints).map(p=>p.x),ys=Object.values(joints).map(p=>p.y);
    plan.occupancy={x:Math.min(...xs)-24*s,y:Math.min(...ys)-24*s,w:Math.max(...xs)-Math.min(...xs)+48*s,h:Math.max(...ys)-Math.min(...ys)+48*s};
    return plan;
  }

  const torsoHeight=(posture==='crouched'?48:posture==='seated'?56:72)*s;
  if(posture==='seated')hip.y+=18*s;
  const chest=pt(hip.x+lean,hip.y-torsoHeight),neck=pt(chest.x+lean*.16,chest.y-24*s),head=pt(neck.x,neck.y-27*s);
  const ls=pt(chest.x-f*16*s,chest.y-8*s),rs=pt(chest.x+f*16*s,chest.y-8*s);
  const reach=(attack?92:guard?58:44)*perspectiveFactor,back=guard?50:38;
  const frontHand=pt(chest.x+f*reach*s,chest.y+(attack?18:guard?5:28)*s),backHand=pt(chest.x-f*back*s,chest.y+(guard?12:34)*s);
  const frontElbow=lerpJoint(f===1?rs:ls,frontHand,attack?.42:.52),backElbow=lerpJoint(f===1?ls:rs,backHand,.5);
  frontElbow.y+=(attack?-14:12)*s;backElbow.y+=15*s;

  let frontFoot,backFoot;
  if(posture==='seated'){
    frontFoot=pt(hip.x+f*52*s,hip.y+55*s);backFoot=pt(hip.x-f*24*s,hip.y+58*s);
  }else if(posture==='crouched'){
    frontFoot=pt(hip.x+f*58*s,hip.y+48*s);backFoot=pt(hip.x-f*48*s,hip.y+48*s);
  }else{
    const stride=attack?62:recoil?48:38;
    frontFoot=pt(hip.x+f*stride*s,hip.y+78*s);backFoot=pt(hip.x-f*(attack?48:36)*s,hip.y+78*s);
  }
  if(/kick|蹴/.test(pose)){frontFoot.x=hip.x+f*105*s*perspectiveFactor;frontFoot.y=hip.y+5*s;}
  const frontKnee=lerpJoint(hip,frontFoot,posture==='seated'?.42:.52),backKnee=lerpJoint(hip,backFoot,posture==='seated'?.42:.52);
  frontKnee.x+=f*12*s;backKnee.x-=f*10*s;

  const joints={
    head,neck,chest,hip,
    leftShoulder:f===1?ls:rs,rightShoulder:f===1?rs:ls,
    leftElbow:f===1?backElbow:frontElbow,rightElbow:f===1?frontElbow:backElbow,
    leftHand:f===1?backHand:frontHand,rightHand:f===1?frontHand:backHand,
    leftKnee:f===1?backKnee:frontKnee,rightKnee:f===1?frontKnee:backKnee,
    leftFoot:f===1?backFoot:frontFoot,rightFoot:f===1?frontFoot:backFoot
  };
  const hand=f===1?'rightHand':'leftHand',base=copy(joints[hand]),kind=propKind(pose);let prop=null;
  if(kind){
    const len=(kind==='staff'?155:kind==='sword'?105:kind==='bag'?55:kind==='shield'?48:kind==='phone'?28:70)*s*perspectiveFactor;
    prop={kind,hand,grip:copy(base),base:copy(base),tip:pt(base.x+f*len,base.y-(kind==='staff'?45:attack?28:20)*s),radius:kind==='shield'?48*s:undefined};
  }
  const xs=Object.values(joints).map(p=>p.x),ys=Object.values(joints).map(p=>p.y);
  const occupancy={x:Math.min(...xs)-26*s,y:Math.min(...ys)-30*s,w:Math.max(...xs)-Math.min(...xs)+52*s,h:Math.max(...ys)-Math.min(...ys)+42*s};
  const plan={version:3,facing:f,lean,airborne,posture,joints,props:prop?[prop]:[],occupancy,perspective:{foreshortening:perspective,factor:perspectiveFactor}};
  plan.body=bodyMetrics(plan,airborne?'airborne':support);
  plan.jointAngles={
    leftElbow:angle(joints.leftShoulder,joints.leftElbow,joints.leftHand),
    rightElbow:angle(joints.rightShoulder,joints.rightElbow,joints.rightHand),
    leftKnee:angle(joints.hip,joints.leftKnee,joints.leftFoot),
    rightKnee:angle(joints.hip,joints.rightKnee,joints.rightFoot)
  };
  plan.occlusionOrder={body:Number(c.depthOrder)||0,props:(Number(c.depthOrder)||0)+.25};
  return plan;
}

function anchor(plan,part=''){
  const key=lower(part).replace(/[-_ ]/g,''),j=plan.joints,p=plan.props[0];
  if(/tip|sword|blade|weapon|剣|刀|staff|spear|槍|棒/.test(key))return p?.tip||j.rightHand;
  if(/grip|handle|柄/.test(key))return p?.grip||j.rightHand;
  if(/lefthand|左手/.test(key))return j.leftHand;
  if(/righthand|右手/.test(key))return j.rightHand;
  if(/leftfoot|左足/.test(key))return j.leftFoot;
  if(/rightfoot|右足/.test(key))return j.rightFoot;
  if(/leftelbow|左肘/.test(key))return j.leftElbow;
  if(/rightelbow|右肘/.test(key))return j.rightElbow;
  if(/leftknee|左膝/.test(key))return j.leftKnee;
  if(/rightknee|右膝/.test(key))return j.rightKnee;
  if(/head|face|顔|頭/.test(key))return j.head;
  if(/hip|腰/.test(key))return j.hip;
  if(/shoulder|肩|chest|torso|body|胸|胴/.test(key))return j.chest;
  return j.chest;
}

function moveAnchor(plan,part,target){
  const a=anchor(plan,part);if(!a)return;
  if(plan.props[0]&&a===plan.props[0].tip){plan.props[0].tip=copy(target);return}
  a.x=target.x;a.y=target.y;
}

function refreshDerived(plan,support,scale=1){
  const j=plan.joints,s=Number(scale)||1;
  plan.body=bodyMetrics(plan,support);
  plan.jointAngles={
    leftElbow:angle(j.leftShoulder,j.leftElbow,j.leftHand),
    rightElbow:angle(j.rightShoulder,j.rightElbow,j.rightHand),
    leftKnee:angle(j.hip,j.leftKnee,j.leftFoot),
    rightKnee:angle(j.hip,j.rightKnee,j.rightFoot)
  };
  const points=[...Object.values(j),...(plan.props||[]).flatMap(p=>[p.base,p.tip,p.grip].filter(Boolean))].filter(Boolean);
  const xs=points.map(p=>p.x),ys=points.map(p=>p.y);
  plan.occupancy={x:Math.min(...xs)-26*s,y:Math.min(...ys)-30*s,w:Math.max(...xs)-Math.min(...xs)+52*s,h:Math.max(...ys)-Math.min(...ys)+42*s};
  return plan;
}

function diagnostics(panel){
  const out=[];
  for(const c of panel.characters){
    const plan=c.renderPose,o=plan?.occupancy;if(!o)continue;
    const r=panel.rect;
    if(o.x<r.x-20||o.y<r.y-20||o.x+o.w>r.x+r.w+20||o.y+o.h>r.y+r.h+20)out.push({type:'panel-overflow',character:c.name,severity:'review'});
    if(plan.body?.balance==='unstable')out.push({type:'pose-balance',character:c.name,severity:'review',centerOfMass:plan.body.centerOfMass,supportPolygon:plan.body.supportPolygon});
    if((plan.body?.torsoOrientation?.leanDegrees??0)<-22)out.push({type:'excessive-backward-lean',character:c.name,severity:'review',degrees:plan.body.torsoOrientation.leanDegrees});
    for(const[joint,degrees]of Object.entries(plan.jointAngles||{}))if(degrees!=null&&(degrees<12||degrees>178))out.push({type:'joint-range',character:c.name,joint,degrees,severity:'review'});
  }
  for(let i=0;i<panel.characters.length;i++)for(let j=i+1;j<panel.characters.length;j++){
    const a=panel.characters[i].renderPose?.occupancy,b=panel.characters[j].renderPose?.occupancy;if(!a||!b)continue;
    const iw=Math.max(0,Math.min(a.x+a.w,b.x+b.w)-Math.max(a.x,b.x)),ih=Math.max(0,Math.min(a.y+a.h,b.y+b.h)-Math.max(a.y,b.y));
    if(iw*ih>Math.min(a.w*a.h,b.w*b.h)*.55)out.push({type:'heavy-overlap',characters:[panel.characters[i].name,panel.characters[j].name],severity:'review'});
  }
  return out;
}

export function solvePanelPoses(panel){
  for(const c of panel.characters)c.renderPose=skeleton(c,panel);
  const contacts=[];
  for(const interaction of panel.interactions||[]){
    if(interaction.type!=='contact'||!interaction.source?.character)continue;
    const source=panel.characters.find(c=>c.name===interaction.source.character||c.referenceKey===interaction.source.character);
    const target=panel.characters.find(c=>c.name===interaction.target?.character||c.referenceKey===interaction.target?.character);
    if(!source)continue;
    const a=anchor(source.renderPose,interaction.source.part);
    let b=target?anchor(target.renderPose,interaction.target.part):null;
    if(!b&&/ground|floor|地面/.test(lower(interaction.target?.part||interaction.target?.character)))b=pt(a.x,panel.rect.y+panel.rect.h-12);
    if(!b)continue;
    const contact=target?mix(a,b,.5):b;
    moveAnchor(source.renderPose,interaction.source.part,contact);
    if(target)moveAnchor(target.renderPose,interaction.target.part,contact);
    contacts.push({x:contact.x,y:contact.y,source:interaction.source,target:interaction.target});
  }
  for(const c of panel.characters)refreshDerived(c.renderPose,c.renderPose.airborne?'airborne':lower(c.supportState),c.scale);
  panel.renderContacts=contacts;
  panel.renderDiagnostics=diagnostics(panel);
  return panel;
}

export function solveProjectPoses(project){
  for(const page of project.pages)for(const panel of page.panels)solvePanelPoses(panel);
  return project;
}
