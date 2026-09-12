import fs from 'node:fs';
import {runtimePaths, readRuntime} from './runtime-paths.mjs';

const read = path => fs.readFileSync(path, 'utf8');
const art = readRuntime('artDirectionReadiness');
const spatial = readRuntime('spatialSemantics');
const schema = JSON.parse(read('schema/manga-blueprint.schema.json'));

if(runtimePaths.artDirectionReadiness!=='web/runtime/handoff/art-direction-readiness.js')throw new Error('Art-direction runtime owner is not registered');
if(runtimePaths.spatialSemantics!=='web/runtime/handoff/spatial-semantics.js')throw new Error('Spatial-semantics runtime owner is not registered');

for (const phrase of [
  'ART DIRECTION (GLOBAL):',
  'artDirection18',
  'colorAnime',
  'monoManga',
  'pencil',
  'watercolor',
  'cinematic',
  'Generation readiness',
  'readinessIdentityEmpty',
  'usedBaseCharacters09'
]) {
  if (!art.includes(phrase)) throw new Error(`Missing Prototype 0.11 art-direction contract: ${phrase}`);
}

for (const phrase of [
  "'airborne-approach'",
  "'dive-attack'",
  "'aerial-punch'",
  'supportState',
  'motionPhase',
  'depthTarget',
  'foreshortening',
  'sceneId',
  'continuityFrom',
  'depth-foreground19',
  "storyTemplates11.aerialAttack",
  "beats[1].pose='dive-attack'",
  "beats[2].pose='aerial-punch'",
  'POSE / DEPTH / SCENE CONTINUITY:'
]) {
  if (!spatial.includes(phrase)) throw new Error(`Missing Prototype 0.11 spatial contract: ${phrase}`);
}

const artDef = schema.$defs?.artDirection;
if (!artDef) throw new Error('Schema missing artDirection');
for (const value of ['color','monochrome','grayscale','limited']) {
  if (!artDef.properties?.colorMode?.enum?.includes(value)) throw new Error(`Schema missing art color mode ${value}`);
}
for (const value of ['anime','manga','pencil','ink','watercolor','webtoon','realistic','sketch']) {
  if (!artDef.properties?.renderStyle?.enum?.includes(value)) throw new Error(`Schema missing render style ${value}`);
}
for (const value of ['auto','right-hand','left-hand','right-foot','left-foot','face','prop','none']) {
  if (!schema.$defs?.camera?.properties?.depthTarget?.enum?.includes(value)) throw new Error(`Schema missing depthTarget ${value}`);
}
for (const value of ['auto','grounded','airborne','supported','unknown']) {
  if (!schema.$defs?.characterInstance?.properties?.supportState?.enum?.includes(value)) throw new Error(`Schema missing supportState ${value}`);
}
for (const field of ['sceneId','continuityFrom','anchorNotes']) {
  if (schema.$defs?.background?.properties?.[field]?.type !== 'string') throw new Error(`Schema missing background.${field}`);
}

if (!schema.properties?.meta?.properties?.artDirection) throw new Error('meta.artDirection missing');
if (schema.$defs?.baseCharacter?.properties?.artDirection) throw new Error('Art direction must remain separate from character identity');

console.log('Prototype 0.11 art-direction / spatial-semantics contract passed.');
