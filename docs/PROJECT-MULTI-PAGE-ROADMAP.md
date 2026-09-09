# Project / multi-page / portability roadmap

Planning document. Implementation details remain subject to the canonical contracts in `AGENTS.md`, `docs/PRODUCT.md`, schema, architecture, and shipped code.

## Key decisions

- Keep JSON as the canonical machine-readable project state and restore format. YAML may be generated as a human/model-facing handoff projection, but must not become a second source of truth.
- Treat the current `pages[]` schema as the migration base, but remove runtime dependence on `project.pages[0]` before advertising multi-page support.
- Model directory-like organization as Work → optional Containers → Pages. Containers should support at least `volume`, `chapter`, and `folder`, with optional parent references, while pages remain flat records with stable IDs and container references.
- Separate backup/restore packages from generation/review packages. A generation ZIP is not a complete backup.
- Multi-page generation should never mean “ask one image model to render every page in one image.” Root batch instructions coordinate page order and continuity; each page keeps an independently renderable page contract.
- Panel-first generation should be an export/orchestration contract, not a hard dependency on one provider. Normal panels are independent generation units; cross-panel breakout/shared-canvas/spread cases become explicit generation groups.
- Generated-result validation must distinguish deterministic checks from vision-model judgments. Core can perform deterministic structural/package checks; semantic image validation requires an explicit external vision adapter or a portable validation bundle for ChatGPT/Codex/Gemini.

## Phase plan

| Phase | Priority | Goal | Main work | Verification / exit criteria |
|---|---|---|---|---|
| 0. Storage and identity foundation | S | Make multiple works/pages/assets safe to persist | Introduce stable `workId`, `pageId`, container IDs and ordering; storage abstraction; migrate browser persistence from single active localStorage state toward IndexedDB for multi-work metadata/binary references; retain legacy localStorage import path | Existing single-page projects migrate without loss; refresh/reopen preserves selected work/page; no silent overwrite |
| 1. True multi-page core | S | Turn existing `pages[]` from schema-only capability into runtime behavior | Replace `currentPage = project.pages[0]` assumptions with selected page state; add page create/duplicate/delete/reorder/rename; page number vs stable ID separation; page thumbnail/list navigation; undo/redo remains page-safe | User can create, switch, edit, reorder and reopen 10+ pages; edits affect only selected page; current single-page files still load |
| 2. Work / volume / folder organization | S | Support `作品 > ページ` and `作品 > 巻/章/フォルダ > ページ` | Add work library screen; optional hierarchical containers (`volume`, `chapter`, `folder`); move/reorder pages between containers; duplicate/rename work; compact tree/list UI for mobile | Both flat and grouped works are representable without data duplication; page IDs survive moves; numbering can be regenerated without changing IDs |
| 3. Portable backup / restore | S | Make projects fully recoverable and transferable | Add dedicated `*.manga-backup.zip`; `backup-manifest.json`; canonical project JSON; local templates; explicitly included reference assets; content hashes/checksums; restore preview; import-as-copy by default; transactional restore and rollback | Backup downloaded in one browser can restore into a clean browser; corrupted/mismatched ZIP fails before mutation; generation ZIP is never accepted as a full backup by mistake |
| 4. Scoped export and multi-page handoff | S | Export exactly the pages the user intends | Export scope UI: selected page / explicit page list / range / container / whole work; preserve original work/container/page IDs and page numbers; single-page package remains self-contained; multi-page bundle gets root batch manifest plus per-page manifests/prompts; spread pair as explicit special scope | Page 7-only export contains no hidden page 6/8 semantics; `3-5,8` exports exactly four pages; multi-page root manifest enumerates every included page and per-page file path |
| 5. Panel-first / hybrid generation packages | S | Reduce whole-page instruction failure without losing manga-specific cross-panel effects | Emit per-panel generation units; clean cropped panel blueprint + panel contract + references; explicit `generationGroupId` for breakout/shared background/spread; deterministic compositor recipe/geometry; provider capability declarations; output naming contract | A consumer can generate each normal panel independently and reconstruct the exact page geometry; grouped effects do not get split accidentally; page-first legacy export remains available during migration |
| 6. Generation result validation | S | Detect contract failures and target retries | Level 0 deterministic: files, dimensions, hashes, scope, page/panel counts from known outputs; Level 1 structural: compositor placement/crop checks; Level 2 semantic vision contract: cast/identity/action/pose/camera/background/text; portable `validation-bundle.zip`; optional ChatGPT/Codex/Gemini adapters; targeted retry contract per failed panel | Validator reports evidence and confidence; deterministic vs model judgment is clearly labeled; a bad panel can be retried without regenerating unaffected panels |
| 7. Cross-page continuity and reference assets | A | Make long works visually and semantically stable | Reference Asset Library for character/location/prop/outfit/style/pose/lighting; continuity state across selected page range; prop/costume/location state transitions; previous-page/next-page anchors; container/work-level defaults with page overrides | Repeated character/location/prop references resolve to stable IDs; page-local overrides do not mutate work defaults; continuity warnings identify unexplained state changes |
| 8. Manga direction expansion | A/B | Build on the new project/page model | 180-degree axis/eyeline, perspective/lens, eye-flow, gutter transition semantics, page-turn/reveal intent, spreads/binding-safe zones, deterministic lettering, advanced panel geometry | Features operate across page boundaries without breaking single-page generation or backup compatibility |

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

