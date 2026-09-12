import {runtimePaths, readRuntime} from './runtime-paths.mjs';

const app=readRuntime('castSemantics');
if(runtimePaths.castSemantics!=='web/runtime/templates/cast-semantics.js')throw new Error('Cast-semantics runtime owner is not registered');

for(const phrase of [
  "templateExpectedCast26:'想定登場'",
  "templateVisibleCast26:'同時表示'",
  "templateOffPanelCast26:'画面外相手'",
  'templateCastCounts26',
  "scene.presentation==='one-visible-offscreen'",
  'templateCastSummary26',
  '想定${c.expected}人（表示${c.visible}＋画面外${c.offPanel}）',
  'expected (${c.visible} visible + ${c.offPanel} off-panel)',
  'template-cast-badge26',
  'renderTemplatePreview13=function()'
])if(!app.includes(phrase))throw new Error(`Missing explicit template-cast meaning contract: ${phrase}`);

if(!app.includes('テンプレートカードの人数は「シーン全体で想定する主要キャラ数」です。'))throw new Error('Japanese help must explain expected cast semantics');
if(!app.includes('The cast count on a template card is the scene-wide expected main cast'))throw new Error('English help must explain expected cast semantics');

console.log('Prototype 0.12.4 template cast meaning validation passed.');
