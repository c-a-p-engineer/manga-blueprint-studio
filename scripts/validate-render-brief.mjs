import fs from 'node:fs';

const file='web/runtime/handoff/render-brief.js';
const text=fs.readFileSync(file,'utf8');

const required=[
  "schema:'manga-blueprint-render-brief/2'",
  'referenceRoles:referenceRoles30()',
  'preservation:preservationContract30()',
  'designDirection:designDirectionPass32(ordered)',
  "schema:'manga-blueprint-design-direction-pass/1'",
  "authority:'derived-guidance-only'",
  "role:'spatial-layout'",
  "role:'character-identity'",
  'doesNotControl',
  'PRESERVE EXACTLY:',
  'PRESERVE AS STRONG CONSTRAINTS:',
  'USE AS GUIDANCE, NOT PIXEL-EXACT ANATOMY:',
  'DO NOT INHERIT:',
  'DO NOT ADD:',
  'DESIGN DIRECTION PASS — DERIVED GUIDANCE ONLY:',
  'micro-composition-inside-existing-panel-boundaries',
  'do-not-fill-intentional-negative-space-with-decoration',
  'manifest.referenceRoles=referenceRoles30();',
  'manifest.preservationContract=preservationContract30();',
  'manifest.designDirectionPass=designDirectionPass32();',
  "deriveVisualHierarchyBeforeRendering:true",
  "designDirectionCannotOverrideAuthoredStructure:true",
  "preserveIntentionalNegativeSpace:true",
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

console.log('render brief + design direction validation passed');
