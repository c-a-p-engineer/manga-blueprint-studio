const workHierarchyText16={
  ja:{works:'作品',workLibrary:'作品一覧',newWork:'＋ 新しい作品',open:'開く',rename:'名前変更',duplicate:'複製',delete:'削除',active:'開いています',untitled:'無題の作品',copySuffix:'のコピー',updated:'更新',pages:'ページ',storageUnavailable:'このブラウザでは作品ライブラリを利用できません。',deleteWorkConfirm:'この作品をローカル保存から削除します。元に戻せません。',deleteActiveWorkConfirm:'現在開いている作品を削除します。削除後は別の作品（なければ新規作品）を開きます。元に戻せません。',hierarchy:'巻・章・フォルダ',pageGroup:'このページの所属',ungrouped:'未分類',kind:'種類',title:'名前',parent:'親',root:'最上位',addContainer:'追加',earlier:'前へ',later:'後へ',containerDelete:'分類を削除',containerDeleteConfirm:'分類だけを削除します。所属ページと子分類は親へ移動し、ページ自体は削除しません。',volume:'巻',chapter:'章',folder:'フォルダ',selectContainer:'分類を選択してください。'},
  en:{works:'Works',workLibrary:'Work library',newWork:'+ New work',open:'Open',rename:'Rename',duplicate:'Duplicate',delete:'Delete',active:'Open',untitled:'Untitled work',copySuffix:' copy',updated:'Updated',pages:'pages',storageUnavailable:'Work library is unavailable in this browser.',deleteWorkConfirm:'Delete this work from local storage? This cannot be undone.',deleteActiveWorkConfirm:'Delete the currently open work? Another work (or a new blank work) will be opened afterward. This cannot be undone.',hierarchy:'Volumes / chapters / folders',pageGroup:'Current page group',ungrouped:'Ungrouped',kind:'Kind',title:'Name',parent:'Parent',root:'Top level',addContainer:'Add',earlier:'Earlier',later:'Later',containerDelete:'Delete group',containerDeleteConfirm:'Delete only this group? Its pages and child groups will move to its parent; pages will not be deleted.',volume:'Volume',chapter:'Chapter',folder:'Folder',selectContainer:'Select a group.'}
};
const whText16=key=>workHierarchyText16[language]?.[key]||workHierarchyText16.ja[key]||key;
let selectedContainerId16=null;

function workTitle16(input=project){return String(input?.meta?.title||'').trim()||whText16('untitled');}
function containerKindLabel16(kind){return whText16(kind)||kind;}

function ensureWorkLibraryUi16(){
  if($('workLibraryBtn16'))return;
  const topActions=document.querySelector('.top-actions');
  if(!topActions)return;
  const button=document.createElement('button');
  button.id='workLibraryBtn16';button.type='button';button.setAttribute('aria-haspopup','dialog');
  button.addEventListener('click',()=>openWorkLibrary16());
  topActions.prepend(button);

  const dialog=document.createElement('dialog');
  dialog.id='workLibraryDialog16';dialog.className='work-library-dialog16';
  dialog.innerHTML=`<form method="dialog" class="work-library-shell16"><div class="work-library-head16"><h2 id="workLibraryHeading16"></h2><button type="submit" aria-label="Close">×</button></div><div class="work-library-actions16"><button id="newWork16" type="button" class="primary"></button></div><div id="workLibraryStatus16" class="help"></div><div id="workLibraryList16" class="work-library-list16"></div></form>`;
  document.body.appendChild(dialog);
  $('newWork16').addEventListener('click',()=>createWork16());
  $('workLibraryList16').addEventListener('click',event=>handleWorkLibraryAction16(event));

  if(!$('workHierarchyStyle16')){
    const style=document.createElement('style');style.id='workHierarchyStyle16';
    style.textContent=`
      .work-library-dialog16{width:min(760px,calc(100vw - 24px));max-height:min(82vh,760px);border:0;border-radius:14px;padding:0;box-shadow:0 24px 70px rgba(15,23,42,.3)}
      .work-library-dialog16::backdrop{background:rgba(15,23,42,.48)}.work-library-shell16{padding:16px;margin:0}.work-library-head16{display:flex;align-items:center;justify-content:space-between;gap:12px}.work-library-head16 h2{margin:0}.work-library-head16>button{font-size:1.2rem}
      .work-library-actions16{margin:12px 0}.work-library-list16{display:grid;gap:8px;max-height:58vh;overflow:auto}.work-row16{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:10px;align-items:center;padding:10px;border:1px solid #d8dee8;border-radius:10px;background:#fff}.work-row16.active{border-color:#111827}.work-title16{font-weight:800;overflow-wrap:anywhere}.work-meta16{font-size:.78rem;color:#64748b;margin-top:3px}.work-row-actions16{display:flex;flex-wrap:wrap;gap:5px;justify-content:flex-end}.work-row-actions16 button{padding:6px 8px}
      .container-manager16{margin:0 0 18px;padding:12px;border:1px solid #d8dee8;border-radius:12px;background:#f8fafc}.container-manager16 h3{margin:0}.container-create16{display:grid;grid-template-columns:110px minmax(120px,1fr) minmax(120px,1fr) auto;gap:6px;margin:10px 0}.container-create16>*{min-width:0}.container-list16{display:grid;gap:5px;max-height:220px;overflow:auto;margin:8px 0}.container-chip16{text-align:left;background:#fff;border:1px solid #cbd5e1;border-radius:8px;padding:7px 9px}.container-chip16.active{border-color:#111827;box-shadow:0 0 0 2px rgba(17,24,39,.08)}.container-inspector16{display:grid;grid-template-columns:minmax(100px,1fr) minmax(120px,1fr);gap:6px;margin-top:8px}.container-inspector-actions16{grid-column:1/-1;display:flex;gap:6px;flex-wrap:wrap}
      @media(max-width:680px){.work-row16{grid-template-columns:1fr}.work-row-actions16{justify-content:flex-start}.container-create16{grid-template-columns:1fr 1fr}.container-create16 input{grid-column:1/-1}.container-create16 button{grid-column:1/-1}.container-inspector16{grid-template-columns:1fr}.container-inspector-actions16{grid-column:1}}
    `;document.head.appendChild(style);
  }
}

