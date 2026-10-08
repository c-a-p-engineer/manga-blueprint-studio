#!/usr/bin/env node
import fs from'node:fs/promises';
import path from'node:path';
import{buildManifest}from'../core/blueprint-engine.mjs';
import{compileMangaName}from'../core/manga-grammar.mjs';
import{renderExecutableNameSvg}from'../core/blueprint-renderer.mjs';
import{rasterizeSvg}from'../core/svg-rasterizer.mjs';
import{buildExecutablePrompt}from'../core/generation-brief.mjs';
import{buildPortableGenerationPackage}from'../core/generation-adapter.mjs';
import{buildLetteringPlan,renderLetteringOverlaySvg}from'../core/lettering-renderer.mjs';
import{listLayoutRecipes,layoutRecipeCount,layoutSettingsSnippet}from'../core/layout-recipes.mjs';
import{buildContactSheetGenerationPackage,buildContactSheetPrompt,buildContactSheetReviewRequest,renderContactSheetSvg}from'../core/contact-sheet.mjs';
import{composeContactSheetPng}from'../core/png-contact-sheet.mjs';
import{renderReviewFullPageSvg,renderReviewFullContactSheetSvg}from'../core/review-full.mjs';

const args=process.argv.slice(2);
if(args[0]==='--list-layouts'){
  const panelCount=Number(args[1])||null,recipes=listLayoutRecipes({panelCount});
  console.log('Layout Recipe Bank v1 — '+layoutRecipeCount()+' recipe×panel-count bases'+(panelCount?' / '+panelCount+' panels':''));
  for(const recipe of recipes)console.log(recipe.id+'\t'+recipe.ja+'\t['+recipe.minPanels+'-'+recipe.maxPanels+']\t'+recipe.tags.join(','));
  if(panelCount&&recipes[0])console.log('\nShareable Name DSL example:\n'+layoutSettingsSnippet({recipeId:recipes[0].id,panelCount,seed:42,mutation:.25}));
  process.exit(0);
}

const input=args.shift();
let out='blueprint-out';
if(args[0]&&!args[0].startsWith('--'))out=args.shift();

const cliOptions={
  layoutRecipe:null,
  layoutSeed:undefined,
  layoutMutation:undefined,
  contactSheet:false,
  contactColumns:null,
  reviewFull:false
};

while(args.length){
  const flag=args.shift();
  if(flag==='--contact-sheet'){cliOptions.contactSheet=true;continue;}
  if(flag==='--review-full'){cliOptions.reviewFull=true;continue;}
  const value=args.shift();
  if(value===undefined){console.error('Missing value for option: '+flag);process.exit(2);}
  if(flag==='--layout')cliOptions.layoutRecipe=value;
  else if(flag==='--seed')cliOptions.layoutSeed=value;
  else if(flag==='--mutation')cliOptions.layoutMutation=Number(value);
  else if(flag==='--contact-columns'){
    const n=Number(value);
    if(!Number.isInteger(n)||n<1||n>8){console.error('--contact-columns must be an integer from 1 to 8');process.exit(2);}
    cliOptions.contactColumns=n;
    cliOptions.contactSheet=true;
  }else{console.error('Unknown option: '+flag);process.exit(2);}
}

if(!input){
  console.error('Usage: node cli/manga-blueprint.mjs <name.md> [out-dir] [--layout <recipe>] [--seed <value>] [--mutation <0..1>] [--contact-sheet] [--contact-columns <1..8>] [--review-full]\n       node cli/manga-blueprint.mjs --list-layouts [panel-count]');
  process.exit(2);
}

const text=await fs.readFile(input,'utf8');
const compileOptions={title:path.basename(input,path.extname(input))};
if(cliOptions.layoutRecipe)compileOptions.layoutRecipe=cliOptions.layoutRecipe;
if(cliOptions.layoutSeed!==undefined)compileOptions.layoutSeed=cliOptions.layoutSeed;
if(cliOptions.layoutMutation!==undefined)compileOptions.layoutMutation=cliOptions.layoutMutation;

const project=compileMangaName(text,compileOptions);
await fs.mkdir(out,{recursive:true});
await fs.writeFile(path.join(out,'work.manga.json'),JSON.stringify(project,null,2));

