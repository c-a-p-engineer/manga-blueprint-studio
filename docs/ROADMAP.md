# Roadmap

## Shipped through Prototype 0.13.0

### Project / persistence foundation
- stable `meta.workId` plus stable page identity;
- page metadata for visible number, order, optional title, and future container assignment;
- IndexedDB-backed work persistence with active-work tracking;
- project autosave no longer depends on historical project `localStorage` keys;
- same-`workId` JSON import is protected from silent overwrite;
- reserved `volume | chapter | folder` container schema for later hierarchy UI.

### Multi-page core
- multiple pages inside one work;
- add, select, duplicate, delete, move earlier/later, and sequential renumber;
- editable visible page number with duplicate protection;
- optional page title;
- page duplication regenerates page/panel/placed-character/balloon instance IDs;
- active page is remembered per work in IndexedDB;
- startup restores remembered page before page-selection persistence is enabled;
- page controls include narrow-screen/mobile layout handling;
- existing editor/render/handoff logic resolves the selected page through `currentPage()` instead of assuming `pages[0]`.

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
- repository, project-storage, multi-page, UI-contract, reading/lettering, spatial, cross-model, template, cast, generation-contract, render-brief, and producer-provenance CI validation.

---

## Delivery phases

| Phase | Priority | Goal | Key work | Status |
|---:|:---:|---|---|:---:|
| 0 | S | Storage / stable identity | `workId`, page/container identity, IndexedDB, import conflict protection | **Shipped** |
| 1 | S | Multi-page Core | page CRUD/reorder/number/title/selection persistence | **Shipped in 0.13.0** |
| 2 | S | Work / Volume / Folder management | work library, volume/chapter/folder UI, page moves | Next |
| 3 | S | Backup / Restore | complete backup ZIP, checksum, preview, transactional restore | Planned |
| 4 | S | Scoped Export | page selection/range/volume/work export contracts | Planned |
| 5 | S | Panel-first / Hybrid generation | per-panel units, generation groups, deterministic composition | Planned |
| 6 | A | Cross-page continuity | reference assets, location/prop/outfit continuity | Planned |
| 7 | A/B | Manga direction expansion | spatial grammar, perspective, eye-flow, gutters, spreads, typesetting | Planned |

## Phase 2 — Work / Volume / Folder management

### Work library
- list multiple IndexedDB works;
- create, rename, duplicate, open, and delete works with explicit confirmation;
- show title, updated time, and page count;
- keep stable `workId` independent from visible title;
- never silently switch the active work while browsing.

### Hierarchy
- expose the already-reserved `volume | chapter | folder` containers;
- create/rename/reorder/delete containers;
- optional parent-child hierarchy where useful;
- move pages between containers without changing page identity;
- clear behavior for deleting a non-empty container (move pages or explicit destructive choice; never silent loss).

### Acceptance direction
- one work can contain ungrouped pages and grouped pages;
- ordering is deterministic;
- page selection survives normal hierarchy edits;
- work/container management remains local-only and provider-independent.

## Phase 3 — Backup / Restore

- whole-work backup ZIP with semantic project state and browser-local reusable assets/templates that are explicitly included;
- backup manifest with schema/version, work identity, file roles, counts, checksums, and creation metadata;
- restore preview before mutation;
- conflict choices for same `workId`: replace, import as new work, or cancel;
- transactional restore so partial failure does not leave mixed state;
- deterministic integrity checks for required files, hashes, JSON parseability, and counts;
- no semantic/aesthetic AI judgment in backup validation.

## Phase 4 — Scoped Export

- export current page (existing behavior);
- selected pages;
- page range;
- container/volume;
- whole work;
- manifest declares exact scope and ordered page IDs/numbers;
- multi-page prompt/package conventions remain explicit rather than relying on downstream inference;
- provider adapters remain at the export boundary.

## Phase 5 — Panel-first / Hybrid generation contract

- export a self-contained generation contract per ordinary isolated panel;
- preserve explicit shared-canvas generation groups for cross-panel breakout, shared-background, or spread effects;
- deterministic page composition after panel generation;
- exact geometry and crop/placement metadata for recomposition;
- targeted re-generation can replace one generation unit without invalidating unrelated panels;
- no requirement for a semantic AI result validator as part of the core pipeline.

## Phase 6 — Cross-page continuity / Reference Asset Library

- generalize references beyond Character Sheets to characters, locations, props, outfits, vehicles, styles, poses, and lighting;
- browser-local registration and thumbnail binding;
- explicit continuity-lock / soft-reference modes;
- named locations such as `bedroom-A` / `classroom-A` with inherited anchors;
- prop owner/hand/location/state and costume variant continuity;
- optional safe inclusion of registered reference files in generation packages;
- never silently upload private assets.

## Phase 7 — Manga direction expansion

### Spatial continuity grammar
- 180-degree action axis;
- per-character screen side;
- entry/exit edge and movement direction;
- eyeline vectors and shot/reverse-shot relationship;
- intentional-axis-break override;
- Manga Check warnings for accidental left/right inversion.

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

### Spread / page-turn
- two-page spreads and binding-safe zones;
- page-turn/reveal intent;
- scene-level pacing across page boundaries;
- preserve ordinary single-page editing/export semantics unless an explicit spread/group is selected.

### Text production
- balloon-tail target / speaker visual connection;
- deterministic final Japanese vertical typesetting;
- punctuation, ruby, kenten, tate-chu-yoko;
- SFX rotation/path controls;
- deterministic post-render lettering composition after image generation.

## Additional authoring candidates

### Pose Studio + Contact Graph
- direct joint dragging for head / shoulders / elbows / hands / hip / knees / feet;
- reusable pose presets, mirroring, reset, support/center-of-gravity/torso controls;
- semantic contact edges such as hand→shoulder, arm→back, foot→ground, hand→prop;
- contact validation for hugs, grabs, throws, strikes, hand-holding, and prop handling.

### Panel geometry
- drag/shared panel boundaries;
- irregular/diagonal frames;
- inset/overlap and safer bleed visualization;
- extend reading-order grouping rules for arbitrary geometry;
- favorites/recent templates and import/export template packs.

### Provider-adapter ecosystem
- ChatGPT-oriented package adapter;
- Gemini-oriented package adapter;
- ComfyUI / ControlNet adapter for pose/depth/edge/segmentation conditioning;
- capability declarations so unsupported features degrade explicitly instead of being silently discarded;
- core project state remains provider-independent.

## Longer-term / optional

- script → scene/beat/page planning assistance;
- revision/diff history beyond current Undo/Redo;
- collaboration only if privacy/hosting boundaries are intentionally introduced;
- animatic/audio/timeline features only if the product scope expands beyond manga planning.

## Explicit non-goals for now

Manga Blueprint Studio should not become a replacement for a full illustration application, full 3D package, cloud collaboration suite, or hosted proprietary image-generation service. Its differentiator remains **human-directed manga semantics that can be handed to multiple downstream generators with explicit, inspectable contracts**.
