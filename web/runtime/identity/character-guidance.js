// Prototype 0.7: manifest-first handoff, optional Character Sheets, appearance guidance,
// richer Smart Manga genres/intensity, visual template/camera aids, and guided background/balloon presets.
const HELP_SEEN_KEY_07='manga-blueprint-studio/help-seen/0.7';

Object.assign(i18n.ja,{
  identityMode:'見た目の指定方法',identityModeSheet:'Character Sheetを使う',identityModeDescription:'容姿を文章で指定',identityModeFree:'Character Sheetなし・AIにおまかせ',
  appearanceSummary:'どんな子？（容姿・雰囲気）',appearanceSummaryHelp:'Character Sheetがなくても、ここに書いた内容をmanifestと生成Promptへ渡します。',appearanceSummaryPlaceholder:'例: 20代くらい。金髪ボブ、赤い眼鏡、活発で親しみやすい雰囲気。',appearanceDetails:'容姿を詳しく指定',appearanceHair:'髪',appearanceEyes:'目',appearanceOutfit:'服装',appearanceFeatures:'特徴',
  identityReadySheet:'Character Sheetを別途添付してください',identityReadyDescription:'Character Sheet不要。容姿説明を使います',identityReadyFree:'Character Sheet不要。見た目はAIに任せます',identityMissingKey:'Character Sheetを使う設定ですが参照キーが未入力です',
  handoffHeading:'AIへ渡すとき',handoffCopy:'AIへ渡す文をコピー',handoffCopied:'コピーしました',handoffHelp:'ZIPを添付するときは、この短い文を一緒に送れば十分です。',characterHandoffHeading:'キャラクター対応表',characterHandoffEmpty:'このページには配置済みキャラクターがありません。',
  smartIntensity:'おまかせ強度',smartIntensityStable:'安定 — 破綻しにくい構図を優先',smartIntensityStandard:'標準 — 漫画らしい変化をバランス良く',smartIntensityBold:'大胆 — 寄り・傾き・効果線を強める',
  purposeRomance:'ラブコメ',purposeCute:'かわいい',purposeSuspense:'緊張・不穏',purposeIntro:'キャラ紹介',
  layoutVisuals:'コマ割りを見て選ぶ',layoutVisualsHelp:'図をタップして候補を選び、「このコマ割りを使う」で適用します。',applyLayoutVisual:'このコマ割りを使う',
  cameraVisual:'カメラの見え方',cameraVisualHelp:'選択中の距離・角度を簡易図で確認できます。実際の生成結果はポーズや画面比率でも変わります。',
  backgroundScenePreset:'背景プリセット',backgroundApplyPreset:'背景プリセットを適用',backgroundPresetNone:'選択してください',
  balloonPreset:'吹き出しプリセット',balloonApplyPreset:'吹き出しを追加/適用',
  guideIdentity:'Character Sheetがない場合',guideIdentityBody:'ベースキャラは「Character Sheet」「容姿を文章で指定」「AIにおまかせ」から選べます。Character Sheetを使う場合だけ別途画像を添付します。',
  guideHandoff:'AIへの渡し方',guideHandoffBody:'AI生成用ZIPを添付し、「ZIPを展開して最初にmanifestを読んで」と伝えれば、manifestがclean PNG・JSON・Prompt・Character Sheet要否を案内します。',
  guideVisualAids:'見て選べる補助',guideVisualAidsBody:'コマ割りサムネイルとカメラ見本図を使い、専門用語だけに頼らず構図を選べます。',
  guideCharactersBody:'ベースキャラは名前・Character ID・初期ポーズに加え、Character Sheet、文章の容姿指定、またはAIおまかせの見た目方針を保存して使い回せます。',
  guideBackgroundBody:'場所・天気・雰囲気は候補から選ぶか自由入力できます。背景プリセットで一式を入れた後、各項目を自由に直せます。',
  workflowHintBody:'① おまかせ漫画/テンプレート → ② ベースキャラの見た目を決める → ③ 気になるコマだけ🎲調整 → ④ AI生成用ZIP＋必要ならCharacter Sheet',
  aiZipHelp:'ZIP内: AI用クリーンPNG / prompt.txt / .manga.json / manifest.json。manifestがファイル役割とCharacter Sheet要否を案内します。'
});
Object.assign(i18n.en,{
  identityMode:'Visual identity source',identityModeSheet:'Use a Character Sheet',identityModeDescription:'Describe appearance in text',identityModeFree:'No Character Sheet — let AI design appearance',
  appearanceSummary:'What does this character look/feel like?',appearanceSummaryHelp:'When no Character Sheet is used, this description is carried into the manifest and generation prompt.',appearanceSummaryPlaceholder:'Example: young adult, blonde bob, red glasses, energetic and approachable.',appearanceDetails:'Detailed appearance',appearanceHair:'Hair',appearanceEyes:'Eyes',appearanceOutfit:'Outfit',appearanceFeatures:'Distinctive features',
  identityReadySheet:'Attach the Character Sheet separately',identityReadyDescription:'No Character Sheet required; text appearance guidance will be used',identityReadyFree:'No Character Sheet required; appearance is left to the AI',identityMissingKey:'Character Sheet mode is selected but the reference key is empty',
  handoffHeading:'When sending to AI',handoffCopy:'Copy AI handoff message',handoffCopied:'Copied',handoffHelp:'Attach the ZIP and send this short message with it.',characterHandoffHeading:'Character identity map',characterHandoffEmpty:'No characters are placed on this page.',
  smartIntensity:'Smart Manga intensity',smartIntensityStable:'Stable — prefer conservative readable direction',smartIntensityStandard:'Standard — balanced manga variation',smartIntensityBold:'Bold — stronger close-ups, tilts, and effects',
  purposeRomance:'Rom-com',purposeCute:'Cute',purposeSuspense:'Tension / suspense',purposeIntro:'Character introduction',
  layoutVisuals:'Choose layout visually',layoutVisualsHelp:'Tap a diagram to select it, then press “Use this layout”.',applyLayoutVisual:'Use this layout',
  cameraVisual:'Camera preview',cameraVisualHelp:'A simple diagram for the selected distance and angle. Final generation also depends on pose and aspect ratio.',
  backgroundScenePreset:'Background preset',backgroundApplyPreset:'Apply background preset',backgroundPresetNone:'Choose a preset',
  balloonPreset:'Balloon preset',balloonApplyPreset:'Add / apply balloon preset',
  guideIdentity:'When there is no Character Sheet',guideIdentityBody:'A base character can use a Character Sheet, a text appearance description, or leave appearance open to the AI. Only Character Sheet mode requires a separate image attachment.',
  guideHandoff:'AI handoff',guideHandoffBody:'Attach the AI generation ZIP and say “extract the ZIP and read the manifest first.” The manifest identifies the clean PNG, JSON, prompt, and whether Character Sheets are required.',
  guideVisualAids:'Visual selection aids',guideVisualAidsBody:'Layout thumbnails and the camera preview help choose composition without relying on jargon alone.',
  guideCharactersBody:'Base characters store name, Character ID, default pose, and one visual-identity policy: Character Sheet, text appearance guidance, or AI-designed appearance.',
  guideBackgroundBody:'Location, weather, and mood remain free text. Scene presets can fill a useful starting combination, then every field remains editable.',
  workflowHintBody:'1) Smart Manga / template → 2) choose base-character appearance source → 3) re-roll only panels that need it → 4) AI generation ZIP + Character Sheets only when required',
  aiZipHelp:'ZIP: clean AI PNG / prompt.txt / .manga.json / manifest.json. The manifest explains file roles and Character Sheet requirements.'
});

