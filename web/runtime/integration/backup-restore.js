// Phase 3 backup / restore first slice.
// Dedicated work backup packages are intentionally separate from AI generation/review exports.
const BACKUP_MANIFEST_SCHEMA_20='manga-blueprint-backup-manifest/1';
const BACKUP_PACKAGE_TYPE_20='work-backup';
const BACKUP_MANIFEST_PATH_20='backup-manifest.json';
const BACKUP_PROJECT_PATH_20='project.manga.json';
const BACKUP_CUSTOM_TEMPLATES_PATH_20='templates/custom-templates.json';

Object.assign(i18n.ja,{
  backupRestoreHeading:'作品バックアップ / 復元',
  backupRestoreHelp:'作品全体を復旧・移行するための専用ZIPです。AI生成ZIPとは用途が異なります。',
  backupIncludeTemplates:'自作Story Templateも含める',
  backupIncludeTemplatesHelp:'ブラウザに保存されている自作テンプレートをバックアップへ含めます。復元時は同じIDを更新し、それ以外は残します。',
  backupDownload:'作品バックアップZIPを作成',
  backupRestore:'バックアップZIPを復元',
  backupReady:'バックアップを作成しました。',
  backupRestoreReady:'バックアップを復元しました。',
  backupInvalid:'バックアップZIPを読み込めませんでした。',
  backupStorageUnavailable:'このブラウザでは作品ストレージを利用できないため復元できません。'
});
Object.assign(i18n.en,{
  backupRestoreHeading:'Work backup / restore',
  backupRestoreHelp:'A dedicated whole-work recovery/transfer ZIP. It is separate from AI generation and review packages.',
  backupIncludeTemplates:'Include custom Story Templates',
  backupIncludeTemplatesHelp:'Includes browser-local custom templates. Restore updates matching IDs and preserves unrelated existing templates.',
  backupDownload:'Create work backup ZIP',
  backupRestore:'Restore backup ZIP',
  backupReady:'Work backup created.',
  backupRestoreReady:'Backup restored.',
  backupInvalid:'Unable to read this backup ZIP.',
  backupStorageUnavailable:'Work storage is unavailable in this browser, so restore cannot continue.'
});

const backupText20=(ja,en)=>language==='en'?en:ja;
const backupDecode20=bytes=>new TextDecoder().decode(bytes);
const backupJson20=bytes=>JSON.parse(backupDecode20(bytes));
const backupShaValue20=value=>String(value||'').replace(/^sha256:/,'');

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
    if(flags&0x0008)throw new Error('ZIP data descriptors are not supported for backup restore');
    if(method!==0)throw new Error('Compressed ZIP entries are not supported for Manga Blueprint backups');
    const nameStart=offset+30;
    const dataStart=nameStart+nameLength+extraLength;
    const dataEnd=dataStart+compressedSize;
    if(dataEnd>bytes.length)throw new Error('Truncated ZIP entry');
    const name=new TextDecoder().decode(bytes.slice(nameStart,nameStart+nameLength));
    if(!name||entries.has(name))throw new Error(`Invalid or duplicate ZIP path: ${name||'(empty)'}`);
    if(compressedSize!==uncompressedSize)throw new Error(`Stored ZIP size mismatch: ${name}`);
    const data=bytes.slice(dataStart,dataEnd);
    if(crc3206(data)!==expectedCrc)throw new Error(`ZIP CRC mismatch: ${name}`);
    entries.set(name,data);
    offset=dataEnd;
  }
  if(!entries.size)throw new Error('ZIP contains no readable entries');
  return entries;
}

function backupCounts20(projectValue,customTemplates){
  return {
    pages:projectValue.pages?.length||0,
    containers:projectValue.containers?.length||0,
    baseCharacters:projectValue.characterLibrary?.length||0,
    customTemplates:Array.isArray(customTemplates)?customTemplates.length:0
  };
}

