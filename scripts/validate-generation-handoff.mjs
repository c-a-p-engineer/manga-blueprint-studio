import assert from 'node:assert/strict';
import {validateGenerationHandoff} from '../core/generation-handoff-preflight.mjs';

// Synthetic fixtures only; production works live in manga-blueprint-works.
function fixture(){
  const project={
    format:'manga-blueprint/0.2',
    meta:{title:'Fixed Story — Not Moon/Observatory',readingDirection:'rtl'},
    pages:[1,2].map(n=>({id:'page-'+n,pageNumber:n,panels:[{id:'panel-'+n,actionIntent:'Beat '+n}]}))
  };
  const manifest={
    format:'manga-blueprint-name-package/2',project:'work.manga.json',source:'name.dsl.md',
    pages:[1,2].map(n=>({pageId:'page-'+n,pageNumber:n,cleanBlueprint:'P00'+n+'.clean.svg',prompt:'P00'+n+'.prompt.md'})),
    characters:[{token:'heroine',identityMode:'description',needsRefinement:true}],
    contactSheet:{batches:[{range:'001-002',startPage:1,endPage:2,pageCount:2,
      clean:'contact-sheet.001-002.clean.svg',blueprint:'contact-sheet.001-002.blueprint.svg',
      prompt:'contact-sheet.001-002.prompt.md',review:'contact-sheet.001-002.review.json',
      generation:'contact-sheet.001-002.generation.json',png:null}]}
  };
  const generation={
    schema:'manga-contact-sheet-generation-package/1',ready:true,bindings:{missing:[]},
    inputs:{contactSheetAsset:'contact-sheet.001-002.clean.svg',
      promptAsset:'contact-sheet.001-002.prompt.md',reviewAsset:'contact-sheet.001-002.review.json',
      pageCleanAssets:['P001.clean.svg','P002.clean.svg'],
      pagePromptAssets:['P001.prompt.md','P002.prompt.md'],references:[]},
    constraints:{preserveInternalReadingDirection:'rtl',finalAcceptance:false},
    layout:{pageCount:2}
  };
  const pageGeneration={
    schema:'manga-generation-package/1',ready:true,bindings:{missing:[]},
    request:{pageId:'page-1',inputs:{cleanAsset:'P001.clean.svg',prompt:'P001.prompt.md',
      letteringAsset:'P001.lettering.svg',letteringPlan:'P001.lettering.json',references:[]},
      constraints:{preserveReadingDirection:'rtl'}}
  };
  const assets={};
  const svg='<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1697"></svg>';
  for(const name of ['P001.clean.svg','P002.clean.svg','contact-sheet.001-002.clean.svg','P001.lettering.svg'])assets[name]={exists:true,text:svg,validImage:true};
  assets['P001.lettering.json']={exists:true,text:'{"entries":[]}'};
  assets['work.manga.json']={exists:true,text:JSON.stringify(project)};
  const title='Work: '+project.meta.title+'\n';
  for(const n of [1,2])assets['P00'+n+'.prompt.md']={exists:true,text:'# Generation\n'+title+'Page: P00'+n+'\n## TEXT TO RENDER\n- (none)\n## Panel 1\nACTION: Beat '+n};
  assets['contact-sheet.001-002.prompt.md']={exists:true,text:'# Batch\n'+title+'## TEXT TO RENDER\n# ===== P001 =====\n# ===== P002 =====\n'};
  assets['contact-sheet.001-002.review.json']={exists:true,text:JSON.stringify({pageCells:[{code:'P001'},{code:'P002'}]})};
  const readAsset=name=>assets[name]||{exists:false};
  return {project,manifest,generation,pageGeneration,assets,readAsset};
}
const contact={kind:'contact-sheet',range:'001-002'};
const page={kind:'page',pageNumber:1};
let cases=0;
function check(name,apply,expectedStatus,expectedCode){
  const f=fixture();
  if(apply)apply(f);
  const generation= name.startsWith('page-') ? f.pageGeneration : f.generation;
  const target= name.startsWith('page-') ? page : contact;
  const result=validateGenerationHandoff({...f,generation,target});
  assert.equal(result.status,expectedStatus,name+': '+JSON.stringify(result.errors));
  assert.equal(result.readyForModel,false,'Never claim the model received the reference image');
  if(expectedCode)assert(result.errors.some(e=>e.code===expectedCode),name+': code '+expectedCode);
  cases++;
  return result;
}
const ready=check('contact-valid',null,'prepared-not-attached');
assert(ready.files.some(f=>f.path==='contact-sheet.001-002.clean.svg'));
assert(ready.warnings.some(w=>w.code==='identity-needs-refinement'));
check('page-valid',null,'prepared-not-attached');
check('contact-missing-prompt',f=>{delete f.assets['contact-sheet.001-002.prompt.md']},'blocked','missing-asset');
check('contact-wrong-work',f=>{f.assets['P002.prompt.md'].text=f.assets['P002.prompt.md'].text.replace('Fixed Story — Not Moon/Observatory','Astronomy')},'blocked','wrong-work-prompt');
check('contact-mismatched-order',f=>{f.generation.inputs.pageCleanAssets.reverse()},'blocked','sheet-page-visual-order');
check('contact-missing-image',f=>{delete f.assets['contact-sheet.001-002.clean.svg']},'blocked','missing-asset');
check('contact-annotated',f=>{f.generation.inputs.contactSheetAsset='contact-sheet.001-002.blueprint.svg'},'blocked','sheet-spatial-mismatch');
check('contact-unready',f=>{f.generation.ready=false},'blocked','unready-package');
check('contact-bad-review',f=>{f.assets['contact-sheet.001-002.review.json'].text=JSON.stringify({pageCells:[{code:'P002'},{code:'P001'}]})},'blocked','sheet-review-order');
check('contact-bad-title',f=>{f.project.meta.title='Other title'},'blocked','wrong-work-prompt');
check('contact-raster-mismatch',f=>{f.assets['contact-sheet.001-002.clean.svg'].validImage=false},'blocked','invalid-visual-bytes');
check('contact-bad-batch-size',f=>{f.manifest.contactSheet.batches[0].pageCount=9},'blocked','batch-page-count');
check('contact-bad-panel',f=>{f.assets['P001.prompt.md'].text=f.assets['P001.prompt.md'].text.replace('## Panel 1','## Panel 7')+'\n## Panel 2'},'blocked','panel-brief-mismatch');
check('page-mismatched-id',f=>{f.pageGeneration.request.pageId='wrong'},'blocked','page-package-identity');
check('page-wrong-text',f=>{f.assets['P001.prompt.md'].text=f.assets['P001.prompt.md'].text.replace('## TEXT TO RENDER','## OTHER')},'blocked','missing-text-allowlist');
check('page-missing-lettering',f=>{delete f.assets['P001.lettering.svg']},'blocked','missing-asset');
check('page-unsafe-asset',f=>{f.pageGeneration.request.inputs.cleanAsset='../P001.clean.svg'},'blocked','page-clean-mismatch');
check('page-reading-mismatch',f=>{f.pageGeneration.request.constraints.preserveReadingDirection='ltr'},'blocked','reading-mismatch');
console.log('Generation handoff preflight checks passed: '+cases);
