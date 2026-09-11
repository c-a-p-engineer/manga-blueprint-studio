# Prompt and Image Handoff Contract

## Scope

This document defines the **current selected-page AI generation/review handoff**.

The editor already supports multiple works and pages, but generation/review packages remain selected-page scoped until the scoped-export phase ships. Do not infer multi-page generation semantics merely because a project contains multiple pages.

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

The planning stick figure does **not** define finished appearance or pixel-exact anatomy.

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
