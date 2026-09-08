# Manga Blueprint Studio

Visual manga storyboard editor for designing manuscript size, reading direction, panel layout, reusable character identity, story action, character poses, camera direction, backgrounds, dialogue/SFX, lettering direction, and manga-specific effects, then handing that direction to image-generation assistants with minimal ambiguity.

**The human remains the director.** AI, Smart Manga, and templates propose; the user chooses and edits.

## Prototype 0.10

Current prototype supports:

- manuscript presets: `800×1130 Portrait` (default), 1:1, 4:5, 3:4, 9:16, 16:9, B5, A4, Webtoon, custom;
- RTL Japanese reading by default plus LTR;
- **panel numbering automatically synchronized from current geometry + selected RTL/LTR direction**, shared by canvas numbers, Panel Peek/List, prompt, and export semantics;
- **Scene Template thumbnail numbers and applied story beats use that same RTL/LTR order** — beat 1 goes into panel 1, beat 2 into panel 2, and so on;
- 1–6 panel layouts, action/conversation/climax patterns, 4-koma 1×4 / 2×2 / 4×1;
- visual layout thumbnails;
- **Scene Template Studio** with category filters, search, card-style visual previews, use-case descriptions, panel count, and beat flow;
- shipped scene templates across daily, romance, battle, emotion, comedy, suspense, and character-introduction categories;
- romance templates including confession, before-kiss, after-kiss, holding hands, and misunderstanding;
- battle templates including opening standoff, decisive blow, counterattack, aerial attack, throw technique, and awakening/reversal;
- additional crying, anger, resolve, presence-behind, classroom-talk, smug-failure, and character-introduction templates;
- optional editable sample dialogue/SFX in Story Templates;
- bounded template derivation that preserves story flow while varying some camera/emphasis choices;
- local custom templates saved from the current page; character-specific appearance is not stored, while layout/action/camera/pose/expression/background/dialogue/SFX can be reused and scaled to the current canvas;
- per-panel `actionIntent` (“what actually happens in this panel?”) stored in `.manga.json` and forwarded as semantic guidance;
- Panel Peek by long-press or discoverable `ⓘ`, with compact opaque mobile bottom-sheet UI;
- Panel List / Shot List in detailed or compact mode, plus authoring-only Panel Chips on the editor canvas;
- Camera consistency check, Crop Guide, and explicit “fit character size to camera” action;
- advisory Manga Check;
- Smart Manga with three non-mutating candidates, reproducible seed, balanced/dynamic/emotion variants, and stable/standard/bold intensity;
- reusable base characters with Character Sheet / text description / no-sheet AI-designed appearance modes;
- anatomy-readable colored stick figures in editor/review and monochrome clean-AI figures;
- beginner camera vocabulary plus a simple camera diagram;
- guided free-text backgrounds plus editable scene presets;
- balloon presets for speech/thought/shout/whisper/narration/off-screen layouts;
- **vertical Japanese writing (`vertical-rl`) as the project default**;
- **horizontal writing (`horizontal-tb`) selectable as project default or per balloon**;
- **onomatopoeia/SFX writing direction selectable per panel** with `inherit / vertical-rl / horizontal-tb`;
- editor/review balloon lettering preview while clean AI PNG still excludes balloon/SFX text;
- prompt `LETTERING DIRECTION` and `SFX LETTERING DIRECTION` guidance kept separate from `TEXT TO RENDER`;
- borderless/bleed/breakout, expression/gaze, effects and onomatopoeia;
- AI-safe clean PNG, annotated review PNG, deterministic prompt, `.manga.json` export/import;
- prompt identity contract is mode-aware: Character Sheets are used only when `CHARACTER IDENTITY GUIDANCE` requires them;
- AI generation ZIP containing clean PNG + `.manga.json` + prompt + manifest, with annotated PNG excluded;
- Review / archive ZIP adding annotated PNG under the same export identity;
- manifest v3 as the read-first handoff authority, including derived balloon/SFX lettering metadata;
- one-click AI handoff message copy (“extract ZIP and read manifest first”);
- coordinated filenames `<title>_YYYYMMDD_HHMMSS_<short-sha256>_*` and export UUID/full state hash;
- browser-local autosave, Undo/Redo, Japanese-first mobile UI with English translation.

## Recommended workflow

1. Choose canvas size and RTL/LTR panel reading direction.
2. Start with Scene Template Studio, Smart Manga, or a visual layout.
3. Filter by scene category or search for an intent such as “告白”, “キス”, “反撃”, or “泣く”. Template preview numbers already reflect the selected reading direction.
4. Apply a Scene Template if desired; its beat 1/2/3… is placed into panel 1/2/3… in that same reading order.
5. Create/select a reusable base character and choose its appearance source.
6. Read the page through Panel Chips / Panel List; long-press or tap `ⓘ` when a panel needs inspection.
7. Refine action intent, pose, expression, gaze, camera, background, dialogue/SFX, and effects only where needed.
8. In the Text tab, keep the default **縦書き** or switch the project / selected balloon to **横書き**. In Effects, override SFX writing direction only where needed.
9. Resolve useful Manga Check / camera-framing warnings when they match your intent.
10. Optionally save the finished page pattern as a local custom template for reuse.
11. Download **AI generation ZIP**.
12. Press **AIへ渡す文をコピー** and send the short message with the ZIP.
13. Attach Character Sheets separately only for characters the manifest marks as requiring them.

## Reading direction vs writing direction

These are deliberately separate settings.

```text
Panel reading direction
  rtl -> Japanese manga: right to left
  ltr -> left to right

Project writing direction
  vertical-rl   -> vertical Japanese (default)
  horizontal-tb -> horizontal

Balloon / SFX override
  inherit       -> project default
  vertical-rl   -> vertical Japanese
  horizontal-tb -> horizontal
```

Changing writing direction never changes panel numbering. Scene Template preview numbers and applied beats follow panel reading direction, not writing direction.

## Scene Template Studio vs Smart Manga

**Scene Template Studio** is a recognizable editable rough name with concrete story beats and optional sample text. It includes category/search discovery, visual cards, descriptions/use cases, bounded derivation, and local custom-template reuse. Prototype 0.10 guarantees that template preview number `N`, page panel order `N`, and applied template beat `N` refer to the same reading-position panel.

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

A short handoff message is enough:

```text
このZIPを展開して、最初に中の *_manifest.json を読んで、その内容に従って漫画を生成してください。
Character Sheet が必要と書かれているキャラクターは、別途添付した Character Sheet 画像を対応付けて使ってください。
```

## AI-safe export

Clean AI PNG removes authoring text such as character names, panel numbers, camera metadata, Panel Chips, Crop Guide, summaries, balloon text, and SFX labels. Exact dialogue/onomatopoeia are passed only under `TEXT TO RENDER`; balloon/SFX writing direction is passed separately as semantic layout guidance.

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

Current project format remains `manga-blueprint/0.2`; Prototype 0.10 adds optional `meta.defaultWritingMode`, balloon `writingMode`, and `effects.sfxWritingMode` without a format bump. Manifest remains `manga-blueprint-export-manifest/3`.

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
