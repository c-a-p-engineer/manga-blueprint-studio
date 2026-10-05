import assert from'node:assert/strict';import fs from'node:fs';import vm from'node:vm';
const source=fs.readFileSync('web/runtime/integration/layout-recipe-api.js','utf8');
const page={panels:[{id:'old',order:1,rect:{x:0,y:0,w:100,h:100},characters:[],balloons:[]}]};
let renumbered=false,mutations=0;
const context={
  console,PAGE_W:800,PAGE_H:1130,language:'ja',
  project:{meta:{pageWidth:800,pageHeight:1130},pages:[page]},
  selectedPanelId:'old',selectedCharacterId:'x',selectedBalloonId:'y',
  currentPage:()=>page,
  confirmReset04:()=>true,
  mutate(fn){mutations++;fn();},
  makePanel(rect,order){return{id:`panel-${order}`,order,rect:{...rect},characters:[],balloons:[],style:{},camera:{},background:{},effects:{}};},
  renumberPanels(){renumbered=true;page.panels.forEach((p,i)=>p.order=i+1);}
};
context.globalThis=context;vm.createContext(context);vm.runInContext(source,context,{filename:'layout-recipe-api.js'});
const api=context.MANGA_BLUEPRINT_LAYOUT_API;assert.ok(api,'layout recipe runtime API missing');
assert.deepEqual(JSON.parse(JSON.stringify(api.currentCanvas())),{width:800,height:1130,panelCount:1,language:'ja'});
const rects=[{x:20,y:20,w:300,h:400},{x:340,y:20,w:440,h:400},{x:20,y:440,w:760,h:670}];
assert.equal(api.applyLayoutRecipe({recipeId:'hero-bottom',seed:'shared',mutation:.25,rects,ask:true}),true);
assert.equal(mutations,1);assert.ok(renumbered);assert.equal(page.panels.length,3);assert.deepEqual(JSON.parse(JSON.stringify(page.panels.map(p=>p.rect))),rects);
assert.equal(context.project.meta.layoutRecipeId,'hero-bottom');assert.equal(context.project.meta.layoutSeed,'shared');assert.equal(context.project.meta.layoutMutation,.25);
assert.equal(context.selectedPanelId,'panel-1');assert.equal(context.selectedCharacterId,null);assert.equal(context.selectedBalloonId,null);
const manifest=JSON.parse(fs.readFileSync('web/runtime/manifest.json','utf8'));const entry=manifest.find(x=>x.key==='layoutRecipeApi');
assert.equal(entry?.path,'runtime/integration/layout-recipe-api.js');
const uiSource=fs.readFileSync('web/src/ui/layout-recipe-ui.ts','utf8');
for(const token of ['layoutRecipeDeepLinkNotice','カタログの設定を読み込みました','カタログ設定を適用',"phase1PageModeLayout')]){
  assert.ok(uiSource.includes(token),`catalog-to-editor handoff UI missing ${token}`);
}
assert.ok(!uiSource.includes('queueMicrotask(()=>{applyCurrentRecipe'),'catalog deep link must not auto-apply over authored content');
console.log('Layout Recipe Web bridge: shared derived rectangles, metadata, selection reset, and runtime manifest passed.');
