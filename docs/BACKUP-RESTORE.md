# Phase 3 — Backup / Restore implementation contract

This document defines the implementation/review contract for Phase 3. `docs/ROADMAP.md` remains the only delivery-status authority until the feature is released.

## Objective

Make one complete local manga work recoverable and transferable without confusing AI handoff packages with backups.

## Backup package

The editor creates a dedicated `*.manga-backup.zip` package using the existing stored-entry ZIP writer:

```text
backup-manifest.json
project.manga.json
templates/custom-templates.json   # optional, explicit checkbox
```

The backup manifest uses `manga-blueprint-backup-manifest/1` and `packageType: work-backup`. It records work identity, project format, active page, file roles, payload counts, inclusion flags, and SHA-256 hashes for payload files.

This schema is separate from `manga-blueprint-export-manifest/3`. AI generation/review ZIPs are not accepted as work backups.

## Runtime ownership

- `web/runtime/integration/backup-restore.js` owns package construction, validation, conflict-safe restore application, custom-template merge behavior, and the rollback boundary.
- `web/src/runtime/legacy-api.ts` exposes that compatibility service through one typed adapter.
- `web/src/ui/backup-restore.ts` owns user interaction, preview, conflict choice, destructive confirmation, status messaging, and download/file-picker presentation.
- `web/runtime/core/project-storage.js` owns IndexedDB persistence, including explicit `saveAndActivate()` and queued-autosave settlement used by restore.

The feature does not create a second project/work model.

## Restore validation

Before any local project mutation, restore validates:

- the dedicated backup manifest and package type;
- exact declared file count;
- required project payload presence and file role;
- stored ZIP entry integrity with CRC-32;
- raw payload SHA-256 hashes;
- supported project format;
- required stable identities and basic project geometry/content shape;
- manifest/project `workId` agreement;
- manifest/project format agreement;
- page/container/base-character/custom-template counts;
- optional custom-template payload shape.

The first slice restores only backups written with the application's current stored-entry ZIP writer. Encrypted, compressed, data-descriptor, path-traversal, and malformed ZIP entries are rejected rather than partially interpreted.

## Same-work conflict

If the backup `workId` is already present locally, restore requires an explicit choice:

1. **別作品として取り込む / Restore as new work** — regenerate work/container/page/panel/placed-character/balloon instance identity through the existing copy path.
2. **既存作品を上書き / Overwrite existing work** — require an additional destructive confirmation before replacing that work.
3. **キャンセル / Cancel**.

Title equality alone never selects overwrite behavior. The runtime rechecks target existence immediately before mutation so a stale preview cannot silently turn a normal restore into an overwrite.

## Optional custom Story Templates

Custom Story Templates are browser-local rather than work-owned. Inclusion is explicit at backup time.

When included, restore merges by template ID: matching IDs are updated from the backup while unrelated local templates are preserved. The restore preview reports how many templates are included.

## Transaction boundary

Corruption and contract mismatch are rejected before mutation. Before restore starts, the pending autosave timer is cancelled, any in-flight save is awaited, and the latest current work is explicitly persisted.

The target work plus active-work/active-page metadata are written through `projectStorage.saveAndActivate()` in one IndexedDB transaction. Custom Story Templates live in separate browser storage, so their optional merge is protected by compensating rollback rather than pretending the two storage systems share one transaction.

If application fails after mutation starts, restore attempts to:

1. restore the prior custom-template library;
2. restore the overwritten target or remove a newly-created target;
3. restore and reactivate the previous work/page;
4. restore in-memory editor selection/history/render state.

Rollback failures are logged explicitly rather than hidden.

## Non-goals for this slice

- reference-asset binary backup;
- thumbnails;
- arbitrary third-party compressed ZIP import;
- cloud sync;
- multi-work backup;
- changing project format `manga-blueprint/0.2`;
- changing selected-page AI export scope or manifest schema.

## Verification

Before release:

- `npm run validate` must pass with a dedicated backup/restore validator;
- backup from one clean browser profile must restore in another clean profile;
- generation/review ZIPs and corrupted backups must fail before mutation;
- same-work conflict must never silently overwrite;
- import-as-new must regenerate independent identity;
- a failed apply must leave the prior work/library state intact;
- restored work/page must open and remain editable/exportable;
- Product, Architecture, User Guide, public guide, README headline state, Roadmap status, and release notes must be synchronized when the feature is actually shipped.

Static CI is not evidence of browser-level restore usability; deployed interaction verification remains a separate release gate.
