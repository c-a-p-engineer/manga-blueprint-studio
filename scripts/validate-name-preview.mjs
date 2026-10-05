import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {compileMangaName} from '../core/manga-grammar.mjs';
import {renderExecutableNameSvg} from '../core/blueprint-renderer.mjs';
import {renderNamePreviewSvg} from '../core/name-preview-renderer.mjs';

const source=`# Page 1: 吹き出し確認
@layout: balanced-grid

コマ1: 通常会話
登場: a@right
セリフ: a> 通常のセリフです

コマ2: 小声
登場: a@center
小声: a> ここだけの話

コマ3: 思考
登場: a@center
思考: a> まさか……

コマ4: 叫ぶ
登場: a@center
叫び: a> 逃げろ！
効果音: ドン！

コマ5: ナレーション
ナレーション: 四月一日。

コマ6: 画面外の声
画面外: a> こっちだ！
`;

const project=compileMangaName(source,{title:'name-preview-validation'});
const page=project.pages[0];
assert.deepEqual(page.panels.map(p=>p.balloons[0]?.type),['speech','whisper','thought','shout','narration','offscreen']);
assert.equal(page.panels[5].characters.length,0,'offscreen dialogue must not auto-cast its speaker');
const clean=renderExecutableNameSvg(project,0,{annotated:false});
assert.doesNotMatch(clean,/逃げろ|四月一日|ドン！/,'clean spatial contract must remain text-free');
const preview=renderNamePreviewSvg(project,0);
for(const type of ['speech','whisper','thought','shout','narration','offscreen'])assert.match(preview,new RegExp(`data-name-balloon="${type}"`));
assert.match(preview,/ドン！/);

const temp=fs.mkdtempSync(path.join(os.tmpdir(),'manga-name-preview-'));
try{
  const input=path.join(temp,'sample.md'),out=path.join(temp,'out');
  fs.writeFileSync(input,source);
  const result=spawnSync(process.execPath,['cli/manga-blueprint.mjs',input,out],{encoding:'utf8'});
  assert.equal(result.status,0,result.stderr||result.stdout);
  for(const file of ['P001.clean.svg','P001.blueprint.svg','P001.name.svg','P001.prompt.md','manifest.json'])assert.ok(fs.existsSync(path.join(out,file)),`missing CLI output ${file}`);
  const manifest=JSON.parse(fs.readFileSync(path.join(out,'manifest.json'),'utf8'));
  assert.equal(manifest.pages[0].namePreview,'P001.name.svg');
  assert.match(fs.readFileSync(path.join(out,'P001.name.svg'),'utf8'),/data-name-balloon="offscreen"/);
}finally{fs.rmSync(temp,{recursive:true,force:true});}

console.log('Name preview: lettering, balloon types, offscreen semantics, CLI asset, and Clean separation passed.');
