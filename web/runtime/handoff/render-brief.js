// Concise page render brief, context-isolated handoff, explicit reference/preservation contracts,
// and a bounded pre-render design-direction pass. Semantic JSON / clean PNG remain authoritative.

Object.assign(i18n.ja,{
  readinessGuardPoseConflict30:'出来事は「構える / 間合いを測る」ですが、人物ポーズが通常立ちです。Guard stance / 構えるへ変更するとモデル差を減らせます。',
  readinessBattleToneConflict30:'バトル場面ですが、仕上がりトーンに甘い・恋愛寄りの語が残っています。画風として意図したものか確認してください。場面意味はバトルを優先します。',
  guideRenderBrief30:'生成時の文脈混入を防ぐ',
  guideRenderBriefBody30:'AI生成ZIPのPrompt先頭へ「現在ページだけのRender Contract」を追加します。過去の会話・以前の生成画像・別テンプレートの物語を持ち込まず、現在のコマ数・舞台・登場人物・出来事・表示文字だけを使うよう明示します。'
});
Object.assign(i18n.en,{
  readinessGuardPoseConflict30:'The action says the fighters are guarding / measuring distance, but a placed character still uses a neutral stand pose. Use Guard stance to reduce model drift.',
  readinessBattleToneConflict30:'This is a battle scene, but the visual-tone text still contains sweet/romance-oriented wording. Confirm that this is intentional styling; battle scene semantics remain authoritative.',
  guideRenderBrief30:'Prevent generation-context carryover',
  guideRenderBriefBody30:'The AI ZIP prompt starts with a concise current-page Render Contract. It explicitly rejects story, setting, character, and genre carryover from prior conversation turns, prior generated images, or unrelated templates.'
});

function patchTwoVisibleStandoff30(){
  const tpl=typeof storyTemplates11!=='undefined'?storyTemplates11.twoVisibleStandoff27:null;
  if(!tpl?.beats?.length)return;
  for(const beat of tpl.beats.slice(0,2)){
    beat.pose='guard';
    for(const actor of beat.actors27||[])actor.pose='guard';
  }
}
patchTwoVisibleStandoff30();

