// Story Template presentation contract: preserve panel shape and frame border semantics.
// Loaded after panel-geometry so template application can reuse canonical quadrilateral helpers.

const STORY_TEMPLATE_BORDER_VALUES_34=new Set(['normal','borderless','inset','impact']);
const captureCurrentTemplateBase34=captureCurrentTemplate13;
const templateRectsBase34=templateRects13;
const makePanelBase34=makePanel;
const readingOrderedPanelsBase34=typeof readingOrderedPanels16==='function'?readingOrderedPanels16:null;
const applyTemplateBase34=typeof applyTwoVisibleTemplate27==='function'
  ?applyTwoVisibleTemplate27
  :typeof applyTemplateSceneContract22==='function'
    ?applyTemplateSceneContract22
    :typeof applyTemplateReadingAware17==='function'
      ?applyTemplateReadingAware17
      :applyTemplate13;

function storyTemplateBorder34(value){
  return STORY_TEMPLATE_BORDER_VALUES_34.has(value)?value:'normal';
}
function normalizeTemplateRect34(rect,size){
  return {
    x:Number(rect?.x||0)*size.w,
    y:Number(rect?.y||0)*size.h,
    w:Number(rect?.w||0)*size.w,
    h:Number(rect?.h||0)*size.h
  };
}
function denormalizeTemplateShape34(shape,size){
  if(shape?.kind!=='quad'||!Array.isArray(shape.points)||shape.points.length!==4)return null;
  const points=shape.points.map(point=>({x:Number(point?.x)*size.w,y:Number(point?.y)*size.h}));
  if(points.some(point=>!Number.isFinite(point.x)||!Number.isFinite(point.y)))return null;
  const candidate={kind:'quad',preset:String(shape.preset||'custom'),points};
  if(typeof normalizedQuad33==='function')return normalizedQuad33(candidate,normalizeTemplateRect34({x:0,y:0,w:1,h:1},size));
  return candidate;
}
function templatePanelSpecs34(tpl,size){
  if(Array.isArray(tpl?.normalizedPanels)&&tpl.normalizedPanels.length){
    return tpl.normalizedPanels.map(item=>{
      const rect=normalizeTemplateRect34(item?.rect||{},size),shape=denormalizeTemplateShape34(item?.shape,size);
      return shape?{rect,shape}:{rect};
    });
  }
  if(Array.isArray(tpl?.normalizedRects)&&tpl.normalizedRects.length){
    return tpl.normalizedRects.map(rect=>({rect:normalizeTemplateRect34(rect,size)}));
  }
  if(typeof layoutSpecs33==='function')return layoutSpecs33(tpl?.layout,size.w,size.h);
  return templateRectsBase34(tpl,size).map(rect=>({rect:{...rect}}));
}
function assignTemplateShape34(panel,spec){
  if(!panel||!spec?.shape)return panel;
  const shape={kind:'quad',preset:String(spec.shape.preset||'custom'),points:spec.shape.points.map(point=>({x:Number(point.x),y:Number(point.y)}))};
  if(typeof normalizedQuad33==='function'){
    const normalized=normalizedQuad33(shape,spec.rect);
    if(normalized)panel.shape=normalized;
  }else panel.shape=shape;
  if(panel.shape?.kind==='quad'){
    panel.style.bleed='none';
    if(typeof syncPanelRectFromShape33==='function')syncPanelRectFromShape33(panel);
  }
  return panel;
}
function normalizeCapturedShape34(panel,size){
  if(panel?.shape?.kind!=='quad'||!Array.isArray(panel.shape.points)||panel.shape.points.length!==4)return null;
  return {
    kind:'quad',
    preset:String(panel.shape.preset||'custom'),
    points:panel.shape.points.map(point=>({x:Number(point.x)/size.w,y:Number(point.y)/size.h}))
  };
}

captureCurrentTemplate13=function(name){
  const captured=captureCurrentTemplateBase34(name),page=currentPage(),size=pageSize04();
  const ordered=[...page.panels].sort((a,b)=>a.order-b.order);
  captured.template.normalizedPanels=ordered.map((panel,index)=>{
    const rect={...(captured.template.normalizedRects?.[index]||{})},shape=normalizeCapturedShape34(panel,size);
    return shape?{rect,shape}:{rect};
  });
  captured.template.beats=(captured.template.beats||[]).map((beat,index)=>({
    ...beat,
    border:storyTemplateBorder34(ordered[index]?.style?.border)
  }));
  return captured;
};

function withTemplatePresentation34(tpl,run){
  const size=pageSize04(),specs=templatePanelSpecs34(tpl,size);
  let panelIndex=0;
  const savedTemplateRects=templateRects13,savedMakePanel=makePanel,savedReadingOrder=typeof readingOrderedPanels16==='function'?readingOrderedPanels16:null;
  templateRects13=function(target,targetSize){
    if(target!==tpl)return savedTemplateRects(target,targetSize);
    return templatePanelSpecs34(target,targetSize).map(spec=>({...spec.rect}));
  };
  makePanel=function(rect,order){
    const panel=makePanelBase34(rect,order),spec=specs[panelIndex++];
    return assignTemplateShape34(panel,spec);
  };
  if(savedReadingOrder){
    readingOrderedPanels16=function(page){
      const ordered=savedReadingOrder(page);
      ordered.forEach((panel,index)=>{
        const beat=tpl.beats?.[index]||tpl.beats?.at(-1)||{};
        panel.style.border=storyTemplateBorder34(beat.border);
      });
      return ordered;
    };
  }
  try{return run();}
  finally{
    templateRects13=savedTemplateRects;
    makePanel=savedMakePanel;
    if(savedReadingOrder)readingOrderedPanels16=savedReadingOrder;
  }
}

function applyTemplatePresentation34(){
  const id=selectedTemplateId13(),tpl=storyTemplates11[id];
  if(!tpl)return;
  return withTemplatePresentation34(tpl,()=>applyTemplateBase34());
}
function bindTemplatePresentation34(){
  const old=$('applyStoryTemplate11');
  if(!old)return;
  const fresh=old.cloneNode(true);
  old.replaceWith(fresh);
  fresh.addEventListener('click',applyTemplatePresentation34);
}

bindTemplatePresentation34();
