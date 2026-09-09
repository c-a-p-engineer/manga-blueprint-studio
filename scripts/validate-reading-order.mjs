import fs from 'node:fs';
import vm from 'node:vm';
import {runtimePaths, readRuntime} from './runtime-paths.mjs';

const app=readRuntime('readingOrder');
const bootstrap=fs.readFileSync('web/app.js','utf8');
const agents=fs.readFileSync('AGENTS.md','utf8');

for(const token of ['readingOrderedPanels16','renumberPanels=function','project.meta.readingDirection','panel.order=index+1','render=function']){
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

console.log('Reading-order synchronization contract validation passed.');
