// Prototype 0.12.4: make Scene Template cast counts explicit.
// "2 characters" means expected scene participants, not two visible figures in every panel.

Object.assign(i18n.ja,{
  templateExpectedCast26:'想定{count}人',
  templateVisibleOffscreen26:'{visible}人表示＋画面外{offscreen}人',
  templateVisibleCast26:'画面内{count}人',
  templateCastContract26:'登場人物の扱い',
  templateCastContractOffscreen26:'想定登場: {expected}人 / 現在のテンプレ適用: {visible}人を画面内に表示し、{offscreen}人を画面外相手として扱います。',
  templateCastContractVisible26:'想定登場: {expected}人 / 画面内: {visible}人',
  guideCastFallbackBody:'テンプレートの「想定2人」は物語上の登場人物数です。現在の2人テンプレートは、選択中のベースキャラ1人を画面内へ配置し、もう1人を画面外相手として扱います。テンプレートカードには「想定2人」「1人表示＋画面外1人」と明示します。'
});
Object.assign(i18n.en,{
  templateExpectedCast26:'{count} expected',
  templateVisibleOffscreen26:'{visible} visible + {offscreen} off-panel',
  templateVisibleCast26:'{count} visible',
  templateCastContract26:'Cast behavior',
  templateCastContractOffscreen26:'Expected cast: {expected} / current template apply: {visible} visible, with {offscreen} represented as off-panel partner(s).',
  templateCastContractVisible26:'Expected cast: {expected} / visible: {visible}',
  guideCastFallbackBody:'An "expected cast of 2" means two story participants, not two visible figures in every panel. Current two-person templates place one selected base character visibly and represent the other as an off-panel partner. Template cards state this explicitly.'
});

function formatCastText26(key,values={}){
  let text=t(key);
  for(const [name,value] of Object.entries(values))text=text.replaceAll(`{${name}}`,String(value));
  return text;
}

function castContract26(id){
  const scene=sceneInfo22(id);if(!scene)return null;
  const expected=Math.max(1,Number(scene.cast?.recommended||scene.cast?.min||1));
  if(scene.presentation==='one-visible-offscreen'||scene.offPanelPartner){
    const visible=1;
    const offscreen=Math.max(1,expected-visible);
    return {scene,expected,visible,offscreen,offPanel:true};
  }
  const visible=scene.presentation==='two-shot'?Math.min(expected,2):1;
  return {scene,expected,visible,offscreen:0,offPanel:false};
}

// Replace the ambiguous "👥 2人" badge with expected-vs-visible semantics.
templateBadges22=function(id){
  const c=castContract26(id);if(!c)return'';
  const s=c.scene;
  const castBits=c.offPanel
    ?[
      `👥 ${formatCastText26('templateExpectedCast26',{count:c.expected})}`,
      `👤 ${formatCastText26('templateVisibleOffscreen26',{visible:c.visible,offscreen:c.offscreen})}`
    ]
    :[
      `${c.expected>1?'👥':'👤'} ${formatCastText26('templateExpectedCast26',{count:c.expected})}`,
      `👁 ${formatCastText26('templateVisibleCast26',{count:c.visible})}`
    ];
  const bits=[...castBits,sceneLabel22('relationship',s.relationship),sceneLabel22('dialogue',s.dialogueDensity),sceneLabel22('art',s.artHint)];
  return `<span class="template-badges22 template-badges26">${bits.filter(Boolean).map((x,i)=>`<em class="${i<2?'cast-badge26':''}">${escapeXml(x)}</em>`).join('')}</span>`;
};

function renderTemplateCastContract26(){
  const box=$('storyTemplatePreview11');if(!box)return;
  box.querySelector('.template-cast-contract26')?.remove();
  const id=selectedTemplateId13();
  const c=castContract26(id);if(!c)return;
  const text=c.offPanel
    ?formatCastText26('templateCastContractOffscreen26',{expected:c.expected,visible:c.visible,offscreen:c.offscreen})
    :formatCastText26('templateCastContractVisible26',{expected:c.expected,visible:c.visible});
  const row=document.createElement('div');
  row.className='template-cast-contract26';
  row.innerHTML=`<b>${escapeXml(t('templateCastContract26'))}</b><span>${escapeXml(text)}</span>`;
  box.appendChild(row);
}

const renderTemplatePreviewBase26=renderTemplatePreview13;
renderTemplatePreview13=function(){renderTemplatePreviewBase26();renderTemplateCastContract26();};

function installCastClarityStyles26(){
  if($('castClarityStyle26'))return;
  const style=document.createElement('style');style.id='castClarityStyle26';style.textContent=`
.template-badges26 .cast-badge26{font-weight:750;border-color:#bfdbfe;background:#eff6ff;color:#1e3a8a}
.template-cast-contract26{display:grid;gap:3px;margin-top:9px;padding:8px 9px;border:1px solid #bfdbfe;border-radius:9px;background:#eff6ff}
.template-cast-contract26 b{font-size:.73rem;color:#1e3a8a}.template-cast-contract26 span{font-size:.75rem;line-height:1.45;color:#334155}
@container templateCard25 (max-width:230px){.template-badges26{display:flex;flex-wrap:wrap;gap:4px}.template-badges26 em{white-space:normal}}
`;
  document.head.appendChild(style);
}

installCastClarityStyles26();
renderTemplateGallery13();renderTemplatePreview13();
document.querySelector('footer')&&(document.querySelector('footer').textContent='Prototype 0.12.4 · explicit expected / visible template cast');
