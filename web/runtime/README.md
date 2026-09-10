# Runtime chunks

Manga Blueprint Studio stays a zero-build GitHub Pages application. `web/app.js` loads these files as ordered classic scripts so the existing global-state runtime keeps working without a bundler.

## Ownership

Runtime files are named by responsibility, not by the order in which a prototype happened to add them.

- `core/` — foundational state, rendering, export/input, and event bindings
- `authoring/` — page/layout/camera and reusable-character authoring
- `assist/` — bounded Smart Manga assistance
- `identity/` — character identity and appearance handoff
- `story/` — story-readable panel semantics and Smart Manga intent
- `templates/` — Story Template Studio, template quality, and scene/cast contracts
- `lettering/` — text writing direction
- `ordering/` — reading-order synchronization
- `integration/` — cross-feature integration that intentionally depends on earlier owners
- `handoff/` — prompt/manifest/render contracts for downstream image-generation models
- `ui/` — presentation-only layout and authoring clarity

## Rules

1. Preserve the explicit load order in `web/app.js`; later chunks currently extend globals established by earlier chunks.
2. New work should modify the semantic owner when one already exists instead of creating `app-N.js` or another version-numbered patch file.
3. A new named chunk is justified only when it has a distinct responsibility and cannot be placed cleanly in an existing owner.
4. Browser-visible behavior, project JSON, prompt, manifest, export packages, RTL/LTR, lettering, and legacy normalization remain public contracts during structural refactors.
5. Validators should reference semantic runtime paths. `scripts/validate-runtime-layout.mjs` prevents numbered runtime chunks from returning.

This directory structure is a behavior-preserving refactor. It does not by itself convert the classic-script global runtime to ES modules; that would be a separate migration with characterization tests and a cutover/rollback plan.
