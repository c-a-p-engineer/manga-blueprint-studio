import fs from 'node:fs';
import vm from 'node:vm';

const presentationPath='web/runtime/templates/presentation-contract.js';
const source=fs.readFileSync(presentationPath,'utf8');
const bootstrap=fs.readFileSync('web/src/legacy-runtime.ts','utf8');
const runtimePaths=fs.readFileSync('scripts/runtime-paths.mjs','utf8');

for(const token of [
  'normalizedPanels',
  "'borderless'",
  "'impact'",
  'layoutSpecs33',
  'assignTemplateShape34',
  'captureCurrentTemplate13=function',
  'panel.style.border=storyTemplateBorder34(beat.border)',
  "panel.style.bleed='none'",
  'page.panels===panelsBefore'
])if(!source.includes(token))throw new Error(`Story Template presentation contract missing: ${token}`);
if(source.includes('makePanel=function'))throw new Error('Story Template presentation must not monkey-patch const makePanel at runtime.');

const geometryPath='runtime/authoring/panel-geometry.js';
const presentationRuntimePath='runtime/templates/presentation-contract.js';
if(!bootstrap.includes(`'${presentationRuntimePath}'`))throw new Error('presentation-contract runtime chunk is not loaded');
if(bootstrap.indexOf(`'${geometryPath}'`)>bootstrap.indexOf(`'${presentationRuntimePath}'`))throw new Error('presentation-contract must load after panel-geometry');
if(!runtimePaths.includes("templatePresentationContract: 'web/runtime/templates/presentation-contract.js'"))throw new Error('runtime path registry is missing template presentation contract');

const page={panels:[]};
const tpl={layout:'diagonal3',beats:[{border:'normal'},{border:'impact'},{border:'borderless'}]};
const context={
  page,tpl,
  storyTemplates11:{demo:tpl},
  selectedTemplateId13:()=> 'demo',
  currentPage:()=>page,
  pageSize04:()=>({w:1000,h:1400}),
  $:()=>null,
  layoutSpecs33:(id,w,h)=>[
    {rect:{x:0,y:0,w:w/2,h:400},shape:{kind:'quad',preset:'diagonal-right',points:[{x:0,y:0},{x:w/2-30,y:0},{x:w/2,y:400},{x:30,y:400}]}},
    {rect:{x:w/2,y:0,w:w/2,h:400},shape:{kind:'quad',preset:'diagonal-left',points:[{x:w/2+30,y:0},{x:w,y:0},{x:w-30,y:400},{x:w/2,y:400}]}},
    {rect:{x:0,y:400,w,h:h-400},shape:{kind:'quad',preset:'trapezoid-right',points:[{x:0,y:400},{x:w-40,y:400},{x:w,y:h},{x:0,y:h}]}}
  ],
  normalizedQuad33:shape=>shape,
  syncPanelRectFromShape33:()=>{},
  render:()=>{}
};
vm.createContext(context);
vm.runInContext(`
  const makePanel=(rect,order)=>({order,rect:{...rect},style:{border:'normal',bleed:'none'},effects:{},characters:[],balloons:[]});
  function templateRects13(){return [{x:0,y:0,w:500,h:400},{x:500,y:0,w:500,h:400},{x:0,y:400,w:1000,h:1000}]}
  function readingOrderedPanels16(target=page){return [...target.panels].sort((a,b)=>a.order-b.order)}
  function captureCurrentTemplate13(name){return {id:'x',name,template:{normalizedRects:page.panels.map(panel=>({x:panel.rect.x/1000,y:panel.rect.y/1400,w:panel.rect.w/1000,h:panel.rect.h/1400})),beats:page.panels.map(()=>({lineEffect:'none'}))}}}
  function applyTwoVisibleTemplate27(){const rects=templateRects13(tpl,pageSize04());page.panels=rects.map((rect,index)=>makePanel(rect,index+1));}
`,context);
vm.runInContext(source,context,{filename:presentationPath});
const outcome=vm.runInContext('applyTemplatePresentation34()',context);
if(!outcome?.applied)throw new Error('Story Template apply outcome did not report success');
if(page.panels.some(panel=>panel.shape?.kind!=='quad'))throw new Error('Story Template apply did not preserve quadrilateral shape');
if(page.panels.map(panel=>panel.style.border).join(',')!=='normal,impact,borderless')throw new Error('Story Template apply did not preserve frame border semantics');

const captured=vm.runInContext("captureCurrentTemplate13('demo')",context);
if(captured.template.normalizedPanels?.[0]?.shape?.kind!=='quad')throw new Error('Custom Story Template did not capture quadrilateral shape');
if(captured.template.beats.map(beat=>beat.border).join(',')!=='normal,impact,borderless')throw new Error('Custom Story Template did not capture border semantics');

console.log('Story Template executable apply + panel shape + frame border presentation contract validation passed.');
