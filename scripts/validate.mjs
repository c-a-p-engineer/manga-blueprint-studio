import fs from 'node:fs';

const runtimeFiles=['web/app-1.js','web/app-2.js','web/app-3.js','web/app-4.js','web/app-5.js','web/app-6.js','web/app-7.js','web/app-8.js'];
const requiredFiles=['AGENTS.md','README.md','LICENSE','docs/PRODUCT.md','docs/ARCHITECTURE.md','docs/PROMPT_HANDOFF.md','docs/ROADMAP.md','schema/manga-blueprint.schema.json','examples/directed-closeup.manga.json','web/index.html','web/styles.css','web/app.js',...runtimeFiles,'.github/workflows/pages.yml','.github/workflows/validate.yml'];
for(const file of requiredFiles)if(!fs.existsSync(file))throw new Error(`Missing required file: ${file}`);

const schema=JSON.parse(fs.readFileSync('schema/manga-blueprint.schema.json','utf8'));
const example=JSON.parse(fs.readFileSync('examples/directed-closeup.manga.json','utf8'));
if(schema.title!=='Manga Blueprint')throw new Error('Unexpected schema title');
if(schema.properties?.format?.const!=='manga-blueprint/0.2')throw new Error('Schema must describe 0.2');
if(example.format!=='manga-blueprint/0.2'||!example.pages?.length)throw new Error('Example must be a 0.2 project with a page');
if(!schema.properties?.meta?.properties?.canvasPreset||!schema.properties?.meta?.properties?.layoutPreset)throw new Error('Schema missing preset metadata');
if(!schema.properties?.characterLibrary||!schema.$defs?.baseCharacter)throw new Error('Schema missing reusable character library');
if(!schema.properties?.meta?.properties?.readingDirection?.enum?.includes('rtl')||!schema.properties?.meta?.properties?.readingDirection?.enum?.includes('ltr'))throw new Error('Reading direction must support rtl and ltr');
if(schema.properties?.meta?.properties?.randomSeed?.type!=='string')throw new Error('Schema missing Smart Manga randomSeed provenance');
const variants=schema.properties?.meta?.properties?.randomVariant?.enum||[];
for(const value of ['balanced','dynamic','emotion'])if(!variants.includes(value))throw new Error(`Schema missing randomVariant ${value}`);
if(schema.$defs?.panel?.properties?.assistSeed?.type!=='string')throw new Error('Schema missing panel assistSeed provenance');

const html=fs.readFileSync('web/index.html','utf8');
const sources=Object.fromEntries(runtimeFiles.map(f=>[f,fs.readFileSync(f,'utf8')]));
const js=Object.values(sources).join('\n');
const app8=sources['web/app-8.js'];
const bootstrap=fs.readFileSync('web/app.js','utf8');
for(const id of ['blueprintSvg','helpBtn','helpDialog','canvasPresetSelect','canvasWidth','canvasHeight','templateSelect','randomBtn','randomDialog','panelOverview','selectedPanelSummary','cameraQuickPreset','cameraHelp','backgroundLocation','addBalloon','lineEffect','exportAiPng','exportAnnotatedPng','promptOutput','exportJson','importJson'])if(!html.includes(`id="${id}"`))throw new Error(`Missing base UI control: ${id}`);
for(const file of runtimeFiles)if(!bootstrap.includes(file.split('/').pop()))throw new Error(`Bootstrap does not load ${file}`);

for(const phrase of ['STRICT TEXT RENDERING RULE:','TEXT TO RENDER:','exportPng(false)','NEVER render character display names','authoring-text'])if(!js.includes(phrase))throw new Error(`Missing AI-safe handoff contract: ${phrase}`);
for(const phrase of ['square:{','four-vertical','four-grid','four-horizontal','smartRandom04','panelSummary04(','Extreme close','超寄り','Low angle','あおり','HELP_SEEN_KEY_04'])if(!js.includes(phrase))throw new Error(`Missing 0.4 feature contract: ${phrase}`);
for(const phrase of ['HELP_SEEN_KEY_05','800×1130 縦長（標準）','readingDirectionSelect','characterLibrary','baseCharacterSelect','placeBaseCharacter06','skel-head','backgroundLocations06','exportZip06','zipStore06','manga-blueprint-export-manifest/1','sha256Hex06','contentHash','randomUUID','guideExtremeCloseBody','guideHighBody','PNG encoding failed'])if(!js.includes(phrase))throw new Error(`Missing 0.5 feature contract: ${phrase}`);

for(const phrase of ['HELP_SEEN_KEY_06','smartCandidates08','randomSeed08','randomVariant','data-smart-apply','randomizePanel08','REFERENCE IMAGE RULE:','exportPackage08','ai-generation','review-archive','manga-blueprint-export-manifest/2','randomPlaceBase08','workflowHint08'])if(!app8.includes(phrase))throw new Error(`Missing 0.6 feature contract: ${phrase}`);
if(!app8.includes("const annotatedName=isReview?`${prefix}_annotated.png`:null"))throw new Error('Annotated filename must be review-package-only');
if(!app8.includes("if(isReview){annotated=await buildPngBlob06(true)"))throw new Error('Annotated PNG encoding must be conditional on review package');
if(!app8.includes("aiGenerationSafe:packageType==='ai-generation'"))throw new Error('Manifest must identify AI-generation package safety boundary');
if(!app8.includes("fresh.addEventListener('click',async()=>{try{await exportPackage08('ai-generation')"))throw new Error('Primary ZIP action must export AI-generation package');
if(!app8.includes("review.addEventListener('click',async()=>{try{await exportPackage08('review-archive')"))throw new Error('Secondary ZIP action must export review/archive package');
if(!app8.includes("e.stopImmediatePropagation();buildSmartCandidates08()"))throw new Error('Smart Manga submit must preview candidates instead of invoking legacy immediate mutation');
if(!app8.includes("project.meta.randomSeed=c.baseSeed")||!app8.includes("project.meta.randomVariant=c.variant"))throw new Error('Applied Smart Manga candidate must store reproducibility provenance');
if(!app8.includes("applyBeat08(panel,beat,{characters:true,preserveRole:true,background:false})"))throw new Error('Panel dice must preserve background content and narrative role');
if(!app8.includes("project.meta.readingDirection==='rtl'?b.x-a.x:a.x-b.x"))throw new Error('Smart Manga preview numbering must respect reading direction');

if(!js.includes("p.format='manga-blueprint/0.2'"))throw new Error('Missing legacy normalization');
if(!js.includes("'manga-blueprint-studio/0.1'"))throw new Error('Legacy 0.1 autosave compatibility missing');

for(const page of example.pages){
  const orders=new Set();
  for(const panel of page.panels){
    if(orders.has(panel.order))throw new Error(`Duplicate panel order ${panel.order}`);orders.add(panel.order);
    if(!panel.style||!panel.background||!panel.effects||!panel.camera?.viewpoint)throw new Error(`Missing 0.2 panel semantics: ${panel.id}`);
    for(const ch of panel.characters??[])if(!ch.expression||!ch.gaze)throw new Error(`Missing expression/gaze: ${ch.id}`);
  }
}
if(!example.characterLibrary?.length)throw new Error('Example should demonstrate reusable base characters');
console.log('Prototype 0.6 repository contract validation passed.');
