// Prototype 0.19.0: one-level panel-in-panel authoring.
// Inset panels remain ordinary editable panels with a stable parent relation so existing
// character/background/text/effect editors continue to work without a second panel model.

Object.assign(i18n.ja,{
  insetPanelHeading19:'差し込みコマ',
  insetPanelHelp19:'選択中の親コマ右上へ、小さな独立コマを重ねます。差し込みコマは通常のコマと同じように編集できます。',
  insetPanelAdd19:'＋ 差し込みコマ',
  insetPanelSelect19:'差し込みコマを選択',
  insetPanelChild19:'差し込みコマ',
  insetPanelParent19:'親コマ',
  insetPanelNoNested19:'差し込みコマの中へ、さらに差し込みコマは追加できません。',
  insetPanelTooSmall19:'このコマは差し込みコマを置くには小さすぎます。',
  insetPanelSplit19:'差し込み関係があるコマはP0では分割できません。先に差し込みコマを削除してください。',
  insetPanelDeleteParent19:'この親コマを削除すると、内側の差し込みコマも削除されます。続行しますか？',
  insetPanelLastRoot19:'最後の親コマは削除できません。',
  legacyInsetBorder19:'小窓風枠 / Inset-style border'
});
Object.assign(i18n.en,{
  insetPanelHeading19:'Inset panel',
  insetPanelHelp19:'Overlays one small editable panel in the top-right of the selected parent panel. It uses the same panel editor as ordinary panels.',
  insetPanelAdd19:'+ Inset panel',
  insetPanelSelect19:'Select inset panel',
  insetPanelChild19:'Inset panel',
  insetPanelParent19:'Parent panel',
  insetPanelNoNested19:'Nested inset panels are not supported in this P0.',
  insetPanelTooSmall19:'This panel is too small to host an inset panel.',
  insetPanelSplit19:'Panels participating in an inset relation cannot be split in this P0. Remove the inset first.',
  insetPanelDeleteParent19:'Deleting this parent also deletes its inset panel. Continue?',
  insetPanelLastRoot19:'The final parent panel cannot be deleted.',
  legacyInsetBorder19:'Inset-style border'
});

const INSET_ANCHORS_19=new Set(['top-right','top-left','bottom-right','bottom-left','center']);
const INSET_SIZES_19=new Set(['small','medium','large']);

function insetMeta19(panel){
  const inset=panel?.inset;
  if(!inset||typeof inset!=='object')return null;
  const parentPanelId=String(inset.parentPanelId||'').trim();
  if(!parentPanelId)return null;
  return {
    kind:'panel-in-panel',
    parentPanelId,
    anchor:INSET_ANCHORS_19.has(inset.anchor)?inset.anchor:'top-right',
    size:INSET_SIZES_19.has(inset.size)?inset.size:'medium'
  };
}
function panelMap19(page=currentPage()){
  return new Map((page?.panels||[]).map(panel=>[panel.id,panel]));
}
function validInsetMeta19(panel,page=currentPage()){
  const meta=insetMeta19(panel);if(!meta)return null;
  const parent=panelMap19(page).get(meta.parentPanelId);
  if(!parent||parent===panel||insetMeta19(parent))return null;
  return meta;
}
function insetChildren19(parent,page=currentPage()){
  if(!parent)return[];
  return (page?.panels||[]).filter(panel=>validInsetMeta19(panel,page)?.parentPanelId===parent.id);
}
function parentPanel19(panel,page=currentPage()){
  const meta=validInsetMeta19(panel,page);return meta?panelMap19(page).get(meta.parentPanelId)||null:null;
}
function normalizeInsetPage19(page){
  if(!page?.panels)return page;
  const byId=new Map(page.panels.map(panel=>[panel.id,panel]));
  for(const panel of page.panels){
    const meta=insetMeta19(panel);if(!meta){delete panel.inset;continue;}
    const parent=byId.get(meta.parentPanelId);
    if(!parent||parent===panel||insetMeta19(parent)){delete panel.inset;continue;}
    panel.inset=meta;
    panel.style ||= defaultStyle();
    panel.style.bleed='none';
    panel.style.breakout='none';
  }
  return page;
}

const normalizeProjectBase19=normalizeProject;
normalizeProject=function(input){
  const normalized=normalizeProjectBase19(input);
  for(const page of normalized.pages||[])normalizeInsetPage19(page);
  return normalized;
};
project=normalizeProject(project);

