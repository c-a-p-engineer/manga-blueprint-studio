// Prototype 0.11.1: cross-model handoff hardening from real ChatGPT/Gemini comparison.
Object.assign(i18n.ja,{
  readinessSingleActorGaze:'画面内に相手役がいませんが、視線が「他のキャラクター」になっています。画面外の相手なら「画面外の相手 / 対象」を使うとモデル差を減らせます。',
  guideCrossModel:'モデル差を減らす',
  guideCrossModelBody:'Clean PNGはコマ位置と大まかな配置、JSON/Promptは出来事・ポーズ・カメラ・奥行き、Character Guidanceは人物同一性、仕上がりスタイルは画風を担当します。空中動作や超前景は意味情報を優先して解釈します。'
});
Object.assign(i18n.en,{
  readinessSingleActorGaze:'No other character is visible in this panel, but gaze targets “other character”. Use “off-panel person / target” when the opponent is outside the frame to reduce model ambiguity.',
  guideCrossModel:'Reduce model drift',
  guideCrossModelBody:'Clean PNG owns panel geometry and approximate placement; JSON/prompt own action, pose, camera, and depth; Character Guidance owns identity; Art Direction owns rendering language. Airborne and near-object semantics should not be simplified back into generic grounded poses.'
});

function hardenSmartProfiles20(){
  if(typeof smartProfiles08!=='undefined'){
    for(const purpose of ['action','climax']){
      const profile=smartProfiles08[purpose];
      if(profile?.[2])Object.assign(profile[2],{
        role:'beat',
        camera:['close','low-angle','three-quarter-front'],
        pose:'crouch',
        expression:'angry',
        gaze:'other-character',
        effect:'tension',
        background:'selective-detail'
      });
    }
  }
  if(typeof smartActionProfiles12!=='undefined'){
    smartActionProfiles12.action={
      ja:['相手との距離を詰める','勢いをつけて攻撃へ移る','低く身を沈めて力を溜め、決定打に備える','決定打の瞬間を見せる'],
      en:['closes the distance to the opponent','commits to the attack with momentum','drops low and gathers force for the finishing strike','shows the decisive impact']
    };
    smartActionProfiles12.climax={
      ja:['見せ場前の状況を整える','見せ場へ向けて動き出す','決め手の直前で力を溜め、緊張を高める','最大の見せ場を大きく見せる'],
      en:['sets up the moment before the climax','moves decisively toward the climax','gathers force and tension immediately before the decisive beat','shows the main climax at full emphasis']
    };
  }
}
hardenSmartProfiles20();

function explicitForegroundTarget20(panel){
  const primary=panel?.characters?.[0];
  const pose=primary?.poseId||'';
  if(pose==='punch'||pose==='aerial-punch')return'right-hand';
  if(pose==='kick')return'right-foot';
  return null;
}
function hardenAppliedSmartManga20(purpose){
  if(!['action','climax'].includes(purpose))return false;
  const ordered=[...currentPage().panels].sort((a,b)=>a.order-b.order);
  let changed=false;
  for(const panel of ordered){
    if((panel.characters||[]).length===1){
      const ch=panel.characters[0];
      if(ch.gaze?.target==='other-character'){ch.gaze.target='off-panel-target';changed=true;}
    }
  }
  const climax=ordered.at(-1);
  if(climax?.camera?.viewpoint==='near-object'){
    const target=explicitForegroundTarget20(climax);
    if(target&&(climax.camera.depthTarget||'auto')==='auto'){climax.camera.depthTarget=target;changed=true;}
    if(climax.camera.foreshortening!=='extreme'){climax.camera.foreshortening='extreme';changed=true;}
  }
  return changed;
}

if(typeof applySmartCandidate08==='function'){
  const applySmartCandidate08Base20=applySmartCandidate08;
  applySmartCandidate08=function(index){
    const candidate=typeof smartCandidates08!=='undefined'?smartCandidates08[index]:null;
    applySmartCandidate08Base20(index);
    const purpose=candidate?.purpose||project.meta.randomPurpose||'';
    if(hardenAppliedSmartManga20(purpose))render();
  };
}