async function refreshWorkLibrary16(){
  ensureWorkLibraryUi16();
  $('workLibraryHeading16').textContent=whText16('workLibrary');
  $('newWork16').textContent=whText16('newWork');
  if(!projectStorage.supported()){
    $('workLibraryStatus16').textContent=whText16('storageUnavailable');$('workLibraryList16').innerHTML='';$('newWork16').disabled=true;return;
  }
  $('newWork16').disabled=false;$('workLibraryStatus16').textContent='';
  const works=await projectStorage.list();
  $('workLibraryList16').innerHTML=works.map(work=>{
    const active=work.workId===project?.meta?.workId;
    const date=work.updatedAt?new Date(work.updatedAt).toLocaleString():'';
    return `<div class="work-row16 ${active?'active':''}" data-work-row16="${escapeXml(work.workId)}"><div><div class="work-title16">${escapeXml(work.title||whText16('untitled'))}${active?` · ${escapeXml(whText16('active'))}`:''}</div><div class="work-meta16">${work.pageCount} ${escapeXml(whText16('pages'))}${date?` · ${escapeXml(whText16('updated'))}: ${escapeXml(date)}`:''}</div></div><div class="work-row-actions16"><button type="button" data-work-action16="open" data-work-id16="${escapeXml(work.workId)}" ${active?'disabled':''}>${escapeXml(whText16('open'))}</button><button type="button" data-work-action16="rename" data-work-id16="${escapeXml(work.workId)}">${escapeXml(whText16('rename'))}</button><button type="button" data-work-action16="duplicate" data-work-id16="${escapeXml(work.workId)}">${escapeXml(whText16('duplicate'))}</button><button type="button" class="danger" data-work-action16="delete" data-work-id16="${escapeXml(work.workId)}">${escapeXml(whText16('delete'))}</button></div></div>`;
  }).join('');
}

async function openWorkLibrary16(){
  ensureWorkLibraryUi16();await refreshWorkLibrary16();
  const dialog=$('workLibraryDialog16');if(!dialog.open)dialog.showModal();
}

async function saveCurrentWorkNow16(){
  if(persistenceReady&&projectStorage.supported()&&project?.meta?.workId)await projectStorage.save(project);
}

