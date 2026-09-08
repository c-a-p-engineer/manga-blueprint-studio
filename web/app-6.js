// Prototype 0.5: formal localized help, reading direction, reusable base characters,
// anatomy-readable stick figures, guided free-text background inputs, and traceable ZIP export sets.
const HELP_SEEN_KEY_05='manga-blueprint-studio/help-seen/0.5';
let selectedBaseCharacterId06=null;
let exportIdentityCache06=null;

Object.assign(i18n.ja,{
  guideTitle:'Manga Blueprint Studio ガイド',guideLead:'漫画の設計情報を、人間には読みやすく、画像生成AIには誤解されにくい形でまとめるためのガイドです。',
  guideFlow:'基本の流れ',guideFlowBody:'①原稿サイズと読み方向 → ②コマ割り → ③ベースキャラを配置 → ④ポーズ・カメラ・背景 → ⑤吹き出し・演出 → ⑥一括ZIP出力、の順で進めると迷いにくくなります。',
  guideReading:'読み方向',guideReadingBody:'日本漫画は右→左が基本です。海外コミックや用途に合わせて左→右へ切り替えることもできます。切替時はコマ番号を読み順で振り直します。',
  guideCharacters:'ベースキャラクター',guideCharactersBody:'名前・Character ID・Character Sheet参照キー・初期ポーズをベースとして保存し、別のコマへ何度でも配置できます。配置後の表情・視線・ポーズは各コマで個別に変更できます。',
  guideSkeleton:'棒人間の色',guideSkeletonBody:'編集画面と確認用注釈PNGでは、頭・胴・腕・脚・手足を色分けして骨格を読みやすくします。AI用クリーンPNGは誤解を避けるためモノクロです。',
  guideBackground:'背景入力',guideBackgroundBody:'場所・天気・雰囲気は候補から選ぶことも、自由に入力することもできます。候補に無い場所をそのまま書いて構いません。',
  guideExport:'出力セット',guideExportBody:'一括ZIPにはクリーンPNG、確認注釈PNG、.manga.json、生成プロンプト、manifestをまとめます。同じ編集状態から出したファイルは共通の時刻・短いSHA-256をファイル名に持ちます。manifestにはUUIDと完全ハッシュも記録します。',
  guideCamera:'カメラ早見',guideDone:'編集を始める',
  readingDirection:'コマの読み方向',readingRtl:'右 → 左（日本漫画）',readingLtr:'左 → 右',readingHelp:'日本漫画は「右→左」が既定です。変更すると、現在のコマ位置を使って読み順番号を振り直します。',
  canvasPresetLabel:'サイズプリセット',
  baseCharacters:'ベースキャラクター',baseCharacterHelp:'作品内で使い回すキャラクター定義です。配置すると各コマ用の棒人間になります。',baseCharacterSelect:'ベースを選択',createBaseCharacter:'＋ 新規ベース',saveSelectedAsBase:'選択中から保存',baseName:'名前',baseId:'Character ID',baseReference:'Character Sheet参照キー',basePose:'初期ポーズ',placeBaseCharacter:'このコマに配置',deleteBaseCharacter:'ベースを削除',placedCharacters:'このコマのキャラクター',skeletonLegend:'骨格カラー',skeletonLegendHelp:'頭 / 胴 / 腕 / 脚 / 手足を色分け。AI用クリーンPNGはモノクロです。',
  backgroundComboHelp:'候補から選択、またはそのまま自由入力できます。',
  exportZip:'一括ZIPをダウンロード',exportSetHeading:'出力セットの識別',exportSetPending:'同じ編集状態から出力したファイルは共通の時刻とSHA-256短縮値で揃います。',exportSetReady:'出力ID',
  exportZipHelp:'ZIP内: AI用クリーンPNG / 確認用注釈PNG / .manga.json / prompt.txt / manifest.json',
  pageHelp:'読み方向は右→左が既定ですが、左→右にも切り替えられます。テンプレート変更は現在のコマ配置を作り直します。',
  randomKeepSize:'選択中の原稿サイズを維持',
  helpStep1Body:'迷ったら「800×1130 縦長（標準）」と「アクション3コマ」、または「おまかせ作成」で開始。'
});
Object.assign(i18n.en,{
  guideTitle:'Manga Blueprint Studio Guide',guideLead:'A practical guide for keeping manga direction readable to people and unambiguous to downstream image-generation assistants.',
  guideFlow:'Basic flow',guideFlowBody:'Work in this order: 1) canvas size and reading direction, 2) panel layout, 3) place reusable base characters, 4) pose/camera/background, 5) balloons/effects, 6) export one ZIP package.',
  guideReading:'Reading direction',guideReadingBody:'Right-to-left is the default for Japanese manga. Switch to left-to-right for other comic conventions or delivery needs. Panel numbers are renumbered from the current geometry.',
  guideCharacters:'Base characters',guideCharactersBody:'Store a name, Character ID, Character Sheet reference key, and default pose once, then place that character in any panel. Each placed instance can still override pose, expression, and gaze.',
  guideSkeleton:'Stick-figure colors',guideSkeletonBody:'The editor and annotated review PNG color-code head, torso, arms, legs, hands, and feet for anatomy readability. The clean AI PNG stays monochrome to avoid copying guide colors.',
  guideBackground:'Background input',guideBackgroundBody:'Location, weather, and mood accept either a suggestion or arbitrary free text. You are never limited to the preset suggestions.',
  guideExport:'Export set',guideExportBody:'The ZIP contains clean PNG, annotated PNG, .manga.json, generation prompt, and manifest. Files from the same editor state share a timestamp and short SHA-256 in their filenames; the manifest also records a UUID and the full hash.',
  guideCamera:'Camera quick reference',guideDone:'Start editing',
  readingDirection:'Panel reading direction',readingRtl:'Right → Left (Japanese manga)',readingLtr:'Left → Right',readingHelp:'Right-to-left is the default. Changing direction renumbers panels from their current positions.',
  canvasPresetLabel:'Size preset',
  baseCharacters:'Base characters',baseCharacterHelp:'Reusable character definitions for this project. Placing one creates a panel-specific stick-figure instance.',baseCharacterSelect:'Select base character',createBaseCharacter:'+ New base',saveSelectedAsBase:'Save selected as base',baseName:'Name',baseId:'Character ID',baseReference:'Character Sheet reference key',basePose:'Default pose',placeBaseCharacter:'Place in this panel',deleteBaseCharacter:'Delete base',placedCharacters:'Characters in this panel',skeletonLegend:'Skeleton colors',skeletonLegendHelp:'Head / torso / arms / legs / hands & feet are color-coded. Clean AI PNG stays monochrome.',
  backgroundComboHelp:'Pick a suggestion or type any value freely.',
  exportZip:'Download all as ZIP',exportSetHeading:'Export set identity',exportSetPending:'Files exported from the same editor state share one timestamp and short SHA-256.',exportSetReady:'Export ID',
  exportZipHelp:'ZIP contains: clean AI PNG / annotated review PNG / .manga.json / prompt.txt / manifest.json',
  pageHelp:'Right-to-left is the default, but left-to-right is also supported. Changing a template rebuilds current panel geometry.',
  randomKeepSize:'Keep selected canvas size',
  helpStep1Body:'If unsure, start with “800×1130 Portrait (default)” + Action 3-panel, or use Smart setup.'
});

