import fs from 'node:fs';

const app=fs.readFileSync('web/app-21.js','utf8');
const bootstrap=fs.readFileSync('web/app.js','utf8');
const app13=fs.readFileSync('web/app-13.js','utf8');

for(const phrase of [
  'TEMPLATE_SCALE_MAX_21=6',
  'fitScaleForCamera21',
  'makeStoryInstanceBase21',
  'makeStoryInstance11=function',
  "input.max=String(TEMPLATE_SCALE_MAX_21)",
  "storyTemplates11.classroomTalk",
  "tpl.dialoguePolicy='conversation'",
  'minimumDialogueBeats=4',
  'templateQualityIssues21'
])if(!app.includes(phrase))throw new Error(`Missing template quality contract: ${phrase}`);

if(!bootstrap.includes("'./app-21.js'"))throw new Error('Bootstrap does not load app-21.js');
if(!app13.includes("classroomTalk:{label:'storyClassroomTalk'"))throw new Error('Classroom conversation template missing');

for(const text of [
  'ねえ、今日ちょっと聞いてほしいことがあって',
  'そういえばさ…',
  'え、ほんと？',
  'うん。それでね…'
])if(!app.includes(text))throw new Error(`Classroom dialogue seed missing: ${text}`);

// Regression intent: do not silence framing diagnostics for templates. Template-created
// instances must instead be fitted to the same camera-distance target used by the diagnostic.
if(app.includes("framingStatus11=function(){return{kind:'good'"))throw new Error('Template hardening must not bypass framing diagnostics');
if(!app.includes('target*panel.rect.h/localH'))throw new Error('Template camera fit must derive scale from panel height and camera target');

console.log('Template camera/dialogue quality validation passed.');
