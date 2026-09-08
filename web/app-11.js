// Prototype 0.8: story-readable templates, panel peek/list, action intent,
// framing diagnostics/crop guide, and prompt identity-contract hardening.
const HELP_SEEN_KEY_08='manga-blueprint-studio/help-seen/0.8';

Object.assign(i18n.ja,{
  storyTemplate:'ストーリーテンプレート',storyTemplateHelp:'コマ割りだけでなく、各コマの役割・行動・カメラ・表情・サンプル台詞/SFXまでまとめて入れます。適用後は全部編集できます。',storyTemplateNone:'選択してください',storyTemplateIncludeText:'サンプル台詞・オノマトペも入れる',storyTemplateApply:'このストーリーテンプレを使う',storyTemplatePreview:'内容プレビュー',
  storyCuteDaily:'かわいい日常 4コマ',storyRomance:'ラブコメ・照れ 4コマ',storySurprise:'驚き 3コマ',storyGag:'ギャグ 4コマ',storyAction:'アクション一撃 3コマ',storyTemplateConfirm:'現在のコマ配置と内容をストーリーテンプレートで作り直します。続けますか？',storyTemplateApplied:'ストーリーテンプレートを適用しました。',
  actionIntent:'このコマで何が起きる？',actionIntentPlaceholder:'例: 振り向いてこちらを見る / コップを落として驚く',actionIntentHelp:'ポーズだけでは分からない「出来事」を短く書きます。Panel Peek・一覧・生成Promptにも使われます。',
  panelPeekHint:'コマを長押し、または ⓘ を押すと概要をすぐ確認できます。',panelPeekTitle:'コマ概要',panelPeekAction:'出来事',panelPeekCharacters:'キャラ',panelPeekCamera:'カメラ',panelPeekBackground:'背景',panelPeekDialogue:'セリフ',panelPeekEffects:'演出',panelPeekEdit:'このコマを編集',panelPeekText:'文字を編集',panelPeekDice:'🎲 演出だけおまかせ',panelPeekClose:'閉じる',
  panelListDetailed:'詳細一覧',panelListCompact:'1行表示',panelListEmptyAction:'出来事未入力',panelListNoDialogue:'セリフなし',
  framingHeading:'カメラ整合チェック',framingHelp:'カメラ距離と棒人間の大きさが矛盾していないか確認します。点線のCrop Guideは編集用の目安で、AI用PNGには入りません。',framingNoCharacter:'人物がいないため判定できません。',framingGood:'人物サイズはカメラ距離と概ね整合しています。',framingTooSmall:'カメラ指定に対して人物が小さすぎます。AIがJSONとPNGのどちらを優先するか不安定になります。',framingTooLarge:'カメラ指定に対して人物が大きすぎます。意図しない切れ方になる可能性があります。',framingFit:'人物サイズをカメラに合わせる',cropGuide:'Crop Guide',
  mangaLint:'漫画チェック',mangaLintOk:'大きな矛盾は見つかりませんでした。',lintNoAction:'出来事が未入力です',lintSameCamera:'同じカメラ距離が続いています',lintNoBackground:'複数コマですが背景場所がすべて未指定です',lintSameExpression:'同じ表情が続いています',lintFraming:'カメラ距離と人物サイズが不整合です',
  guideStoryReadable:'ページの意味をすぐ確認',guideStoryReadableBody:'ストーリーテンプレートは台詞/SFXを含む初期ネームを作れます。コマは長押しまたはⓘでPanel Peekを開き、一覧では出来事・カメラ・背景・セリフをまとめて確認できます。',guideFraming:'Camera Crop Guide',guideFramingBody:'Close/超寄りなのに棒人間が小さい等の矛盾を警告します。点線枠とサイズ調整は編集補助だけで、AI用クリーンPNGには出ません。'
});
Object.assign(i18n.en,{
  storyTemplate:'Story template',storyTemplateHelp:'Start from a complete editable beat pattern: layout, panel role, action, camera, expression, and optional sample dialogue/SFX.',storyTemplateNone:'Choose a template',storyTemplateIncludeText:'Include sample dialogue and SFX',storyTemplateApply:'Use this story template',storyTemplatePreview:'Preview',
  storyCuteDaily:'Cute daily 4-panel',storyRomance:'Rom-com blush 4-panel',storySurprise:'Surprise 3-panel',storyGag:'Gag 4-panel',storyAction:'Action impact 3-panel',storyTemplateConfirm:'Replace the current panel layout/content with this story template?',storyTemplateApplied:'Story template applied.',
  actionIntent:'What happens in this panel?',actionIntentPlaceholder:'Example: turns back and looks toward the reader / drops a cup and reacts',actionIntentHelp:'Describe the event that pose alone cannot explain. It appears in Panel Peek, the panel list, and the generation prompt.',
  panelPeekHint:'Long-press a panel or tap ⓘ for a quick summary.',panelPeekTitle:'Panel Peek',panelPeekAction:'Action',panelPeekCharacters:'Characters',panelPeekCamera:'Camera',panelPeekBackground:'Background',panelPeekDialogue:'Dialogue',panelPeekEffects:'Effects',panelPeekEdit:'Edit this panel',panelPeekText:'Edit text',panelPeekDice:'🎲 Re-roll direction',panelPeekClose:'Close',
  panelListDetailed:'Detailed list',panelListCompact:'One-line list',panelListEmptyAction:'No action intent',panelListNoDialogue:'No dialogue',
  framingHeading:'Camera consistency check',framingHelp:'Checks whether stick-figure scale contradicts camera distance. The dotted Crop Guide is authoring-only and never appears in the clean AI PNG.',framingNoCharacter:'No character to evaluate.',framingGood:'Character scale is broadly consistent with the camera distance.',framingTooSmall:'The character is too small for the selected camera distance. The AI may receive conflicting visual and semantic cues.',framingTooLarge:'The character is too large for the selected camera distance and may crop unexpectedly.',framingFit:'Fit character size to camera',cropGuide:'Crop Guide',
  mangaLint:'Manga check',mangaLintOk:'No major direction conflicts found.',lintNoAction:'Action intent is empty',lintSameCamera:'The same camera distance repeats',lintNoBackground:'Multiple panels but all background locations are unspecified',lintSameExpression:'The same expression repeats',lintFraming:'Camera distance and character scale conflict',
  guideStoryReadable:'Understand the page at a glance',guideStoryReadableBody:'Story templates can seed dialogue/SFX as an editable rough name. Long-press a panel or tap ⓘ for Panel Peek; the panel list shows action, camera, background, and dialogue together.',guideFraming:'Camera Crop Guide',guideFramingBody:'Warns about conflicts such as an extreme close-up paired with a tiny stick figure. Dotted guides and fit controls are authoring aids only and never appear in the clean AI PNG.'
});

