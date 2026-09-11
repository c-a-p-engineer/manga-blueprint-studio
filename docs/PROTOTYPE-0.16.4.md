# Prototype 0.16.4 — Upper template workflow and Work Explorer

Prototype 0.16.4 removes two remaining UI detours: Story Template authoring now completes in the upper panel-layout area, and work/page navigation now opens from the active work title as one file-explorer-style surface.

## What changed

- Removed the separate middle Story Template section from the visible workflow.
- Moved Story Template cards into the upper Page settings / panel-layout flow.
- Kept the **sample dialogue/SFX** checkbox in that same flow; checked means template dialogue/SFX are created, unchecked means layout/direction is applied without them.
- Kept explicit primary/secondary character selection in the same flow.
- Made **このテンプレートを使う / Use this template** a full-width, always-visible primary action (disabled only until required choices are valid).
- The active work title now opens **作品エクスプローラー / Work Explorer**.
- Work Explorer combines saved-work switching and the current work page tree.
- Removed the separate 作品構成 button and the dedicated 巻・章・フォルダ editor from the primary UI. Existing/imported container data remains compatible and may still appear as nested folders in the tree.
- Page operations remain available as advanced controls.
- Narrow-screen page navigation uses the same four-control structure as desktop after the separate 作品構成 button was removed.

## Compatibility

- Project format remains `manga-blueprint/0.2`.
- Export manifest remains `manga-blueprint-export-manifest/3`.
- No project-state migration is required.
- Existing container semantics remain supported even though dedicated container editing is no longer a primary surface.

## Documentation

Current behavior is synchronized in `AGENTS.md`, `README.md`, `docs/README.md`, `docs/PRODUCT.md`, `docs/USER-GUIDE.md`, `docs/ARCHITECTURE.md`, `docs/ROADMAP.md`, and the public `/guide.html`.