function usedCharacterIds30(){
  const ids=[];
  for(const panel of currentPage().panels||[])for(const ch of panel.characters||[]){
    if(ch.characterId&&!ids.includes(ch.characterId))ids.push(ch.characterId);
  }
  return ids;
}
function characterBrief30(characterId){
  const base=(project.characterLibrary||[]).find(x=>x.characterId===characterId)||{};
  const appearance=[base.appearance?.summary,base.appearance?.hair,base.appearance?.eyes,base.appearance?.outfit,base.appearance?.features].map(v=>String(v||'').trim()).filter(Boolean);
  return {
    characterId,
    identityMode:base.identityMode||'description',
    referenceKey:String(base.referenceKey||''),
    appearance:appearance.length?appearance.join(' / '):'unspecified; infer only a simple consistent design'
  };
}
function exactVisibleText30(){
  const text=[];
  for(const panel of [...(currentPage().panels||[])].sort((a,b)=>a.order-b.order)){
    for(const balloon of panel.balloons||[]){
      const value=String(balloon.text||'').trim();if(value)text.push(value);
    }
    const sfx=String(panel.effects?.sfxText||'').trim();if(sfx)text.push(sfx);
  }
  return text;
}
function sceneSummary30(){
  const panels=currentPage().panels||[];
  const unique=key=>[...new Set(panels.map(p=>String(p.background?.[key]||'').trim()).filter(Boolean))];
  let relationship='';
  try{
    const id=project.meta?.storyTemplate||'';
    relationship=id&&typeof sceneInfo22==='function'?(sceneInfo22(id)?.relationship||''):'';
  }catch{}
  return {relationship,locations:unique('location'),times:unique('timeOfDay'),moods:unique('mood')};
}
function referenceRoles30(){
  const roles=[{
    source:'*_clean.png',
    role:'spatial-layout',
    controls:['panel-geometry','panel-proportions','reading-order-geometry','approximate-character-placement','approximate-character-scale','pose-direction'],
    doesNotControl:['character-appearance','clothing-state','render-style','visible-text']
  }];
  for(const ch of usedCharacterIds30().map(characterBrief30)){
    if(ch.identityMode!=='sheet'||!ch.referenceKey)continue;
    roles.push({
      source:`Character Sheet referenceKey=${ch.referenceKey}`,
      role:'character-identity',
      characterId:ch.characterId,
      controls:['face','hair','body-proportions','outfit','distinctive-features'],
      doesNotControl:['panel-layout','panel-count','pose','camera','story-action']
    });
  }
  return roles;
}
function preservationContract30(){
  return {
    change:['translate-the-blueprint-into-finished-manga-artwork'],
    preserveExact:['panel-count','panel-boundaries','panel-proportions','reading-order-geometry','allowlisted-visible-text'],
    preserveStrong:['character-identity','relative-character-placement','relative-character-scale','story-action-intent','gaze-relationships','physical-contact','camera-intent','scene-continuity'],
    guidanceOnly:['stick-figure-joint-coordinates','pose-figure-anatomy-details'],
    doNotInherit:['stick-figure-appearance','stick-figure-clothing-state','authoring-labels','panel-numbers','ui-metadata','review-annotations'],
    doNotAdd:['extra-panels','extra-visible-characters','unlisted-visible-text','replacement-story-or-genre','replacement-setting','unlisted-titles-or-captions']
  };
}
function designDirectionPass32(ordered=[...(currentPage().panels||[])].sort((a,b)=>a.order-b.order)){
  const areas=ordered.map(panel=>({order:panel.order,area:Math.max(0,Number(panel.rect?.w)||0)*Math.max(0,Number(panel.rect?.h)||0)}));
  const hero=areas.reduce((best,item)=>!best||item.area>best.area?item:best,null);
  return {
    schema:'manga-blueprint-design-direction-pass/1',
    authority:'derived-guidance-only',
    purpose:'establish visual hierarchy before rendering without rewriting authored manga structure',
    heroPanelCandidate:hero?.order||null,
    eyeFlow:ordered.map(panel=>panel.order),
    derive:[
      'page-level-focal-hierarchy',
      'within-panel-primary-focus',
      'negative-space-distribution',
      'value-and-color-contrast',
      'detail-density-rhythm',
      'local-subject-emphasis'
    ],
    mayAdjust:[
      'micro-composition-inside-existing-panel-boundaries',
      'negative-space-inside-existing-panels',
      'local-value-color-and-detail-emphasis'
    ],
    mustPreserve:[
      'panel-count','panel-boundaries','panel-proportions','reading-order','story-action-intent',
      'camera-intent','visible-cast','character-identity','relative-character-placement','exact-visible-text'
    ],
    rules:[
      'treat-authored-panel-size-and-order-as-existing-hierarchy-signals',
      'follow-authored-reading-order-for-eye-flow',
      'do-not-make-every-panel-equally-detailed-or-equally-contrasty-by-default',
      'do-not-fill-intentional-negative-space-with-decoration',
      'do-not-use-design-guidance-to-rewrite-story-genre-setting-or-camera'
    ]
  };
}
function renderBriefObject30(){
  const ordered=[...(currentPage().panels||[])].sort((a,b)=>a.order-b.order);
  const scene=sceneSummary30();
  return {
    schema:'manga-blueprint-render-brief/2',
    selfContainedPage:true,
    ignorePriorConversationUnlessRepeated:true,
    ignorePriorGeneratedImagesUnlessExplicitReference:true,
    panelCount:ordered.length,
    readingDirection:project.meta?.readingDirection||'rtl',
    canvas:{width:pageSize04().w,height:pageSize04().h},
    scene,
    cast:usedCharacterIds30().map(characterBrief30),
    allowedVisibleText:exactVisibleText30(),
    referenceRoles:referenceRoles30(),
    preservation:preservationContract30(),
    designDirection:designDirectionPass32(ordered),
    panels:ordered.map(panel=>({
      order:panel.order,
      role:panel.role||'',
      actionIntent:String(panel.actionIntent||''),
      camera:{distance:panel.camera?.distance||'',angle:panel.camera?.angle||'',viewpoint:panel.camera?.viewpoint||''},
      background:{location:panel.background?.location||'',timeOfDay:panel.background?.timeOfDay||'',mood:panel.background?.mood||''},
      characters:(panel.characters||[]).map(ch=>({characterId:ch.characterId,poseId:ch.poseId,expression:ch.expression?.type||'',gaze:ch.gaze?.target||''}))
    })),
    forbiddenInventions:['extra-panels','extra-visible-characters','unlisted-visible-text','replacement-story-or-genre','replacement-setting','titles-or-captions-not-listed-in-TEXT-TO-RENDER']
  };
}
function renderBriefText30(){
  const brief=renderBriefObject30(),scene=brief.scene,p=brief.preservation,d=brief.designDirection;
  const lines=[
    'CURRENT PAGE RENDER CONTRACT — READ THIS FIRST:',
    '- This export is a COMPLETE, SELF-CONTAINED contract for the current manga page.',
    '- Ignore story, genre, setting, characters, dialogue, props, titles, and visual defaults from prior conversation turns or prior generated images unless they are explicitly repeated inside this package.',
    `- Render exactly ${brief.panelCount} panel(s), preserving CLEAN PNG geometry and ${brief.readingDirection.toUpperCase()} reading order.`,
    `- Planned visible cast: exactly ${brief.cast.length} character identity/identities used by this page. Do not invent substitutes or additional visible characters.`,
    `- Scene relationship/genre contract: ${scene.relationship||'unspecified; infer only from the current panel actions and backgrounds'}.`,
    `- Scene location(s): ${scene.locations.length?scene.locations.join(' / '):'unspecified'}. Time: ${scene.times.length?scene.times.join(' / '):'unspecified'}. Mood: ${scene.moods.length?scene.moods.join(' / '):'unspecified'}.`,
    `- Visible text allowlist: ${brief.allowedVisibleText.length?brief.allowedVisibleText.map(x=>JSON.stringify(x)).join(', '):'NONE — render no visible text'}.`,
    '- Do not add titles, captions, narration, UI, explanatory labels, extra dialogue, or genre/setting substitutions.',
    '- ART DIRECTION changes rendering language only; it must not replace the current story/scene semantics.',
    '',
    'REFERENCE IMAGE ROLES:',
    '- CLEAN Manga Blueprint PNG = SPATIAL LAYOUT reference. Preserve exact panel geometry/proportions and strong relative spatial relationships. Do NOT copy stick-figure appearance.',
    '- Stick figures are abstract pose/placement guides only. Do not interpret a stick figure as an unclothed body or as clothing guidance.',
    '- Render each character using the explicit outfit in CHARACTER IDENTITY GUIDANCE. If outfit is unspecified, use ordinary scene-appropriate clothing; never infer nudity from the planning stick figure.',
    ...brief.referenceRoles.filter(x=>x.role==='character-identity').map(x=>`- ${x.source} = CHARACTER IDENTITY reference for ${x.characterId}. Preserve identity; do NOT take pose, camera, or panel layout from this image.`),
    '',
    'CHANGE:',
    `- ${p.change.join(', ')}.`,
    'PRESERVE EXACTLY:',
    `- ${p.preserveExact.join(', ')}.`,
    'PRESERVE AS STRONG CONSTRAINTS:',
    `- ${p.preserveStrong.join(', ')}.`,
    'USE AS GUIDANCE, NOT PIXEL-EXACT ANATOMY:',
    `- ${p.guidanceOnly.join(', ')}.`,
    'DO NOT INHERIT:',
    `- ${p.doNotInherit.join(', ')}.`,
    'DO NOT ADD:',
    `- ${p.doNotAdd.join(', ')}.`,
    '',
    'DESIGN DIRECTION PASS — DERIVED GUIDANCE ONLY:',
    '- Before final rendering, derive a concise visual-design plan for this authored page.',
    `- Existing eye-flow order is Panel ${d.eyeFlow.join(' → Panel ')||'none'}. Follow it; do not reorder panels.`,
    `- Largest-area emphasis candidate is ${d.heroPanelCandidate?`Panel ${d.heroPanelCandidate}`:'unspecified'}. Treat this only as a hierarchy signal, not permission to change geometry or story importance.`,
    '- Decide within the existing panels: primary focal target, negative-space use, value/color contrast, and detail-density rhythm.',
    '- Preserve intentional quiet/empty regions. Do not decorate every gap or make every panel equally dense, glossy, or high-contrast.',
    `- You MAY adjust only: ${d.mayAdjust.join(', ')}.`,
    `- You MUST preserve: ${d.mustPreserve.join(', ')}.`
  ];
  lines.push('CURRENT PANEL BEATS:');
  for(const panel of brief.panels){
    const cast=panel.characters.map(ch=>`${ch.characterId}:${ch.poseId}`).join(', ')||'none';
    lines.push(`- Panel ${panel.order}: ${panel.actionIntent||panel.role||'unspecified beat'} | cast ${cast} | camera ${panel.camera.distance}/${panel.camera.angle}/${panel.camera.viewpoint} | location ${panel.background.location||'unspecified'}`);
  }
  return lines.join('\n');
}

