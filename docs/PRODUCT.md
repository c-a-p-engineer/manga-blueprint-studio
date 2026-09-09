# Product Contract

## Problem

Image-generation assistants can render manga-style images, but users should not need cinematography vocabulary, manual coordinates, repeated character entry, or a Character Sheet for every character just to communicate manga direction. They also need to understand **what happens in each panel** without opening every editor field, and they should be able to begin from a recognizable scene such as a confession, a kiss beat, a counterattack, or a reaction without manually inventing every camera/pose choice.

Manga Blueprint Studio lets a human organize a work into pages, choose page/layout patterns, reuse character identity, define panel events, refine pose/camera/background/dialogue/effects, inspect the selected page quickly, control manga lettering direction, and export an AI-safe visual reference plus semantic instructions.

## Primary user flow

1. Open/create a work and select or add the page to edit.
2. Choose manuscript size and panel reading direction (`rtl` or `ltr`).
3. Start from **Scene Template Studio**, Smart Manga, or a visual panel layout.
4. If using Scene Template Studio, filter/search by scene intent, inspect description/use case/beat flow, and explicitly apply or derive a bounded variation.
5. Create/select a reusable base character and choose its appearance source: Character Sheet, text appearance guidance, or no-sheet/AI-designed appearance.
6. Use Panel Chips / Panel List / Panel Peek to understand the page and identify only the panels that need work.
7. Refine `actionIntent`, pose, expression, gaze, camera, background, dialogue/SFX, lettering direction, frame/effects.
8. Review advisory Manga Check / camera-framing warnings.
9. Optionally save the current page pattern as a browser-local custom template.
10. Export the currently selected page as AI generation ZIP and copy the short manifest-first handoff message.
11. Attach Character Sheets separately only where manifest says they are required.

## Work and multi-page model

Prototype 0.13.0 makes a work explicitly multi-page while keeping generation/export scoped to the selected page.

A project/work has stable identity through `meta.workId`. Each page has a stable `id` independent from its visible `pageNumber`, ordering metadata, optional title, and optional future container assignment.

The Page tab must support:

- selecting a page without mutating another page;
- adding a new page;
- duplicating the selected page with fresh page/panel/placed-character/balloon instance IDs;
- deleting the selected page with confirmation while refusing to delete the final remaining page;
- moving a page earlier/later;
- sequential renumbering;
- editing a visible page number while rejecting duplicates;
- editing an optional page title.

`selectedPageId` is editor selection state. Ordinary authoring/render/handoff operations resolve the page through `currentPage()` rather than assuming `pages[0]`.

Project persistence uses IndexedDB. The active work and the last selected page for that work are browser metadata, not competing project semantics. Startup restores the saved project and remembered page before page-selection persistence is enabled, so the first render cannot overwrite the remembered page with page 1.

Historical project autosave keys in `localStorage` are intentionally not migrated or reused. Portable `.manga.json` import is the compatibility path. Browser-local custom Scene Templates remain a separate `localStorage` concern.

Work-library UI, volume/chapter/folder management, backup/restore, selected-range/work-wide export, and panel-first generation are outside Prototype 0.13.0.

## Story action intent

A panel can store `actionIntent`: a short description of the event, not visible dialogue.

Examples:

- `振り向いてこちらを見る`
- `コップを落として驚く`
- `踏み込んで右ストレートを放つ`

`actionIntent` exists because pose labels alone do not explain cause, target, or event meaning. It is persisted in `.manga.json`, shown in authoring summaries, indexed in manifest, and added to generated semantic instructions. It is **never** part of `TEXT TO RENDER`.

## Scene Template Studio

Prototype 0.9 expands Story Templates into a scene-first Template Studio. Prototype 0.10 makes template numbering and applied beat order use the same selected RTL/LTR reading order as the page.

### Discovery

Templates are discoverable by:

- category;
- free-text search over title, description, use case, tags, and beat actions;
- visual cards that show layout thumbnail, panel count, category, and a short description;
- selected-template preview with recommended use case and beat flow.

Categories include romance, battle, emotion, daily, comedy, suspense, character introduction, and custom.

Template layout thumbnails number their panels using `meta.readingDirection`. In RTL, the rightmost panel in an ordinary row receives the earlier number; in LTR the leftmost does.

### Shipped scene packs

The built-in set includes the existing cute-daily / rom-com / surprise / gag / action templates plus scene-oriented additions such as:

- confession;
- before-kiss;
- after-kiss afterglow;
- holding hands;
- rom-com misunderstanding;
- battle opening / standoff;
- decisive blow;
- counterattack;
- aerial attack;
- throw technique;
- awakening / reversal;
- crying;
- anger burst;
- resolve;
- presence-behind suspense;
- classroom talk;
- smug failure;
- character introduction.

A template may seed valid panel geometry, narrative role, action intent, pose/expression/gaze, camera, background, effects, and optional sample dialogue/SFX.

