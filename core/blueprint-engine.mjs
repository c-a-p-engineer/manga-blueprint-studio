import crypto from 'node:crypto';

const PAGE_W = 1200;
const PAGE_H = 1697;
const M = 54;
const G = 24;

const id = (prefix, seed) => `${prefix}-${crypto.createHash('sha1').update(seed).digest('hex').slice(0, 10)}`;
const esc = (s = '') => String(s).replace(/[&<>\"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const splitList = (value = '') => value.split(/[,、]/).map((v) => v.trim()).filter(Boolean);

function emptyBeat(action = '') {
  return { action, dialogue: [], emphasis: 'normal', cast: [], expressions: {}, camera: '', background: '', sfx: '', effect: '' };
}

function emptyPage() {
  return { title: '', directives: { layout: 'auto', background: '', time: '' }, beats: [] };
}

export function parseName(text) {
  const pages = [];
  let page = emptyPage();
  let beat = null;
  const ensureBeat = () => (beat ||= emptyBeat());
  const flushBeat = () => { if (beat && (beat.action || beat.dialogue.length || beat.cast.length)) page.beats.push(beat); beat = null; };
  const flushPage = () => { flushBeat(); if (page.beats.length) pages.push(page); page = emptyPage(); };

  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('<!--')) continue;
    const pm = line.match(/^#{1,3}\s*(?:page|p|ページ)\s*(\d+)?\s*[:：-]?\s*(.*)$/i);
    if (pm) { flushPage(); page.title = pm[2] || ''; continue; }
    const directive = line.match(/^@(layout|background|time)\s*[:：]\s*(.+)$/i);
    if (directive) { page.directives[directive[1].toLowerCase()] = directive[2].trim(); continue; }
    const bm = line.match(/^(?:[-*]\s*)?(?:panel|p|コマ)\s*\d+\s*[:：-]\s*(.+)$/i);
    if (bm) { flushBeat(); beat = emptyBeat(bm[1]); continue; }
    const dm = line.match(/^(?:dialogue|台詞|セリフ)\s*[:：]\s*(.+)$/i);
    if (dm) {
      const b = ensureBeat();
      const speaker = dm[1].match(/^([^>＞]+)[>＞]\s*(.+)$/);
      b.dialogue.push(speaker ? { speaker: speaker[1].trim(), text: speaker[2].trim() } : { speaker: '', text: dm[1] });
      continue;
    }
    const em = line.match(/^(?:emphasis|強調)\s*[:：]\s*(normal|strong|climax|通常|強|クライマックス)/i);
    if (em) { ensureBeat().emphasis = /climax|クライ/.test(em[1]) ? 'climax' : /strong|強/.test(em[1]) ? 'strong' : 'normal'; continue; }
    const cast = line.match(/^(?:cast|登場)\s*[:：]\s*(.+)$/i);
    if (cast) {
      ensureBeat().cast.push(...splitList(cast[1]).map((entry) => {
        const [token, slot = 'center'] = entry.split('@').map((v) => v.trim());
        return { token, slot };
      }));
      continue;
    }
    const expr = line.match(/^(?:expression|表情)\s*[:：]\s*(.+)$/i);
    if (expr) {
      const m = expr[1].match(/^([^>＞]+)[>＞]\s*(.+)$/);
      if (m) ensureBeat().expressions[m[1].trim()] = m[2].trim();
      continue;
    }
    const camera = line.match(/^(?:camera|カメラ)\s*[:：]\s*(.+)$/i);
    if (camera) { ensureBeat().camera = camera[1].trim(); continue; }
    const background = line.match(/^(?:background|背景)\s*[:：]\s*(.+)$/i);
    if (background) { ensureBeat().background = background[1].trim(); continue; }
    const sfx = line.match(/^(?:sfx|効果音)\s*[:：]\s*(.+)$/i);
    if (sfx) { ensureBeat().sfx = sfx[1].trim(); continue; }
    const effect = line.match(/^(?:effect|演出)\s*[:：]\s*(.+)$/i);
    if (effect) { ensureBeat().effect = effect[1].trim(); continue; }
    if (!beat) beat = emptyBeat(line.replace(/^[-*]\s*/, ''));
    else if (line.startsWith('>')) beat.dialogue.push({ speaker: '', text: line.slice(1).trim() });
    else beat.action += `${beat.action ? ' ' : ''}${line.replace(/^[-*]\s*/, '')}`;
  }
  flushPage();
  if (!pages.length) throw new Error('No manga beats found in name input.');
  return pages;
}

function layout(count, beats, hint = 'auto') {
  const x = M, y = M, w = PAGE_W - M * 2, h = PAGE_H - M * 2;
  if (count === 1) return [{ x, y, w, h }];
  if (hint === 'vertical') {
    const cellH = (h - G * (count - 1)) / count;
    return Array.from({ length: count }, (_, i) => ({ x, y: y + i * (cellH + G), w, h: cellH }));
  }
  if (hint === 'hero-top' && count >= 2) {
    const heroH = h * .48;
    const rest = layout(count - 1, beats.slice(1), 'grid').map((r) => ({ ...r, y: y + heroH + G, h: r.h * .48 }));
    return [{ x, y, w, h: heroH }, ...rest];
  }
  if (count === 2) return [{ x, y, w, h: (h - G) * 0.45 }, { x, y: y + (h - G) * 0.45 + G, w, h: (h - G) * 0.55 }];
  if ((hint === 'hero-bottom' || hint === 'auto') && count === 3) {
    const climax = beats[2]?.emphasis === 'climax';
    const topH = (h - G) * (climax ? 0.38 : 0.46);
    return [{ x: x + w / 2 + G / 2, y, w: w / 2 - G / 2, h: topH }, { x, y, w: w / 2 - G / 2, h: topH }, { x, y: y + topH + G, w, h: h - topH - G }];
  }
  const rows = Math.ceil(count / 2), cellH = (h - G * (rows - 1)) / rows, cellW = (w - G) / 2;
  return Array.from({ length: count }, (_, i) => { const r = Math.floor(i / 2), right = i % 2 === 0; return { x: right ? x + cellW + G : x, y: y + r * (cellH + G), w: cellW, h: cellH }; });
}

function cameraFor(beat, i) {
  const dialogue = beat.dialogue.map((d) => d.text).join(' ');
  const text = `${beat.action} ${dialogue} ${beat.camera}`;
  let distance = /extreme[- ]?close|超アップ/i.test(text) ? 'extreme-close' : /close|アップ|顔|表情|目|手元|スマホ/i.test(text) ? 'close' : /long|引き|全景/i.test(text) ? 'long' : 'medium';
  if (beat.emphasis === 'climax' && !/long|引き|全景/i.test(beat.camera)) distance = 'extreme-close';
  const angle = /high|俯瞰|ハイアングル/i.test(text) ? 'high-angle' : /low|煽り|ローアングル/i.test(text) ? 'low-angle' : /dutch|斜め/i.test(text) ? 'dutch-angle' : 'eye-level';
  const viewpoint = /pov|主観/i.test(text) ? 'pov' : /back|背面|後ろ/i.test(text) ? 'back' : /side|横/i.test(text) ? 'side' : 'three-quarter-front';
  return { distance, angle, viewpoint, focus: beat.action || `panel ${i + 1}`, intent: beat.emphasis === 'climax' ? 'climax emphasis' : 'story clarity' };
}

function slotPosition(slot, rect, index, total) {
  const xBySlot = { left: .25, center: .5, right: .75, foreground: .5, background: .5 };
  const baseX = xBySlot[slot] ?? ((index + 1) / (total + 1));
  return {
    x: rect.x + rect.w * baseX,
    y: rect.y + rect.h * (slot === 'foreground' ? .72 : slot === 'background' ? .52 : .68),
    scale: slot === 'foreground' ? 1.2 : slot === 'background' ? .72 : 1
  };
}

function lineEffect(effect, emphasis) {
  const text = effect.toLowerCase();
  if (/speed|速度|流線/.test(text)) return 'speed';
  if (/focus|集中/.test(text)) return 'focus';
  if (/tension|緊張/.test(text)) return 'tension';
  if (/silence|静寂|無音/.test(text)) return 'silence';
  if (/impact|衝撃/.test(text) || emphasis === 'climax') return 'impact';
  return 'none';
}

export function compileName(text, options = {}) {
  const parsed = parseName(text);
  const title = options.title || 'AI Manga Blueprint';
  const workId = id('work', `${title}:${text}`);
  const characterTokens = [...new Set(parsed.flatMap((p) => p.beats.flatMap((b) => [
    ...b.cast.map((c) => c.token),
    ...b.dialogue.map((d) => d.speaker),
    ...Object.keys(b.expressions)
  ])).filter(Boolean))];
  const characterLibrary = characterTokens.map((token) => ({
    characterId: id('char', `${workId}:${token}`), name: token, referenceKey: token, poseId: 'standing-neutral', identityMode: 'description',
    appearance: { summary: '', hair: '', eyes: '', outfit: '', features: '' }, notes: 'AI Name DSL placeholder; refine identity before final generation when needed.'
  }));
  const charByToken = new Map(characterLibrary.map((c) => [c.name, c]));

  const pages = parsed.map((src, pi) => {
    const rects = layout(src.beats.length, src.beats, src.directives.layout);
    return {
      id: id('page', `${workId}:${pi}`), pageNumber: pi + 1, order: pi + 1, title: src.title,
      panels: src.beats.map((b, i) => {
        const rect = rects[i];
        const cast = b.cast.length ? b.cast : [...new Set(b.dialogue.map((d) => d.speaker).filter(Boolean))].map((token) => ({ token, slot: 'center' }));
        const characters = cast.map((entry, ci) => {
          const base = charByToken.get(entry.token);
          const pos = slotPosition(entry.slot, rect, ci, cast.length);
          return {
            id: id('placed', `${workId}:${pi}:${i}:${entry.token}:${ci}`), characterId: base.characterId, name: base.name, referenceKey: base.referenceKey,
            x: pos.x, y: pos.y, scale: pos.scale, rotation: 0, poseId: 'standing-neutral', supportState: 'grounded', motionPhase: 'still',
            expression: { type: b.expressions[entry.token] || 'neutral', intensity: b.expressions[entry.token] ? .75 : .3, notes: '' },
            gaze: { target: '', notes: '' }
          };
        });
        const background = b.background || src.directives.background;
        const effectType = lineEffect(b.effect, b.emphasis);
        return {
          id: id('panel', `${workId}:${pi}:${i}`), order: i + 1, rect, role: b.emphasis === 'climax' ? 'climax' : 'story', actionIntent: b.action,
          style: { border: b.emphasis === 'climax' ? 'impact' : 'normal', bleed: 'none', breakout: 'none' },
          camera: cameraFor(b, i),
          background: { location: background, timeOfDay: src.directives.time, weather: '', mood: '', detailLevel: background ? 'medium' : 'low', renderMode: 'normal', notes: '' },
          effects: { lineEffect: effectType, strength: b.emphasis === 'normal' && effectType === 'none' ? 'low' : 'high', sfxText: b.sfx, sfxStyle: '', sfxWritingMode: 'inherit', notes: b.effect },
          characters,
          balloons: b.dialogue.map((d, bi) => {
            const speaker = charByToken.get(d.speaker);
            const rightToLeftOffset = bi % 2 === 0 ? .76 : .28;
            return { id: id('balloon', `${workId}:${pi}:${i}:${bi}`), type: 'speech', speakerId: speaker?.characterId || '', text: d.text, writingMode: 'inherit', x: rect.x + rect.w * rightToLeftOffset, y: rect.y + rect.h * (.14 + bi * .15), size: Math.max(70, Math.min(150, rect.w * .18)) };
          })
        };
      })
    };
  });
  return { format: 'manga-blueprint/0.2', meta: { workId, title, readingDirection: options.readingDirection || 'rtl', defaultWritingMode: 'vertical-rl', pageWidth: PAGE_W, pageHeight: PAGE_H, canvasPreset: 'B5-ish', layoutPreset: 'ai-name-compiler', workBrief: { purpose: 'AI/human co-authored manga name compilation', sourceNotes: 'Compiled from AI Name DSL.' } }, containers: [], characterLibrary, pages };
}

export function renderBlueprintSvg(project, pageIndex = 0, { clean = false } = {}) {
  const page = project.pages[pageIndex];
  const panels = page.panels.map((p) => {
    const figures = p.characters.map((c) => {
      const head = 22 * c.scale;
      const torso = 62 * c.scale;
      return `<g stroke="black" stroke-width="5" fill="none"><circle cx="${c.x}" cy="${c.y - torso - head}" r="${head}"/><line x1="${c.x}" y1="${c.y - torso}" x2="${c.x}" y2="${c.y}"/><line x1="${c.x}" y1="${c.y - torso * .7}" x2="${c.x - 34 * c.scale}" y2="${c.y - torso * .25}"/><line x1="${c.x}" y1="${c.y - torso * .7}" x2="${c.x + 34 * c.scale}" y2="${c.y - torso * .25}"/><line x1="${c.x}" y1="${c.y}" x2="${c.x - 25 * c.scale}" y2="${c.y + 55 * c.scale}"/><line x1="${c.x}" y1="${c.y}" x2="${c.x + 25 * c.scale}" y2="${c.y + 55 * c.scale}"/></g>`;
    }).join('');
    const notes = clean ? '' : `<text x="${p.rect.x + 20}" y="${p.rect.y + 42}" font-size="26" font-family="sans-serif">${esc(p.actionIntent).slice(0, 55)}</text>`;
    const balloons = p.balloons.map((b) => `<ellipse cx="${b.x}" cy="${b.y}" rx="${b.size * .65}" ry="${b.size}" fill="white" stroke="black" stroke-width="4"/>${clean ? '' : `<text x="${b.x}" y="${b.y}" text-anchor="middle" font-size="22" font-family="sans-serif">${esc(b.text).slice(0, 18)}</text>`}`).join('');
    return `<g><rect x="${p.rect.x}" y="${p.rect.y}" width="${p.rect.w}" height="${p.rect.h}" fill="white" stroke="black" stroke-width="8"/>${notes}${figures}${balloons}</g>`;
  }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${project.meta.pageWidth}" height="${project.meta.pageHeight}" viewBox="0 0 ${project.meta.pageWidth} ${project.meta.pageHeight}"><rect width="100%" height="100%" fill="#ddd"/>${panels}</svg>`;
}

export function buildPrompt(project, pageIndex = 0) {
  const page = project.pages[pageIndex];
  const textToRender = page.panels.flatMap((p) => [...p.balloons.map((b) => b.text), ...(p.effects.sfxText ? [p.effects.sfxText] : [])]);
  return [
    '# Manga generation brief',
    `Work: ${project.meta.title}`,
    `Page: P${String(page.pageNumber).padStart(3, '0')}`,
    `Reading: ${project.meta.readingDirection}`,
    '',
    '## PRESERVE EXACTLY',
    '- panel count and panel geometry from the clean blueprint',
    '- reading order',
    '- only the exact strings listed under TEXT TO RENDER may appear as visible text',
    '',
    '## TEXT TO RENDER',
    ...(textToRender.length ? textToRender.map((t) => `- ${JSON.stringify(t)}`) : ['- (none)']),
    '',
    ...page.panels.flatMap((p) => [
      `## Panel ${p.order}`,
      `ACTION: ${p.actionIntent}`,
      `CAMERA: ${p.camera.distance}, ${p.camera.angle}, ${p.camera.viewpoint}`,
      `BACKGROUND: ${p.background.location || '(unspecified)'} ${p.background.timeOfDay || ''}`.trim(),
      `CAST: ${p.characters.map((c) => `${c.name} [${c.expression.type}]`).join(', ') || '(none)'}`,
      `EFFECT: ${p.effects.lineEffect}${p.effects.sfxText ? `; SFX ${JSON.stringify(p.effects.sfxText)}` : ''}`,
      ''
    ])
  ].join('\n');
}

export function buildManifest(project, sourceName = 'name.md') {
  return {
    format: 'manga-blueprint-name-package/2',
    readFirst: 'manifest.json',
    source: sourceName,
    project: 'work.manga.json',
    authority: {
      semantic: 'work.manga.json',
      spatial: 'Pxxx.clean.svg',
      generationInstructions: 'Pxxx.prompt.md',
      visibleText: 'TEXT TO RENDER section in each page prompt'
    },
    characters: project.characterLibrary.map((c) => ({ characterId: c.characterId, token: c.name, identityMode: c.identityMode, needsRefinement: !c.appearance?.summary })),
    pages: project.pages.map((p, i) => ({
      pageId: p.id,
      pageNumber: p.pageNumber,
      cleanBlueprint: `P${String(i + 1).padStart(3, '0')}.clean.svg`,
      annotatedBlueprint: `P${String(i + 1).padStart(3, '0')}.blueprint.svg`,
      prompt: `P${String(i + 1).padStart(3, '0')}.prompt.md`
    }))
  };
}