const unplaceableLettering=[];
const files=['work.manga.json'],raster=[],pageCleanAssets=[],pageBlueprintAssets=[],pageCleanPngAssets=[],pageBlueprintPngAssets=[],pageReviewFullPngAssets=[],pagePromptAssets=[],reviewFullAssetList=[];
for(let i=0;i<project.pages.length;i++){
  const n=String(i+1).padStart(3,'0');
  const clean='P'+n+'.clean.svg',annotated='P'+n+'.blueprint.svg',prompt='P'+n+'.prompt.md',lettering='P'+n+'.lettering.svg',letteringJson='P'+n+'.lettering.json';
  const promptText=buildExecutablePrompt(project,i),letteringPlan=buildLetteringPlan(project,i);
  for(const entry of letteringPlan.entries.filter(e=>e.fit==='unplaceable'))
    unplaceableLettering.push({page:i+1,panelId:entry.panelId,kind:entry.kind,sourceId:entry.sourceId,text:entry.text});
  await fs.writeFile(path.join(out,clean),renderExecutableNameSvg(project,i,{annotated:false}));
  await fs.writeFile(path.join(out,annotated),renderExecutableNameSvg(project,i,{annotated:true}));
  await fs.writeFile(path.join(out,prompt),promptText);
  await fs.writeFile(path.join(out,lettering),renderLetteringOverlaySvg(project,i));
  await fs.writeFile(path.join(out,letteringJson),JSON.stringify(letteringPlan,null,2));
  const pkg=buildPortableGenerationPackage({project,pageIndex:i,cleanAsset:clean,prompt,referenceAssets:[],letteringAsset:lettering,letteringPlan:letteringJson});
  await fs.writeFile(path.join(out,'P'+n+'.generation.json'),JSON.stringify(pkg,null,2));
  files.push(clean,annotated,prompt,lettering,letteringJson,'P'+n+'.generation.json');
  pageCleanAssets.push(clean);
  pageBlueprintAssets.push(annotated);
  pagePromptAssets.push(prompt);
  for(const [kind,svg] of [['clean',clean],['blueprint',annotated]]){
    const png=svg.replace(/\.svg$/,'.png'),r=rasterizeSvg(path.join(out,svg),path.join(out,png));
    raster.push({source:svg,output:r.ok?png:null,...r});
    if(kind==='clean')pageCleanPngAssets.push(r.ok?png:null);
    else pageBlueprintPngAssets.push(r.ok?png:null);
    if(r.ok)files.push(png);
  }
  if(cliOptions.reviewFull){
    const reviewFull='P'+n+'.review-full.svg',reviewFullPng='P'+n+'.review-full.png';
    await fs.writeFile(path.join(out,reviewFull),renderReviewFullPageSvg(project,i));
    files.push(reviewFull);
    reviewFullAssetList.push({page:i+1,svg:reviewFull,png:null});
    const renderResult=rasterizeSvg(path.join(out,reviewFull),path.join(out,reviewFullPng),{maxWidth:1200});
    raster.push({source:reviewFull,output:renderResult.ok?reviewFullPng:null,...renderResult});
    pageReviewFullPngAssets.push(renderResult.ok?reviewFullPng:null);
    if(renderResult.ok){
      files.push(reviewFullPng);
      reviewFullAssetList[reviewFullAssetList.length-1].png=reviewFullPng;
    }
  }
}

