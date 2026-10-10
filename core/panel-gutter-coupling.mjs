// Optional post-layout boundary coupling. Base Recipe rectangles remain the semantic layout;
// only the two facing polygon edges are moved when an explicit paired request can be met.
export function normalizeBoundaryCoupling(value=''){
  const mode=String(value).trim().toLowerCase();
  if(!mode||/^(independent|独立|なし|none)$/.test(mode))return'independent';
  if(/^(paired|連動|隣接連動|等間隔|keep-gutter)$/.test(mode))return'paired';
  throw new Error('Unsupported 境界連動 / boundary coupling: '+value+' (supported: independent, paired)');
}
const near=(a,b)=>Math.abs(a-b)<=1;
const plain=(shape)=>!shape||shape.preset==='rectangle';
const isInside=(p,width,height)=>p.x>=0&&p.y>=0&&p.x<=width&&p.y<=height;

export function applyPanelGutterCoupling(page,semanticPanels=[]){
  const panels=page.panels||[],decisions=[],claimed=new Set(),width=Number(page?.pageWidth)||Number(page?.width)||1200,height=Number(page?.pageHeight)||Number(page?.height)||1697;
  for(let i=0;i<panels.length;i++){
    const mode=normalizeBoundaryCoupling(semanticPanels[i]?.boundaryCoupling);
    if(mode!=='paired')continue;
    const panel=panels[i],s=semanticPanels[i]||{},base={panel:i+1,mode,status:'unresolved'};
    if(!panel.shape?.points||panel.shape.points.length!==4||s.inset||s.layoutLock){
      decisions.push({...base,reason:'unsupported-source-shape-or-lock'});continue;
    }
    const pts=panel.shape.points,r=panel.rect,options=[
      {side:'right',edge:[1,2],neighborEdge:[0,3],anchor:r.x+r.w},
      {side:'left',edge:[0,3],neighborEdge:[1,2],anchor:r.x}
    ].filter(e=>Math.abs(pts[e.edge[0]].x-pts[e.edge[1]].x)>1);
    let pair=null;
    for(const edge of options){
      for(let j=0;j<panels.length;j++){
        if(j===i||claimed.has(j)||normalizeBoundaryCoupling(semanticPanels[j]?.boundaryCoupling)==='paired')continue;
        const other=panels[j],otherSem=semanticPanels[j]||{},o=other.rect;
        if(!o||otherSem.layoutLock||otherSem.inset||!plain(other.shape)||otherSem.bleed||otherSem.breakout)continue;
        if(!near(r.y,o.y)||!near(r.h,o.h))continue; // paired horizontal siblings only
        const gap=edge.side==='right'?o.x-(r.x+r.w):r.x-(o.x+o.w);
        if(gap<2||gap>Math.max(48,Math.min(r.w,o.w)*.24))continue;
        const leftTop=pts[edge.edge[0]].x+(edge.side==='right'?gap:-gap);
        const leftBottom=pts[edge.edge[1]].x+(edge.side==='right'?gap:-gap);
        const np=edge.side==='right'
          ?[{x:leftTop,y:o.y},{x:o.x+o.w,y:o.y},{x:o.x+o.w,y:o.y+o.h},{x:leftBottom,y:o.y+o.h}]
          :[{x:o.x,y:o.y},{x:leftTop,y:o.y},{x:leftBottom,y:o.y+o.h},{x:o.x,y:o.y+o.h}];
        const topWidth=np[1].x-np[0].x,bottomWidth=np[2].x-np[3].x;
        if(Math.min(topWidth,bottomWidth)<o.w*.35||!np.every(p=>isInside(p,width,height)))continue;
        const candidate={neighbor:j,edge,gap,points:np};
        if(!pair||candidate.gap<pair.gap||candidate.gap===pair.gap&&j<pair.neighbor)pair=candidate;
      }
    }
    if(!pair){decisions.push({...base,reason:'no-safe-unlocked-aligned-sibling'});continue;}
    const target=panels[pair.neighbor];
    target.shape={kind:'quad',preset:'custom',points:pair.points};
    target.frameCoupling={mode:'paired-neighbor',sourcePanelId:panel.id,side:pair.edge.side==='right'?'left':'right',gutter:pair.gap};
    panel.frameCoupling={mode:'paired',neighborPanelId:target.id,side:pair.edge.side,gutter:pair.gap};
    claimed.add(pair.neighbor);claimed.add(i);
    decisions.push({...base,status:'applied',neighbor:pair.neighbor+1,side:pair.edge.side,gutter:pair.gap});
  }
  if(decisions.length){
    page.layoutDecision??={};
    page.layoutDecision.gutterCoupling={version:1,policy:'explicit-only',requests:decisions};
  }
  return decisions;
}
