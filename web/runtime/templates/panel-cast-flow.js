// Prototype 0.12.6: show template cast visibility per panel in reading order.
// Scene-wide expected cast and per-panel visibility are separate authoring concepts.

Object.assign(i18n.ja,{
  templatePanelCastFlow28:'コマごとの登場',
  templatePanelCastFlowHelp28:'テンプレート適用後の読み順に沿って、主役・相手が画面内か画面外かを確認できます。',
  templatePrimary28:'主役',templatePartner28:'相手',templateVisible28:'画面内',templateOffPanel28:'画面外',templateSpeaking28:'発話',
  guidePanelCastFlow28:'コマごとの登場確認',
  guidePanelCastFlowBody28:'シーン全体の「想定登場」と、各コマで実際に見える人数は別です。テンプレート詳細の「コマごとの登場」で、各コマの主役・相手が画面内か画面外か、どちらが話すかを適用前に確認できます。'
});
Object.assign(i18n.en,{
  templatePanelCastFlow28:'Cast by panel',
  templatePanelCastFlowHelp28:'Follow reading order to see whether the primary character and partner are visible or off-panel after template application.',
  templatePrimary28:'Primary',templatePartner28:'Partner',templateVisible28:'Visible',templateOffPanel28:'Off-panel',templateSpeaking28:'Speaking',
  guidePanelCastFlow28:'Per-panel cast visibility',
  guidePanelCastFlowBody28:'Scene-wide expected cast and the number actually visible in each panel are different concepts. “Cast by panel” shows whether the primary character and partner are visible or off-panel, and who speaks, before you apply the template.'
});

function templateBeatCast28(id,beat={}){
  const counts=templateCastCounts26(id);if(!counts)return[];
  const hasDialogue=!!String(localized13x?.(beat.dialogue)||'').trim();
  const actors=Array.isArray(beat.actors27)?beat.actors27:[];
  const speakerIndex=Number.isFinite(Number(beat.speakerIndex27))?Number(beat.speakerIndex27):0;

  if(actors.length){
    return actors.slice(0,Math.max(1,counts.visible)).map((actor,index)=>({
      role:index===0?'primary':'partner',
      visible:true,
      speaking:hasDialogue&&speakerIndex===index
    }));
  }

  const partnerVisible=counts.visible>1&&!counts.scene.offPanelPartner;
  const partnerSpeaks=hasDialogue&&beat.speakerRole==='partner';
  const entries=[{role:'primary',visible:true,speaking:hasDialogue&&!partnerSpeaks}];
  if(counts.expected>1)entries.push({role:'partner',visible:partnerVisible,speaking:partnerSpeaks});
  return entries;
}

function templateActorChip28(actor){
  const role=t(actor.role==='partner'?'templatePartner28':'templatePrimary28');
  const place=t(actor.visible?'templateVisible28':'templateOffPanel28');
  const speaking=actor.speaking?` · ${t('templateSpeaking28')}`:'';
  return `<span class="template-actor-chip28 ${actor.visible?'visible':'off-panel'}"><b>${escapeXml(role)}</b>: ${escapeXml(place)}${escapeXml(speaking)}</span>`;
}

function templatePanelCastFlow28(id){
  const tpl=storyTemplates11[id];
  if(!tpl?.beats?.length)return'';
  const rows=tpl.beats.map((beat,index)=>{
    const actors=templateBeatCast28(id,beat);
    return `<li><span class="template-panel-number28">${index+1}</span><span class="template-panel-actors28">${actors.map(templateActorChip28).join('')}</span></li>`;
  }).join('');
  return `<section class="template-panel-cast28"><strong>${escapeXml(t('templatePanelCastFlow28'))}</strong><p>${escapeXml(t('templatePanelCastFlowHelp28'))}</p><ol>${rows}</ol></section>`;
}

const renderTemplatePreviewBase28=renderTemplatePreview13;
renderTemplatePreview13=function(){
  renderTemplatePreviewBase28();
  const box=$('storyTemplatePreview11'),id=selectedTemplateId13();
  if(!box||!storyTemplates11[id])return;
  box.insertAdjacentHTML('beforeend',templatePanelCastFlow28(id));
};

function installPanelCastStyles28(){
  if($('panelCastStyle28'))return;
  const style=document.createElement('style');style.id='panelCastStyle28';style.textContent=`
.template-panel-cast28{margin-top:10px;padding:10px;border:1px solid var(--line,#dbe3ef);border-radius:10px;background:rgba(248,250,252,.86)}
.template-panel-cast28>strong{display:block;font-size:.92rem}
.template-panel-cast28>p{margin:3px 0 8px;color:var(--muted,#64748b);font-size:.78rem;line-height:1.45}
.template-panel-cast28 ol{list-style:none;margin:0;padding:0;display:grid;gap:6px}
.template-panel-cast28 li{display:flex;align-items:flex-start;gap:7px;min-width:0}
.template-panel-number28{display:grid;place-items:center;flex:0 0 24px;height:24px;border-radius:999px;background:#e2e8f0;color:#334155;font-weight:800;font-size:.76rem}
.template-panel-actors28{display:flex;flex-wrap:wrap;gap:5px;min-width:0}
.template-actor-chip28{display:inline-flex;align-items:center;padding:3px 7px;border-radius:999px;border:1px solid #bae6fd;background:#f0f9ff;color:#0c4a6e;font-size:.75rem;line-height:1.25}
.template-actor-chip28.off-panel{border-style:dashed;border-color:#cbd5e1;background:#fff;color:#64748b}
`;
  document.head.appendChild(style);
}

function installPanelCastHelp28(){
  const d=$('helpDialog');if(!d||$('guidePanelCastFlowSection28'))return;
  const section=document.createElement('section');section.id='guidePanelCastFlowSection28';section.className='guide-section';
  section.innerHTML=`<h3 data-i18n="guidePanelCastFlow28"></h3><p data-i18n="guidePanelCastFlowBody28"></p>`;
  ($('guideTwoVisible27')||$('guideCastMeaningSection26')||$('guideSceneContract22'))?.insertAdjacentElement('afterend',section);
}

const applyLanguageBase28=applyLanguage;
applyLanguage=function(){
  applyLanguageBase28();installPanelCastHelp28();
  document.querySelectorAll('#guidePanelCastFlowSection28 [data-i18n]').forEach(el=>el.textContent=t(el.dataset.i18n));
  renderTemplatePreview13();
};

installPanelCastStyles28();installPanelCastHelp28();renderTemplatePreview13();
document.querySelector('footer')&&(document.querySelector('footer').textContent='Prototype 0.12.6 · per-panel cast visibility');
