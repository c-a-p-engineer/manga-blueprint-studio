// Panel-layout grammar derived from manga readability research and Tsuzuri comics direction.
// Owns reusable page-level composition families: tight shared seams, strong area contrast,
// and Story Template layout assignment. It deliberately does not own story semantics.

Object.assign(i18n.ja,{
  layoutOpposed3_37:'対向3コマ（斜め）',
  layoutZigzag4_37:'ジグザグ4コマ',
  layoutStair4_37:'段違い4コマ',
  layoutBuild4_37:'溜め→大ゴマ 4コマ',
  layoutDetail5_37:'ディテール→大ゴマ 5コマ',
  layoutDuel2_37:'対比2コマ（斜め）',
  storyBeforeAfter37:'変化の前後 2コマ',
  storyTurningPoint37:'転換点 4コマ',
  storyDetailReveal37:'手元→発見 5コマ'
});
Object.assign(i18n.en,{
  layoutOpposed3_37:'Opposed diagonal 3-panel',
  layoutZigzag4_37:'Zigzag 4-panel',
  layoutStair4_37:'Staggered 4-panel',
  layoutBuild4_37:'Build → hero 4-panel',
  layoutDetail5_37:'Detail → hero 5-panel',
  layoutDuel2_37:'Diagonal contrast 2-panel',
  storyBeforeAfter37:'Before / after 2-panel',
  storyTurningPoint37:'Turning point 4-panel',
  storyDetailReveal37:'Detail → reveal 5-panel'
});

const PANEL_LAYOUT_GRAMMAR_37=Object.freeze({
  opposed3:{family:'opposed',panelCount:3,diagonal:true,tags:['対向斜め','斜め','大ゴマ','opposed','diagonal','hero-panel']},
  zigzag4:{family:'zigzag',panelCount:4,diagonal:true,tags:['ジグザグ','斜め','攻防','zigzag','diagonal','exchange']},
  stair4:{family:'stair',panelCount:4,diagonal:false,tags:['段違い','大小','会話','staggered','unequal-panels','dialogue']},
  build4:{family:'build',panelCount:4,diagonal:false,tags:['溜め','大ゴマ','見せゴマ','build','hero-panel','payoff']},
  detail5:{family:'detail',panelCount:5,diagonal:false,tags:['ディテール','小コマ','大ゴマ','detail','insert','hero-panel']},
  duel2:{family:'contrast',panelCount:2,diagonal:true,tags:['対比','斜め','二分割','contrast','diagonal','split']}
});
const PANEL_LAYOUT_DIAGONAL_IDS_37=new Set(['opposed3','zigzag4','duel2','diagonal3','diagonal4']);

Object.assign(layoutPresets04,{
  opposed3:{ja:'対向3コマ（斜め）',en:'Opposed diagonal 3-panel',helpJa:'上段2コマを細い共有斜線でつなぎ、下の大ゴマへ落とす。斜め枠の間に大きな白い楔を作りません。',helpEn:'Two top panels share a tight diagonal seam, then release into one large payoff panel without a wide white wedge.'},
  zigzag4:{ja:'ジグザグ4コマ',en:'Zigzag 4-panel',helpJa:'上下段で斜線の向きを反転し、右→左→下へ視線を送る。中央の十字余白を細く保ちます。',helpEn:'Alternates the diagonal seam by row to guide eye flow while keeping the central gutter compact.'},
  stair4:{ja:'段違い4コマ',en:'Staggered 4-panel',helpJa:'上下で左右のコマ幅を入れ替え、均等2×2より視覚重量に差をつける。会話・反応向け。',helpEn:'Swaps left/right widths between rows for stronger visual rhythm than an equal 2x2 grid.'},
  build4:{ja:'溜め→大ゴマ 4コマ',en:'Build → hero 4-panel',helpJa:'上で状況、中段で二つの細部、下の大ゴマで決める。感情・告白・覚醒向け。',helpEn:'Establish above, use two middle detail beats, then give the lower payoff a dominant area.'},
  detail5:{ja:'ディテール→大ゴマ 5コマ',en:'Detail → hero 5-panel',helpJa:'小さな観察を4コマで積み、下半分近い大ゴマで発見・反応を見せる。',helpEn:'Accumulates four compact observation beats before a large reveal/reaction panel.'},
  duel2:{ja:'対比2コマ（斜め）',en:'Diagonal contrast 2-panel',helpJa:'2つの場面を細い共有斜線で分ける。Before/After・対峙・対比向け。',helpEn:'Splits two beats with one tight shared diagonal seam for contrast or before/after.'}
});
// Keep legacy names usable, but give them the corrected tight-seam geometry.
if(layoutPresets04.diagonal3){layoutPresets04.diagonal3.helpJa='互いに独立した斜め枠ではなく、細い共有斜線で上2コマをつなぐ互換レイアウト。';layoutPresets04.diagonal3.helpEn='Legacy diagonal 3-panel using the corrected tight shared seam.';}
if(layoutPresets04.diagonal4){layoutPresets04.diagonal4.helpJa='中央に大きな十字余白を作らない、共有斜線式の互換4コマ。';layoutPresets04.diagonal4.helpEn='Legacy diagonal 4-panel using corrected shared seams without a wide central cross.';}

