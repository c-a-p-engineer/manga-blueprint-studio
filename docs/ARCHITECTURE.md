# Architecture

## Purpose

Manga Blueprint Studio now has two authoring surfaces over one canonical project model:

1. **Blueprint Engine** — headless AI/human name-to-blueprint compiler.
2. **Web editor** — visual GUI client for refinement, persistence, and the established generation/review export flow.

`schema/manga-blueprint.schema.json` remains the serialized-data authority. Neither the Name DSL nor the Web UI owns a second project model.

## Architecture direction

```text
Name DSL / AI / human beats
          ↓
core/blueprint-engine.mjs
          ↓
canonical manga-blueprint/0.2
          ├──────────────→ CLI package builder
          │                 ├ clean spatial visual
          │                 ├ annotated review visual
          │                 ├ page prompt
          │                 └ manifest
          │
          └──────────────→ Web editor
                            ├ visual refinement
                            ├ IndexedDB persistence
                            └ established Web export pipeline
```

The architectural rule is **Core first, clients second**. A client may add transient editing state and presentation, but shared manga semantics belong in canonical project state or reusable Core logic.

## Blueprint Engine ownership

`core/blueprint-engine.mjs` owns the current headless compiler prototype:

- parsing the lightweight AI Name DSL;
- deterministic work/page/panel/placed-character/balloon identity;
- bounded manga-layout selection from panel count, emphasis, and optional layout hint;
- initial camera inference from explicit camera terms plus beat semantics;
- reusable character placeholders from semantic character tokens;
- initial stick-figure placement from coarse `left | center | right | foreground | background` slots;
- background/time propagation;
- dialogue and exact SFX transfer;
- line-effect inference;
- clean vs annotated SVG blueprint generation;
- generation prompt construction with exact visible-text allowlist;
- manifest-first package metadata.

`core/name-schema.md` owns the authoring DSL contract. The DSL intentionally excludes generated IDs and exact pixel coordinates.

### Name DSL is not persistent authority

The Name input is source material. After compilation, `manga-blueprint/0.2` is authoritative project state. Editing the resulting project in the Web editor does not require round-tripping changes back into the original Name source.

A future explicit source-sync feature would require its own conflict semantics; it must not be inferred from deterministic compilation.

## Existing Web production bootstrap

The Web editor remains a static GitHub Pages application built with Vite.

```text
web/app.js
  -> web/src/main.ts
       -> load build-info.json
       -> web/src/runtime/legacy-api.ts
       -> web/src/legacy-runtime.ts
            -> web/runtime/manifest.json
            -> ordered classic runtime chunks
       -> initialize editor state
       -> install typed UI composition
```

`web/runtime/manifest.json` remains the ordered registry for the compatibility runtime. New typed Web code keeps legacy-global access behind `web/src/runtime/legacy-api.ts`.

## Canonical serialized project model

Current format remains `manga-blueprint/0.2`.

```text
Project
├─ meta
│  ├─ workId / title
│  ├─ pageWidth / pageHeight
│  ├─ readingDirection
│  ├─ defaultWritingMode
│  ├─ optional workBrief / artDirection / template provenance
│  └─ other backward-compatible metadata
├─ containers[]
├─ characterLibrary[]
└─ pages[]
   └─ Page
      ├─ stable id / number / order / title / containerId
      └─ panels[]
         ├─ id / order / rect / optional shape / optional inset
         ├─ role / actionIntent
         ├─ style / camera / background / effects
         ├─ characters[]
         └─ balloons[]
```

The JSON Schema remains authoritative for field-level shape. The Blueprint Engine must emit schema-compatible project state rather than introducing compiler-only serialized semantics.

## Identity boundary

Stable identity includes `meta.workId`, page/panel IDs, placed-character IDs, balloon IDs, and reusable character IDs. The compiler derives deterministic IDs from source content so repeated compilation of identical input is stable. The Web editor may later duplicate/import-as-new using its existing remapping contracts.

Human-readable character tokens in Name DSL are semantic handles, not identity authority. The compiler maps them to generated reusable-character IDs.

## Spatial / semantic boundary

The same authority split is used across headless and Web workflows:

- canonical `.manga.json` — semantic project state;
- clean visual — spatial composition only;
- annotated visual — human review aid;
- prompt — generation instructions and explicit visible-text allowlist;
- manifest — read-first package/file-role index.

Clean compiler visuals must not contain authored dialogue/SFX/action labels as visible text. They may contain abstract placement figures and balloon geometry.

## Existing Web runtime ownership

The established Web compatibility runtime keeps its current semantic owners:

```text
web/runtime/
├─ core/          state, commands/history, persistence lifecycle, rendering, I/O/events
├─ authoring/     page/work/container/panel/character authoring
├─ assist/        Smart Manga assistance
├─ identity/      character identity / appearance handoff
├─ story/         story-readable semantics
├─ templates/     Story Template ownership
├─ lettering/     writing direction
├─ ordering/      reading-order synchronization
├─ integration/   explicit cross-feature adapters
├─ handoff/       Web prompt / manifest / render contracts
└─ ui/            compatibility presentation layers
```

The long-term direction is to extract genuinely reusable pure semantics toward shared Core modules when behavior-equivalence evidence exists. Do not rewrite working Web owners merely to make the directory tree look cleaner.

## Persistence and activation

The Web client retains IndexedDB persistence and explicit activation semantics. The Blueprint Engine is filesystem/headless and does not own browser persistence.

A compiled `work.manga.json` is a portable project artifact. Importing it into the Web editor follows the Web editor's existing import identity/conflict rules.

## Web AI handoff vs Name package

The existing Web generation/review packages remain selected-page scoped and use `manga-blueprint-export-manifest/3`.

The headless compiler preview uses a distinct `manga-blueprint-name-package/2` manifest because it is a compilation artifact rather than the shipped Web export implementation. Both packages share the same conceptual authority split and canonical project schema.

Do not silently claim byte-level or schema-level compatibility between the two manifest formats.

## Verification

Main CI must cover:

- TypeScript typecheck + Vite production build;
- existing Web behavioral/contract validators;
- Blueprint Engine parser/compiler regression tests;
- deterministic canonical project output for fixed Name input;
- exact visible-text transfer;
- clean visual text safety;
- manifest file-role correctness;
- schema-compatible emitted fields.

GitHub Actions success is implementation evidence. Public Web visual usability still requires deployed-page verification for UI changes.

## Refactor rules

1. Keep one canonical serialized manga model.
2. Do not make the Web DOM or IndexedDB representation the Blueprint Engine's core API.
3. Do not require AI authors to generate IDs or pixel coordinates when the compiler can derive them.
4. Keep exact visible text explicit and allowlisted.
5. Preserve clean-vs-annotated visual separation.
6. Prefer reusable pure Core semantics over duplicating the same inference in CLI and Web code.
7. Do not force a full legacy-runtime rewrite as a prerequisite for headless authoring.
8. Any future source round-trip/synchronization requires explicit conflict semantics.
