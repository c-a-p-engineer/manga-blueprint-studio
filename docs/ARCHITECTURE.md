# Architecture

## Runtime

The prototype is a zero-dependency static web application. `web/app.js` loads `web/app-1.js` through `web/app-17.js` as classic scripts. `app-10.js` keeps Prototype 0.7 localization/state hardening; `app-11.js` owns Prototype 0.8 story-readability behavior; `app-12.js` contains Smart Manga action-intent alignment plus mobile Panel Peek hardening; `app-13.js` owns Prototype 0.9 Scene Template Studio; `app-14.js` provides 0.9 localization/feedback hardening; `app-15.js` adds Prototype 0.10 balloon writing direction; `app-16.js` synchronizes panel order with selected reading direction; `app-17.js` integrates Scene Template numbering/beat assignment with that order and adds per-panel SFX writing-direction state/UI/prompt/manifest metadata. GitHub Pages serves exact static assets; no server, build step, external runtime script, analytics, or API is required.

## State

Browser state normalizes to `manga-blueprint/0.2`.

```text
Project
├─ meta
│  ├─ pageWidth / pageHeight
│  ├─ readingDirection (rtl | ltr)
│  ├─ defaultWritingMode (vertical-rl | horizontal-tb)
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
      ├─ style / camera / background
      ├─ effects
      │  └─ sfxWritingMode (inherit | vertical-rl | horizontal-tb)
      ├─ characters (pose / expression / gaze / placement)
      ├─ balloons
      │  └─ writingMode (inherit | vertical-rl | horizontal-tb)
      └─ assistSeed
```

`storyTemplate`, `actionIntent`, `defaultWritingMode`, balloon `writingMode`, and SFX `sfxWritingMode` are compatible optional additions. Prototype 0.10 does not change the project schema version. Legacy projects normalize missing writing-mode state to vertical-first behavior.

## Story action model

`Panel.actionIntent` captures the event/meaning that cannot reliably be inferred from pose alone. It is intentionally short free text. It is consumed by Panel Peek / Panel List / Panel Chips, generation prompt under `STORY ACTION INTENT`, and manifest `panelIntentIndex`. It is not visible manga text and never enters `TEXT TO RENDER`.

## Scene Template Studio

### Built-in registry

`storyTemplates11` remains the canonical in-memory recipe registry created by Prototype 0.8. Prototype 0.9 extends that mutable registry with additional romance, battle, emotion, daily, comedy, suspense, and character-introduction recipes.

`meta13` is derived authoring metadata for template discovery: category, localized description, localized use case, and search tags. It does not become project state.

### Discovery views

Template Studio adds category filtering, free-text search, visual cards, layout thumbnails, panel count/category, description/use case, and selected-template beat-flow preview.

Browsing/searching/selecting changes only transient authoring UI state. It does not mutate the manga page.

Prototype 0.10 overrides template thumbnail numbering in `app-17.js`. Ordering is calculated from page-scale template geometry through the existing reading-order preview function; those numbers are then drawn onto thumbnail-scale geometry. Using page-scale geometry avoids thumbnail dimensions changing row-grouping semantics.

### Apply path

Template apply resolves shipped/custom geometry, confirms destructive replacement when authored content exists, creates ordinary panel state, and records `meta.storyTemplate` as provenance.

Prototype 0.10's integrated apply path then:

1. creates all panels from the template geometry;
2. calls the canonical geometry/read-direction renumbering path;
3. obtains panels in `readingOrderedPanels16()` order;
4. assigns template beat `N` to panel order `N`;
5. copies role/action/camera/background/effects;
6. optionally copies sample dialogue/SFX;
7. initializes template-created SFX writing mode as `inherit`;
8. places the selected/project reusable base character when available;
9. selects panel order 1.

No continuing template authority remains after apply. The important contract is that thumbnail number, panel `order`, and applied beat index all express the same reading sequence.

### Bounded derivation

`deriveTemplate13()` clones the selected recipe into one temporary derived recipe. It intentionally preserves action/beat sequence while varying a bounded subset of camera distance/angle and emphasis/effect choices. The variation is preview-only until explicit apply.

### Browser-local custom templates

Custom templates use `manga-blueprint-studio/custom-story-templates/0.9` in `localStorage`.

A custom template stores normalized panel rectangles, panel role/action intent, pose/expression/gaze without character identity, camera, background, optional dialogue/SFX, and selected effects. Character-specific visual identity and Character Sheet data are excluded. On reapply, geometry scales to current canvas and current reusable base character is used when available.

## Character identity boundary

Character identity remains project-level and separate from pose instances.

- `sheet`: external Character Sheet required; `referenceKey` maps it.
- `description`: no sheet; appearance text becomes identity contract.
- `free`: no sheet; model may choose a simple consistent appearance.

Old bases with a reference key normalize to `sheet`; those without one normalize to `description`. In `free` mode appearance-detail controls are disabled so inactive values do not look authoritative.

The Output UI derives actual Character Sheet requirements from used base characters and writes the same map into manifest v3.

## Prompt identity contract

The compiler states:

```text
Character visual identity follows CHARACTER IDENTITY GUIDANCE.
Use separately attached Character Sheets only for characters whose identity mode requires them.
```

`CHARACTER IDENTITY GUIDANCE` remains appended from reusable base-character state.

## Reading direction and panel order

`meta.readingDirection` is explicit. RTL is Japanese default; LTR is supported.

