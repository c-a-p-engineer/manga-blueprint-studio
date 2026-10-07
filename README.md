# Manga Blueprint Studio

**Design how a manga should read before asking an image model to draw it.**

Manga Blueprint Studio 0.25.0 is a human-directed, AI-assisted manga planning system. Story/Name intent becomes an **Executable Name** containing panel layout, attention, reading flow, camera, articulated pose, prop/contact geometry, lettering reservations and scene rhythm.

Current prototype: 0.25.0

## Surfaces
- Product: https://c-a-p-engineer.github.io/manga-blueprint-studio/
- Web editor: https://c-a-p-engineer.github.io/manga-blueprint-studio/editor.html
- Technique guide: https://c-a-p-engineer.github.io/manga-blueprint-studio/techniques.html
- Expression dictionary: https://c-a-p-engineer.github.io/manga-blueprint-studio/dictionary.html
- User guide: https://c-a-p-engineer.github.io/manga-blueprint-studio/guide.html
- Layout catalog: https://c-a-p-engineer.github.io/manga-blueprint-studio/layout-catalog.html

The Web editor is the human supervision surface. The CLI is the deterministic/agent surface. Both converge on `manga-blueprint/0.2`.

## CLI
```bash
npm install
npm run blueprint -- examples/combat-1p.md blueprint-out
node cli/manga-blueprint.mjs --list-layouts 4
node cli/manga-blueprint.mjs examples/combat-1p.md blueprint-out --layout hero-bottom --seed 42 --mutation 0.25
node cli/manga-blueprint.mjs examples/scene-3page.md blueprint-out --contact-sheet
```
Output includes `work.manga.json`, per-page Clean/Annotated SVG, deterministic lettering SVG/JSON, optional PNG, prompt, portable `generation.json`, and manifest. Clean is generation-facing; Annotated is human-review only. `--contact-sheet` additionally emits a single multi-page Clean sheet, merged preflight prompt, page-indexed review request and provider-neutral generation package. Layout is selected automatically (`2P → 2×1`, `3–4P → 2×2`, `5–8P → 4×2`); it is intended for batch QA and page-targeted repair, not final publication acceptance.

## Pipeline
```text
Story / Name DSL
 → Canonical Manga Knowledge
 → Direction Advisor
 → Scene Director v2
 → Layout Recipe Bank + Solver v4
 → Spatial Intelligence v3 + In-panel Composition
 → Continuity Graph v1
 → Canonical manga-blueprint/0.2
 → Clean + Prompt + References + deterministic lettering
 → Portable Generation Package
 → external provider / generated image
 → Image Observation + Structural Evaluator v2
 → Human-approved Repair Context
 → bounded regeneration / deterministic lettering overlay
```

## Web production workflow
The editor retains IndexedDB multi-work/multi-page authoring and adds backup, restore, selected-page export and bounded direction patches. Panel geometry supports rectangle and convex-quadrilateral shapes. The shared Layout Recipe Bank can be selected by panel count and reproduced with seed/mutation in CLI or Web; the public Layout Catalog provides copyable/shareable settings. Public LP, editor, layout catalog, technique guide, operation guide and dictionary remain separate surfaces.

See `docs/USER-GUIDE.md` for the maintained user workflow.

## Development
```bash
npm install
npm run typecheck
npm run build
npm run validate
```

See `docs/ROADMAP.md` for post-0.20 enhancements. License: MIT.