### Apply behavior

Browsing/filtering/searching never mutates the current page. Applying over authored content requires confirmation. The user explicitly chooses whether sample dialogue/SFX is included. After apply, every field is ordinary editable project state; `meta.storyTemplate` is provenance only.

After template geometry is created, the page is renumbered from current geometry and `meta.readingDirection`. Template beat 1 is then assigned to panel order 1, beat 2 to panel order 2, and so on. This keeps the visible template number, the page number, and the semantic event placed into that panel aligned.

The selected/project reusable base character may be placed when one exists. Template definitions do not become continuing authorities after apply. Template-created balloons and SFX use inherited project writing direction until explicitly overridden.

### Bounded derivation

**Derive from this template** creates a temporary variation that keeps the same story beats/actions while varying a limited subset of camera distance/angle and emphasis/effect choices. Derivation does not mutate the page until the user explicitly applies it.

The goal is variation without turning a recognizable scene into unconstrained random generation.

### Custom templates

The user can save the current page as a browser-local custom template.

Custom template storage deliberately excludes character-specific visual identity. It stores normalized panel geometry and reusable direction such as role, action intent, camera, pose/expression/gaze, background, dialogue/SFX, and selected effects. Reapply scales geometry to the current canvas and uses the current reusable base character when available.

Custom templates are stored in `localStorage`; they are not uploaded, synchronized, or included in `.manga.json` unless the user applies one and exports the resulting ordinary project state.

## Panel Peek and Panel List

The editor must expose panel meaning without forcing tab-by-tab inspection.

### Panel Peek

- normal tap selects a panel;
- long-press opens quick Panel Peek;
- a visible `ⓘ` provides the same feature so long-press is not hidden-only UX;
- Panel Peek shows action, character direction, camera, background, dialogue, effects, and framing status;
- quick actions jump to panel editing, text editing, or selected-panel direction re-roll.

On mobile, Panel Peek is an opaque viewport-bounded bottom sheet. Header/actions remain reachable while only the semantic summary body scrolls.

### Panel List / Shot List

Page tab supports detailed and compact views. Detailed rows show reading-order number, narrative role/action, character direction, camera, background, dialogue, and SFX/effects. Tapping a row selects that panel.

### Panel Chips

Compact editor-only chips appear inside panels so page meaning can be scanned directly from the canvas. They are authoring overlays and are not part of clean AI PNG.

## Camera consistency and Crop Guide

Semantic camera distance and visual stick-figure size can contradict each other. Prototype 0.8+ derives an advisory figure-to-panel fill check.

Examples:

- `extreme-close` + tiny full-body figure → likely conflict;
- `extreme-long` + oversized figure → likely conflict.

The user may explicitly press **fit character size to camera**. No automatic mutation occurs merely because a warning exists.

A dotted Crop Guide visualizes an approximate intended framing region. It is authoring-only and does not appear in clean AI PNG. Thresholds are heuristic assistance, not a replacement for the semantic camera model.

## Manga Check

The product provides non-blocking lint for common authoring problems:

- panel has no action intent;
- camera/figure scale likely conflicts;
- three or more panels repeat exactly the same camera distance;
- multiple panels all lack background location;
- three or more panels repeat the same primary expression.

Warnings are advisory and never block export or rewrite the page automatically.

## Help and beginner terminology

The header **Help / 使い方** window is maintained and localized. It covers workflow, reading direction, reusable characters, Character-Sheet-free identity, stick-figure colors, Scene Templates, Panel Peek/List, camera aids, background input, and export handoff.

Professional terms remain available for interoperability, but Japanese UI pairs them with plain language and explanation, e.g. `Extreme close / 超寄り`, `Long / 引き`, `Low angle / あおり`, `High angle / ふかん`.

## Canvas / layout / reading direction

The product ships named manuscript presets: `800×1130 Portrait` (default), 1:1, 4:5, 3:4, 9:16, 16:9, B5, A4, Webtoon, and custom dimensions.

Japanese right-to-left is default; left-to-right is supported. Panel `order` is derived from current geometry plus selected reading direction on committed render paths. For ordinary rows, RTL numbers right-to-left and LTR numbers left-to-right. The same resulting order drives canvas badges, Scene Template numbering/beat placement, Panel Peek/List, prompt, manifest semantics, and exports.

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

Smart Manga remains a bounded proposal system distinct from Scene Template Studio.

Inputs include purpose, optional panel count, canvas-size preservation, optional base-character placement, reproducible seed, and intensity (`stable | standard | bold`). One request returns three non-mutating candidates with balanced/dynamic/emotion emphasis. Apply is explicit.

The selected-panel dice preserves geometry, background content, dialogue, and narrative role while re-proposing camera/effects/breakout plus pose/expression/gaze.

## Lettering direction

Prototype 0.10 makes writing direction explicit and independent from panel reading direction.

Project default:

