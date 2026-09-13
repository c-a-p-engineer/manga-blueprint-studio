import fs from 'node:fs';
import vm from 'node:vm';

const stateSource=fs.readFileSync('web/runtime/core/editor-state.js','utf8');
const commandSource=fs.readFileSync('web/runtime/core/editor-commands.js','utf8');

const initialProject={
  format:'manga-blueprint/0.2',
  meta:{workId:'work-a',title:'Original',readingDirection:'rtl',pageWidth:800,pageHeight:1130},
  containers:[],
  characterLibrary:[],
  pages:[{
    id:'page-a',pageNumber:1,order:1,title:'',containerId:null,
    panels:[{
      id:'panel-a',order:1,rect:{x:35,y:35,w:730,h:1060},role:'setup',
      style:{border:'normal',bleed:'none',breakout:'none'},
      camera:{distance:'medium',angle:'eye-level',viewpoint:'front',focus:'',intent:''},
      background:{location:'',timeOfDay:'',weather:'',mood:'',detailLevel:'medium',renderMode:'normal',notes:''},
      effects:{lineEffect:'none',strength:'medium',sfxText:'',sfxStyle:'impact',notes:''},
      characters:[],balloons:[]
    }]
  }]
};

let renderCount=0;
const clone=value=>JSON.parse(JSON.stringify(value));
const context=vm.createContext({
  createProjectWithIdentity:()=>clone(initialProject),
  ensureProjectIdentity:input=>clone(input),
  localStorage:{getItem:()=>null},
  LANG_KEY:'lang',
  HISTORY_LIMIT:50,
  render:()=>{renderCount+=1;},
  posePresets:{stand:{ja:'立つ',en:'Stand'}},
  i18n:{ja:{}},
  console,
  JSON,
  Math,
  structuredClone:clone,
  confirm:()=>true,
  alert:()=>{},
  GUTTER:18,
  clone,
  uid:prefix=>`${prefix}-test`,
  templates:{action3:[]},
  makePanel:()=>({}),
  document:{documentElement:{lang:'ja'},querySelectorAll:()=>[]},
  $:()=>({value:'',textContent:''})
});

vm.runInContext(stateSource,context,{filename:'editor-state.js'});
vm.runInContext(commandSource,context,{filename:'editor-commands.js'});

const evaluate=expression=>vm.runInContext(expression,context);
const assert=(condition,message)=>{if(!condition)throw new Error(message);};

assert(evaluate('project.meta.title')==='Original','Initial project title mismatch');
evaluate("mutate(()=>{project.meta.title='Changed';})");
assert(evaluate('project.meta.title')==='Changed','mutate() did not apply command');
assert(evaluate('history.length')===1,'mutate() did not create one history entry');
assert(renderCount===1,'mutate() must render once');

evaluate('undo()');
assert(evaluate('project.meta.title')==='Original','undo() did not restore previous project state');
assert(evaluate('future.length')===1,'undo() did not populate redo history');
assert(renderCount===2,'undo() must render restored state');

evaluate('redo()');
assert(evaluate('project.meta.title')==='Changed','redo() did not restore changed project state');
assert(evaluate('history.length')===1,'redo() must restore undo history');
assert(renderCount===3,'redo() must render restored state');

evaluate("mutate(()=>{project.meta.title='Changed again';})");
assert(evaluate('future.length')===0,'new mutation must clear redo history');
assert(evaluate('history.length')===2,'second mutation must append history');

evaluate('resetEditorHistory()');
assert(evaluate('history.length')===0&&evaluate('future.length')===0,'resetEditorHistory() did not clear command history');

console.log('Editor command behavior passed: mutate, Undo, Redo, redo invalidation, and history reset.');
