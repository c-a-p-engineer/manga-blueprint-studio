# AGENTS.md — Manga Blueprint Studio

## Mission

Manga Blueprint Studio is a human-directed manga planning tool. It records manuscript size, reading direction, panel layout, reusable character identity, character pose/placement, camera intent, backgrounds, text intent, and manga-specific effects, then exports a visual blueprint plus machine-readable semantics for downstream image-generation assistants.

The human is the director. AI and bounded random assistance are proposal/rendering tools.

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

AI or random assistance must not silently replace recorded panel layout, pose, character assignment, camera intent, background intent, dialogue, or manga effects. Smart Manga, panel dice, and presets are editable starting proposals. Candidate preview must not mutate the page before the user explicitly chooses a candidate.

### Visual + semantic blueprint

Every meaningful composition has two complementary representations: visual blueprint for space and `.manga.json` for meaning. Neither replaces the other.

### Reading direction is explicit

Japanese right-to-left (`rtl`) is the default, but left-to-right (`ltr`) is supported. Panel numbering, candidate preview numbering, and generated prompt direction must use `meta.readingDirection`; do not assume RTL in rendering or export code.

### Base characters are reusable identity definitions

`characterLibrary` stores reusable project-level character definitions. Placing a base character creates a panel-specific instance with the same `characterId`, display name, and Character Sheet reference key. Instance pose/expression/gaze may diverge without mutating the base unless the user explicitly saves back to the base.

Smart Manga may place the currently selected base character across proposed panels only when the user enables that option.

Legacy projects without `characterLibrary` must normalize by deriving non-destructive base definitions from existing placed characters.

### Stick figures are pose references

Stick figures communicate body relation, pose, position, approximate scale, and direction. They do not define appearance.

The editor and annotated review PNG may color-code anatomy for readability. The clean AI PNG must keep pose figures monochrome so authoring colors are not mistaken for character design.

### Beginner-first terminology bridge

Professional terms remain in the data/model boundary, but beginner-facing Japanese UI must not present unexplained jargon as the only label. Pair terms such as `Extreme close` and `Low angle` with plain labels such as `超寄り` and `あおり`, plus a short usage explanation. Plain language is a bridge to the canonical term, not a second semantic model.

The Help dialog is a maintained product surface, not a temporary onboarding note. All help sections and camera-reference descriptions must follow the selected UI language.

### Presets are patterns, not rules

Canvas and panel-layout presets provide common starting points. They do not imply that manga must follow a fixed grid. The user may split, resize, or otherwise move to `custom` state. 4-koma must distinguish at least 1×4 and 2×2 patterns.

The default 800×1130 preset must be labeled by actual dimensions/purpose, never as ambiguous wording such as “current size”.

### Smart Manga remains bounded, previewable, reproducible, and editable

Smart Manga chooses only from valid layout patterns and validated direction profiles. It does not create arbitrary overlapping/illegible geometry merely for variety.

- purpose and optional panel count constrain candidates;
- one request returns three candidates for comparison;
- candidate generation does not mutate the current page;
- a candidate becomes project state only after explicit selection;
- the chosen seed is stored as `meta.randomSeed` and the chosen emphasis as `meta.randomVariant` so proposals can be reproduced;
- candidate preview numbering follows `meta.readingDirection`;
- optional base-character placement may seed pose/expression/gaze per panel;
- every result remains fully editable.

The per-panel dice is narrower than Smart Manga. It preserves panel geometry, background content, and balloons, while re-proposing camera/effects/breakout and placed-character pose/expression/gaze. It must remain undoable.

### Guided free text

Fields such as background location/weather/mood should provide useful suggestions without turning the suggestions into a closed vocabulary. Native select-and-type patterns such as `<input list>` are preferred where the semantic field remains free text.

### Panel summaries are derived authoring metadata

At-a-glance panel summaries are derived from semantic state (role, pose/expression, camera, background, balloons, effects, breakout). Do not persist them as a competing source of truth. They may appear in annotated review output but must be absent from clean AI output.

### AI-safe text boundary

The editor may display character names, panel numbers, camera metadata, panel summaries, background notes, and SFX metadata. These are not final manga text. The default AI handoff PNG must omit them. The prompt must permit only exact text under `TEXT TO RENDER`.

