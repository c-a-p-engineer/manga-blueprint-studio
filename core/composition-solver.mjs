// In-panel Composition Solver v1: derives readable placement/detail without changing panel boundaries.
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const lower=v=>String(v||'').toLowerCase();
const inside=(x,y,r)=>r&&x>=r.x&&x<=r.x+r.w&&y>=r.y&&y<=r.y+r.h;

function balloonRect(b){
  return{x:b.x-Math.max(34,b.size*.55),y:b.y-Math.max(44,b.size*.72),w:Math.max(68,b.size*1.1),h:Math.max(88,b.size*1.44)};
}

function reserved(panel){
  return[...(panel.balloons||[]).map(balloonRect),...(panel.reservedRegions||[])];
}

function xBand(panel,hint='center'){
  const r=panel.rect,pad=Math.min(r.w,r.h)*.06;
  const bands={
    left:[r.x+pad,r.x+r.w*.42],
    right:[r.x+r.w*.58,r.x+r.w-pad],
    center:[r.x+r.w*.34,r.x+r.w*.66],
    foreground:[r.x+r.w*.25,r.x+r.w*.75],
    background:[r.x+r.w*.22,r.x+r.w*.78]
  };
  return bands[hint]||[r.x+pad,r.x+r.w-pad];
}

function targetDetail(panel,c){
  const authored=panel.detailBudget?.characters?.[c.name]||panel.detailBudget?.characters?.[c.referenceKey];
  if(authored)return authored;
  if(/mob|crowd|extra|モブ|群衆|観客/i.test(c.name||c.referenceKey||''))return panel.detailBudget?.crowd||'low';
  const primary=lower(panel.attention?.primary);
  if(primary&&(primary.startsWith(lower(c.name))||primary.startsWith(lower(c.referenceKey))))return'high';
  return c.detailLevel||'medium';
}

function negativeSpace(panel,chars,reservedRegions,readingDirection){
  const r=panel.rect;
  const centers=chars.map(c=>c.x).filter(Number.isFinite);
  const avg=centers.length?centers.reduce((a,b)=>a+b,0)/centers.length:r.x+r.w/2;
  const occupiedRight=avg>=r.x+r.w/2;
  const preferRight=readingDirection==='ltr'?false:true;
  const right=centers.length? !occupiedRight : preferRight;
  const region={x:right?r.x+r.w*.62:r.x+r.w*.06,y:r.y+r.h*.14,w:r.w*.32,h:r.h*.50};
  const collision=reservedRegions.some(q=>!(q.x>region.x+region.w||q.x+q.w<region.x||q.y>region.y+region.h||q.y+q.h<region.y));
  if(collision)region.y=r.y+r.h*.58;
  return region;
}

function attentionPoint(panel,token=''){
  const m=String(token).match(/^(.+).([^.]+)$/);
  if(!m)return null;
  const key=lower(m[1]),part=lower(m[2]).replace(/[-_ ]/g,'');
  const c=(panel.characters||[]).find(x=>lower(x.name)===key||lower(x.referenceKey)===key);
  const j=c?.renderPose?.joints;
  if(!j)return null;
  if(/face|head|顔|頭/.test(part))return j.head;
  if(/righthand|右手/.test(part))return j.rightHand;
  if(/lefthand|左手/.test(part))return j.leftHand;
  if(/rightfoot|右足/.test(part))return j.rightFoot;
  if(/leftfoot|左足/.test(part))return j.leftFoot;
  return j.chest||j.head;
}

export function solvePanelComposition(panel,{readingDirection='rtl'}={}){
  const r=panel.rect,regions=reserved(panel),characters=panel.characters||[];
  for(let i=0;i<characters.length;i++){
    const c=characters[i];
    c.detailLevel=targetDetail(panel,c);
    if(c.placementLocked)continue;
    const hint=c.placementHint||'center',[minX,maxX]=xBand(panel,hint);
    c.x=clamp(Number(c.x)||r.x+r.w/2,minX,maxX);
    const headY=(Number(c.y)||r.y+r.h*.68)-105*(Number(c.scale)||1);
    const collision=regions.find(q=>inside(c.x,headY,q));
    if(collision){
      const left=collision.x-Math.max(26,38*(Number(c.scale)||1));
      const right=collision.x+collision.w+Math.max(26,38*(Number(c.scale)||1));
      const dl=Math.abs(c.x-left),dr=Math.abs(c.x-right);
      c.x=clamp(dl<=dr?left:right,minX,maxX);
    }
  }
  const neg=negativeSpace(panel,characters,regions,readingDirection);
  panel.compositionPlan={
    version:1,
    readingDirection,
    primaryTarget:panel.attention?.primary||'',
    entry:panel.flow?.entry||'auto',
    exit:panel.flow?.exit||'auto',
    negativeSpace:neg,
    reservedRegions:regions.map(x=>({...x})),
    characters:characters.map(c=>({
      characterId:c.characterId,
      placementHint:c.placementHint||'center',
      locked:!!c.placementLocked,
      x:c.x,y:c.y,scale:c.scale,
      detailLevel:c.detailLevel
    }))
  };
  return panel;
}

export function finalizePanelComposition(panel){
  if(!panel.compositionPlan)return panel;
  const focal=attentionPoint(panel,panel.attention?.primary);
  if(focal)panel.compositionPlan.focalPoint={...focal};
  panel.compositionPlan.characters=(panel.characters||[]).map(c=>({
    characterId:c.characterId,
    placementHint:c.placementHint||'center',
    locked:!!c.placementLocked,
    x:c.x,y:c.y,scale:c.scale,
    detailLevel:c.detailLevel,
    occupancy:c.renderPose?.occupancy?{...c.renderPose.occupancy}:null
  }));
  return panel;
}

export function solveProjectComposition(project){
  const readingDirection=project.meta?.readingDirection||'rtl';
  for(const page of project.pages||[])for(const panel of page.panels||[])solvePanelComposition(panel,{readingDirection});
  return project;
}

export function finalizeProjectComposition(project){
  for(const page of project.pages||[])for(const panel of page.panels||[])finalizePanelComposition(panel);
  return project;
}
