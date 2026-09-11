// Prototype 0.15.2: export producer provenance and deployed-source diagnostics.
// This is intentionally separate from project-state identity: it describes which
// application build produced the package, so stale Pages/cache exports are debuggable.

function producerBuildInfo31(){
  const fallback={
    schema:'manga-blueprint-build-info/1',
    appVersion:'0.15.2',
    gitCommit:null,
    buildSource:'runtime-fallback',
    deployedAt:null
  };
  const raw=globalThis.MANGA_BLUEPRINT_BUILD_INFO;
  return raw&&typeof raw==='object'?{...fallback,...raw}:fallback;
}

function producerManifest31(){
  const build=producerBuildInfo31();
  return {
    schema:'manga-blueprint-producer/1',
    appVersion:String(build.appVersion||'unknown'),
    gitCommit:build.gitCommit||null,
    buildSource:String(build.buildSource||'unknown'),
    deployedAt:build.deployedAt||null,
    projectFormat:'manga-blueprint/0.2',
    manifestSchema:'manga-blueprint-export-manifest/3',
    renderBriefSchema:'manga-blueprint-render-brief/2',
    designDirectionSchema:'manga-blueprint-design-direction-pass/1'
  };
}

if(typeof exportManifest08==='function'){
  const exportManifestBase31=exportManifest08;
  exportManifest08=function(identity,packageType,files){
    const manifest=exportManifestBase31(identity,packageType,files);
    manifest.producer=producerManifest31();
    return manifest;
  };
}

const producerFooter31=producerBuildInfo31();
const producerRevision31=producerFooter31.gitCommit?` · ${String(producerFooter31.gitCommit).slice(0,8)}`:'';
document.querySelector('footer')&&(document.querySelector('footer').textContent=`Prototype ${producerFooter31.appVersion} · producer provenance${producerRevision31}`);
