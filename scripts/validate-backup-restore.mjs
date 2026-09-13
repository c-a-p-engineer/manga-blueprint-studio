import fs from 'node:fs';
import vm from 'node:vm';
import {readRuntime,runtimeLoadOrder,runtimePaths} from './runtime-paths.mjs';
import {requireRuntimeCapability,requireText} from './contract-source.mjs';

const ownerPath=runtimePaths.backupRestore;
if(ownerPath!=='web/runtime/integration/backup-restore.js')throw new Error(`Unexpected backup/restore owner: ${ownerPath}`);
const source=readRuntime('backupRestore');
const storage=readRuntime('projectStorage');
const order=Object.fromEntries(runtimeLoadOrder.map((key,index)=>[key,index]));
if(!(order.projectStorage<order.backupRestore&&order.characterLibraryExport<order.backupRestore&&order.templateStudio<order.backupRestore&&order.backupRestore<order.editorShell)){
  throw new Error('Backup/restore runtime load order does not satisfy its storage/ZIP/template/UI dependencies.');
}

for(const [fragment,label] of [
  ["manga-blueprint-backup-manifest/1",'backup manifest schema'],
  ["BACKUP_PACKAGE_TYPE_20='work-backup'",'backup package type'],
  ["BACKUP_MANIFEST_PATH_20='backup-manifest.json'",'backup manifest path'],
  ["BACKUP_PROJECT_PATH_20='project.manga.json'",'backup project path'],
  ['backupSha256Bytes20','raw-byte SHA-256 verification'],
  ['crc3206(data)!==expectedCrc','ZIP CRC verification'],
  ['validateBackupProjectShape20','pre-mutation project shape validation'],
  ['cloneAsAvailableWork20','copy restore identity regeneration'],
  ['settleProjectSaveQueue()','autosave settlement before restore'],
  ['projectStorage.saveAndActivate','atomic work + activation persistence'],
  ['globalThis.MANGA_BLUEPRINT_BACKUP_RESTORE','typed compatibility service export']
])requireText(source,fragment,label);

requireText(storage,'async saveAndActivate(input,pageId=null)','explicit save-and-activate transaction');
requireText(storage,"db.transaction([PROJECT_WORK_STORE,PROJECT_META_STORE],'readwrite')",'cross-store IndexedDB transaction');
requireText(storage,'async function settleProjectSaveQueue()','queued autosave settlement');
requireText(storage,'queuedProjectSaveInFlight','in-flight autosave tracking');
requireRuntimeCapability('cloneProjectAsNewWork',{prefixes:['core/'],label:'work identity remapping'});

if(source.includes('manga-blueprint-export-manifest/3'))throw new Error('Backup service must not reuse the AI export manifest schema.');
if(source.includes('prompt('))throw new Error('Conflict-choice presentation belongs to typed UI, not the backup domain service.');

const legacyApi=fs.readFileSync('web/src/runtime/legacy-api.ts','utf8');
const main=fs.readFileSync('web/src/main.ts','utf8');
const ui=fs.readFileSync('web/src/ui/backup-restore.ts','utf8');
for(const token of ['BackupRestoreApi','BackupInspection','getBackupRestoreApi','MANGA_BLUEPRINT_BACKUP_RESTORE'])requireText(legacyApi,token,'typed backup adapter');
requireText(main,'installBackupRestoreUi()','backup UI bootstrap');
for(const token of ['previewText','chooseRestoreMode','value="copy"','value="overwrite"','confirm(','api.inspect(file)','api.restore(inspection,mode)'])requireText(ui,token,'typed restore interaction');

