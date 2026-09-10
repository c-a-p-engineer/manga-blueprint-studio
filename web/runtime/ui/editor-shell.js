// Prototype 0.15.0: manga-first editor shell, breadcrumb context, page navigation, and explorer-style hierarchy.
// This layer reorganizes existing authoring controls without changing project semantics.

const editorShellText17={
  ja:{
    workLibrary:'作品一覧',structure:'作品構成',pageSettings:'ページ設定',pageOps:'ページ操作',structureEdit:'巻・章・フォルダを編集',
    workRoot:'作品直下',previous:'前のページ',next:'次のページ',addPage:'ページ追加',close:'閉じる',emptyGroup:'ページなし',
    pageCount:count=>`${count}ページ`,panelCount:count=>`${count}コマ`,currentOf:(label,index,total)=>`${label} · ${index}/${total}`,
    currentWork:'現在の作品',currentPage:'現在のページ'
  },
  en:{
    workLibrary:'Works',structure:'Work structure',pageSettings:'Page settings',pageOps:'Page actions',structureEdit:'Edit volumes / chapters / folders',
    workRoot:'Work root',previous:'Previous page',next:'Next page',addPage:'Add page',close:'Close',emptyGroup:'No pages',
    pageCount:count=>`${count} pages`,panelCount:count=>`${count} panels`,currentOf:(label,index,total)=>`${label} · ${index}/${total}`,
    currentWork:'Current work',currentPage:'Current page'
  }
};
const esText17=(key,...args)=>{const table=editorShellText17[language]||editorShellText17.ja;const value=table[key]??editorShellText17.ja[key]??key;return typeof value==='function'?value(...args):value;};
const pageCode17=number=>`P${String(Math.max(1,Number(number)||1)).padStart(3,'0')}`;
const containerType17=kind=>language==='ja'?({volume:'巻',chapter:'章',folder:'フォルダ'}[kind]||'分類'):({volume:'Volume',chapter:'Chapter',folder:'Folder'}[kind]||'Group');

Object.assign(i18n.ja,{
  tabPage:'ページ設定',pageHeading:'ページ設定',
  artRenderStyle:'画風',
  artNotes:'追加の画風・仕上げ指示（任意）',
  artNotesPlaceholder:'例: 線を細めに。淡い色合い。影は控えめ。見せ場だけ描き込みを増やす。'
});
Object.assign(i18n.en,{tabPage:'Page settings',pageHeading:'Page settings'});
if(typeof pageManagerText15==='object'){
  Object.assign(pageManagerText15.ja,{heading:'ページ操作',add:'＋ ページ',up:'前の位置へ',down:'次の位置へ',titlePlaceholder:'ページのメモ（任意）'});
}
if(typeof workHierarchyText16==='object'){
  Object.assign(workHierarchyText16.ja,{
    hierarchy:'構成を編集',pageGroup:'このページの配置先',kind:'作るもの',title:'名前',parent:'入れる場所',root:'作品直下',addContainer:'作成',containerDelete:'この分類を削除',selectContainer:'編集する分類を選択してください。'
  });
}

function orderedPages17(){return typeof orderedPages15==='function'?orderedPages15():[...(project.pages||[])].sort((a,b)=>(a.order||0)-(b.order||0));}
function currentPageIndex17(){return orderedPages17().findIndex(page=>page.id===currentPage()?.id);}
function containerMap17(){return new Map((project.containers||[]).map(container=>[container.id,container]));}
function containerPath17(containerId){
  const map=containerMap17(),path=[],seen=new Set();let cursor=containerId?map.get(containerId):null;
  while(cursor&&!seen.has(cursor.id)){seen.add(cursor.id);path.unshift(cursor);cursor=cursor.parentId?map.get(cursor.parentId):null;}
  return path;
}
function pageTitle17(page){return String(page?.title||'').trim();}
function breadcrumb17(page){
  const parts=containerPath17(page?.containerId).map(container=>container.title||containerType17(container.kind));
  if(!parts.length)parts.push(esText17('workRoot'));
  parts.push(pageCode17(page?.pageNumber));
  if(pageTitle17(page))parts.push(pageTitle17(page));
  return parts;
}
function childContainers17(parentId){return (project.containers||[]).filter(container=>(container.parentId||null)===(parentId||null)).sort((a,b)=>(a.order||0)-(b.order||0)||String(a.title||'').localeCompare(String(b.title||'')));}
function pagesInContainer17(containerId){return orderedPages17().filter(page=>(page.containerId||null)===(containerId||null));}

