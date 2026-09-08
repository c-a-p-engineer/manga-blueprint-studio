# Roadmap

## Shipped in prototype 0.6

- clearly named manuscript/canvas presets: 800×1130 default, 1:1, 4:5, 3:4, 9:16, 16:9, B5, A4, Webtoon, custom;
- explicit reading direction: RTL default plus LTR, with geometry-based renumbering;
- dynamic layout generation for different aspect ratios;
- 4-koma 1×4, 2×2, and 4×1 variants;
- common 1–6 panel, conversation, action, and climax layouts;
- **Smart Manga / おまかせ漫画** with three non-mutating candidates per request;
- purpose/panel-count constraints plus reproducible seed and balanced/dynamic/emotion variants;
- optional placement of the currently selected reusable base character across a chosen Smart Manga proposal;
- **per-panel direction dice** for camera/effects and placed-character pose/expression/gaze without replacing geometry/background content/balloons;
- project-level reusable base-character library and repeated placement into panels;
- anatomy-color-coded stick figures in editor/annotated review, monochrome clean-AI pose figures;
- panel overview and deterministic at-a-glance summaries;
- beginner camera labels (`Extreme close / 超寄り`, `Low angle / あおり`, etc.) with explanations;
- quick camera presets;
- maintained Japanese/English Help guide, including Smart Manga and package guidance;
- background location/weather/mood suggestions with unrestricted free-text entry;
- coordinated timestamp + state-hash filenames;
- **AI generation ZIP** containing clean PNG, `.manga.json`, prompt, and manifest — annotated PNG intentionally excluded;
- **Review / archive ZIP** adding annotated PNG under the same unchanged-state export identity;
- export manifest v2 with package type, UUID, full state SHA-256, canvas, reading direction, visual-reference/review mapping, and filenames;
- clearer Page → Character → selected-panel refinement → Output workflow hints and mobile candidate cards;
- all earlier manga-direction features: background semantics, balloons, effects, borderless/bleed/breakout, expression/gaze, clean AI export, prompt safety, mobile tabs, Undo/Redo.

## Next

### Pose authoring
- direct joint dragging;
- support / center-of-gravity / torso semantics;
- reusable user pose presets;
- small pose thumbnails/previews before applying presets.

### Character Sheets
- browser-local image registration;
- thumbnail binding by reference key;
- optional Character Sheet files in AI-generation ZIP after explicit user registration;
- missing-sheet diagnostics for referenced keys.

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
- camera crop/framing guide tied to distance settings;
- additional direction profiles informed by real generated-result comparisons.

### Template evolution
- user-saved layout/direction presets;
- named custom Smart Manga profiles;
- richer visual thumbnails for camera choices;
- template recommendation from intended beat count without replacing human direction.

### Export integrity
- optional per-file SHA-256 values in manifest in addition to the shared project-state hash;
- explicit export-package import / restore flow;
- package compatibility checks across future data-format versions.

### Usability validation
- representative mobile touch-task walkthroughs;
- keyboard/focus/accessibility audit;
- lightweight in-product feedback for identifying confusing controls without adding analytics by default.

### Integration
- optional provider adapters at the export boundary only.
