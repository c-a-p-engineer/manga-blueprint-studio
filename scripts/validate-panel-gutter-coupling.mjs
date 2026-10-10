import assert from 'node:assert/strict';
import {compileMangaName,parseSemanticPanels} from '../core/manga-grammar.mjs';
import {buildExecutablePrompt} from '../core/generation-brief.mjs';
import {renderExecutableNameSvg} from '../core/blueprint-renderer.mjs';
const source=`# Page 1: paired border
@layout: hero-bottom
コマ1: 研究室
コマ2: トマトを眺める
コマ3: 寒い冗談
コマ4: トマト発射
境界: diagonal-right-strong
境界連動: paired
コマ5: 直撃する
`;
const a=compileMangaName(source,{title:'paired test'}),b=compileMangaName(source,{title:'paired test'});
assert.deepEqual(a,b,'identical semantic input must compile deterministically');
const page=a.pages[0],right=page.panels[2],left=page.panels[3];
assert.equal(left.shape.preset,'diagonal-right-strong');
assert.equal(right.shape.preset,'custom');
const gap=right.rect.x-(left.rect.x+left.rect.w);
assert.ok(gap>0,'base recipe gutter must be positive');
assert.ok(Math.abs(right.shape.points[0].x-left.shape.points[1].x-gap)<1e-6,'upper gutter is constant');
assert.ok(Math.abs(right.shape.points[3].x-left.shape.points[2].x-gap)<1e-6,'lower gutter is constant');
assert.equal(right.shape.points[1].x,right.rect.x+right.rect.w,'outer boundary stays fixed');
assert.equal(right.shape.points[2].x,right.rect.x+right.rect.w,'outer boundary stays fixed');
assert.equal(right.order,3);assert.equal(left.order,4);
assert.equal(page.layoutDecision.gutterCoupling.requests[0].status,'applied');
assert.ok(buildExecutablePrompt(a).includes('gutter-coupling=paired'));
assert.ok(renderExecutableNameSvg(a,0,{annotated:false}).includes('polygon'),'Clean renders paired geometry');
const independent=compileMangaName(source.replace('境界連動: paired','境界連動: independent'),{title:'paired test'});
assert.equal(independent.pages[0].panels[3].shape.preset,'diagonal-right-strong');
assert.notEqual(independent.pages[0].panels[2].shape?.preset,'custom','unrequested neighbor stays independent');
assert.ok(!independent.pages[0].layoutDecision.gutterCoupling,'no implicit coupling');
const noSibling=compileMangaName(source.replace('@layout: hero-bottom','@layout: vertical'),{title:'no sibling'});
assert.equal(noSibling.pages[0].layoutDecision.gutterCoupling.requests[0].status,'unresolved');
assert.notEqual(noSibling.pages[0].panels[2].shape?.preset,'custom');
const blocked=compileMangaName(source.replace('コマ3: 寒い冗談','コマ3: 寒い冗談\n境界: diagonal-left'),{title:'locked geometry'});
assert.equal(blocked.pages[0].layoutDecision.gutterCoupling.requests[0].status,'unresolved');
assert.equal(blocked.pages[0].panels[2].shape.preset,'diagonal-left');
assert.equal(parseSemanticPanels(source)[0].panels[3].boundaryCoupling,'paired');
assert.throws(()=>parseSemanticPanels(source.replace('境界連動: paired','境界連動: stack-adjust')),/Unsupported/);
console.log('Paired gutter: deterministic matching, 3/4 RTL reading, safe no-op and diagnostics passed.');
