# AGENTS.md — Manga Blueprint Studio

## Mission

Manga Blueprint Studio is a human-directed manga planning tool. It lets the user organize a work into optional volumes/chapters/folders and pages, design each manga page, describe what happens in each panel, and hand a visual + semantic blueprint to downstream image-generation assistants.

The human is the director. Story Templates, Smart Manga, diagnostics, and downstream image models are assistance/rendering tools; they do not silently replace authored intent.

## Source of truth

Use these authorities in order for their respective concerns:

1. `AGENTS.md` — repository rules and cross-cutting invariants.
2. `docs/PRODUCT.md` — current user-visible behavior and product contract.
3. `schema/manga-blueprint.schema.json` — serialized project data contract.
4. `docs/ARCHITECTURE.md` — runtime ownership, state, persistence, and implementation boundaries.
5. implementation under `web/` — shipped behavior when a document is stale.
6. `docs/PROMPT_HANDOFF.md` — AI generation/review package and prompt contract.
7. `docs/ROADMAP.md` — current delivery status and future phases.
8. `docs/USER-GUIDE.md` and `web/guide.html` — derived user guidance; they must match the product contract but are not higher authority than it.

`docs/README.md` is the documentation map. Dated research notes, baseline notes, and old `PROTOTYPE-*` files are historical evidence, not current runtime authority.

When implementation, schema, and documentation disagree, do not pick one by habit. Determine which source is stale, update it intentionally, and keep the current release internally consistent.

## Current product model

The primary user model is:

```text
Work / 作品
  → optional Volume / Chapter / Folder
    → Page (P001, P002, ...)
      → page settings / panel layout
        → panel direction / character / background / text / effects
          → selected-page AI handoff
```

The optional hierarchy is organizational. Pages remain stable entities and may live directly under the work.

### Manga-first editor shell

Navigation and editing responsibilities must remain distinct.

- the application header owns app-level actions such as Help, Undo/Redo, and language;
- the active work title is shown separately from app-level actions;
- the breadcrumb shows the active container path plus the current page;
- visible page labels use minimum three-digit codes such as `P001`; canonical `pageNumber` remains numeric;
- previous/next/add/direct-page navigation lives above the manga canvas;
- **Work Explorer / 作品エクスプローラー** opens from the active work title and is the primary file-explorer-style navigation for `work → page`; legacy/imported containers may still render as nested folders;
- dedicated volume/chapter/folder editing is not a primary UI surface; compatibility data remains supported without forcing that hierarchy into ordinary authoring;
- **Page settings / ページ設定** owns manuscript size, reading direction, page-wide style/layout and related current-page configuration; it is not the primary work/page navigator.

Do not move work identity, hierarchy navigation, or page selection back into one oversized header button or database-like form as the main path.

## Core invariants

### Stable identity and local persistence

- `meta.workId`, `Container.id`, `Page.id`, panel IDs, placed-character instance IDs, and balloon IDs are identity, not display labels.
- page numbers/titles, work/container titles, ordering, and parent/container references are mutable presentation/organization metadata.
- moving a page between containers must not change page identity.
- duplicating a page or work regenerates the mutable instance IDs required to keep the copy independent.
- project persistence uses IndexedDB.
- saving work contents must not silently change `activeWorkId`; activation is explicit.
- the last active page is remembered per work.
- historical browser project-autosave `localStorage` is intentionally not migrated. Portable `.manga.json` import remains the compatibility path.
- browser-local custom Story Templates may continue to use their separate local storage until backup/restore explicitly includes them.

### Destructive actions

- deleting the final remaining page is rejected;
- deleting a non-empty container must not silently delete its pages;
- container deletion re-homes directly assigned pages and direct child containers to the deleted container's parent before removing the container;
- same-`workId` import/restore must never silently overwrite an existing work;
- import-as-new receives fresh work/container/page/panel/placed-instance identity with references remapped;
- destructive overwrite requires explicit confirmation.

### Human direction first

Assistance must not silently replace recorded panel layout, action intent, pose, character assignment, appearance policy, camera intent, background intent, dialogue/SFX, lettering direction, or manga effects.

- Story Template browsing/filtering/preview is non-mutating;
- Smart Manga candidates are non-mutating until explicit apply;
- applied assistance becomes ordinary editable project state;
- diagnostics are advisory and do not block export or auto-fix content merely because a warning exists.

### Story Template terminology

**Story Template / ストーリーテンプレート is the single canonical template feature name.** “Scene Template” is not a second product feature or alias. The ordinary word “scene” remains valid for scene continuity and story content.

`meta.storyTemplate` is provenance only after apply, not continuing authority.

### Reading order and writing direction

Panel reading direction and lettering direction are separate.

- `meta.readingDirection`: `rtl | ltr`; Japanese RTL is default.
- `meta.defaultWritingMode`: `vertical-rl | horizontal-tb`; vertical Japanese is default.
- balloon/SFX writing mode may override or inherit the project default.
- changing writing direction must not change panel reading order.
- committed render paths keep panel `order` synchronized with geometry + reading direction so canvas, Story Template beat order, Panel Peek/List, prompt, manifest, and exports agree.

### Story action intent

`Panel.actionIntent` describes what happens in a panel when pose alone is insufficient.