// Replace the ambiguous legacy display name while keeping the stable internal preset id `standard`.
canvasPresets04.standard.ja='800×1130 縦長（標準）';
canvasPresets04.standard.en='800×1130 Portrait (default)';
canvasPresets04.standard.helpJa='Manga Blueprint Studioの標準作業サイズ。800×1130の縦長1ページです。';
canvasPresets04.standard.helpEn='Manga Blueprint Studio default working canvas: an 800×1130 portrait page.';

function normalizeCharacterLibrary06(p){
  p.characterLibrary=Array.isArray(p.characterLibrary)?p.characterLibrary:[];
  const byId=new Map();
  for(const base of p.characterLibrary){
    if(!base||!base.characterId)continue;
    base.name=String(base.name||base.characterId);
    base.referenceKey=String(base.referenceKey||'');
    base.poseId=posePresets[base.poseId]?base.poseId:'stand';
    base.notes=String(base.notes||'');
    if(!byId.has(base.characterId))byId.set(base.characterId,base);
  }
  p.characterLibrary=[...byId.values()];
  for(const page of p.pages||[])for(const panel of page.panels||[])for(const ch of panel.characters||[]){
    if(!ch.characterId||byId.has(ch.characterId))continue;
    const base={characterId:ch.characterId,name:ch.name||ch.characterId,referenceKey:ch.referenceKey||'',poseId:posePresets[ch.poseId]?ch.poseId:'stand',notes:''};
    p.characterLibrary.push(base);byId.set(base.characterId,base);
  }
  return p;
}
const normalizeProject05=normalizeProject;
normalizeProject=function(input){const p=normalizeProject05(input);return normalizeCharacterLibrary06(p)};
project=normalizeProject(project);
selectedBaseCharacterId06=project.characterLibrary[0]?.characterId||null;