- `meta.defaultWritingMode = vertical-rl | horizontal-tb`;
- `vertical-rl` is the Japanese-manga-oriented default.

Balloon override:

- `balloon.writingMode = inherit | vertical-rl | horizontal-tb`.

Onomatopoeia/SFX override:

- `panel.effects.sfxWritingMode = inherit | vertical-rl | horizontal-tb`.

For both balloons and SFX, `inherit` follows the project default. Existing projects without these fields normalize to vertical-first behavior. Changing lettering direction never changes panel numbering or RTL/LTR reading order.

Editor/review preview reflects balloon effective direction. Clean AI PNG still removes balloon/SFX text and keeps only spatial/effect geometry. The generation prompt carries `LETTERING DIRECTION` for balloons and `SFX LETTERING DIRECTION` for non-empty onomatopoeia, while exact visible strings remain under `TEXT TO RENDER`.

## Background / balloons / manga effects

Background location/weather/mood remain unrestricted free text with suggestions; localized scene presets are editable after apply.

Balloon presets can create or modify speech/thought/shout/whisper/narration/off-screen balloons without erasing existing dialogue. Newly created/template balloons inherit the project writing direction unless explicitly overridden.

Frame treatment includes borderless, bleed, and breakout. Effects support speed/focus/impact/tension/silence patterns plus SFX text/style and per-panel SFX writing-direction override.

## AI-safe boundary

Clean AI PNG removes authoring labels, including character names, panel numbers, camera metadata, Panel Chips, Crop Guide, summaries, action notes, balloon text, and SFX labels. It keeps spatial composition, monochrome pose figures, balloon geometry, and effect lines.

The prompt uses strict `TEXT TO RENDER`. Only exact dialogue/SFX entries in that section may become visible manga text. Balloon/SFX lettering direction is semantic layout guidance and does not create additional renderable strings.

Character identity follows `CHARACTER IDENTITY GUIDANCE`. Character Sheets are used only for characters whose identity mode requires them; description/free modes must not be contradicted by generic prompt wording.

## Manifest-first handoff

Manifest v3 remains the read-first authority and contains package identity, file roles, generation inputs, character guidance, Character Sheet requirements, compact user handoff text, Story Template provenance, `panelIntentIndex`, and derived lettering metadata. The semantic `.manga.json` and generation prompt carry explicit writing-direction state.

AI-generation ZIP excludes annotated review PNG. Review/archive ZIP includes it under the same export identity.

Prototype 0.13.0 keeps these packages scoped to the currently selected page. Multi-page/range/whole-work export must be introduced as an explicit later contract rather than inferred from the presence of multiple pages.

## Acceptance criteria

- a work may contain multiple pages and page selection routes authoring/render/handoff through the selected page;
- page add/select/duplicate/delete/reorder/renumber/title operations are undoable through ordinary project mutation paths where applicable;
- the final remaining page cannot be deleted;
- manual visible page numbers reject duplicates;
- duplicate page creation uses fresh page/panel/placed-character/balloon instance IDs;
- active page is remembered per work and restored before page-selection persistence is re-enabled;
- project autosave uses IndexedDB and does not silently bootstrap from historical project `localStorage` autosaves;
- current generation/export remains selected-page scoped;
- template browsing/filter/search never mutates current project state;
- template cards expose category, panel count, description, use case, and beat flow;
- template thumbnail numbering follows selected RTL/LTR direction;
- template beat N is assigned to panel order N after geometry-based renumbering;
- shipped romance/battle/emotion/daily/comedy/suspense/character-introduction scene templates are available in both JA and EN UI;
- derived template variation preserves story action flow and requires explicit apply;
- custom templates are browser-local, scale normalized geometry to the current canvas, and never store character-specific visual identity;
- Story Templates seed valid layout/action/camera and optional editable dialogue/SFX;
- existing authored content is not silently destroyed by template browsing/apply;
- `actionIntent` persists through JSON export/import and old projects normalize missing values safely;
- Panel Peek works through long-press and visible `ⓘ`, with mobile viewport-bounded opaque presentation;
- detailed/compact Panel List is reading-order aware and selects panels;
- selected RTL/LTR direction automatically matches persisted/displayed panel numbering from geometry;
- vertical writing is the default, horizontal writing is selectable globally and per balloon/per SFX, and the choice persists in JSON;
- writing direction is forwarded to prompt/manifest but does not leak metadata into clean PNG;
- Panel Chips/Crop Guide never enter clean AI output;
- camera-framing warnings are advisory and explicit fit is user-triggered;
- Manga Check never blocks export;
- generated prompt contains action intent as semantic guidance, not visible text;
- prompt does not claim Character Sheets are universally required;
- existing Smart Manga, character identity modes, background/balloon presets, AI ZIP/review ZIP, manifest v3, RTL/LTR, IndexedDB autosave, Undo/Redo, and mobile UI remain functional;
- dependency-free validation and GitHub Pages deployment succeed.
