// Prototype 0.19.1: optional work-level creation brief inspired by practical manga-production workflows.
// The brief guides audience/medium/message decisions but never overrides authored page semantics.

Object.assign(i18n.ja,{
  workBrief39:'作品ブリーフ（任意）',
  workBriefHelp39:'誰に・何を・どこで見せる漫画かを作品全体の補助情報として保存します。コマ割りやセリフを勝手に変更しません。',
  workPurpose39:'用途',
  workAudience39:'想定読者',
  workMedium39:'主な媒体',
  workKeyMessage39:'一番伝えたいこと',
  workSourceNotes39:'元ネタ・素材メモ',
  workBriefPurposeStory39:'通常の漫画ストーリー',
  workBriefPurposeSocial39:'SNS投稿',
  workBriefPurposeAd39:'広告',
  workBriefPurposeLp39:'漫画LP',
  workBriefPurposeEducation39:'教育・解説',
  workBriefPurposeManual39:'マニュアル',
  workBriefPurposeOther39:'その他',
  workBriefMediumPage39:'通常の漫画ページ',
  workBriefMediumSocial39:'SNS画像',
  workBriefMediumWebtoon39:'Webtoon / 縦スクロール',
  workBriefMediumVideo39:'動画・16:9',
  workBriefMediumPrint39:'印刷',
  workBriefMediumLp39:'LP / Webページ',
  workBriefMediumOther39:'その他'
});
Object.assign(i18n.en,{
  workBrief39:'Work brief (optional)',
  workBriefHelp39:'Store who the manga is for, what it should communicate, and where it will be used. This guidance never rewrites authored panels or dialogue.',
  workPurpose39:'Purpose',
  workAudience39:'Target audience',
  workMedium39:'Primary medium',
  workKeyMessage39:'Key message',
  workSourceNotes39:'Source / material notes',
  workBriefPurposeStory39:'Regular manga story',
  workBriefPurposeSocial39:'Social post',
  workBriefPurposeAd39:'Advertisement',
  workBriefPurposeLp39:'Manga landing page',
  workBriefPurposeEducation39:'Education / explanation',
  workBriefPurposeManual39:'Manual / guide',
  workBriefPurposeOther39:'Other',
  workBriefMediumPage39:'Regular manga page',
  workBriefMediumSocial39:'Social image',
  workBriefMediumWebtoon39:'Webtoon / vertical scroll',
  workBriefMediumVideo39:'Video / 16:9',
  workBriefMediumPrint39:'Print',
  workBriefMediumLp39:'Landing page / web',
  workBriefMediumOther39:'Other'
});

function normalizeWorkBrief39(input={}){
  const source=input&&typeof input==='object'?input:{};
  return {
    purpose:String(source.purpose||''),
    targetAudience:String(source.targetAudience||''),
    outputMedium:String(source.outputMedium||''),
    keyMessage:String(source.keyMessage||''),
    sourceNotes:String(source.sourceNotes||'')
  };
}
function currentWorkBrief39(){
  project.meta ||= {};
  project.meta.workBrief=normalizeWorkBrief39(project.meta.workBrief);
  return project.meta.workBrief;
}
function workBriefHasContent39(brief=currentWorkBrief39()){
  return Object.values(brief).some(value=>String(value||'').trim());
}

const normalizeProjectBase39=normalizeProject;
normalizeProject=function(input){
  const next=normalizeProjectBase39(input);
  next.meta ||= {};
  next.meta.workBrief=normalizeWorkBrief39(next.meta.workBrief);
  return next;
};
project=normalizeProject(project);

