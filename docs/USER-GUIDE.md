# Manga Blueprint Studio — User Guide

This guide describes the current shipped UI. It is intentionally organized around the manga-production flow rather than internal implementation names.

Public version: https://c-a-p-engineer.github.io/manga-blueprint-studio/guide.html

Editor: https://c-a-p-engineer.github.io/manga-blueprint-studio/

## The basic idea

Think of the editor as this hierarchy:

```text
作品
  → 必要なら 巻 / 章 / フォルダ
    → P001, P002, ...
      → ページ設定 / コマ割り
        → 各コマの人物・背景・文字・演出
          → AI生成ZIP
```

Volumes, chapters, and folders are optional. A simple one-shot manga can be only:

```text
作品
├─ P001
├─ P002
└─ P003
```

## First five minutes

1. Open or create a **作品**.
2. Choose the page from the row above the canvas. Pages are shown as `P001`, `P002`, ... .
3. Open **ページ設定** and choose manuscript size, reading direction, layout/Story Template/Smart Manga as needed.
4. Tap a panel on the canvas and refine the panel, characters, background, dialogue, and effects using the lower tabs.
5. Open **出力** and download the **AI生成ZIP** for the current page. Copy the short handoff message and send both to the image-generation assistant.

## Screen layout

### 1. Application header

The top application header is for app-wide operations:

- **使い方** — quick help; from there the full guide can be opened.
- **元に戻す / やり直す** — Undo/Redo.
- **日本語 / English** — UI language.

The current work name is deliberately not mixed into these application actions.

### 2. Work / page context above the canvas

Below the app header, the current manga context is shown.

- the work title appears on its own line;
- tapping the title opens **作品一覧**;
- the breadcrumb shows the current location, for example `第1巻 › 第3章 › P001`;
- `‹` / `›` switch pages;
- `＋` adds a page;
- **作品構成** opens the explorer-style work tree;
- the horizontal page strip lets you jump directly to another page.

### 3. Work Structure / 作品構成

**作品構成** is the primary navigation for manga hierarchy.

Example:

```text
ロボ漫画
├─ 第1巻
│  ├─ 第1章
│  │  ├─ P001
│  │  └─ P002
│  └─ P003
└─ P004
```

Tap a page to open it.

Detailed page operations and volume/chapter/folder editing are available as advanced sections in the same screen. The hierarchy is optional; do not create volumes or folders unless they help organize the work.

### 4. Manga canvas

The center of the editor is the current manga page.

Tap a panel, character, or balloon to select it. Authoring-only labels and guides may be visible in the editor, but the clean AI PNG removes authoring metadata.

### 5. Editing tabs

The lower tabs edit the current page/panel rather than changing which work you are in.

#### ページ設定

Use for page-wide configuration:

- manuscript/canvas size;
- panel reading direction;
- page-wide art direction;
- panel layout;
- Story Template / Smart Manga starting patterns;
- page-level overview/checks.

**ページ設定 is not the primary page navigator.** Page selection lives above the canvas and in 作品構成.

#### コマ

Use for the selected panel:

- story role / action intent;
- camera distance and angle;
- viewpoint;
- focal/composition notes;
- frame style, bleed, breakout;
- support/motion/depth semantics where available.

#### キャラ

Use for reusable characters and placed character instances.

A reusable base character can use one of three appearance modes:

- **Character Sheet** — attach the external sheet when generation requires it;
- **文章で指定** — describe the appearance in text; no sheet required;
- **AIにおまかせ** — no sheet required; the downstream model may choose a simple consistent design.

The stick figure is a **pose and placement reference**, not the character's finished appearance.

#### 背景

Use for location, time, weather, mood, detail amount, background treatment, and notes.

#### 文字

Use for balloons/dialogue and writing direction.

Panel reading direction and text writing direction are different settings. Japanese manga can read right-to-left while balloon text is vertical Japanese.

#### 演出

Use for line effects, impact/focus/speed/tension treatment, SFX/onomatopoeia, and related manga effects.

#### 出力

Use for AI handoff and review packages.

Current export is **the selected page only**.

## Page names and P001

`P001`, `P002`, ... are display codes for humans and file sorting. The actual project stores a numeric `pageNumber`.

Examples:

```text
pageNumber 1   → P001
pageNumber 8   → P008
pageNumber 42  → P042
pageNumber 123 → P123
```

A page title is optional. When present, the UI can show both, for example:

```text
P001  表紙
P002  登場
P003  対峙
```

The page code remains the stable visible locator even when the title is blank.

## Works, volumes, chapters, and folders

### Work / 作品

A work is one manga project. Multiple works are stored locally in the browser's IndexedDB.

Work operations include create, open, rename, duplicate, and delete.

### Volume / 巻

Use when a work is long enough that volume-level grouping is useful.

### Chapter / 章

Use for story chapters or episodes.

### Folder / フォルダ

Use for organizational grouping that is not semantically a volume or chapter.

These three are all optional containers. A page can also remain directly under the work.

Deleting a non-empty container does not silently delete its pages. Direct pages and direct child containers are moved to the deleted container's parent.

## Story Template vs Smart Manga

### Story Template

**ストーリーテンプレート / Story Template** is the single canonical template feature name.

Use it when you want a recognizable beat pattern such as confession, reaction, battle opening, counterattack, gag failure, or character introduction. Templates may seed geometry, beat/action, camera, pose/expression/gaze, background, effects, and optional sample dialogue/SFX.

Browsing/searching does not change the page. The page changes only when you explicitly apply a template.

