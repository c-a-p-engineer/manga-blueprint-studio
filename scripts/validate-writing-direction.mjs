import fs from 'node:fs';
import {runtimePaths, readRuntime} from './runtime-paths.mjs';

const app=readRuntime('writingDirection');
const schema=JSON.parse(fs.readFileSync('schema/manga-blueprint.schema.json','utf8'));

const must=[
  "defaultWritingMode='vertical-rl'",
  "writingMode='inherit'",
  "vertical-rl",
  "horizontal-tb",
  'LETTERING DIRECTION:',
  'Writing direction controls lettering layout only',
  'balloonWritingMode15',
  'defaultWritingMode15',
  'manifest.lettering=letteringManifest15()',
  'manifest.panelOrder='
];
for(const token of must){if(!app.includes(token))throw new Error(`writing-direction contract missing: ${token}`);}
if(runtimePaths.writingDirection!=='web/runtime/lettering/writing-direction.js')throw new Error('Writing-direction runtime owner is not registered');

const metaMode=schema.properties?.meta?.properties?.defaultWritingMode?.enum||[];
if(!metaMode.includes('vertical-rl')||!metaMode.includes('horizontal-tb'))throw new Error('schema meta.defaultWritingMode enum incomplete');
const balloonMode=schema.$defs?.balloon?.properties?.writingMode?.enum||[];
for(const value of ['inherit','vertical-rl','horizontal-tb'])if(!balloonMode.includes(value))throw new Error(`schema balloon.writingMode missing ${value}`);

console.log('Writing direction contract validation passed.');
