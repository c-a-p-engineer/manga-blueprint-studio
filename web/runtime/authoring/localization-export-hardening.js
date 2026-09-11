// Prototype 0.5 hardening: fully localized guide content and guarded export encoding.
Object.assign(i18n.ja,{
  guideExtremeCloseLabel:'Extreme close / 超寄り',guideExtremeCloseBody:'目・口・手・拳など一部だけを大きく切り取り、緊張や決めを強調します。',
  guideLongLabel:'Long / 引き',guideLongBody:'全身と周囲の位置関係を見せ、動作や状況を読みやすくします。',
  guideLowLabel:'Low angle / あおり',guideLowBody:'下から見上げ、強さ・威圧感・迫力を出しやすい構図です。',
  guideHighLabel:'High angle / ふかん',guideHighBody:'上から見下ろし、弱さ・孤立・全体配置を見せやすい構図です。',
  skeletonHead:'頭',skeletonTorso:'胴',skeletonArms:'腕',skeletonLegs:'脚',skeletonExtremities:'手・足',
  guideFull:'詳しい使い方を別画面で開く',
  exportError:'出力に失敗しました。ページを再読み込みせず、設定を確認してもう一度お試しください。'
});
Object.assign(i18n.en,{
  guideExtremeCloseLabel:'Extreme close',guideExtremeCloseBody:'Isolate a detail such as the eyes, mouth, hand, or fist to emphasize tension or a decisive beat.',
  guideLongLabel:'Long / full-body',guideLongBody:'Show the full body and surrounding spatial relationships so action and staging are easy to read.',
  guideLowLabel:'Low angle',guideLowBody:'Look upward to emphasize power, intimidation, or impact.',
  guideHighLabel:'High angle',guideHighBody:'Look downward to emphasize vulnerability, isolation, or an overview of the scene.',
  skeletonHead:'Head',skeletonTorso:'Torso',skeletonArms:'Arms',skeletonLegs:'Legs',skeletonExtremities:'Hands / Feet',
  guideFull:'Open full user guide',
  exportError:'Export failed. Keep the page open, check the current settings, and try again.'
});

function installFormalHelp07(){
  const dialog=$('helpDialog');if(!dialog)return;
  dialog.setAttribute('aria-labelledby','guideTitle06');
  dialog.innerHTML=`<form method="dialog" class="modal-card help-guide"><div class="section-title-row"><h2 id="guideTitle06" data-i18n="guideTitle"></h2><button value="close" aria-label="Close">×</button></div><p class="lead" data-i18n="guideLead"></p>
    <section class="guide-section"><h3 data-i18n="guideFlow"></h3><p data-i18n="guideFlowBody"></p></section>
    <div class="guide-grid"><section class="guide-section"><h3 data-i18n="guideReading"></h3><p data-i18n="guideReadingBody"></p></section><section class="guide-section"><h3 data-i18n="guideCharacters"></h3><p data-i18n="guideCharactersBody"></p></section><section class="guide-section"><h3 data-i18n="guideSkeleton"></h3><p data-i18n="guideSkeletonBody"></p></section><section class="guide-section"><h3 data-i18n="guideBackground"></h3><p data-i18n="guideBackgroundBody"></p></section></div>
    <section class="guide-section"><h3 data-i18n="guideCamera"></h3><div class="cheat-grid"><div><strong data-i18n="guideExtremeCloseLabel"></strong><span data-i18n="guideExtremeCloseBody"></span></div><div><strong data-i18n="guideLongLabel"></strong><span data-i18n="guideLongBody"></span></div><div><strong data-i18n="guideLowLabel"></strong><span data-i18n="guideLowBody"></span></div><div><strong data-i18n="guideHighLabel"></strong><span data-i18n="guideHighBody"></span></div></div></section>
    <section class="guide-section"><h3 data-i18n="guideExport"></h3><p data-i18n="guideExportBody"></p></section>
    <a href="./guide.html" class="button-like full" data-i18n="guideFull"></a>
    <button value="close" class="primary full" data-i18n="guideDone"></button></form>`;
}

function localizeSkeletonLegend07(){
  const legend=document.querySelector('.skeleton-swatches');if(!legend)return;
  legend.innerHTML=`<span><i class="swatch head"></i><b data-i18n="skeletonHead"></b></span><span><i class="swatch torso"></i><b data-i18n="skeletonTorso"></b></span><span><i class="swatch arms"></i><b data-i18n="skeletonArms"></b></span><span><i class="swatch legs"></i><b data-i18n="skeletonLegs"></b></span><span><i class="swatch extremity"></i><b data-i18n="skeletonExtremities"></b></span>`;
}

function renderBasePoseOptions07(){
  const select=$('baseCharacterPose');if(!select)return;const value=select.value;
  select.innerHTML=Object.entries(posePresets).map(([id,p])=>`<option value="${id}">${escapeXml(language==='ja'?`${p.ja} / ${p.en}`:p.en)}</option>`).join('');
  if(posePresets[value])select.value=value;
}

const getExportIdentity06Unsafe=getExportIdentity06;
getExportIdentity06=async function(){
  const identity=await getExportIdentity06Unsafe();
  identity.projectText=JSON.stringify(project);
  renderExportIdentity06();
  return identity;
};
renderExportIdentity06=function(){
  const box=$('exportIdentityStatus')?.querySelector('[data-export-identity]');if(!box)return;
  const currentText=JSON.stringify(project);
  if(!exportIdentityCache06||exportIdentityCache06.projectText!==currentText){box.textContent=t('exportSetPending');return}
  box.textContent=`${t('exportSetReady')}: ${exportIdentityCache06.exportId} · SHA-256 ${exportIdentityCache06.shortHash} · ${exportIdentityCache06.prefix}`;
};

const buildPngBlob06Unsafe=buildPngBlob06;
buildPngBlob06=async function(annotated){
  const blob=await buildPngBlob06Unsafe(annotated);
  if(!(blob instanceof Blob)||blob.size===0)throw new Error('PNG encoding failed');
  return blob;
};

const exportPng06Unsafe=exportPng;
exportPng=async function(annotated){try{return await exportPng06Unsafe(annotated)}catch(err){console.error(err);alert(t('exportError'))}};

function bindSafeZip07(){
  const old=$('exportZip');if(!old)return;const fresh=old.cloneNode(true);old.replaceWith(fresh);
  fresh.addEventListener('click',async()=>{try{await exportZip06()}catch(err){console.error(err);alert(t('exportError'))}});
}

installFormalHelp07();
localizeSkeletonLegend07();
renderBasePoseOptions07();
bindSafeZip07();
applyLanguage();
$('languageSelect').addEventListener('change',()=>queueMicrotask(()=>{renderBasePoseOptions07();localizeSkeletonLegend07();applyLanguage()}));
