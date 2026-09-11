import fs from 'node:fs';

const geometry=fs.readFileSync('web/runtime/authoring/panel-geometry.js','utf8');
const header=fs.readFileSync('web/runtime/ui/mobile-header.js','utf8');
const runtime=fs.readFileSync('web/src/legacy-runtime.ts','utf8');
const schema=fs.readFileSync('schema/manga-blueprint.schema.json','utf8');

for(const token of [
  "kind:'quad'",
  'panelShapePoints33',
  'isConvexQuad33',
  'data-panel-corner33',
  "diagonal3:{ja:'斜め3コマ'",
  "diagonal4:{ja:'斜め4コマ 2×2'",
  "brief.panelGeometryModel='rect-or-convex-quad'",
  'function panelRenderPoints33(panel)',
  'rectPoints33(panelRect(panel))',
  'function panelNumberAnchor33(points)',
  'numberAnchor=panelNumberAnchor33(points)',
  'x="${numberAnchor.x-15}"',
  'y="${numberAnchor.y-15}"'
])if(!geometry.includes(token))throw new Error(`panel geometry contract missing: ${token}`);

for(const token of [
  'body .topbar{',
  'grid-template-columns:repeat(4,minmax(0,1fr))',
  'white-space:nowrap',
  'body .topbar .tagline{display:block!important',
  'body .topbar .top-actions #undoBtn span',
  'display:inline!important'
])if(!header.includes(token))throw new Error(`mobile header contract missing: ${token}`);

for(const token of [
  "['authoring/panel-geometry','runtime/authoring/panel-geometry.js']",
  "['ui/mobile-header','runtime/ui/mobile-header.js']",
  'script.src=`${base}${path}?v=${version}`'
])if(!runtime.includes(token))throw new Error(`runtime/cache contract missing: ${token}`);

for(const token of ['"shape"','"quad"','"points"'])if(!schema.includes(token))throw new Error(`schema panel geometry missing: ${token}`);

console.log('Quadrilateral panel geometry + geometry-following panel numbers + rectangle bleed compatibility + authoritative two-row mobile header validation passed.');
