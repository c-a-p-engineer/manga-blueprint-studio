# Prototype 0.14.1 — Explicit Reference and Preservation Contracts

Prototype 0.14.1 hardens the AI handoff boundary using model-independent prompting principles distilled from current image-generation guidance.

## Goal

Reduce downstream model drift without bloating the authoring schema.

The project already stores the necessary semantic inputs: panel geometry, pose, placement, gaze, action intent, camera, scene continuity, character identity, art direction, and text allowlists. This release improves how those inputs are compiled for image-generation assistants.

## Added

### Reference role contract

Every visual reference now has an explicit responsibility.

- Clean Manga Blueprint PNG: spatial-layout reference.
- Required Character Sheet: character-identity reference for its mapped character.

Each reference declares both `controls` and `doesNotControl` fields. This prevents the clean stick-figure blueprint from becoming character appearance and prevents a Character Sheet pose/background from replacing authored manga composition.

### Preservation contract

The render brief now separates:

- `CHANGE` — transform the blueprint into finished manga artwork;
- `PRESERVE EXACTLY` — panel count, panel boundaries/proportions, reading-order geometry, allowlisted visible text;
- `PRESERVE AS STRONG CONSTRAINTS` — identity, relative placement/scale, action, gaze/contact, camera intent, scene continuity;
- `USE AS GUIDANCE` — simplified stick-figure joints/anatomy;
- `DO NOT INHERIT` and `DO NOT ADD` — authoring artifacts and unsupported inventions.

### Constraint-strength hierarchy

Spatial intent is no longer described as one undifferentiated requirement.

1. Panel geometry: exact.
2. Character spatial relationships: strong constraint.
3. Stick-figure joint coordinates: guidance only.

This keeps the page composition stable while allowing anatomically valid rendering when a finished character replaces a planning figure.

## Compatibility

- `.manga.json` remains `manga-blueprint/0.2`.
- Export manifest remains `manga-blueprint-export-manifest/3`.
- Render brief advances from `manga-blueprint-render-brief/1` to `/2`.
- No provider-specific model or API parameter is added to the project schema.
- Existing projects require no migration.

## Validation

`validate-render-brief.mjs` now checks for:

- render brief v2;
- spatial-layout and character-identity reference roles;
- explicit `doesNotControl` boundaries;
- separated preservation levels;
- exact/strong/guidance spatial constraint hints.
