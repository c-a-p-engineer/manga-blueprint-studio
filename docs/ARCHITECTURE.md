# Architecture

## Runtime

The prototype is a zero-dependency static web application. `web/app.js` loads `web/app-1.js` through `web/app-11.js` as classic scripts. `app-10.js` keeps Prototype 0.7 localization/state hardening; `app-11.js` owns Prototype 0.8 story-readability behavior. GitHub Pages serves the exact static assets; no server, build step, external runtime script, analytics, or API is required.

## State

Browser state normalizes to `manga-blueprint/0.2`.

```text
Project
├─ meta
│  ├─ pageWidth / pageHeight
│  ├─ readingDirection (rtl | ltr)
│  ├─ canvasPreset / layoutPreset
│  ├─ storyTemplate
│  ├─ randomPurpose / randomSeed
│  ├─ randomVariant (balanced | dynamic | emotion)
│  └─ randomIntensity (stable | standard | bold)
├─ characterLibrary
│  └─ BaseCharacter
│     ├─ characterId / name / referenceKey / default pose
│     ├─ identityMode (sheet | description | free)
│     └─ appearance (summary / hair / eyes / outfit / features)
└─ Page
   └─ Panel
      ├─ rect / order / role
      ├─ actionIntent
      ├─ style / camera / background / effects
      ├─ characters (pose / expression / gaze / placement)
      ├─ balloons
      └─ assistSeed
```

`storyTemplate` and `actionIntent` are compatible optional additions. Legacy projects normalize missing values without migration files.

## Story action model

`Panel.actionIntent` captures the event/meaning that cannot reliably be inferred from pose alone. It is intentionally short free text. It is consumed by:

- Panel Peek / Panel List / Panel Chips;
- generation prompt under `STORY ACTION INTENT`;
- manifest `panelIntentIndex`.

It is not visible manga text and never enters `TEXT TO RENDER`.

## Story Template engine

`storyTemplates11` contains bounded editable rough-name recipes. A recipe selects one shipped `layoutRects04()` geometry and a beat per resulting panel. Beats can set role, localized action intent, pose, expression, gaze, camera, optional line effect/breakout, optional sample dialogue, and optional SFX.

Apply behavior:

1. preview template beat list without mutation;
2. user chooses whether sample dialogue/SFX is included;
3. if current page already contains authored content, request confirmation;
4. create panels from canonical layout geometry;
5. copy one reusable base character into beats when a base exists;
6. fit initial instance scale roughly to camera distance;
7. store `meta.storyTemplate` as provenance;
8. after apply, all state is ordinary editable project data.

No continuing template authority exists after apply.

## Character identity boundary

Character identity remains project-level and separate from pose instances.

- `sheet`: external Character Sheet required; `referenceKey` maps it.
- `description`: no sheet; appearance text becomes identity contract.
- `free`: no sheet; model may choose a simple consistent appearance.

Old bases with a reference key normalize to `sheet`; those without one normalize to `description`. In `free` mode appearance-detail controls are disabled so inactive values do not look authoritative.

The Output UI derives actual Character Sheet requirements from used base characters and writes the same map into manifest v3.

## Prompt identity contract

The older generic sentence that said character identity comes only from Character Sheets is overridden by Prototype 0.8. The compiler now states:

```text
Character visual identity follows CHARACTER IDENTITY GUIDANCE.
Use separately attached Character Sheets only for characters whose identity mode requires them.
```

`CHARACTER IDENTITY GUIDANCE` remains appended from reusable base-character state.

## Reading direction

`meta.readingDirection` is explicit. RTL is Japanese default; LTR is supported. Renumbering, layout thumbnails, Smart Manga previews, Panel List order, and generated prompt direction use the same value.

## Dynamic coordinate system

SVG viewBox, PNG export, layout generation, pointer bounds, character placement, balloon bounds, Story Template geometry, and Crop Guide use `meta.pageWidth` / `meta.pageHeight` rather than assuming 800×1130.

## Panel Peek / Panel List architecture

Panel Peek and Panel List are **derived authoring views**, not additional project models.

- `Panel Peek` reads current panel semantic state and shows action, characters, camera, background, dialogue, effects, and framing status;
- long-press is implemented through pointer events with movement cancellation;
- a visible SVG `ⓘ` overlay invokes the same dialog;
- on narrow screens the dialog is styled as a bottom sheet;
- detailed Panel List provides Shot-List-style semantic rows; compact mode uses the derived summary;
- selecting a row changes editor selection only.

Panel Chips and info buttons are inserted into the live editor SVG **after** canonical `renderSvg(true)` runs. They therefore do not exist in clean or annotated export serialization unless intentionally added later.

