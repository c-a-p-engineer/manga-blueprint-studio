# Product Contract

## Product purpose

Manga Blueprint Studio is an **AI/human co-authoring system for manga planning and generation handoff**. It captures manga-specific intent before image generation: work/page structure, panel geometry and order, story action, reusable character identity, pose/expression/gaze, camera, background, dialogue/SFX, lettering direction, art direction, and manga effects.

The system has two authoring surfaces over one canonical project state:

1. **Blueprint Engine** — a headless Name DSL compiler for AI/human co-authoring.
2. **Web editor** — a visual client for manual refinement, persistence, and the established selected-page generation/review export flow.

The human remains the director. AI may propose or compile authored intent, but project state stays inspectable and editable.

## Canonical project state

`manga-blueprint/0.2` remains the canonical serialized project contract.

The Name DSL is source material and authoring convenience, not a competing persistent project format. The Web editor and Blueprint Engine must converge on the same project model.

## Blueprint Engine preview

The current headless compiler accepts a lightweight Markdown Name DSL and derives:

- deterministic work/page/panel/character/placement/balloon identity;
- page layout from beat count, emphasis, and the shared Layout Recipe Bank, with optional explicit recipe/seed/mutation settings;
- initial camera from explicit terms and beat semantics;
- reusable character placeholders from semantic tokens;
- initial character placement from coarse slots such as left/center/right/foreground/background;
- page/panel background intent;
- expression assignment;
- dialogue and exact SFX;
- manga line-effect hints;
- clean and annotated blueprint visuals;
- page prompts with explicit `TEXT TO RENDER` allowlist;
- a read-first compilation manifest;
- optional headless Contact Sheet preflight artifacts that preserve all compiled page cells in numeric order for one-shot multi-page generation/review.

### AI Name DSL boundary

Authors and AI should not be required to provide generated IDs or exact pixel coordinates.

Example:

```md
# Page 1: 受信
@layout: hero-bottom
@background: 明るいリビング
@time: day

コマ1: 少女がスマホを見る
登場: girl@right
カメラ: close high-angle
セリフ: girl> ……え？

コマ2: 画面の内容に気づく
登場: girl@center
表情: girl> shock
強調: strong

コマ3: スマホを落とす
登場: girl@center
セリフ: girl> そんな……
効果音: ガタン
演出: impact
強調: climax
```

The compiler owns the initial geometry and IDs. The resulting `.manga.json` can then be refined by an AI agent or imported into the Web editor.

### Headless package authority split

The compiler package follows the same conceptual boundary as the Web export pipeline:

- `work.manga.json` — semantic project authority;
- `Pxxx.clean.svg` — spatial reference with no dialogue/SFX/action labels;
- `Pxxx.blueprint.svg` — human-review reference with compact beat, character, attention, gaze and contact guidance over the same solved geometry as Clean;
- `Pxxx.prompt.md` — generation instructions and exact visible-text allowlist;
- `manifest.json` — read-first package index.

The headless preview manifest currently uses `manga-blueprint-name-package/2`; it is distinct from the existing Web export manifest `manga-blueprint-export-manifest/3`.


### Full Review and Annotated lettering (headless)

The CLI's `Pxxx.blueprint.svg/png` (Annotated) now overlays exactly authored dialogue/SFX from the deterministic Lettering plan on top of its existing direction annotations. `Pxxx.clean.svg/png` remains **unchanged** and contains no authored lettering or review labels. A lettering entry that cannot fit is marked `fit: "unplaceable"` in its JSON plan rather than guessed or written outside the panel.

For an explicitly requested all-information human review, `--review-full` adds `Pxxx.review-full.svg/png`, comprising the Annotated page plus an external readable sidecar with the *full canonical* panel action, background/time/weather/mood, camera, technique/effect, frame/attention/reading-flow, character identity/outfit/condition/appearance/props and exact dialogue/SFX. Missing fields are displayed as `未指定`, not invented. When combined with `--contact-sheet`, it also outputs `contact-sheet.review-full.svg/png`. The PNG files use a width-bounded (up to 1200px per Review Full page) best-effort rasterization/montage pipeline; lack of rasterization is reported in `manifest.rasterization`, and manifest paths only point to successful PNGs.

