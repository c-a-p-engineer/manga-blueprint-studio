# AGENTS.md — Manga Blueprint Studio

## Mission

Manga Blueprint Studio is a human-directed manga planning tool. It records manuscript size, reading direction, panel layout, reusable character identity, character appearance policy, story action intent, pose/placement, camera intent, backgrounds, dialogue/SFX, and manga-specific effects, then exports a visual blueprint plus machine-readable semantics for downstream image-generation assistants.

The human is the director. AI, Smart Manga, Story Templates, and bounded assistance are proposal/rendering tools.

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

Assistance must not silently replace recorded panel layout, action intent, pose, character assignment, appearance policy, camera intent, background intent, dialogue, or manga effects. Candidate preview never mutates current page. Explicitly applied Story Templates / Smart Manga output becomes ordinary editable project state.

### Visual + semantic blueprint

The visual blueprint communicates space. `.manga.json` communicates meaning. Project-level character guidance and, only when required, separately attached Character Sheets communicate identity.

### Reading direction is explicit

Japanese right-to-left (`rtl`) is default; left-to-right (`ltr`) is supported. Panel numbering, layout/Smart previews, Panel List order, and generated prompt use `meta.readingDirection`.

### Story action intent

Each panel may store `actionIntent`: a short description of what happens when pose alone is insufficient.

- it is semantic source data;
- it may appear in Panel Peek, Panel List, manifest index, and prompt;
- it is never visible manga text and never belongs in `TEXT TO RENDER`;
- old projects normalize missing values to an empty string;
- derived summaries never become a competing source of truth.

### Story Templates

Prototype 0.8 ships editable rough-name templates for cute daily, rom-com, surprise, gag, and action pages. A template may seed valid shipped layout geometry, role, action intent, camera, pose/expression/gaze, background, effects, and optionally sample dialogue/SFX.

- browsing/preview does not mutate project;
- applying over authored content requires confirmation;
- user can disable sample dialogue/SFX before apply;
- sample text becomes normal editable dialogue/SFX after apply;
- selected/first reusable base character may be placed when available;
- `meta.storyTemplate` records provenance only, not continuing authority.

### Smart Manga is story-readable too

Smart Manga remains bounded, previewable, reproducible, and editable.

- one request returns three candidates;
- purpose/panel count constrain shipped layouts;
- seed is stored as `meta.randomSeed`;
- emphasis is stored as `meta.randomVariant` (`balanced | dynamic | emotion`);
- intensity is stored as `meta.randomIntensity` (`stable | standard | bold`);
- numbering follows reading direction;
- optional base placement is explicit;
- applied candidates receive a short purpose/beat-derived `actionIntent` for panels where action intent is still empty;
- applying Smart Manga clears `meta.storyTemplate`, because Smart Manga becomes the current provenance source;
- every result remains editable.

The selected-panel dice is narrower: preserve geometry, background content, balloons/dialogue, role, and existing action intent while re-proposing camera/effects/breakout plus pose/expression/gaze. It remains undoable.

### Reusable character identity

`characterLibrary` stores project-level reusable identity definitions. Placed instances inherit `characterId`, display name, and reference key but own panel-specific pose/expression/gaze/placement.

Identity modes:

1. `sheet` — external Character Sheet required; `referenceKey` maps it.
2. `description` — no sheet required; text appearance guidance is identity contract.
3. `free` — no sheet required; downstream model may choose a simple consistent design.

Appearance fields remain guided free text. Localized presets write semantic values in selected UI language. In `free` mode inactive appearance-detail inputs are disabled.

Legacy bases with a reference key normalize to `sheet`; those without one normalize to `description`.

### Character Sheet diagnostics are derived

Output/manifest derive requirements from used characters:

- `sheet` + key: request separately attached sheet;
- `sheet` + empty key: warn mapping incomplete;
- `description` / `free`: sheet not required.

Export is not blocked. Do not claim an external file is bundled when only a reference key is stored.

### Prompt identity wording follows identity mode

Generated prompts must not say identity “comes only from Character Sheets.” Character identity follows `CHARACTER IDENTITY GUIDANCE`; Character Sheets are used only for characters whose identity mode requires them.

### Stick figures are pose references

Stick figures communicate body relation, pose, position, approximate scale, and direction, not appearance. Editor/review may color-code anatomy. Clean AI PNG keeps pose figures monochrome.

### Beginner terminology bridge

Professional terms remain for interoperability, but Japanese UI pairs them with plain-language labels/explanations (`Extreme close / 超寄り`, `Low angle / あおり`, etc.). The Help dialog is maintained and localized.

### Panel Peek / Panel List / Panel Chips are authoring views

Users must understand a page without opening every editor tab.

- long-press or visible `ⓘ` opens Panel Peek;
- Panel Peek summarizes action, characters, camera, background, dialogue, effects, and framing diagnostic;
- Panel List supports detailed and compact reading-order views;
- Panel Chips provide canvas-level at-a-glance meaning;
- these overlays are authoring metadata and do not enter clean AI output.

Long-press is never the only discoverability path.

