# Roadmap

`docs/ROADMAP.md` is the **only current status authority** for delivery phases. Detailed design notes may explain future contracts, but they must not maintain a competing phase-status truth.

## Shipped through Prototype 0.15.1

### Foundation / persistence

- stable work/page/container identity;
- IndexedDB-backed multi-work persistence;
- explicit save-vs-activate boundary;
- per-work active-page persistence;
- same-`workId` import protection;
- full-work copy/import-as-new identity regeneration/remapping;
- no migration from historical browser project-autosave `localStorage`.

### Multi-page / hierarchy

- multiple pages per work;
- add/select/duplicate/delete/reorder/renumber/title;
- optional `volume | chapter | folder` containers;
- nesting/reordering/reparenting;
- page-to-container assignment;
- cycle protection;
- confirmed non-destructive container deletion.

### Manga-first editor shell

- app-level header separated from active work identity;
- work title on its own line;
- breadcrumb for optional container ancestry + current page;
- page codes such as `P001` while `pageNumber` remains numeric;
- previous/next/add/direct page navigation above the canvas;
- explorer-style **Work Structure / 作品構成**;
- detailed page/container CRUD retained as advanced controls;
- **Page settings / ページ設定** separated from primary navigation;
- Japanese-first cleanup of primary authoring/status/style labels.

### Documentation / user guidance

Prototype 0.15.1 aligns current documentation with the shipped 0.15 editor shell and establishes a durable documentation map/update contract.

- current canonical docs rewritten around shipped behavior rather than old prototype chronology;
- `docs/README.md` defines document ownership and current-vs-historical boundaries;
- `docs/USER-GUIDE.md` provides the current user workflow;
- `/guide.html` provides a dedicated public usage screen;
- in-editor quick Help links to the full guide;
- CI validates key documentation/version/guide alignment.

### Manga authoring

- dynamic manuscript/canvas presets;
- RTL/LTR panel reading direction;
- geometry-based panel order synchronization;
- vertical/horizontal lettering direction with per-balloon/per-SFX overrides;
- common panel layouts and 4-koma variants;
- Story Template Studio with discovery/beat-flow/bounded derivation/custom local templates;
- Smart Manga bounded candidate proposals;
- reusable base-character identity with `sheet | description | free` modes;
- action intent, pose/expression/gaze, support/motion/depth semantics;
- background, balloons/dialogue, SFX/effects;
- Panel Peek/List/Chips, Crop Guide, camera/figure diagnostic, Manga Check.

### AI handoff

- selected-page AI generation ZIP;
- selected-page Review/archive ZIP;
- manifest-first handoff;
- clean-vs-annotated visual separation;
- Character Sheet requirement diagnostics;
- strict exact-text allowlist;
- current-page render contract against prior-context carryover;
- producer/build provenance in exported manifest.

## Delivery phases

| Phase | Priority | Goal | Status |
|---:|:---:|---|:---:|
| 0 | S | Storage / stable identity | **Shipped** |
| 1 | S | Multi-page Core | **Shipped in 0.13.0** |
| 2 | S | Work / Volume / Folder management | **Shipped in 0.14.0** |
| 2.5 | S | Manga-first editor shell / navigation UX | **Shipped in 0.15.0; docs/guide hardened in 0.15.1** |
| 3 | S | Backup / Restore | **Next** |
| 4 | S | Scoped Export | Planned |
| 5 | S | Panel-first / Hybrid generation | Planned |
| 6 | A | Cross-page continuity / Reference Assets | Planned |
| 7 | A/B | Manga direction expansion | Planned |

## Sequencing principle

Strategic priority and implementation order are different.

A strategically important feature may depend on lower-headline-priority enabling work. Pull forward only prerequisites whose later addition would cause meaningful rework, identity/schema churn, or destructive migration.

Current dependency shape:

```text
Storage / stable identity
        ↓
Multi-page core
        ↓
Work hierarchy
        ↓
Manga-first navigation shell
        ↓
Backup / Restore
        ↓
Scoped Export
        ↓
Panel-first / Hybrid
        ↓
Cross-page continuity
        ↓
Manga direction expansion
```

Panel-first remains strategically important, but it should be built after stable work/page/panel identity and explicit export scope exist.

## Phase 3 — Backup / Restore — Next

### Goal

Make a work recoverable and transferable before generation/export scope expands further.

### Backup package

Introduce a dedicated backup format separate from AI generation/review packages.

Candidate shape:

```text
<work>.manga-backup.zip
├─ backup-manifest.json
├─ project.manga.json
├─ templates/
│  └─ custom-templates.json      # when explicitly included by the contract
├─ assets/
│  ├─ index.json                 # future reference assets when supported
│  └─ <content-addressed files>
└─ thumbnails/                   # optional/rebuildable
```

### Required behavior

- whole-work project state;
- backup schema/version;
- work identity;
- file roles and counts;
- checksums/hashes;
- explicit optional-library inclusion;
- restore preview before mutation;
- corrupted/mismatched backup rejection before mutation;
- generation ZIP must not be mistaken for a full backup.

