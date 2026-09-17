# Roadmap

`docs/ROADMAP.md` is the **only current status authority** for delivery phases.

## Blueprint Engine preview — active experimental track

The Executable Name core now includes:

- AI-facing Markdown Name DSL → deterministic `manga-blueprint/0.2` compilation;
- Energy from narrative / visual / transition importance plus hold;
- Attention, gaze, motion direction and reading-flow semantics;
- candidate Layout Solver v2 using energy + hold + attention + gaze/motion direction + reading direction + explicit layout hints;
- explicit per-panel human geometry locks (`layout lock` / `コマ固定`) preserved as hard constraints across re-solve;
- direction advisor mapping semantic intent to inspectable manga-technique candidates without mutating authored state;
- semantic pose/gaze/depth/support/motion/contact compilation;
- deterministic 2D articulated pose/contact solving, including weapon contact anchors;
- layered Clean and Annotated Executable Name rendering from shared geometry;
- bounded co-author helpers for Story → Beat/Name proposal, single-panel semantic patching, and lock-before-local-re-solve workflows;
- strict visible-text separation, per-page prompt and manifest-first package;
- CI regression coverage for deterministic compilation, contact geometry, direction advice and human locks.

The Blueprint Engine remains an experimental authoring track alongside the established Web editor. The next work is no longer basic P1–P3 architecture; it is primarily **visual fidelity measurement, richer pose/prop geometry, character-reference binding, provider adapters and Web integration of the co-author loop**.

## Shipped through Prototype 0.19.0

The established Web product retains stable work/page/container identity, IndexedDB multi-work persistence, multi-page hierarchy, manga-first navigation, Story Templates/Smart Manga, quadrilateral/inset panel geometry, character identity modes, manga authoring semantics and selected-page manifest-first AI handoff.

## Delivery phases

**Phase 3 — Backup / Restore — Next** remains the next numbered Web product phase. Blueprint Engine work is parallel and does not silently reorder it.

| Phase | Priority | Goal | Status |
|---:|:---:|---|:---:|
| E | S-enabler | Headless Blueprint Engine / AI co-authoring | **P1–P3 core implemented; active fidelity/Web integration** |
| 0 | S | Storage / stable identity | **Shipped** |
| 1 | S | Multi-page Core | **Shipped in 0.13.0** |
| 2 | S | Work / Volume / Folder management | **Shipped in 0.14.0** |
| 2.5 | S | Manga-first editor shell / navigation UX | **Shipped** |
| 2.6 | A | Bounded Design Direction handoff | **Shipped** |
| 3 | S | Backup / Restore | **Next** |
| 4 | S | Scoped Export | Planned |
| 4.5 | S-enabler | Advanced Panel Geometry | **Quadrilateral foundation shipped** |
| 5 | S | Panel-first / Hybrid generation | Planned |
| 6 | A | Cross-page continuity / Reference Assets | Planned |
| 7 | A/B | Manga direction expansion | Planned |

## Blueprint Engine remaining quality work

1. **Clean ↔ generated-image metrics** — panel IoU, character occupancy/scale, pose silhouette, contact-point and balloon-region preservation.
2. **Pose/prop fidelity** — richer articulated silhouettes, hands, feet, weapon/prop classes, occlusion and panel clipping.
3. **Character reference binding** — headless appearance descriptions + explicit reference keys/assets.
4. **Web co-author integration** — expose Story → Beat proposal, technique advice, locks and bounded local re-solve in the editor without creating a second state model.
5. **Page-turn/spread grammar** — page-level rhythm, turn reveals and spread composition.
6. **Provider adapters** — explicit image-model invocation at adapter boundaries only.
7. **Raster portability** — deterministic Clean/Annotated PNG where a supported rasterizer exists.

## Established Web roadmap

```text
Storage / stable identity
  → multi-page core
  → work hierarchy
  → manga-first shell
  → Backup / Restore
  → Scoped Export
  → Panel-first / Hybrid
  → Cross-page continuity
  → Manga direction expansion
```

Blueprint Engine and Web editor converge on the same canonical project state; neither may introduce a competing project model.