YAML is still useful as an optional generated handoff view, for example `page-contract.yaml`, when human readability or downstream model ergonomics are useful. It should be derived from canonical JSON and never imported as a competing authoritative project state until there is measured evidence that the benefit justifies that complexity.

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

Restore flow:

1. Read/validate backup manifest before mutating storage.
2. Validate required files and hashes.
3. Parse/migrate project schema in memory.
4. Show import summary/conflicts.
5. Default to **import as copy** when the same `workId` exists; explicit replace is a separate action.
6. Write transactionally; on failure leave the existing library untouched.
7. Reopen restored work/page and run canonical validation.

## Provider feasibility for panel-first

The contract should support three usage classes rather than hard-code one provider:

- **Interactive assistant** — ChatGPT or Gemini can receive one panel package at a time and generate/edit that panel. Suitable for manual or agent-guided iteration.
- **Workspace/code agent** — Codex can iterate files, invoke image-generation capability when available, name outputs, run a compositor, and perform image/file QA. This is the strongest fit for unattended package execution.
- **API adapter** — Gemini API / OpenAI image+vision APIs can automate panel generation and semantic validation, but are opt-in provider adapters because they introduce credentials, privacy boundaries, quotas, and possible usage cost.

## Generated-result validation levels

| Level | Runs fully client-side? | What it can verify |
|---|---|---|
| L0 package/integrity | Yes | expected files, hashes, dimensions, selected scope, IDs, output naming |
| L1 deterministic composition | Yes | panel crop dimensions, compositor placement, page canvas geometry when panel outputs are assembled by the app/tool |
| L2 semantic vision | No, not with the current zero-remote core alone | visible cast, character identity, action/pose, camera interpretation, background semantics, unlisted visible text, approximate continuity |

For the current privacy-first architecture, the first L2 implementation should be a **portable validation bundle** and provider-neutral rubric. Direct API validation can be a later optional adapter rather than a core requirement.

## Migration constraints

- Existing `manga-blueprint/0.2` single-page files must continue to import.
- Existing `pages[]` is the migration foothold; do not rewrite old projects solely for the sake of a new hierarchy.
- `pageNumber` is mutable presentation/order metadata; `pageId` is stable identity.
- Work/container/page moves must never change panel or character stable IDs unless explicitly duplicating content.
- Local custom templates and future reference assets need explicit ownership (`global` vs `work`) before backup behavior is finalized.
- Multi-page features must preserve provider independence and the no-silent-upload privacy invariant.
