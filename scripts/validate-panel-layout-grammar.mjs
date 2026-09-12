import fs from 'node:fs';
import vm from 'node:vm';

const source=fs.readFileSync('web/runtime/templates/panel-layout-grammar.js','utf8');
const bootstrap=fs.readFileSync('web/src/legacy-runtime.ts','utf8');

const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
const layoutMetrics=(w,h)=>{const m=Math.round(clamp(Math.min(w,h)*.035,16,50));const g=Math.round(clamp(Math.min(w,h)*.018,12,30));return{m,g,innerW:w-m*2,innerH:h-m*2};};
const storyTemplates11={
  action:{layout:'action3',beats:[]},decisiveBlow:{layout:'diagonal3',beats:[]},aerialAttack:{layout:'diagonal3',beats:[]},throwTechnique:{layout:'action3',beats:[]},rushImpact35:{layout:'diagonal3',beats:[]},angerBurst:{layout:'diagonal3',beats:[]},shockReveal35:{layout:'action3',beats:[]},resolve:{layout:'action3',beats:[]},
  counterattack:{layout:'diagonal4',beats:[]},rapidExchange35:{layout:'diagonal4',beats:[]},romanceMisunderstanding:{layout:'four-grid',beats:[]},classroomTalk:{layout:'four-grid',beats:[]},affectionDaily:{layout:'four-grid',beats:[]},teaseBlush:{layout:'four-grid',beats:[]},pamper:{layout:'four-grid',beats:[]},smugFail:{layout:'four-grid',beats:[]},comicInset35:{layout:'four-grid',beats:[]},romance:{layout:'climax',beats:[]},confession:{layout:'climax',beats:[]},battleStandoff:{layout:'climax',beats:[]},awakening:{layout:'climax',beats:[]},afterSchoolTwo:{layout:'climax',beats:[]},characterIntro:{layout:'climax',beats:[]},
  crying:{layout:'action3',beats:[]},quietAftermath35:{layout:'action3',beats:[]},faceClose:{layout:'action3',beats:[]},foreheadTouch:{layout:'action3',beats:[]},shoulderLean:{layout:'action3',beats:[]},kissBefore:{layout:'action3',beats:[]},kissAfter:{layout:'action3',beats:[]},holdHands:{layout:'action3',beats:[]},presenceBehind:{layout:'action3',beats:[]},uneasyApproach35:{layout:'action3',beats:[]}
};
const meta13={};
for(const id of Object.keys(storyTemplates11))meta13[id]={category:'daily',desc:{ja:'',en:''},use:{ja:'',en:''},tags:[]};

const context={
  console,
  i18n:{ja:{},en:{}},
  language:'ja',
  layoutPresets04:{diagonal3:{ja:'legacy'},diagonal4:{ja:'legacy'}},
  irregularLayoutIds33:new Set(['diagonal3','diagonal4']),
  layoutMetrics04:layoutMetrics,
  layoutRects04:()=>[],
  layoutSpecs33:(id,w,h)=>[],
  storyTemplates11,
  meta13,
  templateMeta13(id,category,descJa,descEn,useJa,useEn,tags=[]){meta13[id]={category,desc:{ja:descJa,en:descEn},use:{ja:useJa,en:useEn},tags};},
  bg13(jaLoc,enLoc,jaMood='普通',enMood='neutral',time='day'){return {ja:{location:jaLoc,timeOfDay:time,mood:jaMood},en:{location:enLoc,timeOfDay:time,mood:enMood}};},
  beat13(role,ja,en,pose='stand',expression='neutral',gaze='camera',camera=['medium','eye-level','front'],extra={}){return {role,action:{ja,en},pose,expression,gaze,camera,...extra};},
  defineSceneMeta22(){},
  templatePresentationFeatures35(){return {geometry:new Set(),border:new Set(),effect:new Set(),breakout:new Set()};},
  syncTemplateSelect13(){},renderTemplateGallery13(){},renderTemplatePreview13(){},
};
context.globalThis=context;
vm.createContext(context);
vm.runInContext(source,context,{filename:'panel-layout-grammar.js'});

