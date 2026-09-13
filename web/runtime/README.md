# Runtime chunks

Manga Blueprint Studio is a Vite-built static GitHub Pages application. `web/app.js` delegates to `web/src/main.ts`; `web/src/legacy-runtime.ts` loads the remaining compatibility runtime in the exact order declared by `web/runtime/manifest.json`.

`manifest.json` is the **single canonical registry and load-order source**. Node validators derive their views through `scripts/runtime-paths.mjs`; do not maintain a second inline runtime list.

## Ownership

Runtime files are named by responsibility, not release chronology.

- `core/` — base project semantics, storage, active editor state, command history, persistence lifecycle, rendering, import/export input, and base events.
- `authoring/` — page/work/container, layout/camera, panel geometry/insets, reusable characters, localization/export hardening.
- `assist/` — bounded Smart Manga assistance.
- `identity/` — character identity and appearance handoff.
- `story/` — story-readable panel semantics.
- `templates/` — Story Template Studio and template/cast/layout contracts.
- `lettering/` — text writing direction.
- `ordering/` — geometry + reading-order synchronization.
- `integration/` — explicit cross-feature adapters.
- `handoff/` — prompt/manifest/render contracts and producer provenance.
- `ui/` — presentation-only compatibility layers such as `ui/editor-shell.js`.

## Core editor owners

The editor core is intentionally split so one file no longer owns state, history, persistence, and rendering together.

```text
core/editor-state.js
  active project + selection + domain edit operations
        ↓
core/editor-commands.js
  mutate / Undo / Redo / command history
        ↓
core/editor-persistence.js
  startup load / autosave readiness
        ↓
core/editor-render.js
  base SVG + inspector render lifecycle
        ↓
core/export-input.js
core/event-bindings.js
```

This is still one ordered classic-script compatibility runtime. The split improves ownership without claiming an ES-module cutover.

`core/editor-render.js` emits `manga-blueprint:editor-rendered` after a completed render. Typed UI code uses that explicit lifecycle event instead of observing broad DOM mutations.

## TypeScript bridge

New typed migration code lives under `web/src/`:

- `domain/model.ts` — compile-time representation of current Project/Page/Panel/Character/Balloon concepts; JSON Schema remains serialized-data authority.
- `runtime/legacy-api.ts` — the single TypeScript compatibility bridge to legacy globals.
- `ui/` — task-first Page/Panel/template presentation owners.
- `phase-one-ui.ts` — small composition/bootstrap adapter.

Do not spread `globalThis` access through new TypeScript modules. Keep it behind `runtime/legacy-api.ts` until each classic owner is replaced deliberately.

## Canonical runtime manifest

Each entry has:

```json
{ "key": "panelGeometry", "id": "authoring/panel-geometry", "path": "runtime/authoring/panel-geometry.js" }
```

- `key` — stable validator/read-helper key;
- `id` — browser chunk identity (`data-runtime-chunk`);
- `path` — production-relative path; it determines `id` as `runtime/<id>.js`.

The array order is execution order. Keys, IDs, and paths are unique. Every `web/runtime/**/*.js` file must be registered exactly once.

## Important feature owners

### `core/project-storage.js`
Owns stable identity normalization and IndexedDB persistence. Saving contents and activating a work remain separate operations.

### `authoring/page-navigation.js`
Owns page CRUD/reorder/number/title/selection and per-work active-page restoration.

### `authoring/work-library-hierarchy.js`
Owns Work Library behavior, legacy container compatibility, page assignment, non-destructive container deletion, and explicit work activation.

### `authoring/panel-geometry.js`
Owns convex-quadrilateral `Panel.shape` semantics and editing.

### `authoring/inset-panels.js`
Owns one-level panel-in-panel relation while reusing the ordinary Panel model.

### `integration/template-character-cast.js`
Owns explicit reusable-character choice before Story Template apply and the starter-character integration.

### `templates/panel-layout-grammar.js`
Owns shared-seam diagonal/asymmetric/buildup panel-layout families and their Story Template mapping.

### `ui/editor-shell.js`
Compatibility presentation/navigation owner for current work, breadcrumb, `P001`, page navigation, Work Explorer, and Page settings positioning. It must reuse existing project operations instead of creating a second state model.

## Public guide

The complete user guide is:

```text
web/guide.html
docs/USER-GUIDE.md
```

The in-editor Help surface stays concise and links to `./guide.html`.

## Rules

1. Preserve the explicit order in `web/runtime/manifest.json` until a deliberate owner cutover.
2. Modify/extract semantic owners instead of adding chronology-named patches.
3. UI organization must reuse project state rather than create another domain model.
4. New TypeScript code reaches classic globals only through `web/src/runtime/legacy-api.ts`.
5. Prefer explicit command/lifecycle events over DOM-observer coupling.
6. Project JSON, AI handoff, RTL/LTR, lettering, stable identity, and import compatibility remain external contracts during refactors.
7. Runtime ownership changes must update `docs/ARCHITECTURE.md` and this file.
8. CI evidence and visual/interaction evidence are separate.

## Migration boundary

This directory remains a compatibility/reference runtime. A full module/runtime replacement requires characterization tests, semantic-equivalence checks, production-shaped verification, and rollback/reference evidence. The current refactor deliberately keeps classic runtime behavior while reducing responsibility concentration and making later TypeScript migration easier to review.
