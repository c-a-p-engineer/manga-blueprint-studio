import fs from 'node:fs';
import vm from 'node:vm';

const source=fs.readFileSync('web/runtime/authoring/inset-panels.js','utf8');
const uidState={value:0};
const clone=value=>structuredClone(value);
const uid=prefix=>`${prefix}_${++uidState.value}`;
const defaultStyle=()=>({border:'normal',bleed:'none',breakout:'none'});
const defaultCamera=()=>({distance:'medium',angle:'eye-level',viewpoint:'front',focus:'',intent:''});
const defaultBackground=()=>({location:'',timeOfDay:'',weather:'',mood:'',detailLevel:'medium',renderMode:'normal',notes:''});
const defaultEffects=()=>({lineEffect:'none',strength:'medium',sfxText:'',sfxStyle:'impact',notes:''});
const makePanel=(rect,order)=>({id:uid('panel'),order,rect:{...rect},role:'setup',style:defaultStyle(),camera:defaultCamera(),background:defaultBackground(),effects:defaultEffects(),characters:[],balloons:[]});

const rootA=makePanel({x:410,y:35,w:355,h:500},1);
const rootB=makePanel({x:35,y:35,w:355,h:500},2);
const page={id:'page_1',panels:[rootA,rootB]};
const project={format:'manga-blueprint/0.2',meta:{readingDirection:'rtl'},pages:[page]};
let selectedPanelId=rootA.id;
let selectedCharacterId=null;
let selectedBalloonId=null;

const baseReading=target=>[...(target?.panels||[])].sort((a,b)=>a.order-b.order);
function remapClonePage(source){
  const next=clone(source);
  next.id=uid('page');
  next.panels=(source.panels||[]).map(panel=>({...clone(panel),id:uid('panel')}));
  return next;
}
function blankPage(){return remapClonePage(page);}
function cloneProject(input){
  const next=clone(input);
  next.pages=(input.pages||[]).map(remapClonePage);
  return next;
}

const context={
  console,structuredClone,clone,uid,project,
  i18n:{ja:{},en:{}},language:'ja',
  t:key=>context.i18n.ja[key]||key,
  alert:message=>{context.lastAlert=message;},
  confirm:()=>true,
  lastAlert:'',
  selectedPanelId,selectedCharacterId,selectedBalloonId,
  currentPage:()=>page,
  selectedPanel:()=>page.panels.find(panel=>panel.id===context.selectedPanelId)||null,
  makePanel,defaultStyle,defaultCamera,defaultBackground,defaultEffects,
  panelRect:panel=>({...panel.rect}),
  mutate:fn=>fn(),render:()=>{},renderUi:()=>{},applyLanguage:()=>{},
  renderSvg:()=>'<svg><g data-panel="panel_1"></g></svg>',
  splitPanel:()=>true,
  readingOrderedPanels16:baseReading,
  renumberPanels(){baseReading(page).forEach((panel,index)=>{panel.order=index+1;});},
  normalizeProject:input=>clone(input),
  ensureProjectIdentity:input=>clone(input),
  clonePageForDuplicate15:remapClonePage,
  blankPageFromCurrent15:blankPage,
  cloneProjectAsNewWork:cloneProject,
  renderBriefObject30:()=>({panels:baseReading(page).map(panel=>({order:panel.order})),preservation:{preserveExact:[]}}),
  renderBriefText30:()=> 'BASE RENDER BRIEF',
  exportManifest08:()=>({schema:'manga-blueprint-export-manifest/3',crossModelHints:{}}),
  escapeXml:value=>String(value),
  $:()=>null,
  document:{querySelectorAll:()=>[]},
  queueMicrotask,
};
context.globalThis=context;
vm.createContext(context);
vm.runInContext(source,context,{filename:'inset-panels.js'});

const model=context.insetPanelModel19;
if(!model)throw new Error('insetPanelModel19 export missing');

