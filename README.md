# Manga Blueprint Studio

Visual manga storyboard editor for directing page layout, panel composition, characters, camera, text, effects, and AI-ready generation handoff.

**The human remains the director.** Story Templates, Smart Manga, diagnostics, and downstream image models assist; authored intent remains editable project state.

## Current prototype: 0.19.0

- project format: `manga-blueprint/0.2`
- export manifest: `manga-blueprint-export-manifest/3`
- current export scope: **selected page only**
- next product phase: **Backup / Restore** — see [`docs/ROADMAP.md`](docs/ROADMAP.md)

## Try it

- **Editor:** https://c-a-p-engineer.github.io/manga-blueprint-studio/
- **Full user guide:** https://c-a-p-engineer.github.io/manga-blueprint-studio/guide.html
- **Canonical schema:** https://c-a-p-engineer.github.io/manga-blueprint-studio/schema/manga-blueprint.schema.json

## What it does

### Organize a manga work

- multiple local works with IndexedDB persistence;
- multiple pages with stable identity, `P001`-style navigation, duplicate/reorder/renumber/title operations;
- optional legacy-compatible volume / chapter / folder hierarchy through the Work Explorer;
- per-work active-page restoration and explicit work activation.

### Design the page and panels

- manuscript/canvas presets and Japanese RTL or LTR reading order;
- standard layouts plus manga-aware diagonal, staggered, buildup, detail-to-hero, and comparison layouts;
- rectangle and **convex-quadrilateral** panel geometry with direct corner editing;
- one-level editable inset panels;
- panel camera, action intent, pose/expression/gaze, backgrounds, balloons, SFX, effects, bleed, and breakout semantics.

### Direct characters and story beats

- reusable characters with `sheet | description | free` identity modes;
- Story Template Studio with card-first discovery, presentation filters, explicit cast choice, and one apply action;
- bounded Smart Manga proposals that do not mutate the page until explicitly applied;
- six editable starter character bases for newly created works.

### Check the manga without taking control away

- Panel Peek/List/Chips;
- camera/figure diagnostics, Crop Guide, and Manga Check;
- diagnostics remain advisory rather than silently rewriting authored content.

### Hand off to image generation

The selected-page AI generation package contains a clean blueprint PNG, project JSON, prompt, and read-first manifest. Review/archive export adds the annotated PNG.

The handoff keeps these responsibilities separate:

```text
clean PNG            → spatial composition
.manga.json + prompt → story / camera / pose / background / lettering semantics
character guidance   → identity / appearance
art direction        → rendering language
TEXT TO RENDER       → exact visible text allowlist
```

Authoring labels such as character names, panel numbers, camera notes, and editor overlays are excluded from clean AI output.

## Quick start

1. Open or create a **作品 / Work**.
2. Select `P001` or another page above the canvas, or navigate through **作品エクスプローラー / Work Explorer**.
3. In **ページ設定 / Page settings**, choose manuscript settings and either a Story Template or manual panel layout.
4. Select a panel and refine its frame/shape, camera, character, background, text, and effects.
5. In **出力 / Output**, export the current page as **AI生成ZIP** or a review/archive package.
6. Attach Character Sheets only when the manifest marks them as required.

For detailed operation and terminology, use [`docs/USER-GUIDE.md`](docs/USER-GUIDE.md) or the public guide above.

## Architecture at a glance

The public app is a static GitHub Pages application built with Vite + TypeScript.

```text
web/src/          typed bootstrap, domain view, and new UI composition
web/runtime/      ordered classic-script compatibility runtime during migration
schema/           canonical serialized project schema
docs/             product, architecture, handoff, guide, and roadmap authorities
scripts/          build/contract/regression validation
```

`web/runtime/manifest.json` is the canonical ordered registry for the compatibility runtime. The ongoing TypeScript migration is incremental: external behavior and serialized contracts are preserved while semantic owners move behind typed boundaries.

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for state/runtime ownership and [`web/runtime/README.md`](web/runtime/README.md) for the compatibility layer.

## Local development

```bash
npm install
npm run dev
```

Production checks:

```bash
npm run typecheck
npm run build
npm run validate
```

GitHub Pages stamps deployed commit provenance into the published build and uses commit-aware runtime cache keys.

## Documentation map

- [`docs/README.md`](docs/README.md) — documentation ownership and current-vs-historical map.
- [`docs/PRODUCT.md`](docs/PRODUCT.md) — canonical current user-visible behavior.
- [`docs/USER-GUIDE.md`](docs/USER-GUIDE.md) — detailed current workflow.
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — runtime, state, persistence, and ownership.
- [`docs/PROMPT_HANDOFF.md`](docs/PROMPT_HANDOFF.md) — AI generation/review handoff contract.
- [`docs/ROADMAP.md`](docs/ROADMAP.md) — **only current roadmap status authority**.
- [`schema/manga-blueprint.schema.json`](schema/manga-blueprint.schema.json) — canonical serialized data contract.
- [`docs/PROTOTYPE-0.19.0.md`](docs/PROTOTYPE-0.19.0.md) — current release note.

Older prototype notes and dated research files are historical evidence, not current product authority.

## License

MIT
