// Deterministic 2D pose/contact solver for executable manga names.
// Semantic pose/contact stays canonical; renderPose is derived geometry for review/generation references.
const pt=(x,y)=>({x,y});
const mix=(a,b,t=.5)=>pt(a.x+(b.x-a.x)*t,a.y+(b.y-a.y)*t);
const copy=(p)=>pt(p.x,p.y);
const lower=(v='')=>String(v).toLowerCase();

function facingFor(c,panel){
  const pose=lower(c.poseId), gaze=lower(c.gaze?.target);
  if(/left/.test(pose)) return -1;
  if(/right/.test(pose)) return 1;
  const target=panel.characters.find(o=>o!==c && (gaze.startsWith(lower(o.name))||gaze.startsWith(lower(o.referenceKey))));
  if(target) return target.x<c.x?-1:1;
  return c.x>(panel.rect.x+panel.rect.w/2)?-1:1;
}
function skeleton(c,panel){
  const s=c.scale||1, f=facingFor(c,panel), pose=lower(c.poseId), phase=lower(c.motionPhase), support=lower(c.supportState);
  const attack=/slash|attack|lunge|strike|punch|kick|power|counter/.test(pose)||/launch|impact/.test(phase);
  const recoil=/recoil|off-balance|broken|back/.test(pose)||/recovery/.test(phase);
  const guard=/guard|ready|brace/.test(pose);
  const airborne=support==='airborne'||phase==='airborne';
  const lean=(attack?18:recoil?-16:guard?5:0)*f*s;
  const hip=pt(c.x,c.y-(airborne?32:0)*s), chest=pt(c.x+lean,hip.y-72*s), neck=pt(chest.x+lean*.18,chest.y-26*s), head=pt(neck.x,neck.y-28*s);
  const shoulder=pt(chest.x,chest.y-8*s), reach=attack?92:guard?58:44, back=guard?50:38;
  const frontHand=pt(shoulder.x+f*reach*s,shoulder.y+(attack?18:guard?5:28)*s);
  const backHand=pt(shoulder.x-f*back*s,shoulder.y+(guard?12:34)*s);
  const stride=attack?62:recoil?54:38;
  const frontFoot=pt(hip.x+f*stride*s,hip.y+78*s), backFoot=pt(hip.x-f*(attack?48:36)*s,hip.y+78*s);
  if(/kick/.test(pose)){frontFoot.x=hip.x+f*105*s;frontFoot.y=hip.y+5*s;}
  const joints={head,neck,chest,hip,leftShoulder:copy(shoulder),rightShoulder:copy(shoulder),leftHand:f===1?backHand:frontHand,rightHand:f===1?frontHand:backHand,leftFoot:f===1?backFoot:frontFoot,rightFoot:f===1?frontFoot:backFoot};
  const weapon=/sword|blade|剣|刀/.test(pose)?{kind:'sword',hand:f===1?'rightHand':'leftHand',base:copy(frontHand),tip:pt(frontHand.x+f*105*s,frontHand.y-(attack?28:guard?52:20)*s)}:null;
  return {facing:f,lean,airborne,joints,props:weapon?[weapon]:[]};
}
function anchor(plan,part){
  const key=lower(part).replace(/[-_ ]/g,''); const j=plan.joints;
  if(/sword|blade|weapon|剣|刀/.test(key)) return plan.props[0]?.tip||j.rightHand;
  if(/lefthand|左手/.test(key))return j.leftHand;if(/righthand|右手/.test(key))return j.rightHand;
  if(/leftfoot|左足/.test(key))return j.leftFoot;if(/rightfoot|右足/.test(key))return j.rightFoot;
  if(/head|face|顔|頭/.test(key))return j.head;if(/chest|torso|body|胸|胴/.test(key))return j.chest;
  if(/shoulder|肩/.test(key))return j.chest; return j.chest;
}
function moveAnchor(plan,part,target){
  const a=anchor(plan,part); if(!a)return; const dx=target.x-a.x,dy=target.y-a.y;
  if(/sword|blade|weapon|剣|刀/.test(lower(part)) && plan.props[0]){plan.props[0].tip=copy(target);return;}
  a.x+=dx;a.y+=dy;
}
export function solvePanelPoses(panel){
  for(const c of panel.characters)c.renderPose=skeleton(c,panel);
  const contacts=[];
  for(const interaction of panel.interactions||[]){
    if(interaction.type!=='contact'||!interaction.source?.character||!interaction.target?.character)continue;
    const source=panel.characters.find(c=>c.name===interaction.source.character||c.referenceKey===interaction.source.character);
    const target=panel.characters.find(c=>c.name===interaction.target.character||c.referenceKey===interaction.target.character);
    if(!source||!target)continue;
    const a=anchor(source.renderPose,interaction.source.part),b=anchor(target.renderPose,interaction.target.part); if(!a||!b)continue;
    const contact=mix(a,b,.5); moveAnchor(source.renderPose,interaction.source.part,contact);moveAnchor(target.renderPose,interaction.target.part,contact);
    contacts.push({x:contact.x,y:contact.y,source:interaction.source,target:interaction.target});
  }
  panel.renderContacts=contacts;
  return panel;
}
export function solveProjectPoses(project){for(const page of project.pages)for(const panel of page.panels)solvePanelPoses(panel);return project;}
