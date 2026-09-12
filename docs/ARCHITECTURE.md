# Architecture

## Runtime shape

Manga Blueprint Studio is a static GitHub Pages application built with Vite.

`web/app.js` is a thin module entry that delegates to `web/src/main.ts`. TypeScript owns build provenance, runtime startup, and the first task-first UI composition layer. The existing classic-script chunks under `web/runtime/` remain a compatibility/reference runtime during Phase 1 rather than being falsely treated as already migrated ES modules.

The explicit legacy script order remains a compatibility contract because later chunks intentionally extend globals established by earlier chunks. Production chunk URLs now include both the application version and deployed commit revision, while the Vite entry itself receives a hashed asset URL. This closes the same-version stale-cache gap observed on GitHub Pages.

## Runtime ownership

```text
web/runtime/
├─ core/         project state, persistence, rendering, export/input, base events
├─ authoring/    page/work/container, panel geometry, and reusable-character authoring
├─ assist/       bounded Smart Manga assistance
├─ identity/     character identity and appearance handoff
├─ story/        story-readable panel semantics
├─ templates/    Story Template Studio and template/cast contracts
├─ lettering/    balloon/SFX writing direction
├─ ordering/     geometry + reading-order synchronization
├─ integration/  cross-feature integration with intentional load dependencies
├─ handoff/      prompt/manifest/render contracts and producer provenance
└─ ui/           presentation-only layout, clarity, editor shell, and mobile header
```

`web/src/legacy-runtime.ts` is the production compatibility loader, while `scripts/runtime-paths.mjs` mirrors semantic owners for validators. `scripts/validate-runtime-layout.mjs` rejects chronology-named `web/app-N.js` files, duplicate/missing registrations, and unregistered runtime JavaScript.

### Core owners

`core/foundation.js`

- shared constants/helpers;
- project normalization base;
- core render helpers and base semantic state.

`core/project-storage.js`

- stable work/page/container identity normalization;
- IndexedDB storage;
- explicit save vs activate boundary;
- per-work active-page metadata;
- full-work identity regeneration helper.

`core/editor-state.js`

- active project and editor selections;
- Undo/Redo history;
- `currentPage()` / selected panel/character/balloon resolution;
- persistence initialization and autosave scheduling.

`core/export-input.js` / `core/event-bindings.js`

- base import/export/UI event paths consumed/extended by later owners.

### Authoring owners

`authoring/page-navigation.js`

- page CRUD/reorder/number/title;
- page selection;
- per-work selected-page restoration;
- detailed page-management controls.

`authoring/work-library-hierarchy.js`

- Work Library create/open/rename/duplicate/delete;
- container create/rename/reorder/reparent/delete;
- page-to-container assignment;
- non-destructive container deletion;
- explicit work activation behavior.

`authoring/panel-geometry.js`

- optional convex-quadrilateral `Panel.shape` normalization;
- shape preset application;
- direct four-corner editing and validation;
- polygon border/hit/clip rendering;
- irregular page-layout presets;
- shape-aware page-size scaling;
- render-brief geometry enrichment.

It intentionally loads after `handoff/render-brief.js` so it can extend the current render-brief object without creating a second AI-handoff implementation. It loads before producer provenance so exported producer metadata remains the final manifest wrapper.

Other `authoring/` chunks own page/layout/camera, character library/export surfaces, and localization/export hardening.

### UI owners

`ui/editor-shell.js` is the presentation/navigation layer for the manga-first shell. It deliberately **reuses existing page/work/container functions** instead of creating a second project-state model.

It owns presentation such as:

- current work title on its own line;
- breadcrumb from container ancestry to current page;
- minimum three-digit page code formatting (`P001`);
- previous/next/add/direct page navigation above the canvas;
- explorer-style Work Structure dialog;
- relocation of detailed page/container CRUD into advanced sections;
- Page → Page settings naming/role clarification;
- Japanese-first cleanup of primary authoring labels.

Because this chunk is presentation-only, `P001` is never serialized as a string replacement for numeric `pageNumber`.

