import fs from 'node:fs';

const app=fs.readFileSync('web/app-16.js','utf8');
const bootstrap=fs.readFileSync('web/app.js','utf8');
const agents=fs.readFileSync('AGENTS.md','utf8');

for(const token of ['readingOrderedPanels16','renumberPanels=function','project.meta.readingDirection','panel.order=index+1','render=function']){
  if(!app.includes(token))throw new Error(`reading-order contract missing: ${token}`);
}
if(!bootstrap.includes("'./app-16.js'"))throw new Error('app-16.js is not loaded by bootstrap');
if(!agents.includes('reading direction') && !agents.includes('読み方向'))throw new Error('AGENTS.md must preserve reading-direction contract');

console.log('Reading-order synchronization contract validation passed.');
