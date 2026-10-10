#!/usr/bin/env node
// Rerasterize an already compiled manga package without re-solving Name DSL.
// The canonical project, panel IDs, and human-authored geometry are unchanged.
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { rasterizeSvg } from '../core/svg-rasterizer.mjs';
import { buildPortableGenerationPackage } from '../core/generation-adapter.mjs';

const [dir, ...flags] = process.argv.slice(2);
if (!dir || flags.length > 2 || (flags.length && (flags[0] !== '--page' || !flags[1]))) {
  console.error('Usage: node cli/rasterize-existing.mjs <compiled-dir> [--page P001]');
  process.exit(2);
}
const base = path.resolve(dir);
const pageFilter = flags.length ? Number(String(flags[1]).replace(/^P/i, '')) : null;
if (pageFilter !== null && (!Number.isInteger(pageFilter) || pageFilter < 1)) {
  throw new Error('Invalid page: ' + flags[1]);
}
const inside = (filename) => {
  if (!/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(filename)) throw new Error('Unsafe filename: ' + filename);
  return path.join(base, filename);
};
const json = (name) => JSON.parse(fs.readFileSync(inside(name), 'utf8'));
const file = (name) => fs.readFileSync(inside(name), 'utf8');
const write = (name, value) => fs.writeFileSync(inside(name), JSON.stringify(value, null, 2) + '\n');
const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const pngMagic = Buffer.from([137,80,78,71,13,10,26,10]);

function validPng(name, expectedWidth, expectedHeight) {
  const bytes = fs.readFileSync(inside(name));
  return bytes.length > 24 && bytes.subarray(0, 8).equals(pngMagic)
    && bytes.readUInt32BE(16) === expectedWidth && bytes.readUInt32BE(20) === expectedHeight;
}
function svgSize(source) {
  const tag = source.match(/<svg\b[^>]*>/i)?.[0] ?? '';
  const read = (key) => Number(tag.match(new RegExp('\\b' + key + '=["\']([0-9.]+)["\']'))?.[1]);
  return {width:read('width'), height:read('height')};
}
function sourceNames(n) {
  const p = 'P' + String(n).padStart(3, '0');
  return {p, variants:['clean', 'blueprint', 'lettering', 'clean-lettered'].map(kind => [p + '.' + kind + '.svg', p + '.' + kind + '.png'])};
}

const manifest = json('manifest.json');
const project = json(manifest.project);
if (!Array.isArray(manifest.pages) || !Array.isArray(project.pages) || manifest.pages.length !== project.pages.length) {
  throw new Error('Manifest/project page counts differ');
}
const allPages = manifest.pages.map((m, i) => ({manifestPage:m, page:project.pages[i], i}));
const selected = pageFilter === null ? allPages : allPages.filter(({manifestPage}) => manifestPage.pageNumber === pageFilter);
if (!selected.length) throw new Error('No matching compiled page');