const appearanceLists09={
  hair:{ja:['黒髪ショート','黒髪ロング','茶髪ボブ','金髪ショート','金髪ロング','銀髪','赤髪','ピンク髪','ツインテール','ポニーテール'],en:['short black hair','long black hair','brown bob','short blonde hair','long blonde hair','silver hair','red hair','pink hair','twin tails','ponytail']},
  eyes:{ja:['黒い目','茶色い目','青い目','緑の目','赤い目','金色の目','たれ目','つり目'],en:['black eyes','brown eyes','blue eyes','green eyes','red eyes','golden eyes','droopy eyes','sharp upturned eyes']},
  outfit:{ja:['制服','カジュアル','パーカー','ワンピース','スーツ','スポーツウェア','和服','ファンタジー衣装'],en:['school uniform','casual clothes','hoodie','dress','suit','sportswear','traditional Japanese clothing','fantasy outfit']},
  features:{ja:['眼鏡','そばかす','ほくろ','八重歯','ヘアピン','ピアス','帽子','リボン'],en:['glasses','freckles','beauty mark','fang tooth','hair pin','earrings','hat','ribbon']}
};

function normalizeAppearance09(value){const a=value&&typeof value==='object'?value:{};return{summary:String(a.summary||''),hair:String(a.hair||''),eyes:String(a.eyes||''),outfit:String(a.outfit||''),features:String(a.features||'')}}
function ensureCharacterGuidance09(p){
  p.characterLibrary=Array.isArray(p.characterLibrary)?p.characterLibrary:[];
  for(const base of p.characterLibrary){
    base.identityMode=['sheet','description','free'].includes(base.identityMode)?base.identityMode:(base.referenceKey?'sheet':'description');
    base.appearance=normalizeAppearance09(base.appearance);
  }
  p.meta ||= {};p.meta.randomIntensity=['stable','standard','bold'].includes(p.meta.randomIntensity)?p.meta.randomIntensity:'standard';
  return p;
}
const normalizeProject08=normalizeProject;
normalizeProject=function(input){return ensureCharacterGuidance09(normalizeProject08(input))};
project=normalizeProject(project);

function appearanceText09(base){
  const a=normalizeAppearance09(base?.appearance),parts=[];
  if(a.summary.trim())parts.push(a.summary.trim());
  if(a.hair.trim())parts.push(`${language==='ja'?'髪':'hair'}=${a.hair.trim()}`);
  if(a.eyes.trim())parts.push(`${language==='ja'?'目':'eyes'}=${a.eyes.trim()}`);
  if(a.outfit.trim())parts.push(`${language==='ja'?'服装':'outfit'}=${a.outfit.trim()}`);
  if(a.features.trim())parts.push(`${language==='ja'?'特徴':'features'}=${a.features.trim()}`);
  return parts.join(language==='ja'?'、':'; ');
}
function usedBaseCharacters09(){
  const ids=[];for(const p of currentPage().panels)for(const ch of p.characters||[])if(ch.characterId&&!ids.includes(ch.characterId))ids.push(ch.characterId);
  return ids.map(id=>project.characterLibrary.find(b=>b.characterId===id)).filter(Boolean);
}
function characterGuidance09(base){
  const mode=base.identityMode||'description',appearance=appearanceText09(base),required=mode==='sheet',referenceKey=String(base.referenceKey||'').trim();
  return{characterId:base.characterId,displayName:base.name,identityMode:mode,referenceKey,appearance:normalizeAppearance09(base.appearance),appearanceText:appearance,characterSheet:{required,included:false,referenceKey,status:required?(referenceKey?'attach-separately':'missing-reference-key'):'not-required'}};
}
function characterStatusText09(base){
  if(base.identityMode==='sheet')return base.referenceKey?`${t('identityReadySheet')}: ${base.referenceKey}`:t('identityMissingKey');
  if(base.identityMode==='free')return t('identityReadyFree');
  const detail=appearanceText09(base);return detail?`${t('identityReadyDescription')}: ${detail}`:t('identityReadyDescription');
}

function ensureAppearanceDatalists09(){
  const fields={baseAppearanceHair09:'hair',baseAppearanceEyes09:'eyes',baseAppearanceOutfit09:'outfit',baseAppearanceFeatures09:'features'};
  for(const [inputId,key] of Object.entries(fields)){
    const input=$(inputId);if(!input)continue;const listId=`appearance_${key}_09`;input.setAttribute('list',listId);let list=$(listId);if(!list){list=document.createElement('datalist');list.id=listId;document.body.appendChild(list)}
    list.innerHTML=(appearanceLists09[key][language]||appearanceLists09[key].ja).map(v=>`<option value="${escapeXml(v)}"></option>`).join('');
  }
}

