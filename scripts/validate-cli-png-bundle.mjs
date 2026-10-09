import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {composeCleanLetteredSvg} from '../core/clean-lettered.mjs';

const pngSignature=Buffer.from([137,80,78,71,13,10,26,10]);
const output=fs.mkdtempSync(path.join(os.tmpdir(),'manga-required-png-'));
try {
  const run=spawnSync(process.execPath,['cli/manga-blueprint.mjs','examples/action-name.md',output,'--review-full'],{encoding:'utf8',timeout:120000});
  assert.equal(run.status,0,'Headless CLI must compile all PNGs: '+(run.stderr||run.stdout));
  const prefix='P001';
  const variants=['clean','blueprint','lettering','clean-lettered','review-full'];
  for(const kind of variants) {
    const asset=path.join(output,prefix+'.'+kind+'.png');
    const png=fs.readFileSync(asset);
    assert(png.subarray(0,8).equals(pngSignature),'Invalid required PNG '+asset);
    assert(png.readUInt32BE(16)>100 && png.readUInt32BE(20)>100,'Invalid raster dimensions '+asset);
  }
  const clean=fs.readFileSync(path.join(output,'P001.clean.svg'),'utf8');
  const lettering=fs.readFileSync(path.join(output,'P001.lettering.svg'),'utf8');
  const lettered=fs.readFileSync(path.join(output,'P001.clean-lettered.svg'),'utf8');
  const annotated=fs.readFileSync(path.join(output,'P001.blueprint.svg'),'utf8');
  assert(!clean.includes('id="deterministic-lettering"'),'Unlettered Clean must stay text-free');
  assert(lettered.includes('id="clean-lettered-overlay"') && lettered.includes('id="deterministic-lettering"'),'Clean-lettered must preserve exact text overlay');
  assert.equal(lettered,composeCleanLetteredSvg(clean,lettering),'Composited lettering must be deterministic');
  assert(annotated.includes('id="deterministic-lettering"'),'Blueprint must include dialogue/SFX');
  assert.throws(()=>composeCleanLetteredSvg('<svg></svg>','<svg></svg>'),/deterministic lettering/);
  const manifest=JSON.parse(fs.readFileSync(path.join(output,'manifest.json'),'utf8'));
  const generation=JSON.parse(fs.readFileSync(path.join(output,'P001.generation.json'),'utf8'));
  assert.equal(manifest.rasterization.mode,'required-local');
  assert(manifest.rasterization.results.every(x=>x.ok && x.output),'Every rasterized asset must be present');
  assert.equal(manifest.pages[0].cleanPng,'P001.clean.png');
  assert.equal(manifest.pages[0].annotatedPng,'P001.blueprint.png');
  assert.equal(manifest.pages[0].letteringPng,'P001.lettering.png');
  assert.equal(manifest.pages[0].cleanLetteredPng,'P001.clean-lettered.png');
  assert.equal(generation.request.inputs.cleanAsset,'P001.clean.png');
  assert.equal(generation.request.inputs.letteringAsset,'P001.lettering.png');
  assert.equal(generation.request.inputs.cleanLetteredAsset,'P001.clean-lettered.png');
  console.log('Required manga page PNG bundle passed: '+variants.length+' PNGs, manifest, handoff, deterministic lettering');
} finally {
  fs.rmSync(output,{recursive:true,force:true});
}
