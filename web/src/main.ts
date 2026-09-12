import {loadLegacyRuntime,type BuildInfo} from './legacy-runtime';
import {installPhaseOneUi} from './phase-one-ui';

const fallbackBuildInfo:BuildInfo={
  schema:'manga-blueprint-build-info/1',
  appVersion:'0.18.0',
  gitCommit:null,
  buildSource:'vite-fallback',
  deployedAt:null
};

type RuntimeGlobals=typeof globalThis&{
  MANGA_BLUEPRINT_BUILD_INFO?:Readonly<BuildInfo>;
  initializeEditorState?:()=>Promise<void>;
};

const runtime=globalThis as RuntimeGlobals;

async function loadBuildInfo():Promise<BuildInfo>{
  try{
    const response=await fetch(`${import.meta.env.BASE_URL}build-info.json`,{cache:'no-store'});
    if(!response.ok)throw new Error(`HTTP ${response.status}`);
    const loaded=await response.json() as Partial<BuildInfo>;
    return {...fallbackBuildInfo,...loaded};
  }catch(error){
    console.warn('Build provenance unavailable; using Vite fallback.',error);
    return fallbackBuildInfo;
  }
}

async function bootstrap(){
  const buildInfo=Object.freeze(await loadBuildInfo());
  runtime.MANGA_BLUEPRINT_BUILD_INFO=buildInfo;
  await loadLegacyRuntime(buildInfo);
  if(typeof runtime.initializeEditorState!=='function')throw new Error('Editor runtime did not expose initializeEditorState.');
  await runtime.initializeEditorState();
  installPhaseOneUi();
  document.documentElement.dataset.appVersion=buildInfo.appVersion;
}

void bootstrap().catch(error=>{
  console.error('Manga Blueprint Studio failed to start.',error);
  const message=document.createElement('div');
  message.className='phase1-startup-error';
  message.setAttribute('role','alert');
  message.textContent='Manga Blueprint Studio の起動に失敗しました。ページを再読み込みしてください。';
  document.body.prepend(message);
});
