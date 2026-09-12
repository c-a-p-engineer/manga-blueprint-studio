import fs from 'node:fs';
import {runtimePaths, readRuntimeSet} from './runtime-paths.mjs';

const runtimeKeys=[
  'foundation','editorState','exportInput','eventBindings',
  'pageLayoutCamera','characterLibraryExport','localizationExportHardening',
  'smartManga','characterGuidance','identityLocalizationHardening',
  'storyReadability','smartIntentHardening'
];
const runtimeFiles=runtimeKeys.map(key=>runtimePaths[key]);
const requiredFiles=['AGENTS.md','README.md','LICENSE','docs/PRODUCT.md','docs/ARCHITECTURE.md','docs/PROMPT_HANDOFF.md','docs/ROADMAP.md','schema/manga-blueprint.schema.json','examples/directed-closeup.manga.json','web/index.html','web/styles.css','web/app.js','web/src/main.ts','web/src/legacy-runtime.ts','web/runtime/manifest.json','web/runtime/README.md',...runtimeFiles,'.github/workflows/pages.yml','.github/workflows/validate.yml'];
for(const file of requiredFiles)if(!fs.existsSync(file))throw new Error(`Missing required file: ${file}`);

const schema=JSON.parse(fs.readFileSync('schema/manga-blueprint.schema.json','utf8'));
const example=JSON.parse(fs.readFileSync('examples/directed-closeup.manga.json','utf8'));
if(schema.title!=='Manga Blueprint')throw new Error('Unexpected schema title');
if(schema.properties?.format?.const!=='manga-blueprint/0.2')throw new Error('Schema must describe 0.2');
if(example.format!=='manga-blueprint/0.2'||!example.pages?.length)throw new Error('Example must be a 0.2 project with a page');
if(!schema.properties?.meta?.properties?.canvasPreset||!schema.properties?.meta?.properties?.layoutPreset)throw new Error('Schema missing preset metadata');
if(schema.properties?.meta?.properties?.storyTemplate?.type!=='string')throw new Error('Schema missing storyTemplate provenance');
if(!schema.properties?.characterLibrary||!schema.$defs?.baseCharacter)throw new Error('Schema missing reusable character library');
if(!schema.properties?.meta?.properties?.readingDirection?.enum?.includes('rtl')||!schema.properties?.meta?.properties?.readingDirection?.enum?.includes('ltr'))throw new Error('Reading direction must support rtl and ltr');
if(schema.properties?.meta?.properties?.randomSeed?.type!=='string')throw new Error('Schema missing Smart Manga randomSeed provenance');
const variants=schema.properties?.meta?.properties?.randomVariant?.enum||[];
for(const value of ['balanced','dynamic','emotion'])if(!variants.includes(value))throw new Error(`Schema missing randomVariant ${value}`);
const intensities=schema.properties?.meta?.properties?.randomIntensity?.enum||[];
for(const value of ['stable','standard','bold'])if(!intensities.includes(value))throw new Error(`Schema missing randomIntensity ${value}`);
if(schema.$defs?.panel?.properties?.assistSeed?.type!=='string')throw new Error('Schema missing panel assistSeed provenance');
if(schema.$defs?.panel?.properties?.actionIntent?.type!=='string')throw new Error('Schema missing panel actionIntent');
const identityModes=schema.$defs?.baseCharacter?.properties?.identityMode?.enum||[];
for(const value of ['sheet','description','free'])if(!identityModes.includes(value))throw new Error(`Schema missing character identityMode ${value}`);
for(const field of ['summary','hair','eyes','outfit','features'])if(schema.$defs?.appearance?.properties?.[field]?.type!=='string')throw new Error(`Schema missing appearance.${field}`);

