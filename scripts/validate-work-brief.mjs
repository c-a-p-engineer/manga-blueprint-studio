import fs from 'node:fs';
import vm from 'node:vm';
import {runtimePaths,readRuntime} from './runtime-paths.mjs';

const source=readRuntime('workBrief');
const manifest=JSON.parse(fs.readFileSync('web/runtime/manifest.json','utf8'));
const schema=JSON.parse(fs.readFileSync('schema/manga-blueprint.schema.json','utf8'));

if(runtimePaths.workBrief!=='web/runtime/integration/work-brief.js')throw new Error('work brief runtime path is not canonical');
const renderBriefIndex=manifest.findIndex(entry=>entry.key==='renderBrief');
const workBriefIndex=manifest.findIndex(entry=>entry.key==='workBrief');
const panelGeometryIndex=manifest.findIndex(entry=>entry.key==='panelGeometry');
if(!(renderBriefIndex>=0&&workBriefIndex>renderBriefIndex&&panelGeometryIndex>workBriefIndex))throw new Error('work brief must load after render brief and before geometry/handoff tail');

for(const token of [
  'normalizeWorkBrief39',
  'workBrief39',
  'workBriefPurpose39',
  'workBriefAudience39',
  'workBriefMedium39',
  'workBriefMessage39',
  'workBriefSource39',
  'WORK BRIEF — GUIDANCE ONLY:',
  'MUST NOT override authored panel geometry',
  'manifest.workBrief=',
  'globalThis.workBriefContract39'
])if(!source.includes(token))throw new Error(`work brief contract missing: ${token}`);

const schemaBrief=schema.$defs?.workBrief;
if(!schemaBrief)throw new Error('schema missing $defs.workBrief');
for(const key of ['purpose','targetAudience','outputMedium','keyMessage','sourceNotes']){
  if(schemaBrief.properties?.[key]?.type!=='string')throw new Error(`schema workBrief.${key} must be a string`);
}
if(schema.properties?.meta?.properties?.workBrief?.$ref!=='#/$defs/workBrief')throw new Error('schema meta.workBrief is not wired to $defs.workBrief');

const context={
  console,structuredClone,
  i18n:{ja:{},en:{}},language:'ja',
  project:{meta:{title:'Demo'}},
  normalizeProject:input=>structuredClone(input),
  renderUi(){},applyLanguage(){},mutate(fn){fn();},
  renderBriefObject30:()=>({schema:'manga-blueprint-render-brief/2'}),
  renderBriefText30:()=> 'BASE BRIEF',
  exportManifest08:()=>({schema:'manga-blueprint-export-manifest/3'}),
  escapeXml:value=>String(value),
  globalThis:null
};
context.globalThis=context;
vm.createContext(context);
vm.runInContext(source,context,{filename:'work-brief.js'});

const normalized=context.normalizeProject({meta:{workBrief:{purpose:'ad',targetAudience:42,outputMedium:'social'}}});
if(normalized.meta.workBrief.purpose!=='ad'||normalized.meta.workBrief.targetAudience!=='42')throw new Error('work brief normalization failed');
context.project.meta.workBrief={purpose:'education',targetAudience:'beginners',outputMedium:'print',keyMessage:'Start small',sourceNotes:'Facts only'};
const brief=context.renderBriefObject30();
if(brief.workBrief?.keyMessage!=='Start small')throw new Error('render brief missing workBrief');
const text=context.renderBriefText30();
if(!text.includes('WORK BRIEF — GUIDANCE ONLY:')||!text.includes('Target audience: beginners')||!text.includes('MUST NOT override authored panel geometry'))throw new Error('render brief text missing bounded work brief guidance');
const exported=context.exportManifest08({},'ai',{});
if(exported.workBrief?.outputMedium!=='print')throw new Error('manifest missing workBrief');

console.log('Work brief normalization, schema, UI contract, bounded render guidance, and manifest handoff passed.');
