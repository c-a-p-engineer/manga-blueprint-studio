# Blueprint Engine

## Purpose

The Blueprint Engine turns AI-authored manga intent into an **Executable Name**: canonical semantic state plus a generation-facing spatial prototype and a human-review annotated view.

```text
human natural language
  -> AI Name DSL
  -> semantic grammar
  -> panel energy + attention + reading flow
  -> Layout Recipe retrieval + candidate scoring
  -> deterministic seed/mutation
  -> diagonal/inset/bleed/breakout modifiers
  -> pose/contact/shape resolution
  -> deterministic 2D skeleton + prop/contact anchors
  -> manga-blueprint/0.2
  -> layered executable-name renderer
  -> clean visual + annotated visual + executable prompt + manifest
  -> optional local SVG -> PNG rasterization
```

The Web editor remains optional. Its role is visual refinement of the same canonical project state, not ownership of the automation path. The public `/layout-catalog.html` and editor Recipe controls use the same `core/layout-recipes.mjs` definitions as the CLI/solver.

## Input

See [`../core/name-schema.md`](../core/name-schema.md). The AI-facing DSL expresses story beats and manga intent rather than coordinates. Current semantics include importance/hold, attention, reading flow, cast, pose, gaze, depth, support, motion phase, body/prop contact, camera, background, visible text/effects, irregular panel boundaries and one-level insets.

## Layout solver

The compiler now retrieves candidate **Base Recipes** from `core/layout-recipes.mjs`. Recipe families include balanced/vertical rhythms, hero top/bottom/right, dialogue stagger, action step, detail payoff, quiet build, wide-middle, ladder, three-band, and cinematic stack. Recipes are parameterized by panel count rather than stored as thousands of static images.

For a fixed Recipe + panel count + seed + mutation value, geometry is deterministic. `seed` chooses the reproducible nearby variant and `mutation` controls bounded ratio variation. Candidates are then scored against panel energy, hold, explicit size intent, reading direction, flow hints, and Direction Advisor signals. The winning recipe, candidate scores, seed, mutation, and base/inset counts are stored in `layoutDecision`.

Base-layout selection and manga expression are separate stages. Diagonal frames are applied after a Base Recipe through geometry modifiers; panel-in-panel children do not consume a Base Recipe slot; bleed and breakout remain panel-level direction. This prevents a technique such as `斜めコマ` from becoming the layout topology itself.

Panel importance is a layout weight, not a direct `importance = large panel` rule.

When the winning layout changes panel geometry, derived character, balloon and reserved-region anchors are reprojected into the solved rectangle before pose/contact solving. Insets apply the same reflow rule, so generated spatial references do not retain stale coordinates from bootstrap geometry.

## Spatial Intelligence v3

`core/composition-solver.mjs` derives in-panel subject placement constraints, reserved-region avoidance, negative-space planning and detail/salience levels without changing panel boundaries. Explicit placement locks remain authoritative.

`core/pose-contact-solver.mjs` v3 adds deterministic torso/pelvis orientation, center of mass, support polygon, balance state, joint-angle diagnostics, perspective hints and crouched/seated/lying/leaning posture families while preserving structured contact solving.

`core/continuity-graph.mjs` derives cross-panel/page character state edges for screen side, facing, prop hand, outfit/condition and explicit continuity breaks.

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

`Pxxx.blueprint.svg` adds a human-review layer over the exact same art geometry. The review layer may show compact beat summaries, character labels, primary/secondary attention markers, gaze guides, contact labels, camera/energy information and diagnostics. These annotations exist to make authored intent reviewable without reconstructing meaning from canonical JSON. They are never part of the generation-facing spatial contract and must not leak into `Pxxx.clean.svg`.

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

## Observation extraction foundation

The first post-generation observation layer is provider-neutral and non-mutating.

`core/observation-extractor.mjs` exposes:

- `manga-blueprint-observation-request/1` — tells an external vision/manual adapter what page and observable classes to inspect without supplying expected geometry to copy;
- `manga-blueprint-observation/1` — normalized structural evidence in project coordinate space;
- `manga-blueprint-observation-evaluation/1` — scoped Structural Evaluator output plus observation coverage and explicit diagnostics.

Supported observation classes currently include panel geometry, character occupancy, optional pose joints/contact points, reading direction, writing mode and visible text. Normalized observations can use normalized, pixel or project coordinates.

The Core module does **not** inspect raster pixels itself and does not depend on a particular vision provider. A later provider plugin may turn a generated image into the portable observation contract. Manual/structured observation is already usable for tests, review tooling and adapter development.

Missing observation fields are treated as missing evidence rather than copied from authored state. This prevents a partially observed image from receiving a misleading perfect structural score.

## Human-approved repair and deterministic lettering

Post-generation drift may be converted into `manga-blueprint-repair-plan/1`. No action is applied until the caller creates an explicit approval. Approved render/lettering constraints become a provider-neutral repair context; canonical semantic mutation is a separate whitelist-bounded operation requiring explicit approval.

`core/lettering-renderer.mjs` creates a deterministic glyph-position plan and transparent SVG overlay from the exact authored dialogue/SFX strings. CLI packages emit both `Pxxx.lettering.json` and `Pxxx.lettering.svg`.

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

## Contact Sheet preflight

For multi-page work the headless CLI can produce a single batch-preflight surface:

```bash
npm run blueprint -- path/to/name.md blueprint-out --contact-sheet --contact-columns 4
```

For an eight-page work with four columns, the review order is:

```text
P001 P002 P003 P004
P005 P006 P007 P008
```

Each cell remains an independent full manga page with its own internal reading direction. Page-cell order is a review index and does not replace the page's RTL/LTR contract.

Additional outputs:

```text
contact-sheet.clean.svg
contact-sheet.clean.png        # best-effort local rasterization
contact-sheet.prompt.md
contact-sheet.review.json
contact-sheet.generation.json
```

`contact-sheet.prompt.md` includes the global reusable-character contract and the complete per-page executable briefs. Resolved outfit/condition continuity therefore survives the merge instead of being reduced to generic phrases such as "school uniform".

`contact-sheet.review.json` maps every page cell back to canonical page/panel/character state and requests high-priority checks for page order, panel topology, identity, outfit continuity, scene continuity and reading flow.

Contact Sheet is **preflight only**. Its scale makes exact glyph quality, fingers and subtle face detail lower-confidence checks. Use its per-page `pass | review | repair` outcome to send only affected pages back through the ordinary page-level generation/review loop.
