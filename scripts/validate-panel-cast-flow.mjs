import {runtimePaths, readRuntime} from './runtime-paths.mjs';

const app=readRuntime('panelCastFlow');
if(runtimePaths.panelCastFlow!=='web/runtime/templates/panel-cast-flow.js')throw new Error('Panel-cast-flow runtime owner is not registered');

for(const phrase of [
  "templatePanelCastFlow28:'コマごとの登場'",
  "templatePanelCastFlow28:'Cast by panel'",
  'templateBeatCast28',
  'templateCastCounts26(id)',
  'Array.isArray(beat.actors27)',
  "beat.speakerRole==='partner'",
  "role:'primary',visible:true",
  "role:'partner',visible:partnerVisible",
  'templateActorChip28',
  'template-panel-cast28',
  'template-panel-number28',
  'renderTemplatePreview13=function()'
])if(!app.includes(phrase))throw new Error(`Missing per-panel cast visibility contract: ${phrase}`);

if(!app.includes('シーン全体の「想定登場」と、各コマで実際に見える人数は別です。'))throw new Error('Japanese help must separate scene-wide cast from per-panel visibility');
if(!app.includes('Scene-wide expected cast and the number actually visible in each panel are different concepts.'))throw new Error('English help must separate scene-wide cast from per-panel visibility');
if(!app.includes("t(actor.visible?'templateVisible28':'templateOffPanel28')"))throw new Error('Panel cast flow must distinguish visible and off-panel actors');
if(!app.includes("actor.speaking?` · ${t('templateSpeaking28')}`:''"))throw new Error('Panel cast flow must identify the speaking role');

console.log('Prototype 0.12.6 per-panel cast visibility validation passed.');
