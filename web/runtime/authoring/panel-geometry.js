// Prototype 0.16.0: convex-quadrilateral panel geometry, direct corner editing,
// and irregular layout presets. Rectangle-only projects remain compatible.

Object.assign(i18n.ja,{
  panelShapeHeading33:'コマ形状',
  panelShapePreset33:'形状プリセット',
  panelShapeRectangle33:'長方形',
  panelShapeDiagonalLeft33:'斜め（左へ流す）',
  panelShapeDiagonalRight33:'斜め（右へ流す）',
  panelShapeTrapezoidLeft33:'台形（左を絞る）',
  panelShapeTrapezoidRight33:'台形（右を絞る）',
  panelShapeCustom33:'カスタム四角形',
  panelShapeEdit33:'四隅を直接編集',
  panelShapeEditDone33:'四隅編集を終了',
  panelShapeHelp33:'選択中のコマを凸四角形として編集できます。青い丸をドラッグしてください。変形中は断ち切りを使えません。',
  panelShapeInvalid33:'その位置ではコマが交差・極小化するため移動できません。'
});
Object.assign(i18n.en,{
  panelShapeHeading33:'Panel shape',
  panelShapePreset33:'Shape preset',
  panelShapeRectangle33:'Rectangle',
  panelShapeDiagonalLeft33:'Diagonal — lean left',
  panelShapeDiagonalRight33:'Diagonal — lean right',
  panelShapeTrapezoidLeft33:'Trapezoid — narrow left',
  panelShapeTrapezoidRight33:'Trapezoid — narrow right',
  panelShapeCustom33:'Custom quadrilateral',
  panelShapeEdit33:'Edit four corners',
  panelShapeEditDone33:'Finish corner editing',
  panelShapeHelp33:'Edit the selected panel as a convex quadrilateral. Drag the blue handles. Bleed is disabled while a custom shape is active.',
  panelShapeInvalid33:'That move would create an intersecting or unusably small panel.'
});

const panelShapePresetIds33=['rectangle','diagonal-left','diagonal-right','trapezoid-left','trapezoid-right','custom'];
const irregularLayoutIds33=new Set(['diagonal3','diagonal4']);
let panelShapeEditMode33=false;
let panelShapeDrag33=null;
let panelShapeNoticeTimer33=null;

Object.assign(layoutPresets04,{
  diagonal3:{ja:'斜め3コマ',en:'Diagonal 3-panel',helpJa:'上2コマ＋下大ゴマを斜め枠でつなぐ、動きのある3コマ。',helpEn:'Two setup panels plus a large payoff using slanted quadrilateral frames.'},
  diagonal4:{ja:'斜め4コマ 2×2',en:'Diagonal 4-panel',helpJa:'2×2を交互の斜め枠にしたテンポ重視の4コマ。',helpEn:'A 2×2 layout with alternating slanted frames for stronger rhythm.'}
});

