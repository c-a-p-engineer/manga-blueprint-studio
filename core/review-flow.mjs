// Human-review-only visual estimate of *intended reading path*, not eye-tracking.
// Numeric panel order remains authoritative; never changes generated art or Clean.
const clamp=(v,lo,hi)=>Math.max(lo,Math.min(hi,v));
const esc=x=>String(x).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const finite=v=>Number.isFinite(Number(v))?Number(v):0;
const point=(x,y)=>({x:Math.round(x*10)/10,y:Math.round(y*10)/10});

function attentionPosition(panel,token){
  const match=String(token||'').match(/^(.+)\.([^.]+)$/);
  if(!match)return null;
  const character=(panel.characters||[]).find(c=>[c.name,c.referenceKey,c.characterId].some(v=>v===match[1]));
  const joints=character?.renderPose?.joints;
  if(!joints)return null;
  const part=match[2].toLowerCase().replace(/[-_ ]/g,'');
  const key=/head|face|目|顔|頭/.test(part)?'head':
    /lefthand|左手/.test(part)?'leftHand':/righthand|右手/.test(part)?'rightHand':
    /chest|torso|body/.test(part)?'chest':null;
  const resolved=key&&joints[key];
  return resolved&&Number.isFinite(resolved.x)&&Number.isFinite(resolved.y)?point(resolved.x,resolved.y):null;
}

export function buildReaderFlowPlan(project,pageIndex=0){
  const page=project?.pages?.[pageIndex];
  if(!page)throw new Error('Reader flow: missing page index '+pageIndex);
  const rtl=project?.meta?.readingDirection!=='ltr';
  const sorted=[...(page.panels||[])].sort((a,b)=>finite(a.order)-finite(b.order));
  const nodes=sorted.map(p=>{
    const r=p.rect,margin=Math.min(24,r.w*.08,r.h*.08);
    const y=r.y+clamp(r.h*.72,margin,r.h-margin);
    const start=point(r.x+r.w*(rtl?.80:.20),y);
    const end=point(r.x+r.w*(rtl?.20:.80),y);
    const rawFocus=attentionPosition(p,p.attention?.primary);
    const focus=rawFocus&&rawFocus.x>=r.x+margin&&rawFocus.x<=r.x+r.w-margin&&rawFocus.y>=r.y+margin&&rawFocus.y<=r.y+r.h-margin?rawFocus:null;
    return{pageNumber:page.pageNumber||pageIndex+1,panelId:p.id,order:p.order,start,end,focus,source:focus?'canonical-attention':'geometry-order-heuristic'};
  });
  return{schema:'manga-reader-flow-plan/1',role:'human-review-estimate',readingDirection:rtl?'rtl':'ltr',nodes,
    links:nodes.slice(1).map((node,i)=>({from:nodes[i].order,to:node.order,source:nodes[i].end,target:node.start}))};
}

export function renderReaderFlowOverlaySvg(project,pageIndex=0,{detail='annotated'}={}){
  const plan=buildReaderFlowPlan(project,pageIndex),full=detail==='full';
  if(!plan.nodes.length)return'';
  const arrowId='reader-flow-arrow';
  const defs='<defs><marker id="'+arrowId+'" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0L7 3.5L0 7Z" fill="#0891b2"/></marker></defs>';
  const parts=[];
  for(const node of plan.nodes){
    const via=node.focus||point((node.start.x+node.end.x)/2,node.start.y);
    const paths=[
      ['M',node.start.x,node.start.y,'Q',via.x,via.y,node.end.x,node.end.y].join(' ')
    ];
    parts.push('<g data-reader-flow-panel="'+esc(node.order)+'" data-reader-flow-source="'+esc(node.source)+'">'+
      '<path d="'+paths[0]+'" fill="none" stroke="#0891b2" stroke-width="'+(full?5:3)+'" stroke-opacity="'+(full?.85:.58)+'" stroke-dasharray="10 7" marker-end="url(#'+arrowId+')"/>'+
      '<circle cx="'+node.start.x+'" cy="'+node.start.y+'" r="'+(full?15:12)+'" fill="#fff" fill-opacity=".92" stroke="#0891b2" stroke-width="3"/>'+
      '<text x="'+node.start.x+'" y="'+(node.start.y+5)+'" text-anchor="middle" font-family="sans-serif" font-size="13" font-weight="bold" fill="#075985">'+esc(node.order)+'</text>'+
      (full&&node.focus?'<circle cx="'+node.focus.x+'" cy="'+node.focus.y+'" r="10" fill="none" stroke="#0891b2" stroke-width="2"/>':'')+'</g>');
  }
  for(const link of plan.links){
    const dx=link.target.x-link.source.x,dy=link.target.y-link.source.y;
    const path=Math.abs(dy)>55
      ?'M '+link.source.x+' '+link.source.y+' C '+link.source.x+' '+(link.source.y+dy*.48)+' '+link.target.x+' '+(link.target.y-dy*.48)+' '+link.target.x+' '+link.target.y
      :'M '+link.source.x+' '+link.source.y+' L '+link.target.x+' '+link.target.y;
    parts.push('<path data-reader-flow-transition="'+esc(link.from)+'-'+esc(link.to)+'" d="'+path+'" fill="none" stroke="#0891b2" stroke-opacity="'+(full?.84:.5)+'" stroke-width="'+(full?5:3)+'" stroke-dasharray="8 8" marker-end="url(#'+arrowId+')"/>');
  }
  return'<g id="reader-flow-guides" data-review="reader-flow" data-estimate="not-eye-tracking">'+defs+parts.join('')+'</g>';
}
