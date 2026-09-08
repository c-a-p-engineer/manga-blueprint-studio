# Manga Blueprint Studio

Visual manga storyboard editor for designing manuscript size, reading direction, panel layout, reusable character identity, character poses, camera direction, backgrounds, dialogue, and manga-specific effects, then handing that direction to image-generation assistants with minimal ambiguity.

**The human remains the director.** AI and bounded assistance propose/render; the user chooses.

## Prototype 0.7

Current prototype supports:

- canvas/manuscript presets: `800×1130 Portrait` (default), 1:1, 4:5, 3:4, 9:16, 16:9, B5, A4, Webtoon, custom;
- RTL Japanese reading by default plus LTR, with geometry-based renumbering;
- 1–6 panel layouts, action/conversation/climax patterns, 4-koma 1×4 / 2×2 / 4×1;
- **visual layout thumbnails** so common panel patterns can be recognized before explicit apply;
- **Smart Manga / おまかせ漫画** with three non-mutating candidates, reproducible seed, balanced/dynamic/emotion variants, and stable/standard/bold intensity;
- Smart Manga purposes: auto, action, conversation, gag, daily, climax, 4-koma, **rom-com, cute, suspense, character introduction**;
- optional base-character placement across a Smart Manga candidate;
- **🎲 selected-panel direction re-roll** preserving geometry/background/dialogue/role;
- reusable base characters with three appearance-source modes:
  - Character Sheet;
  - text appearance description;
  - no Character Sheet / appearance left to AI;
- free-text appearance guidance (`what kind of character?`, hair, eyes, outfit, features) with suggestions;
- anatomy-readable colored stick figures in editor/review and monochrome clean-AI figures;
- stronger panel summaries including pose/expression/gaze/camera/background/dialogue/effects;
- beginner camera vocabulary plus a **simple camera preview diagram**;
- formal localized Help guide;
- guided free-text backgrounds plus **scene presets**;
- **balloon presets** for speech/thought/shout/whisper/narration/off-screen layouts;
- borderless/bleed/breakout, expression/gaze, effects and onomatopoeia;
- AI-safe clean PNG, annotated review PNG, deterministic prompt, `.manga.json` export/import;
- **AI generation ZIP** containing clean PNG + `.manga.json` + prompt + manifest, with annotated PNG excluded;
- **Review / archive ZIP** adding annotated PNG under the same export identity;
- **manifest v3** as the read-first handoff authority, with file roles, Character Sheet requirements, and per-character identity guidance;
- Output-tab **character identity map / missing-sheet warning**;
- one-click **AI handoff message copy** (“extract ZIP, read manifest first”);
- coordinated filenames `<title>_YYYYMMDD_HHMMSS_<short-sha256>_*` and export UUID/full state hash;
- browser-local autosave, Undo/Redo, Japanese-first mobile UI with English translation.

## Recommended workflow

1. Start with Smart Manga or a visual layout template.
2. Create/select a base character and choose its appearance source.
3. Place it into panels; refine only the panels that need work.
4. Use background/balloon presets as quick starts, then edit freely.
5. Download **AI generation ZIP**.
6. Press **AIへ渡す文をコピー** and send the short message with the ZIP.
7. Attach Character Sheets separately only for characters the manifest marks as requiring them.

## Character Sheet is optional

A reusable base character can use:

```text
sheet        -> attach a Character Sheet separately
description  -> no sheet; use text appearance guidance
free         -> no sheet; let the image model choose a consistent appearance
```

This means a quick character can be described directly in Manga Blueprint Studio without preparing a full Character Sheet first.

## Manifest-first handoff

The AI generation ZIP contains:

```text
<prefix>_clean.png
<prefix>.manga.json
<prefix>_prompt.txt
<prefix>_manifest.json
```

The manifest uses `manga-blueprint-export-manifest/3` and identifies file roles, the clean visual reference, semantic JSON, prompt, and character identity requirements.

A short handoff message is enough:

```text
このZIPを展開して、最初に中の *_manifest.json を読んで、その内容に従って漫画を生成してください。
Character Sheet が必要と書かれているキャラクターは、別途添付した Character Sheet 画像を対応付けて使ってください。
```

If no sheet is required, the UI provides the corresponding no-sheet wording instead.

## Export identity

Files exported from one unchanged editor state share:

```text
<project-title>_YYYYMMDD_HHMMSS_<short-sha256>
```

Package names:

```text
<prefix>_ai.zip
<prefix>_review.zip
```

The project-state SHA-256 and export UUID link matching files. The state hash is not a PNG byte checksum.

## AI-safe export

Clean AI PNG removes authoring text such as character names, panel numbers, camera metadata, summaries, balloon text, and SFX labels. It keeps pose figures monochrome. Exact dialogue/onomatopoeia are passed only under `TEXT TO RENDER`.

For direct image generation use `_ai.zip`; it intentionally excludes annotated PNG.

## Try it

https://c-a-p-engineer.github.io/manga-blueprint-studio/

## Local use

No package installation or build is required.

```bash
python3 -m http.server 4173
```

Open `http://localhost:4173/web/`.

## Data contract

Visual image communicates **space**. `.manga.json` communicates **meaning**. Character Sheets or text appearance guidance communicate **identity**.

Current project format remains `manga-blueprint/0.2`; prototype 0.7 adds optional identity/appearance fields and `randomIntensity` without breaking older 0.2 files.

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