async function buildBackupPackage20({includeCustomTemplates=false}={}){
  const projectText=JSON.stringify(project,null,2);
  const customTemplates=includeCustomTemplates?loadCustomTemplates13():null;
  const templateText=includeCustomTemplates?JSON.stringify(customTemplates,null,2):null;
  const projectHash=await sha256Hex06(projectText);
  const files={
    project:{path:BACKUP_PROJECT_PATH_20,role:'canonical-project',required:true,sha256:`sha256:${projectHash}`}
  };
  if(includeCustomTemplates){
    files.customTemplates={
      path:BACKUP_CUSTOM_TEMPLATES_PATH_20,
      role:'optional-custom-story-template-library',
      required:false,
      sha256:`sha256:${await sha256Hex06(templateText)}`
    };
  }
  const manifest={
    schema:BACKUP_MANIFEST_SCHEMA_20,
    packageType:BACKUP_PACKAGE_TYPE_20,
    createdAt:new Date().toISOString(),
    projectFormat:project.format,
    workId:project.meta.workId,
    projectTitle:project.meta.title||'',
    counts:backupCounts20(project,customTemplates),
    includes:{project:true,customTemplates:includeCustomTemplates},
    files,
    restoreRule:'Validate schema, file roles, counts, hashes, and work identity before mutating local storage. Same-work restore requires explicit copy or overwrite choice.',
    separationRule:'This package is a whole-work backup, not an AI generation or review package.'
  };
  const entries=[
    {name:BACKUP_PROJECT_PATH_20,data:projectText},
    {name:BACKUP_MANIFEST_PATH_20,data:JSON.stringify(manifest,null,2)}
  ];
  if(includeCustomTemplates)entries.splice(1,0,{name:BACKUP_CUSTOM_TEMPLATES_PATH_20,data:templateText});
  return {blob:await zipStore06(entries),manifest};
}

function requireBackupFile20(entries,fileDef,label){
  if(!fileDef?.path||typeof fileDef.path!=='string')throw new Error(`Backup manifest missing ${label} path`);
  const data=entries.get(fileDef.path);
  if(!data)throw new Error(`Backup missing ${label}: ${fileDef.path}`);
  return data;
}

async function verifyBackupHash20(bytes,fileDef,label){
  const expected=backupShaValue20(fileDef?.sha256);
  if(!/^[a-f0-9]{64}$/i.test(expected))throw new Error(`Backup manifest has invalid ${label} hash`);
  const actual=await sha256Hex06(backupDecode20(bytes));
  if(actual!==expected.toLowerCase())throw new Error(`${label} SHA-256 mismatch`);
}

function verifyBackupCounts20(manifest,projectValue,customTemplates){
  const actual=backupCounts20(projectValue,customTemplates);
  for(const key of ['pages','containers','baseCharacters','customTemplates']){
    if(Number(manifest.counts?.[key]??-1)!==actual[key])throw new Error(`Backup count mismatch: ${key}`);
  }
}

async function inspectBackup20(file){
  const entries=readStoredZip20(await file.arrayBuffer());
  const manifestBytes=entries.get(BACKUP_MANIFEST_PATH_20);
  if(!manifestBytes)throw new Error('Not a Manga Blueprint work backup: backup-manifest.json is missing');
  const manifest=backupJson20(manifestBytes);
  if(manifest.schema!==BACKUP_MANIFEST_SCHEMA_20||manifest.packageType!==BACKUP_PACKAGE_TYPE_20){
    throw new Error('Unsupported backup manifest or non-backup package');
  }
  const projectBytes=requireBackupFile20(entries,manifest.files?.project,'project');
  await verifyBackupHash20(projectBytes,manifest.files.project,'project');
  const rawProject=backupJson20(projectBytes);
  if(rawProject?.format!=='manga-blueprint/0.2'||!Array.isArray(rawProject.pages)||!rawProject.pages.length){
    throw new Error('Backup project is not a supported Manga Blueprint project');
  }
  if(rawProject.meta?.workId!==manifest.workId)throw new Error('Backup work identity mismatch');
  if(rawProject.format!==manifest.projectFormat)throw new Error('Backup project format mismatch');
  const incoming=ensureProjectIdentity(rawProject);

  let customTemplates=null;
  if(manifest.includes?.customTemplates){
    const templateBytes=requireBackupFile20(entries,manifest.files?.customTemplates,'custom templates');
    await verifyBackupHash20(templateBytes,manifest.files.customTemplates,'custom templates');
    customTemplates=backupJson20(templateBytes);
    if(!Array.isArray(customTemplates))throw new Error('Custom template library must be an array');
  }
  verifyBackupCounts20(manifest,incoming,customTemplates);
  return {manifest,project:incoming,customTemplates};
}

