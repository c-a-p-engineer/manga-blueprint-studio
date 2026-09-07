import fs from 'node:fs';

const requiredFiles = [
  'AGENTS.md',
  'README.md',
  'docs/PRODUCT.md',
  'docs/ARCHITECTURE.md',
  'docs/PROMPT_HANDOFF.md',
  'schema/manga-blueprint.schema.json',
  'examples/action-3panel.manga.json',
  'web/index.html',
  'web/styles.css',
  'web/app.js',
  '.github/workflows/pages.yml'
];

for (const file of requiredFiles) {
  if (!fs.existsSync(file)) throw new Error(`Missing required file: ${file}`);
}

const schema = JSON.parse(fs.readFileSync('schema/manga-blueprint.schema.json', 'utf8'));
const example = JSON.parse(fs.readFileSync('examples/action-3panel.manga.json', 'utf8'));
if (schema.title !== 'Manga Blueprint') throw new Error('Unexpected schema title');
if (example.format !== 'manga-blueprint/0.1') throw new Error('Unexpected example format');
if (!Array.isArray(example.pages) || example.pages.length === 0) throw new Error('Example requires at least one page');

const distances = new Set(['long', 'medium', 'close', 'extreme-close']);
const angles = new Set(['eye-level', 'low-angle', 'high-angle', 'over-shoulder']);
for (const page of example.pages) {
  const orders = new Set();
  const ids = new Set();
  for (const panel of page.panels) {
    if (orders.has(panel.order)) throw new Error(`Duplicate panel order: ${panel.order}`);
    if (ids.has(panel.id)) throw new Error(`Duplicate panel id: ${panel.id}`);
    orders.add(panel.order); ids.add(panel.id);
    if (!distances.has(panel.camera?.distance)) throw new Error(`Invalid camera distance in ${panel.id}`);
    if (!angles.has(panel.camera?.angle)) throw new Error(`Invalid camera angle in ${panel.id}`);
    if (!(panel.rect?.w > 0 && panel.rect?.h > 0)) throw new Error(`Invalid rect in ${panel.id}`);
    for (const ch of panel.characters ?? []) {
      if (!ch.id || !ch.characterId || !ch.name || !ch.poseId) throw new Error(`Invalid character in ${panel.id}`);
      if (!(ch.scale > 0)) throw new Error(`Invalid character scale in ${panel.id}`);
    }
  }
}

const html = fs.readFileSync('web/index.html', 'utf8');
for (const id of ['blueprintSvg','addCharacter','poseSelect','promptOutput','exportPng','exportJson','importJson']) {
  if (!html.includes(`id="${id}"`)) throw new Error(`Missing required UI control: ${id}`);
}

console.log('Repository structure and blueprint fixture validation passed.');
