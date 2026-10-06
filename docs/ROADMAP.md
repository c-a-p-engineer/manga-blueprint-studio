# Roadmap

This file is the delivery/status authority.

## Production baseline — 0.20.0

The planned prototype backlog through P9 has been implemented as a coherent baseline: canonical knowledge, Direction Advisor, shared Layout Recipe Bank + Solver v4, Scene Director v2, articulated Pose/Prop/Contact Solver v2, Clean/Annotated renderer v3, Structural Evaluator v2, provider-neutral generation package, reference diagnostics, Web backup/restore/scoped export/local direction patches, multi-page fixtures and CLI generation packages.

### Completed inventory
- [x] P0 production integrity code/fixtures/docs; CI is the release gate.
- [x] P1 Clean fidelity baseline: articulated body mass, clipping, scene/background blocks, reserved regions and focus/motion rendering.
- [x] P2 Pose/Prop/Contact v2: elbows/knees, held props, sword/staff/shield/phone/bag, ground/body contacts and diagnostics.
- [x] P3 Scene/Page grammar v2 baseline: energy curve, page/viewport hooks, spread candidates, continuity diagnostics and scroll-distance hints.
- [x] P4 Structural Evaluator v2: panel, occupancy, normalized joints/pose, contact, reserved regions, attention and reading-flow metrics; reports are non-mutating.
- [x] P5 provider-independent reference binding and missing-reference diagnostics.
- [x] P6 provider-neutral GenerationRequest/Result/Package boundary and provenance contract. Network/provider invocation remains deliberately external because credentials/runtime are not canonical project concerns.
- [x] P7 Web production tools: backup, restore, scoped page export and bounded natural-language panel direction patches.
- [x] P8 canonical manga knowledge is the single machine-readable source used by solver/agents/public dictionary.
- [x] P9 established Web roadmap baseline: backup/restore, scoped export and shared canonical-state convergence are present.
- [x] Shared Layout Recipe Bank: Core/CLI/Web/catalog use one recipe authority; deterministic seed/mutation produces reusable base geometry, while diagonal/inset/bleed/breakout remain post-layout expression.
- [x] Observation extraction foundation: provider-neutral request/normalization/evaluation contracts, scoped evaluation and drift diagnostics.

## Next roadmap — quality loop first

The next sequence prioritizes **generated-manga correctness and repairability** over more layout presets, provider-specific API integration, or additional frame-shape breadth.

The critical path is:

```text
observe rendered result
  -> diagnose authored-intent drift
  -> strengthen spatial/body reasoning
  -> propose bounded repair
  -> human approves
  -> re-solve / regenerate
```

### 0.21 — Web/Core convergence hardening (parallel enabling work)

Continue replacing high-friction legacy-runtime bridges with typed adapters, expose solver alternatives/reasons in the editor, and add browser-level regression coverage.

This phase must not block manga-quality work below. Treat it as parallel convergence/hardening unless a legacy boundary prevents a later feature.

**Acceptance**
- shared semantics remain Core-owned;
- Web and CLI continue to converge on the same canonical project state;
- solver choices/reasons needed for repair are inspectable;
- browser-level regression coverage exists for touched Web flows.

### 0.22 — Observation extraction completion

The provider-neutral observation foundation is shipped. Complete the missing image-facing adapter layer that turns an actual generated page into structured observation evidence.

Target observables:
- panel geometry and count;
- cast presence and coarse character occupancy;
- coarse pose/body direction and optional joints;
- contact points when visually recoverable;
- reading direction;
- lettering orientation;
- visible-text strings and unexpected text.

Every observation should be able to carry uncertainty/confidence. Missing or uncertain evidence must remain missing/uncertain rather than being filled from the expected Blueprint.

**Acceptance**
- an actual generated page can be converted into `manga-blueprint-observation/1`;
- expected Blueprint geometry is not copied into observation evidence;
- known fixtures detect wrong reading direction, missing cast, panel drift, writing-mode drift and visible-text corruption;
- provider/model identifiers remain outside canonical `manga-blueprint/0.2`.

### 0.23 — Spatial Intelligence v3

Strengthen the parts that determine whether a generated pose/composition is physically and visually plausible.