- it is semantic source data;
- it may appear in authoring views, prompt, and manifest indexes;
- it is never visible manga text and never belongs in `TEXT TO RENDER`.

### Character identity boundary

Reusable base-character identity and placed pose instances are separate.

- `sheet`: separately attached Character Sheet required;
- `description`: no sheet required; appearance guidance is the identity contract;
- `free`: no sheet required; downstream model may choose a simple consistent appearance.

Stick figures communicate body relationship, pose, placement, approximate scale, and direction. They do not define character appearance.

### AI-safe visual/text boundary

Clean AI PNG communicates spatial composition. `.manga.json` + prompt communicate meaning. Character guidance/required external Character Sheets communicate identity. Art direction controls rendering language. Exact visible text comes only from the explicit renderable-text allowlist.

Clean AI output must not expose authoring labels such as character names, Character IDs, panel numbers, camera labels, action notes, Panel Chips, Crop Guide labels, or editor UI text.

### Manifest-first handoff

`manga-blueprint-export-manifest/3` is the read-first authority for the current export package.

Current generation/review export is **selected-page scoped** until the scoped-export phase intentionally introduces selected pages/ranges/containers/work-wide packages.

- AI generation ZIP: clean PNG + `.manga.json` + prompt + manifest; no annotated PNG.
- Review/archive ZIP: same state-linked materials plus annotated PNG.
- annotated review is not the default generation input.

Provider-specific behavior belongs at the export/adapter boundary; core project state remains provider-independent and local-first.

## Documentation synchronization contract

Documentation is part of the shipped product contract. A user-visible or contract-visible change is not complete if the relevant current documentation remains stale.

### Canonical ownership

- `README.md`: concise current baseline, quick start, public URLs.
- `docs/README.md`: documentation map and maintenance rules.
- `docs/USER-GUIDE.md`: current user workflow and UI terminology.
- `docs/PRODUCT.md`: user-visible behavior and acceptance criteria.
- `schema/manga-blueprint.schema.json`: serialized project schema.
- `docs/ARCHITECTURE.md`: runtime/state/storage/ownership.
- `docs/PROMPT_HANDOFF.md`: generation/review handoff contract.
- `docs/ROADMAP.md`: status and future work; this is the only roadmap status authority.
- `docs/PROJECT-MULTI-PAGE-ROADMAP.md`: supplemental design decisions for multi-page/portability; do not let it become a competing status tracker.
- `docs/PROTOTYPE-*.md`: immutable-style historical release notes except corrections that clearly preserve historical meaning.
- dated research/baseline files: historical input, not current behavior authority.

### Required update mapping

When a change affects:

- user-visible workflow/UI → update `docs/PRODUCT.md`, `docs/USER-GUIDE.md`, public `web/guide.html`, `README.md` when headline behavior changes, and the release note;
- project data → update schema + Product + Architecture, and migration/compatibility notes;
- runtime ownership/state/persistence → update Architecture + runtime README;
- AI export/prompt/manifest → update Prompt Handoff + Product/Architecture as needed;
- delivery status/priorities → update `docs/ROADMAP.md`; do not duplicate changing status elsewhere;
- public guide wording → keep Markdown user guide and `web/guide.html` semantically aligned.

Historical release documents should not be rewritten to pretend old releases had current behavior. Instead, keep them clearly historical and point readers to current docs through `docs/README.md`.

## Runtime and implementation rules

The app is a zero-build static GitHub Pages application. `web/app.js` loads ordered classic-script chunks from `web/runtime/`.

- preserve explicit load order unless deliberately refactoring the runtime;
- modify the existing semantic owner when possible instead of adding chronology-named patch files;
- a new runtime chunk needs a distinct responsibility;
- UI-only organization belongs under `runtime/ui/` and must not create a second project-state model;
- `ui/editor-shell.js` is the final presentation/navigation layer for the manga-first shell and should reuse existing page/work/container operations.

A future ES-module/bundler migration is a separate refactor requiring behavior-equivalence evidence and rollback planning.

## Compatibility

Current serialized project format remains `manga-blueprint/0.2`. Current export manifest remains `manga-blueprint-export-manifest/3`.

Compatible optional additions may normalize into old files without a format bump when semantics remain backward-compatible. Do not use a version bump merely to record UI presentation changes.

## Verification and definition of done

Relevant changes must preserve or intentionally update:

- JavaScript syntax and semantic runtime registration;
- project schema validation and legacy portable-project normalization;
- stable work/page/container identity behavior;
- explicit work activation and page selection;
- manga-first shell and `P001` display formatting;
- explorer-style work structure and non-destructive container deletion;
- dynamic canvas size and RTL/LTR panel order;
- vertical/horizontal lettering separation;
- Story Template and Smart Manga non-mutating preview contracts;
- character identity modes and Character Sheet diagnostics;
- clean AI vs review export separation;
- strict visible-text allowlist and manifest-first handoff;
- mobile usability;
- documentation synchronization for affected surfaces;
- GitHub Pages deployment when public runtime/docs are changed.

CI success and visual/interaction verification are different evidence. Do not claim visual usability from static validation alone. For public UI changes, verify the deployed artifact/page when available.
