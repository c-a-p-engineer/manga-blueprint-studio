import assert from 'node:assert/strict';
import vm from 'node:vm';
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
  'hasActiveSemanticQuickFilters27',
  'templateMatchesQuick27',
  'activeTemplateFilters27',
  'template-filter-chip27.active'
])if(!app.includes(phrase))throw new Error(`Missing quick-filter contract: ${phrase}`);

function extractFunction(name){
  const marker=`function ${name}(`,start=app.indexOf(marker);
  if(start<0)throw new Error(`Missing function for behavioral validation: ${name}`);
  const bodyStart=app.indexOf('{',start);let depth=0;
  for(let i=bodyStart;i<app.length;i++){
    if(app[i]==='{')depth++;
    else if(app[i]==='}'&&--depth===0)return app.slice(start,i+1);
  }
  throw new Error(`Unterminated function for behavioral validation: ${name}`);
}

const quickFilterRuntime=`${extractFunction('hasActiveSemanticQuickFilters27')}\n${extractFunction('templateMatchesQuick27')}`;
function quickFilterResult(filters,cast){
  const sandbox={
    activeTemplateFilters27:{visible:'all',relationship:'all',dialogue:'all',art:'all',...filters},
    templateCastCounts26:()=>cast,
    result:null
  };
  vm.runInNewContext(`${quickFilterRuntime}\nresult=templateMatchesQuick27('sample');`,sandbox);
  return sandbox.result;
}

const romanceCast={visible:1,scene:{relationship:'romance',dialogueDensity:'medium',artHint:'both'}};
const friendsCast={visible:1,scene:{relationship:'friends',dialogueDensity:'high',artHint:'both'}};
const battleCast={visible:1,scene:{relationship:'battle',dialogueDensity:'low',artHint:'mono'}};
assert.equal(quickFilterResult({},null),true,'Templates without semantic metadata remain visible when semantic quick filters are inactive');
assert.equal(quickFilterResult({presentationFx:'with'},null),true,'Presentation-only filters must not be mistaken for semantic quick filters');
assert.equal(quickFilterResult({relationship:'romance'},null),false,'Unknown semantic metadata must not leak through the Romance filter');
assert.equal(quickFilterResult({relationship:'romance'},romanceCast),true,'Romance templates must pass the Romance filter');
assert.equal(quickFilterResult({relationship:'romance'},friendsCast),false,'Daily/friends templates must not pass the Romance filter');
assert.equal(quickFilterResult({relationship:'romance'},battleCast),false,'Battle templates must not pass the Romance filter');
assert.equal(quickFilterResult({visible:'2'},romanceCast),false,'One-visible templates must not pass the two-visible filter');
assert.equal(quickFilterResult({dialogue:'high'},friendsCast),true,'Dialogue-heavy templates must pass the dialogue filter');
assert.equal(quickFilterResult({art:'color'},battleCast),false,'Monochrome-only templates must not pass the color filter');

if(!app.includes('人表示（想定${c.expected}人）'))throw new Error('Japanese cast badge must distinguish visible count from expected cast');
if(!app.includes('visible (${c.expected} expected)'))throw new Error('English cast badge must distinguish visible count from expected cast');
if(!app.includes('ベースキャラクターを2人以上作成'))throw new Error('Japanese UI must explain the two-base requirement');
if(!app.includes('Create at least two base characters'))throw new Error('English UI must explain the two-base requirement');

console.log('Prototype 0.12.5 two-visible templates / quick filters behavioral validation passed.');
