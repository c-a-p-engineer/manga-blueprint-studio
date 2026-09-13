# Architecture

## Purpose

This document describes the current runtime/state/storage ownership of Manga Blueprint Studio. User-visible behavior belongs in `docs/PRODUCT.md`; serialized field shape belongs in `schema/manga-blueprint.schema.json`; delivery status belongs only in `docs/ROADMAP.md`.

Manga Blueprint Studio is a static GitHub Pages application built with Vite. `web/app.js` delegates to `web/src/main.ts`. TypeScript owns bootstrap, build provenance, typed migration boundaries, and top-level UI composition. Ordered classic scripts under `web/runtime/` remain a compatibility/reference runtime while owners are migrated incrementally.

## Production bootstrap

```text
web/app.js
  -> web/src/main.ts
       -> load build-info.json
       -> web/src/runtime/legacy-api.ts
       -> web/src/legacy-runtime.ts
            -> web/runtime/manifest.json
            -> ordered classic runtime chunks
       -> initialize editor state
       -> install typed UI composition
```

`web/runtime/manifest.json` is the single ordered registry for compatibility-runtime key, semantic chunk ID, browser path, and load order. `scripts/runtime-paths.mjs` derives validator-facing paths from that same registry. Runtime URLs include application version plus deployed commit revision; Vite owns the hashed module entry.

Direct `globalThis` access from new TypeScript code is isolated behind `web/src/runtime/legacy-api.ts`. New typed UI/domain code must not rediscover legacy globals independently.

## TypeScript migration boundary

```text
web/src/
├─ main.ts                    bootstrap only
├─ legacy-runtime.ts          ordered compatibility loader
├─ domain/
│  └─ model.ts                typed view of current schema concepts
├─ runtime/
│  └─ legacy-api.ts           one compatibility bridge to classic globals
└─ ui/
   ├─ dom-helpers.ts
   ├─ page-modes.ts
   ├─ panel-disclosures.ts
   └─ template-workflow.ts
```

`domain/model.ts` improves compile-time readability for migrated code. It does **not** replace the JSON Schema as serialized-data authority and does not introduce a second project model.

The task-first Page/Panel composition is event-driven. The classic render owner emits `manga-blueprint:editor-rendered`; typed UI composition reacts to that explicit lifecycle signal. A page-wide `MutationObserver` must not be used as a self-recomposition loop.

## Compatibility runtime ownership

```text
web/runtime/
├─ manifest.json  canonical load registry
├─ core/          state, commands/history, persistence lifecycle, rendering, I/O/events
├─ authoring/     page/work/container/panel/character authoring
├─ assist/        bounded Smart Manga assistance
├─ identity/      character identity / appearance handoff
├─ story/         story-readable semantics
├─ templates/     Story Template ownership
├─ lettering/     writing direction
├─ ordering/      reading-order synchronization
├─ integration/   explicit cross-feature adapters
├─ handoff/       prompt / manifest / render contracts
└─ ui/            presentation-only compatibility layers
```

### Core owners

`core/foundation.js`
- shared constants and helpers;
- base project factory/normalization;
- camera/pose/template defaults used by later owners.

`core/project-storage.js`
- stable work/page/container identity normalization;
- IndexedDB storage;
- save vs activate boundary;
- per-work active-page metadata;
- full-work identity regeneration/remapping.

`core/editor-state.js`
- active `project` reference;
- selected page/panel/character/balloon IDs;
- selection resolvers such as `currentPage()` and `selectedPanel()`;
- language state;
- domain-level edit operations such as add/split/delete/template apply.

`core/editor-commands.js`
- project snapshots for editor history;
- `mutate()` command boundary;
- Undo / Redo;
- history reset at work/import boundaries.

`core/editor-persistence.js`
- persistence readiness;
- autosave scheduling entry;
- initial active-work loading;
- editor-state initialization.

`core/editor-render.js`
- base SVG/editor rendering;
- base inspector rendering;
- `render()` lifecycle;
- explicit `manga-blueprint:editor-rendered` notification consumed by typed presentation code.

`core/export-input.js` / `core/event-bindings.js`
- base import/export and UI event paths that later semantic owners may extend.

This split is intentionally lexical-compatible with the existing ordered classic runtime. It reduces responsibility concentration without pretending the migration to ES modules is complete.

### Authoring owners

`authoring/page-navigation.js`
- page CRUD/reorder/number/title;
- page selection;
- per-work active-page restoration.

`authoring/work-library-hierarchy.js`
- Work Library create/open/rename/duplicate/delete;
- legacy container compatibility;
- page-to-container assignment;
- non-destructive container deletion;
- explicit work activation.

`authoring/panel-geometry.js`
- optional convex-quadrilateral `Panel.shape` normalization;
- shape presets and corner editing;
- polygon hit/clip/border rendering;
- shape-aware canvas scaling;
- render-brief geometry enrichment.

`authoring/inset-panels.js`
- one-level panel-in-panel relation;
- inset ID-remap/deletion/split safety;
- overlap mask and AI handoff hierarchy.

### Presentation owners

`ui/editor-shell.js` remains the compatibility presentation/navigation owner for the manga-first shell. It reuses canonical page/work operations and never owns a second project-state model. It provides the active work title, breadcrumb, P001 display formatting, page navigation, Work Explorer / 作品エクスプローラー, and Page settings positioning.

`ui/mobile-header.js` owns only narrow-screen header composition.

