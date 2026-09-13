import fs from 'node:fs';
import {runtimeLoadOrder,runtimePaths,readRuntime} from './runtime-paths.mjs';

const buildInfo=JSON.parse(fs.readFileSync('web/build-info.json','utf8'));
if(buildInfo.schema!=='manga-blueprint-build-info/1')throw new Error('Unexpected build-info schema');
const version=String(buildInfo.appVersion||'').trim();
if(!/^\d+\.\d+\.\d+$/.test(version))throw new Error(`Invalid build-info appVersion: ${version}`);
if(!Object.hasOwn(buildInfo,'gitCommit'))throw new Error('build-info must expose gitCommit');

const main=fs.readFileSync('web/src/main.ts','utf8');
const bridge=fs.readFileSync('web/src/runtime/legacy-api.ts','utf8');
for(const phrase of [
  'build-info.json',
  "cache:'no-store'",
  'setBuildInfo(buildInfo)',
  `appVersion:'${version}'`
])if(!main.includes(phrase))throw new Error(`Missing build provenance TypeScript entry contract: ${phrase}`);
for(const phrase of [
  'MANGA_BLUEPRINT_BUILD_INFO',
  'runtime.MANGA_BLUEPRINT_BUILD_INFO=buildInfo'
])if(!bridge.includes(phrase))throw new Error(`Missing build provenance runtime-bridge contract: ${phrase}`);
if(runtimePaths.producerProvenance!=='web/runtime/handoff/producer-provenance.js')throw new Error('Producer provenance runtime owner is not registered.');

const app=readRuntime('producerProvenance');
for(const phrase of [
  'manga-blueprint-producer/1',
  `appVersion:'${version}'`,
  'manifest.producer=producerManifest31()',
  "projectFormat:'manga-blueprint/0.2'",
  "manifestSchema:'manga-blueprint-export-manifest/3'",
  "renderBriefSchema:'manga-blueprint-render-brief/2'",
  "designDirectionSchema:'manga-blueprint-design-direction-pass/1'"
])if(!app.includes(phrase))throw new Error(`Missing producer provenance contract: ${phrase}`);
if(app.includes("renderBriefSchema:'manga-blueprint-render-brief/1'"))throw new Error('Stale render brief schema remains in producer provenance');

const pages=fs.readFileSync('.github/workflows/pages.yml','utf8');
for(const phrase of ['GITHUB_SHA','github-pages','build-info.json','deployedAt']){
  if(!pages.includes(phrase))throw new Error(`Pages deployment must stamp build provenance: ${phrase}`);
}

const briefIndex=runtimeLoadOrder.indexOf('renderBrief');
const producerIndex=runtimeLoadOrder.indexOf('producerProvenance');
if(briefIndex<0||producerIndex<0||producerIndex<briefIndex)throw new Error('Producer provenance must load after the final render-brief manifest wrapper');

console.log(`Prototype ${version} producer provenance validation passed.`);