const compilePromptBase30=compilePrompt;
compilePrompt=function(){return `${renderBriefText30()}\n\n${compilePromptBase30()}`;};

function actionNeedsGuard30(text=''){
  const value=String(text||'').toLowerCase();
  return /構え|間合いを測|guard stance|holds? (?:a )?stance|measure(?:s|ing)? distance/.test(value);
}
function relationship30(){
  try{
    const id=project.meta?.storyTemplate||'';
    return id&&typeof sceneInfo22==='function'?(sceneInfo22(id)?.relationship||''):'';
  }catch{return'';}
}
if(typeof readinessIssues18==='function'){
  const readinessIssuesBase30=readinessIssues18;
  readinessIssues18=function(){
    const issues=readinessIssuesBase30();
    for(const panel of currentPage().panels||[]){
      if(actionNeedsGuard30(panel.actionIntent)&&(panel.characters||[]).some(ch=>ch.poseId==='stand'))issues.push({kind:'action-pose',text:`Panel ${panel.order}: ${t('readinessGuardPoseConflict30')}`});
    }
    const tone=String(project.meta?.artDirection?.tone||'').toLowerCase();
    if(relationship30()==='battle'&&/(ほわほわ|甘い|恋愛|romance|romantic|sweet)/.test(tone))issues.push({kind:'style-scene',text:t('readinessBattleToneConflict30')});
    return issues;
  };
}