function ensureStorySemantics11(p){
  p.meta ||= {};p.meta.storyTemplate=String(p.meta.storyTemplate||'');
  for(const page of p.pages||[])for(const panel of page.panels||[])panel.actionIntent=String(panel.actionIntent||'');
  return p;
}
const normalizeProject10Base11=normalizeProject;
normalizeProject=function(input){return ensureStorySemantics11(normalizeProject10Base11(input))};
project=normalizeProject(project);

const storyTemplates11={
  cuteDaily:{label:'storyCuteDaily',layout:'four-grid',background:{ja:{location:'明るい自室',timeOfDay:'day',weather:'晴れ',mood:'柔らかい'},en:{location:'bright bedroom',timeOfDay:'day',weather:'sunny',mood:'soft'}},beats:[
    {role:'setup',action:{ja:'部屋でこちらに気づく',en:'notices the viewer in the room'},pose:'stand',expression:'smile',gaze:'camera',camera:['long','eye-level','three-quarter-front'],dialogue:{ja:'おはよう',en:'Morning!'}},
    {role:'reaction',action:{ja:'呼ばれて振り向く',en:'turns back after being called'},pose:'lookback',expression:'shy',gaze:'camera',camera:['medium','eye-level','three-quarter-back'],dialogue:{ja:'ん？',en:'Hm?'}},
    {role:'beat',action:{ja:'少し屈んで顔をのぞき込む',en:'crouches slightly and peers closer'},pose:'crouch',expression:'surprised',gaze:'camera',camera:['close','high-angle','front'],dialogue:{ja:'どうしたの？',en:'What is it?'},sfx:{ja:'じー…',en:'STARE…'}},
    {role:'climax',action:{ja:'距離を詰めてこちらへ手を伸ばす',en:'closes the distance and reaches toward the viewer'},pose:'stand',expression:'smirk',gaze:'camera',camera:['close','low-angle','front'],lineEffect:'focus',breakout:'foreground',dialogue:{ja:'ふふっ',en:'Hehe.'}}
  ]},
  romance:{label:'storyRomance',layout:'climax',background:{ja:{location:'夕方の教室',timeOfDay:'evening',weather:'晴れ',mood:'静か'},en:{location:'classroom at sunset',timeOfDay:'evening',weather:'clear',mood:'quiet'}},beats:[
    {role:'setup',action:{ja:'放課後、二人きりの空気を確認する',en:'establishes the quiet after-school moment'},pose:'stand',expression:'neutral',gaze:'away',camera:['long','eye-level','three-quarter-front'],dialogue:{ja:'ねえ…',en:'Hey…'}},
    {role:'reaction',action:{ja:'呼び止められて振り向く',en:'turns back when called'},pose:'lookback',expression:'surprised',gaze:'other-character',camera:['medium','eye-level','three-quarter-back'],dialogue:{ja:'え？',en:'Huh?'}},
    {role:'beat',action:{ja:'言葉を待ちながら視線を外す',en:'looks away while waiting for the words'},pose:'stand',expression:'shy',gaze:'away',camera:['close','eye-level','three-quarter-front'],sfx:{ja:'ドキ',en:'THUMP'}},
    {role:'afterglow',action:{ja:'照れながら少し笑う',en:'smiles softly while blushing'},pose:'stand',expression:'shy',gaze:'camera',camera:['close','eye-level','front'],dialogue:{ja:'…なんでもない',en:'…Never mind.'}}
  ]},
  surprise:{label:'storySurprise',layout:'action3',background:{ja:{location:'自室',timeOfDay:'day',weather:'',mood:'普通'},en:{location:'bedroom',timeOfDay:'day',weather:'',mood:'ordinary'}},beats:[
    {role:'setup',action:{ja:'いつもの様子で過ごしている',en:'goes about the normal moment'},pose:'stand',expression:'neutral',gaze:'away',camera:['long','eye-level','three-quarter-front'],dialogue:{ja:'んー…',en:'Hmm…'}},
    {role:'transition',action:{ja:'物音に気づいて振り向く',en:'hears a noise and turns around'},pose:'lookback',expression:'surprised',gaze:'other-character',camera:['medium','dutch-angle','three-quarter-back'],sfx:{ja:'ガタン',en:'CLATTER'}},
    {role:'reaction',action:{ja:'驚いてこちらを見る',en:'reacts in surprise toward the viewer'},pose:'crouch',expression:'surprised',gaze:'camera',camera:['close','eye-level','front'],dialogue:{ja:'えっ！？',en:'What!?'}}
  ]},
  gag:{label:'storyGag',layout:'four-vertical',background:{ja:{location:'シンプルな室内',timeOfDay:'day',weather:'',mood:'軽い'},en:{location:'simple room',timeOfDay:'day',weather:'',mood:'light'}},beats:[
    {role:'setup',action:{ja:'普通に話し始める',en:'starts talking normally'},pose:'stand',expression:'neutral',gaze:'camera',camera:['medium','eye-level','front'],dialogue:{ja:'聞いて',en:'Listen.'}},
    {role:'exposition',action:{ja:'自信満々に説明する',en:'explains with total confidence'},pose:'stand',expression:'smirk',gaze:'camera',camera:['medium','eye-level','three-quarter-front'],dialogue:{ja:'完璧だから',en:'It is perfect.'}},
    {role:'transition',action:{ja:'直後に失敗へ気づく',en:'immediately realizes the mistake'},pose:'crouch',expression:'surprised',gaze:'down',camera:['close','high-angle','front'],sfx:{ja:'シーン',en:'…'}},
    {role:'reaction',action:{ja:'無言でこちらを見る',en:'silently looks at the viewer'},pose:'stand',expression:'neutral',gaze:'camera',camera:['close','eye-level','front'],dialogue:{ja:'…忘れて',en:'…Forget that.'}}
  ]},
  action:{label:'storyAction',layout:'action3',background:{ja:{location:'訓練場',timeOfDay:'day',weather:'',mood:'緊張'},en:{location:'training area',timeOfDay:'day',weather:'',mood:'tense'}},beats:[
    {role:'setup',action:{ja:'間合いを詰めるため走り出す',en:'starts a run to close the distance'},pose:'run',expression:'angry',gaze:'other-character',camera:['long','eye-level','side'],lineEffect:'speed',sfx:{ja:'ダッ',en:'DASH'}},
    {role:'transition',action:{ja:'踏み込んで攻撃へ移る',en:'plants the step and commits to the attack'},pose:'punch',expression:'angry',gaze:'other-character',camera:['medium','low-angle','three-quarter-front'],lineEffect:'speed',dialogue:{ja:'はっ！',en:'Hah!'}},
    {role:'climax',action:{ja:'右ストレートが決まる瞬間を大きく見せる',en:'shows the decisive right straight at impact'},pose:'punch',expression:'angry',gaze:'other-character',camera:['extreme-close','low-angle','near-object'],lineEffect:'impact',breakout:'foreground',sfx:{ja:'バキッ',en:'CRACK'}}
  ]}
};

