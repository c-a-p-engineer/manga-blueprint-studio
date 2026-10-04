import assert from 'node:assert/strict';
import fs from 'node:fs';
import { compileMangaName } from '../core/manga-grammar.mjs';

const source=fs.readFileSync('examples/action-name.md','utf8');
const a=compileMangaName(source,{title:'action-name'});
const b=compileMangaName(source,{title:'action-name'});
assert.deepEqual(a,b,'manga grammar compilation must be deterministic');
assert.equal(a.meta.compiler.name,'manga-expression-grammar');
const [p1,p2,p3,p4]=a.pages[0].panels;
assert.equal(p2.shape.preset,'diagonal-right');
assert.equal(p3.shape.preset,'diagonal-left');
assert.ok(p3.rect.h>p1.rect.h,'dominant panel should gain emphasis area');
const girl2=p2.characters.find(c=>c.name==='girl');
const boy2=p2.characters.find(c=>c.name==='boy');
assert.equal(girl2.poseId,'lean-forward reaching-right-hand');
assert.equal(girl2.gaze.target,'boy.left-shoulder');
assert.ok((girl2.depthOrder||0)>(boy2.depthOrder||0));
assert.equal(girl2.motionPhase,'approach');
assert.equal(p2.interactions[0].source.part,'right-hand');
assert.equal(p2.interactions[0].target.part,'left-shoulder');
assert.equal(p4.inset.parentPanelId,p3.id);
assert.equal(p4.inset.anchor,'top-left');
assert.equal(p4.inset.size,'small');
assert.equal(p4.style.border,'inset');
assert.equal(p2.actionIntent,'少女が相手の肩へ手を伸ばす');
assert.ok(!p2.actionIntent.includes('ポーズ:'),'advanced semantic fields must not leak into action intent');
for(const panel of a.pages[0].panels){
  for(const character of panel.characters){
    assert.ok(character.x>=panel.rect.x&&character.x<=panel.rect.x+panel.rect.w,`character ${character.name} x must follow solved panel geometry`);
    assert.ok(character.y>=panel.rect.y&&character.y<=panel.rect.y+panel.rect.h,`character ${character.name} y must follow solved panel geometry`);
  }
}
assert.ok(p4.characters[0].scale<girl2.scale,'inset character scale should reflow with the inset geometry');
console.log('Manga expression grammar validation passed.');