`ui/mobile-header.js` loads after `ui/editor-shell.js` and owns only narrow-screen app-header composition. At `<=760px`, it explicitly uses a branding/tagline row followed by a four-column Help / Undo / Redo / language action row. It does not own work/page state.

## Serialized project state

Project state normalizes to `manga-blueprint/0.2`.

```text
Project
├─ format = manga-blueprint/0.2
├─ meta
│  ├─ workId
│  ├─ title
│  ├─ pageWidth / pageHeight
│  ├─ readingDirection (rtl | ltr)
│  ├─ defaultWritingMode (vertical-rl | horizontal-tb)
│  ├─ canvasPreset / layoutPreset
│  ├─ storyTemplate
│  ├─ randomPurpose / randomSeed / randomVariant / randomIntensity
│  └─ artDirection
├─ containers[]
│  └─ { id, kind: volume|chapter|folder, title, order, parentId }
├─ characterLibrary[]
│  └─ reusable base identity / appearance guidance
└─ pages[]
   └─ Page
      ├─ id
      ├─ pageNumber / order / title
      ├─ containerId
      └─ panels[]
         ├─ id / order / rect / optional shape / role / actionIntent
         ├─ style
         ├─ camera
         ├─ background
         ├─ effects
         ├─ characters[]
         ├─ balloons[]
         └─ assist provenance where present
```

The JSON Schema is canonical for machine-readable field shape: `schema/manga-blueprint.schema.json`.

### Panel geometry representation

`Panel.rect` remains required for compatibility. Prototype 0.16.0 adds optional:

```text
Panel.shape
├─ kind = quad
├─ preset = rectangle | diagonal-left | diagonal-right | trapezoid-left | trapezoid-right | custom
└─ points[4] = {x,y}
```

When `shape.kind = quad` exists:

- `shape.points` is authoritative for the visible border, SVG hit target, and clip path;
- `rect` is synchronized to the shape's bounding box;
- reading-order logic may continue to use the synchronized bounding box + explicit `order` while the shape model is limited to non-overlapping convex quadrilaterals;
- old rectangle-only projects require no migration;
- invalid/non-convex shape input normalizes back to rectangle compatibility rather than entering an unusable geometry state;
- irregular shapes currently force `style.bleed = none` because legacy bleed semantics are rectangular;
- splitting an irregular panel currently consumes its bounding box and produces rectangular children.

This is one shape system, not a decorative overlay. Editor rendering, clean/review export, hit testing, and AI handoff all consume the same boundary.

## Identity model

Stable identity and display metadata are intentionally separate.

### Stable identities

- `meta.workId`
- `Container.id`
- `Page.id`
- panel IDs
- placed-character instance IDs
- balloon IDs

### Mutable display / organization

- work/container/page titles
- page number
- page/container ordering
- `Page.containerId`
- `Container.parentId`

Moving a page between containers changes its organizational reference, not its identity.

### Duplicate semantics

Page duplication regenerates:

- page ID;
- every duplicated panel ID;
- every duplicated placed-character instance ID;
- every duplicated balloon ID.

Full-work duplication/import-as-new additionally regenerates work/container IDs and remaps `parentId` / `containerId` references.

Reusable semantic character IDs may remain unchanged because they identify the same fictional character inside the copied work rather than a placement instance. Optional `Panel.shape` is ordinary project state and is cloned together with the authored panel.

## Editor selection state

Editor selection is not serialized as competing project semantics.

```text
project
selectedPageId
selectedPanelId
selectedCharacterId
selectedBalloonId
selectedContainerId16   // hierarchy inspector selection
```

`currentPage()` resolves `selectedPageId`, with defensive fallback only for stale selection.

Page selection is editor state. Structural page edits are project mutations and participate in Undo/Redo snapshots. A completed corner-handle drag is committed as one Undo/Redo edit rather than one history entry per pointer move.

Work switches/import boundaries reset editor history so Undo/Redo does not cross independent work identity.

## Persistence and activation

IndexedDB database:

```text
manga-blueprint-studio
├─ works
│  └─ workId -> { title, updatedAt, project }
└─ meta
   ├─ activeWorkId
   └─ activePageId:<workId>
```

The critical boundary is:

