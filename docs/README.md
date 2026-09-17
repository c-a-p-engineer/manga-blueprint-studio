# Documentation map

This directory separates **current contracts**, **user guidance**, **delivery planning**, and **historical evidence** so old prototype notes do not accidentally become current specifications.

## Start here

| Need | Document | Authority |
|---|---|---|
| What the product currently does | [`PRODUCT.md`](PRODUCT.md) | Canonical user-visible behavior |
| How to use the current Web UI | [`USER-GUIDE.md`](USER-GUIDE.md) | Current derived Web user guide |
| How the runtime/state/storage are organized | [`ARCHITECTURE.md`](ARCHITECTURE.md) | Canonical technical architecture |
| How existing Web AI generation/review handoff works | [`PROMPT_HANDOFF.md`](PROMPT_HANDOFF.md) | Canonical Web export/handoff contract |
| How the headless Blueprint Engine workflow works | [`BLUEPRINT-ENGINE.md`](BLUEPRINT-ENGINE.md) | Headless workflow guide; subordinate to Product/schema/Architecture |
| AI/human Name DSL syntax | [`../core/name-schema.md`](../core/name-schema.md) | Name-source contract; not persistent project authority |
| What is shipped / next / planned | [`ROADMAP.md`](ROADMAP.md) | **Only status authority for roadmap phases** |
| Multi-page / backup / export design decisions | [`PROJECT-MULTI-PAGE-ROADMAP.md`](PROJECT-MULTI-PAGE-ROADMAP.md) | Supplemental design note; not a competing status tracker |
| Serialized project fields | [`../schema/manga-blueprint.schema.json`](../schema/manga-blueprint.schema.json) | Canonical machine-readable schema |
| Repository-wide invariants | [`../AGENTS.md`](../AGENTS.md) | Highest repository rule set |

Public user guide:

- https://c-a-p-engineer.github.io/manga-blueprint-studio/guide.html

Public product landing page:

- https://c-a-p-engineer.github.io/manga-blueprint-studio/

Editor:

- https://c-a-p-engineer.github.io/manga-blueprint-studio/editor.html

## Current vs historical documents

### Current

These describe current contracts or active preview behavior:

- `../README.md`
- `PRODUCT.md`
- `ARCHITECTURE.md`
- `PROMPT_HANDOFF.md`
- `BLUEPRINT-ENGINE.md`
- `../core/name-schema.md`
- `ROADMAP.md`
- `USER-GUIDE.md`
- `PROJECT-MULTI-PAGE-ROADMAP.md` where it describes active design constraints
- `../web/runtime/README.md`

`USER-GUIDE.md` and `web/guide.html` remain specifically about the current Web editor. The headless Blueprint Engine has its own guide instead of forcing CLI/agent instructions into the Web UI guide.

### Historical release notes

`PROTOTYPE-*.md` files are release records. They may say “Prototype 0.10 introduced …” even when the current runtime is newer. Do not rewrite old release notes so they appear to describe the current UI.

The latest release note is linked from the repository README and version-sync validation.

### Historical research / baselines

The following filename families are evidence or dated planning input rather than current product authority:

- `BASELINE-*.md`
- `COMPETITOR-NOTES-YYYY-MM-DD.md`
- `RESEARCH-SOURCES-YYYY-MM-DD.md`
- `TASKS-RESEARCH-YYYY-MM-DD.md`
- `PANEL-LAYOUT-GRAMMAR-YYYY-MM-DD.md`

When current product decisions differ from old research, update the current contract/roadmap rather than rewriting the original research as if it had always reached the new conclusion.

## Documentation maintenance rule

A change is not documentation-complete until the affected authority and user-facing guidance are synchronized.

| Change type | Required documentation |
|---|---|
| User-visible Web UI/workflow | `PRODUCT.md`, `USER-GUIDE.md`, `web/guide.html`; update `README.md` if headline workflow changes; add/update release note |
| Headless Blueprint Engine / Name DSL | `PRODUCT.md`, `ARCHITECTURE.md`, `BLUEPRINT-ENGINE.md`, `core/name-schema.md`, `README.md`, and `ROADMAP.md` when status changes |
| Project JSON/schema | schema, `PRODUCT.md`, `ARCHITECTURE.md`, compatibility notes |
| Runtime/state/storage ownership | `ARCHITECTURE.md`, `web/runtime/README.md` when Web runtime ownership changes |
| Existing Web prompt/manifest/export package | `PROMPT_HANDOFF.md`, plus Product/Architecture where the contract crosses those boundaries |
| Roadmap status/priority | `ROADMAP.md` only; supplemental design docs may link to it but should not maintain independent status truth |
| Public guide terminology | `USER-GUIDE.md` and `web/guide.html` must remain semantically aligned |
| Release version | `web/build-info.json`, runtime fallback/provenance, `README.md`, `ROADMAP.md`, and `PROTOTYPE-<version>.md` through existing version-sync validation |

## Current terminology

Use these names in current documentation and UI:

- **作品 / Work** — one manga work/project.
- **作品エクスプローラー / Work Explorer** — active work titleから開く、作品切替＋ページツリーのfile-explorer-style navigation.
- **巻 / Volume**, **章 / Chapter**, **フォルダ / Folder** — compatibility data for existing/imported works; dedicated editing is not a primary UI surface.
- **P001** — visible page code; underlying `pageNumber` remains numeric.
- **ページ設定 / Page settings** — manuscript/layout/current-page configuration, not primary work/page navigation.
- **ストーリーテンプレート / Story Template** — the single canonical template feature name.
- **Smart Manga** — bounded alternative proposal system; not an alias for Story Template.
- **Blueprint Engine** — headless Name-to-canonical-project compiler.
- **AI Name DSL** — lightweight AI/human authoring source; not canonical saved project state.
- **AI生成ZIP / AI generation ZIP** — existing Web selected-page generation package.
- **確認用ZIP / Review/archive ZIP** — same Web semantic state plus annotated PNG.

Do not introduce “Scene Template” as another product feature name.

## Current scope boundary

The Web runtime supports multiple works, optional hierarchy, and multiple pages, but its AI generation/review export is still **selected-page scoped**. Backup/restore and multi-page/range/container/work-wide Web export are later roadmap phases.

Separately, the Blueprint Engine preview can compile multi-page Name source into project state and per-page headless assets. That does not mean the established Web export contract has become multi-page.

- `PROTOTYPE-0.19.0.md` — panel-in-panel P0 and progressive editor disclosure release note.
