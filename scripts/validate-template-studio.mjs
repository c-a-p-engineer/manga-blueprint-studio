import fs from 'node:fs';

const bootstrap=fs.readFileSync('web/app.js','utf8');
const app13=fs.readFileSync('web/app-13.js','utf8');
const app14=fs.readFileSync('web/app-14.js','utf8');
for(const file of ['./app-13.js','./app-14.js'])if(!bootstrap.includes(file))throw new Error(`Bootstrap must load ${file}`);

for(const phrase of [
  'CUSTOM_TEMPLATE_KEY_13',
  'templateCategory13',
  'templateSearch13',
  'templateGallery13',
  'template-card13',
  'renderTemplatePreview13',
  'templateUseCase',
  'templateDerive',
  'deriveTemplate13',
  'templateSaveCurrent',
  'captureCurrentTemplate13',
  'localStorage',
  'normalizedRects',
  'Character-specific appearance is not saved'
])if(!app13.includes(phrase))throw new Error(`Missing Template Studio contract: ${phrase}`);

for(const template of [
  'confession','kissBefore','kissAfter','holdHands','romanceMisunderstanding',
  'battleStandoff','decisiveBlow','counterattack','aerialAttack','throwTechnique','awakening',
  'crying','angerBurst','resolve','presenceBehind','classroomTalk','smugFail','characterIntro'
])if(!app13.includes(`${template}:{`))throw new Error(`Missing scene template: ${template}`);

for(const category of ['romance','battle','emotion','daily','comedy','suspense','character','custom'])if(!app13.includes(`templateCategory${category[0].toUpperCase()+category.slice(1)}`))throw new Error(`Missing template category: ${category}`);

if(!app13.includes("const oldApply=$('applyStoryTemplate11')"))throw new Error('0.9 must replace the legacy apply listener so custom geometry can be applied intentionally');
if(!app13.includes("if(Array.isArray(tpl.normalizedRects))"))throw new Error('Custom template geometry must scale to the current canvas');
if(!app13.includes("project.meta.storyTemplate=id===DERIVED_TEMPLATE_ID_13"))throw new Error('Applied template provenance must distinguish derived variations');
if(!app13.includes("if(base)panel.characters=[makeStoryInstance11"))throw new Error('Template apply must reuse the selected/project base character without storing identity in custom templates');
if(!app14.includes('globalThis.toast=toast'))throw new Error('Template save feedback must be safe even when no prior toast helper exists');
if(!app14.includes('syncTemplateSelect13()'))throw new Error('Template select labels must refresh on language changes');

console.log('Prototype 0.9 template studio contract validation passed.');
