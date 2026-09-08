# Architecture

## Runtime

The prototype is a zero-dependency static web application. `web/app.js` loads `web/app-1.js` through `web/app-9.js` as classic scripts. GitHub Pages serves the exact static assets; no server, build step, external script, analytics, or runtime API is required.

## State

Browser state normalizes to `manga-blueprint/0.2`.

```text
Project
├─ meta
│  ├─ pageWidth / pageHeight
│  ├─ readingDirection (rtl | ltr)
│  ├─ canvasPreset
│  ├─ layoutPreset
│  ├─ randomPurpose
│  ├─ randomSeed
│  ├─ randomVariant (balanced | dynamic | emotion)
│  └─ randomIntensity (stable | standard | bold)
├─ characterLibrary
│  └─ BaseCharacter
│     ├─ characterId / name
│     ├─ referenceKey
│     ├─ default pose
│     ├─ identityMode (sheet | description | free)
│     └─ appearance
│        ├─ summary
│        ├─ hair
│        ├─ eyes
│        ├─ outfit
│        └─ features
└─ Page
   └─ Panel
      ├─ rect / order / narrative role
      ├─ style / camera / background / effects
      ├─ characters (placed instances: pose / expression / gaze)
      ├─ balloons
      └─ assistSeed
```

These remain compatible additions to the 0.2 project format. Legacy projects normalize without requiring migration files.

## Character identity boundary

Character identity is project-level and separate from pose instances.

`identityMode` controls the downstream visual identity source:

- `sheet`: external Character Sheet is required. `referenceKey` is the matching key.
- `description`: Character Sheet is not required. Structured/free-text appearance guidance becomes the identity contract.
- `free`: Character Sheet is not required. The model may choose a simple appearance, but must maintain consistency across panels.

The runtime normalizer assigns old bases with a non-empty `referenceKey` to `sheet`; old bases without one become `description`. Appearance fields are normalized to empty strings when absent.

Placed character instances do not duplicate appearance guidance. They retain `characterId`; the library remains the identity source while the instance owns panel-specific pose/expression/gaze/placement.

## Character diagnostics

The Output UI derives an identity map from character IDs actually used on the current page. It identifies:

- external Character Sheets that must be attached separately;
- missing sheet reference keys;
- description-driven characters that need no sheet;
- intentionally open/free characters.

The same derived guidance is written into manifest v3.

## Reading direction

`meta.readingDirection` is explicit. RTL is the Japanese default; LTR is supported. Renumbering, visual layout thumbnails, Smart Manga previews, and generated prompt direction use the same value.

## Dynamic coordinate system

SVG viewBox, PNG export, layout generation, pointer bounds, character placement, and balloon bounds use `meta.pageWidth` / `meta.pageHeight` rather than fixed 800×1130 coordinates.

## Layout preset generator and thumbnail gallery

Preset geometry is generated from current page dimensions. The select box remains the canonical preset selector. Prototype 0.7 adds a derived thumbnail gallery that renders the same `layoutRects04()` geometry and reading-order numbering.

Thumbnail selection only changes the selected preset/help state; explicit apply invokes the existing layout-reset path so authored content is never discarded merely by browsing thumbnails.

## Smart Manga candidate engine

Smart Manga remains bounded to shipped layouts and direction profiles.

Prototype 0.7 expands purpose profiles with:

- romance / rom-com;
- cute;
- suspense;
- character introduction.

It also adds `randomIntensity`:

- `stable`: backs away from extreme close/dutch-angle choices and suppresses breakout proposals;
- `standard`: uses the baseline profile;
- `bold`: strengthens climax framing/effects and may propose breakout.

This intensity composes with the existing balanced/dynamic/emotion candidate variant. Candidate preview still does not mutate project state. Applying a candidate records purpose, seed, variant, and intensity.

## Selected-panel direction dice

The panel dice uses the expanded profile catalog and current project intensity while preserving panel geometry, role, entered background content, and balloons. It updates camera/effects/breakout and placed-character pose/expression/gaze, and remains undoable.

