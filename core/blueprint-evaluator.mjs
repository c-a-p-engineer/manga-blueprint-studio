// Structural evaluator v2: measures preservation of authored spatial/reading intent, never mutates canonical state.
const clamp=n=>Math.max(0,Math.min(1,n)),area=r=>Math.max(0,r.w)*Math.max(0,r.h),dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y),diag=r=>Math.max(1,Math.hypot(r.w,r.h)),center=r=>({x:r.x+r.w/2,y:r.y+r.h/2});
const finitePoint=p=>p&&Number.isFinite(p.x)&&Number.isFinite(p.y);

export function rectIoU(a,b){
  if(!a||!b)return 0;
  const x1=Math.max(a.x,b.x),y1=Math.max(a.y,b.y),x2=Math.min(a.x+a.w,b.x+b.w),y2=Math.min(a.y+a.h,b.y+b.h);
  const inter=Math.max(0,x2-x1)*Math.max(0,y2-y1),union=area(a)+area(b)-inter;
  return union?inter/union:0;
}

const occupancy=c=>c?.observedOccupancy||c?.renderPose?.occupancy||(Number.isFinite(c?.x)&&Number.isFinite(c?.y)?{
  x:c.x-35*(c.scale||1),
  y:c.y-145*(c.scale||1),
  w:70*(c.scale||1),
  h:155*(c.scale||1)
}:null);

const poseScore=(a,b,r)=>{
  const keys=['head','chest','hip','leftElbow','rightElbow','leftHand','rightHand','leftKnee','rightKnee','leftFoot','rightFoot'];
  const pairs=keys.map(k=>[a.renderPose?.joints?.[k],b.renderPose?.joints?.[k]]).filter(x=>finitePoint(x[0])&&finitePoint(x[1]));
  return pairs.length?pairs.reduce((s,[x,y])=>s+clamp(1-dist(x,y)/diag(r)),0)/pairs.length:null;
};

function reservedRegions(p){
  return[
    ...(p?.balloons||[]).map(b=>({
      x:b.x-Math.max(34,b.size*.55),
      y:b.y-Math.max(44,b.size*.72),
      w:Math.max(68,b.size*1.1),
      h:Math.max(88,b.size*1.44)
    })),
    ...(p?.reservedRegions||[])
  ];
}

function matchCharacter(expected,observed=[]){
  return observed.find(c=>
    c.id===expected.id
    ||c.characterId===expected.characterId
    ||expected.referenceKey&&c.referenceKey===expected.referenceKey
    ||expected.name&&c.name===expected.name
  );
}

function positionScore(expected,observed,panelRect){
  if(finitePoint(observed?.observedAnchor))return clamp(1-dist(expected,observed.observedAnchor)/diag(panelRect));
  const eo=occupancy(expected),oo=observed?.observedOccupancy;
  if(eo&&oo)return clamp(1-dist(center(eo),center(oo))/diag(panelRect));
  if(finitePoint(observed)&&finitePoint(expected))return clamp(1-dist(expected,observed)/diag(panelRect));
  return null;
}

function panelScore(e,o){
  const observedCharacters=o.characters||[];
  const chars=(e.characters||[]).map(ec=>{
    const oc=matchCharacter(ec,observedCharacters);
    if(!oc)return{name:ec.name||ec.id,position:0,scale:0,occupancy:0,pose:0,missing:true};
    const eo=occupancy(ec),oo=occupancy(oc);
    const scale=Number.isFinite(ec.scale)&&Number.isFinite(oc.scale)
      ?clamp(1-Math.abs(ec.scale-oc.scale)/Math.max(ec.scale,oc.scale))
      :null;
    return{
      name:ec.name||ec.id,
      position:positionScore(ec,oc,e.rect),
      scale,
      occupancy:eo&&oo?rectIoU(eo,oo):null,
      pose:poseScore(ec,oc,e.rect),
      missing:false
    };
  });
  const expectedContacts=e.renderContacts||[],observedContacts=o.renderContacts||[];
  const contacts=expectedContacts.length&&observedContacts.length
    ?expectedContacts.reduce((s,x,i)=>s+(observedContacts[i]?clamp(1-dist(x,observedContacts[i])/diag(e.rect)):0),0)/expectedContacts.length
    :null;
  const er=reservedRegions(e),or=reservedRegions(o);
  const reserved=er.length&&or.length
    ?er.reduce((s,x,i)=>s+(or[i]?rectIoU(x,or[i]):0),0)/er.length
    :null;
  const attention=e.attention?.primary&&o.attention?.primary!=null
    ?String(e.attention.primary)===String(o.attention.primary)?1:0
    :null;
  const flowParts=[];
  if(e.flow?.entry&&o.flow?.entry!=null)flowParts.push(e.flow.entry===o.flow.entry?1:0);
  if(e.flow?.exit&&o.flow?.exit!=null)flowParts.push(e.flow.exit===o.flow.exit?1:0);
  const flow=flowParts.length?flowParts.reduce((a,b)=>a+b,0)/flowParts.length:null;
  return{
    panelIoU:rectIoU(e.rect,o.rect),
    centerDrift:clamp(1-dist(center(e.rect),center(o.rect))/diag(e.rect)),
    characters:chars,
    contact:contacts,
    reserved,
    attention,
    flow
  };
}

function matchPage(expectedPage,observedPages,index){
  return observedPages.find(p=>p.id===expectedPage.id)||observedPages[index]||null;
}

function matchPanel(expectedPanel,observedPanels,index){
  return observedPanels.find(p=>p.id===expectedPanel.id)
    ||observedPanels.find(p=>p.order===expectedPanel.order)
    ||observedPanels[index]
    ||null;
}

export function evaluateBlueprint(expected,observed,{pageIds=null}={}){
  const wanted=pageIds?.length?new Set(pageIds):null;
  const selected=(expected.pages||[]).map((page,index)=>({page,index})).filter(x=>!wanted||wanted.has(x.page.id));
  const observedPages=observed.pages||[];
  const pages=selected.map(({page:ep,index:pi})=>{
    const op=matchPage(ep,observedPages,pi);
    if(!op)return{page:ep.pageNumber||pi+1,pageId:ep.id,score:0,panels:[]};
    const observedPanels=op.panels||[];
    const panels=(ep.panels||[]).map((p,i)=>panelScore(
      p,
      matchPanel(p,observedPanels,i)||{rect:{x:0,y:0,w:0,h:0},characters:[]}
    ));
    const values=panels.flatMap(p=>[
      p.panelIoU,
      p.centerDrift,
      ...p.characters.flatMap(c=>[c.position,c.scale,c.occupancy,c.pose]),
      p.contact,
      p.reserved,
      p.attention,
      p.flow
    ].filter(v=>v!=null));
    return{
      page:ep.pageNumber||pi+1,
      pageId:ep.id,
      score:values.length?values.reduce((a,b)=>a+b,0)/values.length:0,
      panels
    };
  });
  const score=pages.length?pages.reduce((a,b)=>a+b.score,0)/pages.length:0;
  const result={
    version:2,
    score,
    pages,
    thresholds:{good:.85,review:.65},
    verdict:score>=.85?'good':score>=.65?'review':'drift'
  };
  if(wanted)result.scope={pageIds:[...wanted]};
  return result;
}

export function observationFromProject(project){return structuredClone(project)}

export function createEvaluationReport(expected,observed,{source='observation-json',pageIds=null}={}){
  return{
    schema:'manga-blueprint-evaluation/2',
    createdAt:new Date().toISOString(),
    source,
    result:evaluateBlueprint(expected,observed,{pageIds})
  };
}
