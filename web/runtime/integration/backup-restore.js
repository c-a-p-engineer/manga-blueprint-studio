// Phase 3 whole-work backup / restore service.
// UI is owned by typed source under web/src/ui; this classic chunk owns the compatibility/runtime boundary.
const BACKUP_MANIFEST_SCHEMA_20='manga-blueprint-backup-manifest/1';
const BACKUP_PACKAGE_TYPE_20='work-backup';
const BACKUP_MANIFEST_PATH_20='backup-manifest.json';
const BACKUP_PROJECT_PATH_20='project.manga.json';
const BACKUP_CUSTOM_TEMPLATES_PATH_20='templates/custom-templates.json';

const backupEncode20=value=>new TextEncoder().encode(String(value));
const backupDecode20=bytes=>new TextDecoder().decode(bytes);
const backupJson20=bytes=>JSON.parse(backupDecode20(bytes));
const backupShaValue20=value=>String(value||'').replace(/^sha256:/,'').toLowerCase();

async function backupSha256Bytes20(bytes){
  const data=bytes instanceof Uint8Array?bytes:new Uint8Array(bytes);
  const digest=await crypto.subtle.digest('SHA-256',data);
  return [...new Uint8Array(digest)].map(value=>value.toString(16).padStart(2,'0')).join('');
}

function readStoredZip20(buffer){
  const bytes=buffer instanceof Uint8Array?buffer:new Uint8Array(buffer);
  const view=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);
  const entries=new Map();
  let offset=0;
  while(offset+4<=bytes.length){
    const signature=view.getUint32(offset,true);
    if(signature===0x02014b50||signature===0x06054b50)break;
    if(signature!==0x04034b50)throw new Error(`Unsupported ZIP signature at ${offset}`);
    if(offset+30>bytes.length)throw new Error('Truncated ZIP local header');
    const flags=view.getUint16(offset+6,true);
    const method=view.getUint16(offset+8,true);
    const expectedCrc=view.getUint32(offset+14,true);
    const compressedSize=view.getUint32(offset+18,true);
    const uncompressedSize=view.getUint32(offset+22,true);
    const nameLength=view.getUint16(offset+26,true);
    const extraLength=view.getUint16(offset+28,true);
    if(flags&0x0001)throw new Error('Encrypted ZIP entries are not supported for Manga Blueprint backups');
    if(flags&0x0008)throw new Error('ZIP data descriptors are not supported for backup restore');
    if(method!==0)throw new Error('Compressed ZIP entries are not supported for Manga Blueprint backups');
    const nameStart=offset+30;
    const dataStart=nameStart+nameLength+extraLength;
    const dataEnd=dataStart+compressedSize;
    if(dataEnd>bytes.length)throw new Error('Truncated ZIP entry');
    const name=new TextDecoder().decode(bytes.slice(nameStart,nameStart+nameLength));
    if(!name||name.startsWith('/')||name.includes('\\')||name.split('/').includes('..')||entries.has(name)){
      throw new Error(`Invalid or duplicate ZIP path: ${name||'(empty)'}`);
    }
    if(compressedSize!==uncompressedSize)throw new Error(`Stored ZIP size mismatch: ${name}`);
    const data=bytes.slice(dataStart,dataEnd);
    if(crc3206(data)!==expectedCrc)throw new Error(`ZIP CRC mismatch: ${name}`);
    entries.set(name,data);
    offset=dataEnd;
  }
  if(!entries.size)throw new Error('ZIP contains no readable entries');
  return entries;
}

function backupProjectCounts20(projectValue,customTemplates){
  return {
    pages:projectValue.pages?.length||0,
    containers:projectValue.containers?.length||0,
    baseCharacters:projectValue.characterLibrary?.length||0,
    customTemplates:Array.isArray(customTemplates)?customTemplates.length:0
  };
}

