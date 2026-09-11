# Runtime chunks

Manga Blueprint Studio is a zero-build GitHub Pages application. `web/app.js` loads named classic-script chunks in an explicit order so the existing global-state extension model remains deterministic without a bundler.

## Ownership

Runtime files are named by responsibility, not prototype chronology.

- `core/` — foundational project state, IndexedDB persistence, rendering, import/export input, and base event bindings.
- `authoring/` — page/work/container authoring, page/layout/camera, panel geometry/editing assistance, reusable characters, and localization/export hardening.
- `assist/` — bounded Smart Manga assistance.
- `identity/` — character identity and appearance handoff.
- `story/` — story-readable panel semantics and Smart Manga intent.
- `templates/` — Story Template Studio, quality, scene/cast semantics, and panel-cast flow.
- `lettering/` — text writing direction.
- `ordering/` — geometry + reading-order synchronization.
- `integration/` — cross-feature integration with intentional load dependencies.
- `handoff/` — prompt/manifest/render contracts and producer provenance for downstream image-generation assistants.
- `ui/` — presentation-only responsive layout, authoring clarity, mobile app header, and the manga-first editor shell.

## Important current owners

### `core/project-storage.js`

Owns stable work/page/container identity normalization plus IndexedDB work persistence. Saving work contents and activating a work are deliberately separate operations.

### `authoring/page-navigation.js`

Owns page CRUD/reorder/number/title/selection and per-work active-page restoration.

### `authoring/work-library-hierarchy.js`

Owns Work Library behavior, container CRUD/hierarchy, page assignment, non-destructive container deletion, and explicit work activation paths.

### `authoring/panel-geometry.js`

Owns the canonical optional convex-quadrilateral panel shape, shape presets, direct four-corner editing, polygon hit/clip rendering, irregular layout presets, page-resize scaling, and render-brief geometry enrichment.

### `authoring/panel-editing-assist.js`

Loads immediately after `panel-geometry.js` and owns non-canonical editing assistance around that same shape model:

- optional corner snapping to nearby page/other-panel/self alignment coordinates;
- editor-only alignment guide lines;
- near-horizontal/vertical edge correction;
- plain-language frame-style explanations for normal/borderless/inset/impact, bleed, and breakout.

It must not persist a second geometry model. Final authored `Panel.shape.points` remain the source of truth, and authoring guide lines must never enter clean AI output.

### `ordering/reading-order.js`

Owns geometry + RTL/LTR panel sequence synchronization. Rectangle panels use visual centers; shaped panels derive a polygon centroid and adaptive row grouping so a single protruding diagonal corner does not unexpectedly determine panel order.

### `ui/mobile-header.js`

Owns narrow-screen app-header presentation only: branding/tagline on the first row and Help / Undo / Redo / language on the second row. Work identity is not an app-header action.

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
8. Authoring overlays such as snapping guides are presentation aids only; they must not leak into clean AI generation assets.
9. CI evidence and visual/interaction evidence are separate; static validation cannot by itself prove a public layout is visually correct.

## Runtime migration boundary

This structure is a compatibility design, not an ES-module conversion.

A future module/bundler/runtime migration must be handled as a separate refactor with characterization tests, semantic-equivalence checks, deployment impact analysis, and rollback/reference evidence.