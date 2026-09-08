# AGENTS.md — Manga Blueprint Studio

## Mission

Manga Blueprint Studio is a human-directed manga planning tool. It records manuscript size, reading direction, panel layout, reusable character identity, character appearance policy, story action intent, pose/placement, camera intent, backgrounds, dialogue/SFX, and manga-specific effects, then exports a visual blueprint plus machine-readable semantics for downstream image-generation assistants.

The human is the director. AI, Smart Manga, Scene Templates, bounded derivation, and other assistance are proposal/rendering tools.

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

Assistance must not silently replace recorded panel layout, action intent, pose, character assignment, appearance policy, camera intent, background intent, dialogue, or manga effects. Candidate/template browsing never mutates current page. Explicitly applied Scene Template / Smart Manga output becomes ordinary editable project state.

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

### Scene Template Studio

Prototype 0.9 extends Story Templates into a scene-first authoring studio.

Shipped categories include romance, battle, emotion, daily, comedy, suspense, character introduction, plus browser-local custom templates. The built-in set includes the original cute-daily / rom-com / surprise / gag / action recipes and additional confession, kiss, holding-hands, misunderstanding, battle, counterattack, aerial, throw, awakening, crying, anger, resolve, suspense, classroom, failure-gag, and character-introduction scenes.

Discovery is authoring-only and may use category filters, search, visual cards, description/use-case text, panel count, and beat-flow preview.

- browsing/filtering/searching/preview does not mutate project;
- applying over authored content requires confirmation;
- user can disable sample dialogue/SFX before apply;
- sample text becomes normal editable dialogue/SFX after apply;
- selected/first reusable base character may be placed when available;
- `meta.storyTemplate` records provenance only, not continuing authority.

### Bounded template derivation

Prototype 0.9 may derive one temporary variation from a selected scene template.

- derivation preserves scene action/beat flow;
- it may vary a bounded subset of camera distance/angle and emphasis/effects;
- derivation never mutates the page until explicit apply;
- it is not equivalent to unconstrained random story generation;
- applied derived state becomes ordinary editable project state.

### Browser-local custom templates

Users may save the current page pattern to local template storage.

Custom template storage may include normalized panel geometry, role, action intent, pose/expression/gaze, camera, background, dialogue/SFX, and selected effects. It must **not** store character-specific visual identity or Character Sheet data.

- custom geometry is normalized and scales to the current canvas on reapply;
- current selected/project reusable base character is used when available;
- custom templates live only in browser `localStorage` unless future explicit import/export is added;
- custom template library contents are not automatically embedded into `.manga.json`, prompt, manifest, or ZIP;
- once applied, resulting ordinary project state may be exported normally.

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

Professional terms remain for interoperability, but Japanese UI pairs them with plain-language labels/explanations (`Extreme close / 超寄り`, `Low angle / あおり`, etc.). Help is maintained and localized.

### Panel Peek / Panel List / Panel Chips are authoring views

Users must understand a page without opening every editor tab.

- long-press or visible `ⓘ` opens Panel Peek;
- Panel Peek summarizes action, characters, camera, background, dialogue, effects, and framing diagnostic;
- mobile Panel Peek is opaque and viewport-bounded, with fixed header/actions and scrollable semantic body;
- Panel List supports detailed and compact reading-order views;
- Panel Chips provide canvas-level at-a-glance meaning;
- these overlays are authoring metadata and do not enter clean AI output.

Long-press is never the only discoverability path.

### Camera semantics and visual scale should not contradict silently

The editor compares selected camera distance with estimated figure-to-panel fill.

- obvious conflicts are warned;
- warnings never mutate state automatically;
- explicit “fit character size to camera” may adjust figure scale through undoable mutation;
- dotted Crop Guide is authoring-only and excluded from clean AI PNG;
- thresholds are heuristic assistance, not a second camera model.

### Manga Check is advisory

Lint may flag missing action intent, repeated camera distance, all backgrounds unspecified, repeated expression, or camera/figure-scale conflict. It never blocks export or rewrites content automatically.

