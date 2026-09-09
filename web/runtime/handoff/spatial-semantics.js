// Prototype 0.11: pose support/depth semantics, aerial-action poses, scene continuity anchors, and stronger clean-blueprint perspective cues.
Object.assign(i18n.ja,{
  poseAirborneApproach:'空中接近',poseDiveAttack:'飛び込み攻撃',poseAerialPunch:'空中ストレート',poseGuard:'構える',poseKick:'前蹴り',
  motionSemantics:'身体・動きの意味',supportState:'支持状態',supportAuto:'ポーズから自動',supportGrounded:'接地',supportAirborne:'空中',supportSupported:'何かに支えられる',supportUnknown:'未指定',motionPhase:'動作フェーズ',motionAuto:'ポーズから自動',motionStill:'静止',motionAnticipation:'予備動作',motionApproach:'接近',motionLaunch:'踏切・離陸',motionAirborne:'空中移動',motionImpact:'インパクト',motionRecovery:'戻り',
  depthHeading:'奥行き・短縮遠近',depthTarget:'カメラ手前へ出すもの',depthAuto:'ポーズから自動',depthRightHand:'右手 / 右拳',depthLeftHand:'左手 / 左拳',depthRightFoot:'右足',depthLeftFoot:'左足',depthFace:'顔',depthProp:'小物',depthNone:'特になし',foreshortening:'短縮遠近の強さ',foreshortenNormal:'通常',foreshortenStrong:'強い',foreshortenExtreme:'極端',depthHelp:'Near-object / 超前景では、手前へ出す部位をClean PNGでも大きなモノクロ目印として表現し、JSON/Promptにも奥行きを残します。',
  sceneContinuity:'場所の連続性',sceneId:'Scene ID',sceneIdPlaceholder:'例: rooftop-A / bedroom-1',sceneFrom:'前のコマと同じ場所',sceneNew:'新しい / 指定なし',sceneAnchorNotes:'場所の固定要素',sceneAnchorPlaceholder:'例: 左にベッド、右に窓。机の位置を全コマで維持。',
  gazeOffPanel:'画面外の相手 / 対象',
  readinessAirborneMismatch:'出来事は空中動作ですが、人物の支持状態が接地になっています。',readinessDepthTarget:'Near-object / 超前景の対象を指定するとモデル差が減ります。',
  guidePoseDepth:'空中ポーズと奥行き',guidePoseDepthBody:'空中接近・飛び込み攻撃・空中ストレートを選べます。Near-objectでは右拳など手前へ出す対象と短縮遠近の強さを指定すると、Clean PNGとPromptの両方へ反映します。'
});
Object.assign(i18n.en,{
  poseAirborneApproach:'Airborne approach',poseDiveAttack:'Dive attack',poseAerialPunch:'Aerial straight punch',poseGuard:'Guard stance',poseKick:'Front kick',
  motionSemantics:'Body / motion semantics',supportState:'Support state',supportAuto:'Infer from pose',supportGrounded:'Grounded',supportAirborne:'Airborne',supportSupported:'Supported by object',supportUnknown:'Unspecified',motionPhase:'Motion phase',motionAuto:'Infer from pose',motionStill:'Still',motionAnticipation:'Anticipation',motionApproach:'Approach',motionLaunch:'Launch / takeoff',motionAirborne:'Airborne movement',motionImpact:'Impact',motionRecovery:'Recovery',
  depthHeading:'Depth / foreshortening',depthTarget:'Foreground target',depthAuto:'Infer from pose',depthRightHand:'Right hand / fist',depthLeftHand:'Left hand / fist',depthRightFoot:'Right foot',depthLeftFoot:'Left foot',depthFace:'Face',depthProp:'Prop',depthNone:'None',foreshortening:'Foreshortening strength',foreshortenNormal:'Normal',foreshortenStrong:'Strong',foreshortenExtreme:'Extreme',depthHelp:'For near-object framing, the foreground body part is represented with a large monochrome cue in the clean PNG and preserved semantically in JSON/prompt.',
  sceneContinuity:'Scene continuity',sceneId:'Scene ID',sceneIdPlaceholder:'Example: rooftop-A / bedroom-1',sceneFrom:'Same location as panel',sceneNew:'New / unspecified',sceneAnchorNotes:'Fixed scene anchors',sceneAnchorPlaceholder:'Example: bed on the left, window on the right; keep desk position consistent.',
  gazeOffPanel:'Off-panel person / target',
  readinessAirborneMismatch:'Action intent describes airborne motion, but the character is marked grounded.',readinessDepthTarget:'Specify the near-object target to reduce model-to-model variation.',
  guidePoseDepth:'Aerial poses and depth',guidePoseDepthBody:'Choose airborne approach, dive attack, or aerial punch. For near-object shots, specify the foreground target and foreshortening strength so both clean PNG and prompt carry the depth intent.'
});

