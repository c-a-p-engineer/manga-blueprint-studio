# Product Contract

## Problem

Image-generation assistants can render manga-style images, but users should not need cinematography vocabulary or manual coordinate work just to communicate manga direction. Manga Blueprint Studio lets a human choose familiar page sizes and layout patterns, understand each panel at a glance, refine pose/camera/background/text/effects, then export an AI-safe visual reference plus semantic instructions.

## Primary user flow

1. Choose a canvas/manuscript size or keep the current 800×1130 canvas.
2. Choose a panel layout preset, or use Smart Random for an editable starting proposal.
3. Read the panel overview to understand each panel's role, pose, camera, background, dialogue count, and effects.
4. Select a panel and refine camera/frame semantics.
5. Place characters and define pose/expression/gaze.
6. Define background, balloons, onomatopoeia, and manga effects.
7. Export clean AI PNG + prompt + `.manga.json` (+ Character Sheets when supplied separately).

## Beginner-first terminology

Professional camera terms remain available for interoperability, but the Japanese UI must pair them with plain language and a one-line explanation. Examples:

- `Extreme close / 超寄り` — 目・口・手・拳など一部を大きく見せる;
- `Close / 寄り` — 顔や胸元を中心に見せる;
- `Long / 引き` — 全身や位置関係を見せる;
- `Low angle / あおり` — 下から見上げ、強さや迫力を出す;
- `High angle / ふかん` — 上から見下ろし、弱さや全体配置を見せる.

A first-run help dialog provides a four-step quick start and can be reopened from the header.

## Canvas presets

The product ships common starting sizes: current 800×1130, 1:1, 4:5, 3:4, 9:16, 16:9, B5, A4, Webtoon, and custom dimensions. Resizing an authored project scales panels, characters, and balloons proportionally instead of silently discarding them.

## Layout presets

Common patterns include single panel, 2-panel, 3-panel, action, 4-koma vertical 1×4, 4-koma grid 2×2, horizontal 4×1, 5/6-panel patterns, conversation, dynamic action, and climax layouts. Templates are editable starting points, not a claim that a fixed layout is always correct.

## Smart Random

Smart Random is constrained proposal generation, not arbitrary geometry. It accepts purpose (`action`, `conversation`, `gag`, `daily`, `climax`, `4-koma`) and optional panel count, selects a compatible layout, and seeds narrative roles/camera choices. Every result remains editable and is identifiable in project metadata.

## Panel overview

Each panel has an authoring-only summary derived deterministically from semantic state: narrative role, major pose/expression, camera distance/angle in plain language, background location, balloon count, effects, and breakout. The summary appears in the editor and annotated review image, but never in the clean AI PNG.

## AI-safe boundary

The clean export keeps spatially meaningful graphics and removes authoring text such as character names, panel numbers, camera labels, panel summaries, balloon text, SFX text, and UI metadata. The prompt uses a strict `TEXT TO RENDER` allowlist.

## Acceptance criteria

- current, 1:1, 4:5, 3:4, 9:16, 16:9, B5, A4, Webtoon and custom sizes are selectable;
- 4-koma includes 1×4 and 2×2 variants (plus horizontal 4×1);
- common layout presets create geometry proportional to the current canvas;
- Smart Random produces an editable layout constrained by purpose/panel count;
- every panel is represented in an overview with a readable deterministic summary;
- camera controls display professional term + plain Japanese label + explanation;
- first-use help is available and reopenable;
- mobile UI keeps the canvas and all editing tabs usable;
- legacy 0.1/older 0.2 data normalize without losing core layout semantics;
- clean AI PNG contains no authoring labels or panel summaries.
