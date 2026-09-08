import fs from 'node:fs';

const runtimeFiles = ['web/app-1.js','web/app-2.js','web/app-3.js','web/app-4.js'];
const requiredFiles = [
  'AGENTS.md','README.md','LICENSE',
  'docs/PRODUCT.md','docs/ARCHITECTURE.md','docs/PROMPT_HANDOFF.md','docs/ROADMAP.md',
  'schema/manga-blueprint.schema.json','examples/directed-closeup.manga.json',
  'web/index.html','web/styles.css','web/app.js',...runtimeFiles,
  '.github/workflows/pages.yml','.github/workflows/validate.yml'
];

for (const file of requiredFiles) {
  if (!fs.existsSync(file)) throw new Error(`Missing required file: ${file}`);
}

const schema = JSON.parse(fs.readFileSync('schema/manga-blueprint.schema.json','utf8'));
const example = JSON.parse(fs.readFileSync('examples/directed-closeup.manga.json','utf8'));
if (schema.title !== 'Manga Blueprint') throw new Error('Unexpected schema title');
if (schema.properties?.format?.const !== 'manga-blueprint/0.2') throw new Error('Schema must describe 0.2');
if (example.format !== 'manga-blueprint/0.2') throw new Error('Example must use 0.2');
if (!example.pages?.length) throw new Error('Example requires a page');

const html = fs.readFileSync('web/index.html','utf8');
const js = runtimeFiles.map(f=>fs.readFileSync(f,'utf8')).join('\n');
const bootstrap = fs.readFileSync('web/app.js','utf8');

for (const id of [
  'blueprintSvg','cameraHelp','backgroundLocation','borderStyle','bleedEdge','breakoutMode',
  'expressionType','gazeTarget','addBalloon','balloonText','lineEffect','sfxText',
  'exportAiPng','exportAnnotatedPng','promptOutput','exportJson','importJson'
]) {
  if (!html.includes(`id="${id}"`)) throw new Error(`Missing UI control: ${id}`);
}

for (const file of runtimeFiles) {
  if (!bootstrap.includes(file.split('/').pop())) throw new Error(`Bootstrap does not load ${file}`);
}

for (const phrase of [
  'STRICT TEXT RENDERING RULE:',
  'TEXT TO RENDER:',
  'blueprint-ai-clean.png',
  'exportPng(false)',
  'NEVER render character display names'
]) {
  if (!js.includes(phrase)) throw new Error(`Missing AI-safe handoff contract: ${phrase}`);
}

if (!js.includes("p.format='manga-blueprint/0.2'")) throw new Error('Missing legacy normalization');
if (!js.includes("'manga-blueprint-studio/0.1'")) throw new Error('Legacy 0.1 autosave compatibility missing');
if (!js.includes("renderSvg(false)")) throw new Error('Clean render path missing');

for (const page of example.pages) {
  const orders = new Set();
  for (const panel of page.panels) {
    if (orders.has(panel.order)) throw new Error(`Duplicate panel order ${panel.order}`);
    orders.add(panel.order);
    if (!panel.style || !panel.background || !panel.effects) throw new Error(`Missing 0.2 panel semantics: ${panel.id}`);
    if (!panel.camera?.viewpoint) throw new Error(`Missing camera viewpoint: ${panel.id}`);
    for (const ch of panel.characters ?? []) {
      if (!ch.expression || !ch.gaze) throw new Error(`Missing expression/gaze: ${ch.id}`);
    }
  }
}

console.log('Prototype 0.3 repository contract validation passed.');
