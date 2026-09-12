import fs from 'node:fs';

const ts=fs.readFileSync('web/src/phase-one-ui.ts','utf8');
const css=fs.readFileSync('web/src/phase-one-ui.css','utf8');
const html=fs.readFileSync('web/index.html','utf8');

for(const token of [
  'phase1PageModes','phase1-page-subtabs','role','tablist','aria-selected','data-page-mode',
  'phase1PanelContentDisclosure','phase1PanelCameraDisclosure','phase1PanelFrameDisclosure',
  'ensureDisclosure','ArrowRight','ArrowLeft','Home','End'
]){
  if(!ts.includes(token))throw new Error(`Phase 1 UI missing disclosure/submode contract token: ${token}`);
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
  "copy('テンプレート','Template')",
  "copy('原稿設定','Manuscript')",
  "copy('手動コマ割り','Manual layout')",
  "copy('内容・役割','Content + role')",
  "copy('カメラ','Camera')",
  "copy('枠・形状','Frame + shape')"
]){
  if(!ts.includes(phrase))throw new Error(`Expected task-first label missing: ${phrase}`);
}

console.log('Editor disclosure UX contract: one submode layer, native disclosures, accessible tab state, mobile target sizing, and unambiguous inset terminology passed.');
