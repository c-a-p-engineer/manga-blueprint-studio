# Project / multi-page / portability roadmap

Planning document. Implementation details remain subject to the canonical contracts in `AGENTS.md`, `docs/PRODUCT.md`, schema, architecture, and shipped code.

## Key decisions

- Keep JSON as the canonical machine-readable project state and restore format. YAML may be generated as a human/model-facing handoff projection, but must not become a second source of truth.
- Treat the current `pages[]` schema as the multi-page foothold, but remove runtime dependence on `project.pages[0]` before advertising multi-page support.
- Model directory-like organization as Work → optional Containers → Pages. Containers should support at least `volume`, `chapter`, and `folder`, with optional parent references, while pages remain flat records with stable IDs and container references.
- Separate backup/restore packages from generation/review packages. A generation ZIP is not a complete backup.
- Multi-page generation never means “ask one image model to render every page in one image.” Root batch instructions coordinate page order and continuity; each page keeps an independently renderable page contract.
- Panel-first generation is an export/orchestration contract, not a hard dependency on one provider. Normal panels are independent generation units; cross-panel breakout/shared-canvas/spread cases become explicit generation groups.
- Generated-result semantic validation is **not on the active roadmap**. Keep only deterministic integrity/composition checks that are naturally required by export, import, backup, and deterministic page composition.
- No migration path is required for the current browser `localStorage` state. The current user accepts discarding/resetting that local-only prototype state when the new storage model ships. File import compatibility remains a separate concern.
- Import/restore must never silently overwrite an existing work. A same-`workId` conflict requires an explicit user choice.

## Sequencing rule

Roadmap priority and implementation order are different concepts.

- **Strategic priority** answers: “Which capability matters most to the product outcome?”
- **Implementation order** answers: “What must be built first so the strategic capability can be implemented once, cleanly, and safely?”

A feature can remain the top strategic priority while lower-priority enabling work is implemented first. Dependencies, data ownership, irreversible schema choices, and rework risk outrank headline priority when choosing execution order.

Use this ordering rule:

1. Identify the target capability and acceptance criteria.
2. Build a dependency graph: data model/storage → domain behavior → export/orchestration → presentation/polish.
3. Pull forward only prerequisites whose later addition would force meaningful rework or data migration.
4. Do not pull unrelated “nice to have” tasks forward merely because they are nearby.
5. Prefer a thin vertical slice when prerequisites are optional or reversible; prefer foundation-first when the target would otherwise be built on throwaway state/API assumptions.

Example: Panel-first is strategically S, but multi-work/page identity and export scope come first because panel outputs need stable `workId/pageId/panelId`, a destination page, and explicit export scope. Eye-flow is useful but does not block panel-first, so it stays later.

## Phase plan

| Phase | Priority | Goal | Main work | Verification / exit criteria |
|---|---|---|---|---|
| 0. Storage and identity foundation | S | Make multiple works/pages/assets safe to persist | Introduce stable `workId`, `pageId`, container IDs and ordering; add a storage abstraction suitable for multiple works and future binary references; move to IndexedDB or an equivalent structured browser store. **Do not build legacy localStorage migration.** | New storage can create/reopen multiple works and selected pages; reset from the old prototype state is acceptable; no silent overwrite |
| 1. True multi-page core | S | Turn existing `pages[]` from schema-only capability into runtime behavior | Replace `currentPage = project.pages[0]` assumptions with selected page state; add page create/duplicate/delete/reorder/rename; separate page number from stable ID; page thumbnail/list navigation; undo/redo remains page-safe | User can create, switch, edit, reorder and reopen 10+ pages; edits affect only selected page |
| 2. Work / volume / folder organization | S | Support `作品 > ページ` and `作品 > 巻/章/フォルダ > ページ` | Add work library screen; optional hierarchical containers (`volume`, `chapter`, `folder`); move/reorder pages between containers; duplicate/rename work; compact tree/list UI for mobile | Both flat and grouped works are representable without data duplication; page IDs survive moves; numbering can be regenerated without changing IDs |
| 3. Portable backup / restore | S | Make projects fully recoverable and transferable | Add dedicated `*.manga-backup.zip`; `backup-manifest.json`; canonical project JSON; local templates; explicitly included reference assets; content hashes/checksums; restore preview; transactional restore | Backup downloaded in one browser can restore into a clean browser; corrupted/mismatched ZIP fails before mutation; generation ZIP is never accepted as a full backup by mistake |
| 4. Scoped export and multi-page handoff | S | Export exactly the pages the user intends | Export scope UI: selected page / explicit page list / range / container / whole work; preserve original work/container/page IDs and page numbers; single-page package remains self-contained; multi-page bundle gets root batch manifest plus per-page manifests/prompts; spread pair as explicit special scope | Page 7-only export contains no hidden page 6/8 semantics; `3-5,8` exports exactly four pages; multi-page root manifest enumerates every included page and per-page file path |
| 5. Panel-first / hybrid generation packages | S | Reduce whole-page instruction failure without losing manga-specific cross-panel effects | Emit per-panel generation units; clean cropped panel blueprint + panel contract + references; explicit `generationGroupId` for breakout/shared background/spread; deterministic compositor recipe/geometry; provider capability declarations; output naming contract | A consumer can generate each normal panel independently and reconstruct the exact page geometry; grouped effects do not get split accidentally; page-first export remains available during migration |
| 6. Cross-page continuity and reference assets | A | Make long works visually and semantically stable | Reference Asset Library for character/location/prop/outfit/style/pose/lighting; continuity state across selected page range; prop/costume/location state transitions; previous-page/next-page anchors; container/work-level defaults with page overrides | Repeated character/location/prop references resolve to stable IDs; page-local overrides do not mutate work defaults; continuity checks can identify unexplained state changes |
| 7. Manga direction expansion | A/B | Build on the new project/page model | 180-degree axis/eyeline, perspective/lens, eye-flow, gutter transition semantics, page-turn/reveal intent, spreads/binding-safe zones, deterministic lettering, advanced panel geometry | Features operate across page boundaries without breaking single-page generation or backup compatibility |

