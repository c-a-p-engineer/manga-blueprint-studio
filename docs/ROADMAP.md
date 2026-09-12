# Roadmap

`docs/ROADMAP.md` is the **only current status authority** for delivery phases. Detailed design notes may explain future contracts, but they must not maintain a competing phase-status truth.

## Shipped through Prototype 0.19.0

- Prototype 0.19.0: one-level editable inset panels, explicit AI handoff hierarchy, Page submodes, Panel disclosure groups, and deterministic P0 regression coverage.

- Prototype 0.18.0: manga-aware panel-layout grammar with tight shared diagonal seams, stronger panel-area contrast, Story Template remapping, and three new layout-coverage templates.


### Foundation / persistence

- stable work/page/container identity;
- IndexedDB-backed multi-work persistence;
- explicit save-vs-activate boundary;
- per-work active-page persistence;
- same-`workId` import protection;
- full-work copy/import-as-new identity regeneration/remapping;
- no migration from historical browser project-autosave `localStorage`.

### Multi-page / hierarchy

- multiple pages per work;
- add/select/duplicate/delete/reorder/renumber/title;
- optional `volume | chapter | folder` containers;
- nesting/reordering/reparenting;
- page-to-container assignment;
- cycle protection;
- confirmed non-destructive container deletion.

### Manga-first editor shell

- app-level header separated from active work identity;
- work title on its own line;
- breadcrumb for optional container ancestry + current page;
- page codes such as `P001` while `pageNumber` remains numeric;
- previous/next/add/direct page navigation above the canvas;
- explorer-style **Work Structure / 作品構成**;
- detailed page/container CRUD retained as advanced controls;
- **Page settings / ページ設定** separated from primary navigation;
- Japanese-first cleanup of primary authoring/status/style labels;
- **Prototype 0.16.0 mobile header** uses an explicit branding row plus an app-action row so action labels do not wrap inside buttons.

### Documentation / user guidance

Prototype 0.15.1 aligned current documentation with the shipped 0.15 editor shell and established a durable documentation map/update contract.

- current canonical docs rewritten around shipped behavior rather than old prototype chronology;
- `docs/README.md` defines document ownership and current-vs-historical boundaries;
- `docs/USER-GUIDE.md` provides the current user workflow;
- `/guide.html` provides a dedicated public usage screen;
- in-editor quick Help links to the full guide;
- CI validates key documentation/version/guide alignment.

### Manga authoring

- **Prototype 0.17.0 Phase 1 runtime/UI cutover**: Vite + TypeScript production entry, commit-aware cache busting, template-first Page settings, explicit apply CTA, progressive disclosure for manual layout, and removal of the legacy hierarchy editor from the primary Page surface;
- **Prototype 0.16.4 task-flow simplification**: Story Template Studio moved into the upper panel-layout flow with sample dialogue/SFX toggle + cast + visible apply action; active work title opens the combined Work Explorer and dedicated volume/chapter/folder editing is removed from the primary UI;
- **Prototype 0.16.3 template cast UX**: card → explicit reusable-character selection → apply, removal of the redundant middle preview, exact selected-cast routing for one/two-visible templates, and six editable starter characters for new works;
- dynamic manuscript/canvas presets;
- RTL/LTR panel reading direction;
- geometry-based panel order synchronization;
- vertical/horizontal lettering direction with per-balloon/per-SFX overrides;
- common panel layouts and 4-koma variants;
- **Prototype 0.16.0 convex-quadrilateral panel boundaries** with direct four-corner editing;
- panel-shape presets: rectangle, diagonal-left/right, trapezoid-left/right;
- irregular layout presets: **斜め3コマ** and **斜め4コマ 2×2**;
- polygon-aware editor border/hit area and clean/annotated PNG clipping;
- **Prototype 0.16.1 annotated panel-number badge follows the authored top-right quadrilateral corner inward while reshaping** rather than following the compatibility bounding box;
- Story Template Studio with card-first discovery, beat-flow/bounded derivation/custom local templates;
- **Prototype 0.16.2 Story Template presentation catalog** with compound cast/story/presentation quick filters, presentation chips, shape-aware diagonal thumbnails, 演出あり / 演出なし comparison, and multiple samples for special frames/line effects/breakout;
- Smart Manga bounded candidate proposals;
- reusable base-character identity with `sheet | description | free` modes;
- action intent, pose/expression/gaze, support/motion/depth semantics;
- background, balloons/dialogue, SFX/effects;
- Panel Peek/List/Chips, Crop Guide, camera/figure diagnostic, Manga Check.

