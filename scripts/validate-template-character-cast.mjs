import fs from 'node:fs';
import {runtimeLoadOrder,runtimePaths,readRuntime} from './runtime-paths.mjs';

const read=path=>fs.readFileSync(path,'utf8');
const runtime=readRuntime('templateCharacterCast');
const workflow=read('web/src/ui/template-workflow.ts');
const runtimeApi=read('web/src/runtime/legacy-api.ts');
const pageModes=read('web/src/ui/page-modes.ts');

function requireText(source,text,label){
  if(!source.includes(text))throw new Error(`${label} missing ${JSON.stringify(text)}`);
}

if(runtimePaths.templateCharacterCast!=='web/runtime/integration/template-character-cast.js')throw new Error('Template cast integration runtime owner is not registered');
const discoveryIndex=runtimeLoadOrder.indexOf('templateDiscoveryPresentation');
const castIndex=runtimeLoadOrder.indexOf('templateCharacterCast');
const producerIndex=runtimeLoadOrder.indexOf('producerProvenance');
if(!(discoveryIndex>=0&&castIndex>discoveryIndex&&producerIndex>castIndex))throw new Error('Template cast integration must load after discovery presentation and before producer/UI tail.');

for(const id of [
  'starter-highschool-male','starter-highschool-female',
  'starter-adult-male','starter-adult-female',
  'starter-mob-male','starter-mob-female'
])requireText(runtime,`'${id}'`,'starter catalog');

for(const token of [
  'createProjectWithIdentityBase36',
  'addMissingStarterCharacters36(next)',
  'templatePrimaryCharacter36',
  'templateSecondaryCharacter36',
  'templateCastApplying36',
  'currentBaseCharacter06=function()',
  'templateBases27=function()',
  'applyTemplatePresentation34()',
  'storyTemplatePreview11',
  "preview.hidden=true",
  'templateUseWithCast36',
  'starterCharacters36',
  'templateWorkflowTop36',
  'relocateTemplateWorkflow36',
  'templateUseDialogue36',
  "apply.classList.add('primary')",
  '@media(max-width:760px)',
  "hair:localized.hair||''",
  "eyes:localized.eyes||''",
  '白い長袖シャツ、紺のブレザー',
  'long-sleeve blouse, ankle-length trousers',
  'gray hoodie, black full-length trousers'
])requireText(runtime,token,'template cast integration');

for(const token of [
  "closest('#applyStoryTemplate11')",
  'event.stopImmediatePropagation()',
  "apply.classList.add('primary','phase1-template-apply')",
  "oldBlock.hidden=true"
])requireText(workflow,token,'typed template workflow');
for(const token of ['runtime.applySelectedTemplateWithCast36','runtime.applyTemplatePresentation34'])requireText(runtimeApi,token,'legacy runtime bridge');
requireText(pageModes,'ensureManualLayoutDisclosure','page-mode owner');

const newWorkOnlyComment='Existing/imported works are left untouched.';
requireText(runtime,newWorkOnlyComment,'compatibility contract');

if(runtime.includes('normalizeProject=function(input){')&&runtime.includes('addMissingStarterCharacters36(normalizeProject')){
  throw new Error('Starter characters must not be silently injected through normalizeProject into existing/imported works.');
}

console.log('Template cast selection, typed primary apply route, and starter-character contract passed.');
