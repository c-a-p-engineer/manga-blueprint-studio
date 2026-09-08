# Product Contract

## Problem

Image-generation assistants can render manga-style images, but users should not need cinematography vocabulary, manual coordinate work, or repeated character re-entry just to communicate manga direction. Manga Blueprint Studio lets a human choose familiar page sizes and layout patterns, explicitly choose reading direction, reuse project-level character definitions, refine pose/camera/background/text/effects, then export an AI-safe visual reference plus semantic instructions.

## Primary user flow

1. Choose a named canvas/manuscript size and reading direction (`rtl` or `ltr`).
2. Choose a panel layout preset, or use Smart Random for an editable starting proposal.
3. Create/select reusable base characters and place them into panels.
4. Read the panel overview to understand each panel's role, pose, camera, background, dialogue count, and effects.
5. Refine camera/frame semantics, pose, expression, gaze, background, balloons, onomatopoeia, and effects.
6. Export a coordinated set: clean AI PNG + annotated review PNG + prompt + `.manga.json`, preferably as one ZIP package.

## Help and beginner terminology

The header **Help / 使い方** window is a maintained product guide, not a throwaway first-run tooltip. It must follow the selected UI language and cover the basic workflow, reading direction, reusable characters, stick-figure color meaning, background entry, camera vocabulary, and export package.

Professional camera terms remain available for interoperability, but the Japanese UI pairs them with plain language and a one-line explanation. Examples:

- `Extreme close / 超寄り` — 目・口・手・拳など一部を大きく見せる;
- `Close / 寄り` — 顔や胸元を中心に見せる;
- `Long / 引き` — 全身や位置関係を見せる;
- `Low angle / あおり` — 下から見上げ、強さや迫力を出す;
- `High angle / ふかん` — 上から見下ろし、弱さや全体配置を見せる.

## Canvas presets

The product ships clearly named starting sizes: `800×1130 Portrait` (default), 1:1, 4:5, 3:4, 9:16, 16:9, B5, A4, Webtoon, and custom dimensions. Ambiguous labels such as “current size” are not acceptable preset names.

Resizing an authored project scales panels, characters, and balloons proportionally instead of silently discarding them.

## Reading direction

Japanese right-to-left is the default. Left-to-right is selectable for other comic conventions or delivery needs. Changing direction keeps geometry and renumbers panels from current positions. Generated prompt direction must match the selected value.

## Layout presets

Common patterns include single panel, 2-panel, 3-panel, action, 4-koma vertical 1×4, 4-koma grid 2×2, horizontal 4×1, 5/6-panel patterns, conversation, dynamic action, and climax layouts. Templates are editable starting points, not a claim that a fixed layout is always correct.

## Base characters

A project can store reusable base-character definitions containing:

- `characterId`;
- editor display name;
- Character Sheet reference key;
- default pose;
- optional notes.

Placing a base character creates a panel-specific instance. The instance may then change pose, expression, gaze, placement, scale, and rotation independently. Older projects without a library derive non-destructive base definitions from existing placed characters when loaded.

## Stick-figure readability

The editor and annotated review PNG color-code anatomical regions so the pose can be understood quickly. Head, torso, arms, legs, and hands/feet are visually distinct. The clean AI PNG keeps stick figures monochrome so anatomy-guide colors are not interpreted as character appearance.

## Guided free-text background fields

Background location, weather, and mood provide suggestions while remaining free text. The user can choose a suggestion or type an arbitrary value. Presets assist entry; they are not a closed semantic vocabulary.

## Smart Random

Smart Random is constrained proposal generation, not arbitrary geometry. It accepts purpose (`action`, `conversation`, `gag`, `daily`, `climax`, `4-koma`) and optional panel count, selects a compatible layout, and seeds narrative roles/camera choices. Every result remains editable and identifiable in project metadata.

## Panel overview

Each panel has an authoring-only summary derived deterministically from semantic state: narrative role, major pose/expression, camera distance/angle in plain language, background location, balloon count, effects, and breakout. The summary appears in the editor and annotated review image, but never in the clean AI PNG.

## Export set

Individual downloads and the one-click ZIP must make same-state files easy to identify.

Filename prefix:

```text
<project-title>_YYYYMMDD_HHMMSS_<short-sha256>
```

For one unchanged editor state, clean PNG, annotated PNG, JSON, prompt, manifest, and ZIP reuse that prefix in the same browser session.

The ZIP contains:

- `<prefix>_clean.png`;
- `<prefix>_annotated.png`;
- `<prefix>.manga.json`;
- `<prefix>_prompt.txt`;
- `<prefix>_manifest.json`.

The manifest records an export UUID, full SHA-256 of serialized project state, short hash, timestamp, canvas, reading direction, and filenames. The shared state hash proves that the files were exported from the same serialized Manga Blueprint state; it is not a claim that rendered PNG byte hashes are identical across browsers.

## AI-safe boundary

The clean export keeps spatially meaningful graphics and removes authoring text such as character names, panel numbers, camera labels, panel summaries, balloon text, SFX text, and UI metadata. The prompt uses a strict `TEXT TO RENDER` allowlist.

## Acceptance criteria

- default 800×1130, 1:1, 4:5, 3:4, 9:16, 16:9, B5, A4, Webtoon and custom sizes are selectable with unambiguous labels;
- `rtl` is the default reading direction and `ltr` can be selected;
- changing reading direction renumbers panels without moving geometry;
- 4-koma includes 1×4 and 2×2 variants (plus horizontal 4×1);
- common layout presets create geometry proportional to the current canvas;
- Smart Random produces an editable layout constrained by purpose/panel count;
- reusable base characters can be created, edited, saved from a placed instance, and placed repeatedly;
- editor/review stick figures are anatomy-color-coded while clean AI figures are monochrome;
- background suggestions do not prevent arbitrary text entry;
- every panel is represented in an overview with a readable deterministic summary;
- camera controls display professional term + plain Japanese label + explanation;
- the formal help window follows the selected UI language and is reopenable;
- individual exports use collision-resistant timestamp + state-hash names;
- one-click ZIP includes clean/annotated PNG, JSON, prompt, and manifest;
- manifest provides UUID + full state hash linking the package files;
- mobile UI keeps the canvas and editing controls usable;
- legacy 0.1/older 0.2 data normalize without losing core layout semantics;
- clean AI PNG contains no authoring labels or panel summaries.
