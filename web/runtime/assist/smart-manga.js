// Prototype 0.6: AI-safe handoff packages, guided Smart Manga proposals,
// per-panel direction dice, reproducible seeds, and clearer mobile-first action hierarchy.
const HELP_SEEN_KEY_06='manga-blueprint-studio/help-seen/0.6';
let smartCandidates08=[];

Object.assign(i18n.ja,{
  randomCreate:'おまかせ漫画',randomTitle:'おまかせ漫画',randomLead:'用途とコマ数から、漫画として成立しやすい候補を3案つくります。候補を見るだけでは現在のページは変わりません。',generateRandom:'候補を3案つくる',
  randomSeed:'Seed（再現用）',randomSeedHelp:'同じSeed・用途・コマ数なら同じ候補を再現できます。',randomNewSeed:'新しいSeed',randomPlaceBase:'選択中のベースキャラを各コマへ配置',randomPlaceBaseHelp:'ベースキャラがある場合だけ使えます。配置後のポーズ・表情はコマごとに自動提案されます。',
  randomCandidates:'候補',randomCandidatesEmpty:'用途を選んで「候補を3案つくる」を押してください。',randomApply:'この案を使う',randomVariantBalanced:'安定構成',randomVariantDynamic:'動き重視',randomVariantEmotion:'感情重視',randomPurposeResolved:'用途',randomCameraFlow:'カメラの流れ',randomPoseFlow:'ポーズの流れ',randomLayout:'コマ割り',
  panelRandom:'🎲 このコマの演出をおまかせ',panelRandomHelp:'コマ割り・背景内容・吹き出しはそのままに、カメラ・効果線・ブチ抜き・配置済みキャラのポーズ/表情/視線だけを提案し直します。元に戻せます。',
  aiZip:'AI生成用ZIP',aiZipHelp:'ChatGPTなどへそのまま渡す推奨パッケージ。クリーンPNG・Prompt・JSON・manifestだけを含み、注釈PNGは入れません。',reviewZip:'確認・保存用ZIP',reviewZipHelp:'人間の確認・保管向け。AI生成用の内容に加えて確認用注釈PNGも含みます。生成AIへ渡す場合はAI生成用ZIPを使ってください。',handoffRecommended:'AIへ渡すならこちら',handoffRecommendedBody:'注釈PNGを入力から外すことで、コマ番号・カメラ注記・キャラ名などが完成絵へ写り込む経路を減らします。',
  exportZip:'AI生成用ZIP',exportZipHelp:'ZIP内: AI用クリーンPNG / prompt.txt / .manga.json / manifest.json（注釈PNGなし）',
  guideSmart:'おまかせ漫画',guideSmartBody:'用途・コマ数・Seedから3つの候補を比較して選べます。候補生成だけでは現在のページを変更しません。ベースキャラがあれば各コマへ自動配置もできます。',
  guideExportBody:'AIへ渡す「AI生成用ZIP」はクリーンPNG・Prompt・.manga.json・manifestだけを含み、注釈PNGを入れません。「確認・保存用ZIP」は同じ出力IDで注釈PNGも含めます。',
  safeExportNote:'AI用PNGとAI生成用ZIPでは、キャラ名・コマ番号・カメラ注記などの制作メタ文字を除去し、注釈PNGもAI生成用ZIPには含めません。',
  workflowHintTitle:'迷ったらこの順番',workflowHintBody:'① おまかせ漫画/テンプレート → ② ベースキャラ → ③ 気になるコマだけ🎲調整 → ④ AI生成用ZIP',workflowToCharacter:'キャラへ',workflowToOutput:'出力へ'
});
Object.assign(i18n.en,{
  randomCreate:'Smart Manga',randomTitle:'Smart Manga',randomLead:'Create three practical manga-direction candidates from purpose and panel count. Previewing candidates never changes the current page.',generateRandom:'Create 3 candidates',
  randomSeed:'Seed (reproducible)',randomSeedHelp:'The same seed, purpose, and panel count reproduce the same candidates.',randomNewSeed:'New seed',randomPlaceBase:'Place the selected base character in every panel',randomPlaceBaseHelp:'Available when a base character exists. Pose and expression are proposed per panel after placement.',
  randomCandidates:'Candidates',randomCandidatesEmpty:'Choose a purpose and press “Create 3 candidates”.',randomApply:'Use this candidate',randomVariantBalanced:'Balanced',randomVariantDynamic:'Dynamic',randomVariantEmotion:'Emotion-focused',randomPurposeResolved:'Purpose',randomCameraFlow:'Camera flow',randomPoseFlow:'Pose flow',randomLayout:'Layout',
  panelRandom:'🎲 Re-roll this panel direction',panelRandomHelp:'Keeps panel geometry, background content, and balloons. Re-rolls camera, effects, breakout, and placed-character pose/expression/gaze. Undo is available.',
  aiZip:'AI generation ZIP',aiZipHelp:'Recommended package for ChatGPT or another image-generation assistant. Contains clean PNG, prompt, JSON, and manifest only; no annotated PNG.',reviewZip:'Review / archive ZIP',reviewZipHelp:'For human review and storage. Adds the annotated review PNG to the AI package contents. Use the AI generation ZIP when handing off to an image model.',handoffRecommended:'Recommended for AI handoff',handoffRecommendedBody:'Removing the annotated PNG from model input reduces a direct path for panel numbers, camera labels, and character names to leak into final artwork.',
  exportZip:'AI generation ZIP',exportZipHelp:'ZIP: clean AI PNG / prompt.txt / .manga.json / manifest.json (no annotated PNG)',
  guideSmart:'Smart Manga',guideSmartBody:'Compare three candidates generated from purpose, panel count, and seed before applying one. Candidate generation does not modify the current page. A base character can optionally be placed across panels.',
  guideExportBody:'The AI generation ZIP contains only clean PNG, prompt, .manga.json, and manifest; it excludes the annotated PNG. The Review / archive ZIP shares the same export identity and additionally contains the annotated PNG.',
  safeExportNote:'Clean AI PNG and AI generation ZIP remove authoring labels such as names, panel numbers, and camera notes; the annotated PNG is not included in the AI generation ZIP.',
  workflowHintTitle:'Recommended workflow',workflowHintBody:'1) Smart Manga / template → 2) base character → 3) re-roll only panels that need it → 4) AI generation ZIP',workflowToCharacter:'Characters',workflowToOutput:'Output'
});

