// Deterministic lettering v1: exact authored strings -> glyph-position plan + transparent SVG overlay.
const esc=(s='')=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]);
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const chars=text=>Array.from(String(text??''));

function effectiveMode(project,value){
  return value&&value!=='inherit'?value:(project.meta?.defaultWritingMode||'vertical-rl');
}

function balloonRegion(balloon,panel){
  const initial={x:balloon.x-Math.max(34,balloon.size*.55),y:balloon.y-Math.max(44,balloon.size*.72),w:Math.max(68,balloon.size*1.1),h:Math.max(88,balloon.size*1.44)};
  const rect=panel.rect,pad=8;
  const x1=Math.max(initial.x,rect.x+pad),y1=Math.max(initial.y,rect.y+pad);
  const x2=Math.min(initial.x+initial.w,rect.x+rect.w-pad),y2=Math.min(initial.y+initial.h,rect.y+rect.h-pad);
  // No fabricated expansion of a balloon across a panel boundary.
  return{x:x1,y:y1,w:Math.max(0,x2-x1),h:Math.max(0,y2-y1)};
}

function fittingFont(text,region,mode,preferred){
  const n=chars(text).length;
  if(!n||region.w<18||region.h<18)return 0;
  for(let f=Math.min(preferred,36);f>=9;f-=1){
    if(mode==='vertical-rl'){
      const perColumn=Math.max(1,Math.floor((region.h-f-6)/(f*1.12))+1);
      const columns=Math.ceil(n/perColumn);
      if(f+(perColumn-1)*f*1.12+4<=region.h && (columns-.5)*f*1.12+8<=region.w)return f;
    }else{
      const perLine=Math.max(1,Math.floor((region.w-f-8)/(f*.98))+1);
      const lines=Math.ceil(n/perLine);
      if(f+(lines-1)*f*1.25+5<=region.h)return f;
    }
  }
  return 0;
}

function verticalGlyphs(text,region,fontSize){
  const glyphs=[],all=chars(text),step=fontSize*1.12,perColumn=Math.max(1,Math.floor((region.h-fontSize-6)/step)+1);
  const columnStep=fontSize*1.12;
  for(let i=0;i<all.length;i++){
    const column=Math.floor(i/perColumn),row=i%perColumn;
    glyphs.push({char:all[i],x:region.x+region.w-fontSize*.65-column*columnStep,y:region.y+fontSize+2+row*step});
  }
  return glyphs;
}

function horizontalGlyphs(text,region,fontSize){
  const glyphs=[],all=chars(text),step=fontSize*.98,perLine=Math.max(1,Math.floor((region.w-fontSize-8)/step)+1),lineStep=fontSize*1.25;
  for(let i=0;i<all.length;i++){
    const row=Math.floor(i/perLine),col=i%perLine;
    glyphs.push({char:all[i],x:region.x+fontSize*.6+col*step,y:region.y+fontSize+2+row*lineStep});
  }
  return glyphs;
}

function entry(text,writingMode,region,kind,sourceId,preferredFontSize){
  const fontSize=fittingFont(text,region,writingMode,preferredFontSize);
  const glyphs=fontSize?(writingMode==='vertical-rl'?verticalGlyphs(text,region,fontSize):horizontalGlyphs(text,region,fontSize)):[];
  return{kind,sourceId,text:String(text),writingMode,region,glyphs,fontSize,fit:fontSize?'fitted':'unplaceable'};
}

export function buildLetteringPlan(project,pageIndex=0){
  const page=project.pages?.[pageIndex];
  if(!page)throw new Error(`Unknown page index ${pageIndex}`);
  const entries=[];
  for(const panel of[...(page.panels||[])].sort((a,b)=>(a.order||0)-(b.order||0))){
    for(const balloon of panel.balloons||[]){
      if(!String(balloon.text||''))continue;
      const region=balloonRegion(balloon,panel),fontSize=clamp(Number(balloon.size||80)*.24,16,36);
      entries.push({...entry(balloon.text,effectiveMode(project,balloon.writingMode),region,'dialogue',balloon.id,fontSize),panelId:panel.id});
    }
    if(String(panel.effects?.sfxText||'')){
      const r=panel.rect,fontSize=clamp(Math.min(r.w,r.h)*.08,22,54);
      const region={x:r.x+r.w*.16,y:r.y+r.h*.55,w:r.w*.68,h:r.h*.34};
      entries.push({...entry(panel.effects.sfxText,effectiveMode(project,panel.effects.sfxWritingMode),region,'sfx',`${panel.id}:sfx`,fontSize),panelId:panel.id});
    }
  }
  return{
    schema:'manga-blueprint-lettering-plan/1',
    pageId:page.id,
    strategy:project.meta?.letteringStrategy||'overlay-preferred',
    entries
  };
}

export function renderLetteringOverlaySvg(project,pageIndex=0){
  const plan=buildLetteringPlan(project,pageIndex),W=project.meta?.pageWidth||1200,H=project.meta?.pageHeight||1697;
  const clips=(project.pages?.[pageIndex]?.panels||[]).map(p=>`<clipPath id="letter-clip-${esc(p.id)}"><rect x="${p.rect.x}" y="${p.rect.y}" width="${p.rect.w}" height="${p.rect.h}"/></clipPath>`).join('');
  const body=plan.entries.map((item)=>{
    const glyphs=item.glyphs.map((g,i)=>`<text data-glyph-index="${i}" x="${g.x}" y="${g.y}" text-anchor="middle" font-family="sans-serif" font-size="${item.fontSize}" fill="black">${esc(g.char)}</text>`).join('');
    return`<g data-lettering-kind="${esc(item.kind)}" data-source-id="${esc(item.sourceId)}" data-text="${esc(item.text)}" data-writing-mode="${esc(item.writingMode)}" clip-path="url(#letter-clip-${esc(item.panelId)})">${glyphs}</g>`;
  }).join('');
  return`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs>${clips}</defs><g id="deterministic-lettering">${body}</g></svg>`;
}
