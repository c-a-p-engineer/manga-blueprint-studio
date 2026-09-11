import fs from 'node:fs';

const read=path=>fs.readFileSync(path,'utf8');
const json=path=>JSON.parse(read(path));
const pkg=json('package.json');
const build=json('web/build-info.json');
const app=read('web/app.js');
const main=read('web/src/main.ts');
const runtime=read('web/src/legacy-runtime.ts');
const ui=read('web/src/phase-one-ui.ts');
const css=read('web/src/phase-one-ui.css');
const vite=read('vite.config.ts');

if(pkg.version!=='0.17.0')throw new Error(`Expected package version 0.17.0, got ${pkg.version}`);
if(build.appVersion!=='0.17.0')throw new Error(`Expected build-info appVersion 0.17.0, got ${build.appVersion}`);
if(pkg.devDependencies?.vite!=='8.2.0')throw new Error('Vite must be pinned for the Phase 1 cutover.');
if(pkg.devDependencies?.typescript!=='5.9.2')throw new Error('TypeScript must be pinned for the Phase 1 cutover.');
if(!app.includes("import './src/main.ts'"))throw new Error('web/app.js must be a thin Vite entry shim.');
if(!main.includes('loadLegacyRuntime')||!main.includes('installPhaseOneUi'))throw new Error('TypeScript main must own runtime load and Phase 1 UI install.');
if(!runtime.includes('info.gitCommit?.slice(0,12)'))throw new Error('Runtime cache invalidation must include commit provenance, not version alone.');
if(!vite.includes("base:'/manga-blueprint-studio/'")||!vite.includes("cpSync(resolve(webRoot,'runtime')"))throw new Error('Vite Pages base/runtime copy contract missing.');
for(const token of [
  'phase1TemplateShell',
  'phase1TemplateHeader',
  'phase1-template-apply',
  "copy('テンプレートからページを作る'",
  "copy('手動でコマ割りを調整'",
  "byId('containerManager16')?.remove()",
  "closest('#applyStoryTemplate11')",
  'setTextIfChanged',
  'pagePanelObserver?.takeRecords()',
  'pagePanelObserver=new MutationObserver(queueCompose)'
])if(!ui.includes(token))throw new Error(`Phase 1 UI contract missing ${token}`);
for(const token of ['min-height:54px','bottom:74px','#containerManager16{display:none!important}'])if(!css.includes(token))throw new Error(`Phase 1 responsive/touch contract missing ${token}`);

console.log('Phase 1 TypeScript/Vite + template-first UX contract passed.');