function validateBackupProjectShape20(rawProject){
  if(!rawProject||rawProject.format!=='manga-blueprint/0.2')throw new Error('Backup project format is not supported');
  if(!rawProject.meta||typeof rawProject.meta.workId!=='string'||!rawProject.meta.workId.trim())throw new Error('Backup project is missing work identity');
  if(!Array.isArray(rawProject.pages)||!rawProject.pages.length)throw new Error('Backup project must contain at least one page');
  if(rawProject.containers!==undefined&&!Array.isArray(rawProject.containers))throw new Error('Backup project containers must be an array');
  if(rawProject.characterLibrary!==undefined&&!Array.isArray(rawProject.characterLibrary))throw new Error('Backup project characterLibrary must be an array');

  const identities=new Set();
  const requireIdentity=(id,label)=>{
    if(typeof id!=='string'||!id.trim())throw new Error(`Backup project ${label} is missing identity`);
    if(identities.has(id))throw new Error(`Backup project contains duplicate identity: ${id}`);
    identities.add(id);
  };
  for(const container of rawProject.containers||[])requireIdentity(container?.id,'container');
  for(const page of rawProject.pages){
    requireIdentity(page?.id,'page');
    if(!Array.isArray(page.panels))throw new Error(`Backup page ${page.id} is missing panels`);
    for(const panel of page.panels){
      requireIdentity(panel?.id,'panel');
      const rect=panel?.rect;
      if(!rect||![rect.x,rect.y,rect.w,rect.h].every(Number.isFinite)||rect.w<=0||rect.h<=0){
        throw new Error(`Backup panel ${panel?.id||'(unknown)'} has invalid rect geometry`);
      }
      if(!Array.isArray(panel.characters)||!Array.isArray(panel.balloons))throw new Error(`Backup panel ${panel.id} has invalid content arrays`);
      for(const character of panel.characters)requireIdentity(character?.id,'placed character');
      for(const balloon of panel.balloons)requireIdentity(balloon?.id,'balloon');
    }
  }
}

async function buildBackupPackage20({includeCustomTemplates=false}={}){
  const projectSnapshot=ensureProjectIdentity(clone(project));
  const projectBytes=backupEncode20(JSON.stringify(projectSnapshot,null,2));
  const customTemplates=includeCustomTemplates?loadCustomTemplates13():null;
  const templateBytes=includeCustomTemplates?backupEncode20(JSON.stringify(customTemplates,null,2)):null;
  const files={
    project:{
      path:BACKUP_PROJECT_PATH_20,
      role:'canonical-project',
      required:true,
      sha256:`sha256:${await backupSha256Bytes20(projectBytes)}`
    }
  };
  if(includeCustomTemplates){
    files.customTemplates={
      path:BACKUP_CUSTOM_TEMPLATES_PATH_20,
      role:'optional-custom-story-template-library',
      required:true,
      sha256:`sha256:${await backupSha256Bytes20(templateBytes)}`
    };
  }
  const manifest={
    schema:BACKUP_MANIFEST_SCHEMA_20,
    packageType:BACKUP_PACKAGE_TYPE_20,
    createdAt:new Date().toISOString(),
    projectFormat:projectSnapshot.format,
    workId:projectSnapshot.meta.workId,
    projectTitle:projectSnapshot.meta.title||'',
    activePageId:selectedPageId&&projectSnapshot.pages.some(page=>page.id===selectedPageId)?selectedPageId:projectSnapshot.pages[0]?.id||null,
    counts:{
      ...backupProjectCounts20(projectSnapshot,customTemplates),
      files:includeCustomTemplates?3:2
    },
    includes:{project:true,customTemplates:includeCustomTemplates},
    files,
    restoreRule:'Validate schema, file roles, counts, hashes, and work identity before mutating local storage. Same-work restore requires explicit copy or overwrite choice.',
    separationRule:'This package is a whole-work backup, not an AI generation or review package.'
  };
  const entries=[
    {name:BACKUP_PROJECT_PATH_20,data:projectBytes},
    {name:BACKUP_MANIFEST_PATH_20,data:JSON.stringify(manifest,null,2)}
  ];
  if(includeCustomTemplates)entries.splice(1,0,{name:BACKUP_CUSTOM_TEMPLATES_PATH_20,data:templateBytes});
  const filename=`${safeFileStem06(projectSnapshot.meta.title)}_${timestamp06()}_${String(projectSnapshot.meta.workId).slice(-8)}.manga-backup.zip`;
  return {blob:await zipStore06(entries),manifest,filename};
}

