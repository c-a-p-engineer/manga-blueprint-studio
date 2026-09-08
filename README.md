# Manga Blueprint Studio

Visual manga storyboard editor for designing manuscript size, panel layout, character poses, camera direction, backgrounds, dialogue, and manga-specific effects, then handing that direction to image-generation assistants with minimal ambiguity.

**The human remains the director.** AI is a downstream renderer/assistant.

## Prototype 0.4

Current prototype supports:

- **canvas/manuscript presets**: current 800×1130, 1:1 square, 4:5, 3:4, 9:16, 16:9, B5, A4, Webtoon, and custom size;
- **layout presets**: 1 panel, 2-panel variants, 3-panel variants, action layouts, 4-koma 1×4 / 2×2 / 4×1, 5/6-panel patterns, conversation and climax patterns;
- **Smart Random / おまかせ作成** using purpose and optional panel count rather than unconstrained random geometry;
- **panel overview and per-panel summary** so pose, role, camera, background, dialogue count, and effects are visible at a glance;
- beginner-facing camera vocabulary such as `Extreme close / 超寄り` and `Low angle / あおり`, plus plain-language descriptions and quick camera presets;
- first-run **使い方** dialog that can be reopened at any time;
- Japanese right-to-left reading order, panel splitting and renumbering;
- character pose, placement, expression, gaze, background, balloons, borderless/bleed/breakout, effects and onomatopoeia;
- AI-safe clean PNG, annotated review PNG, deterministic prompt, and `.manga.json` export/import;
- legacy `manga-blueprint/0.1` import normalized to current `0.2` semantics;
- browser-local autosave, Undo / Redo, Japanese-first mobile UI with English translation.

## AI-safe export

The clean AI PNG deliberately removes authoring text such as character names, panel numbers, camera metadata, panel summaries, balloon text, and SFX labels. Exact dialogue and onomatopoeia are passed only under `TEXT TO RENDER` in the generated prompt.

## Try it

https://c-a-p-engineer.github.io/manga-blueprint-studio/

## Local use

No package installation or build is required.

```bash
python3 -m http.server 4173
```

Open `http://localhost:4173/web/`.

## Data contract

The visual image communicates **space**. `.manga.json` communicates **meaning**. Character Sheets communicate **identity**.

Current export format remains `manga-blueprint/0.2`; prototype 0.4 adds optional `meta.canvasPreset`, `meta.layoutPreset`, and `meta.randomPurpose` without breaking existing 0.2 files.

Canonical schema: https://c-a-p-engineer.github.io/manga-blueprint-studio/schema/manga-blueprint.schema.json

## Documents

- [`AGENTS.md`](AGENTS.md)
- [`docs/PRODUCT.md`](docs/PRODUCT.md)
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)
- [`docs/PROMPT_HANDOFF.md`](docs/PROMPT_HANDOFF.md)
- [`docs/ROADMAP.md`](docs/ROADMAP.md)
- [`schema/manga-blueprint.schema.json`](schema/manga-blueprint.schema.json)

## License

MIT
