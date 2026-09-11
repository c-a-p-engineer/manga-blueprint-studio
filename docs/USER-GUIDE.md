# Manga Blueprint Studio — User Guide

This guide describes the current shipped UI. It follows the manga-production flow rather than internal implementation names.

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

Volumes, chapters, and folders are optional. A short manga can simply be:

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
4. Tap a panel and refine its panel shape, camera, characters, background, dialogue, and effects.
5. Open **出力** and download the **AI生成ZIP** for the current page.

## Screen layout

### 1. Application header

The top application header is for app-wide operations:

- **使い方** — quick help; from there the full guide can be opened.
- **元に戻す / やり直す** — Undo/Redo.
- **日本語 / English** — UI language.

On narrow mobile screens the header is deliberately **two rows**:

1. Manga Blueprint Studio + short explanation;
2. Help / Undo / Redo / language.

This prevents labels such as 「元に戻す」「やり直す」 from wrapping into awkward multi-line buttons.

The current work name is not mixed into these app-level actions. It belongs to the manga-context area below the header.

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

```text
ロボ漫画
├─ 第1巻
│  ├─ 第1章
│  │  ├─ P001
│  │  └─ P002
│  └─ P003
└─ P004
```

Tap a page to open it. Detailed page operations and volume/chapter/folder editing are available as advanced controls in the same screen.

### 4. Manga canvas

The center of the editor is the current manga page. Tap a panel, character, or balloon to select it.

Authoring-only labels and guides may be visible in the editor, but the clean AI PNG removes authoring metadata.

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
- camera distance, angle, and viewpoint;
- focal/composition notes;
- frame style, breakout, and bleed where compatible;
- **コマ形状 / Panel shape**;
- **整列補助** for freeform quadrilateral editing;
- support/motion/depth semantics where available.

#### キャラ / 背景 / 文字 / 演出 / 出力

- **キャラ** — reusable character identity and panel-specific pose/expression/gaze/placement.
- **背景** — location, time, weather, mood, detail amount, background treatment.
- **文字** — balloons/dialogue and writing direction.
- **演出** — line effects and SFX/onomatopoeia.
- **出力** — AI handoff and review packages.

Current export is **the selected page only**.

## Page names and P001

`P001`, `P002`, ... are display codes for humans and file sorting. The actual project stores numeric `pageNumber`.

```text
pageNumber 1   → P001
pageNumber 8   → P008
pageNumber 42  → P042
pageNumber 123 → P123
```

A page title is optional. The page code remains the visible locator even when the title is blank.

## Panel layouts and shaped panels

Prototype 0.16.x provides real editable irregular panel geometry.

### Irregular layout templates

In **ページ設定 → コマ割り**, the layout list includes:

- **斜め3コマ** — upper two panels + lower large panel using slanted quadrilateral frames;
- **斜め4コマ 2×2** — a 2×2 rhythm with alternating slanted frames.

These are not decorative overlays. Applying them creates actual editable panel boundaries.

### Change one panel's shape

Select a panel, open the **コマ** tab, then use **コマ形状**.

Available presets:

- 長方形;
- 斜め（左へ流す）;
- 斜め（右へ流す）;
- 台形（左を絞る）;
- 台形（右を絞る）;
- カスタム四角形.

### Edit all four corners directly

Press **四隅を直接編集**. Four blue handles appear on the selected panel. Drag each handle independently.

The editor accepts only usable convex quadrilaterals. A move is rejected when it would create a self-intersection, almost-zero area, or unusably short edge.

### Alignment assist / 吸着補正

With **吸着補正を使う** enabled, a dragged corner can snap to nearby:

- page left/right/top/bottom edges;
- page horizontal/vertical center;
- another panel's corner x/y coordinate;
- another corner of the current panel, making exact horizontal/vertical alignment easier.

When a snap is active, a blue authoring-only guide line appears. These guides never enter the clean AI PNG.

If an edge is already almost horizontal or vertical, **近い辺を水平・垂直に補正** can straighten it. Deliberately diagonal edges are left alone unless they are already within the small correction tolerance.

### Reading order with diagonal panels

Japanese manga remains RTL: visually upper/right panels come before lower/left panels. For shaped panels, the editor does **not** decide order from the single furthest top/right corner. It uses the panel's visual center plus row grouping.

That means a tiny diagonal corner that sticks upward or sideways does not by itself turn a later panel into Panel 1. The **読み順で番号振り直し** action still reflects the current page geometry and selected RTL/LTR direction.

### Frame styles: what do they mean?

The **コマ枠** section now explains the selected frame style inline.

- **通常枠** — standard solid panel border. Use this for most panels.
- **枠なし** — no visible border. Useful for atmosphere, memory, open space, or a softer transition.
- **小窓** — thinner/lighter frame intended for a small reaction, detail, or supplemental panel.
- **衝撃枠** — thick dashed authoring frame for a strongly emphasized beat such as a strike, shock, or decisive moment. It is a direction cue, not visible explanatory text.
- **断ち切り** — extend a compatible rectangular panel to the page edge. Irregular panels currently disable it.
- **ブチ抜き** — allow a character or foreground element to extend beyond the panel boundary.

