import fs from 'node:fs';
import {runtimePaths, readRuntime} from './runtime-paths.mjs';

const app=readRuntime('templateQuality');
const bootstrap=fs.readFileSync('web/src/legacy-runtime.ts','utf8');
const app13=readRuntime('templateStudio');

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

const src=runtimePaths.templateQuality.slice('web/'.length);
if(!bootstrap.includes(`'${src}'`))throw new Error(`TypeScript bootstrap does not load ${src}`);
if(!app13.includes("classroomTalk:{label:'storyClassroomTalk'"))throw new Error('Classroom conversation template missing');

for(const text of [
  'ねえ、今日ちょっと聞いてほしいことがあって',
  'そういえばさ…',
  'え、ほんと？',
  'うん。それでね…'
])if(!app.includes(text))throw new Error(`Classroom dialogue seed missing: ${text}`);

if(app.includes("framingStatus11=function(){return{kind:'good'"))throw new Error('Template hardening must not bypass framing diagnostics');
if(!app.includes('target*panel.rect.h/localH'))throw new Error('Template camera fit must derive scale from panel height and camera target');

console.log('Template camera/dialogue quality validation passed.');
