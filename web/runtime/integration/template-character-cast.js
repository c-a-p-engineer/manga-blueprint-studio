// Template → cast → apply integration.
// Keeps template browsing non-mutating while making the characters used at apply time explicit.

Object.assign(i18n.ja,{
  starterCharacters36:'かんたん追加',
  starterCharactersHelp36:'汎用のたたき台です。追加後に名前・容姿・服装を自由に編集できます。新規作品には最初から6人入ります。',
  starterAlreadyAdded36:'追加済み',
  starterHighschoolMale36:'高校生男子',
  starterHighschoolFemale36:'高校生女子',
  starterAdultMale36:'成人男性',
  starterAdultFemale36:'成人女性',
  starterMobMale36:'モブ男性',
  starterMobFemale36:'モブ女性',
  templateCastStep36:'テンプレートを使う',
  templateCastHeading36:'使用するキャラクター',
  templateCastLead36:'カードでテンプレートを選んだあと、実際に配置するキャラクターを指定します。選ぶだけではページは変更されません。',
  templateCastPrimary36:'主役',
  templateCastSecondary36:'2人目',
  templateCastSingleHelp36:'このキャラクターをテンプレートの主役として配置します。',
  templateCastTwoHelp36:'このテンプレートは2人を同じコマへ配置します。主役と2人目を別々に選んでください。',
  templateCastChooseTemplate36:'上のカードからテンプレートを選んでください。',
  templateCastNoCharacters36:'使用できるベースキャラクターがありません。キャラタブで追加するか、標準キャラを追加してください。',
  templateCastNeedSecond36:'2人表示には別のキャラクターがもう1人必要です。',
  templateCastAddDefaults36:'標準キャラ6人を追加',
  templateCastOpenCharacters36:'キャラ設定を開く',
  templateUseWithCast36:'このキャラクターでテンプレートを使う'
});
Object.assign(i18n.en,{
  starterCharacters36:'Quick add',
  starterCharactersHelp36:'General-purpose editable starting points. Rename them and change appearance/outfit after adding. New works start with all six.',
  starterAlreadyAdded36:'Added',
  starterHighschoolMale36:'High-school boy',
  starterHighschoolFemale36:'High-school girl',
  starterAdultMale36:'Adult man',
  starterAdultFemale36:'Adult woman',
  starterMobMale36:'Male background character',
  starterMobFemale36:'Female background character',
  templateCastStep36:'Use template',
  templateCastHeading36:'Characters to use',
  templateCastLead36:'Choose a template card, then explicitly choose the character(s) it will place. Browsing and choosing characters do not change the page.',
  templateCastPrimary36:'Primary',
  templateCastSecondary36:'Second character',
  templateCastSingleHelp36:'This character will be placed as the primary character for the template.',
  templateCastTwoHelp36:'This template places two characters in the same panels. Choose a different primary and second character.',
  templateCastChooseTemplate36:'Choose a template card above first.',
  templateCastNoCharacters36:'There are no reusable base characters yet. Add one in the Character tab or add the standard starters.',
  templateCastNeedSecond36:'A two-visible template needs a second, different character.',
  templateCastAddDefaults36:'Add 6 standard characters',
  templateCastOpenCharacters36:'Open character setup',
  templateUseWithCast36:'Use template with these characters'
});

