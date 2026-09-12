import fs from 'node:fs';
import path from 'node:path';
import {runtimeManifest,runtimeLoadOrder,runtimePaths} from './runtime-paths.mjs';

const bootstrap=fs.readFileSync('web/src/legacy-runtime.ts','utf8');
const entry=fs.readFileSync('web/app.js','utf8');
const numbered=fs.readdirSync('web').filter(name=>/^app-\d+\.js$/.test(name));
if(numbered.length)throw new Error(`Numbered runtime chunks are no longer allowed: ${numbered.join(', ')}`);
if(!entry.includes("import './src/main.ts'"))throw new Error('web/app.js must delegate to the TypeScript/Vite entrypoint.');

if(!fs.existsSync('web/runtime/README.md'))throw new Error('Runtime ownership documentation missing');
if(!fs.existsSync('web/runtime/manifest.json'))throw new Error('Canonical runtime manifest missing');
if(!bootstrap.includes("from '../runtime/manifest.json'"))throw new Error('TypeScript bootstrap must consume the canonical runtime manifest.');
if((bootstrap.match(/['"`]runtime\/[^'"`]+\.js/g)||[]).length){
  throw new Error('TypeScript bootstrap must not duplicate inline legacy runtime paths.');
}

if(runtimeManifest.length!==runtimeLoadOrder.length)throw new Error('Runtime manifest/load-order length mismatch');
if(new Set(runtimeLoadOrder).size!==runtimeLoadOrder.length)throw new Error('runtimeLoadOrder contains duplicate keys');

const listedPaths=[];
for(const [index,entryDef] of runtimeManifest.entries()){
  const {key,id,path:relative}=entryDef;
  if(runtimeLoadOrder[index]!==key)throw new Error(`Runtime load order disagrees with manifest at ${key}`);
  const expectedPath=`web/${relative}`;
  if(runtimePaths[key]!==expectedPath)throw new Error(`Runtime path map disagrees with manifest at ${key}`);
  if(id!==relative.slice('runtime/'.length,-'.js'.length))throw new Error(`Runtime id/path mismatch at ${key}`);
  if(!fs.existsSync(expectedPath))throw new Error(`Missing runtime source for ${key}: ${expectedPath}`);
  listedPaths.push(expectedPath);
}
if(new Set(listedPaths).size!==listedPaths.length)throw new Error('Runtime manifest contains duplicate files');

const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(entry=>{
  const full=path.join(dir,entry.name);
  return entry.isDirectory()?walk(full):entry.isFile()&&entry.name.endsWith('.js')?[full.replaceAll('\\','/')]:[];
});
const actual=new Set(walk('web/runtime'));
const expected=new Set(listedPaths);
for(const file of actual)if(!expected.has(file))throw new Error(`Runtime JS is not registered in canonical manifest: ${file}`);
for(const file of expected)if(!actual.has(file))throw new Error(`Registered runtime JS does not exist: ${file}`);

if(!bootstrap.includes('runtimeCacheKey')||!bootstrap.includes('gitCommit'))throw new Error('Legacy runtime cache key must include release revision provenance.');
console.log(`Semantic runtime layout passed (${listedPaths.length} named legacy chunks from one canonical manifest).`);
