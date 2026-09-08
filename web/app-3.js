function compilePrompt(){
  const panels=[...currentPage().panels].sort((a,b)=>a.order-b.order);
  const lines=[
    'Create a manga page using the attached CLEAN Manga Blueprint PNG as the spatial reference and this text as the semantic contract.',
    '',
    'STRICT TEXT RENDERING RULE:',
    '- Render ONLY exact strings listed under TEXT TO RENDER.',
    '- NEVER render character display names, Character IDs, Character Sheet keys, panel numbers, camera metadata, authoring labels, UI text, or blueprint annotations.',
    '- The clean blueprint intentionally contains no authoring text. Do not invent labels.',
    '- Stick figures are pose/position references only; do not copy stick-figure appearance.',
    '- Character visual identity comes only from the separately attached Character Sheets.',
    '',
    `READING DIRECTION: ${project.meta.readingDirection==='rtl'?'Japanese manga, right-to-left, top-to-bottom.':'left-to-right, top-to-bottom.'}`,
    `PAGE: ${project.meta.title}`,
    ''
  ];
  for(const p of panels){
    lines.push(`PANEL ${p.order} (semantic reference only; do not render the number):`);
    lines.push(`- Narrative role: ${p.role}.`);
    lines.push(`- Frame: border=${p.style.border}, bleed=${p.style.bleed}, breakout=${p.style.breakout}.`);
    lines.push(`- Camera: distance=${p.camera.distance}, angle=${p.camera.angle}, viewpoint=${p.camera.viewpoint}.`);
    if(p.camera.focus)lines.push(`- Composition: ${p.camera.focus}.`);
    if(p.camera.intent)lines.push(`- Dramatic intent: ${p.camera.intent}.`);
    const bg=p.background;
    lines.push(`- Background: location=${bg.location||'unspecified'}, time=${bg.timeOfDay||'unspecified'}, weather=${bg.weather||'unspecified'}, mood=${bg.mood||'unspecified'}, detail=${bg.detailLevel}, treatment=${bg.renderMode}.`);
    if(bg.notes)lines.push(`- Background notes: ${bg.notes}.`);
    if(!p.characters.length) lines.push('- Characters: none.');
    for(const ch of p.characters){
      const pose=posePresets[ch.poseId]||posePresets.stand;
      const sheet=ch.referenceKey?`, character-sheet-key=${ch.referenceKey}`:'';
      lines.push(`- CHARACTER ${ch.characterId}${sheet}: ${pose.description}; expression=${ch.expression.type} intensity=${Number(ch.expression.intensity).toFixed(1)}${ch.expression.notes?` (${ch.expression.notes})`:''}; gaze=${ch.gaze.target}${ch.gaze.notes?` (${ch.gaze.notes})`:''}; approximate placement x=${Math.round(ch.x)}, y=${Math.round(ch.y)}, scale=${Number(ch.scale).toFixed(2)}, rotation=${ch.rotation} degrees.`);
    }
    const e=p.effects;
    lines.push(`- Manga effect: lineEffect=${e.lineEffect}, strength=${e.strength}${e.notes?`; notes=${e.notes}`:''}.`);
    if(p.balloons.length)lines.push(`- Reserve ${p.balloons.length} balloon area(s) at the positions shown in the clean blueprint.`);
    lines.push('');
  }
  const textLines=[];
  for(const p of panels){
    for(const b of p.balloons){ if(b.text.trim())textLines.push(`- Panel ${p.order} balloon (${b.type}, speaker=${b.speakerId||'unspecified'}): "${b.text.trim()}"`); }
    if(p.effects.sfxText.trim())textLines.push(`- Panel ${p.order} onomatopoeia (${p.effects.sfxStyle}): "${p.effects.sfxText.trim()}"`);
  }
  lines.push('TEXT TO RENDER:');
  lines.push(textLines.length?textLines.join('\n'):'- None. Render no text at all.');
  lines.push('');
  lines.push('Treat image + semantic instructions + Character Sheets as one contract. Preserve user-authored panel composition and manga direction.');
  return lines.join('\n');
}