function injectCharacterGuidanceUi09(){
  const inspector=$('baseCharacterInspector');if(!inspector||$('characterGuidance09'))return;
  const reference=$('baseCharacterReferenceKey')?.closest('label');const box=document.createElement('div');box.id='characterGuidance09';box.className='character-guidance';box.innerHTML=`
    <label><span data-i18n="identityMode">見た目の指定方法</span><select id="baseIdentityMode09"><option value="sheet" data-i18n="identityModeSheet">Character Sheetを使う</option><option value="description" data-i18n="identityModeDescription">容姿を文章で指定</option><option value="free" data-i18n="identityModeFree">Character Sheetなし・AIにおまかせ</option></select></label>
    <div id="identityStatus09" class="identity-status"></div>
    <label><span data-i18n="appearanceSummary">どんな子？（容姿・雰囲気）</span><textarea id="baseAppearanceSummary09" rows="3" data-i18n-placeholder="appearanceSummaryPlaceholder"></textarea><small data-i18n="appearanceSummaryHelp"></small></label>
    <details id="appearanceDetails09"><summary data-i18n="appearanceDetails">容姿を詳しく指定</summary><div class="appearance-grid">
      <label><span data-i18n="appearanceHair">髪</span><input id="baseAppearanceHair09" type="text" /></label>
      <label><span data-i18n="appearanceEyes">目</span><input id="baseAppearanceEyes09" type="text" /></label>
      <label><span data-i18n="appearanceOutfit">服装</span><input id="baseAppearanceOutfit09" type="text" /></label>
      <label><span data-i18n="appearanceFeatures">特徴</span><input id="baseAppearanceFeatures09" type="text" /></label>
    </div></details>`;
  reference?.insertAdjacentElement('afterend',box);ensureAppearanceDatalists09();
}

const renderBaseCharacters08=renderBaseCharacters06;
renderBaseCharacters06=function(){
  ensureCharacterGuidance09(project);renderBaseCharacters08();const base=currentBaseCharacter06();
  if(!base||!$('baseIdentityMode09'))return;
  $('baseIdentityMode09').value=base.identityMode;$('baseAppearanceSummary09').value=base.appearance.summary;$('baseAppearanceHair09').value=base.appearance.hair;$('baseAppearanceEyes09').value=base.appearance.eyes;$('baseAppearanceOutfit09').value=base.appearance.outfit;$('baseAppearanceFeatures09').value=base.appearance.features;
  const sheetMode=base.identityMode==='sheet';$('baseCharacterReferenceKey').disabled=!sheetMode;$('baseAppearanceSummary09').disabled=base.identityMode==='free';$('appearanceDetails09').style.opacity=base.identityMode==='free'?'.55':'1';
  const status=$('identityStatus09');status.textContent=characterStatusText09(base);status.dataset.state=sheetMode&&!base.referenceKey?'warning':'ok';
};

function updateBaseAppearance09(field,value){const base=currentBaseCharacter06();if(!base)return;mutate(()=>{base.appearance=normalizeAppearance09(base.appearance);base.appearance[field]=value.trim()})}
function bindCharacterGuidance09(){
  $('baseIdentityMode09')?.addEventListener('change',()=>{const base=currentBaseCharacter06();if(base)mutate(()=>{base.identityMode=$('baseIdentityMode09').value})});
  $('baseAppearanceSummary09')?.addEventListener('change',()=>updateBaseAppearance09('summary',$('baseAppearanceSummary09').value));
  $('baseAppearanceHair09')?.addEventListener('change',()=>updateBaseAppearance09('hair',$('baseAppearanceHair09').value));
  $('baseAppearanceEyes09')?.addEventListener('change',()=>updateBaseAppearance09('eyes',$('baseAppearanceEyes09').value));
  $('baseAppearanceOutfit09')?.addEventListener('change',()=>updateBaseAppearance09('outfit',$('baseAppearanceOutfit09').value));
  $('baseAppearanceFeatures09')?.addEventListener('change',()=>updateBaseAppearance09('features',$('baseAppearanceFeatures09').value));
}

// Expand bounded Smart Manga with additional intents and an explicit intensity control.
Object.assign(smartPurposeLabels08,{romance:['ラブコメ','Rom-com'],cute:['かわいい','Cute'],suspense:['緊張・不穏','Suspense'],intro:['キャラ紹介','Character intro']});
Object.assign(smartPurposeLayouts08,{romance:['conversation','four-grid','three-vertical','climax'],cute:['three-vertical','four-grid','conversation'],suspense:['action3','climax','three-vertical'],intro:['single','three-vertical','climax']});
Object.assign(smartProfiles08,{
  romance:[
    {role:'setup',camera:['long','eye-level','three-quarter-front'],pose:'stand',expression:'neutral',gaze:'other-character',effect:'none',background:'normal'},
    {role:'reaction',camera:['medium','eye-level','three-quarter-front'],pose:'lookback',expression:'smile',gaze:'other-character',effect:'none',background:'selective-detail'},
    {role:'beat',camera:['close','eye-level','three-quarter-front'],pose:'stand',expression:'shy',gaze:'away',effect:'silence',background:'blur'},
    {role:'climax',camera:['close','eye-level','three-quarter-front'],pose:'lookback',expression:'shy',gaze:'other-character',effect:'focus',background:'selective-detail'}
  ],
  cute:[
    {role:'setup',camera:['medium','eye-level','three-quarter-front'],pose:'stand',expression:'smile',gaze:'camera',effect:'none',background:'normal'},
    {role:'reaction',camera:['close','eye-level','three-quarter-front'],pose:'lookback',expression:'shy',gaze:'camera',effect:'none',background:'blur'},
    {role:'beat',camera:['close','high-angle','front'],pose:'crouch',expression:'surprised',gaze:'camera',effect:'silence',background:'white'},
    {role:'climax',camera:['close','eye-level','front'],pose:'stand',expression:'smile',gaze:'camera',effect:'focus',background:'selective-detail'}
  ],
  suspense:[
    {role:'setup',camera:['extreme-long','high-angle','front'],pose:'stand',expression:'neutral',gaze:'away',effect:'none',background:'normal'},
    {role:'transition',camera:['medium','dutch-angle','three-quarter-back'],pose:'lookback',expression:'fear',gaze:'away',effect:'tension',background:'selective-detail'},
    {role:'reaction',camera:['close','eye-level','three-quarter-front'],pose:'crouch',expression:'fear',gaze:'other-character',effect:'silence',background:'black'},
    {role:'climax',camera:['extreme-close','dutch-angle','near-object'],pose:'lookback',expression:'surprised',gaze:'camera',effect:'impact',background:'focus-lines'}
  ],
  intro:[
    {role:'exposition',camera:['long','eye-level','three-quarter-front'],pose:'stand',expression:'neutral',gaze:'camera',effect:'none',background:'normal'},
    {role:'setup',camera:['medium','eye-level','three-quarter-front'],pose:'stand',expression:'smile',gaze:'camera',effect:'none',background:'selective-detail'},
    {role:'reaction',camera:['close','eye-level','three-quarter-front'],pose:'lookback',expression:'smirk',gaze:'camera',effect:'none',background:'blur'},
    {role:'climax',camera:['close','low-angle','three-quarter-front'],pose:'stand',expression:'smile',gaze:'camera',effect:'focus',background:'selective-detail'}
  ]
});
resolvedPurpose08=function(requested,rng){return requested==='auto'?pickSeeded08(rng,['action','conversation','gag','daily','climax','romance','cute','suspense','intro']):requested};