let contactSheetManifest=null;
if(cliOptions.contactSheet){
  const sheetClean='contact-sheet.clean.svg',sheetBlueprint='contact-sheet.blueprint.svg',sheetPrompt='contact-sheet.prompt.md',sheetReview='contact-sheet.review.json',sheetGeneration='contact-sheet.generation.json';
  const [cleanSvgs,blueprintSvgs]=await Promise.all([
    Promise.all(pageCleanAssets.map(name=>fs.readFile(path.join(out,name),'utf8'))),
    Promise.all(pageBlueprintAssets.map(name=>fs.readFile(path.join(out,name),'utf8')))
  ]);
  await fs.writeFile(path.join(out,sheetClean),renderContactSheetSvg(cleanSvgs,{columns:cliOptions.contactColumns}));
  await fs.writeFile(path.join(out,sheetBlueprint),renderContactSheetSvg(blueprintSvgs,{columns:cliOptions.contactColumns}));
  await fs.writeFile(path.join(out,sheetPrompt),buildContactSheetPrompt(project,{columns:cliOptions.contactColumns}));
  const review=buildContactSheetReviewRequest(project,{columns:cliOptions.contactColumns});
  await fs.writeFile(path.join(out,sheetReview),JSON.stringify(review,null,2));

  const montageOptions={columns:review.layout.columns,rows:review.layout.rows};
  const sheetCleanPng='contact-sheet.clean.png',sheetBlueprintPng='contact-sheet.blueprint.png';
  const cleanPngReady=pageCleanPngAssets.length===project.pages.length&&pageCleanPngAssets.every(Boolean);
  const blueprintPngReady=pageBlueprintPngAssets.length===project.pages.length&&pageBlueprintPngAssets.every(Boolean);
  const cleanMontage=cleanPngReady
    ?composeContactSheetPng(pageCleanPngAssets.map(name=>path.join(out,name)),path.join(out,sheetCleanPng),montageOptions)
    :{ok:false,engine:'none',reason:'One or more Pxxx.clean.png assets were not rasterized; contact-sheet.clean.png was skipped.'};
  const blueprintMontage=blueprintPngReady
    ?composeContactSheetPng(pageBlueprintPngAssets.map(name=>path.join(out,name)),path.join(out,sheetBlueprintPng),montageOptions)
    :{ok:false,engine:'none',reason:'One or more Pxxx.blueprint.png assets were not rasterized; contact-sheet.blueprint.png was skipped.'};
  raster.push({source:'Pxxx.clean.png',output:cleanMontage.ok?sheetCleanPng:null,kind:'contact-sheet-png-montage',...cleanMontage});
  raster.push({source:'Pxxx.blueprint.png',output:blueprintMontage.ok?sheetBlueprintPng:null,kind:'contact-sheet-png-montage',...blueprintMontage});
  if(cleanMontage.ok)files.push(sheetCleanPng);
  if(blueprintMontage.ok)files.push(sheetBlueprintPng);

  const generation=buildContactSheetGenerationPackage({
    project,
    cleanAssets:pageCleanAssets,
    promptAssets:pagePromptAssets,
    contactSheetAsset:cleanMontage.ok?sheetCleanPng:sheetClean,
    promptAsset:sheetPrompt,
    reviewAsset:sheetReview,
    referenceAssets:[],
    columns:cliOptions.contactColumns
  });
  await fs.writeFile(path.join(out,sheetGeneration),JSON.stringify(generation,null,2));
  files.push(sheetClean,sheetBlueprint,sheetPrompt,sheetReview,sheetGeneration);
  let reviewFullSheet=null;
  if(cliOptions.reviewFull){
    const fullSheetSvg='contact-sheet.review-full.svg',fullSheetPng='contact-sheet.review-full.png';
    await fs.writeFile(path.join(out,fullSheetSvg),renderReviewFullContactSheetSvg(project,{columns:cliOptions.contactColumns}));
    files.push(fullSheetSvg);
    const fullPngReady=pageReviewFullPngAssets.length===project.pages.length&&pageReviewFullPngAssets.every(Boolean);
    const fullMontage=fullPngReady
      ?composeContactSheetPng(pageReviewFullPngAssets.map(name=>path.join(out,name)),path.join(out,fullSheetPng),montageOptions)
      :{ok:false,engine:'none',reason:'A Pxxx.review-full.png could not be rasterized; full review montage skipped.'};
    raster.push({source:'Pxxx.review-full.png',output:fullMontage.ok?fullSheetPng:null,kind:'review-full-png-montage',...fullMontage});
    if(fullMontage.ok)files.push(fullSheetPng);
    reviewFullSheet={svg:fullSheetSvg,png:fullMontage.ok?fullSheetPng:null,role:'human-review-only'};
  }
  contactSheetManifest={
    schema:'manga-contact-sheet-generation-package/1',
    role:'multi-page-preflight-only',
    finalAcceptance:false,
    columns:generation.layout.columns,
    rows:generation.layout.rows,
    clean:sheetClean,
    blueprint:sheetBlueprint,
    prompt:sheetPrompt,
    review:sheetReview,
    generation:sheetGeneration,
    png:cleanMontage.ok?sheetCleanPng:null,
    blueprintPng:blueprintMontage.ok?sheetBlueprintPng:null,
    ...(reviewFullSheet?{reviewFull:reviewFullSheet}:{}),
    pngComposition:'page-png-montage'
  };
}

const manifest=buildManifest(project,path.basename(input));
manifest.blueprintRenderer={name:'executable-name-layered',version:3,cleanRole:'generation-facing spatial contract',annotatedRole:'human review only',poseSolver:'deterministic-spatial-v3',compositionSolver:'in-panel-v1'};
if(cliOptions.reviewFull)manifest.reviewFull={schema:'manga-blueprint-review-full/1',role:'human-review-only',pages:reviewFullAssetList};
manifest.lettering={schema:'manga-blueprint-lettering-plan/1',strategy:project.meta.letteringStrategy||'overlay-preferred',unplaceable:unplaceableLettering,assets:project.pages.map((_,i)=>{const n=String(i+1).padStart(3,'0');return{page:i+1,svg:'P'+n+'.lettering.svg',plan:'P'+n+'.lettering.json'}})};
manifest.layoutRecipes={version:1,source:'core/layout-recipes.mjs',pages:project.pages.map((page,index)=>({page:index+1,recipeId:page.layoutDecision?.recipeId||page.layoutDecision?.winner||null,seed:page.layoutDecision?.signals?.seed??0,mutation:page.layoutDecision?.signals?.mutation??0}))};
manifest.rasterization={mode:'best-effort-local',results:raster};
manifest.authority.generationInstructions='Pxxx.prompt.md';
if(contactSheetManifest)manifest.contactSheet=contactSheetManifest;
await fs.writeFile(path.join(out,'manifest.json'),JSON.stringify(manifest,null,2));
files.push('manifest.json');

console.log('Compiled '+project.pages.length+' page(s) -> '+out);
if(unplaceableLettering.length)console.warn('Review lettering warning: '+unplaceableLettering.length+' entries did not fit their panel; see manifest.lettering.unplaceable.');
if(contactSheetManifest)console.log('Contact sheet preflight: '+contactSheetManifest.columns+'x'+contactSheetManifest.rows+(cliOptions.contactColumns?' (override)':' (auto)'));
for(const f of files)console.log('  '+f);
