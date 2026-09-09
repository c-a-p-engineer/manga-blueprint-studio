# Prototype 0.14.0 — Work Library / Hierarchy

Prototype 0.14.0 adds local multi-work management and volume/chapter/folder organization on top of the multi-page foundation from 0.13.0.

Project format remains `manga-blueprint/0.2`; export manifest remains `manga-blueprint-export-manifest/3`. Generation/export remains scoped to the selected page.

## What changed

### Work library

The header exposes a **Works / 作品** entry that opens the browser-local IndexedDB work library.

The library supports:

- listing saved works with title, update time, and page count;
- explicitly opening a work;
- creating a new work;
- renaming a work without changing stable `workId`;
- duplicating a complete work;
- deleting a work with explicit confirmation.

Browsing/listing works never changes active-work state. Opening, creating, and importing a work are explicit activation paths.

### Autosave / active-work separation

`projectStorage.save(project)` now persists work contents only. It does **not** write `activeWorkId`.

This is required for multi-work correctness: a delayed autosave from the previously open work may finish after the user switches works, but it cannot reactivate that previous work.

Active-work changes go through `projectStorage.setActive(workId)` only on explicit activation paths.

### Full-work duplication identity

Duplicating/importing as a new work generates fresh mutable identity for:

- `meta.workId`;
- container IDs, with parent references remapped;
- page IDs, with `containerId` remapped;
- panel IDs;
- placed-character instance IDs;
- balloon IDs.

Semantic reusable-character IDs remain semantic identity and are not replaced merely because the work was duplicated.

### Volume / chapter / folder hierarchy

A work may contain zero or more containers:

```text
Work
├─ ungrouped pages
└─ containers
   ├─ volume
   ├─ chapter
   └─ folder
```

Containers have stable `id`, `kind`, visible `title`, sibling `order`, and optional `parentId`.

The Page tab supports:

- creating volume/chapter/folder containers;
- nesting containers;
- renaming a selected container;
- moving it earlier/later among siblings;
- changing its parent while preventing self/descendant cycles;
- assigning the current page to a container or leaving it ungrouped;
- deleting a container with confirmation.

Deleting a non-empty container never silently deletes pages. Directly assigned pages and direct child containers are re-homed to the deleted container's parent before the container itself is removed.

Changing `page.containerId` never changes the page's stable `id`.

## Persistence boundary

IndexedDB remains the project/work persistence layer:

```text
IndexedDB: manga-blueprint-studio
├─ works
│  └─ workId -> { title, updatedAt, project }
└─ meta
   ├─ activeWorkId
   └─ activePageId:<workId>
```

Historical project-autosave `localStorage` keys are still intentionally not migrated. Portable `.manga.json` import remains the compatibility path. Custom Scene Templates retain their separate browser-local storage contract.

## Import behavior

JSON import keeps same-`workId` conflict handling. After the user chooses copy/overwrite explicitly, the imported work is saved and made active explicitly. Import resets editor Undo/Redo history so history cannot cross work-identity boundaries.

## Current non-goals

Prototype 0.14.0 does not add:

- whole-library/whole-work backup ZIP;
- transactional restore;
- selected-page-range/container/whole-work generation export;
- panel-first generation packages;
- cloud synchronization or collaboration.

These remain later roadmap phases.

## Validation

`validate-work-library-hierarchy.mjs` verifies:

- runtime owner registration/load order;
- autosave/active-work separation;
- explicit work activation paths;
- deep identity regeneration for duplicated works;
- container/page-reference remapping;
- work CRUD contracts;
- hierarchy create/reparent/reorder/delete contracts;
- no-loss container deletion behavior;
- explicit activation for imported works.

Existing regression validators continue to run unchanged.