### Restore conflict behavior

If imported backup `workId` does not exist, restore normally.

If the same `workId` exists, block and require one choice:

1. **別作品として取り込む** — import as a new work with identity remapping;
2. **既存作品を上書き** — destructive replace after explicit confirmation;
3. **キャンセル**.

Never infer overwrite from title equality alone.

Restore should be transactional: failure leaves the existing library untouched.

### Verification

- backup from one browser restores in a clean browser;
- required files/hashes/schema/counts are validated;
- same-work conflicts cannot silently overwrite;
- failed restore does not leave mixed partial state;
- restored work/page opens correctly.

## Phase 4 — Scoped Export

### Goal

Export exactly the pages the user intends.

### Scopes

- current page (existing behavior);
- explicit selected pages;
- page range such as `3-5,8`;
- container / volume / chapter;
- whole work;
- explicit two-page spread as a special shared-canvas scope.

### Contract

- manifest declares exact scope and ordered work/container/page IDs/numbers;
- single-page package remains self-contained;
- multi-page package gets a root batch/work manifest plus per-page self-contained contracts;
- root prompt orchestrates; it does not replace per-page execution prompts;
- selected page 7 export must not silently inherit unrelated page 6/8 semantics;
- provider adapters remain at export boundary.

## Phase 5 — Panel-first / Hybrid generation

### Goal

Reduce whole-page instruction failure and enable targeted re-generation while preserving manga-specific cross-panel effects.

### Planned behavior

- normal isolated panels become self-contained generation units;
- each unit includes clean cropped blueprint, semantic contract, references, and output naming;
- cross-panel breakout/shared-background/spread cases use explicit `generationGroupId` or equivalent shared-canvas groups;
- deterministic compositor recipe records exact crop/placement geometry;
- one failed/re-generated unit can be replaced without invalidating unrelated panels;
- page-first export remains available during transition;
- no semantic AI result-grader is required as a core pipeline gate.

### Verification

- generated panel units can reconstruct the authored page geometry exactly;
- grouped effects are not accidentally split;
- dimensions/naming/crop/placement are deterministically checkable.

## Phase 6 — Cross-page continuity / Reference Asset Library

### Goal

Make long works more stable across pages without silently uploading private reference material.

### Planned reference types

- character;
- location;
- prop;
- outfit/costume;
- vehicle;
- style;
- pose;
- lighting.

### Planned semantics

- stable reference IDs;
- browser-local registration/thumbnail binding;
- continuity-lock vs soft-reference modes;
- location/prop/outfit state transitions;
- inherited work/container defaults with page overrides;
- optional explicit inclusion in generation/backup packages;
- no silent remote upload.

## Phase 7 — Manga direction expansion

### Spatial continuity

- 180-degree action axis;
- screen side;
- entry/exit direction;
- eyeline vectors;
- shot/reverse-shot relation;
- intentional axis-break override;
- advisory warnings for accidental inversion.

### Perspective / lens

- horizon/vanishing-point semantics;
- camera height/pitch/roll;
- focal-length equivalent;
- richer body-region framing;
- optional perspective guide export without becoming a full 3D package.

### Depth / occlusion

- foreground/midground/background bands;
- front/behind relations;
- per-entity occlusion constraints;
- stronger near-object maps.

### Eye-flow / focal path

- primary focal target per panel;
- entry/exit reading vectors;
- page-level flow visualization;
- RTL/LTR conflict warnings;
- balloon placement integrated into eye-flow reasoning.

### Gutter / transition semantics

- temporal gap;
- spatial continuity;
- moment/action/subject/scene transition type;
- advisory gutter width/overlap suggestions.

### Spread / page-turn

- two-page spreads;
- binding-safe zones;
- page-turn/reveal intent;
- scene pacing across pages;
- preserve normal single-page semantics unless explicit spread/group is selected.

### Deterministic text production

- balloon-tail target;
- final vertical Japanese typesetting;
- punctuation/ruby/kenten/tate-chu-yoko;
- SFX rotation/path;
- deterministic post-render lettering composition.

## Additional authoring candidates

### Pose Studio / Contact Graph

- direct joint dragging;
- saved/mirrored pose presets;
- support/center-of-gravity/torso controls;
- semantic contact edges for hugs/grabs/throws/strikes/hand-holding/props.

### Advanced panel geometry

- drag/shared boundaries;
- diagonal/irregular frames;
- inset/overlap;
- safer bleed visualization;
- reading-order rules for arbitrary geometry.

### Provider adapters

- ChatGPT-oriented package adapter;
- Gemini-oriented package adapter;
- ComfyUI / ControlNet adapter;
- capability declarations and explicit degradation;
- canonical project state remains provider-independent JSON.

## Explicit non-goals for now

Manga Blueprint Studio is not currently intended to become:

- a full illustration application;
- a complete 3D scene package;
- a hosted proprietary image-generation service;
- a cloud collaboration suite by default.

Its differentiator remains **human-directed manga semantics that can be inspected, edited, and handed to multiple downstream generators with explicit contracts**.
