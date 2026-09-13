import fs from 'node:fs';
import {runtimeLoadOrder} from './runtime-paths.mjs';
import {requireText,runtimeFamilySource,sourceTree} from './contract-source.mjs';

const runtime=runtimeFamilySource('templates/','integration/');
const typedUi=sourceTree('web/src/ui',{extensions:['.ts']});
const runtimeApi=fs.readFileSync('web/src/runtime/legacy-api.ts','utf8');

const discoveryIndex=runtimeLoadOrder.indexOf('templateDiscoveryPresentation');
const castIndex=runtimeLoadOrder.indexOf('templateCharacterCast');
const producerIndex=runtimeLoadOrder.indexOf('producerProvenance');
if(!(discoveryIndex>=0&&castIndex>discoveryIndex&&producerIndex>castIndex))throw new Error('Template/cast integration load boundary is invalid.');

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
  'preview.hidden=true',
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
])requireText(runtime,token,'registered template/integration owners');

// Typed UI routing is checked across the whole UI source tree so harmless module moves do not
// require rewriting this validator. The click selector and propagation behavior are UI contracts.
for(const token of [
  "closest('#applyStoryTemplate11')",
  'event.stopImmediatePropagation()',
  "apply.classList.add('primary','phase1-template-apply')",
  "oldBlock.hidden=true",
  'ensureManualLayoutDisclosure'
])requireText(typedUi,token,'typed template UI route');

for(const token of ['runtime.applySelectedTemplateWithCast36','runtime.applyTemplatePresentation34']){
  requireText(runtimeApi,token,'legacy runtime bridge');
}
for(const token of ['applySelectedTemplateWithCast36','applyTemplatePresentation34']){
  requireText(runtime,token,'registered template apply runtime');
}

const newWorkOnlyComment='Existing/imported works are left untouched.';
requireText(runtime,newWorkOnlyComment,'compatibility contract');
if(runtime.includes('normalizeProject=function(input){')&&runtime.includes('addMissingStarterCharacters36(normalizeProject')){
  throw new Error('Starter characters must not be silently injected through normalizeProject into existing/imported works.');
}

console.log('Template cast/apply validation passed across registered template/integration owners and the typed UI source tree.');
