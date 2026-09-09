// Prototype 0.11.2: template quality hardening.
// Built-in Scene Templates should not immediately contradict the camera diagnostic,
// and conversation-first templates should contain useful editable sample dialogue when text seeding is enabled.

Object.assign(i18n.ja,{
  guideTemplateQuality:'テンプレート品質',
  guideTemplateQualityBody:'内蔵テンプレートは、適用直後の人物サイズをカメラ距離へ合わせます。会話を主目的とするテンプレートでは「サンプル台詞・オノマトペも入れる」が有効なら、会話の流れが分かる台詞を初期配置します。'
});
Object.assign(i18n.en,{
  guideTemplateQuality:'Template quality',
  guideTemplateQualityBody:'Built-in templates fit placed character scale to their camera distance when applied. Conversation-first templates seed enough editable dialogue to make the exchange readable when “Include sample dialogue and SFX” is enabled.'
});

const TEMPLATE_SCALE_MAX_21=6;

function fitScaleForCamera21(panel,ch,distance=panel?.camera?.distance||'medium'){
  if(!panel||!ch)return;
  const target=distanceTarget11[distance]||distanceTarget11.medium||.78;
  const localH=Math.max(1,poseHeight11(ch));
  ch.scale=Math.max(.35,Math.min(TEMPLATE_SCALE_MAX_21,target*panel.rect.h/localH));
  if(['close','extreme-close'].includes(distance)){
    const pose=posePresets[ch.poseId]||posePresets.stand;
    const headY=pose.joints.head[1];
    ch.y=panel.rect.y+panel.rect.h*.47-headY*ch.scale;
  }
}

// The previous 3x authoring cap could make a valid close/extreme-close template
// impossible to satisfy on a tall emphasis panel. Keep the diagnostic strict and
// expand the editable scale range instead of suppressing the warning.
const makeStoryInstanceBase21=makeStoryInstance11;
makeStoryInstance11=function(base,panel,beat){
  const ch=makeStoryInstanceBase21(base,panel,beat);
  fitScaleForCamera21(panel,ch,beat?.camera?.[0]||panel?.camera?.distance||'medium');
  return ch;
};

fitCharacterToCamera11=function(){
  const panel=selectedPanel(),status=framingStatus11(panel),ch=status.ch;
  if(!panel||!ch)return;
  mutate(()=>fitScaleForCamera21(panel,ch,panel.camera?.distance||'medium'));
};

function ensureScaleControl21(){
  const input=$('characterScale');
  if(input)input.max=String(TEMPLATE_SCALE_MAX_21);
}

function localizedDialogue21(ja,en){return {ja,en};}
function ensureConversationTemplateDialogue21(){
  const tpl=storyTemplates11.classroomTalk;
  if(!tpl?.beats?.length)return;
  tpl.dialoguePolicy='conversation';
  tpl.minimumDialogueBeats=4;
  const defaults=[
    localizedDialogue21('ねえ、今日ちょっと聞いてほしいことがあって','Hey, there is something I wanted to tell you about today.'),
    localizedDialogue21('そういえばさ…','Speaking of that…'),
    localizedDialogue21('え、ほんと？','Wait, really?'),
    localizedDialogue21('うん。それでね…','Yeah. And then…')
  ];
  tpl.beats.forEach((beat,i)=>{if(!beat.dialogue)beat.dialogue=defaults[i];});

  // Dialogue-led scene templates should always have an explicit policy so future
  // edits/validation do not silently turn them into pose-only recipes.
  for(const id of ['confession','romanceMisunderstanding']){
    const item=storyTemplates11[id];if(item){item.dialoguePolicy='conversation';item.minimumDialogueBeats=2;}
  }
}

function dialogueBeatCount21(tpl){return (tpl?.beats||[]).filter(b=>localized13x?.(b.dialogue)?.trim?.()).length;}
function templateQualityIssues21(){
  const issues=[];
  for(const [id,tpl] of Object.entries(storyTemplates11)){
    const minimum=Number(tpl.minimumDialogueBeats||0);
    if(tpl.dialoguePolicy==='conversation'&&dialogueBeatCount21(tpl)<minimum){
      issues.push({id,kind:'dialogue',expected:minimum,actual:dialogueBeatCount21(tpl)});
    }
  }
  return issues;
}

function installTemplateQualityHelp21(){
  const dialog=$('helpDialog');if(!dialog||$('guideTemplateQuality21'))return;
  const section=document.createElement('section');section.id='guideTemplateQuality21';section.className='guide-section';
  section.innerHTML=`<h3 data-i18n="guideTemplateQuality"></h3><p data-i18n="guideTemplateQualityBody"></p>`;
  const story=$('guideStoryReadable11');story?.insertAdjacentElement('afterend',section);
}

const applyLanguageBase21=applyLanguage;
applyLanguage=function(){
  applyLanguageBase21();ensureScaleControl21();installTemplateQualityHelp21();
  document.querySelectorAll('#guideTemplateQuality21 [data-i18n]').forEach(el=>el.textContent=t(el.dataset.i18n));
};

ensureConversationTemplateDialogue21();
ensureScaleControl21();
installTemplateQualityHelp21();
const qualityIssues21=templateQualityIssues21();
if(qualityIssues21.length)console.warn('Template quality issues',qualityIssues21);
render();
document.querySelector('footer')&&(document.querySelector('footer').textContent='Prototype 0.11.2 · template camera/dialogue quality');
