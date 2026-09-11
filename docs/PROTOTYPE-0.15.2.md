# Prototype 0.15.2 — Render-contract hierarchy and bounded Design Direction

Prototype 0.15.2 strengthens the selected-page AI handoff without changing authored project state or the editor's manga-first navigation model.

The release makes reference-image responsibilities and preservation levels explicit, then adds a bounded **Design Direction Pass** that asks downstream renderers to derive page-level emphasis before drawing while preserving authored manga structure.

## Why this release exists

Whole-page image generation can fail even when the semantic blueprint is correct if the downstream renderer:

- treats a Character Sheet as pose/layout authority;
- copies planning-stick appearance too literally;
- changes panel geometry while trying to improve composition;
- gives every panel the same contrast/detail weight;
- fills intentional negative space with decorative content;
- inherits unrelated story/setting details from prior conversation context.

Prototype 0.15.2 makes those boundaries explicit in the prompt and manifest.

## Reference-role contract

The generated render brief now declares distinct reference roles.

- the clean Manga Blueprint PNG is the spatial-layout reference;
- required Character Sheets are character-identity references;
- each role declares what it controls and what it must not override.

This keeps character identity, pose/layout, render style, and visible text from collapsing into one ambiguous image-reference instruction.

## Preservation contract

The handoff separates:

- **CHANGE** — transform the planning blueprint into finished manga artwork;
- **PRESERVE EXACTLY** — panel count/boundaries/proportions, reading-order geometry, exact allowlisted visible text;
- **PRESERVE AS STRONG CONSTRAINTS** — character identity, relative placement/scale, story action, gaze/contact, camera intent, continuity;
- **USE AS GUIDANCE** — simplified stick-figure joints/anatomy;
- **DO NOT INHERIT / DO NOT ADD** — authoring labels, prior-context substitutions, unsupported cast/text/panels.

The current render-brief schema is now:

```text
manga-blueprint-render-brief/2
```

## Bounded Design Direction Pass

Before final rendering, the handoff asks the downstream model to derive a concise visual-design plan from the already-authored page.

The pass may derive:

- page-level focal hierarchy;
- within-panel primary focus;
- eye flow following authored panel order;
- negative-space distribution;
- value/color contrast hierarchy;
- detail-density rhythm;
- local subject emphasis.

It may make only micro-composition/emphasis decisions **inside existing panel boundaries**.

It must not rewrite:

- panel count, boundaries, or proportions;
- reading order;
- story action;
- camera intent;
- visible cast or character identity;
- relative character placement;
- exact visible text.

The derived pass is exported as guidance under:

```text
manga-blueprint-design-direction-pass/1
```

It is not persisted as a second canonical authoring model.

## Panel geometry planning

This release does **not** ship diagonal/freeform panel editing.

The roadmap now pulls a minimum **convex quadrilateral panel** foundation forward before Panel-first generation so future crop/mask/recomposition work does not hard-code rectangle-only assumptions.

The planned first slice includes four independently draggable corners, diagonal/trapezoid presets, validation against invalid quadrilaterals, and shape-aware rendering/export/hit testing while retaining rectangle compatibility.

## Documentation continuity

Current user-facing documentation remains anchored by `docs/USER-GUIDE.md`, and the public full guide remains available at `/guide.html`.

This release changes AI handoff documentation and versioned contracts; it does not replace the existing manga-first editor navigation workflow described by those guides.

## Validation

The render-brief validator now checks the new reference-role, preservation, and Design Direction contracts.

Version/document synchronization also requires this release note to match the 0.15.2 build metadata.

Static validation remains separate from deployed Pages verification.

## Compatibility

Unchanged:

- project format: `manga-blueprint/0.2`;
- export manifest: `manga-blueprint-export-manifest/3`;
- work/page/container identity and persistence;
- selected-page generation/review scope;
- editor navigation and authoring data model.

Changed handoff metadata:

- render brief: `manga-blueprint-render-brief/2`;
- derived design direction: `manga-blueprint-design-direction-pass/1`.

No project migration is required.
