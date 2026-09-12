import './phase-one-ui.css';

type LegacyRuntimeGlobal=typeof globalThis&{
  renderHierarchy16?:()=>void;
  applySelectedTemplateWithCast36?:()=>unknown;
  applyTemplatePresentation34?:()=>unknown;
};

const runtime=globalThis as LegacyRuntimeGlobal;
let applyingTemplate=false;
let composeQueued=false;
let pagePanelObserver:MutationObserver|null=null;

const byId=<T extends HTMLElement>(id:string)=>document.getElementById(id) as T|null;
const currentLanguage=()=>((byId<HTMLSelectElement>('languageSelect')?.value||document.documentElement.lang||'ja').toLowerCase().startsWith('en')?'en':'ja');
const copy=(ja:string,en:string)=>currentLanguage()==='en'?en:ja;
const setTextIfChanged=(node:Element|null,value:string)=>{if(node&&node.textContent!==value)node.textContent=value;};

function disableLegacyHierarchyEditor(){
  const removeLegacy=()=>byId('containerManager16')?.remove();
  removeLegacy();
  if(typeof runtime.renderHierarchy16==='function'){
    runtime.renderHierarchy16=removeLegacy;
  }
}

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

type PageModeId='template'|'manuscript'|'layout';
let activePageMode:PageModeId='template';

function ensureDisclosure(id:string,titleJa:string,titleEn:string,helpJa:string,helpEn:string,open=false){
  let details=byId<HTMLDetailsElement>(id);
  if(!details){
    details=document.createElement('details');
    details.id=id;
    details.className='phase1-disclosure';
    details.open=open;
    const summary=document.createElement('summary');
    summary.innerHTML='<strong></strong><span></span>';
    details.appendChild(summary);
  }
  setTextIfChanged(details.querySelector('summary strong'),copy(titleJa,titleEn));
  setTextIfChanged(details.querySelector('summary span'),copy(helpJa,helpEn));
  return details;
}

function moveNodeInto(host:HTMLElement,node:Element|null){
  if(node&&node.parentElement!==host)host.appendChild(node);
}

