import{createEvaluationReport}from'./blueprint-evaluator.mjs';

export const OBSERVATION_REQUEST_SCHEMA='manga-blueprint-observation-request/1';
export const OBSERVATION_SCHEMA='manga-blueprint-observation/1';
export const OBSERVATION_EVALUATION_SCHEMA='manga-blueprint-observation-evaluation/1';
export const DEFAULT_OBSERVABLES=['panel-geometry','character-occupancy','pose-joints','contacts','reading-direction','writing-mode','visible-text'];
const finite=n=>n!==null&&n!==''&&Number.isFinite(Number(n)),clamp=n=>Math.max(0,Math.min(1,n)),text=v=>String(v??'').trim(),confidence=v=>finite(v)?clamp(Number(v)):null;

function targetPage(project,pageIndex=0){
  const page=project.pages?.[pageIndex];
  if(!page)throw new Error(`Unknown page index ${pageIndex}`);
  return page;
}

function mapper(project,raw){
  const width=Number(project.meta?.pageWidth)||1200,height=Number(project.meta?.pageHeight)||1697,space=raw.coordinateSpace||'normalized';
  let sx=1,sy=1;
  if(space==='normalized'){sx=width;sy=height}
  else if(space==='pixels'){
    const cw=Number(raw.canvas?.width),ch=Number(raw.canvas?.height);
    if(!(cw>0&&ch>0))throw new Error('Pixel observations require canvas.width and canvas.height');
    sx=width/cw;sy=height/ch;
  }else if(space!=='project')throw new Error(`Unsupported observation coordinateSpace: ${space}`);
  return{
    point:p=>p&&finite(p.x)&&finite(p.y)?{x:Number(p.x)*sx,y:Number(p.y)*sy}:null,
    rect:r=>r&&finite(r.x)&&finite(r.y)&&finite(r.w)&&finite(r.h)&&Number(r.w)>0&&Number(r.h)>0?{x:Number(r.x)*sx,y:Number(r.y)*sy,w:Number(r.w)*sx,h:Number(r.h)*sy}:null
  };
}

function matchPanel(page,rawPanel,index){
  return page.panels.find(p=>p.id===(rawPanel.panelId||rawPanel.id))
    ||page.panels.find(p=>p.order===rawPanel.order)
    ||page.panels[index]
    ||null;
}

function normalizeCharacter(rawCharacter,index,map){
  const occupancy=map.rect(rawCharacter.occupancy||rawCharacter.rect),anchor=map.point(rawCharacter.anchor);
  const joints=Object.fromEntries(Object.entries(rawCharacter.joints||{}).map(([k,v])=>[k,map.point(v)]).filter(([,v])=>v));
  const x=anchor?.x??(occupancy?occupancy.x+occupancy.w/2:undefined),y=anchor?.y??(occupancy?occupancy.y+occupancy.h/2:undefined);
  const out={
    id:rawCharacter.id||`observed-character-${index+1}`,
    characterId:rawCharacter.characterId||'',
    name:rawCharacter.name||'',
    referenceKey:rawCharacter.referenceKey||'',
    observedOccupancy:occupancy||undefined,
    observedAnchor:anchor||undefined,
    observationConfidence:confidence(rawCharacter.confidence)
  };
  if(Number.isFinite(x))out.x=x;
  if(Number.isFinite(y))out.y=y;
  if(finite(rawCharacter.scale))out.scale=Number(rawCharacter.scale);
  if(Object.keys(joints).length)out.renderPose={joints};
  return out;
}

