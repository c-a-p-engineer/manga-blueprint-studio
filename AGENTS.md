# AGENTS.md — Manga Blueprint Studio

## Mission

Manga Blueprint Studio is a human-directed manga planning tool. It records manuscript size, reading direction, panel layout, reusable character identity, character appearance policy, story action intent, pose/placement, camera intent, backgrounds, dialogue/SFX, and manga-specific effects, then exports a visual blueprint plus machine-readable semantics for downstream image-generation assistants.

The human is the director. AI and bounded random/template assistance are proposal/rendering tools.

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

AI, Smart Manga, story templates, panel dice, and presets must not silently replace recorded panel layout, action intent, pose, character assignment, appearance policy, camera intent, background intent, dialogue, or manga effects. They are editable starting proposals. Candidate preview must not mutate the page before explicit selection.

### Visual + semantic blueprint

Every meaningful composition has complementary representations: visual blueprint for space and `.manga.json` for meaning. Character identity is supplied by project-level character guidance and, only when selected, separately attached Character Sheets.

### Reading direction is explicit

Japanese right-to-left (`rtl`) is the default, but left-to-right (`ltr`) is supported. Panel numbering, layout thumbnails, Smart Manga preview numbering, Panel List order, and generated prompt direction use `meta.readingDirection`.

### Story action intent is explicit but lightweight

Each panel may contain `actionIntent`: a short human-authored description of what actually happens in the panel when pose alone is insufficient. It is semantic source data, not generated prose and not authoring decoration.

- it may appear in Panel Peek, Panel List, manifest index, and generated prompt;
- it must not be rendered as visible manga text;
- older projects normalize missing `actionIntent` to an empty string;
- derived panel summaries do not replace `actionIntent` as source of truth.

### Story templates are editable rough names

Prototype 0.8 ships bounded story templates that can seed panel geometry, narrative role, `actionIntent`, camera, pose/expression/gaze, background, and optionally sample dialogue/SFX.

- template apply is explicit and destructive only after confirmation when authored content exists;
- sample dialogue/SFX may be disabled before apply;
- sample text is ordinary editable manga text after apply, not protected canonical copy;
- story templates may place the selected/first reusable base character when available;
- templates must use valid shipped layout geometry and keep all resulting content editable;
- `meta.storyTemplate` records provenance only; it does not make the template a continuing authority after editing.

### Base characters are reusable identity definitions

`characterLibrary` stores reusable project-level identity definitions. Placing one creates a panel-specific instance with the same `characterId`, display name, and reference key. Instance pose/expression/gaze may diverge without mutating the base unless explicitly saved back.

A base character has one visual identity mode:

1. `sheet` — an external Character Sheet is required; `referenceKey` maps it.
2. `description` — no Character Sheet is required; text appearance guidance is the identity contract.
3. `free` — no Character Sheet is required; the downstream model may choose a simple appearance but must keep it consistent across panels.

Optional appearance guidance may contain a free summary plus hair, eyes, outfit, and distinctive features. Suggestions must remain free text, not a closed character generator. Localized presets/suggestions must write values in the selected UI language rather than mixing languages silently.

Legacy bases with a non-empty reference key normalize to `sheet`; those without one normalize to `description`. Do not destroy placed instances while deriving/upgrading base definitions.

Smart Manga and story templates may place a reusable base character only through explicit user-controlled flows.

### Character Sheet diagnostics are derived, not blockers

The Output tab and manifest derive Character Sheet requirements from base characters actually used on the page.

- sheet + reference key: request a separately attached Character Sheet;
- sheet + empty key: warn that mapping is incomplete;
- description/free: Character Sheet is not required.

Do not claim a Character Sheet file is bundled when the browser only stores a reference key. Export remains possible; the manifest must state the true status.

### Prompt identity wording follows identity mode

Generated prompts must not state that character identity “comes only from Character Sheets.” Character identity follows `CHARACTER IDENTITY GUIDANCE`, and separately attached Character Sheets are used only for characters whose identity mode requires them.

### Stick figures are pose references

Stick figures communicate body relation, pose, position, approximate scale, and direction. They do not define appearance.

Editor/annotated review may color-code anatomy. Clean AI PNG keeps pose figures monochrome so authoring colors are not interpreted as character design.

### Beginner-first terminology bridge

Professional terms remain in data/model boundaries, but beginner-facing Japanese UI must not present unexplained jargon as the only label. Pair terms such as `Extreme close` and `Low angle` with `超寄り` and `あおり`, plus a short explanation.

A lightweight camera diagram may visualize distance/angle, but it is explanatory UI only and must not become a second camera semantic model.

The Help dialog is a maintained localized product surface. All sections follow the selected UI language.

### Panel Peek and Panel List are authoring views

Users must be able to understand a page without opening every editor tab.

