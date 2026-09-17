// Layered renderer: one solved geometry source, two views.
// art = generation-facing black spatial contract; annotations = human-review metadata only.
const esc=(s='')=>String(s).replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]);
const points=(p)=>p.shape?.points?.length===4?p.shape.points.map(q=>`${q.x},${q.y}`).join(' '):`${p.rect.x},${p.rect.y} ${p.rect.x+p.rect.w},${p.rect.y} ${p.rect.x+p.rect.w},${p.rect.y+p.rect.h} ${p.rect.x},${p.rect.y+p.rect.h}`;
const center=(r)=>({x:r.x+r.w/2,y:r.y+r.h/2});
const line=(a,b,w=7)=>`<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="black" stroke-width="${w}" stroke-linecap="round"/>`;
function solvedFigure(c){
  const rp=c.renderPose,j=rp?.joints;
  if(!j)return'';
  const s=c.scale||1, headR=24*s;
  const limbs=[line(j.neck,j.chest),line(j.chest,j.hip),line(j.chest,j.leftHand),line(j.chest,j.rightHand),line(j.hip,j.leftFoot),line(j.hip,j.rightFoot)].join('');
  const props=(rp.props||[]).map(p=>p.kind==='sword'?`${line(p.base,p.tip,8)}<line x1="${p.base.x-10}" y1="${p.base.y}" x2="${p.base.x+10}" y2="${p.base.y}" stroke="black" stroke-width="6"/>`:'').join('');
  return `<g class="figure" fill="white">${limbs}<circle cx="${j.head.x}" cy="${j.head.y}" r="${headR}" stroke="black" stroke-width="7"/>${props}</g>`;
}
function bubble(b){return `<ellipse cx="${b.x}" cy="${b.y}" rx="${Math.max(34,b.size*.55)}" ry="${Math.max(44,b.size*.72)}" fill="white" stroke="black" stroke-width="6"/>`;}
function flowArrow(p){const a=center(p.rect),f=p.flow||{};if(!f.entry&&!f.exit)return'';const dx=/left/i.test(f.exit)?-90:/right/i.test(f.exit)?90:0,dy=/top/i.test(f.exit)?-70:/bottom|down/i.test(f.exit)?70:55;return `<path d="M ${a.x-dx*.5} ${a.y-dy*.5} L ${a.x+dx} ${a.y+dy}" stroke="#2563eb" stroke-width="6" fill="none" marker-end="url(#arrowBlue)"/>`;}
function contactMarks(p){return (p.renderContacts||[]).map(c=>`<g><circle cx="${c.x}" cy="${c.y}" r="13" fill="none" stroke="#dc2626" stroke-width="5"/><path d="M ${c.x-18} ${c.y} L ${c.x+18} ${c.y} M ${c.x} ${c.y-18} L ${c.x} ${c.y+18}" stroke="#dc2626" stroke-width="4"/></g>`).join('');}
export function renderExecutableNameSvg(project,pageIndex=0,{annotated=false}={}){
  const page=project.pages[pageIndex],W=project.meta.pageWidth||1200,H=project.meta.pageHeight||1697;
  const art=page.panels.map(p=>`<g id="art-${esc(p.id)}"><polygon points="${points(p)}" fill="white" stroke="black" stroke-width="10"/>${p.characters.map(solvedFigure).join('')}${p.balloons.map(bubble).join('')}</g>`).join('');
  const annotations=page.panels.map((p,i)=>{const r=p.rect,imp=p.importance||{},att=p.attention||{};return `<g id="annotation-${esc(p.id)}" font-family="sans-serif"><text x="${r.x+16}" y="${r.y+28}" font-size="22" fill="#2563eb">P${i+1} E=${Number(imp.energy??.5).toFixed(2)} ${esc(p.camera?.distance||'')}</text><text x="${r.x+16}" y="${r.y+54}" font-size="18" fill="#6b7280">${esc(p.actionIntent||'')}</text>${att.primary?`<text x="${r.x+16}" y="${r.y+78}" font-size="18" fill="#dc2626">PRIMARY: ${esc(att.primary)}</text>`:''}${p.interactions?.map(x=>`<text x="${r.x+16}" y="${r.y+r.h-18}" font-size="18" fill="#dc2626">CONTACT: ${esc(x.intent||'')}</text>`).join('')||''}${flowArrow(p)}${contactMarks(p)}</g>`}).join('');
  const defs=annotated?'<defs><marker id="arrowBlue" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#2563eb"/></marker></defs>':'';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${defs}<rect width="100%" height="100%" fill="white"/><g id="art">${art}</g>${annotated?`<g id="annotations">${annotations}</g>`:''}</svg>`;
}
