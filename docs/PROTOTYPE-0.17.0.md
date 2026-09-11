# Prototype 0.17.0 — TypeScript/Vite Phase 1

Prototype 0.17.0 begins the runtime migration without pretending the legacy editor is already fully converted.

## Shipped

- Vite 8 becomes the production build and GitHub Pages delivery path.
- TypeScript owns the browser bootstrap and the first new UI surface.
- The existing classic-script runtime remains a compatibility/reference layer during the cutover and is still validated in its canonical load order.
- Runtime cache keys include both app version and deployed commit revision, preventing same-version Pages deployments from reusing stale JavaScript chunks.
- The Page settings flow is reorganized around the primary task: choose a Story Template, choose whether to use sample dialogue/SFX, choose the cast, then apply.
- The template apply action is a large explicit CTA and has a TypeScript capture-path fallback to the canonical template application routine.
- Manual panel-layout controls move behind progressive disclosure instead of competing with the primary template flow.
- The legacy visible Volume / Chapter / Folder editor is removed from the primary Page surface. Existing serialized hierarchy data remains compatible and continues to appear as nested folders in Work Explorer.
- Mobile controls keep touch-sized template selectors and a visible apply action above the bottom editor navigation.

## Verification

- `npm run typecheck`
- `npm run build`
- Phase 1 toolchain / UI contract validation
- Existing repository/runtime/schema/template/export validators
- GitHub Pages deployment from `dist/`

Visual/interaction verification remains distinct from static CI. Public Pages source and build provenance are checked after deployment; paid browser automation is not required for this release.

## Documentation

Current behavior is described in `docs/PRODUCT.md` and `docs/USER-GUIDE.md`. The public guide remains available at `/guide.html` (`web/guide.html` in source). Architecture and migration ownership are documented in `docs/ARCHITECTURE.md`.
