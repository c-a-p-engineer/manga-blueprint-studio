import assert from'node:assert/strict';
import{compileMangaName}from'../core/manga-grammar.mjs';
import{buildContinuityGraph}from'../core/continuity-graph.mjs';
import{buildLetteringPlan,renderLetteringOverlaySvg}from'../core/lettering-renderer.mjs';
import{createImageObservation,evaluateGeneratedImage,runImageObservationAdapter}from'../core/image-observation-adapter.mjs';
import{createRepairPlan,approveRepairPlan,buildRepairContext,applyApprovedSemanticPatch}from'../core/repair-loop.mjs';
import{buildPortableGenerationPackage}from'../core/generation-adapter.mjs';

const source=`# Page 1: entry
コマ1: heroが会場へ入る
登場: hero@right, mob@background
主注目: hero.face
ポーズ: hero> crouch ready
情報量: hero=high, mob=silhouette, crowd=low, background=low
状態: hero> outfit=uniform; condition=healthy
セリフ: hero> 了解
効果音: ザッ

# Page 2: answer
コマ1: heroが応答する
登場: hero@left
主注目: hero.face
ポーズ: hero> standing-neutral
情報量: hero=high, crowd=low
状態: hero> outfit=uniform; condition=healthy
セリフ: hero> はい`;

const project=compileMangaName(source,{title:'quality-loop-v25'});
assert.equal(project.meta.compiler.poseSolver,'deterministic-spatial-v3');
assert.equal(project.meta.compiler.compositionSolver,'in-panel-v1');
assert.equal(project.meta.letteringStrategy,'overlay-preferred');
assert.equal(project.meta.continuityGraph.schema,'manga-blueprint-continuity-graph/1');

const first=project.pages[0].panels[0],hero=first.characters.find(c=>c.name==='hero'),mob=first.characters.find(c=>c.name==='mob');
assert.equal(hero.renderPose.version,3);
assert.ok(hero.renderPose.body?.torsoOrientation);
assert.ok(hero.renderPose.body?.centerOfMass);
assert.ok(hero.renderPose.body?.supportPolygon);
assert.ok(hero.renderPose.jointAngles);
assert.equal(first.compositionPlan.version,1);
assert.equal(hero.detailLevel,'high');
assert.equal(mob.detailLevel,'silhouette');
assert.equal(first.detailBudget.crowd,'low');
assert.equal(hero.continuityState.outfit,'uniform');

const graph=buildContinuityGraph(project);
assert.ok(graph.nodes.length>=3);
assert.ok(graph.edges.length>=1);
assert.ok(graph.issues.some(x=>x.type==='screen-side-inversion'),'expected side/facing inversion fixture');

const broken=compileMangaName(source.replace('登場: hero@left','登場: hero@left\n連続性: intentional break'),{title:'quality-loop-v25-break'});
assert.ok(!buildContinuityGraph(broken).issues.some(x=>x.type==='screen-side-inversion'),'intentional break must suppress continuity warning');

const lettering=buildLetteringPlan(project,0);
assert.equal(lettering.schema,'manga-blueprint-lettering-plan/1');
assert.deepEqual(lettering.entries.map(x=>x.text),['了解','ザッ']);
assert.ok(lettering.entries.every(x=>x.writingMode==='vertical-rl'));
const overlay=renderLetteringOverlaySvg(project,0);
assert.match(overlay,/id="deterministic-lettering"/);
assert.match(overlay,/data-text="了解"/);
assert.match(overlay,/data-writing-mode="vertical-rl"/);

const observedPanels=project.pages[0].panels.map(panel=>({
  panelId:panel.id,
  order:panel.order,
  rect:{...panel.rect},
  confidence:.95,
  characters:panel.characters.map(c=>({
    characterId:c.characterId,
    referenceKey:c.referenceKey,
    anchor:{x:c.x,y:c.y},
    occupancy:{...c.renderPose.occupancy},
    joints:structuredClone(c.renderPose.joints),
    confidence:.9
  })),
  contacts:(panel.renderContacts||[]).map(c=>({x:c.x,y:c.y,confidence:.9})),
  lettering:[
    ...(panel.balloons||[]).map(b=>({kind:'dialogue',text:b.text,writingMode:'vertical-rl',confidence:.98})),
    ...(panel.effects?.sfxText?[{kind:'sfx',text:panel.effects.sfxText,writingMode:'vertical-rl',confidence:.98}]:[])
  ]
}));

