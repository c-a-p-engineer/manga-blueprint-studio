# AGENTS.md — Manga Blueprint Studio

## Mission

Manga Blueprint Studio is a human-directed manga planning tool. It records panel layout, character pose/placement, camera intent, backgrounds, text intent, and manga-specific effects, then exports a visual blueprint plus machine-readable semantics for downstream image-generation assistants.

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

AI must not silently replace recorded panel layout, pose, character assignment, camera intent, background intent, dialogue, or manga effects.

### Visual + semantic blueprint

Every meaningful composition has two complementary representations:

- **visual blueprint** — spatial layout;
- **semantic blueprint** — `.manga.json` meaning.

Neither replaces the other.

### Stick figures are pose references

Stick figures communicate body relation, pose, position, approximate scale, and direction. They do not define appearance.

### AI-safe text boundary

The editor may display authoring annotations such as:

- character display names;
- Character IDs;
- panel numbers;
- camera metadata;
- background notes;
- SFX metadata.

Those annotations are **not final manga text**.

The default AI handoff PNG must omit authoring text. The generated prompt must explicitly state that the only text allowed in final art is exact content listed under `TEXT TO RENDER` (dialogue/narration and deliberate onomatopoeia).

This boundary exists because multimodal models can copy visible blueprint labels into generated art.

### Character names are metadata

A display name such as `綴理` may exist in editor state for human usability. It must not be emitted as visible text in the clean AI blueprint, and the prompt compiler should identify the character by `characterId` / Character Sheet key rather than asking the renderer to draw the display name.

### Manga effects are semantic

Panel border style, borderless panels, bleed/断ち切り, breakout/ブチ抜き, effects, panel role, expression, gaze, balloons, and background treatment belong to the semantic contract.

### Provider independence

Core data must not depend on OpenAI, Gemini, Stable Diffusion, ComfyUI, or another provider. Provider adapters belong at the export boundary.

## Compatibility

- Current export format: `manga-blueprint/0.2`.
- The web app must accept legacy `manga-blueprint/0.1` projects and normalize missing 0.2 fields.
- Legacy import must not drop character identity, coordinates, pose, or camera values.

## Mobile-first UI

Japanese is the default UI language. English UI translation is optional but supported.

On narrow/mobile screens:

- canvas appears before detailed controls;
- editing sections are switched through a fixed bottom tab bar;
- primary controls use touch-sized targets;
- pointer interactions must work without hover.

## Security and privacy

- client-side only;
- no analytics, telemetry, remote scripts, or API calls without an explicit documented boundary;
- never commit private Character Sheets, tokens, or credentials.

## Runtime

The zero-build browser runtime is bootstrapped by `web/app.js` and split across `web/app-1.js` through `web/app-4.js`. Keep those files usable as plain static assets on GitHub Pages; do not introduce a build dependency merely to reorganize the prototype.

## Definition of done

Relevant changes must preserve:

- JS syntax validity for the bootstrap and all runtime chunks;
- repository contract validation;
- legacy project normalization;
- panel / character selection;
- clean AI PNG export with authoring text removed;
- annotated review PNG export;
- prompt text safety rule;
- JSON export/import;
- GitHub Pages workflow;
- usable mobile layout.

Visual review and deterministic validation are separate evidence. Do not call a UI fully visually verified based only on syntax/CI.
