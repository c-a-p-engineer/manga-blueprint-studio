# Architecture

## Runtime

The prototype is a zero-dependency static web application. `web/app.js` loads `web/app-1.js` through `web/app-15.js` as classic scripts. `app-10.js` keeps Prototype 0.7 localization/state hardening; `app-11.js` owns Prototype 0.8 story-readability behavior; `app-12.js` contains Smart Manga action-intent alignment plus mobile Panel Peek hardening; `app-13.js` owns Prototype 0.9 Scene Template Studio; `app-14.js` provides 0.9 localization/feedback hardening; `app-15.js` owns Prototype 0.10 vertical-first lettering plus reading-order/panel-number synchronization. GitHub Pages serves exact static assets; no server, build step, external runtime script, analytics, or API is required.

## State

Browser state normalizes to `manga-blueprint/0.2`.

```text
Project
├─ meta
│  ├─ pageWidth / pageHeight
│  ├─ readingDirection (rtl | ltr)
│  ├─ textDirectionDefault (vertical | horizontal; default vertical)
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
      │  ├─ sfxText / sfxStyle
      │  └─ sfxWritingDirection (vertical | horizontal)
      ├─ characters (pose / expression / gaze / placement)
      ├─ balloons
      │  └─ writingDirection (vertical | horizontal)
      └─ assistSeed
```

The project schema version does not change. Legacy text-direction fields normalize to vertical.

## Reading-order model

`meta.readingDirection` is authoritative. Geometry is sorted top-to-bottom, then same-row panels are sorted right-to-left for `rtl` or left-to-right for `ltr`.

The same ordering function drives:

- editor panel numbers;
- Panel List / authoring summaries;
- layout and Smart Manga previews;
- Scene Template thumbnail numbers;
- Scene Template beat-to-panel assignment;
- generated prompt panel numbering;
- manifest `readingOrderContract`.

Prototype 0.10 intentionally re-synchronizes panel `order` before rendering so stale imported or previously generated numbering cannot disagree with current geometry/direction.

## Text-layout model

Prototype 0.10 separates project default from authored overrides.

- `meta.textDirectionDefault` defaults to `vertical`;
- new balloons and Story Template sample text inherit the default;
- `Balloon.writingDirection` records the actual balloon choice;
- `Panel.effects.sfxWritingDirection` records the onomatopoeia choice;
- changing the default does not rewrite existing explicit choices;
- annotated/review SVG preview reflects writing mode where practical;
- clean AI PNG removes exact text and relies on semantic handoff;
- Prompt emits a `TEXT WRITING DIRECTION CONTRACT`;
- manifest v4 emits `textLayout` with default and per-text overrides.

Vertical handoff means `vertical-rl`; horizontal means `horizontal-tb`.

## Story action model

`Panel.actionIntent` captures the event/meaning that cannot reliably be inferred from pose alone. It is intentionally short free text. It is consumed by Panel Peek / Panel List / Panel Chips, generation prompt under story-action guidance, and manifest panel intent index. It is not visible manga text and never enters `TEXT TO RENDER`.

## Scene Template Studio

`storyTemplates11` remains the canonical in-memory recipe registry. Prototype 0.9 extends it with romance, battle, emotion, daily, comedy, suspense, and character-introduction recipes. `meta13` is derived authoring metadata for template discovery and never becomes project state.

### Apply path

Prototype 0.10 uses a reading-aware apply path:

1. resolve selected template;
2. require confirmation if authored content exists;
3. derive rectangles from shipped layout or normalized custom geometry;
4. create ordinary `Panel` state;
5. renumber geometry using current `meta.readingDirection`;
6. sort panels by resulting order;
7. assign beat 1 to panel 1, beat 2 to panel 2, etc.;
8. copy role/action/camera/background/effects;
9. optionally copy sample dialogue/SFX with current text-direction default;
10. place the selected/project reusable base character when available;
11. record `meta.storyTemplate` as provenance only.

This closes the prior ambiguity where a template could visually number one direction while beat data followed raw rectangle-array order.

### Bounded derivation and custom templates

Derived templates preserve action flow while varying a bounded subset of camera/emphasis choices. Custom templates live in browser `localStorage`, store normalized geometry plus reusable direction, and exclude character-specific visual identity.

## Character identity boundary

Character identity remains project-level and separate from pose instances.

- `sheet`: external Character Sheet required; `referenceKey` maps it.
- `description`: no sheet; appearance text becomes identity contract.
- `free`: no sheet; model may choose a simple consistent appearance.

Output derives actual Character Sheet requirements from used characters and writes the same map into manifest.

## Dynamic coordinate system

SVG viewBox, PNG export, layout generation, pointer bounds, character placement, balloon bounds, Scene Template geometry, custom-template normalized geometry, and Crop Guide use `meta.pageWidth` / `meta.pageHeight` rather than assuming 800×1130.

## Panel Peek / Panel List architecture

Panel Peek and Panel List are derived authoring views, not additional project models. Long-press and visible `ⓘ` open the same semantic view. On narrow screens Panel Peek is an opaque viewport-bounded bottom sheet with fixed header/actions and a scrollable semantic body. Panel Chips and info buttons are editor overlays only.

## Camera framing diagnostic and Manga Check

The semantic camera model remains the source of truth. Figure-to-panel heuristics may warn about contradictions and offer an explicit fit action. Manga Check may flag missing action intent, repeated camera distance/expression, unspecified backgrounds, or framing conflicts. Warnings never mutate state automatically or block export.

## Smart Manga

Smart Manga remains bounded to shipped layouts/direction profiles, with three non-mutating candidates, reproducible seed, balanced/dynamic/emotion variants, stable/standard/bold intensity, optional base-character placement, and expanded purposes. Candidate numbering uses current reading direction.

## AI-safe render modes

- editor may contain anatomy colors, Panel Chips, `ⓘ`, Crop Guide, selected outlines, vertical/horizontal text preview, and authoring labels;
- clean AI export removes authoring text/anatomy colors while preserving spatial composition, monochrome pose figures, balloon geometry, and effect lines;
- exact dialogue/SFX and their writing directions are carried semantically;
- AI-generation ZIP excludes annotated PNG entirely.

## Prompt compiler and manifest

The compiler is deterministic from current project state. It preserves clean-reference rule, strict `TEXT TO RENDER` allowlist, panel semantics, story action intent, mode-aware character identity guidance, and text-writing-direction contract.

Manifest v4 is the read-first authority. It extends prior file/character/panel guidance with:

```text
readingOrderContract
  direction
  panelNumbersFollowReadingDirection = true
  storyBeatsFollowPanelNumbers = true

textLayout
  defaultWritingDirection
  balloons[] -> panelOrder / balloonId / writingDirection
  onomatopoeia[] -> panelOrder / writingDirection
```

## Persistence / privacy / deployment

`localStorage` stores autosave state and custom templates; `.manga.json` is the portable project artifact. All templates, search, derivation, lint, hashing, ZIP generation, appearance guidance, text-direction handling, and diagnostics execute locally. GitHub Pages publishes static `web/`, schema, and examples. Validation remains dependency-free.
