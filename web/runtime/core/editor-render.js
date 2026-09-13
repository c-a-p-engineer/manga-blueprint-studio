function line(a,b){ return `<line class="stick" x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" />`; }

function characterSvg(ch,annotated=true){
  const pose=posePresets[ch.poseId]||posePresets.stand, j=pose.joints;
  const labelWidth=Math.max(80,String(ch.name||ch.characterId).length*18+24);
  return `<g class="character-group ${ch.id===selectedCharacterId?'stick-selected':''}" data-char-id="${escapeXml(ch.id)}" transform="translate(${ch.x} ${ch.y}) rotate(${ch.rotation}) scale(${ch.scale})">
    ${line(j.neck,j.shoulderL)}${line(j.neck,j.shoulderR)}${line(j.shoulderL,j.elbowL)}${line(j.elbowL,j.handL)}${line(j.shoulderR,j.elbowR)}${line(j.elbowR,j.handR)}${line(j.neck,j.hip)}${line(j.hip,j.kneeL)}${line(j.kneeL,j.footL)}${line(j.hip,j.kneeR)}${line(j.kneeR,j.footR)}
    <circle class="stick-head" cx="${j.head[0]}" cy="${j.head[1]}" r="22" />
    ${annotated?`<g class="authoring-text" transform="translate(0 126) scale(${1/Math.max(ch.scale,.01)})"><rect class="character-label-bg" x="${-labelWidth/2}" y="-18" width="${labelWidth}" height="30" rx="8"/><text class="character-label" x="0" y="4">${escapeXml(ch.name||ch.characterId)}</text></g>`:''}
  </g>`;
}

function balloonSvg(b,annotated=true){
  const p=selectedPanel();
  if(!p)return '';
  const w=120*b.size,h=(b.type==='narration'?70:85)*b.size;
  const cls=`balloon ${b.type} ${b.id===selectedBalloonId?'balloon-selected':''}`;
  const shape=b.type==='narration'
    ? `<rect class="${cls}" x="${b.x-w/2}" y="${b.y-h/2}" width="${w}" height="${h}" rx="6"/>`
    : `<ellipse class="${cls}" cx="${b.x}" cy="${b.y}" rx="${w/2}" ry="${h/2}"/>`;
  const text=annotated&&b.text?`<text class="balloon-text authoring-text" x="${b.x}" y="${b.y+4}">${escapeXml(b.text.slice(0,14))}${b.text.length>14?'…':''}</text>`:'';
  return `<g data-balloon-id="${escapeXml(b.id)}">${shape}${text}</g>`;
}

function panelRect(panel){
  let {x,y,w,h}=panel.rect;
  const bleed=panel.style.bleed;
  if(bleed==='top'||bleed==='all'){h+=y;y=0;}
  if(bleed==='left'||bleed==='all'){w+=x;x=0;}
  if(bleed==='right'||bleed==='all')w=PAGE_W-x;
  if(bleed==='bottom'||bleed==='all')h=PAGE_H-y;
  return {x,y,w,h};
}

function effectSvg(panel){
  const e=panel.effects,r=panelRect(panel);
  if(!e||e.lineEffect==='none'||e.lineEffect==='silence')return '';
  const strength=e.strength==='high'?20:e.strength==='low'?8:14;
  const lines=[];
  const cx=r.x+r.w/2,cy=r.y+r.h/2;
  if(e.lineEffect==='focus'||e.lineEffect==='impact'){
    for(let i=0;i<strength;i++){
      const a=(Math.PI*2*i)/strength;
      const x1=cx+Math.cos(a)*Math.min(r.w,r.h)*.18,y1=cy+Math.sin(a)*Math.min(r.w,r.h)*.18;
      const x2=cx+Math.cos(a)*Math.max(r.w,r.h),y2=cy+Math.sin(a)*Math.max(r.w,r.h);
      lines.push(`<line class="effect-line" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`);
    }
  }else{
    for(let i=0;i<strength;i++){
      const yy=r.y+(r.h/(strength+1))*(i+1);
      lines.push(`<line class="effect-line" x1="${r.x}" y1="${yy}" x2="${r.x+r.w}" y2="${yy-30}"/>`);
    }
  }
  return `<g clip-path="url(#clip_${panel.id})">${lines.join('')}</g>`;
}

function renderSvg(annotated=true){
  const page=currentPage();
  const defs=page.panels.map(p=>{const r=panelRect(p);return `<clipPath id="clip_${p.id}"><rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}"/></clipPath>`}).join('');
  const body=page.panels.map(p=>{
    const r=panelRect(p),clip=p.style.breakout==='none';
    const borderClass=`panel-outline ${p.id===selectedPanelId?'selected':''} ${p.style.border}`;
    const chars=p.characters.length?p.characters.map(ch=>characterSvg(ch,annotated)).join(''):(annotated?`<text class="empty-note authoring-text" x="${r.x+r.w/2}" y="${r.y+r.h/2}">tap → add character</text>`:'');
    const meta=annotated?`<g class="authoring-text"><rect class="panel-number-bg" x="${r.x+r.w-43}" y="${r.y+12}" width="30" height="30" rx="15"/><text class="panel-number" x="${r.x+r.w-28}" y="${r.y+27}">${p.order}</text><text class="camera-label" x="${r.x+14}" y="${r.y+27}">${escapeXml(p.camera.distance)} · ${escapeXml(p.camera.angle)}</text><text class="role-label" x="${r.x+14}" y="${r.y+45}">${escapeXml(p.role)}</text></g>`:'';
    const bgMeta=annotated&&p.background.location?`<text class="effect-note authoring-text" x="${r.x+14}" y="${r.y+r.h-18}">BG: ${escapeXml(p.background.location)}</text>`:'';
    const sfx=annotated&&p.effects.sfxText?`<text class="effect-note authoring-text" x="${r.x+r.w-18}" y="${r.y+r.h-18}" text-anchor="end">SFX: ${escapeXml(p.effects.sfxText)}</text>`:'';
    return `<g data-panel="${p.id}">
      <rect class="${borderClass}" x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}"/>
      <rect class="panel-hit" data-panel-hit="${p.id}" x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}"/>
      ${effectSvg(p)}
      <g ${clip?`clip-path="url(#clip_${p.id})"`:''}>${chars}</g>
      ${p.balloons.map(b=>balloonSvg(b,annotated)).join('')}
      ${meta}${bgMeta}${sfx}
    </g>`;
  }).join('');
  return `<defs>${defs}<style>.effect-line{stroke:#111827;stroke-width:3;opacity:.55;vector-effect:non-scaling-stroke}</style></defs><rect width="${PAGE_W}" height="${PAGE_H}" fill="#fff"/>${body}`;
}

