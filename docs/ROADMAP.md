# Roadmap

## Shipped in prototype 0.4

- manuscript/canvas presets: current, 1:1, 4:5, 3:4, 9:16, 16:9, B5, A4, Webtoon, custom;
- dynamic layout generation for different aspect ratios;
- 4-koma 1×4, 2×2, and 4×1 variants;
- common 1–6 panel, conversation, action, and climax layouts;
- Smart Random by purpose and optional panel count;
- panel overview and deterministic at-a-glance summaries;
- beginner camera labels (`Extreme close / 超寄り`, `Low angle / あおり`, etc.) with explanations;
- quick camera presets;
- first-use / reopenable usage dialog;
- all prototype 0.3 direction features: background, balloons, effects, borderless/bleed/breakout, expression/gaze, clean AI export, annotated export, prompt safety, mobile tabs, Undo/Redo.

## Next

### Pose authoring
- direct joint dragging;
- support / center-of-gravity / torso semantics;
- reusable user pose presets.

### Character Sheets
- browser-local image registration;
- thumbnail binding by reference key;
- export package manifest.

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

### Integration
- optional provider adapters at the export boundary only.
