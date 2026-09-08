# Roadmap

## Shipped in Prototype 0.8

### Page and layout
- named manuscript/canvas presets: 800×1130 default, 1:1, 4:5, 3:4, 9:16, 16:9, B5, A4, Webtoon, custom;
- explicit RTL/LTR reading direction with geometry-based renumbering;
- dynamic layout generation across aspect ratios;
- 4-koma 1×4, 2×2, and 4×1 variants plus common 1–6 panel, conversation, action, and climax layouts;
- visual layout thumbnail strip with explicit apply.

### Story-readable authoring
- **Story Templates**: cute daily, rom-com blush, surprise, gag, and action impact;
- templates seed layout, panel role, action intent, camera, pose/expression/gaze, background, optional dialogue/SFX, and selected effects;
- sample dialogue/SFX can be disabled before apply and remains fully editable afterward;
- optional per-panel **`actionIntent`** semantic field;
- **Panel Peek** via long-press plus discoverable `ⓘ` fallback;
- detailed/compact **Panel List / Shot List**;
- editor-only **Panel Chips** for at-a-glance panel meaning;
- **Manga Check** advisory lint for missing event meaning, repeated camera/expression, missing backgrounds, and framing conflicts.

### Camera readability
- beginner camera labels/explanations;
- simple distance/angle camera diagram;
- **camera-distance vs stick-figure-scale consistency check**;
- authoring-only dotted **Crop Guide**;
- explicit “fit character size to camera” action rather than silent mutation.

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
- background semantics, balloons, onomatopoeia, effects, borderless/bleed/breakout, expression/gaze.

### AI handoff and export
- timestamp + project-state-hash coordinated filenames;
- AI generation ZIP containing clean PNG, `.manga.json`, prompt, manifest — annotated PNG excluded;
- Review/archive ZIP adding annotated PNG under same export identity;
- manifest v3 as read-first authority with file roles, character identity guidance, Character Sheet requirements;
- Prototype 0.8 manifest adds Story Template provenance and `panelIntentIndex`;
- short JA/EN “extract ZIP and read manifest first” message with copy action;
- **prompt identity contract fixed** so Character Sheets are used only where identity guidance requires them;
- strict text allowlist keeps action intent / authoring labels out of visible manga text;
- export UUID, full state SHA-256, canvas, reading direction, package mapping;
- JSON import/export, local autosave, Undo/Redo, mobile tabs.

## Next — Prototype 0.9 candidates

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

### Scene / Location / Prop library
- reusable location definitions such as `bedroom-A`, `classroom-A`;
- `same scene as previous panel` / inherited scene intent;
- reusable props such as phone, bag, cup, weapon, key;
- prop state/continuity tracking across panels;
- optional Story Template bindings to named locations/props.

### Panel geometry
- drag panel boundaries;
- shared-boundary editing that moves adjacent panels together;
- irregular / diagonal frame shapes;
- safer overlap/bleed visualization.

### Text production
- balloon tail target / speaker visual connection;
- vertical Japanese text layout;
- deterministic post-render lettering composition;
- reusable dialogue/SFX presets beyond Story Template samples.

### Manga direction
- multi-page / spread support;
- memory / dream / flashback modes;
- page-turn / reveal planning;
- eye-flow visualization;
- richer camera crop/framing model tied to target body region, not only heuristic scale;
- causal beat tools (`cause → perception → reaction → effect`) for event-heavy pages;
- additional profiles informed by generated-result comparisons.

### Template evolution
- user-saved Story Templates / layout-direction presets;
- named custom Smart Manga profiles;
- template recommendation from intended beat count / story goal;
- reusable Story Template character/location placeholders;
- import/export template packs without provider dependency.

### Generated-result review
- upload generated manga and compare against Blueprint intent;
- panel-by-panel checks for camera, character consistency, dialogue/SFX, background continuity, breakout, reading order;
- record useful regression examples without collecting private artwork remotely.

### Export integrity
- optional per-file SHA-256 values in manifest in addition to shared project-state hash;
- export-package import / restore flow;
- package compatibility checks across future project/manifest versions.

### Usability validation
- representative mobile long-press / Panel Peek / Story Template walkthroughs;
- keyboard/focus/accessibility audit;
- actual-user feedback on Story Templates, Panel List, camera warnings, and character identity modes;
- no analytics by default; any feedback collection needs an explicit privacy boundary.

### Integration
- optional provider adapters at the export boundary only.
