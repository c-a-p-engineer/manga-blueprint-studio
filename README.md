# Manga Blueprint Studio

**English** | [日本語](README.ja.md)

**Design how a manga page should read before asking an image model to draw it.**

Manga Blueprint Studio is a human-directed, AI-assisted manga planning system. It turns story intent into an **Executable Name** covering panel layout, emphasis, attention, reading flow, camera, pose, contact and lettering regions, then packages that structure for downstream image generation.

> **The human is the director.** AI suggestions and solver decisions remain inspectable and editable; authored intent must not be silently replaced.

## Current prototype: 0.19.0

- canonical project format: `manga-blueprint/0.2`
- established Web export manifest: `manga-blueprint-export-manifest/3`
- Web generation/review export: selected-page scoped
- Blueprint Engine: headless Name DSL → canonical project + per-page Executable Name assets

## Try it

- Product: https://c-a-p-engineer.github.io/manga-blueprint-studio/
- Web editor: https://c-a-p-engineer.github.io/manga-blueprint-studio/editor.html
- Manga techniques: https://c-a-p-engineer.github.io/manga-blueprint-studio/techniques.html
- User guide: https://c-a-p-engineer.github.io/manga-blueprint-studio/guide.html

The root GitHub Pages URL is the **public product landing page**; the editor is a separate optional visual client.

## Why a blueprint?

A single image prompt is a poor place to encode panel geometry, reading order, gaze, character relationships, contact points and exact visible text.

```text
story / name intent
  ↓
AI Name DSL
  ↓
Energy / Attention / Reading Flow
  ↓
Layout Candidate Solver
  ↓
Pose / Contact Solver
  ↓
Executable Name
  ├─ Clean SVG/PNG      → generation-facing spatial contract
  ├─ Annotated SVG/PNG  → human review
  ├─ work.manga.json    → canonical semantics
  └─ Prompt             → rendering instructions
```

Clean and Annotated are rendered from the same canonical geometry, so review annotations cannot silently change generation composition.

## Blueprint Engine

The headless engine compiles lightweight Markdown Name DSL. Authors/agents describe manga intent instead of manually entering IDs and pixel coordinates.

```md
# Page 1: Duel
@background: ruined city plaza

コマ1: Two fighters face each other
登場: fighter-a@left, fighter-b@right
カメラ: long low-angle

コマ2: Both lunge and their swords collide
登場: fighter-a@left, fighter-b@right
ポーズ: fighter-a> explosive-lunge-two-handed-sword
ポーズ: fighter-b> counter-slash-twisting-torso
接触: fighter-a.sword > fighter-b.sword
強調: strong
```

```bash
npm install
npm run blueprint -- examples/combat-1p.md blueprint-out
```

Fixed source/options deterministically produce canonical JSON, Clean/Annotated assets, per-page prompts and a read-first manifest. PNG raster output is added when a supported local rasterizer is available.

## Manga technique guide

The public [Manga Technique Guide](https://c-a-p-engineer.github.io/manga-blueprint-studio/techniques.html) explains bleed/crop, character breakout, diagonal panels, gaze guidance, hero panels, insets, pacing and page turns as **intent → technique → AI-preserved constraint**.

## Web editor

The optional Web client supports multiple local works/pages, Japanese RTL reading order, rectangle and **convex-quadrilateral** panel geometry, inset panels, characters, camera/action intent, balloons, SFX/effects, Story Templates and bounded Smart Manga proposals. Project data is stored locally in IndexedDB.

The established Web AI export remains selected-page scoped; the Blueprint Engine can independently compile multi-page Name source into per-page assets.

For the complete current Web workflow see [`docs/USER-GUIDE.md`](docs/USER-GUIDE.md).

## Technology

- JavaScript ES Modules / Node.js — compiler, solvers, renderer and CLI
- TypeScript + Vite — Web client/build
- SVG — shared Clean/Annotated spatial representation
- JSON Schema — canonical `manga-blueprint/0.2`
- IndexedDB — local Web project persistence

Python is not required by the core pipeline.

## For AI / coding agents

Read [`AGENTS.md`](AGENTS.md) first. For blueprint-authoring tasks, use [`.agents/skills/manga-blueprint/SKILL.md`](.agents/skills/manga-blueprint/SKILL.md). Prefer semantic Name DSL over invented coordinates and never treat Annotated output as default image-generation input.

## Documentation

- [`docs/USER-GUIDE.md`](docs/USER-GUIDE.md) — current Web workflow
- [`docs/BLUEPRINT-ENGINE.md`](docs/BLUEPRINT-ENGINE.md) — headless compiler workflow
- [`core/name-schema.md`](core/name-schema.md) — AI/human Name DSL
- [`docs/MANGA-TECHNIQUES.md`](docs/MANGA-TECHNIQUES.md) — manga direction concepts
- [`docs/PRODUCT.md`](docs/PRODUCT.md) — canonical user-visible behavior
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — runtime/state/ownership
- [`docs/PROMPT_HANDOFF.md`](docs/PROMPT_HANDOFF.md) — AI handoff authority split
- [`docs/ROADMAP.md`](docs/ROADMAP.md) — delivery/status authority
- [`schema/manga-blueprint.schema.json`](schema/manga-blueprint.schema.json) — serialized data contract

## Development

```bash
npm install
npm run typecheck
npm run build
npm run validate
```

## License

MIT
