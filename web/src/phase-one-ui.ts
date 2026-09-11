import './phase-one-ui.css';

type LegacyRuntimeGlobal=typeof globalThis&{
  renderHierarchy16?:()=>void;
  applySelectedTemplateWithCast36?:()=>unknown;
  applyTemplatePresentation34?:()=>unknown;
};

const runtime=globalThis as LegacyRuntimeGlobal;
let applyingTemplate=false;
let composeQueued=false;

const byId=<T extends HTMLElement>(id:string)=>document.getElementById(id) as T|null;
const currentLanguage=()=>((byId<HTMLSelectElement>('languageSelect')?.value||document.documentElement.lang||'ja').toLowerCase().startsWith('en')?'en':'ja');
const copy=(ja:string,en:string)=>currentLanguage()==='en'?en:ja;

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
    const next=cursor.nextElementSibling;
    details.appendChild(cursor);
    cursor=next;
  }
  return details;
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
    if(kicker)kicker.textContent=copy('おすすめの開始方法','Recommended start');
    if(title)title.textContent=copy('テンプレートからページを作る','Build the page from a template');
    if(lead)lead.textContent=copy('コマ割り・演出・セリフ例をまとめて選び、使用キャラクターを決めて適用します。','Choose layout, direction and sample dialogue together, select the cast, then apply.');
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
  ensureManualLayoutDisclosure(pagePanel);
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
    const observer=new MutationObserver(queueCompose);
    observer.observe(pagePanel,{childList:true,subtree:true});
  }
}
