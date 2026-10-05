import assert from'node:assert/strict';import fs from'node:fs';import os from'node:os';import path from'node:path';import{spawnSync}from'node:child_process';
const node=process.execPath,cli=path.resolve('cli/manga-blueprint.mjs');
const listed=spawnSync(node,[cli,'--list-layouts','4'],{encoding:'utf8'});
assert.equal(listed.status,0,listed.stderr||'layout list failed');
for(const token of ['Layout Recipe Bank v1','hero-bottom','dialogue-stagger','action-step','@layout-seed'])assert.ok(listed.stdout.includes(token),`CLI layout list missing ${token}`);
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'manga-layout-cli-'));
try{
  const compiled=spawnSync(node,[cli,'examples/action-name.md',temp,'--layout','hero-bottom','--seed','shared-cli','--mutation','0.25'],{encoding:'utf8'});
  assert.equal(compiled.status,0,compiled.stderr||compiled.stdout||'CLI compile failed');
  const manifest=JSON.parse(fs.readFileSync(path.join(temp,'manifest.json'),'utf8'));
  const work=JSON.parse(fs.readFileSync(path.join(temp,'work.manga.json'),'utf8'));
  assert.equal(manifest.layoutRecipes.version,1);
  assert.equal(manifest.layoutRecipes.pages[0].recipeId,'hero-bottom');
  assert.equal(work.pages[0].layoutDecision.recipeId,'hero-bottom');
  assert.equal(work.pages[0].layoutDecision.signals.basePanelCount,3,'action-name has 3 base panels plus one inset');
  assert.equal(work.pages[0].layoutDecision.signals.insetCount,1);
  assert.equal(work.pages[0].layoutDecision.signals.mutation,.25);
  assert.ok(Number.isInteger(work.pages[0].layoutDecision.signals.seed)&&work.pages[0].layoutDecision.signals.seed>0);
  for(const file of ['P001.clean.svg','P001.blueprint.svg','P001.prompt.md'])assert.ok(fs.existsSync(path.join(temp,file)),`CLI output missing ${file}`);
}finally{fs.rmSync(temp,{recursive:true,force:true});}
console.log('Layout Recipe CLI: list, explicit settings, inset separation, and package manifest passed.');
