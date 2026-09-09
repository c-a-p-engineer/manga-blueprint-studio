const pageManagerText15 = {
  ja:{heading:'作品ページ',add:'＋ 新規ページ',duplicate:'複製',delete:'削除',up:'前へ',down:'後へ',renumber:'番号を振り直す',page:'P',titlePlaceholder:'ページ名（任意）',number:'ページ番号'},
  en:{heading:'Work pages',add:'+ New page',duplicate:'Duplicate',delete:'Delete',up:'Earlier',down:'Later',renumber:'Renumber',page:'P',titlePlaceholder:'Optional page title',number:'Page number'}
};
const pageManagerText = key => pageManagerText15[language]?.[key]||pageManagerText15.ja[key]||key;

function ensurePageManagerUi15(){
  if($('pageManager15'))return;
  const pagePanel=document.querySelector('.tool-panel[data-section="page"]');
  if(!pagePanel)return;
  const host=document.createElement('section');
  host.id='pageManager15';
  host.className='page-manager15';
  host.innerHTML=`
    <div class="section-title-row page-manager-title15"><h3 id="pageManagerHeading15"></h3><button id="addPage15" type="button" class="primary"></button></div>
    <div id="pageManagerList15" class="page-manager-list15" aria-label="Pages"></div>
    <div class="page-manager-actions15">
      <button id="duplicatePage15" type="button"></button>
      <button id="movePageEarlier15" type="button"></button>
      <button id="movePageLater15" type="button"></button>
      <button id="renumberPages15" type="button"></button>
      <button id="deletePage15" type="button" class="danger"></button>
    </div>`;
  pagePanel.prepend(host);

  if(!$('pageManagerStyle15')){
    const style=document.createElement('style');
    style.id='pageManagerStyle15';
    style.textContent=`
      .page-manager15{margin:0 0 18px;padding:12px;border:1px solid #d8dee8;border-radius:12px;background:#f8fafc}
      .page-manager-title15{align-items:center}.page-manager-title15 h3{margin:0;font-size:1rem}
      .page-manager-list15{display:flex;gap:8px;overflow-x:auto;padding:8px 0 10px;scroll-snap-type:x proximity}
      .page-chip15{min-width:116px;max-width:180px;text-align:left;border:1px solid #cbd5e1;border-radius:10px;background:#fff;padding:8px;scroll-snap-align:start}
      .page-chip15.active{border-color:#111827;box-shadow:0 0 0 2px rgba(17,24,39,.1)}
      .page-chip-number15{display:block;font-weight:800;font-size:.82rem}.page-chip-title15{display:block;margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:.78rem;color:#475569}
      .page-manager-edit15{display:grid;grid-template-columns:88px minmax(120px,1fr);gap:8px;margin-bottom:8px}.page-manager-edit15 input{min-width:0}
      .page-manager-actions15{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:6px}.page-manager-actions15 button{padding-inline:6px}
      @media(max-width:680px){.page-manager-actions15{grid-template-columns:repeat(2,minmax(0,1fr))}.page-manager-actions15 .danger{grid-column:span 2}}
    `;
    document.head.appendChild(style);
  }

  $('addPage15').addEventListener('click',()=>addPage15());
  $('duplicatePage15').addEventListener('click',()=>duplicatePage15());
  $('deletePage15').addEventListener('click',()=>deletePage15());
  $('movePageEarlier15').addEventListener('click',()=>movePage15(-1));
  $('movePageLater15').addEventListener('click',()=>movePage15(1));
  $('renumberPages15').addEventListener('click',()=>mutate(()=>renumberPageNumbers15()));
  $('pageManagerList15').addEventListener('click',event=>{
    const chip=event.target.closest('[data-page-id15]');
    if(chip)selectPage15(chip.dataset.pageId15);
  });
}

function orderedPages15(){
  return [...project.pages].sort((a,b)=>(a.order||0)-(b.order||0));
}

function renumberPageOrders15(){
  project.pages.forEach((page,index)=>{page.order=index+1;});
}