- long-pressing a panel or tapping its discoverable `ⓘ` affordance opens Panel Peek;
- Panel Peek summarizes action, characters, camera, background, dialogue, effects, and camera-scale diagnostics;
- Panel List / Shot List view presents panels in reading order with richer semantic summaries;
- compact Panel Chips may appear over the editor canvas for at-a-glance reading;
- Panel Peek/List/Chip text is authoring metadata and must never appear in clean AI output.

Long-press must not be the only way to discover Panel Peek.

### Camera semantics and visual scale should not contradict silently

The visual stick-figure size and semantic camera distance are complementary instructions. Prototype 0.8 derives a framing diagnostic from selected camera distance and figure-to-panel fill.

- obvious conflicts such as `extreme-close` plus a very small full-body figure should be warned;
- an optional fit action may adjust figure scale, but never silently changes user state;
- the Crop Guide is an authoring-only dotted reference and is excluded from clean AI PNG;
- framing thresholds are heuristic authoring assistance, not a replacement for camera semantics.

### Manga lint is advisory

Prototype 0.8 may flag likely readability/direction problems such as missing action intent, repeated camera distance, all backgrounds unspecified, repeated expression, or camera/figure-scale conflict.

Lint is advisory. It must not block export or rewrite the page automatically.

### Presets are patterns, not rules

Canvas/layout/background/balloon/story presets are editable starting points. They never imply a fixed manga grammar.

- default 800×1130 preset uses an unambiguous dimension/purpose label, never “current size”;
- 4-koma distinguishes at least 1×4 and 2×2;
- layout thumbnails derive from the same layout geometry as the canonical preset selector;
- browsing a layout thumbnail must not discard authored content; explicit apply uses the normal reset/confirmation path;
- background presets write existing semantic fields in the selected UI language, after which each value remains editable;
- balloon presets set type/size/position and preserve existing text when modifying a selected balloon.

### Smart Manga remains bounded, previewable, reproducible, and editable

Smart Manga chooses only from valid shipped layouts/direction profiles.

- purpose and optional panel count constrain candidates;
- supported intent profiles include action, conversation, gag, daily, climax, 4-koma, romance/rom-com, cute, suspense, and character introduction;
- one request returns three candidates;
- candidate generation does not mutate the current page;
- candidate becomes project state only after explicit selection;
- seed is stored as `meta.randomSeed`;
- emphasis is stored as `meta.randomVariant` (`balanced | dynamic | emotion`);
- intensity is stored as `meta.randomIntensity` (`stable | standard | bold`);
- candidate numbering follows reading direction;
- optional base-character placement may seed pose/expression/gaze;
- every result remains editable.

`stable` reduces extreme framing, `standard` keeps the normal profile, and `bold` may strengthen close-ups/tilts/effects/breakout. Intensity is still a bounded proposal control, not permission to create invalid geometry.

The per-panel dice is narrower. It preserves panel geometry, entered background content, balloons/dialogue, and narrative role while re-proposing camera/effects/breakout and placed-character pose/expression/gaze. It remains undoable.

### Guided free text

Fields such as background location/weather/mood and character appearance details provide suggestions without becoming closed vocabularies. Native select-and-type patterns such as `<input list>` are preferred where the stored semantic value remains free text. When appearance mode is `free`, appearance-detail controls are disabled to make the active identity contract unambiguous.

### Panel summaries are derived authoring metadata

At-a-glance summaries are derived from semantic state. They may include role, action intent, pose, expression, gaze, camera, background/time, balloon count/snippet, effects, and breakout. Do not persist them as a competing source of truth. They may appear in annotated review but must be absent from clean AI output.

### AI-safe text boundary

Editor/review output may display character names, panel numbers, camera metadata, summaries, action notes, background notes, and SFX metadata. These are not final manga text. Clean AI PNG omits them. Prompt permits only exact text under `TEXT TO RENDER`.

The prompt names clean PNG as the generation reference. If annotated review is supplied separately, its labels remain authoring metadata.

### Manifest-first handoff

The AI handoff manifest is the detailed read-first authority. Prototype 0.8 continues `manga-blueprint-export-manifest/3`.

It records:

- export/package identity;
- file mapping and explicit file roles;
- manifest filename as `instructions.readFirst`;
- clean PNG as primary visual reference;
- `.manga.json` as semantic contract;
- prompt file as generation instructions;
- `annotatedReviewAllowedForGeneration: false`;
- character guidance / Character Sheet requirements;
- story-template provenance and a panel intent index when available;
- a compact user-message template.

The UI may provide a short copyable sentence such as “extract the ZIP and read the manifest first.” That message is convenience UX; manifest remains authoritative.

### Export-set identity and package separation

Files from the same serialized project state are traceable as one set.