```text
projectStorage.save(project)     // persist contents only
projectStorage.setActive(workId) // explicit activation only
```

A delayed autosave from Work A is allowed to finish after the user opens Work B, but that save cannot reactivate A.

Work Library listing calls storage listing only; browsing is not activation.

On startup, the runtime restores the saved active work and then its remembered page before normal persistence resumes.

There is intentionally no migration from historical browser project-autosave `localStorage` keys. Portable `.manga.json` import is the compatibility path.

`localStorage` remains valid for unrelated small local concerns such as UI language and browser-local custom Story Templates.

## Manga-first navigation architecture

The presentation hierarchy mirrors the domain hierarchy:

```text
App controls
  ↓
Current work title
  ↓
Breadcrumb / P001 current-page context
  ↓
Page strip + Work Structure explorer
  ↓
Manga canvas
  ↓
Page settings / selected-panel editing tabs
```

This avoids mixing navigation with content editing.

### Work Structure tree

The explorer renders root pages and recursive containers from existing project data.

- container children derive from `parentId`;
- page placement derives from `containerId`;
- page ordering derives from page `order`;
- container sibling ordering derives from container `order`;
- selecting a page calls the canonical page-selection path;
- advanced forms reuse existing page/container CRUD implementations.

No second hierarchy data model is introduced for the tree.

### Page display code

User-visible page code is derived:

```text
P + max(3-digit zero padding, full numeric pageNumber)
```

Examples: `P001`, `P008`, `P042`, `P123`, `P1000`.

The project stores only numeric `pageNumber`; formatting belongs to UI/export naming layers where needed.

## Container hierarchy behavior

Container model:

```text
Container
├─ id        stable identity
├─ kind      volume | chapter | folder
├─ title     mutable label
├─ order     sibling order
└─ parentId  nullable parent reference

Page.containerId -> nullable Container.id
```

Normalization repairs unsupported/dangling/self/cyclic references conservatively.

Reparenting rejects the selected container itself and descendants to prevent cycles.

Deleting a container is non-destructive to page content:

1. directly assigned pages move to its parent (or root);
2. direct child containers move to the same parent;
3. sibling ordering is normalized;
4. the container record is removed.

## Reading order

`meta.readingDirection` is explicit:

- `rtl` Japanese default;
- `ltr` supported.

Committed render paths synchronize panel `order` from current geometry + reading direction. Quadrilateral panels keep `rect` synchronized to their bounding box, so the same deterministic ordering path remains valid for the current convex/non-overlap slice. This sequence is shared by:

- canvas panel badges;
- Story Template preview numbering;
- Story Template beat assignment;
- Panel Peek/List;
- prompt;
- manifest-derived semantics;
- export.

Page sequence order, panel order, and container sibling order are independent sequences.

## Writing direction

Project default:

```text
meta.defaultWritingMode = vertical-rl | horizontal-tb
```

Balloon/SFX override:

```text
inherit | vertical-rl | horizontal-tb
```

Writing direction is lettering layout only. It never changes panel reading order.

Editor/review may preview lettering direction. Clean AI rendering omits balloon/SFX text and transfers exact text + writing-mode semantics separately.

## Story Template architecture

Story Template is the canonical product feature name.

- shipped recipe registry provides story/beat patterns;
- discovery metadata is derived UI metadata;
- browsing/filtering/preview does not mutate project;
- explicit apply creates ordinary page/panel state;
- template geometry is renumbered using canonical reading order before beat `N` is assigned to panel order `N`;
- `meta.storyTemplate` is provenance only;
- bounded derivation creates temporary proposal state, not continuing authority;
- browser-local custom templates store reusable direction/normalized geometry but exclude finished character-specific identity.

Custom-template library is separate from project autosave until backup/restore explicitly defines bundling. The new **斜め3コマ / 斜め4コマ 2×2** entries are page-layout presets, not a second Story Template feature.

