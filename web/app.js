// Zero-build runtime bootstrap. Named classic-script chunks share the existing global runtime state;
// keep this order explicit because later chunks intentionally extend earlier behavior.
const fallbackBuildInfo={
  schema:'manga-blueprint-build-info/1',
  appVersion:'0.16.4',
  gitCommit:null,
  buildSource:'runtime-fallback',
  deployedAt:null
};
try{
  const response=await fetch('./build-info.json',{cache:'no-store'});
  if(!response.ok)throw new Error(`HTTP ${response.status}`);
  const loaded=await response.json();
  globalThis.MANGA_BLUEPRINT_BUILD_INFO=Object.freeze({...fallbackBuildInfo,...loaded});
}catch(error){
  console.warn('Build provenance unavailable; using runtime fallback.',error);
  globalThis.MANGA_BLUEPRINT_BUILD_INFO=Object.freeze(fallbackBuildInfo);
}

const runtimeVersion=String(globalThis.MANGA_BLUEPRINT_BUILD_INFO?.appVersion||fallbackBuildInfo.appVersion);
const runtimeChunks = [
  ['core/foundation', './runtime/core/foundation.js'],
  ['core/project-storage', './runtime/core/project-storage.js'],
  ['core/editor-state', './runtime/core/editor-state.js'],
  ['core/export-input', './runtime/core/export-input.js'],
  ['core/event-bindings', './runtime/core/event-bindings.js'],
  ['authoring/page-navigation', './runtime/authoring/page-navigation.js'],
  ['authoring/work-library-hierarchy', './runtime/authoring/work-library-hierarchy.js'],
  ['authoring/page-layout-camera', './runtime/authoring/page-layout-camera.js'],
  ['authoring/character-library-export', './runtime/authoring/character-library-export.js'],
  ['authoring/localization-export-hardening', './runtime/authoring/localization-export-hardening.js'],
  ['assist/smart-manga', './runtime/assist/smart-manga.js'],
  ['identity/character-guidance', './runtime/identity/character-guidance.js'],
  ['identity/localization-hardening', './runtime/identity/localization-hardening.js'],
  ['story/story-readability', './runtime/story/story-readability.js'],
  ['story/smart-intent-hardening', './runtime/story/smart-intent-hardening.js'],
  ['templates/studio', './runtime/templates/studio.js'],
  ['templates/studio-feedback', './runtime/templates/studio-feedback.js'],
  ['lettering/writing-direction', './runtime/lettering/writing-direction.js'],
  ['ordering/reading-order', './runtime/ordering/reading-order.js'],
  ['integration/template-lettering-order', './runtime/integration/template-lettering-order.js'],
  ['handoff/art-direction-readiness', './runtime/handoff/art-direction-readiness.js'],
  ['handoff/spatial-semantics', './runtime/handoff/spatial-semantics.js'],
  ['handoff/cross-model', './runtime/handoff/cross-model.js'],
  ['templates/quality', './runtime/templates/quality.js'],
  ['templates/scene-contract', './runtime/templates/scene-contract.js'],
  ['templates/cast-fallback', './runtime/templates/cast-fallback.js'],
  ['ui/desktop-layout', './runtime/ui/desktop-layout.js'],
  ['ui/authoring-clarity', './runtime/ui/authoring-clarity.js'],
  ['templates/cast-semantics', './runtime/templates/cast-semantics.js'],
  ['templates/two-visible', './runtime/templates/two-visible.js'],
  ['templates/panel-cast-flow', './runtime/templates/panel-cast-flow.js'],
  ['handoff/interaction-generation-contract', './runtime/handoff/interaction-generation-contract.js'],
  ['handoff/render-brief', './runtime/handoff/render-brief.js'],
  ['authoring/panel-geometry', './runtime/authoring/panel-geometry.js'],
  ['templates/presentation-contract', './runtime/templates/presentation-contract.js'],
  ['templates/discovery-presentation', './runtime/templates/discovery-presentation.js'],
  ['integration/template-character-cast', './runtime/integration/template-character-cast.js'],
  ['handoff/producer-provenance', './runtime/handoff/producer-provenance.js'],
  ['ui/mobile-header', './runtime/ui/mobile-header.js'],
  ['ui/editor-shell', './runtime/ui/editor-shell.js']
];

for (const [id, src] of runtimeChunks) {
  await new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `${src}?v=${encodeURIComponent(runtimeVersion)}`;
    script.dataset.runtimeChunk = id;
    script.onload = resolve;
    script.onerror = () => reject(new Error(`Failed to load runtime chunk ${id}: ${src}`));
    document.head.appendChild(script);
  });
}

if(typeof initializeEditorState==='function'){
  await initializeEditorState();
}