function requireBackupFile20(entries,fileDef,{role,label}){
  if(!fileDef?.path||typeof fileDef.path!=='string')throw new Error(`Backup manifest missing ${label} path`);
  if(fileDef.role!==role)throw new Error(`Backup manifest has invalid ${label} role`);
  if(fileDef.required!==true)throw new Error(`Backup manifest must mark included ${label} as required`);
  const data=entries.get(fileDef.path);
  if(!data)throw new Error(`Backup missing ${label}: ${fileDef.path}`);
  return data;
}

async function verifyBackupHash20(bytes,fileDef,label){
  const expected=backupShaValue20(fileDef?.sha256);
  if(!/^[a-f0-9]{64}$/.test(expected))throw new Error(`Backup manifest has invalid ${label} hash`);
  const actual=await backupSha256Bytes20(bytes);
  if(actual!==expected)throw new Error(`${label} SHA-256 mismatch`);
}

function verifyBackupCounts20(manifest,projectValue,customTemplates,entryCount){
  const actual=backupProjectCounts20(projectValue,customTemplates);
  for(const key of ['pages','containers','baseCharacters','customTemplates']){
    if(Number(manifest.counts?.[key]??-1)!==actual[key])throw new Error(`Backup count mismatch: ${key}`);
  }
  if(Number(manifest.counts?.files??-1)!==entryCount)throw new Error('Backup file count mismatch');
}

async function inspectBackup20(file){
  const entries=readStoredZip20(await file.arrayBuffer());
  const manifestBytes=entries.get(BACKUP_MANIFEST_PATH_20);
  if(!manifestBytes)throw new Error('Not a Manga Blueprint work backup: backup-manifest.json is missing');
  const manifest=backupJson20(manifestBytes);
  if(manifest.schema!==BACKUP_MANIFEST_SCHEMA_20||manifest.packageType!==BACKUP_PACKAGE_TYPE_20){
    throw new Error('Unsupported backup manifest or non-backup package');
  }
  if(manifest.includes?.project!==true)throw new Error('Backup manifest does not declare a project payload');
  const projectBytes=requireBackupFile20(entries,manifest.files?.project,{role:'canonical-project',label:'project'});
  await verifyBackupHash20(projectBytes,manifest.files.project,'project');
  const rawProject=backupJson20(projectBytes);
  validateBackupProjectShape20(rawProject);
  if(rawProject.meta.workId!==manifest.workId)throw new Error('Backup work identity mismatch');
  if(rawProject.format!==manifest.projectFormat)throw new Error('Backup project format mismatch');
  const incoming=ensureProjectIdentity(rawProject);

  let customTemplates=null;
  if(manifest.includes?.customTemplates){
    const templateBytes=requireBackupFile20(entries,manifest.files?.customTemplates,{role:'optional-custom-story-template-library',label:'custom templates'});
    await verifyBackupHash20(templateBytes,manifest.files.customTemplates,'custom templates');
    customTemplates=backupJson20(templateBytes);
    if(!Array.isArray(customTemplates))throw new Error('Custom template library must be an array');
  }else if(manifest.files?.customTemplates){
    throw new Error('Backup manifest contains undeclared custom templates');
  }
  verifyBackupCounts20(manifest,incoming,customTemplates,entries.size);
  const conflict=await projectStorage.has(incoming.meta.workId);
  return {manifest,project:incoming,customTemplates,conflict};
}

