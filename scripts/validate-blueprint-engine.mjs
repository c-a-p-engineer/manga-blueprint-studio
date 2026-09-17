import assert from 'node:assert/strict';
import { compileName, parseName, renderBlueprintSvg, buildPrompt, buildManifest } from '../core/blueprint-engine.mjs';

const source = `# Page 1: 受信
@layout: hero-bottom
@background: living room
@time: day
コマ1: 少女がスマホを見る
登場: girl@right
カメラ: close high-angle
セリフ: girl> ……え？
コマ2: 画面の内容に気づく
登場: girl@center
表情: girl> shock
強調: strong
コマ3: スマホを落とす
登場: girl@center
セリフ: girl> そんな……
効果音: ガタン
演出: impact
強調: climax`;

const parsed = parseName(source);
assert.equal(parsed.length, 1);
assert.equal(parsed[0].beats.length, 3);
assert.equal(parsed[0].directives.layout, 'hero-bottom');
assert.equal(parsed[0].beats[0].cast[0].token, 'girl');
assert.equal(parsed[0].beats[1].expressions.girl, 'shock');

const project = compileName(source, { title: 'validation' });
assert.equal(project.format, 'manga-blueprint/0.2');
assert.equal(project.characterLibrary.length, 1);
assert.equal(project.characterLibrary[0].name, 'girl');
assert.equal(project.pages.length, 1);
assert.equal(project.pages[0].panels.length, 3);
assert.equal(project.pages[0].panels[0].camera.angle, 'high-angle');
assert.equal(project.pages[0].panels[0].background.location, 'living room');
assert.equal(project.pages[0].panels[1].characters[0].expression.type, 'shock');
assert.equal(project.pages[0].panels[2].role, 'climax');
assert.equal(project.pages[0].panels[2].effects.sfxText, 'ガタン');
assert.equal(project.pages[0].panels[2].camera.distance, 'extreme-close');
assert.ok(project.pages[0].panels[2].rect.h > project.pages[0].panels[0].rect.h);
assert.match(renderBlueprintSvg(project), /^<svg/);
assert.match(renderBlueprintSvg(project, 0, { clean: true }), /^<svg/);
const prompt = buildPrompt(project);
assert.match(prompt, /TEXT TO RENDER/);
assert.match(prompt, /"そんな……"/);
assert.match(prompt, /"ガタン"/);
assert.doesNotMatch(renderBlueprintSvg(project, 0, { clean: true }), /そんな/);
const manifest = buildManifest(project, 'name.md');
assert.equal(manifest.format, 'manga-blueprint-name-package/2');
assert.equal(manifest.pages[0].cleanBlueprint, 'P001.clean.svg');
assert.equal(manifest.characters[0].needsRefinement, true);

console.log('Blueprint engine validation passed.');
