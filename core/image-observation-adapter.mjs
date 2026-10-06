import{
  OBSERVATION_SCHEMA,
  DEFAULT_OBSERVABLES,
  createObservationRequest,
  evaluateObservedGeneration
}from'./observation-extractor.mjs';

const clamp=n=>Math.max(0,Math.min(1,Number(n)));
const finite=n=>n!==null&&n!==''&&Number.isFinite(Number(n));
const confidence=v=>finite(v)?clamp(v):null;

function normalizePoint(point){
  if(!point||!finite(point.x)||!finite(point.y))return null;
  return{x:Number(point.x),y:Number(point.y)};
}

function normalizeRect(rect){
  if(!rect||!finite(rect.x)||!finite(rect.y)||!finite(rect.w)||!finite(rect.h)||Number(rect.w)<=0||Number(rect.h)<=0)return null;
  return{x:Number(rect.x),y:Number(rect.y),w:Number(rect.w),h:Number(rect.h)};
}

function normalizeCharacter(character,index){
  const occupancy=normalizeRect(character.occupancy||character.rect);
  const anchor=normalizePoint(character.anchor);
  const joints=Object.fromEntries(
    Object.entries(character.joints||{}).map(([key,value])=>[key,normalizePoint(value)]).filter(([,value])=>value)
  );
  return{
    id:character.id||'',
    characterId:character.characterId||'',
    referenceKey:character.referenceKey||'',
    name:character.name||'',
    ...(occupancy?{occupancy}:{}),
    ...(anchor?{anchor}:{}),
    ...(Object.keys(joints).length?{joints}:{}),
    ...(finite(character.scale)?{scale:Number(character.scale)}:{}),
    ...(confidence(character.confidence)!=null?{confidence:confidence(character.confidence)}:{}),
    observationIndex:index
  };
}

function normalizeLettering(entry,index){
  const rect=normalizeRect(entry.rect);
  return{
    kind:entry.kind||'unknown',
    text:String(entry.text??''),
    writingMode:entry.writingMode||null,
    ...(rect?{rect}:{}),
    ...(confidence(entry.confidence)!=null?{confidence:confidence(entry.confidence)}:{}),
    observationIndex:index
  };
}

function normalizePanel(panel,index){
  const rect=normalizeRect(panel.rect);
  if(!rect)throw new Error(`Image observation panel ${index+1} requires a valid pixel rect`);
  return{
    panelId:panel.panelId||panel.id||'',
    order:Number(panel.order)||index+1,
    rect,
    characters:(panel.characters||[]).map(normalizeCharacter),
    contacts:(panel.contacts||[]).map((contact)=>{
      const point=normalizePoint(contact.point||contact);
      return point?{...point,...(confidence(contact.confidence)!=null?{confidence:confidence(contact.confidence)}:{})}:null;
    }).filter(Boolean),
    reservedRegions:(panel.reservedRegions||[]).map(normalizeRect).filter(Boolean),
    lettering:(panel.lettering||[]).map(normalizeLettering),
    ...(panel.attention?{attention:panel.attention}:{}),
    ...(panel.flow?{flow:panel.flow}:{}),
    ...(confidence(panel.confidence)!=null?{confidence:confidence(panel.confidence)}:{})
  };
}

export function createImageObservation({
  asset,
  width,
  height,
  panels=[],
  readingDirection=null,
  defaultWritingMode=null,
  observables=DEFAULT_OBSERVABLES,
  sourceKind='vision',
  confidence:overallConfidence=null,
  notes=''
}={}){
  if(!asset)throw new Error('Image observation requires an asset reference');
  if(!(Number(width)>0&&Number(height)>0))throw new Error('Image observation requires positive width and height');
  if(!['vision','manual-image','hybrid'].includes(sourceKind))throw new Error(`Unsupported image observation source kind: ${sourceKind}`);
  return{
    schema:OBSERVATION_SCHEMA,
    source:{
      kind:sourceKind,
      asset,
      ...(confidence(overallConfidence)!=null?{confidence:confidence(overallConfidence)}:{}),
      ...(notes?{notes:String(notes)}:{})
    },
    coordinateSpace:'pixels',
    canvas:{width:Number(width),height:Number(height)},
    observables:[...observables],
    ...(readingDirection?{readingDirection}:{}),
    ...(defaultWritingMode?{defaultWritingMode}:{}),
    panels:panels.map(normalizePanel)
  };
}

export function evaluateGeneratedImage(project,imageObservation,{pageIndex=0,observables=imageObservation?.observables||DEFAULT_OBSERVABLES}={}){
  const raw=imageObservation?.schema===OBSERVATION_SCHEMA
    ?imageObservation
    :createImageObservation(imageObservation);
  return evaluateObservedGeneration(project,raw,{pageIndex,observables});
}

export function manualImageObservation(input={}){
  return createImageObservation({...input,sourceKind:'manual-image'});
}


export function createVisionObservationTask({project,pageIndex=0,asset,width,height,observables=DEFAULT_OBSERVABLES}={}){
  if(!asset)throw new Error('Vision observation task requires an image asset');
  if(!(Number(width)>0&&Number(height)>0))throw new Error('Vision observation task requires positive image dimensions');
  return{
    schema:'manga-blueprint-image-observation-task/1',
    asset,
    canvas:{width:Number(width),height:Number(height)},
    observationRequest:createObservationRequest({project,pageIndex,generatedAsset:asset,observables})
  };
}

export async function runImageObservationAdapter({
  project,
  pageIndex=0,
  asset,
  width,
  height,
  adapter,
  observables=DEFAULT_OBSERVABLES
}={}){
  if(!adapter||typeof adapter.observe!=='function')throw new Error('Image observation adapter must expose observe(task)');
  const task=createVisionObservationTask({project,pageIndex,asset,width,height,observables});
  const extracted=await adapter.observe(structuredClone(task));
  if(!extracted||typeof extracted!=='object')throw new Error('Image observation adapter returned no structured evidence');
  const observation=createImageObservation({
    asset,
    width,
    height,
    panels:extracted.panels||[],
    readingDirection:extracted.readingDirection||null,
    defaultWritingMode:extracted.defaultWritingMode||null,
    observables,
    sourceKind:'vision',
    confidence:extracted.confidence,
    notes:extracted.notes||adapter.name||''
  });
  return{
    schema:'manga-blueprint-image-observation-run/1',
    task,
    observation,
    evaluation:evaluateGeneratedImage(project,observation,{pageIndex,observables}),
    adapter:{name:adapter.name||'external',provider:adapter.provider||null,model:adapter.model||null}
  };
}