const pending = [];
try {
  for (const {manifestPage:m, page, i} of selected) {
    if (!page || page.id !== m.pageId || !Array.isArray(page.panels) || page.panels.length === 0) {
      throw new Error('Page identity/panel mismatch at index ' + i);
    }
    const {p, variants} = sourceNames(m.pageNumber);
    const cleanSvg = file(variants[0][0]);
    const actualIds = [...cleanSvg.matchAll(/<clipPath\s+id="clip-panel-([^" ]+)"/g)].map(v => v[1]);
    const expectedIds = page.panels.map(panel => panel.id);
    if (actualIds.length !== expectedIds.length || actualIds.some((id, j) => id !== expectedIds[j].replace(/^panel-/, ''))) {
      throw new Error(p + ': SVG panel clips do not match canonical project IDs/order');
    }
    const dims = {width:project.meta.pageWidth, height:project.meta.pageHeight};
    if (svgSize(cleanSvg).width !== dims.width || svgSize(cleanSvg).height !== dims.height) {
      throw new Error(p + ': SVG dimensions differ from work.manga.json');
    }
    const letteringPlan = json(p + '.lettering.json');
    if (letteringPlan.pageId !== page.id) throw new Error(p + ': lettering page ID mismatch');
    if (!file(p + '.prompt.md').includes('## Panel 1')) throw new Error(p + ': missing executable page prompt');
    const results = [];
    const staged = [];
    for (const [svg, png] of variants) {
      const svgData = file(svg);
      const s = svgSize(svgData);
      if (s.width !== dims.width || s.height !== dims.height) throw new Error(p + ': mismatched SVG dimensions: ' + svg);
      const hash = sha256(svgData);
      const previous = (manifest.rasterization?.results || []).find(r => r.source === svg);
      if (previous?.ok && previous.sourceSha256 === hash && fs.existsSync(inside(png)) && validPng(png, dims.width, dims.height)) {
        results.push({...previous, cacheHit:true});
        continue;
      }
      const temporary = png.replace(/\.png$/, '.stage-' + process.pid + '.png');
      pending.push(temporary);
      staged.push([temporary, png]);
      const result = rasterizeSvg(inside(svg), inside(temporary));
      if (!result.ok || !validPng(temporary, dims.width, dims.height)) {
        throw new Error(p + ': required PNG conversion failed: ' + svg + ': ' + (result.reason || result.engine));
      }
      results.push({source:svg, output:png, ok:true, engine:result.engine, sourceSha256:hash});
    }
    const old = json(p + '.generation.json');
    if (old.request?.pageId !== page.id) throw new Error(p + ': generation request page mismatch');
    const inp = old.request.inputs;
    if (inp.cleanAsset !== variants[0][1] || inp.letteringAsset !== variants[2][1] || inp.letteringPlan !== p + '.lettering.json' || inp.prompt !== p + '.prompt.md') {
      throw new Error(p + ': generation package expects a different asset revision');
    }
    const pkg = buildPortableGenerationPackage({
      project, pageIndex:i,
      cleanAsset:inp.cleanAsset, prompt:inp.prompt,
      referenceAssets:inp.references || [],
      repairContext:old.request.repairContext || null,
      letteringAsset:inp.letteringAsset, letteringPlan:inp.letteringPlan,
      cleanLetteredAsset:inp.cleanLetteredAsset
    });
    pending.push({p, variants, results, pkg, staged});
  }
  // Convert into temporary PNG files first. Never publish half a page bundle.
  for (const entry of pending.filter(item => typeof item === 'object')) {
    for (const [tmp, png] of entry.staged) fs.renameSync(inside(tmp), inside(png));
    entry.pkg.rasterizationStatus = 'complete-from-canonical-svg';
    write(entry.p + '.generation.json', entry.pkg);
  }
  const records = pending.filter(item => typeof item === 'object').flatMap(item => item.results);
  const seen = new Set(records.map(item => item.source));
  const previous = (manifest.rasterization?.results || []).filter(item => !seen.has(item.source));
  const all = [...previous, ...records];
  const required = allPages.flatMap(({manifestPage}) => sourceNames(manifestPage.pageNumber).variants.map(([svg]) => svg));
  const complete = required.every(svg => {
    const item = all.find(result => result.source === svg && result.ok && result.sourceSha256);
    if (!item || !fs.existsSync(inside(svg)) || !fs.existsSync(inside(item.output))) return false;
    const expected = svgSize(file(svg));
    return item.sourceSha256 === sha256(file(svg)) && validPng(item.output, expected.width, expected.height);
  });
  manifest.rasterization = {mode:'required-local', status:complete?'complete':'partial', results:all};
  manifest.compileProvenance = {...manifest.compileProvenance, rasterizationStatus:manifest.rasterization.status};
  write('manifest.json', manifest);
  console.log('Rasterized ' + records.length + ' PNG assets from current canonical SVGs -> ' + base);
  for (const r of records) console.log('  ' + r.source + ' -> ' + r.output + ' (' + (r.cacheHit ? 'cached' : r.engine) + ')');
  if (manifest.contactSheet) console.warn('Existing Contact Sheet assets were not updated; recompile contact sheets before reuse.');
  if (!complete) console.warn('Not all pages are rasterized; manifest remains partial.');
} finally {
  for (const name of pending.filter(x => typeof x === 'string')) {
    try { fs.rmSync(inside(name), {force:true}); } catch { /* temp cleanup */ }
  }
}
