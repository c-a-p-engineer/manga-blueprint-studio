import vm from 'node:vm';
import {readRuntime} from './runtime-paths.mjs';
import {runtimeOwnersContaining} from './contract-source.mjs';

const owners=runtimeOwnersContaining('initializeEditorState',{prefixes:['core/']});
if(owners.length!==1)throw new Error(`Expected one initializeEditorState owner, found: ${owners.join(', ')||'none'}`);
const source=readRuntime(owners[0]);

const loadedProject={
  format:'manga-blueprint/0.2',
  meta:{workId:'work-loaded',title:'Loaded',readingDirection:'rtl',pageWidth:800,pageHeight:1130},
  containers:[],characterLibrary:[],
  pages:[{id:'page-loaded',pageNumber:1,order:1,title:'',containerId:null,panels:[{id:'panel-loaded'}]}]
};
const clone=value=>JSON.parse(JSON.stringify(value));
const status={textContent:''};
const calls={loadActive:0,setActive:0,saveQueue:0,resetHistory:0,render:0};
let queued=null;

const context=vm.createContext({
  console,Date,
  project:clone(loadedProject),
  selectedPageId:null,selectedPanelId:null,selectedCharacterId:'old-char',selectedBalloonId:'old-balloon',
  ensureProjectIdentity:input=>clone(input),
  createProjectWithIdentity:()=>clone(loadedProject),
  currentPage(){return this.project.pages.find(page=>page.id===this.selectedPageId)||this.project.pages[0]||null;},
  projectStorage:{
    supported:()=>true,
    async loadActive(){calls.loadActive+=1;return clone(loadedProject);},
    async setActive(){calls.setActive+=1;throw new Error('initialize/autosave must not activate a work');}
  },
  resetEditorHistory:()=>{calls.resetHistory+=1;},
  render:()=>{calls.render+=1;},
  queueProjectSave:(project,options)=>{calls.saveQueue+=1;queued={project:clone(project),options};},
  $:id=>id==='saveStatus'?status:{textContent:''},
  __calls:calls
});

vm.runInContext(source,context,{filename:`runtime:${owners[0]}`});
const evaluate=expression=>vm.runInContext(expression,context);
const assert=(condition,message)=>{if(!condition)throw new Error(message);};

await evaluate('initializeEditorState()');
assert(calls.loadActive===1,'initializeEditorState must load the explicitly active work exactly once');
assert(calls.setActive===0,'initialization must not rewrite active-work metadata');
assert(evaluate('project.meta.workId')==='work-loaded','loaded active work was not installed');
assert(evaluate('selectedPageId')==='page-loaded','initialization must select a valid page from the loaded work');
assert(evaluate('selectedPanelId')==='panel-loaded','initialization must select a valid panel from the loaded page');
assert(evaluate('selectedCharacterId')===null&&evaluate('selectedBalloonId')===null,'initialization must clear instance selections');
assert(calls.resetHistory===1,'work initialization must reset editor history');
assert(calls.render===1,'work initialization must render once');
assert(evaluate('persistenceReady')===true,'successful storage initialization must enable autosave');

evaluate('save()');
assert(calls.saveQueue===1,'autosave must queue one project save');
assert(calls.setActive===0,'ordinary autosave must not activate or reactivate a work');
assert(queued?.project?.meta?.workId==='work-loaded','autosave queued the wrong work identity');
queued.options.onSaved('work-loaded');
assert(status.textContent.startsWith('saved '),'successful autosave callback must update status for the same work');

console.log('Editor persistence behavior passed: active-work load, selection reset, history reset, and save-without-activation.');
