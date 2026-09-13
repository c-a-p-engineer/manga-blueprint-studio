import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {runtimeManifest,runtimeLoadOrder,runtimePaths} from './runtime-paths.mjs';
import {requireRuntimeCapability,runtimeFamilySource} from './contract-source.mjs';

const read=path=>fs.readFileSync(path,'utf8');
const foundation=read(runtimePaths.foundation);
const storage=read(runtimePaths.projectStorage);
const coreSource=runtimeFamilySource('core/');
const authoringAndCore=runtimeFamilySource('core/','authoring/');
const main=read('web/src/main.ts');
const bridge=read('web/src/runtime/legacy-api.ts');

assert.equal(runtimeLoadOrder[0],'foundation');
assert.equal(runtimeLoadOrder[1],'projectStorage');
assert.ok(runtimeLoadOrder.includes('editorState'));
assert.ok(runtimeLoadOrder.includes('editorPersistence'));
assert.ok(runtimeLoadOrder.indexOf('editorPersistence')<runtimeLoadOrder.indexOf('eventBindings'));
assert.equal(runtimeManifest.find(entry=>entry.key==='projectStorage')?.id,'core/project-storage');
assert.equal(runtimeManifest.find(entry=>entry.key==='projectStorage')?.path,'runtime/core/project-storage.js');
assert.ok(main.includes('await initializeLegacyEditor()'));
assert.ok(bridge.includes('runtime.initializeEditorState'));

assert.ok(!coreSource.includes('function loadAutosave()'),'project autosave must not bootstrap from localStorage');
assert.ok(!coreSource.includes('localStorage.setItem(STORAGE_KEY'),'project autosave must not write project state to localStorage');
requireRuntimeCapability('selectedPageId',{prefixes:['core/'],label:'stable selected-page editor state'});
requireRuntimeCapability('currentPage',{prefixes:['core/'],label:'selected-page resolver'});
requireRuntimeCapability('queueProjectSave(project',{prefixes:['core/'],label:'project-storage autosave adapter usage'});
requireRuntimeCapability('projectStorage.loadActive()',{prefixes:['core/'],label:'active-work restore path'});

for(const phrase of ['projectStorage.has(incoming.meta.workId)','cloneProjectAsNewWork(incoming)']){
  assert.ok(authoringAndCore.includes(phrase),`Import contract missing across registered core/authoring owners: ${phrase}`);
}
assert.ok(authoringAndCore.includes('既存作品を上書き'),'Import must expose an explicit overwrite choice');

const context={
  console,Math,Date,setTimeout,clearTimeout,structuredClone,indexedDB:undefined,
  document:{getElementById(){return null;}}
};
context.globalThis=context;
vm.runInNewContext(`${foundation}\n${storage}\n
const created=createProjectWithIdentity();
const duplicate=ensureProjectIdentity({
  format:'manga-blueprint/0.2',
  meta:{title:'T',readingDirection:'rtl',pageWidth:800,pageHeight:1130},
  pages:[{id:'same',panels:[]},{id:'same',panels:[]},{panels:[]}]
});
const copied=cloneProjectAsNewWork(created);
globalThis.__projectStorageValidation={
  createdWorkId:created.meta.workId,
  createdPageId:created.pages[0].id,
  createdPageNumber:created.pages[0].pageNumber,
  createdPageOrder:created.pages[0].order,
  createdContainerId:created.pages[0].containerId,
  duplicatePageIds:duplicate.pages.map(page=>page.id),
  duplicateNumbers:duplicate.pages.map(page=>page.pageNumber),
  copiedWorkId:copied.meta.workId,
  copiedPageId:copied.pages[0].id,
  storageSupported:projectStorage.supported()
};
`,context);

const result=context.__projectStorageValidation;
assert.ok(result.createdWorkId?.startsWith('work_'));
assert.ok(result.createdPageId?.startsWith('page_'));
assert.equal(result.createdPageNumber,1);
assert.equal(result.createdPageOrder,1);
assert.equal(result.createdContainerId,null);
assert.equal(new Set(result.duplicatePageIds).size,3,'page IDs must be unique within a work');
assert.deepEqual([...result.duplicateNumbers],[1,2,3]);
assert.notEqual(result.copiedWorkId,result.createdWorkId,'copy import must get a new work ID');
assert.notEqual(result.copiedPageId,result.createdPageId,'copied work pages must get new page IDs');
assert.equal(result.storageSupported,false,'validator deliberately runs without IndexedDB');

console.log('Project storage foundation validation passed with semantic-owner discovery plus executable identity checks.');
