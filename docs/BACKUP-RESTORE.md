# Phase 3 — Backup / Restore implementation contract

This document is the review contract for the first Phase 3 implementation. `docs/ROADMAP.md` remains the only delivery-status authority until this slice is released.

## Objective

Make one complete local manga work recoverable and transferable without confusing AI handoff packages with backups.

## Backup package

The editor creates a dedicated `*.manga-backup.zip` package with stored (uncompressed) ZIP entries:

```text
backup-manifest.json
project.manga.json
templates/custom-templates.json   # optional, explicit checkbox
```

The backup manifest uses `manga-blueprint-backup-manifest/1` and `packageType: work-backup`. It records work identity, project format, file roles, counts, inclusion flags, and SHA-256 hashes for payload files.

This schema is separate from `manga-blueprint-export-manifest/3`. AI generation/review ZIPs are not accepted as work backups.

## Restore validation

Before any local project mutation, restore must validate:

- the dedicated backup manifest and package type;
- required project payload presence;
- stored ZIP entry integrity (CRC-32);
- SHA-256 payload hashes;
- supported project format;
- manifest/project `workId` agreement;
- manifest/project format agreement;
- page/container/base-character/custom-template counts;
- optional custom-template payload shape.

The first slice restores only backups written with the application's current stored-entry ZIP writer. Unsupported compressed ZIP variants are rejected rather than partially interpreted.

## Same-work conflict

If the backup `workId` is already present locally, restore requires an explicit choice:

1. **別作品として取り込む / Restore as new work** — regenerate work/container/page/panel/placed-character/balloon instance identity through the existing copy path.
2. **既存作品を上書き / Overwrite existing work** — require an additional destructive confirmation before replacing that work.
3. **キャンセル / Cancel**.

Title equality alone never selects overwrite behavior.

## Optional custom Story Templates

Custom Story Templates are browser-local rather than work-owned. Inclusion is therefore explicit at backup time.

When included, restore merges by template ID: matching IDs are updated from the backup while unrelated local templates are preserved. The restore preview reports how many templates are included.

## Transaction boundary

Corruption and contract mismatch are rejected before mutation. During apply, the implementation snapshots the current work/template state, cancels a pending autosave, writes the target work, activates it, applies the optional template merge, and updates editor selection/history.

If the apply sequence throws after mutation starts, it attempts to restore the prior template library and target-work record (or remove a newly created target), then reactivates the prior work/page. A rollback failure is logged explicitly rather than hidden.

## Non-goals for this slice

- reference-asset binary backup;
- thumbnails;
- arbitrary third-party compressed ZIP import;
- cloud sync;
- multi-work backup;
- changing project format `manga-blueprint/0.2`;
- changing selected-page AI export scope or manifest schema.

## Verification

The PR must keep the normal production validation green and add a dedicated backup/restore contract validator covering runtime registration, package/schema separation, integrity checks, same-work choice, identity-remap path, autosave cancellation, rollback path, and custom-template merge behavior.

Browser interaction/visual verification remains separate evidence from static CI and should be performed before declaring Phase 3 shipped in `docs/ROADMAP.md`.