Object.assign(posePresets,{
  'airborne-approach':{ja:'空中接近',en:'Airborne approach',description:'airborne forward approach, body stretched into travel direction, no ground support, arms and legs trailing for clear flight momentum',support:'airborne',motionPhase:'airborne',foregroundJoint:null,joints:{head:[22,-62],neck:[7,-43],shoulderL:[-20,-38],shoulderR:[31,-34],elbowL:[-48,-25],elbowR:[54,-20],handL:[-66,-4],handR:[71,0],hip:[-7,11],kneeL:[-42,37],kneeR:[32,45],footL:[-67,58],footR:[47,72]}},
  'dive-attack':{ja:'飛び込み攻撃',en:'Dive attack',description:'steep airborne dive toward the target, torso angled down and forward, rear limbs trailing, no ground support',support:'airborne',motionPhase:'airborne',foregroundJoint:'handR',joints:{head:[20,-58],neck:[6,-40],shoulderL:[-22,-35],shoulderR:[30,-31],elbowL:[-46,-19],elbowR:[61,-16],handL:[-63,4],handR:[92,-8],hip:[-8,13],kneeL:[-43,41],kneeR:[24,49],footL:[-68,60],footR:[41,77]}},
  'aerial-punch':{ja:'空中ストレート',en:'Aerial straight punch',description:'airborne committed straight punch with the right fist driven toward camera/target, torso rotated behind the fist, legs trailing with no ground support',support:'airborne',motionPhase:'impact',foregroundJoint:'handR',joints:{head:[-2,-61],neck:[0,-42],shoulderL:[-28,-35],shoulderR:[29,-31],elbowL:[-37,-2],elbowR:[82,-25],handL:[-12,-5],handR:[142,-20],hip:[-9,16],kneeL:[-48,44],kneeR:[24,57],footL:[-73,66],footR:[41,83]}},
  guard:{ja:'構える',en:'Guard stance',description:'balanced fighting guard, knees soft, both hands raised, weight ready to move',support:'grounded',motionPhase:'anticipation',foregroundJoint:null,joints:{head:[0,-69],neck:[0,-46],shoulderL:[-28,-38],shoulderR:[28,-38],elbowL:[-48,-8],elbowR:[48,-8],handL:[-18,-20],handR:[18,-20],hip:[0,13],kneeL:[-28,56],kneeR:[28,56],footL:[-43,95],footR:[43,95]}},
  kick:{ja:'前蹴り',en:'Front kick',description:'front kick with the right leg thrust toward the target while the standing leg supports balance and hands guard the torso',support:'grounded',motionPhase:'impact',foregroundJoint:'footR',joints:{head:[-6,-68],neck:[-4,-45],shoulderL:[-31,-37],shoulderR:[26,-35],elbowL:[-44,-6],elbowR:[36,-5],handL:[-15,-11],handR:[11,-12],hip:[0,15],kneeL:[-18,58],kneeR:[48,29],footL:[-27,99],footR:[110,22]}}
});
for(const [id,support,motion,fg] of [['stand','grounded','still',null],['run','grounded','approach',null],['jump','airborne','airborne',null],['crouch','grounded','anticipation',null],['punch','grounded','impact','handR'],['lookback','grounded','still',null]]){if(posePresets[id])Object.assign(posePresets[id],{support:posePresets[id].support||support,motionPhase:posePresets[id].motionPhase||motion,foregroundJoint:posePresets[id].foregroundJoint||fg});}