function currentSmartIntensity09(){return $('randomDialog')?.open?($('randomIntensity09')?.value||'standard'):(project.meta.randomIntensity||'standard')}
const profileBeat08Base09=profileBeat08;
profileBeat08=function(purpose,index,total,variant,rng){
  const beat=profileBeat08Base09(purpose,index,total,variant,rng),intensity=currentSmartIntensity09();
  if(intensity==='stable'){
    if(beat.camera[0]==='extreme-close')beat.camera[0]='close';if(['dutch-angle','worms-eye'].includes(beat.camera[1]))beat.camera[1]='eye-level';if(beat.effect==='impact')beat.effect='focus';beat.breakout='none';
  }else if(intensity==='bold'){
    if(beat.role==='climax'||index===total-1){beat.camera[0]=['action','climax','suspense'].includes(purpose)?'extreme-close':'close';beat.camera[1]=['action','climax','suspense'].includes(purpose)?pickSeeded08(rng,['low-angle','dutch-angle']):beat.camera[1];beat.effect=beat.effect==='none'?'focus':'impact';beat.breakout=['action','climax','suspense'].includes(purpose)?'foreground':'character';}
    else if(purpose==='suspense'&&index>0)beat.camera[1]='dutch-angle';
  }
  beat.intensity=intensity;return beat;
};
const applyBeat08Base09=applyBeat08;
applyBeat08=function(panel,beat,options){applyBeat08Base09(panel,beat,options);if(Object.prototype.hasOwnProperty.call(beat,'breakout'))panel.style.breakout=beat.breakout};

function installSmartIntensity09(){
  const controls=document.querySelector('.smart-controls');if(!controls||$('randomIntensity09'))return;
  const label=document.createElement('label');label.innerHTML=`<span data-i18n="smartIntensity">おまかせ強度</span><select id="randomIntensity09"><option value="stable" data-i18n="smartIntensityStable">安定</option><option value="standard" data-i18n="smartIntensityStandard">標準</option><option value="bold" data-i18n="smartIntensityBold">大胆</option></select>`;controls.insertAdjacentElement('afterbegin',label);
  const purpose=$('randomPurpose');for(const [value,key] of [['romance','purposeRomance'],['cute','purposeCute'],['suspense','purposeSuspense'],['intro','purposeIntro']])if(!purpose.querySelector(`option[value="${value}"]`)){const o=document.createElement('option');o.value=value;o.dataset.i18n=key;o.textContent=t(key);purpose.appendChild(o)}
  $('randomIntensity09').value=project.meta.randomIntensity||'standard';
}
const buildSmartCandidates08Base09=buildSmartCandidates08;
buildSmartCandidates08=function(){buildSmartCandidates08Base09();const intensity=$('randomIntensity09')?.value||'standard';smartCandidates08.forEach(c=>c.intensity=intensity);renderSmartCandidates08()};
const renderSmartCandidates08Base09=renderSmartCandidates08;
renderSmartCandidates08=function(){renderSmartCandidates08Base09();document.querySelectorAll('.smart-candidate').forEach((card,i)=>{const c=smartCandidates08[i],title=card.querySelector('.smart-title');if(!c||!title)return;let badge=title.querySelector('.intensity-badge09');if(!badge){badge=document.createElement('span');badge.className='intensity-badge09';title.appendChild(badge)}badge.textContent=language==='ja'?({stable:'安定',standard:'標準',bold:'大胆'}[c.intensity]||'標準'):({stable:'Stable',standard:'Standard',bold:'Bold'}[c.intensity]||'Standard')})};
const applySmartCandidate08Base09=applySmartCandidate08;
applySmartCandidate08=function(index){const c=smartCandidates08[index];applySmartCandidate08Base09(index);if(c&&!$('randomDialog').open&&project.meta.randomSeed===c.baseSeed){project.meta.randomIntensity=c.intensity||'standard';render()}};

function randomizeSelectedPanel09(){
  const panel=selectedPanel();if(!panel)return;const allowed=['action','conversation','gag','daily','climax','fourkoma','romance','cute','suspense','intro'],purpose=allowed.includes(project.meta.randomPurpose)?project.meta.randomPurpose:'daily',roleIndex={setup:0,exposition:0,transition:1,reaction:2,beat:2,climax:3,afterglow:3}[panel.role]??1,seed=`${project.meta.randomSeed||'panel'}|${panel.id}|${Date.now()}|${Math.random()}`,rng=seededRandom08(seed),variant=pickSeeded08(rng,['balanced','dynamic','emotion']),beat=profileBeat08(purpose,roleIndex,4,variant,rng);
  mutate(()=>{applyBeat08(panel,beat,{characters:true,preserveRole:true,background:false});panel.assistSeed=seed});
}

