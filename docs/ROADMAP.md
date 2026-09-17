# Roadmap

`docs/ROADMAP.md` is the **only current status authority** for delivery phases.

## Blueprint Engine — current state

The Executable Name path now includes:

- AI-facing Markdown Name DSL → deterministic `manga-blueprint/0.2` compilation;
- Energy from narrative / visual / transition importance plus hold;
- Attention, gaze, motion direction and reading-flow semantics;
- machine-readable manga-direction knowledge base and technique composition;
- explainable Direction Advisor with medium-aware recommendations;
- **Layout Solver v3** using energy + hold + attention + gaze/motion + reading direction + technique advice + medium + explicit human locks;
- page-level layout candidates including scroll-native `cinematic-vertical` behavior;
- **Scene Director v1** deriving page energy, neighboring contrast, turn hooks and page/spread candidates across multiple pages;
- explicit per-panel human geometry locks preserved as hard constraints across re-solve;
- semantic pose/gaze/depth/support/motion/contact compilation;
- deterministic 2D articulated pose/contact solving, including sword contact anchors;
- layered Clean and Annotated rendering from shared solved geometry;
- bounded co-author helpers for Story → Beat/Name proposal, single-panel semantic patching and lock-before-local-re-solve workflows;
- strict visible-text separation, per-page prompt and manifest-first package;
- **Structural Evaluator v1** for comparing intended vs observed panel geometry, character position/scale and solved contacts;
- human/AI shared manga knowledge, public technique guide and filterable expression dictionary;
- CI regression coverage for deterministic compilation, solver explanation, contact geometry, medium behavior, scene direction, evaluator drift detection and human locks.

This is no longer an architecture bootstrap. The remaining work is chiefly **fidelity, Web convergence, generation adapters and production workflow quality**.

## Shipped through Prototype 0.19.0

The established Web product retains stable work/page/container identity, IndexedDB multi-work persistence, multi-page hierarchy, manga-first navigation, Story Templates/Smart Manga, quadrilateral/inset panel geometry, character identity modes, manga authoring semantics and selected-page manifest-first AI handoff.

## Delivery phases

**Phase 3 — Backup / Restore — Next** remains the next numbered established-Web phase. Blueprint Engine work is parallel and does not silently reorder it.

| Phase | Priority | Goal | Status |
|---:|:---:|---|:---:|
| E | S-enabler | Headless Blueprint Engine / AI co-authoring | **Core + Solver v3 + Scene Director + Evaluator implemented; fidelity/Web integration active** |
| 0 | S | Storage / stable identity | **Shipped** |
| 1 | S | Multi-page Core | **Shipped in 0.13.0** |
| 2 | S | Work / Volume / Folder management | **Shipped in 0.14.0** |
| 2.5 | S | Manga-first editor shell / navigation UX | **Shipped** |
| 2.6 | A | Bounded Design Direction handoff | **Shipped** |
| 3 | S | Backup / Restore | **Next** |
| 4 | S | Scoped Export | Planned |
| 4.5 | S-enabler | Advanced Panel Geometry | **Quadrilateral foundation shipped** |
| 5 | S | Panel-first / Hybrid generation | Planned |
| 6 | A | Cross-page continuity / Reference Assets | Planned |
| 7 | A/B | Manga direction expansion | **Knowledge/dictionary foundation shipped; editor integration pending** |

## Blueprint Engine task inventory

### P0 — Verification / production integrity

- [ ] Confirm latest master passes `npm run typecheck`, `npm run build`, `npm run validate` in GitHub Actions after the current series of commits.
- [ ] Confirm GitHub Pages deploy succeeds and manually inspect LP / editor / technique guide / dictionary public entries.
- [ ] Add an acceptance fixture covering a true multi-page scene, not only the existing 1-page combat fixture.
- [ ] Keep `docs/PRODUCT.md`, `docs/ARCHITECTURE.md`, `docs/BLUEPRINT-ENGINE.md`, `core/name-schema.md` synchronized with Solver v3 / Scene Director / Evaluator semantics where currently stale.

### P1 — Clean Blueprint fidelity

- [ ] Upgrade solved body geometry from simple chest-to-extremity lines to articulated shoulders/elbows/knees/feet while retaining deterministic output.
- [ ] Represent silhouette/occupancy envelopes so Clean communicates approximate body mass, not only skeleton lines.
- [ ] Add foreground / midground / background scene blocks when authored semantics require them.
- [ ] Render generation-facing motion/focus regions without leaking annotation labels.
- [ ] Represent balloon/SFX reserved regions more faithfully and detect collisions with primary attention targets.
- [ ] Add clipping/occlusion rules for panel boundaries and overlapping subjects.

### P2 — Pose / Prop / Contact Solver v2

- [ ] Add elbow/knee-aware limb solving and bounded IK-style target solving.
- [ ] Expand props beyond sword: generic held prop, firearm-like neutral placeholder geometry where permitted by project content, staff/spear, shield, phone, bag and furniture anchors.
- [ ] Model grip/base/tip or equivalent prop anchors independently from character identity.
- [ ] Support body-to-body, hand-to-object, foot-to-ground and subject-to-environment contacts.
- [ ] Add collision/penetration diagnostics instead of silently accepting impossible geometry.
- [ ] Preserve human locks while solving only unconstrained joints/anchors.

