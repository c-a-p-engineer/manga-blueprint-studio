import {byId,copy,moveNodeInto,setTextIfChanged} from './dom-helpers';

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

export function composePanelDisclosures(){
  const panelSection=document.querySelector<HTMLElement>('.tool-panel[data-section="panel"]');
  if(!panelSection)return;
  const selectedSummary=byId('selectedPanelSummary');
  if(!selectedSummary)return;

  const content=ensureDisclosure('phase1PanelContentDisclosure','内容・役割','Content + role','コマの物語上の役割を設定','Set the narrative role of this panel',true);
  const camera=ensureDisclosure('phase1PanelCameraDisclosure','カメラ','Camera','距離・角度・視点・構図','Distance, angle, viewpoint and composition');
  const frame=ensureDisclosure('phase1PanelFrameDisclosure','枠・形状','Frame + shape','枠、断ち切り、四隅、差し込みコマ','Border, bleed, geometry and inset panels');

  if(!content.parentElement)selectedSummary.insertAdjacentElement('afterend',content);
  if(!camera.parentElement)content.insertAdjacentElement('afterend',camera);
  if(!frame.parentElement)camera.insertAdjacentElement('afterend',frame);

  moveNodeInto(content,byId('panelRole')?.closest('label')||null);
  const cameraHeading=[...panelSection.children].find(element=>element instanceof HTMLElement&&element.dataset.i18n==='cameraHeading')||null;
  moveNodeInto(camera,cameraHeading);
  for(const id of ['cameraQuickPreset','cameraDistance','cameraAngle','cameraViewpoint','cameraFocus','cameraIntent']){
    moveNodeInto(camera,byId(id)?.closest('label')||null);
  }
  moveNodeInto(camera,byId('cameraHelp'));

  const frameHeading=[...panelSection.children].find(element=>element instanceof HTMLElement&&element.dataset.i18n==='frameHeading')||null;
  moveNodeInto(frame,frameHeading);
  for(const id of ['borderStyle','bleedEdge','breakoutMode']){
    moveNodeInto(frame,byId(id)?.closest('label')||null);
  }
  moveNodeInto(frame,byId('panelShapeControls33'));
  moveNodeInto(frame,byId('insetPanelControls19'));
}
