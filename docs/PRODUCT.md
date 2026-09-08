# Product Contract

## Problem

Image-generation assistants can render manga-style images, but users should not need cinematography vocabulary, manual coordinates, repeated character entry, or a Character Sheet for every character just to communicate manga direction. They also need to understand **what happens in each panel** without opening every editor field.

Manga Blueprint Studio lets a human choose page/layout patterns, reuse character identity, define panel events, refine pose/camera/background/dialogue/effects, inspect the whole page quickly, and export an AI-safe visual reference plus semantic instructions.

## Primary user flow

1. Choose manuscript size and reading direction (`rtl` or `ltr`).
2. Start from **Story Template**, Smart Manga, or a visual panel layout.
3. Create/select a reusable base character and choose its appearance source: Character Sheet, text appearance guidance, or no-sheet/AI-designed appearance.
4. Use Panel Chips / Panel List / Panel Peek to understand the page and identify only the panels that need work.
5. Refine `actionIntent`, pose, expression, gaze, camera, background, dialogue/SFX, frame/effects.
6. Review advisory Manga Check / camera-framing warnings.
7. Export AI generation ZIP and copy the short manifest-first handoff message.
8. Attach Character Sheets separately only where manifest says they are required.

## Story action intent

A panel can store `actionIntent`: a short description of the event, not visible dialogue.

Examples:

- `振り向いてこちらを見る`
- `コップを落として驚く`
- `踏み込んで右ストレートを放つ`

`actionIntent` exists because pose labels alone do not explain cause, target, or event meaning. It is persisted in `.manga.json`, shown in authoring summaries, indexed in manifest, and added to generated semantic instructions. It is **never** part of `TEXT TO RENDER`.

## Story Templates

Prototype 0.8 ships editable rough-name templates:

- Cute daily 4-panel;
- Rom-com blush 4-panel;
- Surprise 3-panel;
- Gag 4-panel;
- Action impact 3-panel.

A Story Template can seed:

- valid shipped panel layout;
- narrative role per panel;
- action intent;
- pose / expression / gaze;
- camera distance / angle / viewpoint;
- background starting state;
- manga line effect / breakout where useful;
- optional sample dialogue and onomatopoeia.

The user explicitly chooses whether sample dialogue/SFX is included. Applying over authored content requires confirmation. After apply, every field is ordinary editable project state; `meta.storyTemplate` is provenance only.

## Panel Peek and Panel List

The editor must expose panel meaning without forcing tab-by-tab inspection.

### Panel Peek

- normal tap selects a panel;
- long-press opens quick Panel Peek;
- a visible `ⓘ` provides the same feature so long-press is not hidden-only UX;
- Panel Peek shows action, character direction, camera, background, dialogue, effects, and framing status;
- quick actions jump to panel editing, text editing, or selected-panel direction re-roll.

On mobile, Panel Peek behaves as a bottom-sheet style dialog.

### Panel List / Shot List

Page tab supports detailed and compact views. Detailed rows show reading-order number, narrative role/action, character direction, camera, background, dialogue, and SFX/effects. Tapping a row selects that panel.

### Panel Chips

Compact editor-only chips appear inside panels so page meaning can be scanned directly from the canvas. They are authoring overlays and are not part of clean AI PNG.

## Camera consistency and Crop Guide

Semantic camera distance and visual stick-figure size can contradict each other. Prototype 0.8 derives an advisory figure-to-panel fill check.

Examples:

- `extreme-close` + tiny full-body figure → likely conflict;
- `extreme-long` + oversized figure → likely conflict.

The user may explicitly press **fit character size to camera**. No automatic mutation occurs merely because a warning exists.

A dotted Crop Guide visualizes an approximate intended framing region. It is authoring-only and does not appear in clean AI PNG. Thresholds are heuristic assistance, not a replacement for the semantic camera model.

## Manga Check

Prototype 0.8 provides non-blocking lint for common authoring problems:

- panel has no action intent;
- camera/figure scale likely conflicts;
- three or more panels repeat exactly the same camera distance;
- multiple panels all lack background location;
- three or more panels repeat the same primary expression.

Warnings are advisory and never block export or rewrite the page automatically.

## Help and beginner terminology

