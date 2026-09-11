# Architecture

## Runtime shape

Manga Blueprint Studio is a zero-build static web application served by GitHub Pages.

`web/app.js` loads ordered classic-script chunks from `web/runtime/`. There is currently no application server, framework build step, external runtime script, analytics client, or image-generation API in the core app.

The explicit script order is a compatibility contract because later chunks intentionally extend globals established by earlier chunks.

## Runtime ownership

```text
web/runtime/
├─ core/         project state, persistence, rendering, export/input, base events
├─ authoring/    page/work/container and reusable-character authoring
├─ assist/       bounded Smart Manga assistance
├─ identity/     character identity and appearance handoff
├─ story/        story-readable panel semantics
├─ templates/    Story Template Studio and template/cast contracts
├─ lettering/    balloon/SFX writing direction
├─ ordering/     geometry + reading-order synchronization
├─ integration/  cross-feature integration with intentional load dependencies
├─ handoff/      prompt/manifest/render contracts and producer provenance
└─ ui/           presentation-only layout, clarity, and editor shell
```

`scripts/runtime-paths.mjs` mirrors semantic owners for validators. `scripts/validate-runtime-layout.mjs` rejects chronology-named `web/app-N.js` files, duplicate/missing registrations, and unregistered runtime JavaScript.

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

Other `authoring/` chunks own page/layout/camera, character library/export surfaces, and localization/export hardening.

### UI owner: manga-first editor shell

`ui/editor-shell.js` is the final presentation/navigation layer for the current manga-first shell.

It deliberately **reuses existing page/work/container functions** instead of creating a second project-state model.

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

`ui/editor-shell.js` currently loads after producer provenance and other feature owners so it can reorganize the fully assembled UI without redefining domain behavior.

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
         ├─ id / order / rect / role / actionIntent
         ├─ style
         ├─ camera
         ├─ background
         ├─ effects
         ├─ characters[]
         ├─ balloons[]
         └─ assist provenance where present
```

The JSON Schema is canonical for machine-readable field shape: `schema/manga-blueprint.schema.json`.

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

Reusable semantic character IDs may remain unchanged because they identify the same fictional character inside the copied work rather than a placement instance.

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

Page selection is editor state. Structural page edits are project mutations and participate in Undo/Redo snapshots.

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

Committed render paths synchronize panel `order` from current geometry + reading direction. This sequence is shared by:

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

Custom-template library is separate from project autosave until backup/restore explicitly defines bundling.

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

May include authoring metadata, colored anatomy/pose guides, Panel Chips, `ⓘ`, Crop Guide, selected states, and lettering preview.

### Clean AI visual

Removes authoring labels and balloon/SFX text while preserving spatial composition, monochrome pose figures, balloon geometry, and effect geometry.

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

Current manifest/render indexes are **selected-page scoped**. Multi-page/range/container/work export requires an explicit later scope contract.

## Producer provenance

`handoff/producer-provenance.js` reads build metadata established by `web/app.js`/`web/build-info.json` and adds producer diagnostics to generated manifests.

GitHub Pages deployment stamps the deployed commit/timestamp into `build-info.json`. Local/offline fallback keeps app version while commit may be null.

Producer metadata diagnoses which deployed build created an export. It is not part of project-state identity hashing.

## Public guide and documentation architecture

User guidance has two synchronized representations:

- `docs/USER-GUIDE.md` — repository Markdown source;
- `web/guide.html` — public readable guide page.

The in-editor Help modal remains a compact reference and links to the full guide. It should not accumulate the entire product manual.

`docs/README.md` maps current vs historical documents and defines update ownership. `docs/ROADMAP.md` alone owns changing phase status; detailed multi-page design notes must not become a second status source.

## Privacy / deployment

All core authoring, local search/template selection, lint, hashing, ZIP generation, project persistence, and hierarchy management execute in the browser.

Core behavior must not silently upload project state or private Character Sheets.

GitHub Pages publishes static `web/`, schema, and examples. The public guide is also a static page.

## Validation boundaries

Static/CI validation covers deterministic contracts such as:

- syntax;
- runtime registration/order;
- schema shape and compatible normalization;
- work/page/container persistence behavior;
- manga-first editor shell contract;
- Story Template/Smart Manga contracts;
- reading/lettering synchronization;
- AI-safe handoff and manifest contracts;
- version/document synchronization;
- documentation-map/user-guide/public-guide presence and terminology.

Visual/interaction quality remains separate evidence. A passing CI job does not prove a mobile layout is visually good; public UI changes should be inspected from a deployed or equivalent rendered artifact when possible.
