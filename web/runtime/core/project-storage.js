const PROJECT_DB_NAME = 'manga-blueprint-studio';
const PROJECT_DB_VERSION = 1;
const PROJECT_WORK_STORE = 'works';
const PROJECT_META_STORE = 'meta';
const ACTIVE_WORK_META_KEY = 'activeWorkId';
const activePageMetaKey = workId => `activePageId:${workId}`;
// Legacy browser project keys such as 'manga-blueprint-studio/0.1' are intentionally not migrated.
// Portable .manga.json import remains the compatibility path; language/custom-template localStorage is separate.

function ensureProjectIdentity(input){
  const p=normalizeProject(input);
  p.meta ||= {};
  p.meta.workId ||= uid('work');
  p.containers = Array.isArray(p.containers) ? p.containers : [];

  const seenPageIds=new Set();
  p.pages.forEach((page,index)=>{
    if(!page.id || seenPageIds.has(page.id)) page.id=uid('page');
    seenPageIds.add(page.id);
    page.pageNumber=Number.isInteger(page.pageNumber)&&page.pageNumber>0?page.pageNumber:index+1;
    page.order=Number.isInteger(page.order)&&page.order>0?page.order:index+1;
    page.containerId=page.containerId??null;
    page.title=typeof page.title==='string'?page.title:'';
  });
  return p;
}

function createProjectWithIdentity(template='action3',workId=null){
  const p=normalizeProject(makeProject(template));
  p.meta.workId=workId||uid('work');
  p.containers=[];
  p.pages.forEach((page,index)=>{
    page.id=uid('page');
    page.pageNumber=index+1;
    page.order=index+1;
    page.containerId=null;
    page.title='';
  });
  return p;
}

function cloneProjectAsNewWork(input){
  const p=ensureProjectIdentity(input);
  p.meta.workId=uid('work');
  p.pages.forEach(page=>{page.id=uid('page');});
  return p;
}

function projectStorageSupported(){
  return typeof indexedDB!=='undefined';
}

function requestResult(request){
  return new Promise((resolve,reject)=>{
    request.onsuccess=()=>resolve(request.result);
    request.onerror=()=>reject(request.error||new Error('IndexedDB request failed'));
  });
}

function transactionDone(transaction){
  return new Promise((resolve,reject)=>{
    transaction.oncomplete=()=>resolve();
    transaction.onabort=()=>reject(transaction.error||new Error('IndexedDB transaction aborted'));
    transaction.onerror=()=>reject(transaction.error||new Error('IndexedDB transaction failed'));
  });
}

let projectDbPromise=null;
function openProjectDb(){
  if(!projectStorageSupported()) return Promise.reject(new Error('IndexedDB is unavailable'));
  if(projectDbPromise) return projectDbPromise;
  projectDbPromise=new Promise((resolve,reject)=>{
    const request=indexedDB.open(PROJECT_DB_NAME,PROJECT_DB_VERSION);
    request.onupgradeneeded=()=>{
      const db=request.result;
      if(!db.objectStoreNames.contains(PROJECT_WORK_STORE)){
        const works=db.createObjectStore(PROJECT_WORK_STORE,{keyPath:'workId'});
        works.createIndex('updatedAt','updatedAt',{unique:false});
        works.createIndex('title','title',{unique:false});
      }
      if(!db.objectStoreNames.contains(PROJECT_META_STORE)){
        db.createObjectStore(PROJECT_META_STORE,{keyPath:'key'});
      }
    };
    request.onsuccess=()=>resolve(request.result);
    request.onerror=()=>reject(request.error||new Error('Unable to open project database'));
    request.onblocked=()=>reject(new Error('Project database upgrade is blocked by another tab'));
  });
  return projectDbPromise;
}