function explorerPageRow17(page){
  const active=page.id===selectedPageId;
  const title=pageTitle17(page);
  return `<button type="button" class="explorer-page17 ${active?'active':''}" data-explorer-page17="${escapeXml(page.id)}"><span class="explorer-page-code17">${escapeXml(pageCode17(page.pageNumber))}</span>${title?`<span class="explorer-page-title17">${escapeXml(title)}</span>`:''}<span class="explorer-page-meta17">${escapeXml(esText17('panelCount',page.panels?.length||0))}</span></button>`;
}
function explorerContainer17(container){
  const children=childContainers17(container.id);const pages=pagesInContainer17(container.id);
  return `<details class="explorer-group17" open><summary><span class="explorer-kind17">${escapeXml(containerType17(container.kind))}</span><strong>${escapeXml(container.title||containerType17(container.kind))}</strong><small>${escapeXml(esText17('pageCount',pages.length))}</small></summary><div class="explorer-children17">${pages.map(explorerPageRow17).join('')}${children.map(explorerContainer17).join('')}${!pages.length&&!children.length?`<div class="explorer-empty17">${escapeXml(esText17('emptyGroup'))}</div>`:''}</div></details>`;
}
function explorerTreeHtml17(){
  const rootPages=pagesInContainer17(null),roots=childContainers17(null);
  return `<div class="explorer-work17"><div class="explorer-work-title17">${escapeXml(String(project.meta?.title||'').trim()||whText16?.('untitled')||'Untitled')}</div>${rootPages.map(explorerPageRow17).join('')}${roots.map(explorerContainer17).join('')}</div>`;
}

