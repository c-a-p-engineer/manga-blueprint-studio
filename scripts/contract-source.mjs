import fs from 'node:fs';
import path from 'node:path';
import {runtimeManifest,readRuntime} from './runtime-paths.mjs';

export function runtimeKeysByIdPrefix(prefix){
  return runtimeManifest.filter(entry=>entry.id.startsWith(prefix)).map(entry=>entry.key);
}

export function runtimeSourceByKeys(keys){
  return keys.map(key=>`\n/* runtime:${key} */\n${readRuntime(key)}`).join('\n');
}

export function runtimeFamilySource(...prefixes){
  const keys=[...new Set(prefixes.flatMap(runtimeKeysByIdPrefix))];
  if(!keys.length)throw new Error(`No runtime owners registered for: ${prefixes.join(', ')}`);
  return runtimeSourceByKeys(keys);
}

export function runtimeOwnersContaining(fragment,{keys=null,prefixes=null}={}){
  const candidates=keys||[...new Set((prefixes||['']).flatMap(runtimeKeysByIdPrefix))];
  return candidates.filter(key=>readRuntime(key).includes(fragment));
}

export function requireRuntimeCapability(fragment,{keys=null,prefixes=null,label=fragment}={}){
  const owners=runtimeOwnersContaining(fragment,{keys,prefixes});
  if(!owners.length)throw new Error(`Registered runtime owners missing ${label}`);
  return owners;
}

function walkSourceFiles(root,extensions){
  const out=[];
  for(const entry of fs.readdirSync(root,{withFileTypes:true})){
    const full=path.join(root,entry.name);
    if(entry.isDirectory())out.push(...walkSourceFiles(full,extensions));
    else if(entry.isFile()&&extensions.some(ext=>entry.name.endsWith(ext)))out.push(full);
  }
  return out.sort();
}

export function sourceTree(root,{extensions=['.ts','.js','.mjs']}={}){
  return walkSourceFiles(root,extensions)
    .map(file=>`\n/* source:${file.replaceAll('\\','/')} */\n${fs.readFileSync(file,'utf8')}`)
    .join('\n');
}

export function requireText(source,text,label=text){
  if(!source.includes(text))throw new Error(`${label} missing ${JSON.stringify(text)}`);
}
