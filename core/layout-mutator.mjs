// Deterministic helpers for layout recipe variation. Geometry validity stays with recipe builders.
export function normalizeLayoutSeed(value=0){
  if(Number.isFinite(Number(value)))return (Number(value)>>>0);
  const text=String(value||'0');let h=2166136261;
  for(let i=0;i<text.length;i++){h^=text.charCodeAt(i);h=Math.imul(h,16777619);}
  return h>>>0;
}
export function createLayoutRandom(seed=0){
  let state=normalizeLayoutSeed(seed)||0x6d2b79f5;
  return()=>{state+=0x6d2b79f5;let t=state;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};
}
export const clampLayout=(n,a,b)=>Math.max(a,Math.min(b,n));
export function varyRatio(base,rng,strength=0,{min=.22,max=.78,span=.20}={}){
  const s=clampLayout(Number(strength)||0,0,1);
  return clampLayout(base+(rng()-.5)*2*span*s,min,max);
}
export function varyWeights(weights,rng,strength=0,{min=.35,span=.26}={}){
  const s=clampLayout(Number(strength)||0,0,1);
  return weights.map(value=>Math.max(min,Number(value)*(1+(rng()-.5)*2*span*s)));
}