function injectPrototype05Ui06(){
  const pageSection=document.querySelector('.tool-panel[data-section="page"]');
  const applySize=$('applyCanvasSize');
  if(pageSection&&applySize&&!$('readingDirectionSelect')){
    const wrap=document.createElement('div');wrap.id='readingDirectionBlock';wrap.innerHTML=`<div class="subhead" data-i18n="readingDirection">コマの読み方向</div><label><span data-i18n="readingDirection">コマの読み方向</span><select id="readingDirectionSelect"><option value="rtl" data-i18n="readingRtl">右 → 左（日本漫画）</option><option value="ltr" data-i18n="readingLtr">左 → 右</option></select></label><p class="help" data-i18n="readingHelp">日本漫画は右→左が既定です。</p>`;
    applySize.insertAdjacentElement('afterend',wrap);
  }
  const presetLabel=$('canvasPresetSelect')?.closest('label')?.querySelector('span');if(presetLabel)presetLabel.dataset.i18n='canvasPresetLabel';

  const charSection=document.querySelector('.tool-panel[data-section="character"]');
  const charHeader=charSection?.querySelector('.section-title-row');
  if(charSection&&charHeader&&!$('baseCharacterSection')){
    const box=document.createElement('div');box.id='baseCharacterSection';box.innerHTML=`
      <div class="subhead" data-i18n="baseCharacters">ベースキャラクター</div>
      <p class="help" data-i18n="baseCharacterHelp">作品内で使い回すキャラクター定義です。</p>
      <label><span data-i18n="baseCharacterSelect">ベースを選択</span><select id="baseCharacterSelect"></select></label>
      <div class="button-grid"><button id="createBaseCharacter" type="button" data-i18n="createBaseCharacter">＋ 新規ベース</button><button id="saveSelectedAsBase" type="button" data-i18n="saveSelectedAsBase">選択中から保存</button></div>
      <div id="baseCharacterInspector" hidden>
        <label><span data-i18n="baseName">名前</span><input id="baseCharacterName" type="text" /></label>
        <label><span data-i18n="baseId">Character ID</span><input id="baseCharacterId" type="text" /></label>
        <label><span data-i18n="baseReference">Character Sheet参照キー</span><input id="baseCharacterReferenceKey" type="text" /></label>
        <label><span data-i18n="basePose">初期ポーズ</span><select id="baseCharacterPose"></select></label>
        <div class="button-grid"><button id="placeBaseCharacter" class="primary" type="button" data-i18n="placeBaseCharacter">このコマに配置</button><button id="deleteBaseCharacter" class="danger" type="button" data-i18n="deleteBaseCharacter">ベースを削除</button></div>
      </div>
      <div class="skeleton-legend"><strong data-i18n="skeletonLegend">骨格カラー</strong><div class="skeleton-swatches"><span><i class="swatch head"></i>Head</span><span><i class="swatch torso"></i>Torso</span><span><i class="swatch arms"></i>Arms</span><span><i class="swatch legs"></i>Legs</span><span><i class="swatch extremity"></i>Hands / Feet</span></div><small data-i18n="skeletonLegendHelp">頭 / 胴 / 腕 / 脚 / 手足を色分け。</small></div>
      <div class="subhead" data-i18n="placedCharacters">このコマのキャラクター</div>`;
    charHeader.insertAdjacentElement('afterend',box);
  }

  const bgSection=document.querySelector('.tool-panel[data-section="background"]');
  if(bgSection&&!$('backgroundComboHelp')){
    const p=document.createElement('p');p.id='backgroundComboHelp';p.className='help';p.dataset.i18n='backgroundComboHelp';p.textContent='候補から選択、またはそのまま自由入力できます。';bgSection.querySelector('h2')?.insertAdjacentElement('afterend',p);
  }
  ensureBackgroundDatalists06();

  const outputSection=document.querySelector('.tool-panel[data-section="output"]');
  if(outputSection&&!$('exportZip')){
    const zip=document.createElement('button');zip.id='exportZip';zip.type='button';zip.className='primary full';zip.dataset.i18n='exportZip';zip.textContent='一括ZIPをダウンロード';
    outputSection.querySelector('h2')?.insertAdjacentElement('afterend',zip);
    const help=document.createElement('p');help.className='help';help.dataset.i18n='exportZipHelp';help.textContent='ZIP内: AI用クリーンPNG / 確認用注釈PNG / .manga.json / prompt.txt / manifest.json';zip.insertAdjacentElement('afterend',help);
    const card=document.createElement('div');card.id='exportIdentityStatus';card.className='summary-card';card.innerHTML=`<strong data-i18n="exportSetHeading">出力セットの識別</strong><div data-export-identity data-i18n="exportSetPending">同じ編集状態から出力したファイルは共通の時刻とSHA-256短縮値で揃います。</div>`;help.insertAdjacentElement('afterend',card);
    $('exportAiPng')?.classList.remove('primary');
  }
  document.querySelector('footer').textContent='Prototype 0.5 — client-side only / provider-independent';
  installFormalHelp06();
  installPrototype05Styles06();
}

