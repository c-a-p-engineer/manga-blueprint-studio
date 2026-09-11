// Prototype 0.16.2: freeform-panel editing assistance.
// This layer does not create a second geometry model. It snaps pointer input into the
// existing convex-quad authoring path, draws editor-only guides, and explains frame styles.

Object.assign(i18n.ja,{
  panelSnapHeading36:'整列補助',
  panelSnapToggle36:'吸着補正を使う',
  panelSnapHelp36:'四隅をドラッグすると、近いページ端・中央・他コマの四隅・同じコマの水平/垂直位置へ吸着します。吸着中は青い補助線を表示します。',
  panelStraighten36:'近い辺を水平・垂直に補正',
  panelStraightenDone36:'近い水平・垂直の辺を整えました。',
  frameGuideHeading36:'コマ枠の意味',
  frameGuideNormal36:'通常枠：標準の実線。ほとんどのコマはこれでOKです。',
  frameGuideBorderless36:'枠なし：境界線を描かない見せ方。余韻・回想・空間を広く見せたいとき向けです。',
  frameGuideInset36:'小窓：細めの枠で、補足・反応・細部を見せる小さなコマ向けです。',
  frameGuideImpact36:'衝撃枠：太い破線で強い瞬間を示す制作上の目印です。攻撃・驚き・決めなど、通常枠より強調したいコマ向けです。',
  frameGuideBleed36:'断ち切り：コマをページ端まで伸ばす指定です。現在は長方形コマのみ対応しています。',
  frameGuideBreakout36:'ブチ抜き：人物や前景をコマ枠の外へ飛び出させる演出です。'
});
Object.assign(i18n.en,{
  panelSnapHeading36:'Alignment assist',
  panelSnapToggle36:'Enable snapping',
  panelSnapHelp36:'While dragging a corner, snap to nearby page edges/center, other panel corners, and horizontal/vertical coordinates. Blue guides show active snaps.',
  panelStraighten36:'Straighten near-horizontal / vertical edges',
  panelStraightenDone36:'Straightened nearby horizontal / vertical edges.',
  frameGuideHeading36:'Frame style meaning',
  frameGuideNormal36:'Normal: standard solid frame for most panels.',
  frameGuideBorderless36:'Borderless: no visible border; useful for atmosphere, memory, or open space.',
  frameGuideInset36:'Inset: a lighter/thinner frame for small reaction, detail, or supplemental panels.',
  frameGuideImpact36:'Impact: thick dashed authoring frame for a strongly emphasized beat such as a strike, shock, or decisive moment.',
  frameGuideBleed36:'Bleed: extend a panel to the page edge. Currently supported for rectangular panels only.',
  frameGuideBreakout36:'Breakout: let a character or foreground element extend beyond the panel boundary.'
});

let panelSnapEnabled36=true;
let panelSnapGuide36={x:null,y:null};
const panelSnapThreshold36=14;

function panelAssistPoints36(panel){
  if(typeof panelShapePoints33==='function')return panelShapePoints33(panel);
  const rect=panel.rect;
  return[{x:rect.x,y:rect.y},{x:rect.x+rect.w,y:rect.y},{x:rect.x+rect.w,y:rect.y+rect.h},{x:rect.x,y:rect.y+rect.h}];
}
function nearestSnap36(value,candidates){
  let best=null,distance=Infinity;
  for(const candidate of candidates){
    const current=Math.abs(value-candidate);
    if(current<distance){distance=current;best=candidate;}
  }
  return distance<=panelSnapThreshold36?best:null;
}
function panelSnapCandidates36(panel,index){
  const size=pageSize04();
  const xs=[0,size.w/2,size.w],ys=[0,size.h/2,size.h];
  for(const current of currentPage().panels||[]){
    panelAssistPoints36(current).forEach((point,pointIndex)=>{
      if(current.id===panel.id&&pointIndex===index)return;
      xs.push(Number(point.x));ys.push(Number(point.y));
    });
  }
  return{xs,ys};
}

const svgPointBase36=svgPoint;
svgPoint=function(event){
  const raw=svgPointBase36(event);
  if(!panelSnapEnabled36||typeof panelShapeDrag33==='undefined'||!panelShapeDrag33){panelSnapGuide36={x:null,y:null};return raw;}
  const panel=currentPage()?.panels.find(item=>item.id===panelShapeDrag33.panelId);
  if(!panel)return raw;
  const candidates=panelSnapCandidates36(panel,panelShapeDrag33.index);
  const x=nearestSnap36(raw.x,candidates.xs),y=nearestSnap36(raw.y,candidates.ys);
  panelSnapGuide36={x,y};
  return{x:x??raw.x,y:y??raw.y};
};