function normalizePanel(page,rawPanel,index,map){
  const expected=matchPanel(page,rawPanel,index),rect=map.rect(rawPanel.rect);
  if(!rect)throw new Error(`Observation panel ${index+1} is missing a valid rect`);
  const characters=(rawPanel.characters||[]).map((c,ci)=>normalizeCharacter(c,ci,map));
  const renderContacts=(rawPanel.contacts||[]).map(c=>{const point=map.point(c.point||c);return point?{...point,...(confidence(c.confidence)!=null?{confidence:confidence(c.confidence)}:{})}:null}).filter(Boolean);
  const reservedRegions=(rawPanel.reservedRegions||[]).map(map.rect).filter(Boolean);
  const lettering=(rawPanel.lettering||[]).map((entry,li)=>({
    kind:entry.kind||'unknown',
    text:text(entry.text),
    writingMode:entry.writingMode||null,
    rect:map.rect(entry.rect)||undefined,
    confidence:confidence(entry.confidence),
    index:li
  }));
  return{
    id:rawPanel.panelId||rawPanel.id||`observed-panel-${index+1}`,
    order:Number(rawPanel.order||index+1),
    rect,
    characters,
    renderContacts,
    reservedRegions,
    attention:rawPanel.attention||undefined,
    flow:rawPanel.flow||undefined,
    observedLettering:lettering,
    observationConfidence:confidence(rawPanel.confidence)
  };
}

function expectedTextEntries(project,page){
  const defaultMode=project.meta?.defaultWritingMode||'vertical-rl',entries=[];
  for(const panel of [...(page.panels||[])].sort((a,b)=>(a.order||0)-(b.order||0))){
    for(const balloon of panel.balloons||[]){
      const value=text(balloon.text);
      if(value)entries.push({
        panelId:panel.id,
        kind:'dialogue',
        text:value,
        writingMode:balloon.writingMode&&balloon.writingMode!=='inherit'?balloon.writingMode:defaultMode
      });
    }
    const sfx=text(panel.effects?.sfxText);
    if(sfx)entries.push({
      panelId:panel.id,
      kind:'sfx',
      text:sfx,
      writingMode:panel.effects?.sfxWritingMode&&panel.effects.sfxWritingMode!=='inherit'?panel.effects.sfxWritingMode:defaultMode
    });
  }
  return entries;
}

function observedTextEntries(observedPage){
  return [...(observedPage.panels||[])]
    .sort((a,b)=>(a.order||0)-(b.order||0))
    .flatMap(panel=>(panel.observedLettering||[]).map(x=>({...x,panelId:panel.id})));
}

function ratio(observed,expected){return expected>0?clamp(observed/expected):null;}
function confidenceSummary(raw,observedPage){
  const values=[];
  const add=v=>{const x=confidence(v);if(x!=null)values.push(x);};
  add(raw.source?.confidence);
  for(const panel of observedPage.panels||[]){
    add(panel.observationConfidence);
    for(const character of panel.characters||[])add(character.observationConfidence);
    for(const lettering of panel.observedLettering||[])add(lettering.confidence);
    for(const contact of panel.renderContacts||[])add(contact.confidence);
  }
  return{
    provided:values.length,
    mean:values.length?values.reduce((a,b)=>a+b,0)/values.length:null,
    minimum:values.length?Math.min(...values):null
  };
}


function sameCharacter(expected,observed){
  return observed&&(
    observed.id===expected.id
    ||observed.characterId&&observed.characterId===expected.characterId
    ||expected.referenceKey&&observed.referenceKey===expected.referenceKey
    ||expected.name&&observed.name===expected.name
  );
}