for(const id of ['opposed3','zigzag4','duel2'])irregularLayoutIds33.add(id);

function panelLayoutGrammarMetrics37(w,h){
  const base=layoutMetrics04(w,h),unit=Math.min(Number(w)||800,Number(h)||1130);
  // Horizontal progression inside a tier is tighter than the inter-tier gap so the eye
  // groups panels in the intended right-to-left row before dropping to the next row.
  const hGap=Math.round(Math.max(8,Math.min(16,unit*.011)));
  const vGap=Math.round(Math.max(hGap+4,Math.min(24,unit*.018)));
  return {m:base.m,hGap,vGap,innerW:w-base.m*2,innerH:h-base.m*2};
}
function panelLayoutRectSpec37(rect){return {rect:{...rect}};}
function panelLayoutQuadSpec37(rect,points,preset='custom'){
  return {rect:{...rect},shape:{kind:'quad',preset,points:points.map(point=>({x:Number(point.x),y:Number(point.y)}))}};
}
function panelLayoutSharedDiagonalPair37(rect,{ratio=.5,lean=.10,gap=null}={}){
  const {x,y,w,h}=rect,actualGap=Number(gap)||Math.max(8,Math.min(16,Math.min(w,h)*.035));
  const center=x+w*ratio,shift=Math.max(12,Math.min(Math.abs(w*lean),w*.14));
  const signed=lean<0?-shift:shift;
  const top=center-signed,bottom=center+signed,halfGap=actualGap/2;
  const leftRect={x,y,w:Math.max(40,bottom-halfGap-x),h};
  const rightRect={x:Math.min(top+halfGap,bottom+halfGap),y,w:Math.max(40,x+w-Math.min(top+halfGap,bottom+halfGap)),h};
  const leftPoints=[
    {x,y},{x:top-halfGap,y},{x:bottom-halfGap,y:y+h},{x,y:y+h}
  ];
  const rightPoints=[
    {x:top+halfGap,y},{x:x+w,y},{x:x+w,y:y+h},{x:bottom+halfGap,y:y+h}
  ];
  // rect is the polygon bounding box; neighboring slanted edges remain parallel,
  // so the visible white gutter stays constant instead of opening into a wedge.
  const bbox=points=>{const xs=points.map(p=>p.x),ys=points.map(p=>p.y);const bx=Math.min(...xs),by=Math.min(...ys);return{x:bx,y:by,w:Math.max(...xs)-bx,h:Math.max(...ys)-by};};
  return [
    panelLayoutQuadSpec37(bbox(leftPoints),leftPoints,lean<0?'diagonal-right':'diagonal-left'),
    panelLayoutQuadSpec37(bbox(rightPoints),rightPoints,lean<0?'diagonal-right':'diagonal-left')
  ];
}
function panelLayoutSpecs37(id,w,h){
  const {m,hGap,vGap,innerW,innerH}=panelLayoutGrammarMetrics37(w,h);
  if(id==='opposed3'||id==='diagonal3'){
    const topH=(innerH-vGap)*.34,bottomY=m+topH+vGap;
    return [
      ...panelLayoutSharedDiagonalPair37({x:m,y:m,w:innerW,h:topH},{ratio:.50,lean:.10,gap:hGap}),
      panelLayoutRectSpec37({x:m,y:bottomY,w:innerW,h:m+innerH-bottomY})
    ];
  }
  if(id==='zigzag4'||id==='diagonal4'){
    const topH=(innerH-vGap)*.47,bottomY=m+topH+vGap,bottomH=m+innerH-bottomY;
    return [
      ...panelLayoutSharedDiagonalPair37({x:m,y:m,w:innerW,h:topH},{ratio:.52,lean:.085,gap:hGap}),
      ...panelLayoutSharedDiagonalPair37({x:m,y:bottomY,w:innerW,h:bottomH},{ratio:.48,lean:-.085,gap:hGap})
    ];
  }
  if(id==='duel2'){
    return panelLayoutSharedDiagonalPair37({x:m,y:m,w:innerW,h:innerH},{ratio:.50,lean:.075,gap:hGap});
  }
  if(id==='stair4'){
    const topH=(innerH-vGap)*.46,bottomY=m+topH+vGap,bottomH=m+innerH-bottomY;
    const topLeftW=(innerW-hGap)*.43,topRightW=innerW-hGap-topLeftW;
    const bottomLeftW=(innerW-hGap)*.58,bottomRightW=innerW-hGap-bottomLeftW;
    return [
      panelLayoutRectSpec37({x:m,y:m,w:topLeftW,h:topH}),
      panelLayoutRectSpec37({x:m+topLeftW+hGap,y:m,w:topRightW,h:topH}),
      panelLayoutRectSpec37({x:m,y:bottomY,w:bottomLeftW,h:bottomH}),
      panelLayoutRectSpec37({x:m+bottomLeftW+hGap,y:bottomY,w:bottomRightW,h:bottomH})
    ];
  }
  if(id==='build4'){
    const usable=innerH-vGap*2,topH=usable*.24,midH=usable*.28,bottomH=usable-topH-midH;
    const midY=m+topH+vGap,bottomY=midY+midH+vGap,half=(innerW-hGap)/2;
    return [
      panelLayoutRectSpec37({x:m,y:m,w:innerW,h:topH}),
      panelLayoutRectSpec37({x:m,y:midY,w:half,h:midH}),
      panelLayoutRectSpec37({x:m+half+hGap,y:midY,w:half,h:midH}),
      panelLayoutRectSpec37({x:m,y:bottomY,w:innerW,h:bottomH})
    ];
  }
  if(id==='detail5'){
    const usable=innerH-vGap*2,topH=usable*.22,midH=usable*.24,bottomH=usable-topH-midH;
    const midY=m+topH+vGap,bottomY=midY+midH+vGap,half=(innerW-hGap)/2;
    return [
      panelLayoutRectSpec37({x:m,y:m,w:half,h:topH}),
      panelLayoutRectSpec37({x:m+half+hGap,y:m,w:half,h:topH}),
      panelLayoutRectSpec37({x:m,y:midY,w:half,h:midH}),
      panelLayoutRectSpec37({x:m+half+hGap,y:midY,w:half,h:midH}),
      panelLayoutRectSpec37({x:m,y:bottomY,w:innerW,h:bottomH})
    ];
  }
  return null;
}