const STARTER_CHARACTER_PRESETS_36=Object.freeze({
  'starter-highschool-male':{
    label:'starterHighschoolMale36',
    ja:{summary:'高校生年代の男子。学園・日常シーン向けの汎用キャラクター。固有の顔立ちや髪型は編集前提。',outfit:'学校制服',features:''},
    en:{summary:'A high-school-age boy for general school and everyday scenes. Facial features and hairstyle are intentionally left editable.',outfit:'school uniform',features:''}
  },
  'starter-highschool-female':{
    label:'starterHighschoolFemale36',
    ja:{summary:'高校生年代の女子。学園・日常シーン向けの汎用キャラクター。固有の顔立ちや髪型は編集前提。',outfit:'学校制服',features:''},
    en:{summary:'A high-school-age girl for general school and everyday scenes. Facial features and hairstyle are intentionally left editable.',outfit:'school uniform',features:''}
  },
  'starter-adult-male':{
    label:'starterAdultMale36',
    ja:{summary:'成人男性。日常・仕事シーン向けの汎用キャラクター。年齢感や職業、髪型は作品に合わせて編集する前提。',outfit:'シンプルな日常着',features:''},
    en:{summary:'An adult man for general everyday or work scenes. Exact age, occupation, and hairstyle are intentionally left editable.',outfit:'simple everyday clothes',features:''}
  },
  'starter-adult-female':{
    label:'starterAdultFemale36',
    ja:{summary:'成人女性。日常・仕事シーン向けの汎用キャラクター。年齢感や職業、髪型は作品に合わせて編集する前提。',outfit:'シンプルな日常着',features:''},
    en:{summary:'An adult woman for general everyday or work scenes. Exact age, occupation, and hairstyle are intentionally left editable.',outfit:'simple everyday clothes',features:''}
  },
  'starter-mob-male':{
    label:'starterMobMale36',
    ja:{summary:'背景・群衆・通行人向けの男性モブ。主役より目立たない、固有特徴を抑えた汎用外見。',outfit:'シンプルな日常着',features:'目立つ固有特徴なし'},
    en:{summary:'A male background/crowd/passersby character with deliberately low visual distinctiveness so he does not compete with the main cast.',outfit:'simple everyday clothes',features:'no prominent identifying feature'}
  },
  'starter-mob-female':{
    label:'starterMobFemale36',
    ja:{summary:'背景・群衆・通行人向けの女性モブ。主役より目立たない、固有特徴を抑えた汎用外見。',outfit:'シンプルな日常着',features:'目立つ固有特徴なし'},
    en:{summary:'A female background/crowd/passersby character with deliberately low visual distinctiveness so she does not compete with the main cast.',outfit:'simple everyday clothes',features:'no prominent identifying feature'}
  }
});
const STARTER_CHARACTER_IDS_36=Object.keys(STARTER_CHARACTER_PRESETS_36);

function starterCharacter36(id){
  const preset=STARTER_CHARACTER_PRESETS_36[id];if(!preset)return null;
  const localized=preset[language]||preset.ja;
  return {
    characterId:id,
    name:t(preset.label),
    referenceKey:'',
    poseId:'stand',
    notes:'',
    identityMode:'description',
    appearance:{summary:localized.summary,hair:'',eyes:'',outfit:localized.outfit,features:localized.features||''}
  };
}
function addMissingStarterCharacters36(target=project){
  target.characterLibrary=Array.isArray(target.characterLibrary)?target.characterLibrary:[];
  const used=new Set(target.characterLibrary.map(base=>base?.characterId).filter(Boolean));
  for(const id of STARTER_CHARACTER_IDS_36){
    if(used.has(id))continue;
    const base=starterCharacter36(id);if(base){target.characterLibrary.push(base);used.add(id);}
  }
  return target;
}

// New works receive an immediately useful editable cast. Existing/imported works are left untouched.
const createProjectWithIdentityBase36=createProjectWithIdentity;
createProjectWithIdentity=function(...args){
  const next=createProjectWithIdentityBase36(...args);
  addMissingStarterCharacters36(next);
  return typeof ensureCharacterGuidance09==='function'?ensureCharacterGuidance09(next):next;
};

function addOneStarterCharacter36(id){
  const existing=project.characterLibrary?.find(base=>base.characterId===id);
  if(existing){selectedBaseCharacterId06=id;render();return existing;}
  const base=starterCharacter36(id);if(!base)return null;
  mutate(()=>{project.characterLibrary ||= [];project.characterLibrary.push(base);selectedBaseCharacterId06=id;});
  return base;
}
function addAllStarterCharactersToCurrent36(){
  mutate(()=>{
    addMissingStarterCharacters36(project);
    if(!project.characterLibrary.some(base=>base.characterId===selectedBaseCharacterId06))selectedBaseCharacterId06=project.characterLibrary[0]?.characterId||null;
  });
}

