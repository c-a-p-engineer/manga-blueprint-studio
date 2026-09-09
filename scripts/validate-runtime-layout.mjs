import fs from 'node:fs';
import path from 'node:path';
import {runtimeLoadOrder, runtimePaths} from './runtime-paths.mjs';

const bootstrap=fs.readFileSync('web/app.js','utf8');
const numbered=fs.readdirSync('web').filter(name=>/^app-\d+\.js$/.test(name));
if(numbered.length)throw new Error(`Numbered runtime chunks are no longer allowed: ${numbered.join(', ')}`);

if(!fs.existsSync('web/runtime/README.md'))throw new Error('Runtime ownership documentation missing');
if(new Set(runtimeLoadOrder).size!==runtimeLoadOrder.length)throw new Error('runtimeLoadOrder contains duplicate keys');
const listedPaths=runtimeLoadOrder.map(key=>runtimePaths[key]);
if(listedPaths.some(Boolean)===false)throw new Error('Runtime path registry is empty');
if(new Set(listedPaths).size!==listedPaths.length)throw new Error('Runtime path registry contains duplicate files');
for(const [key,file] of runtimeLoadOrder.map(key=>[key,runtimePaths[key]])){
  if(!file)throw new Error(`Missing runtime path for ${key}`);
  if(!fs.existsSync(file))throw new Error(`Missing runtime source for ${key}: ${file}`);
  const relative=`./${path.relative('web',file).replaceAll('\\','/')}`;
  if(!bootstrap.includes(relative))throw new Error(`Bootstrap does not load ${key}: ${relative}`);
}

const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(entry=>{
  const full=path.join(dir,entry.name);
  return entry.isDirectory()?walk(full):entry.isFile()&&entry.name.endsWith('.js')?[full.replaceAll('\\','/')]:[];
});
const actual=new Set(walk('web/runtime'));
const expected=new Set(listedPaths);
for(const file of actual)if(!expected.has(file))throw new Error(`Runtime JS is not registered in load order: ${file}`);
for(const file of expected)if(!actual.has(file))throw new Error(`Registered runtime JS does not exist: ${file}`);

console.log(`Semantic runtime layout passed (${listedPaths.length} named chunks).`);
