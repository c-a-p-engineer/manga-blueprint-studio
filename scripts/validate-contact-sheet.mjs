import {compileMangaName} from '../core/manga-grammar.mjs';
import {renderExecutableNameSvg} from '../core/blueprint-renderer.mjs';
import {generationIdentityAuthority} from '../core/generation-adapter.mjs';
import {autoContactSheetPreset,buildContactSheetBatches,buildContactSheetGenerationPackage,buildContactSheetLayout,buildContactSheetPrompt,buildContactSheetReviewRequest,contactSheetAssetNames,renderContactSheetSvg} from '../core/contact-sheet.mjs';
import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
import {Resvg} from '@resvg/resvg-js';
import {buildContactSheetMontageAttempts,buildContactSheetMontageSvg,composeContactSheetPng} from '../core/png-contact-sheet.mjs';

const source=[
  '# Page 1: start',
  'コマ1: heroine waits',
  '登場: heroine@right',
  '状態: heroine> outfit=navy blazer worn, white shirt worn',
  '',
  '# Page 2: continue',
  'コマ1: heroine walks',
  '登場: heroine@center',
  '',
  '# Page 3: end',
  'コマ1: heroine stops',
  '登場: heroine@left'
].join('\n');

const project=compileMangaName(source,{title:'contact-sheet'});
const heroine=project.characterLibrary.find(c=>c.name==='heroine');
heroine.appearance={...heroine.appearance,hair:'blonde',eyes:'red',outfit:'navy blazer worn, white shirt worn'};
const clean=project.pages.map((_,i)=>renderExecutableNameSvg(project,i,{annotated:false}));
const blueprint=project.pages.map((_,i)=>renderExecutableNameSvg(project,i,{annotated:true}));

for(const [count,columns,rows,preset] of [
  [1,1,1,'1x1'],
  [2,2,1,'2x1'],
  [3,2,2,'2x2'],
  [4,2,2,'2x2'],
  [5,4,2,'4x2'],
  [8,4,2,'4x2'],
  [9,4,3,'4x3']
]){
  const layout=buildContactSheetLayout(count);
  if(layout.columns!==columns||layout.rows!==rows||layout.preset!==preset||layout.selection!=='auto-preset')throw new Error('auto contact-sheet preset failed for '+count+' pages');
  const direct=autoContactSheetPreset(count);
  if(direct.columns!==columns||direct.rows!==rows||direct.preset!==preset)throw new Error('preset selector failed for '+count+' pages');
}
const override=buildContactSheetLayout(3,{columns:3});
if(override.columns!==3||override.rows!==1||override.selection!=='override')throw new Error('contact-sheet columns override failed');

// Prefer fully occupied layouts: 6P must be 4+2, never a partially filled 4x2 sheet.
for(const [count,expected] of [
  [1,[1]],[2,[2]],[3,[3]],[4,[4]],[5,[4,1]],[6,[4,2]],[7,[4,3]],
  [8,[8]],[9,[8,1]],[10,[8,2]],[14,[8,4,2]],[16,[8,8]]
]){
  const batches=buildContactSheetBatches(count);
  if(JSON.stringify(batches.map(batch=>batch.pageCount))!==JSON.stringify(expected)){
    throw new Error('adaptive contact-sheet batching failed for '+count+' pages');
  }
  if(batches.some(batch=>batch.pageCount>8))throw new Error('contact-sheet batch exceeded maximum 8 pages');
  if(batches.reduce((sum,batch)=>sum+batch.pageCount,0)!==count)throw new Error('contact-sheet page coverage changed');
}
const batches6=buildContactSheetBatches(6);
if(batches6[0].range!=='001-004'||batches6[1].range!=='005-006'||batches6[0].layout.preset!=='2x2'||batches6[1].layout.preset!=='2x1'){
  throw new Error('6-page contact sheet must produce 001-004 2x2 and 005-006 2x1');
}
const custom6=buildContactSheetBatches(6,{batchSizes:[3,3]});
if(custom6.length!==2||custom6[0].range!=='001-003'||custom6[1].range!=='004-006')throw new Error('explicit contact-sheet grouping ignored');
const customSingle6=buildContactSheetBatches(6,{batchSizes:[6]});
if(customSingle6.length!==1||customSingle6[0].layout.preset!=='4x2')throw new Error('explicit 6-page sheet ignored');
const numbered=buildContactSheetBatches(6,{pageNumbers:[9,10,11,12,13,14]});
if(numbered[0].range!=='009-012'||numbered[1].range!=='013-014')throw new Error('global page range was lost across adaptive batches');
for(const bad of [[7],[4,0,2],[9],[-1,7],[4,1.5]]){
  let rejected=false;
  try{buildContactSheetBatches(6,{batchSizes:bad});}catch{rejected=true;}
  if(!rejected)throw new Error('invalid explicit contact-sheet grouping accepted: '+JSON.stringify(bad));
}

