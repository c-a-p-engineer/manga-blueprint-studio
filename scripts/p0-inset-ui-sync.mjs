import fs from 'node:fs';

const VERSION='0.19.0';
const read=path=>fs.readFileSync(path,'utf8');
const write=(path,text)=>fs.writeFileSync(path,text);
function replaceOnce(text,from,to,path){
  if(!text.includes(from))throw new Error(`${path}: expected anchor not found: ${from.slice(0,120)}`);
  return text.replace(from,to);
}
function appendOnce(path,marker,block){
  let text=read(path);if(text.includes(marker))return;
  text=`${text.trimEnd()}\n\n${block.trim()}\n`;write(path,text);
}

// Runtime registration: inset panels depend on final quadrilateral geometry and extend handoff before producer provenance.
{
  const path='web/src/legacy-runtime.ts';let text=read(path);
  text=replaceOnce(text,"  ['authoring/panel-geometry','runtime/authoring/panel-geometry.js'],\n  ['templates/presentation-contract'","  ['authoring/panel-geometry','runtime/authoring/panel-geometry.js'],\n  ['authoring/inset-panels','runtime/authoring/inset-panels.js'],\n  ['templates/presentation-contract'",path);
  write(path,text);
}
{
  const path='scripts/runtime-paths.mjs';let text=read(path);
  text=replaceOnce(text,"  panelGeometry: 'web/runtime/authoring/panel-geometry.js',\n  templatePresentationContract", "  panelGeometry: 'web/runtime/authoring/panel-geometry.js',\n  insetPanels: 'web/runtime/authoring/inset-panels.js',\n  templatePresentationContract",path);
  text=replaceOnce(text,"'interactionGenerationContract','renderBrief','panelGeometry','templatePresentationContract'", "'interactionGenerationContract','renderBrief','panelGeometry','insetPanels','templatePresentationContract'",path);
  write(path,text);
}

