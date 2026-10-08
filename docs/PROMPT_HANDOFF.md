# Prompt and Image Handoff Contract

## Scope

This document defines the **current selected-page AI generation/review handoff** and the separate **headless multi-page Contact Sheet preflight** boundary.

The editor already supports multiple works and pages, but Web generation/review packages remain selected-page scoped until the scoped-export phase ships. Do not infer Web multi-page export semantics merely because a project contains multiple pages. The headless CLI may separately create an opt-in Contact Sheet preflight package; that package is batch QA, not Web export and not final page acceptance.

## Recommended generation handoff

Use the **AI generation ZIP** and a short manifest-first instruction.

Typical Japanese instruction:

```text
このZIPを展開して、最初に中の *_manifest.json を読んで、その内容に従って漫画を生成してください。
Character Sheet が必要と書かれているキャラクターは、別途添付した Character Sheet 画像を対応付けて使ってください。
```

When no Character Sheet is required, the UI may use the no-sheet wording. The chat sentence is intentionally short; the manifest and included semantic files carry the detailed contract.

## AI generation ZIP

Current contents:

```text
<prefix>_clean.png
<prefix>.manga.json
<prefix>_prompt.txt
<prefix>_manifest.json
```

The generation package deliberately excludes annotated review PNG.

### File roles

- `_clean.png` — visual/spatial reference.
- `.manga.json` — complete semantic blueprint for the exported project state.
- `_prompt.txt` — generated direction/instruction text for the current page.
- `_manifest.json` — read-first package authority and file-role index.

## Review/archive ZIP

The review/archive package uses the same state-linked semantic materials and adds:

```text
<prefix>_annotated.png
```

Annotated review exists for human checking/storage. It may contain authoring labels/lettering previews and is not the default generation reference.

If a review image is separately shown to a downstream assistant, labels visible there do not become valid final-art text unless the exact string is separately allowlisted for rendering.

## Manifest

Current schema identifier:

```text
manga-blueprint-export-manifest/3
```

The manifest is the first file a downstream assistant should read.

It records, where applicable:

- export/package identity;
- package type;
- file roles;
- clean primary visual;
- semantic JSON;
- generation instructions;
- annotated-review generation prohibition;
- character identity guidance;
- Character Sheet requirements;
- Story Template provenance;
- panel intent index;
- derived lettering metadata;
- derived Design Direction Pass;
- current panel geometry model and per-panel geometry in the render brief;
- compact user handoff text;
- producer/build provenance.

`.manga.json` remains the complete semantic project contract. Manifest indexes and derived guidance are convenient read-first summaries rather than competing project state.

## Authority split

The package deliberately separates responsibilities.

### Clean PNG — spatial authority

Controls strongly/exactly as declared by the current render contract:

- panel count;
- panel boundaries/proportions, including authored convex-quadrilateral boundaries;
- reading-order geometry;
- approximate character placement and scale;
- pose direction/body relationship;
- balloon/effect geometry that remains in clean output.

The planning stick figure does **not** define finished appearance, clothing state, or pixel-exact anatomy. A stick figure is an abstract pose/placement guide and must never be interpreted as an unclothed body. Finished clothing comes from Character Sheet / appearance guidance plus canonical character continuity state. `characterLibrary[].appearance.outfit` seeds the baseline; explicit per-character `continuityState.outfit` changes replace that state, and later panels/pages inherit the resolved outfit until another explicit change. The generation brief must state the resolved outfit for each placed character and prohibit unrequested clothing add/remove/recolor/redesign. If no outfit is specified anywhere, downstream generation uses ordinary scene-appropriate clothing instead of inferring nudity from the planning figure.

### `.manga.json` + prompt — semantic authority

Controls:

- story action intent;
- pose meaning/support/motion;
- camera/depth/foreshortening;
- scene/background continuity semantics;
- background intent;
- dialogue/SFX semantics;
- reading/writing direction;
- art direction;
- optional exact quadrilateral panel coordinates;
- other current panel semantics.

### Character guidance / Character Sheets — identity authority

Controls finished character identity according to each reusable character's identity mode.

### Art direction — rendering language

Controls color/render style, line, shading, detail, background finish, palette/tone, and additional finish guidance. It does not replace panel geometry or character identity.

### `TEXT TO RENDER` — visible text authority

Only exact strings allowlisted in the generated prompt's renderable-text section may become visible manga lettering.