## Camera framing diagnostic and Crop Guide

The semantic camera model remains the source of truth. Prototype 0.8 adds heuristic authoring assistance to catch strong visual contradictions.

### Figure fill

The runtime estimates a figure's vertical pose extent from preset joint coordinates, multiplies it by instance scale, and compares it with panel height. Each camera distance has a broad acceptable range.

The diagnostic can return:

- `none` — no character to evaluate;
- `good` — broadly compatible;
- `small` — figure appears too small for selected camera distance;
- `large` — figure appears too large.

### Explicit fit

The user can press **fit character size to camera**. This adjusts only the selected/primary figure scale through normal undoable mutation. Warnings never mutate state automatically.

### Crop Guide

A dotted authoring-only rectangle is derived from camera distance and current primary character position. Close distances center it closer to the pose head; wider distances center nearer the character anchor. It is explanatory, not a second camera semantic contract and not exported to clean AI PNG.

## Manga Check

`mangaLint11()` derives advisory issues from current page state:

- missing `actionIntent`;
- camera/figure-scale conflict;
- repeated camera distance across three or more panels;
- all background locations unspecified on a multi-panel page;
- repeated primary expression across three or more panels.

Lint items may navigate to a panel but never block export or rewrite content.

## Smart Manga and selected-panel dice

Smart Manga remains bounded to shipped layouts/direction profiles, with three non-mutating candidates, reproducible seed, balanced/dynamic/emotion variants, stable/standard/bold intensity, optional base-character placement, and expanded purposes.

The selected-panel dice remains narrower: it preserves panel geometry, role, entered background content, and balloons/dialogue while re-proposing camera/effects/breakout plus placed-character pose/expression/gaze.

Story Templates and Smart Manga intentionally solve different problems: templates provide recognizable beat scripts; Smart Manga provides bounded alternative proposals.

## Layout / background / balloon presets

Layout thumbnails derive from the canonical layout geometry and require explicit apply.

Background location/weather/mood remain guided free text. Scene preset values follow selected UI language and remain independently editable after apply.

Balloon presets choose type/size/relative position. Applying to an existing selected balloon preserves its text and speaker.

## AI-safe render modes

- editor may contain anatomy colors, Panel Chips, `ⓘ`, Crop Guide, selected outlines, and authoring labels;
- canonical annotated export comes from `renderSvg(true)` and contains normal authoring metadata defined by the exporter;
- clean AI export removes authoring text/anatomy colors while preserving spatial composition, monochrome pose figures, balloon geometry, and effect lines;
- Prototype 0.8 dynamic editor overlays are not part of canonical export serialization.

AI-generation ZIP continues to exclude annotated PNG entirely.

## Prompt compiler

The compiler remains deterministic from current project state.

It preserves:

- clean-reference rule;
- strict `TEXT TO RENDER` allowlist;
- panel role/frame/camera/background/character/effect semantics;
- mode-aware `CHARACTER IDENTITY GUIDANCE`.

Prototype 0.8 additionally inserts:

```text
STORY ACTION INTENT:
- Panel 1: ...
- Panel 2: ...
```

only when panels contain action intent. This section is semantic instruction, not renderable text.

## Handoff manifest v3

Manifest schema string remains `manga-blueprint-export-manifest/3` for compatibility. Existing fields/file roles remain unchanged. Prototype 0.8 appends:

```text
storyTemplate
panelIntentIndex[]
  panelId
  order
  role
  actionIntent
```

The manifest remains the read-first authority. Character Sheets remain separate attachments unless a future explicit packaging feature changes that boundary.

## Export identity and package types

Project-state SHA-256, timestamp, UUID, and shared prefix behavior remain unchanged.

AI generation ZIP:

```text
<prefix>_clean.png
<prefix>.manga.json
<prefix>_prompt.txt
<prefix>_manifest.json
```

Review/archive ZIP adds `<prefix>_annotated.png`. Both package types share export identity for unchanged project state.

## UI hierarchy

Prototype 0.8 task hierarchy:

1. Page: Story Template / Smart Manga / visual layout.
2. Character: reusable identity source.
3. Panel Peek / Panel List: understand page quickly.
4. Panel editor: action intent + camera/framing + detailed refinement.
5. Background/Text/Effects: preset or free editing.
6. Output: AI-generation ZIP primary + short handoff copy; Review ZIP secondary.

## Persistence / privacy / deployment

`localStorage` stores autosave state; `.manga.json` is the portable artifact. All templates, lint, hashing, ZIP generation, appearance guidance, and diagnostics execute locally. GitHub Pages publishes static `web/`, schema, and examples. Validation remains dependency-free.
