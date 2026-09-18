# Manga Blueprint Studio

**Design how a manga should read before asking an image model to draw it.**

Manga Blueprint Studio 0.20.0 is a human-directed, AI-assisted manga planning system. Story/Name intent becomes an **Executable Name** containing panel layout, attention, reading flow, camera, articulated pose, prop/contact geometry, lettering reservations and scene rhythm.

## Surfaces
- Product: https://c-a-p-engineer.github.io/manga-blueprint-studio/
- Web editor: https://c-a-p-engineer.github.io/manga-blueprint-studio/editor.html
- Technique guide: https://c-a-p-engineer.github.io/manga-blueprint-studio/techniques.html
- Expression dictionary: https://c-a-p-engineer.github.io/manga-blueprint-studio/dictionary.html
- User guide: https://c-a-p-engineer.github.io/manga-blueprint-studio/guide.html

The Web editor is the human supervision surface. The CLI is the deterministic/agent surface. Both converge on `manga-blueprint/0.2`.

## CLI
```bash
npm install
npm run blueprint -- examples/combat-1p.md blueprint-out
```
Output includes `work.manga.json`, per-page Clean/Annotated SVG, optional PNG, prompt, portable `generation.json`, and manifest. Clean is generation-facing; Annotated is human-review only.

## Pipeline
```text
Story / Name DSL
 → Canonical Manga Knowledge
 → Direction Advisor
 → Scene Director v2
 → Layout Solver v3
 → Pose / Prop / Contact Solver v2
 → Canonical manga-blueprint/0.2
 → Clean + Prompt + References
 → Portable Generation Package
 → external provider adapter
 → Generated image
 → Structural Evaluator v2
 → human review / bounded correction
```

## Web production workflow
The editor retains IndexedDB multi-work/multi-page authoring and adds backup, restore, selected-page export and bounded direction patches. Public LP, editor, technique guide, operation guide and dictionary remain separate surfaces.

## Development
```bash
npm install
npm run typecheck
npm run build
npm run validate
```

See `docs/ROADMAP.md` for post-0.20 enhancements. License: MIT.
