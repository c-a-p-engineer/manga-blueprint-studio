# AGENTS.md — Manga Blueprint Studio

## Mission

Manga Blueprint Studio is a **human-directed manga planning and AI handoff system**. It supports both a Web editor and a headless Blueprint Engine that turns lightweight manga-name intent into an **Executable Name**: canonical semantic state plus generation-facing Clean visuals, human-review Annotated visuals and rendering prompts.

The human is the director. Story Templates, Smart Manga, layout/pose solvers, diagnostics, coding agents and downstream image models are assistance/rendering tools; they do not silently replace authored intent.

## AI agent quick start

For any task that authors, edits, diagnoses or compiles manga Name/Blueprint content, read and follow:

1. this file;
2. `.agents/skills/manga-blueprint/SKILL.md`;
3. `core/name-schema.md`;
4. `docs/BLUEPRINT-ENGINE.md`;
5. `docs/MANGA-TECHNIQUES.md` when making manga-direction choices.

**Author semantics; derive geometry.** Do not make an AI author invent IDs, joint coordinates or pixel geometry when the compiler/solver can derive them. Preserve explicit human locks and hard constraints.

## Source of truth

Use these authorities in order for their respective concerns:

1. `AGENTS.md` — repository rules and cross-cutting invariants.
2. `docs/PRODUCT.md` — current user-visible behavior and product contract.
3. `schema/manga-blueprint.schema.json` — serialized project data contract.
4. `docs/ARCHITECTURE.md` — runtime ownership, state, persistence, and implementation boundaries.
5. implementation under `core/` and `web/` — shipped behavior when a document is stale.
6. `docs/PROMPT_HANDOFF.md` — AI generation/review package and prompt contract.
7. `docs/ROADMAP.md` — current delivery status and future phases.
8. `docs/USER-GUIDE.md`, `web/guide.html`, and `docs/MANGA-TECHNIQUES.md` — derived user guidance; they must match higher authorities.

`docs/README.md` is the documentation map. Dated research notes, baseline notes, and old `PROTOTYPE-*` files are historical evidence, not current runtime authority.

When implementation, schema, and documentation disagree, determine which source is stale, update it intentionally, and keep the current release internally consistent.

## Product models

### Web editor

```text
Work / 作品
  → optional Volume / Chapter / Folder
    → Page (P001, P002, ...)
      → page settings / panel layout
        → panel direction / character / background / text / effects
          → selected-page AI handoff
```

The optional hierarchy is organizational. Pages remain stable entities and may live directly under the work.

### Blueprint Engine

```text
story / Name intent
  → AI Name DSL
  → semantic grammar
  → Energy / Attention / Reading Flow
  → Layout Candidate Solver
  → Pose / Contact Solver
  → canonical manga-blueprint project
  → Clean + Annotated + Prompt + manifest
```

The Name source is authoring input, not a second canonical saved-project format. `work.manga.json` remains canonical compiled project state.

## Manga-first editor shell

Navigation and editing responsibilities must remain distinct.

- application header owns Help, Undo/Redo and language;
- active work title is separate from app-level actions;
- breadcrumb shows active container path plus current page;
- visible page labels use minimum three-digit codes such as `P001`; canonical `pageNumber` remains numeric;
- previous/next/add/direct-page navigation lives above the manga canvas;
- **Work Explorer / 作品エクスプローラー** opens from the active work title and is the primary file-explorer-style navigation for `work → page`;
- dedicated volume/chapter/folder editing is not a primary UI surface; compatibility data remains supported;
- **Page settings / ページ設定** owns manuscript size, reading direction, page-wide style/layout and current-page configuration, not work/page navigation.

## Core invariants

### Stable identity and local persistence

- `meta.workId`, Container/Page/Panel IDs, placed-character instance IDs and balloon IDs are identity, not display labels.
- moving a page between containers must not change page identity.
- duplicating a page/work regenerates mutable instance IDs needed for independence.
- Web project persistence uses IndexedDB.
- saving work contents must not silently change `activeWorkId`; activation is explicit.
- last active page is remembered per work.
- historical browser project-autosave `localStorage` is intentionally not migrated; portable `.manga.json` import is the compatibility path.

### Destructive actions

- deleting the final page is rejected;
- deleting a non-empty container must not silently delete its pages;
- container deletion re-homes directly assigned pages/direct child containers before removal;
- same-`workId` import/restore never silently overwrites an existing work;
- import-as-new receives fresh work/container/page/panel/placed-instance identity with references remapped;
- destructive overwrite requires explicit confirmation.

### Human direction first

Assistance must not silently replace recorded panel layout, action intent, pose, character assignment, appearance policy, camera intent, background intent, dialogue/SFX, lettering direction, manga effects, semantic contacts, or explicit hard locks.