### Deterministic lettering overlay — exact production text

Headless 0.25 packages may additionally include:

```text
Pxxx.lettering.json
Pxxx.lettering.svg
```

The JSON is the deterministic glyph-position plan; the SVG is the transparent lettering overlay. When present, the overlay is the preferred production authority for final dialogue/SFX glyphs. It does not replace semantic text authority: source strings still come from canonical balloon/SFX fields and the exact visible-text allowlist.

`overlay-only` means the image model should leave lettering regions clear and must not draw text. `overlay-preferred` permits model text for preview but allows the deterministic overlay to replace it.


## Panel geometry contract

Prototype 0.16.0 supports two current panel-boundary forms:

```text
rectangle-only panel
  rect = required compatibility geometry

quadrilateral panel
  rect = synchronized bounding box
  shape.kind = quad
  shape.points[4] = exact authored visible boundary
```

For quadrilateral panels, `shape.points` is the stronger boundary authority. The clean PNG, editor/review rendering, and current render brief must describe the same four-point polygon.

The render brief exposes:

```json
{
  "panelGeometryModel": "rect-or-convex-quad",
  "panels": [
    {
      "geometry": {
        "rect": {"x": 35, "y": 35, "w": 355, "h": 350},
        "shape": {
          "kind": "quad",
          "points": [
            {"x": 35, "y": 35},
            {"x": 390, "y": 55},
            {"x": 390, "y": 385},
            {"x": 35, "y": 365}
          ]
        }
      }
    }
  ]
}
```

Downstream generation must not reinterpret a quadrilateral as a decorative diagonal line inside a rectangular panel. The polygon **is the panel boundary** and remains under `PRESERVE EXACTLY`.

Rectangle-only panels omit/null the optional shape and retain the existing behavior. Arbitrary polygons, curves, and inferred shared-edge topology are not part of the current handoff contract.

## Reference-role contract

When a required external Character Sheet exists, its role is separate from the clean blueprint.

Conceptually:

```json
{
  "referenceRoles": [
    {
      "source": "*_clean.png",
      "role": "spatial-layout",
      "controls": [
        "panel-geometry",
        "panel-proportions",
        "reading-order-geometry",
        "approximate-character-placement",
        "approximate-character-scale",
        "pose-direction"
      ],
      "doesNotControl": [
        "character-appearance",
        "render-style",
        "visible-text"
      ]
    },
    {
      "source": "Character Sheet referenceKey=hero",
      "role": "character-identity",
      "characterId": "hero",
      "controls": [
        "face",
        "hair",
        "body-proportions",
        "outfit",
        "distinctive-features"
      ],
      "doesNotControl": [
        "panel-layout",
        "panel-count",
        "pose",
        "camera",
        "story-action"
      ]
    }
  ]
}
```

This prevents a pose blueprint from being copied as appearance and prevents a Character Sheet pose/background from silently overriding authored composition.

## Preservation levels

The current render brief distinguishes transformation scope and invariants.

### CHANGE

What the downstream renderer is expected to transform from planning/reference form into finished manga art.

### PRESERVE EXACTLY

Examples:

- panel count;
- panel boundaries/proportions, including quadrilateral points when present;
- reading-order geometry;
- exact allowlisted visible text.

### PRESERVE AS STRONG CONSTRAINTS

Examples:

- character identity;
- relative placement/scale;
- story action;
- gaze/contact relationships;
- camera intent;
- scene continuity.

### USE AS GUIDANCE

Examples:

- simplified stick-figure joint coordinates;
- planning-figure anatomy;
- heuristic visual guides.

### DO NOT INHERIT / DO NOT ADD

Examples:

- authoring labels;
- unrelated prior-conversation story/genre/setting;
- unsupported characters/objects/text;
- metadata from review UI.

The key distinction is that panel geometry can be exact while planning-stick anatomy remains guidance.

## Current-page render contract

The generated prompt includes a concise current-page contract that instructs the downstream assistant to render **only the exported current page** and reject unrelated carryover from prior conversation turns or prior generated images.

This remains essential even when the assistant can see earlier chat context.

## Derived Design Direction Pass

Prototype 0.15.2 adds a bounded pre-render **Design Direction Pass** to the handoff.

The purpose is to make the downstream renderer decide visual hierarchy **before** drawing instead of treating every region with the same emphasis. This pass is derived guidance only; it is not saved as a second authoring source of truth.