### Smart Manga

Smart Manga proposes a small set of bounded alternatives from your purpose, panel count, seed, emphasis, and intensity.

It also does not change the page until you explicitly apply a candidate.

Use Story Templates when you want a recognizable story pattern; use Smart Manga when you want bounded alternatives from a purpose.

## Reading direction and writing direction

### Page/panel reading direction

- `rtl` — Japanese manga: right to left.
- `ltr` — left to right.

This controls panel numbering and reading order.

### Text writing direction

- `vertical-rl` — vertical Japanese; default.
- `horizontal-tb` — horizontal.

Balloon and SFX settings may inherit the project default or override it.

Changing writing direction never changes panel reading order.

## Camera terms in Japanese UI

The editor keeps professional terms where they help interoperability, but Japanese remains the primary explanation.

Examples:

- **Extreme close / 超寄り** — eyes, mouth, hand, fist, etc. fill the frame.
- **Long / 引き** — full body and surroundings are readable.
- **Low angle / あおり** — look upward to emphasize power/impact.
- **High angle / ふかん** — look downward to show vulnerability or spatial overview.

The semantic value may remain English internally even when the UI is Japanese.

## Art direction

Page settings include global art direction such as:

- color / monochrome;
- anime / manga / pencil / ink / watercolor / webtoon / realistic-like rendering;
- line style;
- shading;
- detail amount;
- background finish;
- palette/tone notes;
- **追加の画風・仕上げ指示（任意）**.

Example note:

```text
線を細めに。淡い色合い。影は控えめ。見せ場だけ描き込みを増やす。
```

Art direction controls how the work is drawn. It does not replace character identity or panel geometry.

## Panel Peek / Panel List / Manga Check

### Panel Peek

Long-press a panel or use the visible `ⓘ` to inspect a compact semantic summary. It can show action, characters, camera, background, dialogue/effects, and framing warnings.

### Panel List / Shot List

Use the page overview to scan panel intent without opening every field.

### Manga Check

Manga Check is advisory. It can warn about missing action intent, repeated camera, missing backgrounds, repeated expression, or camera/figure-scale mismatch. It does not block export or automatically rewrite your page.

## AI handoff

### AI generation ZIP

Use this for image generation.

It contains:

```text
<prefix>_clean.png
<prefix>.manga.json
<prefix>_prompt.txt
<prefix>_manifest.json
```

The manifest is the read-first authority. The package intentionally excludes the annotated review PNG.

Typical handoff message:

```text
このZIPを展開して、最初に中の *_manifest.json を読んで、その内容に従って漫画を生成してください。
Character Sheet が必要と書かれているキャラクターは、別途添付した Character Sheet 画像を対応付けて使ってください。
```

If no Character Sheet is required, do not attach one merely because the product supports them.

### Review/archive ZIP

Use this for checking/storage. It contains the same state-linked materials plus annotated PNG.

The annotated PNG contains authoring information and is not the default generation input.

## What each handoff file controls

- **Clean PNG** — panel geometry, proportions, approximate placement/scale, pose direction.
- **`.manga.json` + prompt** — story action, pose meaning, camera, depth, background, continuity, lettering semantics.
- **Character guidance / required Character Sheets** — character appearance identity.
- **Art direction** — rendering language.
- **TEXT TO RENDER** — exact visible dialogue/SFX strings.

Authoring labels such as character names, panel numbers, camera labels, and action notes are not renderable manga text.

## Local storage behavior

Project works are stored locally in browser IndexedDB. Ordinary save does not silently switch the active work.

The active page is remembered separately for each work.

Old prototype project autosave stored in historical `localStorage` is intentionally not migrated. Portable `.manga.json` import is the compatibility path.

Custom Story Templates currently remain a separate browser-local library.

## Current limitations / not shipped yet

The editor already supports multiple works and multiple pages, but the following are roadmap work rather than current behavior:

- full work backup/restore ZIP;
- selected-page-range / volume / whole-work generation export;
- panel-first generation packages and deterministic page recomposition;
- generalized cross-page reference assets for locations/props/outfits/etc.;
- expanded spatial continuity, perspective, eye-flow, gutter, spread, and deterministic final typesetting.

Do not assume these are available merely because the data model can already represent multiple pages.

## Troubleshooting

### I cannot find another page

Use the page strip above the canvas or open **作品構成**.

### I do not understand `P001`

It is simply the visible page code for page number 1. Page titles are optional.

### I do not need volumes or chapters

Do not create them. Put pages directly under the work.

### The generated image copied labels from the editor

Use the **AI generation ZIP / clean PNG**, not the annotated review PNG. The clean package is designed to remove authoring labels and carries semantic instructions separately.

### The character should not require a Character Sheet

Set the reusable character identity mode to text description or AI-designed/free instead of sheet mode.

### Camera wording is still partly English

Professional camera terms may remain beside Japanese labels for interoperability, but the Japanese explanation should state the intended effect. If a primary Japanese UI surface shows unexplained English-only authoring text, treat that as a UI bug.

## Documentation / technical links

- Documentation map: [`README.md`](README.md)
- Product contract: [`PRODUCT.md`](PRODUCT.md)
- Architecture: [`ARCHITECTURE.md`](ARCHITECTURE.md)
- AI handoff contract: [`PROMPT_HANDOFF.md`](PROMPT_HANDOFF.md)
- Roadmap: [`ROADMAP.md`](ROADMAP.md)
- Schema: [`../schema/manga-blueprint.schema.json`](../schema/manga-blueprint.schema.json)