function setPageMode19(root:HTMLElement,mode:PageModeId,focus=false){
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

function refreshPageModeLabels19(root:HTMLElement){
  const labels:Record<PageModeId,[string,string]>={
    template:['テンプレート','Template'],manuscript:['原稿設定','Manuscript'],layout:['手動コマ割り','Manual layout']
  };
  root.querySelectorAll<HTMLButtonElement>('[data-page-mode]').forEach(button=>{
    const mode=button.dataset.pageMode as PageModeId;
    const label=labels[mode];if(label)setTextIfChanged(button,copy(label[0],label[1]));
  });
}

function ensurePageSubmodes19(pagePanel:HTMLElement,shell:HTMLElement,manualDisclosure:HTMLDetailsElement|null){
  let root=byId<HTMLElement>('phase1PageModes');
  if(!root){
    root=document.createElement('section');root.id='phase1PageModes';root.className='phase1-page-modes';
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
    while(cursor&&cursor!==shell&&cursor!==manualDisclosure){
      const next=cursor.nextElementSibling;manuscriptPane.appendChild(cursor);cursor=next;
    }
    root.querySelector<HTMLElement>('[data-page-mode-panel="template"]')!.appendChild(shell);
    if(manualDisclosure){manualDisclosure.open=true;manualDisclosure.classList.add('phase1-manual-layout-pane');root.querySelector<HTMLElement>('[data-page-mode-panel="layout"]')!.appendChild(manualDisclosure);}
    const tabs=[...root.querySelectorAll<HTMLButtonElement>('[data-page-mode]')];
    tabs.forEach(button=>button.addEventListener('click',()=>setPageMode19(root!,button.dataset.pageMode as PageModeId)));
    root.querySelector('.phase1-page-subtabs')?.addEventListener('keydown',event=>{
      if(!(event instanceof KeyboardEvent))return;
      const current=tabs.findIndex(button=>button===document.activeElement);if(current<0)return;
      let next=current;
      if(event.key==='ArrowRight')next=(current+1)%tabs.length;else if(event.key==='ArrowLeft')next=(current-1+tabs.length)%tabs.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=tabs.length-1;else return;
      event.preventDefault();setPageMode19(root!,tabs[next].dataset.pageMode as PageModeId,true);
    });
  }else{
    const templatePane=root.querySelector<HTMLElement>('[data-page-mode-panel="template"]');
    const layoutPane=root.querySelector<HTMLElement>('[data-page-mode-panel="layout"]');
    if(templatePane&&shell.parentElement!==templatePane)templatePane.appendChild(shell);
    if(layoutPane&&manualDisclosure&&manualDisclosure.parentElement!==layoutPane)layoutPane.appendChild(manualDisclosure);
  }
  refreshPageModeLabels19(root);setPageMode19(root,activePageMode);
}

function ensurePanelDisclosures19(){
  const panelSection=document.querySelector<HTMLElement>('.tool-panel[data-section="panel"]');if(!panelSection)return;
  const selectedSummary=byId('selectedPanelSummary');if(!selectedSummary)return;
  const content=ensureDisclosure('phase1PanelContentDisclosure','内容・役割','Content + role','コマの物語上の役割を設定','Set the narrative role of this panel',true);
  const camera=ensureDisclosure('phase1PanelCameraDisclosure','カメラ','Camera','距離・角度・視点・構図','Distance, angle, viewpoint and composition');
  const frame=ensureDisclosure('phase1PanelFrameDisclosure','枠・形状','Frame + shape','枠、断ち切り、四隅、差し込みコマ','Border, bleed, geometry and inset panels');
  if(!content.parentElement)selectedSummary.insertAdjacentElement('afterend',content);
  if(!camera.parentElement)content.insertAdjacentElement('afterend',camera);
  if(!frame.parentElement)camera.insertAdjacentElement('afterend',frame);
  moveNodeInto(content,byId('panelRole')?.closest('label')||null);
  const cameraHeading=[...panelSection.children].find(element=>element instanceof HTMLElement&&element.dataset.i18n==='cameraHeading')||null;
  moveNodeInto(camera,cameraHeading);
  for(const id of ['cameraQuickPreset','cameraDistance','cameraAngle','cameraViewpoint','cameraFocus','cameraIntent'])moveNodeInto(camera,byId(id)?.closest('label')||null);
  moveNodeInto(camera,byId('cameraHelp'));
  const frameHeading=[...panelSection.children].find(element=>element instanceof HTMLElement&&element.dataset.i18n==='frameHeading')||null;
  moveNodeInto(frame,frameHeading);
  for(const id of ['borderStyle','bleedEdge','breakoutMode'])moveNodeInto(frame,byId(id)?.closest('label')||null);
  moveNodeInto(frame,byId('panelShapeControls33'));moveNodeInto(frame,byId('insetPanelControls19'));
}

function ensureTemplateHeader(shell:HTMLElement){
  let header=byId('phase1TemplateHeader');
  if(!header){
    header=document.createElement('div');
    header.id='phase1TemplateHeader';
    header.className='phase1-template-header';
    header.innerHTML=`
      <div>
        <span class="phase1-kicker">${copy('おすすめの開始方法','Recommended start')}</span>
        <h3>${copy('テンプレートからページを作る','Build the page from a template')}</h3>
        <p>${copy('コマ割り・演出・セリフ例をまとめて選び、使用キャラクターを決めて適用します。','Choose layout, direction and sample dialogue together, select the cast, then apply.')}</p>
      </div>
      <ol class="phase1-steps" aria-label="${copy('テンプレート適用手順','Template workflow')}">
        <li><span>1</span>${copy('テンプレート','Template')}</li>
        <li><span>2</span>${copy('セリフ・キャラ','Dialogue + cast')}</li>
        <li><span>3</span>${copy('適用','Apply')}</li>
      </ol>`;
    shell.prepend(header);
  }else{
    const kicker=header.querySelector('.phase1-kicker');
    const title=header.querySelector('h3');
    const lead=header.querySelector('p');
    setTextIfChanged(kicker,copy('おすすめの開始方法','Recommended start'));
    setTextIfChanged(title,copy('テンプレートからページを作る','Build the page from a template'));
    setTextIfChanged(lead,copy('コマ割り・演出・セリフ例をまとめて選び、使用キャラクターを決めて適用します。','Choose layout, direction and sample dialogue together, select the cast, then apply.'));
  }
}

function ensureFeedback(shell:HTMLElement){
  let feedback=byId('phase1TemplateFeedback');
  if(!feedback){
    feedback=document.createElement('p');
    feedback.id='phase1TemplateFeedback';
    feedback.className='phase1-template-feedback';
    feedback.setAttribute('role','status');
    feedback.setAttribute('aria-live','polite');
    shell.appendChild(feedback);
  }
  return feedback;
}

function composeTemplateWorkflow(){
  disableLegacyHierarchyEditor();
  const pagePanel=document.querySelector<HTMLElement>('.tool-panel[data-section="page"]');
  const legacyWorkflow=byId('templateWorkflowTop36');
  const studio=byId('templateStudio13');
  const cast=byId('templateCastAction36');
  const apply=byId<HTMLButtonElement>('applyStoryTemplate11');
  if(!pagePanel||!studio)return;

  let shell=byId('phase1TemplateShell');
  if(!shell){
    shell=document.createElement('section');
    shell.id='phase1TemplateShell';
    shell.className='phase1-template-shell';
    const manualStart=manualLayoutStart(pagePanel);
    if(manualStart)pagePanel.insertBefore(shell,manualStart);else pagePanel.prepend(shell);
  }
  ensureTemplateHeader(shell);

  if(legacyWorkflow&&legacyWorkflow.parentElement!==shell)shell.appendChild(legacyWorkflow);
  if(!legacyWorkflow&&studio.parentElement!==shell)shell.appendChild(studio);
  if(cast&&cast.parentElement!==legacyWorkflow&&cast.parentElement!==shell){
    (legacyWorkflow||shell).appendChild(cast);
  }

  const textChoice=byId<HTMLInputElement>('storyTemplateText11')?.closest('label');
  if(textChoice&&cast&&!cast.contains(textChoice))cast.appendChild(textChoice);
  if(apply){
    apply.hidden=false;
    apply.removeAttribute('aria-hidden');
    apply.classList.add('primary','phase1-template-apply');
    if(cast&&!cast.contains(apply))cast.appendChild(apply);
  }

  const oldBlock=byId('storyTemplateBlock11');
  if(oldBlock){oldBlock.hidden=true;oldBlock.setAttribute('aria-hidden','true');}
  const oldPreview=byId('storyTemplatePreview11');
  if(oldPreview){oldPreview.hidden=true;oldPreview.setAttribute('aria-hidden','true');}

  ensureFeedback(shell);
  const manualDisclosure=ensureManualLayoutDisclosure(pagePanel);
  ensurePageSubmodes19(pagePanel,shell,manualDisclosure);
  ensurePanelDisclosures19();
  pagePanelObserver?.takeRecords();
}

function applyTemplateFromPrimaryAction(event:Event){
  const target=event.target instanceof Element?event.target.closest('#applyStoryTemplate11'):null;
  if(!(target instanceof HTMLButtonElement)||target.disabled||applyingTemplate)return;
  const runner=typeof runtime.applySelectedTemplateWithCast36==='function'
    ?runtime.applySelectedTemplateWithCast36
    :runtime.applyTemplatePresentation34;
  if(typeof runner!=='function'){
    const feedback=byId('phase1TemplateFeedback');
    if(feedback)feedback.textContent=copy('テンプレート適用処理を読み込めませんでした。再読み込みしてください。','Template apply logic is unavailable. Reload the page.');
    return;
  }
  event.preventDefault();
  event.stopImmediatePropagation();
  applyingTemplate=true;
  try{
    runner();
    const feedback=byId('phase1TemplateFeedback');
    if(feedback)feedback.textContent=copy('テンプレートを現在のページへ適用しました。','Template applied to the current page.');
  }catch(error){
    console.error('Template apply failed.',error);
    const feedback=byId('phase1TemplateFeedback');
    if(feedback)feedback.textContent=copy('テンプレートの適用に失敗しました。','Template application failed.');
  }finally{
    applyingTemplate=false;
    queueCompose();
  }
}

function queueCompose(){
  if(composeQueued)return;
  composeQueued=true;
  queueMicrotask(()=>{
    composeQueued=false;
    composeTemplateWorkflow();
  });
}

export function installPhaseOneUi(){
  composeTemplateWorkflow();
  document.addEventListener('click',applyTemplateFromPrimaryAction,true);
  byId('languageSelect')?.addEventListener('change',queueCompose);
  const pagePanel=document.querySelector<HTMLElement>('.tool-panel[data-section="page"]');
  if(pagePanel){
    pagePanelObserver=new MutationObserver(queueCompose);
    pagePanelObserver.observe(pagePanel,{childList:true,subtree:true});
  }
}
