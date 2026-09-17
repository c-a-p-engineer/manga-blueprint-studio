#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { buildPrompt, buildManifest } from '../core/blueprint-engine.mjs';
import { compileMangaName } from '../core/manga-grammar.mjs';
import { renderExecutableNameSvg } from '../core/blueprint-renderer.mjs';

const [input, out = 'blueprint-out'] = process.argv.slice(2);
if (!input) {
  console.error('Usage: node cli/manga-blueprint.mjs <name.md> [out-dir]');
  process.exit(2);
}
const text = await fs.readFile(input, 'utf8');
const project = compileMangaName(text, { title: path.basename(input, path.extname(input)) });
await fs.mkdir(out, { recursive: true });
await fs.writeFile(path.join(out, 'work.manga.json'), JSON.stringify(project, null, 2));
const files=['work.manga.json'];
for(let i=0;i<project.pages.length;i++){
  const n=String(i+1).padStart(3,'0');
  const clean=`P${n}.clean.svg`, annotated=`P${n}.blueprint.svg`, prompt=`P${n}.prompt.md`;
  await fs.writeFile(path.join(out,clean),renderExecutableNameSvg(project,i,{annotated:false}));
  await fs.writeFile(path.join(out,annotated),renderExecutableNameSvg(project,i,{annotated:true}));
  await fs.writeFile(path.join(out,prompt),buildPrompt(project,i));
  files.push(clean,annotated,prompt);
}
const manifest=buildManifest(project,path.basename(input));
manifest.blueprintRenderer={name:'executable-name-layered',version:1,cleanRole:'generation-facing black spatial contract',annotatedRole:'human review only'};
await fs.writeFile(path.join(out,'manifest.json'),JSON.stringify(manifest,null,2));
files.push('manifest.json');
console.log(`Compiled ${project.pages.length} page(s) -> ${out}`);
for(const file of files) console.log(`  ${file}`);