function installFormalHelp06(){
  const dialog=$('helpDialog');if(!dialog)return;
  dialog.setAttribute('aria-labelledby','guideTitle06');
  dialog.innerHTML=`<form method="dialog" class="modal-card help-guide"><div class="section-title-row"><h2 id="guideTitle06" data-i18n="guideTitle">Manga Blueprint Studio ガイド</h2><button value="close" aria-label="Close">×</button></div><p class="lead" data-i18n="guideLead"></p>
    <section class="guide-section"><h3 data-i18n="guideFlow">基本の流れ</h3><p data-i18n="guideFlowBody"></p></section>
    <div class="guide-grid"><section class="guide-section"><h3 data-i18n="guideReading">読み方向</h3><p data-i18n="guideReadingBody"></p></section><section class="guide-section"><h3 data-i18n="guideCharacters">ベースキャラクター</h3><p data-i18n="guideCharactersBody"></p></section><section class="guide-section"><h3 data-i18n="guideSkeleton">棒人間の色</h3><p data-i18n="guideSkeletonBody"></p></section><section class="guide-section"><h3 data-i18n="guideBackground">背景入力</h3><p data-i18n="guideBackgroundBody"></p></section></div>
    <section class="guide-section"><h3 data-i18n="guideCamera">カメラ早見</h3><div class="cheat-grid"><div><strong>Extreme close / 超寄り</strong><span>${escapeXml(cameraHelp.distance['extreme-close'][0])}</span></div><div><strong>Long / 引き</strong><span>${escapeXml(cameraHelp.distance.long[0])}</span></div><div><strong>Low angle / あおり</strong><span>${escapeXml(cameraHelp.angle['low-angle'][0])}</span></div><div><strong>High angle / ふかん</strong><span>${escapeXml(cameraHelp.angle['high-angle'][0])}</span></div></div></section>
    <section class="guide-section"><h3 data-i18n="guideExport">出力セット</h3><p data-i18n="guideExportBody"></p></section>
    <button value="close" class="primary full" data-i18n="guideDone">編集を始める</button></form>`;
}

function installPrototype05Styles06(){
  if($('prototype05Style'))return;const style=document.createElement('style');style.id='prototype05Style';style.textContent=`
    .guide-section{margin:12px 0;padding:12px;border:1px solid #e5e7eb;border-radius:12px;background:#f9fafb}.guide-section h3{margin:0 0 6px;font-size:13px}.guide-section p{margin:0;color:#4b5563;font-size:12px;line-height:1.6}.guide-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}.help-guide .cheat-grid span{line-height:1.5}.skeleton-legend{margin:10px 0;padding:10px;border:1px solid #d1d5db;border-radius:10px;background:#f9fafb}.skeleton-legend strong,.skeleton-legend small{display:block}.skeleton-legend small{margin-top:6px;color:#6b7280;line-height:1.45}.skeleton-swatches{display:flex;flex-wrap:wrap;gap:8px;margin-top:7px;font-size:10px;color:#4b5563}.skeleton-swatches span{display:flex;align-items:center;gap:4px}.swatch{width:11px;height:11px;border-radius:999px;display:inline-block}.swatch.head{background:#e11d48}.swatch.torso{background:#2563eb}.swatch.arms{background:#d97706}.swatch.legs{background:#16a34a}.swatch.extremity{background:#7c3aed}
    .stick.skel-torso{stroke:#2563eb}.stick.skel-arms{stroke:#d97706}.stick.skel-legs{stroke:#16a34a}.stick-head.skel-head{stroke:#e11d48;fill:#fff1f2}.skel-joint{stroke:#fff;stroke-width:2;vector-effect:non-scaling-stroke}.skel-joint.hand,.skel-joint.foot{fill:#7c3aed}.skel-joint.core{fill:#2563eb}.skel-joint.limb{fill:#d97706}.skel-joint.knee{fill:#16a34a}
    @media(max-width:760px){.guide-grid{grid-template-columns:1fr}.skeleton-swatches{gap:6px}.guide-section{padding:10px}}
  `;document.head.appendChild(style);
}

