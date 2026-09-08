// Prototype 0.10: panel order is derived from current geometry + selected reading direction on every committed render.
// This keeps canvas numbers, Panel Peek/List, prompt, manifest, and export semantics on one order source.
function readingOrderedPanels16(page=currentPage()){
  const panels=[...(page?.panels||[])];
  if(panels.length<2)return panels;
  const {h:pageH}=pageSize04();
  const tolerance=Math.max(36,Math.min(96,pageH*.045));
  const byTop=panels.sort((a,b)=>a.rect.y-b.rect.y||a.rect.x-b.rect.x);
  const rows=[];
  for(const panel of byTop){
    let row=rows.find(r=>Math.abs(panel.rect.y-r.anchorY)<=tolerance);
    if(!row){row={anchorY:panel.rect.y,panels:[]};rows.push(row);}
    row.panels.push(panel);
    row.anchorY=row.panels.reduce((sum,p)=>sum+p.rect.y,0)/row.panels.length;
  }
  rows.sort((a,b)=>a.anchorY-b.anchorY);
  const rtl=(project.meta.readingDirection||'rtl')==='rtl';
  return rows.flatMap(row=>row.panels.sort((a,b)=>rtl?b.rect.x-a.rect.x:a.rect.x-b.rect.x));
}

renumberPanels=function(){
  readingOrderedPanels16().forEach((panel,index)=>{panel.order=index+1;});
};

function panelOrderMatchesReading16(){
  return readingOrderedPanels16().every((panel,index)=>panel.order===index+1);
}

const renderBase16=render;
render=function(){
  // Order is semantic output, so synchronize it before any derived UI/prompt/save renders.
  renumberPanels();
  return renderBase16();
};

// Normalize the already-loaded project immediately. Subsequent template/split/Smart Manga applies all end in render().
renumberPanels();
render();