const expressionLabels11={neutral:['無表情','Neutral'],smile:['笑顔','Smile'],shy:['照れ','Shy'],angry:['怒り','Angry'],surprised:['驚き','Surprised'],sad:['悲しみ','Sad'],fear:['恐怖','Fear'],smirk:['ニヤリ','Smirk'],sleepy:['眠そう','Sleepy']};
const gazeLabels11={camera:['こちらを見る','Camera'], 'other-character':['相手を見る','Other character'], down:['下を見る','Down'],up:['上を見る','Up'],away:['視線を外す','Away'],closed:['目を閉じる','Eyes closed'],custom:['自由指定','Custom']};
const distanceTarget11={'extreme-long':.25,long:.55,medium:.78,close:1.12,'extreme-close':1.55};
const distanceRange11={'extreme-long':[.08,.42],long:[.28,.82],medium:[.42,1.12],close:[.68,1.55],'extreme-close':[.95,3]};
const cropFactor11={'extreme-long':.92,long:.8,medium:.64,close:.46,'extreme-close':.3};

function humanRole11(role){const v=roleLabels04[role];return v?v[language==='ja'?0:1]:role}
function humanExpression11(type){const v=expressionLabels11[type];return v?v[language==='ja'?0:1]:type}
function humanGaze11(target){const v=gazeLabels11[target];return v?v[language==='ja'?0:1]:target}
function humanDistance11(distance){const v=cameraDistanceOptions04.find(x=>x[0]===distance);return v?(language==='ja'?v[1].split(' — ')[0]:v[2].split(' — ')[0]):distance}
function humanAngle11(angle){const v=cameraAngleOptions04.find(x=>x[0]===angle);return v?(language==='ja'?v[1].split(' — ')[0]:v[2].split(' — ')[0]):angle}
function humanPose11(id){const p=posePresets[id]||posePresets.stand;return language==='ja'?p.ja:p.en}
function localized11(value){return typeof value==='object'?(value[language]??value.ja??value.en??''):String(value??'')}
function panelDialogue11(panel){return (panel.balloons||[]).map(b=>b.text?.trim()).filter(Boolean)}
function firstPlacedCharacter11(panel){return panel.characters?.find(c=>c.id===selectedCharacterId)||panel.characters?.[0]||null}
function poseHeight11(ch){const pose=posePresets[ch?.poseId]||posePresets.stand,ys=Object.values(pose.joints).map(v=>v[1]);return Math.max(...ys,pose.joints.head[1]+22)-Math.min(...ys,pose.joints.head[1]-22)}
function figureFill11(panel,ch){if(!panel||!ch)return null;return poseHeight11(ch)*Number(ch.scale||1)/Math.max(1,panel.rect.h)}
function framingStatus11(panel){
  const ch=firstPlacedCharacter11(panel);if(!ch)return{kind:'none',text:t('framingNoCharacter'),fill:null,ch:null};
  const fill=figureFill11(panel,ch),range=distanceRange11[panel.camera?.distance]||[0,99];
  if(fill<range[0])return{kind:'small',text:t('framingTooSmall'),fill,ch};
  if(fill>range[1])return{kind:'large',text:t('framingTooLarge'),fill,ch};
  return{kind:'good',text:t('framingGood'),fill,ch};
}
function fitCharacterToCamera11(){
  const panel=selectedPanel(),status=framingStatus11(panel),ch=status.ch;if(!panel||!ch)return;
  const target=distanceTarget11[panel.camera.distance]||.78,localH=poseHeight11(ch);mutate(()=>{ch.scale=Math.max(.35,Math.min(3,target*panel.rect.h/localH));});
}