- `integration/template-character-cast.js` owns the non-serialized cast choice between template discovery and canonical apply. It routes the selected reusable base character(s) into the existing one-visible/two-visible apply pipeline instead of introducing another template state model.
- the same integration owns the final Page-settings presentation of the template task: Story Template Studio + sample-dialogue checkbox + cast selection + visible apply action are relocated into one upper panel-layout workflow; the legacy middle block remains state plumbing only and is hidden.
- the same integration wraps **new-work creation only** to seed six editable description-mode starters; normal project normalization/import does not silently add them to existing works.

## Smart Manga architecture

Smart Manga generates bounded, non-mutating candidates from purpose/panel count/seed/variant/intensity and optional character placement.

Applied candidate provenance is stored in compatible project fields where defined. Selected-panel dice is a narrower mutation boundary and preserves content outside its responsibility.

## Character identity architecture

Reusable base character identity is project-level. Placed characters are panel-specific instances.

Identity modes:

- `sheet` — external Character Sheet required;
- `description` — text appearance contract;
- `free` — downstream model may choose a simple consistent design.

The output layer derives Character Sheet requirements from actually used characters.

Stick figures remain spatial/pose guidance, not appearance authority.

## Story action / pose / camera / continuity semantics

`Panel.actionIntent` captures event meaning that generic pose labels cannot encode.

Richer current semantics may include support state, motion phase, near-object depth target, foreshortening, contact-aware interaction guidance, and scene continuity anchors.

These remain semantic inputs to authoring/handoff, not visible manga lettering.

## Panel Peek / Panel List / Panel Chips

These are derived authoring views rather than parallel models.

- Panel Peek summarizes current semantic state;
- visible `ⓘ` provides a discoverable path in addition to long-press;
- narrow-screen presentation is viewport-bounded/opaque;
- Panel List/page overview reads current panel state in reading order;
- Panel Chips/guide overlays are injected into editor/review presentation and omitted from clean AI output.

## Camera diagnostic / Manga Check

Camera/figure-scale diagnostics, Crop Guide, and Manga Check derive warnings from current authored state.

They are advisory. Warnings do not mutate project state automatically and do not become export blockers.

## AI-safe render modes

### Editor / review

May include authoring metadata, colored anatomy/pose guides, Panel Chips, `ⓘ`, Crop Guide, selected states, lettering preview, and panel-shape corner handles. Handles are authoring UI and never belong in clean output.

### Clean AI visual

Removes authoring labels and balloon/SFX text while preserving spatial composition, authored rectangle/quadrilateral panel boundaries, monochrome pose figures, balloon geometry, and effect geometry.

### Package split

- AI generation ZIP excludes annotated PNG.
- Review/archive ZIP adds annotated PNG under the same state-linked export identity.

## Prompt and manifest architecture

Prompt compilation is deterministic from current project/selected-page state.

It preserves:

- current-page render contract;
- strict `TEXT TO RENDER` allowlist;
- story action intent;
- character identity guidance;
- camera/depth/continuity semantics;
- lettering/SFX writing direction;
- art direction;
- exact panel/cast/setting constraints represented by current contract.

`manga-blueprint-export-manifest/3` is read first and records package identity, file roles, generation inputs, character guidance/Sheet requirements, Story Template provenance, panel intent index, lettering metadata, and producer provenance where available.

`authoring/panel-geometry.js` enriches each current render-brief panel with its compatibility rect and optional quad points. The clean PNG and semantic geometry therefore refer to the same authored boundary.

Current manifest/render indexes are **selected-page scoped**. Multi-page/range/container/work export requires an explicit later scope contract.

## Producer provenance

`handoff/producer-provenance.js` reads build metadata established by `web/src/main.ts`/`web/build-info.json` and adds producer diagnostics to generated manifests.

GitHub Pages deployment stamps the deployed commit/timestamp into `build-info.json`. Local/offline fallback keeps app version while commit may be null.

Producer metadata diagnoses which deployed build created an export. It is not part of project-state identity hashing.

`ui/editor-shell.js` owns the **Work Explorer** opened from the active work title. It combines work switching with the page tree, keeps page actions as advanced controls, and omits dedicated volume/chapter/folder editing from the primary UI while preserving compatibility semantics in project state.

## Public guide and documentation architecture

User guidance has two synchronized representations:

- `docs/USER-GUIDE.md` — repository Markdown source;
- `web/guide.html` — public readable guide page.