function mergeCustomTemplates20(existing,incoming){
  const merged=new Map();
  for(const item of Array.isArray(existing)?existing:[])if(item?.id)merged.set(item.id,item);
  for(const item of Array.isArray(incoming)?incoming:[])if(item?.id)merged.set(item.id,item);
  return [...merged.values()];
}

async function cloneAsAvailableWork20(input){
  for(let attempt=0;attempt<5;attempt++){
    const candidate=cloneProjectAsNewWork(input);
    if(!await projectStorage.has(candidate.meta.workId))return candidate;
  }
  throw new Error('Unable to allocate a unique work identity for restore copy');
}

async function applyRestore20(inspected,mode){
  if(!projectStorage.supported())throw new Error('IndexedDB is unavailable');
  if(!['restore','copy','overwrite'].includes(mode))throw new Error(`Unsupported restore mode: ${mode}`);

  await settleProjectSaveQueue();
  const previousProject=clone(project);
  const previousPageId=selectedPageId;
  const templatesBefore=clone(loadCustomTemplates13());
  // Preserve the latest active-work edits before switching away from them.
  await projectStorage.save(previousProject);

  const sourceWorkId=inspected.project.meta.workId;
  const conflictNow=await projectStorage.has(sourceWorkId);
  if(mode==='restore'&&conflictNow)throw new Error('Restore target now exists; inspect the backup again');
  if(mode==='overwrite'&&!conflictNow)throw new Error('Restore target changed; inspect the backup again');

  let incoming=mode==='copy'?await cloneAsAvailableWork20(inspected.project):ensureProjectIdentity(clone(inspected.project));
  const targetId=incoming.meta.workId;
  const targetExisted=await projectStorage.has(targetId);
  const existingTarget=targetExisted?await projectStorage.load(targetId):null;
  const preferredPageId=mode==='copy'?null:inspected.manifest.activePageId;
  const targetPageId=preferredPageId&&incoming.pages.some(page=>page.id===preferredPageId)?preferredPageId:incoming.pages[0]?.id||null;

  try{
    const activated=await projectStorage.saveAndActivate(incoming,targetPageId);
    if(inspected.customTemplates){
      saveCustomTemplates13(mergeCustomTemplates20(templatesBefore,inspected.customTemplates));
      registerCustomTemplates13();
    }
    project=incoming;
    selectedPageId=activated.pageId;
    selectedPanelId=currentPage()?.panels[0]?.id||null;
    selectedCharacterId=null;
    selectedBalloonId=null;
    resetEditorHistory();
    render();
  }catch(error){
    try{saveCustomTemplates13(templatesBefore);registerCustomTemplates13();}catch(templateRollbackError){console.error('Backup template rollback failed.',templateRollbackError)}
    try{
      if(existingTarget)await projectStorage.save(existingTarget);
      else if(targetId!==previousProject.meta.workId)await projectStorage.remove(targetId);
      await projectStorage.saveAndActivate(previousProject,previousPageId);
    }catch(rollbackError){
      console.error('Backup restore rollback failed.',rollbackError);
    }
    project=previousProject;
    selectedPageId=previousPageId&&project.pages.some(page=>page.id===previousPageId)?previousPageId:project.pages[0]?.id||null;
    selectedPanelId=currentPage()?.panels[0]?.id||null;
    selectedCharacterId=null;
    selectedBalloonId=null;
    resetEditorHistory();
    render();
    throw error;
  }
}

globalThis.MANGA_BLUEPRINT_BACKUP_RESTORE=Object.freeze({
  manifestSchema:BACKUP_MANIFEST_SCHEMA_20,
  packageType:BACKUP_PACKAGE_TYPE_20,
  supported:()=>projectStorage.supported(),
  create:options=>buildBackupPackage20(options),
  inspect:file=>inspectBackup20(file),
  restore:(inspected,mode)=>applyRestore20(inspected,mode)
});
