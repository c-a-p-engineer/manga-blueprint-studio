# Product Contract

## Problem

Image-generation assistants can render manga-style images, but users should not need cinematography vocabulary, manual coordinates, repeated character entry, or a Character Sheet for every character just to communicate manga direction. Users must also be able to see what happens in each panel, start from recognizable scenes, and control manga-specific reading and lettering conventions without ambiguity.

Manga Blueprint Studio lets a human choose page/layout patterns, reuse character identity, define panel events, refine pose/camera/background/dialogue/effects, inspect the whole page quickly, and export an AI-safe visual reference plus semantic instructions.

## Primary user flow

1. Choose manuscript size and reading direction (`rtl` or `ltr`).
2. Confirm the panel numbering preview; numbers follow the selected reading direction.
3. Start from **Scene Template Studio**, Smart Manga, or a visual panel layout.
4. If using Scene Template Studio, filter/search by scene intent, inspect description/use case/beat flow, and explicitly apply or derive a bounded variation.
5. Create/select a reusable base character and choose its appearance source: Character Sheet, text appearance guidance, or no-sheet/AI-designed appearance.
6. Use Panel Chips / Panel List / Panel Peek to understand the page and identify only the panels that need work.
7. Refine `actionIntent`, pose, expression, gaze, camera, background, dialogue/SFX, writing direction, frame/effects.
8. Review advisory Manga Check / camera-framing warnings.
9. Optionally save the current page pattern as a browser-local custom template.
10. Export AI generation ZIP and copy the short manifest-first handoff message.
11. Attach Character Sheets separately only where manifest says they are required.

## Reading order and panel numbering

`meta.readingDirection` is authoritative.

- `rtl` is the Japanese manga default;
- `ltr` is supported;
- changing direction preserves panel geometry and renumbers from current position;
- visible editor panel numbers follow that direction;
- layout thumbnails, Smart Manga candidate previews, Scene Template thumbnails, Panel List order, prompt panel numbers, and manifest all use the same order;
- when a Scene Template is applied, beat 1 is assigned to physical panel number 1 in the selected reading direction, beat 2 to panel 2, and so on.

A user must never see a template numbered one way and receive a page whose story beats are assigned in another order.

## Vertical / horizontal manga text

Prototype 0.10 makes manga lettering direction explicit.

- `meta.textDirectionDefault` defaults to `vertical`;
- each balloon has `writingDirection: vertical | horizontal`;
- each panel's onomatopoeia has `effects.sfxWritingDirection: vertical | horizontal`;
- new balloons and Scene Template sample text inherit the current default;
- legacy projects without direction fields normalize to vertical;
- changing the project default affects future text, not silently authored per-balloon overrides;
- review/annotated preview reflects the chosen direction where practical;
- clean AI PNG still removes exact lettering;
- exact strings and writing directions are preserved in `.manga.json`, generated Prompt, and manifest v4.

Vertical means Japanese-manga-style `vertical-rl`; horizontal means `horizontal-tb`.

## Story action intent

A panel can store `actionIntent`: a short description of the event, not visible dialogue.

Examples:

- `振り向いてこちらを見る`
- `コップを落として驚く`
- `踏み込んで右ストレートを放つ`

`actionIntent` exists because pose labels alone do not explain cause, target, or event meaning. It is persisted in `.manga.json`, shown in authoring summaries, indexed in manifest, and added to generated semantic instructions. It is **never** part of `TEXT TO RENDER`.

## Scene Template Studio

Scene Template Studio is scene-first authoring.

### Discovery

Templates are discoverable by category, free-text search, visual cards, use-case descriptions, panel count, and beat-flow preview.

Categories include romance, battle, emotion, daily, comedy, suspense, character introduction, and custom.

### Shipped scene packs

The built-in set includes cute-daily / rom-com / surprise / gag / action plus confession, before-kiss, after-kiss, holding hands, misunderstanding, battle opening, decisive blow, counterattack, aerial attack, throw technique, awakening/reversal, crying, anger, resolve, presence-behind suspense, classroom talk, smug failure, and character introduction.

A template may seed valid panel geometry, narrative role, action intent, pose/expression/gaze, camera, background, effects, and optional sample dialogue/SFX.

### Apply behavior

Browsing/filtering/searching never mutates the current page. Applying over authored content requires confirmation. The user explicitly chooses whether sample dialogue/SFX is included. After apply, every field is ordinary editable project state; `meta.storyTemplate` is provenance only.

Template preview numbering and beat assignment both follow current `meta.readingDirection`. Sample dialogue/SFX inherit current `meta.textDirectionDefault`.

### Bounded derivation

**Derive from this template** creates a temporary variation that keeps the same story beats/actions while varying a limited subset of camera distance/angle and emphasis/effect choices. Derivation does not mutate the page until the user explicitly applies it.

### Custom templates

The user can save the current page as a browser-local custom template. Character-specific visual identity is excluded. Reusable data includes normalized geometry, role, action intent, camera, pose/expression/gaze, background, dialogue/SFX, and selected effects.

## Panel Peek and Panel List

The editor must expose panel meaning without forcing tab-by-tab inspection.

### Panel Peek

- normal tap selects a panel;
- long-press opens quick Panel Peek;
- a visible `ⓘ` provides the same feature;
- Panel Peek shows action, character direction, camera, background, dialogue, effects, and framing status;
- quick actions jump to panel editing, text editing, or selected-panel direction re-roll.