const layoutRectsBase37=layoutRects04;
layoutRects04=function(id,w,h){
  const specs=panelLayoutSpecs37(id,w,h);
  return specs?specs.map(spec=>({...spec.rect})):layoutRectsBase37(id,w,h);
};
const layoutSpecsBase37=layoutSpecs33;
layoutSpecs33=function(id,w,h){
  const specs=panelLayoutSpecs37(id,w,h);
  return specs||layoutSpecsBase37(id,w,h);
};

function layoutFamilyTags37(id){return PANEL_LAYOUT_GRAMMAR_37[id]?.tags||[];}
function setTemplateLayoutFamily37(id,layout){
  const tpl=storyTemplates11[id];if(!tpl)return;
  tpl.layout=layout;
  const meta=meta13[id]||(meta13[id]={category:'daily',desc:{ja:'',en:''},use:{ja:'',en:''},tags:[]});
  meta.layoutFamily37=PANEL_LAYOUT_GRAMMAR_37[layout]?.family||layout;
  meta.tags=[...new Set([...(meta.tags||[]),...layoutFamilyTags37(layout)])];
}

// Re-map shipped templates by visual purpose. Quiet/intimate beats intentionally remain stable;
// dynamic seams are reserved for pressure, impact, contrast, or a strong directional turn.
function organizeTemplateLayouts37(){
  for(const id of ['action','decisiveBlow','aerialAttack','throwTechnique','rushImpact35','angerBurst','shockReveal35','resolve'])setTemplateLayoutFamily37(id,'opposed3');
  for(const id of ['counterattack','rapidExchange35'])setTemplateLayoutFamily37(id,'zigzag4');
  for(const id of ['romanceMisunderstanding','classroomTalk','affectionDaily','teaseBlush','pamper','smugFail','comicInset35'])setTemplateLayoutFamily37(id,'stair4');
  for(const id of ['romance','confession','battleStandoff','awakening','afterSchoolTwo','characterIntro'])setTemplateLayoutFamily37(id,'build4');
  for(const id of ['crying','quietAftermath35','faceClose','foreheadTouch','shoulderLean','kissBefore','kissAfter','holdHands','presenceBehind','uneasyApproach35']){
    const tpl=storyTemplates11[id];if(tpl){const meta=meta13[id];if(meta){meta.layoutFamily37='stable';meta.tags=[...new Set([...(meta.tags||[]),'安定コマ','stable-layout'])];}}
  }
}
organizeTemplateLayouts37();