function renderCanvas(){
  svg.innerHTML=renderSvg(true);
}

function renderCameraHelp(){
  const p=selectedPanel();
  if(!p){$('cameraHelp').textContent='';return;}
  const idx=language==='ja'?0:1;
  const parts=[cameraHelp.distance[p.camera.distance]?.[idx],cameraHelp.angle[p.camera.angle]?.[idx],cameraHelp.viewpoint[p.camera.viewpoint]?.[idx]].filter(Boolean);
  $('cameraHelp').textContent=parts.join(' ');
}

function renderUi(){
  const p=selectedPanel(),ch=selectedCharacter(),b=selectedBalloon();
  $('panelStatus').textContent=p?`Panel ${p.order} / ${p.characters.length} character(s) / ${p.balloons.length} balloon(s)`:'コマを選択してください。';
  ['panelRole','cameraDistance','cameraAngle','cameraViewpoint','cameraFocus','cameraIntent','borderStyle','bleedEdge','breakoutMode','backgroundLocation','backgroundTime','backgroundWeather','backgroundMood','backgroundDetail','backgroundRenderMode','backgroundNotes','lineEffect','effectStrength','sfxText','sfxStyle','effectNotes'].forEach(id=>$(id).disabled=!p);
  if(p){
    $('panelRole').value=p.role;$('cameraDistance').value=p.camera.distance;$('cameraAngle').value=p.camera.angle;$('cameraViewpoint').value=p.camera.viewpoint;$('cameraFocus').value=p.camera.focus;$('cameraIntent').value=p.camera.intent;
    $('borderStyle').value=p.style.border;$('bleedEdge').value=p.style.bleed;$('breakoutMode').value=p.style.breakout;
    $('backgroundLocation').value=p.background.location;$('backgroundTime').value=p.background.timeOfDay;$('backgroundWeather').value=p.background.weather;$('backgroundMood').value=p.background.mood;$('backgroundDetail').value=p.background.detailLevel;$('backgroundRenderMode').value=p.background.renderMode;$('backgroundNotes').value=p.background.notes;
    $('lineEffect').value=p.effects.lineEffect;$('effectStrength').value=p.effects.strength;$('sfxText').value=p.effects.sfxText;$('sfxStyle').value=p.effects.sfxStyle;$('effectNotes').value=p.effects.notes;
  }
  renderCameraHelp();
  $('characterList').innerHTML=p?p.characters.map(c=>`<button type="button" data-list-char="${escapeXml(c.id)}" class="${c.id===selectedCharacterId?'active':''}">${escapeXml(c.name||c.characterId)} — ${escapeXml(poseLabel(c.poseId))}</button>`).join(''):'';
  $('noCharacter').hidden=!!ch;
  $('characterInspector').hidden=!ch;
  if(ch){
    $('characterName').value=ch.name;$('characterId').value=ch.characterId;$('referenceKey').value=ch.referenceKey;$('poseSelect').value=ch.poseId;
    $('expressionType').value=ch.expression.type;$('expressionIntensity').value=ch.expression.intensity;$('expressionNotes').value=ch.expression.notes;$('gazeTarget').value=ch.gaze.target;$('gazeNotes').value=ch.gaze.notes;
    $('characterScale').value=ch.scale;$('scaleOut').value=`${Number(ch.scale).toFixed(2)}×`;$('characterRotation').value=ch.rotation;$('rotationOut').value=`${ch.rotation}°`;
  }
  $('balloonList').innerHTML=p?p.balloons.map(x=>`<button type="button" data-list-balloon="${escapeXml(x.id)}" class="${x.id===selectedBalloonId?'active':''}">${escapeXml(x.type)} — ${escapeXml(x.text||'(empty)')}</button>`).join(''):'';
  $('balloonInspector').hidden=!b;
  $('balloonSpeaker').innerHTML=`<option value="">指定なし</option>${p?p.characters.map(c=>`<option value="${escapeXml(c.characterId)}">${escapeXml(c.name||c.characterId)}</option>`).join(''):''}`;
  if(b){$('balloonType').value=b.type;$('balloonSpeaker').value=b.speakerId;$('balloonText').value=b.text;$('balloonX').value=b.x;$('balloonY').value=b.y;$('balloonSize').value=b.size;}
  $('promptOutput').value=compilePrompt();
  $('undoBtn').disabled=!history.length;
  $('redoBtn').disabled=!future.length;
}

function render(){
  renderCanvas();
  renderUi();
  save();
  document.dispatchEvent(new CustomEvent('manga-blueprint:editor-rendered'));
}