### AI handoff

- selected-page AI generation ZIP;
- selected-page Review/archive ZIP;
- manifest-first handoff;
- clean-vs-annotated visual separation;
- Character Sheet requirement diagnostics;
- strict exact-text allowlist;
- current-page render contract against prior-context carryover;
- explicit reference-role and preservation contracts;
- **Prototype 0.15.2 bounded Design Direction Pass** for focal hierarchy, eye flow, negative space, contrast, and detail-density rhythm without changing authored manga structure;
- optional quadrilateral points exposed with each panel's geometry in the current render brief;
- producer/build provenance in exported manifest.

## Delivery phases

| Phase | Priority | Goal | Status |
|---:|:---:|---|:---:|
| 0 | S | Storage / stable identity | **Shipped** |
| 1 | S | Multi-page Core | **Shipped in 0.13.0** |
| 2 | S | Work / Volume / Folder management | **Shipped in 0.14.0** |
| 2.5 | S | Manga-first editor shell / navigation UX | **Shipped in 0.15.0; docs/guide hardened in 0.15.1** |
| 2.6 | A | Bounded Design Direction handoff | **Shipped in 0.15.2** |
| 3 | S | Backup / Restore | **Next** |
| 4 | S | Scoped Export | Planned |
| 4.5 | S-enabler | Advanced Panel Geometry — quadrilateral foundation | **First slice shipped in 0.16.0; annotation follow-up in 0.16.1** |
| 5 | S | Panel-first / Hybrid generation | Planned |
| 6 | A | Cross-page continuity / Reference Assets | Planned |
| 7 | A/B | Manga direction expansion | Planned |

## Sequencing principle

Strategic priority and implementation order are different.

A strategically important feature may depend on lower-headline-priority enabling work. Pull forward only prerequisites whose later addition would cause meaningful rework, identity/schema churn, or destructive migration.

Current dependency shape:

```text
Storage / stable identity
        ↓
Multi-page core
        ↓
Work hierarchy
        ↓
Manga-first navigation shell
        ↓
Backup / Restore
        ↓
Scoped Export
        ↓
Advanced Panel Geometry (quadrilateral first slice shipped; further hardening can continue)
        ↓
Panel-first / Hybrid
        ↓
Cross-page continuity
        ↓
Manga direction expansion
```

Panel-first remains strategically important, but deterministic panel crops/composition should build against the shipped panel-shape model rather than hard-coding rectangle-only assumptions and rewriting the compositor later.

## Phase 3 — Backup / Restore — Next

### Goal

Make a work recoverable and transferable before generation/export scope expands further.

### Backup package

Introduce a dedicated backup format separate from AI generation/review packages.

Candidate shape:

```text
<work>.manga-backup.zip
├─ backup-manifest.json
├─ project.manga.json
├─ templates/
│  └─ custom-templates.json      # when explicitly included by the contract
├─ assets/
│  ├─ index.json                 # future reference assets when supported
│  └─ <content-addressed files>
└─ thumbnails/                   # optional/rebuildable
```

### Required behavior

- whole-work project state;
- backup schema/version;
- work identity;
- file roles and counts;
- checksums/hashes;
- explicit optional-library inclusion;
- restore preview before mutation;
- corrupted/mismatched backup rejection before mutation;
- generation ZIP must not be mistaken for a full backup.

### Restore conflict behavior

If imported backup `workId` does not exist, restore normally.

If the same `workId` exists, block and require one choice:

1. **別作品として取り込む** — import as a new work with identity remapping;
2. **既存作品を上書き** — destructive replace after explicit confirmation;
3. **キャンセル**.

Never infer overwrite from title equality alone.

Restore should be transactional: failure leaves the existing library untouched.

### Verification

- backup from one browser restores in a clean browser;
- required files/hashes/schema/counts are validated;
- same-work conflicts cannot silently overwrite;
- failed restore does not leave mixed partial state;
- restored work/page opens correctly.

## Phase 4 — Scoped Export

### Goal

Export exactly the pages the user intends.

### Scopes

- current page (existing behavior);
- explicit selected pages;
- page range such as `3-5,8`;
- container / volume / chapter;
- whole work;
- explicit two-page spread as a special shared-canvas scope.