function computeCoverage(project,page,observedPage,raw,observables){
  const expectedPanels=page.panels?.length||0,observedPanels=observedPage.panels?.length||0;
  const expectedCharacters=(page.panels||[]).reduce((n,p)=>n+(p.characters?.length||0),0);
  let observedCharacters=0,expectedPose=0,observedPose=0;
  for(const expectedPanel of page.panels||[]){
    const observedPanel=(observedPage.panels||[]).find(p=>p.id===expectedPanel.id)
      ||(observedPage.panels||[]).find(p=>p.order===expectedPanel.order);
    for(const expectedCharacter of expectedPanel.characters||[]){
      const observedCharacter=(observedPanel?.characters||[]).find(c=>sameCharacter(expectedCharacter,c));
      if(observedCharacter)observedCharacters++;
      if(expectedCharacter.renderPose?.joints){
        expectedPose++;
        if(observedCharacter?.renderPose?.joints&&Object.keys(observedCharacter.renderPose.joints).length)observedPose++;
      }
    }
  }
  const expectedContacts=(page.panels||[]).reduce((n,p)=>n+(p.renderContacts?.length||0),0);
  const observedContacts=(observedPage.panels||[]).reduce((n,p)=>n+(p.renderContacts?.length||0),0);
  const expectedText=expectedTextEntries(project,page).length,observedText=observedTextEntries(observedPage).filter(x=>x.text).length;
  const byObservable={
    'panel-geometry':ratio(observedPanels,expectedPanels),
    'character-occupancy':ratio(observedCharacters,expectedCharacters),
    'pose-joints':ratio(observedPose,expectedPose),
    'contacts':ratio(observedContacts,expectedContacts),
    'reading-direction':raw.readingDirection?1:0,
    'writing-mode':raw.defaultWritingMode?1:0,
    'visible-text':ratio(observedText,expectedText)
  };
  const active=observables.map(x=>byObservable[x]).filter(x=>x!=null);
  return{
    requested:[...observables],
    byObservable,
    overall:active.length?active.reduce((a,b)=>a+b,0)/active.length:0,
    counts:{
      expectedPanels,observedPanels,
      expectedCharacters,observedCharacters,
      expectedPose,observedPose,
      expectedContacts,observedContacts,
      expectedText,observedText
    }
  };
}

export function createObservationRequest({project,pageIndex=0,generatedAsset=null,observables=DEFAULT_OBSERVABLES}={}){
  const page=targetPage(project,pageIndex);
  return{
    schema:OBSERVATION_REQUEST_SCHEMA,
    pageId:page.id,
    pageIndex,
    sourceAsset:generatedAsset,
    coordinateSpace:'normalized',
    observables:[...observables],
    expectedPanelCount:page.panels?.length||0,
    candidateCharacters:(project.characterLibrary||[]).map(c=>({characterId:c.characterId,name:c.name,referenceKey:c.referenceKey||''})),
    constraints:{observeRenderedImageOnly:true,doNotCopyExpectedGeometry:true,omitUncertainFields:true}
  };
}

export function normalizeObservation(project,raw,{pageIndex=0,observables=raw?.observables||DEFAULT_OBSERVABLES}={}){
  if(!raw||typeof raw!=='object')throw new Error('Observation must be an object');
  if(raw.schema&&raw.schema!==OBSERVATION_SCHEMA)throw new Error(`Unsupported observation schema: ${raw.schema}`);
  const page=targetPage(project,pageIndex),map=mapper(project,raw);
  const panels=(raw.panels||[]).map((p,i)=>normalizePanel(page,p,i,map));
  const observedPage={id:raw.pageId||page.id,pageNumber:page.pageNumber,order:page.order,panels};
  const observedProject={
    format:project.format||'manga-blueprint/0.2',
    meta:{
      title:`Observation: ${project.meta?.title||''}`,
      pageWidth:Number(project.meta?.pageWidth)||1200,
      pageHeight:Number(project.meta?.pageHeight)||1697,
      ...(raw.readingDirection?{readingDirection:raw.readingDirection}:{}),
      ...(raw.defaultWritingMode?{defaultWritingMode:raw.defaultWritingMode}:{})
    },
    pages:[observedPage]
  };
  return{
    schema:OBSERVATION_SCHEMA,
    pageId:page.id,
    source:raw.source||{kind:'manual'},
    coordinateSpace:'project',
    project:observedProject,
    coverage:computeCoverage(project,page,observedPage,raw,observables),
    confidence:confidenceSummary(raw,observedPage)
  };
}

function characterKey(c){return c.id||c.characterId||c.referenceKey||c.name||'';}