function ensureEditorShell17(){
  if($('editorContextShell17'))return;
  const header=document.querySelector('.topbar');if(!header)return;
  const shell=document.createElement('section');shell.id='editorContextShell17';shell.className='editor-context-shell17';shell.innerHTML=`
    <div class="editor-context-main17">
      <div class="editor-work-line17"><button id="currentWorkButton17" type="button" class="editor-work-title17"></button><div class="editor-context-actions17"></div></div>
      <nav id="editorBreadcrumb17" class="editor-breadcrumb17" aria-label="Current manga location"></nav>
      <div class="editor-page-line17">
        <button id="previousPage17" type="button" class="compact17" aria-label="Previous page">‹</button>
        <button id="currentPageButton17" type="button" class="editor-current-page17"></button>
        <button id="nextPage17" type="button" class="compact17" aria-label="Next page">›</button>
        <button id="addPage17" type="button" class="compact17">＋</button>
        <button id="openStructure17" type="button" class="editor-structure-button17"></button>
      </div>
      <div id="pageStrip17" class="editor-page-strip17" aria-label="Pages"></div>
    </div>`;
  header.insertAdjacentElement('afterend',shell);

  const dialog=document.createElement('dialog');dialog.id='structureDialog17';dialog.className='structure-dialog17';dialog.innerHTML=`
    <div class="structure-shell17">
      <div class="structure-head17"><div><div class="structure-kicker17"></div><h2 id="structureTitle17"></h2></div><button id="closeStructure17" type="button" aria-label="Close">×</button></div>
      <div id="structureTree17" class="structure-tree17"></div>
      <details class="structure-advanced17"><summary id="pageOpsSummary17"></summary><div id="pageManagerSlot17"></div></details>
      <details class="structure-advanced17"><summary id="structureEditSummary17"></summary><div id="containerManagerSlot17"></div></details>
    </div>`;
  document.body.appendChild(dialog);

  $('previousPage17').addEventListener('click',()=>{const pages=orderedPages17(),index=currentPageIndex17();if(index>0)selectPage15(pages[index-1].id);});
  $('nextPage17').addEventListener('click',()=>{const pages=orderedPages17(),index=currentPageIndex17();if(index>=0&&index<pages.length-1)selectPage15(pages[index+1].id);});
  $('addPage17').addEventListener('click',()=>addPage15());
  $('openStructure17').addEventListener('click',()=>openStructure17());
  $('currentPageButton17').addEventListener('click',()=>openStructure17());
  $('currentWorkButton17').addEventListener('click',()=>openWorkLibrary16());
  $('closeStructure17').addEventListener('click',()=>$('structureDialog17').close());
  $('structureTree17').addEventListener('click',event=>{const button=event.target.closest('[data-explorer-page17]');if(!button)return;selectPage15(button.dataset.explorerPage17);if(matchMedia('(max-width:760px)').matches)$('structureDialog17').close();});
  $('pageStrip17').addEventListener('click',event=>{const button=event.target.closest('[data-page-strip17]');if(button)selectPage15(button.dataset.pageStrip17);});

  const style=document.createElement('style');style.id='editorShellStyle17';style.textContent=`
.editor-context-shell17{position:sticky;top:68px;z-index:28;background:#fff;border-bottom:1px solid #d1d5db;box-shadow:0 4px 14px rgba(15,23,42,.06)}
.editor-context-main17{max-width:1280px;margin:0 auto;padding:10px 14px 9px}.editor-work-line17{display:flex;align-items:center;justify-content:space-between;gap:10px}.editor-work-title17{border:0;background:transparent;padding:0;min-height:0;text-align:left;font-weight:850;font-size:17px;max-width:min(72vw,720px);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.editor-work-title17:hover{background:transparent;text-decoration:underline}
.editor-context-actions17{display:flex;gap:6px}.editor-context-actions17 #workLibraryBtn16{min-height:36px;padding:6px 9px;border-radius:8px;font-size:12px}
.editor-breadcrumb17{display:flex;gap:5px;align-items:center;min-height:22px;margin-top:2px;font-size:11px;color:#64748b;white-space:nowrap;overflow-x:auto;scrollbar-width:none}.editor-breadcrumb17::-webkit-scrollbar{display:none}.breadcrumb-sep17{color:#94a3b8}.breadcrumb-current17{font-weight:750;color:#334155}
.editor-page-line17{display:grid;grid-template-columns:40px minmax(150px,auto) 40px 40px minmax(100px,auto);gap:6px;align-items:center;margin-top:7px}.editor-page-line17 button{min-height:38px;padding:6px 10px}.compact17{font-size:20px;line-height:1}.editor-current-page17{font-weight:850;text-align:left}.editor-structure-button17{justify-self:start}
.editor-page-strip17{display:flex;gap:6px;overflow-x:auto;padding-top:7px;scrollbar-width:thin}.page-strip-button17{display:flex;align-items:center;gap:6px;min-height:32px;padding:4px 8px;border-radius:8px;font-size:11px;white-space:nowrap}.page-strip-button17.active{border-color:#111827;background:#111827;color:#fff}.page-strip-title17{max-width:130px;overflow:hidden;text-overflow:ellipsis}
.structure-dialog17{width:min(720px,calc(100vw - 24px));max-height:88vh;border:0;border-radius:16px;padding:0;box-shadow:0 24px 80px rgba(15,23,42,.35)}.structure-dialog17::backdrop{background:rgba(15,23,42,.52)}.structure-shell17{padding:16px;max-height:88vh;overflow:auto}.structure-head17{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;position:sticky;top:-16px;background:#fff;padding:16px 0 10px;z-index:2}.structure-head17 h2{font-size:19px;margin:2px 0 0}.structure-kicker17{font-size:11px;color:#64748b}.structure-head17>button{font-size:22px;min-width:42px}
.structure-tree17{border:1px solid #d8dee8;border-radius:12px;background:#f8fafc;padding:8px}.explorer-work-title17{font-weight:900;padding:8px 9px;border-bottom:1px solid #d8dee8;margin-bottom:4px}.explorer-page17{width:100%;display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:8px;text-align:left;border:0;background:transparent;border-radius:8px;min-height:36px;padding:6px 8px}.explorer-page17:hover{background:#e2e8f0}.explorer-page17.active{background:#111827;color:#fff}.explorer-page-code17{font-weight:900}.explorer-page-title17{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.explorer-page-meta17{font-size:10px;opacity:.7}.explorer-group17{margin:3px 0}.explorer-group17>summary{display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:7px;align-items:center;cursor:pointer;padding:7px 8px;border-radius:8px}.explorer-group17>summary:hover{background:#e2e8f0}.explorer-kind17{font-size:10px;font-weight:800;color:#475569;border:1px solid #cbd5e1;border-radius:6px;padding:2px 5px;background:#fff}.explorer-group17 summary small{font-size:10px;color:#64748b}.explorer-children17{margin-left:16px;padding-left:7px;border-left:1px solid #cbd5e1}.explorer-empty17{font-size:11px;color:#94a3b8;padding:6px 8px}
.structure-advanced17{margin-top:10px;border:1px solid #d8dee8;border-radius:10px;background:#fff}.structure-advanced17>summary{cursor:pointer;font-weight:800;padding:10px 12px}.structure-advanced17>div{padding:0 10px 10px}.structure-advanced17 .page-manager15,.structure-advanced17 .container-manager16{margin:0;background:#f8fafc}.structure-advanced17 #pageManagerList15{display:none}
#containerManager16,#pageManager15{margin-bottom:0!important}.tool-panel[data-section="page"]>#containerManager16,.tool-panel[data-section="page"]>#pageManager15{display:none!important}
@media(max-width:760px){
  .topbar{position:static;min-height:54px;display:flex!important;flex-direction:row!important;align-items:center!important;padding:8px 10px!important}.tagline{display:none}.brand{font-size:16px}.top-actions{width:auto!important;margin-left:auto;flex-wrap:nowrap!important}.top-actions>*{flex:0 0 auto!important;min-height:36px!important;padding:6px 8px!important}.top-actions #helpBtn span,.top-actions #undoBtn span,.top-actions #redoBtn span{display:none}.top-actions select{max-width:92px}
  .editor-context-shell17{position:static}.editor-context-main17{padding:8px 10px}.editor-work-title17{font-size:16px;max-width:72vw}.editor-page-line17{grid-template-columns:38px minmax(125px,1fr) 38px 38px auto}.editor-page-line17 button{min-height:38px;padding:5px 8px}.editor-page-strip17{padding-top:6px}.page-strip-title17{display:none}.structure-dialog17{width:100vw;max-width:none;height:100dvh;max-height:none;border-radius:0;margin:0}.structure-shell17{max-height:100dvh;padding:14px}.structure-head17{top:-14px;padding-top:14px}
}
@media(max-width:430px){.editor-context-actions17 #workLibraryBtn16{font-size:11px}.editor-structure-button17{font-size:11px}.editor-page-line17{grid-template-columns:36px minmax(110px,1fr) 36px 36px auto;gap:4px}.editor-page-line17 button{padding:4px 6px}}
`;
  document.head.appendChild(style);
}

