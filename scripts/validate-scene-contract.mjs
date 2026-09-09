import fs from 'node:fs';
import {runtimePaths, readRuntime} from './runtime-paths.mjs';

const app=readRuntime('sceneContract');
const fallback=readRuntime('castFallback');
const bootstrap=fs.readFileSync('web/app.js','utf8');

const sceneSrc=`./${runtimePaths.sceneContract.slice('web/'.length)}`;
const fallbackSrc=`./${runtimePaths.castFallback.slice('web/'.length)}`;
const required = [
  sceneSrc,
  "quickStatus22",
  "sceneTemplateContract",
  "outputConstraints",
  "SCENE / CAST CONTRACT:",
  "Do not replace a specified character with a different person",
  "Dialogue text is exact content to render",
  "off-panel-target",
  "storyAffectionDaily",
  "storyTeaseBlush",
  "storyFaceClose",
  "storyAfterSchoolTwo",
  "storyPamper",
  "storyForeheadTouch",
  "storySurpriseHug",
  "storyShoulderLean",
  "classroomTalk",
  "speakerRole='partner'",
  "minimumDialogueBeats:4",
  "recommended:2",
  "templateBadges22",
  "renderQuickStatus22"
];

for (const needle of required) {
  const source = needle === sceneSrc ? bootstrap : app;
  if (!source.includes(needle)) throw new Error(`Prototype 0.12 contract missing: ${needle}`);
}

const fallbackRequired = [
  fallbackSrc,
  'sceneInfoBase23',
  '(scene.cast?.recommended||1)>1',
  "presentation:'one-visible-offscreen'",
  'offPanelPartner:true',
  'guideCastFallback'
];
for (const needle of fallbackRequired) {
  const source = needle === fallbackSrc ? bootstrap : fallback;
  if (!source.includes(needle)) throw new Error(`Prototype 0.12.1 cast fallback missing: ${needle}`);
}

const affectionateTemplates = ['affectionDaily','teaseBlush','faceClose','afterSchoolTwo','pamper','foreheadTouch','surpriseHug','shoulderLean'];
for (const id of affectionateTemplates) {
  if (!app.includes(`${id}:{`)) throw new Error(`Affection template missing: ${id}`);
}

if (!app.includes("scene?.offPanelPartner&&x.gaze==='other-character'")) {
  throw new Error('Template apply must normalize other-character gaze to off-panel-target when the partner is off-panel.');
}
if (!app.includes("art.colorMode==='auto'")) throw new Error('Quick status must visibly flag unspecified color mode.');
if (!app.includes("art.renderStyle==='auto'")) throw new Error('Quick status must visibly flag unspecified render style.');

console.log('Prototype 0.12.1 scene-contract / quick-status / cast-fallback validation passed.');