Full Review is human-review-only, never the image-model's Clean input or a second source of truth. The original page SVGs remain available regardless of `--review-full`.

### Headless Contact Sheet preflight

The CLI may opt into `--contact-sheet` for multi-page work. This produces both Clean and Blueprint contact-sheet surfaces plus a merged prompt, a page-indexed review request and a provider-neutral generation package. When per-page PNG rasterization succeeds, `contact-sheet.clean.png` and `contact-sheet.blueprint.png` are assembled directly from the corresponding `Pxxx.*.png` files; the Clean sheet remains generation-facing and the Blueprint sheet remains human-review only. Layout selection is automatic: 2 pages use 2×1, 3–4 pages use 2×2, and 5–8 pages use 4×2. One page falls back to 1×1; larger works use four columns with the required row count. `--contact-columns` remains an explicit override for exceptional/debug use. The mode exists to catch cross-page identity/outfit/scene drift quickly and to identify which pages need individual repair.

Contact Sheet does **not** become canonical project state, does not change Web selected-page export scope, and is never sufficient final acceptance for small lettering, fine anatomy or subtle facial detail. Final delivery remains page-level.

## Existing Web editor contract

The Web editor continues to support:

- multiple local works;
- optional volume/chapter/folder organization;
- multiple pages per work;
- manga-first work/page navigation;
- page/panel authoring;
- rectangle or convex-quadrilateral panel geometry;
- direct four-corner editing and irregular layout presets;
- shared Layout Recipe controls with panel-count, seed and bounded mutation;
- a public shareable Layout Catalog whose settings can be copied into Name DSL/CLI or opened in the Web editor;
- reusable character identity;
- Story Template Studio and Smart Manga;
- manga-specific camera/background/text/effect semantics;
- selected-page AI generation/review packages;
- typed solver-decision inspection for the shared Layout Recipe surface.

### Manga-first editor shell

The current Web navigation shell remains a **Manga-first editor shell**. The active work opens through **Work Explorer / 作品エクスプローラー**, visible page codes use `P001` style formatting, and **Page settings / ページ設定** owns manuscript/layout/current-page configuration rather than primary work navigation.

On narrow screens the application header continues to use **two explicit rows** so app actions do not wrap inside individual buttons.

### Panel shape

The Web editor's current **Panel shape** model remains rectangle plus optional convex quadrilateral `Panel.shape`. Existing diagonal/trapezoid presets and direct corner editing remain valid and independent from the headless compiler preview.

### Layout Recipe Bank

`core/layout-recipes.mjs` is the shared source for base-layout recipes used by the Blueprint Engine, CLI-facing Name settings, Web Recipe controls, and the public Layout Catalog. Recipe selection determines base panel topology/ratios; `seed` and `mutation` produce reproducible nearby variants. Diagonal frames, inset children, bleed, breakout and other expressive techniques are applied after base selection and must not be baked into a second recipe authority. Catalog deep links may prefill Recipe controls and reveal the Manual layout surface, but they remain non-mutating until the user explicitly applies the selected Recipe. Each catalog card exposes a shareable URL containing the Recipe ID, panel count, seed, and mutation so the same candidate can be reproduced in another browser/session.

### Story Template presentation

Story Template discovery remains card-first and includes **presentation quick filters**. Compound filters such as **2人表示 + 集中線** remain part of the current Web product behavior. Smart Manga remains a separate bounded proposal system.

### Web export scope

The established Web generation/review handoff remains **selected-page scoped**. The Blueprint Engine may compile multiple Name pages into project state and per-page assets, but that does not silently change Web export scope.

### Persistence and identity

Web project persistence uses IndexedDB. `meta.workId`, page/container/panel IDs, placed-character instance IDs, and balloon IDs are stable identity. Save and activation remain separate operations. Import/duplicate behavior must retain the established conflict/remapping semantics.

### Human direction first

Assistance must not silently replace recorded layout, action intent, pose, character assignment, appearance policy, camera intent, background intent, dialogue/SFX, lettering direction, or manga effects.

- Story Template browsing/filtering/preview is non-mutating;
- Smart Manga candidates are non-mutating until explicit apply;
- compiled Name output becomes ordinary editable project state;
- diagnostics are advisory.

