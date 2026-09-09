import fs from 'node:fs';

const app = fs.readFileSync('web/app.js','utf8');
const feature = fs.readFileSync('web/app-26.js','utf8');

const required = [
  "'./app-26.js'",
  'templateExpectedCast26',
  'templateVisibleOffscreen26',
  'templateCastContractOffscreen26',
  'castContract26',
  'templateBadges22=function',
  'renderTemplateCastContract26',
  "scene.presentation==='one-visible-offscreen'",
  'scene.offPanelPartner'
];

for (const token of required) {
  const source = token === "'./app-26.js'" ? app : feature;
  if (!source.includes(token)) throw new Error(`Missing template cast clarity contract: ${token}`);
}

if (!feature.includes('想定{count}人') || !feature.includes('{visible}人表示＋画面外{offscreen}人')) {
  throw new Error('Japanese template cards must distinguish expected cast from visible/off-panel cast.');
}
if (!feature.includes('{count} expected') || !feature.includes('{visible} visible + {offscreen} off-panel')) {
  throw new Error('English template cards must distinguish expected cast from visible/off-panel cast.');
}
if (/project\s*=|project\.|mutate\s*\(/.test(feature)) {
  throw new Error('Template cast clarity UI must remain authoring-only and must not mutate project state.');
}

console.log('Template cast clarity contract OK');
