import type {BuildInfo} from '../legacy-runtime';

export const EDITOR_RENDERED_EVENT='manga-blueprint:editor-rendered' as const;

export type LegacyRuntimeApi=typeof globalThis&{
  MANGA_BLUEPRINT_BUILD_INFO?:Readonly<BuildInfo>;
  initializeEditorState?:()=>Promise<void>;
  renderHierarchy16?:()=>void;
  applySelectedTemplateWithCast36?:()=>unknown;
  applyTemplatePresentation34?:()=>unknown;
};

const runtime=globalThis as LegacyRuntimeApi;

export function setBuildInfo(buildInfo:Readonly<BuildInfo>){
  runtime.MANGA_BLUEPRINT_BUILD_INFO=buildInfo;
}

export async function initializeLegacyEditor(){
  if(typeof runtime.initializeEditorState!=='function'){
    throw new Error('Editor runtime did not expose initializeEditorState.');
  }
  await runtime.initializeEditorState();
}

export function suppressLegacyHierarchyEditor(removeLegacy:()=>void){
  removeLegacy();
  if(typeof runtime.renderHierarchy16==='function')runtime.renderHierarchy16=removeLegacy;
}

export function applySelectedStoryTemplate(){
  const runner=typeof runtime.applySelectedTemplateWithCast36==='function'
    ?runtime.applySelectedTemplateWithCast36
    :runtime.applyTemplatePresentation34;
  if(typeof runner!=='function')throw new Error('Template apply logic is unavailable.');
  return runner();
}