async function installWorkInEditor16(next,{activate=true}={}){
  const normalized=ensureProjectIdentity(next);
  if(activate&&projectStorage.supported())await projectStorage.setActive(normalized.meta.workId);
  let remembered=null;
  if(projectStorage.supported())remembered=await projectStorage.getActivePageId(normalized.meta.workId);
  if(typeof suppressPageSelectionPersist15!=='undefined')suppressPageSelectionPersist15=true;
  project=normalized;
  selectedPageId=remembered&&project.pages.some(page=>page.id===remembered)?remembered:project.pages[0]?.id||null;
  selectedPanelId=currentPage()?.panels?.[0]?.id||null;
  selectedCharacterId=null;selectedBalloonId=null;history=[];future=[];selectedContainerId16=null;
  if(typeof lastPersistedPage15!=='undefined')lastPersistedPage15='';
  if(typeof suppressPageSelectionPersist15!=='undefined')suppressPageSelectionPersist15=false;
  render();
}

async function openStoredWork16(workId,{saveCurrent=true}={}){
  if(!projectStorage.supported()||!workId)return;
  if(project?.meta?.workId===workId)return;
  if(saveCurrent)await saveCurrentWorkNow16();
  const next=await projectStorage.load(workId);if(!next)throw new Error(`Work not found: ${workId}`);
  await installWorkInEditor16(next,{activate:true});
  $('workLibraryDialog16')?.close();
}

async function createWork16(){
  if(!projectStorage.supported())return;
  const initial=language==='ja'?'新しい作品':'New work';
  const title=prompt(language==='ja'?'作品名':'Work title',initial);if(title===null)return;
  await saveCurrentWorkNow16();
  const next=createProjectWithIdentity();next.meta.title=String(title).trim()||initial;
  await projectStorage.save(next);await installWorkInEditor16(next,{activate:true});
  $('workLibraryDialog16')?.close();
}

async function renameWork16(workId){
  const source=workId===project?.meta?.workId?project:await projectStorage.load(workId);if(!source)return;
  const title=prompt(language==='ja'?'作品名を変更':'Rename work',source.meta.title||whText16('untitled'));if(title===null)return;
  const value=String(title).trim();if(!value)return;
  if(workId===project?.meta?.workId){mutate(()=>{project.meta.title=value;});await projectStorage.save(project);}
  else{source.meta.title=value;await projectStorage.save(source);}
  await refreshWorkLibrary16();
}

async function duplicateWork16(workId){
  const source=workId===project?.meta?.workId?ensureProjectIdentity(project):await projectStorage.load(workId);if(!source)return;
  const copy=cloneProjectAsNewWork(source);
  copy.meta.title=`${workTitle16(source)}${whText16('copySuffix')}`;
  await projectStorage.save(copy);await refreshWorkLibrary16();
}

async function deleteWork16(workId){
  if(!projectStorage.supported())return;
  const active=workId===project?.meta?.workId;
  if(!confirm(active?whText16('deleteActiveWorkConfirm'):whText16('deleteWorkConfirm')))return;
  await projectStorage.remove(workId);
  if(active){
    const remaining=await projectStorage.list();
    if(remaining.length){await openStoredWork16(remaining[0].workId,{saveCurrent:false});}
    else{
      const next=createProjectWithIdentity();
      await projectStorage.save(next);await installWorkInEditor16(next,{activate:true});
    }
  }
  await refreshWorkLibrary16();
}

async function handleWorkLibraryAction16(event){
  const button=event.target.closest('[data-work-action16]');if(!button)return;
  const id=button.dataset.workId16,action=button.dataset.workAction16;
  try{
    button.disabled=true;
    if(action==='open')await openStoredWork16(id);
    else if(action==='rename')await renameWork16(id);
    else if(action==='duplicate')await duplicateWork16(id);
    else if(action==='delete')await deleteWork16(id);
  }catch(error){console.error('Work library action failed.',error);alert(language==='ja'?'作品操作に失敗しました。':'Work operation failed.');}
  finally{if(button.isConnected)button.disabled=false;}
}