const html=fs.readFileSync('web/index.html','utf8');
const sources=readRuntimeSet(runtimeKeys);
const js=Object.values(sources).join('\n');
const app8=sources.smartManga;
const app9=sources.characterGuidance;
const app10=sources.identityLocalizationHardening;
const app11=sources.storyReadability;
const app12=sources.smartIntentHardening;
const bootstrap=fs.readFileSync('web/src/legacy-runtime.ts','utf8');
for(const id of ['blueprintSvg','helpBtn','helpDialog','canvasPresetSelect','canvasWidth','canvasHeight','templateSelect','randomBtn','randomDialog','panelOverview','selectedPanelSummary','cameraQuickPreset','cameraHelp','backgroundLocation','addBalloon','lineEffect','exportAiPng','exportAnnotatedPng','promptOutput','exportJson','importJson'])if(!html.includes(`id="${id}"`))throw new Error(`Missing base UI control: ${id}`);
if(!bootstrap.includes("from '../runtime/manifest.json'"))throw new Error('TypeScript bootstrap must consume the canonical runtime manifest');

for(const phrase of ['STRICT TEXT RENDERING RULE:','TEXT TO RENDER:','exportPng(false)','NEVER render character display names','authoring-text'])if(!js.includes(phrase))throw new Error(`Missing AI-safe handoff contract: ${phrase}`);
for(const phrase of ['square:{','four-vertical','four-grid','four-horizontal','smartRandom04','panelSummary04(','Extreme close','超寄り','Low angle','あおり','HELP_SEEN_KEY_04'])if(!js.includes(phrase))throw new Error(`Missing 0.4 feature contract: ${phrase}`);
for(const phrase of ['HELP_SEEN_KEY_05','800×1130 縦長（標準）','readingDirectionSelect','characterLibrary','baseCharacterSelect','placeBaseCharacter06','skel-head','backgroundLocations06','exportZip06','zipStore06','manga-blueprint-export-manifest/1','sha256Hex06','contentHash','randomUUID','guideExtremeCloseBody','guideHighBody','PNG encoding failed'])if(!js.includes(phrase))throw new Error(`Missing 0.5 feature contract: ${phrase}`);

for(const phrase of ['HELP_SEEN_KEY_06','smartCandidates08','randomSeed08','randomVariant','data-smart-apply','randomizePanel08','REFERENCE IMAGE RULE:','exportPackage08','ai-generation','review-archive','manga-blueprint-export-manifest/2','randomPlaceBase08','workflowHint08'])if(!app8.includes(phrase))throw new Error(`Missing 0.6 feature contract: ${phrase}`);
if(!app8.includes("annotatedName=isReview?`${prefix}_annotated.png`:null"))throw new Error('Annotated filename must be review-package-only');
if(!app8.includes("if(isReview){annotated=await buildPngBlob06(true)"))throw new Error('Annotated PNG encoding must be conditional on review package');
if(!app8.includes("aiGenerationSafe:packageType==='ai-generation'"))throw new Error('Manifest must identify AI-generation package safety boundary');
if(!app8.includes("fresh.addEventListener('click',async()=>{try{await exportPackage08('ai-generation')"))throw new Error('Primary ZIP action must export AI-generation package');
if(!app8.includes("review.addEventListener('click',async()=>{try{await exportPackage08('review-archive')"))throw new Error('Secondary ZIP action must export review/archive package');
if(!app8.includes("e.stopImmediatePropagation();buildSmartCandidates08()"))throw new Error('Smart Manga submit must preview candidates instead of invoking legacy immediate mutation');
if(!app8.includes("project.meta.randomSeed=c.baseSeed")||!app8.includes("project.meta.randomVariant=c.variant"))throw new Error('Applied Smart Manga candidate must store reproducibility provenance');
if(!app8.includes("applyBeat08(panel,beat,{characters:true,preserveRole:true,background:false})"))throw new Error('Panel dice must preserve background content and narrative role');
if(!app8.includes("project.meta.readingDirection==='rtl'?b.x-a.x:a.x-b.x"))throw new Error('Smart Manga preview numbering must respect reading direction');

