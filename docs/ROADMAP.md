# Roadmap

## Shipped through Prototype 0.12.9

### Page, layout, reading and lettering
- manuscript/canvas presets including portrait/social/video, B5, A4, Webtoon, and custom sizes;
- explicit RTL/LTR panel reading direction;
- automatic geometry-based panel numbering synchronized across canvas, Panel Peek/List, Scene Templates, prompt, manifest, and exports;
- vertical Japanese (`vertical-rl`) project default with horizontal and per-balloon/per-SFX overrides;
- 1–6 panel, conversation/action/climax, and 4-koma layout families;
- clean/review export separation with dynamic canvas dimensions.

### Story-readable authoring and direction
- per-panel `actionIntent`;
- Panel Peek, Panel List / Shot List, and authoring-only Panel Chips;
- camera/figure-size diagnostics and Crop Guide;
- advisory Manga Check;
- support state, motion phase, near-object depth target, foreshortening, and scene-continuity semantics;
- airborne/action-specific pose semantics and cross-model interpretation priority;
- contact-aware action/pose resolution for interactions such as hugs;
- action/pose conflict warnings and scene/style conflict warnings.

### Scene Template Studio / Smart Manga
- category/search/template cards with description, use case, panel count, beat flow, and bounded derivation;
- browser-local custom templates with normalized geometry and no character-specific identity;
- romance, battle, emotion, daily, comedy, suspense, and character-introduction packs;
- explicit two-visible templates and quick filters;
- per-panel cast visibility/cast semantics and template cast requirements;
- bounded Smart Manga candidates with seed, emphasis, intensity, and selected-panel direction dice.

### Character identity
- reusable project-level base-character library;
- `sheet` / `description` / `free` identity modes;
- appearance summary authority even when optional hair/eyes/outfit/features fields are blank;
- Character Sheet requirement diagnostics based on actually used characters;
- no universal Character Sheet requirement in generated prompts.

### AI handoff and export
- manifest-first AI ZIP containing clean PNG, semantic `.manga.json`, prompt, and manifest;
- review/archive ZIP adds annotated PNG under the same export identity;
- strict `TEXT TO RENDER` visible-text allowlist;
- model-independent authority split between Clean PNG, semantic JSON/prompt, character guidance, and art direction;
- current-page Render Contract that rejects prior-conversation/prior-image story carryover;
- exact panel/cast/setting/text constraints represented at high signal;
- producer provenance in manifest with app version, deployed commit, build source, and deployment timestamp;
- GitHub Pages deployment stamps exact `GITHUB_SHA` into deployed `build-info.json`;
- local/offline build-info fallback remains zero-build and dependency-free.

### Runtime / validation
- semantic runtime ownership under `web/runtime/` rather than chronology-named patch files;
- explicit runtime load-order registry mirrored by validation scripts;
- repository, UI-contract, reading/lettering, spatial, cross-model, template, cast, generation-contract, render-brief, and producer-provenance CI validation.

## Highest-priority next candidates

### 1. Panel-first / hybrid generation contract
- export a self-contained generation contract per panel rather than requiring one image model call to obey the whole page at once;
- preserve normal isolated panels as independent generation units;
- allow explicit shared-canvas generation groups for cross-panel breakout, shared-background, or spread effects;
- add deterministic page composition after panel generation;
- keep provider adapters at the export boundary.

### 2. Generated-result validator
- upload a generated manga page and compare it against Blueprint intent;
- verify panel count/order, visible cast, identity consistency, action/pose, camera, background continuity, breakout, lettering allowlist, and writing direction;
- distinguish hard contract violations from aesthetic variance;
- optionally emit targeted panel re-generation instructions rather than redoing the entire page.

### 3. Reference Asset Library
- generalize references beyond Character Sheets to characters, locations, props, outfits, vehicles, styles, poses, and lighting;
- browser-local registration and thumbnail binding;
- explicit continuity lock / soft-reference modes;
- optional safe inclusion of registered reference files in generation packages;
- avoid silently uploading private assets.

### 4. Pose Studio + Contact Graph
- direct joint dragging for head / shoulders / elbows / hands / hip / knees / feet;
- reusable pose presets, mirroring, reset, support/center-of-gravity/torso controls;
- semantic contact edges such as hand→shoulder, arm→back, foot→ground, hand→prop;
- contact validation for hugs, grabs, throws, strikes, hand-holding, and prop handling.

### 5. Spatial continuity grammar
- 180-degree action axis;
- per-character screen side;
- entry/exit edge and movement direction;
- eyeline vectors and shot/reverse-shot relationship;
- intentional-axis-break override;
- Manga Check warnings for accidental left/right inversion.

## High-priority direction candidates

### Perspective / lens contract
- horizon line and vanishing-point semantics;
- camera height, pitch, roll, and focal-length equivalent;
- richer target-body-region framing beyond current distance/viewpoint labels;
- optional perspective guide export without turning the product into a full 3D drawing application.

### Depth layers / occlusion
- foreground / midground / background semantic bands;
- explicit front/behind relations;
- per-entity occlusion constraints;
- stronger near-object generation maps.

### Eye-flow / focal path
- primary focal target per panel;
- entry/exit reading vectors;
- page-level eye-flow visualization;
- warnings when focal flow fights selected RTL/LTR reading order;
- integrate balloon placement into eye-flow rather than treating text as an independent overlay.

### Gutter / transition semantics
- encode temporal gap, spatial continuity, and transition rhythm between panels;
- distinguish moment-to-moment, action-to-action, subject-to-subject, and scene transitions;
- make gutter width/overlap suggestions advisory, not automatic authority.

### Multi-page / spread / page-turn
- multiple pages per project;
- two-page spreads and binding-safe zones;
- page-turn/reveal intent;
- scene-level pacing across page boundaries;
- preserve current single-page format compatibility during migration.

## Continuity libraries

### Scene / location library
- reusable named locations such as `bedroom-A` / `classroom-A`;
- inherited scene anchors and fixed background elements;
- lighting direction/temperature/softness continuity.

### Prop / costume state
- reusable props with owner, hand, location, and state;
- costume state/variant continuity;
- Manga Check for unexplained disappearance, hand-switching, or state reset.

## Text production
- balloon-tail target / speaker visual connection;
- deterministic final Japanese vertical typesetting;
- punctuation, ruby, kenten, tate-chu-yoko;
- SFX rotation/path controls;
- deterministic post-render lettering composition after image generation.

## Provider-adapter ecosystem
- ChatGPT-oriented package adapter;
- Gemini-oriented package adapter;
- ComfyUI / ControlNet adapter for pose/depth/edge/segmentation conditioning;
- capability declarations so unsupported features degrade explicitly instead of being silently discarded;
- core project state remains provider-independent.

## Panel geometry and authoring
- drag/shared panel boundaries;
- irregular/diagonal frames;
- inset/overlap and safer bleed visualization;
- extend reading-order grouping rules for arbitrary geometry;
- favorites/recent templates and import/export template packs.

## Longer-term / optional
- script → scene/beat/page planning assistance;
- revision/diff history beyond current Undo/Redo;
- collaboration only if privacy/hosting boundaries are intentionally introduced;
- animatic/audio/timeline features only if the product scope expands beyond manga planning.

## Explicit non-goals for now

Manga Blueprint Studio should not become a replacement for a full illustration application, full 3D package, cloud collaboration suite, or hosted proprietary image-generation service. Its differentiator remains **human-directed manga semantics that can be handed to multiple downstream generators with explicit, inspectable contracts**.