The prompt must identify the clean PNG as the generation reference. If an annotated review PNG is supplied separately, its labels are authoring metadata and must never be treated as visible final-art text.

### Export-set identity and package separation

Files produced from the same serialized project state must be traceable as one set.

- individual exports and ZIP contents use a shared filename prefix containing local `YYYYMMDD_HHMMSS` and a short SHA-256;
- the short hash derives from serialized project state, not from the file bytes;
- repeated individual exports without project changes reuse the same in-session export identity;
- the UI must not display an old export identity as current after project state changes;
- a manifest records an export UUID, full SHA-256, short hash, timestamp, canvas, reading direction, package type, and filenames;
- identical content hash means the same serialized Manga Blueprint state. It does not claim that PNG byte hashes are identical across browsers;
- failed/empty PNG encoding must fail the export rather than silently packaging an invalid member.

Two ZIP packages have distinct purposes:

1. **AI generation ZIP (`ai-generation`)** — clean PNG + `.manga.json` + prompt + manifest. It MUST NOT include the annotated review PNG.
2. **Review / archive ZIP (`review-archive`)** — the same state-linked materials plus the annotated review PNG for human review and storage.

Both package types share the same export identity when generated from the same unchanged project state.

### Provider independence

Core data must not depend on a specific image provider. Provider adapters belong at the export boundary.

## Compatibility

- Current export format remains `manga-blueprint/0.2`.
- Prototype 0.4 added optional `meta.canvasPreset`, `meta.layoutPreset`, and `meta.randomPurpose`.
- Prototype 0.5 added optional top-level `characterLibrary` while preserving older 0.2 projects.
- Prototype 0.6 adds optional `meta.randomSeed`, `meta.randomVariant`, and panel `assistSeed` provenance while preserving older projects.
- Legacy 0.1 and older 0.2 projects must normalize without losing core layout/character/camera data.

## Mobile-first UI

Japanese is the default. English translation is supported. On narrow screens the canvas appears before detail controls, editing sections use the fixed bottom tab bar, and primary controls are touch-sized without hover dependency. Help/dialog flows, reusable-character controls, Smart Manga candidate cards, and export actions must fit narrow viewports.

Primary/secondary action hierarchy matters: AI generation ZIP is the recommended handoff action; review/archive ZIP is secondary. Smart Manga should surface a short recommended workflow rather than forcing the user to infer the order of tabs.

## Security and privacy

Client-side only. Do not add analytics, telemetry, remote scripts, API calls, private Character Sheets, tokens, or credentials without an explicit documented boundary.

ZIP packaging, hashing, UUID generation, seeded proposal generation, and filename creation execute locally in the browser.

## Runtime

`web/app.js` loads `web/app-1.js` through `web/app-8.js` as plain static assets. Preserve zero-build GitHub Pages operation unless an intentional migration updates the contract.

## Definition of done

Relevant changes preserve:

- JS syntax validity for bootstrap and all runtime chunks;
- repository contract validation and legacy normalization;
- dynamic canvas dimensions across editor and PNG export;
- valid layout presets including 4-koma 1×4 and 2×2;
- explicit RTL/LTR reading direction and renumbering;
- bounded Smart Manga with three non-mutating candidate previews, stored seed/variant provenance, optional base-character placement, and editable output;
- per-panel direction dice that is undoable and does not replace geometry/background content/balloons;
- reusable base-character library plus placed instances;
- anatomy-readable editor/review stick figures with monochrome clean AI figures;
- guided free-text background inputs;
- readable panel overview/summary;
- beginner camera term explanations and fully localized reopenable help;
- clean AI PNG with authoring text and summaries removed;
- annotated review PNG, prompt safety, JSON import/export;
- traceable individual filenames;
- AI generation ZIP excludes annotated PNG and includes clean PNG + JSON + prompt + manifest;
- Review / archive ZIP includes the annotated PNG under the same export identity;
- export identity display invalidates when project state changes;
- usable mobile layout and GitHub Pages deployment.

Visual review and deterministic validation are separate evidence. Do not call a UI visually verified based only on syntax/CI.