export function createObservationDiagnostics(project,normalized,{pageIndex=0}={}){
  const page=targetPage(project,pageIndex),observedPage=normalized.project.pages?.[0],diagnostics=[];
  const push=(code,severity,subject,evidence,suggestedAction)=>diagnostics.push({code,severity,subject,evidence,suggestedAction});
  if(normalized.confidence?.mean!=null&&normalized.confidence.mean<.6)push(
    'observation-low-confidence','review',`page:${page.id}`,
    {mean:normalized.confidence.mean,minimum:normalized.confidence.minimum,provided:normalized.confidence.provided},
    'human-review-observation'
  );
  if((observedPage?.panels?.length||0)!==(page.panels?.length||0))push(
    'panel-count-mismatch','error',`page:${page.id}`,
    {expected:page.panels?.length||0,observed:observedPage?.panels?.length||0},
    'preserve-panel-count'
  );
  const observedReading=normalized.project.meta?.readingDirection;
  if(observedReading&&project.meta?.readingDirection&&observedReading!==project.meta.readingDirection)push(
    'reading-direction-drift','error',`page:${page.id}`,
    {expected:project.meta.readingDirection,observed:observedReading},
    'preserve-reading-direction'
  );
  const observedWriting=normalized.project.meta?.defaultWritingMode;
  if(observedWriting&&project.meta?.defaultWritingMode&&observedWriting!==project.meta.defaultWritingMode)push(
    'writing-mode-drift','error',`page:${page.id}`,
    {expected:project.meta.defaultWritingMode,observed:observedWriting},
    'force-writing-mode'
  );
  for(const expectedPanel of page.panels||[]){
    const observedPanel=(observedPage?.panels||[]).find(p=>p.id===expectedPanel.id)||(observedPage?.panels||[]).find(p=>p.order===expectedPanel.order);
    if(!observedPanel)continue;
    for(const expectedCharacter of expectedPanel.characters||[]){
      const found=(observedPanel.characters||[]).some(c=>
        c.id===expectedCharacter.id
        ||c.characterId===expectedCharacter.characterId
        ||expectedCharacter.referenceKey&&c.referenceKey===expectedCharacter.referenceKey
        ||expectedCharacter.name&&c.name===expectedCharacter.name
      );
      if(!found)push(
        'character-missing','error',`panel:${expectedPanel.id}`,
        {character:characterKey(expectedCharacter)},
        'preserve-cast'
      );
    }
  }
  const expectedText=expectedTextEntries(project,page),observedText=observedTextEntries(observedPage||{panels:[]}),max=Math.max(expectedText.length,observedText.length);
  for(let i=0;i<max;i++){
    const e=expectedText[i],o=observedText[i];
    if(e&&!o){
      push('visible-text-missing','error',`page:${page.id}`,{expected:e.text,index:i},'render-exact-text-or-typeset');
      continue;
    }
    if(!e&&o){
      push('visible-text-unexpected','error',`page:${page.id}`,{observed:o.text,index:i},'remove-unallowlisted-text');
      continue;
    }
    if(e&&o&&e.text!==o.text)push(
      'visible-text-mismatch','error',`page:${page.id}`,
      {expected:e.text,observed:o.text,index:i},
      'render-exact-text-or-typeset'
    );
    if(e&&o&&o.writingMode&&e.writingMode!==o.writingMode)push(
      'lettering-writing-mode-drift','error',`page:${page.id}`,
      {expected:e.writingMode,observed:o.writingMode,text:e.text,index:i},
      'force-writing-mode'
    );
  }
  return diagnostics;
}

export function evaluateObservedGeneration(project,raw,{pageIndex=0,observables=raw?.observables||DEFAULT_OBSERVABLES}={}){
  const normalized=normalizeObservation(project,raw,{pageIndex,observables});
  const diagnostics=createObservationDiagnostics(project,normalized,{pageIndex});
  const report=createEvaluationReport(project,normalized.project,{
    source:normalized.source?.kind||'observation',
    pageIds:[normalized.pageId]
  });
  const structural=report.result.verdict,hasError=diagnostics.some(x=>x.severity==='error');
  const verdict=hasError||structural==='drift'
    ?'drift'
    :structural==='review'||diagnostics.length||normalized.coverage.overall<1
      ?'review'
      :'good';
  return{
    schema:OBSERVATION_EVALUATION_SCHEMA,
    pageId:normalized.pageId,
    source:normalized.source,
    coverage:normalized.coverage,
    confidence:normalized.confidence,
    diagnostics,
    structural:report,
    verdict
  };
}