Prototype 0.10 treats panel `order` as synchronized semantic state derived from current geometry plus reading direction before committed renders. `readingOrderedPanels16()` groups panels into horizontal reading rows using page-relative Y tolerance, then orders X descending for RTL or ascending for LTR. `renumberPanels()` assigns sequential `order` values.

The synchronized order is shared by canvas badges, Scene Template thumbnail numbering/beat placement, Panel Peek/List, generated prompt, manifest-derived semantics, and exports. Changing text writing direction does not participate in this algorithm.

## Lettering direction

`app-15.js` establishes the project/balloon lettering model:

```text
meta.defaultWritingMode = vertical-rl | horizontal-tb
balloon.writingMode = inherit | vertical-rl | horizontal-tb
```

`app-17.js` extends the same model to per-panel onomatopoeia:

```text
panel.effects.sfxWritingMode = inherit | vertical-rl | horizontal-tb
```

`vertical-rl` is the project default. `inherit` resolves against `meta.defaultWritingMode` for both balloons and SFX.

Editor and annotated review balloon rendering use an authoring-only text preview. Horizontal preview wraps into centered lines; vertical preview lays glyphs top-to-bottom and columns right-to-left. SFX writing direction is recorded semantically and exposed in the effects editor; clean AI render continues to omit SFX labels.

The prompt adds `LETTERING DIRECTION` for balloons and `SFX LETTERING DIRECTION` for non-empty onomatopoeia. The exact visible strings remain exclusively under `TEXT TO RENDER`.

Manifest v3 keeps its existing schema identifier while its derived `lettering` object may contain balloon entries plus an `onomatopoeia` array with stored/effective writing mode per non-empty SFX.

## Dynamic coordinate system

SVG viewBox, PNG export, layout generation, pointer bounds, character placement, balloon bounds, Story Template geometry, custom-template normalized geometry, and Crop Guide use `meta.pageWidth` / `meta.pageHeight` rather than assuming 800×1130.

## Panel Peek / Panel List architecture

Panel Peek and Panel List are **derived authoring views**, not additional project models.

- Panel Peek reads current panel semantic state and shows action, characters, camera, background, dialogue, effects, and framing status;
- long-press uses pointer events with movement cancellation;
- a visible SVG `ⓘ` invokes the same dialog;
- on narrow screens the dialog is an opaque viewport-bounded bottom sheet with fixed header/actions and scrollable semantic body;
- detailed Panel List provides Shot-List-style semantic rows; compact mode uses the derived summary;
- selecting a row changes editor selection only.

Panel Chips and info buttons are inserted into the live editor SVG after canonical render. They do not exist in clean AI serialization.

## Camera framing diagnostic and Crop Guide

The semantic camera model remains the source of truth. The runtime estimates a figure-to-panel fill ratio and warns about strong contradictions. Warnings never mutate state automatically. Explicit **fit character size to camera** adjusts only the selected/primary figure scale through normal undoable mutation. Crop Guide remains authoring-only.

## Manga Check

Manga Check derives advisory issues from current page state: missing `actionIntent`, camera/figure-scale conflict, repeated camera distance, all background locations unspecified on a multi-panel page, and repeated primary expression. Lint may navigate to a panel but never blocks export or rewrites content.

## Smart Manga and selected-panel dice

Smart Manga remains bounded to shipped layouts/direction profiles, with three non-mutating candidates, reproducible seed, balanced/dynamic/emotion variants, stable/standard/bold intensity, optional base-character placement, and expanded purposes.

The selected-panel dice preserves panel geometry, role, entered background content, and balloons/dialogue while re-proposing camera/effects/breakout plus placed-character pose/expression/gaze.

Scene Template Studio and Smart Manga intentionally solve different problems: templates provide recognizable scene scripts and local reusable patterns; Smart Manga provides bounded alternative proposals from a purpose.

## AI-safe render modes

- editor may contain anatomy colors, Panel Chips, `ⓘ`, Crop Guide, selected outlines, authoring labels, and balloon writing-direction text previews;
- canonical annotated export contains normal authoring metadata defined by the exporter;
- clean AI export removes authoring text/anatomy colors/balloon and SFX text while preserving spatial composition, monochrome pose figures, balloon geometry, and effect lines;
- dynamic editor overlays and Template Studio UI are never part of canonical export serialization;
- AI-generation ZIP excludes annotated PNG entirely.

## Prompt compiler and manifest

The compiler remains deterministic from current project state. It preserves clean-reference rule, strict `TEXT TO RENDER` allowlist, panel semantics, `STORY ACTION INTENT`, mode-aware `CHARACTER IDENTITY GUIDANCE`, `LETTERING DIRECTION`, and `SFX LETTERING DIRECTION` guidance.

Manifest v3 remains the read-first authority and may record `storyTemplate` provenance plus `panelIntentIndex` and derived lettering metadata. The included semantic `.manga.json` and prompt carry writing-direction state. Browser-local template library contents are never exported automatically.

## Persistence / privacy / deployment

`localStorage` stores autosave state and Prototype 0.9 custom templates; `.manga.json` is the portable project artifact. All templates, search, derivation, lettering preview, SFX writing-direction controls, reading-order synchronization, lint, hashing, ZIP generation, appearance guidance, and diagnostics execute locally. GitHub Pages publishes static `web/`, schema, and examples. Validation remains dependency-free.
