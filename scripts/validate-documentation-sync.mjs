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
  'web/guide.html',
  'web/guide.css',
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
requirePhrase('README.md','https://c-a-p-engineer.github.io/manga-blueprint-studio/guide.html');
requirePhrase('README.md','docs/USER-GUIDE.md');
requirePhrase('AGENTS.md','Documentation synchronization contract');
requirePhrase('AGENTS.md','Work Structure / 作品構成');
requirePhrase('AGENTS.md','P001');

requirePhrase('docs/README.md','ROADMAP.md');
requirePhrase('docs/README.md','Only status authority');
requirePhrase('docs/README.md','USER-GUIDE.md');
requirePhrase('docs/README.md','web/guide.html');

for(const phrase of ['P001','作品構成','ページ設定','AI生成ZIP','Story Template','Smart Manga']){
  requirePhrase('docs/USER-GUIDE.md',phrase);
  requirePhrase('web/guide.html',phrase);
}
requirePhrase('docs/USER-GUIDE.md','Current export is **the selected page only**.');
requirePhrase('web/guide.html','選択中の1ページ');
requirePhrase('web/guide.html','./guide.css');
requirePhrase('web/guide.html','href="./"');

for(const phrase of ['Manga-first editor shell','Work Structure / 作品構成','Page settings / ページ設定','P001','selected-page scoped']){
  requirePhrase('docs/PRODUCT.md',phrase);
}
rejectPhrase('docs/PRODUCT.md','The Page tab must support:');

for(const phrase of ['ui/editor-shell.js','P001','web/guide.html','selected-page scoped']) requirePhrase('docs/ARCHITECTURE.md',phrase);
for(const phrase of ['selected-page','manga-blueprint-export-manifest/3','TEXT TO RENDER','AI generation ZIP']) requirePhrase('docs/PROMPT_HANDOFF.md',phrase);

requirePhrase('docs/ROADMAP.md',`Shipped through Prototype ${version}`);
requirePhrase('docs/ROADMAP.md','Phase 3 — Backup / Restore — Next');
requirePhrase('docs/ROADMAP.md','only current status authority');

requirePhrase('docs/PROJECT-MULTI-PAGE-ROADMAP.md','manga-blueprint/0.2');
requirePhrase('docs/PROJECT-MULTI-PAGE-ROADMAP.md','ROADMAP.md');
rejectPhrase('docs/PROJECT-MULTI-PAGE-ROADMAP.md','"format": "manga-blueprint/next"');

requirePhrase('web/runtime/README.md','ui/editor-shell.js');
requirePhrase('web/runtime/README.md','web/guide.html');
requirePhrase('web/runtime/authoring/localization-export-hardening.js','./guide.html');
requirePhrase('web/runtime/authoring/localization-export-hardening.js','詳しい使い方を別画面で開く');

if(!fs.existsSync(`docs/PROTOTYPE-${version}.md`)) throw new Error(`Missing current release note docs/PROTOTYPE-${version}.md`);
const release=read(`docs/PROTOTYPE-${version}.md`);
for(const phrase of [`Prototype ${version}`,'docs/USER-GUIDE.md','/guide.html','documentation']){
  if(!release.includes(phrase)) throw new Error(`Current release note missing ${JSON.stringify(phrase)}`);
}

console.log(`Documentation/user-guide synchronization passed for Prototype ${version}.`);