const SUPPORT_19=['auto','grounded','airborne','supported','unknown'];
const MOTION_19=['auto','still','anticipation','approach','launch','airborne','impact','recovery'];
const DEPTH_TARGET_19=['auto','right-hand','left-hand','right-foot','left-foot','face','prop','none'];
const FORESHORTEN_19=['normal','strong','extreme'];
function inferredSupport19(ch){return posePresets[ch?.poseId]?.support||'unknown';}
function inferredMotion19(ch){return posePresets[ch?.poseId]?.motionPhase||'still';}
function effectiveSupport19(ch){return !ch?.supportState||ch.supportState==='auto'?inferredSupport19(ch):ch.supportState;}
function effectiveMotion19(ch){return !ch?.motionPhase||ch.motionPhase==='auto'?inferredMotion19(ch):ch.motionPhase;}
function panelForCharacter19(ch){return currentPage().panels.find(p=>(p.characters||[]).some(c=>c===ch||c.id===ch?.id))||null;}
function depthJointFromTarget19(target,pose){
  if(target==='right-hand')return'handR';if(target==='left-hand')return'handL';if(target==='right-foot')return'footR';if(target==='left-foot')return'footL';if(target==='face')return'head';
  if(target==='auto')return pose?.foregroundJoint||null;return null;
}
function effectiveDepthTarget19(panel,ch){
  const raw=panel?.camera?.depthTarget||'auto';
  if(raw!=='auto')return raw;
  const joint=posePresets[ch?.poseId]?.foregroundJoint;return joint==='handR'?'right-hand':joint==='handL'?'left-hand':joint==='footR'?'right-foot':joint==='footL'?'left-foot':joint==='head'?'face':'none';
}
function ensureSpatialSemantics19(target=project){
  for(const page of target?.pages||[])for(const panel of page.panels||[]){
    panel.camera ||= defaultCamera();
    if(!DEPTH_TARGET_19.includes(panel.camera.depthTarget))panel.camera.depthTarget='auto';
    if(!FORESHORTEN_19.includes(panel.camera.foreshortening))panel.camera.foreshortening='strong';
    panel.background ||= defaultBackground();panel.background.sceneId=String(panel.background.sceneId||'');panel.background.continuityFrom=String(panel.background.continuityFrom||'');panel.background.anchorNotes=String(panel.background.anchorNotes||'');
    for(const ch of panel.characters||[]){if(!SUPPORT_19.includes(ch.supportState))ch.supportState='auto';if(!MOTION_19.includes(ch.motionPhase))ch.motionPhase='auto';}
  }
  return target;
}
const normalizeProjectBase19=normalizeProject;
normalizeProject=function(input){return ensureSpatialSemantics19(normalizeProjectBase19(input));};
ensureSpatialSemantics19(project);

