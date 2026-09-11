# Manga Blueprint Studio

Visual manga storyboard editor for organizing a work into pages, designing panel/story/camera/character/background/text/effect intent, and handing a clean visual + semantic blueprint to image-generation assistants with minimal ambiguity.

**The human remains the director.** Story Templates, Smart Manga, diagnostics, and downstream image models propose or render; the user chooses and edits.

## Current prototype: 0.17.0

Prototype **0.17.0** starts the TypeScript + Vite cutover and makes the template workflow the primary Page-settings task. Story Template selection, sample dialogue/SFX choice, cast selection, and the apply CTA now live in one task-first surface; manual panel layout is secondary. The legacy volume/chapter/folder editor is removed from the primary Page UI while existing hierarchy data remains readable in Work Explorer.

Current project format remains `manga-blueprint/0.2`; export manifest remains `manga-blueprint-export-manifest/3`.

### Current workflow

```text
作品 / Work
  → 必要なら 巻 / 章 / フォルダ
    → P001, P002, ...
      → ページ設定 / コマ割り
        → コマ形状 / キャラ / 背景 / 文字 / 演出
          → 選択中ページの AI生成ZIP
```

The current release supports:

- manga-first editor shell with work title, breadcrumb, `P001` page context, direct page navigation, and Work Structure above the canvas;
- explorer-style `作品エクスプローラー / Work Explorer` for `work → optional volume/chapter/folder → page` navigation;
- local multi-work library with create/open/rename/duplicate/delete;
- multiple pages per work with add/select/duplicate/delete/reorder/renumber/title and per-work active-page restore;
- stable work/page/container identity and IndexedDB persistence;
- optional nested `volume | chapter | folder` organization with non-destructive container deletion;
- manuscript/canvas presets, Japanese RTL or LTR reading, and geometry-based panel order synchronization;
- rectangle and convex-quadrilateral panel boundaries with direct four-corner editing and irregular layout presets;
- annotated panel-number badges that follow the edited quadrilateral corner instead of the compatibility bounding box;
- vertical Japanese lettering by default with horizontal/per-balloon/per-SFX overrides;
- Story Template Studio with card-first selection, compound quick filters, explicit pre-apply character selection, a single apply surface, presentation chips, diagonal thumbnails, and bounded Smart Manga proposals;
- six editable description-mode starter characters are created for new works, while existing/imported works are not silently changed and can add the same starters explicitly;
- reusable character identity with `sheet | description | free` modes;
- action intent, pose/expression/gaze, camera/depth/support/motion semantics, backgrounds, dialogue/SFX, and manga effects;
- Panel Peek/List/Chips, camera/figure diagnostics, Crop Guide, and non-blocking Manga Check;
- selected-page AI generation ZIP and Review/archive ZIP with manifest-first handoff;
- strict visible-text allowlisting, reference-role/preservation contracts, bounded Design Direction Pass, and producer provenance;
- Japanese-first mobile UI with a two-row mobile app header and English localization;
- dedicated current user guide in Markdown and as a public web page.

Current generation/review export is **selected-page scoped**. Full backup/restore and selected-range/container/work-wide export are later roadmap phases.

## Try it

**Editor**  
https://c-a-p-engineer.github.io/manga-blueprint-studio/

**Full user guide / 詳しい使い方**  
https://c-a-p-engineer.github.io/manga-blueprint-studio/guide.html

**Canonical schema**  
https://c-a-p-engineer.github.io/manga-blueprint-studio/schema/manga-blueprint.schema.json

## Quick start

1. Open/create a **作品**.
2. Choose `P001` or another page above the canvas, or open **作品エクスプローラー** to navigate the explorer tree.
3. In **ページ設定**, choose manuscript size, reading direction, art direction, and a layout/Story Template/Smart Manga as needed. Story Template cards can be narrowed by 2人表示・恋愛などの条件と、斜めコマ・衝撃枠・集中線などの演出条件を組み合わせて探せます。カードを選んだ後は、使用するキャラクターを明示してから適用します。`斜め3コマ` and `斜め4コマ 2×2` start with irregular panel boundaries.
4. Tap a panel and refine its **コマ形状**. Choose a shape preset or enable **四隅を直接編集** and drag the blue corner handles. The annotated panel number follows the edited top-right corner. Then refine character, background, dialogue, and effects.
5. In **出力**, download the **AI生成ZIP** for the current page and copy the short manifest-first handoff message.
6. Attach Character Sheets only for characters whose manifest says they are required.

For the complete UI explanation, use [`docs/USER-GUIDE.md`](docs/USER-GUIDE.md) or the public `/guide.html` page.

## Navigation model

The application header owns app-level actions such as Help, Undo/Redo, and language. On narrow screens it uses two explicit rows: branding first, then the four app actions. Labels are kept on one line instead of wrapping inside individual buttons.

The current manga context is separate:

- current work title on its own line;
- breadcrumb for optional volume/chapter/folder ancestry;
- visible page code such as `P001`;
- previous/next/add/direct page controls;
- **作品エクスプローラー** explorer.

`P001` is display formatting only. The serialized project stores numeric `pageNumber` plus stable `Page.id`.

`ページ設定 / Page settings` owns manuscript/layout/current-page configuration. It is not the primary work/page navigator.

## Panel geometry

Rectangle-only projects remain valid. A panel may additionally store:

```json
{
  "rect": {"x": 35, "y": 35, "w": 355, "h": 350},
  "shape": {
    "kind": "quad",
    "preset": "custom",
    "points": [
      {"x": 70, "y": 35},
      {"x": 390, "y": 35},
      {"x": 355, "y": 385},
      {"x": 35, "y": 385}
    ]
  }
}
```