### P3 — Scene / Page grammar v2

- [x] Scene Director v1: page energy, neighboring contrast, hook and page/spread recommendations.
- [ ] Parse explicit scene/chapter directives from Name source instead of only deriving scene structure from pages.
- [ ] Turn page-level recommendations into optional solver constraints for page-turn reveal / spread composition.
- [ ] Model facing pages and binding/gutter constraints for print spreads.
- [ ] Add scene-level energy-curve targets and detect repeated local maxima / monotony.
- [ ] Add cross-page visual continuity signals: entrance/exit direction, character side, location and time continuity.
- [ ] Add vertical-scroll equivalent scene rhythm using viewport/scroll-distance rather than page-turn assumptions.

### P4 — Structural generation evaluation

- [x] Evaluator v1: panel IoU, panel center drift, character position/scale, solved contact preservation.
- [ ] Add character occupancy/bounding-region score rather than point-only position.
- [ ] Add pose silhouette similarity using normalized solved joints/segments.
- [ ] Add balloon/SFX reserved-region preservation.
- [ ] Add reading-flow / attention-target preservation metrics.
- [ ] Add evaluator adapters for extracting observed structure from a generated image or manually annotated observation JSON.
- [ ] Store evaluator results as optional reports; never mutate canonical authored state from a score.

### P5 — Character reference binding

- [ ] Add explicit appearance/reference binding to headless Name source without embedding provider-specific asset IDs into canonical semantics.
- [ ] Support `referenceKey` → local/package asset mapping in manifest.
- [ ] Preserve identity vs pose-instance boundary.
- [ ] Add missing-reference diagnostics and fallback behavior.
- [ ] Document how reference images, appearance text and art-direction style divide responsibility.

### P6 — Image-provider adapters

- [ ] Define provider-neutral generation request contract from Clean + prompt + references.
- [ ] Implement adapters only at generation/export boundaries; canonical project remains provider-independent.
- [ ] Start with one explicitly supported provider path only when the runtime/tooling can actually invoke it.
- [ ] Add request/response provenance to manifest/report artifacts.
- [ ] Feed generated outputs into Evaluator adapters when possible.

### P7 — Web co-author integration

- [ ] Reuse canonical Web project state; do not introduce a second editor-side project model.
- [ ] Add Story → Beat/Name proposal surface.
- [ ] Show per-panel Direction Advisor recommendations with reasons.
- [ ] Expose human lock/unlock and bounded local re-solve.
- [ ] Allow natural-language semantic patches such as “3コマ目は固定、4コマ目だけもっと迫力”.
- [ ] Preview solver alternatives before apply; AI proposals remain non-mutating until explicit apply.
- [ ] Integrate manga dictionary recommendations into selected-panel UI.

### P8 — Knowledge base / dictionary convergence

- [ ] Remove remaining duplicated hand-maintained technique semantics between Markdown, Web dictionary data and `core/manga-knowledge.mjs` by introducing one generated/shared source where practical.
- [ ] Add stable technique IDs to public dictionary entries.
- [ ] Add visual examples/mini diagrams for weak / standard / strong use.
- [ ] Add “good combinations / common conflicts / prerequisites” consistently to human docs and machine records.
- [ ] Expand medium coverage only from maintained, verifiable rules rather than stale platform dimensions.
- [ ] Keep style families decomposed into observable axes; do not encode named living-artist imitation presets.

### P9 — Established Web roadmap

- [ ] Phase 3: Backup / Restore.
- [ ] Phase 4: Scoped Export.
- [ ] Phase 5: Panel-first / Hybrid generation.
- [ ] Phase 6: Cross-page continuity / Reference Assets.
- [ ] Phase 7: Manga direction expansion in the editor, converging on the shared knowledge base.

## Deferred / optional

- full automatic aesthetic scoring or “best manga” ranking — not a target; evaluator measures authored-intent preservation;
- provider-specific state inside canonical project JSON — intentionally rejected;
- replacing the Web editor with CLI-only workflow — not required; both surfaces converge on canonical state;
- automatic overwriting of human-authored direction from AI recommendations — intentionally rejected;
- premature serialized format bump — only required if backward-compatible optional fields are insufficient.

## Established Web roadmap

```text
Storage / stable identity
  → multi-page core
  → work hierarchy
  → manga-first shell
  → Backup / Restore
  → Scoped Export
  → Panel-first / Hybrid
  → Cross-page continuity
  → Manga direction expansion
```

## Target end-state

```text
Human story / explicit manga direction
        ↓
AI co-author: Beat + semantic proposal
        ↓
Shared Manga Knowledge / Dictionary
        ↓
Technique Composer + Direction Advisor
        ↓
Scene Director + Layout Solver
        ↓
Pose / Prop / Contact Solver
        ↓
Canonical manga-blueprint project
        ↓
Clean spatial contract + Annotated review + Prompt + References
        ↓
Provider adapter
        ↓
Generated manga image
        ↓
Structural Evaluator
        ↓
Human review / bounded semantic correction / local re-solve
```

Blueprint Engine and Web editor converge on the same canonical project state; neither may introduce a competing project model.