function renumberPageNumbers15(){
  renumberPageOrders15();
  project.pages.forEach((page,index)=>{page.pageNumber=index+1;});
}

function pageLabel15(page){
  return `${pageManagerText('page')}${page.pageNumber}${page.title?` · ${page.title}`:''}`;
}

function clonePanelForDuplicate15(panel){
  const next=clone(panel);
  next.id=uid('panel');
  next.characters=(next.characters||[]).map(character=>({...character,id:uid('char')}));
  next.balloons=(next.balloons||[]).map(balloon=>({...balloon,id:uid('balloon')}));
  return next;
}

function clonePageForDuplicate15(source){
  const next=clone(source);
  next.id=uid('page');
  next.title=source.title?`${source.title} copy`:'';
  next.panels=(source.panels||[]).map(clonePanelForDuplicate15);
  return next;
}

function blankPageFromCurrent15(){
  const source=currentPage();
  const next={
    id:uid('page'),
    pageNumber:project.pages.length+1,
    order:project.pages.length+1,
    containerId:source?.containerId??null,
    title:'',
    panels:(source?.panels||templates.action3.map((r,i)=>makePanel(r,i+1))).map(panel=>({
      ...clone(panel),
      id:uid('panel'),
      role:'setup',
      actionIntent:'',
      camera:defaultCamera(),
      background:defaultBackground(),
      effects:defaultEffects(),
      characters:[],
      balloons:[]
    }))
  };
  next.panels.forEach((panel,index)=>{panel.order=index+1;});
  return next;
}

function selectPage15(pageId,{renderNow=true}={}){
  const page=project.pages.find(candidate=>candidate.id===pageId);
  if(!page)return false;
  selectedPageId=page.id;
  selectedPanelId=page.panels?.[0]?.id||null;
  selectedCharacterId=null;
  selectedBalloonId=null;
  if(renderNow)render();
  persistSelectedPage15();
  return true;
}

function addPage15(){
  let createdId=null;
  mutate(()=>{
    const next=blankPageFromCurrent15();
    project.pages.push(next);
    renumberPageOrders15();
    createdId=next.id;
    selectedPageId=next.id;
    selectedPanelId=next.panels[0]?.id||null;
    selectedCharacterId=null;selectedBalloonId=null;
  });
  if(createdId)persistSelectedPage15();
}

function duplicatePage15(){
  const source=currentPage();if(!source)return;
  let duplicateId=null;
  mutate(()=>{
    const pages=project.pages;
    const index=pages.findIndex(page=>page.id===source.id);
    const next=clonePageForDuplicate15(source);
    pages.splice(index+1,0,next);
    renumberPageNumbers15();
    duplicateId=next.id;
    selectedPageId=next.id;
    selectedPanelId=next.panels[0]?.id||null;
    selectedCharacterId=null;selectedBalloonId=null;
  });
  if(duplicateId)persistSelectedPage15();
}

function deletePage15(){
  if(project.pages.length<=1){alert(language==='ja'?'最後の1ページは削除できません。':'The final page cannot be deleted.');return;}
  const current=currentPage();if(!current)return;
  if(!confirm(language==='ja'?`${pageLabel15(current)} を削除しますか？`:`Delete ${pageLabel15(current)}?`))return;
  let nextId=null;
  mutate(()=>{
    const index=project.pages.findIndex(page=>page.id===current.id);
    project.pages.splice(index,1);
    renumberPageNumbers15();
    const next=project.pages[Math.min(index,project.pages.length-1)];
    nextId=next?.id||null;
    selectedPageId=nextId;
    selectedPanelId=next?.panels?.[0]?.id||null;
    selectedCharacterId=null;selectedBalloonId=null;
  });
  if(nextId)persistSelectedPage15();
}

function movePage15(delta){
  const current=currentPage();if(!current)return;
  const pages=project.pages;
  const index=pages.findIndex(page=>page.id===current.id);
  const target=index+delta;
  if(target<0||target>=pages.length)return;
  mutate(()=>{
    [pages[index],pages[target]]=[pages[target],pages[index]];
    renumberPageNumbers15();
  });
}