New task-first UI composition lives under `web/src/ui/`; compatibility UI chunks remain until behavior-equivalent typed owners replace them.

## Serialized project model

Current format is `manga-blueprint/0.2`.

```text
Project
├─ meta
│  ├─ workId / title
│  ├─ pageWidth / pageHeight
│  ├─ readingDirection
│  ├─ defaultWritingMode
│  ├─ optional workBrief / artDirection / template provenance
│  └─ other backward-compatible metadata
├─ containers[]
├─ characterLibrary[]
└─ pages[]
   └─ Page
      ├─ stable id / number / order / title / containerId
      └─ panels[]
         ├─ id / order / rect / optional Panel.shape / optional inset
         ├─ role / actionIntent
         ├─ style / camera / background / effects
         ├─ characters[]
         └─ balloons[]
```

The JSON Schema is authoritative for field-level shape. Rectangle-only projects remain valid. `Panel.shape` may define one convex quadrilateral; its synchronized `rect` remains the compatibility bounding box. Optional inset relation keeps an ordinary child Panel with stable identity rather than creating a separate content model.

## Identity and selection

Stable identity includes `meta.workId`, container/page/panel IDs, placed-character instance IDs, and balloon IDs. Titles, numbers, ordering, and hierarchy references are mutable presentation/organization data.

Editor selection is transient and not serialized as competing project semantics:

```text
project
selectedPageId
selectedPanelId
selectedCharacterId
selectedBalloonId
```

Work/import boundaries reset command history so Undo/Redo cannot cross work identity.

## Persistence and activation

IndexedDB layout:

```text
manga-blueprint-studio
├─ works: workId -> { title, updatedAt, project }
└─ meta
   ├─ activeWorkId
   └─ activePageId:<workId>
```

Critical invariant:

```text
projectStorage.save(project)     // persist contents only
projectStorage.setActive(workId) // explicit activation only
```

A delayed autosave from one work may finish after another work opens, but it cannot reactivate the old work. Historical browser project-autosave localStorage is intentionally not migrated; portable `.manga.json` import is the compatibility path.

## Navigation and ordering

Presentation hierarchy is:

```text
App controls
  -> current work
  -> breadcrumb / P001
  -> page navigation / Work Explorer
  -> manga canvas
  -> Page settings and selected-object inspectors
```

`P001` is derived UI formatting; `pageNumber` remains numeric.

Panel reading direction (`rtl | ltr`) is independent from lettering direction (`vertical-rl | horizontal-tb`). Geometry and reading direction synchronize panel `order`, which is then shared by canvas badges, Story Templates, Panel Peek/List, prompt, manifest, and export.

## Story Template / assistance ownership

Story Template is the one canonical template feature name. Browsing/filtering/preview is non-mutating; explicit apply creates ordinary editable project state. `meta.storyTemplate` is provenance only.

Smart Manga is a separate bounded proposal system and remains non-mutating until explicit apply.

Reusable character identity is project-level; placed figures are panel instances. Stick figures communicate placement/body relation/pose, not finished appearance or clothing.

## AI handoff

Current generation/review is **selected-page scoped**.

- AI generation ZIP: clean PNG + `.manga.json` + prompt + `manga-blueprint-export-manifest/3`;
- Review/archive ZIP: the same state-linked inputs plus annotated PNG;
- clean output excludes authoring labels;
- exact visible text comes only from the `TEXT TO RENDER` allowlist;
- Character Sheet requirements derive from actually used characters;
- authored rectangle/quadrilateral/inset geometry is preserved in the handoff.

`handoff/render-brief.js` owns the current-page semantic render contract. `authoring/panel-geometry.js` and `authoring/inset-panels.js` enrich it with their geometry relations instead of creating competing handoff implementations.

## Public/user documentation

The complete user guide is maintained in `docs/USER-GUIDE.md` and the public `web/guide.html`. The editor Help surface stays concise and links to the full guide.

Current contract owners:
- `docs/PRODUCT.md` — user-visible behavior;
- `schema/manga-blueprint.schema.json` — project schema;
- `docs/PROMPT_HANDOFF.md` — AI package contract;
- `docs/ROADMAP.md` — only delivery/status authority;
- this document — runtime/state/storage boundaries.

## Refactor rules

1. Preserve the explicit runtime manifest order until an owner is deliberately cut over to ES modules.
2. Add no chronology-named patch files; modify or extract a semantic owner.
3. Keep new TypeScript dependencies on classic globals behind `runtime/legacy-api.ts`.
4. Prefer explicit lifecycle/command boundaries over DOM mutation observation or hidden side effects.
5. Keep schema/project semantics independent of presentation reorganization.
6. Characterization/behavior tests must protect public behavior before large owner replacement.
7. Migrate one responsibility at a time; keep a reference/rollback path until equivalence is established.
8. CI and visual interaction are separate evidence. Public layout quality requires deployed-page verification, not static checks alone.

## Verification map

Repository validation covers:
- TypeScript typecheck + Vite production build;
- canonical runtime registration/order;
- editor architecture responsibility boundaries;
- executable command-history behavior;
- project/storage identity contracts;
- multi-page/work hierarchy behavior;
- Story Template/cast/presentation contracts;
- reading/writing direction;
- panel geometry/layout/inset behavior;
- AI generation/render-brief/text-safety contracts;
- documentation/version synchronization.

A future full ES-module/runtime cutover remains a separate refactor requiring semantic-equivalence evidence and rollback planning.