const oldProject={
  format:'manga-blueprint/0.2',
  meta:{workId:'work-old',title:'Old',readingDirection:'rtl',pageWidth:800,pageHeight:1130},
  containers:[],characterLibrary:[],
  pages:[{id:'page-old',pageNumber:1,order:1,containerId:null,title:'',panels:[]}]
};
const incomingProject={
  format:'manga-blueprint/0.2',
  meta:{workId:'work-new',title:'Incoming',readingDirection:'rtl',pageWidth:800,pageHeight:1130},
  containers:[],characterLibrary:[],
  pages:[{id:'page-new',pageNumber:1,order:1,containerId:null,title:'',panels:[]}]
};
const clone=value=>structuredClone(value);
const calls={settle:0,save:[],activate:[],remove:[],history:0,render:0,templates:[]};
let templates=[{id:'local',name:'Local'},{id:'shared',name:'Old'}];
let failFirstActivation=false;
let activationCalls=0;
const context=vm.createContext({
  console,Date,TextEncoder,TextDecoder,DataView,Uint8Array,Map,Blob,crypto:globalThis.crypto,Object,Number,String,Array,Error,Promise,
  project:clone(oldProject),
  selectedPageId:'page-old',selectedPanelId:null,selectedCharacterId:null,selectedBalloonId:null,
  clone,
  ensureProjectIdentity:clone,
  cloneProjectAsNewWork:input=>{
    const next=clone(input);next.meta.workId='work-copy';next.pages[0].id='page-copy';return next;
  },
  loadCustomTemplates13:()=>clone(templates),
  saveCustomTemplates13:value=>{templates=clone(value);calls.templates.push(clone(value));},
  registerCustomTemplates13:()=>{},
  settleProjectSaveQueue:async()=>{calls.settle+=1;},
  resetEditorHistory:()=>{calls.history+=1;},
  render:()=>{calls.render+=1;},
  currentPage:()=>context.project.pages.find(page=>page.id===context.selectedPageId)||context.project.pages[0]||null,
  safeFileStem06:value=>String(value||'manga'),timestamp06:()=> '20260913_000000',zipStore06:async()=>new Blob(),crc3206:()=>0,
  projectStorage:{
    supported:()=>true,
    async has(workId){return workId==='work-old';},
    async load(workId){return workId==='work-old'?clone(oldProject):null;},
    async save(value){calls.save.push(value.meta.workId);return value.meta.workId;},
    async saveAndActivate(value,pageId){
      activationCalls+=1;calls.activate.push([value.meta.workId,pageId]);
      if(failFirstActivation&&activationCalls===1)throw new Error('injected activation failure');
      return {workId:value.meta.workId,pageId:pageId||value.pages[0]?.id||null};
    },
    async remove(workId){calls.remove.push(workId);}
  }
});
context.globalThis=context;
vm.runInContext(source,context,{filename:'runtime:backupRestore'});
const evaluate=expression=>vm.runInContext(expression,context);
const assert=(condition,message)=>{if(!condition)throw new Error(message);};

const merged=evaluate("mergeCustomTemplates20([{id:'keep',v:1},{id:'shared',v:1}],[{id:'shared',v:2},{id:'new',v:3}])");
assert(merged.length===3,'custom template merge must preserve unrelated entries and add incoming entries');
assert(merged.find(item=>item.id==='shared')?.v===2,'incoming custom template must replace matching ID');

const validShape={
  format:'manga-blueprint/0.2',meta:{workId:'work-shape'},containers:[],characterLibrary:[],
  pages:[{id:'page-a',panels:[{id:'panel-a',rect:{x:0,y:0,w:100,h:100},characters:[{id:'char-a'}],balloons:[{id:'balloon-a'}]}]}]
};
context.__shape=validShape;
evaluate('validateBackupProjectShape20(__shape)');
context.__duplicate=clone(validShape);context.__duplicate.pages[0].panels[0].id='page-a';
let duplicateRejected=false;
try{evaluate('validateBackupProjectShape20(__duplicate)')}catch{duplicateRejected=true;}
assert(duplicateRejected,'backup validation must reject duplicate stable identity before normalization');

context.__inspection={
  manifest:{activePageId:'page-new'},project:clone(incomingProject),customTemplates:[{id:'shared',name:'Updated'}],conflict:false
};
await evaluate("globalThis.MANGA_BLUEPRINT_BACKUP_RESTORE.restore(__inspection,'restore')");
assert(calls.settle===1,'restore must settle pending/in-flight autosave first');
assert(calls.save.includes('work-old'),'restore must persist latest current work before switching');
assert(calls.activate.some(([workId,pageId])=>workId==='work-new'&&pageId==='page-new'),'restore must atomically persist and activate the incoming work/page');
assert(evaluate('project.meta.workId')==='work-new','successful restore must install incoming project in editor state');
assert(templates.find(item=>item.id==='local'),'custom template restore must preserve unrelated local templates');
assert(templates.find(item=>item.id==='shared')?.name==='Updated','custom template restore must update matching IDs');

// Failure after validation must return the editor to its previous work and remove a newly-created target.
context.project=clone(oldProject);context.selectedPageId='page-old';templates=[{id:'local',name:'Local'}];
calls.remove.length=0;calls.activate.length=0;activationCalls=0;failFirstActivation=true;
context.__inspection={manifest:{activePageId:'page-new'},project:clone(incomingProject),customTemplates:null,conflict:false};
let failed=false;
try{await evaluate("globalThis.MANGA_BLUEPRINT_BACKUP_RESTORE.restore(__inspection,'restore')")}catch{failed=true;}
assert(failed,'injected restore failure must surface to caller');
assert(calls.remove.includes('work-new'),'failed restore must remove a newly-created target work');
assert(calls.activate.some(([workId])=>workId==='work-old'),'failed restore must reactivate the previous work');
assert(evaluate('project.meta.workId')==='work-old','failed restore must restore prior in-memory project');

console.log('Phase 3 backup/restore contract passed: dedicated package, typed UI boundary, integrity checks, identity-safe conflict handling, autosave settlement, and rollback behavior.');