Important current behavior:

- rectangle-only old projects remain compatible;
- irregular panels keep a rectangular bounding box internally for compatibility, but the four-point boundary controls the visible border, hit area, clipping, clean PNG, and AI render brief;
- irregular panels currently disable **断ち切り** rather than pretending rectangular bleed rules work on a slanted edge;
- resetting the shape to **長方形** uses the current bounding box;
- splitting an irregular panel currently creates rectangular child panels from its bounding box;
- arbitrary 5+ point polygons, curved borders, and linked neighboring-edge dragging are not shipped yet.

## Works, volumes, chapters, and folders

A **作品 / Work** is one manga project and is stored locally in IndexedDB.

Optional containers are:

- **巻 / Volume** — volume-level grouping;
- **章 / Chapter** — chapter/episode grouping;
- **フォルダ / Folder** — neutral organization.

A page can remain directly under the work. Deleting a non-empty container does not silently delete its pages.

## Story Template vs Smart Manga

### Story Template

**ストーリーテンプレート / Story Template** is the single canonical template feature name.

Use it for recognizable story/beat patterns such as confession, reaction, battle opening, counterattack, gag failure, or character introduction. Browsing/searching does not mutate the current page; only explicit apply changes it.

### Smart Manga

Smart Manga proposes a small set of bounded alternatives from purpose, panel count, seed, emphasis, and intensity. It also remains non-mutating until explicit apply.

## Character Sheet is optional

A reusable base character can use one of three appearance modes:

- **Character Sheet** — attach the external sheet when generation requires it;
- **文章で指定** — text appearance guidance; no sheet required;
- **AIにおまかせ** — downstream model chooses a simple consistent appearance.

The stick figure is a **pose and placement reference**, not the character's finished appearance.

## Reading direction and writing direction

### Page/panel reading direction

- `rtl` — Japanese manga: right to left.
- `ltr` — left to right.

This controls panel numbering and reading order. For irregular panels, a robust visual-center anchor is used so a single protruding corner does not unexpectedly reorder a page.

### Text writing direction

- `vertical-rl` — vertical Japanese; default.
- `horizontal-tb` — horizontal.

Changing writing direction never changes panel reading order.

## Camera and art direction

Professional camera terms may remain for interoperability, but Japanese UI should explain them. Examples:

- **Extreme close / 超寄り** — isolate face/eyes/hand/fist.
- **Long / 引き** — show full body and surroundings.
- **Low angle / あおり** — emphasize power/impact.
- **High angle / ふかん** — show vulnerability or spatial overview.

Art direction includes color mode, rendering style, line style, shading, detail, background finish, palette/tone, and **追加の画風・仕上げ指示（任意）**.

Art direction controls how the manga is drawn. It does not replace character identity or panel geometry.

## AI handoff

### AI generation ZIP

Use this for image generation. It contains:

```text
<prefix>_clean.png
<prefix>.manga.json
<prefix>_prompt.txt
<prefix>_manifest.json
```

The manifest is the read-first authority. The package excludes annotated review PNG.

For quadrilateral panels, both the clean PNG and render brief carry the same four-point boundary. The downstream renderer must preserve those authored boundaries exactly; the Design Direction Pass may improve emphasis **inside** them but cannot reshape them.

Typical handoff message:

```text
このZIPを展開して、最初に中の *_manifest.json を読んで、その内容に従って漫画を生成してください。
Character Sheet が必要と書かれているキャラクターは、別途添付した Character Sheet 画像を対応付けて使ってください。
```

### Review/archive ZIP

Use this for checking/storage. It contains the same state-linked materials plus annotated PNG. The annotated PNG is not the default generation input.

## Current limitations / not shipped yet

The following remain roadmap work:

- full work backup/restore ZIP;
- selected-page-range / volume / whole-work generation export;
- panel-first generation packages and deterministic page recomposition;
- arbitrary polygon/curved panels and linked shared-boundary editing;
- generalized cross-page reference assets;
- expanded spatial continuity, perspective, eye-flow, gutter, spread, and deterministic final typesetting.

## Troubleshooting

### The mobile header buttons wrap onto multiple lines

Prototype 0.16.2 reinforces the mobile header as two rows: branding first, then Help / Undo / Redo / language. The work title belongs in the separate manga-context area. If an older one-row layout remains after deployment, reload the latest page; runtime URLs are versioned to reduce stale-cache mixing.

### I cannot find another page

Use the page strip above the canvas or open **作品構成**.

### I do not need volumes or chapters

Do not create them. Put pages directly under the work.

### The generated image copied labels from the editor

Use the **AI generation ZIP / clean PNG**, not the annotated review PNG.

## Documentation / technical links

- Documentation map: [`README.md`](README.md)
- Product contract: [`PRODUCT.md`](PRODUCT.md)
- Architecture: [`ARCHITECTURE.md`](ARCHITECTURE.md)
- AI handoff contract: [`PROMPT_HANDOFF.md`](PROMPT_HANDOFF.md)
- Roadmap: [`ROADMAP.md`](ROADMAP.md)
- Schema: [`../schema/manga-blueprint.schema.json`](../schema/manga-blueprint.schema.json)