### Camera semantics and visual scale should not contradict silently

Prototype 0.8 compares selected camera distance with estimated figure-to-panel fill.

- obvious conflicts are warned;
- warnings never mutate state automatically;
- explicit “fit character size to camera” may adjust figure scale through undoable mutation;
- dotted Crop Guide is authoring-only and excluded from clean AI PNG;
- thresholds are heuristic assistance, not a second camera model.

### Manga Check is advisory

Lint may flag missing action intent, repeated camera distance, all backgrounds unspecified, repeated expression, or camera/figure-scale conflict. It never blocks export or rewrites content automatically.

### Presets are patterns, not rules

Canvas/layout/background/balloon/story presets remain editable starting points.

- default 800×1130 preset has an unambiguous dimension/purpose label;
- 4-koma distinguishes at least 1×4 and 2×2;
- layout thumbnails derive from canonical geometry and require explicit apply;
- background presets write localized semantic values then remain free-editable;
- balloon presets preserve existing text when modifying selected balloon.

### AI-safe text boundary

Editor/review may show names, panel numbers, camera metadata, summaries, action notes, background notes, Panel Chips/Crop Guide, and SFX metadata. These are authoring information.

Clean AI PNG omits authoring labels. Prompt permits visible text only under exact `TEXT TO RENDER` entries. Action intent is semantic guidance, never lettering.

### Manifest-first handoff

Prototype 0.8 continues `manga-blueprint-export-manifest/3` as read-first authority. It records export/package identity, file roles, clean primary visual, semantic JSON, generation prompt, `annotatedReviewAllowedForGeneration: false`, character guidance/Sheet requirements, Story Template provenance, panel intent index, and compact user message.

### Export package separation

Same serialized project state shares timestamp/hash/UUID identity.

1. AI generation ZIP (`ai-generation`) = clean PNG + `.manga.json` + prompt + manifest. **No annotated PNG.**
2. Review/archive ZIP (`review-archive`) = same state-linked materials + annotated PNG.

Failed/empty PNG encoding fails export. UI must not display stale export identity after project mutation.

### Provider independence / privacy

Core data is provider-independent. Provider adapters belong only at export boundary. Client-side only by default: no analytics, telemetry, remote scripts, private Character Sheet upload, API calls, tokens, or credentials without an explicit documented boundary.

## Compatibility

- project format remains `manga-blueprint/0.2`;
- 0.4: canvas/layout/random-purpose metadata;
- 0.5: `characterLibrary`;
- 0.6: random seed/variant and panel assist provenance;
- 0.7: identityMode/appearance, randomIntensity, manifest v3;
- 0.8: optional `meta.storyTemplate`, panel `actionIntent`, story-readable authoring views;
- legacy 0.1 / older 0.2 normalize without losing core layout/character/camera data.

## Mobile-first UI

Japanese is default; English is supported. On narrow screens canvas precedes detail controls, editor uses bottom tabs, primary controls are touch-sized, horizontal visual strips may scroll, and Panel Peek becomes a bottom-sheet-style dialog.

Primary hierarchy:

1. Story Template / Smart Manga / visual layout;
2. reusable character + identity source;
3. Panel Peek / Panel List quick understanding;
4. selected-panel refinement;
5. background/text/effects;
6. AI generation ZIP + short handoff copy;
7. Review/archive secondary.

## Runtime

`web/app.js` loads `web/app-1.js` through `web/app-12.js` as static classic scripts. `app-10.js` owns 0.7 localization/state hardening; `app-11.js` owns 0.8 Story Template / Panel Peek/List / framing UX; `app-12.js` aligns Smart Manga with action-intent semantics. Preserve zero-build GitHub Pages operation unless an intentional migration updates the contract.

## Definition of done

Relevant changes preserve:

- JS syntax validity for bootstrap and every runtime chunk;
- repository-contract validation and legacy normalization;
- dynamic canvas and RTL/LTR;
- bounded three-candidate Smart Manga with purpose/seed/variant/intensity provenance and story-readable action intent after apply;
- Story Templates with explicit apply, valid geometry/action/camera and optional editable dialogue/SFX;
- `actionIntent` persisted/exported and forwarded to prompt/manifest without becoming visible text;
- long-press Panel Peek plus visible `ⓘ` fallback;
- detailed/compact Panel List and authoring-only Panel Chips;
- framing diagnostic/Crop Guide plus explicit fit action;
- non-blocking Manga Check;
- selected-panel dice preserves geometry/background/balloons/role/action intent;
- reusable sheet/description/free identity modes and correct Character Sheet diagnostics;
- prompt wording never universally requires Character Sheets;
- localized background/appearance hardening;
- anatomy-readable review figures and monochrome clean figures;
- guided background and balloon presets;
- clean AI PNG with authoring metadata removed;
- AI ZIP excludes annotated PNG; Review ZIP includes it under same export identity;
- manifest v3 includes file roles, character guidance and panel intent index;
- compact JA/EN handoff message;
- mobile usability and GitHub Pages deployment.

Visual review and deterministic validation are separate evidence. Do not call UI visually verified based only on syntax/CI.
