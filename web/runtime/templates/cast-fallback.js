// Prototype 0.12.1: until automatic multi-character placement ships, two-person templates
// are represented as one visible character + an explicit off-panel partner.

Object.assign(i18n.ja,{
  guideCastFallback:'2人テンプレートの現在の扱い',
  guideCastFallbackBody:'2人想定のテンプレートでも、現在は選択中のベースキャラ1人を画面内へ配置し、もう1人は画面外相手として扱います。これによりAIが勝手に別キャラを画面内へ追加するのを防ぎます。'
});
Object.assign(i18n.en,{
  guideCastFallback:'Current behavior for two-person templates',
  guideCastFallbackBody:'Two-person templates currently place the selected base character visibly and represent the second participant as an explicit off-panel partner. This prevents downstream models from inventing an unplanned visible character.'
});

const sceneInfoBase23=sceneInfo22;
sceneInfo22=function(id){
  const scene=sceneInfoBase23(id);if(!scene)return scene;
  if((scene.cast?.recommended||1)>1){
    return {...scene,presentation:'one-visible-offscreen',offPanelPartner:true};
  }
  return scene;
};

function installCastFallbackHelp23(){
  const d=$('helpDialog');if(!d||$('guideCastFallback23'))return;
  const s=document.createElement('section');s.id='guideCastFallback23';s.className='guide-section';s.innerHTML=`<h3 data-i18n="guideCastFallback"></h3><p data-i18n="guideCastFallbackBody"></p>`;
  $('guideSceneContract22')?.insertAdjacentElement('afterend',s);
}

const applyLanguageBase23=applyLanguage;
applyLanguage=function(){
  applyLanguageBase23();installCastFallbackHelp23();
  document.querySelectorAll('#guideCastFallback23 [data-i18n]').forEach(el=>el.textContent=t(el.dataset.i18n));
  renderTemplateGallery13();renderTemplatePreview13();renderQuickStatus22();
};

installCastFallbackHelp23();renderTemplateGallery13();renderTemplatePreview13();renderQuickStatus22();render();
document.querySelector('footer')&&(document.querySelector('footer').textContent='Prototype 0.12.1 · scene contract · explicit off-panel partner');
