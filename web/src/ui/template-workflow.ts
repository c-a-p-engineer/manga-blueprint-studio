import {applySelectedStoryTemplate,suppressLegacyHierarchyEditor} from '../runtime/legacy-api';
import {byId,copy,setTextIfChanged} from './dom-helpers';
import {composePageModes} from './page-modes';
import {composePanelDisclosures} from './panel-disclosures';

let applyingTemplate=false;

function disableLegacyHierarchyEditor(){
  const removeLegacy=()=>byId('containerManager16')?.remove();
  suppressLegacyHierarchyEditor(removeLegacy);
}

function manualLayoutStart(pagePanel:HTMLElement){
  return [...pagePanel.children].find(element=>element instanceof HTMLElement&&element.dataset.i18n==='panelLayout') as HTMLElement|undefined;
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
    return;
  }
  setTextIfChanged(header.querySelector('.phase1-kicker'),copy('おすすめの開始方法','Recommended start'));
  setTextIfChanged(header.querySelector('h3'),copy('テンプレートからページを作る','Build the page from a template'));
  setTextIfChanged(header.querySelector('p'),copy('コマ割り・演出・セリフ例をまとめて選び、使用キャラクターを決めて適用します。','Choose layout, direction and sample dialogue together, select the cast, then apply.'));
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

export function composeTemplateWorkflow(){
  disableLegacyHierarchyEditor();
  const pagePanel=document.querySelector<HTMLElement>('.tool-panel[data-section="page"]');
  const legacyWorkflow=byId('templateWorkflowTop36');
  const studio=byId('templateStudio13');
  const cast=byId('templateCastAction36');
  const apply=byId<HTMLButtonElement>('applyStoryTemplate11');
  if(!pagePanel||!studio)return;

  let shell=byId<HTMLElement>('phase1TemplateShell');
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
  if(cast&&cast.parentElement!==legacyWorkflow&&cast.parentElement!==shell)(legacyWorkflow||shell).appendChild(cast);

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
  composePageModes(pagePanel,shell);
  composePanelDisclosures();
}

export function handleTemplatePrimaryAction(event:Event){
  const target=event.target instanceof Element?event.target.closest('#applyStoryTemplate11'):null;
  if(!(target instanceof HTMLButtonElement)||target.disabled||applyingTemplate)return false;
  event.preventDefault();
  event.stopImmediatePropagation();
  applyingTemplate=true;
  try{
    applySelectedStoryTemplate();
    const feedback=byId('phase1TemplateFeedback');
    if(feedback)feedback.textContent=copy('テンプレートを現在のページへ適用しました。','Template applied to the current page.');
  }catch(error){
    console.error('Template apply failed.',error);
    const feedback=byId('phase1TemplateFeedback');
    if(feedback){
      feedback.textContent=error instanceof Error&&error.message.includes('unavailable')
        ?copy('テンプレート適用処理を読み込めませんでした。再読み込みしてください。','Template apply logic is unavailable. Reload the page.')
        :copy('テンプレートの適用に失敗しました。','Template application failed.');
    }
  }finally{
    applyingTemplate=false;
  }
  return true;
}