function ensurePoseOptions19(){
  for(const id of ['poseSelect','baseCharacterPose']){const el=$(id);if(!el)continue;for(const [poseId,p] of Object.entries(posePresets)){if([...el.options].some(o=>o.value===poseId))continue;const o=document.createElement('option');o.value=poseId;o.textContent=language==='ja'?`${p.ja} / ${p.en}`:p.en;el.appendChild(o);}}
}
function ensureSpatialUi19(){
  ensurePoseOptions19();
  const panelSection=document.querySelector('.tool-panel[data-section="panel"]');
  if(panelSection&&!$('depthControls19')){
    const intent=$('cameraIntent')?.closest('label');const block=document.createElement('div');block.id='depthControls19';block.innerHTML=`<div class="subhead" data-i18n="depthHeading"></div><label><span data-i18n="depthTarget"></span><select id="depthTarget19"></select></label><label><span data-i18n="foreshortening"></span><select id="foreshortening19"></select></label><p class="help" data-i18n="depthHelp"></p>`;intent?.insertAdjacentElement('afterend',block);
    const d=$('depthTarget19');for(const [v,k] of [['auto','depthAuto'],['right-hand','depthRightHand'],['left-hand','depthLeftHand'],['right-foot','depthRightFoot'],['left-foot','depthLeftFoot'],['face','depthFace'],['prop','depthProp'],['none','depthNone']])d.insertAdjacentHTML('beforeend',`<option value="${v}">${escapeXml(t(k))}</option>`);
    const f=$('foreshortening19');for(const [v,k] of [['normal','foreshortenNormal'],['strong','foreshortenStrong'],['extreme','foreshortenExtreme']])f.insertAdjacentHTML('beforeend',`<option value="${v}">${escapeXml(t(k))}</option>`);
    d.addEventListener('change',e=>{const p=selectedPanel();if(p)mutate(()=>{p.camera.depthTarget=e.target.value;});});f.addEventListener('change',e=>{const p=selectedPanel();if(p)mutate(()=>{p.camera.foreshortening=e.target.value;});});
  }
  const inspector=$('characterInspector');
  if(inspector&&!$('motionControls19')){
    const pose=$('poseSelect')?.closest('label');const details=document.createElement('details');details.id='motionControls19';details.innerHTML=`<summary data-i18n="motionSemantics"></summary><label><span data-i18n="supportState"></span><select id="supportState19"></select></label><label><span data-i18n="motionPhase"></span><select id="motionPhase19"></select></label><div id="motionResolved19" class="summary-card"></div>`;pose?.insertAdjacentElement('afterend',details);
    const s=$('supportState19');for(const [v,k] of [['auto','supportAuto'],['grounded','supportGrounded'],['airborne','supportAirborne'],['supported','supportSupported'],['unknown','supportUnknown']])s.insertAdjacentHTML('beforeend',`<option value="${v}">${escapeXml(t(k))}</option>`);
    const m=$('motionPhase19');for(const [v,k] of [['auto','motionAuto'],['still','motionStill'],['anticipation','motionAnticipation'],['approach','motionApproach'],['launch','motionLaunch'],['airborne','motionAirborne'],['impact','motionImpact'],['recovery','motionRecovery']])m.insertAdjacentHTML('beforeend',`<option value="${v}">${escapeXml(t(k))}</option>`);
    s.addEventListener('change',e=>{const ch=selectedCharacter();if(ch)mutate(()=>{ch.supportState=e.target.value;});});m.addEventListener('change',e=>{const ch=selectedCharacter();if(ch)mutate(()=>{ch.motionPhase=e.target.value;});});
  }
  const bg=document.querySelector('.tool-panel[data-section="background"]');
  if(bg&&!$('sceneContinuity19')){
    const loc=$('backgroundLocation')?.closest('label');const block=document.createElement('div');block.id='sceneContinuity19';block.innerHTML=`<div class="subhead" data-i18n="sceneContinuity"></div><label><span data-i18n="sceneId"></span><input id="sceneId19" type="text" data-i18n-placeholder="sceneIdPlaceholder"></label><label><span data-i18n="sceneFrom"></span><select id="sceneFrom19"></select></label><label><span data-i18n="sceneAnchorNotes"></span><textarea id="sceneAnchor19" rows="3" data-i18n-placeholder="sceneAnchorPlaceholder"></textarea></label>`;loc?.insertAdjacentElement('afterend',block);
    $('sceneId19').addEventListener('change',e=>{const p=selectedPanel();if(p)mutate(()=>{p.background.sceneId=e.target.value;});});$('sceneFrom19').addEventListener('change',e=>{const p=selectedPanel();if(p)mutate(()=>{p.background.continuityFrom=e.target.value;});});$('sceneAnchor19').addEventListener('change',e=>{const p=selectedPanel();if(p)mutate(()=>{p.background.anchorNotes=e.target.value;});});
  }
  const gaze=$('gazeTarget');if(gaze&&![...gaze.options].some(o=>o.value==='off-panel-target')){const o=document.createElement('option');o.value='off-panel-target';o.textContent=t('gazeOffPanel');gaze.appendChild(o);}
}
function localizeSpatialUi19(){
  ensureSpatialUi19();document.querySelectorAll('#depthControls19 [data-i18n],#motionControls19 [data-i18n],#sceneContinuity19 [data-i18n]').forEach(el=>el.textContent=t(el.dataset.i18n));document.querySelectorAll('#sceneContinuity19 [data-i18n-placeholder]').forEach(el=>el.placeholder=t(el.dataset.i18nPlaceholder));
  const gaze=[...($('gazeTarget')?.options||[])].find(o=>o.value==='off-panel-target');if(gaze)gaze.textContent=t('gazeOffPanel');ensurePoseOptions19();
}

function sceneFromOptions19(panel){const select=$('sceneFrom19');if(!select)return;const current=panel?.background?.continuityFrom||'';select.innerHTML=`<option value="">${escapeXml(t('sceneNew'))}</option>`+[...currentPage().panels].sort((a,b)=>a.order-b.order).filter(p=>p.id!==panel?.id).map(p=>`<option value="${escapeXml(p.id)}">Panel ${p.order}</option>`).join('');select.value=[...select.options].some(o=>o.value===current)?current:'';}

const renderUiBase19=renderUi;
renderUi=function(){ensureSpatialSemantics19(project);renderUiBase19();localizeSpatialUi19();const p=selectedPanel(),ch=selectedCharacter();
  if($('depthTarget19')){$('depthTarget19').disabled=!p;$('depthTarget19').value=p?.camera?.depthTarget||'auto';}
  if($('foreshortening19')){$('foreshortening19').disabled=!p;$('foreshortening19').value=p?.camera?.foreshortening||'strong';}
  if($('supportState19')){$('supportState19').disabled=!ch;$('supportState19').value=ch?.supportState||'auto';}
  if($('motionPhase19')){$('motionPhase19').disabled=!ch;$('motionPhase19').value=ch?.motionPhase||'auto';}
  if($('motionResolved19'))$('motionResolved19').textContent=ch?`support=${effectiveSupport19(ch)} · motion=${effectiveMotion19(ch)}`:'';
  if($('sceneId19')){$('sceneId19').disabled=!p;$('sceneId19').value=p?.background?.sceneId||'';}
  if($('sceneAnchor19')){$('sceneAnchor19').disabled=!p;$('sceneAnchor19').value=p?.background?.anchorNotes||'';}sceneFromOptions19(p);
};