const smartPurposeLabels08={auto:['おまかせ','Auto'],action:['アクション','Action'],conversation:['会話','Conversation'],gag:['ギャグ','Gag'],daily:['日常','Daily'],climax:['見せ場','Climax'],fourkoma:['4コマ','4-koma']};
const smartVariantLabels08={balanced:'randomVariantBalanced',dynamic:'randomVariantDynamic',emotion:'randomVariantEmotion'};
const smartPurposeLayouts08={
  action:['action3','action','climax'],conversation:['conversation','four-grid','three-vertical'],gag:['four-vertical','four-grid','five'],daily:['conversation','four-grid','three-vertical'],climax:['climax','action3','action'],fourkoma:['four-vertical','four-grid']
};
const smartCountLayouts08={1:['single'],2:['two-columns','two-rows'],3:['action3','three-vertical'],4:['four-vertical','four-grid','conversation','action','climax'],5:['five'],6:['six']};
const smartProfiles08={
  action:[
    {role:'setup',camera:['long','eye-level','three-quarter-front'],pose:'run',expression:'neutral',gaze:'other-character',effect:'speed',background:'normal'},
    {role:'transition',camera:['medium','low-angle','side'],pose:'jump',expression:'angry',gaze:'other-character',effect:'speed',background:'speed-lines'},
    {role:'reaction',camera:['close','eye-level','three-quarter-front'],pose:'crouch',expression:'surprised',gaze:'other-character',effect:'impact',background:'selective-detail'},
    {role:'climax',camera:['extreme-close','low-angle','near-object'],pose:'punch',expression:'angry',gaze:'other-character',effect:'impact',background:'focus-lines'}
  ],
  conversation:[
    {role:'exposition',camera:['long','eye-level','front'],pose:'stand',expression:'neutral',gaze:'other-character',effect:'none',background:'normal'},
    {role:'setup',camera:['medium','over-shoulder','three-quarter-front'],pose:'stand',expression:'smile',gaze:'other-character',effect:'none',background:'selective-detail'},
    {role:'reaction',camera:['close','eye-level','three-quarter-front'],pose:'lookback',expression:'shy',gaze:'away',effect:'silence',background:'blur'},
    {role:'afterglow',camera:['medium','eye-level','front'],pose:'stand',expression:'smile',gaze:'other-character',effect:'none',background:'normal'}
  ],
  gag:[
    {role:'setup',camera:['medium','eye-level','front'],pose:'stand',expression:'neutral',gaze:'camera',effect:'none',background:'normal'},
    {role:'setup',camera:['medium','eye-level','front'],pose:'lookback',expression:'smirk',gaze:'camera',effect:'none',background:'selective-detail'},
    {role:'transition',camera:['close','eye-level','front'],pose:'crouch',expression:'surprised',gaze:'camera',effect:'silence',background:'white'},
    {role:'climax',camera:['close','dutch-angle','three-quarter-front'],pose:'stand',expression:'surprised',gaze:'camera',effect:'impact',background:'focus-lines'}
  ],
  daily:[
    {role:'setup',camera:['long','eye-level','three-quarter-front'],pose:'stand',expression:'neutral',gaze:'other-character',effect:'none',background:'normal'},
    {role:'reaction',camera:['medium','eye-level','three-quarter-front'],pose:'lookback',expression:'smile',gaze:'camera',effect:'none',background:'selective-detail'},
    {role:'beat',camera:['close','eye-level','three-quarter-front'],pose:'stand',expression:'shy',gaze:'away',effect:'silence',background:'blur'},
    {role:'afterglow',camera:['close','eye-level','front'],pose:'stand',expression:'smile',gaze:'camera',effect:'none',background:'normal'}
  ],
  climax:[
    {role:'setup',camera:['long','eye-level','three-quarter-front'],pose:'stand',expression:'neutral',gaze:'other-character',effect:'none',background:'normal'},
    {role:'transition',camera:['medium','low-angle','side'],pose:'run',expression:'angry',gaze:'other-character',effect:'speed',background:'speed-lines'},
    {role:'reaction',camera:['close','dutch-angle','three-quarter-front'],pose:'lookback',expression:'surprised',gaze:'other-character',effect:'tension',background:'selective-detail'},
    {role:'climax',camera:['extreme-close','low-angle','near-object'],pose:'punch',expression:'angry',gaze:'other-character',effect:'impact',background:'focus-lines'}
  ],
  fourkoma:[
    {role:'setup',camera:['medium','eye-level','front'],pose:'stand',expression:'neutral',gaze:'camera',effect:'none',background:'normal'},
    {role:'setup',camera:['medium','eye-level','three-quarter-front'],pose:'stand',expression:'smile',gaze:'other-character',effect:'none',background:'normal'},
    {role:'transition',camera:['close','eye-level','front'],pose:'lookback',expression:'surprised',gaze:'camera',effect:'silence',background:'white'},
    {role:'climax',camera:['close','eye-level','front'],pose:'stand',expression:'smirk',gaze:'camera',effect:'impact',background:'focus-lines'}
  ]
};