## Derived panel summaries

Panel summaries remain authoring-only derived artifacts. Prototype 0.7 adds primary expression, gaze, background/time, and a short dialogue snippet to the existing role/pose/camera/effect/breakout summary.

Because summaries are derived, they may change when UI language or source fields change without modifying `.manga.json`.

## Camera visual aid

The camera diagram is a lightweight SVG derived from selected camera distance and angle. It is explanatory UI, not a second camera model and not exported into the clean AI reference.

## Guided background presets

Background location/weather/mood remain free text with datalist suggestions. Scene presets simply write a coordinated starting set into the existing background fields. Once applied, every field remains independently editable.

## Balloon presets

Balloon presets operate on the existing balloon model. They choose type/size/relative placement. If no balloon is selected, a new balloon is created; if one is selected, its text/speaker are preserved while layout/type are updated.

## AI-safe render modes

- annotated/editor render may contain authoring metadata and anatomy colors;
- clean AI render removes authoring text/anatomy colors while preserving spatial composition, monochrome pose figures, balloon geometry, and effect lines.

AI generation ZIP continues to exclude the annotated PNG entirely.

## Prompt compiler

The compiler remains deterministic from project state and preserves the strict `TEXT TO RENDER` allowlist plus clean-reference rules.

Prototype 0.7 appends `CHARACTER IDENTITY GUIDANCE` for used base characters:

- sheet mode tells the assistant to use the separately attached sheet/reference key;
- description mode supplies appearance text and says no sheet is required;
- free mode explicitly leaves appearance open while requiring cross-panel consistency.

## Handoff manifest v3

Prototype 0.7 upgrades export manifests to `manga-blueprint-export-manifest/3`.

The existing compatibility fields remain, then v3 adds:

```text
fileEntries[]
  name
  role
  requiredForGeneration

instructions
  readFirst
  primaryVisual
  semanticContract
  generationInstructions
  annotatedReviewAllowedForGeneration
  characterSheetPolicy

characterGuidance[]
  characterId / displayName
  identityMode
  referenceKey
  appearance / appearanceText
  characterSheet.required / included / status

characterSheetsRequired[]
userMessageTemplate
```

The manifest is the read-first handoff authority. `fileEntries` distinguishes the clean spatial reference, semantic JSON, generation prompt, manifest itself, and optional human-review image.

Character Sheets are still external attachments; the ZIP does not claim they are included.

## Short handoff message

The Output tab derives one short message from current page character requirements. It instructs the assistant to extract the ZIP, read `*_manifest.json` first, and use separately attached Character Sheets only where the manifest marks them required.

The message is copyable but the manifest remains authoritative if the message and package ever disagree.

## Export identity and ZIP package types

Project-state SHA-256, timestamp, export UUID, and shared prefix behavior remain unchanged.

### AI generation ZIP

```text
<prefix>_clean.png
<prefix>.manga.json
<prefix>_prompt.txt
<prefix>_manifest.json
```

### Review / archive ZIP

```text
<prefix>_clean.png
<prefix>_annotated.png
<prefix>.manga.json
<prefix>_prompt.txt
<prefix>_manifest.json
```

Both package types share the same export identity for the same unchanged project state. The annotated PNG remains prohibited from the AI-generation package.

## UI hierarchy

Prototype 0.7 keeps the task-first hierarchy:

1. Page: Smart Manga or visual layout selection.
2. Character: reusable identity plus Sheet / description / free appearance source.
3. Panel: inspect stronger summary, camera explanation/diagram, optional panel dice.
4. Background/Text: presets provide quick starts while preserving free editing.
5. Output: AI-generation ZIP primary, short handoff copy, character identity map, Review ZIP secondary.

On narrow screens horizontal thumbnail strips remain scrollable and all action groups collapse to one-column layouts where necessary.

## Persistence and deployment

`localStorage` stores autosave state; `.manga.json` is the portable project artifact. GitHub Pages publishes `web/`, schema, and examples. Validation remains dependency-free.
