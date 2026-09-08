# AGENTS.md — Manga Blueprint Studio

## Mission

Manga Blueprint Studio is a human-directed manga planning tool. It records manuscript size, panel layout, character pose/placement, camera intent, backgrounds, text intent, and manga-specific effects, then exports a visual blueprint plus machine-readable semantics for downstream image-generation assistants.

The human is the director. AI is a renderer/assistant.

## Source of truth

1. `AGENTS.md`
2. `docs/PRODUCT.md`
3. `schema/manga-blueprint.schema.json`
4. `docs/ARCHITECTURE.md`
5. implementation under `web/`
6. `docs/ROADMAP.md`

When behavior and schema disagree, determine which contract is stale and update intentionally.

## Core invariants

### Human direction first

AI or random assistance must not silently replace recorded panel layout, pose, character assignment, camera intent, background intent, dialogue, or manga effects. Smart Random and presets are editable starting proposals.

### Visual + semantic blueprint

Every meaningful composition has two complementary representations: visual blueprint for space and `.manga.json` for meaning. Neither replaces the other.

### Stick figures are pose references

Stick figures communicate body relation, pose, position, approximate scale, and direction. They do not define appearance.

### Beginner-first terminology bridge

Professional terms remain in the data/model boundary, but beginner-facing Japanese UI must not present unexplained jargon as the only label. Pair terms such as `Extreme close` and `Low angle` with plain labels such as `超寄り` and `あおり`, plus a short usage explanation. Plain language is a bridge to the canonical term, not a second semantic model.

### Presets are patterns, not rules

Canvas and panel-layout presets provide common starting points. They do not imply that manga must follow a fixed grid. The user may split, resize, or otherwise move to `custom` state. 4-koma must distinguish at least 1×4 and 2×2 patterns.

### Random remains bounded and editable

Random generation must choose from valid layout patterns or validated geometry and record enough metadata to understand the result. Do not generate arbitrary overlapping/illegible panels merely for variety. The result must remain fully editable.

### Panel summaries are derived authoring metadata

At-a-glance panel summaries are derived from semantic state (role, pose/expression, camera, background, balloons, effects, breakout). Do not persist them as a competing source of truth. They may appear in annotated review output but must be absent from clean AI output.

### AI-safe text boundary

The editor may display character names, panel numbers, camera metadata, panel summaries, background notes, and SFX metadata. These are not final manga text. The default AI handoff PNG must omit them. The prompt must permit only exact text under `TEXT TO RENDER`.

### Character names are metadata

A display name such as `綴理` may exist for human usability but must not appear in clean AI output. Rendering identity is bound by `characterId` / Character Sheet key.

### Provider independence

Core data must not depend on a specific image provider. Provider adapters belong at the export boundary.

## Compatibility

- Current export format remains `manga-blueprint/0.2`.
- Prototype 0.4 adds optional `meta.canvasPreset`, `meta.layoutPreset`, and `meta.randomPurpose`.
- Legacy 0.1 and older 0.2 projects must normalize without losing core layout/character/camera data.

## Mobile-first UI

Japanese is the default. English translation is supported. On narrow screens the canvas appears before detail controls, editing sections use the fixed bottom tab bar, and primary controls are touch-sized without hover dependency. Help/dialog flows must fit narrow viewports.

## Security and privacy

Client-side only. Do not add analytics, telemetry, remote scripts, API calls, private Character Sheets, tokens, or credentials without an explicit documented boundary.

## Runtime

`web/app.js` loads `web/app-1.js` through `web/app-5.js` as plain static assets. Preserve zero-build GitHub Pages operation unless an intentional migration updates the contract.

## Definition of done

Relevant changes preserve:

- JS syntax validity for bootstrap and all runtime chunks;
- repository contract validation and legacy normalization;
- dynamic canvas dimensions across editor and PNG export;
- valid layout presets including 4-koma 1×4 and 2×2;
- bounded Smart Random with editable output;
- readable panel overview/summary;
- beginner camera term explanations and reopenable help;
- clean AI PNG with authoring text and summaries removed;
- annotated review PNG, prompt safety, JSON import/export;
- usable mobile layout and GitHub Pages deployment.

Visual review and deterministic validation are separate evidence. Do not call a UI visually verified based only on syntax/CI.