function remapInsetReferences19(sourcePanels,targetPanels){
  const idMap=new Map((sourcePanels||[]).map((panel,index)=>[panel.id,targetPanels?.[index]?.id]));
  (targetPanels||[]).forEach((panel,index)=>{
    const source=sourcePanels?.[index],sourceMeta=insetMeta19(source);
    if(!sourceMeta){delete panel.inset;return;}
    const mapped=idMap.get(sourceMeta.parentPanelId);
    if(mapped)panel.inset={...sourceMeta,parentPanelId:mapped};else delete panel.inset;
  });
}
if(typeof clonePageForDuplicate15==='function'){
  const clonePageForDuplicateBase19=clonePageForDuplicate15;
  clonePageForDuplicate15=function(source){
    const next=clonePageForDuplicateBase19(source);
    remapInsetReferences19(source?.panels||[],next?.panels||[]);
    return next;
  };
}
if(typeof blankPageFromCurrent15==='function'){
  const blankPageFromCurrentBase19=blankPageFromCurrent15;
  blankPageFromCurrent15=function(){
    const source=currentPage(),next=blankPageFromCurrentBase19();
    remapInsetReferences19(source?.panels||[],next?.panels||[]);
    return next;
  };
}
if(typeof cloneProjectAsNewWork==='function'){
  const cloneProjectAsNewWorkBase19=cloneProjectAsNewWork;
  cloneProjectAsNewWork=function(input){
    const source=ensureProjectIdentity(input),next=cloneProjectAsNewWorkBase19(input);
    source.pages.forEach((page,index)=>remapInsetReferences19(page.panels||[],next.pages?.[index]?.panels||[]));
    return next;
  };
}

function insetDefaultRect19(parent,anchor='top-right',size='medium'){
  const r=panelRect(parent),margin=Math.max(12,Math.min(22,Math.min(r.w,r.h)*.055));
  const ratios={small:.27,medium:.35,large:.43},ratio=ratios[size]||ratios.medium;
  const w=Math.min(r.w-margin*2,Math.max(132,r.w*ratio));
  const h=Math.min(r.h-margin*2,Math.max(108,r.h*Math.max(.25,ratio*.78)));
  if(!Number.isFinite(w)||!Number.isFinite(h)||w<120||h<96||r.w<180||r.h<150)return null;
  let x=r.x+margin,y=r.y+margin;
  if(anchor.includes('right'))x=r.x+r.w-w-margin;
  if(anchor.includes('bottom'))y=r.y+r.h-h-margin;
  if(anchor==='center'){x=r.x+(r.w-w)/2;y=r.y+(r.h-h)/2;}
  return{x,y,w,h};
}

const readingOrderedPanelsBase19=typeof readingOrderedPanels16==='function'?readingOrderedPanels16:null;
if(readingOrderedPanelsBase19){
  readingOrderedPanels16=function(page=currentPage()){
    const panels=[...(page?.panels||[])],rootPage={...page,panels:panels.filter(panel=>!validInsetMeta19(panel,page))};
    const roots=readingOrderedPanelsBase19(rootPage),rtl=(project.meta.readingDirection||'rtl')==='rtl';
    const ordered=[];
    for(const root of roots){
      ordered.push(root);
      const children=insetChildren19(root,page).sort((a,b)=>a.rect.y-b.rect.y||(rtl?b.rect.x-a.rect.x:a.rect.x-b.rect.x));
      ordered.push(...children);
    }
    return ordered;
  };
  renumberPanels=function(){readingOrderedPanels16().forEach((panel,index)=>{panel.order=index+1;});};
}

function addInsetPanel19(){
  const parent=selectedPanel();if(!parent)return false;
  if(validInsetMeta19(parent)){alert(t('insetPanelNoNested19'));return false;}
  const existing=insetChildren19(parent);
  if(existing.length){selectedPanelId=existing[0].id;selectedCharacterId=null;selectedBalloonId=null;render();return true;}
  const rect=insetDefaultRect19(parent,'top-right','medium');
  if(!rect){alert(t('insetPanelTooSmall19'));return false;}
  mutate(()=>{
    const page=currentPage();
    for(const panel of page.panels)if(panel.order>parent.order)panel.order+=1;
    const child=makePanel(rect,parent.order+1);
    child.role='beat';
    child.style.border='normal';child.style.bleed='none';child.style.breakout='none';
    child.inset={kind:'panel-in-panel',parentPanelId:parent.id,anchor:'top-right',size:'medium'};
    page.panels.push(child);
    selectedPanelId=child.id;selectedCharacterId=null;selectedBalloonId=null;
    renumberPanels();
  });
  return true;
}

