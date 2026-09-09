// Prototype 0.12.7: interaction-aware handoff and lossless PNG rasterization.
// Keep specific story actions authoritative over generic pose fallbacks, preserve
// appearance-summary semantics, and rasterize clean/review PNGs at canvas size.

Object.assign(i18n.ja,{
  readinessActionPoseConflict29:'出来事は接触動作ですが、人物ポーズがその接触を表していません。特にハグは「立つ」だけにせず、抱く側 / 受ける側のポーズを指定するとモデル差が減ります。',
  guideInteractionContract29:'出来事とポーズが矛盾したとき',
  guideInteractionContractBody29:'「抱きつく」「手をつなぐ」など具体的な出来事は、汎用の立ちポーズより優先されます。AI受け渡しでは接触状態も補足し、ハグが「近くに立つ二人」へ弱まらないようにします。容姿の「どんな子？」に書いた内容は、髪・目などの詳細欄が空でも有効です。'
});
Object.assign(i18n.en,{
  readinessActionPoseConflict29:'The panel describes physical contact, but the placed poses do not express that contact. For a hug, use explicit initiator/receiver poses instead of generic standing poses to reduce model drift.',
  guideInteractionContract29:'When action and pose disagree',
  guideInteractionContractBody29:'Specific actions such as hugging or holding hands take priority over generic standing poses. The AI handoff also states the required contact so a hug cannot collapse into two people merely standing close. Appearance summary text remains authoritative even when optional hair/eyes/detail fields are empty.'
});

function mirrorJoints29(joints){
  return Object.fromEntries(Object.entries(joints).map(([key,value])=>[key,[-value[0],value[1]]]));
}

const approachRightJoints29={
  head:[5,-69],neck:[3,-46],shoulderL:[-25,-38],shoulderR:[29,-36],
  elbowL:[-29,-9],elbowR:[36,-7],handL:[-18,18],handR:[20,13],
  hip:[0,14],kneeL:[-22,57],kneeR:[20,50],footL:[-34,98],footR:[43,86]
};
const hugRightJoints29={
  head:[8,-68],neck:[6,-45],shoulderL:[-22,-38],shoulderR:[30,-35],
  elbowL:[18,-17],elbowR:[55,-14],handL:[50,1],handR:[72,8],
  hip:[2,14],kneeL:[-17,57],kneeR:[24,54],footL:[-27,98],footR:[35,96]
};
const hugReceiveLeftJoints29={
  head:[-6,-69],neck:[-4,-46],shoulderL:[-31,-37],shoulderR:[23,-39],
  elbowL:[-43,-8],elbowR:[19,-6],handL:[-24,16],handR:[3,15],
  hip:[0,14],kneeL:[-21,56],kneeR:[20,55],footL:[-31,97],footR:[31,97]
};

Object.assign(posePresets,{
  'approach-right':{
    ja:'相手へ近づく（右向き）',en:'Approach partner — right',
    description:'grounded approach toward the partner on the right, torso and gaze oriented toward them, one clear step closing the distance rather than a static neutral stand',
    support:'grounded',motionPhase:'approach',foregroundJoint:null,joints:approachRightJoints29
  },
  'approach-left':{
    ja:'相手へ近づく（左向き）',en:'Approach partner — left',
    description:'grounded approach toward the partner on the left, torso and gaze oriented toward them, one clear step closing the distance rather than a static neutral stand',
    support:'grounded',motionPhase:'approach',foregroundJoint:null,joints:mirrorJoints29(approachRightJoints29)
  },
  'hug-right':{
    ja:'抱きしめる（右側の相手）',en:'Hug partner on the right',
    description:'active affectionate hug toward the partner on the right; upper bodies make contact and both arms visibly wrap around the partner instead of hanging relaxed',
    support:'grounded',motionPhase:'impact',foregroundJoint:null,joints:hugRightJoints29
  },
  'hug-left':{
    ja:'抱きしめる（左側の相手）',en:'Hug partner on the left',
    description:'active affectionate hug toward the partner on the left; upper bodies make contact and both arms visibly wrap around the partner instead of hanging relaxed',
    support:'grounded',motionPhase:'impact',foregroundJoint:null,joints:mirrorJoints29(hugRightJoints29)
  },
  'hug-receive-left':{
    ja:'不意のハグを受ける（左から）',en:'Receive surprise hug from left',
    description:'receives a sudden hug from the partner on the left; upper-body contact is unmistakable, shoulders react in surprise, and the pose reads as being caught in an embrace rather than standing separately',
    support:'grounded',motionPhase:'impact',foregroundJoint:null,joints:hugReceiveLeftJoints29
  },
  'hug-receive-right':{
    ja:'不意のハグを受ける（右から）',en:'Receive surprise hug from right',
    description:'receives a sudden hug from the partner on the right; upper-body contact is unmistakable, shoulders react in surprise, and the pose reads as being caught in an embrace rather than standing separately',
    support:'grounded',motionPhase:'impact',foregroundJoint:null,joints:mirrorJoints29(hugReceiveLeftJoints29)
  }
});
if(typeof ensurePoseOptions19==='function')ensurePoseOptions19();

