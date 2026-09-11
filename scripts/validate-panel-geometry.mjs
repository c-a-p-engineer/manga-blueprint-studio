import fs from 'node:fs';

const geometry=fs.readFileSync('web/runtime/authoring/panel-geometry.js','utf8');
const header=fs.readFileSync('web/runtime/ui/mobile-header.js','utf8');
const app=fs.readFileSync('web/app.js','utf8');
const schema=fs.readFileSync('schema/manga-blueprint.schema.json','utf8');

for(const token of [
  "kind:'quad'",
  'panelShapePoints33',
  'isConvexQuad33',
  'data-panel-corner33',
  "diagonal3:{ja:'斜め3コマ'",
  "diagonal4:{ja:'斜め4コマ 2×2'",
  "brief.panelGeometryModel='rect-or-convex-quad'"
])if(!geometry.includes(token))throw new Error(`panel geometry contract missing: ${token}`);

for(const token of [
  'grid-template-columns:repeat(4,minmax(0,1fr))',
  'white-space:nowrap',
  '.tagline{display:block!important'
])if(!header.includes(token))throw new Error(`mobile header contract missing: ${token}`);

for(const token of [
  './runtime/authoring/panel-geometry.js',
  './runtime/ui/mobile-header.js',
  '?v=${encodeURIComponent(runtimeVersion)}'
])if(!app.includes(token))throw new Error(`runtime/cache contract missing: ${token}`);

for(const token of ['"shape"','"quad"','"points"'])if(!schema.includes(token))throw new Error(`schema panel geometry missing: ${token}`);

console.log('Quadrilateral panel geometry + two-row mobile header validation passed.');
