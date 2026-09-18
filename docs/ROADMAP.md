# Roadmap

This file is the delivery/status authority.

## Production baseline — 0.20.0

The planned prototype backlog through P9 has been implemented as a coherent baseline: canonical knowledge, Direction Advisor, Layout Solver v3, Scene Director v2, articulated Pose/Prop/Contact Solver v2, Clean/Annotated renderer v3, Structural Evaluator v2, provider-neutral generation package, reference diagnostics, Web backup/restore/scoped export/local direction patches, multi-page fixtures and CLI generation packages.

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

## Post-backlog roadmap

These are enhancements, not unfinished 0.20 backlog.

### 0.21 — Web/Core convergence hardening
Replace remaining legacy-runtime bridges with typed adapters, expose full solver alternatives/reasons in the editor, and add browser-level regression tests.

### 0.22 — Observation extraction
Add optional vision/manual adapters that turn a generated image into observed structural regions before Evaluator v2. The evaluator itself stays provider-independent.

### 0.23 — Production provider plugins
Ship opt-in provider plugins outside canonical state. Each plugin must map the portable generation package to a provider API without leaking provider IDs into manga-blueprint/0.2.

### 0.24 — Iterative generation workflow
Generation → observation → evaluator report → human-approved semantic patch → bounded re-solve. No automatic aesthetic ranking and no silent overwrite of authored intent.

### 1.0 — Stability
Freeze documented contracts, migration policy, accessibility/performance budgets, browser matrix and release fixtures after real-project usage validates the 0.20 architecture.

## Invariants
- Human direction wins over AI recommendations.
- Clean is generation-facing; Annotated is review-only.
- Web and CLI use the same canonical project state.
- Provider-specific state stays outside canonical project JSON.
- Evaluator measures authored-intent preservation, not artistic quality.