const splitPanelBase19=splitPanel;
splitPanel=function(axis){
  const panel=selectedPanel();
  if(panel&&(validInsetMeta19(panel)||insetChildren19(panel).length)){alert(t('insetPanelSplit19'));return false;}
  return splitPanelBase19(axis);
};

function deleteSelectedPanel19(){
  const panel=selectedPanel(),page=currentPage();if(!panel||!page)return false;
  const isInset=!!validInsetMeta19(panel,page),roots=page.panels.filter(item=>!validInsetMeta19(item,page));
  if(!isInset&&roots.length<=1){alert(t('insetPanelLastRoot19'));return false;}
  const children=isInset?[]:insetChildren19(panel,page);
  if(children.length&&!confirm(t('insetPanelDeleteParent19')))return false;
  const ids=new Set([panel.id,...children.map(child=>child.id)]);
  mutate(()=>{
    page.panels=page.panels.filter(item=>!ids.has(item.id));
    renumberPanels();
    selectedPanelId=readingOrderedPanels16(page)[0]?.id||page.panels[0]?.id||null;
    selectedCharacterId=null;selectedBalloonId=null;
  });
  return true;
}

function bindInsetDelete19(){
  const old=$('deletePanel');if(!old||old.dataset.insetDelete19==='1')return;
  const fresh=old.cloneNode(true);fresh.dataset.insetDelete19='1';old.replaceWith(fresh);
  fresh.addEventListener('click',deleteSelectedPanel19);
}

const renderSvgBase19=renderSvg;
renderSvg=function(annotated=true){
  let markup=renderSvgBase19(annotated),page=currentPage();
  for(const panel of page?.panels||[]){
    const meta=validInsetMeta19(panel,page);if(!meta)continue;
    const points=typeof panelRenderPoints33==='function'?panelRenderPoints33(panel):[
      {x:panel.rect.x,y:panel.rect.y},{x:panel.rect.x+panel.rect.w,y:panel.rect.y},
      {x:panel.rect.x+panel.rect.w,y:panel.rect.y+panel.rect.h},{x:panel.rect.x,y:panel.rect.y+panel.rect.h}
    ];
    const attrs=points.map(point=>`${Number(point.x).toFixed(2)},${Number(point.y).toFixed(2)}`).join(' '),r=panelRect(panel);
    const marker=`<g data-panel="${escapeXml(panel.id)}">`;
    const badge=annotated?`<g class="authoring-text" pointer-events="none"><rect x="${r.x+8}" y="${r.y+8}" width="48" height="20" rx="10" fill="#111827"/><text x="${r.x+32}" y="${r.y+22}" text-anchor="middle" font-size="10" font-weight="800" fill="#fff">INSET</text></g>`:'';
    const replacement=`<g data-panel="${escapeXml(panel.id)}" data-inset-panel19="${escapeXml(meta.parentPanelId)}"><polygon points="${attrs}" fill="#fff" stroke="none"/>${badge}`;
    if(markup.includes(marker))markup=markup.replace(marker,replacement);
  }
  return markup;
};

function ensureInsetPanelUi19(){
  if($('insetPanelControls19'))return;
  const anchor=$('panelShapeControls33')||$('breakoutMode')?.closest('label');if(!anchor)return;
  const host=document.createElement('div');host.id='insetPanelControls19';host.className='inset-panel-controls19';
  host.innerHTML=`<div class="subhead" data-i18n="insetPanelHeading19">差し込みコマ</div><p class="help" data-i18n="insetPanelHelp19"></p><button id="addInsetPanel19" type="button" class="full"></button><div id="insetPanelStatus19" class="status-box" hidden></div>`;
  anchor.insertAdjacentElement('afterend',host);
  $('addInsetPanel19').addEventListener('click',addInsetPanel19);
  if(!$('insetPanelStyle19')){
    const style=document.createElement('style');style.id='insetPanelStyle19';style.textContent=`.inset-panel-controls19{margin-top:10px;padding-top:10px;border-top:1px solid #e2e8f0}.inset-panel-controls19 .status-box{margin-top:8px}`;document.head.appendChild(style);
  }
}
function relabelLegacyInsetBorder19(){
  const option=$('borderStyle')?.querySelector('option[value="inset"]');if(option)option.textContent=t('legacyInsetBorder19');
}
function renderInsetPanelUi19(){
  ensureInsetPanelUi19();relabelLegacyInsetBorder19();
  const panel=selectedPanel(),button=$('addInsetPanel19'),status=$('insetPanelStatus19');if(!button||!status)return;
  const meta=validInsetMeta19(panel),parent=meta?parentPanel19(panel):null,children=panel&&!meta?insetChildren19(panel):[];
  button.disabled=!panel||!!meta;
  button.textContent=children.length?t('insetPanelSelect19'):t('insetPanelAdd19');
  status.hidden=!meta;
  if(meta&&parent)status.textContent=`${t('insetPanelChild19')} · ${t('insetPanelParent19')} ${parent.order}`;
}

