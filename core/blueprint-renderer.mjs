// Layered renderer: one geometry source, two views.
// art layer = generation-facing black spatial contract; annotations = human-review metadata.
const esc=(s='')=>String(s).replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]);
const points=(p)=>p.shape?.points?.length===4?p.shape.points.map(q=>`${q.x},${q.y}`).join(' '):`${p.rect.x},${p.rect.y} ${p.rect.x+p.rect.w},${p.rect.y} ${p.rect.x+p.rect.w},${p.rect.y+p.rect.h} ${p.rect.x},${p.rect.y+p.rect.h}`;
const center=(r)=>({x:r.x+r.w/2,y:r.y+r.h/2});
function poseFigure(c){
  const scale=c.scale||1, head=24*scale, torso=70*scale, x=c.x,y=c.y;
  const pose=String(c.poseId||''); const reach=/reach|lunge|slash|attack|forward/i.test(pose), recoil=/recoil|back|off-balance/i.test(pose);
  const lean=reach?-18:recoil?16:0, sx=x+lean*scale, shoulderY=y-torso*.72, handSpread=reach?72:38;
  const dir=/left/i.test(pose)?-1:1;
  return `<g class="figure" stroke="black" stroke-width="7" stroke-linecap="round" fill="white"><circle cx="${sx}" cy="${y-torso-head}" r="${head}"/><line x1="${sx}" y1="${y-torso}" x2="${x}" y2="${y}"/><line x1="${sx}" y1="${shoulderY}" x2="${sx+dir*handSpread*scale}" y2="${shoulderY+28*scale}"/><line x1="${sx}" y1="${shoulderY}" x2="${sx-dir*32*scale}" y2="${shoulderY+35*scale}"/><line x1="${x}" y1="${y}" x2="${x-30*scale}" y2="${y+66*scale}"/><line x1="${x}" y1="${y}" x2="${x+34*scale}" y2="${y+62*scale}"/></g>`;
}
function bubble(b){return `<ellipse cx="${b.x}" cy="${b.y}" rx="${Math.max(34,b.size*.55)}" ry="${Math.max(44,b.size*.72)}" fill="white" stroke="black" stroke-width="6"/>`;}
function flowArrow(p){const a=center(p.rect), f=p.flow||{}; if(!f.entry&&!f.exit)return''; const dx=/left/i.test(f.exit)?-90:/right/i.test(f.exit)?90:0,dy=/top/i.test(f.exit)?-70:/bottom|down/i.test(f.exit)?70:55;return `<path d="M ${a.x-dx*.5} ${a.y-dy*.5} L ${a.x+dx} ${a.y+dy}" stroke="#2563eb" stroke-width="6" fill="none" marker-end="url(#arrowBlue)"/>`;}
export function renderExecutableNameSvg(project,pageIndex=0,{annotated=false}={}){
  const page=project.pages[pageIndex], W=project.meta.pageWidth||1200,H=project.meta.pageHeight||1697;
  const art=page.panels.map(p=>`<g id="art-${esc(p.id)}"><polygon points="${points(p)}" fill="white" stroke="black" stroke-width="10"/>${p.characters.map(poseFigure).join('')}${p.balloons.map(bubble).join('')}</g>`).join('');
  const annotations=page.panels.map((p,i)=>{const r=p.rect, imp=p.importance||{}, att=p.attention||{};return `<g id="annotation-${esc(p.id)}" font-family="sans-serif"><text x="${r.x+16}" y="${r.y+28}" font-size="22" fill="#2563eb">P${i+1} E=${Number(imp.energy??.5).toFixed(2)} ${esc(p.camera?.distance||'')}</text><text x="${r.x+16}" y="${r.y+54}" font-size="18" fill="#6b7280">${esc(p.actionIntent||'')}</text>${att.primary?`<text x="${r.x+16}" y="${r.y+78}" font-size="18" fill="#dc2626">PRIMARY: ${esc(att.primary)}</text>`:''}${p.interactions?.map(x=>`<text x="${r.x+16}" y="${r.y+r.h-18}" font-size="18" fill="#dc2626">CONTACT: ${esc(x.intent||'')}</text>`).join('')||''}${flowArrow(p)}</g>`}).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs><marker id="arrowBlue" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#2563eb"/></marker></defs><rect width="100%" height="100%" fill="white"/><g id="art">${art}</g>${annotated?`<g id="annotations">${annotations}</g>`:''}</svg>`;
}