function renderStarterCharacterButtons36(){
  const box=$('starterCharacters36');if(!box)return;
  const existing=new Set((project.characterLibrary||[]).map(base=>base.characterId));
  box.innerHTML=`<div class="starter-character-copy36"><strong>${escapeXml(t('starterCharacters36'))}</strong><span>${escapeXml(t('starterCharactersHelp36'))}</span></div><div class="starter-character-grid36">${STARTER_CHARACTER_IDS_36.map(id=>{
    const preset=STARTER_CHARACTER_PRESETS_36[id],added=existing.has(id);
    return `<button type="button" data-starter-character36="${escapeXml(id)}" class="${added?'is-added':''}"><span>${escapeXml(t(preset.label))}</span>${added?`<small>✓ ${escapeXml(t('starterAlreadyAdded36'))}</small>`:''}</button>`;
  }).join('')}</div>`;
}
function injectStarterCharacterUi36(){
  const section=$('baseCharacterSection');if(!section||$('starterCharacters36'))return;
  const box=document.createElement('div');box.id='starterCharacters36';box.className='starter-characters36';
  const help=section.querySelector('.help');help?.insertAdjacentElement('afterend',box);
  box.addEventListener('click',event=>{const button=event.target.closest('[data-starter-character36]');if(button)addOneStarterCharacter36(button.dataset.starterCharacter36)});
  renderStarterCharacterButtons36();
}

let templatePrimaryCharacterId36='';
let templateSecondaryCharacterId36='';
let templateCastApplying36=false;

function selectedTemplateNeedsTwoVisible36(id=selectedTemplateId13?.()||''){
  return !!(id&&typeof isTwoVisibleTemplate27==='function'&&isTwoVisibleTemplate27(id));
}
function baseCharacterById36(id){return (project.characterLibrary||[]).find(base=>base.characterId===id)||null;}
function templateCharacterOptions36(excludeId=''){
  return (project.characterLibrary||[]).filter(base=>base&&base.characterId!==excludeId).map(base=>`<option value="${escapeXml(base.characterId)}">${escapeXml(base.name)} — ${escapeXml(base.characterId)}</option>`).join('');
}
function normalizeTemplateCastSelection36(){
  const list=(project.characterLibrary||[]).filter(Boolean);
  if(!list.some(base=>base.characterId===templatePrimaryCharacterId36)){
    const preferred=(typeof currentBaseCharacter06==='function'?currentBaseCharacter06():null);
    templatePrimaryCharacterId36=preferred?.characterId||list[0]?.characterId||'';
  }
  if(!list.some(base=>base.characterId===templateSecondaryCharacterId36)||templateSecondaryCharacterId36===templatePrimaryCharacterId36){
    templateSecondaryCharacterId36=list.find(base=>base.characterId!==templatePrimaryCharacterId36)?.characterId||'';
  }
}
function syncTemplateCastPanel36(){
  const panel=$('templateCastAction36');if(!panel)return;
  const id=selectedTemplateId13?.()||'',tpl=storyTemplates11?.[id]||null,needsTwo=selectedTemplateNeedsTwoVisible36(id),list=(project.characterLibrary||[]).filter(Boolean);
  normalizeTemplateCastSelection36();
  const title=$('templateCastSelectedTitle36'),primary=$('templatePrimaryCharacter36'),secondaryWrap=$('templateSecondaryWrap36'),secondary=$('templateSecondaryCharacter36'),status=$('templateCastStatus36'),apply=$('applyStoryTemplate11'),addDefaults=$('templateCastAddDefaults36');
  if(title)title.textContent=tpl?storyName13(id,tpl):t('templateCastChooseTemplate36');
  if(primary){primary.innerHTML=list.length?templateCharacterOptions36():`<option value="">${escapeXml(t('templateCastNoCharacters36'))}</option>`;primary.value=templatePrimaryCharacterId36||'';primary.disabled=!tpl||!list.length;}
  if(secondaryWrap)secondaryWrap.hidden=!needsTwo;
  if(secondary&&needsTwo){secondary.innerHTML=templateCharacterOptions36(templatePrimaryCharacterId36)||`<option value="">${escapeXml(t('templateCastNeedSecond36'))}</option>`;secondary.value=templateSecondaryCharacterId36||'';secondary.disabled=!tpl||list.length<2;}
  const missingStarter=STARTER_CHARACTER_IDS_36.some(starterId=>!list.some(base=>base.characterId===starterId));
  if(addDefaults)addDefaults.hidden=!missingStarter;
  let message='';
  if(!tpl)message=t('templateCastChooseTemplate36');
  else if(!list.length)message=t('templateCastNoCharacters36');
  else if(needsTwo&&!templateSecondaryCharacterId36)message=t('templateCastNeedSecond36');
  else message=needsTwo?t('templateCastTwoHelp36'):t('templateCastSingleHelp36');
  if(status)status.textContent=message;
  if(apply){apply.disabled=!tpl||!templatePrimaryCharacterId36||(needsTwo&&!templateSecondaryCharacterId36);apply.dataset.i18n='templateUseWithCast36';apply.textContent=t('templateUseWithCast36');}
}

