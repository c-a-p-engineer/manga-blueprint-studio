import './backup-restore.css';
import {EDITOR_RENDERED_EVENT,getBackupRestoreApi,type BackupInspection,type BackupRestoreMode} from '../runtime/legacy-api';
import {byId,copy} from './dom-helpers';

function previewText(inspection:BackupInspection):string{
  const {manifest}=inspection;
  const lines=[
    copy('Manga Blueprint作品バックアップを検証しました。','Validated Manga Blueprint work backup.'),
    `${copy('作品','Work')}: ${manifest.projectTitle||copy('(無題)','(untitled)')}`,
    `${copy('ページ','Pages')}: ${manifest.counts.pages}`,
    `${copy('コンテナ','Containers')}: ${manifest.counts.containers}`,
    `${copy('自作テンプレート','Custom templates')}: ${manifest.counts.customTemplates}`,
    `${copy('作品ID','Work ID')}: ${manifest.workId}`
  ];
  if(inspection.conflict)lines.push(copy('同じ作品IDがローカルに存在します。','The same Work ID already exists locally.'));
  return lines.join('\n');
}

function downloadBlob(blob:Blob,filename:string){
  const url=URL.createObjectURL(blob);
  const anchor=document.createElement('a');
  anchor.href=url;
  anchor.download=filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  queueMicrotask(()=>URL.revokeObjectURL(url));
}

function setStatus(message:string,error=false){
  const status=byId<HTMLElement>('backupRestoreStatus');
  if(!status)return;
  status.textContent=message;
  status.dataset.error=error?'true':'false';
}

function ensureRestoreDialog():HTMLDialogElement{
  let dialog=byId<HTMLDialogElement>('backupRestoreDialog');
  if(dialog)return dialog;
  dialog=document.createElement('dialog');
  dialog.id='backupRestoreDialog';
  dialog.className='backup-restore-dialog';
  dialog.innerHTML=`
    <form method="dialog">
      <h2 id="backupRestoreDialogTitle"></h2>
      <pre id="backupRestorePreview" class="backup-restore-preview"></pre>
      <fieldset>
        <legend id="backupRestoreChoiceLegend"></legend>
        <label><input type="radio" name="backupRestoreMode" value="copy" checked /> <span id="backupRestoreCopyLabel"></span></label>
        <label><input type="radio" name="backupRestoreMode" value="overwrite" /> <span id="backupRestoreOverwriteLabel"></span></label>
      </fieldset>
      <div class="backup-restore-dialog-actions">
        <button value="cancel" type="submit" id="backupRestoreCancel"></button>
        <button value="apply" type="submit" class="primary" id="backupRestoreApply"></button>
      </div>
    </form>`;
  document.body.appendChild(dialog);
  return dialog;
}

function refreshCopy(){
  const values:Record<string,[string,string]>={
    backupRestoreSummary:['作品バックアップ / 復元','Work backup / restore'],
    backupRestoreHelp:['作品全体を復旧・移行する専用ZIPです。AI生成ZIP・確認用ZIPとは別物です。','A dedicated whole-work recovery/transfer ZIP. It is separate from AI generation and review packages.'],
    backupIncludeTemplatesLabel:['自作Story Templateも含める','Include custom Story Templates'],
    backupIncludeTemplatesHelp:['含めた場合、復元時は同じIDの自作テンプレートを更新し、それ以外のローカルテンプレートは残します。','When included, restore updates matching template IDs and preserves unrelated local templates.'],
    createWorkBackup:['作品バックアップZIPを作成','Create work backup ZIP'],
    chooseWorkBackup:['バックアップZIPを復元','Restore backup ZIP'],
    backupRestoreDialogTitle:['作品バックアップを復元','Restore work backup'],
    backupRestoreChoiceLegend:['同じ作品IDがあります。復元方法を選んでください。','The same Work ID exists. Choose how to restore it.'],
    backupRestoreCopyLabel:['別作品として取り込む（IDを再生成）','Restore as a new work (regenerate IDs)'],
    backupRestoreOverwriteLabel:['既存作品を上書き','Overwrite the existing work'],
    backupRestoreCancel:['キャンセル','Cancel'],
    backupRestoreApply:['復元する','Restore']
  };
  for(const [id,[ja,en]] of Object.entries(values)){
    const node=byId<HTMLElement>(id);
    if(node)node.textContent=copy(ja,en);
  }
}