function workBriefCopy39(key){return i18n[language]?.[key]||i18n.ja[key]||key;}
function workBriefSelectOptions39(kind){
  const rows=kind==='purpose'
    ?[['','—'],['story','workBriefPurposeStory39'],['social','workBriefPurposeSocial39'],['ad','workBriefPurposeAd39'],['lp','workBriefPurposeLp39'],['education','workBriefPurposeEducation39'],['manual','workBriefPurposeManual39'],['other','workBriefPurposeOther39']]
    :[['','—'],['page','workBriefMediumPage39'],['social','workBriefMediumSocial39'],['webtoon','workBriefMediumWebtoon39'],['video','workBriefMediumVideo39'],['print','workBriefMediumPrint39'],['lp','workBriefMediumLp39'],['other','workBriefMediumOther39']];
  return rows.map(([value,key])=>`<option value="${value}">${key==='—'?'—':escapeXml(workBriefCopy39(key))}</option>`).join('');
}
function syncWorkBriefLabels39(){
  const root=$('workBrief39');if(!root)return;
  const text=(selector,key)=>{const node=root.querySelector(selector);if(node)node.textContent=workBriefCopy39(key);};
  text('summary strong','workBrief39');text('summary span','workBriefHelp39');
  text('[data-work-brief-label="purpose"]','workPurpose39');
  text('[data-work-brief-label="audience"]','workAudience39');
  text('[data-work-brief-label="medium"]','workMedium39');
  text('[data-work-brief-label="message"]','workKeyMessage39');
  text('[data-work-brief-label="source"]','workSourceNotes39');
  const purpose=$('workBriefPurpose39'),medium=$('workBriefMedium39');
  if(purpose){const value=purpose.value;purpose.innerHTML=workBriefSelectOptions39('purpose');purpose.value=value;}
  if(medium){const value=medium.value;medium.innerHTML=workBriefSelectOptions39('medium');medium.value=value;}
}
function syncWorkBriefValues39(){
  const brief=currentWorkBrief39();
  const set=(id,value)=>{const node=$(id);if(node&&node.value!==value)node.value=value;};
  set('workBriefPurpose39',brief.purpose);
  set('workBriefAudience39',brief.targetAudience);
  set('workBriefMedium39',brief.outputMedium);
  set('workBriefMessage39',brief.keyMessage);
  set('workBriefSource39',brief.sourceNotes);
}
function ensureWorkBriefUi39(){
  if(typeof document==='undefined'||$('workBrief39'))return;
  const pagePanel=document.querySelector('.tool-panel[data-section="page"]');
  const canvasHeading=[...(pagePanel?.children||[])].find(node=>node instanceof HTMLElement&&node.dataset.i18n==='canvasSize');
  if(!pagePanel||!canvasHeading)return;
  const details=document.createElement('details');
  details.id='workBrief39';details.className='phase1-disclosure';
  details.innerHTML=`
    <summary><strong></strong><span></span></summary>
    <label><span data-work-brief-label="purpose"></span><select id="workBriefPurpose39"></select></label>
    <label><span data-work-brief-label="audience"></span><input id="workBriefAudience39" type="text" maxlength="300" placeholder="例: 30代・共働き、初心者、決裁者" /></label>
    <label><span data-work-brief-label="medium"></span><select id="workBriefMedium39"></select></label>
    <label><span data-work-brief-label="message"></span><textarea id="workBriefMessage39" rows="2" maxlength="500" placeholder="例: 最初の一歩は難しくない、と伝える"></textarea></label>
    <label><span data-work-brief-label="source"></span><textarea id="workBriefSource39" rows="3" maxlength="2000" placeholder="参考情報、原文要約、守りたい事実など"></textarea></label>`;
  canvasHeading.insertAdjacentElement('afterend',details);
  const fields=[
    ['workBriefPurpose39','purpose'],['workBriefAudience39','targetAudience'],['workBriefMedium39','outputMedium'],['workBriefMessage39','keyMessage'],['workBriefSource39','sourceNotes']
  ];
  for(const [id,key] of fields){
    $(id)?.addEventListener('change',()=>mutate(()=>{currentWorkBrief39()[key]=$(id).value;}));
  }
  syncWorkBriefLabels39();syncWorkBriefValues39();
}

const renderUiBase39=renderUi;
renderUi=function(){renderUiBase39();ensureWorkBriefUi39();syncWorkBriefValues39();};
const applyLanguageBase39=applyLanguage;
applyLanguage=function(){applyLanguageBase39();ensureWorkBriefUi39();syncWorkBriefLabels39();syncWorkBriefValues39();};
if(typeof document!=='undefined')ensureWorkBriefUi39();

const renderBriefObjectBase39=renderBriefObject30;
renderBriefObject30=function(){
  const brief=renderBriefObjectBase39();
  brief.workBrief=normalizeWorkBrief39(project.meta?.workBrief);
  return brief;
};
const renderBriefTextBase39=renderBriefText30;
renderBriefText30=function(){
  const base=renderBriefTextBase39(),brief=normalizeWorkBrief39(project.meta?.workBrief);
  if(!workBriefHasContent39(brief))return base;
  const line=(label,value)=>value?`- ${label}: ${String(value).trim()}`:null;
  const extra=[
    'WORK BRIEF — GUIDANCE ONLY:',
    line('Purpose',brief.purpose),
    line('Target audience',brief.targetAudience),
    line('Primary medium',brief.outputMedium),
    line('Key message',brief.keyMessage),
    line('Source/material notes',brief.sourceNotes),
    '- Use this brief to guide emphasis, tone, and suitability for the intended reader/medium.',
    '- The work brief MUST NOT override authored panel geometry, cast, action, exact dialogue/SFX, or the strict visible-text allowlist.'
  ].filter(Boolean);
  return `${base}\n\n${extra.join('\n')}`;
};

if(typeof exportManifest08==='function'){
  const exportManifestBase39=exportManifest08;
  exportManifest08=function(identity,packageType,files){
    const manifest=exportManifestBase39(identity,packageType,files);
    manifest.workBrief=normalizeWorkBrief39(project.meta?.workBrief);
    return manifest;
  };
}

globalThis.workBriefContract39={normalize:normalizeWorkBrief39,current:currentWorkBrief39,hasContent:workBriefHasContent39};