// Add one inset to the first root. It must become a real panel with a stable parent reference.
if(model.add()!==true)throw new Error('addInsetPanel19 did not succeed');
if(page.panels.length!==3)throw new Error(`Expected 3 panels after inset add, got ${page.panels.length}`);
const child=page.panels.find(panel=>model.validMeta(panel));
if(!child)throw new Error('Added panel is missing inset metadata');
if(model.parent(child)?.id!==rootA.id)throw new Error('Inset parent relation is incorrect');
const cr=child.rect,pr=rootA.rect;
if(cr.x<pr.x||cr.y<pr.y||cr.x+cr.w>pr.x+pr.w||cr.y+cr.h>pr.y+pr.h)throw new Error('Inset rect must remain inside its parent in P0');

const order=context.readingOrderedPanels16(page);
if(order.indexOf(child)!==order.indexOf(rootA)+1)throw new Error('Inset panel must follow its parent in semantic reading order');
context.renumberPanels();
if(child.order!==rootA.order+1)throw new Error('Inset order was not renumbered immediately after parent');

const brief=context.renderBriefObject30();
if(brief.panelHierarchyModel!=='one-level-inset-panels')throw new Error('Render brief missing panelHierarchyModel');
if(brief.insetPanels?.length!==1||brief.insetPanels[0].parentPanelId!==rootA.id)throw new Error('Render brief inset contract is incorrect');
if(!brief.preservation.preserveExact.includes('inset-panel-parentage'))throw new Error('Render brief must preserve inset parentage exactly');
const briefText=context.renderBriefText30();
if(!briefText.includes('INSET PANEL CONTRACT')||!briefText.includes('physically overlaid inside'))throw new Error('Render brief text lacks inset hierarchy instructions');
const manifest=context.exportManifest08({},'ai',{});
if(manifest.panelHierarchy?.insets?.length!==1)throw new Error('Manifest missing panel hierarchy');
if(manifest.crossModelHints?.preserveInsetPanelParentage!==true)throw new Error('Manifest missing inset preservation hint');

// Page duplication must remap the child reference to the regenerated parent id.
const duplicate=context.clonePageForDuplicate15(page);
const dupChild=duplicate.panels.find(panel=>panel.inset);
if(!dupChild)throw new Error('Duplicated page lost inset metadata');
if(dupChild.inset.parentPanelId===rootA.id)throw new Error('Duplicated page kept stale parentPanelId');
if(!duplicate.panels.some(panel=>panel.id===dupChild.inset.parentPanelId))throw new Error('Duplicated inset parent does not exist in duplicate');

// Child deletion is local. Parent deletion cascades its child, while the final root is protected.
context.selectedPanelId=child.id;
if(model.deleteSelected()!==true||page.panels.includes(child))throw new Error('Deleting an inset child should delete only that child');
context.selectedPanelId=rootA.id;
if(model.add()!==true)throw new Error('Unable to recreate inset for cascade test');
const child2=page.panels.find(panel=>model.validMeta(panel));
context.selectedPanelId=rootA.id;
if(model.deleteSelected()!==true)throw new Error('Parent cascade deletion failed');
if(page.panels.some(panel=>panel.id===rootA.id||panel.id===child2.id))throw new Error('Parent deletion must remove its inset child');
if(page.panels.length!==1)throw new Error('Cascade deletion removed unrelated root panel');
context.selectedPanelId=rootB.id;
if(model.deleteSelected()!==false)throw new Error('Final root panel must be protected');

for(const token of ['panel-in-panel','data-inset-panel19','fill="#fff"','one-level-inset-panels','preserveInsetPanelParentage','小窓風枠']){
  if(!source.includes(token))throw new Error(`Inset runtime missing contract token: ${token}`);
}

console.log('Inset panel contract: one-level parentage, order, duplicate remap, delete semantics, clean-mask rendering, and AI handoff passed.');
