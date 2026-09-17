#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { compileName, renderBlueprintSvg, buildPrompt } from '../core/blueprint-engine.mjs';

const args = process.argv.slice(2);
const input = args[0];
if (!input) {
  console.error('Usage: node cli/manga-blueprint.mjs <name.md> [out-dir]');
  process.exit(2);
}
const out = args[1] || 'blueprint-out';
const text = await fs.readFile(input, 'utf8');
const project = compileName(text, { title: path.basename(input, path.extname(input)) });
await fs.mkdir(out, { recursive: true });
await fs.writeFile(path.join(out, 'work.manga.json'), JSON.stringify(project, null, 2));
const files = ['work.manga.json'];
for (let i = 0; i < project.pages.length; i++) {
  const n = String(i + 1).padStart(3, '0');
  const svg = `P${n}.blueprint.svg`;
  const prompt = `P${n}.prompt.md`;
  await fs.writeFile(path.join(out, svg), renderBlueprintSvg(project, i));
  await fs.writeFile(path.join(out, prompt), buildPrompt(project, i));
  files.push(svg, prompt);
}
const manifest = {
  format: 'manga-blueprint-name-package/1',
  readFirst: 'manifest.json',
  source: path.basename(input),
  project: 'work.manga.json',
  pages: project.pages.map((p, i) => ({ pageId: p.id, pageNumber: p.pageNumber, blueprint: `P${String(i + 1).padStart(3, '0')}.blueprint.svg`, prompt: `P${String(i + 1).padStart(3, '0')}.prompt.md` }))
};
await fs.writeFile(path.join(out, 'manifest.json'), JSON.stringify(manifest, null, 2));
files.push('manifest.json');
console.log(`Compiled ${project.pages.length} page(s) -> ${out}`);
for (const file of files) console.log(`  ${file}`);
