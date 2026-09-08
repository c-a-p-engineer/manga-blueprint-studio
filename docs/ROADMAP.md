# Roadmap

## Shipped through Prototype 0.10

### Page and layout
- named manuscript/canvas presets: 800×1130 default, 1:1, 4:5, 3:4, 9:16, 16:9, B5, A4, Webtoon, custom;
- explicit RTL/LTR reading direction;
- **automatic geometry-based panel numbering synchronization** so selected reading direction, canvas numbers, Panel List/Peek, prompt, and export semantics stay aligned;
- dynamic layout generation across aspect ratios;
- 4-koma 1×4, 2×2, and 4×1 variants plus common 1–6 panel, conversation, action, and climax layouts;
- visual layout thumbnail strip with explicit apply.

### Story-readable authoring
- per-panel `actionIntent` semantic field;
- Panel Peek via long-press plus visible `ⓘ` fallback;
- compact opaque mobile bottom-sheet Panel Peek;
- detailed/compact Panel List / Shot List;
- editor-only Panel Chips;
- Manga Check advisory lint;
- camera-distance vs stick-figure-scale consistency check and Crop Guide.

### Scene Template Studio — Prototype 0.9
- category filters and free-text search;
- visual template cards with layout thumbnail, category, panel count, description, use case, and beat flow;
- original cute-daily / rom-com / surprise / gag / action templates preserved;
- romance pack: confession, before-kiss, after-kiss, holding hands, misunderstanding;
- battle pack: standoff/opening, decisive blow, counterattack, aerial attack, throw technique, awakening/reversal;
- emotion/daily/comedy/suspense/character-introduction additions;
- optional editable sample dialogue/SFX;
- bounded “derive from this template” variation that preserves story beat/action flow;
- browser-local custom templates saved from current page;
- custom geometry normalized to canvas size for reuse across manuscript dimensions;
- custom templates deliberately exclude character-specific visual identity and reuse the current base character on apply.

### Smart Manga and direction assistance
- three non-mutating candidates per request;
- purpose/panel-count constraints, reproducible seed, balanced/dynamic/emotion variants;
- stable / standard / bold intensity;
- purposes covering action, conversation, gag, daily, climax, 4-koma, rom-com, cute, suspense, and character introduction;
- optional reusable base-character placement;
- per-panel direction dice preserving geometry/background/dialogue/role while re-proposing camera/effects/pose/expression/gaze.

### Character identity
- reusable project-level base-character library;
- three visual identity modes: external Character Sheet, text appearance description, or no-sheet/AI-designed appearance;
- free “what kind of character?” description plus hair/eyes/outfit/features suggestions;
- Character-Sheet-free identity guidance in `.manga.json`, manifest, and prompt;
- Output-tab Character Sheet requirement map and missing-reference-key warning;
- free identity mode disables inactive appearance-detail controls.

### Background, text, effects
- guided free-text location/weather/mood;
- localized editable background scene presets;
- balloon presets for speech/thought/shout/whisper/narration/off-screen placements;
- **vertical Japanese balloon writing (`vertical-rl`) as default**;
- horizontal balloon writing (`horizontal-tb`) selectable globally and per balloon;
- legacy projects normalize to vertical-first lettering;
- editor/review writing-direction preview while clean AI PNG remains text-free;
- generation prompt carries effective lettering direction independently from panel reading direction;
- background semantics, balloons, onomatopoeia, effects, borderless/bleed/breakout, expression/gaze.

### AI handoff and export
- timestamp + project-state-hash coordinated filenames;
- AI generation ZIP containing clean PNG, `.manga.json`, prompt, manifest — annotated PNG excluded;
- Review/archive ZIP adding annotated PNG under same export identity;
- manifest v3 as read-first authority with file roles, character identity guidance, Character Sheet requirements, Story Template provenance, and panel intent index;
- short JA/EN “extract ZIP and read manifest first” message with copy action;
- strict text allowlist keeps action intent / authoring labels out of visible manga text;
- export UUID, full state SHA-256, JSON import/export, local autosave, Undo/Redo, mobile tabs.

## Next candidates

### Pose Studio — highest priority
- direct joint dragging for head / shoulders / elbows / hands / hip / knees / feet;
- pose-thumbnail picker rather than text-only selection;
- reusable user pose presets;
- support / center-of-gravity / torso semantics;
- pose mirroring and reset-to-preset;
- clearer contact / support markers for complex action.

### Character Sheet actual files — highest priority
- browser-local image registration;
- Character Sheet thumbnail binding by `referenceKey`;
- actual-file presence diagnostics in addition to current semantic requirement diagnostics;
- explicit optional inclusion of registered sheets in AI package;
- safe mapping for multiple characters / multiple sheets.

### Template evolution
- favorites / recently used templates;
- import/export template packs without provider dependency;
- named reusable template collections;
- reusable character/location/prop placeholders;
- stronger scene variants based on generated-result comparisons;
- template recommendation from story goal / beat count / desired ending emotion;
- optional deterministic seed for template derivation.

### Scene / Location / Prop library
- reusable location definitions such as `bedroom-A`, `classroom-A`;
- `same scene as previous panel` / inherited scene intent;
- reusable props such as phone, bag, cup, weapon, key;
- prop state/continuity tracking across panels;
- optional Scene Template bindings to named locations/props.

### Panel geometry
- drag panel boundaries;
- shared-boundary editing that moves adjacent panels together;
- irregular / diagonal frame shapes;
- safer overlap/bleed visualization;
- extend reading-order grouping rules for arbitrary irregular/overlapping future frame geometry.

### Text production
- balloon tail target / speaker visual connection;
- deterministic post-render lettering composition for final-quality Japanese vertical typesetting;
- punctuation/kenten/ruby/tate-chu-yoko handling beyond the current authoring preview;
- selectable SFX writing direction / rotation / path;
- reusable dialogue/SFX presets beyond Scene Template samples.

### Manga direction
- multi-page / spread support;
- memory / dream / flashback modes;
- page-turn / reveal planning;
- eye-flow visualization;
- richer camera crop/framing model tied to target body region;
- causal beat tools (`cause → perception → reaction → effect`) for event-heavy pages.

### Generated-result review
- upload generated manga and compare against Blueprint intent;
- panel-by-panel checks for camera, character consistency, dialogue/SFX, background continuity, breakout, reading order, and writing direction;
- record useful regression examples without collecting private artwork remotely.

### Export integrity
- optional per-file SHA-256 values in manifest in addition to shared project-state hash;
- export-package import / restore flow;
- package compatibility checks across future project/manifest versions.

### Usability validation
- representative mobile Scene Template / Panel Peek / custom-template / lettering walkthroughs;
- keyboard/focus/accessibility audit;
- actual-user feedback on template discovery, camera warnings, character identity modes, and vertical/horizontal lettering controls;
- no analytics by default; any feedback collection needs an explicit privacy boundary.

### Integration
- optional provider adapters at the export boundary only.