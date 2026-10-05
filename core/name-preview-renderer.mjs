const esc=(s='')=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]);
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const points=p=>p.shape?.points?.length===4?p.shape.points.map(q=>`${q.x},${q.y}`).join(' '):`${p.rect.x},${p.rect.y} ${p.rect.x+p.rect.w},${p.rect.y} ${p.rect.x+p.rect.w},${p.rect.y+p.rect.h} ${p.rect.x},${p.rect.y+p.rect.h}`;
const lower=v=>String(v||'').trim().toLowerCase();

function line(a,b,w=6){return `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="black" stroke-width="${w}" stroke-linecap="round"/>`;}
function figure(c){
  const r=c.renderPose,j=r?.joints;if(!j)return'';const s=c.scale||1;
  const seg=[['neck','chest'],['chest','hip'],['leftShoulder','leftElbow'],['leftElbow','leftHand'],['rightShoulder','rightElbow'],['rightElbow','rightHand'],['hip','leftKnee'],['leftKnee','leftFoot'],['hip','rightKnee'],['rightKnee','rightFoot']].map(([a,b])=>j[a]&&j[b]?line(j[a],j[b],Math.max(4,7*s)):'').join('');
  const mass=`<ellipse cx="${j.chest.x}" cy="${(j.chest.y+j.hip.y)/2}" rx="${Math.max(18,24*s)}" ry="${Math.max(30,38*s)}" fill="white" stroke="black" stroke-width="${Math.max(4,6*s)}"/>`;
  const props=(r.props||[]).map(p=>p.kind==='shield'?`<circle cx="${p.base.x}" cy="${p.base.y}" r="${p.radius||36}" fill="white" stroke="black" stroke-width="6"/>`:p.kind==='phone'?`<rect x="${p.base.x-8}" y="${p.base.y-15}" width="16" height="30" rx="3" fill="white" stroke="black" stroke-width="4"/>`:p.kind==='bag'?`<rect x="${p.base.x-20}" y="${p.base.y}" width="40" height="34" rx="6" fill="white" stroke="black" stroke-width="5"/>`:line(p.base,p.tip,p.kind==='staff'?8:6)).join('');
  return `<g class="name-figure">${mass}${seg}<circle cx="${j.head.x}" cy="${j.head.y}" r="${22*s}" fill="white" stroke="black" stroke-width="${Math.max(4,6*s)}"/>${props}</g>`;
}

