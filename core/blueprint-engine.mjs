import crypto from 'node:crypto';

const PAGE_W = 1200;
const PAGE_H = 1697;
const M = 54;
const G = 24;

const id = (prefix, seed) => `${prefix}-${crypto.createHash('sha1').update(seed).digest('hex').slice(0, 10)}`;
const esc = (s = '') => String(s).replace(/[&<>\"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

export function parseName(text) {
  const pages = [];
  let page = { title: '', beats: [] };
  let beat = null;
  const flushBeat = () => { if (beat) page.beats.push(beat); beat = null; };
  const flushPage = () => { flushBeat(); if (page.beats.length) pages.push(page); page = { title: '', beats: [] }; };

  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('<!--')) continue;
    const pm = line.match(/^#{1,3}\s*(?:page|p|ページ)\s*(\d+)?\s*[:：-]?\s*(.*)$/i);
    if (pm) { flushPage(); page.title = pm[2] || ''; continue; }
    const bm = line.match(/^(?:[-*]\s*)?(?:panel|p|コマ)\s*\d+\s*[:：-]\s*(.+)$/i);
    if (bm) { flushBeat(); beat = { action: bm[1], dialogue: [], emphasis: 'normal' }; continue; }
    const dm = line.match(/^(?:dialogue|台詞|セリフ)\s*[:：]\s*(.+)$/i);
    if (dm) { if (!beat) beat = { action: '', dialogue: [], emphasis: 'normal' }; beat.dialogue.push(dm[1]); continue; }
    const em = line.match(/^(?:emphasis|強調)\s*[:：]\s*(normal|strong|climax|通常|強|クライマックス)/i);
    if (em) { if (!beat) beat = { action: '', dialogue: [], emphasis: 'normal' }; beat.emphasis = /climax|クライ/.test(em[1]) ? 'climax' : /strong|強/.test(em[1]) ? 'strong' : 'normal'; continue; }
    if (!beat) beat = { action: line.replace(/^[-*]\s*/, ''), dialogue: [], emphasis: 'normal' };
    else if (line.startsWith('>')) beat.dialogue.push(line.slice(1).trim());
    else beat.action += `${beat.action ? ' ' : ''}${line.replace(/^[-*]\s*/, '')}`;
  }
  flushPage();
  if (!pages.length) throw new Error('No manga beats found in name input.');
  return pages;
}

function layout(count, beats) {
  const x = M, y = M, w = PAGE_W - M * 2, h = PAGE_H - M * 2;
  if (count === 1) return [{ x, y, w, h }];
  if (count === 2) return [{ x, y, w, h: (h - G) * 0.45 }, { x, y: y + (h - G) * 0.45 + G, w, h: (h - G) * 0.55 }];
  if (count === 3) {
    const climax = beats[2]?.emphasis === 'climax';
    const topH = (h - G) * (climax ? 0.38 : 0.46);
    return [{ x: x + w / 2 + G / 2, y, w: w / 2 - G / 2, h: topH }, { x, y, w: w / 2 - G / 2, h: topH }, { x, y: y + topH + G, w, h: h - topH - G }];
  }
  const rows = Math.ceil(count / 2), cellH = (h - G * (rows - 1)) / rows, cellW = (w - G) / 2;
  return Array.from({ length: count }, (_, i) => { const r = Math.floor(i / 2), right = i % 2 === 0; return { x: right ? x + cellW + G : x, y: y + r * (cellH + G), w: cellW, h: cellH }; });
}

function cameraFor(beat, i) {
  const text = `${beat.action} ${beat.dialogue.join(' ')}`;
  const close = /顔|表情|目|手元|スマホ|アップ|close/i.test(text) || beat.emphasis !== 'normal';
  return { distance: close ? (beat.emphasis === 'climax' ? 'extreme-close' : 'close') : 'medium', angle: 'eye-level', viewpoint: 'three-quarter-front', focus: beat.action || `panel ${i + 1}`, intent: beat.emphasis === 'climax' ? 'climax emphasis' : 'story clarity' };
}

export function compileName(text, options = {}) {
  const parsed = parseName(text);
  const title = options.title || 'AI Manga Blueprint';
  const workId = id('work', `${title}:${text}`);
  const pages = parsed.map((src, pi) => {
    const rects = layout(src.beats.length, src.beats);
    return {
      id: id('page', `${workId}:${pi}`), pageNumber: pi + 1, order: pi + 1, title: src.title,
      panels: src.beats.map((b, i) => ({
        id: id('panel', `${workId}:${pi}:${i}`), order: i + 1, rect: rects[i], role: b.emphasis === 'climax' ? 'climax' : 'story', actionIntent: b.action,
        style: { border: b.emphasis === 'climax' ? 'impact' : 'normal', bleed: 'none', breakout: 'none' },
        camera: cameraFor(b, i),
        background: { location: '', timeOfDay: '', weather: '', mood: '', detailLevel: 'medium', renderMode: 'normal', notes: '' },
        effects: { lineEffect: b.emphasis === 'climax' ? 'impact' : 'none', strength: b.emphasis === 'normal' ? 'low' : 'high', sfxText: '', sfxStyle: '', notes: '' },
        characters: [],
        balloons: b.dialogue.map((t, bi) => ({ id: id('balloon', `${workId}:${pi}:${i}:${bi}`), type: 'speech', speakerId: '', text: t, writingMode: 'inherit', x: rects[i].x + rects[i].w * 0.72, y: rects[i].y + rects[i].h * 0.16, size: Math.max(70, Math.min(150, rects[i].w * 0.18)) }))
      }))
    };
  });
  return { format: 'manga-blueprint/0.2', meta: { workId, title, readingDirection: options.readingDirection || 'rtl', defaultWritingMode: 'vertical-rl', pageWidth: PAGE_W, pageHeight: PAGE_H, canvasPreset: 'B5-ish', layoutPreset: 'ai-name-compiler' }, containers: [], characterLibrary: [], pages };
}

export function renderBlueprintSvg(project, pageIndex = 0) {
  const page = project.pages[pageIndex];
  const panels = page.panels.map((p) => `<g><rect x="${p.rect.x}" y="${p.rect.y}" width="${p.rect.w}" height="${p.rect.h}" fill="white" stroke="black" stroke-width="8"/><text x="${p.rect.x + 20}" y="${p.rect.y + 42}" font-size="26" font-family="sans-serif">${esc(p.actionIntent).slice(0, 55)}</text>${p.balloons.map((b) => `<ellipse cx="${b.x}" cy="${b.y}" rx="${b.size * .65}" ry="${b.size}" fill="white" stroke="black" stroke-width="4"/><text x="${b.x}" y="${b.y}" text-anchor="middle" font-size="22" font-family="sans-serif">${esc(b.text).slice(0, 18)}</text>`).join('')}</g>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${project.meta.pageWidth}" height="${project.meta.pageHeight}" viewBox="0 0 ${project.meta.pageWidth} ${project.meta.pageHeight}"><rect width="100%" height="100%" fill="#ddd"/>${panels}</svg>`;
}

export function buildPrompt(project, pageIndex = 0) {
  const page = project.pages[pageIndex];
  return ['# Manga generation brief', `Work: ${project.meta.title}`, `Page: P${String(page.pageNumber).padStart(3, '0')}`, `Reading: ${project.meta.readingDirection}`, '', ...page.panels.flatMap((p) => [`## Panel ${p.order}`, `ACTION: ${p.actionIntent}`, `CAMERA: ${p.camera.distance}, ${p.camera.angle}, ${p.camera.viewpoint}`, `TEXT TO RENDER: ${p.balloons.map((b) => JSON.stringify(b.text)).join(', ') || '(none)'}`, ''])].join('\n');
}
