import fs from 'node:fs';

const app=fs.readFileSync('web/app-15.js','utf8');
const schema=JSON.parse(fs.readFileSync('schema/manga-blueprint.schema.json','utf8'));
const bootstrap=fs.readFileSync('web/app.js','utf8');

const must=[
  "defaultWritingMode='vertical-rl'",
  "writingMode='inherit'",
  "vertical-rl",
  "horizontal-tb",
  'LETTERING DIRECTION:',
  'writing direction controls lettering layout only',
  'balloonWritingMode15',
  'defaultWritingMode15'
];
for(const token of must){if(!app.includes(token))throw new Error(`writing-direction contract missing: ${token}`);}
if(!bootstrap.includes("'./app-15.js'"))throw new Error('app-15.js is not loaded by bootstrap');

const metaMode=schema.properties?.meta?.properties?.defaultWritingMode?.enum||[];
if(!metaMode.includes('vertical-rl')||!metaMode.includes('horizontal-tb'))throw new Error('schema meta.defaultWritingMode enum incomplete');
const balloonMode=schema.$defs?.balloon?.properties?.writingMode?.enum||[];
for(const value of ['inherit','vertical-rl','horizontal-tb'])if(!balloonMode.includes(value))throw new Error(`schema balloon.writingMode missing ${value}`);

console.log('Writing direction contract validation passed.');
