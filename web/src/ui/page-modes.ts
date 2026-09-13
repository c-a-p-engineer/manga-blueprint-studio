import {byId,copy,setTextIfChanged} from './dom-helpers';

export type PageModeId='template'|'manuscript'|'layout';
let activePageMode:PageModeId='template';

function manualLayoutStart(pagePanel:HTMLElement){
  return [...pagePanel.children].find(element=>element instanceof HTMLElement&&element.dataset.i18n==='panelLayout') as HTMLElement|undefined;
}

function panelOverviewStart(pagePanel:HTMLElement){
  return [...pagePanel.children].find(element=>element instanceof HTMLElement&&element.dataset.i18n==='panelOverviewHeading') as HTMLElement|undefined;
}

function ensureManualLayoutDisclosure(pagePanel:HTMLElement){
  const existing=byId<HTMLDetailsElement>('phase1ManualLayout');
  if(existing)return existing;
  const start=manualLayoutStart(pagePanel),end=panelOverviewStart(pagePanel);
  if(!start||!end)return null;
  const details=document.createElement('details');
  details.id='phase1ManualLayout';
  details.className='phase1-manual-layout';
  const summary=document.createElement('summary');
  summary.innerHTML=`<strong>${copy('手動でコマ割りを調整','Adjust panels manually')}</strong><span>${copy('テンプレートを使わず、レイアウトを直接編集する場合','Use when you want direct layout editing instead of a template')}</span>`;
  details.appendChild(summary);
  pagePanel.insertBefore(details,start);
  let cursor:Element|null=start;
  while(cursor&&cursor!==end){
    const nextSibling:Element|null=cursor.nextElementSibling;
    details.appendChild(cursor);
    cursor=nextSibling;
  }
  return details;
}

function setPageMode(root:HTMLElement,mode:PageModeId,focus=false){
  activePageMode=mode;
  const buttons=[...root.querySelectorAll<HTMLButtonElement>('[data-page-mode]')];
  const panels=[...root.querySelectorAll<HTMLElement>('[data-page-mode-panel]')];
  buttons.forEach(button=>{
    const selected=button.dataset.pageMode===mode;
    button.setAttribute('aria-selected',selected?'true':'false');
    button.tabIndex=selected?0:-1;
    if(selected&&focus)button.focus();
  });
  panels.forEach(panel=>{panel.hidden=panel.dataset.pageModePanel!==mode;});
}

function refreshLabels(root:HTMLElement){
  const labels:Record<PageModeId,[string,string]>={
    template:['テンプレート','Template'],
    manuscript:['原稿設定','Manuscript'],
    layout:['手動コマ割り','Manual layout']
  };
  root.querySelectorAll<HTMLButtonElement>('[data-page-mode]').forEach(button=>{
    const mode=button.dataset.pageMode as PageModeId;
    const label=labels[mode];
    if(label)setTextIfChanged(button,copy(label[0],label[1]));
  });
}

function ensurePageSubmodes(pagePanel:HTMLElement,templateShell:HTMLElement,manualDisclosure:HTMLDetailsElement|null){
  let root=byId<HTMLElement>('phase1PageModes');
  if(!root){
    root=document.createElement('section');
    root.id='phase1PageModes';
    root.className='phase1-page-modes';
    root.innerHTML=`<div class="phase1-page-subtabs" role="tablist" aria-label="Page authoring mode">
      <button id="phase1PageModeTemplate" type="button" role="tab" data-page-mode="template" aria-controls="phase1PageModeTemplatePanel"></button>
      <button id="phase1PageModeManuscript" type="button" role="tab" data-page-mode="manuscript" aria-controls="phase1PageModeManuscriptPanel"></button>
      <button id="phase1PageModeLayout" type="button" role="tab" data-page-mode="layout" aria-controls="phase1PageModeLayoutPanel"></button>
    </div>
    <div id="phase1PageModeTemplatePanel" role="tabpanel" aria-labelledby="phase1PageModeTemplate" data-page-mode-panel="template"></div>
    <div id="phase1PageModeManuscriptPanel" role="tabpanel" aria-labelledby="phase1PageModeManuscript" data-page-mode-panel="manuscript"></div>
    <div id="phase1PageModeLayoutPanel" role="tabpanel" aria-labelledby="phase1PageModeLayout" data-page-mode-panel="layout"></div>`;
    const manuscriptStart=[...pagePanel.children].find(element=>element instanceof HTMLElement&&element.dataset.i18n==='canvasSize') as HTMLElement|undefined;
    if(manuscriptStart)pagePanel.insertBefore(root,manuscriptStart);else pagePanel.prepend(root);
    const manuscriptPane=root.querySelector<HTMLElement>('[data-page-mode-panel="manuscript"]')!;
    let cursor:Element|null=manuscriptStart||null;
    while(cursor&&cursor!==templateShell&&cursor!==manualDisclosure){
      const next=cursor.nextElementSibling;
      manuscriptPane.appendChild(cursor);
      cursor=next;
    }
    root.querySelector<HTMLElement>('[data-page-mode-panel="template"]')!.appendChild(templateShell);
    if(manualDisclosure){
      manualDisclosure.open=true;
      manualDisclosure.classList.add('phase1-manual-layout-pane');
      root.querySelector<HTMLElement>('[data-page-mode-panel="layout"]')!.appendChild(manualDisclosure);
    }
    const tabs=[...root.querySelectorAll<HTMLButtonElement>('[data-page-mode]')];
    tabs.forEach(button=>button.addEventListener('click',()=>setPageMode(root!,button.dataset.pageMode as PageModeId)));
    root.querySelector('.phase1-page-subtabs')?.addEventListener('keydown',event=>{
      if(!(event instanceof KeyboardEvent))return;
      const current=tabs.findIndex(button=>button===document.activeElement);
      if(current<0)return;
      let next=current;
      if(event.key==='ArrowRight')next=(current+1)%tabs.length;
      else if(event.key==='ArrowLeft')next=(current-1+tabs.length)%tabs.length;
      else if(event.key==='Home')next=0;
      else if(event.key==='End')next=tabs.length-1;
      else return;
      event.preventDefault();
      setPageMode(root!,tabs[next].dataset.pageMode as PageModeId,true);
    });
  }else{
    const templatePane=root.querySelector<HTMLElement>('[data-page-mode-panel="template"]');
    const layoutPane=root.querySelector<HTMLElement>('[data-page-mode-panel="layout"]');
    if(templatePane&&templateShell.parentElement!==templatePane)templatePane.appendChild(templateShell);
    if(layoutPane&&manualDisclosure&&manualDisclosure.parentElement!==layoutPane)layoutPane.appendChild(manualDisclosure);
  }
  refreshLabels(root);
  setPageMode(root,activePageMode);
}

export function composePageModes(pagePanel:HTMLElement,templateShell:HTMLElement){
  const manualDisclosure=ensureManualLayoutDisclosure(pagePanel);
  ensurePageSubmodes(pagePanel,templateShell,manualDisclosure);
}
