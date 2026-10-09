import assert from 'node:assert/strict';
import {compileMangaName} from '../core/manga-grammar.mjs';
import {buildLetteringPlan,renderLetteringOverlaySvg} from '../core/lettering-renderer.mjs';
import {renderExecutableNameSvg} from '../core/blueprint-renderer.mjs';
import {buildExecutablePrompt} from '../core/generation-brief.mjs';
const dsl=`# Page 1: Metadata only
@layout: hero-bottom
@page-title: 世界征服、初戦敗退。
コマ1: 開始
セリフ: a>こんにちは
コマ2: 応答
セリフ: b>敵だ！
コマ3: 反応
コマ4: 傾いて転ぶ
境界: diagonal-right-strong
コマ5: 倒れる
`;
const project=compileMangaName(dsl,{title:'title-frame-regression'});
const page=project.pages[0],panel=page.panels[3],poly=panel.shape?.points;
assert.equal(page.visibleTitle,'世界征服、初戦敗退。');
assert.equal(page.panels.length,5);
assert.equal(panel.shape?.preset,'diagonal-right-strong');
assert.equal(poly?.length,4);
assert(panel.rect.x+panel.rect.w-poly[1].x>panel.rect.w*.13);
assert.equal(poly[3].x,panel.rect.x);
const title=buildLetteringPlan(project,0).entries.find(e=>e.kind==='title');
assert.equal(title?.text,page.visibleTitle);
assert.equal(title.glyphs.length,Array.from(page.visibleTitle).length);
assert.equal(title.panelId,null);
assert(renderLetteringOverlaySvg(project,0).includes('data-lettering-kind="title"'));
assert(!renderExecutableNameSvg(project,0,{annotated:false}).includes(page.visibleTitle));
assert(renderExecutableNameSvg(project,0,{annotated:true}).includes('data-lettering-kind="title"'));
assert(buildExecutablePrompt(project,0).includes('VISIBLE PAGE TITLE'));
const normal=compileMangaName(dsl.replace('@page-title: 世界征服、初戦敗退。','').replace('diagonal-right-strong','diagonal-right'),{title:'title-frame-control'});
assert(!normal.pages[0].visibleTitle);
assert(normal.pages[3]===undefined);
assert(normal.pages[0].panels[3].shape.points[3].x!==normal.pages[0].panels[3].rect.x);
console.log('Strong frame + exact page title: OK');