function ensureBackgroundDatalists06(){
  const sets={
    backgroundLocations06:{ja:['学校の教室','学校の廊下','屋上','自宅のリビング','寝室','駅のホーム','電車内','繁華街','路地裏','公園','カフェ','オフィス','森','海辺'],en:['school classroom','school hallway','rooftop','living room','bedroom','train platform','inside a train','downtown street','back alley','park','cafe','office','forest','seaside']},
    backgroundWeather06:{ja:['晴れ','曇り','雨','大雨','雪','霧','強風'],en:['sunny','cloudy','rain','heavy rain','snow','fog','strong wind']},
    backgroundMood06:{ja:['明るい','静か','柔らかい','不穏','緊張感','寂しい','にぎやか','幻想的','重苦しい'],en:['bright','quiet','soft','ominous','tense','lonely','lively','dreamlike','oppressive']}
  };
  const inputMap={backgroundLocation:'backgroundLocations06',backgroundWeather:'backgroundWeather06',backgroundMood:'backgroundMood06'};
  for(const [inputId,listId] of Object.entries(inputMap)){
    const input=$(inputId);if(input)input.setAttribute('list',listId);
    let list=$(listId);if(!list){list=document.createElement('datalist');list.id=listId;document.body.appendChild(list)}
    const values=sets[listId][language]||sets[listId].ja;list.innerHTML=values.map(v=>`<option value="${escapeXml(v)}"></option>`).join('');
  }
}

function currentBaseCharacter06(){return project.characterLibrary?.find(x=>x.characterId===selectedBaseCharacterId06)||null}
function nextCharacterId06(){const used=new Set(project.characterLibrary.map(x=>x.characterId));let n=1;while(used.has(`character-${n}`))n++;return `character-${n}`}
function copyBaseToInstance06(base,panel){
  const scale=Math.min(1.15,Math.max(.7,panel.rect.h/500));
  return {id:uid('char'),characterId:base.characterId,name:base.name,referenceKey:base.referenceKey||'',x:panel.rect.x+panel.rect.w/2,y:panel.rect.y+panel.rect.h/2,scale,rotation:0,poseId:base.poseId||'stand',expression:{type:'neutral',intensity:.5,notes:''},gaze:{target:'camera',notes:''}};
}
function syncBaseIdentity06(base,oldId){
  for(const page of project.pages)for(const panel of page.panels)for(const ch of panel.characters){
    if(ch.characterId!==oldId)continue;ch.characterId=base.characterId;ch.name=base.name;ch.referenceKey=base.referenceKey;
  }
}
function createBaseCharacter06(){mutate(()=>{const id=nextCharacterId06(),base={characterId:id,name:language==='ja'?`キャラクター ${project.characterLibrary.length+1}`:`Character ${project.characterLibrary.length+1}`,referenceKey:'',poseId:'stand',notes:''};project.characterLibrary.push(base);selectedBaseCharacterId06=id;});}
function saveSelectedAsBase06(){const ch=selectedCharacter();if(!ch){alert(language==='ja'?'先にコマ内のキャラクターを選択してください。':'Select a placed character first.');return}mutate(()=>{let base=project.characterLibrary.find(x=>x.characterId===ch.characterId);if(!base){base={characterId:ch.characterId,name:ch.name,referenceKey:ch.referenceKey||'',poseId:ch.poseId||'stand',notes:''};project.characterLibrary.push(base)}else{base.name=ch.name;base.referenceKey=ch.referenceKey||'';base.poseId=ch.poseId||'stand'}selectedBaseCharacterId06=base.characterId;});}
function placeBaseCharacter06(){const panel=selectedPanel(),base=currentBaseCharacter06();if(!panel||!base){alert(language==='ja'?'配置先のコマとベースキャラクターを選択してください。':'Select both a target panel and a base character.');return}mutate(()=>{const ch=copyBaseToInstance06(base,panel);panel.characters.push(ch);selectedCharacterId=ch.id;selectedBalloonId=null;});}
function deleteBaseCharacter06(){const base=currentBaseCharacter06();if(!base)return;const used=project.pages.flatMap(p=>p.panels).flatMap(p=>p.characters).filter(ch=>ch.characterId===base.characterId).length;if(used&&!confirm(language==='ja'?`このベースは${used}個の配置済みキャラで使われています。ベースだけ削除し、配置済みキャラは残しますか？`:`This base is used by ${used} placed character(s). Delete only the base definition and keep placed instances?`))return;mutate(()=>{project.characterLibrary=project.characterLibrary.filter(x=>x!==base);selectedBaseCharacterId06=project.characterLibrary[0]?.characterId||null;});}

function renderBaseCharacters06(){
  const select=$('baseCharacterSelect');if(!select)return;
  if(!project.characterLibrary.some(x=>x.characterId===selectedBaseCharacterId06))selectedBaseCharacterId06=project.characterLibrary[0]?.characterId||null;
  select.innerHTML=project.characterLibrary.length?project.characterLibrary.map(base=>`<option value="${escapeXml(base.characterId)}">${escapeXml(base.name)} — ${escapeXml(base.characterId)}</option>`).join(''):`<option value="">${language==='ja'?'ベースキャラクターなし':'No base characters'}</option>`;
  select.value=selectedBaseCharacterId06||'';
  const base=currentBaseCharacter06(),inspector=$('baseCharacterInspector');if(inspector)inspector.hidden=!base;
  if(base){$('baseCharacterName').value=base.name;$('baseCharacterId').value=base.characterId;$('baseCharacterReferenceKey').value=base.referenceKey;$('baseCharacterPose').value=base.poseId;}
}

