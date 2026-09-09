# Prototype 0.13.0 — multi-page core and IndexedDB work persistence

Prototype 0.13.0 introduces the first user-facing multi-page authoring layer on top of the stable work/page identity and IndexedDB storage foundation.

The scope is deliberately limited: users can manage pages inside one work, while volume/folder organization, work-library UI, backup/restore ZIP, scoped multi-page export, and panel-first generation remain later phases.

## Shipped

### Multi-page authoring

A work may contain multiple pages. The Page tab exposes a horizontal page strip plus explicit page operations:

- select page;
- add a new page;
- duplicate the selected page;
- delete the selected page, except the final remaining page;
- move the selected page earlier/later;
- renumber pages sequentially;
- edit visible page number with duplicate-number protection;
- edit optional page title.

All ordinary panel/camera/character/background/text/effect editing continues to operate on `currentPage()`, which resolves from the stable `selectedPageId` rather than assuming `pages[0]`.

Page sequence and visible page number are separate. Add/duplicate allocate a non-conflicting visible number, while duplicate/delete/move preserve existing visible page numbers. Only the explicit **Renumber** action rewrites the full visible sequence to `1..N`.

### Stable identity on duplication

Duplicating a page preserves semantic content but creates fresh identity for mutable instances:

- new page ID;
- new panel IDs;
- new placed-character instance IDs;
- new balloon IDs.

Visible page number/title are presentation/project state and remain independent from stable identity.

### Work-wide canvas size

`meta.pageWidth` / `meta.pageHeight` remain work-level state in Prototype 0.13.0 rather than per-page fields.

Changing manuscript/canvas size therefore scales panel geometry, placed-character coordinates/scale, and balloon coordinates/size across **all pages** in the work. When more than one page exists, the direct canvas-size action confirms the work-wide resize before mutation.

This avoids a broken state where the project declares one global canvas size but only the selected page has been rescaled.

### Active-page restore

IndexedDB metadata stores the last selected page separately for each work.

Startup restores the persisted project first, then reads the remembered page ID before page-selection persistence is re-enabled. This ordering prevents the initial render from overwriting the remembered selection with page 1.

Deleting a work also deletes its active-page metadata.

### Browser persistence boundary

Project autosave uses IndexedDB. Historical project `localStorage` autosave keys are intentionally not migrated or reused.

Portable `.manga.json` import remains the compatibility path for old browser state. Custom Scene Template storage remains a separate browser-local `localStorage` concern.

### Schema additions

The project format remains `manga-blueprint/0.2`. Page metadata is additive:

```text
Page
├─ id            stable identity
├─ pageNumber    visible page number
├─ order         work ordering
├─ containerId   reserved for later volume/chapter/folder management
├─ title         optional user-facing title
└─ panels
```

No project-format bump is required because these fields are optional/additive and old JSON normalizes safely.

## Current export boundary

Prototype 0.13.0 does **not** make the existing generation package work-wide.

Generation prompt, clean/review render, manifest semantic indexes, and ZIP generation remain scoped to the currently selected page through the existing `currentPage()` contract.

Range/work/volume export is a later explicit phase so package semantics do not become ambiguous accidentally.

## Validation

`scripts/validate-multi-page-core.mjs` checks the deterministic contracts for:

- runtime owner registration and load order;
- page schema metadata;
- active-page IndexedDB APIs and cleanup;
- selected-page editor routing;
- page add/duplicate/delete/reorder/renumber/title operations;
- page-order / visible-page-number independence;
- duplicate identity regeneration;
- final-page delete guard;
- duplicate visible-page-number protection;
- active-page restoration before persistence enable;
- work-wide canvas resize semantics;
- narrow-screen page-manager layout.

The validator runs in the normal `Validate prototype` workflow alongside all previous repository, handoff, template, ordering, lettering, render, and provenance checks.

## Compatibility

- project format remains `manga-blueprint/0.2`;
- manifest remains `manga-blueprint-export-manifest/3`;
- render brief remains `manga-blueprint-render-brief/1`;
- producer provenance remains `manga-blueprint-producer/1`;
- old `.manga.json` files without page metadata normalize with generated stable identity/default ordering;
- legacy browser project autosave keys are not migrated;
- existing single-page projects continue to behave as one-page works.

## Deferred from this phase

- work-library UI and multiple named works in the editor shell;
- volume/chapter/folder hierarchy UI;
- moving pages between containers;
- backup/restore ZIP;
- range / selected-pages / volume / whole-work export;
- per-page canvas-size overrides;
- two-page spread semantics;
- cross-page continuity libraries;
- panel-first/hybrid generation packages.
