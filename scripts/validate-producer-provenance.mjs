import fs from 'node:fs';
import {runtimePaths, readRuntime} from './runtime-paths.mjs';

const buildInfo=JSON.parse(fs.readFileSync('web/build-info.json','utf8'));
if(buildInfo.schema!=='manga-blueprint-build-info/1')throw new Error('Unexpected build-info schema');
const version=String(buildInfo.appVersion||'').trim();
if(!/^\d+\.\d+\.\d+$/.test(version))throw new Error(`Invalid build-info appVersion: ${version}`);
if(!Object.hasOwn(buildInfo,'gitCommit'))throw new Error('build-info must expose gitCommit');

const bootstrap=fs.readFileSync('web/app.js','utf8');
for(const phrase of [
  "fetch('./build-info.json'",
  "cache:'no-store'",
  'MANGA_BLUEPRINT_BUILD_INFO',
  `appVersion:'${version}'`,
  './runtime/handoff/producer-provenance.js'
])if(!bootstrap.includes(phrase))throw new Error(`Missing build provenance bootstrap: ${phrase}`);

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

const briefIndex=bootstrap.indexOf('./runtime/handoff/render-brief.js');
const producerIndex=bootstrap.indexOf('./runtime/handoff/producer-provenance.js');
if(briefIndex<0||producerIndex<0||producerIndex<briefIndex)throw new Error('Producer provenance must load after the final render-brief manifest wrapper');

console.log(`Prototype ${version} producer provenance validation passed.`);
