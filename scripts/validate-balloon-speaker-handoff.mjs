import assert from 'node:assert/strict';
import {compileMangaName} from '../core/manga-grammar.mjs';
import {buildExecutablePrompt} from '../core/generation-brief.mjs';
import {buildLetteringPlan,renderLetteringOverlaySvg} from '../core/lettering-renderer.mjs';
import {evaluateObservedGeneration,DEFAULT_OBSERVABLES} from '../core/observation-extractor.mjs';

// Regression: two introductory balloons belong to the SAME speaker (EP004 P002),
// and the concluding response must not acquire the other character's tail.
const source=`# Page 1: foundation groups
コマ1: 七瀬が資料を説明する
登場: nanase@right, goldie@left
セリフ: nanase> 他にもメジャーなところはこれらだ。
セリフ: nanase> とりあえず覚えておけ。詳細は必要になったら確認しろ。`;
const project=compileMangaName(source,{title:'SCPと一服: speaker-tail regression'});
const panel=project.pages[0].panels[0];
assert.equal(panel.balloons.length,2);
const nanase=panel.characters.find(c=>c.name==='nanase');
const goldie=panel.characters.find(c=>c.name==='goldie');
assert.ok(nanase?.characterId&&goldie?.characterId);
assert.ok(panel.balloons.every(b=>b.speakerId===nanase.characterId),'both lines must belong to nanase');

const prompt=buildExecutablePrompt(project,0);
assert.match(prompt,/BALLOON 1: text=/);
assert.match(prompt,/BALLOON 2: text=/);
assert.ok(prompt.includes(`speakerId="${nanase.characterId}"`));
assert.ok(prompt.includes('tail must point to that speaker, not the listener'));
const plan=buildLetteringPlan(project,0);
assert.deepEqual(plan.entries.map(e=>e.speakerId),[nanase.characterId,nanase.characterId]);
const overlay=renderLetteringOverlaySvg(project,0);
assert.ok(overlay.includes(`data-speaker-id="${nanase.characterId}"`));
assert.ok(plan.entries.every(e=>e.text&&e.writingMode==='vertical-rl'));

function observedFrom(p){
  const original=p.pages[0].panels[0];
  return{
    coordinateSpace:'project',
    readingDirection:'rtl',
    defaultWritingMode:'vertical-rl',
    source:{kind:'manual',confidence:.98},
    panels:[{
      panelId:original.id,order:original.order,rect:original.rect,confidence:.98,
      characters:original.characters.map(c=>({characterId:c.characterId,name:c.name,anchor:{x:c.x,y:c.y},confidence:.98})),
      lettering:original.balloons.map(b=>({
        kind:'dialogue',text:b.text,writingMode:'vertical-rl',
        speakerId:b.speakerId,tailTargetId:b.speakerId,confidence:.98
      }))
    }]
  };
}
const requested=[...DEFAULT_OBSERVABLES,'balloon-speaker'];
const baseline=observedFrom(project);
let review=evaluateObservedGeneration(project,baseline,{observables:requested});
assert.ok(!review.diagnostics.some(d=>d.code.includes('speaker-mismatch')||d.code.includes('tail-target-mismatch')));
assert.equal(review.coverage.byObservable['balloon-speaker'],1);

const wrongSpeaker=structuredClone(baseline);
wrongSpeaker.panels[0].lettering[1].speakerId=goldie.characterId;
review=evaluateObservedGeneration(project,wrongSpeaker,{observables:requested});
assert.ok(review.diagnostics.some(d=>d.code==='balloon-speaker-mismatch'));
assert.equal(review.verdict,'drift');

const wrongTail=structuredClone(baseline);
wrongTail.panels[0].lettering[0].tailTargetId=goldie.characterId;
review=evaluateObservedGeneration(project,wrongTail,{observables:requested});
assert.ok(review.diagnostics.some(d=>d.code==='balloon-tail-target-mismatch'));
assert.equal(review.verdict,'drift');

const noSpeakerEvidence=structuredClone(baseline);
for(const b of noSpeakerEvidence.panels[0].lettering){
  delete b.speakerId;
  delete b.tailTargetId;
}
review=evaluateObservedGeneration(project,noSpeakerEvidence,{observables:requested});
assert.equal(review.coverage.byObservable['balloon-speaker'],0);
assert.notEqual(review.verdict,'good','missing speaker/tail observation must not pass an explicitly requested check');

const namedEntity=structuredClone(project);
namedEntity.pages[0].panels[0].balloons[0].text='酩酊街';
const wrongText=observedFrom(namedEntity);
wrongText.panels[0].lettering[0].text='酪町街';
review=evaluateObservedGeneration(namedEntity,wrongText,{observables:requested});
assert.ok(review.diagnostics.some(d=>d.code==='visible-text-mismatch'),'authored exact Japanese text must be checked');

console.log('EP004 speaker/tail/exact-text regressions passed.');
