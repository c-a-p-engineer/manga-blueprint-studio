// Manga-expression pass layered over the canonical Blueprint Engine.
// AI authors semantic intent; this pass resolves it into deterministic geometry/state.
import { compileName } from './blueprint-engine.mjs';

const split = (v='') => v.split(/[,、]/).map(x=>x.trim()).filter(Boolean);

function parseSemanticPanels(text){
  const pages=[]; let page={layout:'auto',panels:[]}; let panel=null;
  const flushPage=()=>{ if(page.panels.length) pages.push(page); page={layout:'auto',panels:[]}; panel=null; };
  for(const raw of text.split(/\r?\n/)){
    const line=raw.trim(); if(!line) continue;
    if(/^#{1,3}\s*(?:page|p|ページ)\b/i.test(line)){ flushPage(); continue; }
    const ld=line.match(/^@layout\s*[:：]\s*(.+)$/i); if(ld){page.layout=ld[1].trim();continue;}
    const pm=line.match(/^(?:[-*]\s*)?(?:panel|p|コマ)\s*\d+\s*[:：-]/i);
    if(pm){ panel={shape:'rectangle',size:'auto',inset:'',pose:{},gaze:{},depth:{},support:{},motion:{},contacts:[]}; page.panels.push(panel); continue; }
    if(!panel) continue;
    const field=(names)=>line.match(new RegExp(`^(?:${names})\\s*[:：]\\s*(.+)$`,'i'))?.[1]?.trim();
    let v;
    if((v=field('shape|境界|コマ形'))) panel.shape=v;
    else if((v=field('size|コマサイズ'))) panel.size=v;
    else if((v=field('inset|インセット'))) panel.inset=v;
    else if((v=field('pose|ポーズ'))) assignMap(panel.pose,v);
    else if((v=field('gaze|視線'))) assignMap(panel.gaze,v);
    else if((v=field('depth|前後|奥行'))) assignMap(panel.depth,v);
    else if((v=field('support|支持'))) assignMap(panel.support,v);
    else if((v=field('motion|動作段階'))) assignMap(panel.motion,v);
    else if((v=field('contact|接触'))) panel.contacts.push(...split(v));
  }
  if(page.panels.length) pages.push(page);
  return pages;
}

function assignMap(target,value){
  const m=value.match(/^([^>＞]+)[>＞]\s*(.+)$/); if(m) target[m[1].trim()]=m[2].trim();
}

function quad(rect,preset){
  const {x,y,w,h}=rect, d=Math.min(w,h)*.10;
  const pts={
    'diagonal-left':[{x:x+d,y},{x:x+w,y},{x:x+w-d,y:y+h},{x,y:y+h}],
    'diagonal-right':[{x,y},{x:x+w-d,y},{x:x+w,y:y+h},{x:x+d,y:y+h}],
    'trapezoid-left':[{x:x+d,y},{x:x+w,y},{x:x+w,y:y+h},{x,y:y+h}],
    'trapezoid-right':[{x,y},{x:x+w-d,y},{x:x+w,y:y+h},{x,y:y+h}]
  };
  return {kind:'quad',preset,points:pts[preset]||[{x,y},{x:x+w,y},{x:x+w,y:y+h},{x,y:y+h}]};
}

function normalizeShape(v=''){
  if(/diagonal[- ]?left|斜め左/i.test(v)) return 'diagonal-left';
  if(/diagonal[- ]?right|斜め右|斜め/i.test(v)) return 'diagonal-right';
  if(/trapezoid[- ]?left|台形左/i.test(v)) return 'trapezoid-left';
  if(/trapezoid[- ]?right|台形右|台形/i.test(v)) return 'trapezoid-right';
  return 'rectangle';
}
function support(v=''){ return /air|空中|jump/i.test(v)?'airborne':/supported|寄りかか|支え/i.test(v)?'supported':/unknown|不明/i.test(v)?'unknown':'grounded'; }
function motion(v=''){ for(const [re,val] of [[/anticip|予備/,'anticipation'],[/approach|接近/,'approach'],[/launch|踏み切/,'launch'],[/air|空中/,'airborne'],[/impact|衝突|着地/,'impact'],[/recover|回復/,'recovery']]) if(re.test(v)) return val; return 'still'; }
function depthRank(v=''){ return /foreground|最前|手前/i.test(v)?2:/background|奥/i.test(v)?-2:/front|前/i.test(v)?1:/back|後/i.test(v)?-1:0; }

function applySizeGrammar(page,sem){
  const dominant=sem.panels.findIndex(p=>/dominant|hero|大|climax/i.test(p.size));
  if(dominant<0 || page.panels.length<2) return;
  const p=page.panels[dominant], others=page.panels.filter((_,i)=>i!==dominant);
  // Bounded deterministic emphasis: enlarge the requested panel within its existing band.
  const grow=Math.min(120,p.rect.h*.18); p.rect.y=Math.max(54,p.rect.y-grow/2); p.rect.h+=grow;
  for(const o of others){ if(o.rect.y>p.rect.y) o.rect.y+=grow*.15; }
}

export function compileMangaName(text,options={}){
  const project=compileName(text,options); const semantic=parseSemanticPanels(text);
  project.pages.forEach((page,pi)=>{
    const sp=semantic[pi]||{panels:[]}; applySizeGrammar(page,sp);
    page.panels.forEach((panel,i)=>{
      const s=sp.panels[i]||{}; const preset=normalizeShape(s.shape);
      if(preset!=='rectangle') panel.shape=quad(panel.rect,preset);
      if(s.inset){
        const m=s.inset.match(/(?:parent|親)?\s*(?:panel|p|コマ)?\s*(\d+)/i); const parentIndex=m?Number(m[1])-1:Math.max(0,i-1);
        const parent=page.panels[parentIndex]; if(parent && parent!==panel){
          const anchor=/top-left|左上/i.test(s.inset)?'top-left':/bottom-left|左下/i.test(s.inset)?'bottom-left':/bottom-right|右下/i.test(s.inset)?'bottom-right':/center|中央/i.test(s.inset)?'center':'top-right';
          const size=/large|大/i.test(s.inset)?'large':/small|小/i.test(s.inset)?'small':'medium';
          panel.inset={kind:'panel-in-panel',parentPanelId:parent.id,anchor,size}; panel.style.border='inset';
          const ratio=size==='small'?.28:size==='large'?.52:.40, iw=parent.rect.w*ratio, ih=parent.rect.h*ratio;
          const left=/left/.test(anchor), bottom=/bottom/.test(anchor);
          panel.rect={x:left?parent.rect.x+18:parent.rect.x+parent.rect.w-iw-18,y:bottom?parent.rect.y+parent.rect.h-ih-18:parent.rect.y+18,w:iw,h:ih};
          if(anchor==='center'){panel.rect.x=parent.rect.x+(parent.rect.w-iw)/2;panel.rect.y=parent.rect.y+(parent.rect.h-ih)/2;}
          if(panel.shape) panel.shape=quad(panel.rect,preset);
        }
      }
      panel.characters.forEach(c=>{
        c.poseId=s.pose?.[c.name]||c.poseId;
        c.gaze.target=s.gaze?.[c.name]||c.gaze.target;
        c.supportState=support(s.support?.[c.name]||'');
        c.motionPhase=motion(s.motion?.[c.name]||'');
        c.depthOrder=depthRank(s.depth?.[c.name]||'');
      });
      panel.characters.sort((a,b)=>(a.depthOrder||0)-(b.depthOrder||0));
      panel.interactions=(s.contacts||[]).map(raw=>{
        const m=raw.match(/^([\w.-]+)\.([\w-]+)\s*[>＞]\s*([\w.-]+)\.([\w-]+)$/);
        return m?{type:'contact',source:{character:m[1],part:m[2]},target:{character:m[3],part:m[4]},intent:raw}:{type:'contact',intent:raw};
      });
    });
  });
  project.meta.compiler={name:'manga-expression-grammar',version:1,source:'AI Name DSL'};
  return project;
}

export { parseSemanticPanels };
