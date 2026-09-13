import type {MangaProject} from '../domain/model';
import type {BuildInfo} from '../legacy-runtime';

export const EDITOR_RENDERED_EVENT='manga-blueprint:editor-rendered' as const;

export type BackupCounts={
  pages:number;
  containers:number;
  baseCharacters:number;
  customTemplates:number;
  files:number;
};

export type BackupManifest={
  schema:'manga-blueprint-backup-manifest/1';
  packageType:'work-backup';
  createdAt:string;
  projectFormat:'manga-blueprint/0.2';
  workId:string;
  projectTitle:string;
  activePageId:string|null;
  counts:BackupCounts;
  includes:{project:true;customTemplates:boolean};
  files:Record<string,{path:string;role:string;required:boolean;sha256:string}>;
};

export type BackupInspection={
  manifest:BackupManifest;
  project:MangaProject;
  customTemplates:Array<{id?:string;[key:string]:unknown}>|null;
  conflict:boolean;
};

export type BackupRestoreMode='restore'|'copy'|'overwrite';

export type BackupCreateResult={
  blob:Blob;
  manifest:BackupManifest;
  filename:string;
};

export type BackupRestoreApi={
  readonly manifestSchema:'manga-blueprint-backup-manifest/1';
  readonly packageType:'work-backup';
  supported:()=>boolean;
  create:(options?:{includeCustomTemplates?:boolean})=>Promise<BackupCreateResult>;
  inspect:(file:File)=>Promise<BackupInspection>;
  restore:(inspection:BackupInspection,mode:BackupRestoreMode)=>Promise<void>;
};

export type LegacyRuntimeApi=typeof globalThis&{
  MANGA_BLUEPRINT_BUILD_INFO?:Readonly<BuildInfo>;
  MANGA_BLUEPRINT_BACKUP_RESTORE?:BackupRestoreApi;
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

export function getBackupRestoreApi():BackupRestoreApi{
  const api=runtime.MANGA_BLUEPRINT_BACKUP_RESTORE;
  if(!api)throw new Error('Backup / Restore runtime service is unavailable.');
  return api;
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