function injectTemplateCastUi36(){
  const block=$('storyTemplateBlock11'),studio=$('templateStudio13');if(!block||!studio)return;
  const preview=$('storyTemplatePreview11');if(preview){preview.hidden=true;preview.setAttribute('aria-hidden','true');}
  if(!$('templateCastAction36')){
    const action=document.createElement('section');action.id='templateCastAction36';action.className='template-cast-action36';action.innerHTML=`
      <div class="template-cast-head36"><div><span class="template-step-label36" data-i18n="templateCastStep36"></span><h3 data-i18n="templateCastHeading36"></h3></div><strong id="templateCastSelectedTitle36"></strong></div>
      <p class="template-cast-lead36" data-i18n="templateCastLead36"></p>
      <div class="template-cast-grid36"><label><span data-i18n="templateCastPrimary36"></span><select id="templatePrimaryCharacter36"></select></label><label id="templateSecondaryWrap36" hidden><span data-i18n="templateCastSecondary36"></span><select id="templateSecondaryCharacter36"></select></label></div>
      <p id="templateCastStatus36" class="template-cast-status36"></p>
      <div class="template-cast-support36"><button id="templateCastAddDefaults36" type="button" data-i18n="templateCastAddDefaults36"></button><button id="templateCastOpenCharacters36" type="button" data-i18n="templateCastOpenCharacters36"></button></div>
      <div id="templateTextSlot36"></div><div id="templateApplySlot36"></div>`;
    studio.insertAdjacentElement('afterend',action);
    const textLabel=$('storyTemplateText11')?.closest('label');if(textLabel)$('templateTextSlot36').appendChild(textLabel);
    const apply=$('applyStoryTemplate11');if(apply)$('templateApplySlot36').appendChild(apply);
    $('templatePrimaryCharacter36')?.addEventListener('change',event=>{templatePrimaryCharacterId36=event.target.value;normalizeTemplateCastSelection36();syncTemplateCastPanel36();});
    $('templateSecondaryCharacter36')?.addEventListener('change',event=>{templateSecondaryCharacterId36=event.target.value;syncTemplateCastPanel36();});
    $('templateCastAddDefaults36')?.addEventListener('click',addAllStarterCharactersToCurrent36);
    $('templateCastOpenCharacters36')?.addEventListener('click',()=>document.querySelector('.tab[data-tab="character"]')?.click());
  }
  syncTemplateCastPanel36();
}

// During the final apply only, route the canonical template apply pipeline to the explicitly chosen cast.
const currentBaseCharacterBase36=currentBaseCharacter06;
currentBaseCharacter06=function(){
  if(templateCastApplying36){const selected=baseCharacterById36(templatePrimaryCharacterId36);if(selected)return selected;}
  return currentBaseCharacterBase36();
};
if(typeof templateBases27==='function'){
  const templateBasesBase36=templateBases27;
  templateBases27=function(){
    if(!templateCastApplying36)return templateBasesBase36();
    const primary=baseCharacterById36(templatePrimaryCharacterId36),secondary=baseCharacterById36(templateSecondaryCharacterId36);
    return [primary,secondary].filter((base,index,array)=>base&&array.findIndex(item=>item.characterId===base.characterId)===index);
  };
}

function applySelectedTemplateWithCast36(){
  const id=selectedTemplateId13?.()||'',tpl=storyTemplates11?.[id];if(!tpl){syncTemplateCastPanel36();return;}
  normalizeTemplateCastSelection36();
  const primary=baseCharacterById36(templatePrimaryCharacterId36),needsTwo=selectedTemplateNeedsTwoVisible36(id),secondary=baseCharacterById36(templateSecondaryCharacterId36);
  if(!primary){alert(t('templateCastNoCharacters36'));syncTemplateCastPanel36();return;}
  if(needsTwo&&(!secondary||secondary.characterId===primary.characterId)){alert(t('templateCastNeedSecond36'));syncTemplateCastPanel36();return;}
  templateCastApplying36=true;
  try{applyTemplatePresentation34();}
  finally{templateCastApplying36=false;syncTemplateCastPanel36();}
}
function bindTemplateCastApply36(){
  const old=$('applyStoryTemplate11');if(!old||old.dataset.templateCastBound36==='1')return;
  const fresh=old.cloneNode(true);old.replaceWith(fresh);fresh.dataset.templateCastBound36='1';fresh.addEventListener('click',applySelectedTemplateWithCast36);
}

