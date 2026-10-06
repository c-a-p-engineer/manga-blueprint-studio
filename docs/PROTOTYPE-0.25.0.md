# Prototype 0.25.0 — Quality Loop

Prototype 0.25.0 closes the roadmap through post-generation observation, spatial reasoning, bounded repair and continuity/lettering production support.

## Shipped

- typed Web/Core layout decision inspection without adding a second project model;
- provider-neutral image observation adapter with confidence-aware evidence;
- Spatial Intelligence v3:
  - torso/pelvis orientation;
  - support polygon and center of mass;
  - balance and joint-range diagnostics;
  - crouched, seated, lying and leaning posture families;
  - perspective-aware props and contact;
- In-panel Composition Solver v1 with reserved-region avoidance and negative-space planning;
- Detail / Salience Budget for character, crowd and background simplification;
- human-approved Repair Plan / Approval / Context contracts;
- Continuity Graph v1 across panels/pages, including screen side, facing, prop hand, outfit/condition and intentional-break handling;
- deterministic lettering plan + transparent SVG overlay for exact authored dialogue/SFX;
- CLI packaging of lettering SVG/JSON and repair-aware generation contracts.

## Authority boundary

`manga-blueprint/0.2` remains canonical. Observation evidence, provider request IDs and repair execution state do not become competing canonical project formats.

## Verification

The 0.25 contract is covered by `scripts/validate-quality-loop-v25.mjs` plus existing build, schema, CLI, renderer, Web bridge and production validators.
