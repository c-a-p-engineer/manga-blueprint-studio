# Manga Blueprint Studio

Visual manga storyboard editor for designing manuscript size, reading direction, panel layout, reusable character identity, story action, character poses, camera direction, backgrounds, dialogue/SFX, lettering direction, and manga-specific effects, then handing that direction to image-generation assistants with minimal ambiguity.

**The human remains the director.** AI, Smart Manga, and templates propose; the user chooses and edits.

## Current prototype: 0.12.9

The current implementation baseline is **Prototype 0.12.9**. Project format remains `manga-blueprint/0.2`; export manifest remains `manga-blueprint-export-manifest/3`.

Current prototype supports:

- manuscript presets from portrait/social/video sizes through B5/A4/Webtoon/custom;
- Japanese RTL reading by default plus LTR;
- geometry-based panel-number synchronization shared by canvas, Panel Peek/List, Scene Templates, prompt, manifest, and export;
- vertical Japanese writing (`vertical-rl`) by default with project/per-balloon/per-SFX overrides;
- 1–6 panel layouts, action/conversation/climax patterns, 4-koma variants, bleed/breakout/effects;
- Scene Template Studio with category/search, visual cards, beat-flow preview, bounded derivation, custom local templates, two-visible cast-aware templates, and per-panel cast control;
- Smart Manga with three non-mutating candidates, reproducible seed, emphasis/intensity controls, and editable application;
- reusable base characters with `sheet` / `description` / `free` identity modes;
- character appearance summaries that remain authoritative even when optional detail fields are blank;
- Panel Peek, Panel List / Shot List, Panel Chips, camera/figure-size diagnostics, Crop Guide, and non-blocking Manga Check;
- explicit action intent, support state, motion phase, near-object depth target, foreshortening, and scene continuity semantics;
- contact-aware generation contracts for interactions such as hugs;
- cross-model handoff rules that separate Clean PNG spatial authority, semantic JSON/prompt authority, character identity, art direction, and exact visible text;
- a concise **CURRENT PAGE RENDER CONTRACT** prepended to generation prompts to reduce prior-conversation and prior-image carryover;
- AI generation ZIP containing clean PNG + `.manga.json` + prompt + manifest; review ZIP additionally contains annotated PNG;
- exact text allowlisting so authoring metadata cannot become manga lettering;
- producer provenance in exported manifests so stale GitHub Pages/cache exports can be distinguished from current `master`;
- browser-local autosave, Undo/Redo, Japanese-first mobile UI, and English localization.

See [`docs/PROTOTYPE-0.12.9.md`](docs/PROTOTYPE-0.12.9.md) for the current release baseline and provenance behavior.

## Recommended workflow

1. Choose canvas size and RTL/LTR panel reading direction.
2. Start with Scene Template Studio, Smart Manga, or a visual layout.
3. Create/select reusable base characters and choose each appearance source.
4. Read the page through Panel Chips / Panel List; long-press or tap `ⓘ` for Panel Peek.
5. Refine action intent, pose, expression, gaze, support/motion, camera/depth, background, dialogue/SFX, and effects where needed.
6. Resolve useful Manga Check / framing / action-pose warnings when they match your intent.
7. Download **AI generation ZIP**.
8. Press **AIへ渡す文をコピー** and send the ZIP plus the short manifest-first instruction.
9. Attach Character Sheets separately only for characters whose manifest entry marks them required.
10. When debugging a suspicious result, inspect `manifest.producer` before assuming the current repository code generated that ZIP.

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

## Visual + semantic contract

Manga Blueprint deliberately separates responsibilities:

```text
Clean PNG
  -> panel geometry, proportions, approximate 2D placement

.manga.json + generated prompt
  -> story action, pose meaning, support/motion, camera, depth, scene continuity,
     background, lettering semantics

Character guidance / required external sheets
  -> character identity and appearance continuity

Art direction
  -> color/rendering language only

TEXT TO RENDER
  -> exact visible dialogue/SFX allowlist
```

A specific story action overrides a weaker generic pose description when they conflict. The generated current-page Render Contract also rejects unrelated story/genre/setting carryover from prior conversation turns or prior generated images.

## Character Sheet is optional

A reusable base character can use:

```text
sheet        -> attach a Character Sheet separately
description  -> no sheet; text appearance guidance is the identity contract
free         -> no sheet; let the downstream model choose a simple consistent appearance
```

The prompt never treats Character Sheets as universally required.

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

### Producer provenance

Prototype 0.12.9 adds diagnostic producer metadata to each newly generated manifest:

```json
{
  "producer": {
    "schema": "manga-blueprint-producer/1",
    "appVersion": "0.12.9",
    "gitCommit": "<deployed commit or null>",
    "buildSource": "github-pages",
    "deployedAt": "<ISO timestamp>",
    "projectFormat": "manga-blueprint/0.2",
    "manifestSchema": "manga-blueprint-export-manifest/3",
    "renderBriefSchema": "manga-blueprint-render-brief/1"
  }
}
```

GitHub Pages stamps the deployed `GITHUB_SHA` into `build-info.json`; local/offline use falls back safely with no commit. Producer metadata is diagnostic and does not participate in project-state identity hashing.

## AI-safe export

Clean AI PNG removes authoring text such as character names, panel numbers, camera metadata, Panel Chips, Crop Guide, summaries, balloon text, and SFX labels. Exact dialogue/onomatopoeia are passed only under `TEXT TO RENDER`; writing direction is passed separately as semantic layout guidance.

`actionIntent` is semantic direction and must never be treated as visible manga text.

## Scene Template Studio vs Smart Manga

**Scene Template Studio** provides recognizable editable scene recipes with explicit beat/action flow, optional sample text, cast expectations, discovery metadata, and bounded variation.

**Smart Manga** proposes three bounded alternatives from purpose / panel count / seed / emphasis / intensity and does not mutate the page until one is applied.

Both are starting proposals. After apply, ordinary project state is authoritative.

## Local use

No package installation or build is required.

```bash
python3 -m http.server 4173
```

Open `http://localhost:4173/web/`.

`web/build-info.json` is the local/repository provenance fallback. The GitHub Pages workflow replaces the deployed copy with the exact deployment commit and timestamp.

## Try it

https://c-a-p-engineer.github.io/manga-blueprint-studio/

## Data contract

Current application baseline: **Prototype 0.12.9**.

- project format: `manga-blueprint/0.2`;
- manifest: `manga-blueprint-export-manifest/3`;
- current-page render brief: `manga-blueprint-render-brief/1`;
- producer provenance: `manga-blueprint-producer/1`;
- build metadata: `manga-blueprint-build-info/1`.

Older `Prototype 0.x` labels inside historical feature documents identify the release that introduced a capability; they are not the current runtime version.

Canonical schema: https://c-a-p-engineer.github.io/manga-blueprint-studio/schema/manga-blueprint.schema.json

## Documents

- [`AGENTS.md`](AGENTS.md)
- [`docs/PRODUCT.md`](docs/PRODUCT.md)
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)
- [`docs/PROMPT_HANDOFF.md`](docs/PROMPT_HANDOFF.md)
- [`docs/ROADMAP.md`](docs/ROADMAP.md)
- [`docs/PROTOTYPE-0.12.9.md`](docs/PROTOTYPE-0.12.9.md)
- [`schema/manga-blueprint.schema.json`](schema/manga-blueprint.schema.json)

## License

MIT
