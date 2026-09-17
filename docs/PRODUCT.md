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
- page layout from beat count, emphasis, and optional coarse layout hint;
- initial camera from explicit terms and beat semantics;
- reusable character placeholders from semantic tokens;
- initial character placement from coarse slots such as left/center/right/foreground/background;
- page/panel background intent;
- expression assignment;
- dialogue and exact SFX;
- manga line-effect hints;
- clean and annotated blueprint visuals;
- page prompts with explicit `TEXT TO RENDER` allowlist;
- a read-first compilation manifest.

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
- `Pxxx.blueprint.svg` — annotated review reference;
- `Pxxx.prompt.md` — generation instructions and exact visible-text allowlist;
- `manifest.json` — read-first package index.

The headless preview manifest currently uses `manga-blueprint-name-package/2`; it is distinct from the existing Web export manifest `manga-blueprint-export-manifest/3`.

## Existing Web editor contract

The Web editor continues to support:

- multiple local works;
- optional volume/chapter/folder organization;
- multiple pages per work;
- manga-first work/page navigation;
- page/panel authoring;
- rectangle or convex-quadrilateral panel geometry;
- direct four-corner editing and irregular layout presets;
- reusable character identity;
- Story Template Studio and Smart Manga;
- manga-specific camera/background/text/effect semantics;
- selected-page AI generation/review packages.

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

## AI-safe visual/text boundary

Clean visuals communicate spatial composition. `.manga.json` + prompt communicate meaning. Character guidance controls identity. Art direction controls rendering language. Exact visible text comes only from explicit renderable-text allowlists.

Clean outputs must not expose authoring labels such as action notes, character names, IDs, panel numbers, camera labels, or dialogue/SFX glyphs.

## Current non-goals / roadmap

The current product does not yet provide:

- full backup/restore;
- multi-page/range/container/work-wide Web generation export;
- panel-first generation packages;
- generalized cross-page reference assets;
- arbitrary polygon/curved frames;
- deterministic final post-generation typesetting;
- bidirectional Name DSL ↔ edited project synchronization.

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
