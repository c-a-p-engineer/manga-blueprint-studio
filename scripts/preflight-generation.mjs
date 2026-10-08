#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {validateGenerationHandoff} from '../core/generation-handoff-preflight.mjs';

// Read-only inspection. This script does not upload files or invoke any provider.
const argv=process.argv.slice(2);
const dir=argv.shift();
const mode=argv.shift();
const value=argv.shift();
if(!dir || !['--contact-sheet','--page'].includes(mode) || (mode==='--page'&&!value) || argv.length){
  console.error('Usage: node scripts/preflight-generation.mjs <compiled-dir> --contact-sheet [001-008]');
  console.error('       node scripts/preflight-generation.mjs <compiled-dir> --page P007');
  process.exit(2);
}
const base=path.resolve(dir);
const resolveAsset=name=>{
  if(typeof name!=='string'||!name||path.isAbsolute(name)||name.includes('\\'))return null;
  const absolute=path.resolve(base,name);
  return absolute.startsWith(base+path.sep)?absolute:null;
};
function getText(name){
  const p=resolveAsset(name);
  if(!p)throw new Error('Unsafe asset path: '+String(name));
  return fs.readFileSync(p,'utf8');
}
function getJson(name){return JSON.parse(getText(name));}
function readAsset(name){
  const file=resolveAsset(name);
  if(!file || !fs.existsSync(file) || !fs.statSync(file).isFile())return{exists:false};
  if(/\.png$/i.test(name)){
    const b=fs.readFileSync(file);
    const magic=[137,80,78,71,13,10,26,10];
    const valid=b.length>=24&&magic.every((v,i)=>b[i]===v)&&b.readUInt32BE(16)>0&&b.readUInt32BE(20)>0;
    return{exists:true,validImage:valid};
  }
  const text=fs.readFileSync(file,'utf8');
  return{exists:true,text,validImage:/\.svg$/i.test(name)?/^\s*<svg\b/.test(text):undefined};
}
try{
  const manifest=getJson('manifest.json');
  const project=getJson(manifest.project);
  let target,packageName;
  if(mode==='--page'){
    const pageNumber=Number(String(value).replace(/^P/i,''));
    if(!Number.isInteger(pageNumber)||pageNumber<1)throw new Error('Invalid page number: '+value);
    const code='P'+String(pageNumber).padStart(3,'0');
    target={kind:'page',pageNumber};
    packageName=code+'.generation.json';
  }else{
    const batches=manifest.contactSheet?.batches|| (manifest.contactSheet?[manifest.contactSheet]:[]);
    const range=value|| (batches.length===1?batches[0].range:undefined);
    target={kind:'contact-sheet',range};
    const group=batches.find(batch=>batch.range===range);
    packageName=group?.generation || (batches.length===1?batches[0].generation:'contact-sheet.generation.json');
  }
  if(!packageName)throw new Error('No matching generation package');
  const generation=getJson(packageName);
  const report=validateGenerationHandoff({manifest,project,generation,target,readAsset});
  process.stdout.write(JSON.stringify({package:packageName,...report},null,2)+'\n');
  process.exitCode=report.status==='blocked'?1:0;
}catch(error){
  console.error(JSON.stringify({status:'blocked',error:error.message},null,2));
  process.exitCode=1;
}
