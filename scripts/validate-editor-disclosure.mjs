import fs from 'node:fs';

const pageModes=fs.readFileSync('web/src/ui/page-modes.ts','utf8');
const panelDisclosures=fs.readFileSync('web/src/ui/panel-disclosures.ts','utf8');
const css=fs.readFileSync('web/src/phase-one-ui.css','utf8');
const html=fs.readFileSync('web/index.html','utf8');

for(const token of [
  'phase1PageModes','phase1-page-subtabs','role','tablist','aria-selected','data-page-mode',
  'ArrowRight','ArrowLeft','Home','End'
]){
  if(!pageModes.includes(token))throw new Error(`Page submode contract missing token: ${token}`);
}
for(const token of [
  'phase1PanelContentDisclosure','phase1PanelCameraDisclosure','phase1PanelFrameDisclosure','ensureDisclosure'
]){
  if(!panelDisclosures.includes(token))throw new Error(`Panel disclosure contract missing token: ${token}`);
}
for(const token of ['phase1-page-subtabs','phase1-disclosure','[role="tabpanel"][hidden]','min-height:46px']){
  if(!css.includes(token))throw new Error(`Phase 1 CSS missing disclosure UX token: ${token}`);
}

const topTabs=[...html.matchAll(/class="tab(?: active)?"[^>]*data-tab="([^"]+)"/g)].map(match=>match[1]);
const expected=['page','panel','character','background','text','effects','output'];
if(JSON.stringify(topTabs)!==JSON.stringify(expected))throw new Error(`Top-level editor tabs changed unexpectedly: ${JSON.stringify(topTabs)}`);
if(!html.includes('<option value="inset">小窓風枠 / Inset-style border</option>'))throw new Error('Legacy inset border must be relabeled as an inset-style border');
if(html.includes('<option value="inset">小窓 / Inset</option>'))throw new Error('Ambiguous old inset border label still present');

for(const phrase of [
  "template:['テンプレート','Template']",
  "manuscript:['原稿設定','Manuscript']",
  "layout:['手動コマ割り','Manual layout']"
]){
  if(!pageModes.includes(phrase))throw new Error(`Expected task-first page label missing: ${phrase}`);
}
for(const phrase of [
  "'内容・役割','Content + role'",
  "'カメラ','Camera'",
  "'枠・形状','Frame + shape'"
]){
  if(!panelDisclosures.includes(phrase))throw new Error(`Expected panel disclosure label missing: ${phrase}`);
}

console.log('Editor disclosure UX contract: one submode layer, native disclosures, accessible tab state, mobile target sizing, and unambiguous inset terminology passed.');
