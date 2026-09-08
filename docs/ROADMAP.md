# Roadmap

## Shipped in prototype 0.3

- page templates / splitting / reading order;
- stick-figure placement and pose presets;
- camera explanations and expanded camera vocabulary;
- per-panel background direction;
- borderless / inset / impact frames;
- bleed / 断ち切り semantics;
- breakout / ブチ抜き semantics;
- expression and gaze;
- speech / thought / shout / narration balloons;
- manga effects and onomatopoeia;
- panel narrative roles;
- clean AI PNG vs annotated review PNG;
- strict text-render allowlist in prompt;
- legacy 0.1 import;
- Japanese-first mobile tab UI;
- Undo / Redo.

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
- deterministic post-render text composition to avoid AI glyph errors.

### Manga direction
- multi-page / spread support;
- richer inset / cross-panel object editing;
- memory / dream / flashback visual modes;
- page-turn / reveal planning;
- eye-flow visualization;
- camera crop/framing guides tied to distance settings.

### Integration
- optional provider adapters at the export boundary only.