#### Pose / IK v3
Add derived constraints for:
- torso and pelvis orientation;
- support/grounding and rough balance;
- joint-range sanity;
- depth order / occlusion hints;
- hand/prop/body contact;
- crouch, seated, lying, leaning and multi-character interaction families;
- perspective/foreshortening-aware body relation.

AI authors continue to express semantics rather than joint coordinates.

#### In-panel Composition Solver
Solve composition inside each already-selected panel:
- subject placement and scale;
- face/hand/prop focal targets;
- balloon/reserved-region avoidance;
- negative-space allocation;
- gaze/motion/read-flow entry and exit;
- foreground/midground/background hierarchy.

#### Detail / Salience Budget
Represent what must be recognized versus intentionally simplified:
- primary character/detail;
- secondary character/detail;
- foreground extras;
- background crowd/mob abstraction;
- background/environment detail.

This should support directions such as “background mob faces have no eye detail” without making character identity rules global.

**Acceptance**
- regression fixtures cover previously observed failure modes such as excessive backward lean and implausible contact;
- composition solver does not overwrite explicit human placement/layout locks;
- crowd/detail suppression is expressible separately from character identity;
- the same semantic input produces deterministic derived geometry.

### 0.24 — Human-approved iterative repair loop

Connect the pieces into a bounded production loop:

```text
GenerationResult
  -> Observation
  -> Evaluator + diagnostics
  -> Repair Proposal
  -> human approval
  -> semantic patch
  -> bounded re-solve
  -> regenerate
```

Repair must be local when the diagnostic is local. A text-direction failure must not trigger an unrelated page rewrite; a pose failure must not silently replace authored dialogue or layout.

No automatic aesthetic ranking. No silent overwrite of authored intent.

**Acceptance**
- diagnostics map to explicit repairable subjects;
- repair proposals identify preserved versus changed fields;
- human approval is required before canonical semantic mutation;
- representative failures can be corrected without regenerating unrelated authored state.

### 0.25 — Cross-page continuity + production lettering

#### Continuity Graph
Track cross-panel/page state needed for multi-page manga:
- character screen side and movement direction;
- facing/gaze;
- held props and hand ownership;
- outfit/state changes;
- damage/condition;
- scene geography and persistent objects;
- intentionally broken continuity versus accidental drift.

#### Deterministic lettering
Move final text correctness away from image-model reliability where practical:
- exact dialogue/SFX allowlist remains semantic authority;
- post-generation balloon/text placement may use authored/observed regions;
- vertical Japanese typesetting is deterministic;
- image-model text can be verified, suppressed, or replaced rather than trusted blindly.

**Acceptance**
- cross-page fixtures detect unintentional continuity inversions without forbidding authored cuts;
- exact Japanese text can be delivered without depending on generative spelling accuracy;
- reading direction and writing mode remain independent contracts.

### 0.26 — Production provider adapters

Only after observation/repair contracts are stable, ship opt-in provider adapters for actual generation and image observation.

Adapters map portable Core packages to provider APIs and return portable results. Provider request IDs, credentials and model-specific knobs stay outside canonical project JSON.

**Acceptance**
- at least one generation adapter and one observation adapter work end-to-end;
- changing provider does not require changing canonical manga project semantics;
- provider-specific failure/provenance remains diagnosable at the adapter boundary.

### 1.0 — Stability

Freeze documented contracts, migration policy, accessibility/performance budgets, browser matrix and release fixtures only after real-project usage exercises the observation → evaluation → repair loop and multi-page continuity.

## Explicitly deferred unless real usage proves otherwise

These are not on the current critical path:

- adding large numbers of new Base Layout Recipes without a demonstrated coverage gap;
- arbitrary polygon/curved panel frames;
- bidirectional Name DSL ↔ edited-project synchronization;
- automatic aesthetic scoring/ranking;
- provider-specific state inside canonical project JSON.

## Invariants
- Human direction wins over AI recommendations.
- Clean is generation-facing; Annotated is review-only.
- Web and CLI use the same canonical project state.
- Provider-specific state stays outside canonical project JSON.
- Evaluator measures authored-intent preservation, not artistic quality.
- Observation never fabricates evidence from the expected Blueprint.
- Repair is bounded to diagnosed scope and remains human-approved.
