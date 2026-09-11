import fs from 'node:fs';
import {runtimePaths, readRuntime} from './runtime-paths.mjs';

const app=fs.readFileSync('web/app.js','utf8');
const source=readRuntime('templateDiscoveryPresentation');
const studio=readRuntime('templateStudio');

for(const token of [
  "templateFilterWithEffects35:'演出あり'",
  "templateFilterPlain35:'演出なし'",
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
  "Object.assign(activeTemplateFilters27,{presentationFx:'all',geometry:'all',border:'all',effect:'all',breakout:'all'})",
  'function registerPresentationSampleTemplates35',
  'rushImpact35:{',
  "layout:'diagonal3'",
  'rapidExchange35:{',
  "layout:'diagonal4'",
  'shockReveal35:{',
  'uneasyApproach35:{',
  'quietAftermath35:{',
  'comicInset35:{',
  "setLayout('decisiveBlow','diagonal3')",
  "setLayout('counterattack','diagonal4')",
  "setBeat('decisiveBlow',-1,{border:'impact'})",
  "setBeat('characterIntro',-1,{border:'borderless'})",
  "setBeat('smugFail',2,{border:'inset'})",
  "setBeat('presenceBehind',1,{lineEffect:'tension'})",
  "setBeat('smugFail',-1,{lineEffect:'silence'})",
  "setBeat('twoVisibleStandoff27',1,{lineEffect:'focus'})",
  "setBeat('twoVisibleStandoff27',-1,{border:'impact'})",
  'function templatePresentationFeatures35',
  'function hasPresentationEffects35',
  'function matchesPresentationFilters35',
  "filters.presentationFx==='with'",
  "filters.presentationFx==='plain'",
  'presentationSearchTerms35',
  "terms.push('演出なし','no effects','plain')",
  'templateMatches13=function',
  'templateMatchesQuick27=function',
  "quickFilterButton27('presentationFx','with'",
  "quickFilterButton27('presentationFx','plain'",
  "quickFilterButton27('border','impact'",
  "quickFilterButton27('effect','focus'",
  "quickFilterButton27('breakout','any'",
  'function presentationSampleInventory35',
  'globalThis.templatePresentationSampleInventory35',
  'template-presentation-chip35',
  'templatePanelSpecs34(tpl,pageSize04())',
  'template-thumb-shape35',
  "select?.closest('label')",
  'label.hidden=true',
  "apply.dataset.i18n='templateApplySelected35'"
])if(!source.includes(token))throw new Error(`template discovery/presentation contract missing: ${token}`);

function occurrences(text,needle){return text.split(needle).length-1;}
const coverage=[
  ["border:'impact'",4,'impact-border examples'],
  ["border:'borderless'",3,'borderless examples'],
  ["border:'inset'",3,'inset examples'],
  ["lineEffect:'focus'",3,'focus-line examples'],
  ["lineEffect:'speed'",3,'speed-line examples'],
  ["lineEffect:'impact'",3,'impact-line examples'],
  ["lineEffect:'tension'",2,'tension-line examples'],
  ["lineEffect:'silence'",3,'silence examples']
];
for(const [needle,min,label] of coverage){
  const count=occurrences(source,needle);
  if(count<min)throw new Error(`${label} must have at least ${min} explicit samples; got ${count}`);
}

const breakoutCount=occurrences(`${studio}\n${source}`,"breakout:'");
if(breakoutCount<3)throw new Error(`breakout examples must have at least 3 samples; got ${breakoutCount}`);
if(!studio.includes('classroomTalk:{'))throw new Error('plain Story Template baseline must remain available for effect/no-effect comparison');

const runtimePath=runtimePaths.templateDiscoveryPresentation;
if(runtimePath!=='web/runtime/templates/discovery-presentation.js')throw new Error('template discovery runtime path is not canonical');
if(!app.includes("['templates/discovery-presentation', './runtime/templates/discovery-presentation.js']"))throw new Error('bootstrap must load template discovery after presentation support');

console.log('Story Template P1 catalog, presentation filters, sample coverage, combined-filter hooks, and duplicate-selector removal validation passed.');