function makeStoryInstance11(base,panel,beat){
  const ch=copyBaseToInstance06(base,panel);ch.poseId=beat.pose||base.poseId||'stand';ch.expression.type=beat.expression||'neutral';ch.expression.intensity=beat.expression==='neutral'?.45:.7;ch.gaze.target=beat.gaze||'camera';
  const localH=poseHeight11(ch),target=distanceTarget11[beat.camera?.[0]||'medium']||.78;ch.scale=Math.max(.35,Math.min(3,target*panel.rect.h/localH));
  if(['close','extreme-close'].includes(beat.camera?.[0])){const headY=(posePresets[ch.poseId]||posePresets.stand).joints.head[1];ch.y=panel.rect.y+panel.rect.h*.47-headY*ch.scale;}
  return ch;
}
function makeStoryBalloon11(panel,text,base,type='speech'){
  const rtl=project.meta.readingDirection==='rtl';return{id:uid('balloon'),type,speakerId:base?.characterId||'',text,x:panel.rect.x+panel.rect.w*(rtl?.73:.27),y:panel.rect.y+Math.min(panel.rect.h*.18,90),size:1};
}
function storyTemplateLabel11(id){const tpl=storyTemplates11[id];return tpl?t(tpl.label):id}
function storyBeatPreview11(beat,index){
  const text=localized11(beat.dialogue),sfx=localized11(beat.sfx);return `${index+1}. ${humanRole11(beat.role)} — ${localized11(beat.action)}${text?` / 💬「${text}」`:''}${sfx?` / SFX「${sfx}」`:''}`;
}
function renderStoryTemplatePreview11(){
  const box=$('storyTemplatePreview11'),id=$('storyTemplateSelect11')?.value,tpl=storyTemplates11[id];if(!box)return;
  box.innerHTML=tpl?`<strong>${escapeXml(storyTemplateLabel11(id))}</strong><div class="story-beats11">${tpl.beats.map((b,i)=>`<div>${escapeXml(storyBeatPreview11(b,i))}</div>`).join('')}</div>`:`<span>${escapeXml(t('storyTemplateHelp'))}</span>`;
}
function applyStoryTemplate11(){
  const id=$('storyTemplateSelect11')?.value,tpl=storyTemplates11[id];if(!tpl)return;
  const page=currentPage(),hasAuthored=page.panels.some(p=>p.characters?.length||p.balloons?.length||p.effects?.sfxText||p.actionIntent);if(hasAuthored&&!confirm(t('storyTemplateConfirm')))return;
  const withText=$('storyTemplateText11')?.checked!==false,base=currentBaseCharacter06?.()||project.characterLibrary?.[0]||null,size=pageSize04(),rects=layoutRects04(tpl.layout,size.w,size.h),bg=tpl.background[language]||tpl.background.ja;
  mutate(()=>{
    page.panels=rects.map((r,i)=>makePanel(r,i+1));project.meta.layoutPreset=tpl.layout;project.meta.storyTemplate=id;project.meta.randomPurpose='';project.meta.randomSeed='';project.meta.randomVariant=undefined;
    page.panels.forEach((panel,i)=>{
      const beat=tpl.beats[i]||tpl.beats.at(-1);panel.role=beat.role;panel.actionIntent=localized11(beat.action);Object.assign(panel.camera,{distance:beat.camera[0],angle:beat.camera[1],viewpoint:beat.camera[2]});Object.assign(panel.background,bg);panel.effects.lineEffect=beat.lineEffect||'none';panel.effects.strength=beat.lineEffect?'high':'medium';panel.style.breakout=beat.breakout||'none';
      if(base)panel.characters=[makeStoryInstance11(base,panel,beat)];
      if(withText&&beat.dialogue)panel.balloons=[makeStoryBalloon11(panel,localized11(beat.dialogue),base,beat.balloonType||'speech')];
      if(withText&&beat.sfx)panel.effects.sfxText=localized11(beat.sfx);
    });renumberPanels();selectedPanelId=page.panels.find(p=>p.order===1)?.id||page.panels[0]?.id||null;selectedCharacterId=null;selectedBalloonId=null;
  });
}

const panelSummary10Base11=panelSummary04;
panelSummary04=function(panel){
  const parts=[humanRole11(panel.role)];if(panel.actionIntent?.trim())parts.push(panel.actionIntent.trim());
  if(panel.characters?.length){const ch=panel.characters[0];parts.push(humanPose11(ch.poseId));parts.push(humanExpression11(ch.expression?.type));}
  parts.push(humanDistance11(panel.camera?.distance));
  const dialogue=panelDialogue11(panel);if(dialogue.length)parts.push(`💬「${dialogue[0].slice(0,18)}${dialogue[0].length>18?'…':''}」`);if(panel.effects?.sfxText?.trim())parts.push(`SFX ${panel.effects.sfxText.trim()}`);return parts.filter(Boolean).join(' / ');
};

