# Manga Blueprint Studio

Visual manga storyboard editor for designing panels, character poses, camera direction, and AI-ready generation blueprints.

**Manga Blueprint Studio is a direction tool, not an autonomous comic generator.** You decide the page. The tool packages that intent so a multimodal image-generation assistant can understand it with less ambiguity.

## Prototype

The first prototype supports:

- manga page templates;
- panel selection and horizontal/vertical splitting;
- automatic panel numbering for Japanese right-to-left reading;
- named stick-figure characters;
- pose presets;
- character drag, scale, and rotation;
- per-panel camera distance, angle, and focus notes;
- character-sheet reference keys;
- `.manga.json` export/import;
- visual blueprint PNG export;
- AI-ready prompt generation and copy;
- browser-local autosave.

## Try it

GitHub Pages:

https://c-a-p-engineer.github.io/manga-blueprint-studio/

The Pages deployment is handled by GitHub Actions from `web/`.

## Local use

No package installation or build is required.

```bash
git clone https://github.com/c-a-p-engineer/manga-blueprint-studio.git
cd manga-blueprint-studio
python3 -m http.server 4173
```

Open `http://localhost:4173/web/`.

## Core idea

```text
Human direction
    ↓
Page / panel layout
    ↓
Character placement + pose
    ↓
Camera intent
    ↓
┌──────────────────────────────┐
│ Manga Blueprint             │
│  visual: blueprint.png      │
│  semantic: project.manga.json│
└──────────────────────────────┘
    ↓
AI-ready prompt + character sheets
    ↓
ChatGPT / Gemini / local image workflow / future adapters
```

The visual image communicates **space**. The JSON communicates **meaning**. Character sheets communicate **identity**.

## Documents

- [`AGENTS.md`](AGENTS.md) — repository rules and invariants
- [`docs/PRODUCT.md`](docs/PRODUCT.md) — product contract and MVP acceptance
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — architecture and data flow
- [`docs/ROADMAP.md`](docs/ROADMAP.md) — planned development stages
- [`schema/manga-blueprint.schema.json`](schema/manga-blueprint.schema.json) — blueprint JSON Schema

## Current status

Early interactive prototype. The data format is intentionally marked `0.1` and may evolve before the first stable release.

## License

Not selected yet. Until a license is explicitly added, normal copyright rules apply.