- Story Template browsing/filtering/preview is non-mutating;
- Smart Manga candidates are non-mutating until explicit apply;
- solver decisions fill derivable/unlocked structure, not pinned human decisions;
- applied assistance becomes ordinary editable project state;
- diagnostics are advisory and do not block export merely because a warning exists.

### Importance is not panel size

Narrative/visual/transition importance and `hold` are solver inputs. Do not implement a universal `important = large panel` rule. Relative energy, neighbor contrast, reading flow, attention, gaze, motion, explicit layout intent and hard constraints determine geometry. Keep solver decisions inspectable/explainable.

### Reading order and writing direction

Panel reading direction and lettering direction are separate.

- `meta.readingDirection`: `rtl | ltr`; Japanese RTL is default.
- `meta.defaultWritingMode`: `vertical-rl | horizontal-tb`; vertical Japanese is default.
- balloon/SFX writing mode may override or inherit project default.
- changing writing direction must not change panel reading order.
- committed render paths keep panel `order` synchronized with geometry + reading direction.

### Character identity boundary

Reusable base-character identity and placed pose instances are separate. `sheet`, `description`, and `free` identity modes remain distinct. Solved skeleton/mannequin geometry communicates body relationship, pose, placement, scale, direction and contact; it does **not** define character appearance.

### AI-safe visual/text boundary

Clean output communicates spatial composition. `.manga.json` + prompt communicate meaning. Character guidance/sheets communicate identity. Art direction controls rendering language. Exact visible text comes only from the explicit renderable-text allowlist.

Clean must not expose authoring labels such as character names/IDs, panel numbers, camera/action/contact labels, energy values, annotation arrows or editor UI text.

Clean and Annotated must be generated from the **same canonical geometry/art source**. Annotated adds review-only information and is never the default image-generation input.

### Manifest-first handoff

`manga-blueprint-export-manifest/3` remains the read-first authority for the established Web export package. Current Web generation/review export is selected-page scoped until intentionally changed.

Blueprint Engine packages likewise include a read-first manifest and per-page assets. Do not conflate headless multi-page compilation with established Web multi-page export support.

Provider-specific behavior belongs at adapter/export boundaries; core project state remains provider-independent and local-first.

## Documentation synchronization contract

Documentation is shipped product contract.

- `README.md` / `README.ja.md`: concise baseline and quick start.
- `docs/README.md`: documentation map/maintenance rules.
- `docs/MANGA-TECHNIQUES.md` + `web/techniques.html`: semantically aligned manga-direction guidance.
- `docs/USER-GUIDE.md` + `web/guide.html`: semantically aligned Web workflow guidance.
- `docs/PRODUCT.md`: user-visible behavior.
- schema: serialized project contract.
- `docs/ARCHITECTURE.md`: runtime/state/storage/ownership.
- `docs/PROMPT_HANDOFF.md`: generation/review handoff contract.
- `docs/BLUEPRINT-ENGINE.md`: headless workflow.
- `core/name-schema.md`: Name DSL.
- `docs/ROADMAP.md`: only roadmap status authority.

When changing public UI/workflow, update the relevant public guidance and verify the deployed artifact. CI success alone is not visual usability evidence.

## Runtime and implementation rules

The app is a Vite-built static GitHub Pages application. `web/app.js` is a thin entry shim into `web/src/main.ts`; TypeScript owns bootstrap/new UI composition. Ordered classic-script chunks under `web/runtime/` remain a temporary compatibility/reference layer.

- preserve explicit legacy runtime load order unless deliberately migrating ownership with behavior-equivalence evidence;
- modify the existing semantic owner instead of chronology-named patches;
- new runtime chunks need distinct responsibility;
- UI-only organization must not create a second project-state model;
- core compiler/solver/renderer code belongs under `core/`, not hidden inside Web UI code.

## Compatibility

Current serialized project format remains `manga-blueprint/0.2`. Current established Web export manifest remains `manga-blueprint-export-manifest/3`.

Compatible optional additions may normalize into old files without a format bump when semantics remain backward-compatible. Do not bump versions merely for presentation changes.

## Verification / definition of done

Relevant changes must preserve or intentionally update:

- JS/TS syntax and build;
- project schema validation and portable-project normalization;
- stable work/page/container identity;
- reading order vs writing direction separation;
- Story Template/Smart Manga non-mutating preview contracts;
- character identity boundaries;
- deterministic Blueprint compilation for fixed source/options;
- inspectable Layout Solver decisions;
- pose/contact relationships when semantically required;
- Clean vs Annotated separation and shared geometry;
- strict visible-text allowlist and manifest-first handoff;
- mobile usability;
- documentation synchronization;
- GitHub Pages deployment for public runtime/docs changes.

Run:

```bash
npm run typecheck
npm run build
npm run validate
```

For public UI changes, verify the deployed page separately from static validation.