function moveExistingManagers17(){
  const workButton=$('workLibraryBtn16');const actionHost=document.querySelector('.editor-context-actions17');if(workButton&&actionHost&&workButton.parentElement!==actionHost)actionHost.appendChild(workButton);
  const pageManager=$('pageManager15'),pageSlot=$('pageManagerSlot17');if(pageManager&&pageSlot&&pageManager.parentElement!==pageSlot)pageSlot.appendChild(pageManager);
  const containerManager=$('containerManager16'),containerSlot=$('containerManagerSlot17');if(containerManager&&containerSlot&&containerManager.parentElement!==containerSlot)containerSlot.appendChild(containerManager);
}

function localizeCanvasMetadata17(){
  if(language!=='ja')return;
  const distance={"extreme-long":'超遠景',long:'引き',medium:'中距離',close:'寄り',"extreme-close":'超寄り'};
  const angle={"eye-level":'水平',"low-angle":'あおり',"high-angle":'俯瞰',"birds-eye":'真上',"worms-eye":'地面目線',"dutch-angle":'傾き',"over-shoulder":'肩越し'};
  const role={setup:'導入',exposition:'状況説明',reaction:'反応',beat:'間',climax:'決め',transition:'転換',afterglow:'余韻'};
  document.querySelectorAll('.camera-label').forEach(node=>{const raw=node.textContent.split('·').map(v=>v.trim());if(raw.length===2)node.textContent=`${distance[raw[0]]||raw[0]} · ${angle[raw[1]]||raw[1]}`;});
  document.querySelectorAll('.role-label').forEach(node=>{node.textContent=role[node.textContent.trim()]||node.textContent;});
  document.querySelectorAll('.empty-note').forEach(node=>{node.textContent='タップ → キャラ追加';});
  document.querySelectorAll('.effect-note').forEach(node=>{if(node.textContent.startsWith('BG:'))node.textContent=node.textContent.replace(/^BG:/,'背景:');if(node.textContent.startsWith('SFX:'))node.textContent=node.textContent.replace(/^SFX:/,'効果音:');});
}

