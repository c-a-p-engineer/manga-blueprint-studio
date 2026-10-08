import assert from 'node:assert/strict';
import {evaluateNarrativeEvidence} from '../core/generation-narrative-review.mjs';
const project={pages:[1,2].map(n=>({pageNumber:n,panels:[{order:1,actionIntent:'SCP-5031 confinement and compassionate testing '+n},{order:2,actionIntent:'Learning music and cooking '+n}]}))};
const good=()=>({
  schema:'manga-generation-narrative-observation/1',
  source:{kind:'vision',generatedAsset:'generations/contact-sheet.001-002.png',imageInspected:true},
  pages:[1,2].map(n=>({pageNumber:n,anchors:[{panelOrder:1,observedDescription:'研究者が5031の収容室を観察している',verdict:'match'}]}))
});
let count=0;
function check(name,input,opts,expected){
  const result=evaluateNarrativeEvidence(project,input,opts);
  assert.equal(result.status,expected,name+': '+JSON.stringify(result));
  assert.equal(result.finalAcceptance,false,name+' must never declare final acceptance');
  count++;return result;
}
check('rough-verified',good(),{scope:'rough'},'story-consistent');
check('page-all-panels-required',good(),{scope:'page',pageNumbers:[1]},'unverified');
const complete=good();
complete.pages[0].anchors.push({panelOrder:2,observedDescription:'SCP-5031は音楽を学ぶ',verdict:'match'});
check('page-story-complete',complete,{scope:'page',pageNumbers:[1]},'story-consistent');
const mismatch=good();
mismatch.pages[0].anchors[0]={panelOrder:1,observedDescription:'少女が謎の天文台で月の通信を調査している',verdict:'mismatch'};
const bad=check('wrong-story-regression',mismatch,{scope:'rough'},'repair');
assert(bad.pages.find(p=>p.pageNumber===1).mismatches.length===1,'must retain wrong-story evidence');
const noImage=good();noImage.source.imageInspected=false;
check('no-image-inspection',noImage,{scope:'rough'},'unverified');
const missing=good();missing.pages.splice(1);
check('missing-page-evidence',missing,{scope:'rough'},'unverified');
const unsure=good();unsure.pages[0].anchors[0].verdict='uncertain';
check('uncertain-story',unsure,{scope:'rough'},'review');
const emptyEvidence=good();emptyEvidence.pages[0].anchors[0].observedDescription='';
check('verdict-without-observed-description',emptyEvidence,{scope:'rough'},'review');
const extra=good();extra.pages.push({pageNumber:9,anchors:[]});
check('unknown-page',extra,{scope:'rough'},'unverified');
const noSource=good();delete noSource.source.generatedAsset;
check('missing-generated-asset',noSource,{scope:'rough'},'unverified');
console.log('Narrative review cases passed: '+count);
