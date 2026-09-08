# Manga Blueprint Studio

Visual manga storyboard editor for designing manuscript size, reading direction, panel layout, reusable character identity, character poses, camera direction, backgrounds, dialogue, and manga-specific effects, then handing that direction to image-generation assistants with minimal ambiguity.

**The human remains the director.** AI and random assistance propose/render; the user chooses.

## Prototype 0.6

Current prototype supports:

- **canvas/manuscript presets**: `800×1130 Portrait` (default), 1:1 square, 4:5, 3:4, 9:16, 16:9, B5, A4, Webtoon, and custom size;
- **reading direction**: Japanese right-to-left by default, with left-to-right selectable and panel renumbering;
- **layout presets**: 1 panel, 2-panel variants, 3-panel variants, action layouts, 4-koma 1×4 / 2×2 / 4×1, 5/6-panel patterns, conversation and climax patterns;
- **Smart Manga / おまかせ漫画**: choose purpose/panel count and compare three candidates before applying one;
- **reproducible Smart Manga seeds** plus balanced / dynamic / emotion-focused proposal variants;
- optional **base-character auto placement** across a chosen Smart Manga candidate;
- **🎲 selected-panel direction re-roll** that keeps geometry/background/dialogue and re-proposes camera/effects/pose/expression/gaze;
- **reusable base characters** with Character ID, display name, Character Sheet key, and default pose, placeable in multiple panels;
- **anatomy-readable stick figures**: colored head/torso/arms/legs/extremities in editor and annotated review, monochrome in clean AI export;
- **panel overview and per-panel summary** so pose, role, camera, background, dialogue count, and effects are visible at a glance;
- beginner-facing camera vocabulary such as `Extreme close / 超寄り` and `Low angle / あおり`, plus plain-language descriptions and quick camera presets;
- formal localized **使い方 / Help** guide that follows Japanese/English UI selection;
- **guided free-text backgrounds**: location/weather/mood suggestions via native datalists while arbitrary text remains allowed;
- character pose, placement, expression, gaze, balloons, borderless/bleed/breakout, effects and onomatopoeia;
- AI-safe clean PNG, annotated review PNG, deterministic prompt, and `.manga.json` export/import;
- **AI generation ZIP** containing clean PNG + `.manga.json` + prompt + manifest, with the annotated PNG deliberately excluded;
- **Review / archive ZIP** containing the same state-linked files plus annotated review PNG;
- coordinated export filenames: `<title>_YYYYMMDD_HHMMSS_<short-sha256>_*`;
- export manifest v2 with package type, UUID + full SHA-256 of serialized project state, and clean/review asset mapping;
- legacy `manga-blueprint/0.1` / older `0.2` import normalized without losing existing panel/character data;
- browser-local autosave, Undo / Redo, Japanese-first mobile UI with English translation.

## Recommended workflow

1. Start with **Smart Manga / おまかせ漫画** or a layout template.
2. Create/select a reusable base character.
3. Refine only the panels that need it — including the panel-level 🎲 direction action.
4. Download **AI generation ZIP** and attach Character Sheets separately when needed.

## Export identity

Files exported from one unchanged editor state share one prefix, for example:

```text
Untitled-Manga-Blueprint_20260908_131500_a1b2c3d4e5_clean.png
Untitled-Manga-Blueprint_20260908_131500_a1b2c3d4e5_annotated.png
Untitled-Manga-Blueprint_20260908_131500_a1b2c3d4e5.manga.json
Untitled-Manga-Blueprint_20260908_131500_a1b2c3d4e5_prompt.txt
Untitled-Manga-Blueprint_20260908_131500_a1b2c3d4e5_manifest.json
```

The short/full SHA-256 is derived from serialized Manga Blueprint state. The manifest also contains an export UUID. Matching state hashes mean the assets were produced from the same project state; they are not PNG byte checksums.

Package filenames make intent visible:

```text
<prefix>_ai.zip
<prefix>_review.zip
```

## AI-safe export

The clean AI PNG deliberately removes authoring text such as character names, panel numbers, camera metadata, panel summaries, balloon text, and SFX labels. It also keeps pose figures monochrome so anatomy-guide colors are not mistaken for character design. Exact dialogue and onomatopoeia are passed only under `TEXT TO RENDER` in the generated prompt.

For direct image generation, use **`_ai.zip`**. It does **not** include the annotated PNG, reducing the chance that visible authoring labels are copied into final artwork.

Use **`_review.zip`** for human checking and archival comparison. Its annotated PNG is explicitly review metadata, not final-art text.

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

Current export format remains `manga-blueprint/0.2`; prototype 0.6 adds optional bounded-assistance provenance (`randomSeed`, `randomVariant`, `assistSeed`) without breaking older 0.2 files.

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