// Phase 1 typed composition: one submode layer on Page, native disclosures inside Panel.
{
  const path='web/src/phase-one-ui.ts';let text=read(path);
  const anchor='function ensureTemplateHeader(shell:HTMLElement){';
  const insertion=`type PageModeId='template'|'manuscript'|'layout';\nlet activePageMode:PageModeId='template';\n\nfunction ensureDisclosure(id:string,titleJa:string,titleEn:string,helpJa:string,helpEn:string,open=false){\n  let details=byId<HTMLDetailsElement>(id);\n  if(!details){\n    details=document.createElement('details');\n    details.id=id;\n    details.className='phase1-disclosure';\n    details.open=open;\n    const summary=document.createElement('summary');\n    summary.innerHTML='<strong></strong><span></span>';\n    details.appendChild(summary);\n  }\n  setTextIfChanged(details.querySelector('summary strong'),copy(titleJa,titleEn));\n  setTextIfChanged(details.querySelector('summary span'),copy(helpJa,helpEn));\n  return details;\n}\n\nfunction moveNodeInto(host:HTMLElement,node:Element|null){\n  if(node&&node.parentElement!==host)host.appendChild(node);\n}\n\nfunction setPageMode19(root:HTMLElement,mode:PageModeId,focus=false){\n  activePageMode=mode;\n  const buttons=[...root.querySelectorAll<HTMLButtonElement>('[data-page-mode]')];\n  const panels=[...root.querySelectorAll<HTMLElement>('[data-page-mode-panel]')];\n  buttons.forEach(button=>{\n    const selected=button.dataset.pageMode===mode;\n    button.setAttribute('aria-selected',selected?'true':'false');\n    button.tabIndex=selected?0:-1;\n    if(selected&&focus)button.focus();\n  });\n  panels.forEach(panel=>{panel.hidden=panel.dataset.pageModePanel!==mode;});\n}\n\nfunction refreshPageModeLabels19(root:HTMLElement){\n  const labels:Record<PageModeId,[string,string]>={\n    template:['テンプレート','Template'],manuscript:['原稿設定','Manuscript'],layout:['手動コマ割り','Manual layout']\n  };\n  root.querySelectorAll<HTMLButtonElement>('[data-page-mode]').forEach(button=>{\n    const mode=button.dataset.pageMode as PageModeId;\n    const label=labels[mode];if(label)setTextIfChanged(button,copy(label[0],label[1]));\n  });\n}\n\nfunction ensurePageSubmodes19(pagePanel:HTMLElement,shell:HTMLElement,manualDisclosure:HTMLDetailsElement|null){\n  let root=byId<HTMLElement>('phase1PageModes');\n  if(!root){\n    root=document.createElement('section');root.id='phase1PageModes';root.className='phase1-page-modes';\n    root.innerHTML=\`<div class="phase1-page-subtabs" role="tablist" aria-label="Page authoring mode">\n      <button id="phase1PageModeTemplate" type="button" role="tab" data-page-mode="template" aria-controls="phase1PageModeTemplatePanel"></button>\n      <button id="phase1PageModeManuscript" type="button" role="tab" data-page-mode="manuscript" aria-controls="phase1PageModeManuscriptPanel"></button>\n      <button id="phase1PageModeLayout" type="button" role="tab" data-page-mode="layout" aria-controls="phase1PageModeLayoutPanel"></button>\n    </div>\n    <div id="phase1PageModeTemplatePanel" role="tabpanel" aria-labelledby="phase1PageModeTemplate" data-page-mode-panel="template"></div>\n    <div id="phase1PageModeManuscriptPanel" role="tabpanel" aria-labelledby="phase1PageModeManuscript" data-page-mode-panel="manuscript"></div>\n    <div id="phase1PageModeLayoutPanel" role="tabpanel" aria-labelledby="phase1PageModeLayout" data-page-mode-panel="layout"></div>\`;\n    const manuscriptStart=[...pagePanel.children].find(element=>element instanceof HTMLElement&&element.dataset.i18n==='canvasSize') as HTMLElement|undefined;\n    if(manuscriptStart)pagePanel.insertBefore(root,manuscriptStart);else pagePanel.prepend(root);\n    const manuscriptPane=root.querySelector<HTMLElement>('[data-page-mode-panel="manuscript"]')!;\n    let cursor:Element|null=manuscriptStart||null;\n    while(cursor&&cursor!==shell&&cursor!==manualDisclosure){\n      const next=cursor.nextElementSibling;manuscriptPane.appendChild(cursor);cursor=next;\n    }\n    root.querySelector<HTMLElement>('[data-page-mode-panel="template"]')!.appendChild(shell);\n    if(manualDisclosure){manualDisclosure.open=true;manualDisclosure.classList.add('phase1-manual-layout-pane');root.querySelector<HTMLElement>('[data-page-mode-panel="layout"]')!.appendChild(manualDisclosure);}\n    const tabs=[...root.querySelectorAll<HTMLButtonElement>('[data-page-mode]')];\n    tabs.forEach(button=>button.addEventListener('click',()=>setPageMode19(root!,button.dataset.pageMode as PageModeId)));\n    root.querySelector('.phase1-page-subtabs')?.addEventListener('keydown',event=>{\n      if(!(event instanceof KeyboardEvent))return;\n      const current=tabs.findIndex(button=>button===document.activeElement);if(current<0)return;\n      let next=current;\n      if(event.key==='ArrowRight')next=(current+1)%tabs.length;else if(event.key==='ArrowLeft')next=(current-1+tabs.length)%tabs.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=tabs.length-1;else return;\n      event.preventDefault();setPageMode19(root!,tabs[next].dataset.pageMode as PageModeId,true);\n    });\n  }else{\n    const templatePane=root.querySelector<HTMLElement>('[data-page-mode-panel="template"]');\n    const layoutPane=root.querySelector<HTMLElement>('[data-page-mode-panel="layout"]');\n    if(templatePane&&shell.parentElement!==templatePane)templatePane.appendChild(shell);\n    if(layoutPane&&manualDisclosure&&manualDisclosure.parentElement!==layoutPane)layoutPane.appendChild(manualDisclosure);\n  }\n  refreshPageModeLabels19(root);setPageMode19(root,activePageMode);\n}\n\nfunction ensurePanelDisclosures19(){\n  const panelSection=document.querySelector<HTMLElement>('.tool-panel[data-section="panel"]');if(!panelSection)return;\n  const selectedSummary=byId('selectedPanelSummary');if(!selectedSummary)return;\n  const content=ensureDisclosure('phase1PanelContentDisclosure','内容・役割','Content + role','コマの物語上の役割を設定','Set the narrative role of this panel',true);\n  const camera=ensureDisclosure('phase1PanelCameraDisclosure','カメラ','Camera','距離・角度・視点・構図','Distance, angle, viewpoint and composition');\n  const frame=ensureDisclosure('phase1PanelFrameDisclosure','枠・形状','Frame + shape','枠、断ち切り、四隅、差し込みコマ','Border, bleed, geometry and inset panels');\n  if(!content.parentElement)selectedSummary.insertAdjacentElement('afterend',content);\n  if(!camera.parentElement)content.insertAdjacentElement('afterend',camera);\n  if(!frame.parentElement)camera.insertAdjacentElement('afterend',frame);\n  moveNodeInto(content,byId('panelRole')?.closest('label')||null);\n  const cameraHeading=[...panelSection.children].find(element=>element instanceof HTMLElement&&element.dataset.i18n==='cameraHeading')||null;\n  moveNodeInto(camera,cameraHeading);\n  for(const id of ['cameraQuickPreset','cameraDistance','cameraAngle','cameraViewpoint','cameraFocus','cameraIntent'])moveNodeInto(camera,byId(id)?.closest('label')||null);\n  moveNodeInto(camera,byId('cameraHelp'));\n  const frameHeading=[...panelSection.children].find(element=>element instanceof HTMLElement&&element.dataset.i18n==='frameHeading')||null;\n  moveNodeInto(frame,frameHeading);\n  for(const id of ['borderStyle','bleedEdge','breakoutMode'])moveNodeInto(frame,byId(id)?.closest('label')||null);\n  moveNodeInto(frame,byId('panelShapeControls33'));moveNodeInto(frame,byId('insetPanelControls19'));\n}\n\n`;
  text=replaceOnce(text,anchor,insertion+anchor,path);
  text=replaceOnce(text,"  ensureFeedback(shell);\n  ensureManualLayoutDisclosure(pagePanel);\n  pagePanelObserver?.takeRecords();", "  ensureFeedback(shell);\n  const manualDisclosure=ensureManualLayoutDisclosure(pagePanel);\n  ensurePageSubmodes19(pagePanel,shell,manualDisclosure);\n  ensurePanelDisclosures19();\n  pagePanelObserver?.takeRecords();",path);
  write(path,text);
}
{
  const path='web/src/phase-one-ui.css';let text=read(path);
  text+=`\n.phase1-page-modes{margin:12px 0 16px}.phase1-page-subtabs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;margin-bottom:10px;padding:4px;border:1px solid #dbe2ea;border-radius:13px;background:#f1f5f9}.phase1-page-subtabs [role="tab"]{min-height:46px;border:1px solid transparent;border-radius:9px;background:transparent;color:#475569;font-weight:800}.phase1-page-subtabs [role="tab"][aria-selected="true"]{border-color:#cbd5e1;background:#fff;color:#111827;box-shadow:0 2px 8px rgba(15,23,42,.08)}.phase1-page-modes [role="tabpanel"][hidden]{display:none!important}.phase1-page-modes [role="tabpanel"]>.phase1-template-shell{margin-top:0}.phase1-manual-layout-pane{margin-top:0}.phase1-manual-layout-pane>summary{display:none!important}\n.phase1-disclosure{margin:10px 0;border:1px solid #d8dee8;border-radius:13px;background:#fff;overflow:hidden}.phase1-disclosure>summary{display:grid;gap:2px;min-height:48px;padding:11px 13px;cursor:pointer;list-style:none;align-content:center}.phase1-disclosure>summary::-webkit-details-marker{display:none}.phase1-disclosure>summary::after{content:"＋";grid-column:2;grid-row:1/3;align-self:center;color:#64748b;font-weight:900}.phase1-disclosure[open]>summary::after{content:"−"}.phase1-disclosure>summary strong{font-size:.86rem}.phase1-disclosure>summary span{color:#64748b;font-size:.7rem;line-height:1.35}.phase1-disclosure[open]>summary{border-bottom:1px solid #e2e8f0;background:#f8fafc}.phase1-disclosure> :not(summary){margin-left:12px;margin-right:12px}.phase1-disclosure> :last-child{margin-bottom:12px}\n@media(max-width:760px){.phase1-page-subtabs{position:sticky;top:0;z-index:12;gap:4px}.phase1-page-subtabs [role="tab"]{min-height:46px;padding:7px 5px;font-size:.72rem}.phase1-disclosure>summary{min-height:52px}}\n`;
  write(path,text);
}