function balloonMetrics(balloon){
  const size=Number(balloon.size)||80;
  return {rx:Math.max(40,size*.62),ry:Math.max(52,size*.84),fontSize:clamp(size*.18,18,28)};
}
function previewBalloon(panel,balloon,m){
  const r=panel.rect,pad=12,maxRx=Math.max(24,(r.w-pad*2)/2),maxRy=Math.max(32,(r.h-pad*2)/2),scale=Math.min(1,maxRx/m.rx,maxRy/m.ry);
  const metrics={...m,rx:m.rx*scale,ry:m.ry*scale};
  const minX=r.x+metrics.rx+pad,maxX=r.x+r.w-metrics.rx-pad,minY=r.y+metrics.ry+pad,maxY=r.y+r.h-metrics.ry-pad;
  return {balloon:{...balloon,x:minX<=maxX?clamp(balloon.x,minX,maxX):r.x+r.w/2,y:minY<=maxY?clamp(balloon.y,minY,maxY):r.y+r.h/2},metrics};
}
function speakerPoint(panel,balloon){
  const speaker=(panel.characters||[]).find(c=>c.characterId===balloon.speakerId);
  return speaker?.renderPose?.joints?.head||speaker?.renderPose?.joints?.chest||(speaker?{x:speaker.x,y:speaker.y-90*(speaker.scale||1)}:null);
}
function panelEdgePoint(panel,balloon){
  const r=panel.rect,cx=r.x+r.w/2,cy=r.y+r.h/2,dx=balloon.x-cx,dy=balloon.y-cy;
  if(Math.abs(dx)>=Math.abs(dy))return{x:dx>=0?r.x+r.w:r.x,y:clamp(balloon.y,r.y+18,r.y+r.h-18)};
  return{x:clamp(balloon.x,r.x+18,r.x+r.w-18),y:dy>=0?r.y+r.h:r.y};
}
function boundaryToward(balloon,target,m){
  const dx=target.x-balloon.x,dy=target.y-balloon.y||.0001,d=Math.hypot(dx,dy)||1,ux=dx/d,uy=dy/d;
  const t=1/Math.sqrt((ux*ux)/(m.rx*m.rx)+(uy*uy)/(m.ry*m.ry));
  return {x:balloon.x+ux*t,y:balloon.y+uy*t,ux,uy,d};
}
function speechTail(balloon,target,m){
  if(!target)return'';const p=boundaryToward(balloon,target,m),tipDist=Math.min(62,Math.max(28,p.d*.34)),tip={x:p.x+p.ux*tipDist,y:p.y+p.uy*tipDist},px=-p.uy,py=p.ux,w=9;
  const a={x:p.x+px*w,y:p.y+py*w},b={x:p.x-px*w,y:p.y-py*w};
  return `<path d="M ${a.x} ${a.y} L ${tip.x} ${tip.y} L ${b.x} ${b.y} Z" fill="white" stroke="black" stroke-width="4" stroke-linejoin="round"/>`;
}
function thoughtTail(balloon,target,m){
  if(!target)return'';const p=boundaryToward(balloon,target,m),pts=[.18,.34,.50].map((f,i)=>({x:p.x+p.ux*(26+i*17),y:p.y+p.uy*(26+i*17),r:7-i*1.5}));
  return pts.map(q=>`<circle cx="${q.x}" cy="${q.y}" r="${q.r}" fill="white" stroke="black" stroke-width="3"/>`).join('');
}
function shoutPolygon(balloon,m){
  const pts=[];for(let i=0;i<28;i++){const a=-Math.PI/2+i*Math.PI*2/28,outer=i%2===0?1:0.84,rx=m.rx*outer,ry=m.ry*outer;pts.push(`${balloon.x+Math.cos(a)*rx},${balloon.y+Math.sin(a)*ry}`);}return pts.join(' ');
}
function outline(panel,balloon,m){
  const type=lower(balloon.type)||'speech';
  const speaker=speakerPoint(panel,balloon),target=type==='offscreen'?panelEdgePoint(panel,balloon):speaker;
  if(type==='narration')return `<rect x="${balloon.x-m.rx}" y="${balloon.y-m.ry}" width="${m.rx*2}" height="${m.ry*2}" rx="8" fill="white" stroke="black" stroke-width="4"/>`;
  if(type==='shout')return `<polygon points="${shoutPolygon(balloon,m)}" fill="white" stroke="black" stroke-width="5" stroke-linejoin="round"/>${speechTail(balloon,target,m)}`;
  if(type==='thought')return `<ellipse cx="${balloon.x}" cy="${balloon.y}" rx="${m.rx}" ry="${m.ry}" fill="white" stroke="black" stroke-width="4"/>${thoughtTail(balloon,target,m)}`;
  if(type==='whisper')return `<ellipse cx="${balloon.x}" cy="${balloon.y}" rx="${m.rx}" ry="${m.ry}" fill="white" stroke="#555" stroke-width="3" stroke-dasharray="7 6"/>${speechTail(balloon,target,m)}`;
  return `<ellipse cx="${balloon.x}" cy="${balloon.y}" rx="${m.rx}" ry="${m.ry}" fill="white" stroke="black" stroke-width="4"/>${speechTail(balloon,target,m)}`;
}
function splitChars(text){return Array.from(String(text||'').replace(/\r?\n/g,''));}
function verticalText(project,balloon,m){
  const chars=splitChars(balloon.text),lineH=m.fontSize*1.08,maxPerCol=Math.max(1,Math.floor((m.ry*2-28)/lineH)),colW=m.fontSize*1.18,maxCols=Math.max(1,Math.floor((m.rx*2-28)/colW)),capacity=maxPerCol*maxCols,cols=[];
  for(let i=0;i<Math.min(chars.length,capacity);i+=maxPerCol)cols.push(chars.slice(i,i+maxPerCol));
  const startX=balloon.x+(cols.length-1)*colW/2,top=balloon.y-(Math.min(maxPerCol,chars.length)*lineH)/2+m.fontSize*.82;
  const body=cols.map((col,ci)=>col.map((ch,ri)=>`<text x="${startX-ci*colW}" y="${top+ri*lineH}" text-anchor="middle" font-size="${m.fontSize}" font-family="sans-serif">${esc(ch)}</text>`).join('')).join('');
  return {body,overflow:chars.length>capacity};
}
function horizontalText(project,balloon,m){
  const chars=splitChars(balloon.text),charW=m.fontSize*.58,maxPerLine=Math.max(1,Math.floor((m.rx*2-30)/charW)),lineH=m.fontSize*1.22,maxLines=Math.max(1,Math.floor((m.ry*2-24)/lineH)),capacity=maxPerLine*maxLines,lines=[];
  for(let i=0;i<Math.min(chars.length,capacity);i+=maxPerLine)lines.push(chars.slice(i,i+maxPerLine).join(''));
  const startY=balloon.y-(lines.length-1)*lineH/2+m.fontSize*.36,body=lines.map((lineText,i)=>`<text x="${balloon.x}" y="${startY+i*lineH}" text-anchor="middle" font-size="${m.fontSize}" font-family="sans-serif">${esc(lineText)}</text>`).join('');
  return {body,overflow:chars.length>capacity};
}
function letteredBalloon(project,panel,sourceBalloon){
  const fitted=previewBalloon(panel,sourceBalloon,balloonMetrics(sourceBalloon)),balloon=fitted.balloon,m=fitted.metrics,mode=balloon.writingMode&&balloon.writingMode!=='inherit'?balloon.writingMode:(project.meta.defaultWritingMode||'vertical-rl'),text=mode==='horizontal-tb'?horizontalText(project,balloon,m):verticalText(project,balloon,m),warn=text.overflow?`<g data-name-warning="balloon-overflow"><rect x="${balloon.x-m.rx}" y="${balloon.y+m.ry-20}" width="${m.rx*2}" height="20" fill="#fff4f4" stroke="#dc2626" stroke-width="1"/><text x="${balloon.x}" y="${balloon.y+m.ry-6}" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#dc2626">文字量超過</text></g>`:'';
  return `<g data-name-balloon="${esc(balloon.type||'speech')}">${outline(panel,balloon,m)}${text.body}${warn}</g>`;
}
function sfx(panel){
  const text=panel.effects?.sfxText;if(!text)return'';const r=panel.rect,x=r.x+Math.max(36,r.w*.12),y=r.y+r.h-Math.max(34,r.h*.09),size=clamp(Math.min(r.w,r.h)*.10,22,54);
  return `<text x="${x}" y="${y}" font-size="${size}" font-weight="800" font-style="italic" font-family="sans-serif" transform="rotate(-8 ${x} ${y})">${esc(text)}</text>`;
}
export function renderNamePreviewSvg(project,pageIndex=0){
  const page=project.pages[pageIndex];if(!page)throw new Error(`Unknown page index: ${pageIndex}`);const W=project.meta.pageWidth||1200,H=project.meta.pageHeight||1697;
  const clips=page.panels.map(p=>`<clipPath id="name-clip-${esc(p.id)}"><polygon points="${points(p)}"/></clipPath>`).join('');
  const art=page.panels.map(p=>`<g clip-path="url(#name-clip-${esc(p.id)})"><polygon points="${points(p)}" fill="white" stroke="black" stroke-width="10"/>${p.characters.map(figure).join('')}${(p.balloons||[]).map(b=>letteredBalloon(project,p,b)).join('')}${sfx(p)}</g>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs>${clips}</defs><rect width="100%" height="100%" fill="white"/>${art}</svg>`;
}