function panelChipText11(panel){
  const action=panel.actionIntent?.trim()||t('panelListEmptyAction'),ch=panel.characters?.[0],dialogue=panelDialogue11(panel);const bits=[`${panel.order}`,humanRole11(panel.role),action];if(ch)bits.push(humanPose11(ch.poseId),humanExpression11(ch.expression?.type));bits.push(humanDistance11(panel.camera.distance));if(dialogue.length)bits.push(`💬${dialogue.length}`);if(panel.effects?.sfxText)bits.push(`SFX`);return bits.join('｜');
}
function compactPanelDetail11(panel){
  const ch=panel.characters?.[0],parts=[];if(ch)parts.push(`${humanPose11(ch.poseId)}・${humanExpression11(ch.expression?.type)}・${humanGaze11(ch.gaze?.target)}`);parts.push(`${humanDistance11(panel.camera.distance)} / ${humanAngle11(panel.camera.angle)}`);if(panel.background?.location)parts.push(`🌆 ${panel.background.location}`);const d=panelDialogue11(panel);if(d.length)parts.push(`💬 ${d.join(' / ')}`);if(panel.effects?.sfxText)parts.push(`SFX ${panel.effects.sfxText}`);return parts.join(' · ');
}
function renderPanelList11(){
  const list=$('panelOverview');if(!list)return;const detailed=$('panelListMode11')?.value!=='compact',panels=[...currentPage().panels].sort((a,b)=>a.order-b.order);
  list.classList.toggle('overview-detailed11',detailed);list.innerHTML=panels.map(p=>detailed?`<button type="button" class="panel-card11 ${p.id===selectedPanelId?'active':''}" data-panel-card11="${escapeXml(p.id)}"><span class="panel-card-number11">${p.order}</span><span class="panel-card-copy11"><strong>${escapeXml(humanRole11(p.role))} — ${escapeXml(p.actionIntent?.trim()||t('panelListEmptyAction'))}</strong><small>${escapeXml(compactPanelDetail11(p)||t('panelListNoDialogue'))}</small></span><span class="panel-card-info11">ⓘ</span></button>`:`<button type="button" data-panel-card11="${escapeXml(p.id)}" class="${p.id===selectedPanelId?'active':''}">${escapeXml(panelSummary04(p))}</button>`).join('');
}
function selectPanel11(id){if(!currentPage().panels.some(p=>p.id===id))return;selectedPanelId=id;selectedCharacterId=null;selectedBalloonId=null;render();}

function mangaLint11(){
  const panels=[...currentPage().panels].sort((a,b)=>a.order-b.order),issues=[];
  for(const p of panels){if(!p.actionIntent?.trim())issues.push({panelId:p.id,text:`${p.order}: ${t('lintNoAction')}`,level:'info'});const f=framingStatus11(p);if(['small','large'].includes(f.kind))issues.push({panelId:p.id,text:`${p.order}: ${t('lintFraming')}`,level:'warn'});}
  if(panels.length>=3&&panels.every(p=>p.camera.distance===panels[0].camera.distance))issues.push({text:t('lintSameCamera'),level:'info'});
  if(panels.length>=2&&panels.every(p=>!p.background?.location?.trim()))issues.push({text:t('lintNoBackground'),level:'info'});
  const expressions=panels.map(p=>p.characters?.[0]?.expression?.type).filter(Boolean);if(expressions.length>=3&&expressions.every(x=>x===expressions[0]))issues.push({text:t('lintSameExpression'),level:'info'});
  return issues;
}
function renderMangaLint11(){const box=$('mangaLint11');if(!box)return;const issues=mangaLint11();box.innerHTML=`<strong>${escapeXml(t('mangaLint'))}</strong>${issues.length?`<div>${issues.map((x,i)=>`<button type="button" class="lint-item11 ${x.level}" data-lint-panel11="${escapeXml(x.panelId||'')}">${escapeXml(x.text)}</button>`).join('')}</div>`:`<p>${escapeXml(t('mangaLintOk'))}</p>`}`;}

function renderFramingCheck11(){
  const box=$('framingCheck11'),panel=selectedPanel();if(!box||!panel)return;const s=framingStatus11(panel),fill=s.fill==null?'—':`${Math.round(s.fill*100)}%`;
  box.className=`framing-check11 ${s.kind}`;box.innerHTML=`<div><strong>${escapeXml(t('framingHeading'))}</strong><span>${escapeXml(s.text)}</span><small>figure / panel height: ${fill}</small></div>${s.ch?`<button id="fitFraming11" type="button">${escapeXml(t('framingFit'))}</button>`:''}`;$('fitFraming11')?.addEventListener('click',fitCharacterToCamera11);
}

