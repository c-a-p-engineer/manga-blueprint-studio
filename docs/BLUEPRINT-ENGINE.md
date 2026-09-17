# Blueprint Engine

## Purpose

The Blueprint Engine turns AI-authored manga intent into an **Executable Name**: canonical semantic state plus a generation-facing spatial prototype and a human-review annotated view.

```text
human natural language
  -> AI Name DSL
  -> semantic grammar
  -> panel energy + attention + reading flow
  -> candidate layout solver
  -> pose/contact/inset/shape resolution
  -> manga-blueprint/0.2
  -> layered executable-name renderer
  -> clean visual + annotated visual + prompt + manifest
```

The Web editor remains optional. Its role is visual refinement of the same canonical project state, not ownership of the automation path.

## Input

See [`../core/name-schema.md`](../core/name-schema.md).

The AI-facing DSL expresses story beats and manga intent rather than coordinates. Current semantics include:

- narrative / visual / transition importance;
- hold / pacing weight;
- primary and secondary attention targets;
- reading-flow entry / exit hints;
- cast, pose, gaze, foreground/background depth;
- support and motion phase;
- structured body/prop contact;
- camera, background, visible text and effects;
- diagonal/trapezoid boundaries and one-level insets.

## Layout solver

For each page the compiler generates bounded deterministic candidates such as balanced grid, vertical rhythm, hero-top, hero-bottom, action-diagonal and inset-focus. Candidates are scored against panel energy, hold, explicit size intent, inset needs, reading direction and flow hints. The winning decision and candidate scores are stored on the page as `layoutDecision` for explainability.

Important: panel importance is a **layout weight**, not a direct `importance = large panel` rule. Relative energy and competition with neighboring beats decide the final geometry.

## Executable Name renderer

One geometry source produces both views:

```text
canonical project state
        |
        +-- art layer --------> P001.clean.svg
        |
        +-- annotation layer -> P001.blueprint.svg
```

### Clean

`Pxxx.clean.svg` is the generation-facing black spatial contract. It contains page/panel boundaries, coarse body silhouettes/pose direction and balloon regions. It must not expose authoring labels, character names, action notes, energy values, contact labels or colored review arrows.

The design goal is:

> the final generated manga should preserve the Clean page's panel geometry and coarse composition closely enough that a human can predict the result from the Clean image.

### Annotated

`Pxxx.blueprint.svg` adds colored review-only semantics over the exact same art layer. Blue is used for flow/camera/energy guidance, red for primary attention/contact constraints, and gray for explanatory action notes. The annotation layer is for human/agent review and is not the default image-generation input.

## Package

```text
manifest.json
work.manga.json
P001.clean.svg
P001.blueprint.svg
P001.prompt.md
...
```

Roles:

- `manifest.json`: read-first package authority;
- `work.manga.json`: canonical semantic state;
- `Pxxx.clean.svg`: generation-facing spatial contract;
- `Pxxx.blueprint.svg`: human-review overlay over the same geometry;
- `Pxxx.prompt.md`: semantic rendering instructions and exact visible-text allowlist.

The CLI records the layered renderer role in `manifest.blueprintRenderer`.

## AI co-authoring loop

```text
human story / direction
  -> ChatGPT or coding agent creates AI Name DSL
  -> CLI compiles Executable Name
  -> human reviews annotated view
  -> agent edits semantic source
  -> recompile
  -> clean visual + prompt + canonical state go to image generation
```

A Web user may instead import/refine the canonical project visually. Manual Web edits make that project state authoritative; automatic reverse synchronization into the original Name source is not promised.

## Design constraints

- one canonical serialized project model;
- deterministic output for fixed source/options;
- no IDs, joint coordinates or pixel geometry required from the AI author when the compiler can derive them;
- layout decisions remain inspectable/explainable;
- clean and annotated views share exactly one geometry/art source;
- exact visible strings remain explicitly allowlisted;
- provider-specific image-model behavior stays at the adapter edge;
- source round-trip is not implied.

## Remaining extension points

The core Executable Name path now covers energy/attention, candidate layout solving, irregular/inset geometry, pose/gaze/depth/support/motion/contact semantics, layered rendering and deterministic CLI packages. Further quality work should focus on richer articulated pose rendering, stronger contact-point solving, automatic raster adapters, appearance/reference binding, page-turn/spread semantics, and provider-specific generation adapters rather than rebuilding these concerns in the Web UI.