const renderUiBase19=renderUi;
renderUi=function(){renderUiBase19();renderInsetPanelUi19();};
const applyLanguageBase19=applyLanguage;
applyLanguage=function(){applyLanguageBase19();queueMicrotask(()=>{ensureInsetPanelUi19();document.querySelectorAll('#insetPanelControls19 [data-i18n]').forEach(element=>{const key=element.dataset.i18n;element.textContent=t(key);});renderInsetPanelUi19();});};

function insetContracts19(page=currentPage()){
  const ordered=typeof readingOrderedPanels16==='function'?readingOrderedPanels16(page):[...(page?.panels||[])].sort((a,b)=>a.order-b.order);
  const orderById=new Map(ordered.map(panel=>[panel.id,panel.order]));
  return ordered.filter(panel=>validInsetMeta19(panel,page)).map(panel=>{
    const meta=validInsetMeta19(panel,page);
    return {panelId:panel.id,order:panel.order,parentPanelId:meta.parentPanelId,parentOrder:orderById.get(meta.parentPanelId)||null,anchor:meta.anchor,size:meta.size};
  });
}
if(typeof renderBriefObject30==='function'){
  const renderBriefObjectBase19=renderBriefObject30;
  renderBriefObject30=function(){
    const brief=renderBriefObjectBase19(),insets=insetContracts19();
    brief.panelHierarchyModel='one-level-inset-panels';
    brief.insetPanels=insets;
    const byOrder=new Map(insets.map(item=>[item.order,item]));
    brief.panels=(brief.panels||[]).map(panel=>{
      const inset=byOrder.get(panel.order);
      return inset?{...panel,presentation:{kind:'inset-panel',parentOrder:inset.parentOrder,anchor:inset.anchor,size:inset.size}}:{...panel,presentation:{kind:'root-panel'}};
    });
    brief.preservation ||= {};
    brief.preservation.preserveExact=[...new Set([...(brief.preservation.preserveExact||[]),'inset-panel-parentage','inset-panel-overlap'])];
    return brief;
  };
}
if(typeof renderBriefText30==='function'){
  const renderBriefTextBase19=renderBriefText30;
  renderBriefText30=function(){
    const base=renderBriefTextBase19(),insets=insetContracts19();if(!insets.length)return base;
    return `${base}\n\nINSET PANEL CONTRACT:\n${insets.map(item=>`- Panel ${item.order} is an inset panel physically overlaid inside Panel ${item.parentOrder}. Preserve that parent/child relation and the CLEAN PNG placement; do not promote it to a separate page tier.`).join('\n')}\n- Inset panels are real editable manga panels, not background decorations, balloons, or UI cards.\n- The white inset-panel mask and border in the CLEAN PNG are authored spatial structure.`;
  };
}
if(typeof exportManifest08==='function'){
  const exportManifestBase19=exportManifest08;
  exportManifest08=function(identity,packageType,files){
    const manifest=exportManifestBase19(identity,packageType,files),insets=insetContracts19();
    manifest.panelHierarchy={model:'one-level-inset-panels',insets};
    manifest.crossModelHints ||= {};
    manifest.crossModelHints.preserveInsetPanelParentage=true;
    manifest.crossModelHints.insetPanelsAreOverlaysWithinParentPanels=true;
    return manifest;
  };
}

bindInsetDelete19();
ensureInsetPanelUi19();
render();

globalThis.insetPanelModel19={
  meta:insetMeta19,
  validMeta:validInsetMeta19,
  children:insetChildren19,
  parent:parentPanel19,
  defaultRect:insetDefaultRect19,
  contracts:insetContracts19,
  add:addInsetPanel19,
  deleteSelected:deleteSelectedPanel19,
  normalizePage:normalizeInsetPage19,
  remap:remapInsetReferences19
};