// Disambiguate the legacy border style from a real panel-in-panel.
{
  const path='web/index.html';let text=read(path);
  text=replaceOnce(text,'<option value="inset">小窓 / Inset</option>','<option value="inset">小窓風枠 / Inset-style border</option>',path);write(path,text);
}

// Optional compatible data contract for one-level panel hierarchy. Rect remains authoritative for placement.
{
  const path='schema/manga-blueprint.schema.json';const schema=JSON.parse(read(path));
  schema.$defs.panelInset={type:'object',required:['kind','parentPanelId'],properties:{kind:{const:'panel-in-panel'},parentPanelId:{type:'string',minLength:1},anchor:{enum:['top-right','top-left','bottom-right','bottom-left','center']},size:{enum:['small','medium','large']}},additionalProperties:true};
  schema.$defs.panel.properties.inset={$ref:'#/$defs/panelInset'};
  write(path,JSON.stringify(schema,null,2)+'\n');
}

// CI: syntax plus executable P0 behavior/UX contracts.
{
  const path='.github/workflows/validate.yml';let text=read(path);
  text=replaceOnce(text,'          node --check scripts/validate-panel-layout-grammar.mjs\n','          node --check scripts/validate-panel-layout-grammar.mjs\n          node --check scripts/validate-inset-panels.mjs\n          node --check scripts/validate-editor-disclosure.mjs\n',path);
  text=replaceOnce(text,'      - name: Validate Story Template presentation contract\n',`      - name: Validate inset panel contract\n        run: node scripts/validate-inset-panels.mjs\n\n      - name: Validate editor disclosure UX contract\n        run: node scripts/validate-editor-disclosure.mjs\n\n      - name: Validate Story Template presentation contract\n`,path);
  write(path,text);
}

