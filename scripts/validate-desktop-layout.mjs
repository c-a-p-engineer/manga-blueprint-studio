import fs from 'node:fs';
import {runtimePaths, readRuntime} from './runtime-paths.mjs';

const app=readRuntime('desktopLayout');
const bootstrap=fs.readFileSync('web/app.js','utf8');
const src=`./${runtimePaths.desktopLayout.slice('web/'.length)}`;

const required=[
  src,
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
  const source=needle===src?bootstrap:app;
  if(!source.includes(needle))throw new Error(`Desktop layout contract missing: ${needle}`);
}

if(!app.includes("topbar?.getBoundingClientRect?.().height||68")){
  throw new Error('Desktop sticky offset must derive from the rendered topbar height.');
}
if(!app.includes("height+12")){
  throw new Error('Desktop sticky offset must keep workspace separation below the topbar.');
}

console.log('Desktop responsive layout validation passed.');