function rectPoints33(rect){
  return [
    {x:Number(rect.x),y:Number(rect.y)},
    {x:Number(rect.x)+Number(rect.w),y:Number(rect.y)},
    {x:Number(rect.x)+Number(rect.w),y:Number(rect.y)+Number(rect.h)},
    {x:Number(rect.x),y:Number(rect.y)+Number(rect.h)}
  ];
}
function clonePoints33(points){return points.map(point=>({x:Number(point.x),y:Number(point.y)}));}
function panelShapePoints33(panel){
  const points=panel?.shape?.kind==='quad'&&Array.isArray(panel.shape.points)&&panel.shape.points.length===4?panel.shape.points:null;
  return points&&points.every(point=>Number.isFinite(Number(point.x))&&Number.isFinite(Number(point.y)))?clonePoints33(points):rectPoints33(panel.rect);
}
function panelShapeBBox33(points){
  const xs=points.map(point=>Number(point.x)),ys=points.map(point=>Number(point.y));
  const x=Math.min(...xs),y=Math.min(...ys),right=Math.max(...xs),bottom=Math.max(...ys);
  return{x,y,w:right-x,h:bottom-y};
}
function polygonArea33(points){
  return Math.abs(points.reduce((sum,point,index)=>{const next=points[(index+1)%points.length];return sum+point.x*next.y-next.x*point.y;},0))/2;
}
function edgeLength33(a,b){return Math.hypot(b.x-a.x,b.y-a.y);}
function isConvexQuad33(points){
  if(!Array.isArray(points)||points.length!==4)return false;
  if(points.some(point=>!Number.isFinite(Number(point.x))||!Number.isFinite(Number(point.y))))return false;
  if(polygonArea33(points)<900)return false;
  if(points.some((point,index)=>edgeLength33(point,points[(index+1)%4])<24))return false;
  const crosses=[];
  for(let i=0;i<4;i++){
    const a=points[i],b=points[(i+1)%4],c=points[(i+2)%4];
    crosses.push((b.x-a.x)*(c.y-b.y)-(b.y-a.y)*(c.x-b.x));
  }
  const nonZero=crosses.filter(value=>Math.abs(value)>1e-6);
  return nonZero.length===4&&(nonZero.every(value=>value>0)||nonZero.every(value=>value<0));
}
function normalizedQuad33(shape,rect){
  if(shape?.kind!=='quad'||!Array.isArray(shape.points)||shape.points.length!==4)return null;
  const points=clonePoints33(shape.points);
  if(!isConvexQuad33(points))return null;
  return{kind:'quad',preset:panelShapePresetIds33.includes(shape.preset)?shape.preset:'custom',points};
}
function syncPanelRectFromShape33(panel){
  if(panel?.shape?.kind!=='quad')return;
  panel.rect=panelShapeBBox33(panelShapePoints33(panel));
}
function ensureQuad33(panel){
  if(!panel)return null;
  const normalized=normalizedQuad33(panel.shape,panel.rect);
  if(normalized){panel.shape=normalized;syncPanelRectFromShape33(panel);return panel.shape;}
  panel.shape={kind:'quad',preset:'custom',points:rectPoints33(panel.rect)};
  return panel.shape;
}
function presetPoints33(rect,preset){
  const r={x:Number(rect.x),y:Number(rect.y),w:Number(rect.w),h:Number(rect.h)};
  const dx=Math.max(20,Math.min(r.w*.16,96)),dy=Math.max(20,Math.min(r.h*.12,96));
  if(preset==='diagonal-left')return[{x:r.x+dx,y:r.y},{x:r.x+r.w,y:r.y},{x:r.x+r.w-dx,y:r.y+r.h},{x:r.x,y:r.y+r.h}];
  if(preset==='diagonal-right')return[{x:r.x,y:r.y},{x:r.x+r.w-dx,y:r.y},{x:r.x+r.w,y:r.y+r.h},{x:r.x+dx,y:r.y+r.h}];
  if(preset==='trapezoid-left')return[{x:r.x+dx,y:r.y},{x:r.x+r.w,y:r.y},{x:r.x+r.w,y:r.y+r.h},{x:r.x,y:r.y+r.h}];
  if(preset==='trapezoid-right')return[{x:r.x,y:r.y},{x:r.x+r.w-dx,y:r.y},{x:r.x+r.w,y:r.y+r.h},{x:r.x,y:r.y+r.h}];
  return rectPoints33(r);
}
function setPanelShapePreset33(panel,preset){
  if(!panel)return;
  if(preset==='rectangle'){delete panel.shape;return;}
  const points=presetPoints33(panel.rect,preset);
  panel.shape={kind:'quad',preset:panelShapePresetIds33.includes(preset)?preset:'custom',points};
  panel.style.bleed='none';
  syncPanelRectFromShape33(panel);
}
function pointsAttr33(points){return points.map(point=>`${Number(point.x).toFixed(2)},${Number(point.y).toFixed(2)}`).join(' ');}

const normalizeProjectBase33=normalizeProject;
normalizeProject=function(input){
  const normalized=normalizeProjectBase33(input);
  for(const page of normalized.pages||[])for(const panel of page.panels||[]){
    const shape=normalizedQuad33(panel.shape,panel.rect);
    if(shape){panel.shape=shape;panel.style.bleed='none';syncPanelRectFromShape33(panel);}else delete panel.shape;
  }
  return normalized;
};
project=normalizeProject(project);

const panelRectBase33=panelRect;
panelRect=function(panel){
  if(panel?.shape?.kind==='quad')return panelShapeBBox33(panelShapePoints33(panel));
  return panelRectBase33(panel);
};

