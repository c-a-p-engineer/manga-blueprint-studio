import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { runtimeLoadOrder, runtimePaths } from './runtime-paths.mjs';

const read = path => fs.readFileSync(path,'utf8');
const foundation=read(runtimePaths.foundation);
const storage=read(runtimePaths.projectStorage);
const editor=read(runtimePaths.editorState);
const events=read(runtimePaths.eventBindings);
const bootstrap=read('web/src/legacy-runtime.ts');
const main=read('web/src/main.ts');

assert.equal(runtimeLoadOrder[0],'foundation');
assert.equal(runtimeLoadOrder[1],'projectStorage');
assert.equal(runtimeLoadOrder[2],'editorState');
assert.ok(bootstrap.includes("['core/project-storage','runtime/core/project-storage.js']"));
assert.ok(main.includes('await runtime.initializeEditorState()'));

assert.ok(!editor.includes('function loadAutosave()'),'project autosave must not bootstrap from localStorage');
assert.ok(!editor.includes('localStorage.setItem(STORAGE_KEY'),'project autosave must not write project state to localStorage');
assert.ok(editor.includes('selectedPageId'),'editor state must track stable selected page identity');
assert.ok(editor.includes("project.pages.find(page=>page.id===selectedPageId)"),'currentPage must resolve by selected page ID');
assert.ok(editor.includes('queueProjectSave(project'),'editor must persist through the project storage adapter');
assert.ok(events.includes('projectStorage.has(incoming.meta.workId)'),'import must check stable work-ID conflicts');
assert.ok(events.includes('cloneProjectAsNewWork(incoming)'),'import must support copy-on-conflict');
assert.ok(events.includes('既存作品を上書き'),'import must expose an explicit overwrite path');

const context={
  console,
  Math,
  Date,
  setTimeout,
  clearTimeout,
  structuredClone,
  indexedDB:undefined,
  document:{getElementById(){return null;}},
};
context.globalThis=context;
vm.runInNewContext(`${foundation}\n${storage}\n
const created=createProjectWithIdentity();
const duplicate=ensureProjectIdentity({
  format:'manga-blueprint/0.2',
  meta:{title:'T',readingDirection:'rtl',pageWidth:800,pageHeight:1130},
  pages:[
    {id:'same',panels:[]},
    {id:'same',panels:[]},
    {panels:[]}
  ]
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

console.log('Project storage foundation validation passed.');
