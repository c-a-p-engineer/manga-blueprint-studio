import fs from 'node:fs';

const read = path => fs.readFileSync(path,'utf8');
const required = [
  'AGENTS.md',
  'README.md',
  'docs/README.md',
  'docs/USER-GUIDE.md',
  'docs/PRODUCT.md',
  'docs/ARCHITECTURE.md',
  'docs/PROMPT_HANDOFF.md',
  'docs/ROADMAP.md',
  'docs/PROJECT-MULTI-PAGE-ROADMAP.md',
  'web/index.html',
  'web/editor.html',
  'web/landing.css',
  'web/guide.html',
  'web/guide.css',
  'web/layout-catalog.html',
  'web/runtime/README.md',
  'web/runtime/authoring/localization-export-hardening.js'
];
for(const path of required){
  if(!fs.existsSync(path)) throw new Error(`Missing documentation/user-guide file: ${path}`);
}

const build=JSON.parse(read('web/build-info.json'));
const version=String(build.appVersion||'').trim();
if(!/^\d+\.\d+\.\d+$/.test(version)) throw new Error(`Invalid appVersion: ${version}`);

const docs=Object.fromEntries(required.map(path=>[path,read(path)]));

function requirePhrase(path,phrase){
  if(!docs[path].includes(phrase)) throw new Error(`${path} missing current documentation contract: ${JSON.stringify(phrase)}`);
}
function rejectPhrase(path,phrase){
  if(docs[path].includes(phrase)) throw new Error(`${path} contains stale documentation wording: ${JSON.stringify(phrase)}`);
}

requirePhrase('README.md',`Current prototype: ${version}`);
requirePhrase('README.md','https://c-a-p-engineer.github.io/manga-blueprint-studio/');
requirePhrase('README.md','https://c-a-p-engineer.github.io/manga-blueprint-studio/editor.html');
requirePhrase('README.md','https://c-a-p-engineer.github.io/manga-blueprint-studio/guide.html');
requirePhrase('README.md','https://c-a-p-engineer.github.io/manga-blueprint-studio/layout-catalog.html');
requirePhrase('README.md','docs/USER-GUIDE.md');
requirePhrase('README.md','convex-quadrilateral');
requirePhrase('AGENTS.md','Documentation synchronization contract');
requirePhrase('AGENTS.md','Work Explorer / 作品エクスプローラー');
requirePhrase('AGENTS.md','P001');

requirePhrase('docs/README.md','ROADMAP.md');
requirePhrase('docs/README.md','Only status authority');
requirePhrase('docs/README.md','USER-GUIDE.md');
requirePhrase('docs/README.md','web/guide.html');

requirePhrase('docs/USER-GUIDE.md','Product page: https://c-a-p-engineer.github.io/manga-blueprint-studio/');
requirePhrase('docs/USER-GUIDE.md','Editor: https://c-a-p-engineer.github.io/manga-blueprint-studio/editor.html');
for(const phrase of ['P001','作品エクスプローラー','ページ設定','AI生成ZIP','Story Template','Smart Manga','斜め3コマ','四隅を直接編集','衝撃枠','集中線','演出なし']){
  requirePhrase('docs/USER-GUIDE.md',phrase);
  requirePhrase('web/guide.html',phrase);
}
requirePhrase('docs/USER-GUIDE.md','two rows');
requirePhrase('web/guide.html','2段ヘッダー');
requirePhrase('docs/USER-GUIDE.md','Current export is **the selected page only**.');
for(const phrase of ['Layout Recipe Bank','コマ割りカタログ','@layout-seed','@layout-mutation']) requirePhrase('docs/USER-GUIDE.md',phrase);
for(const phrase of ['Recipe Bank','コマ割りカタログ','layout-catalog.html']) requirePhrase('web/guide.html',phrase);
requirePhrase('web/guide.html','選択中の1ページ');
requirePhrase('web/guide.html','./guide.css');
requirePhrase('web/guide.html','href="./"');
requirePhrase('web/guide.html','href="./editor.html"');

for(const phrase of ['漫画の「どう見せたいか」','href="./editor.html"','href="./guide.html"','href="./layout-catalog.html"','選択中の1ページ単位']){
  requirePhrase('web/index.html',phrase);
}
rejectPhrase('web/index.html','id="blueprintSvg"');
requirePhrase('web/editor.html','id="blueprintSvg"');
requirePhrase('web/editor.html','src="./app.js"');

for(const phrase of ['Manga-first editor shell','Work Explorer / 作品エクスプローラー','Page settings / ページ設定','P001','selected-page scoped','Panel shape','Layout Recipe Bank','public shareable Layout Catalog','two explicit rows','presentation quick filters','2人表示 + 集中線']){
  requirePhrase('docs/PRODUCT.md',phrase);
}
rejectPhrase('docs/PRODUCT.md','The Page tab must support:');

for(const phrase of ['ui/editor-shell.js','P001','web/guide.html','selected-page scoped','authoring/panel-geometry.js','ui/mobile-header.js','Panel.shape','layout-recipe-api.js','layout-catalog.html']) requirePhrase('docs/ARCHITECTURE.md',phrase);
for(const phrase of ['selected-page','manga-blueprint-export-manifest/3','TEXT TO RENDER','AI generation ZIP','quadrilateral']) requirePhrase('docs/PROMPT_HANDOFF.md',phrase);

requirePhrase('docs/ROADMAP.md',`Production baseline — ${version}`);
requirePhrase('docs/ROADMAP.md','This file is the delivery/status authority.');
requirePhrase('docs/ROADMAP.md','## Post-backlog roadmap');
requirePhrase('docs/ROADMAP.md','### 0.21 — Web/Core convergence hardening');

requirePhrase('docs/PROJECT-MULTI-PAGE-ROADMAP.md','manga-blueprint/0.2');
requirePhrase('docs/PROJECT-MULTI-PAGE-ROADMAP.md','ROADMAP.md');
rejectPhrase('docs/PROJECT-MULTI-PAGE-ROADMAP.md','"format": "manga-blueprint/next"');

requirePhrase('web/runtime/README.md','ui/editor-shell.js');
requirePhrase('web/runtime/README.md','web/guide.html');
requirePhrase('web/runtime/README.md','integration/layout-recipe-api.js');
requirePhrase('web/runtime/authoring/localization-export-hardening.js','./guide.html');
requirePhrase('web/runtime/authoring/localization-export-hardening.js','詳しい使い方を別画面で開く');
for(const phrase of ['コマ割りカタログ','panelCount','mutation','layout-catalog']) requirePhrase('web/layout-catalog.html',phrase);

if(!fs.existsSync(`docs/PROTOTYPE-${version}.md`)) throw new Error(`Missing current release note docs/PROTOTYPE-${version}.md`);
const release=read(`docs/PROTOTYPE-${version}.md`);
for(const phrase of [`Prototype ${version}`,'docs/USER-GUIDE.md','/guide.html','Documentation']){
  if(!release.includes(phrase)) throw new Error(`Current release note missing ${JSON.stringify(phrase)}`);
}

console.log(`Documentation/user-guide synchronization passed for Prototype ${version}.`);
