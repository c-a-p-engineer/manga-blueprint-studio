import fs from 'node:fs';
import {runtimePaths, readRuntime} from './runtime-paths.mjs';

const app=readRuntime('templateLetteringOrder');
const bootstrap=fs.readFileSync('web/src/legacy-runtime.ts','utf8');
const schema=JSON.parse(fs.readFileSync('schema/manga-blueprint.schema.json','utf8'));

const src=runtimePaths.templateLetteringOrder.slice('web/'.length);
if(!bootstrap.includes(`'${src}'`))throw new Error(`Template/lettering integration runtime is not loaded by TypeScript bootstrap: ${src}`);

for(const token of [
  'ensureSfxWritingState17',
  'sfxWritingMode17',
  "['inherit','vertical-rl','horizontal-tb']",
  'effectiveSfxWritingMode17',
  'SFX LETTERING DIRECTION:',
  'manifest.lettering.onomatopoeia=',
  'templateThumb13=function',
  'const logicalRects=templateRects13(tpl,pageSize04())',
  'order=previewOrder08(logicalRects)',
  'applyTemplateReadingAware17',
  'const ordered=readingOrderedPanels16(page)',
  'const beat=tpl.beats[i]',
  "panel.effects.sfxWritingMode='inherit'"
])if(!app.includes(token))throw new Error(`Prototype 0.10 integration contract missing: ${token}`);

const modes=schema.$defs?.effects?.properties?.sfxWritingMode?.enum||[];
for(const mode of ['inherit','vertical-rl','horizontal-tb'])if(!modes.includes(mode))throw new Error(`schema effects.sfxWritingMode missing ${mode}`);

console.log('Prototype 0.10 lettering + reading-order integration validation passed.');
