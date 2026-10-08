// Full Review is a human-facing composite of the canonical page and semantic metadata.
// This output never becomes a generation-facing reference or a second semantic authority.
import {renderExecutableNameSvg} from './blueprint-renderer.mjs';
import {renderContactSheetSvg} from './contact-sheet.mjs';

const esc=v=>String(v??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const value=v=>v===undefined||v===null||String(v).trim()===''?'未指定':String(v);
const pageCode=n=>'P'+String(n).padStart(3,'0');
const cjk=ch=>/[\u3000-\u30ff\u3400-\u9fff\uff01-\uff60]/u.test(ch);
function wrap(raw,limit=73){
  const chunks=[];
  for(const rawLine of String(raw??'').split(/\r?\n/)){
    let line='',weight=0;
    for(const ch of Array.from(rawLine)){
      const units=cjk(ch)?2:1;
      if(line&&weight+units>limit){chunks.push(line);line='';weight=0;}
      line+=ch;weight+=units;
    }
    chunks.push(line);
  }
  return chunks.length?chunks:[''];
}
function list(items,format){return items?.length?items.map(format).join(' / '):'なし';}
function characterState(c,byId){
  const base=byId.get(c.characterId),a=base?.appearance||{};
  const outfit=c.continuityState?.outfit||a.outfit||'未指定';
  const condition=c.continuityState?.condition||'未指定';
  const look=[a.hair&&'髪:'+a.hair,a.eyes&&'目:'+a.eyes,a.features&&'特徴:'+a.features].filter(Boolean).join('、');
  const props=(c.renderPose?.props||[]).map(x=>x.kind||x.name).filter(Boolean).join(',');
  return (c.name||base?.name||'人物')+'〔衣装:'+outfit+' / 状態:'+condition+
    (c.expression?.type?' / 表情:'+c.expression.type:'')+
    (c.poseId?' / ポーズ:'+c.poseId:'')+
    (look?' / 外見:'+look:'')+(props?' / 小物:'+props:'')+'〕';
}
function panelMetadata(panel,byId){
  const bg=panel.background||{},camera=panel.camera||{},fx=panel.effects||{},style=panel.style||{},flow=panel.flow||{};
  const entry=(label,txt)=>label+'：'+value(txt);
  return [
    entry('出来事',panel.actionIntent),
    entry('背景',bg.location),
    entry('時間・天候', [bg.timeOfDay,bg.weather].filter(Boolean).join(' / ')),
    entry('背景の雰囲気', [bg.mood,bg.renderMode,bg.detailLevel].filter(Boolean).join(' / ')),
    entry('カメラ',[camera.distance,camera.angle,camera.viewpoint].filter(Boolean).join(' / ')),
    entry('演出',[fx.lineEffect,fx.notes,(panel.direction?.techniques||[]).join(', ')].filter(Boolean).join(' / ')),
    entry('枠・断ち切り',[style.border,style.bleed,style.breakout].filter(Boolean).join(' / ')),
    entry('注目点', [panel.attention?.primary,panel.attention?.secondary].filter(Boolean).join(' / ')),
    entry('読みの流れ', [flow.entry,flow.exit].filter(Boolean).join(' → ')),
    entry('登場人物',list(panel.characters,c=>characterState(c,byId))),
    entry('セリフ',list(panel.balloons,b=>b.text)),
    entry('効果音',fx.sfxText||'なし'),
    entry('接触・アクションの小物',list(panel.renderContacts,x=>x.source?.part&&x.target?.part?x.source.part+' ↔ '+x.target.part:value(x.label)))
  ];
}
export function renderReviewFullPageSvg(project,pageIndex=0){
  const page=project.pages?.[pageIndex];
  if(!page)throw new Error('Unknown page index '+pageIndex);
  const PW=Number(project.meta?.pageWidth)||1200,PH=Number(project.meta?.pageHeight)||1697;
  const GAP=38,M=42,SIDE=1050,TOP=110,LINE=28;
  const W=PW+SIDE+M*2+GAP;
  const byId=new Map((project.characterLibrary||[]).map(c=>[c.characterId,c]));
  const ordered=[...(page.panels||[])].sort((a,b)=>(a.order||0)-(b.order||0));
  const cards=[];
  let y=TOP;
  for(const panel of ordered){
    const fields=panelMetadata(panel,byId);
    const rows=fields.flatMap(v=>wrap(v,80));
    const CARD_H=52+rows.length*LINE+25;
    const x=M+PW+GAP,w=SIDE;
    cards.push('<g data-review-full-panel="'+esc(panel.order)+'">',
      '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+CARD_H+'" rx="13" fill="#f8fafc" stroke="#b7c5d5" stroke-width="2"/>',
      '<text x="'+(x+22)+'" y="'+(y+35)+'" font-family="sans-serif" font-size="26" font-weight="bold" fill="#1d4ed8">コマ '+esc(panel.order)+'</text>');
    let lineY=y+78;
    for(const row of rows){
      cards.push('<text x="'+(x+22)+'" y="'+lineY+'" font-family="sans-serif" font-size="21" fill="#17253e">'+esc(row)+'</text>');
      lineY+=LINE;
    }
    cards.push('</g>');
    y+=CARD_H+18;
  }
  const H=Math.ceil(Math.max(TOP+PH+M,y+M));
  const code=pageCode(page.pageNumber||pageIndex+1),title=value(project.meta?.title);
  const pageSvg=renderExecutableNameSvg(project,pageIndex,{annotated:true});
  return '<svg xmlns="http://www.w3.org/2000/svg" width="'+W+'" height="'+H+'" viewBox="0 0 '+W+' '+H+'" data-review-full-page="'+code+'">'+
    '<rect width="100%" height="100%" fill="#e8edf5"/>'+
    '<text x="'+M+'" y="60" font-size="30" font-family="sans-serif" fill="#152b45" font-weight="bold">'+esc(code)+' — '+esc(title)+'</text>'+
    '<text x="'+(M+PW+GAP)+'" y="60" font-size="26" font-family="sans-serif" font-weight="bold" fill="#1d4ed8">全情報レビュー（画像生成入力には使用しない）</text>'+
    '<rect x="'+(M-3)+'" y="'+(TOP-3)+'" width="'+(PW+6)+'" height="'+(PH+6)+'" fill="white" stroke="#405a74" stroke-width="5"/>'+
    '<svg x="'+M+'" y="'+TOP+'" width="'+PW+'" height="'+PH+'" viewBox="0 0 '+PW+' '+PH+'">'+
    pageSvg.replace(/^<svg\b[^>]*>/,'').replace(/<\/svg>\s*$/,'')+'</svg>'+
    cards.join('')+'</svg>';
}
export function renderReviewFullContactSheetSvg(project,{columns=null}={}){
  if(!project?.pages?.length)throw new Error('Full Review Contact Sheet requires pages');
  const pages=project.pages.map((_,i)=>renderReviewFullPageSvg(project,i));
  const size=pages.map(s=>{
    const match=s.match(/^<svg[^>]*width="(\d+)" height="(\d+)"/);
    if(!match)throw new Error('Invalid Full Review SVG dimensions');
    return{w:Number(match[1]),h:Number(match[2])};
  });
  return renderContactSheetSvg(pages,{
    columns,
    pageWidth:Math.max(...size.map(x=>x.w)),
    pageHeight:Math.max(...size.map(x=>x.h))
  });
}