function boneLine06(a,b,part,annotated){return `<line class="stick ${annotated?`skel-${part}`:''}" x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" />`}
function joint06(p,kind,annotated,r=6){return annotated?`<circle class="skel-joint ${kind}" cx="${p[0]}" cy="${p[1]}" r="${r}"/>`:''}
characterSvg=function(ch,annotated=true){
  const pose=posePresets[ch.poseId]||posePresets.stand,j=pose.joints,labelWidth=Math.max(80,String(ch.name||ch.characterId).length*18+24);
  return `<g class="character-group ${ch.id===selectedCharacterId?'stick-selected':''}" data-char-id="${escapeXml(ch.id)}" transform="translate(${ch.x} ${ch.y}) rotate(${ch.rotation}) scale(${ch.scale})">
    ${boneLine06(j.neck,j.shoulderL,'torso',annotated)}${boneLine06(j.neck,j.shoulderR,'torso',annotated)}${boneLine06(j.neck,j.hip,'torso',annotated)}
    ${boneLine06(j.shoulderL,j.elbowL,'arms',annotated)}${boneLine06(j.elbowL,j.handL,'arms',annotated)}${boneLine06(j.shoulderR,j.elbowR,'arms',annotated)}${boneLine06(j.elbowR,j.handR,'arms',annotated)}
    ${boneLine06(j.hip,j.kneeL,'legs',annotated)}${boneLine06(j.kneeL,j.footL,'legs',annotated)}${boneLine06(j.hip,j.kneeR,'legs',annotated)}${boneLine06(j.kneeR,j.footR,'legs',annotated)}
    <circle class="stick-head ${annotated?'skel-head':''}" cx="${j.head[0]}" cy="${j.head[1]}" r="22" />
    ${joint06(j.neck,'core',annotated,5)}${joint06(j.shoulderL,'limb',annotated)}${joint06(j.shoulderR,'limb',annotated)}${joint06(j.elbowL,'limb',annotated)}${joint06(j.elbowR,'limb',annotated)}${joint06(j.handL,'hand',annotated)}${joint06(j.handR,'hand',annotated)}${joint06(j.hip,'core',annotated,7)}${joint06(j.kneeL,'knee',annotated)}${joint06(j.kneeR,'knee',annotated)}${joint06(j.footL,'foot',annotated)}${joint06(j.footR,'foot',annotated)}
    ${annotated?`<g class="authoring-text" transform="translate(0 126) scale(${1/Math.max(ch.scale,.01)})"><rect class="character-label-bg" x="${-labelWidth/2}" y="-18" width="${labelWidth}" height="30" rx="8"/><text class="character-label" x="0" y="4">${escapeXml(ch.name||ch.characterId)}</text></g>`:''}
  </g>`;
};

const compilePrompt05=compilePrompt;
compilePrompt=function(){return `${compilePrompt05()}\n\nPOSE REFERENCE COLOR RULE:\n- Any anatomy colors visible in editor/review references are authoring aids only. Do not transfer skeleton guide colors into character design.\n- The clean AI blueprint uses monochrome pose figures; character appearance still comes from Character Sheets.`};