## Proposed data-shape direction

Do not force `volume` into every work. Keep pages flat and containers referential so moving a page does not rewrite its identity.

```json
{
  "format": "manga-blueprint/next",
  "meta": {
    "workId": "work-uuid",
    "title": "作品名"
  },
  "containers": [
    {"id": "vol-1", "kind": "volume", "title": "第1巻", "order": 1, "parentId": null}
  ],
  "pages": [
    {"id": "page-uuid", "pageNumber": 1, "order": 1, "containerId": "vol-1", "panels": []}
  ]
}
```

A flat work simply uses `containerId: null`. Future chapter/folder nesting can use `parentId` without changing page identity.

## Export scopes

| Scope | Package behavior |
|---|---|
| Selected page | Current Render Contract + one page manifest/prompt; self-contained |
| Explicit pages / range | Root batch manifest lists exact selected page IDs/numbers; each page remains independently renderable |
| Container / volume | Same multi-page structure plus container continuity/defaults |
| Whole work | Work contract + all selected containers/pages; still processed page-by-page by downstream generators |
| Spread | Explicit two-page shared-canvas generation group; not treated as two unrelated panels/pages |

## Prompt hierarchy

### Single page

Use the existing current-page contract model: ignore unrelated prior context, preserve exact page geometry/cast/text, and render only that page.

### Multiple pages

Use a two-level contract:

1. **Batch / work contract** — work identity, selected page order, shared references, continuity constraints, output naming, and “process one page at a time” rule.
2. **Page contract** — the existing self-contained page render contract, plus only the continuity inputs intentionally inherited from the batch contract.

Do not concatenate every page into one giant generation prompt. The root prompt is orchestration; page prompts remain execution units.

### Panel-first

Add a third level only when panel-first is selected:

1. Batch/work contract
2. Page contract
3. Panel or generation-group contract

The panel contract must repeat all information required to render that panel without relying on previous conversational turns.

## JSON vs YAML

Recommendation: **do not migrate canonical project state from JSON to YAML.**

Reasons:

- the browser already has native JSON parse/stringify support;
- JSON Schema validation and current compatibility machinery already exist;
- deterministic serialization/hashing and backup verification are simpler;
- YAML requires another parser and has more scalar/typing edge cases;
- changing canonical format would create migration cost without solving the actual generation-reliability problem.

YAML remains useful as an optional generated handoff view such as `page-contract.yaml`. It is derived from canonical JSON and is not a competing source of truth.

## Backup ZIP contract

Suggested structure:

```text
<work>.manga-backup.zip
├─ backup-manifest.json
├─ project.manga.json
├─ templates/
│  └─ custom-templates.json
├─ assets/
│  ├─ index.json
│  └─ <sha256>.<ext>
└─ thumbnails/              # optional/rebuildable
```

`backup-manifest.json` should include backup schema/version, producer provenance, work ID, creation time, included assets/templates, file hashes, and compatibility range.

### Restore/import conflict behavior

1. Read/validate backup manifest before mutating storage.
2. Validate required files and hashes.
3. Parse the project in memory and show an import summary.
4. If no existing `workId` matches, import normally.
5. If the same `workId` already exists, show a blocking conflict dialog with:
   - **別作品として取り込む** — generate a new `workId`; preserve page/content identity only where safe for the copied work.
   - **既存作品を上書き** — destructive replace; require explicit confirmation showing work title, existing page count, imported page count, and that local changes will be replaced.
   - **キャンセル**.
6. Never infer overwrite from title equality alone. Same title with a different `workId` may coexist.
7. Write transactionally; on failure leave the existing library untouched.
8. Reopen the restored work/page and run canonical structural validation.

No import/restore path silently overwrites an existing work.

## Provider feasibility for panel-first

The contract supports three usage classes rather than hard-coding one provider:

- **Interactive assistant** — ChatGPT or Gemini can receive one panel package at a time and generate/edit that panel. Suitable for manual or agent-guided iteration.
- **Workspace/code agent** — Codex can iterate files, invoke image-generation capability when available, name outputs, run a compositor, and perform file/image QA. This is the strongest fit for unattended package execution.
- **API adapter** — Gemini API / OpenAI image-generation APIs can automate panel generation, but remain opt-in adapters because they introduce credentials, privacy boundaries, quotas, and possible usage cost.

## Deterministic checks retained

Removing generated-result semantic validation does **not** remove checks required for reliable file operations. Keep deterministic checks for:

- backup file hashes and schema/version;
- selected export scope and IDs;
- expected image dimensions;
- panel crop/output naming;
- deterministic compositor placement and final page dimensions.

These are integrity checks, not AI-output quality grading.

## Compatibility constraints

- Existing `manga-blueprint/0.2` files should continue to import where practical; this is file-format compatibility, not browser-local-state migration.
- Existing `pages[]` is the multi-page foothold; do not rewrite the model solely for hierarchy aesthetics.
- `pageNumber` is mutable presentation/order metadata; `pageId` is stable identity.
- Work/container/page moves must never change panel or character stable IDs unless explicitly duplicating content.
- Local custom templates and future reference assets need explicit ownership (`global` vs `work`) before backup behavior is finalized.
- Multi-page features must preserve provider independence and the no-silent-upload privacy invariant.
