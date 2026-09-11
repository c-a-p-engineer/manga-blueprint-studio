// Prototype 0.16.2: panel order follows reading direction using robust visual anchors.
// Irregular panels use their actual polygon centroid instead of bounding-box top/left,
// so a single slanted corner cannot unexpectedly steal an earlier reading position.
function panelReadingGeometry16(panel){
  const shapePoints=panel?.shape?.kind==='quad'&&Array.isArray(panel.shape.points)&&panel.shape.points.length===4
    ?panel.shape.points.map(point=>({x:Number(point.x),y:Number(point.y)})).filter(point=>Number.isFinite(point.x)&&Number.isFinite(point.y))
    :null;
  const points=shapePoints?.length===4?shapePoints:null;
  if(!points){
    const rect=panel?.rect||{x:0,y:0,w:0,h:0};
    return{
      x:Number(rect.x)||0,
      y:Number(rect.y)||0,
      w:Math.max(1,Number(rect.w)||1),
      h:Math.max(1,Number(rect.h)||1),
      anchorX:(Number(rect.x)||0)+(Number(rect.w)||0)/2,
      anchorY:(Number(rect.y)||0)+(Number(rect.h)||0)/2
    };
  }

  const xs=points.map(point=>point.x),ys=points.map(point=>point.y);
  const x=Math.min(...xs),y=Math.min(...ys),right=Math.max(...xs),bottom=Math.max(...ys);
  let crossSum=0,cxSum=0,cySum=0;
  for(let index=0;index<points.length;index++){
    const current=points[index],next=points[(index+1)%points.length];
    const cross=current.x*next.y-next.x*current.y;
    crossSum+=cross;
    cxSum+=(current.x+next.x)*cross;
    cySum+=(current.y+next.y)*cross;
  }
  let anchorX,anchorY;
  if(Math.abs(crossSum)>1e-6){
    anchorX=cxSum/(3*crossSum);
    anchorY=cySum/(3*crossSum);
  }else{
    anchorX=points.reduce((sum,point)=>sum+point.x,0)/points.length;
    anchorY=points.reduce((sum,point)=>sum+point.y,0)/points.length;
  }
  return{x,y,w:Math.max(1,right-x),h:Math.max(1,bottom-y),anchorX,anchorY};
}

function readingOrderedPanels16(page=currentPage()){
  const panels=[...(page?.panels||[])];
  if(panels.length<2)return panels;
  const {h:pageH}=pageSize04();
  const baseTolerance=Math.max(34,Math.min(84,pageH*.045));
  const items=panels.map(panel=>({panel,geometry:panelReadingGeometry16(panel)}))
    .sort((a,b)=>a.geometry.anchorY-b.geometry.anchorY||a.geometry.anchorX-b.geometry.anchorX);
  const rows=[];
  for(const item of items){
    let best=null,bestDistance=Infinity;
    for(const row of rows){
      const distance=Math.abs(item.geometry.anchorY-row.anchorY);
      const adaptive=Math.max(baseTolerance,Math.min(150,Math.min(item.geometry.h,row.averageHeight)*.36));
      if(distance<=adaptive&&distance<bestDistance){best=row;bestDistance=distance;}
    }
    if(!best){
      best={anchorY:item.geometry.anchorY,averageHeight:item.geometry.h,items:[]};
      rows.push(best);
    }
    best.items.push(item);
    best.anchorY=best.items.reduce((sum,current)=>sum+current.geometry.anchorY,0)/best.items.length;
    best.averageHeight=best.items.reduce((sum,current)=>sum+current.geometry.h,0)/best.items.length;
  }
  rows.sort((a,b)=>a.anchorY-b.anchorY);
  const rtl=(project.meta.readingDirection||'rtl')==='rtl';
  return rows.flatMap(row=>row.items
    .sort((a,b)=>rtl?b.geometry.anchorX-a.geometry.anchorX:a.geometry.anchorX-b.geometry.anchorX)
    .map(item=>item.panel));
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