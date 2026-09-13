import fs from 'node:fs';
import {runtimeLoadOrder,readRuntimeSet} from './runtime-paths.mjs';

const sources=readRuntimeSet(['editorState','editorCommands','editorPersistence','editorRender']);
const state=sources.editorState;
const commands=sources.editorCommands;
const persistence=sources.editorPersistence;
const render=sources.editorRender;
const main=fs.readFileSync('web/src/main.ts','utf8');
const ui=fs.readFileSync('web/src/phase-one-ui.ts','utf8');
const workflow=fs.readFileSync('web/src/ui/template-workflow.ts','utf8');
const bridge=fs.readFileSync('web/src/runtime/legacy-api.ts','utf8');
const model=fs.readFileSync('web/src/domain/model.ts','utf8');

const ordered=['editorState','editorCommands','editorPersistence','editorRender','exportInput','eventBindings'];
for(let i=1;i<ordered.length;i++){
  if(runtimeLoadOrder.indexOf(ordered[i-1])>=runtimeLoadOrder.indexOf(ordered[i])){
    throw new Error(`Editor core runtime order is invalid around ${ordered[i-1]} -> ${ordered[i]}`);
  }
}

for(const forbidden of ['let history','let future','let persistenceReady','function renderSvg','function renderCanvas','function renderUi','function render()','async function initializeEditorState']){
  if(state.includes(forbidden))throw new Error(`editor-state.js still owns extracted responsibility: ${forbidden}`);
}
for(const required of ['let history=[]','let future=[]','function undo()','function redo()','function mutate(fn)','function resetEditorHistory()']){
  if(!commands.includes(required))throw new Error(`editor-commands.js missing ${required}`);
}
for(const required of ['let persistenceReady=false','const save=','async function initializeEditorState()','resetEditorHistory()']){
  if(!persistence.includes(required))throw new Error(`editor-persistence.js missing ${required}`);
}
for(const required of ['function renderSvg','function renderCanvas','function renderUi','function render()','manga-blueprint:editor-rendered']){
  if(!render.includes(required))throw new Error(`editor-render.js missing ${required}`);
}

if(!bridge.includes('globalThis'))throw new Error('Legacy runtime bridge must own compatibility global access.');
for(const [name,source] of [['main.ts',main],['phase-one-ui.ts',ui],['template-workflow.ts',workflow]]){
  if(source.includes('globalThis'))throw new Error(`${name} must not access legacy globals directly.`);
}
if(ui.includes('MutationObserver')||workflow.includes('MutationObserver'))throw new Error('Event-driven UI composition regressed to MutationObserver.');

for(const required of ['export type MangaProject','export type MangaPage','export type MangaPanel','export type CharacterInstance','export type Balloon','export type EditorSelection']){
  if(!model.includes(required))throw new Error(`Typed domain model missing ${required}`);
}

console.log('Editor architecture contract passed: typed domain boundary, split core owners, centralized legacy bridge, and event-driven UI composition.');
