# Roadmap

## Shipped in prototype 0.5

- clearly named manuscript/canvas presets: 800×1130 default, 1:1, 4:5, 3:4, 9:16, 16:9, B5, A4, Webtoon, custom;
- explicit reading direction: RTL default plus LTR, with geometry-based renumbering;
- dynamic layout generation for different aspect ratios;
- 4-koma 1×4, 2×2, and 4×1 variants;
- common 1–6 panel, conversation, action, and climax layouts;
- Smart Random by purpose and optional panel count;
- project-level reusable base-character library and repeated placement into panels;
- anatomy-color-coded stick figures in editor/annotated review, monochrome clean-AI pose figures;
- panel overview and deterministic at-a-glance summaries;
- beginner camera labels (`Extreme close / 超寄り`, `Low angle / あおり`, etc.) with explanations;
- quick camera presets;
- maintained Japanese/English Help guide;
- background location/weather/mood suggestions with unrestricted free-text entry;
- coordinated timestamp + state-hash filenames;
- one-click ZIP containing clean/annotated PNG, `.manga.json`, prompt, and manifest;
- export manifest with UUID, full state SHA-256, canvas, reading direction, and filenames;
- all earlier manga-direction features: background semantics, balloons, effects, borderless/bleed/breakout, expression/gaze, clean AI export, prompt safety, mobile tabs, Undo/Redo.

## Next

### Pose authoring
- direct joint dragging;
- support / center-of-gravity / torso semantics;
- reusable user pose presets.

### Character Sheets
- browser-local image registration;
- thumbnail binding by reference key;
- optional Character Sheet files in export ZIP after explicit user registration;
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
- camera crop/framing guide tied to distance settings.

### Template evolution
- user-saved layout presets;
- weighted/random seed controls;
- preview thumbnails for layout/camera choices;
- template recommendation from intended beat count without replacing human direction.

### Export integrity
- optional per-file SHA-256 values in manifest in addition to the existing shared project-state hash;
- explicit export-package import / restore flow;
- package compatibility checks across future data-format versions.

### Integration
- optional provider adapters at the export boundary only.
