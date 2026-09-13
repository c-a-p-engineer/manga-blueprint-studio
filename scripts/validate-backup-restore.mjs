import fs from 'node:fs';
import {runtimeLoadOrder,runtimePaths} from './runtime-paths.mjs';

const path=runtimePaths.backupRestore;
if(path!=='web/runtime/integration/backup-restore.js')throw new Error(`Unexpected backup restore owner: ${path}`);
const source=fs.readFileSync(path,'utf8');
const order=Object.fromEntries(runtimeLoadOrder.map((key,index)=>[key,index]));
if(!(order.characterLibraryExport < order.backupRestore && order.templateStudio < order.backupRestore)){
  throw new Error('Backup restore must load after ZIP/hash helpers and custom Story Template storage.');
}

for(const phrase of [
  "BACKUP_MANIFEST_SCHEMA_20='manga-blueprint-backup-manifest/1'",
  "BACKUP_PACKAGE_TYPE_20='work-backup'",
  "BACKUP_MANIFEST_PATH_20='backup-manifest.json'",
  "BACKUP_PROJECT_PATH_20='project.manga.json'",
  "BACKUP_CUSTOM_TEMPLATES_PATH_20='templates/custom-templates.json'",
  'zipStore06(entries)',
  'readStoredZip20',
  'crc3206(data)!==expectedCrc',
  'sha256Hex06(projectText)',
  'verifyBackupHash20(projectBytes',
  "rawProject?.format!=='manga-blueprint/0.2'",
  "rawProject.meta?.workId!==manifest.workId",
  'verifyBackupCounts20(manifest,incoming,customTemplates)',
  'projectStorage.has(inspected.project.meta.workId)',
  "return'copy'",
  "return'overwrite'",
  'cloneProjectAsNewWork(incoming)',
  'clearTimeout(queuedProjectSaveTimer)',
  'existingTarget=targetId===previousProject.meta.workId?previousProject:await projectStorage.load(targetId)',
  'if(existingTarget)await projectStorage.save(existingTarget);else await projectStorage.remove(targetId)',
  'mergeCustomTemplates20(templatesBefore,inspected.customTemplates)',
  "backupRestore20",
  "downloadBackup20",
  "restoreBackup20"
]){
  if(!source.includes(phrase))throw new Error(`Backup/restore contract missing ${JSON.stringify(phrase)}`);
}

if(source.includes('manga-blueprint-export-manifest/3'))throw new Error('Backup owner must not reuse the AI export manifest schema.');
if(!source.includes('not an AI generation or review package'))throw new Error('Backup package must state its separation from AI handoff packages.');

console.log('Phase 3 backup / restore contract validation passed.');