// Preserve the existing anatomy-color review figure, while adding a monochrome depth cue to clean/review output.
characterSvg=function(ch,annotated=true){
  const pose=posePresets[ch.poseId]||posePresets.stand,j=pose.joints,labelWidth=Math.max(80,String(ch.name||ch.characterId).length*18+24),panel=panelForCharacter19(ch);
  const target=effectiveDepthTarget19(panel,ch),jointName=panel?.camera?.viewpoint==='near-object'?depthJointFromTarget19(target,pose):null,pt=jointName?j[jointName]:null,amount=panel?.camera?.foreshortening||'strong',radius=amount==='extreme'?28:amount==='strong'?20:14;
  const cue=pt?`<circle class="depth-foreground19" cx="${pt[0]}" cy="${pt[1]}" r="${radius}" fill="white" stroke="#111827" stroke-width="4" vector-effect="non-scaling-stroke"/>${annotated?`<circle cx="${pt[0]}" cy="${pt[1]}" r="${radius+7}" fill="none" stroke="#9333ea" stroke-width="2" stroke-dasharray="5 4" vector-effect="non-scaling-stroke"/>`:''}`:'';
  return `<g class="character-group ${ch.id===selectedCharacterId?'stick-selected':''}" data-char-id="${escapeXml(ch.id)}" transform="translate(${ch.x} ${ch.y}) rotate(${ch.rotation}) scale(${ch.scale})">
    ${boneLine06(j.neck,j.shoulderL,'torso',annotated)}${boneLine06(j.neck,j.shoulderR,'torso',annotated)}${boneLine06(j.neck,j.hip,'torso',annotated)}
    ${boneLine06(j.shoulderL,j.elbowL,'arms',annotated)}${boneLine06(j.elbowL,j.handL,'arms',annotated)}${boneLine06(j.shoulderR,j.elbowR,'arms',annotated)}${boneLine06(j.elbowR,j.handR,'arms',annotated)}
    ${boneLine06(j.hip,j.kneeL,'legs',annotated)}${boneLine06(j.kneeL,j.footL,'legs',annotated)}${boneLine06(j.hip,j.kneeR,'legs',annotated)}${boneLine06(j.kneeR,j.footR,'legs',annotated)}
    <circle class="stick-head ${annotated?'skel-head':''}" cx="${j.head[0]}" cy="${j.head[1]}" r="22" />${cue}
    ${joint06(j.neck,'core',annotated,5)}${joint06(j.shoulderL,'limb',annotated)}${joint06(j.shoulderR,'limb',annotated)}${joint06(j.elbowL,'limb',annotated)}${joint06(j.elbowR,'limb',annotated)}${joint06(j.handL,'hand',annotated)}${joint06(j.handR,'hand',annotated)}${joint06(j.hip,'core',annotated,7)}${joint06(j.kneeL,'knee',annotated)}${joint06(j.kneeR,'knee',annotated)}${joint06(j.footL,'foot',annotated)}${joint06(j.footR,'foot',annotated)}
    ${annotated?`<g class="authoring-text" transform="translate(0 126) scale(${1/Math.max(ch.scale,.01)})"><rect class="character-label-bg" x="${-labelWidth/2}" y="-18" width="${labelWidth}" height="30" rx="8"/><text class="character-label" x="0" y="4">${escapeXml(ch.name||ch.characterId)}</text></g>`:''}
  </g>`;
};

