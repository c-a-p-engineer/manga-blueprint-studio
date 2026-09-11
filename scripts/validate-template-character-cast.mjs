import fs from 'node:fs';

const read=path=>fs.readFileSync(path,'utf8');
const runtime=read('web/runtime/integration/template-character-cast.js');
const app=read('web/app.js');

function requireText(source,text,label){
  if(!source.includes(text))throw new Error(`${label} missing ${JSON.stringify(text)}`);
}

requireText(app,"['integration/template-character-cast', './runtime/integration/template-character-cast.js']",'runtime registration');
const discoveryIndex=app.indexOf("['templates/discovery-presentation'");
const castIndex=app.indexOf("['integration/template-character-cast'");
const producerIndex=app.indexOf("['handoff/producer-provenance'");
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
  '@media(max-width:760px)'
])requireText(runtime,token,'template cast integration');

const newWorkOnlyComment='Existing/imported works are left untouched.';
requireText(runtime,newWorkOnlyComment,'compatibility contract');

if(runtime.includes('normalizeProject=function(input){')&&runtime.includes('addMissingStarterCharacters36(normalizeProject')){
  throw new Error('Starter characters must not be silently injected through normalizeProject into existing/imported works.');
}

console.log('Template cast selection and starter-character contract passed.');