function svgNode11(name,attrs={}){const el=document.createElementNS('http://www.w3.org/2000/svg',name);for(const [k,v] of Object.entries(attrs))el.setAttribute(k,String(v));return el}
function decoratePanelCanvas11(){
  svg.querySelectorAll('[data-authoring-overlay11]').forEach(x=>x.remove());const panel=selectedPanel();
  for(const p of currentPage().panels){const r=panelRect(p),g=svgNode11('g',{'data-authoring-overlay11':'','class':'authoring-overlay11'}),text=panelChipText11(p);if(r.h>95&&r.w>120){const shown=text.length>42?`${text.slice(0,41)}…`:text,w=Math.min(r.w-48,Math.max(110,shown.length*7+20)),y=r.y+r.h-31;const rect=svgNode11('rect',{x:r.x+8,y,width:w,height:23,rx:8,class:'panel-chip-bg11'}),tx=svgNode11('text',{x:r.x+17,y:y+16,class:'panel-chip-text11'});tx.textContent=shown;g.append(rect,tx)}
    const ig=svgNode11('g',{'data-panel-info11':p.id,class:'panel-info11',transform:`translate(${r.x+r.w-19} ${r.y+r.h-19})`}),circle=svgNode11('circle',{cx:0,cy:0,r:13}),it=svgNode11('text',{x:0,y:5,'text-anchor':'middle'});it.textContent='i';ig.append(circle,it);g.appendChild(ig);svg.appendChild(g);
  }
  if(panel){const ch=firstPlacedCharacter11(panel),factor=cropFactor11[panel.camera.distance];if(ch&&factor){const r=panelRect(panel),pose=posePresets[ch.poseId]||posePresets.stand,head=pose.joints.head,headX=ch.x+head[0]*ch.scale,headY=ch.y+head[1]*ch.scale,cx=['close','extreme-close'].includes(panel.camera.distance)?headX:ch.x,cy=['close','extreme-close'].includes(panel.camera.distance)?headY:ch.y,w=r.w*factor,h=r.h*factor,x=Math.max(r.x,Math.min(r.x+r.w-w,cx-w/2)),y=Math.max(r.y,Math.min(r.y+r.h-h,cy-h/2)),g=svgNode11('g',{'data-authoring-overlay11':'','class':'crop-guide11'}),rect=svgNode11('rect',{x,y,width:w,height:h,rx:10}),label=svgNode11('text',{x:x+8,y:y+18});label.textContent=`${t('cropGuide')} · ${humanDistance11(panel.camera.distance)}`;g.append(rect,label);svg.appendChild(g)}}
}

function openPanelPeek11(id=selectedPanelId){
  if(id&&id!==selectedPanelId){selectedPanelId=id;selectedCharacterId=null;selectedBalloonId=null;render();}
  const panel=selectedPanel(),dialog=$('panelPeek11');if(!panel||!dialog)return;const chars=(panel.characters||[]).map(c=>`${c.name||c.characterId}: ${humanPose11(c.poseId)} / ${humanExpression11(c.expression?.type)} / ${humanGaze11(c.gaze?.target)}`).join('\n')||'—',bg=[panel.background?.location,panel.background?.timeOfDay,panel.background?.weather,panel.background?.mood].filter(Boolean).join(' / ')||'—',dialogue=panelDialogue11(panel),effects=[panel.effects?.lineEffect&&panel.effects.lineEffect!=='none'?panel.effects.lineEffect:'',panel.effects?.sfxText?`SFX ${panel.effects.sfxText}`:'',panel.style?.breakout&&panel.style.breakout!=='none'?`breakout=${panel.style.breakout}`:''].filter(Boolean).join(' / ')||'—',frame=framingStatus11(panel);
  dialog.innerHTML=`<form method="dialog" class="modal-card panel-peek-card11"><div class="section-title-row"><h2>${escapeXml(t('panelPeekTitle'))} ${panel.order}</h2><button value="close" aria-label="Close">×</button></div><div class="peek-grid11"><div><b>${escapeXml(t('panelPeekAction'))}</b><span>${escapeXml(panel.actionIntent?.trim()||t('panelListEmptyAction'))}</span></div><div><b>${escapeXml(t('panelPeekCharacters'))}</b><span>${escapeXml(chars)}</span></div><div><b>${escapeXml(t('panelPeekCamera'))}</b><span>${escapeXml(`${humanDistance11(panel.camera.distance)} / ${humanAngle11(panel.camera.angle)} / ${panel.camera.viewpoint}`)}</span></div><div><b>${escapeXml(t('panelPeekBackground'))}</b><span>${escapeXml(bg)}</span></div><div><b>${escapeXml(t('panelPeekDialogue'))}</b><span>${escapeXml(dialogue.length?dialogue.map(x=>`「${x}」`).join(' / '):t('panelListNoDialogue'))}</span></div><div><b>${escapeXml(t('panelPeekEffects'))}</b><span>${escapeXml(effects)}</span></div></div><div class="peek-framing11 ${frame.kind}">${escapeXml(frame.text)}</div><div class="button-grid"><button id="peekEdit11" type="button" class="primary">${escapeXml(t('panelPeekEdit'))}</button><button id="peekText11" type="button">${escapeXml(t('panelPeekText'))}</button><button id="peekDice11" type="button">${escapeXml(t('panelPeekDice'))}</button><button value="close">${escapeXml(t('panelPeekClose'))}</button></div></form>`;
  $('peekEdit11')?.addEventListener('click',()=>{dialog.close();document.querySelector('.tab[data-tab="panel"]')?.click()});$('peekText11')?.addEventListener('click',()=>{dialog.close();document.querySelector('.tab[data-tab="text"]')?.click()});$('peekDice11')?.addEventListener('click',()=>{dialog.close();if(typeof randomizePanel08==='function')randomizePanel08()});
  if(!dialog.open)dialog.showModal();
}