function updatePageNumber15(value){
  const page=currentPage();if(!page)return;
  const number=Number(value);
  if(!Number.isInteger(number)||number<1){renderPageManager15();return;}
  if(project.pages.some(candidate=>candidate.id!==page.id&&candidate.pageNumber===number)){
    alert(language==='ja'?`ページ番号 ${number} は既に使われています。`:`Page number ${number} is already in use.`);
    renderPageManager15();return;
  }
  mutate(()=>{page.pageNumber=number;});
}

function updatePageTitle15(value){
  const page=currentPage();if(!page)return;
  mutate(()=>{page.title=String(value||'').trim();});
}

let lastPersistedPage15='';
let suppressPageSelectionPersist15=true;
function persistSelectedPage15(){
  if(suppressPageSelectionPersist15||!persistenceReady||!selectedPageId||!project?.meta?.workId)return;
  const key=`${project.meta.workId}:${selectedPageId}`;
  if(key===lastPersistedPage15)return;
  lastPersistedPage15=key;
  projectStorage.setActivePage(project.meta.workId,selectedPageId).catch(error=>console.warn('Unable to persist active page.',error));
}

function renderPageManager15(){
  ensurePageManagerUi15();
  const current=currentPage();
  $('pageManagerHeading15').textContent=pageManagerText('heading');
  $('addPage15').textContent=pageManagerText('add');
  $('duplicatePage15').textContent=pageManagerText('duplicate');
  $('deletePage15').textContent=pageManagerText('delete');
  $('movePageEarlier15').textContent=pageManagerText('up');
  $('movePageLater15').textContent=pageManagerText('down');
  $('renumberPages15').textContent=pageManagerText('renumber');
  const pages=orderedPages15();
  $('pageManagerList15').innerHTML=pages.map(page=>`<button type="button" class="page-chip15 ${page.id===selectedPageId?'active':''}" data-page-id15="${escapeXml(page.id)}"><span class="page-chip-number15">${escapeXml(pageManagerText('page'))}${page.pageNumber}</span><span class="page-chip-title15">${escapeXml(page.title||`${page.panels?.length||0} panels`)}</span></button>`).join('');

  let editor=$('pageManagerEdit15');
  if(!editor){
    editor=document.createElement('div');editor.id='pageManagerEdit15';editor.className='page-manager-edit15';
    $('pageManagerList15').insertAdjacentElement('afterend',editor);
  }
  editor.innerHTML=`<input id="pageNumber15" type="number" min="1" step="1" aria-label="${escapeXml(pageManagerText('number'))}" value="${current?.pageNumber||1}"><input id="pageTitle15" type="text" placeholder="${escapeXml(pageManagerText('titlePlaceholder'))}" value="${escapeXml(current?.title||'')}">`;
  $('pageNumber15').addEventListener('change',event=>updatePageNumber15(event.target.value));
  $('pageTitle15').addEventListener('change',event=>updatePageTitle15(event.target.value));

  const index=pages.findIndex(page=>page.id===selectedPageId);
  $('movePageEarlier15').disabled=index<=0;
  $('movePageLater15').disabled=index<0||index>=pages.length-1;
  $('deletePage15').disabled=pages.length<=1;
  persistSelectedPage15();
}

ensurePageManagerUi15();
const renderUiBeforePageManager15=renderUi;
renderUi=function(){renderUiBeforePageManager15();renderPageManager15();};

const initializeEditorStateBeforePageManager15=initializeEditorState;
initializeEditorState=async function(){
  suppressPageSelectionPersist15=true;
  await initializeEditorStateBeforePageManager15();
  if(persistenceReady&&project?.meta?.workId){
    try{
      const remembered=await projectStorage.getActivePageId(project.meta.workId);
      if(remembered&&project.pages.some(page=>page.id===remembered)){
        selectPage15(remembered,{renderNow:false});
        selectedPanelId=currentPage()?.panels?.[0]?.id||null;
      }
    }catch(error){console.warn('Unable to restore active page.',error);}
  }
  suppressPageSelectionPersist15=false;
  lastPersistedPage15='';
  render();
};

renderPageManager15();
