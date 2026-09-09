// Prototype 0.12.4: make template cast counts unambiguous in authoring UI.
// `recommended` is the scene-wide expected cast, not the number simultaneously visible in every panel.

Object.assign(i18n.ja,{
  templateExpectedCast26:'想定登場',
  templateVisibleCast26:'同時表示',
  templateOffPanelCast26:'画面外相手',
  guideCastMeaning26:'テンプレートの人数表示',
  guideCastMeaningBody26:'テンプレートカードの人数は「シーン全体で想定する主要キャラ数」です。現在の2人テンプレートは、画面内に1人を配置し、もう1人を画面外の会話・視線相手として扱います。詳細では「想定登場」「同時表示」「画面外相手」を分けて確認できます。'
});
Object.assign(i18n.en,{
  templateExpectedCast26:'Expected cast',
  templateVisibleCast26:'Visible together',
  templateOffPanelCast26:'Off-panel partner',
  guideCastMeaning26:'What template cast count means',
  guideCastMeaningBody26:'The cast count on a template card is the scene-wide expected main cast, not the number visible in every panel. Current two-person templates place one character visibly and treat the second participant as an off-panel dialogue/gaze partner. The detail view separates expected cast, visible-together count, and off-panel participants.'
});

function templateCastCounts26(id){
  const scene=sceneInfo22(id);
  if(!scene)return null;
  const expected=Math.max(1,Number(scene.cast?.recommended||scene.cast?.min||1));
  let visible=1;
  if(scene.presentation==='two-shot')visible=Math.min(expected,2);
  else if(scene.presentation==='one-visible-offscreen')visible=1;
  else if(scene.presentation==='single')visible=1;
  const offPanel=scene.offPanelPartner?Math.max(0,expected-visible):0;
  return {scene,expected,visible,offPanel};
}

function templateCastSummary26(id){
  const c=templateCastCounts26(id);if(!c)return'';
  if(c.expected<=1)return language==='ja'?'👤 1人':'👤 1 person';
  if(c.offPanel>0){
    return language==='ja'
      ?`👥 想定${c.expected}人（表示${c.visible}＋画面外${c.offPanel}）`
      :`👥 ${c.expected} expected (${c.visible} visible + ${c.offPanel} off-panel)`;
  }
  return language==='ja'?`👥 想定${c.expected}人`:`👥 ${c.expected} expected`;
}

// Keep the existing relationship/dialogue/art badges, but make the cast badge explicit.
templateBadges22=function(id){
  const c=templateCastCounts26(id);if(!c)return'';
  const s=c.scene;
  const bits=[
    {text:templateCastSummary26(id),cls:'template-cast-badge26'},
    {text:sceneLabel22('relationship',s.relationship),cls:''},
    {text:sceneLabel22('dialogue',s.dialogueDensity),cls:''},
    {text:sceneLabel22('art',s.artHint),cls:''}
  ].filter(x=>x.text);
  return `<span class="template-badges22">${bits.map(x=>`<em class="${x.cls}">${escapeXml(x.text)}</em>`).join('')}</span>`;
};

const renderTemplatePreviewBase26=renderTemplatePreview13;
renderTemplatePreview13=function(){
  renderTemplatePreviewBase26();
  const box=$('storyTemplatePreview11'),c=templateCastCounts26(selectedTemplateId13());
  if(!box||!c)return;
  const meta=box.querySelector('.template-scene-meta22');if(!meta)return;
  const count=n=>`${n}${language==='ja'?'人':''}`;
  meta.innerHTML=`
    <span><b>${escapeXml(t('templateExpectedCast26'))}:</b> ${escapeXml(count(c.expected))}</span>
    <span><b>${escapeXml(t('templateVisibleCast26'))}:</b> ${escapeXml(count(c.visible))}</span>
    <span><b>${escapeXml(t('templateOffPanelCast26'))}:</b> ${escapeXml(count(c.offPanel))}</span>
    <span><b>${escapeXml(t('templatePresentation'))}:</b> ${escapeXml(sceneLabel22('presentation',c.scene.presentation))}</span>
    <span><b>${escapeXml(t('templateRelationship'))}:</b> ${escapeXml(sceneLabel22('relationship',c.scene.relationship))}</span>
    <span><b>${escapeXml(t('templateDialogueLevel'))}:</b> ${escapeXml(sceneLabel22('dialogue',c.scene.dialogueDensity))}</span>
    <span><b>${escapeXml(t('templateArtHint'))}:</b> ${escapeXml(sceneLabel22('art',c.scene.artHint))}</span>`;
};

function installCastMeaningHelp26(){
  const d=$('helpDialog');if(!d||$('guideCastMeaningSection26'))return;
  const section=document.createElement('section');section.id='guideCastMeaningSection26';section.className='guide-section';
  section.innerHTML=`<h3 data-i18n="guideCastMeaning26"></h3><p data-i18n="guideCastMeaningBody26"></p>`;
  ($('guideCastFallback23')||$('guideSceneContract22'))?.insertAdjacentElement('afterend',section);
}

function installCastMeaningStyles26(){
  if($('castMeaningStyle26'))return;
  const style=document.createElement('style');style.id='castMeaningStyle26';style.textContent=`
.template-badges22 .template-cast-badge26{background:#ecfeff;color:#155e75;border:1px solid #a5f3fc;font-weight:750}
.template-scene-meta22 span:nth-child(-n+3){background:#f8fafc}
`;
  document.head.appendChild(style);
}

const applyLanguageBase26=applyLanguage;
applyLanguage=function(){
  applyLanguageBase26();
  installCastMeaningHelp26();
  document.querySelectorAll('#guideCastMeaningSection26 [data-i18n]').forEach(el=>el.textContent=t(el.dataset.i18n));
  renderTemplateGallery13();renderTemplatePreview13();renderQuickStatus22();
};

installCastMeaningStyles26();installCastMeaningHelp26();
renderTemplateGallery13();renderTemplatePreview13();renderQuickStatus22();
document.querySelector('footer')&&(document.querySelector('footer').textContent='Prototype 0.12.4 · explicit template cast meaning');