`shape` is authoritative for the visible boundary and clipping when present; `rect` remains its bounding-box compatibility representation. The editor accepts only usable convex quadrilaterals and prevents self-intersection/near-zero edges. Irregular panels currently disable bleed; reset the shape to **長方形** before using bleed again.

## Story Template terminology

**Story Template / ストーリーテンプレート is the single canonical template feature name.** “Scene Template” is not another product feature or alias.

Story Template Studio provides recognizable editable beat patterns. Selection is card-first; the old duplicate Story Template dropdown is hidden. Quick filters can be combined across cast/relationship/dialogue/art and presentation features such as diagonal panels, impact/borderless/inset frames, focus/speed/impact/tension/silence effects, breakout, and 演出あり / 演出なし. Cards expose presentation chips so a sample can be found without opening every template. The old middle preview is removed: after selecting a card, the apply card asks which reusable character(s) to use and the primary action applies that exact cast. Smart Manga remains a separate bounded proposal system. Both remain non-mutating until explicit apply.

## Character Sheet is optional

A reusable base character can use:

```text
sheet        → attach a Character Sheet separately
description  → no sheet; text appearance guidance is the identity contract
free         → no sheet; let the downstream model choose a simple consistent appearance
```

New works start with six editable description-mode bases: high-school boy/girl, adult man/woman, and male/female background characters. Existing/imported works are left unchanged; the Character tab can add any of these starters explicitly.

The planning stick figure communicates pose/placement rather than finished appearance.

## Reading direction vs writing direction

These are deliberately separate:

```text
Panel reading direction
  rtl → Japanese manga: right to left
  ltr → left to right

Text writing direction
  vertical-rl   → vertical Japanese (default)
  horizontal-tb → horizontal

Balloon / SFX override
  inherit       → project default
  vertical-rl
  horizontal-tb
```

Changing text writing direction never changes panel reading order.

## AI handoff

The current AI generation ZIP contains:

```text
<prefix>_clean.png
<prefix>.manga.json
<prefix>_prompt.txt
<prefix>_manifest.json
```

The manifest is read first. The clean PNG controls spatial composition, including an authored quadrilateral panel boundary when present; semantic JSON/prompt control story/camera/pose/background/lettering semantics; character guidance or required external Character Sheets control identity; art direction controls rendering language; only exact `TEXT TO RENDER` entries are permitted as visible manga text.

Before final rendering, the handoff includes a **derived Design Direction Pass**. It may decide focal emphasis, negative-space usage, local contrast, and detail-density rhythm inside the authored panels. It is guidance only and cannot change panel count/boundaries, reading order, story actions, camera intent, cast, identity, or exact text.

The Review/archive ZIP contains the same state-linked materials plus annotated PNG and is not the default generation input.

Typical handoff:

```text
このZIPを展開して、最初に中の *_manifest.json を読んで、その内容に従って漫画を生成してください。
Character Sheet が必要と書かれているキャラクターは、別途添付した Character Sheet 画像を対応付けて使ってください。
```

See [`docs/PROMPT_HANDOFF.md`](docs/PROMPT_HANDOFF.md) for the detailed contract.

## Local use

No package installation or application build is required.

```bash
python3 -m http.server 4173
```

Open:

```text
http://localhost:4173/web/
```

The app is a zero-build static runtime. `web/build-info.json` is the local/repository provenance fallback; GitHub Pages stamps the deployed commit and timestamp into the published copy. Runtime chunk URLs include the application version so a newly deployed release does not silently reuse older cached feature chunks.

## Documentation

Start with the documentation map:

- [`docs/README.md`](docs/README.md) — current vs historical docs and ownership rules.
- [`docs/USER-GUIDE.md`](docs/USER-GUIDE.md) — current user workflow and UI terminology.
- [`docs/PRODUCT.md`](docs/PRODUCT.md) — current product behavior and acceptance criteria.
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — runtime/state/storage ownership.
- [`docs/PROMPT_HANDOFF.md`](docs/PROMPT_HANDOFF.md) — AI generation/review handoff contract.
- [`docs/ROADMAP.md`](docs/ROADMAP.md) — the only current roadmap status authority.
- [`docs/PROJECT-MULTI-PAGE-ROADMAP.md`](docs/PROJECT-MULTI-PAGE-ROADMAP.md) — supplemental multi-page/portability design decisions.
- [`docs/PROTOTYPE-0.16.4.md`](docs/PROTOTYPE-0.16.4.md) — current release note.
- [`schema/manga-blueprint.schema.json`](schema/manga-blueprint.schema.json) — serialized project schema.

Older `PROTOTYPE-*`, dated research, and baseline documents are historical evidence. They should not be read as current UI authority unless a current contract explicitly points to them.

## Data contract

Current application baseline: **Prototype 0.16.4**.

- project format: `manga-blueprint/0.2`;
- export manifest: `manga-blueprint-export-manifest/3`;
- current-page render brief: `manga-blueprint-render-brief/2`;
- derived design direction: `manga-blueprint-design-direction-pass/1`;
- panel geometry: rectangle or optional convex `quad` shape;
- producer provenance: `manga-blueprint-producer/1`;
- build metadata: `manga-blueprint-build-info/1`.

## License

MIT

### Phase 1 runtime migration

The production site is now built with **Vite + TypeScript**. `web/app.js` is a thin entry shim, `web/src/main.ts` owns bootstrap/build provenance, and the existing `web/runtime/*.js` files remain a validated compatibility/reference layer during migration. Production runtime chunk cache keys include both app version and deployed commit so same-version source changes cannot silently reuse stale chunks.
