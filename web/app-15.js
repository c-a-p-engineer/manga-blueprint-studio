// Prototype 0.10: balloon writing direction. Project default is vertical Japanese (vertical-rl), with per-balloon override.
Object.assign(i18n.ja,{
  textWritingHeading:'文字の向き',
  defaultWritingMode:'吹き出しの既定',
  balloonWritingMode:'この吹き出しの文字方向',
  writingInherit:'既定を使う',
  writingVertical:'縦書き',
  writingHorizontal:'横書き',
  writingHelp:'日本漫画向けに縦書きを既定にしています。吹き出しごとに横書きへ変更できます。ページの右→左/左→右の読み順とは別設定です。'
});
Object.assign(i18n.en,{
  textWritingHeading:'Writing direction',
  defaultWritingMode:'Balloon default',
  balloonWritingMode:'This balloon writing direction',
  writingInherit:'Use default',
  writingVertical:'Vertical',
  writingHorizontal:'Horizontal',
  writingHelp:'Vertical Japanese writing is the default. Each balloon can override it to horizontal. This is separate from page RTL/LTR reading order.'
});

const defaultWritingMode15=()=>project?.meta?.defaultWritingMode||'vertical-rl';
function ensureWritingState15(target=project){
  if(!target?.meta)return target;
  if(!['vertical-rl','horizontal-tb'].includes(target.meta.defaultWritingMode))target.meta.defaultWritingMode='vertical-rl';
  for(const page of target.pages||[])for(const panel of page.panels||[])for(const b of panel.balloons||[]){
    if(!['inherit','vertical-rl','horizontal-tb'].includes(b.writingMode))b.writingMode='inherit';
  }
  return target;
}
function effectiveWritingMode15(b){
  return b?.writingMode&&b.writingMode!=='inherit'?b.writingMode:defaultWritingMode15();
}
function writingLabel15(mode){
  const actual=mode==='inherit'?defaultWritingMode15():mode;
  const base=actual==='horizontal-tb'?t('writingHorizontal'):t('writingVertical');
  return mode==='inherit'?`${t('writingInherit')}（${base}）`:base;
}

const normalizeProjectBase15=normalizeProject;
normalizeProject=function(input){return ensureWritingState15(normalizeProjectBase15(input));};
ensureWritingState15(project);

function wrapChars15(text,maxChars){
  const lines=[];
  for(const raw of String(text||'').split(/\n/)){
    if(!raw){lines.push('');continue;}
    for(let i=0;i<raw.length;i+=maxChars)lines.push(raw.slice(i,i+maxChars));
  }
  return lines.length?lines:[''];
}
function horizontalBalloonText15(b,w,h){
  const font=Math.max(12,Math.min(17,14*b.size));
  const maxChars=Math.max(4,Math.floor((w-18)/(font*.92)));
  const lines=wrapChars15(b.text,maxChars).slice(0,4);
  const lineH=font*1.25,total=(lines.length-1)*lineH;
  return `<text class="balloon-text authoring-text" text-anchor="middle" font-size="${font}">${lines.map((line,i)=>`<tspan x="${b.x}" y="${b.y-total/2+i*lineH}">${escapeXml(line)}</tspan>`).join('')}</text>`;
}
function verticalBalloonText15(b,w,h){
  const font=Math.max(12,Math.min(17,14*b.size));
  const step=font*1.18;
  const maxRows=Math.max(3,Math.floor((h-16)/step));
  const source=String(b.text||'').split(/\n/);
  const columns=[];
  for(const raw of source){
    if(!raw){columns.push('');continue;}
    for(let i=0;i<raw.length;i+=maxRows)columns.push(raw.slice(i,i+maxRows));
  }
  const shown=columns.slice(0,Math.max(1,Math.floor((w-14)/(font*1.2))));
  const colStep=font*1.25;
  const startX=b.x+(shown.length-1)*colStep/2;
  return `<g class="balloon-text authoring-text">${shown.map((col,ci)=>{
    const chars=[...col],total=(chars.length-1)*step;
    return `<text text-anchor="middle" font-size="${font}">${chars.map((ch,ri)=>`<tspan x="${startX-ci*colStep}" y="${b.y-total/2+ri*step}">${escapeXml(ch)}</tspan>`).join('')}</text>`;
  }).join('')}</g>`;
}

balloonSvg=function(b,annotated=true){
  const p=selectedPanel();if(!p)return '';
  const w=120*b.size,h=(b.type==='narration'?70:85)*b.size;
  const cls=`balloon ${b.type} ${b.id===selectedBalloonId?'balloon-selected':''}`;
  const shape=b.type==='narration'
    ? `<rect class="${cls}" x="${b.x-w/2}" y="${b.y-h/2}" width="${w}" height="${h}" rx="6"/>`
    : `<ellipse class="${cls}" cx="${b.x}" cy="${b.y}" rx="${w/2}" ry="${h/2}"/>`;
  let text='';
  if(annotated&&b.text){
    text=effectiveWritingMode15(b)==='horizontal-tb'?horizontalBalloonText15(b,w,h):verticalBalloonText15(b,w,h);
  }
  return `<g data-balloon-id="${escapeXml(b.id)}">${shape}${text}</g>`;
};