if(typeof exportManifest08==='function'){
  const exportManifestBase30=exportManifest08;
  exportManifest08=function(identity,packageType,files){
    const manifest=exportManifestBase30(identity,packageType,files);
    manifest.renderBrief=renderBriefObject30();
    manifest.referenceRoles=referenceRoles30();
    manifest.preservationContract=preservationContract30();
    manifest.designDirectionPass=designDirectionPass32();
    manifest.contextIsolation={
      selfContainedPage:true,
      ignorePriorConversationUnlessRepeated:true,
      ignorePriorGeneratedImagesUnlessExplicitReference:true,
      noUnlistedVisibleText:true,
      noUnlistedPanelsOrCast:true
    };
    manifest.crossModelHints ||= {};
    Object.assign(manifest.crossModelHints,{
      preferCurrentPageRenderBrief:true,
      rejectPriorContextCarryover:true,
      artDirectionDoesNotChangeStoryGenre:true,
      explicitReferenceRoles:true,
      separateChangeFromPreservation:true,
      deriveVisualHierarchyBeforeRendering:true,
      designDirectionCannotOverrideAuthoredStructure:true,
      preserveIntentionalNegativeSpace:true,
      panelGeometryConstraint:'exact',
      characterSpatialRelationshipConstraint:'strong',
      stickFigureJointConstraint:'guidance-only',
      stickFigureDoesNotImplyNudity:true,
      explicitCharacterOutfitPriority:true,
      unspecifiedOutfitFallback:'ordinary-scene-appropriate-clothing'
    });
    return manifest;
  };
}

function installRenderBriefHelp30(){
  const dialog=$('helpDialog');if(!dialog||$('guideRenderBriefSection30'))return;
  const section=document.createElement('section');section.id='guideRenderBriefSection30';section.className='guide-section';
  section.innerHTML=`<h3 data-i18n="guideRenderBrief30"></h3><p data-i18n="guideRenderBriefBody30"></p>`;
  ($('guideInteractionContractSection29')||$('guideCrossModel20')||$('guidePoseDepth19'))?.insertAdjacentElement('afterend',section);
}
const applyLanguageBase30=applyLanguage;
applyLanguage=function(){
  applyLanguageBase30();installRenderBriefHelp30();
  document.querySelectorAll('#guideRenderBriefSection30 [data-i18n]').forEach(el=>el.textContent=t(el.dataset.i18n));
  renderReadiness18?.();
};

installRenderBriefHelp30();
render();
document.querySelector('footer')&&(document.querySelector('footer').textContent='Prototype 0.15.2 · render contract + design direction pass');