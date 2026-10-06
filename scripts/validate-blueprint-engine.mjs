import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { compileName, parseName, renderBlueprintSvg, buildPrompt, buildManifest } from '../core/blueprint-engine.mjs';
import { buildExecutablePrompt } from '../core/generation-brief.mjs';
import { renderExecutableNameSvg } from '../core/blueprint-renderer.mjs';

const source = `# Page 1: 受信
@layout: hero-bottom
@background: living room
@time: day
コマ1: 少女がスマホを見る
登場: girl@right
モブ: girl
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
assert.equal(parsed[0].beats[0].mobs[0], 'girl');
assert.equal(parsed[0].beats[1].expressions.girl, 'shock');

const project = compileName(source, { title: 'validation' });
const projectAgain = compileName(source, { title: 'validation' });
assert.deepEqual(projectAgain, project, 'fixed Name input must compile deterministically');
assert.equal(project.format, 'manga-blueprint/0.2');
assert.equal(project.characterLibrary.length, 1);
assert.equal(project.characterLibrary[0].name, 'girl');
assert.equal(project.pages.length, 1);
assert.equal(project.pages[0].panels.length, 3);
assert.equal(project.pages[0].panels[0].camera.angle, 'high-angle');
assert.equal(project.pages[0].panels[0].background.location, 'living room');
assert.equal(project.meta.readingDirection, 'rtl');
assert.equal(project.pages[0].panels[0].characters[0].characterRole, 'mob');
assert.equal(project.pages[0].panels[0].characters[0].renderDetail, 'simplified');
assert.equal(project.pages[0].panels[1].characters[0].characterRole, 'main');
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
const executablePrompt = buildExecutablePrompt(project);
assert.match(executablePrompt, /READING ORDER: right-to-left, then top-to-bottom/);
assert.match(executablePrompt, /Do not mirror or reinterpret it as left-to-right/);
assert.match(executablePrompt, /role=mob; detail=simplified/);
assert.match(executablePrompt, /omit detailed eyes, nose and mouth/);
const annotated = renderExecutableNameSvg(project, 0, { annotated: true });
assert.match(annotated, /読み順: RTL 右→左/);
assert.match(annotated, /data-character-role="mob"/);
assert.match(annotated, /（モブ）/);
const manifest = buildManifest(project, 'name.md');
assert.equal(manifest.format, 'manga-blueprint-name-package/2');
assert.equal(manifest.pages[0].cleanBlueprint, 'P001.clean.svg');
assert.equal(manifest.characters[0].needsRefinement, true);

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'manga-blueprint-'));
try {
  const input = path.join(tmp, 'sample.md');
  const out = path.join(tmp, 'out');
  fs.writeFileSync(input, source);
  const result = spawnSync(process.execPath, ['cli/manga-blueprint.mjs', input, out], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  const expectedFiles = ['manifest.json', 'work.manga.json', 'P001.clean.svg', 'P001.blueprint.svg', 'P001.prompt.md'];
  for (const file of expectedFiles) assert.ok(fs.existsSync(path.join(out, file)), `missing CLI output ${file}`);
  const cliProject = JSON.parse(fs.readFileSync(path.join(out, 'work.manga.json'), 'utf8'));
  const cliManifest = JSON.parse(fs.readFileSync(path.join(out, 'manifest.json'), 'utf8'));
  assert.equal(cliProject.format, 'manga-blueprint/0.2');
  assert.equal(cliManifest.format, 'manga-blueprint-name-package/2');
  assert.equal(cliManifest.pages[0].cleanBlueprint, 'P001.clean.svg');
  assert.equal(cliProject.pages[0].panels[0].characters[0].characterRole, 'mob');
  assert.match(fs.readFileSync(path.join(out, 'P001.prompt.md'), 'utf8'), /TEXT TO RENDER/);
  assert.match(fs.readFileSync(path.join(out, 'P001.prompt.md'), 'utf8'), /READING ORDER: right-to-left, then top-to-bottom/);
  assert.match(fs.readFileSync(path.join(out, 'P001.prompt.md'), 'utf8'), /role=mob; detail=simplified/);
  assert.doesNotMatch(fs.readFileSync(path.join(out, 'P001.clean.svg'), 'utf8'), /ガタン|そんな/);
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}

console.log('Blueprint engine validation passed.');