// Version synchronization.
for(const path of ['package.json','package-lock.json']){
  const data=JSON.parse(read(path));data.version=VERSION;if(data.packages?.[''])data.packages[''].version=VERSION;write(path,JSON.stringify(data,null,2)+'\n');
}
{
  const path='web/build-info.json';const data=JSON.parse(read(path));data.appVersion=VERSION;write(path,JSON.stringify(data,null,2)+'\n');
}
for(const path of ['web/src/main.ts','web/runtime/handoff/producer-provenance.js']){
  let text=read(path).replace(/appVersion:'0\.18\.0'/g,`appVersion:'${VERSION}'`);write(path,text);
}

// Current documentation contracts.
{
  const path='README.md';let text=read(path);
  text=text.replace('## Current prototype: 0.18.0',`## Current prototype: ${VERSION}`);
  text=text.replace(/Prototype \*\*0\.18\.0\*\*[^\n]*/,`Prototype **${VERSION}** adds one-level editable panel-in-panel composition and task-first progressive disclosure. Page settings now switch between Template / Manuscript / Manual layout modes; Panel settings keep the current summary visible while Content, Camera, and Frame/Shape sections can be expanded as needed. The legacy inset-style border remains compatible but is distinct from a real inset panel.`);
  text=text.replace('docs/PROTOTYPE-0.16.4.md','docs/PROTOTYPE-0.19.0.md');
  if(!text.includes('one-level editable inset panel'))text=text.replace('- manga-aware panel-layout grammar with tight shared diagonal seams, asymmetric staggered layouts, buildup/detail-to-hero layouts, and automated whitespace/area-contrast checks;','- manga-aware panel-layout grammar with tight shared diagonal seams, asymmetric staggered layouts, buildup/detail-to-hero layouts, and automated whitespace/area-contrast checks;\n- one-level editable inset panels with explicit parentage, clean-PNG overlap structure, and AI handoff preservation;');
  write(path,text);
}
appendOnce('docs/PRODUCT.md','## Inset panels and progressive editor disclosure — Prototype 0.19.0',`## Inset panels and progressive editor disclosure — Prototype 0.19.0\n\nThe editor supports a real **panel-in-panel / 差し込みコマ** distinct from the legacy \`border=inset\` visual style. The legacy value remains compatible and is presented as **小窓風枠 / Inset-style border**.\n\nP0 behavior contract:\n\n- a root panel may own at most one inset panel; nested inset panels are not created;\n- the inset is an ordinary editable Panel with camera, cast, background, lettering, effects, border, and geometry;\n- \`Panel.inset\` records \`kind=panel-in-panel\`, stable \`parentPanelId\`, semantic anchor, and size class while \`Panel.rect\` remains authoritative spatial placement;\n- the root page reading order is resolved normally, then each inset is ordered immediately after its parent;\n- deleting an inset deletes only the inset; deleting its parent requires confirmation and removes the child; the final root panel remains protected;\n- splitting a panel participating in an inset relation is blocked in P0 instead of silently breaking parentage;\n- duplicate/new-work identity regeneration remaps inset parent references; invalid or nested references normalize away;\n- clean output masks the inset area white before drawing the child, so the overlap is authored panel structure rather than transparent decoration;\n- Render Brief and manifest explicitly carry panel hierarchy and require downstream renderers to preserve the overlay.\n\nEditor information architecture uses one nested navigation level only. **Page** exposes \`テンプレート / 原稿設定 / 手動コマ割り\` as mutually exclusive submodes. **Panel** keeps the current-panel summary visible and groups simultaneous settings into native disclosure sections: \`内容・役割 / カメラ / 枠・形状\`. Do not add deeper tab-within-tab navigation for these controls.`);
appendOnce('docs/ARCHITECTURE.md','## Inset panel ownership — Prototype 0.19.0',`## Inset panel ownership — Prototype 0.19.0\n\n\`web/runtime/authoring/inset-panels.js\` owns the compatibility-runtime behavior for one-level panel-in-panel composition. It loads after quadrilateral geometry and before template presentation so it can reuse final panel geometry while extending Render Brief / manifest semantics before producer provenance is attached.\n\nSerialized ownership remains flat: \`Page.panels[]\` contains both roots and inset children. An optional \`Panel.inset\` relation stores \`parentPanelId\`; the child \`rect\` remains the spatial authority. This avoids introducing a second nested Panel schema while keeping stable Panel IDs and all existing panel editors reusable. Normalization rejects orphan/self/nested parent relations. Page/work duplication remaps the relation whenever Panel IDs are regenerated.\n\nReading-order ownership remains in the existing geometry-aware function, wrapped only to insert each child immediately after its already-ordered root parent. P0 intentionally blocks splitting related panels rather than guessing how to migrate the relation.\n\nTop-level progressive-disclosure composition belongs to \`web/src/phase-one-ui.ts\`: Page gets one ARIA tablist submode layer; Panel uses native \`details/summary\` groups. This UI state is presentation state and is not serialized into the manga project.`);
appendOnce('docs/PROMPT_HANDOFF.md','## Inset panel handoff — Prototype 0.19.0',`## Inset panel handoff — Prototype 0.19.0\n\nA true **差し込みコマ / inset panel** is authored spatial structure, not decoration. The clean PNG contains its opaque mask and frame over the parent panel. The current-page Render Brief and export manifest also include one-level parentage.\n\nDownstream generation must preserve:\n\n- the child panel physically overlaid inside its parent;\n- the child boundary and relative placement shown in \`*_clean.png\`;\n- the semantic parent/child relation in \`panelHierarchy\` / \`insetPanels\`;\n- the child as a real editable manga panel with its own beat/camera/cast/text, not as a speech balloon, UI card, or background prop.\n\nThe legacy \`border=inset\` value means only an **Inset-style border / 小窓風枠** and does not establish panel parentage.`);
appendOnce('docs/USER-GUIDE.md','## 差し込みコマと短い編集パネル',`## 差し込みコマと短い編集パネル\n\n### ページ設定\n\nページタブでは、長い設定を一列に並べず **テンプレート / 原稿設定 / 手動コマ割り** を切り替えます。Story Templateから始めるときはテンプレート、原稿サイズや読み方向は原稿設定、直接コマを割るときだけ手動コマ割りを開きます。\n\n### コマ設定\n\n選択中コマの概要は常に見えます。その下の **内容・役割 / カメラ / 枠・形状** は必要なところだけ開閉できます。\n\n### 差し込みコマ\n\n親にしたい通常コマを選び、**コマ → 枠・形状 → ＋ 差し込みコマ** を押します。P0では右上へ中サイズの差し込みコマを1つ作成します。作成後はその小コマが選択され、通常のコマと同じくキャラ・背景・文字・演出・カメラを編集できます。\n\n- 差し込みコマの中へさらに差し込みは作れません。\n- 子コマを削除すると子だけ消えます。\n- 親コマを削除するときは確認後、子コマも一緒に削除されます。\n- P0では親子関係があるコマの分割はできません。\n- 枠タイプの **小窓風枠** は見た目だけの枠で、実際の差し込みコマとは別機能です。`);
{
  const path='docs/ROADMAP.md';let text=read(path);
  text=text.replace('## Shipped through Prototype 0.18.0',`## Shipped through Prototype ${VERSION}`);
  if(!text.includes(`Prototype ${VERSION}:`))text=text.replace(`## Shipped through Prototype ${VERSION}\n`, `## Shipped through Prototype ${VERSION}\n\n- Prototype ${VERSION}: one-level editable inset panels, explicit AI handoff hierarchy, Page submodes, Panel disclosure groups, and deterministic P0 regression coverage.\n`);
  write(path,text);
}
appendOnce('web/runtime/README.md','### `authoring/inset-panels.js`',`### \`authoring/inset-panels.js\`\n\nOwns Prototype 0.19.0 one-level panel-in-panel compatibility behavior: optional parent relation normalization, ID-remap on duplication, semantic order insertion, white overlap mask, deletion/split safety, editor control injection, and Render Brief / manifest hierarchy. It deliberately reuses the ordinary Panel model and existing inspectors instead of creating a second inset-only content model.`);

