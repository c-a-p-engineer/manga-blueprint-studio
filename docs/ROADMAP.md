# Roadmap

## Shipped in prototype 0.7

### Page and layout
- clearly named manuscript/canvas presets: 800×1130 default, 1:1, 4:5, 3:4, 9:16, 16:9, B5, A4, Webtoon, custom;
- explicit RTL/LTR reading direction with geometry-based renumbering;
- dynamic layout generation for different aspect ratios;
- 4-koma 1×4, 2×2, and 4×1 variants;
- common 1–6 panel, conversation, action, and climax layouts;
- **visual layout thumbnail strip** with explicit apply rather than destructive browse-time replacement.

### Smart Manga and direction assistance
- three non-mutating Smart Manga candidates per request;
- purpose/panel-count constraints, reproducible seed, balanced/dynamic/emotion variants;
- **stable / standard / bold intensity**;
- purposes covering action, conversation, gag, daily, climax, 4-koma, **rom-com, cute, suspense, and character introduction**;
- optional reusable base-character placement across a chosen candidate;
- **per-panel direction dice** preserving geometry/background/dialogue/role while re-proposing camera/effects/pose/expression/gaze;
- stronger derived panel summaries with pose/expression/gaze, camera, background/time, dialogue snippet, effects, and breakout.

### Character identity
- project-level reusable base-character library and repeated placement;
- **three visual identity modes**: external Character Sheet, text appearance description, or no-sheet/AI-designed appearance;
- free “what kind of character?” description plus hair/eyes/outfit/distinctive-feature fields with suggestions;
- Character-Sheet-free identity guidance carried into `.manga.json`, manifest, and generated prompt;
- Output-tab Character Sheet requirement map and missing-reference-key warning.

### Beginner UI / UX
- anatomy-color-coded review/editor stick figures and monochrome clean-AI figures;
- beginner camera labels and explanations;
- **simple camera distance/angle preview diagram**;
- maintained localized Japanese/English Help guide;
- guided free-text background location/weather/mood;
- **background scene presets** that remain editable;
- **balloon presets** for common speech/thought/shout/whisper/narration/off-screen placements;
- clearer Page → Character → selected-panel refinement → Output workflow and mobile candidate cards.

### AI handoff and export
- coordinated timestamp + state-hash filenames;
- AI generation ZIP containing clean PNG, `.manga.json`, prompt, and manifest — annotated PNG excluded;
- Review / archive ZIP adding annotated PNG under the same export identity;
- **manifest v3 as the read-first handoff authority** with explicit file roles, generation inputs, character identity guidance, and Character Sheet requirements;
- short Japanese/English **“extract ZIP and read manifest first”** message with copy action;
- export UUID, full state SHA-256, canvas, reading direction, package mapping, and handoff instructions.

### Existing manga-direction foundation
- background semantics, balloons, effects, borderless/bleed/breakout, expression/gaze;
- clean AI export, strict text allowlist, JSON import/export;
- browser-local autosave, Undo/Redo, mobile tabs.

## Next

### Pose authoring
- direct joint dragging;
- support / center-of-gravity / torso semantics;
- reusable user pose presets;
- small pose thumbnails/previews before applying presets.

### Character Sheet files
- browser-local image registration;
- thumbnail binding by `referenceKey`;
- explicit optional inclusion of registered Character Sheet files in an AI package;
- actual-file presence diagnostics in addition to current requirement/key diagnostics;
- safe package mapping when multiple characters use multiple sheets.

### Panel geometry
- drag panel boundaries;
- shared-boundary editing that moves adjacent panels together;
- irregular / diagonal frame shapes.

### Text production
- balloon tail target;
- vertical Japanese text layout;
- deterministic post-render text composition.

### Manga direction
- multi-page / spread support;
- memory / dream / flashback modes;
- page-turn / reveal planning;
- eye-flow visualization;
- **true camera crop/framing guide tied to page/crop coordinates** (the shipped 0.7 camera diagram is explanatory only);
- additional direction profiles informed by generated-result comparisons.

### Template evolution
- user-saved layout/direction presets;
- named custom Smart Manga profiles;
- richer pose/camera visual examples;
- template recommendation from intended beat count without replacing human direction.

### Export integrity
- optional per-file SHA-256 values in manifest in addition to shared project-state hash;
- export-package import / restore flow;
- package compatibility checks across future data/manifest versions.

### Usability validation
- representative mobile touch-task walkthroughs;
- keyboard/focus/accessibility audit;
- actual-user feedback on Smart Manga candidate comparison, character identity modes, and handoff clarity;
- lightweight feedback collection only if an explicit privacy boundary is added (no analytics by default).

### Integration
- optional provider adapters at the export boundary only.