const observation=createImageObservation({
  asset:'generated-page.png',
  width:project.meta.pageWidth,
  height:project.meta.pageHeight,
  panels:observedPanels,
  readingDirection:'rtl',
  defaultWritingMode:'vertical-rl',
  confidence:.94
});
const evaluation=evaluateGeneratedImage(project,observation,{pageIndex:0});
assert.equal(evaluation.verdict,'good');
assert.ok(evaluation.structural.result.score>.99);
assert.ok((evaluation.confidence.mean||0)>.8);

const adapterRun=await runImageObservationAdapter({
  project,
  pageIndex:0,
  asset:'generated-page.png',
  width:project.meta.pageWidth,
  height:project.meta.pageHeight,
  adapter:{
    name:'fixture-vision',
    provider:'test',
    model:'structured-fixture',
    async observe(task){
      assert.equal(task.schema,'manga-blueprint-image-observation-task/1');
      assert.equal(task.observationRequest.constraints.doNotCopyExpectedGeometry,true);
      assert.ok(!JSON.stringify(task.observationRequest).includes('"rect"'),'vision task must not expose expected geometry');
      return{panels:observedPanels,readingDirection:'rtl',defaultWritingMode:'vertical-rl',confidence:.93};
    }
  }
});
assert.equal(adapterRun.schema,'manga-blueprint-image-observation-run/1');
assert.equal(adapterRun.evaluation.verdict,'good');
assert.equal(adapterRun.adapter.name,'fixture-vision');

const driftObservation=createImageObservation({
  asset:'generated-page-bad.png',
  width:project.meta.pageWidth,
  height:project.meta.pageHeight,
  panels:observedPanels.map((panel,index)=>index?panel:{...panel,lettering:panel.lettering.map((x,i)=>i?x:{...x,text:'了介',writingMode:'horizontal-tb'})}),
  readingDirection:'ltr',
  defaultWritingMode:'horizontal-tb',
  confidence:.9
});
const drift=evaluateGeneratedImage(project,driftObservation,{pageIndex:0});
const codes=new Set(drift.diagnostics.map(x=>x.code));
for(const code of['reading-direction-drift','writing-mode-drift','visible-text-mismatch','lettering-writing-mode-drift'])assert.ok(codes.has(code),`missing ${code}`);
assert.equal(drift.verdict,'drift');

const repair=createRepairPlan(project,drift,{pageIndex:0});
assert.equal(repair.schema,'manga-blueprint-repair-plan/1');
assert.equal(repair.requiresHumanApproval,true);
assert.ok(repair.actions.some(x=>x.kind==='lettering'));
assert.throws(()=>applyApprovedSemanticPatch(project,{changes:[]}),/approval/i);
const approval=approveRepairPlan(repair,repair.actions.map(x=>x.id));
const context=buildRepairContext(approval);
assert.equal(context.schema,'manga-blueprint-repair-context/1');
assert.equal(context.constraints.readingDirection,'rtl');
assert.equal(context.lettering.strategy,'deterministic-overlay');

const generation=buildPortableGenerationPackage({
  project,
  pageIndex:0,
  cleanAsset:'P001.clean.svg',
  prompt:'P001.prompt.md',
  letteringAsset:'P001.lettering.svg',
  letteringPlan:'P001.lettering.json',
  repairContext:context
});
assert.equal(generation.capabilities.deterministicLettering,true);
assert.equal(generation.capabilities.repairContext,true);
assert.equal(generation.request.constraints.letteringStrategy,'overlay-preferred');

const again=compileMangaName(source,{title:'quality-loop-v25'});
assert.deepEqual(again,project,'quality loop compilation must remain deterministic');

console.log('Quality loop v0.25 validation passed',evaluation.structural.result.score.toFixed(3),graph.issues.length,lettering.entries.length);
