# Prototype 0.16.1 — Panel-number geometry follow-up

Prototype 0.16.1 is a focused polish release for the Advanced Panel Geometry work introduced in 0.16.0.

## What changed

When an annotated/editor panel is a convex quadrilateral, the panel-number badge now follows the authored top-right polygon corner inward instead of being positioned from the compatibility bounding box.

This means that while **四隅を直接編集** is active, moving the top-right corner also moves the visible panel number in a way that stays visually attached to the frame.

Rectangle panels keep the same familiar top-right placement.

## Scope

This change affects authoring/review presentation only.

Unchanged:

- clean AI PNG remains free of panel numbers and authoring labels;
- project format remains `manga-blueprint/0.2`;
- export manifest remains `manga-blueprint-export-manifest/3`;
- quadrilateral points remain the visible-boundary authority;
- `rect` remains the compatibility bounding box;
- selected-page export scope is unchanged.

## Cache freshness

The application version is bumped to **0.16.1** so the versioned runtime-chunk URLs request the updated panel-geometry code after deployment.

## Documentation

Current workflow documentation remains in `docs/USER-GUIDE.md` and the public `/guide.html`. This patch does not change the user workflow or introduce a new control; it corrects how an existing authoring annotation follows the existing panel-shape editor.
