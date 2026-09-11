export type BuildInfo={
  schema:string;
  appVersion:string;
  gitCommit:string|null;
  buildSource:string;
  deployedAt:string|null;
};

export const LEGACY_RUNTIME_CHUNKS=Object.freeze([
  ['core/foundation','runtime/core/foundation.js'],
  ['core/project-storage','runtime/core/project-storage.js'],
  ['core/editor-state','runtime/core/editor-state.js'],
  ['core/export-input','runtime/core/export-input.js'],
  ['core/event-bindings','runtime/core/event-bindings.js'],
  ['authoring/page-navigation','runtime/authoring/page-navigation.js'],
  ['authoring/work-library-hierarchy','runtime/authoring/work-library-hierarchy.js'],
  ['authoring/page-layout-camera','runtime/authoring/page-layout-camera.js'],
  ['authoring/character-library-export','runtime/authoring/character-library-export.js'],
  ['authoring/localization-export-hardening','runtime/authoring/localization-export-hardening.js'],
  ['assist/smart-manga','runtime/assist/smart-manga.js'],
  ['identity/character-guidance','runtime/identity/character-guidance.js'],
  ['identity/localization-hardening','runtime/identity/localization-hardening.js'],
  ['story/story-readability','runtime/story/story-readability.js'],
  ['story/smart-intent-hardening','runtime/story/smart-intent-hardening.js'],
  ['templates/studio','runtime/templates/studio.js'],
  ['templates/studio-feedback','runtime/templates/studio-feedback.js'],
  ['lettering/writing-direction','runtime/lettering/writing-direction.js'],
  ['ordering/reading-order','runtime/ordering/reading-order.js'],
  ['integration/template-lettering-order','runtime/integration/template-lettering-order.js'],
  ['handoff/art-direction-readiness','runtime/handoff/art-direction-readiness.js'],
  ['handoff/spatial-semantics','runtime/handoff/spatial-semantics.js'],
  ['handoff/cross-model','runtime/handoff/cross-model.js'],
  ['templates/quality','runtime/templates/quality.js'],
  ['templates/scene-contract','runtime/templates/scene-contract.js'],
  ['templates/cast-fallback','runtime/templates/cast-fallback.js'],
  ['ui/desktop-layout','runtime/ui/desktop-layout.js'],
  ['ui/authoring-clarity','runtime/ui/authoring-clarity.js'],
  ['templates/cast-semantics','runtime/templates/cast-semantics.js'],
  ['templates/two-visible','runtime/templates/two-visible.js'],
  ['templates/panel-cast-flow','runtime/templates/panel-cast-flow.js'],
  ['handoff/interaction-generation-contract','runtime/handoff/interaction-generation-contract.js'],
  ['handoff/render-brief','runtime/handoff/render-brief.js'],
  ['authoring/panel-geometry','runtime/authoring/panel-geometry.js'],
  ['templates/presentation-contract','runtime/templates/presentation-contract.js'],
  ['templates/discovery-presentation','runtime/templates/discovery-presentation.js'],
  ['integration/template-character-cast','runtime/integration/template-character-cast.js'],
  ['handoff/producer-provenance','runtime/handoff/producer-provenance.js'],
  ['ui/mobile-header','runtime/ui/mobile-header.js'],
  ['ui/editor-shell','runtime/ui/editor-shell.js']
] as const);

function runtimeCacheKey(info:BuildInfo){
  const revision=info.gitCommit?.slice(0,12)||'local';
  return `${info.appVersion}-${revision}`;
}

export async function loadLegacyRuntime(info:BuildInfo){
  const base=import.meta.env.BASE_URL;
  const version=encodeURIComponent(runtimeCacheKey(info));
  for(const [id,path] of LEGACY_RUNTIME_CHUNKS){
    await new Promise<void>((resolve,reject)=>{
      const script=document.createElement('script');
      script.src=`${base}${path}?v=${version}`;
      script.dataset.runtimeChunk=id;
      script.onload=()=>resolve();
      script.onerror=()=>reject(new Error(`Failed to load runtime chunk ${id}: ${path}`));
      document.head.appendChild(script);
    });
  }
}