function installTemplateCastStyles36(){
  if($('templateCastStyles36'))return;
  const style=document.createElement('style');style.id='templateCastStyles36';style.textContent=`
    #storyTemplatePreview11[hidden]{display:none!important}
    .template-cast-action36{margin:12px 0 4px;padding:13px;border:1px solid #d8e0ea;border-radius:15px;background:#f8fafc;box-shadow:0 1px 2px rgba(15,23,42,.03)}
    .template-cast-head36{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:5px}.template-cast-head36 h3{margin:2px 0 0;font-size:1rem}.template-cast-head36>strong{max-width:52%;font-size:.78rem;line-height:1.35;text-align:right;color:#334155}
    .template-step-label36{display:inline-flex;align-items:center;min-height:22px;padding:2px 8px;border-radius:999px;background:#e0e7ff;color:#3730a3;font-size:.68rem;font-weight:800}.template-cast-lead36,.template-cast-status36{margin:5px 0 9px;color:#475569;font-size:.76rem;line-height:1.45}.template-cast-status36{margin:7px 0;background:#fff;border:1px solid #e2e8f0;border-radius:10px;padding:8px 10px}
    .template-cast-grid36{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.template-cast-grid36 label{margin:0}.template-cast-grid36 select{min-height:44px}
    .template-cast-support36{display:flex;flex-wrap:wrap;gap:7px;margin:8px 0}.template-cast-support36 button{min-height:38px;font-size:.76rem}.template-cast-action36 .check-row{margin:8px 0;padding:8px 0;border-top:1px solid #e2e8f0}.template-cast-action36 #applyStoryTemplate11{min-height:48px;margin-top:4px;font-weight:800}
    .starter-characters36{margin:8px 0 12px;padding:11px;border:1px solid #d8e0ea;border-radius:14px;background:#f8fafc}.starter-character-copy36{display:grid;gap:3px;margin-bottom:8px}.starter-character-copy36 strong{font-size:.84rem}.starter-character-copy36 span{font-size:.72rem;line-height:1.4;color:#64748b}.starter-character-grid36{display:grid;grid-template-columns:repeat(auto-fit,minmax(132px,1fr));gap:7px}.starter-character-grid36 button{display:grid;justify-items:start;gap:2px;min-height:46px;padding:8px 10px;text-align:left;background:#fff}.starter-character-grid36 button.is-added{border-color:#cbd5e1;background:#f1f5f9}.starter-character-grid36 small{font-size:.65rem;color:#166534}
    @media(max-width:760px){.template-cast-action36{padding:11px}.template-cast-head36{display:grid;gap:6px}.template-cast-head36>strong{max-width:none;text-align:left}.template-cast-grid36{grid-template-columns:1fr}.template-cast-support36{display:grid;grid-template-columns:1fr 1fr}.template-cast-support36 button{min-height:44px}.starter-character-grid36{grid-template-columns:repeat(2,minmax(0,1fr))}}
    @media(max-width:390px){.template-cast-support36,.starter-character-grid36{grid-template-columns:1fr}}
  `;document.head.appendChild(style);
}

const selectTemplateBase36=selectTemplate13;
selectTemplate13=function(id){selectTemplateBase36(id);syncTemplateCastPanel36();};
const renderBase36=render;
render=function(){renderBase36();renderStarterCharacterButtons36();syncTemplateCastPanel36();};
const applyLanguageBase36=applyLanguage;
applyLanguage=function(){applyLanguageBase36();renderStarterCharacterButtons36();syncTemplateCastPanel36();};

installTemplateCastStyles36();
injectStarterCharacterUi36();
injectTemplateCastUi36();
bindTemplateCastApply36();
renderStarterCharacterButtons36();
syncTemplateCastPanel36();
