# Product Contract

## Problem

Image-generation assistants can render manga-style images, but users should not need cinematography vocabulary, manual coordinate work, repeated character re-entry, or a risky bundle of authoring labels just to communicate manga direction. Manga Blueprint Studio lets a human choose familiar page sizes and layout patterns, explicitly choose reading direction, reuse project-level character definitions, refine pose/camera/background/text/effects, compare bounded Smart Manga proposals, then export an AI-safe visual reference plus semantic instructions.

## Primary user flow

1. Choose a named canvas/manuscript size and reading direction (`rtl` or `ltr`).
2. Choose a panel layout preset, or open **Smart Manga / おまかせ漫画** and compare three editable candidates before applying one.
3. Create/select reusable base characters and place them into panels, or let Smart Manga place the selected base character across the chosen candidate.
4. Read the panel overview to understand each panel's role, pose, camera, background, dialogue count, and effects.
5. Refine camera/frame semantics, pose, expression, gaze, background, balloons, onomatopoeia, and effects. Re-roll only the selected panel's direction when useful.
6. Export the **AI generation ZIP** for image-generation handoff. Use the separate **Review / archive ZIP** when the annotated review image is needed for human checking or storage.

## Help and beginner terminology

The header **Help / 使い方** window is a maintained product guide, not a throwaway first-run tooltip. It follows the selected UI language and covers the basic workflow, reading direction, reusable characters, stick-figure color meaning, background entry, Smart Manga, camera vocabulary, and export-package separation.

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

Japanese right-to-left is the default. Left-to-right is selectable for other comic conventions or delivery needs. Changing direction keeps geometry and renumbers panels from current positions. Smart Manga preview numbering and generated prompt direction must match the selected value.

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

Smart Manga can optionally place the currently selected base character into every proposed panel. This is opt-in and never replaces the base definition itself.

## Stick-figure readability

The editor and annotated review PNG color-code anatomical regions so the pose can be understood quickly. Head, torso, arms, legs, and hands/feet are visually distinct. The clean AI PNG keeps stick figures monochrome so anatomy-guide colors are not interpreted as character appearance.

## Guided free-text background fields

Background location, weather, and mood provide suggestions while remaining free text. The user can choose a suggestion or type an arbitrary value. Presets assist entry; they are not a closed semantic vocabulary.

## Smart Manga

Smart Manga is constrained proposal generation, not arbitrary geometry.

Inputs:

- purpose (`action`, `conversation`, `gag`, `daily`, `climax`, `4-koma`, or auto);
- optional panel count;
- whether to preserve the current canvas size;
- optional placement of the selected base character;
- reproducible text seed.

Behavior:

1. Build three candidates from compatible shipped layout patterns.
2. Give each candidate a direction emphasis (`balanced`, `dynamic`, or `emotion`).
3. Preview layout, reading-order numbers, camera flow, and pose flow without changing the current page.
4. Apply only the candidate explicitly selected by the user.
5. Store the selected purpose, seed, and variant in project metadata.
6. Seed narrative roles, camera choices, effects/background treatment, and — when a base character is placed — pose/expression/gaze.

The same seed + purpose + panel-count inputs reproduce the same three proposals, subject to the shipped profile catalog remaining unchanged.

## Selected-panel direction dice

The panel-level **🎲** action is deliberately narrower than Smart Manga. It keeps:

- panel geometry;
- current background content;
- balloons/dialogue;
- narrative role.

It re-proposes:

- camera distance/angle/viewpoint;
- effects and optional climax breakout;
- pose/expression/gaze for already placed characters.

The action is undoable and records an optional `assistSeed` for provenance.

## Panel overview

Each panel has an authoring-only summary derived deterministically from semantic state: narrative role, major pose/expression, camera distance/angle in plain language, background location, balloon count, effects, and breakout. The summary appears in the editor and annotated review image, but never in the clean AI PNG.

## Export set and filenames

Individual downloads and ZIP packages must make same-state files easy to identify.

Filename prefix:

```text
<project-title>_YYYYMMDD_HHMMSS_<short-sha256>
```

For one unchanged editor state, clean PNG, annotated PNG, JSON, prompt, manifest, and ZIP variants reuse that prefix in the same browser session.

The manifest records an export UUID, full SHA-256 of serialized project state, short hash, timestamp, canvas, reading direction, package type, and filenames. The shared state hash proves that files were exported from the same serialized Manga Blueprint state; it is not a claim that rendered PNG byte hashes are identical across browsers.

## AI generation ZIP

This is the recommended package for ChatGPT or another image-generation assistant.

Contents:

- `<prefix>_clean.png`;
- `<prefix>.manga.json`;
- `<prefix>_prompt.txt`;
- `<prefix>_manifest.json`.

**The annotated review PNG is intentionally excluded.** Removing that image from the model input is preferred to merely asking the model to ignore visible authoring labels.

The generation prompt additionally states that the clean PNG is the visual composition reference and that any separately supplied annotated/review image is authoring metadata only.

## Review / archive ZIP

This package is for human review, debugging, and archival storage. It contains the same state-linked files as the AI generation ZIP plus:

- `<prefix>_annotated.png`.

A review/archive ZIP may be discussed with an assistant, but it is not the recommended direct image-generation input.

## AI-safe boundary

The clean export keeps spatially meaningful graphics and removes authoring text such as character names, panel numbers, camera labels, panel summaries, balloon text, SFX text, and UI metadata. The prompt uses a strict `TEXT TO RENDER` allowlist.

Annotated/review output is a human-facing artifact. Its authoring labels are never final-art text.

## Acceptance criteria

- default 800×1130, 1:1, 4:5, 3:4, 9:16, 16:9, B5, A4, Webtoon and custom sizes are selectable with unambiguous labels;
- `rtl` is the default reading direction and `ltr` can be selected;
- changing reading direction renumbers panels without moving geometry;
- Smart Manga preview numbering follows the selected reading direction;
- 4-koma includes 1×4 and 2×2 variants (plus horizontal 4×1);
- common layout presets create geometry proportional to the current canvas;
- Smart Manga produces three previewable, reproducible, editable candidates constrained by purpose/panel count;
- previewing Smart Manga candidates does not modify the current page;
- selected Smart Manga seed/variant provenance is stored;
- a selected base character can optionally be placed across a Smart Manga candidate;
- the panel-level dice changes only direction fields described above and remains undoable;
- reusable base characters can be created, edited, saved from a placed instance, and placed repeatedly;
- editor/review stick figures are anatomy-color-coded while clean AI figures are monochrome;
- background suggestions do not prevent arbitrary text entry;
- every panel is represented in an overview with a readable deterministic summary;
- camera controls display professional term + plain Japanese label + explanation;
- the formal help window follows the selected UI language and is reopenable;
- individual exports use collision-resistant timestamp + state-hash names;
- AI generation ZIP excludes annotated PNG and contains clean PNG + JSON + prompt + manifest;
- Review / archive ZIP adds annotated PNG under the same unchanged-state export identity;
- manifest provides UUID + full state hash + package type linking package files;
- mobile UI keeps candidate comparison, primary handoff action, canvas, and editing controls usable;
- legacy 0.1/older 0.2 data normalize without losing core layout semantics;
- clean AI PNG contains no authoring labels or panel summaries.
