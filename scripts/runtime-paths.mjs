import fs from 'node:fs';

const manifestUrl=new URL('../web/runtime/manifest.json',import.meta.url);
const rawManifest=JSON.parse(fs.readFileSync(manifestUrl,'utf8'));

if(!Array.isArray(rawManifest)||rawManifest.length===0){
  throw new Error('Legacy runtime manifest must be a non-empty array.');
}

const seenKeys=new Set();
const seenIds=new Set();
const seenPaths=new Set();
for(const [index,entry] of rawManifest.entries()){
  if(!entry||typeof entry!=='object')throw new Error(`Invalid runtime manifest entry at index ${index}.`);
  const {key,id,path}=entry;
  if(typeof key!=='string'||!key)throw new Error(`Runtime manifest entry ${index} is missing key.`);
  if(typeof id!=='string'||!id)throw new Error(`Runtime manifest entry ${index} is missing id.`);
  if(typeof path!=='string'||!path)throw new Error(`Runtime manifest entry ${index} is missing path.`);
  if(seenKeys.has(key))throw new Error(`Duplicate runtime manifest key: ${key}`);
  if(seenIds.has(id))throw new Error(`Duplicate runtime manifest id: ${id}`);
  if(seenPaths.has(path))throw new Error(`Duplicate runtime manifest path: ${path}`);
  if(!path.startsWith('runtime/')||!path.endsWith('.js')||path.includes('..')){
    throw new Error(`Invalid runtime manifest path for ${key}: ${path}`);
  }
  const expectedId=path.slice('runtime/'.length,-'.js'.length);
  if(id!==expectedId)throw new Error(`Runtime manifest id/path mismatch for ${key}: ${id} != ${expectedId}`);
  seenKeys.add(key);
  seenIds.add(id);
  seenPaths.add(path);
}

export const runtimeManifest=Object.freeze(rawManifest.map(({key,id,path})=>Object.freeze({key,id,path})));
export const runtimePaths=Object.freeze(Object.fromEntries(runtimeManifest.map(({key,path})=>[key,`web/${path}`])));
export const runtimeLoadOrder=Object.freeze(runtimeManifest.map(({key})=>key));

export function readRuntime(key){
  const path=runtimePaths[key];
  if(!path)throw new Error(`Unknown runtime source key: ${key}`);
  return fs.readFileSync(path,'utf8');
}

export function readRuntimeSet(keys=runtimeLoadOrder){
  return Object.fromEntries(keys.map(key=>[key,readRuntime(key)]));
}