function actionSuggestsAirborne19(text){return /(空中|飛び込|飛ぶ|跳ぶ|跳躍|落下|ダイブ|airborne|aerial|dive|jump|leap|falling)/i.test(String(text||''));}
if(typeof readinessIssues18==='function'){
  const readinessIssuesBase19=readinessIssues18;
  readinessIssues18=function(){const issues=readinessIssuesBase19();for(const p of currentPage().panels||[]){
    if(p.camera?.viewpoint==='near-object'&&(p.camera?.depthTarget||'auto')==='auto'&&!(p.characters||[]).some(ch=>posePresets[ch.poseId]?.foregroundJoint))issues.push({kind:'camera',text:`Panel ${p.order}: ${t('readinessDepthTarget')}`});
    if(actionSuggestsAirborne19(p.actionIntent)){for(const ch of p.characters||[])if(effectiveSupport19(ch)==='grounded')issues.push({kind:'pose',text:`Panel ${p.order} / ${ch.name||ch.characterId}: ${t('readinessAirborneMismatch')}`});}
  }return issues;};
}

// Fix the shipped aerial template so its pose semantics match its story semantics.
if(typeof storyTemplates11==='object'&&storyTemplates11.aerialAttack){
  const beats=storyTemplates11.aerialAttack.beats||[];
  if(beats[0])beats[0].pose='crouch';if(beats[1])beats[1].pose='dive-attack';if(beats[2])beats[2].pose='aerial-punch';
}

function spatialPrompt19(){const lines=['POSE / DEPTH / SCENE CONTINUITY:'];for(const p of [...currentPage().panels].sort((a,b)=>a.order-b.order)){
  const target=p.camera?.depthTarget||'auto',effectiveTarget=(p.characters||[])[0]?effectiveDepthTarget19(p,p.characters[0]):target;
  lines.push(`- Panel ${p.order} depth: viewpoint=${p.camera?.viewpoint||'front'}, foregroundTarget=${effectiveTarget}, foreshortening=${p.camera?.foreshortening||'strong'}.`);
  if(p.background?.sceneId||p.background?.continuityFrom||p.background?.anchorNotes){const from=p.background?.continuityFrom?currentPage().panels.find(x=>x.id===p.background.continuityFrom):null;lines.push(`  Scene: sceneId=${p.background.sceneId||'unspecified'}, continuityFrom=${from?`Panel ${from.order}`:'none'}, anchors=${p.background.anchorNotes||'none'}.`);}
  for(const ch of p.characters||[])lines.push(`  CHARACTER ${ch.characterId}: pose=${ch.poseId}, support=${effectiveSupport19(ch)}, motionPhase=${effectiveMotion19(ch)}.`);
}lines.push('- If support=airborne, do not place the feet on a supporting floor/ground unless the action explicitly describes landing.');lines.push('- Near-object foreground targets should be visibly larger through foreshortening, not merely translated sideways in 2D.');return lines.join('\n');}
const compilePromptBase19=compilePrompt;
compilePrompt=function(){return `${compilePromptBase19()}\n\n${spatialPrompt19()}`;};

if(typeof exportManifest08==='function'){
  const exportManifestBase19=exportManifest08;
  exportManifest08=function(identity,packageType,files){const manifest=exportManifestBase19(identity,packageType,files);manifest.spatialSemantics=[...currentPage().panels].sort((a,b)=>a.order-b.order).map(p=>({panelId:p.id,order:p.order,camera:{depthTarget:p.camera?.depthTarget||'auto',foreshortening:p.camera?.foreshortening||'strong'},scene:{sceneId:p.background?.sceneId||'',continuityFrom:p.background?.continuityFrom||'',anchorNotes:p.background?.anchorNotes||''},characters:(p.characters||[]).map(ch=>({characterId:ch.characterId,poseId:ch.poseId,supportState:ch.supportState||'auto',effectiveSupport:effectiveSupport19(ch),motionPhase:ch.motionPhase||'auto',effectiveMotionPhase:effectiveMotion19(ch)}))}));return manifest;};
}

function installSpatialHelp19(){const dialog=$('helpDialog');if(!dialog||$('guidePoseDepth19'))return;const sec=document.createElement('section');sec.id='guidePoseDepth19';sec.className='guide-section';sec.innerHTML=`<h3 data-i18n="guidePoseDepth"></h3><p data-i18n="guidePoseDepthBody"></p>`;const art=$('guideArtDirection18');art?.insertAdjacentElement('afterend',sec);}
const applyLanguageBase19=applyLanguage;
applyLanguage=function(){applyLanguageBase19();localizeSpatialUi19();installSpatialHelp19();document.querySelectorAll('#guidePoseDepth19 [data-i18n]').forEach(el=>el.textContent=t(el.dataset.i18n));renderReadiness18?.();};

ensureSpatialUi19();localizeSpatialUi19();installSpatialHelp19();render();
document.querySelector('footer')&&(document.querySelector('footer').textContent='Prototype 0.11 · art direction · depth/pose semantics · model-independent handoff');