On mobile, Panel Peek is an opaque viewport-bounded bottom sheet. Header/actions remain reachable while only the semantic summary body scrolls.

### Panel List / Shot List

Page tab supports detailed and compact views. Rows follow selected reading order and show narrative role/action, character direction, camera, background, dialogue, and SFX/effects.

### Panel Chips

Compact editor-only chips appear inside panels so page meaning can be scanned directly from the canvas. They are authoring overlays and are not part of clean AI PNG.

## Camera consistency and Crop Guide

Semantic camera distance and visual stick-figure size can contradict each other. The product derives an advisory figure-to-panel fill check. The user may explicitly press **fit character size to camera**. No automatic mutation occurs merely because a warning exists.

A dotted Crop Guide visualizes approximate intended framing and is excluded from clean AI PNG.

## Manga Check

Non-blocking lint may flag missing action intent, camera/figure scale conflict, repeated camera distance, unspecified backgrounds, or repeated expression. Warnings never block export or rewrite the page automatically.

## Help and beginner terminology

The localized Help window covers workflow, reading direction, vertical/horizontal text, reusable characters, Character-Sheet-free identity, stick-figure colors, Scene Templates, Panel Peek/List, camera aids, background input, and export handoff.

Professional terms remain available for interoperability, but Japanese UI pairs them with plain language and explanation.

## Canvas / layout

The product ships named manuscript presets: `800×1130 Portrait` (default), 1:1, 4:5, 3:4, 9:16, 16:9, B5, A4, Webtoon, and custom dimensions.

Common layouts include single, 2-panel, 3-panel, action, 4-koma 1×4 / 2×2 / 4×1, 5/6-panel, conversation, action, and climax patterns. Visual thumbnails require explicit apply rather than destructive browse-time replacement.

## Base characters and optional Character Sheets

A project stores reusable base definitions with Character ID, display name, optional reference key, default pose, `identityMode`, appearance guidance, and notes.

Modes:

1. `sheet` — separately attached Character Sheet required;
2. `description` — no sheet; text appearance guidance is the identity contract;
3. `free` — no sheet; downstream model may choose a simple consistent design.

The Output tab derives Character Sheet requirements from characters actually used on the current page and warns about missing reference keys without blocking export.

## Smart Manga

Smart Manga is a bounded proposal system distinct from Scene Template Studio.

Inputs include purpose, optional panel count, canvas-size preservation, optional base-character placement, reproducible seed, and intensity (`stable | standard | bold`). One request returns three non-mutating candidates with balanced/dynamic/emotion emphasis. Preview numbering follows current reading direction. Apply is explicit.

The selected-panel dice preserves geometry, background content, dialogue, and narrative role while re-proposing camera/effects/breakout plus pose/expression/gaze.

## Background / balloons / manga effects

Background location/weather/mood remain unrestricted free text with suggestions; localized scene presets are editable after apply.

Balloon presets can create or modify speech/thought/shout/whisper/narration/off-screen balloons without erasing existing dialogue. New preset-created balloons normalize to the project text-direction default.

Frame treatment includes borderless, bleed, and breakout. Effects support speed/focus/impact/tension/silence patterns plus SFX text/style and writing direction.

## AI-safe boundary

Clean AI PNG removes authoring labels, including character names, panel numbers, camera metadata, Panel Chips, Crop Guide, summaries, action notes, exact balloon text, and SFX labels. It keeps spatial composition, monochrome pose figures, balloon geometry, and effect lines.

The prompt uses strict `TEXT TO RENDER`. Only exact dialogue/SFX entries in that section may become visible manga text. A separate text-writing-direction contract defines vertical vs horizontal rendering.

Character identity follows `CHARACTER IDENTITY GUIDANCE`. Character Sheets are used only for characters whose identity mode requires them.

## Manifest-first handoff

Manifest v4 is the read-first authority and contains package identity, file roles, generation inputs, character guidance, Character Sheet requirements, compact user handoff text, Story Template provenance, panel intent index, reading-order contract, and text-layout contract.

AI-generation ZIP excludes annotated review PNG. Review/archive ZIP includes it under the same export identity.

## Acceptance criteria

- reading direction synchronizes editor numbers, layout/Smart/Scene Template previews, Panel List, Scene Template beat assignment, prompt, and manifest;
- RTL numbers same-row panels right-to-left; LTR numbers same-row panels left-to-right;
- vertical is the default text direction for new/legacy-unset lettering;
- balloon and SFX direction can each be overridden to horizontal;
- text direction persists through JSON, Prompt, manifest and review preview;
- template browsing/filter/search never mutates current project state;
- Scene Template cards expose category, panel count, description, use case, and beat flow;
- derived template variation preserves story action flow and requires explicit apply;
- custom templates are browser-local and never store character-specific visual identity;
- `actionIntent` persists and never becomes visible text;
- Panel Peek works through long-press and visible `ⓘ`, with mobile viewport-bounded opaque presentation;
- Panel Chips/Crop Guide never enter clean AI output;
- Manga Check never blocks export;
- prompt does not claim Character Sheets are universally required;
- AI ZIP excludes annotated PNG; Review ZIP includes it under same export identity;
- manifest v4 includes file roles, character guidance, panel intent, reading-order and text-layout contracts;
- dependency-free validation and GitHub Pages deployment succeed.
