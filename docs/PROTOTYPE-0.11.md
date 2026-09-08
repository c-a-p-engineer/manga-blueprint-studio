# Prototype 0.11 — Art Direction and Model-Independent Spatial Semantics

## Objective

Reduce provider-to-provider drift when the same Manga Blueprint is handed to different image-generation assistants.

Prototype 0.11 separates four contracts that should not silently overwrite each other:

1. **Character identity** — who the character is.
2. **Art direction** — how the finished manga should be drawn.
3. **Spatial / motion semantics** — support, airborne state, motion phase, foreground target, and foreshortening.
4. **Scene continuity** — which panels share one location and which visual anchors must remain stable.

The clean PNG remains a spatial reference; `.manga.json`, prompt, and manifest preserve the semantic contract.

## Global art direction

`meta.artDirection` is project-global and editable.

It supports:

- color: unspecified, full color, monochrome, grayscale, limited palette;
- rendering style: anime, manga, pencil, ink, watercolor, webtoon, cel, realistic, sketch, retro manga, chibi;
- line work: clean, bold, fine, rough, brush, pencil;
- shading/fill: flat, cel, soft, screentone, crosshatch, pencil, painted;
- overall detail level;
- background finish;
- free-form palette, tone, and additional style notes.

Shipped presets include Color Anime, Monochrome Manga, Pencil, Ink, Webtoon, Watercolor, Rough Storyboard, and Cinematic.

### Invariant

Art direction controls **rendering language only**. It must not replace character identity, pose, camera, panel layout, dialogue, or scene semantics.

## Character identity readiness

`identityMode=description` is still allowed without a Character Sheet, but an empty appearance description is flagged as a readiness warning because different providers may invent different characters.

The warning is advisory: export remains possible.

`identityMode=free` remains the explicit choice when the user intentionally wants downstream AI to design the appearance.

Character Sheets are required only for `identityMode=sheet`.

## Pose support and motion semantics

Placed characters may store:

- `supportState`: `auto | grounded | airborne | supported | unknown`
- `motionPhase`: `auto | still | anticipation | approach | launch | airborne | impact | recovery`

`auto` resolves from the selected pose preset.

New pose presets include:

- airborne approach;
- dive attack;
- aerial straight punch;
- guard stance;
- front kick.

The shipped Aerial Attack Scene Template no longer uses a grounded run pose for its airborne approach. It uses aerial-specific poses for the approach and strike.

## Depth and foreshortening

Panel camera semantics may store:

- `depthTarget`: which body part/object is pushed toward the camera;
- `foreshortening`: normal, strong, or extreme.

For `near-object` shots, the clean blueprint adds a monochrome foreground cue at the resolved joint when possible. The cue is intended to make Z-axis intent visible even to assistants that rely heavily on the clean PNG.

The semantic prompt also states that a near-object target should become visibly larger through perspective rather than merely moving sideways in 2D.

## Scene continuity

Panel backgrounds may store:

- `sceneId` — stable user-defined scene identity;
- `continuityFrom` — another panel whose location should be treated as the same scene;
- `anchorNotes` — fixed visual facts such as window/bed/desk placement.

These fields are semantic continuity guidance and do not become visible manga text.

## Generation readiness

The Output view performs non-blocking readiness checks for conditions including:

- Character Sheet mode without a reference key;
- description identity with no appearance guidance;
- unspecified global color/render style;
- near-object framing without a resolvable foreground target;
- action intent that describes airborne motion while the placed character is explicitly grounded.

Readiness is also included in the export manifest as advisory metadata.

## Prompt / manifest handoff

The generated prompt contains dedicated sections for:

- global art direction;
- existing character identity guidance;
- existing story action intent;
- pose/support/motion/depth/scene continuity;
- existing lettering-direction and exact-text contracts.

Manifest v3 keeps its schema identifier and adds derived `artDirection`, `generationReadiness`, and `spatialSemantics` data.

## Compatibility

- Project format remains `manga-blueprint/0.2`.
- Manifest remains `manga-blueprint-export-manifest/3`.
- New project fields are optional and normalized when absent.
- Legacy projects keep existing layout, camera, character, text, and effects data.
- Core remains provider-independent; no provider API is introduced.

## Deliberate non-goals for this increment

Prototype 0.11 does **not** yet perform deterministic post-generation Japanese lettering overlay. Exact dialogue/SFX strings and writing directions continue to be handed to the downstream assistant under the existing `TEXT TO RENDER` contract.

A future lettering layer can move final Japanese glyph rendering out of the image model once SFX placement/rotation/scale semantics are explicit enough to make that deterministic.

## Acceptance

Prototype 0.11 is complete when:

- art-direction controls are editable in JA/EN and persist in project JSON;
- prompt and manifest carry global art direction;
- old projects normalize without a format bump;
- aerial poses visibly communicate no ground support;
- the Aerial Attack template uses aerial-specific poses;
- near-object shots can record a foreground target and foreshortening strength;
- clean blueprint can expose the foreground target without leaking authoring text;
- scene continuity fields persist and reach prompt/manifest;
- readiness checks remain advisory;
- syntax and repository contract validations pass;
- GitHub Pages deploys the validated runtime.
