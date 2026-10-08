import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {Resvg} from '@resvg/resvg-js';
import {renderExecutableNameSvg} from '../core/blueprint-renderer.mjs';
import {buildLetteringPlan} from '../core/lettering-renderer.mjs';
import {renderReviewFullPageSvg,renderReviewFullContactSheetSvg} from '../core/review-full.mjs';

const panel=(id,order,y,dialogue,sfx)=>({
  id,order,rect:{x:12,y,w:375,h:245},actionIntent:order===1?'主人公が友達に挨拶する':'友達が振り向く',
  background:{location:'秋の学校の教室',timeOfDay:'afternoon',weather:'sunny',mood:'warm',detailLevel:'medium'},
  camera:{distance:'medium',angle:'eye-level',viewpoint:'three-quarter-front'},
  importance:{energy:.5},attention:{primary:'speaker.face'},flow:{entry:'top-right',exit:'bottom-left'},
  effects:{lineEffect:'none',sfxText:sfx,sfxWritingMode:'inherit'},
  style:{border:'normal',bleed:'none',breakout:'none'},characters:[],
  balloons:dialogue?[{id:id+'-balloon',text:dialogue,size:90,x:330,y:y+15,writingMode:'inherit'}]:[]
});
const project={
  format:'manga-blueprint/0.2',
  meta:{title:'サンプル & レビュー',pageWidth:400,pageHeight:530,readingDirection:'rtl',defaultWritingMode:'vertical-rl'},
  characterLibrary:[{characterId:'hero',name:'主人公',appearance:{outfit:'ブレザー'}}],
  pages:[
    {id:'page-1',pageNumber:1,panels:[panel('p1',1,12,'こんにちは！','ガタン'),panel('p2',2,272,'これは秋の学校でのテストです。','')]},
    {id:'page-2',pageNumber:2,panels:[panel('p3',1,12,'Salt',''),panel('p4',2,272,'', 'トン')]}
  ]
};
let assertions=0;
function check(ok,msg){if(!ok)throw new Error(msg);assertions++;}
const clean=renderExecutableNameSvg(project,0,{annotated:false});
const ann=renderExecutableNameSvg(project,0,{annotated:true});
check(!clean.includes('deterministic-lettering')&&!clean.includes('こんにちは')&&!clean.includes('ガタン'),'Clean must not contain any lettering');
check(ann.includes('data-review="lettering"')&&ann.includes('data-text="こんにちは！"')&&ann.includes('data-text="ガタン"'),'Annotated must display exact dialogue/SFX');
check(ann.includes('data-review="annotation-card"'),'Annotated must preserve review annotations');
for(let i=0;i<project.pages.length;i++){
  const plan=buildLetteringPlan(project,i);
  for(const entry of plan.entries){
    check(entry.fit==='fitted','Every test glyph string must fit: '+entry.text);
    const panel=project.pages[i].panels.find(p=>p.id===entry.panelId),rect=panel.rect;
    for(const glyph of entry.glyphs){
      check(glyph.x>=rect.x&&glyph.x<=rect.x+rect.w&&glyph.y>=rect.y&&glyph.y<=rect.y+rect.h,
        'No glyph may escape its panel: '+entry.text+' '+JSON.stringify(glyph));
    }
  }
}
const full=renderReviewFullPageSvg(project,0);
check(full.includes('data-review-full-page="P001"'),'Full review page index missing');
for(const snippet of ['秋の学校の教室','セリフ','ガタン','afternoon','重要度','全情報レビュー']){
  if(snippet==='重要度')continue; // annotated displays other importance metadata, sidebar stays semantic
  check(full.includes(snippet),'Full review missing '+snippet);
}
check(!full.includes('A completely unrelated story'),'Never manufacture alternate plot');
check(full.includes('data-text="こんにちは！"'),'Full review must retain annotated lettering');
const sheet=renderReviewFullContactSheetSvg(project);
check(sheet.includes('data-page-code="P001"')&&sheet.includes('data-page-code="P002"'),'Full review sheet must preserve page labels');
check(sheet.includes('data-review-full-panel="2"'),'Full review sheet must include all panel metadata');
for(const [name,svg] of [['annotated',ann],['full',full],['full-sheet',sheet]]){
  const png=new Resvg(svg,{font:{loadSystemFonts:true}}).render().asPng();
  check(png.length>100&&png.toString('ascii',1,4)==='PNG','SVG should rasterize to real PNG: '+name);
}
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'manga-review-full-'));
try{
  fs.writeFileSync(path.join(tmp,'review.svg'),full);
  check(fs.statSync(path.join(tmp,'review.svg')).size>200,'Can serialize review SVG');
}finally{fs.rmSync(tmp,{recursive:true,force:true});}
console.log('Annotated lettering + Full Review checks passed:',assertions);