function layoutSpecWithShape33(rect,preset){return{rect:{...rect},shape:{kind:'quad',preset,points:presetPoints33(rect,preset)}};}
function layoutSpecs33(id,w,h){
  if(id==='diagonal3'){
    const rects=layoutRects04('action3',w,h);
    return[
      layoutSpecWithShape33(rects[0],'diagonal-right'),
      layoutSpecWithShape33(rects[1],'diagonal-left'),
      layoutSpecWithShape33(rects[2],'trapezoid-right')
    ];
  }
  if(id==='diagonal4'){
    const rects=layoutRects04('four-grid',w,h);
    return[
      layoutSpecWithShape33(rects[0],'diagonal-left'),
      layoutSpecWithShape33(rects[1],'diagonal-right'),
      layoutSpecWithShape33(rects[2],'diagonal-right'),
      layoutSpecWithShape33(rects[3],'diagonal-left')
    ];
  }
  return layoutRects04(id,w,h).map(rect=>({rect:{...rect}}));
}
function panelFromLayoutSpec33(spec,order){
  const panel=makePanel(spec.rect,order);
  if(spec.shape){panel.shape={kind:'quad',preset:spec.shape.preset||'custom',points:clonePoints33(spec.shape.points)};syncPanelRectFromShape33(panel);}
  return panel;
}
const applyLayoutBase33=applyLayout04;
applyLayout04=function(id,{ask=true}={}){
  if(!irregularLayoutIds33.has(id))return applyLayoutBase33(id,{ask});
  if(ask&&!confirmReset04())return false;
  const size=pageSize04(),specs=layoutSpecs33(id,size.w,size.h);
  mutate(()=>{
    currentPage().panels=specs.map((spec,index)=>panelFromLayoutSpec33(spec,index+1));
    project.meta.layoutPreset=id;
    selectedPanelId=currentPage().panels[0]?.id||null;
    selectedCharacterId=null;selectedBalloonId=null;
    renumberPanels();
  });
  return true;
};

applyCanvas04=function(w,h,preset='custom'){
  w=Math.round(Number(w));h=Math.round(Number(h));
  if(!Number.isFinite(w)||!Number.isFinite(h)||w<320||h<320||w>4000||h>6000){
    alert(language==='ja'?'幅320〜4000、高さ320〜6000で指定してください。':'Use width 320–4000 and height 320–6000.');
    return false;
  }
  const old=pageSize04(),sx=w/old.w,sy=h/old.h;
  mutate(()=>{
    for(const panel of currentPage().panels){
      panel.rect={x:panel.rect.x*sx,y:panel.rect.y*sy,w:panel.rect.w*sx,h:panel.rect.h*sy};
      if(panel.shape?.kind==='quad'){
        panel.shape.points=panelShapePoints33(panel).map(point=>({x:point.x*sx,y:point.y*sy}));
        syncPanelRectFromShape33(panel);
      }
      for(const character of panel.characters){character.x*=sx;character.y*=sy;character.scale*=Math.sqrt(sx*sy);}
      for(const balloon of panel.balloons){balloon.x*=sx;balloon.y*=sy;balloon.size*=Math.sqrt(sx*sy);}
    }
    project.meta.pageWidth=w;project.meta.pageHeight=h;project.meta.canvasPreset=preset;
  });
  return true;
};

function panelShapeHandleSvg33(panel){
  if(!panelShapeEditMode33||panel.id!==selectedPanelId)return'';
  const points=panelShapePoints33(panel);
  return `<g class="authoring-text panel-shape-handles33">${points.map((point,index)=>`<circle class="panel-shape-handle33" data-panel-corner33="${index}" data-panel-corner-panel33="${escapeXml(panel.id)}" cx="${point.x}" cy="${point.y}" r="14"/><text class="panel-shape-index33" x="${point.x}" y="${point.y+4}">${index+1}</text>`).join('')}</g>`;
}