const grammar=context.panelLayoutGrammar37;
if(!grammar)throw new Error('panelLayoutGrammar37 export missing');
if(!bootstrap.includes("['templates/panel-layout-grammar','runtime/templates/panel-layout-grammar.js']"))throw new Error('TypeScript bootstrap must load panel layout grammar');
const expectedCounts={opposed3:3,zigzag4:4,stair4:4,build4:4,detail5:5,duel2:2,diagonal3:3,diagonal4:4};
const W=800,H=1130;

function polygonArea(points){
  return Math.abs(points.reduce((sum,p,i)=>{const q=points[(i+1)%points.length];return sum+p.x*q.y-q.x*p.y;},0))/2;
}
function specArea(spec){return spec.shape?.points?polygonArea(spec.shape.points):spec.rect.w*spec.rect.h;}
function assertWithin(spec,id){
  const points=spec.shape?.points||[
    {x:spec.rect.x,y:spec.rect.y},{x:spec.rect.x+spec.rect.w,y:spec.rect.y},
    {x:spec.rect.x+spec.rect.w,y:spec.rect.y+spec.rect.h},{x:spec.rect.x,y:spec.rect.y+spec.rect.h}
  ];
  for(const point of points){
    if(point.x<0||point.y<0||point.x>W||point.y>H)throw new Error(`${id} point outside canvas: ${JSON.stringify(point)}`);
  }
  if(specArea(spec)<900)throw new Error(`${id} contains unusably small panel`);
}

for(const [id,count] of Object.entries(expectedCounts)){
  const specs=grammar.specs(id,W,H);
  if(!Array.isArray(specs)||specs.length!==count)throw new Error(`${id} expected ${count} panels, got ${specs?.length}`);
  specs.forEach(spec=>assertWithin(spec,id));
}

// The corrected diagonal layouts must not turn the page center into a wide white wedge/cross.
// Measure unused area inside the common outer working rectangle; gutters should remain compact.
const {m,innerW,innerH}=grammar.metrics(W,H),workingArea=innerW*innerH;
for(const id of ['opposed3','zigzag4','diagonal3','diagonal4']){
  const used=grammar.specs(id,W,H).reduce((sum,spec)=>sum+specArea(spec),0);
  const unusedRatio=(workingArea-used)/workingArea;
  if(unusedRatio>.055)throw new Error(`${id} wastes ${(unusedRatio*100).toFixed(1)}% of working area; expected <= 5.5%`);
}

// Visual-weight contrast: hero layouts must have a clearly dominant payoff rather than equal boxes.
for(const id of ['opposed3','build4','detail5']){
  const areas=grammar.specs(id,W,H).map(specArea),largest=Math.max(...areas),smallest=Math.min(...areas);
  if(largest/smallest<1.65)throw new Error(`${id} lacks meaningful panel-area contrast: ${(largest/smallest).toFixed(2)}x`);
}

// Template catalog organization should reserve dynamic diagonal seams for pressure/impact while
// stable emotional/intimate templates can remain rectangular.
const expectedLayout={angerBurst:'opposed3',decisiveBlow:'opposed3',counterattack:'zigzag4',classroomTalk:'stair4',confession:'build4'};
for(const [id,layout] of Object.entries(expectedLayout))if(context.storyTemplates11[id]?.layout!==layout)throw new Error(`${id} expected ${layout}, got ${context.storyTemplates11[id]?.layout}`);
for(const id of ['beforeAfter37','turningPoint37','detailReveal37'])if(!context.storyTemplates11[id])throw new Error(`new Story Template missing: ${id}`);

const diagonalFeatures=context.templatePresentationFeatures35('angerBurst',context.storyTemplates11.angerBurst);
if(!diagonalFeatures.geometry.has('diagonal'))throw new Error('new diagonal families must participate in presentation discovery filters');

for(const token of ['parallel','white gutter','visual purpose','organizeTemplateLayouts37','registerPanelGrammarTemplates37'])if(!source.includes(token))throw new Error(`layout grammar rationale/contract missing token: ${token}`);

console.log('Panel layout grammar: tight gutters, area contrast, compatibility layouts, catalog organization, and discovery integration passed.');
