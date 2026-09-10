# Project / multi-page / portability design notes

This document records **design decisions and constraints** for the multi-page/backup/export line of work.

Current delivery status belongs only in [`ROADMAP.md`](ROADMAP.md). Do not maintain a second phase-status truth here.

## Current shipped foundation

The current runtime already ships:

- stable `meta.workId`;
- stable `Page.id` and `Container.id`;
- numeric `pageNumber` plus page `order` / optional title;
- optional `Page.containerId`;
- `volume | chapter | folder` containers with optional parent references;
- multi-work IndexedDB persistence;
- multi-page authoring;
- explorer-style Work Structure;
- visible page codes such as `P001` derived from numeric page numbers;
- selected-page generation/review export.

Current canonical serialized project format remains:

```text
manga-blueprint/0.2
```

The hierarchy/identity additions are compatible optional fields inside that format; there is no planned `manga-blueprint/next` migration merely for the current work/page model.

## Key decisions

### JSON remains canonical

Keep JSON as the canonical machine-readable project/restore format.

YAML may be generated as a human/model-facing derived handoff view if it becomes useful, but it must not become a competing source of truth.

Reasons:

- native browser JSON support;
- existing JSON Schema validation;
- deterministic serialization/hashing is simpler;
- current compatibility machinery already targets JSON;
- YAML adds parser/scalar typing edge cases without solving generation reliability.

### Work hierarchy remains referential

Do not force every work into a volume hierarchy.

Current data shape:

```json
{
  "format": "manga-blueprint/0.2",
  "meta": {
    "workId": "work-uuid",
    "title": "作品名"
  },
  "containers": [
    {
      "id": "vol-1",
      "kind": "volume",
      "title": "第1巻",
      "order": 1,
      "parentId": null
    }
  ],
  "pages": [
    {
      "id": "page-uuid",
      "pageNumber": 1,
      "order": 1,
      "containerId": "vol-1",
      "panels": []
    }
  ]
}
```

A flat work uses `containerId: null`.

Pages stay flat records with stable IDs; moving a page changes only its organizational reference. Container nesting uses `parentId` without rewriting page identity.

### Display page code is not identity

`P001` is UI/file-display formatting derived from numeric `pageNumber`.

- `pageNumber` remains mutable presentation/sequence metadata;
- `Page.id` remains stable identity;
- a page move/rename/renumber must not replace its stable ID.

### Navigation follows manga hierarchy

Current UI presents:

```text
Work
  → optional container path
    → P001
      → page settings / panel layout
        → selected-panel authoring
```

The app header remains app-level. Work/page context lives above the canvas. Work Structure is the primary explorer-style hierarchy navigator. Detailed page/container CRUD is advanced editing rather than the main mental model.

This shell is a prerequisite for future backup/export scope UX because users must understand which work/page/container is active before selecting a package scope.

### Backup and generation packages are different products

A generation ZIP is not a complete project backup.

Backup/restore packages must have their own schema, manifest, integrity checks, and restore semantics.

### Multi-page generation is orchestration, not one giant image prompt

Multi-page export must not mean “ask one image model to render every page in one image.”

Use a hierarchy of self-contained contracts:

1. work/batch orchestration contract;
2. per-page render contract;
3. per-panel/generation-group contract only when Panel-first is selected.

The root contract controls selected-page order, shared references/continuity, naming, and orchestration. Each page remains independently renderable.

### Panel-first is provider-independent

Panel-first is an export/orchestration contract, not a hard dependency on ChatGPT, Gemini, or one API.

- ordinary panels may become independent generation units;
- cross-panel breakout/shared background/spread cases become explicit shared generation groups;
- deterministic composition reassembles output using authored geometry;
- provider-specific adapters remain at the boundary.

### Generated-result semantic grading is not required

Do not add an AI semantic/aesthetic result-validator as a core delivery gate.

Keep deterministic checks that protect file integrity and composition:

- schema/version;
- expected files;
- checksums;
- selected scope/IDs;
- image dimensions;
- crop/output naming;
- compositor placement/final dimensions.

### No legacy browser project-autosave migration

Historical project-autosave `localStorage` does not require a migration path. Portable `.manga.json` remains the compatibility route.

This decision does not remove compatibility requirements for user-imported files.

### Import/restore never silently overwrites

Same-title works may coexist. Title equality is not identity conflict.

Only same `workId` is a true work-identity conflict.

Conflict UI must require an explicit choice:

- import as another work;
- overwrite the existing work after destructive confirmation;
- cancel.

## Sequencing rule

Strategic priority and implementation order differ.

Use this reasoning:

1. define the target capability and observable acceptance criteria;
2. map dependencies: identity/storage → domain behavior → export/orchestration → presentation/polish;
3. pull forward only prerequisites whose later addition would force meaningful rework, schema churn, or migration;
4. do not pull unrelated “nice to have” work forward merely because it is adjacent;
5. use a thin vertical slice when foundations are optional/reversible;
6. use foundation-first when the target would otherwise be built on throwaway state/ownership assumptions.

