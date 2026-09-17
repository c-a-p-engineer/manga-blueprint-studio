// Candidate-based manga layout solver.
// Generates deterministic alternatives and scores them against panel energy, reading flow and explicit hints.
const PAGE_W=1200, PAGE_H=1697, M=54, G=24;
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const area=r=>r.w*r.h;
const normArea=r=>area(r)/((PAGE_W-M*2)*(PAGE_H-M*2));

function grid(count){
  const x=M,y=M,w=PAGE_W-M*2,h=PAGE_H-M*2, rows=Math.ceil(count/2), cw=(w-G)/2, ch=(h-G*(rows-1))/rows;
  return Array.from({length:count},(_,i)=>{const row=Math.floor(i/2), right=i%2===0;return{x:right?x+cw+G:x,y:y+row*(ch+G),w:cw,h:ch};});
}
function vertical(count){const x=M,y=M,w=PAGE_W-M*2,h=PAGE_H-M*2,ch=(h-G*(count-1))/count;return Array.from({length:count},(_,i)=>({x,y:y+i*(ch+G),w,h:ch}));}
function heroBottom(count,hero){
  if(count<2)return grid(count); const x=M,y=M,w=PAGE_W-M*2,h=PAGE_H-M*2; const heroH=h*.48, topH=h-heroH-G;
  const others=Array.from({length:count-1},(_,i)=>i).map((_,i)=>({x:x+(i%2?0:w/2+G/2),y:y+Math.floor(i/2)*(topH/Math.ceil((count-1)/2)),w:w/2-G/2,h:topH/Math.ceil((count-1)/2)-G/2}));
  const heroRect={x,y:y+h-heroH,w,h:heroH}; const out=[]; let oi=0; for(let i=0;i<count;i++) out.push(i===hero?heroRect:others[oi++]); return out;
}
function heroTop(count,hero){
  if(count<2)return grid(count); const x=M,y=M,w=PAGE_W-M*2,h=PAGE_H-M*2; const heroH=h*.46,bottomH=h-heroH-G;
  const others=Array.from({length:count-1},(_,i)=>({x:x+(i%2?0:w/2+G/2),y:y+heroH+G+Math.floor(i/2)*(bottomH/Math.ceil((count-1)/2)),w:w/2-G/2,h:bottomH/Math.ceil((count-1)/2)-G/2}));
  const heroRect={x,y,w,h:heroH}; const out=[];let oi=0;for(let i=0;i<count;i++)out.push(i===hero?heroRect:others[oi++]);return out;
}
function actionDiagonal(count){const rs=grid(count);return rs.map((r,i)=>({...r,skew:i%2===0?'diagonal-right':'diagonal-left'}));}
function explicitHint(hint,count,hero){if(hint==='vertical')return vertical(count);if(hint==='hero-top')return heroTop(count,hero);if(hint==='hero-bottom')return heroBottom(count,hero);return null;}

function targetArea(score){return .10 + score*.22;}
function scoreCandidate(candidate, semantic, readingDirection='rtl'){
  let score=0; const energies=semantic.map(s=>s?.importance?.energy??.5); const max=Math.max(...energies,.5);
  for(let i=0;i<candidate.rects.length;i++){
    const r=candidate.rects[i], s=semantic[i]||{}, e=energies[i]??.5;
    score-=Math.abs(normArea(r)-targetArea(e))*3.0;
    if(e===max) score+=normArea(r)*2.2;
    if((s.timing?.hold??.5)>.75) score+=Math.min(r.w,r.h)/PAGE_W*.45;
    if(/dominant|hero|large|大|climax/i.test(s.size||'')) score+=normArea(r)*1.2;
    if(s.inset) score+=candidate.name==='inset-focus'?.9:0;
    if(s.flow?.entry||s.flow?.exit) score+=candidate.name==='action-diagonal'?.25:.08;
  }
  if(readingDirection==='rtl' && candidate.name==='action-diagonal') score+=.18;
  if(candidate.hintMatch) score+=1.3;
  return score;
}

export function solveLayout(semanticPanels,{hint='auto',readingDirection='rtl'}={}){
  const count=semanticPanels.length; if(!count)return {name:'empty',rects:[],score:0,candidates:[]};
  const energies=semanticPanels.map(s=>s?.importance?.energy??.5); let hero=0; for(let i=1;i<count;i++)if(energies[i]>energies[hero])hero=i;
  const candidates=[
    {name:'balanced-grid',rects:grid(count)},
    {name:'vertical-rhythm',rects:vertical(count)},
    {name:'hero-bottom',rects:heroBottom(count,hero)},
    {name:'hero-top',rects:heroTop(count,hero)},
    {name:'action-diagonal',rects:actionDiagonal(count)},
  ];
  if(semanticPanels.some(s=>s.inset)) candidates.push({name:'inset-focus',rects:heroBottom(count,hero)});
  const hinted=explicitHint(hint,count,hero); if(hinted) candidates.push({name:`hint-${hint}`,rects:hinted,hintMatch:true});
  for(const c of candidates)c.score=scoreCandidate(c,semanticPanels,readingDirection);
  candidates.sort((a,b)=>b.score-a.score || a.name.localeCompare(b.name));
  const winner=candidates[0];
  return {name:winner.name,rects:winner.rects.map(r=>({x:clamp(r.x,M,PAGE_W-M),y:clamp(r.y,M,PAGE_H-M),w:r.w,h:r.h,skew:r.skew})),score:winner.score,candidates:candidates.map(c=>({name:c.name,score:c.score}))};
}