// Stronger at-a-glance panel summaries without storing another source of truth.
const expressionLabels09={neutral:['無表情','Neutral'],smile:['笑顔','Smile'],shy:['照れ','Shy'],angry:['怒り','Angry'],surprised:['驚き','Surprised'],sad:['悲しみ','Sad'],fear:['恐怖','Fear'],smirk:['ニヤリ','Smirk'],sleepy:['眠そう','Sleepy']};
const gazeLabels09={camera:['こちらを見る','at camera'],'other-character':['相手を見る','at other character'],down:['下を見る','down'],up:['上を見る','up'],away:['視線を外す','away'],closed:['目を閉じる','eyes closed'],custom:['自由視線','custom gaze']};
panelSummary04=function(panel){
  const idx=language==='ja'?0:1,parts=[roleLabels04[panel.role]?.[idx]||panel.role];
  if(panel.characters?.length){const ch=panel.characters[0],pose=(posePresets[ch.poseId]||posePresets.stand),poseText=language==='ja'?pose.ja:pose.en,exp=expressionLabels09[ch.expression?.type]?.[idx]||ch.expression?.type||'',gaze=gazeLabels09[ch.gaze?.target]?.[idx]||ch.gaze?.target||'';parts.push(`${poseText}${exp?`・${exp}`:''}${gaze?`・${gaze}`:''}${panel.characters.length>1?(language==='ja'?`＋他${panel.characters.length-1}人`:` +${panel.characters.length-1} more`):''}`)}else parts.push(language==='ja'?'人物なし':'No character');
  const dist=cameraDistanceOptions04.find(x=>x[0]===panel.camera.distance),angle=cameraAngleOptions04.find(x=>x[0]===panel.camera.angle);if(dist||angle)parts.push([dist?(language==='ja'?dist[1].split(' — ')[0]:dist[2].split(' — ')[0]):'',angle?(language==='ja'?angle[1].split(' — ')[0]:angle[2].split(' — ')[0]):''].filter(Boolean).join('・'));
  if(panel.background?.location)parts.push(`🌆 ${panel.background.location}${panel.background.timeOfDay?`・${panel.background.timeOfDay}`:''}`);if(panel.balloons?.length){const text=panel.balloons.find(b=>b.text?.trim())?.text?.trim();parts.push(`💬${panel.balloons.length}${text?`「${text.slice(0,12)}${text.length>12?'…':''}」`:''}`)}if(panel.effects?.lineEffect&&panel.effects.lineEffect!=='none')parts.push(effectLabels04[panel.effects.lineEffect]?.[idx]||panel.effects.lineEffect);if(panel.style?.breakout&&panel.style.breakout!=='none')parts.push(language==='ja'?'ブチ抜き':'Breakout');return parts.join('｜');
};

