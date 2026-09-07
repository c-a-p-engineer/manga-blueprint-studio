# Architecture

## Current architecture

The prototype is a static client-side application deployed from `web/`.

```text
web/index.html
  ↓
web/app.js
  ├─ editor state
  ├─ panel operations
  ├─ pose preset semantics
  ├─ SVG blueprint rendering
  ├─ pointer/drag interaction
  ├─ prompt compiler
  ├─ JSON import/export
  └─ PNG export
  ↓
localStorage
```

No server, build pipeline, runtime API, database, or external JavaScript dependency is required.

## Why zero-dependency for the prototype

The uncertain part of this project is the interaction model and blueprint contract, not component framework selection. A static implementation lets us validate:

- whether panel editing feels useful;
- whether stick-figure pose presets are expressive enough;
- whether multimodal AI understands the exported blueprint;
- whether `.manga.json` contains the right semantics.

A framework migration should happen only when complexity justifies it.

## Coordinate system

The prototype uses a logical page space of:

```text
width: 800
height: 1130
```

Panel rectangles and character positions are stored in this page coordinate space.

This keeps visual rendering and semantic export aligned. A future stable format may normalize to `0..1`; if so, migration must be explicit.

## Data ownership

### Project metadata

Owns title, format version, reading direction, and page dimensions.

### Page

Owns panels.

### Panel

Owns:

- geometry;
- order;
- camera intent;
- character instances.

### Character instance

Owns placement and pose on a specific panel.
It references a logical `characterId` and optional `referenceKey` but does not own the character sheet image itself.

### Pose preset

Owns reusable pose semantics and a minimal stick-figure skeleton.
It does not own character appearance.

## Prompt compiler

Prompt generation is deterministic from the current blueprint state.

```text
MangaBlueprint
   ↓
page-level rules
   ↓
panels sorted by `order`
   ↓
character bindings + pose semantics + camera intent
   ↓
provider-neutral prompt
```

Prompt text is derived output. It is not the source of truth.

## Blueprint image renderer

The page editor itself is SVG. PNG export serializes that SVG, rasterizes it on an in-browser canvas, and downloads the result.

The exported image intentionally keeps panel numbers and character labels because they act as cross-references for the prompt.

## Persistence

Prototype persistence uses `localStorage` only.

- autosave: current blueprint JSON;
- explicit export: downloaded `.manga.json`;
- explicit import: local file, parsed in the browser.

No project data is transmitted over the network by application code.

## Deployment

`.github/workflows/pages.yml`:

1. checks out `master`;
2. configures GitHub Pages;
3. uploads `web/`;
4. deploys the artifact.

The deployed root is therefore the contents of `web/`, not the repository root.

## Future boundaries

Potential future modules, without committing to a framework:

```text
core/
  blueprint-model
  pose-contract
  prompt-compiler
  validation

editor/
  page-layout
  pose-editor
  camera-editor

adapters/
  generic-multimodal
  openai
  gemini
  comfyui
```

Provider adapters should consume the core format rather than modifying it.
