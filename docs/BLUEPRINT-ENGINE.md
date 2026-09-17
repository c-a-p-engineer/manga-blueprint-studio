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
  -> deterministic 2D skeleton + prop/contact anchors
  -> manga-blueprint/0.2
  -> layered executable-name renderer
  -> clean visual + annotated visual + executable prompt + manifest
  -> optional local SVG -> PNG rasterization
```

The Web editor remains optional. Its role is visual refinement of the same canonical project state, not ownership of the automation path.

## Input

See [`../core/name-schema.md`](../core/name-schema.md). The AI-facing DSL expresses story beats and manga intent rather than coordinates. Current semantics include importance/hold, attention, reading flow, cast, pose, gaze, depth, support, motion phase, body/prop contact, camera, background, visible text/effects, irregular panel boundaries and one-level insets.

## Layout solver

For each page the compiler generates bounded deterministic candidates such as balanced grid, vertical rhythm, hero-top, hero-bottom, action-diagonal and inset-focus. Candidates are scored against panel energy, hold, explicit size intent, inset needs, reading direction and flow hints. The winning decision and candidate scores are stored as `layoutDecision`.

Panel importance is a layout weight, not a direct `importance = large panel` rule.

## Pose / contact solver

`core/pose-contact-solver.mjs` converts semantic pose IDs into deterministic 2D render geometry. The derived `renderPose` contains a skeleton, facing/lean state and inferred props. The solver currently recognizes action/guard/recoil/airborne families and sword/slash poses.

Structured contacts such as:

```text
接触: fighter-a.sword > fighter-b.sword
```

are resolved to a shared spatial anchor. For sword-vs-sword contact, both blade tips are moved to the same deterministic point. `renderContacts` stores the resolved point for review overlays. Semantic intent remains canonical; these coordinates are derived and reproducible.

## Executable Name renderer

One solved geometry source produces both views:

```text
canonical semantics
      -> solved layout / pose / contact
             |
             +-- art layer --------> P001.clean.svg
             |
             +-- annotation layer -> P001.blueprint.svg
```

### Clean

`Pxxx.clean.svg` is the generation-facing black spatial contract. It contains panel boundaries, articulated coarse skeletons, inferred weapon lines and balloon regions. It contains no authoring labels, names, action notes, energy values, contact labels, colored markers or annotation-only SVG definitions.

### Annotated

`Pxxx.blueprint.svg` adds flow/camera/energy guidance and explicit contact markers over the exact same art layer. It is for human/agent review, not the default image-generation input.

## Raster output

The CLI always emits canonical SVG. It also attempts PNG output using an installed local rasterizer, in this order: `magick`, `rsvg-convert`, then `convert` on non-Windows systems. Rasterization is deliberately adapter-level: absence of a rasterizer never invalidates the canonical package. `manifest.rasterization` records the actual engine/result.

## Generation brief

`Pxxx.prompt.md` is now an executable semantic brief. In addition to action/camera/background/text, it carries panel energy, primary attention, reading flow, pose, expression, gaze, support, motion, depth and structured contacts. The clean image is the spatial authority; `work.manga.json` remains semantic authority.

## Package

```text
manifest.json
work.manga.json
P001.clean.svg
P001.clean.png       # when a rasterizer is available
P001.blueprint.svg
P001.blueprint.png   # when a rasterizer is available
P001.prompt.md
...
```

The manifest records renderer, pose solver, rasterization status and authority roles.

## AI co-authoring loop

```text
human story / direction
  -> ChatGPT or coding agent creates AI Name DSL
  -> CLI compiles Executable Name
  -> human/agent reviews annotated view
  -> agent edits semantic source if needed
  -> recompile
  -> clean visual + executable prompt + canonical state
  -> image generation adapter/model
```

A Web user may instead import/refine the canonical project visually. Manual Web edits make that project state authoritative; automatic reverse synchronization into the original Name source is not promised.

## Design constraints

- one canonical serialized project model;
- deterministic output for fixed source/options;
- no IDs, joint coordinates or pixel geometry required from the AI author when derivable;
- layout decisions remain inspectable;
- clean and annotated views share one solved art source;
- exact visible strings remain explicitly allowlisted;
- provider-specific image-model behavior stays at the adapter edge;
- source round-trip is not implied.

## Remaining extension points

The local/compiler side now covers semantic grammar, energy/attention, candidate layout solving, irregular/inset geometry, deterministic articulated pose rendering, prop/body contact anchors, layered clean/annotated rendering, executable generation briefs, deterministic packages and best-effort PNG rasterization.

Remaining work is mostly outside the provider-independent compiler boundary: richer anatomy/IK, arbitrary prop libraries, appearance/reference-sheet binding, page-turn/spread semantics, and provider-specific image-generation invocation/evaluation. Those should be adapters or later quality layers rather than reasons to move semantic ownership into the Web UI.
