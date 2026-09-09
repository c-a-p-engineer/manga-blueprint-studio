import fs from 'node:fs';

export const runtimePaths = Object.freeze({
  foundation: 'web/runtime/core/foundation.js',
  projectStorage: 'web/runtime/core/project-storage.js',
  editorState: 'web/runtime/core/editor-state.js',
  exportInput: 'web/runtime/core/export-input.js',
  eventBindings: 'web/runtime/core/event-bindings.js',
  pageNavigation: 'web/runtime/authoring/page-navigation.js',
  workLibraryHierarchy: 'web/runtime/authoring/work-library-hierarchy.js',
  pageLayoutCamera: 'web/runtime/authoring/page-layout-camera.js',
  characterLibraryExport: 'web/runtime/authoring/character-library-export.js',
  localizationExportHardening: 'web/runtime/authoring/localization-export-hardening.js',
  smartManga: 'web/runtime/assist/smart-manga.js',
  characterGuidance: 'web/runtime/identity/character-guidance.js',
  identityLocalizationHardening: 'web/runtime/identity/localization-hardening.js',
  storyReadability: 'web/runtime/story/story-readability.js',
  smartIntentHardening: 'web/runtime/story/smart-intent-hardening.js',
  templateStudio: 'web/runtime/templates/studio.js',
  templateStudioFeedback: 'web/runtime/templates/studio-feedback.js',
  writingDirection: 'web/runtime/lettering/writing-direction.js',
  readingOrder: 'web/runtime/ordering/reading-order.js',
  templateLetteringOrder: 'web/runtime/integration/template-lettering-order.js',
  artDirectionReadiness: 'web/runtime/handoff/art-direction-readiness.js',
  spatialSemantics: 'web/runtime/handoff/spatial-semantics.js',
  crossModel: 'web/runtime/handoff/cross-model.js',
  templateQuality: 'web/runtime/templates/quality.js',
  sceneContract: 'web/runtime/templates/scene-contract.js',
  castFallback: 'web/runtime/templates/cast-fallback.js',
  desktopLayout: 'web/runtime/ui/desktop-layout.js',
  authoringClarity: 'web/runtime/ui/authoring-clarity.js',
  castSemantics: 'web/runtime/templates/cast-semantics.js',
  twoVisible: 'web/runtime/templates/two-visible.js',
  panelCastFlow: 'web/runtime/templates/panel-cast-flow.js',
  interactionGenerationContract: 'web/runtime/handoff/interaction-generation-contract.js',
  renderBrief: 'web/runtime/handoff/render-brief.js',
  producerProvenance: 'web/runtime/handoff/producer-provenance.js'
});

export const runtimeLoadOrder = Object.freeze([
  'foundation','projectStorage','editorState','exportInput','eventBindings','pageNavigation','workLibraryHierarchy',
  'pageLayoutCamera','characterLibraryExport','localizationExportHardening',
  'smartManga','characterGuidance','identityLocalizationHardening',
  'storyReadability','smartIntentHardening',
  'templateStudio','templateStudioFeedback',
  'writingDirection','readingOrder','templateLetteringOrder',
  'artDirectionReadiness','spatialSemantics','crossModel',
  'templateQuality','sceneContract','castFallback',
  'desktopLayout','authoringClarity',
  'castSemantics','twoVisible','panelCastFlow',
  'interactionGenerationContract','renderBrief','producerProvenance'
]);

export function readRuntime(key) {
  const path = runtimePaths[key];
  if (!path) throw new Error(`Unknown runtime source key: ${key}`);
  return fs.readFileSync(path, 'utf8');
}

export function readRuntimeSet(keys = runtimeLoadOrder) {
  return Object.fromEntries(keys.map(key => [key, readRuntime(key)]));
}
