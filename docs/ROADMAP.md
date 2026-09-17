# Roadmap

`docs/ROADMAP.md` is the **only current status authority** for delivery phases. Detailed design notes may explain future contracts, but they must not maintain a competing phase-status truth.

## Blueprint Engine preview — active experimental track

A headless AI/human co-authoring path is now implemented alongside the existing Web editor.

Shipped preview slices:

- AI-facing Markdown Name DSL;
- deterministic Name → canonical `manga-blueprint/0.2` compilation;
- generated work/page/panel/reusable-character/placement/balloon identity;
- panel energy from narrative / visual / transition importance plus hold;
- primary/secondary attention targets and reading-flow entry/exit metadata;
- candidate layout solver with explainable winning score/candidate list;
- layout candidates including balanced grid, vertical rhythm, hero-top, hero-bottom, action-diagonal and inset-focus;
- camera inference;
- cast slots and semantic pose/gaze/depth/support/motion/contact compilation;
- diagonal/trapezoid panel geometry and one-level inset derivation;
- layered Executable Name renderer: generation-facing clean SVG and human-review annotated SVG from one geometry source;
- page prompt with explicit `TEXT TO RENDER` allowlist;
- `manga-blueprint-name-package/2` manifest-first package metadata;
- CLI entry and CI regression coverage;
- `.manga.json` remains the shared canonical project state so Web refinement stays available.

The Blueprint Engine is an **experimental authoring track**, not a replacement manifest for the established Web generation package. Its core architecture now centers on Executable Name compilation; remaining work is primarily rendering/solver quality, reference binding, raster/provider adapters and broader manga direction semantics.

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
- explorer-style Work Explorer;
- detailed page/container CRUD retained as advanced controls;
- Page settings separated from primary navigation;
- Japanese-first cleanup of primary authoring/status/style labels.

### Manga authoring

- Vite + TypeScript production entry while preserving compatibility-runtime owners;
- Story Template Studio and Smart Manga;
- dynamic manuscript/canvas presets;
- RTL/LTR panel reading direction;
- vertical/horizontal lettering direction;
- manga-aware panel layout grammar;
- convex-quadrilateral panel boundaries and direct corner editing;
- one-level editable inset panels;
- reusable character identity with `sheet | description | free` modes;
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
- bounded Design Direction Pass;
- quadrilateral and inset geometry exposed in handoff;
- producer/build provenance in exported manifest.

## Delivery phases

**Phase 3 — Backup / Restore — Next** remains the next numbered Web product phase. The Blueprint Engine preview is a parallel experimental track and does not silently reorder the established Web roadmap.

| Phase | Priority | Goal | Status |
|---:|:---:|---|:---:|
| E | S-enabler | Headless Blueprint Engine / AI co-authoring | **Executable Name core implemented; active quality expansion** |
| 0 | S | Storage / stable identity | **Shipped** |
| 1 | S | Multi-page Core | **Shipped in 0.13.0** |
| 2 | S | Work / Volume / Folder management | **Shipped in 0.14.0** |
| 2.5 | S | Manga-first editor shell / navigation UX | **Shipped** |
| 2.6 | A | Bounded Design Direction handoff | **Shipped** |
| 3 | S | Backup / Restore | **Next** |
| 4 | S | Scoped Export | Planned |
| 4.5 | S-enabler | Advanced Panel Geometry | **Quadrilateral foundation shipped** |
| 5 | S | Panel-first / Hybrid generation | Planned |
| 6 | A | Cross-page continuity / Reference Assets | Planned |
| 7 | A/B | Manga direction expansion | Planned |

## Sequencing principle

Blueprint Engine work can proceed independently where it reuses the canonical project model. It must not require completion of the Web roadmap merely to compile and inspect a manga plan.

Shared capabilities should converge on reusable semantics rather than duplicate project models:

```text
human natural-language direction
      ↓
AI Name DSL
      ↓
Executable Name compiler
      ↓
canonical project state
      ├─ clean generation visual
      ├─ annotated human review visual
      └─ Web editor refinement
```

The established Web sequence remains:

```text
Storage / stable identity
  → multi-page core
  → work hierarchy
  → manga-first shell
  → Backup / Restore
  → Scoped Export
  → Panel-first / Hybrid
  → Cross-page continuity
  → Manga direction expansion
```

## Blueprint Engine next expansion

Priority candidates:

1. **Pose/contact renderer quality** — articulated silhouettes and contact-point solving so Clean predicts the final composition more closely.
2. **Raster adapter** — deterministic clean/annotated PNG emission from the shared SVG geometry when the environment provides a rasterizer.
3. **Character identity input** — appearance descriptions and explicit Character Sheet/reference keys without requiring Web entry.
4. **Page-turn/spread grammar** — page-level rhythm, turn reveals and spread composition.
5. **Provider adapters** — explicit image-model invocation contracts without moving provider concerns into canonical state.
6. **Solver quality metrics** — compare Clean vs generated outputs for panel geometry/composition preservation.
7. **Agent editing contract** — documented safe edit/recompile/review loop for autonomous agents.

## Existing Web roadmap highlights

### Backup / Restore

Whole-work recoverability and transfer with explicit same-work conflict handling, validation, and transactional restore.

### Scoped Export

Explicit selected pages, ranges, containers, whole work, and spread scopes with root + per-page contracts.

### Panel-first / Hybrid generation

Self-contained panel generation units where possible, explicit shared-canvas groups for cross-panel effects, and deterministic recomposition using canonical panel geometry.

### Cross-page continuity / Reference Assets

Stable references for characters, locations, props, outfits, vehicles, styles, poses and lighting, with explicit inclusion and no silent remote upload.

### Manga direction expansion

Spatial continuity, perspective/lens, depth/occlusion, eye-flow, gutter/transition, spread/page-turn semantics, and deterministic final lettering.