The header **Help / 使い方** window is maintained and localized. It covers workflow, reading direction, reusable characters, Character-Sheet-free identity, stick-figure colors, Story Templates, Panel Peek/List, camera aids, background input, and export handoff.

Professional terms remain available for interoperability, but Japanese UI pairs them with plain language and explanation, e.g. `Extreme close / 超寄り`, `Long / 引き`, `Low angle / あおり`, `High angle / ふかん`.

## Canvas / layout / reading direction

The product ships named manuscript presets: `800×1130 Portrait` (default), 1:1, 4:5, 3:4, 9:16, 16:9, B5, A4, Webtoon, and custom dimensions.

Japanese right-to-left is default; left-to-right is supported. Changing reading direction preserves geometry and renumbers by current position.

Common layouts include single, 2-panel, 3-panel, action, 4-koma 1×4 / 2×2 / 4×1, 5/6-panel, conversation, action, and climax patterns. Visual thumbnails require explicit apply rather than destructive browse-time replacement.

## Base characters and optional Character Sheets

A project stores reusable base definitions with Character ID, display name, optional reference key, default pose, `identityMode`, appearance guidance, and notes.

Modes:

1. `sheet` — separately attached Character Sheet required;
2. `description` — no sheet; text appearance guidance is the identity contract;
3. `free` — no sheet; downstream model may choose a simple consistent design.

Appearance fields remain guided free text. In `free` mode inactive appearance-detail controls are visually disabled.

The Output tab derives Character Sheet requirements from characters actually used on the current page and warns about missing reference keys without blocking export.

## Smart Manga

Smart Manga remains a bounded proposal system distinct from Story Templates.

Inputs include purpose, optional panel count, canvas-size preservation, optional base-character placement, reproducible seed, and intensity (`stable | standard | bold`). One request returns three non-mutating candidates with balanced/dynamic/emotion emphasis. Apply is explicit.

The selected-panel dice preserves geometry, background content, dialogue, and narrative role while re-proposing camera/effects/breakout plus pose/expression/gaze.

## Background / balloons / manga effects

Background location/weather/mood remain unrestricted free text with suggestions; localized scene presets are editable after apply.

Balloon presets can create or modify speech/thought/shout/whisper/narration/off-screen balloons without erasing existing dialogue.

Frame treatment includes borderless, bleed, and breakout. Effects support speed/focus/impact/tension/silence patterns plus SFX text/style.

## AI-safe boundary

Clean AI PNG removes authoring labels, including character names, panel numbers, camera metadata, Panel Chips, Crop Guide, summaries, action notes, balloon glyphs, and SFX labels. It keeps spatial composition, monochrome pose figures, balloon geometry, and effect lines.

The prompt uses strict `TEXT TO RENDER`. Only exact dialogue/SFX entries in that section may become visible manga text.

Character identity follows `CHARACTER IDENTITY GUIDANCE`. Character Sheets are used only for characters whose identity mode requires them; description/free modes must not be contradicted by generic prompt wording.

## Manifest-first handoff

Manifest v3 remains the read-first authority and contains package identity, file roles, generation inputs, character guidance, Character Sheet requirements, compact user handoff text, plus in Prototype 0.8:

- `storyTemplate` provenance when present;
- `panelIntentIndex` with panel id/order/role/action intent.

AI-generation ZIP excludes annotated review PNG. Review/archive ZIP includes it under the same export identity.

## Acceptance criteria

- Story Templates seed valid layout/action/camera and optional editable dialogue/SFX;
- existing authored content is not silently destroyed by template browsing/apply;
- `actionIntent` persists through JSON export/import and old projects normalize missing values safely;
- Panel Peek works through long-press and visible `ⓘ`;
- detailed/compact Panel List is reading-order aware and selects panels;
- Panel Chips/Crop Guide never enter clean AI output;
- camera-framing warnings are advisory and explicit fit is user-triggered;
- Manga Check never blocks export;
- generated prompt contains action intent as semantic guidance, not visible text;
- prompt does not claim Character Sheets are universally required;
- existing Smart Manga, character identity modes, background/balloon presets, AI ZIP/review ZIP, manifest v3, RTL/LTR, autosave, Undo/Redo, and mobile UI remain functional;
- dependency-free validation and GitHub Pages deployment succeed.
