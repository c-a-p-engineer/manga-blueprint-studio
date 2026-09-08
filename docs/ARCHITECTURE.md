# Architecture

## Runtime

The prototype is a zero-dependency static web application. `web/app.js` loads `web/app-1.js` through `web/app-5.js` as classic scripts. GitHub Pages serves the exact static assets; no server, build step, external script, analytics, or runtime API is required.

## State

Browser state normalizes to `manga-blueprint/0.2`.

```text
Project
├─ meta
│  ├─ pageWidth / pageHeight
│  ├─ canvasPreset
│  ├─ layoutPreset
│  └─ randomPurpose (optional provenance)
└─ Page
   └─ Panel
      ├─ rect / order / narrative role
      ├─ style / camera / background / effects
      ├─ characters (pose / expression / gaze)
      └─ balloons
```

`canvasPreset`, `layoutPreset`, and `randomPurpose` are optional metadata; panel geometry remains canonical. A `custom` state is used when manual resize/splitting no longer matches a shipped preset.

## Dynamic coordinate system

The coordinate system is no longer fixed to 800×1130. SVG viewBox, PNG export, panel layout generation, pointer bounds, character placement, and balloon bounds use `meta.pageWidth` / `meta.pageHeight`. The current legacy size remains the default.

Canvas resizing scales existing panel rects and placed character/balloon coordinates proportionally. Layout preset selection intentionally rebuilds panel geometry after confirmation when authored content would be discarded.

## Layout preset generator

Preset layouts are generated from page dimensions and gutters rather than storing pixel geometry for only one manuscript size. 4-koma 1×4, 2×2, action, conversation, climax, and grid layouts therefore adapt to square, portrait, landscape, print, and Webtoon canvases.

## Smart Random

Smart Random operates over the finite preset catalog. Purpose tags and optional panel count filter valid candidates; a small direction profile seeds role/camera values. It does not generate arbitrary overlapping rectangles. This keeps the result understandable and fully editable.

## Beginner terminology layer

Camera state remains provider-neutral enum values such as `extreme-close` or `low-angle`. The UI maps those enums to `professional term + plain Japanese/English label + explanation`. Quick camera presets only write the same canonical camera fields; they do not create a second camera model.

## Panel summary

Panel summaries are derived UI artifacts, not stored source-of-truth text. They are compiled from role, pose/expression, camera, background, balloons, effects, and breakout. Summaries are allowed in the annotated review render and excluded from the clean AI render.

## AI-safe render modes

- **Annotated/editor render**: may contain panel number, readable camera labels, character display names, background/SFX metadata, and panel summary.
- **Clean AI render**: removes all authoring text while preserving spatial composition, stick figures, balloon shapes, and effect lines.

## Prompt compiler

The compiler is deterministic from project state, includes canvas dimensions and layout metadata, and preserves the strict `TEXT TO RENDER` allowlist.

## Persistence and deployment

`localStorage` stores autosave state; `.manga.json` is the portable artifact. GitHub Pages publishes `web/`, schema, and examples. Validation remains dependency-free.
