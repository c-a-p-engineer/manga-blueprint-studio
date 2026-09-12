import runtimeManifest from '../runtime/manifest.json';

export type BuildInfo={
  schema:string;
  appVersion:string;
  gitCommit:string|null;
  buildSource:string;
  deployedAt:string|null;
};

export const LEGACY_RUNTIME_CHUNKS=Object.freeze(
  runtimeManifest.map(({id,path})=>Object.freeze([id,path] as const))
);

function runtimeCacheKey(info:BuildInfo){
  const revision=info.gitCommit?.slice(0,12)||'local';
  return `${info.appVersion}-${revision}`;
}

export async function loadLegacyRuntime(info:BuildInfo){
  const base=import.meta.env.BASE_URL;
  const version=encodeURIComponent(runtimeCacheKey(info));
  for(const [id,path] of LEGACY_RUNTIME_CHUNKS){
    await new Promise<void>((resolve,reject)=>{
      const script=document.createElement('script');
      script.src=`${base}${path}?v=${version}`;
      script.dataset.runtimeChunk=id;
      script.onload=()=>resolve();
      script.onerror=()=>reject(new Error(`Failed to load runtime chunk ${id}: ${path}`));
      document.head.appendChild(script);
    });
  }
}
