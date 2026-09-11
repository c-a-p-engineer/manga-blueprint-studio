import fs from 'node:fs';
import {runtimePaths, readRuntime} from './runtime-paths.mjs';

const app=fs.readFileSync('web/app.js','utf8');
const source=readRuntime('templateDiscoveryPresentation');

for(const token of [
  "templateFilterDiagonal35:'斜めコマ'",
  "templateFilterImpactBorder35:'衝撃枠'",
  "templateFilterBorderless35:'枠無し'",
  "templateFilterInset35:'小窓'",
  "templateFilterFocus35:'集中線'",
  "templateFilterSpeed35:'スピード線'",
  "templateFilterImpact35:'衝撃線'",
  "templateFilterTension35:'緊張線'",
  "templateFilterSilence35:'無音・間'",
  "templateFilterBreakout35:'ブチ抜き'",
  "Object.assign(activeTemplateFilters27,{geometry:'all',border:'all',effect:'all',breakout:'all'})",
  "setLayout('decisiveBlow','diagonal3')",
  "setLayout('counterattack','diagonal4')",
  "setBeat('decisiveBlow',-1,{border:'impact'})",
  "setBeat('characterIntro',-1,{border:'borderless'})",
  "setBeat('smugFail',2,{border:'inset'})",
  "setBeat('presenceBehind',1,{lineEffect:'tension'})",
  "setBeat('smugFail',-1,{lineEffect:'silence'})",
  'function templatePresentationFeatures35',
  'presentationSearchTerms35',
  'templateMatches13=function',
  'templateMatchesQuick27=function',
  "quickFilterButton27('border','impact'",
  "quickFilterButton27('effect','focus'",
  "quickFilterButton27('breakout','any'",
  'template-presentation-chip35',
  'templatePanelSpecs34(tpl,pageSize04())',
  'template-thumb-shape35',
  "select?.closest('label')",
  'label.hidden=true',
  "apply.dataset.i18n='templateApplySelected35'"
])if(!source.includes(token))throw new Error(`template discovery/presentation contract missing: ${token}`);

const runtimePath=runtimePaths.templateDiscoveryPresentation;
if(runtimePath!=='web/runtime/templates/discovery-presentation.js')throw new Error('template discovery runtime path is not canonical');
if(!app.includes("['templates/discovery-presentation', './runtime/templates/discovery-presentation.js']"))throw new Error('bootstrap must load template discovery after presentation support');

console.log('Story Template discovery presentation filters + duplicate-selector removal validation passed.');