- shared prefix contains local `YYYYMMDD_HHMMSS` and short project-state SHA-256;
- manifest records export UUID, full SHA-256, short hash, timestamp, canvas, reading direction, package type, and filenames;
- repeated exports without project changes reuse in-session identity;
- UI must not display stale identity after project mutation;
- failed/empty PNG encoding fails export.

Two ZIP packages have distinct purposes:

1. **AI generation ZIP (`ai-generation`)** — clean PNG + `.manga.json` + prompt + manifest. MUST NOT include annotated PNG.
2. **Review / archive ZIP (`review-archive`)** — same state-linked materials plus annotated PNG.

Both package types share export identity for unchanged state.

### Provider independence

Core data does not depend on a specific image provider. Provider adapters belong at the export boundary.

## Compatibility

- Current project export format remains `manga-blueprint/0.2`.
- Prototype 0.4 added optional canvas/layout/random-purpose metadata.
- Prototype 0.5 added optional `characterLibrary`.
- Prototype 0.6 added random seed/variant and panel assist provenance.
- Prototype 0.7 added optional base-character `identityMode` / `appearance` and `meta.randomIntensity`, plus manifest v3 packaging metadata.
- Prototype 0.8 adds optional `meta.storyTemplate` and panel `actionIntent`; old projects normalize both safely.
- Legacy 0.1 and older 0.2 projects normalize without losing core layout/character/camera data.

## Mobile-first UI

Japanese is default; English translation is supported. On narrow screens canvas appears before detail controls, editing sections use the bottom tab bar, and primary controls are touch-sized without hover dependency.

Primary hierarchy:

1. Smart Manga / story template / visual layout;
2. reusable character + appearance source;
3. Panel Peek / Panel List for quick understanding;
4. selected-panel refinement;
5. background/text presets or free editing;
6. AI generation ZIP + short handoff copy;
7. Review/archive actions secondary.

Horizontal visual-choice strips may scroll on narrow screens rather than shrinking options into unreadable thumbnails. Panel Peek becomes a bottom-sheet style dialog on narrow screens.

## Security and privacy

Client-side only. Do not add analytics, telemetry, remote scripts, API calls, private Character Sheets, tokens, or credentials without explicit documented boundary.

ZIP packaging, hashing, UUID generation, seeded proposal generation, filename creation, appearance guidance, story templates, lint, and diagnostics execute locally in the browser.

## Runtime

`web/app.js` loads `web/app-1.js` through `web/app-11.js` as plain static assets. `app-10.js` retains Prototype 0.7 localization/state hardening; `app-11.js` owns Prototype 0.8 story readability. Preserve zero-build GitHub Pages operation unless an intentional migration updates the contract.

## Definition of done

Relevant changes preserve:

- JS syntax validity for bootstrap and all runtime chunks;
- repository contract validation and legacy normalization;
- dynamic canvas dimensions;
- valid layout presets including 4-koma 1×4 and 2×2;
- explicit RTL/LTR reading direction;
- bounded Smart Manga with three non-mutating candidates, purpose/seed/variant/intensity provenance, optional base placement, and editable output;
- story templates that explicitly apply valid geometry/action/camera and optionally editable sample dialogue/SFX;
- `actionIntent` persisted in `.manga.json`, shown in authoring views, and forwarded to prompt/manifest without becoming visible manga text;
- long-press Panel Peek plus discoverable `ⓘ` fallback;
- detailed/compact Panel List and authoring-only Panel Chips;
- framing diagnostic and authoring-only Crop Guide, with optional explicit scale fit;
- advisory manga lint that never blocks export;
- per-panel dice that preserves geometry/background/balloons/role and remains undoable;
- reusable base-character library with sheet/description/free identity modes;
- Character-Sheet-free description/free workflows;
- appearance guidance persisted to `.manga.json` and propagated to manifest/prompt;
- prompt wording that does not incorrectly require Character Sheets for description/free modes;
- visible Character Sheet requirement/missing-key diagnostics;
- free appearance mode visibly disables inactive appearance-detail inputs;
- localized background preset semantic values follow UI language;
- anatomy-readable review figures with monochrome clean figures;
- guided free-text background inputs plus editable scene presets;
- balloon presets that do not erase existing dialogue;
- readable derived panel summaries;
- beginner camera explanation plus explanatory visual diagram;
- localized reopenable Help;
- visual layout thumbnail selection with explicit apply;
- clean AI PNG with authoring metadata removed;
- annotated review PNG, prompt safety, JSON import/export;
- AI generation ZIP excludes annotated PNG;
- Review ZIP includes annotated PNG under the same export identity;
- manifest v3 is read-first and records file roles + character guidance + Character Sheet mapping + panel intent index;
- compact JA/EN handoff message is copyable;
- stale export identity invalidates after project state changes;
- usable mobile layout and GitHub Pages deployment.

Visual review and deterministic validation are separate evidence. Do not call a UI visually verified based only on syntax/CI.