function pad206(n){return String(n).padStart(2,'0')}
function timestamp06(d=new Date()){return `${d.getFullYear()}${pad206(d.getMonth()+1)}${pad206(d.getDate())}_${pad206(d.getHours())}${pad206(d.getMinutes())}${pad206(d.getSeconds())}`}
function safeFileStem06(value){const s=String(value||'manga-blueprint').normalize('NFKC').replace(/[\\/:*?"<>|]/g,'-').replace(/\s+/g,'-').replace(/-+/g,'-').replace(/^[-.]+|[-.]+$/g,'').slice(0,60);return s||'manga-blueprint'}
async function sha256Hex06(text){const bytes=new TextEncoder().encode(text),digest=await crypto.subtle.digest('SHA-256',bytes);return [...new Uint8Array(digest)].map(x=>x.toString(16).padStart(2,'0')).join('')}
async function getExportIdentity06(){
  const projectText=JSON.stringify(project),hash=await sha256Hex06(projectText);if(exportIdentityCache06?.contentHash===hash)return exportIdentityCache06;
  const now=new Date(),shortHash=hash.slice(0,10),exportId=crypto.randomUUID?.()||uid('export'),prefix=`${safeFileStem06(project.meta.title)}_${timestamp06(now)}_${shortHash}`;
  exportIdentityCache06={exportId,contentHash:hash,shortHash,createdAt:now.toISOString(),prefix};renderExportIdentity06();return exportIdentityCache06;
}
function renderExportIdentity06(){const box=$('exportIdentityStatus')?.querySelector('[data-export-identity]');if(!box)return;if(!exportIdentityCache06){box.textContent=t('exportSetPending');return}box.textContent=`${t('exportSetReady')}: ${exportIdentityCache06.exportId} · SHA-256 ${exportIdentityCache06.shortHash} · ${exportIdentityCache06.prefix}`;}

async function buildPngBlob06(annotated){
  const size=pageSize04(),temp=document.createElementNS('http://www.w3.org/2000/svg','svg');temp.setAttribute('viewBox',`0 0 ${size.w} ${size.h}`);temp.setAttribute('xmlns','http://www.w3.org/2000/svg');temp.innerHTML=renderSvg(annotated);temp.querySelectorAll('.selected,.stick-selected,.balloon-selected').forEach(el=>el.classList.remove('selected','stick-selected','balloon-selected'));if(!annotated)temp.querySelectorAll('.authoring-text').forEach(el=>el.remove());
  const css=[...document.styleSheets].flatMap(sheet=>{try{return[...sheet.cssRules].map(r=>r.cssText)}catch{return[]}}).join('\n'),source=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size.w} ${size.h}"><style>${css}</style>${temp.innerHTML}</svg>`,img=new Image(),url=URL.createObjectURL(new Blob([source],{type:'image/svg+xml'}));
  await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=reject;img.src=url});const canvas=document.createElement('canvas');canvas.width=size.w;canvas.height=size.h;const ctx=canvas.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,size.w,size.h);ctx.drawImage(img,0,0);URL.revokeObjectURL(url);return await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));
}
exportPng=async function(annotated){const identity=await getExportIdentity06(),blob=await buildPngBlob06(annotated);if(blob)downloadBlob(blob,`${identity.prefix}_${annotated?'annotated':'clean'}.png`)};

async function exportJson06(){const identity=await getExportIdentity06();downloadBlob(new Blob([JSON.stringify(project,null,2)],{type:'application/json'}),`${identity.prefix}.manga.json`)}

let crcTable06=null;
function crc32Table06(){if(crcTable06)return crcTable06;crcTable06=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=(c&1)?0xedb88320^(c>>>1):c>>>1;crcTable06[n]=c>>>0}return crcTable06}
function crc3206(bytes){const table=crc32Table06();let c=0xffffffff;for(const b of bytes)c=table[(c^b)&0xff]^(c>>>8);return(c^0xffffffff)>>>0}
function dosDateTime06(d=new Date()){let year=Math.max(1980,d.getFullYear());return{time:(d.getHours()<<11)|(d.getMinutes()<<5)|(d.getSeconds()>>1),date:((year-1980)<<9)|((d.getMonth()+1)<<5)|d.getDate()}}
function u16le06(v){const a=new Uint8Array(2);new DataView(a.buffer).setUint16(0,v,true);return a}
function u32le06(v){const a=new Uint8Array(4);new DataView(a.buffer).setUint32(0,v>>>0,true);return a}
async function bytes06(value){if(value instanceof Uint8Array)return value;if(value instanceof Blob)return new Uint8Array(await value.arrayBuffer());return new TextEncoder().encode(String(value))}
async function zipStore06(entries){
  const parts=[],central=[];let offset=0;const now=dosDateTime06();
  for(const entry of entries){const name=new TextEncoder().encode(entry.name),data=await bytes06(entry.data),crc=crc3206(data),local=[u32le06(0x04034b50),u16le06(20),u16le06(0x0800),u16le06(0),u16le06(now.time),u16le06(now.date),u32le06(crc),u32le06(data.length),u32le06(data.length),u16le06(name.length),u16le06(0),name],localSize=local.reduce((n,x)=>n+x.length,0);parts.push(...local,data);central.push({name,data,crc,offset});offset+=localSize+data.length;}
  const centralStart=offset;for(const e of central){const h=[u32le06(0x02014b50),u16le06(20),u16le06(20),u16le06(0x0800),u16le06(0),u16le06(now.time),u16le06(now.date),u32le06(e.crc),u32le06(e.data.length),u32le06(e.data.length),u16le06(e.name.length),u16le06(0),u16le06(0),u16le06(0),u16le06(0),u32le06(0),u32le06(e.offset),e.name];parts.push(...h);offset+=h.reduce((n,x)=>n+x.length,0)}
  const centralSize=offset-centralStart;parts.push(u32le06(0x06054b50),u16le06(0),u16le06(0),u16le06(central.length),u16le06(central.length),u32le06(centralSize),u32le06(centralStart),u16le06(0));return new Blob(parts,{type:'application/zip'});
}
async function exportZip06(){
  const identity=await getExportIdentity06(),clean=await buildPngBlob06(false),annotated=await buildPngBlob06(true),projectName=`${identity.prefix}.manga.json`,promptName=`${identity.prefix}_prompt.txt`,cleanName=`${identity.prefix}_clean.png`,annotatedName=`${identity.prefix}_annotated.png`,manifestName=`${identity.prefix}_manifest.json`;
  const manifest={schema:'manga-blueprint-export-manifest/1',exportId:identity.exportId,createdAt:identity.createdAt,contentHash:`sha256:${identity.contentHash}`,shortHash:identity.shortHash,projectTitle:project.meta.title,readingDirection:project.meta.readingDirection,canvas:{width:pageSize04().w,height:pageSize04().h},files:{cleanPng:cleanName,annotatedPng:annotatedName,projectJson:projectName,prompt:promptName,manifest:manifestName},identityRule:'Files sharing this contentHash represent the same serialized Manga Blueprint state.'};
  const zip=await zipStore06([{name:cleanName,data:clean},{name:annotatedName,data:annotated},{name:projectName,data:JSON.stringify(project,null,2)},{name:promptName,data:compilePrompt()},{name:manifestName,data:JSON.stringify(manifest,null,2)}]);downloadBlob(zip,`${identity.prefix}.zip`);
}

