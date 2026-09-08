import fs from 'node:fs';

const app=fs.readFileSync('web/app-17.js','utf8');
const bootstrap=fs.readFileSync('web/app.js','utf8');
const schema=JSON.parse(fs.readFileSync('schema/manga-blueprint.schema.json','utf8'));

if(!bootstrap.includes("'./app-17.js'"))throw new Error('app-17.js is not loaded by bootstrap');

for(const token of [
  'ensureSfxWritingState17',
  'sfxWritingMode17',
  "['inherit','vertical-rl','horizontal-tb']",
  'effectiveSfxWritingMode17',
  'SFX LETTERING DIRECTION:',
  'manifest.lettering.onomatopoeia=',
  'templateThumb13=function',
  'previewOrder08(rects)',
  'applyTemplateReadingAware17',
  'const ordered=readingOrderedPanels16(page)',
  'const beat=tpl.beats[i]',
  "panel.effects.sfxWritingMode='inherit'"
])if(!app.includes(token))throw new Error(`Prototype 0.10 integration contract missing: ${token}`);

const modes=schema.$defs?.effects?.properties?.sfxWritingMode?.enum||[];
for(const mode of ['inherit','vertical-rl','horizontal-tb'])if(!modes.includes(mode))throw new Error(`schema effects.sfxWritingMode missing ${mode}`);

console.log('Prototype 0.10 lettering + reading-order integration validation passed.');
