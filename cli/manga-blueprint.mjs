#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { buildManifest } from '../core/blueprint-engine.mjs';
import { compileMangaName } from '../core/manga-grammar.mjs';
import { renderExecutableNameSvg } from '../core/blueprint-renderer.mjs';
import { rasterizeSvg } from '../core/svg-rasterizer.mjs';
import { buildExecutablePrompt } from '../core/generation-brief.mjs';

const [input,out='blueprint-out']=process.argv.slice(2);if(!input){console.error('Usage: node cli/manga-blueprint.mjs <name.md> [out-dir]');process.exit(2);}
const text=await fs.readFile(input,'utf8'),project=compileMangaName(text,{title:path.basename(input,path.extname(input))});await fs.mkdir(out,{recursive:true});await fs.writeFile(path.join(out,'work.manga.json'),JSON.stringify(project,null,2));
const files=['work.manga.json'],raster=[];
for(let i=0;i<project.pages.length;i++){const n=String(i+1).padStart(3,'0'),clean=`P${n}.clean.svg`,annotated=`P${n}.blueprint.svg`,prompt=`P${n}.prompt.md`;await fs.writeFile(path.join(out,clean),renderExecutableNameSvg(project,i,{annotated:false}));await fs.writeFile(path.join(out,annotated),renderExecutableNameSvg(project,i,{annotated:true}));await fs.writeFile(path.join(out,prompt),buildExecutablePrompt(project,i));files.push(clean,annotated,prompt);for(const svg of [clean,annotated]){const png=svg.replace(/\.svg$/,'.png'),result=rasterizeSvg(path.join(out,svg),path.join(out,png));raster.push({source:svg,output:result.ok?png:null,...result});if(result.ok)files.push(png);}}
const manifest=buildManifest(project,path.basename(input));manifest.blueprintRenderer={name:'executable-name-layered',version:2,cleanRole:'generation-facing black spatial contract',annotatedRole:'human review only',poseSolver:'deterministic-2d-contact-v1'};manifest.rasterization={mode:'best-effort-local',results:raster};manifest.authority.generationInstructions='Pxxx.prompt.md (executable semantic brief)';await fs.writeFile(path.join(out,'manifest.json'),JSON.stringify(manifest,null,2));files.push('manifest.json');console.log(`Compiled ${project.pages.length} page(s) -> ${out}`);for(const file of files)console.log(`  ${file}`);if(raster.some(r=>!r.ok))console.warn('PNG note: no supported rasterizer was found for one or more SVGs; SVG output remains canonical.');
