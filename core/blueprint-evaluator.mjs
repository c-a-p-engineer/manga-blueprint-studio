// Structural evaluator for comparing intended Executable Name geometry with observed/generated geometry.
const clamp=n=>Math.max(0,Math.min(1,n));
const area=r=>Math.max(0,r.w)*Math.max(0,r.h);
export function rectIoU(a,b){const x1=Math.max(a.x,b.x),y1=Math.max(a.y,b.y),x2=Math.min(a.x+a.w,b.x+b.w),y2=Math.min(a.y+a.h,b.y+b.h),inter=Math.max(0,x2-x1)*Math.max(0,y2-y1),union=area(a)+area(b)-inter;return union?inter/union:0;}
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const diag=r=>Math.max(1,Math.hypot(r.w,r.h));
const center=r=>({x:r.x+r.w/2,y:r.y+r.h/2});
function panelScore(expected,observed){
 const panelIoU=rectIoU(expected.rect,observed.rect);
 const chars=(expected.characters||[]).map(ec=>{
  const oc=(observed.characters||[]).find(c=>c.id===ec.id||c.characterId===ec.characterId||c.name===ec.name);
  if(!oc)return{name:ec.name||ec.id,position:0,scale:0};
  const position=clamp(1-dist({x:ec.x,y:ec.y},{x:oc.x,y:oc.y})/diag(expected.rect));
  const scale=clamp(1-Math.abs((ec.scale||1)-(oc.scale||1))/Math.max(ec.scale||1,oc.scale||1));
  return{name:ec.name||ec.id,position,scale};
 });
 const contacts=(expected.renderContacts||[]).map((e,i)=>{const o=(observed.renderContacts||[])[i];return o?clamp(1-dist(e,o)/diag(expected.rect)):0;});
 return{panelIoU,characters:chars,contact:contacts.length?contacts.reduce((a,b)=>a+b,0)/contacts.length:null,centerDrift:clamp(1-dist(center(expected.rect),center(observed.rect))/diag(expected.rect))};
}
export function evaluateBlueprint(expected,observed){
 const pages=(expected.pages||[]).map((ep,pi)=>{const op=observed.pages?.[pi];if(!op)return{page:pi+1,score:0,panels:[]};const panels=ep.panels.map((p,i)=>panelScore(p,op.panels?.[i]||{rect:{x:0,y:0,w:0,h:0}}));const values=panels.flatMap(p=>[p.panelIoU,p.centerDrift,...p.characters.flatMap(c=>[c.position,c.scale]),...(p.contact==null?[]:[p.contact])]);return{page:pi+1,score:values.length?values.reduce((a,b)=>a+b,0)/values.length:0,panels};});
 const score=pages.length?pages.reduce((a,b)=>a+b.score,0)/pages.length:0;
 return{version:1,score,pages,thresholds:{good:.85,review:.65},verdict:score>=.85?'good':score>=.65?'review':'drift'};
}