function seedHash08(text){let h=2166136261>>>0;for(const ch of String(text)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
function seededRandom08(seed){let a=seedHash08(seed)||0x6d2b79f5;return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function pickSeeded08(rng,list){return list[Math.floor(rng()*list.length)]}
function newSeed08(){const bytes=new Uint32Array(2);crypto.getRandomValues?.(bytes);return `${Date.now().toString(36)}-${(bytes[0]||Math.random()*0xffffffff>>>0).toString(36)}${(bytes[1]||0).toString(36).slice(0,4)}`}
function resolvedPurpose08(requested,rng){return requested==='auto'?pickSeeded08(rng,['action','conversation','gag','daily','climax']):requested}
function compatibleLayouts08(purpose,count){
  const wanted=count==='auto'?null:Number(count);let list=[...(smartPurposeLayouts08[purpose]||Object.values(smartPurposeLayouts08).flat())];
  if(wanted)list=list.filter(id=>layoutRects04(id,800,1130).length===wanted);
  if(!list.length)list=[...(smartCountLayouts08[wanted]||['action3'])];
  return [...new Set(list)];
}
function profileBeat08(purpose,index,total,variant,rng){
  const profile=smartProfiles08[purpose]||smartProfiles08.daily;
  const mapped=total<=1?profile.length-1:Math.round(index*(profile.length-1)/(total-1));
  const base=structuredClone(profile[Math.max(0,Math.min(profile.length-1,mapped))]);
  if(variant==='dynamic'){
    if(index>0&&index<total-1)base.camera[1]=pickSeeded08(rng,['low-angle','dutch-angle','eye-level']);
    if(index===total-1){base.camera[0]=purpose==='conversation'||purpose==='daily'?'close':'extreme-close';base.camera[2]=purpose==='conversation'?'three-quarter-front':'near-object';}
  }else if(variant==='emotion'){
    const order=['extreme-long','long','medium','close','extreme-close'],at=order.indexOf(base.camera[0]);base.camera[0]=order[Math.min(order.length-1,Math.max(0,at+1))];
    if(index===total-1&&purpose!=='action'&&purpose!=='climax')base.expression=pickSeeded08(rng,['shy','smile','smirk','surprised']);
  }
  return base;
}
function candidateCanvas08(purpose,keepSize,rng){
  if(keepSize){const s=pageSize04();return{preset:project.meta.canvasPreset||inferCanvasPreset04(s.w,s.h),w:s.w,h:s.h}}
  const pool=purpose==='fourkoma'?['standard','portrait45','square']:purpose==='action'||purpose==='climax'?['standard','portrait45','portrait34']:['standard','portrait45','portrait34','square'];
  const preset=pickSeeded08(rng,pool),p=canvasPresets04[preset];return{preset,w:p.w,h:p.h};
}
function buildSmartCandidates08(){
  const requested=$('randomPurpose').value,count=$('randomPanelCount').value,keepSize=$('randomKeepSize').checked,baseSeed=$('randomSeed08').value.trim()||newSeed08();$('randomSeed08').value=baseSeed;
  const variants=['balanced','dynamic','emotion'],usedLayouts=new Set(),out=[];
  for(let i=0;i<3;i++){
    const seed=`${baseSeed}|${requested}|${count}|${i}`,rng=seededRandom08(seed),purpose=resolvedPurpose08(requested,rng),pool=compatibleLayouts08(purpose,count);let layout=pool[Math.floor(rng()*pool.length)];
    const unused=pool.find(x=>!usedLayouts.has(x));if(unused)layout=unused;usedLayouts.add(layout);
    const canvas=candidateCanvas08(purpose,keepSize,rng),rects=layoutRects04(layout,canvas.w,canvas.h),variant=variants[i%variants.length],beats=rects.map((_,idx)=>profileBeat08(purpose,idx,rects.length,variant,rng));
    out.push({seed,baseSeed,purpose,count:rects.length,layout,canvas,variant,beats,placeBase:$('randomPlaceBase08')?.checked===true});
  }
  smartCandidates08=out;renderSmartCandidates08();
}
function cameraShort08(value){const row=cameraDistanceOptions04.find(x=>x[0]===value);return row?(language==='ja'?row[1].split(' — ')[0]:row[2].split(' — ')[0]):value}
function poseShort08(value){const p=posePresets[value]||posePresets.stand;return language==='ja'?p.ja:p.en}
function smartPurposeLabel08(p){return smartPurposeLabels08[p]?.[language==='ja'?0:1]||p}
function layoutLabel08(id){const p=layoutPresets04[id];return p?(language==='ja'?p.ja:p.en):id}
function previewOrder08(rects){const sorted=[...rects].sort((a,b)=>{const threshold=Math.max(60,Math.min(a.h,b.h)*.25);if(Math.abs(a.y-b.y)>threshold)return a.y-b.y;return project.meta.readingDirection==='rtl'?b.x-a.x:a.x-b.x});return new Map(sorted.map((r,i)=>[r,i+1]))}
function candidatePreviewSvg08(c){const rects=layoutRects04(c.layout,c.canvas.w,c.canvas.h),order=previewOrder08(rects);return `<svg viewBox="0 0 ${c.canvas.w} ${c.canvas.h}" aria-hidden="true">${rects.map(r=>`<rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" rx="8"/><text x="${r.x+r.w/2}" y="${r.y+r.h/2}">${order.get(r)}</text>`).join('')}</svg>`}
function renderSmartCandidates08(){
  const host=$('smartCandidateList08');if(!host)return;
  if(!smartCandidates08.length){host.innerHTML=`<div class="smart-empty" data-i18n="randomCandidatesEmpty">${escapeXml(t('randomCandidatesEmpty'))}</div>`;return}
  host.innerHTML=smartCandidates08.map((c,i)=>{
    const first=c.beats[0],last=c.beats.at(-1),poses=[...new Set(c.beats.map(x=>poseShort08(x.pose)))].slice(0,4).join(' → '),variant=t(smartVariantLabels08[c.variant]);
    return `<article class="smart-candidate"><div class="smart-preview">${candidatePreviewSvg08(c)}</div><div class="smart-copy"><div class="smart-title"><strong>${escapeXml(layoutLabel08(c.layout))}</strong><span>${escapeXml(variant)}</span></div><dl><div><dt>${escapeXml(t('randomPurposeResolved'))}</dt><dd>${escapeXml(smartPurposeLabel08(c.purpose))}</dd></div><div><dt>${escapeXml(t('randomCameraFlow'))}</dt><dd>${escapeXml(cameraShort08(first.camera[0]))} → ${escapeXml(cameraShort08(last.camera[0]))}</dd></div><div><dt>${escapeXml(t('randomPoseFlow'))}</dt><dd>${escapeXml(poses)}</dd></div></dl><button type="button" class="primary full" data-smart-apply="${i}">${escapeXml(t('randomApply'))}</button></div></article>`;
  }).join('');
}
function applyBeat08(panel,beat,{characters=true,preserveRole=false,background=true}={}){
  if(!preserveRole)panel.role=beat.role;
  [panel.camera.distance,panel.camera.angle,panel.camera.viewpoint]=beat.camera;panel.camera.focus='';panel.camera.intent='';
  panel.effects.lineEffect=beat.effect;panel.effects.strength=beat.effect==='none'||beat.effect==='silence'?'low':beat.role==='climax'?'high':'medium';
  if(background&&!panel.background.location){panel.background.renderMode=beat.background||'normal';panel.background.detailLevel=beat.background==='white'?'none':beat.background==='normal'?'medium':'low';}
  if(beat.role==='climax'&&panel.style.breakout==='none'&&['action','climax'].includes(project.meta.randomPurpose))panel.style.breakout='foreground';
  if(characters)for(const ch of panel.characters){ch.poseId=posePresets[beat.pose]?beat.pose:'stand';ch.expression.type=beat.expression;ch.expression.intensity=beat.role==='climax'?.9:.65;ch.expression.notes='';ch.gaze.target=beat.gaze;ch.gaze.notes='';}
}
function applySmartCandidate08(index){
  const c=smartCandidates08[index];if(!c)return;if(!confirmReset04())return;
  pushHistory();
  project.meta.pageWidth=c.canvas.w;project.meta.pageHeight=c.canvas.h;project.meta.canvasPreset=c.canvas.preset;project.meta.layoutPreset=c.layout;project.meta.randomPurpose=c.purpose;project.meta.randomSeed=c.baseSeed;project.meta.randomVariant=c.variant;
  const rects=layoutRects04(c.layout,c.canvas.w,c.canvas.h);currentPage().panels=rects.map((r,i)=>makePanel(r,i+1));renumberPanels();
  const ordered=[...currentPage().panels].sort((a,b)=>a.order-b.order),base=c.placeBase?currentBaseCharacter06():null;
  ordered.forEach((panel,i)=>{const beat=c.beats[i]||c.beats.at(-1);if(base){const ch=copyBaseToInstance06(base,panel);panel.characters.push(ch)}applyBeat08(panel,beat,{characters:true,preserveRole:false})});
  selectedPanelId=ordered[0]?.id||null;selectedCharacterId=ordered[0]?.characters[0]?.id||null;selectedBalloonId=null;$('randomDialog').close();render();
}
function randomizeSelectedPanel08(){
  const panel=selectedPanel();if(!panel)return;const purpose=['action','conversation','gag','daily','climax','fourkoma'].includes(project.meta.randomPurpose)?project.meta.randomPurpose:'daily',roleIndex={setup:0,exposition:0,transition:1,reaction:2,beat:2,climax:3,afterglow:3}[panel.role]??1,seed=`${project.meta.randomSeed||'panel'}|${panel.id}|${Date.now()}|${Math.random()}`,rng=seededRandom08(seed),variant=pickSeeded08(rng,['balanced','dynamic','emotion']),beat=profileBeat08(purpose,roleIndex,4,variant,rng);
  mutate(()=>{applyBeat08(panel,beat,{characters:true,preserveRole:true,background:false});panel.assistSeed=seed;});
}

function injectSmartUi08(){
  const form=$('randomForm');if(form&&!$('smartCandidateList08')){
    const actions=form.querySelector('.dialog-actions');const extra=document.createElement('div');extra.className='smart-controls';extra.innerHTML=`<label><span data-i18n="randomSeed">Seed（再現用）</span><div class="inline-input-action"><input id="randomSeed08" type="text" autocomplete="off"/><button id="randomNewSeed08" type="button" data-i18n="randomNewSeed">新しいSeed</button></div><small data-i18n="randomSeedHelp">同じSeedなら同じ候補を再現できます。</small></label><label class="check-row"><input id="randomPlaceBase08" type="checkbox"/><span data-i18n="randomPlaceBase">選択中のベースキャラを各コマへ配置</span></label><p class="help" data-i18n="randomPlaceBaseHelp"></p><div class="subhead" data-i18n="randomCandidates">候補</div><div id="smartCandidateList08" class="smart-candidates"></div>`;actions?.insertAdjacentElement('beforebegin',extra);
  }
  const panelSection=document.querySelector('.tool-panel[data-section="panel"]'),summary=$('selectedPanelSummary');if(panelSection&&summary&&!$('randomizePanel08')){const wrap=document.createElement('div');wrap.className='panel-dice';wrap.innerHTML=`<button id="randomizePanel08" type="button" class="full" data-i18n="panelRandom">🎲 このコマの演出をおまかせ</button><p class="help" data-i18n="panelRandomHelp"></p>`;summary.insertAdjacentElement('afterend',wrap)}
  const pageSection=document.querySelector('.tool-panel[data-section="page"]');if(pageSection&&!$('workflowHint08')){const title=pageSection.querySelector('.section-title-row');const hint=document.createElement('div');hint.id='workflowHint08';hint.className='workflow-hint';hint.innerHTML=`<strong data-i18n="workflowHintTitle"></strong><span data-i18n="workflowHintBody"></span><div><button type="button" data-go-tab="character" data-i18n="workflowToCharacter"></button><button type="button" data-go-tab="output" data-i18n="workflowToOutput"></button></div>`;title?.insertAdjacentElement('afterend',hint)}
  upgradeOutputUi08();installSmartHelp08();installPrototype06Styles08();
}
function upgradeOutputUi08(){
  const output=document.querySelector('.tool-panel[data-section="output"]'),zip=$('exportZip');if(!output||!zip)return;
  const fresh=zip.cloneNode(true);zip.replaceWith(fresh);fresh.id='exportZip';fresh.className='primary full';fresh.dataset.i18n='aiZip';fresh.textContent=t('aiZip');
  let handoff=$('handoffRecommended08');if(!handoff){handoff=document.createElement('div');handoff.id='handoffRecommended08';handoff.className='handoff-card';handoff.innerHTML=`<strong data-i18n="handoffRecommended"></strong><span data-i18n="handoffRecommendedBody"></span>`;fresh.insertAdjacentElement('beforebegin',handoff)}
  const oldHelp=fresh.nextElementSibling?.matches?.('.help')?fresh.nextElementSibling:null;if(oldHelp){oldHelp.dataset.i18n='aiZipHelp';oldHelp.textContent=t('aiZipHelp')}
  let review=$('exportReviewZip08');if(!review){review=document.createElement('button');review.id='exportReviewZip08';review.type='button';review.className='full';review.dataset.i18n='reviewZip';review.textContent=t('reviewZip');const help=document.createElement('p');help.className='help';help.dataset.i18n='reviewZipHelp';help.textContent=t('reviewZipHelp');const anchor=oldHelp||fresh;anchor.insertAdjacentElement('afterend',review);review.insertAdjacentElement('afterend',help)}
  fresh.addEventListener('click',async()=>{try{await exportPackage08('ai-generation')}catch(err){console.error(err);alert(t('exportError'))}});review.addEventListener('click',async()=>{try{await exportPackage08('review-archive')}catch(err){console.error(err);alert(t('exportError'))}});
}
function installSmartHelp08(){const dialog=$('helpDialog'),exportSection=dialog?.querySelector('[data-i18n="guideExport"]')?.closest('.guide-section');if(!dialog||!exportSection||$('guideSmartSection08'))return;const section=document.createElement('section');section.id='guideSmartSection08';section.className='guide-section';section.innerHTML=`<h3 data-i18n="guideSmart"></h3><p data-i18n="guideSmartBody"></p>`;exportSection.insertAdjacentElement('beforebegin',section)}
function installPrototype06Styles08(){if($('prototype06Style'))return;const style=document.createElement('style');style.id='prototype06Style';style.textContent=`
  .workflow-hint,.handoff-card{display:grid;gap:6px;margin:10px 0 14px;padding:12px;border:1px solid #dbe3ef;border-radius:12px;background:#f8fafc}.workflow-hint>span,.handoff-card>span{font-size:12px;line-height:1.55;color:#475569}.workflow-hint>div{display:flex;gap:8px;flex-wrap:wrap}.workflow-hint button{min-height:40px}.handoff-card{border-color:#b7d2ff;background:#eff6ff}.handoff-card strong{color:#1d4ed8}.panel-dice{margin:10px 0 14px}.smart-controls{display:grid;gap:10px}.inline-input-action{display:grid;grid-template-columns:1fr auto;gap:8px}.smart-candidates{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.smart-candidate{display:grid;grid-template-rows:150px 1fr;overflow:hidden;border:1px solid #d1d5db;border-radius:12px;background:#fff}.smart-preview{padding:8px;background:#f8fafc}.smart-preview svg{display:block;width:100%;height:100%}.smart-preview rect{fill:#fff;stroke:#111827;stroke-width:4}.smart-preview text{font:700 30px system-ui;fill:#64748b;text-anchor:middle;dominant-baseline:middle}.smart-copy{display:grid;align-content:start;gap:8px;padding:10px}.smart-title{display:flex;justify-content:space-between;gap:6px;align-items:start}.smart-title span{font-size:10px;padding:3px 6px;border-radius:999px;background:#eef2ff;color:#4338ca}.smart-copy dl{display:grid;gap:5px;margin:0;font-size:10px}.smart-copy dl div{display:grid;grid-template-columns:72px 1fr;gap:4px}.smart-copy dt{color:#64748b}.smart-copy dd{margin:0;color:#111827}.smart-empty{padding:18px;border:1px dashed #cbd5e1;border-radius:10px;color:#64748b;text-align:center;font-size:12px}.tool-panel[data-section="output"]>#exportZip{margin-top:4px}
  @media(max-width:900px){.smart-candidates{grid-template-columns:1fr}.smart-candidate{grid-template-columns:120px 1fr;grid-template-rows:none}.smart-preview{min-height:150px}}
  @media(max-width:560px){.inline-input-action{grid-template-columns:1fr}.smart-candidate{grid-template-columns:105px 1fr}.workflow-hint>div{display:grid;grid-template-columns:1fr 1fr}.workflow-hint button{width:100%}}
`;document.head.appendChild(style)}

const compilePrompt07=compilePrompt;
compilePrompt=function(){return `${compilePrompt07()}\n\nREFERENCE IMAGE RULE:\n- Use the CLEAN Manga Blueprint PNG as the visual composition reference.\n- The AI-generation package intentionally excludes annotated/review PNGs. Do not request, infer, or render authoring annotations such as panel numbers, camera labels, character display names, summaries, or editor metadata.\n- If an annotated/review PNG is separately supplied for human discussion, treat its labels as authoring metadata only, never as visible final-art text.`};

function exportManifest08(identity,packageType,files){return{schema:'manga-blueprint-export-manifest/2',packageType,exportId:identity.exportId,createdAt:identity.createdAt,contentHash:`sha256:${identity.contentHash}`,shortHash:identity.shortHash,projectTitle:project.meta.title,readingDirection:project.meta.readingDirection,canvas:{width:pageSize04().w,height:pageSize04().h},files,visualReference:files.cleanPng,authoringReview:files.annotatedPng||null,aiGenerationSafe:packageType==='ai-generation',identityRule:'Files sharing this contentHash represent the same serialized Manga Blueprint state.',handoffRule:'Use cleanPng as the image-generation reference. annotatedPng, when present, is human-review authoring metadata and must not be rendered.'}}
async function exportPackage08(packageType){
  const identity=await getExportIdentity06(),clean=await buildPngBlob06(false),prefix=identity.prefix,cleanName=`${prefix}_clean.png`,projectName=`${prefix}.manga.json`,promptName=`${prefix}_prompt.txt`,manifestName=`${prefix}_manifest.json`,isReview=packageType==='review-archive',annotatedName=isReview?`${prefix}_annotated.png`:null,files={cleanPng:cleanName,projectJson:projectName,prompt:promptName,manifest:manifestName};
  let annotated=null;if(isReview){annotated=await buildPngBlob06(true);files.annotatedPng=annotatedName}
  const manifest=exportManifest08(identity,packageType,files),entries=[{name:cleanName,data:clean},{name:projectName,data:JSON.stringify(project,null,2)},{name:promptName,data:compilePrompt()},{name:manifestName,data:JSON.stringify(manifest,null,2)}];if(isReview)entries.splice(1,0,{name:annotatedName,data:annotated});
  const zip=await zipStore06(entries);downloadBlob(zip,`${identity.prefix}_${isReview?'review':'ai'}.zip`);
}

function refreshSmartAvailability08(){
  const base=currentBaseCharacter06(),checkbox=$('randomPlaceBase08');if(checkbox){checkbox.disabled=!base;if(!base)checkbox.checked=false}
}
function bindPrototype06Ui08(){
  const form=$('randomForm');form?.addEventListener('submit',e=>{e.preventDefault();e.stopImmediatePropagation();buildSmartCandidates08();},{capture:true});
  $('randomBtn')?.addEventListener('click',()=>{if(!$('randomSeed08').value)$('randomSeed08').value=project.meta.randomSeed||newSeed08();smartCandidates08=[];renderSmartCandidates08();refreshSmartAvailability08()});
  $('randomNewSeed08')?.addEventListener('click',()=>{$('randomSeed08').value=newSeed08();smartCandidates08=[];renderSmartCandidates08()});
  $('smartCandidateList08')?.addEventListener('click',e=>{const btn=e.target.closest('[data-smart-apply]');if(btn)applySmartCandidate08(Number(btn.dataset.smartApply))});
  $('randomizePanel08')?.addEventListener('click',randomizeSelectedPanel08);
  $('workflowHint08')?.addEventListener('click',e=>{const btn=e.target.closest('[data-go-tab]');if(btn)document.querySelector(`.tab[data-tab="${btn.dataset.goTab}"]`)?.click()});
  $('helpDialog')?.addEventListener('close',()=>localStorage.setItem(HELP_SEEN_KEY_06,'1'));
  $('languageSelect').addEventListener('change',()=>queueMicrotask(()=>{renderSmartCandidates08();refreshSmartAvailability08();applyLanguage()}));
}

injectSmartUi08();
bindPrototype06Ui08();
const renderUi07=renderUi;
renderUi=function(){renderUi07();refreshSmartAvailability08();if($('randomizePanel08'))$('randomizePanel08').disabled=!selectedPanel()};
applyLanguage();
render();
document.querySelector('footer').textContent='Prototype 0.6 — client-side only / provider-independent';