function patchTwoVisibleHug29(){
  if(typeof storyTemplates11==='undefined')return;
  const tpl=storyTemplates11.twoVisibleHug27;
  if(!tpl?.beats?.length)return;
  const setup=tpl.beats[0],climax=tpl.beats[1],afterglow=tpl.beats[2];
  if(setup?.actors27?.[0])setup.actors27[0].pose='approach-right';
  if(setup?.actors27?.[1])setup.actors27[1].pose='approach-left';
  if(climax?.actors27?.[0])climax.actors27[0].pose='hug-right';
  if(climax?.actors27?.[1])climax.actors27[1].pose='hug-receive-left';
  if(afterglow?.actors27?.[0])afterglow.actors27[0].pose='hug-right';
  if(afterglow?.actors27?.[1])afterglow.actors27[1].pose='hug-left';
}
patchTwoVisibleHug29();

function interactionKind29(text=''){
  const value=String(text||'').toLowerCase();
  if(/抱き|ハグ|hug|embrac/.test(value))return'hug';
  if(/おでこ|額.*合わせ|forehead/.test(value))return'forehead-touch';
  if(/手をつな|手を繋|手を握|hold(?:ing)? hands?/.test(value))return'hand-hold';
  if(/もたれ|寄り添|lean(?:s|ing)? (?:on|against)|shoulder lean/.test(value))return'lean-contact';
  return'';
}
function interactionSemantics29(kind){
  if(kind==='hug')return'visible upper-body contact; at least one participant clearly wraps arms around the other. Do not reduce the action to two people merely standing close.';
  if(kind==='forehead-touch')return'the foreheads visibly touch or reach the explicitly described near-contact point; preserve the intended physical relationship.';
  if(kind==='hand-hold')return'the specified hands visibly connect and remain connected; do not render the characters with separated idle hands.';
  if(kind==='lean-contact')return'the leaning character visibly transfers body weight onto the partner/shoulder and maintains the described physical contact.';
  return'';
}
function poseSupportsInteraction29(poseId,kind){
  const id=String(poseId||'');
  if(kind==='hug')return id.startsWith('hug-');
  return true;
}
function actionPoseResolution29(){
  const panels=[...currentPage().panels].sort((a,b)=>a.order-b.order);
  const lines=[
    'ACTION / POSE RESOLUTION:',
    '- STORY ACTION INTENT is authoritative for what physically happens in a panel.',
    '- Pose IDs and stick figures support body geometry. If a generic pose conflicts with a more specific action intent, preserve the specific action intent.',
    '- For physical-contact actions, render the required contact visibly; emotional proximity alone is not an acceptable substitute.'
  ];
  for(const panel of panels){
    const kind=interactionKind29(panel.actionIntent);
    if(kind)lines.push(`- Panel ${panel.order} contact contract (${kind}): ${interactionSemantics29(kind)}`);
  }
  return lines.join('\n');
}
function appearanceFieldRule29(){
  return [
    'CHARACTER APPEARANCE FIELD RULE:',
    '- In description identity mode, appearanceText and appearance.summary are authoritative character-identity guidance.',
    '- Empty hair / eyes / outfit / features subfields mean only “not separately specified”. They do NOT cancel, weaken, or negate details already written in appearance.summary or appearanceText.',
    '- Never replace a described character with a generic default merely because one optional detailed subfield is empty.'
  ].join('\n');
}

const compilePromptBase29=compilePrompt;
compilePrompt=function(){
  return `${compilePromptBase29()}\n\n${actionPoseResolution29()}\n\n${appearanceFieldRule29()}`;
};

if(typeof readinessIssues18==='function'){
  const readinessIssuesBase29=readinessIssues18;
  readinessIssues18=function(){
    const issues=readinessIssuesBase29();
    for(const panel of currentPage().panels||[]){
      const kind=interactionKind29(panel.actionIntent);
      if(kind!=='hug'||(panel.characters||[]).length<2)continue;
      if((panel.characters||[]).some(ch=>!poseSupportsInteraction29(ch.poseId,kind))){
        issues.push({kind:'action-pose',text:`Panel ${panel.order}: ${t('readinessActionPoseConflict29')}`});
      }
    }
    return issues;
  };
}

