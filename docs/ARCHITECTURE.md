# Architecture

## Runtime

The prototype is a zero-dependency static web application. `web/app.js` is a tiny module bootstrap that loads `web/app-1.js` through `web/app-4.js` as classic scripts. This keeps GitHub Pages delivery build-free while keeping the prototype source manageable.

No server, runtime API, database, package install, analytics, or external JavaScript is required.

## State

The canonical in-browser project state is normalized to `manga-blueprint/0.2`.

```text
Project
└─ Page
   └─ Panel
      ├─ rect / order / narrative role
      ├─ panel style (border / bleed / breakout)
      ├─ camera
      ├─ background
      ├─ effects
      ├─ characters
      │  ├─ pose
      │  ├─ expression
      │  └─ gaze
      └─ balloons
```

Legacy `0.1` projects are normalized in memory by supplying missing fields while preserving original core data.

## Two render modes

### Editor / annotated render

Used for humans. It may contain panel numbers, camera labels, character display names, background notes, and SFX notes.

### Clean AI render

Used as a multimodal image-generation reference. It excludes all authoring text while preserving graphical composition, character pose references, effect lines, and empty balloon placement. This split is a correctness boundary, not merely a cosmetic export option.

## Prompt compiler

The prompt compiler is deterministic from project state. It emits a strict text rendering rule, reading direction, per-panel semantics, character identity references by `characterId` / sheet key, camera/background/frame/expression/gaze/effect instructions, and a `TEXT TO RENDER` allowlist. Display names are deliberately not needed for rendering.

## Persistence

`localStorage` stores project JSON. Explicit `.manga.json` export is the portable artifact.

## Coordinate system

Logical page coordinates are `800 x 1130`. Character and balloon placement use the same page coordinate system as SVG rendering.

## Deployment

GitHub Pages deploys the static web directory and publishes schema/examples as static resources. Validation remains dependency-free.
