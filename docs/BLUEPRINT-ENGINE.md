# Blueprint Engine

## Purpose

The Blueprint Engine turns a lightweight manga name into canonical Manga Blueprint project state and AI-ready handoff assets without requiring manual panel-by-panel GUI authoring.

```text
Name DSL
  -> parse / normalize intent
  -> derive IDs + layout + initial spatial placement
  -> manga-blueprint/0.2
  -> clean visual + annotated visual + prompt + manifest
```

The Web editor remains available as an optional visual refinement client for the generated `.manga.json`.

## Current input

See [`../core/name-schema.md`](../core/name-schema.md).

The DSL supports page directives and panel-level action, cast, expression, camera, background, dialogue, SFX, effects, and emphasis. Exact coordinates are intentionally compiler-owned.

## Current output contract

A compilation package is intended to contain:

```text
manifest.json
work.manga.json
P001.clean.svg
P001.blueprint.svg
P001.prompt.md
...
```

Roles:

- `manifest.json`: read-first package authority.
- `work.manga.json`: canonical semantic project state.
- `Pxxx.clean.svg`: spatial reference without action/dialogue/SFX labels.
- `Pxxx.blueprint.svg`: annotated review reference.
- `Pxxx.prompt.md`: page generation instructions and exact visible-text allowlist.

## AI co-authoring loop

A useful agent workflow is:

```text
human gives story/name
  -> AI writes/edits Name DSL
  -> compiler emits project + visuals
  -> AI or human reviews blueprint
  -> AI edits semantic source/project
  -> recompile or refine in Web editor
  -> generation package
```

When a user adjusts a compiled project manually in the Web editor, that edited project becomes the current authority. The system does not currently promise automatic reverse synchronization into the original Name source.

## Character refinement

Name DSL character tokens create `description`-mode reusable-character placeholders. If appearance is not specified, the compilation manifest marks the character as needing refinement. Before final rendering, identity may be completed via Web editing, direct canonical JSON editing, or future DSL appearance fields.

## Design constraints

- one canonical serialized project model;
- deterministic output for fixed source/options;
- no generated IDs or pixel coordinates required in normal Name authoring;
- exact visible strings remain explicitly allowlisted;
- clean spatial visuals never expose semantic authoring labels;
- provider-specific image-model instructions stay at the adapter/export edge;
- source round-trip is not implied.

## Current limitations

The compiler is intentionally a bounded initial compositor. It does not yet provide:

- sophisticated freeform manga layout search;
- explicit pose/contact DSL;
- appearance-sheet binding from Name input;
- quadrilateral/inset derivation from natural-language direction;
- deterministic PNG rasterization in the compiler package;
- automatic image-model invocation;
- bidirectional Name/project synchronization.

These are extension points, not reasons to push semantic ownership back into the Web UI.
