import fs from 'node:fs';
import {runtimeLoadOrder,runtimePaths} from './runtime-paths.mjs';

const shellPath=runtimePaths.editorShell;
if(shellPath!=='web/runtime/ui/editor-shell.js')throw new Error(`Unexpected editor shell path: ${shellPath}`);
if(runtimeLoadOrder.at(-1)!=='editorShell')throw new Error('Editor shell must run last so it can organize the fully-constructed authoring UI.');

const shell=fs.readFileSync(shellPath,'utf8');
const phaseOneUi=fs.readFileSync('web/src/phase-one-ui.ts','utf8');
const phaseOneCss=fs.readFileSync('web/src/phase-one-ui.css','utf8');
for(const phrase of [
  "padStart(3,'0')",
  "workLibrary:'作品管理'",
  "structure:'作品エクスプローラー'",
  "tabPage:'ページ設定'",
  "artNotes:'追加の画風・仕上げ指示（任意）'",
  "workRoot:'作品直下'",
  "pageManagerSlot17",
  "structureTree17",
  "explorerWorks17",
  "newWorkExplorer17",
  "openStoredWork16",
  "currentWorkButton17"
]){
  if(!shell.includes(phrase))throw new Error(`Editor shell contract missing ${JSON.stringify(phrase)}`);
}
if(shell.includes('structureEditSummary17')||shell.includes('containerManagerSlot17'))throw new Error('Dedicated volume/chapter/folder editor must not remain in the primary work explorer.');

for(const phrase of [
  "byId('containerManager16')?.remove()",
  'runtime.renderHierarchy16=removeLegacy',
  "copy('テンプレートからページを作る'",
  'ensureManualLayoutDisclosure'
]){
  if(!phaseOneUi.includes(phrase))throw new Error(`Phase 1 primary UI contract missing ${JSON.stringify(phrase)}`);
}
if(!phaseOneCss.includes('#containerManager16{display:none!important}'))throw new Error('Legacy hierarchy editor must have a CSS fail-safe in Phase 1 UI.');

const workHierarchy=fs.readFileSync('web/runtime/authoring/work-library-hierarchy.js','utf8');
const pageNavigation=fs.readFileSync('web/runtime/authoring/page-navigation.js','utf8');
if(!workHierarchy.includes("volume:'巻'")||!workHierarchy.includes("chapter:'章'")||!workHierarchy.includes("folder:'フォルダ'"))throw new Error('Existing hierarchy data semantics were unexpectedly removed.');
if(!pageNavigation.includes('pageNumber'))throw new Error('Stable page-number source is missing.');

console.log('Manga-first editor shell / explorer / Phase 1 primary-UI contract passed.');
