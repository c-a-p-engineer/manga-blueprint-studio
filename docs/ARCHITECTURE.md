# Architecture

## Runtime

The prototype is a zero-dependency static web application. `web/app.js` loads `web/app-1.js` through `web/app-8.js` as classic scripts. GitHub Pages serves the exact static assets; no server, build step, external script, analytics, or runtime API is required.

## State

Browser state normalizes to `manga-blueprint/0.2`.

```text
Project
├─ meta
│  ├─ pageWidth / pageHeight
│  ├─ readingDirection (rtl | ltr)
│  ├─ canvasPreset
│  ├─ layoutPreset
│  ├─ randomPurpose (optional provenance)
│  ├─ randomSeed (optional reproducibility)
│  └─ randomVariant (balanced | dynamic | emotion)
├─ characterLibrary
│  └─ BaseCharacter
│     ├─ characterId
│     ├─ name
│     ├─ referenceKey
│     └─ default pose
└─ Page
   └─ Panel
      ├─ rect / order / narrative role
      ├─ style / camera / background / effects
      ├─ characters (placed instances: pose / expression / gaze)
      ├─ balloons
      └─ assistSeed (optional panel-dice provenance)
```

The optional preset/assistance metadata and `characterLibrary` are compatible additions to the existing 0.2 format. Panel geometry remains canonical. A `custom` state is used when manual resize/splitting no longer matches a shipped preset.

Legacy projects without `characterLibrary` are normalized by deriving reusable base definitions from existing placed character identity fields without deleting or merging the placed instances.

## Reading direction

`meta.readingDirection` is an explicit behavioral input. `rtl` is the default for Japanese manga; `ltr` is also supported. Renumbering uses current panel geometry and this direction. Smart Manga candidate previews use the same ordering rule, and prompt compilation reads the same field so preview numbering, editor numbering, and downstream reading instructions stay aligned.

## Dynamic coordinate system

The coordinate system is not fixed to 800×1130. SVG viewBox, PNG export, panel layout generation, pointer bounds, character placement, and balloon bounds use `meta.pageWidth` / `meta.pageHeight`.

Canvas resizing scales existing panel rects and placed character/balloon coordinates proportionally. Layout preset selection intentionally rebuilds panel geometry after confirmation when authored content would be discarded.

## Layout preset generator

Preset layouts are generated from page dimensions and gutters rather than storing pixel geometry for only one manuscript size. 4-koma 1×4, 2×2, action, conversation, climax, and grid layouts therefore adapt to square, portrait, landscape, print, and Webtoon canvases.

The internal preset id `standard` remains stable for compatibility, while its UI label is explicitly `800×1130 Portrait` / `800×1130 縦長（標準）` rather than an ambiguous “current size”.

## Smart Manga candidate engine

Smart Manga operates over the finite preset catalog and direction profiles rather than generating arbitrary geometry.

1. User chooses purpose, optional panel count, canvas-preservation policy, optional selected-base-character placement, and a text seed.
2. A deterministic browser-local PRNG derives three candidates from that input.
3. Candidate layouts are selected only from compatible shipped presets.
4. Each candidate uses one emphasis profile: `balanced`, `dynamic`, or `emotion`.
5. Direction beats seed narrative role, camera, effects/background treatment and, when characters are present, pose/expression/gaze.
6. Candidate preview is derived data only. It does not change `project` state.
7. Explicit candidate selection rebuilds the page, records `meta.randomPurpose`, `meta.randomSeed`, and `meta.randomVariant`, then applies the chosen direction profile.

The seed is reproducibility provenance, not a permanent semantic requirement. Existing projects without it remain valid.

## Selected-panel direction dice

The panel dice reuses the same bounded direction-profile vocabulary at smaller scope. It intentionally preserves:

- panel rectangle and reading order;
- narrative role;
- entered background content;
- balloons/dialogue.

It may update camera fields, effect lines/strength, a climax breakout proposal, and pose/expression/gaze of characters already placed in the panel. `mutate()` records the prior state so Undo can recover it. `assistSeed` can be stored on the panel for provenance.

## Reusable base characters

A base character is project-level identity metadata, not a page object. Placing one copies identity fields and the default pose into a new panel-specific character instance. The instance can then diverge in pose, expression, gaze, scale, rotation, and placement.

Editing base identity fields intentionally propagates `characterId`, display name, and Character Sheet reference key to placed instances that still share that identity. Saving a placed character as a base is an explicit user action.

Smart Manga can optionally use the currently selected base character as the identity source for new panel instances. It does not mutate the base pose/expression itself.