function registerPanelGrammarTemplates37(){
  Object.assign(storyTemplates11,{
    beforeAfter37:{label:'storyBeforeAfter37',layout:'duel2',background:bg13('日常の場所','everyday setting','軽い','light'),beats:[
      beat13('setup','変化する前の状態を一目で見せる','shows the state before the change at a glance','stand','neutral','camera',['medium','eye-level','three-quarter-front']),
      beat13('reaction','変化した結果を対比で大きく見せる','shows the changed result as a direct contrast','stand','surprised','camera',['close','eye-level','front'])
    ]},
    turningPoint37:{label:'storyTurningPoint37',layout:'build4',background:bg13('室内','room','張りつめた','tense'),beats:[
      beat13('setup','状況と距離を広めに見せる','establishes the situation and distance','stand','neutral','other-character',['long','eye-level','three-quarter-front']),
      beat13('beat','手元や小物の小さな変化へ寄る','cuts to a small change in a hand or object','stand','neutral','down',['extreme-close','eye-level','near-object']),
      beat13('reaction','その意味へ気づいた表情を見せる','shows the face realizing what the detail means','stand','surprised','down',['close','eye-level','front']),
      beat13('climax','決断または感情の転換を大ゴマで見せる','gives the decision or emotional turn the dominant panel','stand','angry','other-character',['close','low-angle','front'],{lineEffect:'focus'})
    ]},
    detailReveal37:{label:'storyDetailReveal37',layout:'detail5',background:bg13('静かな場所','quiet place','不穏','uneasy'),beats:[
      beat13('setup','場所の小さな異変を見せる','shows a small anomaly in the setting','stand','neutral','away',['medium','eye-level','front']),
      beat13('beat','手元や対象物へ視線を移す','moves attention to a hand or object','stand','neutral','down',['extreme-close','eye-level','near-object']),
      beat13('beat','別の細部が異変を裏付ける','a second detail confirms something is wrong','stand','surprised','down',['extreme-close','eye-level','near-object']),
      beat13('reaction','人物が意味を理解する','the character understands what the details mean','stand','surprised','away',['close','eye-level','front']),
      beat13('climax','発見した全体像を大ゴマで明かす','reveals the full discovery in the dominant panel','stand','fear','other-character',['long','low-angle','front'],{lineEffect:'focus'})
    ]}
  });
  templateMeta13('beforeAfter37','daily','斜めの共有境界で「前」と「後」を直接ぶつける2コマです。','A two-panel direct contrast separated by one tight shared diagonal.','Before/After、変身、表情変化、比較','Before/after, transformation, expression change, comparison',['対比','Before/After',...layoutFamilyTags37('duel2')]);
  templateMeta13('turningPoint37','emotion','状況→細部→気づき→大ゴマの転換へ、視覚重量を段階的に上げます。','Builds visual weight from situation to detail, realization, and a dominant turning point.','決断、感情転換、発見、見せゴマ','Decision, emotional turn, discovery, hero panel',['転換','見せゴマ',...layoutFamilyTags37('build4')]);
  templateMeta13('detailReveal37','suspense','細部を小コマで積んでから、大ゴマで全体像を明かします。','Accumulates detail inserts before revealing the whole in one dominant panel.','サスペンス、発見、観察、伏線回収','Suspense, discovery, observation, reveal',['発見','細部',...layoutFamilyTags37('detail5')]);
  if(typeof defineSceneMeta22==='function'){
    defineSceneMeta22('beforeAfter37',{relationship:'solo',min:1,recommended:1,max:1,presentation:'single',dialogueDensity:'low',artHint:'both',offPanelPartner:false});
    defineSceneMeta22('turningPoint37',{relationship:'solo',min:1,recommended:1,max:1,presentation:'single',dialogueDensity:'low',artHint:'both',offPanelPartner:false});
    defineSceneMeta22('detailReveal37',{relationship:'solo',min:1,recommended:1,max:1,presentation:'single',dialogueDensity:'low',artHint:'mono',offPanelPartner:false});
  }
}
registerPanelGrammarTemplates37();

// Presentation discovery still owns filters/chips. Extend its geometry classification so the
// new layout families participate in the existing "斜めコマ" discovery path.
if(typeof templatePresentationFeatures35==='function'){
  const templatePresentationFeaturesBase37=templatePresentationFeatures35;
  templatePresentationFeatures35=function(id,tpl=storyTemplates11[id]){
    const features=templatePresentationFeaturesBase37(id,tpl);
    if(PANEL_LAYOUT_DIAGONAL_IDS_37.has(tpl?.layout))features.geometry.add('diagonal');
    return features;
  };
}

// Keep the hidden select and gallery in sync after catalog additions.
if(typeof syncTemplateSelect13==='function')syncTemplateSelect13();
if(typeof renderTemplateGallery13==='function')renderTemplateGallery13();
if(typeof renderTemplatePreview13==='function')renderTemplatePreview13();

globalThis.panelLayoutGrammar37={
  ids:PANEL_LAYOUT_GRAMMAR_37,
  metrics:panelLayoutGrammarMetrics37,
  specs:panelLayoutSpecs37,
  familyTags:layoutFamilyTags37
};
