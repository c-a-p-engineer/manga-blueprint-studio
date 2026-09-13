import fs from 'node:fs';

const read=path=>fs.readFileSync(path,'utf8');
const json=path=>JSON.parse(read(path));
const pkg=json('package.json');
const build=json('web/build-info.json');
const app=read('web/app.js');
const main=read('web/src/main.ts');
const runtime=read('web/src/legacy-runtime.ts');
const runtimeApi=read('web/src/runtime/legacy-api.ts');
const ui=read('web/src/phase-one-ui.ts');
const workflow=read('web/src/ui/template-workflow.ts');
const pageModes=read('web/src/ui/page-modes.ts');
const panelDisclosures=read('web/src/ui/panel-disclosures.ts');
const css=read('web/src/phase-one-ui.css');
const vite=read('vite.config.ts');

if(!/^\d+\.\d+\.\d+$/.test(String(pkg.version||'')))throw new Error(`Invalid package version ${pkg.version}`);
if(build.appVersion!==pkg.version)throw new Error(`build-info appVersion ${build.appVersion} does not match package version ${pkg.version}`);
if(pkg.devDependencies?.vite!=='8.2.0')throw new Error('Vite must be pinned for the Phase 1 cutover.');
if(pkg.devDependencies?.typescript!=='5.9.2')throw new Error('TypeScript must be pinned for the Phase 1 cutover.');
if(!app.includes("import './src/main.ts'"))throw new Error('web/app.js must delegate to the TypeScript/Vite entrypoint.');
if(!main.includes('loadLegacyRuntime')||!main.includes('installPhaseOneUi')||!main.includes('initializeLegacyEditor'))throw new Error('TypeScript main must own runtime load, editor initialization, and UI install.');
if(!main.includes(`appVersion:'${pkg.version}'`))throw new Error(`TypeScript fallback build info must match package version ${pkg.version}.`);
if(!runtime.includes('info.gitCommit?.slice(0,12)'))throw new Error('Runtime cache invalidation must include commit provenance, not version alone.');
if(!vite.includes("base:'/manga-blueprint-studio/'")||!vite.includes("cpSync(resolve(webRoot,'runtime')"))throw new Error('Vite Pages base/runtime copy contract missing.');

for(const token of ['phase1TemplateShell','phase1TemplateHeader','phase1-template-apply',"copy('テンプレートからページを作る'","byId('containerManager16')?.remove()"]){
  if(!workflow.includes(token))throw new Error(`Template workflow contract missing ${token}`);
}
for(const token of ["copy('手動でコマ割りを調整'",'phase1PageModes','ArrowRight','ArrowLeft','Home','End']){
  if(!pageModes.includes(token))throw new Error(`Page mode contract missing ${token}`);
}
for(const token of ['phase1PanelContentDisclosure','phase1PanelCameraDisclosure','phase1PanelFrameDisclosure']){
  if(!panelDisclosures.includes(token))throw new Error(`Panel disclosure contract missing ${token}`);
}
if(!ui.includes('EDITOR_RENDERED_EVENT')||!runtimeApi.includes("manga-blueprint:editor-rendered"))throw new Error('Phase 1 composition must refresh from the explicit editor-rendered event.');
if(ui.includes('MutationObserver')||workflow.includes('MutationObserver')||pageModes.includes('MutationObserver')||panelDisclosures.includes('MutationObserver')){
  throw new Error('Phase 1 UI must not use MutationObserver as a self-recomposition loop.');
}
if(main.includes('globalThis')||ui.includes('globalThis')||workflow.includes('globalThis'))throw new Error('Legacy global access must stay behind runtime/legacy-api.ts.');
for(const token of ['min-height:54px','bottom:74px','#containerManager16{display:none!important}','.template-cast-grid36 [hidden]{display:none!important}']){
  if(!css.includes(token))throw new Error(`Phase 1 responsive/touch contract missing ${token}`);
}

console.log(`Phase 1 TypeScript/Vite + modular template-first UX contract passed for ${pkg.version}.`);
