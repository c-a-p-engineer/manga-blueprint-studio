import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {runtimePaths,runtimeLoadOrder} from './runtime-paths.mjs';

const read=path=>fs.readFileSync(path,'utf8');
const foundation=read(runtimePaths.foundation);
const storage=read(runtimePaths.projectStorage);
const works=read(runtimePaths.workLibraryHierarchy);
const events=read(runtimePaths.eventBindings);
const app=read('web/app.js');
const schema=JSON.parse(read('schema/manga-blueprint.schema.json'));

assert.equal(runtimePaths.workLibraryHierarchy,'web/runtime/authoring/work-library-hierarchy.js');
const order=Object.fromEntries(runtimeLoadOrder.map((key,index)=>[key,index]));
assert.ok(order.pageNavigation<order.workLibraryHierarchy&&order.workLibraryHierarchy<order.pageLayoutCamera,'work hierarchy runtime must load after page navigation and before later authoring wrappers');
assert.ok(app.includes("['authoring/work-library-hierarchy', './runtime/authoring/work-library-hierarchy.js']"));

for(const phrase of [
  'async load(workId)',
  '// Saving work contents must never change which work is active.',
  'async setActive(workId)',
  'container.parentId=null',
  "page.containerId=typeof page.containerId==='string'&&containerMap.has(page.containerId)?page.containerId:null",
  "characters:(panel.characters||[]).map(character=>({...character,id:uid('char')}))",
  "balloons:(panel.balloons||[]).map(balloon=>({...balloon,id:uid('balloon')}))"
])assert.ok(storage.includes(phrase),`storage missing Phase 2 contract: ${phrase}`);

const saveBody=storage.slice(storage.indexOf('async save(input)'),storage.indexOf('async has(workId)'));
assert.ok(saveBody.includes('PROJECT_WORK_STORE'));
assert.ok(!saveBody.includes('ACTIVE_WORK_META_KEY'),'ordinary autosave must not change active work');

for(const phrase of [
  'async function openStoredWork16(workId',
  'async function createWork16()',
  'async function renameWork16(workId)',
  'async function duplicateWork16(workId)',
  'async function deleteWork16(workId)',
  'await saveCurrentWorkNow16()',
  'await projectStorage.setActive(normalized.meta.workId)',
  'function addContainer16()',
  'function changeContainerParent16(parentId)',
  'function moveContainer16(delta)',
  'function deleteContainer16()',
  'page.containerId=event.target.value||null',
  'project.pages.forEach(page=>{if(page.containerId===container.id)page.containerId=parentId;})',
  'project.containers.forEach(item=>{if(item.parentId===container.id)item.parentId=parentId;})',
  "if(!confirm(active?whText16('deleteActiveWorkConfirm'):whText16('deleteWorkConfirm')))return"
])assert.ok(works.includes(phrase),`work library/hierarchy missing contract: ${phrase}`);

assert.ok(events.includes('await projectStorage.save(incoming)'),'imported work must be persisted immediately');
assert.ok(events.includes('await projectStorage.setActive(incoming.meta.workId)'),'imported work must be explicitly activated');

const containerDef=schema.$defs?.container?.properties||{};
assert.deepEqual(containerDef.kind?.enum,['volume','chapter','folder']);
assert.ok(Array.isArray(containerDef.parentId?.type)&&containerDef.parentId.type.includes('null'));

const context={console,Math,Date,setTimeout,clearTimeout,structuredClone,indexedDB:undefined,document:{getElementById(){return null;}}};
context.globalThis=context;
vm.runInNewContext(`${foundation}\n${storage}\n
const source=createProjectWithIdentity();
source.containers=[
  {id:'volume-a',kind:'volume',title:'V1',order:1,parentId:null},
  {id:'chapter-a',kind:'chapter',title:'C1',order:1,parentId:'volume-a'}
];
source.pages[0].containerId='chapter-a';
source.pages[0].panels[0].characters=[{id:'char-instance',characterId:'hero',name:'Hero',referenceKey:'',x:10,y:10,scale:1,rotation:0,poseId:'stand',expression:{type:'neutral',intensity:.5,notes:''},gaze:{target:'camera',notes:''}}];
source.pages[0].panels[0].balloons=[{id:'balloon-instance',type:'speech',speakerId:'hero',text:'hi',x:20,y:20,size:1}];
const copy=cloneProjectAsNewWork(source);
globalThis.__phase2={
  sourceWork:source.meta.workId,copyWork:copy.meta.workId,
  sourcePage:source.pages[0].id,copyPage:copy.pages[0].id,
  sourcePanel:source.pages[0].panels[0].id,copyPanel:copy.pages[0].panels[0].id,
  sourceChar:source.pages[0].panels[0].characters[0].id,copyChar:copy.pages[0].panels[0].characters[0].id,
  sourceBalloon:source.pages[0].panels[0].balloons[0].id,copyBalloon:copy.pages[0].panels[0].balloons[0].id,
  sourceContainer:source.containers[0].id,copyContainer:copy.containers[0].id,
  copiedPageContainer:copy.pages[0].containerId,copiedChapter:copy.containers[1].id,copiedParent:copy.containers[1].parentId
};`,context);
const result=context.__phase2;
for(const pair of [['sourceWork','copyWork'],['sourcePage','copyPage'],['sourcePanel','copyPanel'],['sourceChar','copyChar'],['sourceBalloon','copyBalloon'],['sourceContainer','copyContainer']])assert.notEqual(result[pair[0]],result[pair[1]],`${pair[1]} must get fresh identity`);
assert.equal(result.copiedPageContainer,result.copiedChapter,'copied page must point at copied container');
assert.equal(result.copiedParent,result.copyContainer,'copied hierarchy parent must point at copied parent container');

console.log('Work library / hierarchy contract validation passed.');
