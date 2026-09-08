# Architecture

## Runtime

The prototype is a zero-dependency static web application. `web/app.js` loads `web/app-1.js` through `web/app-7.js` as classic scripts. GitHub Pages serves the exact static assets; no server, build step, external script, analytics, or runtime API is required.

## State

Browser state normalizes to `manga-blueprint/0.2`.

```text
Project
├─ meta
│  ├─ pageWidth / pageHeight
│  ├─ readingDirection (rtl | ltr)
│  ├─ canvasPreset
│  ├─ layoutPreset
│  └─ randomPurpose (optional provenance)
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
      └─ balloons
```

`canvasPreset`, `layoutPreset`, `randomPurpose`, and `characterLibrary` are compatible additions to the existing 0.2 format. Panel geometry remains canonical. A `custom` state is used when manual resize/splitting no longer matches a shipped preset.

Legacy projects without `characterLibrary` are normalized by deriving reusable base definitions from existing placed character identity fields without deleting or merging the placed instances.

## Reading direction

`meta.readingDirection` is an explicit behavioral input. `rtl` is the default for Japanese manga; `ltr` is also supported. Renumbering uses current panel geometry and this direction. Prompt compilation reads the same field so UI numbering and downstream reading instructions stay aligned.

## Dynamic coordinate system

The coordinate system is not fixed to 800×1130. SVG viewBox, PNG export, panel layout generation, pointer bounds, character placement, and balloon bounds use `meta.pageWidth` / `meta.pageHeight`.

Canvas resizing scales existing panel rects and placed character/balloon coordinates proportionally. Layout preset selection intentionally rebuilds panel geometry after confirmation when authored content would be discarded.

## Layout preset generator

Preset layouts are generated from page dimensions and gutters rather than storing pixel geometry for only one manuscript size. 4-koma 1×4, 2×2, action, conversation, climax, and grid layouts therefore adapt to square, portrait, landscape, print, and Webtoon canvases.

The internal preset id `standard` remains stable for compatibility, while its UI label is explicitly `800×1130 Portrait` / `800×1130 縦長（標準）` rather than an ambiguous “current size”.

## Smart Random

Smart Random operates over the finite preset catalog. Purpose tags and optional panel count filter valid candidates; a small direction profile seeds role/camera values. It does not generate arbitrary overlapping rectangles. This keeps the result understandable and fully editable.

## Reusable base characters

A base character is project-level identity metadata, not a page object. Placing one copies identity fields and the default pose into a new panel-specific character instance. The instance can then diverge in pose, expression, gaze, scale, rotation, and placement.

Editing base identity fields intentionally propagates `characterId`, display name, and Character Sheet reference key to placed instances that still share that identity. Saving a placed character as a base is an explicit user action.

## Beginner terminology and help

Camera state remains provider-neutral enum values such as `extreme-close` or `low-angle`. The UI maps those enums to `professional term + plain Japanese/English label + explanation`. Quick camera presets only write the same canonical camera fields; they do not create a second camera model.

The Help dialog is a maintained localized product surface. Its workflow, reading-direction, base-character, skeleton-color, background-input, camera, and export sections all use the same i18n state as the main UI.

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

## Prompt compiler

The compiler is deterministic from project state, includes canvas dimensions, reading direction, layout metadata, and the strict `TEXT TO RENDER` allowlist. It also states that any anatomy-guide colors in review references are not character-design instructions.

## Export identity

Every export starts from the serialized current project state.

1. `JSON.stringify(project)` is hashed with SHA-256 via Web Crypto.
2. The first ten hex characters form a filename-friendly short state hash.
3. A local timestamp (`YYYYMMDD_HHMMSS`) and sanitized project title form a shared prefix.
4. An in-session cache reuses the same prefix and UUID while the content hash is unchanged.
5. When project state changes, a new hash, timestamp, and export UUID are generated on the next export.

The full state hash identifies the serialized Manga Blueprint state. It is intentionally distinct from a PNG byte checksum because browser rasterization bytes may vary while the semantic/visual source state is the same.

## ZIP package

ZIP packaging runs entirely in the browser and adds no dependency. The prototype writes standard uncompressed ZIP entries (appropriate because PNG is already compressed) with CRC32 and a central directory.

Package contents:

```text
<prefix>_clean.png
<prefix>_annotated.png
<prefix>.manga.json
<prefix>_prompt.txt
<prefix>_manifest.json
```

The manifest stores export UUID, timestamp, full/short state hash, canvas, reading direction, and all filenames. PNG encoding is treated as a failure boundary; an empty/failed PNG is not silently packaged.

## Persistence and deployment

`localStorage` stores autosave state; `.manga.json` is the portable project artifact. GitHub Pages publishes `web/`, schema, and examples. Validation remains dependency-free.
