import type {BuildInfo} from '../legacy-runtime';

export const EDITOR_RENDERED_EVENT='manga-blueprint:editor-rendered' as const;

export type LayoutSolverDecision={
  solver:string;
  winner?:string|null;
  recipeId?:string|null;
  score?:number|null;
  candidates?:Array<{name?:string;recipeId?:string;family?:string;score?:number}>;
  directionRationale?:Array<{panel?:number;techniques?:string[];reasons?:Array<{technique:string;reason:string}>}>;
};

export type LayoutRecipeApi={
  currentCanvas:()=>{width:number;height:number;panelCount:number;language:string};
  currentSolverDecision:()=>LayoutSolverDecision;
  applyLayoutRecipe:(config:{recipeId:string;seed:string|number;mutation:number;rects:Array<{x:number;y:number;w:number;h:number}>;ask?:boolean})=>boolean;
};

export type LegacyRuntimeApi=typeof globalThis&{
  MANGA_BLUEPRINT_BUILD_INFO?:Readonly<BuildInfo>;
  MANGA_BLUEPRINT_LAYOUT_API?:LayoutRecipeApi;
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

export function getLayoutRecipeApi(){
  return runtime.MANGA_BLUEPRINT_LAYOUT_API??null;
}