// Public guide: append a user-facing section before </main> when present.
{
  const path='web/guide.html';let text=read(path);
  if(!text.includes('id="inset-panel-019"')){
    const block=`\n      <section id="inset-panel-019">\n        <h2>差し込みコマと短い編集パネル</h2>\n        <p>ページ設定は <strong>テンプレート / 原稿設定 / 手動コマ割り</strong> を切り替えます。コマ設定は概要を残したまま <strong>内容・役割 / カメラ / 枠・形状</strong> を必要なところだけ開閉できます。</p>\n        <div class="card-grid"><article class="card"><h3>差し込みコマ</h3><p>親コマを選び、<strong>コマ → 枠・形状 → ＋ 差し込みコマ</strong>。右上へ小さな独立コマを重ね、通常のコマと同じ編集機能を使えます。</p></article><article class="card"><h3>小窓風枠との違い</h3><p><strong>小窓風枠</strong>は枠の見た目だけ。<strong>差し込みコマ</strong>は親子関係と独立した内容を持つ本物のコマinコマです。</p></article></div>\n        <div class="callout">P0では親1コマにつき差し込み1つ、入れ子は1段までです。子は親の直後の読み順になり、親を削除するときは子も消えることを確認します。</div>\n      </section>\n`;
    text=replaceOnce(text,'</main>',`${block}</main>`,path);
  }
  write(path,text);
}

// Prompt current docs map/release baseline phrases stay version-consistent.
appendOnce('docs/README.md','PROTOTYPE-0.19.0.md','- `PROTOTYPE-0.19.0.md` — panel-in-panel P0 and progressive editor disclosure release note.');

console.log('Prototype 0.19.0 P0 inset/UI synchronization complete.');
