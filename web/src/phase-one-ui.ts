import './phase-one-ui.css';
import {EDITOR_RENDERED_EVENT} from './runtime/legacy-api';
import {byId} from './ui/dom-helpers';
import {composeTemplateWorkflow,handleTemplatePrimaryAction} from './ui/template-workflow';

let composeQueued=false;

function queueCompose(){
  if(composeQueued)return;
  composeQueued=true;
  queueMicrotask(()=>{
    composeQueued=false;
    composeTemplateWorkflow();
  });
}

function bindTemplateApply(){
  const button=byId<HTMLButtonElement>('applyStoryTemplate11');
  if(!button||button.dataset.phase1Bound==='true')return;
  button.dataset.phase1Bound='true';
  button.addEventListener('click',event=>{
    if(handleTemplatePrimaryAction(event))queueCompose();
  });
}

export function installPhaseOneUi(){
  composeTemplateWorkflow();
  bindTemplateApply();
  document.addEventListener(EDITOR_RENDERED_EVENT,()=>{
    queueCompose();
    queueMicrotask(bindTemplateApply);
  });
  byId('languageSelect')?.addEventListener('change',queueCompose);
}