The pass may derive:

- page-level focal hierarchy;
- primary focus inside each authored panel;
- eye flow following the authored reading order;
- negative-space distribution;
- value/color contrast hierarchy;
- detail-density rhythm;
- local subject emphasis.

It may adjust only micro-composition **inside the existing panel boundaries**, local negative space, and local value/color/detail emphasis.

It must preserve:

- panel count;
- panel boundaries and proportions;
- reading order;
- story action intent;
- authored camera intent;
- visible cast;
- character identity;
- relative character placement;
- exact visible text.

The largest panel may be surfaced as an emphasis candidate because panel area is an existing hierarchy signal. It is **not** permission to reinterpret story importance, resize panels, or rewrite the page.

The pass also explicitly discourages a common generative failure mode: making every panel equally detailed, equally glossy, equally contrasty, or filling intentional empty space with decorative objects/effects.

Conceptually the prompt order is:

```text
CURRENT PAGE RENDER CONTRACT
→ REFERENCE ROLES
→ CHANGE / PRESERVE / DO NOT INHERIT / DO NOT ADD
→ DESIGN DIRECTION PASS
→ CURRENT PANEL BEATS
→ detailed generation prompt
```

If a future editor adds human-authored design controls, those should be represented separately as authored `designIntent` (or equivalent). AI-derived design guidance must not silently become canonical project state.

## Character identity modes

### `sheet`

Use the separately attached Character Sheet mapped by `referenceKey`.

### `description`

No Character Sheet is required. Text appearance guidance is the visual identity contract.

### `free`

No Character Sheet is required. The downstream model may choose a simple appearance but should preserve it consistently across panels.

Generated prompt wording must never universally claim that visual identity comes only from Character Sheets.

## Story action intent

`Panel.actionIntent` is semantic direction, for example:

```text
STORY ACTION INTENT:
- Panel 1: notices the viewer in the room
- Panel 2: turns back after being called
```

These strings are instructions, not visible manga text.

## Story Template provenance

Manifest/project may include Story Template provenance such as `meta.storyTemplate`.

It records how the page started. It is not continuing template authority after apply and is never visible text.

**Story Template** is the canonical feature name; do not introduce “Scene Template” as a separate product term.

The **斜め3コマ / 斜め4コマ 2×2** choices introduced with panel geometry are page-layout presets. They do not create a second Story Template system.

## Reading order

`meta.readingDirection` is authoritative:

- `rtl` — Japanese manga right-to-left;
- `ltr` — left-to-right.

Committed render paths synchronize panel order from geometry + selected direction before handoff. For current convex quadrilateral panels, the synchronized compatibility `rect` bounding box is used for deterministic row/order calculation while the exact polygon remains the rendering boundary.

The same order should therefore be reflected by:

- canvas panel numbers;
- Story Template preview numbers;
- Story Template beat placement;
- Panel Peek/List;
- prompt;
- manifest;
- exported semantics.

Changing text writing direction does not change panel reading order.

## Balloon lettering direction

Project default:

```json
{
  "meta": {
    "defaultWritingMode": "vertical-rl"
  }
}
```

Per balloon:

```json
{
  "writingMode": "inherit"
}
```

Allowed values:

- `inherit` — project default;
- `vertical-rl` — vertical Japanese;
- `horizontal-tb` — horizontal.

The prompt may describe effective writing direction semantically. Those labels are instructions and do not create additional visible strings.

## SFX / onomatopoeia writing direction

Each panel may use:

```json
{
  "effects": {
    "sfxText": "ドン",
    "sfxWritingMode": "inherit"
  }
}
```

Allowed writing modes are the same as balloons.

The exact SFX string becomes renderable only because it is also listed under the exact visible-text allowlist.

## Text allowlist

Only exact strings under the prompt's renderable-text section may appear as final manga lettering.

Forbidden authoring text includes:

- character display names;
- Character IDs;
- Character Sheet keys;
- panel numbers;
- camera terms;
- Story Template names;
- action intent;
- writing-mode labels;
- Panel Peek/List/Chip summaries;
- Crop Guide labels;
- panel-shape corner-handle numbers;
- editor/help text.

## Visual-reference boundary

Clean PNG excludes authoring overlays such as:

