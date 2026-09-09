# Research backlog — 2026-09-09

This document captures researched follow-up candidates after cross-model manga-generation testing. It is a planning aid, not a source of truth for shipped behavior; `AGENTS.md`, `docs/PRODUCT.md`, schema, architecture, and implementation remain authoritative for current behavior.

| Priority | Title | Summary | Notes |
|---|---|---|---|
| S | Panel-first / hybrid generation | Generate normal panels independently and deterministically compose the final page; support shared-canvas groups only for breakout/shared-background/spread cases. | Reduces whole-page instruction failure and aligns with frame/shot-oriented storyboard tooling. |
| S | Generated-result validator | Compare generated manga against Blueprint for panel count/order, cast, identity, action/pose, camera, text allowlist, background and continuity; emit targeted retry instructions. | Turns generation from best-effort output into inspectable contract verification. |
| S | Reference Asset Library | Generalize references to characters, locations, props, outfits, vehicles, style, pose, and lighting; optionally bundle explicitly approved local assets. | Character Sheet becomes one reference type rather than the only file-bound reference concept. |
| S | Pose Studio + Contact Graph | Direct joint editing, reusable pose presets, support/center of gravity, and semantic contacts such as hand→shoulder / hand→prop / foot→ground. | Needed for hugs, grabs, throws, strikes, hand-holding, and prop interaction. |
| S | Spatial continuity grammar | 180-degree axis, character screen side, entry/exit edge, movement vector, eyeline, shot/reverse-shot relation, and intentional axis-break override. | Prevents accidental left/right inversion across panels. |
| A | Perspective / lens contract | Horizon, vanishing points, camera height, pitch/roll, focal-length equivalent, and target body region. | Adds meaningful camera geometry without becoming a full 3D editor. |
| A | Depth layers / occlusion | Foreground/midground/background bands and explicit front/behind relations. | Strengthens near-object and multi-character composition. |
| A | Eye-flow / focal path | Primary focal target, panel entry/exit vectors, page reading-flow visualization, and warning against RTL/LTR flow conflicts. | Integrate balloon placement into visual flow. |
| A | Gutter / transition semantics | Encode temporal/spatial gap and transition rhythm between panels; make gutter recommendations advisory. | Useful for pacing and manga-specific timing. |
| A | Multi-page / spread / page-turn | Multiple pages, two-page spreads, binding-safe zones, and page-turn/reveal intent. | Expands from single-page direction into manga sequence direction. |
| A | Scene / location / prop / costume continuity | Reusable location and prop definitions with state, owner, hand/location, costume variant, and lighting continuity. | Enables continuity checks for disappearing props or unexplained state resets. |
| A | Control-map adapter export | Provider-independent structural maps with optional ComfyUI/ControlNet pose/depth/edge/segmentation adapters. | Keep provider-specific conversion at export boundary. |
| B | Deterministic final lettering | Balloon tail target, final vertical Japanese typesetting, ruby/kenten/tate-chu-yoko, SFX rotation/path. | Avoids asking image generators to perform final Japanese typography. |
| B | Advanced panel geometry | Shared-boundary drag, irregular/diagonal frames, inset/overlap, safer bleed visualization. | Requires reading-order rules to handle arbitrary geometry. |
| B | Script → beat/page planning | Convert script or story goal into editable scene/beat/page proposals. | Should remain bounded and human-approved. |
| B | Revision / diff history | Persist meaningful Blueprint revisions beyond Undo/Redo and compare contract-level changes. | Useful when testing multiple model outputs. |
| C | Animatic / audio timeline | Timing, audio, and animatic export. | Only if scope expands beyond manga planning; not a current core goal. |

See `docs/ROADMAP.md` for the maintained prioritized roadmap.
