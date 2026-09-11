# Prototype 0.16.2 — Freeform panel UX hardening

Prototype 0.16.2 focuses on the practical problems that appear after convex-quadrilateral panels become editable: stable reading order, easy alignment, understandable frame terminology, and a reliable mobile header.

## What changed

### Irregular-panel reading order

Panel order is still derived from authored geometry + `rtl | ltr`, but quadrilateral panels no longer use the compatibility bounding box's extreme top/left corner as the visual ordering anchor.

- rectangles use their visual center;
- quadrilaterals use their polygon centroid;
- visual rows use adaptive vertical grouping;
- RTL sorts each row right-to-left; LTR sorts left-to-right.

A single diagonal corner can therefore protrude upward/rightward without unexpectedly turning a mostly-lower panel into Panel 1.

### Alignment assist

Direct four-corner editing now includes optional **吸着補正**.

A dragged corner can snap to nearby:

- page edges and page center;
- other panel-corner x/y coordinates;
- other corners of the selected panel.

Active snapping shows blue editor-only guide lines. These guides are transient UI and never appear in the clean AI PNG or project JSON.

A separate **近い辺を水平・垂直に補正** action straightens only edges already close to horizontal/vertical, preserving deliberate diagonals outside the correction tolerance.

### Frame terminology

The selected-panel UI now explains frame semantics in plain language, including:

- 通常枠;
- 枠なし;
- 小窓;
- 衝撃枠;
- 断ち切り;
- ブチ抜き.

**衝撃枠** remains a thick dashed authoring frame that marks a strongly emphasized beat such as a strike, shock, or decisive moment; it is not explanatory text that should appear in final manga art.

### Mobile header

The narrow-screen app header is reinforced as two explicit rows:

1. Manga Blueprint Studio branding/tagline;
2. Help / Undo / Redo / language.

Work identity stays in the separate manga-context area. If an older insertion path temporarily leaves the Work Library button inside the dark topbar, mobile presentation hides it there until the editor shell re-homes it.

## Existing diagonal templates

The page-layout selector already includes:

- **斜め3コマ**;
- **斜め4コマ 2×2**.

They create real editable quadrilateral boundaries, not decorative overlays.

## Compatibility

Unchanged:

- project format: `manga-blueprint/0.2`;
- export manifest: `manga-blueprint-export-manifest/3`;
- render brief: `manga-blueprint-render-brief/2`;
- derived design direction: `manga-blueprint-design-direction-pass/1`;
- rectangle-only projects remain valid;
- quadrilateral `shape.points` remain the canonical irregular boundary;
- current AI generation/review export remains selected-page scoped.

No project migration is required.

## Documentation

Current workflow documentation is synchronized in `docs/USER-GUIDE.md` and the public `/guide.html`. `docs/PRODUCT.md`, `docs/ARCHITECTURE.md`, `docs/ROADMAP.md`, `README.md`, and the runtime ownership documentation are also updated for the new reading-order and alignment-assist behavior.

## Verification targets

CI must cover:

- JavaScript syntax and runtime registration;
- existing rectangle RTL/LTR ordering;
- irregular-panel ordering where one corner protrudes into an earlier row;
- quadrilateral geometry and geometry-following panel numbers;
- snapping/alignment-assist runtime registration and clean-output separation;
- authoritative two-row mobile-header selectors;
- version/document/user-guide synchronization.

Visual and touch ergonomics remain separate evidence from CI. Paid external browser automation must not be started without explicit user approval.