import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

function run(command,args,{label=`${command} ${args.join(' ')}`}={}){
  console.log(`\n==> ${label}`);
  const result=spawnSync(command,args,{stdio:'inherit',shell:false});
  if(result.error)throw result.error;
  if(result.status!==0)process.exit(result.status??1);
}

function walk(root,predicate){
  const results=[];
  for(const entry of fs.readdirSync(root,{withFileTypes:true})){
    const full=path.join(root,entry.name);
    if(entry.isDirectory())results.push(...walk(full,predicate));
    else if(predicate(full))results.push(full);
  }
  return results.sort();
}

function assertArtifact(){
  for(const file of ['dist/index.html','dist/editor.html','dist/guide.html','dist/runtime/core/foundation.js']){
    if(!fs.existsSync(file))throw new Error(`Missing production artifact: ${file}`);
  }
  const index=fs.readFileSync('dist/index.html','utf8');
  const editor=fs.readFileSync('dist/editor.html','utf8');
  if(!index.includes('assets/'))throw new Error('dist/index.html does not reference Vite assets');
  if(!index.includes('./editor.html')&&!index.includes('/manga-blueprint-studio/editor.html'))throw new Error('Built landing does not link to editor.html');
  if(index.includes('id="blueprintSvg"'))throw new Error('Built landing unexpectedly contains editor DOM');
  if(!editor.includes('id="blueprintSvg"'))throw new Error('Built editor is missing editor DOM');
  console.log('\n==> Production artifact shape passed');
}

run(process.platform==='win32'?'npm.cmd':'npm',['run','typecheck'],{label:'Typecheck Phase 1 source'});
run(process.platform==='win32'?'npm.cmd':'npm',['run','build'],{label:'Build Vite production artifact'});
assertArtifact();

const syntaxTargets=[
  'web/app.js',
  ...walk('scripts',file=>file.endsWith('.mjs')),
  ...walk('web/runtime',file=>file.endsWith('.js')),
];
for(const file of [...new Set(syntaxTargets)]){
  run(process.execPath,['--check',file],{label:`Syntax ${file}`});
}

const validators=[
  'scripts/validate-public-entry.mjs',
  'scripts/validate-phase1-toolchain.mjs',
  'scripts/validate-runtime-layout.mjs',
  'scripts/validate-editor-architecture.mjs',
  'scripts/validate-editor-command-behavior.mjs',
  'scripts/validate.mjs',
  'scripts/validate-project-storage-foundation.mjs',
  'scripts/validate-backup-restore.mjs',
  'scripts/validate-multi-page-core.mjs',
  'scripts/validate-work-library-hierarchy.mjs',
  'scripts/validate-editor-shell.mjs',
  'scripts/validate-panel-peek.mjs',
  'scripts/validate-template-studio.mjs',
  'scripts/validate-writing-direction.mjs',
  'scripts/validate-reading-order.mjs',
  'scripts/validate-lettering-reading-integration.mjs',
  'scripts/validate-art-direction-spatial.mjs',
  'scripts/validate-cross-model-handoff.mjs',
  'scripts/validate-template-quality.mjs',
  'scripts/validate-scene-contract.mjs',
  'scripts/validate-desktop-layout.mjs',
  'scripts/validate-authoring-clarity.mjs',
  'scripts/validate-template-cast-meaning.mjs',
  'scripts/validate-two-visible-filters.mjs',
  'scripts/validate-panel-cast-flow.mjs',
  'scripts/validate-generation-contract.mjs',
  'scripts/validate-render-brief.mjs',
  'scripts/validate-work-brief.mjs',
  'scripts/validate-panel-geometry.mjs',
  'scripts/validate-panel-layout-grammar.mjs',
  'scripts/validate-inset-panels.mjs',
  'scripts/validate-editor-disclosure.mjs',
  'scripts/validate-story-template-presentation.mjs',
  'scripts/validate-template-discovery-presentation.mjs',
  'scripts/validate-template-character-cast.mjs',
  'scripts/validate-producer-provenance.mjs',
  'scripts/validate-documentation-sync.mjs',
  'scripts/validate-version-sync.mjs',
];
for(const validator of validators){
  run(process.execPath,[validator],{label:`Contract ${validator}`});
}

console.log('\nAll CI validation passed.');