function modelIndependentPriority20(){
  return [
    'MODEL-INDEPENDENT INTERPRETATION PRIORITY:',
    '- CLEAN Manga Blueprint PNG owns panel geometry, panel proportions, and approximate 2D placement.',
    '- The semantic JSON/prompt owns story action, pose meaning, support state, motion phase, camera, depth target, foreshortening, scene continuity, and lettering rules.',
    '- CHARACTER IDENTITY GUIDANCE, plus Character Sheets only where explicitly required, owns character appearance and continuity.',
    '- ART DIRECTION (GLOBAL) owns color mode, rendering style, line work, shading, detail, and visual tone.',
    '- When the stick figure is too abstract to express an airborne or near-object instruction, preserve the semantic airborne/depth intent rather than simplifying it into a grounded run or sideways strike.'
  ].join('\n');
}
function cleanLegacyIdentityWording20(text){
  return String(text||'')
    .replace(/- The clean AI blueprint uses monochrome pose figures; character appearance still comes from Character Sheets\./g,'- The clean AI blueprint uses monochrome pose figures; character appearance follows CHARACTER IDENTITY GUIDANCE and Character Sheets only where explicitly required.')
    .replace(/character appearance still comes from Character Sheets/gi,'character appearance follows CHARACTER IDENTITY GUIDANCE and Character Sheets only where explicitly required');
}
const compilePromptBase20=compilePrompt;
compilePrompt=function(){
  const base=cleanLegacyIdentityWording20(compilePromptBase20());
  return `${base}\n\n${modelIndependentPriority20()}`;
};

if(typeof readinessIssues18==='function'){
  const readinessIssuesBase20=readinessIssues18;
  readinessIssues18=function(){
    const issues=readinessIssuesBase20();
    for(const panel of currentPage().panels||[]){
      if((panel.characters||[]).length===1&&panel.characters[0]?.gaze?.target==='other-character')issues.push({kind:'gaze',text:`Panel ${panel.order}: ${t('readinessSingleActorGaze')}`});
    }
    return issues;
  };
}

if(typeof exportManifest08==='function'){
  const exportManifestBase20=exportManifest08;
  exportManifest08=function(identity,packageType,files){
    const manifest=exportManifestBase20(identity,packageType,files);
    manifest.handoffPriority={
      panelGeometry:'cleanPng',
      storyActionPoseCameraDepth:'projectJson+prompt',
      characterIdentity:'characterGuidance+requiredCharacterSheetsOnly',
      artDirection:'artDirection',
      textRendering:'prompt.TEXT_TO_RENDER+lettering'
    };
    manifest.crossModelHints={
      preserveAirborneSemantics:true,
      preserveNearObjectForeshortening:true,
      doNotInferUniversalCharacterSheetRequirement:true
    };
    return manifest;
  };
}

function installCrossModelHelp20(){
  const dialog=$('helpDialog');if(!dialog||$('guideCrossModel20'))return;
  const section=document.createElement('section');section.id='guideCrossModel20';section.className='guide-section';section.innerHTML=`<h3 data-i18n="guideCrossModel"></h3><p data-i18n="guideCrossModelBody"></p>`;
  const pose=$('guidePoseDepth19')||$('guideArtDirection18');pose?.insertAdjacentElement('afterend',section);
}
const applyLanguageBase20=applyLanguage;
applyLanguage=function(){applyLanguageBase20();installCrossModelHelp20();document.querySelectorAll('#guideCrossModel20 [data-i18n]').forEach(el=>el.textContent=t(el.dataset.i18n));renderReadiness18?.();};

installCrossModelHelp20();
render();
document.querySelector('footer')&&(document.querySelector('footer').textContent='Prototype 0.11.1 · cross-model handoff hardening');