## Reading and lettering

Panel reading direction and lettering direction remain separate contracts.

- `meta.readingDirection = rtl | ltr`; Japanese RTL is default.
- `meta.defaultWritingMode = vertical-rl | horizontal-tb`; vertical Japanese is default.
- changing writing direction must not change panel reading order.

## Character identity boundary

Reusable base-character identity and placed instances remain separate.

Identity modes:

- `sheet` — Character Sheet required;
- `description` — text appearance guidance is identity contract;
- `free` — downstream model may choose a simple consistent appearance.

Blueprint Engine character tokens initially compile to `description` placeholders. When appearance guidance is empty, the package must surface that refinement is still needed rather than pretending identity is fully specified.

Stick figures communicate body relation, pose, placement, and approximate scale. They do not define finished appearance or clothing.

### Character continuity state

`characterLibrary[].appearance.outfit` is the baseline clothing state. A placed character may author an explicit `continuityState.outfit`; that resolved outfit is then inherited across later panels/pages until another explicit outfit state replaces it. The same inheritance model applies to character condition. Compiler output records `outfitSource` / `conditionSource` as `base`, `explicit`, or `inherited` so diagnostics and generation handoff can distinguish an intentional change from drift. Generation briefs must carry the resolved outfit and prohibit unrequested clothing add/remove/recolor/redesign.

## AI-safe visual/text boundary

Clean visuals communicate spatial composition. `.manga.json` + prompt communicate meaning. Character guidance controls identity. Art direction controls rendering language. Exact visible text comes only from explicit renderable-text allowlists.

Clean outputs must not expose authoring labels such as action notes, character names, IDs, panel numbers, camera labels, or dialogue/SFX glyphs.

## Quality loop through 0.25

The provider-neutral production loop now includes:

- image-facing observation adapters that normalize manual/vision evidence into `manga-blueprint-observation/1`;
- confidence-aware Structural Evaluator handoff and diagnosable drift;
- Spatial Intelligence v3 for body orientation, support/balance, pose sanity and contact;
- In-panel Composition Solver + Detail / Salience Budget;
- human-approved Repair Plan / Approval / Context contracts;
- Continuity Graph v1 across panels/pages;
- deterministic lettering plan + transparent SVG overlay for exact authored dialogue/SFX.

Observation and repair execution state remain outside canonical project state. Optional semantic repair mutation is explicit, whitelist-bounded and approval-gated.

## Current non-goals / roadmap

The current product does not yet provide:

- arbitrary polygon/curved frames;
- bidirectional Name DSL ↔ edited project synchronization;
- built-in provider credentials/network execution inside canonical Core;
- automatic aesthetic ranking or autonomous canonical repair.

These remain roadmap work. In particular, deterministic Name compilation must not be mistaken for a source-control round-trip contract.

## Verification contract

A change is not complete solely because code compiles. Relevant changes should preserve or intentionally update:

- canonical schema compatibility;
- Blueprint Engine parser/compiler regression behavior;
- deterministic compilation for fixed input;
- clean-vs-annotated visual separation;
- exact visible-text allowlisting;
- existing Web identity/persistence behavior;
- Web selected-page generation contracts;
- documentation synchronization;
- GitHub Pages behavior when public Web surfaces change.


### Four-page sheets and reader-flow review (docs/PRODUCT.md)

- **Maximum four pages per contact sheet.** Split e.g. an 8P work into `contact-sheet.001-004.*` and `contact-sheet.005-008.*` (2×2 each). One-page image generation replaces 8P composite rendering; sheets are only for reviewing the plan.
- **Annotated / Full Review: visual reader-path estimate** shows order and reading direction using light cyan arrows derived from canonical panel order; explicit primary attention coordinates refine the route when available. This is a composition aid, **not actual measured eye tracking**. Character gaze lines use only resolved, authored gaze targets. Full Review is more explicit; Clean stays entirely free of both guide types.
- The review guides do not become manga lettering or image-model input, and cannot change the canonical `work.manga.json`.
- The CLI supports `--contact-batches 4,4` for explicit partitioning; default grouping fills batches of ≤4. Review Full SVG and PNG use the same page ranges.
