// Narrative/semantic gate complements (never replaces) the spatial Structural Evaluator.
// This validates *independent observations*; it never infers what an image contains from the expected Name.
export function evaluateNarrativeEvidence(project, observation, {pageNumbers=null,scope='rough'}={}){
  const errors=[],warnings=[],pageResults=[];
  const fail=(code,detail)=>errors.push({code,detail});
  const warn=(code,detail)=>warnings.push({code,detail});
  const canonical=(project?.pages||[]);
  const selected=pageNumbers===null?canonical:canonical.filter(p=>pageNumbers.includes(p.pageNumber));
  if(!['rough','page'].includes(scope))fail('scope','Expected scope rough or page');
  if(!selected.length)fail('pages','No canonical pages matched the requested review range');
  if(!observation || observation.schema!=='manga-generation-narrative-observation/1'){
    fail('observation','Independent generated-image observation is required');
  }
  if(!observation?.source?.generatedAsset || !['vision','manual-image','hybrid'].includes(observation?.source?.kind)
      || observation?.source?.imageInspected!==true)
    fail('uninspected-image','Reviewer must identify the *generated* image and attest that it was visually inspected');
  const provided=Array.isArray(observation?.pages)?observation.pages:[];
  const numbers=provided.map(p=>p.pageNumber);
  if(new Set(numbers).size!==numbers.length)fail('duplicate-pages','Observed page numbers cannot repeat');
  if(provided.some(p=>!selected.some(s=>s.pageNumber===p.pageNumber)))
    fail('unexpected-pages','Review contains pages outside the requested scope');
  for(const page of selected){
    const o=provided.find(p=>p.pageNumber===page.pageNumber);
    const anchors=Array.isArray(o?.anchors)?o.anchors:[];
    const expected=Array.isArray(page.panels)?page.panels:[];
    const expectedOrders=new Set(expected.map(p=>p.order));
    const mismatch=anchors.filter(a=>a.verdict==='mismatch'&&typeof a.observedDescription==='string'&&a.observedDescription.trim());
    const invalid=anchors.filter(a=>!expectedOrders.has(a.panelOrder)||!['match','mismatch','uncertain'].includes(a.verdict));
    const noEvidence=anchors.filter(a=>typeof a.observedDescription!=='string'||!a.observedDescription.trim());
    if(invalid.length)fail('anchor-schema','P'+page.pageNumber+' has invalid/unknown panel observations');
    if(noEvidence.length)warn('unsubstantiated-anchor','P'+page.pageNumber+' has verdict(s) without observed visual descriptions');
    const observedOrders=new Set(anchors.filter(a=>expectedOrders.has(a.panelOrder)&&a.observedDescription?.trim()).map(a=>a.panelOrder));
    const missing=scope==='page'?
      expected.filter(p=>!observedOrders.has(p.order)).length:
      (observedOrders.size===0?1:0);
    if(missing)warn('missing-story-anchors','P'+page.pageNumber+' has '+missing+' required narrative observation(s) missing');
    const verdict=mismatch.length?'repair':invalid.length?'review':noEvidence.length?'review':missing?'unverified':
      anchors.some(a=>a.verdict==='uncertain')?'review':anchors.length?'story-consistent':'unverified';
    pageResults.push({pageNumber:page.pageNumber,verdict,observedAnchors:anchors.length,expectedPanels:expected.length,mismatches:mismatch.map(a=>({panelOrder:a.panelOrder,observedDescription:a.observedDescription}))});
  }
  const result=errors.length?'unverified':pageResults.some(p=>p.verdict==='repair')?'repair':
    pageResults.some(p=>p.verdict==='unverified')?'unverified':
    pageResults.some(p=>p.verdict==='review')?'review':'story-consistent';
  return {
    schema:'manga-generation-narrative-review/1',
    scope,
    status:result,
    finalAcceptance:false,
    notes:'An LLM/manual verdict does not prove semantic correctness; preserve observed evidence and separately run structural/lettering and human review.',
    issues:[...errors,...warnings],
    pages:pageResults
  };
}
