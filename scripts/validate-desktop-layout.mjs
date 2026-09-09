import fs from 'node:fs';

const app=fs.readFileSync('web/app-24.js','utf8');
const bootstrap=fs.readFileSync('web/app.js','utf8');

const required=[
  "'./app-24.js'",
  '--desktop-sticky-top24',
  '.top-actions select{width:auto',
  '.control-shell{position:sticky',
  '.tabbar{position:static',
  '.panels{max-height:calc(100vh - var(--desktop-sticky-top24',
  'ResizeObserver',
  '@media (max-width:760px)',
  '.control-shell{position:static'
];

for(const needle of required){
  const source=needle==="'./app-24.js'"?bootstrap:app;
  if(!source.includes(needle))throw new Error(`Desktop layout contract missing: ${needle}`);
}

if(!app.includes("topbar?.getBoundingClientRect?.().height||68")){
  throw new Error('Desktop sticky offset must derive from the rendered topbar height.');
}
if(!app.includes("height+12")){
  throw new Error('Desktop sticky offset must keep workspace separation below the topbar.');
}

console.log('Desktop responsive layout validation passed.');
