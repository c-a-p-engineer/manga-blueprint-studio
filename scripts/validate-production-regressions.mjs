import assert from 'node:assert/strict';
import {compileMangaName} from '../core/manga-grammar.mjs';
import {buildExecutablePrompt} from '../core/generation-brief.mjs';
import {buildLetteringPlan,renderLetteringOverlaySvg} from '../core/lettering-renderer.mjs';
import {validateReferenceBindings,buildPortableGenerationPackage} from '../core/generation-adapter.mjs';
import {evaluateNarrativeEvidence} from '../core/generation-narrative-review.mjs';

// Synthetic regressions extracted from SCP manga reviews. No generated image is
// assumed to have been inspected just because the expected Name is present.
const dialogue='……そうか。なら話が早い';
const name=[
  '# Page 1: lab conversation',
  'コマ1: 研究者が巻紙を解析する',
  '登場: hero@right',
  'セリフ: hero> 解析結果です',
  'コマ2: 主任が含み笑いを見せる',
  '登場: hero@left',
  'セリフ: hero> '+dialogue
].join('\n');
const project=compileMangaName(name,{title:'Synthetic SCP regression'});
assert.equal(project.meta.readingDirection,'rtl');
assert.equal(project.meta.defaultWritingMode,'vertical-rl');
const page=project.pages[0];
assert.equal(page.panels.length,2);
const last=page.panels.find(p=>p.order===2);
assert(last,'missing last panel');
assert.equal(last.balloons.length,1,'Do not split one authored sentence into reversed balloons');
assert.equal(last.balloons[0].text,dialogue);

// This enlarged synthetic panel tests glyph direction independently of layout fit.
last.rect={x:60,y:180,w:1080,h:1250};
last.balloons[0].x=610;
last.balloons[0].y=550;
last.balloons[0].size=360;
const lettering=buildLetteringPlan(project,0);
const sentence=lettering.entries.find(e=>e.text===dialogue);
assert(sentence,'missing authored sentence');
assert.equal(sentence.writingMode,'vertical-rl');
assert.equal(sentence.fit,'fitted');
assert.equal(sentence.glyphs.map(g=>g.char).join(''),dialogue);
for(let i=1;i<sentence.glyphs.length;i++){
  const a=sentence.glyphs[i-1],b=sentence.glyphs[i];
  assert(b.x<=a.x+0.001,'vertical columns should progress right-to-left');
  if(Math.abs(a.x-b.x)<0.001)assert(b.y>a.y,'glyphs within a column must descend');
}
assert(renderLetteringOverlaySvg(project,0).includes('data-writing-mode="vertical-rl"'));

const base=project.characterLibrary.find(c=>c.referenceKey||c.characterId);
assert(base,'missing character');
base.identityMode='sheet';
base.referenceKey='hero-canonical';
const style=[{referenceKey:'hero-canonical',asset:'style-sample.png',role:'style'}];
const identity=[{referenceKey:'hero-canonical',asset:'hero-reference.png',role:'identity'}];
assert.deepEqual(validateReferenceBindings(project,style).missing,['hero-canonical']);
assert.deepEqual(validateReferenceBindings(project,[{referenceKey:'hero-canonical',asset:'',role:'identity'}]).missing,['hero-canonical']);
assert.deepEqual(validateReferenceBindings(project,identity).bound,['hero-canonical']);
assert.deepEqual(validateReferenceBindings(project,[{referenceKey:'hero-canonical',asset:'hero-reference.png',role:'character-identity'}]).bound,['hero-canonical']);
assert.deepEqual(validateReferenceBindings(project,[{referenceKey:'hero-canonical',asset:'legacy.png'}]).bound,['hero-canonical']);
const pkg=refs=>buildPortableGenerationPackage({project,cleanAsset:'P001.clean.png',prompt:'P001.prompt.md',referenceAssets:refs});
assert.equal(pkg(style).ready,false);
assert.equal(pkg(identity).ready,true);
assert.equal(pkg(identity).request.inputs.references[0].role,'identity');
const brief=buildExecutablePrompt(project,0);
assert(brief.includes('style-only reference')&&brief.includes('never copy its face'));
assert(brief.includes(dialogue));

const observation=(description,verdict,inspected=true)=>({
  schema:'manga-generation-narrative-observation/1',
  source:{kind:'manual-image',generatedAsset:'candidate.png',imageInspected:inspected},
  pages:[{pageNumber:1,anchors:page.panels.map(p=>({
    panelOrder:p.order,observedDescription:description,verdict
  }))}]
});
const wrong=evaluateNarrativeEvidence(project,observation('別の人物が天文台で望遠鏡を操作している','mismatch'),{scope:'page'});
assert.equal(wrong.status,'repair');
assert.equal(wrong.finalAcceptance,false);
assert.equal(evaluateNarrativeEvidence(project,observation('未確認','match',false),{scope:'page'}).status,'unverified');
console.log('Production regressions passed: identity/style roles, Japanese lettering, independent story checks.');