function containerById16(id){return project.containers?.find(container=>container.id===id)||null;}
function siblingContainers16(parentId){return (project.containers||[]).filter(container=>(container.parentId||null)===(parentId||null)).sort((a,b)=>(a.order||0)-(b.order||0)||a.id.localeCompare(b.id));}
function normalizeSiblingOrders16(parentId){siblingContainers16(parentId).forEach((container,index)=>{container.order=index+1;});}
function descendantIds16(containerId){
  const result=new Set(),queue=[containerId];
  while(queue.length){const id=queue.shift();for(const child of project.containers||[]){if(child.parentId===id&&!result.has(child.id)){result.add(child.id);queue.push(child.id);}}}
  return result;
}
function containerTree16(){
  const rows=[],seen=new Set();
  const visit=(parentId,depth)=>{for(const container of siblingContainers16(parentId)){if(seen.has(container.id))continue;seen.add(container.id);rows.push({container,depth});visit(container.id,depth+1);}};
  visit(null,0);for(const container of project.containers||[]){if(!seen.has(container.id))rows.push({container,depth:0});}
  return rows;
}
function containerOptionHtml16({exclude=new Set(),selected=null,includeRoot=true}={}){
  const root=includeRoot?`<option value="" ${selected==null?'selected':''}>${escapeXml(whText16('root'))}</option>`:'';
  return root+containerTree16().filter(({container})=>!exclude.has(container.id)).map(({container,depth})=>`<option value="${escapeXml(container.id)}" ${container.id===selected?'selected':''}>${escapeXml('　'.repeat(depth)+containerKindLabel16(container.kind)+' · '+(container.title||container.id))}</option>`).join('');
}

function ensureContainerManagerUi16(){
  if($('containerManager16'))return;
  const pagePanel=document.querySelector('.tool-panel[data-section="page"]');if(!pagePanel)return;
  const host=document.createElement('section');host.id='containerManager16';host.className='container-manager16';
  host.innerHTML=`<div class="section-title-row"><h3 id="containerHeading16"></h3></div><label><span id="pageGroupLabel16"></span><select id="pageContainer16"></select></label><div class="container-create16"><select id="containerKind16"><option value="volume"></option><option value="chapter"></option><option value="folder"></option></select><select id="containerParentCreate16"></select><input id="containerTitleCreate16" type="text"><button id="addContainer16" type="button"></button></div><div id="containerList16" class="container-list16"></div><div id="containerInspector16" class="container-inspector16" hidden><input id="containerTitle16" type="text"><select id="containerParent16"></select><div class="container-inspector-actions16"><button id="moveContainerEarlier16" type="button"></button><button id="moveContainerLater16" type="button"></button><button id="deleteContainer16" type="button" class="danger"></button></div></div><div id="noContainer16" class="help"></div>`;
  const pageManager=$('pageManager15');if(pageManager)pageManager.insertAdjacentElement('afterend',host);else pagePanel.prepend(host);
  $('pageContainer16').addEventListener('change',event=>mutate(()=>{const page=currentPage();if(page)page.containerId=event.target.value||null;}));
  $('addContainer16').addEventListener('click',()=>addContainer16());
  $('containerList16').addEventListener('click',event=>{const button=event.target.closest('[data-container-id16]');if(button){selectedContainerId16=button.dataset.containerId16;renderHierarchy16();}});
  $('containerTitle16').addEventListener('change',event=>{const container=containerById16(selectedContainerId16);if(!container)return;const value=String(event.target.value).trim();if(!value){renderHierarchy16();return;}mutate(()=>{container.title=value;});});
  $('containerParent16').addEventListener('change',event=>changeContainerParent16(event.target.value||null));
  $('moveContainerEarlier16').addEventListener('click',()=>moveContainer16(-1));$('moveContainerLater16').addEventListener('click',()=>moveContainer16(1));$('deleteContainer16').addEventListener('click',()=>deleteContainer16());
}

function addContainer16(){
  const kind=$('containerKind16').value,title=String($('containerTitleCreate16').value||'').trim(),parentId=$('containerParentCreate16').value||null;
  if(!CONTAINER_KINDS.has(kind))return;
  let created=null;
  mutate(()=>{const siblings=siblingContainers16(parentId);created={id:uid('container'),kind,title:title||containerKindLabel16(kind),order:siblings.length+1,parentId};project.containers.push(created);selectedContainerId16=created.id;});
  $('containerTitleCreate16').value='';
}

function changeContainerParent16(parentId){
  const container=containerById16(selectedContainerId16);if(!container)return;
  const forbidden=descendantIds16(container.id);forbidden.add(container.id);
  if(parentId&&forbidden.has(parentId)){renderHierarchy16();return;}
  const oldParent=container.parentId||null;if(oldParent===(parentId||null))return;
  mutate(()=>{container.parentId=parentId||null;container.order=siblingContainers16(container.parentId).filter(item=>item.id!==container.id).length+1;normalizeSiblingOrders16(oldParent);normalizeSiblingOrders16(container.parentId);});
}