const batches10=buildContactSheetBatches(10);
if(batches10.length!==2||batches10[0].range!=='001-008'||batches10[1].range!=='009-010')throw new Error('contact-sheet 8-page batching/range naming failed');
if(batches10[0].layout.columns!==4||batches10[0].layout.rows!==2||batches10[1].layout.columns!==2||batches10[1].layout.rows!==1)throw new Error('contact-sheet batch layout failed');
const names=contactSheetAssetNames('009-010');
if(names.cleanPng!=='contact-sheet.009-010.clean.png'||names.blueprintPng!=='contact-sheet.009-010.blueprint.png'||names.review!=='contact-sheet.009-010.review.json')throw new Error('contact-sheet range asset naming failed');

const sheet=renderContactSheetSvg(clean);
if(!sheet.includes('data-page-code="P001"')||!sheet.includes('data-page-code="P003"'))throw new Error('contact sheet page cells missing');
if(sheet.includes('data-review='))throw new Error('contact sheet clean contains annotated review layer');
const blueprintSheet=renderContactSheetSvg(blueprint);
if(!blueprintSheet.includes('data-review="page-number"'))throw new Error('contact sheet blueprint must retain review annotations');
const secondBatchSheet=renderContactSheetSvg(clean.slice(0,2),{pageNumbers:[9,10]});
if(!secondBatchSheet.includes('data-page-code="P009"')||!secondBatchSheet.includes('data-page-code="P010"')||secondBatchSheet.includes('data-page-code="P001"'))throw new Error('contact sheet global page labels failed');

const montageAttempts=buildContactSheetMontageAttempts(
  ['P001.clean.png','P002.clean.png','P003.clean.png'],
  'contact-sheet.clean.png',
  {columns:2,rows:2}
);
if(!montageAttempts.length)throw new Error('contact sheet PNG montage attempts missing');
const [montageCommand,montageArgs]=montageAttempts[0];
if(montageCommand!=='magick'||montageArgs[0]!=='montage'||!montageArgs.includes('P001.clean.png')||!montageArgs.includes('2x2'))throw new Error('contact sheet PNG montage contract invalid');

const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'manga-contact-sheet-'));
try{
  const pagePngs=[1,2,3].map(index=>{
    const file=path.join(tmp,'P00'+index+'.clean.png');
    const svg='<svg xmlns="http://www.w3.org/2000/svg" width="32" height="48"><rect width="32" height="48" fill="white"/><text x="4" y="20">P00'+index+'</text></svg>';
    fs.writeFileSync(file,new Resvg(svg).render().asPng());
    return file;
  });
  const montageSvg=buildContactSheetMontageSvg(pagePngs,{columns:2,rows:2,gap:4});
  if((montageSvg.match(/data:image\/png;base64,/g)||[]).length!==3)throw new Error('resvg montage must embed all page PNGs');
  const output=path.join(tmp,'contact-sheet.clean.png');
  const composed=composeContactSheetPng(pagePngs,output,{columns:2,rows:2,gap:4});
  if(!composed.ok||composed.engine!=='resvg-js-montage'||!fs.existsSync(output)||fs.statSync(output).size<100)throw new Error('resvg contact-sheet PNG montage failed');
}finally{
  fs.rmSync(tmp,{recursive:true,force:true});
}

