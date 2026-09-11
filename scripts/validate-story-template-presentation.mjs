import fs from 'node:fs';
import vm from 'node:vm';

const presentationPath='web/runtime/templates/presentation-contract.js';
const source=fs.readFileSync(presentationPath,'utf8');
const app=fs.readFileSync('web/app.js','utf8');
const runtimePaths=fs.readFileSync('scripts/runtime-paths.mjs','utf8');

for(const token of [
  'normalizedPanels',
  "'borderless'",
  "'impact'",
  'layoutSpecs33',
  'assignTemplateShape34',
  'captureCurrentTemplate13=function',
  'panel.style.border=storyTemplateBorder34(beat.border)',
  "panel.style.bleed='none'"
])if(!source.includes(token))throw new Error(`Story Template presentation contract missing: ${token}`);

if(!app.includes("['templates/presentation-contract', './runtime/templates/presentation-contract.js']"))throw new Error('presentation-contract runtime chunk is not loaded');
if(app.indexOf("./runtime/authoring/panel-geometry.js")>app.indexOf("./runtime/templates/presentation-contract.js"))throw new Error('presentation-contract must load after panel-geometry');
if(!runtimePaths.includes("templatePresentationContract: 'web/runtime/templates/presentation-contract.js'"))throw new Error('runtime path registry is missing template presentation contract');

const page={panels:[]};
const tpl={layout:'diagonal3',beats:[{border:'normal'},{border:'impact'},{border:'borderless'}]};
const context={
  storyTemplates11:{demo:tpl},
  selectedTemplateId13:()=> 'demo',
  currentPage:()=>page,
  pageSize04:()=>({w:1000,h:1400}),
  $:()=>null,
  templateRects13:()=>[{x:0,y:0,w:500,h:400},{x:500,y:0,w:500,h:400},{x:0,y:400,w:1000,h:1000}],
  makePanel:(rect,order)=>({order,rect:{...rect},style:{border:'normal',bleed:'none'},effects:{},characters:[],balloons:[]}),
  readingOrderedPanels16:target=>[...target.panels].sort((a,b)=>a.order-b.order),
  layoutSpecs33:(id,w,h)=>[
    {rect:{x:0,y:0,w:w/2,h:400},shape:{kind:'quad',preset:'diagonal-right',points:[{x:0,y:0},{x:w/2-30,y:0},{x:w/2,y:400},{x:30,y:400}]}},
    {rect:{x:w/2,y:0,w:w/2,h:400},shape:{kind:'quad',preset:'diagonal-left',points:[{x:w/2+30,y:0},{x:w,y:0},{x:w-30,y:400},{x:w/2,y:400}]}},
    {rect:{x:0,y:400,w,h:h-400},shape:{kind:'quad',preset:'trapezoid-right',points:[{x:0,y:400},{x:w-40,y:400},{x:w,y:h},{x:0,y:h}]}}
  ],
  normalizedQuad33:shape=>shape,
  syncPanelRectFromShape33:()=>{},
  captureCurrentTemplate13:name=>({id:'x',name,template:{normalizedRects:page.panels.map(panel=>({x:panel.rect.x/1000,y:panel.rect.y/1400,w:panel.rect.w/1000,h:panel.rect.h/1400})),beats:page.panels.map(()=>({lineEffect:'none'}))}})
};
context.applyTwoVisibleTemplate27=()=>{
  const rects=context.templateRects13(tpl,context.pageSize04());
  page.panels=rects.map((rect,index)=>context.makePanel(rect,index+1));
  context.readingOrderedPanels16(page);
};
vm.createContext(context);
vm.runInContext(source,context,{filename:presentationPath});
context.applyTemplatePresentation34();

if(page.panels.some(panel=>panel.shape?.kind!=='quad'))throw new Error('Story Template apply did not preserve quadrilateral shape');
if(page.panels.map(panel=>panel.style.border).join(',')!=='normal,impact,borderless')throw new Error('Story Template apply did not preserve frame border semantics');

const captured=context.captureCurrentTemplate13('demo');
if(captured.template.normalizedPanels?.[0]?.shape?.kind!=='quad')throw new Error('Custom Story Template did not capture quadrilateral shape');
if(captured.template.beats.map(beat=>beat.border).join(',')!=='normal,impact,borderless')throw new Error('Custom Story Template did not capture border semantics');

console.log('Story Template panel shape + frame border presentation contract validation passed.');
