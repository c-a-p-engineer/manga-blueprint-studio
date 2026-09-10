import fs from 'node:fs';

const file='web/runtime/handoff/render-brief.js';
const text=fs.readFileSync(file,'utf8');

const required=[
  "schema:'manga-blueprint-render-brief/2'",
  'referenceRoles:referenceRoles30()',
  'preservation:preservationContract30()',
  "role:'spatial-layout'",
  "role:'character-identity'",
  'doesNotControl',
  'PRESERVE EXACTLY:',
  'PRESERVE AS STRONG CONSTRAINTS:',
  'USE AS GUIDANCE, NOT PIXEL-EXACT ANATOMY:',
  'DO NOT INHERIT:',
  'DO NOT ADD:',
  'manifest.referenceRoles=referenceRoles30();',
  'manifest.preservationContract=preservationContract30();',
  "panelGeometryConstraint:'exact'",
  "characterSpatialRelationshipConstraint:'strong'",
  "stickFigureJointConstraint:'guidance-only'"
];
for(const token of required){
  if(!text.includes(token))throw new Error(`render brief contract missing: ${token}`);
}

const forbidden=[
  "schema:'manga-blueprint-render-brief/1'",
  'Character Sheet = SPATIAL LAYOUT'
];
for(const token of forbidden){
  if(text.includes(token))throw new Error(`stale/invalid render brief contract remains: ${token}`);
}

console.log('render brief validation passed');