const projectStorage={
  supported:projectStorageSupported,

  async loadActive(){
    if(!projectStorageSupported()) return null;
    const db=await openProjectDb();
    const tx=db.transaction([PROJECT_META_STORE,PROJECT_WORK_STORE],'readonly');
    const metaStore=tx.objectStore(PROJECT_META_STORE);
    const workStore=tx.objectStore(PROJECT_WORK_STORE);
    const active=await requestResult(metaStore.get(ACTIVE_WORK_META_KEY));
    if(!active?.value){ await transactionDone(tx); return null; }
    const record=await requestResult(workStore.get(active.value));
    await transactionDone(tx);
    return record?.project?ensureProjectIdentity(record.project):null;
  },

  async getActivePageId(workId){
    if(!projectStorageSupported()||!workId)return null;
    const db=await openProjectDb();
    const tx=db.transaction(PROJECT_META_STORE,'readonly');
    const record=await requestResult(tx.objectStore(PROJECT_META_STORE).get(activePageMetaKey(workId)));
    await transactionDone(tx);
    return record?.value||null;
  },

  async setActivePage(workId,pageId){
    if(!projectStorageSupported()||!workId)return;
    const db=await openProjectDb();
    const tx=db.transaction(PROJECT_META_STORE,'readwrite');
    tx.objectStore(PROJECT_META_STORE).put({key:activePageMetaKey(workId),value:pageId||null});
    await transactionDone(tx);
  },

  async save(input){
    if(!projectStorageSupported()) throw new Error('IndexedDB is unavailable');
    const project=ensureProjectIdentity(input);
    const db=await openProjectDb();
    const tx=db.transaction([PROJECT_META_STORE,PROJECT_WORK_STORE],'readwrite');
    tx.objectStore(PROJECT_WORK_STORE).put({
      workId:project.meta.workId,
      title:project.meta.title||'',
      updatedAt:Date.now(),
      project:clone(project)
    });
    tx.objectStore(PROJECT_META_STORE).put({key:ACTIVE_WORK_META_KEY,value:project.meta.workId});
    await transactionDone(tx);
    return project.meta.workId;
  },

  async has(workId){
    if(!projectStorageSupported()||!workId) return false;
    const db=await openProjectDb();
    const tx=db.transaction(PROJECT_WORK_STORE,'readonly');
    const result=await requestResult(tx.objectStore(PROJECT_WORK_STORE).getKey(workId));
    await transactionDone(tx);
    return result!==undefined;
  },

  async list(){
    if(!projectStorageSupported()) return [];
    const db=await openProjectDb();
    const tx=db.transaction(PROJECT_WORK_STORE,'readonly');
    const rows=await requestResult(tx.objectStore(PROJECT_WORK_STORE).getAll());
    await transactionDone(tx);
    return rows
      .map(row=>({workId:row.workId,title:row.title||'',updatedAt:row.updatedAt||0,pageCount:row.project?.pages?.length||0}))
      .sort((a,b)=>b.updatedAt-a.updatedAt);
  },

  async setActive(workId){
    if(!projectStorageSupported()) throw new Error('IndexedDB is unavailable');
    const db=await openProjectDb();
    const tx=db.transaction(PROJECT_META_STORE,'readwrite');
    tx.objectStore(PROJECT_META_STORE).put({key:ACTIVE_WORK_META_KEY,value:workId||null});
    await transactionDone(tx);
  },

  async remove(workId){
    if(!projectStorageSupported()||!workId) return;
    const db=await openProjectDb();
    const tx=db.transaction([PROJECT_META_STORE,PROJECT_WORK_STORE],'readwrite');
    const metaStore=tx.objectStore(PROJECT_META_STORE);
    const active=await requestResult(metaStore.get(ACTIVE_WORK_META_KEY));
    tx.objectStore(PROJECT_WORK_STORE).delete(workId);
    metaStore.delete(activePageMetaKey(workId));
    if(active?.value===workId) metaStore.put({key:ACTIVE_WORK_META_KEY,value:null});
    await transactionDone(tx);
  }
};

let queuedProjectSaveTimer=null;
function queueProjectSave(input,{delay=120,onSaved,onError}={}){
  if(!projectStorageSupported()){
    onError?.(new Error('IndexedDB is unavailable'));
    return;
  }
  const snapshot=ensureProjectIdentity(clone(input));
  clearTimeout(queuedProjectSaveTimer);
  queuedProjectSaveTimer=setTimeout(()=>{
    projectStorage.save(snapshot)
      .then(workId=>onSaved?.(workId))
      .catch(error=>onError?.(error));
  },delay);
}
