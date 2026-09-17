# Roadmap

`docs/ROADMAP.md` is the **only current status authority** for delivery phases. Detailed design notes may explain future contracts, but they must not maintain a competing phase-status truth.

## Blueprint Engine preview — active experimental track

A headless AI/human co-authoring path is now implemented alongside the existing Web editor.

Shipped preview slices:

- lightweight Markdown Name DSL;
- deterministic Name → canonical `manga-blueprint/0.2` compilation;
- generated work/page/panel/reusable-character/placement/balloon identity;
- coarse layout hints (`auto`, `vertical`, `grid`, `hero-top`, `hero-bottom`);
- initial camera inference;
- cast slots and stick-figure placement;
- expression, background/time, dialogue, SFX, emphasis and line-effect transfer;
- clean vs annotated SVG blueprint rendering;
- page prompt with explicit `TEXT TO RENDER` allowlist;
- `manga-blueprint-name-package/2` manifest-first package metadata;
- CLI entry and CI regression coverage;
- `.manga.json` remains the shared canonical project state so Web refinement stays available.

The Blueprint Engine is an **experimental authoring track**, not a replacement manifest for the established Web generation package. Its next useful improvements are richer manga-layout grammar, pose/contact semantics, character appearance/reference binding, and stronger package verification.

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

| Phase | Priority | Goal | Status |
|---:|:---:|---|:---:|
| E | S-enabler | Headless Blueprint Engine / AI co-authoring | **Preview implemented; active expansion** |
| 0 | S | Storage / stable identity | **Shipped** |
| 1 | S | Multi-page Core | **Shipped in 0.13.0** |
| 2 | S | Work / Volume / Folder management | **Shipped in 0.14.0** |
| 2.5 | S | Manga-first editor shell / navigation UX | **Shipped** |
| 2.6 | A | Bounded Design Direction handoff | **Shipped** |
| 3 | S | Backup / Restore | Planned |
| 4 | S | Scoped Export | Planned |
| 4.5 | S-enabler | Advanced Panel Geometry | **Quadrilateral foundation shipped** |
| 5 | S | Panel-first / Hybrid generation | Planned |
| 6 | A | Cross-page continuity / Reference Assets | Planned |
| 7 | A/B | Manga direction expansion | Planned |

## Sequencing principle

Blueprint Engine work can proceed independently where it reuses the canonical project model. It must not require completion of the Web roadmap merely to compile and inspect a manga plan.

Shared capabilities should converge on reusable semantics rather than duplicate project models:

```text
AI Name / human Name
      ↓
Blueprint Engine
      ↓
canonical project state
      ├─ Web editor refinement
      └─ headless handoff package
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

1. **Layout grammar reuse** — extract/reuse suitable manga-layout knowledge from the Web template/layout owners instead of growing a second arbitrary layout system.
2. **Pose/contact semantics** — Name DSL fields for pose, gaze, support, contact and interaction; compile them into existing canonical fields.
3. **Character identity input** — appearance descriptions and explicit Character Sheet/reference keys without requiring Web entry.
4. **Irregular/inset intent** — bounded semantic hints that compile into the existing quadrilateral/inset model.
5. **Package verification** — schema validation and filesystem package checks as direct CLI acceptance evidence.
6. **Raster adapter** — optional deterministic clean PNG generation while retaining SVG/project state as inspectable sources.
7. **Agent editing contract** — documented safe edit loop for changing the Name or canonical project and recompiling/reviewing.

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
