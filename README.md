# Manga Blueprint Studio

Visual manga storyboard editor for designing manuscript size, reading direction, panel layout, reusable character identity, story action, character poses, camera direction, backgrounds, dialogue/SFX, and manga-specific effects, then handing that direction to image-generation assistants with minimal ambiguity.

**The human remains the director.** AI, Smart Manga, and templates propose; the user chooses and edits.

## Prototype 0.8

Current prototype supports:

- manuscript presets: `800×1130 Portrait` (default), 1:1, 4:5, 3:4, 9:16, 16:9, B5, A4, Webtoon, custom;
- RTL Japanese reading by default plus LTR, with geometry-based renumbering;
- 1–6 panel layouts, action/conversation/climax patterns, 4-koma 1×4 / 2×2 / 4×1;
- visual layout thumbnails;
- **Story Templates** that seed layout + panel role + action intent + camera + pose/expression/gaze + background and optionally editable sample dialogue/SFX;
- shipped Story Templates: cute daily, rom-com blush, surprise, gag, action impact;
- **per-panel `actionIntent`** (“what actually happens in this panel?”) stored in `.manga.json` and forwarded as semantic guidance;
- **Panel Peek** by long-press or discoverable `ⓘ`, with quick action/character/camera/background/dialogue/effect summary;
- **Panel List / Shot List** in detailed or compact mode, plus authoring-only Panel Chips on the editor canvas;
- **Camera consistency check** that detects likely conflicts between semantic camera distance and stick-figure scale;
- authoring-only **Crop Guide** and an explicit “fit character size to camera” action;
- advisory **Manga Check** for missing action intent, repeated camera/expression, unspecified backgrounds, and framing conflicts;
- Smart Manga with three non-mutating candidates, reproducible seed, balanced/dynamic/emotion variants, and stable/standard/bold intensity;
- Smart Manga purposes: auto, action, conversation, gag, daily, climax, 4-koma, rom-com, cute, suspense, character introduction;
- selected-panel direction re-roll preserving geometry/background/dialogue/role;
- reusable base characters with Character Sheet / text description / no-sheet AI-designed appearance modes;
- free-text appearance guidance (`what kind of character?`, hair, eyes, outfit, features) with suggestions;
- anatomy-readable colored stick figures in editor/review and monochrome clean-AI figures;
- beginner camera vocabulary plus a simple camera diagram;
- formal localized Help guide;
- guided free-text backgrounds plus editable scene presets;
- balloon presets for speech/thought/shout/whisper/narration/off-screen layouts;
- borderless/bleed/breakout, expression/gaze, effects and onomatopoeia;
- AI-safe clean PNG, annotated review PNG, deterministic prompt, `.manga.json` export/import;
- **prompt identity contract is mode-aware**: Character Sheets are used only when `CHARACTER IDENTITY GUIDANCE` requires them;
- AI generation ZIP containing clean PNG + `.manga.json` + prompt + manifest, with annotated PNG excluded;
- Review / archive ZIP adding annotated PNG under the same export identity;
- manifest v3 as the read-first handoff authority, including file roles, Character Sheet requirements, story-template provenance, and panel intent index;
- one-click AI handoff message copy (“extract ZIP, read manifest first”);
- coordinated filenames `<title>_YYYYMMDD_HHMMSS_<short-sha256>_*` and export UUID/full state hash;
- browser-local autosave, Undo/Redo, Japanese-first mobile UI with English translation.

## Recommended workflow

1. Start with **Story Template**, Smart Manga, or a visual layout template.
2. Create/select a reusable base character and choose its appearance source.
3. Read the page through Panel Chips / Panel List; long-press or tap `ⓘ` when a panel needs inspection.
4. Fill/refine `actionIntent`, pose, expression, gaze, camera, background, dialogue/SFX, and effects only where needed.
5. Resolve useful Manga Check / camera-framing warnings when they match your intent.
6. Download **AI generation ZIP**.
7. Press **AIへ渡す文をコピー** and send the short message with the ZIP.
8. Attach Character Sheets separately only for characters the manifest marks as requiring them.

## Story Template vs Smart Manga

**Story Template** is a recognizable editable rough name with concrete beats and optional sample text. Use it when you want a quick starting manga such as “cute daily 4-panel” or “action impact 3-panel”.

**Smart Manga** creates three bounded alternatives from purpose / panel count / seed / intensity and does not mutate the page until you choose one.

Both are starting proposals, never continuing authorities after you edit the page.

## Panel Peek / Panel List

A panel should be understandable without opening every editing tab.

- tap a panel to select it;
- long-press the panel, or tap its `ⓘ`, to open Panel Peek;
- Panel Peek shows action, characters, camera, background, dialogue, effects, and framing status;
- Page tab can switch between detailed and one-line Panel List views;
- small Panel Chips are editor-only labels and are never exported to clean AI PNG.

## Character Sheet is optional

A reusable base character can use:

```text
sheet        -> attach a Character Sheet separately
description  -> no sheet; use text appearance guidance
free         -> no sheet; let the image model choose a consistent appearance
```

The generation prompt follows `CHARACTER IDENTITY GUIDANCE`. It does **not** claim that all character identity must come from Character Sheets.

## Manifest-first handoff

The AI generation ZIP contains:

```text
<prefix>_clean.png
<prefix>.manga.json
<prefix>_prompt.txt
<prefix>_manifest.json
```

Manifest v3 identifies file roles, clean visual reference, semantic JSON, prompt, character identity requirements, selected Story Template provenance (if any), and a panel intent index.

A short handoff message is enough:

```text
このZIPを展開して、最初に中の *_manifest.json を読んで、その内容に従って漫画を生成してください。
Character Sheet が必要と書かれているキャラクターは、別途添付した Character Sheet 画像を対応付けて使ってください。
```

## AI-safe export

Clean AI PNG removes authoring text such as character names, panel numbers, camera metadata, Panel Chips, Crop Guide, summaries, balloon text, and SFX labels. Exact dialogue/onomatopoeia are passed only under `TEXT TO RENDER`.

`actionIntent` is semantic direction and must never be treated as visible manga text.

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

Current project format remains `manga-blueprint/0.2`; Prototype 0.8 adds optional `meta.storyTemplate` and per-panel `actionIntent` while preserving older 0.2 compatibility.

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