if(typeof exportManifest08==='function'){
  const exportManifestBase29=exportManifest08;
  exportManifest08=function(identity,packageType,files){
    const manifest=exportManifestBase29(identity,packageType,files);
    manifest.renderContract={
      cleanPngExpectedDimensions:{width:pageSize04().w,height:pageSize04().h},
      cleanPngOwns:'panel-geometry-and-approximate-placement',
      semanticContractOwns:'story-action-pose-camera-depth-and-lettering'
    };
    manifest.actionPoseIndex=[...currentPage().panels].sort((a,b)=>a.order-b.order).map(panel=>({
      panelId:panel.id,order:panel.order,actionIntent:String(panel.actionIntent||''),interaction:interactionKind29(panel.actionIntent)||null,
      poseIds:(panel.characters||[]).map(ch=>ch.poseId),priority:'specific-action-intent-over-generic-pose'
    })).filter(x=>x.actionIntent);
    manifest.appearanceFieldSemantics={
      summaryAuthority:true,
      appearanceTextAuthority:true,
      emptyDetailedFieldMeaning:'unspecified-not-negative'
    };
    manifest.crossModelHints ||= {};
    Object.assign(manifest.crossModelHints,{
      specificActionIntentOverridesGenericPose:true,
      preservePhysicalContactSemantics:true,
      appearanceSummaryRemainsAuthoritative:true,
      emptyAppearanceSubfieldsDoNotCancelSummary:true
    });
    for(const item of manifest.characterGuidance||[]){
      item.appearanceAuthority='appearanceText+appearance.summary';
      item.emptyDetailedAppearanceFields='unspecified-not-negative';
    }
    return manifest;
  };
}

// SVG loaded through <img> has a 300x150 fallback intrinsic size when width/height
// are absent. Always serialize explicit dimensions and scale drawImage to the
// destination canvas so a dynamic 800x1130 (or custom) page cannot shrink into
// the top-left corner during PNG export.
buildPngBlob06=async function(annotated){
  const size=pageSize04();
  const temp=document.createElementNS('http://www.w3.org/2000/svg','svg');
  temp.setAttribute('viewBox',`0 0 ${size.w} ${size.h}`);
  temp.setAttribute('width',String(size.w));
  temp.setAttribute('height',String(size.h));
  temp.setAttribute('xmlns','http://www.w3.org/2000/svg');
  temp.innerHTML=renderSvg(annotated);
  temp.querySelectorAll('.selected,.stick-selected,.balloon-selected').forEach(el=>el.classList.remove('selected','stick-selected','balloon-selected'));
  if(!annotated)temp.querySelectorAll('.authoring-text').forEach(el=>el.remove());
  const css=[...document.styleSheets].flatMap(sheet=>{try{return[...sheet.cssRules].map(r=>r.cssText)}catch{return[]}}).join('\n');
  const source=`<svg xmlns="http://www.w3.org/2000/svg" width="${size.w}" height="${size.h}" viewBox="0 0 ${size.w} ${size.h}"><style>${css}</style>${temp.innerHTML}</svg>`;
  const img=new Image(),url=URL.createObjectURL(new Blob([source],{type:'image/svg+xml'}));
  try{
    await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=reject;img.src=url});
    const canvas=document.createElement('canvas');canvas.width=size.w;canvas.height=size.h;
    const ctx=canvas.getContext('2d');if(!ctx)throw new Error('Canvas 2D context unavailable');
    ctx.fillStyle='#fff';ctx.fillRect(0,0,size.w,size.h);ctx.drawImage(img,0,0,size.w,size.h);
    const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));
    if(!blob||!blob.size)throw new Error('PNG encoding failed');
    return blob;
  }finally{URL.revokeObjectURL(url);}
};

function installInteractionHelp29(){
  const dialog=$('helpDialog');if(!dialog||$('guideInteractionContractSection29'))return;
  const section=document.createElement('section');section.id='guideInteractionContractSection29';section.className='guide-section';
  section.innerHTML=`<h3 data-i18n="guideInteractionContract29"></h3><p data-i18n="guideInteractionContractBody29"></p>`;
  ($('guideCrossModel20')||$('guidePoseDepth19')||$('guideArtDirection18'))?.insertAdjacentElement('afterend',section);
}
const applyLanguageBase29=applyLanguage;
applyLanguage=function(){
  applyLanguageBase29();installInteractionHelp29();
  document.querySelectorAll('#guideInteractionContractSection29 [data-i18n]').forEach(el=>el.textContent=t(el.dataset.i18n));
  renderReadiness18?.();
};

installInteractionHelp29();
render();
document.querySelector('footer')&&(document.querySelector('footer').textContent='Prototype 0.12.7 · interaction contract · full-size PNG export');