### Contract

- manifest declares exact scope and ordered work/container/page IDs/numbers;
- single-page package remains self-contained;
- multi-page package gets a root batch/work manifest plus per-page self-contained contracts;
- root prompt orchestrates; it does not replace per-page execution prompts;
- selected page 7 export must not silently inherit unrelated page 6/8 semantics;
- provider adapters remain at export boundary.

## Phase 4.5 — Advanced Panel Geometry — quadrilateral foundation

### Why before Panel-first

Serialized panels remain rectangle-compatible through `rect: x/y/w/h`, but Prototype 0.16.0 adds an optional convex-quadrilateral `shape`. Panel-first will need deterministic crop masks, placement, hit testing, reading-order geometry, and final recomposition. Shipping the common shape model first avoids building the future compositor around rectangle-only assumptions.

### Shipped first slice — Prototype 0.16.0

Support **convex quadrilateral panels** as the first irregular-shape model. This covers common diagonal/trapezoid frames without jumping immediately to arbitrary polygons or Bézier curves.

Shipped authoring behavior:

- selected panel has **コマ形状 / Panel shape** controls;
- four visible corner handles can be dragged independently;
- presets: rectangle, diagonal-left, diagonal-right, trapezoid-left, trapezoid-right;
- resetting to rectangle uses the current quadrilateral bounding box;
- invalid self-intersection, near-zero area, and unusably short edges are rejected;
- normal rectangle workflows remain unchanged unless a shape is selected;
- Page settings includes **斜め3コマ** and **斜め4コマ 2×2** irregular layout presets;
- canvas resizing scales quadrilateral points together with the page;
- irregular shapes currently disable bleed rather than pretending rectangular bleed semantics still apply.

### 0.16.1 annotation polish

The authoring-only panel-number badge is anchored from the authored top-right polygon corner toward the panel interior. During direct corner dragging it therefore follows the actual frame shape instead of the quadrilateral bounding box. This changes only annotated/editor presentation; clean AI PNG output remains label-free.

Current data contract:

```json
{
  "rect": {"x": 35, "y": 35, "w": 355, "h": 350},
  "shape": {
    "kind": "quad",
    "preset": "custom",
    "points": [
      {"x": 35, "y": 35},
      {"x": 390, "y": 55},
      {"x": 390, "y": 385},
      {"x": 35, "y": 365}
    ]
  }
}
```

`rect` is the bounding-box / compatibility representation. `shape` is authoritative for the visible boundary, clipping, and hit testing when present. One panel still has one canonical visible boundary.

### Shape-aware systems in the first slice

- editor rendering and selection/hit testing;
- clean PNG and annotated PNG clipping/borders;
- panel shape presets and layout-template application;
- project normalization/schema compatibility;
- canvas resize scaling;
- reading-order synchronization through the shape bounding box + explicit `order`;
- AI clean-blueprint semantics and render-brief geometry;
- page duplication/full-work cloning through ordinary project-state cloning.

Splitting an irregular panel currently uses its compatibility bounding box and produces rectangular child panels. This is explicit degradation rather than an attempt to infer new irregular child topology.

### Deferred geometry expansion

- snapping corner handles to page margins / neighboring guide coordinates;
- linked/shared-boundary dragging across neighboring panels;
- arbitrary 5+ point polygons;
- concave/self-intersecting frames;
- Bézier/curved borders;
- topology-aware splitting of irregular panels;
- automatic topology repair for arbitrary freeform layouts;
- generalized bleed semantics for irregular edges.

Those can follow once the quadrilateral geometry proves stable. Shared-boundary editing should build on the same shape model rather than become a separate geometry system.

### Verification

For the shipped first slice:

- old rectangle-only projects load with no visible geometry change;
- rectangle ↔ quadrilateral conversion participates in Undo/Redo;
- corner dragging rejects invalid quadrilaterals;
- selected/hit-tested region uses the rendered polygon;
- clean and annotated exports use the same polygon boundary;
- RTL/LTR order remains deterministic through the compatibility bounding box;
- templates that do not opt into irregular geometry remain rectangles;
- the render brief exposes the same authored quad points;
- future Panel-first compositor can consume the same polygon/mask contract.

Remaining interaction/visual QA should continue to include narrow mobile screens, corner-handle touch ergonomics, and combinations with breakout/effects.