function layoutThumbnailSvg09(id){const w=180,h=240,rects=layoutRects04(id,w,h),order=previewOrder08(rects);return `<svg viewBox="0 0 ${w} ${h}" aria-hidden="true">${rects.map(r=>`<rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" rx="4"/><text x="${r.x+r.w/2}" y="${r.y+r.h/2}">${order.get(r)}</text>`).join('')}</svg>`}
function renderLayoutThumbnails09(){const host=$('layoutThumbnailGrid09');if(!host)return;const selected=$('templateSelect').value;host.innerHTML=Object.entries(layoutPresets04).map(([id,p])=>`<button type="button" class="layout-thumb09 ${id===selected?'active':''}" data-layout-thumb09="${id}"><span>${layoutThumbnailSvg09(id)}</span><strong>${escapeXml(language==='ja'?p.ja:p.en)}</strong></button>`).join('')}
function installLayoutThumbnails09(){const help=$('layoutHelp');if(!help||$('layoutVisual09'))return;const box=document.createElement('div');box.id='layoutVisual09';box.innerHTML=`<div class="subhead" data-i18n="layoutVisuals">コマ割りを見て選ぶ</div><p class="help" data-i18n="layoutVisualsHelp"></p><div id="layoutThumbnailGrid09" class="layout-thumbnails09"></div><button id="applyLayoutVisual09" type="button" class="full" data-i18n="applyLayoutVisual">このコマ割りを使う</button>`;help.insertAdjacentElement('afterend',box);renderLayoutThumbnails09()}

function cameraDiagramSvg09(panel){
  if(!panel)return'';const distance=panel.camera.distance,angle=panel.camera.angle,scale={ 'extreme-long':.28,long:.55,medium:.9,close:1.35,'extreme-close':2.1}[distance]||.9,cy=92+(angle==='high-angle'||angle==='birds-eye'?-8:angle==='low-angle'||angle==='worms-eye'?10:0),rot=angle==='dutch-angle'?-10:0;
  return `<svg viewBox="0 0 240 140" role="img" aria-label="${escapeXml(t('cameraVisual'))}"><defs><clipPath id="cameraCrop09"><rect x="8" y="8" width="224" height="124" rx="8"/></clipPath></defs><rect x="8" y="8" width="224" height="124" rx="8" class="camera-frame09"/><g clip-path="url(#cameraCrop09)" transform="rotate(${rot} 120 70)"><line x1="20" y1="${cy+28}" x2="220" y2="${cy+28+(angle==='low-angle'?-15:angle==='high-angle'?15:0)}" class="camera-horizon09"/><g transform="translate(120 ${cy}) scale(${scale})"><circle cx="0" cy="-38" r="13" class="camera-person09"/><line x1="0" y1="-25" x2="0" y2="24" class="camera-body09"/><line x1="-23" y1="-8" x2="23" y2="-8" class="camera-body09"/><line x1="0" y1="24" x2="-18" y2="58" class="camera-body09"/><line x1="0" y1="24" x2="18" y2="58" class="camera-body09"/></g></g><text x="16" y="24" class="camera-caption09">${escapeXml(language==='ja'?(cameraDistanceOptions04.find(x=>x[0]===distance)?.[1]?.split(' — ')[0]||distance):(cameraDistanceOptions04.find(x=>x[0]===distance)?.[2]?.split(' — ')[0]||distance))}</text><text x="224" y="124" text-anchor="end" class="camera-caption09">${escapeXml(language==='ja'?(cameraAngleOptions04.find(x=>x[0]===angle)?.[1]?.split(' — ')[0]||angle):(cameraAngleOptions04.find(x=>x[0]===angle)?.[2]?.split(' — ')[0]||angle))}</text></svg>`;
}
function renderCameraVisual09(){const host=$('cameraVisual09');if(host)host.innerHTML=cameraDiagramSvg09(selectedPanel())}
function installCameraVisual09(){const help=$('cameraHelp');if(!help||$('cameraVisualWrap09'))return;const box=document.createElement('div');box.id='cameraVisualWrap09';box.className='camera-visual-wrap09';box.innerHTML=`<strong data-i18n="cameraVisual">カメラの見え方</strong><div id="cameraVisual09"></div><small data-i18n="cameraVisualHelp"></small>`;help.insertAdjacentElement('afterend',box);renderCameraVisual09()}

const backgroundScenePresets09={
  classroomDay:{ja:'教室・昼・自然',en:'Classroom — day',data:{location:'学校の教室',timeOfDay:'day',weather:'晴れ',mood:'明るい',detailLevel:'medium',renderMode:'normal'}},
  classroomEvening:{ja:'教室・夕方・余韻',en:'Classroom — evening',data:{location:'学校の教室',timeOfDay:'evening',weather:'晴れ',mood:'静か',detailLevel:'medium',renderMode:'selective-detail'}},
  rooftopSunset:{ja:'屋上・夕方・ドラマ',en:'Rooftop — sunset',data:{location:'屋上',timeOfDay:'evening',weather:'晴れ',mood:'柔らかい',detailLevel:'medium',renderMode:'normal'}},
  bedroomNight:{ja:'寝室・夜・静か',en:'Bedroom — night',data:{location:'寝室',timeOfDay:'night',weather:'',mood:'静か',detailLevel:'low',renderMode:'selective-detail'}},
  stationRain:{ja:'駅・雨・寂しい',en:'Station — rain',data:{location:'駅のホーム',timeOfDay:'evening',weather:'雨',mood:'寂しい',detailLevel:'medium',renderMode:'normal'}},
  alleyRain:{ja:'路地裏・雨・不穏',en:'Back alley — rain',data:{location:'路地裏',timeOfDay:'night',weather:'雨',mood:'不穏',detailLevel:'medium',renderMode:'normal'}},
  cafeDay:{ja:'カフェ・昼・柔らかい',en:'Cafe — day',data:{location:'カフェ',timeOfDay:'day',weather:'晴れ',mood:'柔らかい',detailLevel:'medium',renderMode:'selective-detail'}},
  parkEvening:{ja:'公園・夕方・穏やか',en:'Park — evening',data:{location:'公園',timeOfDay:'evening',weather:'晴れ',mood:'静か',detailLevel:'medium',renderMode:'normal'}},
  white:{ja:'白背景・感情優先',en:'White background — emotion first',data:{location:'',timeOfDay:'',weather:'',mood:'',detailLevel:'none',renderMode:'white'}},
  speed:{ja:'スピード線・アクション',en:'Speed-line action',data:{location:'',timeOfDay:'',weather:'',mood:'激しい',detailLevel:'low',renderMode:'speed-lines'}},
  focus:{ja:'集中線・決め',en:'Focus-line climax',data:{location:'',timeOfDay:'',weather:'',mood:'強い',detailLevel:'low',renderMode:'focus-lines'}}
};
function renderBackgroundPreset09(){const select=$('backgroundScenePreset09');if(!select)return;const current=select.value;select.innerHTML=`<option value="">${escapeXml(t('backgroundPresetNone'))}</option>${Object.entries(backgroundScenePresets09).map(([id,p])=>`<option value="${id}">${escapeXml(language==='ja'?p.ja:p.en)}</option>`).join('')}`;select.value=backgroundScenePresets09[current]?current:''}
function installBackgroundPreset09(){const section=document.querySelector('.tool-panel[data-section="background"]');if(!section||$('backgroundPreset09'))return;const box=document.createElement('div');box.id='backgroundPreset09';box.className='preset-action09';box.innerHTML=`<label><span data-i18n="backgroundScenePreset">背景プリセット</span><select id="backgroundScenePreset09"></select></label><button id="applyBackgroundPreset09" type="button" data-i18n="backgroundApplyPreset">背景プリセットを適用</button>`;section.querySelector('#backgroundComboHelp')?.insertAdjacentElement('afterend',box);renderBackgroundPreset09()}
function applyBackgroundPreset09(){const panel=selectedPanel(),preset=backgroundScenePresets09[$('backgroundScenePreset09')?.value];if(!panel||!preset)return;mutate(()=>Object.assign(panel.background,structuredClone(preset.data)))}

const balloonPresets09={
  speechRight:{ja:'会話・右上',en:'Speech — upper right',type:'speech',size:1,x:.74,y:.17},speechLeft:{ja:'会話・左上',en:'Speech — upper left',type:'speech',size:1,x:.26,y:.17},thought:{ja:'心の声',en:'Thought',type:'thought',size:1,x:.72,y:.2},shout:{ja:'叫び・大きめ',en:'Shout — large',type:'shout',size:1.3,x:.5,y:.18},whisper:{ja:'小声・小さめ',en:'Whisper — small',type:'whisper',size:.82,x:.72,y:.2},narration:{ja:'ナレーション・上',en:'Narration — top',type:'narration',size:1.15,x:.5,y:.11},offscreen:{ja:'画面外の声',en:'Off-screen voice',type:'offscreen',size:1,x:.2,y:.16}
};
function renderBalloonPreset09(){const select=$('balloonPreset09');if(!select)return;const value=select.value;select.innerHTML=Object.entries(balloonPresets09).map(([id,p])=>`<option value="${id}">${escapeXml(language==='ja'?p.ja:p.en)}</option>`).join('');select.value=balloonPresets09[value]?value:'speechRight'}
function installBalloonPreset09(){const section=document.querySelector('.tool-panel[data-section="text"]');if(!section||$('balloonPresetWrap09'))return;const header=section.querySelector('.section-title-row');const box=document.createElement('div');box.id='balloonPresetWrap09';box.className='preset-action09';box.innerHTML=`<label><span data-i18n="balloonPreset">吹き出しプリセット</span><select id="balloonPreset09"></select></label><button id="applyBalloonPreset09" type="button" data-i18n="balloonApplyPreset">吹き出しを追加/適用</button>`;header?.insertAdjacentElement('afterend',box);renderBalloonPreset09()}
function applyBalloonPreset09(){const panel=selectedPanel(),preset=balloonPresets09[$('balloonPreset09')?.value];if(!panel||!preset)return;mutate(()=>{let b=selectedBalloon();if(!b){b={id:uid('balloon'),type:preset.type,speakerId:panel.characters[0]?.characterId||'',text:'',x:0,y:0,size:preset.size};panel.balloons.push(b);selectedBalloonId=b.id;selectedCharacterId=null}b.type=preset.type;b.size=preset.size;b.x=panel.rect.x+panel.rect.w*preset.x;b.y=panel.rect.y+panel.rect.h*preset.y})}

function extendBackgroundSuggestions09(){
  const extra={backgroundLocations06:{ja:['図書室','体育館','校門','商店街','住宅街','神社','病院','屋外ステージ','ファンタジー都市'],en:['library','gymnasium','school gate','shopping street','residential street','shrine','hospital','outdoor stage','fantasy city']},backgroundWeather06:{ja:['夕焼け','雷雨','小雨','快晴'],en:['sunset sky','thunderstorm','light rain','clear sky']},backgroundMood06:{ja:['穏やか','ロマンチック','コミカル','かわいい','切ない','激しい'],en:['calm','romantic','comic','cute','bittersweet','intense']}};
  for(const [id,sets] of Object.entries(extra)){const list=$(id);if(!list)continue;const existing=new Set([...list.options].map(o=>o.value));for(const value of sets[language]||sets.ja)if(!existing.has(value)){const o=document.createElement('option');o.value=value;list.appendChild(o)}}
}

function handoffText09(){const used=usedBaseCharacters09(),required=used.filter(b=>b.identityMode==='sheet');if(language==='ja')return required.length?'このZIPを展開して、最初に中の *_manifest.json を読んで、その内容に従って漫画を生成してください。Character Sheet が必要と書かれているキャラクターは、別途添付した Character Sheet 画像を対応付けて使ってください。':'このZIPを展開して、最初に中の *_manifest.json を読んで、その内容に従って漫画を生成してください。Character Sheet は不要です。キャラクターの見た目はmanifest内の指定に従ってください。';return required.length?'Extract this ZIP, read the *_manifest.json file first, and follow it to generate the manga. For characters marked as requiring a Character Sheet, use the separately attached Character Sheet image mapped to that character.':'Extract this ZIP, read the *_manifest.json file first, and follow it to generate the manga. No Character Sheet is required; follow the character guidance in the manifest.'}
function renderCharacterHandoff09(){
  const host=$('characterHandoffStatus09');if(!host)return;const used=usedBaseCharacters09();host.innerHTML=used.length?used.map(base=>`<div class="character-map-row09" data-state="${base.identityMode==='sheet'&&!base.referenceKey?'warning':'ok'}"><strong>${escapeXml(base.name)} <small>${escapeXml(base.characterId)}</small></strong><span>${escapeXml(characterStatusText09(base))}</span></div>`).join(''):`<div class="smart-empty">${escapeXml(t('characterHandoffEmpty'))}</div>`;
  if($('handoffTemplate09'))$('handoffTemplate09').value=handoffText09();
}
function installHandoffUi09(){
  const output=document.querySelector('.tool-panel[data-section="output"]');if(!output||$('handoffTools09'))return;const primary=$('exportZip');const card=document.createElement('div');card.id='handoffTools09';card.className='handoff-tools09';card.innerHTML=`<div class="subhead" data-i18n="handoffHeading">AIへ渡すとき</div><p class="help" data-i18n="handoffHelp"></p><textarea id="handoffTemplate09" rows="4" readonly></textarea><button id="copyHandoff09" type="button" class="full" data-i18n="handoffCopy">AIへ渡す文をコピー</button><div class="subhead" data-i18n="characterHandoffHeading">キャラクター対応表</div><div id="characterHandoffStatus09" class="character-map09"></div>`;primary?.insertAdjacentElement('afterend',card);renderCharacterHandoff09()}
async function copyHandoff09(){const text=handoffText09();try{await navigator.clipboard.writeText(text)}catch{const ta=$('handoffTemplate09');ta.focus();ta.select();document.execCommand?.('copy')}const btn=$('copyHandoff09');if(btn){const old=btn.textContent;btn.textContent=t('handoffCopied');setTimeout(()=>{btn.textContent=t('handoffCopy')},1200)}}

function manifestFileEntries09(files){const rows=[['cleanPng','visual-spatial-reference',true],['projectJson','semantic-contract',true],['prompt','generation-instructions',true],['manifest','handoff-manifest',true],['annotatedPng','authoring-review',false]];return rows.filter(([key])=>files[key]).map(([key,role,required])=>({name:files[key],role,requiredForGeneration:required}))}
const exportManifest08Base09=exportManifest08;
exportManifest08=function(identity,packageType,files){
  const manifest=exportManifest08Base09(identity,packageType,files),characters=usedBaseCharacters09().map(characterGuidance09);manifest.schema='manga-blueprint-export-manifest/3';manifest.fileEntries=manifestFileEntries09(files);manifest.instructions={readFirst:files.manifest,primaryVisual:files.cleanPng,semanticContract:files.projectJson,generationInstructions:files.prompt,annotatedReviewAllowedForGeneration:false,characterSheetPolicy:'Character Sheets are external attachments and are required only for characters whose characterSheet.required is true.'};manifest.characterGuidance=characters;manifest.characterSheetsRequired=characters.filter(c=>c.characterSheet.required).map(c=>({characterId:c.characterId,referenceKey:c.referenceKey,status:c.characterSheet.status}));manifest.userMessageTemplate=handoffText09();manifest.handoffRule='Read this manifest first. Use cleanPng for spatial reference, projectJson for semantics, prompt for generation instructions, and external Character Sheets only where characterGuidance marks them required.';return manifest;
};

const compilePrompt08Base09=compilePrompt;
compilePrompt=function(){
  const base=compilePrompt08Base09(),used=usedBaseCharacters09();if(!used.length)return base;
  const lines=['','CHARACTER IDENTITY GUIDANCE:','- Planning stick figures are pose/placement guides only and do not indicate clothing state. Use each character\'s explicit outfit guidance. If an outfit is unspecified, use ordinary scene-appropriate clothing rather than interpreting the stick figure as an unclothed body.'];for(const ch of used){const g=characterGuidance09(ch);if(g.identityMode==='sheet')lines.push(`- CHARACTER ${g.characterId}: use the separately attached Character Sheet mapped by referenceKey=${g.referenceKey||'MISSING'}. ${g.appearanceText?`Supplementary appearance notes: ${g.appearanceText}.`:''}`);else if(g.identityMode==='description')lines.push(`- CHARACTER ${g.characterId}: no Character Sheet is required. Keep the character visually consistent across panels using this appearance description: ${g.appearanceText||'appearance intentionally underspecified; infer a simple consistent design'}.`);else lines.push(`- CHARACTER ${g.characterId}: no Character Sheet is required. Appearance is intentionally left open; choose a simple consistent design and preserve it across panels.`)}return `${base}\n${lines.join('\n')}`;
};

function installHelp07(){const dialog=$('helpDialog');if(!dialog||$('guideIdentity09'))return;const charSection=dialog.querySelector('[data-i18n="guideCharacters"]')?.closest('.guide-section'),exportSection=dialog.querySelector('[data-i18n="guideExport"]')?.closest('.guide-section');const identity=document.createElement('section');identity.id='guideIdentity09';identity.className='guide-section';identity.innerHTML=`<h3 data-i18n="guideIdentity"></h3><p data-i18n="guideIdentityBody"></p>`;charSection?.insertAdjacentElement('afterend',identity);const visuals=document.createElement('section');visuals.id='guideVisuals09';visuals.className='guide-section';visuals.innerHTML=`<h3 data-i18n="guideVisualAids"></h3><p data-i18n="guideVisualAidsBody"></p>`;identity.insertAdjacentElement('afterend',visuals);const handoff=document.createElement('section');handoff.id='guideHandoff09';handoff.className='guide-section';handoff.innerHTML=`<h3 data-i18n="guideHandoff"></h3><p data-i18n="guideHandoffBody"></p>`;exportSection?.insertAdjacentElement('afterend',handoff)}

function installPrototype07Styles09(){if($('prototype07Style'))return;const style=document.createElement('style');style.id='prototype07Style';style.textContent=`
.character-guidance{display:grid;gap:8px;margin:8px 0 12px;padding:10px;border:1px solid #dbe3ef;border-radius:12px;background:#f8fafc}.character-guidance small{display:block;margin-top:4px;color:#64748b;line-height:1.45}.appearance-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;padding-top:8px}.identity-status{padding:8px 10px;border-radius:9px;background:#ecfdf5;color:#166534;font-size:11px;line-height:1.45}.identity-status[data-state="warning"],.character-map-row09[data-state="warning"]{background:#fff7ed;color:#9a3412}.layout-thumbnails09{display:grid;grid-auto-flow:column;grid-auto-columns:108px;gap:8px;overflow-x:auto;padding:4px 0 10px;scroll-snap-type:x proximity}.layout-thumb09{display:grid;grid-template-rows:116px auto;gap:6px;padding:7px;border:1px solid #d1d5db;border-radius:10px;background:#fff;scroll-snap-align:start}.layout-thumb09.active{border-color:#2563eb;box-shadow:0 0 0 2px #dbeafe}.layout-thumb09 svg{width:100%;height:100%}.layout-thumb09 rect{fill:#fff;stroke:#334155;stroke-width:3}.layout-thumb09 text{font:700 19px system-ui;fill:#64748b;text-anchor:middle;dominant-baseline:middle}.layout-thumb09 strong{font-size:10px;line-height:1.25}.camera-visual-wrap09{display:grid;gap:6px;margin:8px 0 12px;padding:9px;border:1px solid #dbe3ef;border-radius:10px;background:#f8fafc}.camera-visual-wrap09>strong{font-size:11px}.camera-visual-wrap09 small{color:#64748b;line-height:1.4}.camera-visual-wrap09 svg{display:block;width:100%;height:140px;background:#fff;border-radius:8px}.camera-frame09{fill:#fff;stroke:#334155;stroke-width:2}.camera-horizon09{stroke:#cbd5e1;stroke-width:2}.camera-person09{fill:#fff;stroke:#2563eb;stroke-width:3}.camera-body09{stroke:#2563eb;stroke-width:4;stroke-linecap:round}.camera-caption09{font:600 10px system-ui;fill:#475569}.preset-action09{display:grid;grid-template-columns:1fr auto;gap:8px;align-items:end;margin:8px 0 12px}.preset-action09 label{margin:0}.handoff-tools09{display:grid;gap:8px;margin:10px 0 14px;padding:12px;border:1px solid #bfdbfe;border-radius:12px;background:#eff6ff}.handoff-tools09 textarea{background:#fff}.character-map09{display:grid;gap:6px}.character-map-row09{display:grid;gap:2px;padding:8px 9px;border-radius:9px;background:#fff;color:#334155}.character-map-row09 strong{font-size:11px}.character-map-row09 small{font-weight:400;color:#64748b}.character-map-row09 span{font-size:10px;line-height:1.45}.intensity-badge09{background:#f1f5f9!important;color:#334155!important}
@media(max-width:620px){.appearance-grid{grid-template-columns:1fr}.preset-action09{grid-template-columns:1fr}.layout-thumbnails09{grid-auto-columns:96px}.layout-thumb09{grid-template-rows:104px auto}.camera-visual-wrap09 svg{height:126px}}
`;document.head.appendChild(style)}

function installPrototype07Ui09(){injectCharacterGuidanceUi09();installSmartIntensity09();installLayoutThumbnails09();installCameraVisual09();installBackgroundPreset09();installBalloonPreset09();installHandoffUi09();installHelp07();installPrototype07Styles09();ensureAppearanceDatalists09();extendBackgroundSuggestions09()}
function bindPrototype07Ui09(){
  bindCharacterGuidance09();
  $('randomIntensity09')?.addEventListener('change',()=>{smartCandidates08=[];renderSmartCandidates08()});
  $('randomizePanel08')?.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();randomizeSelectedPanel09()},{capture:true});
  $('layoutThumbnailGrid09')?.addEventListener('click',e=>{const btn=e.target.closest('[data-layout-thumb09]');if(!btn)return;$('templateSelect').value=btn.dataset.layoutThumb09;const p=layoutPresets04[btn.dataset.layoutThumb09];$('layoutHelp').textContent=language==='ja'?p.helpJa:p.helpEn;renderLayoutThumbnails09()});
  $('applyLayoutVisual09')?.addEventListener('click',()=>{if(applyLayout04($('templateSelect').value)!==false)renderLayoutThumbnails09()});
  $('templateSelect')?.addEventListener('change',renderLayoutThumbnails09);
  $('applyBackgroundPreset09')?.addEventListener('click',applyBackgroundPreset09);$('applyBalloonPreset09')?.addEventListener('click',applyBalloonPreset09);$('copyHandoff09')?.addEventListener('click',copyHandoff09);
  $('helpDialog')?.addEventListener('close',()=>localStorage.setItem(HELP_SEEN_KEY_07,'1'));
  $('languageSelect')?.addEventListener('change',()=>queueMicrotask(()=>{ensureAppearanceDatalists09();extendBackgroundSuggestions09();renderBackgroundPreset09();renderBalloonPreset09();renderLayoutThumbnails09();renderCameraVisual09();renderCharacterHandoff09();applyLanguage()}));
}

installPrototype07Ui09();bindPrototype07Ui09();
const renderUi08=renderUi;
renderUi=function(){renderUi08();renderLayoutThumbnails09();renderCameraVisual09();renderCharacterHandoff09();renderBaseCharacters06();if($('randomIntensity09')&&!$('randomDialog')?.open)$('randomIntensity09').value=project.meta.randomIntensity||'standard'};
applyLanguage();render();
if(!localStorage.getItem(HELP_SEEN_KEY_07))setTimeout(()=>{if(!$('helpDialog').open)$('helpDialog').showModal()},500);
document.querySelector('footer').textContent='Prototype 0.7 — client-side only / provider-independent';