The in-editor Help modal remains a compact reference and links to the full guide. It should not accumulate the entire product manual.

`docs/README.md` maps current vs historical documents and defines update ownership. `docs/ROADMAP.md` alone owns changing phase status; detailed multi-page design notes must not become a second status source.

## Privacy / deployment

All core authoring, panel-shape editing, local search/template selection, lint, hashing, ZIP generation, project persistence, and hierarchy management execute in the browser.

Core behavior must not silently upload project state or private Character Sheets.

GitHub Pages publishes static `web/`, schema, and examples. The public guide is also a static page.

## Validation boundaries

Static/CI validation covers deterministic contracts such as:

- syntax;
- runtime registration/order;
- schema shape and compatible normalization;
- convex-quadrilateral geometry contract and mobile-header contract;
- work/page/container persistence behavior;
- manga-first editor shell contract;
- Story Template/Smart Manga contracts;
- reading/lettering synchronization;
- AI-safe handoff and manifest contracts;
- version/document synchronization;
- documentation-map/user-guide/public-guide presence and terminology.

Visual/interaction quality remains separate evidence. A passing CI job does not prove a mobile layout or touch handle is visually good; public UI changes should be inspected from a deployed or equivalent rendered artifact when possible.

### Phase 1 typed UI owner

`web/src/phase-one-ui.ts` owns the new primary Page-settings composition boundary. It keeps the Story Template task together (template → sample dialogue/SFX choice → cast → apply), demotes manual panel layout behind progressive disclosure, and removes the legacy hierarchy editor from the primary Page surface without deleting compatible serialized hierarchy data. It deliberately calls existing canonical template-application functions rather than introducing a second template state model.

The migration boundary is intentionally asymmetric: new composition code must be TypeScript/ESM; existing runtime owners remain classic scripts until migrated with characterization/equivalence coverage. This makes the old runtime a reference implementation instead of pretending a flag-day rewrite is complete.


## Panel layout grammar runtime — Prototype 0.18.0

`web/runtime/templates/panel-layout-grammar.js` is the semantic owner for reusable manga page-layout families introduced after the base quadrilateral geometry layer. It loads after `templates/discovery-presentation.js` and before cast/apply integration.

Responsibilities:

- define tight shared-seam layout geometry (`duel2`, `opposed3`, `zigzag4`) and asymmetric rectangular grammar (`stair4`, `build4`, `detail5`);
- keep legacy `diagonal3` / `diagonal4` IDs compatible while resolving them through corrected shared-seam geometry;
- assign shipped Story Templates to layout families by visual purpose;
- add layout-family search tags and keep new diagonal families visible to presentation discovery;
- register the small set of Story Templates whose purpose is specifically to demonstrate missing layout-grammar coverage.

It does **not** own base panel-shape validation, user-authored quadrilateral editing, story/cast semantics, or final template application. Those remain with `authoring/panel-geometry.js`, Story Template semantic modules, and `templates/presentation-contract.js`.

## Inset panel ownership — Prototype 0.19.0

`web/runtime/authoring/inset-panels.js` owns the compatibility-runtime behavior for one-level panel-in-panel composition. It loads after quadrilateral geometry and before template presentation so it can reuse final panel geometry while extending Render Brief / manifest semantics before producer provenance is attached.

Serialized ownership remains flat: `Page.panels[]` contains both roots and inset children. An optional `Panel.inset` relation stores `parentPanelId`; the child `rect` remains the spatial authority. This avoids introducing a second nested Panel schema while keeping stable Panel IDs and all existing panel editors reusable. Normalization rejects orphan/self/nested parent relations. Page/work duplication remaps the relation whenever Panel IDs are regenerated.

Reading-order ownership remains in the existing geometry-aware function, wrapped only to insert each child immediately after its already-ordered root parent. P0 intentionally blocks splitting related panels rather than guessing how to migrate the relation.

Top-level progressive-disclosure composition belongs to `web/src/phase-one-ui.ts`: Page gets one ARIA tablist submode layer; Panel uses native `details/summary` groups. This UI state is presentation state and is not serialized into the manga project.
