# Prototype 0.20.0

Prototype 0.20.0 consolidates the production baseline around the Executable Name workflow, shared canonical manga knowledge, deterministic layout/pose/contact solving, provider-neutral generation handoff, and bounded human review.

## Shipped

- Direction Advisor, shared Layout Recipe Bank + Solver v4, Scene Director v2, and articulated Pose / Prop / Contact Solver v2 operate over the canonical `manga-blueprint/0.2` project model.
- Clean and Annotated outputs share one solved geometry source. Clean remains generation-facing; Annotated is the human-review surface.
- Annotated review output exposes compact beat, character, attention, gaze, contact, camera/energy, and diagnostic guidance without leaking review-only annotations into Clean.
- Structural Evaluator v2 checks authored-intent preservation without becoming an aesthetic ranking system.
- Portable generation packages keep provider-specific request state outside canonical project JSON.
- Web production tooling includes backup/restore, selected-page export, bounded direction patches, shared Layout Recipe controls, and a public shareable Layout Catalog.
- Canonical manga knowledge is shared by agents, solver-facing code, and the public dictionary.
- CI validates schema, deterministic compilation, Clean/Annotated separation, generation contracts, Web runtime behavior, and documentation synchronization.

## Compatibility

- Project format remains `manga-blueprint/0.2`.
- Established Web export remains selected-page scoped with `manga-blueprint-export-manifest/3`.
- Existing projects require no migration for the Annotated review presentation or Layout Recipe additions; existing `layoutPreset` data remains compatible.

## Documentation

- Product contract: `docs/PRODUCT.md`
- Architecture: `docs/ARCHITECTURE.md`
- User workflow: `docs/USER-GUIDE.md` and `/guide.html`
- Blueprint Engine: `docs/BLUEPRINT-ENGINE.md`
- Current status: `docs/ROADMAP.md`