function mergeCustomTemplates20(existing,incoming){
  const merged=new Map();
  for(const item of Array.isArray(existing)?existing:[])if(item?.id)merged.set(item.id,item);
  for(const item of Array.isArray(incoming)?incoming:[])if(item?.id)merged.set(item.id,item);
  return [...merged.values()];
}

function backupPreviewText20(inspected,hasConflict){
  const {manifest}=inspected;
  const lines=language==='en'?
    [
      'Validated Manga Blueprint work backup.',
      `Work: ${manifest.projectTitle||'(untitled)'}`,
      `Pages: ${manifest.counts.pages}`,
      `Containers: ${manifest.counts.containers}`,
      `Custom templates: ${manifest.counts.customTemplates}`,
      `Work ID: ${manifest.workId}`
    ]:
    [
      'Manga Blueprint作品バックアップを検証しました。',
      `作品: ${manifest.projectTitle||'(無題)'}`,
      `ページ: ${manifest.counts.pages}`,
      `コンテナ: ${manifest.counts.containers}`,
      `自作テンプレート: ${manifest.counts.customTemplates}`,
      `作品ID: ${manifest.workId}`
    ];
  if(hasConflict)lines.push(language==='en'?'The same Work ID already exists locally.':'同じ作品IDがローカルに存在します。');
  return lines.join('\n');
}

async function chooseRestoreMode20(inspected){
  const conflict=await projectStorage.has(inspected.project.meta.workId);
  const preview=backupPreviewText20(inspected,conflict);
  if(!conflict){
    return confirm(`${preview}\n\n${backupText20('このバックアップを復元しますか？','Restore this backup?')}`)?'restore':'cancel';
  }
  const choice=prompt(
    `${preview}\n\n${backupText20('1: 別作品として取り込む\n2: 既存作品を上書き\n3: キャンセル','1: Restore as a new work\n2: Overwrite existing work\n3: Cancel')}`,
    '1'
  );
  if(choice==='1')return'copy';
  if(choice==='2'){
    return confirm(backupText20('同じ作品IDの既存データを置き換えます。続行しますか？','This replaces the existing local work with the same Work ID. Continue?'))?'overwrite':'cancel';
  }
  return'cancel';
}

