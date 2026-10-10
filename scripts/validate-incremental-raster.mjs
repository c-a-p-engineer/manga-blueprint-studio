import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';

const dir=fs.mkdtempSync(path.join(os.tmpdir(),'manga-incremental-png-'));
const write=(name,content)=>fs.writeFileSync(path.join(dir,name),typeof content==='string'?content:JSON.stringify(content,null,2));
const load=name=>JSON.parse(fs.readFileSync(path.join(dir,name),'utf8'));
const code='P001';
const svg='<svg xmlns="http://www.w3.org/2000/svg" width="120" height="180"><defs><clipPath id="clip-panel-1"><polygon points="5,5 115,5 115,170 5,170"/></clipPath></defs><rect width="120" height="180" fill="white"/><rect x="5" y="5" width="110" height="165" fill="none" stroke="black"/></svg>';
const run=()=>spawnSync(process.execPath,['cli/rasterize-existing.mjs',dir],{encoding:'utf8'});
try{
  write('work.manga.json',{meta:{pageWidth:120,pageHeight:180,readingDirection:'rtl',defaultWritingMode:'vertical-rl',letteringStrategy:'overlay-only'},characterLibrary:[],pages:[{id:'page-1',pageNumber:1,panels:[{id:'panel-1',order:1}]}]});
  write('manifest.json',{project:'work.manga.json',pages:[{pageId:'page-1',pageNumber:1}],rasterization:{mode:'required-local',status:'pending',results:[]}});
  write(code+'.generation.json',{request:{pageId:'page-1',inputs:{cleanAsset:code+'.clean.png',prompt:code+'.prompt.md',references:[],letteringAsset:code+'.lettering.png',letteringPlan:code+'.lettering.json',cleanLetteredAsset:code+'.clean-lettered.png'}},ready:false});
  write(code+'.lettering.json',{pageId:'page-1',entries:[]});
  write(code+'.prompt.md','## Panel 1\nExample');
  for(const part of ['clean','blueprint','lettering','clean-lettered'])write(code+'.'+part+'.svg',part==='lettering' ? '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="180"><text x="6" y="60">Text</text></svg>' : svg);
  let result=run();
  assert.equal(result.status,0,result.stderr||result.stdout);
  assert.equal(load('manifest.json').rasterization.status,'complete');
  assert.equal(load(code+'.generation.json').ready,true);
  for(const part of ['clean','blueprint','lettering','clean-lettered']){
    const png=fs.readFileSync(path.join(dir,code+'.'+part+'.png'));
    assert.equal(png.readUInt32BE(16),120);
    assert.equal(png.readUInt32BE(20),180);
    if(part==='lettering')assert([4,6].includes(png[25]),'Lettering PNG must preserve alpha transparency');
  }
  result=run();
  assert.equal(result.status,0,result.stderr||result.stdout);
  assert(load('manifest.json').rasterization.results.every(x=>x.cacheHit),'Second run must reuse matched SVG/PNG outputs');
  write(code+'.clean.svg',svg.replace('stroke="black"','stroke="red"'));
  result=run();
  assert.equal(result.status,0,result.stderr||result.stdout);
  const statuses=load('manifest.json').rasterization.results;
  assert.equal(statuses.find(x=>x.source===code+'.clean.svg').cacheHit,undefined,'Changed SVG must invalidate raster cache');
  assert(statuses.filter(x=>x.source!==code+'.clean.svg').every(x=>x.cacheHit));
  write(code+'.clean.svg',svg.replace('clip-panel-1','clip-panel-other'));
  result=run();
  assert.notEqual(result.status,0,'Geometry identity mismatch must fail before rasterization');
  console.log('Incremental PNG refresh passed: 4 outputs, cache, invalidation, identity guard');
}finally{fs.rmSync(dir,{recursive:true,force:true});}
