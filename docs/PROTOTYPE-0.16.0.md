# Prototype 0.16.0 — Editable quadrilateral panels and mobile header cleanup

Prototype 0.16.0 ships the first user-editable **Advanced Panel Geometry** slice and a narrow-screen header cleanup.

It keeps the current manga-first workflow documented in `docs/USER-GUIDE.md` and the public `/guide.html`, while making panel boundaries more expressive without changing the project format or selected-page export scope.

## Editable convex quadrilateral panels

A panel may now remain a rectangle or carry an optional convex quadrilateral `shape`.

The panel inspector provides:

- rectangle;
- diagonal-left;
- diagonal-right;
- trapezoid-left;
- trapezoid-right;
- direct four-corner editing with visible blue drag handles.

Dragging is bounded to the page and rejects self-intersection, unusably short edges, and near-zero area. Undo/Redo records the completed corner drag as one edit.

When `shape` exists it is the visible/clipping authority. `rect` remains the bounding-box compatibility representation for existing systems and older rectangle-only projects.

Irregular panels currently disable bleed. Reset the panel to rectangle before using bleed again.

## Irregular layout templates

The ordinary Page settings layout selector now includes:

- **斜め3コマ / Diagonal 3-panel**;
- **斜め4コマ 2×2 / Diagonal 4-panel**.

These are real editable quadrilateral panels, not decorative line overlays. After applying a template, each panel can still be reshaped independently with the same four-corner editor.

## AI handoff and export

Clean and annotated PNG rendering now uses the same polygon boundary and clip path as the editor.

The current render brief keeps `panel-geometry` as an exact preservation constraint and additionally exposes per-panel geometry as rectangle plus optional quadrilateral points. The project format remains `manga-blueprint/0.2`; the export manifest remains `manga-blueprint-export-manifest/3`.

## Mobile header

At narrow widths, the application header now uses two explicit rows:

1. brand + tagline;
2. Help / Undo / Redo / language.

Action labels remain single-line instead of wrapping inside individual buttons.

## Cache freshness

Runtime chunk URLs now include the current application version. This reduces the chance that a newly deployed `app.js` loads an older cached runtime chunk after a release.

## Documentation

Current behavior remains documented through:

- `docs/USER-GUIDE.md`;
- `docs/PRODUCT.md`;
- `docs/ARCHITECTURE.md`;
- `docs/PROMPT_HANDOFF.md`;
- `docs/ROADMAP.md`;
- the public `/guide.html`.

Historical release notes remain historical.

## Compatibility

Unchanged:

- project format: `manga-blueprint/0.2`;
- export manifest: `manga-blueprint-export-manifest/3`;
- selected-page generation/review scope;
- stable work/page/container identity;
- rectangle-only projects;
- Story Template / Smart Manga authority boundaries.

New optional project data:

```json
{
  "shape": {
    "kind": "quad",
    "preset": "custom",
    "points": [
      {"x": 35, "y": 35},
      {"x": 390, "y": 55},
      {"x": 390, "y": 385},
      {"x": 35, "y": 365}
    ]
  }
}
```

No migration is required.