function injectPrototype08Ui11(){
  const page=document.querySelector('.tool-panel[data-section="page"]');if(page&&!$('storyTemplateBlock11')){const anchor=page.querySelector('.section-title-row');const box=document.createElement('div');box.id='storyTemplateBlock11';box.className='story-template11';box.innerHTML=`<div class="subhead" data-i18n="storyTemplate"></div><p class="help" data-i18n="storyTemplateHelp"></p><label><span data-i18n="storyTemplate"></span><select id="storyTemplateSelect11"><option value="" data-i18n="storyTemplateNone"></option>${Object.entries(storyTemplates11).map(([id,x])=>`<option value="${id}" data-i18n="${x.label}"></option>`).join('')}</select></label><label class="check-row"><input id="storyTemplateText11" type="checkbox" checked/><span data-i18n="storyTemplateIncludeText"></span></label><div id="storyTemplatePreview11" class="summary-card"></div><button id="applyStoryTemplate11" type="button" class="primary full" data-i18n="storyTemplateApply"></button>`;anchor?.insertAdjacentElement('afterend',box);
    const overview=page.querySelector('#panelOverview');if(overview&&!$('panelListControls11')){const controls=document.createElement('div');controls.id='panelListControls11';controls.className='panel-list-controls11';controls.innerHTML=`<span data-i18n="panelPeekHint"></span><select id="panelListMode11"><option value="detailed" data-i18n="panelListDetailed"></option><option value="compact" data-i18n="panelListCompact"></option></select>`;overview.insertAdjacentElement('beforebegin',controls);const lint=document.createElement('div');lint.id='mangaLint11';lint.className='summary-card manga-lint11';overview.insertAdjacentElement('afterend',lint)}}
  const panel=document.querySelector('.tool-panel[data-section="panel"]');if(panel&&!$('actionIntent11')){const summary=$('selectedPanelSummary');const wrap=document.createElement('div');wrap.id='actionIntentBlock11';wrap.innerHTML=`<label><span data-i18n="actionIntent"></span><textarea id="actionIntent11" rows="2" data-i18n-placeholder="actionIntentPlaceholder"></textarea><small data-i18n="actionIntentHelp"></small></label>`;summary?.insertAdjacentElement('afterend',wrap);const cameraHelpEl=$('cameraHelp');const frame=document.createElement('div');frame.id='framingCheck11';frame.className='framing-check11';cameraHelpEl?.insertAdjacentElement('afterend',frame)}
  if(!$('panelPeek11')){const d=document.createElement('dialog');d.id='panelPeek11';d.className='modal panel-peek-dialog11';document.body.appendChild(d)}
  const help=$('helpDialog');if(help&&!$('guideStoryReadable11')){const target=help.querySelector('[data-i18n="guideExport"]')?.closest('.guide-section');const section=document.createElement('section');section.id='guideStoryReadable11';section.className='guide-section';section.innerHTML=`<h3 data-i18n="guideStoryReadable"></h3><p data-i18n="guideStoryReadableBody"></p><h3 data-i18n="guideFraming"></h3><p data-i18n="guideFramingBody"></p>`;target?.insertAdjacentElement('beforebegin',section)}
  if(!$('prototype08Style11')){const s=document.createElement('style');s.id='prototype08Style11';s.textContent=`
    .story-template11{border:1px solid #d7dee8;border-radius:14px;padding:12px;margin:10px 0;background:#fbfcfe}.story-beats11{display:grid;gap:6px;margin-top:8px;font-size:.88rem}.panel-list-controls11{display:flex;align-items:center;justify-content:space-between;gap:8px;margin:8px 0}.panel-list-controls11 span{font-size:.82rem;color:#5b6574}.panel-list-controls11 select{width:auto;min-width:120px}.overview-detailed11{display:grid;gap:7px}.panel-card11{display:grid!important;grid-template-columns:32px 1fr 24px;align-items:center;text-align:left!important;gap:8px;padding:9px!important}.panel-card-number11{display:grid;place-items:center;width:28px;height:28px;border-radius:50%;background:#111827;color:white;font-weight:800}.panel-card-copy11{display:grid;gap:3px;min-width:0}.panel-card-copy11 small{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#647084}.panel-card-info11{font-size:1.05rem}.manga-lint11{margin-top:10px}.lint-item11{display:block;width:100%;text-align:left;margin-top:5px}.lint-item11.warn{border-color:#d97706;background:#fff8e8}.framing-check11{display:flex;align-items:center;justify-content:space-between;gap:10px;border:1px solid #d7dee8;border-radius:12px;padding:9px;margin:8px 0}.framing-check11>div{display:grid;gap:2px}.framing-check11 span,.framing-check11 small{font-size:.82rem}.framing-check11.small,.framing-check11.large{border-color:#d97706;background:#fff8e8}.framing-check11.good{border-color:#2f855a;background:#f0fff4}.authoring-overlay11{pointer-events:none}.panel-chip-bg11{fill:#111827;opacity:.86}.panel-chip-text11{fill:white;font-size:12px;font-weight:700}.panel-info11{pointer-events:all;cursor:pointer}.panel-info11 circle{fill:white;stroke:#111827;stroke-width:2}.panel-info11 text{font-size:15px;font-weight:900;fill:#111827}.crop-guide11{pointer-events:none}.crop-guide11 rect{fill:none;stroke:#0f766e;stroke-width:2.5;stroke-dasharray:8 6;opacity:.85}.crop-guide11 text{fill:#0f766e;font-size:12px;font-weight:800}.panel-peek-dialog11{padding:0;border:0;background:transparent}.panel-peek-card11{max-width:620px}.peek-grid11{display:grid;grid-template-columns:1fr 1fr;gap:8px}.peek-grid11>div{display:grid;gap:3px;border:1px solid #e2e8f0;border-radius:10px;padding:9px}.peek-grid11 span{white-space:pre-line;font-size:.9rem}.peek-framing11{margin:10px 0;padding:8px;border-radius:9px;background:#f5f7fa}.peek-framing11.small,.peek-framing11.large{background:#fff4df}.check-row{display:flex!important;align-items:center;gap:8px}.check-row input{width:auto}.check-row span{margin:0}
    @media(max-width:760px){.panel-list-controls11{align-items:flex-start;flex-direction:column}.panel-list-controls11 select{width:100%}.panel-peek-dialog11{width:100%;max-width:none;margin:auto 0 0 0}.panel-peek-card11{border-radius:18px 18px 0 0;max-width:none}.peek-grid11{grid-template-columns:1fr}.panel-card-copy11 small{white-space:normal}}
  `;document.head.appendChild(s)}
}

