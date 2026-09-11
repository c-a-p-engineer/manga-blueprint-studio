import fs from 'node:fs';
import vm from 'node:vm';
import {runtimePaths, readRuntime} from './runtime-paths.mjs';

const app=readRuntime('readingOrder');
const bootstrap=fs.readFileSync('web/app.js','utf8');
const agents=fs.readFileSync('AGENTS.md','utf8');

for(const token of ['panelReadingGeometry16','readingOrderedPanels16','renumberPanels=function','project.meta.readingDirection','panel.order=index+1','render=function']){
  if(!app.includes(token))throw new Error(`reading-order contract missing: ${token}`);
}
const src=`./${runtimePaths.readingOrder.slice('web/'.length)}`;
if(!bootstrap.includes(src))throw new Error(`Reading-order runtime is not loaded by bootstrap: ${src}`);
if(!agents.includes('reading direction') && !agents.includes('読み方向'))throw new Error('AGENTS.md must preserve reading-direction contract');

const panels=[
  {id:'top-left',order:99,rect:{x:20,y:20,w:300,h:300}},
  {id:'top-right',order:99,rect:{x:360,y:20,w:300,h:300}},
  {id:'bottom-left',order:99,rect:{x:20,y:360,w:300,h:300}},
  {id:'bottom-right',order:99,rect:{x:360,y:360,w:300,h:300}}
];
const sandbox={
  project:{meta:{readingDirection:'rtl'}},
  currentPage:()=>({panels}),
  pageSize04:()=>({w:700,h:1000}),
  render:()=>{}
};
vm.createContext(sandbox);
vm.runInContext(app,sandbox);

const orderMap=()=>Object.fromEntries(panels.map(p=>[p.id,p.order]));
let got=orderMap();
const rtlExpected={'top-right':1,'top-left':2,'bottom-right':3,'bottom-left':4};
for(const [id,order] of Object.entries(rtlExpected))if(got[id]!==order)throw new Error(`RTL order mismatch for ${id}: got ${got[id]}, want ${order}`);

sandbox.project.meta.readingDirection='ltr';
sandbox.renumberPanels();
got=orderMap();
const ltrExpected={'top-left':1,'top-right':2,'bottom-left':3,'bottom-right':4};
for(const [id,order] of Object.entries(ltrExpected))if(got[id]!==order)throw new Error(`LTR order mismatch for ${id}: got ${got[id]}, want ${order}`);

// A single slanted corner may extend above its visual row. Reading order should use
// the polygon's visual center, not the bounding-box minimum y/x, so the spike does
// not promote a mostly-lower panel ahead of the true top row.
const irregular=[
  {id:'top-right',order:99,rect:{x:380,y:30,w:280,h:260},shape:{kind:'quad',points:[{x:420,y:35},{x:660,y:30},{x:630,y:290},{x:380,y:285}]}},
  {id:'top-left',order:99,rect:{x:30,y:35,w:300,h:255},shape:{kind:'quad',points:[{x:30,y:40},{x:330,y:35},{x:300,y:290},{x:45,y:285}]}},
  {id:'lower-spike',order:99,rect:{x:40,y:5,w:620,h:650},shape:{kind:'quad',points:[{x:650,y:5},{x:660,y:410},{x:620,y:655},{x:40,y:430}]}}
];
sandbox.project.meta.readingDirection='rtl';
sandbox.currentPage=()=>({panels:irregular});
sandbox.renumberPanels();
const irregularGot=Object.fromEntries(irregular.map(panel=>[panel.id,panel.order]));
if(irregularGot['top-right']!==1||irregularGot['top-left']!==2||irregularGot['lower-spike']!==3){
  throw new Error(`Irregular reading order was distorted by an intruding corner: ${JSON.stringify(irregularGot)}`);
}

console.log('Reading-order synchronization contract validation passed.');