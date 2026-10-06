# Roadmap

This file is the delivery/status authority.

## Production baseline — 0.25.0

Prototype 0.25.0 extends the 0.20 production baseline with a closed quality loop: image-facing observation, Spatial Intelligence v3, human-approved bounded repair, cross-page continuity and deterministic lettering.

### Completed inventory

- [x] 0.20 production baseline: canonical knowledge, Direction Advisor, shared Layout Recipe Bank + Solver v4, Scene Director v2, Clean/Annotated renderer v3, Structural Evaluator v2, provider-neutral generation package, Web production tools and multi-page CLI packages.
- [x] Shared Layout Recipe Bank: Core/CLI/Web/catalog use one recipe authority; deterministic seed/mutation produces reusable base geometry while diagonal/inset/bleed/breakout remain post-layout expression.
- [x] 0.21 Web/Core convergence hardening for active quality-loop surfaces:
  - typed legacy bridge owns compatibility-global access;
  - Layout Recipe UI can inspect current solver winner, candidates and rationale without mutating the page;
  - touched Web/Core surfaces remain covered by build/runtime contract validators and deployed-page verification.
  - A full legacy-runtime rewrite is deliberately not required; `AGENTS.md` architecture rules remain authoritative.
- [x] 0.22 Observation extraction:
  - provider-neutral observation request/normalization/evaluation contracts;
  - image-facing manual/vision adapter using pixel coordinates;
  - confidence-aware panel/cast/pose/contact/lettering evidence;
  - drift diagnostics for panel count, cast, reading direction, writing mode and visible text;
  - missing/uncertain evidence is never fabricated from the expected Blueprint.
- [x] 0.23 Spatial Intelligence v3:
  - torso/pelvis orientation, support polygon, center of mass, balance and joint sanity;
  - crouched, seated, lying and leaning posture families;
  - perspective-aware prop/contact derivation;
  - In-panel Composition Solver v1 with reserved-region avoidance and negative-space planning;
  - Detail / Salience Budget for primary characters, extras/crowds and background information density.
- [x] 0.24 Human-approved iterative repair:
  - diagnostic → Repair Plan → explicit Approval → provider-neutral Repair Context;
  - local render/lettering constraints do not silently rewrite canonical state;
  - optional canonical semantic patches are whitelist-bounded and require explicit approval.
- [x] 0.25 Continuity + production lettering:
  - Continuity Graph v1 across panels/pages for screen side, facing, prop hand, outfit/condition and intentional breaks;
  - deterministic lettering plan and transparent SVG overlay for exact dialogue/SFX;
  - CLI emits per-page lettering SVG/JSON and generation packages reference them.

## Next roadmap

### 0.26 — Production provider adapters

Ship opt-in provider adapters for generation and observation at the external boundary.

Acceptance:
- at least one generation adapter and one observation adapter work end-to-end;
- provider request IDs, credentials and model-specific knobs remain outside canonical `manga-blueprint/0.2`;
- provider failures/provenance remain diagnosable without changing manga semantics.

### 0.27 — Real-project hardening

Use completed one-page and multi-page manga projects as regression fixtures. Improve false-positive control in continuity/pose diagnostics, lettering typography, and observation confidence calibration from real output.

### 1.0 — Stability

Freeze documented contracts, migration policy, accessibility/performance budgets, browser matrix and release fixtures after real-project use validates the observation → evaluation → repair loop.

## Explicitly deferred unless real usage proves otherwise

- large-scale expansion of Base Layout Recipes without demonstrated coverage gaps;
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
- Deterministic lettering preserves exact authored text and remains separate from image-model appearance generation.