const renderSvgBase36=renderSvg;
renderSvg=function(annotated=true){
  const markup=renderSvgBase36(annotated);
  if(!annotated||(panelSnapGuide36.x==null&&panelSnapGuide36.y==null))return markup;
  const size=pageSize04();
  const lines=[
    panelSnapGuide36.x==null?'':`<line class="panel-snap-guide36 authoring-text" x1="${panelSnapGuide36.x}" y1="0" x2="${panelSnapGuide36.x}" y2="${size.h}"/>`,
    panelSnapGuide36.y==null?'':`<line class="panel-snap-guide36 authoring-text" x1="0" y1="${panelSnapGuide36.y}" x2="${size.w}" y2="${panelSnapGuide36.y}"/>`
  ].join('');
  return `${markup}<g pointer-events="none">${lines}</g>`;
};

function straightenSelectedPanel36(){
  const panel=selectedPanel();
  if(!panel?.shape||panel.shape.kind!=='quad')return;
  const points=panelAssistPoints36(panel).map(point=>({...point}));
  const tolerance=18;
  const alignHorizontal=(a,b)=>{if(Math.abs(points[a].y-points[b].y)<=tolerance){const y=(points[a].y+points[b].y)/2;points[a].y=y;points[b].y=y;}};
  const alignVertical=(a,b)=>{if(Math.abs(points[a].x-points[b].x)<=tolerance){const x=(points[a].x+points[b].x)/2;points[a].x=x;points[b].x=x;}};
  alignHorizontal(0,1);alignVertical(1,2);alignHorizontal(2,3);alignVertical(3,0);
  if(typeof isConvexQuad33==='function'&&!isConvexQuad33(points))return;
  mutate(()=>{
    panel.shape={kind:'quad',preset:'custom',points};
    panel.style.bleed='none';
    typeof syncPanelRectFromShape33==='function'&&syncPanelRectFromShape33(panel);
  });
  typeof showPanelShapeNotice33==='function'&&showPanelShapeNotice33(t('panelStraightenDone36'));
}

function frameGuideText36(){
  const panel=selectedPanel();
  if(!panel)return'';
  const key={normal:'frameGuideNormal36',borderless:'frameGuideBorderless36',inset:'frameGuideInset36',impact:'frameGuideImpact36'}[panel.style?.border]||'frameGuideNormal36';
  return `${t(key)}\n${t('frameGuideBleed36')}\n${t('frameGuideBreakout36')}`;
}
function ensurePanelAssistUi36(){
  const shapeHost=$('panelShapeControls33');
  if(shapeHost&&!$('panelAssistControls36')){
    const host=document.createElement('div');host.id='panelAssistControls36';host.innerHTML=`
      <div class="subhead" data-i18n="panelSnapHeading36"></div>
      <label class="check-row"><input id="panelSnapEnabled36" type="checkbox" checked/><span data-i18n="panelSnapToggle36"></span></label>
      <button id="panelStraighten36" type="button" class="full" data-i18n="panelStraighten36"></button>
      <p class="help" data-i18n="panelSnapHelp36"></p>`;
    shapeHost.appendChild(host);
    $('panelSnapEnabled36').addEventListener('change',event=>{panelSnapEnabled36=event.target.checked;panelSnapGuide36={x:null,y:null};renderCanvas();});
    $('panelStraighten36').addEventListener('click',straightenSelectedPanel36);
  }
  const breakout=$('breakoutMode')?.closest('label');
  if(breakout&&!$('frameGuide36')){
    const box=document.createElement('div');box.id='frameGuide36';box.className='explain-card';box.setAttribute('aria-live','polite');
    breakout.insertAdjacentElement('afterend',box);
  }
  if(!$('panelAssistStyle36')){
    const style=document.createElement('style');style.id='panelAssistStyle36';style.textContent=`.panel-snap-guide36{stroke:#2563eb;stroke-width:2;stroke-dasharray:10 7;opacity:.8;vector-effect:non-scaling-stroke}#frameGuide36{white-space:pre-line}`;document.head.appendChild(style);
  }
}
function renderPanelAssist36(){
  ensurePanelAssistUi36();
  const panel=selectedPanel();
  if($('panelStraighten36'))$('panelStraighten36').disabled=!panel?.shape||panel.shape.kind!=='quad';
  if($('frameGuide36'))$('frameGuide36').textContent=frameGuideText36();
  document.querySelectorAll('#panelAssistControls36 [data-i18n]').forEach(element=>{element.textContent=t(element.dataset.i18n);});
}

const renderUiBase36=renderUi;
renderUi=function(){renderUiBase36();renderPanelAssist36();};
const applyLanguageBase36=applyLanguage;
applyLanguage=function(){applyLanguageBase36();queueMicrotask(renderPanelAssist36);};

for(const eventName of ['pointerup','pointercancel'])svg.addEventListener(eventName,()=>{if(panelSnapGuide36.x!=null||panelSnapGuide36.y!=null){panelSnapGuide36={x:null,y:null};queueMicrotask(()=>renderCanvas());}});

ensurePanelAssistUi36();
renderPanelAssist36();
renderCanvas();