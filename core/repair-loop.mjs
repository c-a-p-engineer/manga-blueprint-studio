// Iterative repair v1: diagnostics -> bounded proposal -> explicit approval -> regeneration context.
const clone=value=>structuredClone(value);
const idFor=(diagnostic,index)=>`repair-${String(index+1).padStart(3,'0')}-${diagnostic.code||diagnostic.type||'review'}`;

function actionFor(diagnostic,index){
  const code=diagnostic.code||diagnostic.type||'review';
  const base={id:idFor(diagnostic,index),diagnostic:code,subject:diagnostic.subject||'',evidence:clone(diagnostic.evidence||{}),preserve:['panel-geometry','story-action','character-identity','unrelated-text']};
  if(code==='reading-direction-drift')return{...base,kind:'render-constraint',change:{readingDirection:diagnostic.evidence?.expected},reason:'Restore authored page reading direction.'};
  if(code==='writing-mode-drift'||code==='lettering-writing-mode-drift')return{...base,kind:'lettering',change:{writingMode:diagnostic.evidence?.expected},reason:'Use deterministic authored writing mode.'};
  if(code==='visible-text-mismatch'||code==='visible-text-missing'||code==='visible-text-unexpected')return{...base,kind:'lettering',change:{strategy:'deterministic-overlay'},reason:'Replace unreliable generated lettering with exact authored text.'};
  if(code==='panel-count-mismatch')return{...base,kind:'render-constraint',change:{preservePanelGeometry:true},reason:'Regenerate while preserving exact panel topology.'};
  if(code==='character-missing')return{...base,kind:'render-constraint',change:{preserveCast:true,character:diagnostic.evidence?.character||''},reason:'Restore authored cast without rewriting other panels.'};
  if(code==='pose-balance'||code==='excessive-backward-lean'||code==='joint-range'||code==='panel-overflow'||code==='heavy-overlap')return{...base,kind:'semantic-review',change:{target:'pose-or-composition'},reason:'Review only the affected pose/composition before bounded re-solve.'};
  return{...base,kind:'review',change:{target:'diagnostic-subject'},reason:'No safe automatic semantic mutation is defined for this diagnostic.'};
}

export function createRepairPlan(project,evaluation,{pageIndex=0}={}){
  const page=project.pages?.[pageIndex];
  if(!page)throw new Error(`Unknown page index ${pageIndex}`);
  const diagnostics=[...(evaluation?.diagnostics||[])];
  for(const panel of page.panels||[])for(const d of panel.renderDiagnostics||[])diagnostics.push({
    code:d.type,
    subject:`panel:${panel.id}`,
    evidence:{...d}
  });
  const actions=diagnostics.map(actionFor);
  return{
    schema:'manga-blueprint-repair-plan/1',
    pageId:page.id,
    sourceEvaluation:evaluation?.schema||null,
    actions,
    requiresHumanApproval:actions.length>0,
    canonicalMutation:false
  };
}

export function approveRepairPlan(plan,approvedActionIds=[]){
  if(plan?.schema!=='manga-blueprint-repair-plan/1')throw new Error('Unknown repair plan schema');
  const approved=new Set(approvedActionIds);
  const actions=(plan.actions||[]).filter(action=>approved.has(action.id));
  return{
    schema:'manga-blueprint-repair-approval/1',
    pageId:plan.pageId,
    approvedActionIds:actions.map(x=>x.id),
    actions:clone(actions),
    canonicalMutation:false
  };
}

export function buildRepairContext(approval){
  if(approval?.schema!=='manga-blueprint-repair-approval/1')throw new Error('Repair approval is required');
  const constraints={},lettering={strategy:null,writingModes:[]},reviews=[];
  for(const action of approval.actions||[]){
    if(action.kind==='render-constraint')Object.assign(constraints,action.change||{});
    else if(action.kind==='lettering'){
      if(action.change?.strategy)lettering.strategy=action.change.strategy;
      if(action.change?.writingMode)lettering.writingModes.push({subject:action.subject,writingMode:action.change.writingMode});
    }else reviews.push({id:action.id,subject:action.subject,change:action.change,reason:action.reason});
  }
  return{
    schema:'manga-blueprint-repair-context/1',
    pageId:approval.pageId,
    approvedActionIds:[...(approval.approvedActionIds||[])],
    constraints,
    lettering,
    reviews,
    canonicalMutation:false
  };
}

export function applyApprovedSemanticPatch(project,{approved=false,changes=[]}={}){
  if(!approved)throw new Error('Explicit human approval is required before canonical semantic mutation');
  const next=clone(project),allowed=new Set(['poseId','detailLevel','placementLocked']);
  for(const change of changes){
    if(!allowed.has(change.field))throw new Error(`Unsupported semantic repair field: ${change.field}`);
    const page=next.pages?.find(p=>p.id===change.pageId),panel=page?.panels?.find(p=>p.id===change.panelId);
    const character=panel?.characters?.find(c=>c.id===change.characterId||c.characterId===change.characterId);
    if(!character)throw new Error('Semantic repair target not found');
    character[change.field]=change.value;
  }
  return next;
}
