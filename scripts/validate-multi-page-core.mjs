import fs from 'node:fs';
import {runtimePaths,runtimeLoadOrder} from './runtime-paths.mjs';
import {requireRuntimeCapability,runtimeFamilySource} from './contract-source.mjs';

const read=path=>fs.readFileSync(path,'utf8');
const schema=JSON.parse(read('schema/manga-blueprint.schema.json'));
const coreSource=runtimeFamilySource('core/');
const authoringSource=runtimeFamilySource('authoring/');

if(runtimePaths.projectStorage!=='web/runtime/core/project-storage.js')throw new Error('projectStorage runtime owner is not registered');
if(!runtimeLoadOrder.includes('pageNavigation'))throw new Error('pageNavigation semantic owner is not registered');
for(const key of ['projectStorage','editorState','editorCommands','eventBindings','pageNavigation','pageLayoutCamera']){
  if(!runtimeLoadOrder.includes(key))throw new Error(`runtimeLoadOrder missing ${key}`);
}
const order=Object.fromEntries(runtimeLoadOrder.map((key,index)=>[key,index]));
if(!(order.projectStorage<order.editorState&&order.editorState<order.editorCommands&&order.eventBindings<order.pageNavigation&&order.pageNavigation<order.pageLayoutCamera)){
  throw new Error('Multi-page runtime load order is invalid');
}

const pageDef=schema.$defs?.page?.properties||{};
for(const [field,type] of [['pageNumber','integer'],['order','integer'],['title','string']]){
  if(pageDef[field]?.type!==type)throw new Error(`Schema missing page.${field} ${type}`);
}
const containerType=pageDef.containerId?.type;
if(!(Array.isArray(containerType)&&containerType.includes('string')&&containerType.includes('null'))){
  throw new Error('Schema missing nullable page.containerId');
}

for(const phrase of [
  'activePageMetaKey',
  'getActivePageId(workId)',
  'setActivePage(workId,pageId)',
  'metaStore.delete(activePageMetaKey(workId))'
]){
  if(!coreSource.includes(phrase))throw new Error(`Registered core owners missing multi-page persistence contract: ${phrase}`);
}
requireRuntimeCapability('selectedPageId',{prefixes:['core/'],label:'selected-page state'});
requireRuntimeCapability('currentPage',{prefixes:['core/'],label:'current-page resolver'});
requireRuntimeCapability('resetEditorHistory',{prefixes:['core/'],label:'history reset at work boundary'});

for(const phrase of [
  'function addPage15()',
  'function duplicatePage15()',
  'function deletePage15()',
  'function movePage15(delta)',
  'function renumberPageNumbers15()',
  'function updatePageNumber15(value)',
  'function updatePageTitle15(value)',
  'projectStorage.getActivePageId(project.meta.workId)',
  'projectStorage.setActivePage(project.meta.workId,selectedPageId)',
  'suppressPageSelectionPersist15=true',
  'suppressPageSelectionPersist15=false'
]){
  if(!authoringSource.includes(phrase))throw new Error(`Registered authoring owners missing page-management contract: ${phrase}`);
}

for(const identityToken of ["uid('page')","uid('panel')","uid('char')","uid('balloon')"]){
  if(!authoringSource.includes(identityToken))throw new Error(`Page duplication must regenerate ${identityToken}`);
}
if(!authoringSource.includes('project.pages.length<=1'))throw new Error('Final-page deletion protection missing');
if(!authoringSource.includes('candidate.pageNumber===number'))throw new Error('Manual page-number editing must reject duplicates');
if(!authoringSource.includes('[pages[index],pages[target]]=[pages[target],pages[index]]'))throw new Error('Page reordering contract missing');

const rememberIndex=authoringSource.indexOf('projectStorage.getActivePageId(project.meta.workId)');
const enablePersistIndex=authoringSource.indexOf('suppressPageSelectionPersist15=false');
if(rememberIndex<0||enablePersistIndex<0||rememberIndex>enablePersistIndex){
  throw new Error('Remembered page must be restored before page-selection persistence is enabled');
}
if(!authoringSource.includes('@media(max-width:680px)'))throw new Error('Page manager must include narrow-screen layout handling');

console.log('Multi-page core contract passed using schema checks, executable current-page coverage, and registered semantic-owner families.');
