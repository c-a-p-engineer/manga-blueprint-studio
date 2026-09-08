# Manga Blueprint Studio

Visual manga storyboard editor for designing manuscript size, reading direction, panel layout, reusable character identity, story action, character poses, camera direction, backgrounds, dialogue/SFX, and manga-specific effects, then handing that direction to image-generation assistants with minimal ambiguity.

**The human remains the director.** AI, Smart Manga, and templates propose; the user chooses and edits.

## Prototype 0.9

Current prototype supports:

- manuscript presets: `800×1130 Portrait` (default), 1:1, 4:5, 3:4, 9:16, 16:9, B5, A4, Webtoon, custom;
- RTL Japanese reading by default plus LTR, with geometry-based renumbering;
- 1–6 panel layouts, action/conversation/climax patterns, 4-koma 1×4 / 2×2 / 4×1;
- visual layout thumbnails;
- **Scene Template Studio** with category filters, search, card-style visual previews, use-case descriptions, panel count, and beat flow;
- shipped scene templates across daily, romance, battle, emotion, comedy, suspense, and character-introduction categories;
- romance templates including confession, before-kiss, after-kiss, holding hands, and misunderstanding;
- battle templates including opening standoff, decisive blow, counterattack, aerial attack, throw technique, and awakening/reversal;
- additional crying, anger, resolve, presence-behind, classroom-talk, smug-failure, and character-introduction templates;
- optional editable sample dialogue/SFX in Story Templates;
- **bounded template derivation** that preserves story flow while varying some camera/emphasis choices;
- **local custom templates** saved from the current page; character-specific appearance is not stored, while layout/action/camera/pose/expression/background/dialogue/SFX can be reused and scaled to the current canvas;
- **per-panel `actionIntent`** (“what actually happens in this panel?”) stored in `.manga.json` and forwarded as semantic guidance;
- **Panel Peek** by long-press or discoverable `ⓘ`, with compact opaque mobile bottom-sheet UI;
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

1. Start with **Scene Template Studio**, Smart Manga, or a visual layout template.
2. Filter by scene category or search for an intent such as “告白”, “キス”, “反撃”, or “泣く”.
3. Read the template description / use case / beat flow before applying; optionally derive a bounded variation.
4. Create/select a reusable base character and choose its appearance source.
5. Read the page through Panel Chips / Panel List; long-press or tap `ⓘ` when a panel needs inspection.
6. Fill/refine `actionIntent`, pose, expression, gaze, camera, background, dialogue/SFX, and effects only where needed.
7. Resolve useful Manga Check / camera-framing warnings when they match your intent.
8. Optionally save the finished page pattern as a local custom template for reuse.
9. Download **AI generation ZIP**.
10. Press **AIへ渡す文をコピー** and send the short message with the ZIP.
11. Attach Character Sheets separately only for characters the manifest marks as requiring them.

## Scene Template Studio vs Smart Manga

**Scene Template Studio** is a recognizable editable rough name with concrete story beats and optional sample text. Prototype 0.9 adds category/search discovery, visual cards, descriptions/use cases, bounded derivation, and local custom-template reuse.

**Smart Manga** creates three bounded alternatives from purpose / panel count / seed / intensity and does not mutate the page until you choose one.

Both are starting proposals, never continuing authorities after you edit the page.

## Custom templates

Custom templates are stored only in the current browser via `localStorage`.

They intentionally do **not** store character-specific visual identity. They reuse normalized panel geometry plus panel role/action intent, camera, pose/expression/gaze, background, dialogue/SFX, and selected manga effects. Reapplying scales geometry to the current canvas and places the currently selected/project base character when available.

## Panel Peek / Panel List

A panel should be understandable without opening every editing tab.

- tap a panel to select it;
- long-press the panel, or tap its `ⓘ`, to open Panel Peek;
- Panel Peek shows action, characters, camera, background, dialogue, effects, and framing status;
- mobile Panel Peek uses an opaque viewport-bounded bottom sheet with fixed header/actions and a scrollable summary body;
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

Current project format remains `manga-blueprint/0.2`; Prototype 0.9 does not require a project-format bump. Shipped/custom template definitions are authoring helpers; applied results become ordinary 0.2 project state.

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