### Presets are patterns, not rules

Canvas/layout/background/balloon/scene presets remain editable starting points.

- default 800×1130 preset has an unambiguous dimension/purpose label;
- 4-koma distinguishes at least 1×4 and 2×2;
- layout thumbnails derive from canonical geometry and require explicit apply;
- background presets write localized semantic values then remain free-editable;
- balloon presets preserve existing text when modifying selected balloon.

### AI-safe text boundary

Editor/review may show names, panel numbers, camera metadata, summaries, action notes, background notes, Panel Chips/Crop Guide, and SFX metadata. These are authoring information.

Clean AI PNG omits authoring labels. Prompt permits visible text only under exact `TEXT TO RENDER` entries. Action intent is semantic guidance, never lettering.

### Manifest-first handoff

`manga-blueprint-export-manifest/3` remains read-first authority. It records export/package identity, file roles, clean primary visual, semantic JSON, generation prompt, `annotatedReviewAllowedForGeneration: false`, character guidance/Sheet requirements, Story Template provenance, panel intent index, and compact user message.

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
- 0.9: scene-template discovery/derivation and local custom-template library; no project-format bump;
- legacy 0.1 / older 0.2 normalize without losing core layout/character/camera data.

## Mobile-first UI

Japanese is default; English is supported. On narrow screens canvas precedes detail controls, editor uses bottom tabs, primary controls are touch-sized, visual template cards stack vertically, horizontal visual strips may scroll, and Panel Peek becomes a bottom-sheet-style dialog.

Primary hierarchy:

1. Scene Template Studio / Smart Manga / visual layout;
2. reusable character + identity source;
3. Panel Peek / Panel List quick understanding;
4. selected-panel refinement;
5. background/text/effects;
6. AI generation ZIP + short handoff copy;
7. Review/archive secondary.

## Runtime

`web/app.js` loads `web/app-1.js` through `web/app-14.js` as static classic scripts. `app-10.js` owns 0.7 localization/state hardening; `app-11.js` owns 0.8 Story Template / Panel Peek/List / framing UX; `app-12.js` aligns Smart Manga with action-intent semantics and hardens mobile Panel Peek; `app-13.js` owns 0.9 Scene Template Studio; `app-14.js` owns 0.9 localization/feedback hardening. Preserve zero-build GitHub Pages operation unless an intentional migration updates the contract.

## Definition of done

Relevant changes preserve:

- JS syntax validity for bootstrap and every runtime chunk;
- repository-contract validation and legacy normalization;
- dynamic canvas and RTL/LTR;
- bounded three-candidate Smart Manga with purpose/seed/variant/intensity provenance and story-readable action intent after apply;
- Scene Template browsing/search/category filtering without project mutation;
- scene-template visual cards with description/use case/panel count/beat flow;
- shipped romance/battle/emotion/daily/comedy/suspense/character-introduction recipes;
- explicit template apply with optional editable dialogue/SFX;
- bounded derived template variation that preserves action flow;
- browser-local custom templates with normalized geometry and no character-specific visual identity;
- `actionIntent` persisted/exported and forwarded to prompt/manifest without becoming visible text;
- long-press Panel Peek plus visible `ⓘ` fallback and mobile bounded opaque sheet;
- detailed/compact Panel List and authoring-only Panel Chips;
- framing diagnostic/Crop Guide plus explicit fit action;
- non-blocking Manga Check;
- selected-panel dice preserves geometry/background/balloons/role/action intent;
- reusable sheet/description/free identity modes and correct Character Sheet diagnostics;
- prompt wording never universally requires Character Sheets;
- anatomy-readable review figures and monochrome clean figures;
- guided background and balloon presets;
- clean AI PNG with authoring metadata removed;
- AI ZIP excludes annotated PNG; Review ZIP includes it under same export identity;
- manifest v3 includes file roles, character guidance and panel intent index;
- compact JA/EN handoff message;
- mobile usability and GitHub Pages deployment.

Visual review and deterministic validation are separate evidence. Do not call UI visually verified based only on syntax/CI.
