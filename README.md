# Manga Blueprint Studio

Manga Blueprint Studio is a local-first visual planner for manga pages. It organizes works and pages, designs panel geometry and scene intent, and exports a clean visual + semantic blueprint for downstream image-generation assistants.

**The human remains the director.** Story Templates, Smart Manga, diagnostics, and image models assist; the user decides what becomes part of the work.

## Current prototype: 0.19.0

Current data contracts remain:

- project: `manga-blueprint/0.2`
- export manifest: `manga-blueprint-export-manifest/3`
- render brief: `manga-blueprint-render-brief/2`

The application is built with Vite + TypeScript. A validated classic-script compatibility runtime remains during the incremental migration to clearer typed owners.

## Try it

- **Editor:** https://c-a-p-engineer.github.io/manga-blueprint-studio/
- **User guide:** https://c-a-p-engineer.github.io/manga-blueprint-studio/guide.html
- **Schema:** https://c-a-p-engineer.github.io/manga-blueprint-studio/schema/manga-blueprint.schema.json

## Core workflow

```text
作品 / Work
  → P001, P002, ...
    → テンプレート / 原稿設定 / 手動コマ割り
      → コマ / キャラ / 背景 / 文字 / 演出
        → AI生成ZIP
```

Use **作品エクスプローラー / Work Explorer** to switch works and navigate the page tree. Existing/imported works may also contain optional volume/chapter/folder hierarchy data.

## What it can do

| Area | Current capability |
|---|---|
| Works & pages | Local multi-work library, IndexedDB persistence, stable work/page identity, multi-page CRUD, Work Explorer |
| Page planning | Manuscript presets, RTL/LTR reading order, Story Template Studio, Smart Manga, optional work brief |
| Panel composition | Rectangle and **convex-quadrilateral** panels, direct four-corner editing, manga-aware diagonal/asymmetric layouts, one-level editable inset panels |
| Direction | Camera, pose, expression, gaze, action intent, background, effects, breakout, panel role |
| Characters | Reusable character identity with `sheet`, `description`, or `free` modes; six editable starter characters for new works |
| Lettering | Vertical Japanese or horizontal text, balloon/SFX overrides, exact visible-text allowlisting |
| AI handoff | Selected-page clean PNG + semantic JSON + prompt + manifest, Review/archive ZIP, reference-role and preservation contracts |
| UI | Japanese-first responsive editor, Page submodes, progressive disclosure for selected-panel settings |

Current AI generation/review export is **selected-page scoped**. Full backup/restore and broader export scopes are roadmap work, not current behavior.

## Quick start

1. Open or create a **作品**.
2. Select a page such as `P001` from the page controls or Work Explorer.
3. In **ページ設定**, choose a Story Template or configure the manuscript/layout manually.
4. Select each panel and refine characters, camera, background, dialogue, effects, and panel geometry.
5. In **出力**, export the **AI生成ZIP** for the selected page.
6. If the manifest requires Character Sheets, attach only the corresponding references to the downstream image model.

For detailed UI behavior, use [`docs/USER-GUIDE.md`](docs/USER-GUIDE.md).

## Development

```bash
npm ci
npm run dev
```

Before opening or merging a change:

```bash
npm run validate
```

`npm run validate` runs TypeScript checking, a production Vite build, runtime syntax checks, architecture/behavior regressions, and the current product-contract validators used by CI.

## Architecture at a glance

```text
web/app.js
  → web/src/main.ts
      → typed bootstrap / UI composition
      → web/src/runtime/legacy-api.ts
      → canonical runtime manifest
      → compatibility runtime owners
```

New TypeScript code uses [`web/src/domain/model.ts`](web/src/domain/model.ts) for compile-time domain vocabulary and keeps classic-global access behind [`web/src/runtime/legacy-api.ts`](web/src/runtime/legacy-api.ts). The JSON Schema remains the serialized-data authority.

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for ownership and migration rules.

## Documentation map

- [`docs/README.md`](docs/README.md) — documentation ownership and current-vs-historical rules
- [`docs/PRODUCT.md`](docs/PRODUCT.md) — canonical current product behavior
- [`docs/USER-GUIDE.md`](docs/USER-GUIDE.md) — current user workflow
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — runtime/state/storage ownership
- [`docs/PROMPT_HANDOFF.md`](docs/PROMPT_HANDOFF.md) — AI package contract
- [`docs/ROADMAP.md`](docs/ROADMAP.md) — **only status authority** for delivery phases
- [`docs/ENGINEERING-NEXT.md`](docs/ENGINEERING-NEXT.md) — implementation backlog refinement; not a competing roadmap status tracker
- [`schema/manga-blueprint.schema.json`](schema/manga-blueprint.schema.json) — canonical serialized project schema

Historical `PROTOTYPE-*`, baseline, and dated research documents are evidence, not current UI authority.

## License

MIT