function ensureWritingUi15(){
  const textPanel=document.querySelector('.tool-panel[data-section="text"]');if(!textPanel)return;
  if(!$('writingControls15')){
    const block=document.createElement('div');block.id='writingControls15';block.innerHTML=`
      <div class="subhead" data-i18n="textWritingHeading">文字の向き</div>
      <label><span data-i18n="defaultWritingMode">吹き出しの既定</span>
        <select id="defaultWritingMode15"><option value="vertical-rl"></option><option value="horizontal-tb"></option></select>
      </label>
      <p class="help" data-i18n="writingHelp"></p>`;
    const title=textPanel.querySelector('.section-title-row');title?.insertAdjacentElement('afterend',block);
    $('defaultWritingMode15')?.addEventListener('change',e=>mutate(()=>{project.meta.defaultWritingMode=e.target.value;}));
  }
  const inspector=$('balloonInspector');
  if(inspector&&!$('balloonWritingMode15')){
    const label=document.createElement('label');label.id='balloonWritingModeWrap15';label.innerHTML=`<span data-i18n="balloonWritingMode">この吹き出しの文字方向</span><select id="balloonWritingMode15"><option value="inherit"></option><option value="vertical-rl"></option><option value="horizontal-tb"></option></select>`;
    const textArea=$('balloonText')?.closest('label');textArea?.insertAdjacentElement('afterend',label);
    $('balloonWritingMode15')?.addEventListener('change',e=>{const b=selectedBalloon();if(b)mutate(()=>{b.writingMode=e.target.value;});});
  }
}
function localizeWritingUi15(){
  ensureWritingUi15();
  document.querySelectorAll('#writingControls15 [data-i18n],#balloonWritingModeWrap15 [data-i18n]').forEach(el=>el.textContent=t(el.dataset.i18n));
  const d=$('defaultWritingMode15');if(d){d.options[0].textContent=t('writingVertical');d.options[1].textContent=t('writingHorizontal');}
  const b=$('balloonWritingMode15');if(b){b.options[0].textContent=writingLabel15('inherit');b.options[1].textContent=t('writingVertical');b.options[2].textContent=t('writingHorizontal');}
}

const renderUiBase15=renderUi;
renderUi=function(){
  ensureWritingState15(project);
  renderUiBase15();
  localizeWritingUi15();
  const d=$('defaultWritingMode15');if(d)d.value=defaultWritingMode15();
  const b=selectedBalloon(),select=$('balloonWritingMode15');if(select){select.disabled=!b;select.value=b?.writingMode||'inherit';}
  const p=selectedPanel();
  if(p){
    const buttons=$('balloonList')?.querySelectorAll('[data-list-balloon]')||[];
    buttons.forEach(btn=>{const item=p.balloons.find(x=>x.id===btn.dataset.listBalloon);if(item){const short=item.text||'(empty)';btn.textContent=`${item.type} / ${writingLabel15(item.writingMode||'inherit')} — ${short}`;}});
  }
};

const compilePromptBase15=compilePrompt;
compilePrompt=function(){
  ensureWritingState15(project);
  const base=compilePromptBase15();
  const panels=[...currentPage().panels].sort((a,b)=>a.order-b.order);
  const items=[];
  for(const p of panels)for(const b of p.balloons){
    if(!String(b.text||'').trim())continue;
    const mode=effectiveWritingMode15(b);
    items.push(`- Panel ${p.order} balloon (${b.type}): ${mode==='vertical-rl'?'vertical Japanese writing, top-to-bottom with columns ordered right-to-left':'horizontal writing, left-to-right within the balloon'}.`);
  }
  const section=[
    'LETTERING DIRECTION:',
    `- Default balloon writing mode: ${defaultWritingMode15()==='vertical-rl'?'vertical-rl (vertical Japanese; top-to-bottom, columns right-to-left)':'horizontal-tb (horizontal text)'}.`,
    ...(items.length?items:['- No non-empty balloon text on this page.']),
    '- Writing direction controls lettering layout only; it does not change panel reading order.'
  ].join('\n');
  return base.includes('TEXT TO RENDER:')?base.replace('TEXT TO RENDER:',`${section}\n\nTEXT TO RENDER:`):`${base}\n\n${section}`;
};

function letteringManifest15(){
  const balloons=[];
  for(const p of [...currentPage().panels].sort((a,b)=>a.order-b.order))for(const b of p.balloons||[]){
    balloons.push({panelId:p.id,order:p.order,balloonId:b.id,type:b.type,writingMode:b.writingMode||'inherit',effectiveWritingMode:effectiveWritingMode15(b)});
  }
  return {defaultWritingMode:defaultWritingMode15(),balloons};
}
if(typeof exportManifest08==='function'){
  const exportManifestBase15=exportManifest08;
  exportManifest08=function(identity,packageType,files){
    ensureWritingState15(project);
    const manifest=exportManifestBase15(identity,packageType,files);
    manifest.lettering=letteringManifest15();
    manifest.readingDirection=project.meta.readingDirection||'rtl';
    manifest.panelOrder=[...currentPage().panels].sort((a,b)=>a.order-b.order).map(p=>({panelId:p.id,order:p.order}));
    return manifest;
  };
}

ensureWritingUi15();
localizeWritingUi15();
$('languageSelect')?.addEventListener('change',()=>queueMicrotask(()=>{localizeWritingUi15();render();}));
render();