renderSvg=function(annotated=true){
  const page=currentPage(),size=pageSize04();
  const defs=page.panels.map(panel=>`<clipPath id="clip_${panel.id}"><polygon points="${pointsAttr33(panelShapePoints33(panel))}"/></clipPath>`).join('');
  const body=page.panels.map(panel=>{
    const r=panelRect(panel),points=panelShapePoints33(panel),clip=panel.style.breakout==='none';
    const borderClass=`panel-outline ${panel.id===selectedPanelId?'selected':''} ${panel.style.border}`;
    const chars=panel.characters.length?panel.characters.map(character=>characterSvg(character,annotated)).join(''):(annotated?`<text class="empty-note authoring-text" x="${r.x+r.w/2}" y="${r.y+r.h/2}">tap → add character</text>`:'');
    const meta=annotated?`<g class="authoring-text"><rect class="panel-number-bg" x="${r.x+r.w-43}" y="${r.y+12}" width="30" height="30" rx="15"/><text class="panel-number" x="${r.x+r.w-28}" y="${r.y+27}">${panel.order}</text><text class="camera-label" x="${r.x+14}" y="${r.y+27}">${escapeXml(panel.camera.distance)} · ${escapeXml(panel.camera.angle)}</text><text class="role-label" x="${r.x+14}" y="${r.y+45}">${escapeXml(panel.role)}</text></g>`:'';
    const bgMeta=annotated&&panel.background.location?`<text class="effect-note authoring-text" x="${r.x+14}" y="${r.y+r.h-18}">BG: ${escapeXml(panel.background.location)}</text>`:'';
    const sfx=annotated&&panel.effects.sfxText?`<text class="effect-note authoring-text" x="${r.x+r.w-18}" y="${r.y+r.h-18}" text-anchor="end">SFX: ${escapeXml(panel.effects.sfxText)}</text>`:'';
    return `<g data-panel="${escapeXml(panel.id)}"><polygon class="${borderClass}" points="${pointsAttr33(points)}"/><polygon class="panel-hit" data-panel-hit="${escapeXml(panel.id)}" points="${pointsAttr33(points)}"/>${effectSvg(panel)}<g ${clip?`clip-path="url(#clip_${panel.id})"`:''}>${chars}</g>${panel.balloons.map(balloon=>balloonSvg(balloon,annotated)).join('')}${meta}${bgMeta}${sfx}${annotated?panelShapeHandleSvg33(panel):''}</g>`;
  }).join('');
  const overlays=annotated?page.panels.map(panel=>{const r=panelRect(panel),text=panelSummary04(panel),maxChars=Math.max(10,Math.floor((r.w-24)/8)),clipped=text.length>maxChars?`${text.slice(0,maxChars-1)}…`:text,y=r.y+r.h-36;return `<g class="authoring-text" pointer-events="none"><rect class="panel-summary-bg" x="${r.x+8}" y="${y}" width="${Math.max(80,r.w-16)}" height="28" rx="7"/><text class="panel-summary-text" x="${r.x+16}" y="${y+19}">${escapeXml(clipped)}</text></g>`;}).join(''):'';
  return `<defs>${defs}<style>.effect-line{stroke:#111827;stroke-width:3;opacity:.55;vector-effect:non-scaling-stroke}</style></defs><rect width="${size.w}" height="${size.h}" fill="#fff"/>${body}${overlays}`;
};

function ensurePanelGeometryUi33(){
  if($('panelShapeControls33'))return;
  const anchor=$('breakoutMode')?.closest('label');if(!anchor)return;
  const host=document.createElement('div');host.id='panelShapeControls33';host.innerHTML=`
    <div class="subhead" data-i18n="panelShapeHeading33">コマ形状</div>
    <label><span data-i18n="panelShapePreset33">形状プリセット</span><select id="panelShapePreset33"></select></label>
    <button id="panelShapeEdit33" type="button" class="full"></button>
    <p id="panelShapeHelp33" class="help" data-i18n="panelShapeHelp33"></p>
    <div id="panelShapeNotice33" class="status-box" hidden></div>`;
  anchor.insertAdjacentElement('afterend',host);
  $('panelShapePreset33').innerHTML=[
    ['rectangle','panelShapeRectangle33'],['diagonal-left','panelShapeDiagonalLeft33'],['diagonal-right','panelShapeDiagonalRight33'],['trapezoid-left','panelShapeTrapezoidLeft33'],['trapezoid-right','panelShapeTrapezoidRight33'],['custom','panelShapeCustom33']
  ].map(([value,key])=>`<option value="${value}" data-i18n="${key}">${t(key)}</option>`).join('');
  $('panelShapePreset33').addEventListener('change',()=>{
    const panel=selectedPanel();if(!panel)return;
    const value=$('panelShapePreset33').value;
    if(value==='custom')return;
    mutate(()=>setPanelShapePreset33(panel,value));
  });
  $('panelShapeEdit33').addEventListener('click',()=>{
    const panel=selectedPanel();if(!panel)return;
    panelShapeEditMode33=!panelShapeEditMode33;
    if(panelShapeEditMode33&&!panel.shape)mutate(()=>ensureQuad33(panel));else render();
  });
  const style=document.createElement('style');style.id='panelGeometryStyle33';style.textContent=`
    .panel-shape-handle33{fill:#fff;stroke:#2563eb;stroke-width:6;vector-effect:non-scaling-stroke;cursor:grab;touch-action:none}.panel-shape-handle33:active{cursor:grabbing}.panel-shape-index33{fill:#2563eb;font-size:11px;font-weight:900;text-anchor:middle;pointer-events:none;user-select:none}.panel-shape-handles33{filter:drop-shadow(0 2px 3px rgba(37,99,235,.18))}
    @media(max-width:760px){.panel-shape-handle33{stroke-width:8}.panel-shape-index33{font-size:13px}}
  `;document.head.appendChild(style);
}
function showPanelShapeNotice33(message){
  const notice=$('panelShapeNotice33');if(!notice)return;notice.hidden=false;notice.textContent=message;
  clearTimeout(panelShapeNoticeTimer33);panelShapeNoticeTimer33=setTimeout(()=>{notice.hidden=true;},1800);
}
function renderPanelGeometryUi33(){
  ensurePanelGeometryUi33();const panel=selectedPanel(),select=$('panelShapePreset33'),button=$('panelShapeEdit33'),bleed=$('bleedEdge');
  if(!select||!button)return;
  select.disabled=!panel;button.disabled=!panel;
  if(panel){select.value=panel.shape?.kind==='quad'?(panel.shape.preset||'custom'):'rectangle';if(!panelShapePresetIds33.includes(select.value))select.value='custom';}
  button.textContent=t(panelShapeEditMode33?'panelShapeEditDone33':'panelShapeEdit33');
  button.classList.toggle('primary',panelShapeEditMode33);
  if(bleed){bleed.disabled=!panel||panel?.shape?.kind==='quad';if(panel?.shape?.kind==='quad')bleed.title=t('panelShapeHelp33');else bleed.removeAttribute('title');}
}

