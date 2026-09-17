# Documentation map

This directory separates **current contracts**, **user guidance**, **delivery planning**, and **historical evidence** so old prototype notes do not accidentally become current specifications.

## Start here

| Need | Document | Authority |
|---|---|---|
| Product overview | [`../README.md`](../README.md) / [`../README.ja.md`](../README.ja.md) | Concise multilingual entry |
| What the product currently does | [`PRODUCT.md`](PRODUCT.md) | Canonical user-visible behavior |
| How to use the Web UI | [`USER-GUIDE.md`](USER-GUIDE.md) | Derived Web user guide |
| Learn manga direction techniques | [`MANGA-TECHNIQUES.md`](MANGA-TECHNIQUES.md) | Derived technique guidance |
| Runtime/state/storage architecture | [`ARCHITECTURE.md`](ARCHITECTURE.md) | Canonical technical architecture |
| Web AI generation/review handoff | [`PROMPT_HANDOFF.md`](PROMPT_HANDOFF.md) | Canonical Web handoff contract |
| Headless Blueprint Engine | [`BLUEPRINT-ENGINE.md`](BLUEPRINT-ENGINE.md) | Headless workflow guide |
| AI/human Name DSL syntax | [`../core/name-schema.md`](../core/name-schema.md) | Name-source contract |
| AI agent workflow | [`../.agents/skills/manga-blueprint/SKILL.md`](../.agents/skills/manga-blueprint/SKILL.md) | Agent task guidance subordinate to AGENTS/contracts |
| Shipped / next / planned | [`ROADMAP.md`](ROADMAP.md) | **Only roadmap status authority** |
| Serialized project fields | [`../schema/manga-blueprint.schema.json`](../schema/manga-blueprint.schema.json) | Canonical machine-readable schema |
| Repository invariants | [`../AGENTS.md`](../AGENTS.md) | Highest repository rule set |

Public pages:

- Product: https://c-a-p-engineer.github.io/manga-blueprint-studio/
- Editor: https://c-a-p-engineer.github.io/manga-blueprint-studio/editor.html
- User guide: https://c-a-p-engineer.github.io/manga-blueprint-studio/guide.html
- Manga techniques: https://c-a-p-engineer.github.io/manga-blueprint-studio/techniques.html

## Current vs historical

Current contract/guidance files include `../AGENTS.md`, multilingual READMEs, Product, Architecture, Prompt Handoff, Blueprint Engine, Name schema, Roadmap, User Guide, Manga Techniques, schema, and the agent skill.

`PROTOTYPE-*.md` files are historical release records. Dated `BASELINE-*`, `COMPETITOR-*`, `RESEARCH-*`, `TASKS-*`, and `PANEL-LAYOUT-GRAMMAR-*` documents are evidence/planning input, not current authority.

When current decisions differ from historical research, update current contracts rather than rewriting history.

## Documentation maintenance rule

A change is not documentation-complete until the affected authority and user-facing guidance are synchronized.

| Change type | Required documentation |
|---|---|
| Public Web UI/workflow | Product, relevant public HTML guide, README when headline behavior changes, release note as required |
| Manga technique guidance | `MANGA-TECHNIQUES.md` + `web/techniques.html` semantically aligned |
| Blueprint Engine / Name DSL | Product, Architecture, Blueprint Engine, Name schema, README, Roadmap when status changes |
| Project JSON/schema | schema + Product + Architecture + compatibility notes |
| Runtime/state/storage | Architecture + runtime README when applicable |
| Web prompt/manifest/export | Prompt Handoff + Product/Architecture as needed |
| Agent workflow | `AGENTS.md` + relevant `.agents/skills/*`; never weaken higher product/schema contracts |
| Roadmap status | `ROADMAP.md` only |
| Release version | build info/runtime provenance/README/Roadmap/release note through version-sync validation |

## Current terminology

- **Work / 作品** — one manga work/project.
- **P001** — visible page code; `pageNumber` remains numeric.
- **Story Template / ストーリーテンプレート** — canonical template feature name.
- **Smart Manga** — bounded alternative proposal system.
- **Blueprint Engine** — headless Name-to-canonical-project compiler.
- **AI Name DSL** — lightweight authoring source; not canonical saved project state.
- **Executable Name** — compiled semantic + spatial representation used to create Clean/Annotated/handoff assets.
- **Clean** — generation-facing spatial contract with no authoring annotations.
- **Annotated** — human-review view over the same geometry.

Do not introduce “Scene Template” as another product feature name.

## Scope boundary

The established Web generation/review export remains **selected-page scoped**. Separately, the Blueprint Engine can compile multi-page Name source into canonical project state and per-page headless assets. Do not use one capability to imply the other.
