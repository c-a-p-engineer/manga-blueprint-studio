import assert from'node:assert/strict';
import{buildLayoutRecipe,listLayoutRecipes,layoutRecipeCount}from'../core/layout-recipes.mjs';
import{solveLayout}from'../core/layout-solver.mjs';
import{compileMangaName}from'../core/manga-grammar.mjs';

const W=1200,H=1697;
assert.ok(layoutRecipeCount()>=50,'recipe bank should expose at least 50 recipe×panel-count bases');
for(let count=1;count<=6;count++){
  const recipes=listLayoutRecipes({panelCount:count});
  assert.ok(recipes.length>=(count===1?1:count===2?5:8),`too few base recipes for ${count} panels`);
  for(const recipe of recipes){
    const a=buildLayoutRecipe(recipe.id,{width:W,height:H,panelCount:count,seed:42,mutation:.35});
    const b=buildLayoutRecipe(recipe.id,{width:W,height:H,panelCount:count,seed:42,mutation:.35});
    assert.deepEqual(a.rects,b.rects,`${recipe.id} must be deterministic for a fixed seed`);
    assert.equal(a.rects.length,count,`${recipe.id} panel count mismatch`);
    for(const rect of a.rects){
      assert.ok(rect.w>40&&rect.h>40,`${recipe.id} generated unusably small panel`);
      assert.ok(rect.x>=0&&rect.y>=0&&rect.x+rect.w<=W+.01&&rect.y+rect.h<=H+.01,`${recipe.id} escaped page bounds`);
    }
    for(let i=0;i<a.rects.length;i++)for(let j=i+1;j<a.rects.length;j++){
      const p=a.rects[i],q=a.rects[j],overlap=Math.max(0,Math.min(p.x+p.w,q.x+q.w)-Math.max(p.x,q.x))*Math.max(0,Math.min(p.y+p.h,q.y+q.h)-Math.max(p.y,q.y));
      assert.ok(overlap<1,`${recipe.id} panels overlap by ${overlap}`);
    }
  }
}
const stable=buildLayoutRecipe('dialogue-stagger',{width:W,height:H,panelCount:4,seed:9,mutation:0}).rects;
const varied=buildLayoutRecipe('dialogue-stagger',{width:W,height:H,panelCount:4,seed:9,mutation:.8}).rects;
assert.notDeepEqual(stable,varied,'mutation must produce a deterministic nearby alternative');

const semantic=Array.from({length:4},(_,i)=>({shape:'rectangle',size:'auto',inset:'',gaze:{},motion:{},importance:{energy:i===3?.9:.4},timing:{hold:.5},attention:{},flow:{}}));
const exact=solveLayout(semantic,{hint:'hero-bottom',seed:12,mutation:.2});
assert.equal(exact.recipeId,'hero-bottom','explicit recipe hint must be honored');
assert.equal(exact.signals.basePanelCount,4);

const withInset=semantic.map(x=>structuredClone(x));withInset[2].importance.energy=.95;withInset[3].inset='parent panel 3 top-left small';
const insetSolved=solveLayout(withInset,{hint:'hero-bottom',seed:12,mutation:.2});
assert.equal(insetSolved.signals.basePanelCount,3,'inset must not consume a base-layout slot');
assert.equal(insetSolved.signals.insetCount,1);
assert.ok(insetSolved.rects[2].w*insetSolved.rects[2].h>insetSolved.rects[0].w*insetSolved.rects[0].h,'last main panel should receive hero-bottom payoff area');

const source=`# Page 1: recipe
@layout: dialogue-stagger
@layout-seed: shared-42
@layout-mutation: 0.35

コマ1: 導入
登場: a@right

コマ2: 返答
登場: b@left
断ち切り: bottom

コマ3: 反応
登場: a@right
ブチ抜き: character

コマ4: 余韻
登場: b@left
`;
const projectA=compileMangaName(source,{title:'recipe'}),projectB=compileMangaName(source,{title:'recipe'});
assert.deepEqual(projectA,projectB,'recipe compilation must stay deterministic');
assert.equal(projectA.pages[0].layoutDecision.recipeId,'dialogue-stagger');
assert.equal(projectA.pages[0].layoutDecision.signals.seed,0,'string seed normalizes internally but signal remains numeric fallback until manifest-level hashing');
assert.equal(projectA.pages[0].panels[1].style.bleed,'bottom');
assert.equal(projectA.pages[0].panels[2].style.breakout,'character');
assert.equal(projectA.meta.compiler.layoutSolver,'recipe-bank-v1');
console.log('Layout Recipe Bank: shared recipes, deterministic mutation, inset separation, and panel modifiers passed.');