async function applyRestore20(inspected,mode){
  if(!projectStorage.supported())throw new Error('IndexedDB is unavailable');
  const previousProject=clone(project);
  const previousPageId=selectedPageId;
  const templatesBefore=loadCustomTemplates13();
  let incoming=inspected.project;
  if(mode==='copy')incoming=cloneProjectAsNewWork(incoming);
  const targetId=incoming.meta.workId;
  const existingTarget=targetId===previousProject.meta.workId?previousProject:await projectStorage.load(targetId);
  clearTimeout(queuedProjectSaveTimer);
  try{
    await projectStorage.save(incoming);
    await projectStorage.setActive(targetId);
    await projectStorage.setActivePage(targetId,incoming.pages[0]?.id||null);
    if(inspected.customTemplates){
      saveCustomTemplates13(mergeCustomTemplates20(templatesBefore,inspected.customTemplates));
      registerCustomTemplates13();
    }
    project=incoming;
    selectedPageId=project.pages[0]?.id||null;
    selectedPanelId=currentPage()?.panels[0]?.id||null;
    selectedCharacterId=null;
    selectedBalloonId=null;
    resetEditorHistory();
    render();
  }catch(error){
    try{saveCustomTemplates13(templatesBefore);registerCustomTemplates13();}catch{}
    try{
      if(existingTarget)await projectStorage.save(existingTarget);else await projectStorage.remove(targetId);
      if(await projectStorage.has(previousProject.meta.workId)){
        await projectStorage.setActive(previousProject.meta.workId);
        await projectStorage.setActivePage(previousProject.meta.workId,previousPageId||previousProject.pages[0]?.id||null);
      }
    }catch(rollbackError){console.error('Backup restore rollback failed.',rollbackError)}
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

function setBackupStatus20(message,isError=false){
  const status=$('backupRestoreStatus20');
  if(!status)return;
  status.textContent=message||'';
  status.dataset.error=isError?'true':'false';
}

async function downloadBackup20(){
  const button=$('downloadBackup20');
  if(button)button.disabled=true;
  setBackupStatus20('');
  try{
    const includeCustomTemplates=!!$('backupIncludeTemplates20')?.checked;
    const {blob}=await buildBackupPackage20({includeCustomTemplates});
    const filename=`${safeFileStem06(project.meta.title)}_${timestamp06()}_${String(project.meta.workId).slice(-8)}.manga-backup.zip`;
    downloadBlob(blob,filename);
    setBackupStatus20(t('backupReady'));
  }catch(error){
    console.error('Work backup failed.',error);
    setBackupStatus20(backupText20('バックアップの作成に失敗しました。','Failed to create work backup.'),true);
  }finally{if(button)button.disabled=false;}
}

async function restoreBackup20(file){
  if(!file)return;
  if(!projectStorage.supported()){
    alert(t('backupStorageUnavailable'));return;
  }
  setBackupStatus20('');
  try{
    const inspected=await inspectBackup20(file);
    const mode=await chooseRestoreMode20(inspected);
    if(mode==='cancel')return;
    await applyRestore20(inspected,mode);
    setBackupStatus20(t('backupRestoreReady'));
  }catch(error){
    console.error('Work backup restore failed.',error);
    setBackupStatus20(`${t('backupInvalid')} ${error?.message||''}`.trim(),true);
    alert(t('backupInvalid'));
  }
}

function installBackupRestoreUi20(){
  if($('backupRestore20'))return;
  const outputSection=document.querySelector('.tool-panel[data-section="output"]');
  if(!outputSection)return;
  const box=document.createElement('details');
  box.id='backupRestore20';
  box.className='backup-restore20';
  box.innerHTML=`
    <summary><strong data-i18n="backupRestoreHeading">作品バックアップ / 復元</strong></summary>
    <p class="help" data-i18n="backupRestoreHelp">作品全体を復旧・移行するための専用ZIPです。</p>
    <label class="backup-option20"><input id="backupIncludeTemplates20" type="checkbox" /> <span data-i18n="backupIncludeTemplates">自作Story Templateも含める</span></label>
    <p class="help" data-i18n="backupIncludeTemplatesHelp">自作テンプレートを任意で含めます。</p>
    <div class="button-grid">
      <button id="downloadBackup20" type="button" data-i18n="backupDownload">作品バックアップZIPを作成</button>
      <label class="button-like20"><span data-i18n="backupRestore">バックアップZIPを復元</span><input id="restoreBackup20" type="file" accept=".zip,application/zip" hidden /></label>
    </div>
    <p id="backupRestoreStatus20" class="help" role="status" aria-live="polite"></p>`;
  outputSection.appendChild(box);
  $('downloadBackup20').addEventListener('click',downloadBackup20);
  $('restoreBackup20').addEventListener('change',async event=>{
    const input=event.currentTarget;
    const file=input.files?.[0]||null;
    try{await restoreBackup20(file)}finally{input.value='';}
  });
  const style=document.createElement('style');
  style.id='backupRestoreStyle20';
  style.textContent=`.backup-restore20{margin-top:18px;padding:12px;border:1px solid #d8dee8;border-radius:12px;background:#f8fafc}.backup-restore20 summary{cursor:pointer}.backup-restore20[open] summary{margin-bottom:10px}.backup-option20{display:flex;align-items:center;gap:8px}.backup-option20 input{width:auto}.button-like20{display:flex;align-items:center;justify-content:center;min-height:44px;padding:8px 12px;border:1px solid #cbd5e1;border-radius:8px;background:#fff;cursor:pointer;text-align:center}.button-like20:hover{border-color:#64748b}.backup-restore20 [data-error="true"]{color:#b91c1c}`;
  document.head.appendChild(style);
  applyLanguage();
}

installBackupRestoreUi20();