Example: Panel-first is strategically high priority, but stable work/page/panel identity and explicit export scope come first because every panel result needs an unambiguous destination and package identity.

## Backup / restore contract direction

Candidate dedicated package:

```text
<work>.manga-backup.zip
├─ backup-manifest.json
├─ project.manga.json
├─ templates/
│  └─ custom-templates.json      # only when explicitly included
├─ assets/
│  ├─ index.json                 # future reference assets
│  └─ <sha256>.<ext>
└─ thumbnails/                   # optional/rebuildable
```

### Backup manifest should include

- backup schema/version;
- producer provenance;
- work ID/title;
- creation timestamp;
- compatibility range;
- included files/libraries/assets;
- file roles;
- logical counts;
- content hashes.

### Restore flow

1. inspect `backup-manifest.json` before mutating storage;
2. verify required files and hashes;
3. parse project in memory;
4. validate compatible schema/structure/counts;
5. show restore summary: work title/ID, pages, containers, characters, optional libraries/assets;
6. if no same `workId` exists, import normally;
7. if same `workId` exists, require explicit conflict choice;
8. perform write transactionally;
9. on failure, leave the existing library untouched;
10. open the restored work/current page and run structural checks.

### Same-work conflict choices

**別作品として取り込む**

- generate a new work ID;
- remap container/page/panel/placed-instance identities as required for an independent copy;
- preserve semantic content.

**既存作品を上書き**

- destructive replace;
- show existing/imported work title and useful counts;
- state that local changes will be replaced;
- require explicit confirmation.

**キャンセル**

- no storage mutation.

## Scoped export direction

Future scope choices:

| Scope | Package behavior |
|---|---|
| Current page | Existing self-contained current-page contract |
| Explicit pages / range | Root batch manifest lists exact selected IDs/numbers; each page remains independently renderable |
| Container / volume / chapter | Same multi-page structure plus container-level continuity/defaults where defined |
| Whole work | Work contract + all included pages/containers; still processed page-by-page |
| Spread | Explicit two-page shared-canvas generation group, not two unrelated pages |

Requirements:

- page 7-only export must not secretly carry page 6/8 story semantics;
- a request such as `3-5,8` exports exactly four pages;
- root manifest enumerates every included page and path;
- original stable IDs/page numbers remain represented;
- single-page packages remain self-contained.

## Prompt hierarchy

### Single page

Current selected-page contract remains self-contained and rejects unrelated prior-conversation/prior-image carryover.

### Multiple pages

Use two levels:

1. **Batch/work contract** — work identity, selected page order, shared references/continuity, naming, process-one-page-at-a-time rule.
2. **Page contract** — current self-contained page render contract plus only intentionally inherited continuity inputs.

Do not concatenate every page into one giant execution prompt.

### Panel-first

Add a third level only when selected:

1. batch/work contract;
2. page contract;
3. panel or generation-group contract.

Each ordinary panel contract repeats everything necessary to render that unit without relying on previous chat turns.

## Panel-first / hybrid package direction

Each isolated panel unit should be able to contain:

- work/page/panel stable IDs;
- display page code/number;
- clean cropped spatial reference;
- exact panel crop/placement rectangle;
- story action and camera/pose/background/text semantics;
- required character/reference roles;
- expected output dimensions/name;
- compositor metadata.

Shared cases should use explicit generation groups, for example:

- character breakout spanning panels;
- shared background across panels;
- intentional cross-panel composition;
- two-page spread.

A deterministic compositor should reconstruct the authored page without requiring an image model to guess the original page geometry.

## Provider feasibility

### Interactive assistant

ChatGPT or Gemini can receive one page/panel package at a time for manual/agent-guided generation.

### Workspace/code agent

A code/workspace agent can iterate package files, invoke image-generation capability when available, enforce output naming, run deterministic compositor checks, and inspect resulting files.

### API adapter

OpenAI/Gemini/etc. image-generation APIs may automate generation, but adapters remain explicit/optional because they add credentials, quotas, privacy boundaries, and possible cost.

Core project state does not depend on a provider.

## Cross-page reference/continuity direction

Future reusable reference classes may include:

- characters;
- locations;
- props;
- outfits;
- vehicles;
- style references;
- poses;
- lighting.

Potential continuity semantics:

- stable reference ID;
- lock vs soft-reference behavior;
- previous/next-page anchors;
- state transitions for prop/outfit/location;
- work/container defaults with page overrides;
- explicit package inclusion;
- no silent private-asset upload.

## Compatibility constraints

- existing `manga-blueprint/0.2` files should continue to import where practical;
- current `pages[]` + stable identity model is the foundation; do not rewrite it for hierarchy aesthetics;
- `pageNumber` is mutable display/order metadata; `Page.id` is stable identity;
- work/container/page moves do not change stable IDs unless content is explicitly duplicated;
- custom Story Template ownership and future Reference Asset ownership must be explicit before backup bundling is finalized;
- provider independence and no-silent-upload remain cross-phase invariants.

## Status

See [`ROADMAP.md`](ROADMAP.md) for what is shipped, next, and planned. This file intentionally does not own changing phase status.
