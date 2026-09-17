// Scene/page-level direction planning for multi-page manga.
// Deterministic and non-mutating: derives rhythm hints from compiled panel semantics.
const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
const mean=xs=>xs.length?xs.reduce((a,b)=>a+b,0)/xs.length:0;
const trend=xs=>xs.length<2?0:xs[xs.length-1]-xs[0];

function panelEnergy(p={}){return Number(p.importance?.energy??.5);}
function pagePurpose(page={},index=0,total=1){
 const roles=page.panels?.map(p=>String(p.role||p.actionIntent||'').toLowerCase())||[];
 const joined=roles.join(' ');
 if(/reveal|正体|判明/.test(joined))return'reveal';
 if(/climax/.test(joined)||page.panels?.some(p=>panelEnergy(p)>=.9))return'climax';
 if(index===0)return'establish';
 if(index===total-1)return'resolution';
 return'progression';
}
function pageSignals(page={},index=0,total=1){
 const energies=page.panels?.map(panelEnergy)||[];
 const holds=page.panels?.map(p=>Number(p.timing?.hold??.5))||[];
 const max=Math.max(...energies,.5),avg=mean(energies),hold=mean(holds),delta=trend(energies),purpose=pagePurpose(page,index,total);
 const final=page.panels?.[page.panels.length-1];
 const hook=/reveal|疑問|途中|正体|判明/.test(String(final?.actionIntent||final?.role||'').toLowerCase())||Number(final?.importance?.energy??0)>=.85;
 return{purpose,maxEnergy:max,averageEnergy:avg,averageHold:hold,energyTrend:delta,turnHook:hook};
}
export function directScenePages(pages=[],{medium='print-page'}={}){
 const signals=pages.map((p,i)=>pageSignals(p,i,pages.length));
 const pageEnergy=signals.map(s=>clamp(s.averageEnergy*.72+s.maxEnergy*.28));
 const peak=Math.max(...pageEnergy,.5),peakIndex=pageEnergy.indexOf(peak);
 return pages.map((page,i)=>{
  const s=signals[i],prev=pageEnergy[i-1]??pageEnergy[i],next=pageEnergy[i+1]??pageEnergy[i];
  const contrast=clamp(Math.abs(pageEnergy[i]-prev)+Math.abs(next-pageEnergy[i]),0,1);
  const recommendation=[];
  if(i===peakIndex&&peak>=.72)recommendation.push('reserve-dominant-composition');
  if(s.averageHold>=.68)recommendation.push('preserve-breathing-room');
  if(s.energyTrend>=.22)recommendation.push('accelerate-toward-page-end');
  if(s.energyTrend<=-.22)recommendation.push('decelerate-toward-page-end');
  if(s.turnHook&&medium!=='vertical-scroll')recommendation.push('page-turn-reveal-candidate');
  if(s.turnHook&&medium==='vertical-scroll')recommendation.push('viewport-reveal-candidate');
  if(i===peakIndex&&pages.length>=2&&medium!=='vertical-scroll'&&peak>=.88)recommendation.push('spread-candidate');
  return{page:i+1,purpose:s.purpose,pageEnergy:pageEnergy[i],neighborContrast:contrast,turnHook:s.turnHook,recommendation};
 });
}
export function applySceneDirection(project,{medium='print-page'}={}){
 const plan=directScenePages(project.pages||[],{medium});
 project.meta.sceneDirection={version:1,medium,pages:plan};
 project.pages?.forEach((page,i)=>{page.sceneDirection=plan[i]});
 return project;
}