function downloadBlob(blob,filename){const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function exportJson(){downloadBlob(new Blob([JSON.stringify(project,null,2)],{type:'application/json'}),'project.manga.json');}
async function exportPng(annotated){
  const temp=document.createElementNS('http://www.w3.org/2000/svg','svg');temp.setAttribute('viewBox',`0 0 ${PAGE_W} ${PAGE_H}`);temp.setAttribute('xmlns','http://www.w3.org/2000/svg');temp.innerHTML=renderSvg(annotated);
  temp.querySelectorAll('.selected,.stick-selected,.balloon-selected').forEach(el=>el.classList.remove('selected','stick-selected','balloon-selected'));
  if(!annotated)temp.querySelectorAll('.authoring-text').forEach(el=>el.remove());
  const css=[...document.styleSheets].flatMap(sheet=>{try{return [...sheet.cssRules].map(r=>r.cssText)}catch{return[]}}).join('\n');
  const source=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${PAGE_W} ${PAGE_H}"><style>${css}</style>${temp.innerHTML}</svg>`;
  const img=new Image(),url=URL.createObjectURL(new Blob([source],{type:'image/svg+xml'}));
  await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=reject;img.src=url});
  const canvas=document.createElement('canvas');canvas.width=PAGE_W;canvas.height=PAGE_H;const ctx=canvas.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,PAGE_W,PAGE_H);ctx.drawImage(img,0,0);URL.revokeObjectURL(url);
  canvas.toBlob(blob=>blob&&downloadBlob(blob,annotated?'blueprint-annotated.png':'blueprint-ai-clean.png'),'image/png');
}

function svgPoint(evt){
  const pt=svg.createSVGPoint();pt.x=evt.clientX;pt.y=evt.clientY;return pt.matrixTransform(svg.getScreenCTM().inverse());
}
svg.addEventListener('pointerdown',evt=>{
  const charEl=evt.target.closest('[data-char-id]'),balloonEl=evt.target.closest('[data-balloon-id]'),panelEl=evt.target.closest('[data-panel-hit]');
  if(charEl){const panel=charEl.closest('[data-panel]');selectedPanelId=panel?.dataset.panel||selectedPanelId;selectedCharacterId=charEl.dataset.charId;selectedBalloonId=null;const c=selectedCharacter(),pt=svgPoint(evt);drag={type:'character',id:c.id,dx:c.x-pt.x,dy:c.y-pt.y,before:snapshot()};svg.setPointerCapture(evt.pointerId);render();return;}
  if(balloonEl){const panel=balloonEl.closest('[data-panel]');selectedPanelId=panel?.dataset.panel||selectedPanelId;selectedBalloonId=balloonEl.dataset.balloonId;selectedCharacterId=null;const b=selectedBalloon(),pt=svgPoint(evt);drag={type:'balloon',id:b.id,dx:b.x-pt.x,dy:b.y-pt.y,before:snapshot()};svg.setPointerCapture(evt.pointerId);render();return;}
  if(panelEl){selectedPanelId=panelEl.dataset.panelHit;selectedCharacterId=null;selectedBalloonId=null;render();}
});
svg.addEventListener('pointermove',evt=>{
  if(!drag)return;const pt=svgPoint(evt),p=selectedPanel();if(!p)return;
  if(drag.type==='character'){const c=selectedCharacter();if(c){c.x=Math.max(p.rect.x-80,Math.min(p.rect.x+p.rect.w+80,pt.x+drag.dx));c.y=Math.max(p.rect.y-80,Math.min(p.rect.y+p.rect.h+80,pt.y+drag.dy));renderCanvas();save();}}
  if(drag.type==='balloon'){const b=selectedBalloon();if(b){b.x=Math.max(p.rect.x,Math.min(p.rect.x+p.rect.w,pt.x+drag.dx));b.y=Math.max(p.rect.y,Math.min(p.rect.y+p.rect.h,pt.y+drag.dy));renderCanvas();save();}}
});
svg.addEventListener('pointerup',()=>{if(drag&&drag.before!==snapshot()){history.push(drag.before);if(history.length>HISTORY_LIMIT)history.shift();future=[];}drag=null;render();});