## Beginner terminology and Help

Camera state remains provider-neutral enum values such as `extreme-close` or `low-angle`. The UI maps those enums to `professional term + plain Japanese/English label + explanation`. Quick camera presets only write the same canonical camera fields; they do not create a second camera model.

The Help dialog is a maintained localized product surface. Its workflow, reading-direction, base-character, skeleton-color, background-input, Smart Manga, camera, and export sections all use the same i18n state as the main UI.

## Guided free-text inputs

Background location, weather, and mood use native `<input list>` / `<datalist>` behavior. Suggestions are localized and local-only, while the stored semantic value remains arbitrary free text. This avoids adding a second closed vocabulary or external dependency.

## Stick-figure render modes

The same semantic pose has two visual treatments:

- **Editor / annotated review**: head, torso, arms, legs, and extremities use distinct authoring colors and joint markers for anatomical readability.
- **Clean AI**: the pose figure stays monochrome and omits authoring-only joint/color decoration.

The color distinction is a review aid, not character appearance.

## Panel summary

Panel summaries are derived UI artifacts, not stored source-of-truth text. They are compiled from role, pose/expression, camera, background, balloons, effects, and breakout. Summaries are allowed in the annotated review render and excluded from the clean AI render.

## AI-safe render modes

- **Annotated/editor render**: may contain panel number, readable camera labels, character display names, background/SFX metadata, anatomy colors, and panel summary.
- **Clean AI render**: removes authoring text and anatomy colors while preserving spatial composition, monochrome stick figures, balloon shapes, and effect lines.

Because image models may copy visible authoring text despite negative instructions, the AI generation ZIP does not include the annotated render at all.

## Prompt compiler

The compiler is deterministic from project state, includes canvas dimensions, reading direction, layout metadata, and the strict `TEXT TO RENDER` allowlist. It also states that anatomy-guide colors are not character-design instructions.

Prototype 0.6 appends an explicit reference-image boundary:

- use the clean PNG as the visual composition reference;
- the AI generation package intentionally excludes annotated/review PNGs;
- if an annotated image is separately supplied for discussion, its labels remain authoring metadata and are never final-art text.

## Export identity

Every export starts from the serialized current project state.

1. `JSON.stringify(project)` is hashed with SHA-256 via Web Crypto.
2. The first ten hex characters form a filename-friendly short state hash.
3. A local timestamp (`YYYYMMDD_HHMMSS`) and sanitized project title form a shared prefix.
4. An in-session cache reuses the same prefix and UUID while the content hash is unchanged.
5. When project state changes, a new hash, timestamp, and export UUID are generated on the next export.

The full state hash identifies the serialized Manga Blueprint state. It is intentionally distinct from a PNG byte checksum because browser rasterization bytes may vary while the semantic/visual source state is the same.

## ZIP package types

ZIP packaging runs entirely in the browser and adds no dependency. The runtime writes standard uncompressed ZIP entries with CRC32 and a central directory.

### AI generation ZIP

Recommended direct handoff to an image-generation assistant:

```text
<prefix>_clean.png
<prefix>.manga.json
<prefix>_prompt.txt
<prefix>_manifest.json
```

The annotated PNG is deliberately absent.

### Review / archive ZIP

Human review/storage package:

```text
<prefix>_clean.png
<prefix>_annotated.png
<prefix>.manga.json
<prefix>_prompt.txt
<prefix>_manifest.json
```

Both packages reuse the same export identity when project state is unchanged. ZIP filenames append `_ai.zip` or `_review.zip` to make intended use visible.

The manifest uses `manga-blueprint-export-manifest/2`, records `packageType`, export UUID, timestamp, full/short state hash, canvas, reading direction, file mapping, `visualReference`, optional `authoringReview`, and a handoff rule. PNG encoding is treated as a failure boundary; an empty/failed PNG is not silently packaged.

## UI hierarchy

The editor keeps authoring breadth without forcing every control into the first decision surface.

- Page tab gives a short recommended workflow and makes Smart Manga visible as a starting path.
- Smart Manga moves complexity into candidate comparison: users choose between three meaningful proposals rather than editing many camera enums before seeing a direction.
- Panel tab exposes the narrower panel dice near the current-panel summary.
- Output tab presents AI generation ZIP as the primary handoff action and Review / archive ZIP as secondary.
- On narrow screens candidate cards collapse from three columns into vertically readable cards without requiring hover.

## Persistence and deployment

`localStorage` stores autosave state; `.manga.json` is the portable project artifact. GitHub Pages publishes `web/`, schema, and examples. Validation remains dependency-free.
