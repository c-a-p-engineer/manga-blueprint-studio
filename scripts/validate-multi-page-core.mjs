import fs from 'node:fs';
import {runtimePaths, runtimeLoadOrder} from './runtime-paths.mjs';

const read = path => fs.readFileSync(path,'utf8');
const schema = JSON.parse(read('schema/manga-blueprint.schema.json'));
const storage = read(runtimePaths.projectStorage);
const editor = read(runtimePaths.editorState);
const pages = read(runtimePaths.pageNavigation);

if(runtimePaths.projectStorage!=='web/runtime/core/project-storage.js')throw new Error('projectStorage runtime owner is not registered');
if(runtimePaths.pageNavigation!=='web/runtime/authoring/page-navigation.js')throw new Error('pageNavigation runtime owner is not registered');
for(const key of ['projectStorage','editorState','eventBindings','pageNavigation','pageLayoutCamera']){
  if(!runtimeLoadOrder.includes(key))throw new Error(`runtimeLoadOrder missing ${key}`);
}
const order = Object.fromEntries(runtimeLoadOrder.map((key,index)=>[key,index]));
if(!(order.projectStorage < order.editorState && order.eventBindings < order.pageNavigation && order.pageNavigation < order.pageLayoutCamera)){
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
  'const activePageMetaKey = workId =>',
  'async getActivePageId(workId)',
  'async setActivePage(workId,pageId)',
  'metaStore.delete(activePageMetaKey(workId))',
  "page.title=typeof page.title==='string'?page.title:''"
]){
  if(!storage.includes(phrase))throw new Error(`Project storage missing multi-page contract: ${phrase}`);
}

if(!editor.includes("let selectedPageId=project.pages[0]?.id||null"))throw new Error('Editor state must track selectedPageId');
if(!editor.includes("const currentPage = () => project.pages.find(page=>page.id===selectedPageId)||project.pages[0]||null")){
  throw new Error('currentPage() must resolve from selectedPageId');
}
if(!editor.includes("if(!project.pages.some(page=>page.id===selectedPageId))selectedPageId=project.pages[0]?.id||null")){
  throw new Error('Undo/Redo restore must repair stale selectedPageId');
}

for(const phrase of [
  'function addPage15()',
  'function duplicatePage15()',
  'function deletePage15()',
  'function movePage15(delta)',
  'function renumberPageNumbers15()',
  'function updatePageNumber15(value)',
  'function updatePageTitle15(value)',
  "if(project.pages.length<=1)",
  "next.id=uid('page')",
  "next.id=uid('panel')",
  "id:uid('char')",
  "id:uid('balloon')",
  'projectStorage.getActivePageId(project.meta.workId)',
  'projectStorage.setActivePage(project.meta.workId,selectedPageId)',
  'suppressPageSelectionPersist15=true',
  'suppressPageSelectionPersist15=false'
]){
  if(!pages.includes(phrase))throw new Error(`Page navigation missing contract: ${phrase}`);
}

const rememberIndex=pages.indexOf('projectStorage.getActivePageId(project.meta.workId)');
const enablePersistIndex=pages.indexOf('suppressPageSelectionPersist15=false');
if(rememberIndex<0||enablePersistIndex<0||rememberIndex>enablePersistIndex){
  throw new Error('Remembered page must be restored before page-selection persistence is enabled');
}

if(!pages.includes("if(project.pages.some(candidate=>candidate.id!==page.id&&candidate.pageNumber===number))")){
  throw new Error('Manual page-number editing must reject duplicates');
}
if(!pages.includes("[pages[index],pages[target]]=[pages[target],pages[index]]")){
  throw new Error('Page reordering contract missing');
}
if(!pages.includes("@media(max-width:680px)"))throw new Error('Page manager must include narrow-screen layout handling');

console.log('Multi-page core contract validation passed.');
