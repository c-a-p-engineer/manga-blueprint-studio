# Runtime chunks

Manga Blueprint Studio is a zero-build GitHub Pages application. `web/app.js` loads named classic-script chunks in an explicit order so the existing global-state extension model remains deterministic without a bundler.

## Ownership

Runtime files are named by responsibility, not prototype chronology.

- `core/` — foundational project state, IndexedDB persistence, rendering, import/export input, and base event bindings.
- `authoring/` — page/work/container authoring, page/layout/camera, reusable characters, and localization/export hardening.
- `assist/` — bounded Smart Manga assistance.
- `identity/` — character identity and appearance handoff.
- `story/` — story-readable panel semantics and Smart Manga intent.
- `templates/` — Story Template Studio, quality, scene/cast semantics, and panel-cast flow.
- `lettering/` — text writing direction.
- `ordering/` — geometry + reading-order synchronization.
- `integration/` — cross-feature integration with intentional load dependencies.
- `handoff/` — prompt/manifest/render contracts and producer provenance for downstream image-generation assistants.
- `ui/` — presentation-only responsive layout, authoring clarity, and the manga-first editor shell.

## Important current owners

### `core/project-storage.js`

Owns stable work/page/container identity normalization plus IndexedDB work persistence. Saving work contents and activating a work are deliberately separate operations.

### `authoring/page-navigation.js`

Owns page CRUD/reorder/number/title/selection and per-work active-page restoration.

### `authoring/work-library-hierarchy.js`

Owns Work Library behavior, container CRUD/hierarchy, page assignment, non-destructive container deletion, and explicit work activation paths.

### `ui/editor-shell.js`

Loads last as the current presentation/navigation layer. It reorganizes existing authoring behavior into the manga-first shell without introducing another project-state model.

It owns UI presentation such as:

- work title on its own line;
- breadcrumb;
- `P001` display formatting;
- page navigation above the canvas;
- explorer-style Work Structure;
- relocation of detailed page/container controls into advanced sections;
- Page settings naming/role clarification;
- Japanese-first primary authoring wording cleanup.

`P001` is derived UI formatting; canonical `pageNumber` remains numeric.

### `integration/template-character-cast.js`

Owns the cross-feature boundary between Story Template selection and reusable-character identity:

- explicit primary/second-character choice before template apply;
- exact selected-cast routing into the canonical template application pipeline;
- the task-first apply card that replaces the redundant middle preview;
- six generic editable starter character definitions for new works and explicit quick-add for existing works.

Template browsing remains non-mutating; character-library mutation happens only during new-work creation or explicit starter-add actions.

## Public guide

The full user guide is a static public page:

```text
web/guide.html
web/guide.css
```

The in-editor Help modal is a quick reference and links to `./guide.html`. It should not grow into a duplicate full manual.

Markdown source/maintenance guidance lives in:

```text
docs/USER-GUIDE.md
docs/README.md
```

## Rules

1. Preserve the explicit load order in `web/app.js`; later chunks intentionally extend globals from earlier owners.
2. Modify an existing semantic owner when one already owns the behavior instead of creating `app-N.js` or another chronology-named patch file.
3. Add a new named runtime chunk only when it has a distinct responsibility that does not fit an existing owner.
4. UI-only organization must reuse existing domain/project state rather than introduce a second work/page/hierarchy model.
5. Browser-visible behavior, project JSON, prompt, manifest, export package boundaries, RTL/LTR, writing direction, and legacy portable-file normalization are external contracts during refactors.
6. `scripts/runtime-paths.mjs` and `scripts/validate-runtime-layout.mjs` keep semantic runtime registration/load order explicit.
7. User-visible/runtime contract changes must also update the documentation owners defined in `docs/README.md` and `AGENTS.md`.
8. CI evidence and visual/interaction evidence are separate; static validation cannot by itself prove a public layout is visually correct.

## Runtime migration boundary

This structure is a compatibility design, not an ES-module conversion.

A future module/bundler/runtime migration must be handled as a separate refactor with characterization tests, semantic-equivalence checks, deployment impact analysis, and rollback/reference evidence.

## Phase 1 TypeScript/Vite bridge

Prototype 0.17.0 keeps this directory as the compatibility/reference runtime while the production entry moves to Vite + TypeScript. `web/src/legacy-runtime.ts` owns ordered loading and commit-aware cache busting. New top-level UI composition belongs in typed source under `web/src/`; do not add another chronology-named runtime patch file for Phase 1 presentation fixes.


### `templates/panel-layout-grammar.js`

Owns the Prototype 0.18.0 page-layout grammar layered on top of quadrilateral panel geometry: shared diagonal seams with compact gutters, asymmetric visual-weight families, Story Template layout-family assignment, compatibility handling for `diagonal3` / `diagonal4`, and diagonal discovery integration. Base polygon validation/editing remains in `authoring/panel-geometry.js`; apply-time shape transfer remains in `templates/presentation-contract.js`.

### `authoring/inset-panels.js`

Owns Prototype 0.19.0 one-level panel-in-panel compatibility behavior: optional parent relation normalization, ID-remap on duplication, semantic order insertion, white overlap mask, deletion/split safety, editor control injection, and Render Brief / manifest hierarchy. It deliberately reuses the ordinary Panel model and existing inspectors instead of creating a second inset-only content model.
