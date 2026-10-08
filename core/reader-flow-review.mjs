// Human-review guidance, NOT a measured eye-tracking trajectory.
// Panel order/geometry are canonical; inferred anchor positions are illustrative.
const esc=v=>String(v??'').replace(/[&<>"]/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch]));
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const good=n=>typeof n==='number'&&Number.isFinite(n);
export function plannedReaderPath(page,{readingDirection='rtl'}={}){
  const ordered=[...(page?.panels||[])].filter(p=>p?.rect).sort((a,b)=>(a.order||0)-(b.order||0));
  const side=readingDirection==='ltr'?.32:.68;
  return ordered.map((p,i)=>{
    const r=p.rect;
    const anchor={x:r.x+r.w*side,y:r.y+r.h*.50};
    return{panelId:p.id,order:p.order||i+1,x:anchor.x,y:anchor.y};
  }).filter(v=>good(v.x)&&good(v.y));
}
export function renderPlannedReaderPath(page,{readingDirection='rtl',fullReview=false}={}){
  const nodes=plannedReaderPath(page,{readingDirection});
  if(!nodes.length)return'';
  const stroke='#b453ac',emphasis=fullReview?0.80:0.60;
  const segments=nodes.slice(0,-1).map((from,i)=>{
    const to=nodes[i+1],dx=to.x-from.x,dy=to.y-from.y;
    if(Math.hypot(dx,dy)<14)return'';
    const a=Math.atan2(dy,dx),margin=23;
    const start={x:from.x+margin*Math.cos(a),y:from.y+margin*Math.sin(a)};
    const end={x:to.x-margin*Math.cos(a),y:to.y-margin*Math.sin(a)};
    const mid={x:(start.x+end.x)/2,y:(start.y+end.y)/2};
    // Mild bend distinguishes planned reading from pose/contact geometry.
    const off=clamp(Math.hypot(dx,dy)*.045,4,22);
    const cx=mid.x+Math.sin(a)*off,cy=mid.y-Math.cos(a)*off;
    return '<path data-review="reading-path-segment" data-from="'+esc(from.order)+'" data-to="'+esc(to.order)+
      '" d="M '+start.x.toFixed(1)+' '+start.y.toFixed(1)+' Q '+cx.toFixed(1)+' '+cy.toFixed(1)+' '+end.x.toFixed(1)+' '+end.y.toFixed(1)+
      '" fill="none" stroke="'+stroke+'" stroke-width="'+(fullReview?4:3)+'" stroke-opacity="'+emphasis+
      '" stroke-dasharray="9 9" marker-end="url(#arrow-reader-review)"/>';
  }).join('');
  const marks=nodes.map(v=>'<g data-review="reading-step" data-order="'+esc(v.order)+'"><circle cx="'+v.x+'" cy="'+v.y+
    '" r="17" fill="white" fill-opacity=".86" stroke="'+stroke+'" stroke-width="2"/><text x="'+v.x+'" y="'+(v.y+5)+
    '" text-anchor="middle" font-size="15" font-family="sans-serif" font-weight="bold" fill="'+stroke+'">'+esc(v.order)+'</text></g>').join('');
  return '<g id="planned-reader-path" data-review="reading-path" data-reading-direction="'+esc(readingDirection)+
    '" data-flow-kind="planned-not-measured" pointer-events="none">'+segments+marks+'</g>';
}