function localizeEditorResidue17(){
  const page=currentPage();
  if(language==='ja'){
    const status=$('panelStatus');if(status&&page){const panel=selectedPanel();status.textContent=panel?`コマ ${panel.order} / キャラ ${panel.characters.length} / 吹き出し ${panel.balloons.length}`:'コマを選択してください。';}
    document.querySelectorAll('.page-chip15').forEach(button=>{const id=button.dataset.pageId15;const item=(project.pages||[]).find(page=>page.id===id);if(!item)return;const number=button.querySelector('.page-chip-number15');const title=button.querySelector('.page-chip-title15');if(number)number.textContent=pageCode17(item.pageNumber);if(title&&!pageTitle17(item))title.textContent=esText17('panelCount',item.panels?.length||0);});
  }else{
    document.querySelectorAll('.page-chip15').forEach(button=>{const id=button.dataset.pageId15;const item=(project.pages||[]).find(page=>page.id===id);if(!item)return;const number=button.querySelector('.page-chip-number15');if(number)number.textContent=pageCode17(item.pageNumber);});
  }
  localizeCanvasMetadata17();
}

function renderEditorShell17(){
  ensureEditorShell17();moveExistingManagers17();
  const pages=orderedPages17(),page=currentPage(),index=currentPageIndex17();
  const title=String(project.meta?.title||'').trim()||(language==='ja'?'無題の作品':'Untitled work');
  $('currentWorkButton17').textContent=title;$('currentWorkButton17').title=esText17('workLibrary');
  const workButton=$('workLibraryBtn16');if(workButton)workButton.textContent=esText17('workLibrary');
  const parts=breadcrumb17(page);$('editorBreadcrumb17').innerHTML=parts.map((part,i)=>`${i?'<span class="breadcrumb-sep17">›</span>':''}<span class="${i===parts.length-1?'breadcrumb-current17':''}">${escapeXml(part)}</span>`).join('');
  const currentLabel=pageCode17(page?.pageNumber);$('currentPageButton17').textContent=esText17('currentOf',currentLabel,Math.max(1,index+1),Math.max(1,pages.length));
  $('currentPageButton17').title=pageTitle17(page)||esText17('currentPage');
  $('previousPage17').disabled=index<=0;$('previousPage17').title=esText17('previous');
  $('nextPage17').disabled=index<0||index>=pages.length-1;$('nextPage17').title=esText17('next');
  $('addPage17').title=esText17('addPage');$('openStructure17').textContent=esText17('structure');
  $('pageStrip17').innerHTML=pages.map(item=>`<button type="button" class="page-strip-button17 ${item.id===selectedPageId?'active':''}" data-page-strip17="${escapeXml(item.id)}"><strong>${escapeXml(pageCode17(item.pageNumber))}</strong>${pageTitle17(item)?`<span class="page-strip-title17">${escapeXml(pageTitle17(item))}</span>`:''}</button>`).join('');
  $('structureTree17').innerHTML=explorerTreeHtml17();$('structureTitle17').textContent=title;$('structureTitle17').title=title;
  document.querySelector('.structure-kicker17').textContent=esText17('structure');$('pageOpsSummary17').textContent=esText17('pageOps');$('structureEditSummary17').textContent=esText17('structureEdit');
  localizeEditorResidue17();
}

function openStructure17(){renderEditorShell17();const dialog=$('structureDialog17');if(dialog&&!dialog.open)dialog.showModal();}

function localizeSaveStatus17(){
  const el=$('saveStatus');if(!el)return;const text=el.textContent.trim();let next=text;
  if(language==='ja'){
    if(text==='local autosave')next='自動保存';else if(text==='saving…')next='保存中…';else if(text==='save failed')next='保存失敗';else if(text==='autosave unavailable')next='自動保存を利用できません';else if(/^saved\s+/.test(text))next=`保存済み ${text.replace(/^saved\s+/,'')}`;
  }else{
    if(text==='自動保存')next='local autosave';else if(text==='保存中…')next='saving…';else if(text==='保存失敗')next='save failed';else if(text==='自動保存を利用できません')next='autosave unavailable';else if(/^保存済み\s+/.test(text))next=`saved ${text.replace(/^保存済み\s+/,'')}`;
  }
  if(next!==text)el.textContent=next;
}

ensureEditorShell17();moveExistingManagers17();
const renderUiBase17=renderUi;renderUi=function(){renderUiBase17();renderEditorShell17();};
const applyLanguageBase17=applyLanguage;applyLanguage=function(){applyLanguageBase17();queueMicrotask(()=>{renderEditorShell17();localizeSaveStatus17();});};
const saveStatus17=$('saveStatus');if(saveStatus17)new MutationObserver(()=>localizeSaveStatus17()).observe(saveStatus17,{childList:true,characterData:true,subtree:true});
applyLanguage();