// CLI integration: explicit sheet sizes must flow through compilation, output names and manifest.
const cliTmp=fs.mkdtempSync(path.join(os.tmpdir(),'manga-contact-cli-'));
try{
  const cliSource=Array.from({length:6},(_,i)=>'# Page '+(i+1)+': review\\nコマ1: heroine waits\\n登場: heroine@center').join('\\n\\n').replaceAll('\\n','\n');
  const input=path.join(cliTmp,'six-pages.md'),output=path.join(cliTmp,'out');
  fs.writeFileSync(input,cliSource);
  const run=spawnSync(process.execPath,[path.resolve('cli/manga-blueprint.mjs'),input,output,'--contact-batches','3,3'],{encoding:'utf8'});
  if(run.status!==0)throw new Error('CLI explicit batch sizes failed: '+run.stderr);
  const manifest=JSON.parse(fs.readFileSync(path.join(output,'manifest.json'),'utf8'));
  const batches=manifest.contactSheet?.batches||[];
  if(batches.length!==2||batches[0].range!=='001-003'||batches[1].range!=='004-006'){
    throw new Error('CLI did not preserve explicit 3+3 grouping in manifest');
  }
  for(const range of ['001-003','004-006']){
    for(const name of ['contact-sheet.'+range+'.clean.svg','contact-sheet.'+range+'.blueprint.svg','contact-sheet.'+range+'.prompt.md','contact-sheet.'+range+'.review.json']){
      if(!fs.existsSync(path.join(output,name)))throw new Error('CLI contact sheet asset missing: '+name);
    }
  }
  const bad=spawnSync(process.execPath,[path.resolve('cli/manga-blueprint.mjs'),input,path.join(cliTmp,'invalid'),'--contact-batches','4,3'],{encoding:'utf8'});
  if(bad.status!==2||!bad.stderr.includes('must sum'))throw new Error('CLI did not reject grouping with wrong total');
}finally{
  fs.rmSync(cliTmp,{recursive:true,force:true});
}

const prompt=buildContactSheetPrompt(project);
if(!prompt.includes('ONE contact-sheet image')||!prompt.includes('# ===== P003 ====='))throw new Error('contact sheet prompt missing batch contract/page brief');
if(!prompt.includes('OUTFIT CONTINUITY: heroine'))throw new Error('resolved outfit continuity missing from contact sheet prompt');

const review=buildContactSheetReviewRequest(project);
if(review.layout.columns!==2||review.layout.rows!==2||review.layout.preset!=='2x2'||review.pageCells.length!==3)throw new Error('contact sheet layout/review map invalid');
if(!review.checks.some(x=>x.id==='outfit-continuity'))throw new Error('outfit continuity review check missing');
if(review.finalAcceptance!==false)throw new Error('contact sheet must not be final acceptance');

const pkg=buildContactSheetGenerationPackage({
  project,
  cleanAssets:['P001.clean.svg','P002.clean.svg','P003.clean.svg'],
  promptAssets:['P001.prompt.md','P002.prompt.md','P003.prompt.md']
});
if(!pkg.ready||pkg.layout.rows!==2||pkg.constraints.finalAcceptance!==false)throw new Error('contact sheet generation package invalid');
if(generationIdentityAuthority(project)!=='project-character-guidance')throw new Error('description identity authority must come from project guidance');

const sheetProject=structuredClone(project);
sheetProject.characterLibrary[0].identityMode='sheet';
sheetProject.characterLibrary[0].referenceKey='heroine';
if(generationIdentityAuthority(sheetProject)!=='references')throw new Error('sheet identity authority must use references');
const missing=buildContactSheetGenerationPackage({
  project:sheetProject,
  cleanAssets:['a','b','c'],
  promptAssets:['d','e','f'],
  referenceAssets:[],
  columns:2
});
if(missing.ready||!missing.bindings.missing.includes('heroine'))throw new Error('required Character Sheet binding not enforced');

console.log('Contact sheet preflight validation passed');