function renderExtensionUi06(){
  const direction=$('readingDirectionSelect');if(direction)direction.value=project.meta.readingDirection||'rtl';renderBaseCharacters06();renderExportIdentity06();ensureBackgroundDatalists06();
}
const renderUi05=renderUi;
renderUi=function(){renderUi05();renderExtensionUi06()};

function bindPrototype05Ui06(){
  $('readingDirectionSelect')?.addEventListener('change',()=>mutate(()=>{project.meta.readingDirection=$('readingDirectionSelect').value;renumberPanels()}));
  $('baseCharacterSelect')?.addEventListener('change',()=>{selectedBaseCharacterId06=$('baseCharacterSelect').value||null;renderBaseCharacters06()});
  $('createBaseCharacter')?.addEventListener('click',createBaseCharacter06);$('saveSelectedAsBase')?.addEventListener('click',saveSelectedAsBase06);$('placeBaseCharacter')?.addEventListener('click',placeBaseCharacter06);$('deleteBaseCharacter')?.addEventListener('click',deleteBaseCharacter06);
  $('baseCharacterName')?.addEventListener('change',()=>{const base=currentBaseCharacter06();if(!base)return;mutate(()=>{base.name=$('baseCharacterName').value.trim()||base.characterId;syncBaseIdentity06(base,base.characterId)})});
  $('baseCharacterReferenceKey')?.addEventListener('change',()=>{const base=currentBaseCharacter06();if(!base)return;mutate(()=>{base.referenceKey=$('baseCharacterReferenceKey').value.trim();syncBaseIdentity06(base,base.characterId)})});
  $('baseCharacterPose')?.addEventListener('change',()=>{const base=currentBaseCharacter06();if(base)mutate(()=>base.poseId=$('baseCharacterPose').value)});
  $('baseCharacterId')?.addEventListener('change',()=>{const base=currentBaseCharacter06();if(!base)return;const old=base.characterId,next=$('baseCharacterId').value.trim();if(!next||project.characterLibrary.some(x=>x!==base&&x.characterId===next)){alert(language==='ja'?'Character IDは空欄不可・重複不可です。':'Character ID cannot be blank or duplicated.');$('baseCharacterId').value=old;return}mutate(()=>{base.characterId=next;selectedBaseCharacterId06=next;syncBaseIdentity06(base,old)})});
  $('exportZip')?.addEventListener('click',exportZip06);
  const oldJson=$('exportJson');if(oldJson){const fresh=oldJson.cloneNode(true);oldJson.replaceWith(fresh);fresh.addEventListener('click',exportJson06)}
  $('helpDialog')?.addEventListener('close',()=>localStorage.setItem(HELP_SEEN_KEY_05,'1'));
  $('languageSelect').addEventListener('change',()=>queueMicrotask(()=>{ensureBackgroundDatalists06();renderExtensionUi06()}));
}

injectPrototype05Ui06();
$('baseCharacterPose').innerHTML=Object.entries(posePresets).map(([id,p])=>`<option value="${id}">${escapeXml(language==='ja'?`${p.ja} / ${p.en}`:p.en)}</option>`).join('');
bindPrototype05Ui06();
renderPresetControls04();
applyLanguage();
if(!localStorage.getItem(HELP_SEEN_KEY_05))setTimeout(()=>{if(!$('helpDialog').open)$('helpDialog').showModal()},400);