## Phase 5 — Panel-first / Hybrid generation

### Goal

Reduce whole-page instruction failure and enable targeted re-generation while preserving manga-specific cross-panel effects.

### Planned behavior

- normal isolated panels become self-contained generation units;
- each unit includes clean cropped blueprint, semantic contract, references, and output naming;
- cross-panel breakout/shared-background/spread cases use explicit `generationGroupId` or equivalent shared-canvas groups;
- deterministic compositor recipe records exact crop/mask/placement geometry, including Phase 4.5 quadrilateral boundaries;
- one failed/re-generated unit can be replaced without invalidating unrelated panels;
- page-first export remains available during transition;
- no semantic AI result-grader is required as a core pipeline gate.

### Verification

- generated panel units can reconstruct the authored page geometry exactly;
- grouped effects are not accidentally split;
- dimensions/naming/crop/mask/placement are deterministically checkable.

## Phase 6 — Cross-page continuity / Reference Asset Library

### Goal

Make long works more stable across pages without silently uploading private reference material.

### Planned reference types

- character;
- location;
- prop;
- outfit/costume;
- vehicle;
- style;
- pose;
- lighting.

### Planned semantics

- stable reference IDs;
- browser-local registration/thumbnail binding;
- continuity-lock vs soft-reference modes;
- location/prop/outfit state transitions;
- inherited work/container defaults with page overrides;
- optional explicit inclusion in generation/backup packages;
- no silent remote upload.

## Phase 7 — Manga direction expansion

### Spatial continuity

- 180-degree action axis;
- screen side;
- entry/exit direction;
- eyeline vectors;
- shot/reverse-shot relation;
- intentional axis-break override;
- advisory warnings for accidental inversion.

### Perspective / lens

- horizon/vanishing-point semantics;
- camera height/pitch/roll;
- focal-length equivalent;
- richer body-region framing;
- optional perspective guide export without becoming a full 3D package.

### Depth / occlusion

- foreground/midground/background bands;
- front/behind relations;
- per-entity occlusion constraints;
- stronger near-object maps.

### Eye-flow / focal path

- primary focal target per panel;
- entry/exit reading vectors;
- page-level flow visualization;
- RTL/LTR conflict warnings;
- balloon placement integrated into eye-flow reasoning.

### Gutter / transition semantics

- temporal gap;
- spatial continuity;
- moment/action/subject/scene transition type;
- advisory gutter width/overlap suggestions.

### Spread / page-turn

- two-page spreads;
- binding-safe zones;
- page-turn/reveal intent;
- scene pacing across pages;
- preserve normal single-page semantics unless explicit spread/group is selected.

### Deterministic text production

- balloon-tail target;
- final vertical Japanese typesetting;
- punctuation/ruby/kenten/tate-chu-yoko;
- SFX rotation/path;
- deterministic post-render lettering composition.

## Additional authoring candidates

### Pose Studio / Contact Graph

- direct joint dragging;
- saved/mirrored pose presets;
- support/center-of-gravity/torso controls;
- semantic contact edges for hugs/grabs/throws/strikes/hand-holding/props.

### Later panel-geometry expansion

After the quadrilateral foundation ships:

- snapping and linked/shared-boundary dragging;
- inset/overlap authoring;
- arbitrary polygon exploration if real manga use cases justify it;
- safer bleed visualization across irregular edges;
- specialized reading-order assistance for deliberately overlapping/irregular layouts.

### Provider adapters

- ChatGPT-oriented package adapter;
- Gemini-oriented package adapter;
- ComfyUI / ControlNet adapter;
- capability declarations and explicit degradation;
- canonical project state remains provider-independent JSON.

## Explicit non-goals for now

Manga Blueprint Studio is not currently intended to become:

- a full illustration application;
- a complete 3D scene package;
- a hosted proprietary image-generation service;
- a cloud collaboration suite by default.

Its differentiator remains **human-directed manga semantics that can be inspected, edited, and handed to multiple downstream generators with explicit contracts**.

### Runtime migration track

Prototype 0.17.0 establishes the migration boundary: TypeScript/Vite owns the production entry and new UI composition while the current classic-script runtime remains the behavioral reference. Later migration work should move semantic owners to typed ES modules incrementally, preserving export/project contracts and keeping rollback/reference coverage until equivalence is proven.
