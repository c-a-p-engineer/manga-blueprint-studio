# Prototype 0.15.1 — Documentation and user-guide synchronization

Prototype 0.15.1 is a documentation/guide hardening release built on the manga-first editor shell shipped in 0.15.0.

It does not change the serialized project format or export manifest schema.

## Why this release exists

Prototype 0.15.0 changed the primary UI mental model from mixed header/page-tab management to:

```text
作品
  → 必要なら 巻 / 章 / フォルダ
    → P001
      → ページ設定 / コマ割り
        → 各コマの編集
```

Some current documents still described the older 0.14-era “Page tab owns page/hierarchy navigation” model. This release removes that drift and makes documentation maintenance part of the repository contract.

## Documentation ownership

Added `docs/README.md` as the documentation map.

It distinguishes:

- current product/architecture/handoff/user-guide documents;
- the single roadmap status authority;
- supplemental design notes;
- historical prototype release notes;
- dated research/baseline evidence.

Current roadmap status now belongs only to `docs/ROADMAP.md`; `docs/PROJECT-MULTI-PAGE-ROADMAP.md` remains a design/decision document rather than a second phase-status tracker.

## Current user guide

Added `docs/USER-GUIDE.md` covering:

- manga-first work/page hierarchy;
- Work Library and Work Structure;
- `P001` page codes;
- Page settings vs navigation;
- editing tabs;
- Story Template vs Smart Manga;
- Character Sheet optionality;
- reading direction vs text writing direction;
- art-direction fields;
- Panel Peek/List/Manga Check;
- selected-page AI generation/review handoff;
- current limitations and troubleshooting.

## Public guide screen

Added a dedicated static guide page:

```text
/guide.html
```

The in-editor quick Help remains intentionally compact and links to the full guide rather than accumulating the full manual inside one modal.

## Current contract refresh

The following current documents were aligned with shipped 0.15 behavior:

- `AGENTS.md`;
- `README.md`;
- `docs/PRODUCT.md`;
- `docs/ARCHITECTURE.md`;
- `docs/PROMPT_HANDOFF.md`;
- `docs/ROADMAP.md`;
- `docs/PROJECT-MULTI-PAGE-ROADMAP.md`;
- `web/runtime/README.md`.

Important corrected points include:

- application header is app-level;
- current work title/page context lives above the canvas;
- Work Structure is explorer-first;
- `P001` is display formatting while `pageNumber` remains numeric;
- Page settings is current-page configuration, not the primary hierarchy navigator;
- current AI export remains selected-page scoped;
- current format remains `manga-blueprint/0.2` rather than a speculative `manga-blueprint/next` hierarchy migration.

Historical release/research documents remain historical and are not rewritten to pretend older releases had current behavior.

## Documentation synchronization rule

Repository rules now map change types to required documentation updates.

Examples:

- user-visible workflow/UI → Product + User Guide + public guide + release docs as appropriate;
- data/schema → schema + Product + Architecture;
- runtime/storage ownership → Architecture + runtime README;
- prompt/manifest/package changes → Prompt Handoff + affected contracts;
- phase status/priority → Roadmap only.

## Validation

A documentation synchronization validator checks key current contracts, terminology, version alignment, the public guide, and selected-page scope boundaries.

Static validation does not replace visual/interaction review. Public guide/runtime changes still require deployed artifact/page confirmation before being reported as publicly delivered.

## Compatibility

Unchanged:

- project format: `manga-blueprint/0.2`;
- export manifest: `manga-blueprint-export-manifest/3`;
- project persistence and identity model;
- multi-page/container semantics;
- selected-page generation behavior.

No project migration is required.