- Panel Chips;
- info buttons;
- Crop Guide labels;
- selected outlines/metadata;
- panel-shape corner handles;
- balloon text previews;
- camera/role labels;
- character display labels;
- SFX labels.

It keeps the spatial reference needed for generation, including the authored rectangle or quadrilateral panel boundary.

## Export identity

`<prefix>` is based on project title, timestamp, and a short state hash. Export identity links files created from the same serialized state.

Producer provenance is diagnostic and separate from project-state hash identity.

## Producer provenance

Generated manifests include build metadata such as:

```json
{
  "producer": {
    "schema": "manga-blueprint-producer/1",
    "appVersion": "<current app version>",
    "gitCommit": "<deployed commit or null>",
    "buildSource": "github-pages",
    "deployedAt": "<ISO timestamp>",
    "projectFormat": "manga-blueprint/0.2",
    "manifestSchema": "manga-blueprint-export-manifest/3",
    "renderBriefSchema": "manga-blueprint-render-brief/2",
    "designDirectionSchema": "manga-blueprint-design-direction-pass/1"
  }
}
```

GitHub Pages stamps exact deployment provenance into `build-info.json`; local/offline fallback may have `gitCommit: null`.

Use this metadata when diagnosing whether a suspicious ZIP came from a stale cached build.

## Current single-page boundary

Current generation/review packages export only the selected page.

The future scoped-export design must explicitly define:

- selected pages;
- page ranges;
- volume/container scope;
- whole-work scope;
- root batch manifest;
- per-page self-contained contracts;
- output naming/order;
- spread/shared-canvas exceptions.

Do **not** concatenate all pages into one giant generation prompt or assume one model should render a whole work as one image.

## Example

Upload:

```text
My-Manga_20260908_153000_a1b2c3d4e5_ai.zip
hero-character-sheet.png   # only when manifest requires it
```

Send:

```text
このZIPを展開して、最初に中の *_manifest.json を読んで、その内容に従って漫画を生成してください。
Character Sheet が必要と書かれているキャラクターは、別途添付した Character Sheet 画像を対応付けて使ってください。
```

For a page whose used characters are all `description` / `free`, no Character Sheet needs to be attached.

## Inset panel handoff — Prototype 0.19.0

A true **差し込みコマ / inset panel** is authored spatial structure, not decoration. The clean PNG contains its opaque mask and frame over the parent panel. The current-page Render Brief and export manifest also include one-level parentage.

Downstream generation must preserve:

- the child panel physically overlaid inside its parent;
- the child boundary and relative placement shown in `*_clean.png`;
- the semantic parent/child relation in `panelHierarchy` / `insetPanels`;
- the child as a real editable manga panel with its own beat/camera/cast/text, not as a speech balloon, UI card, or background prop.

The legacy `border=inset` value means only an **Inset-style border / 小窓風枠** and does not establish panel parentage.

## Headless Contact Sheet preflight

The Blueprint Engine CLI can opt into a provider-neutral batch package:

```text
contact-sheet.clean.svg/png
contact-sheet.blueprint.svg/png
contact-sheet.prompt.md
contact-sheet.review.json
contact-sheet.generation.json
```

The Contact Sheet spatial asset keeps compiled pages in explicit Pxxx cells. When local rasterization is available, the Contact Sheet PNG is a simple montage of the already-rasterized page PNGs rather than a second rasterization of the giant sheet SVG. `contact-sheet.clean.*` is the generation-facing spatial reference; `contact-sheet.blueprint.*` is human-review only and must never become the default image-model input. The merged prompt must preserve:

- global reusable-character identity guidance;
- every resolved per-panel outfit/condition state;
- each page's own executable generation brief;
- each page's internal reading/writing direction;
- explicit page-cell separation.

Do not manually compress those contracts to vague summaries such as "two students in uniform". That loses canonical clothing/identity state and can reintroduce cross-page drift.

`manga-contact-sheet-review-request/1` maps sheet cells to page/panel/character expectations and supports one-pass detection of high-level cross-page failures. It explicitly marks final acceptance false. Exact lettering, fine anatomy and subtle facial detail must still be checked on individual page outputs.

The intended loop is:

```text
multi-page compile
  -> Contact Sheet generation
  -> one-pass batch review
  -> classify Pxxx as pass / review / repair
  -> regenerate only affected pages when possible
  -> page-level final verification
```

## LLM execution of compiled Name packages