function ensureUi(){
  if(byId('backupRestore')){refreshCopy();return;}
  const outputSection=document.querySelector<HTMLElement>('.tool-panel[data-section="output"]');
  if(!outputSection)return;
  const box=document.createElement('details');
  box.id='backupRestore';
  box.className='backup-restore';
  box.innerHTML=`
    <summary><strong id="backupRestoreSummary"></strong></summary>
    <p id="backupRestoreHelp" class="help"></p>
    <label class="backup-restore-option"><input id="backupIncludeTemplates" type="checkbox" /> <span id="backupIncludeTemplatesLabel"></span></label>
    <p id="backupIncludeTemplatesHelp" class="help"></p>
    <div class="button-grid">
      <button id="createWorkBackup" type="button"></button>
      <label class="backup-restore-file-button"><span id="chooseWorkBackup"></span><input id="restoreWorkBackup" type="file" accept=".zip,application/zip" hidden /></label>
    </div>
    <p id="backupRestoreStatus" class="help" role="status" aria-live="polite"></p>`;
  outputSection.appendChild(box);
  refreshCopy();

  byId<HTMLButtonElement>('createWorkBackup')?.addEventListener('click',async()=>{
    const button=byId<HTMLButtonElement>('createWorkBackup');
    if(button)button.disabled=true;
    setStatus('');
    try{
      const api=getBackupRestoreApi();
      const includeCustomTemplates=byId<HTMLInputElement>('backupIncludeTemplates')?.checked===true;
      const result=await api.create({includeCustomTemplates});
      downloadBlob(result.blob,result.filename);
      setStatus(copy('作品バックアップを作成しました。','Work backup created.'));
    }catch(error){
      console.error('Work backup failed.',error);
      setStatus(copy('バックアップの作成に失敗しました。','Failed to create work backup.'),true);
    }finally{
      if(button)button.disabled=false;
    }
  });

  byId<HTMLInputElement>('restoreWorkBackup')?.addEventListener('change',async event=>{
    const input=event.currentTarget as HTMLInputElement;
    const file=input.files?.[0]||null;
    if(!file)return;
    setStatus('');
    try{
      const api=getBackupRestoreApi();
      if(!api.supported())throw new Error(copy('このブラウザでは作品ストレージを利用できません。','Work storage is unavailable in this browser.'));
      const inspection=await api.inspect(file);
      const mode=await chooseRestoreMode(inspection);
      if(!mode)return;
      await api.restore(inspection,mode);
      setStatus(copy('バックアップを復元しました。','Backup restored.'));
    }catch(error){
      console.error('Work backup restore failed.',error);
      const detail=error instanceof Error?error.message:String(error);
      setStatus(`${copy('バックアップを復元できませんでした。','Unable to restore this backup.')} ${detail}`.trim(),true);
    }finally{
      input.value='';
    }
  });
}

async function chooseRestoreMode(inspection:BackupInspection):Promise<BackupRestoreMode|null>{
  const preview=previewText(inspection);
  if(!inspection.conflict){
    return confirm(`${preview}\n\n${copy('このバックアップを復元しますか？','Restore this backup?')}`)?'restore':null;
  }

  const dialog=ensureRestoreDialog();
  refreshCopy();
  const previewNode=byId<HTMLElement>('backupRestorePreview');
  if(previewNode)previewNode.textContent=preview;
  const copyRadio=dialog.querySelector<HTMLInputElement>('input[value="copy"]');
  if(copyRadio)copyRadio.checked=true;

  const decision=await new Promise<BackupRestoreMode|null>(resolve=>{
    const onClose=()=>{
      dialog.removeEventListener('close',onClose);
      if(dialog.returnValue!=='apply'){resolve(null);return;}
      const selected=dialog.querySelector<HTMLInputElement>('input[name="backupRestoreMode"]:checked')?.value;
      resolve(selected==='overwrite'?'overwrite':'copy');
    };
    dialog.addEventListener('close',onClose);
    dialog.showModal();
  });
  if(decision!=='overwrite')return decision;
  return confirm(copy('同じ作品IDの既存データを置き換えます。続行しますか？','This replaces the existing local work with the same Work ID. Continue?'))?'overwrite':null;
}

export function installBackupRestoreUi(){
  ensureUi();
  ensureRestoreDialog();
  refreshCopy();
  document.addEventListener(EDITOR_RENDERED_EVENT,()=>queueMicrotask(ensureUi));
  byId('languageSelect')?.addEventListener('change',()=>queueMicrotask(refreshCopy));
}
