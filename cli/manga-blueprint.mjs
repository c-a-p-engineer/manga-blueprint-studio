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
import{buildContactSheetGenerationPackage,buildContactSheetPrompt,buildContactSheetReviewRequest,renderContactSheetPngSourceSvg,renderContactSheetSvg}from'../core/contact-sheet.mjs';

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
  contactColumns:null
};

while(args.length){
  const flag=args.shift();
  if(flag==='--contact-sheet'){cliOptions.contactSheet=true;continue;}
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
  console.error('Usage: node cli/manga-blueprint.mjs <name.md> [out-dir] [--layout <recipe>] [--seed <value>] [--mutation <0..1>] [--contact-sheet] [--contact-columns <1..8>]\n       node cli/manga-blueprint.mjs --list-layouts [panel-count]');
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

const files=['work.manga.json'],raster=[],pageCleanAssets=[],pagePromptAssets=[],pageCleanPngAssets=Array(project.pages.length).fill(null),pageBlueprintPngAssets=Array(project.pages.length).fill(null);
for(let i=0;i<project.pages.length;i++){
  const n=String(i+1).padStart(3,'0');
  const clean='P'+n+'.clean.svg',annotated='P'+n+'.blueprint.svg',prompt='P'+n+'.prompt.md',lettering='P'+n+'.lettering.svg',letteringJson='P'+n+'.lettering.json';
  const promptText=buildExecutablePrompt(project,i),letteringPlan=buildLetteringPlan(project,i);
  await fs.writeFile(path.join(out,clean),renderExecutableNameSvg(project,i,{annotated:false}));
  await fs.writeFile(path.join(out,annotated),renderExecutableNameSvg(project,i,{annotated:true}));
  await fs.writeFile(path.join(out,prompt),promptText);
  await fs.writeFile(path.join(out,lettering),renderLetteringOverlaySvg(project,i));
  await fs.writeFile(path.join(out,letteringJson),JSON.stringify(letteringPlan,null,2));
  const pkg=buildPortableGenerationPackage({project,pageIndex:i,cleanAsset:clean,prompt,referenceAssets:[],letteringAsset:lettering,letteringPlan:letteringJson});
  await fs.writeFile(path.join(out,'P'+n+'.generation.json'),JSON.stringify(pkg,null,2));
  files.push(clean,annotated,prompt,lettering,letteringJson,'P'+n+'.generation.json');
  pageCleanAssets.push(clean);
  pagePromptAssets.push(prompt);
  for(const [role,svg] of[['clean',clean],['blueprint',annotated]]){
    const png=svg.replace(/\.svg$/,'.png'),r=rasterizeSvg(path.join(out,svg),path.join(out,png));
    raster.push({source:svg,output:r.ok?png:null,...r});
    if(r.ok){
      files.push(png);
      if(role==='clean')pageCleanPngAssets[i]=png;
      else pageBlueprintPngAssets[i]=png;
    }
  }
}

async function composePngContactSheet(pagePngAssets,outputName,{columns=null}={}){
  const inputs=pagePngAssets.filter(Boolean);
  if(inputs.length!==project.pages.length)return{ok:false,engine:'none',inputs,reason:'All page PNGs are required before composing a PNG contact sheet.'};
  const dataUris=await Promise.all(pagePngAssets.map(async name=>'data:image/png;base64,'+(await fs.readFile(path.join(out,name))).toString('base64')));
  const sourceSvg=renderContactSheetPngSourceSvg(dataUris,{columns});
  const tempPath=path.join(out,'.'+outputName+'.source.svg');
  await fs.writeFile(tempPath,sourceSvg);
  try{
    return{...rasterizeSvg(tempPath,path.join(out,outputName)),inputs};
  }finally{
    await fs.rm(tempPath,{force:true});
  }
}

let contactSheetManifest=null;
if(cliOptions.contactSheet){
  const sheetClean='contact-sheet.clean.svg',sheetCleanPng='contact-sheet.clean.png',sheetBlueprintPng='contact-sheet.blueprint.png',sheetPrompt='contact-sheet.prompt.md',sheetReview='contact-sheet.review.json',sheetGeneration='contact-sheet.generation.json';
  const cleanSvgs=await Promise.all(pageCleanAssets.map(name=>fs.readFile(path.join(out,name),'utf8')));
  await fs.writeFile(path.join(out,sheetClean),renderContactSheetSvg(cleanSvgs,{columns:cliOptions.contactColumns}));
  await fs.writeFile(path.join(out,sheetPrompt),buildContactSheetPrompt(project,{columns:cliOptions.contactColumns}));
  const review=buildContactSheetReviewRequest(project,{columns:cliOptions.contactColumns});
  await fs.writeFile(path.join(out,sheetReview),JSON.stringify(review,null,2));

  const cleanSheetRaster=await composePngContactSheet(pageCleanPngAssets,sheetCleanPng,{columns:cliOptions.contactColumns});
  const blueprintSheetRaster=await composePngContactSheet(pageBlueprintPngAssets,sheetBlueprintPng,{columns:cliOptions.contactColumns});
  raster.push({source:'page-clean-pngs',output:cleanSheetRaster.ok?sheetCleanPng:null,...cleanSheetRaster});
  raster.push({source:'page-blueprint-pngs',output:blueprintSheetRaster.ok?sheetBlueprintPng:null,...blueprintSheetRaster});
  if(cleanSheetRaster.ok)files.push(sheetCleanPng);
  if(blueprintSheetRaster.ok)files.push(sheetBlueprintPng);

  const generation=buildContactSheetGenerationPackage({
    project,
    cleanAssets:pageCleanPngAssets.every(Boolean)?pageCleanPngAssets:pageCleanAssets,
    promptAssets:pagePromptAssets,
    contactSheetAsset:cleanSheetRaster.ok?sheetCleanPng:sheetClean,
    promptAsset:sheetPrompt,
    reviewAsset:sheetReview,
    referenceAssets:[],
    columns:cliOptions.contactColumns
  });
  await fs.writeFile(path.join(out,sheetGeneration),JSON.stringify(generation,null,2));
  files.push(sheetClean,sheetPrompt,sheetReview,sheetGeneration);
  contactSheetManifest={
    schema:'manga-contact-sheet-generation-package/1',
    role:'multi-page-preflight-only',
    finalAcceptance:false,
    columns:generation.layout.columns,
    rows:generation.layout.rows,
    clean:sheetClean,
    cleanPng:cleanSheetRaster.ok?sheetCleanPng:null,
    blueprintPng:blueprintSheetRaster.ok?sheetBlueprintPng:null,
    prompt:sheetPrompt,
    review:sheetReview,
    generation:sheetGeneration,
    png:cleanSheetRaster.ok?sheetCleanPng:null
  };
}

const manifest=buildManifest(project,path.basename(input));
manifest.blueprintRenderer={name:'executable-name-layered',version:3,cleanRole:'generation-facing spatial contract',annotatedRole:'human review only',poseSolver:'deterministic-spatial-v3',compositionSolver:'in-panel-v1'};
manifest.lettering={schema:'manga-blueprint-lettering-plan/1',strategy:project.meta.letteringStrategy||'overlay-preferred',assets:project.pages.map((_,i)=>{const n=String(i+1).padStart(3,'0');return{page:i+1,svg:'P'+n+'.lettering.svg',plan:'P'+n+'.lettering.json'}})};
manifest.layoutRecipes={version:1,source:'core/layout-recipes.mjs',pages:project.pages.map((page,index)=>({page:index+1,recipeId:page.layoutDecision?.recipeId||page.layoutDecision?.winner||null,seed:page.layoutDecision?.signals?.seed??0,mutation:page.layoutDecision?.signals?.mutation??0}))};
manifest.rasterization={mode:'best-effort-local',results:raster};
manifest.authority.generationInstructions='Pxxx.prompt.md';
if(contactSheetManifest)manifest.contactSheet=contactSheetManifest;
await fs.writeFile(path.join(out,'manifest.json'),JSON.stringify(manifest,null,2));
files.push('manifest.json');

console.log('Compiled '+project.pages.length+' page(s) -> '+out);
if(contactSheetManifest)console.log('Contact sheet preflight: '+contactSheetManifest.columns+'x'+contactSheetManifest.rows+(cliOptions.contactColumns?' (override)':' (auto)'));
for(const f of files)console.log('  '+f);