for(const phrase of ['HELP_SEEN_KEY_07','identityMode','appearanceSummary','characterGuidance09','handoffText09','manga-blueprint-export-manifest/3','fileEntries','instructions={readFirst','characterSheetsRequired','userMessageTemplate','CHARACTER IDENTITY GUIDANCE:','randomIntensity09','smartIntensityStable','smartIntensityBold','romance','cute','suspense','intro','layoutThumbnailGrid09','cameraVisual09','backgroundScenePreset09','balloonPreset09','panelSummary04=function'])if(!app9.includes(phrase))throw new Error(`Missing 0.7 feature contract: ${phrase}`);
if(!app9.includes("['sheet','description','free'].includes(base.identityMode)"))throw new Error('Character Sheet must be optional through explicit identity modes');
if(!app9.includes("required=mode==='sheet'"))throw new Error('Only sheet identity mode may require a Character Sheet');
if(!app9.includes("manifest.instructions={readFirst:files.manifest"))throw new Error('Manifest must be the read-first handoff authority');
if(!app9.includes("requiredForGeneration"))throw new Error('Manifest file roles must identify generation-critical files');
if(!app9.includes("Character Sheet が必要と書かれているキャラクター"))throw new Error('Japanese compact handoff template missing Character Sheet guidance');
if(!app9.includes("Extract this ZIP, read the *_manifest.json file first"))throw new Error('English compact handoff template missing');
if(!app9.includes("project.meta.randomIntensity=c.intensity"))throw new Error('Applied Smart Manga candidate must store intensity provenance');
if(!app9.includes("background:false"))throw new Error('Panel dice must continue preserving entered background content');

for(const phrase of ['backgroundSceneData10','school classroom','train platform','back alley','localizeAppearanceFields10','appearanceSummaryPlaceholder','baseAppearanceHair09','disabled=!!free'])if(!app10.includes(phrase))throw new Error(`Missing 0.7 localization hardening contract: ${phrase}`);
if(!app10.includes("localized[language]||localized.ja"))throw new Error('Background preset semantic values must follow selected UI language');

for(const phrase of ['HELP_SEEN_KEY_08','storyTemplates11','storyTemplateIncludeText','actionIntent','panelPeek11','panelChipText11','renderPanelList11','mangaLint11','framingStatus11','fitCharacterToCamera11','crop-guide11','STORY ACTION INTENT:','Character visual identity follows CHARACTER IDENTITY GUIDANCE','panelIntentIndex'])if(!app11.includes(phrase))throw new Error(`Missing 0.8 feature contract: ${phrase}`);
for(const id of ['cuteDaily','romance','surprise','gag','action'])if(!app11.includes(`${id}:{`))throw new Error(`Missing story template ${id}`);
if(!app11.includes("panel.actionIntent=String(panel.actionIntent||'')"))throw new Error('Legacy projects must normalize missing actionIntent');
if(!app11.includes("pointerdown"))throw new Error('Panel Peek must support pointer long-press');
if(!app11.includes("data-panel-info11"))throw new Error('Panel Peek must also have a discoverable info affordance');
if(!app11.includes("authoring-overlay11"))throw new Error('Panel chips/crop guide must remain authoring-only overlays');
if(!app11.includes("out=out.replace('- Character visual identity comes only"))throw new Error('Prompt identity contract must override the legacy Character-Sheet-only sentence');

for(const phrase of ['smartActionProfiles12','smartActionIntent12','applySmartCandidate08Base12','panel.actionIntent=smartActionIntent12','project.meta.storyTemplate=','actionIntentPlaceholder'])if(!app12.includes(phrase))throw new Error(`Missing Smart Manga 0.8 hardening contract: ${phrase}`);
if(!app12.includes("if(!panel.actionIntent?.trim())"))throw new Error('Smart Manga may fill only missing action intent');

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
const exampleBase=example.characterLibrary[0];
if(exampleBase.identityMode!=='description'||!exampleBase.appearance?.summary)throw new Error('Example should demonstrate Character-Sheet-free appearance guidance');
if(!example.pages[0].panels[0].actionIntent)throw new Error('Example should demonstrate actionIntent');
console.log('Prototype repository contract validation passed.');
