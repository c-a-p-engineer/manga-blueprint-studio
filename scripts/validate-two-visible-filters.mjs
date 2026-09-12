import {runtimePaths, readRuntime} from './runtime-paths.mjs';

const app=readRuntime('twoVisible');
if(runtimePaths.twoVisible!=='web/runtime/templates/two-visible.js')throw new Error('Two-visible runtime owner is not registered');

for(const id of ['twoVisibleChat27','twoVisibleAffection27','twoVisibleGaze27','twoVisibleHug27','twoVisibleStandoff27']){
  if(!app.includes(id))throw new Error(`Missing two-visible template: ${id}`);
}
for(const phrase of [
  "visibleMode:'two-visible'",
  "presentation:'two-shot'",
  "offPanelPartner:false",
  'actors27',
  'speakerIndex27',
  'bases.length<2',
  "document.querySelector('.tab[data-tab=\"character\"]')",
  'makeActorInstance27',
  'panel.characters=actors.slice(0,2).map',
  'applyTemplateReadingAware17()'
])if(!app.includes(phrase))throw new Error(`Missing two-visible application contract: ${phrase}`);

for(const phrase of [
  'templateQuickFilters27',
  "quickFilterButton27('visible','1'",
  "quickFilterButton27('visible','2'",
  "quickFilterButton27('relationship','romance'",
  "quickFilterButton27('relationship','friends'",
  "quickFilterButton27('relationship','battle'",
  "quickFilterButton27('dialogue','high'",
  "quickFilterButton27('art','color'",
  "quickFilterButton27('art','mono'",
  'templateMatchesQuick27',
  'activeTemplateFilters27',
  'template-filter-chip27.active'
])if(!app.includes(phrase))throw new Error(`Missing quick-filter contract: ${phrase}`);

if(!app.includes('人表示（想定${c.expected}人）'))throw new Error('Japanese cast badge must distinguish visible count from expected cast');
if(!app.includes('visible (${c.expected} expected)'))throw new Error('English cast badge must distinguish visible count from expected cast');
if(!app.includes('ベースキャラクターを2人以上作成'))throw new Error('Japanese UI must explain the two-base requirement');
if(!app.includes('Create at least two base characters'))throw new Error('English UI must explain the two-base requirement');

console.log('Prototype 0.12.5 two-visible templates / quick filters validation passed.');
