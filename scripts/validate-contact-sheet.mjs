import {compileMangaName} from '../core/manga-grammar.mjs';
import {renderExecutableNameSvg} from '../core/blueprint-renderer.mjs';
import {generationIdentityAuthority} from '../core/generation-adapter.mjs';
import {autoContactSheetPreset,buildContactSheetGenerationPackage,buildContactSheetLayout,buildContactSheetPrompt,buildContactSheetReviewRequest,renderContactSheetSvg} from '../core/contact-sheet.mjs';

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

const sheet=renderContactSheetSvg(clean);
if(!sheet.includes('data-page-code="P001"')||!sheet.includes('data-page-code="P003"'))throw new Error('contact sheet page cells missing');
if(sheet.includes('data-review='))throw new Error('contact sheet clean contains annotated review layer');

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
