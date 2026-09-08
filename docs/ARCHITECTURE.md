# Architecture

## Runtime

The prototype is a zero-dependency static web application. `web/app.js` loads `web/app-1.js` through `web/app-14.js` as classic scripts. `app-10.js` keeps Prototype 0.7 localization/state hardening; `app-11.js` owns Prototype 0.8 story-readability behavior; `app-12.js` contains Smart Manga action-intent alignment plus mobile Panel Peek hardening; `app-13.js` owns Prototype 0.9 Scene Template Studio; `app-14.js` provides 0.9 localization/feedback hardening. GitHub Pages serves exact static assets; no server, build step, external runtime script, analytics, or API is required.

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

`storyTemplate` and `actionIntent` remain optional compatible additions. Prototype 0.9 does not change the project schema version. Template definitions are authoring helpers; only applied project state is serialized.

## Story action model

`Panel.actionIntent` captures the event/meaning that cannot reliably be inferred from pose alone. It is intentionally short free text. It is consumed by Panel Peek / Panel List / Panel Chips, generation prompt under `STORY ACTION INTENT`, and manifest `panelIntentIndex`. It is not visible manga text and never enters `TEXT TO RENDER`.

## Scene Template Studio

### Built-in registry

`storyTemplates11` remains the canonical in-memory recipe registry created by Prototype 0.8. Prototype 0.9 extends that mutable registry with additional romance, battle, emotion, daily, comedy, suspense, and character-introduction recipes.

`meta13` is derived authoring metadata for template discovery: category, localized description, localized use case, and search tags. It does not become project state.

### Discovery views

Template Studio adds:

- category filter;
- free-text search;
- visual card gallery;
- layout thumbnail;
- panel count and category;
- description and intended use;
- selected-template beat-flow preview.

Browsing/searching/selecting changes only transient authoring UI state. It does not mutate the manga page.

### Apply path

Prototype 0.9 replaces the original template-apply button listener with an apply path that supports both shipped and custom geometry.

Apply behavior:

1. resolve selected template;
2. if authored page content exists, require confirmation;
3. derive panel rectangles from a shipped layout or normalized custom geometry;
4. create ordinary `Panel` state;
5. copy role/action/camera/background/effects;
6. optionally copy sample dialogue/SFX;
7. place the selected/project reusable base character when available using beat pose/expression/gaze;
8. renumber according to reading direction;
9. record `meta.storyTemplate` as provenance;
10. after apply, no continuing template authority remains.

### Bounded derivation

`deriveTemplate13()` clones the selected recipe into one temporary derived recipe. It intentionally preserves action/beat sequence while varying a bounded subset of camera distance/angle and emphasis/effect choices. The variation is preview-only until explicit apply.

This is separate from Smart Manga: derivation starts from a known scene script; Smart Manga starts from purpose/panel-count/seed and proposes three broader candidates.

### Browser-local custom templates

Custom templates use `manga-blueprint-studio/custom-story-templates/0.9` in `localStorage`.

A custom template stores:

- normalized panel rectangles (`x/y/w/h` as canvas ratios);
- panel role and action intent;
- pose / expression / gaze (without character identity);
- camera;
- background;
- optional dialogue/SFX;
- selected line/breakout effects.

Character-specific visual identity, Character Sheet data, reusable base-character definitions, and remote assets are deliberately excluded. On reapply, normalized rectangles scale to the current canvas and the current reusable base character is placed if available.

Custom-template storage is local authoring convenience, not part of `.manga.json` until applied state is exported.

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

## Reading direction

`meta.readingDirection` is explicit. RTL is Japanese default; LTR is supported. Renumbering, layout thumbnails, Smart Manga previews, Panel List order, and generated prompt direction use the same value.

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

- editor may contain anatomy colors, Panel Chips, `ⓘ`, Crop Guide, selected outlines, and authoring labels;
- canonical annotated export contains normal authoring metadata defined by the exporter;
- clean AI export removes authoring text/anatomy colors while preserving spatial composition, monochrome pose figures, balloon geometry, and effect lines;
- dynamic editor overlays and Template Studio UI are never part of canonical export serialization;
- AI-generation ZIP excludes annotated PNG entirely.

## Prompt compiler and manifest

The compiler remains deterministic from current project state. It preserves clean-reference rule, strict `TEXT TO RENDER` allowlist, panel semantics, `STORY ACTION INTENT`, and mode-aware `CHARACTER IDENTITY GUIDANCE`.

Manifest v3 remains the read-first authority and may record `storyTemplate` provenance plus `panelIntentIndex`. A custom or derived template affects manifest only through the applied project provenance/state; browser-local template library contents are never exported automatically.

## Persistence / privacy / deployment

`localStorage` stores autosave state and Prototype 0.9 custom templates; `.manga.json` is the portable project artifact. All templates, search, derivation, lint, hashing, ZIP generation, appearance guidance, and diagnostics execute locally. GitHub Pages publishes static `web/`, schema, and examples. Validation remains dependency-free.