function moveContainer16(delta){
  const container=containerById16(selectedContainerId16);if(!container)return;
  const siblings=siblingContainers16(container.parentId),index=siblings.findIndex(item=>item.id===container.id),target=index+delta;if(index<0||target<0||target>=siblings.length)return;
  mutate(()=>{const other=siblings[target],temp=container.order;container.order=other.order;other.order=temp;normalizeSiblingOrders16(container.parentId);});
}

function deleteContainer16(){
  const container=containerById16(selectedContainerId16);if(!container)return;
  const pageCount=project.pages.filter(page=>page.containerId===container.id).length;
  const childCount=project.containers.filter(item=>item.parentId===container.id).length;
  if(!confirm(`${whText16('containerDeleteConfirm')} (${pageCount} ${whText16('pages')}, ${childCount})`))return;
  const parentId=container.parentId||null;
  mutate(()=>{
    project.pages.forEach(page=>{if(page.containerId===container.id)page.containerId=parentId;});
    project.containers.forEach(item=>{if(item.parentId===container.id)item.parentId=parentId;});
    project.containers=project.containers.filter(item=>item.id!==container.id);
    normalizeSiblingOrders16(parentId);selectedContainerId16=null;
  });
}

function renderWorkHeader16(){
  ensureWorkLibraryUi16();
  const button=$('workLibraryBtn16');if(button)button.textContent=`${whText16('works')}: ${workTitle16()}`;
}

function renderHierarchy16(){
  ensureContainerManagerUi16();const page=currentPage();if(!page)return;
  $('containerHeading16').textContent=whText16('hierarchy');$('pageGroupLabel16').textContent=whText16('pageGroup');
  $('containerKind16').options[0].textContent=whText16('volume');$('containerKind16').options[1].textContent=whText16('chapter');$('containerKind16').options[2].textContent=whText16('folder');
  $('containerTitleCreate16').placeholder=whText16('title');$('addContainer16').textContent=whText16('addContainer');
  $('containerParentCreate16').innerHTML=containerOptionHtml16();
  $('pageContainer16').innerHTML=`<option value="">${escapeXml(whText16('ungrouped'))}</option>`+containerTree16().map(({container,depth})=>`<option value="${escapeXml(container.id)}">${escapeXml('　'.repeat(depth)+containerKindLabel16(container.kind)+' · '+(container.title||container.id))}</option>`).join('');
  $('pageContainer16').value=page.containerId||'';
  const tree=containerTree16();
  $('containerList16').innerHTML=tree.map(({container,depth})=>`<button type="button" class="container-chip16 ${container.id===selectedContainerId16?'active':''}" data-container-id16="${escapeXml(container.id)}">${escapeXml('　'.repeat(depth)+containerKindLabel16(container.kind)+' · '+(container.title||container.id))}</button>`).join('');
  if(selectedContainerId16&&!containerById16(selectedContainerId16))selectedContainerId16=null;
  const selected=containerById16(selectedContainerId16),inspector=$('containerInspector16');inspector.hidden=!selected;$('noContainer16').textContent=selected?'':whText16('selectContainer');
  if(selected){
    $('containerTitle16').value=selected.title||'';
    const excluded=descendantIds16(selected.id);excluded.add(selected.id);
    $('containerParent16').innerHTML=containerOptionHtml16({exclude:excluded,selected:selected.parentId||null});
    const siblings=siblingContainers16(selected.parentId),index=siblings.findIndex(item=>item.id===selected.id);
    $('moveContainerEarlier16').textContent=whText16('earlier');$('moveContainerLater16').textContent=whText16('later');$('deleteContainer16').textContent=whText16('containerDelete');
    $('moveContainerEarlier16').disabled=index<=0;$('moveContainerLater16').disabled=index<0||index>=siblings.length-1;
  }
}

ensureWorkLibraryUi16();ensureContainerManagerUi16();
const renderUiBeforeWorkHierarchy16=renderUi;
renderUi=function(){renderUiBeforeWorkHierarchy16();renderWorkHeader16();renderHierarchy16();};

const initializeEditorStateBeforeWorkHierarchy16=initializeEditorState;
initializeEditorState=async function(){
  await initializeEditorStateBeforeWorkHierarchy16();
  if(persistenceReady&&projectStorage.supported()){
    try{
      const active=await projectStorage.loadActive();
      if(!active){await projectStorage.save(project);await projectStorage.setActive(project.meta.workId);}
    }catch(error){console.warn('Unable to establish active work.',error);}
  }
  render();
};
