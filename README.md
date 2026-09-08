# Manga Blueprint Studio

Visual manga storyboard editor for designing panels, character poses, camera direction, backgrounds, dialogue, and manga-specific effects, then handing that direction to image-generation assistants with minimal ambiguity.

**The human remains the director.** The tool does not autonomously decide composition.

## Prototype 0.3

Current prototype supports:

- Japanese right-to-left manga page templates;
- panel splitting and semantic panel order;
- camera distance / angle / viewpoint with inline explanations;
- named stick-figure characters and pose presets;
- character placement, scale, rotation, expression, and gaze intent;
- background location / time / weather / mood / detail treatment;
- panel border styles, bleed (断ち切り), and breakout (ブチ抜き) semantics;
- speech / thought / shout / narration balloons with exact text stored semantically;
- manga effects such as speed lines, focus lines, impact lines, silence/beat, and onomatopoeia;
- deterministic provider-neutral prompt compilation;
- legacy `manga-blueprint/0.1` import with migration to `0.2`;
- browser-local autosave and Undo / Redo;
- Japanese-first mobile UI with English UI translation;
- two PNG export modes:
  - **AI clean PNG** — no character names, panel numbers, camera labels, or other authoring text;
  - **annotated review PNG** — keeps authoring labels for human review;
- `.manga.json` export/import.

## Why the clean AI export exists

A multimodal image model may interpret text visible in the blueprint as requested final artwork. For that reason, the AI handoff PNG deliberately removes:

- character display names;
- Character IDs and sheet keys;
- panel numbers;
- camera metadata;
- editor/UI labels;
- balloon text and SFX text.

Exact dialogue and onomatopoeia are passed in the generated prompt under `TEXT TO RENDER`. The prompt explicitly forbids rendering any other metadata.

## Try it

GitHub Pages:

https://c-a-p-engineer.github.io/manga-blueprint-studio/

## Local use

No package installation or build is required.

```bash
python3 -m http.server 4173
```

Open:

```text
http://localhost:4173/web/
```

## Data contract

The visual image communicates **space**.  
`.manga.json` communicates **meaning**.  
Character Sheets communicate **identity**.

Current export format:

```text
manga-blueprint/0.2
```

Canonical schema:

https://c-a-p-engineer.github.io/manga-blueprint-studio/schema/manga-blueprint.schema.json

## Documents

- [`AGENTS.md`](AGENTS.md) — repository rules and invariants
- [`docs/PRODUCT.md`](docs/PRODUCT.md) — behavior contract
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — architecture and data flow
- [`docs/PROMPT_HANDOFF.md`](docs/PROMPT_HANDOFF.md) — AI handoff contract
- [`docs/ROADMAP.md`](docs/ROADMAP.md) — development roadmap
- [`schema/manga-blueprint.schema.json`](schema/manga-blueprint.schema.json) — JSON Schema
- [`examples/directed-closeup.manga.json`](examples/directed-closeup.manga.json) — example

## License

MIT
