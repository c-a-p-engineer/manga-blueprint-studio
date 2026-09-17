import assert from 'node:assert/strict';
import { compileName, parseName, renderBlueprintSvg, buildPrompt } from '../core/blueprint-engine.mjs';

const source = `# Page 1
コマ1: 少女がスマホを見る
セリフ: ……え？
コマ2: 画面の内容に気づく
強調: strong
コマ3: スマホを落とす
セリフ: そんな……
強調: climax`;

const parsed = parseName(source);
assert.equal(parsed.length, 1);
assert.equal(parsed[0].beats.length, 3);

const project = compileName(source, { title: 'validation' });
assert.equal(project.format, 'manga-blueprint/0.2');
assert.equal(project.pages.length, 1);
assert.equal(project.pages[0].panels.length, 3);
assert.equal(project.pages[0].panels[2].role, 'climax');
assert.equal(project.pages[0].panels[2].camera.distance, 'extreme-close');
assert.ok(project.pages[0].panels[2].rect.h > project.pages[0].panels[0].rect.h);
assert.match(renderBlueprintSvg(project), /^<svg/);
assert.match(buildPrompt(project), /TEXT TO RENDER: "そんな……"/);

console.log('Blueprint engine validation passed.');
