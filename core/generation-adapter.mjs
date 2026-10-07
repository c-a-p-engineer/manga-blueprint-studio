// Provider-neutral generation boundary. Canonical state never stores provider request IDs.
export function generationIdentityAuthority(project){
  const modes=new Set((project.characterLibrary||[]).map(c=>c.identityMode||'description'));
  const hasSheet=modes.has('sheet');
  const hasProjectGuidance=[...modes].some(mode=>mode==='description'||mode==='free');
  if(hasSheet&&hasProjectGuidance)return'project+references';
  if(hasSheet)return'references';
  return'project-character-guidance';
}

export function createGenerationRequest({
  project,
  pageIndex=0,
  cleanAsset,
  prompt,
  referenceAssets=[],
  repairContext=null,
  letteringAsset=null,
  letteringPlan=null
}){
  const page=project.pages[pageIndex];
  if(!page)throw new Error('Unknown page');
  return{
    schema:'manga-generation-request/1',
    pageId:page.id,
    authority:{
      spatial:'clean',
      semantic:'project',
      identity:generationIdentityAuthority(project),
      lettering:letteringAsset?'deterministic-overlay':'visible-text-allowlist'
    },
    inputs:{
      cleanAsset,
      prompt,
      references:referenceAssets.map(r=>({referenceKey:r.referenceKey,asset:r.asset,role:r.role||'identity'})),
      ...(letteringAsset?{letteringAsset}:{}),
      ...(letteringPlan?{letteringPlan}:{})
    },
    constraints:{
      preservePanelGeometry:true,
      preserveReadingDirection:project.meta.readingDirection,
      preserveWritingMode:project.meta.defaultWritingMode||'vertical-rl',
      preserveVisibleText:true,
      letteringStrategy:project.meta.letteringStrategy||'overlay-preferred',
      ...(repairContext?.constraints||{})
    },
    ...(repairContext?{repairContext}:{})
  };
}

export function createGenerationResult(request,{provider='external',model=null,outputAsset=null,providerRequestId=null,metadata={}}={}){
  return{
    schema:'manga-generation-result/1',
    requestSchema:request.schema,
    provider,
    model,
    outputAsset,
    provenance:{providerRequestId,createdAt:new Date().toISOString(),metadata}
  };
}

export function validateReferenceBindings(project,assets=[]){
  const keys=new Set(assets.map(a=>a.referenceKey));
  const required=[...new Set((project.characterLibrary||[]).filter(c=>c.identityMode==='sheet').map(c=>c.referenceKey).filter(Boolean))];
  return{required,missing:required.filter(k=>!keys.has(k)),bound:required.filter(k=>keys.has(k))};
}

export function buildPortableGenerationPackage({
  project,
  pageIndex=0,
  cleanAsset,
  prompt,
  referenceAssets=[],
  repairContext=null,
  letteringAsset=null,
  letteringPlan=null
}){
  const bindings=validateReferenceBindings(project,referenceAssets);
  const request=createGenerationRequest({project,pageIndex,cleanAsset,prompt,referenceAssets,repairContext,letteringAsset,letteringPlan});
  return{
    schema:'manga-generation-package/1',
    request,
    bindings,
    ready:bindings.missing.length===0,
    providerAdapter:{mode:'external-boundary',canonicalStateProviderIndependent:true},
    capabilities:{
      repairContext:!!repairContext,
      deterministicLettering:!!letteringAsset
    }
  };
}