This section owns the **agent/runtime procedure** after the headless compiler has produced `manifest.json`. The user may simply say “これで画像生成して”; they should not have to restate file lists or memorize the Studio package format. The LLM must not silently replace authored manga semantics with a new plot.

### Preflight and source resolution (P0-01 / P0-02)

1. Resolve the requested repository, work and revision. If multiple works are plausible, clarify instead of silently selecting the previous chat’s unrelated work.
2. Read `manifest.json` first, then the canonical `work.manga.json` and the matching `contact-sheet.NNN-NNN.generation.json` or `Pxxx.generation.json`. The actual name is taken from the manifest; older CLI packages may instead use unqualified `contact-sheet.generation.json`.
3. Read all referenced page prompts, the batch prompt, actual Clean visual(s), and any required character references. A Contact Sheet rough must preserve every page's original story beats and page/cell order; a final image generation is limited to one page.
4. Validate work title, project/page IDs, page/cell count and order, prompt panel count, reading direction, exact `TEXT TO RENDER` allowlist, binding readiness and asset existence. If necessary, rasterize the Clean SVG, keeping semantic and spatial authorities linked. Unresolved appearance/character references are disclosed for review and must not silently be invented as approved identity.
5. A local CLI checkout may produce a **read-only** report with:

   ```bash
   npm run preflight:generation -- /path/to/work/blueprint --contact-sheet 001-008
   npm run preflight:generation -- /path/to/work/blueprint --page P007
   ```

   The JSON status `prepared-not-attached` means the files and contracts were checked, **not** that an image-model request has been executed. `blocked` means mandatory input is missing/mismatched and rendering must stop. The preflight script does not upload assets, call a provider, trigger CI or modify files.

### Image model handoff (P0-02)

The LLM must explicitly supply the **real image payload** for the selected Clean visual and **complete corresponding semantic prompt** in the same invocation (with project/ref guidance when required). A GitHub path, an in-chat link, a prompt mentioning the filename, or an Annotated review image is not a substitute. If the tool cannot attach or interpret the Clean reference, stop and report the exact capability boundary; do **not** silently fall back to text-only story invention. Keep Anthology/previous chat concepts out of the current work unless the canonical source intentionally includes them.

For a Contact Sheet, generate only a **batch rough/preflight image**, retaining all page cells and the work's exact plot. Do not mark an 8P composite as eight final pages. For final production generate **Pxxx one page at a time**, then use the deterministic lettering overlay and page-specific checks.

### Independent image observation and triage (P0-03)

After an image-model invocation, inspect **the resulting image**, not just the request text. Record what is actually observable: number/order of pages, per-page panel topology, plot anchors/actions, character identity/outfit and exceptional shape restrictions, RTL path, and visible glyphs. The compiler's expected JSON may define the target but **must never be copied into observed evidence**. Use the existing `manga-blueprint-observation/1` / Structural Evaluator and Repair Plan workflow where supported; use manually verified `pass / review / repair` when a provider observation adapter is absent.

For narrative-specific independent inspection, use `evaluateNarrativeEvidence(project, observation, {scope:'rough'|'page', pageNumbers:[...]})` from `core/generation-narrative-review.mjs`. Its `manga-generation-narrative-observation/1` input must identify the **generated** image, `source.kind = vision | manual-image | hybrid`, `source.imageInspected = true`, and per-page independent `anchors: [{panelOrder, observedDescription, verdict:'match'|'mismatch'|'uncertain'}]`. A rough sheet needs at least one observed story anchor per page; a single-page story review needs an observation for each canonical panel. No image/observed descriptions returns `unverified`, mismatched story evidence returns `repair`. `story-consistent` is a narrow narrative result, **never** page-final acceptance or proof that the LLM truly observed a file.

A model that draws an unrelated observatory/space/forest story for SCP-5031 fails **story-content** validation regardless of attractive artwork or a correct 4×2 grid. A missing/indeterminate visual input or observation is `unverified`, never `pass`. A failed sheet returns specific Pxxx pages to targeted repair; changed final candidates need fresh page-level acceptance. Only confirmed accepted assets belong in the Works Repository's `final/` directory.

### Scope and boundary

This is not a replacement for `manga-blueprint/0.2`, `manga-generation-package/1` or provider-neutral adapter authority; no model credentials or provider request IDs are stored in canonical project data. The existing Web selected-page workflow remains unchanged. New full provider adapters are still separate roadmap work.