function bindPrototype08Ui11(){
  $('storyTemplateSelect11')?.addEventListener('change',renderStoryTemplatePreview11);$('applyStoryTemplate11')?.addEventListener('click',applyStoryTemplate11);$('panelListMode11')?.addEventListener('change',renderPanelList11);
  $('panelOverview')?.addEventListener('click',e=>{const btn=e.target.closest('[data-panel-card11]');if(btn)selectPanel11(btn.dataset.panelCard11)});
  $('mangaLint11')?.addEventListener('click',e=>{const btn=e.target.closest('[data-lint-panel11]');if(btn?.dataset.lintPanel11){selectPanel11(btn.dataset.lintPanel11);document.querySelector('.tab[data-tab="panel"]')?.click();}});
  $('actionIntent11')?.addEventListener('change',()=>{const panel=selectedPanel();if(panel)mutate(()=>panel.actionIntent=$('actionIntent11').value)});
  $('languageSelect')?.addEventListener('change',()=>queueMicrotask(()=>{renderStoryTemplatePreview11();renderPanelList11();renderMangaLint11();renderFramingCheck11();applyLanguage()}));
  $('helpDialog')?.addEventListener('close',()=>localStorage.setItem(HELP_SEEN_KEY_08,'1'));

  let timer=null,start=null,longTriggered=false;const clear=()=>{if(timer)clearTimeout(timer);timer=null;start=null};
  svg.addEventListener('pointerdown',e=>{const hit=e.target.closest('[data-panel-hit]');if(!hit)return;start={x:e.clientX,y:e.clientY,id:hit.dataset.panelHit};timer=setTimeout(()=>{longTriggered=true;openPanelPeek11(start.id);clear()},560)});
  svg.addEventListener('pointermove',e=>{if(start&&Math.hypot(e.clientX-start.x,e.clientY-start.y)>12)clear()});svg.addEventListener('pointerup',clear);svg.addEventListener('pointercancel',clear);
  svg.addEventListener('click',e=>{const info=e.target.closest('[data-panel-info11]');if(info){e.preventDefault();e.stopImmediatePropagation();openPanelPeek11(info.dataset.panelInfo11);return}if(longTriggered){e.preventDefault();e.stopImmediatePropagation();longTriggered=false}},true);
}

const renderCanvas10Base11=renderCanvas;
renderCanvas=function(){renderCanvas10Base11();decoratePanelCanvas11()};
const renderUi10Base11=renderUi;
renderUi=function(){renderUi10Base11();const panel=selectedPanel();if($('actionIntent11')){$('actionIntent11').disabled=!panel;$('actionIntent11').value=panel?.actionIntent||''}renderStoryTemplatePreview11();renderPanelList11();renderMangaLint11();renderFramingCheck11();};

const compilePrompt10Base11=compilePrompt;
compilePrompt=function(){
  let out=compilePrompt10Base11();out=out.replace('- Character visual identity comes only from the separately attached Character Sheets.','- Character visual identity follows CHARACTER IDENTITY GUIDANCE. Use separately attached Character Sheets only for characters whose identity mode requires them.');out=out.replace('Treat image + semantic instructions + Character Sheets as one contract. Preserve user-authored panel composition and manga direction.','Treat image + semantic instructions + CHARACTER IDENTITY GUIDANCE, plus separately attached Character Sheets only where required, as one contract. Preserve user-authored panel composition and manga direction.');
  const intents=[...currentPage().panels].sort((a,b)=>a.order-b.order).filter(p=>p.actionIntent?.trim());if(intents.length){const section=`\nSTORY ACTION INTENT:\n${intents.map(p=>`- Panel ${p.order}: ${p.actionIntent.trim()}`).join('\n')}\n`;out=out.replace('\nTEXT TO RENDER:',`${section}\nTEXT TO RENDER:`)}return out;
};

if(typeof exportManifest08==='function'){
  const exportManifest10Base11=exportManifest08;exportManifest08=function(identity,packageType,files){const manifest=exportManifest10Base11(identity,packageType,files);manifest.storyTemplate=project.meta.storyTemplate||null;manifest.panelIntentIndex=[...currentPage().panels].sort((a,b)=>a.order-b.order).map(p=>({panelId:p.id,order:p.order,role:p.role,actionIntent:p.actionIntent||''}));return manifest;};
}

injectPrototype08Ui11();bindPrototype08Ui11();ensureStorySemantics11(project);document.querySelector('footer')&&(document.querySelector('footer').textContent='Prototype 0.8 · Client-side only · Local autosave');applyLanguage();render();