const renderUiBase33=renderUi;
renderUi=function(){renderUiBase33();renderPanelGeometryUi33();};
const applyLanguageBase33=applyLanguage;
applyLanguage=function(){applyLanguageBase33();queueMicrotask(()=>{ensurePanelGeometryUi33();document.querySelectorAll('#panelShapeControls33 [data-i18n]').forEach(el=>{const key=el.dataset.i18n;el.textContent=t(key);});renderPanelGeometryUi33();});};

svg.addEventListener('pointerdown',event=>{
  const handle=event.target.closest('[data-panel-corner33]');if(!handle)return;
  event.preventDefault();event.stopPropagation();
  const panel=currentPage()?.panels.find(item=>item.id===handle.dataset.panelCornerPanel33);if(!panel)return;
  selectedPanelId=panel.id;selectedCharacterId=null;selectedBalloonId=null;
  const before=snapshot();ensureQuad33(panel);panel.shape.preset='custom';panel.style.bleed='none';
  panelShapeDrag33={panelId:panel.id,index:Number(handle.dataset.panelCorner33),before};
  svg.setPointerCapture(event.pointerId);renderCanvas();renderPanelGeometryUi33();
},{passive:false});
svg.addEventListener('pointermove',event=>{
  if(!panelShapeDrag33)return;
  event.preventDefault();
  const panel=currentPage()?.panels.find(item=>item.id===panelShapeDrag33.panelId);if(!panel)return;
  const pt=svgPoint(event),size=pageSize04(),points=panelShapePoints33(panel),next=clonePoints33(points);
  next[panelShapeDrag33.index]={x:Math.max(0,Math.min(size.w,pt.x)),y:Math.max(0,Math.min(size.h,pt.y))};
  if(!isConvexQuad33(next)){showPanelShapeNotice33(t('panelShapeInvalid33'));return;}
  panel.shape={kind:'quad',preset:'custom',points:next};syncPanelRectFromShape33(panel);renderCanvas();
},{passive:false});
function finishPanelShapeDrag33(){
  if(!panelShapeDrag33)return;
  const before=panelShapeDrag33.before;panelShapeDrag33=null;
  if(before!==snapshot()){history.push(before);if(history.length>HISTORY_LIMIT)history.shift();future=[];save();}
  render();
}
svg.addEventListener('pointerup',finishPanelShapeDrag33);svg.addEventListener('pointercancel',finishPanelShapeDrag33);

if(typeof renderBriefObject30==='function'){
  const renderBriefObjectBase33=renderBriefObject30;
  renderBriefObject30=function(){
    const brief=renderBriefObjectBase33(),ordered=[...(currentPage().panels||[])].sort((a,b)=>a.order-b.order);
    brief.panelGeometryModel='rect-or-convex-quad';
    brief.panels=brief.panels.map((item,index)=>{
      const panel=ordered[index];
      return{...item,geometry:{rect:{...panel.rect},shape:panel.shape?.kind==='quad'?{kind:'quad',points:clonePoints33(panel.shape.points)}:null}};
    });
    return brief;
  };
}

ensurePanelGeometryUi33();
render();
