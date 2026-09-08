# Product Contract

## Problem

Image-generation assistants can render manga-style images, but users should not need cinematography vocabulary, manual coordinate work, repeated character re-entry, a Character Sheet for every character, or a risky bundle of authoring labels just to communicate manga direction.

Manga Blueprint Studio lets a human choose familiar page sizes and layout patterns, explicitly choose reading direction, reuse project-level character definitions, optionally describe character appearance in text, refine pose/camera/background/text/effects, compare bounded Smart Manga proposals, then export an AI-safe visual reference plus semantic instructions.

## Primary user flow

1. Choose a named canvas/manuscript size and reading direction (`rtl` or `ltr`).
2. Choose a layout from the visual layout gallery / select box, or open **Smart Manga / おまかせ漫画** and compare three candidates before applying one.
3. Create/select a reusable base character and choose how its appearance is defined:
   - Character Sheet;
   - text appearance guidance;
   - no Character Sheet / appearance left open to the image model.
4. Place the base character into panels, or let Smart Manga place it across the selected candidate.
5. Read the panel overview, then refine only what needs work: camera, pose, expression, gaze, background, balloons, onomatopoeia, effects, frame treatment, breakout.
6. Export the **AI generation ZIP** and copy the short handoff message. Attach Character Sheets separately only for characters whose manifest entry marks them required.
7. Use **Review / archive ZIP** only when the annotated review PNG is wanted for human checking or storage.

## Help and beginner terminology

The header **Help / 使い方** window is a maintained product guide. It follows the selected UI language and covers the basic workflow, reading direction, reusable characters, Character-Sheet-free identity modes, stick-figure color meaning, Smart Manga, visual template/camera aids, background input, and export handoff.

Professional camera terms remain available for interoperability, but the Japanese UI pairs them with plain language and a one-line explanation. Examples:

- `Extreme close / 超寄り` — 目・口・手・拳など一部を大きく見せる;
- `Close / 寄り` — 顔や胸元を中心に見せる;
- `Long / 引き` — 全身や位置関係を見せる;
- `Low angle / あおり` — 下から見上げ、強さや迫力を出す;
- `High angle / ふかん` — 上から見下ろし、弱さや全体配置を見せる.

A simple camera diagram visualizes the current distance/angle so the user is not forced to reason from terminology alone.

## Canvas presets

The product ships clearly named starting sizes: `800×1130 Portrait` (default), 1:1, 4:5, 3:4, 9:16, 16:9, B5, A4, Webtoon, and custom dimensions. Ambiguous labels such as “current size” are not acceptable preset names.

Resizing an authored project scales panels, characters, and balloons proportionally instead of silently discarding them.

## Reading direction

Japanese right-to-left is the default. Left-to-right is selectable. Changing direction keeps geometry and renumbers panels from current positions. Smart Manga previews and generated prompt direction use the same explicit value.

## Layout presets and visual gallery

Common patterns include single panel, 2-panel, 3-panel, action, 4-koma vertical 1×4, 4-koma 2×2, horizontal 4×1, 5/6-panel, conversation, action, and climax layouts.

The select box remains available, but a visual thumbnail strip lets the user recognize panel geometry before applying it. Selecting a thumbnail does not immediately destroy authored content; the user explicitly applies the chosen layout.

## Base characters and optional Character Sheets

A project can store reusable base-character definitions containing:

- `characterId`;
- editor display name;
- optional Character Sheet reference key;
- default pose;
- `identityMode`;
- optional structured/free-text appearance guidance;
- notes.

`identityMode` is one of:

1. `sheet` — Character Sheet is required as a separate attachment; `referenceKey` maps the external image to the character.
2. `description` — Character Sheet is not required; text appearance guidance is included in `.manga.json`, manifest, and generated prompt.
3. `free` — Character Sheet is not required; the downstream image model may choose a simple appearance but must keep it consistent across panels.

Appearance guidance may include a free “what kind of character?” summary plus hair, eyes, outfit, and distinctive features. These fields provide suggestions while remaining free text.

Placing a base character creates a panel-specific instance. Instance pose/expression/gaze/placement/scale/rotation may diverge without changing the base identity.

Older projects without identity mode/appearance guidance are normalized non-destructively: a base with a reference key defaults to `sheet`; otherwise it defaults to `description` with empty optional appearance text.

## Character handoff diagnostics

The Output tab shows a character identity map for characters actually used on the current page.

- `sheet` + reference key: clearly says to attach the Character Sheet separately and shows the key.
- `sheet` + empty reference key: warning state.
- `description`: says Character Sheet is unnecessary and shows the appearance guidance when available.
- `free`: says Character Sheet is unnecessary and appearance is intentionally open.

These diagnostics do not block export; the manifest carries the same status to the downstream assistant.

## Stick-figure readability

Editor and annotated review PNG color-code anatomical regions. Clean AI PNG keeps figures monochrome so authoring colors are not mistaken for character appearance.

## Guided background entry

Location, weather, and mood remain unrestricted free text with datalist suggestions. Prototype 0.7 adds scene presets (classroom, rooftop, bedroom, station/rain, alley/rain, cafe, park, white-background emotion, speed-line action, focus-line climax) that fill a useful combination and then remain fully editable.

## Balloon presets

The user can quickly add/apply practical balloon presets such as:

- speech upper-right;
- speech upper-left;
- thought;
- shout;
- whisper;
- narration;
- off-screen voice.

Preset application chooses type/size/position while preserving existing text when applied to an already selected balloon.

## Smart Manga

Smart Manga is constrained proposal generation, not arbitrary geometry.

Inputs:

- purpose (`action`, `conversation`, `gag`, `daily`, `climax`, `4-koma`, `romance`, `cute`, `suspense`, `character intro`, or auto);
- optional panel count;
- whether to preserve current canvas size;
- optional placement of selected base character;
- reproducible seed;
- intensity (`stable`, `standard`, `bold`).

Behavior:

1. Build three candidates from compatible shipped layout patterns.
2. Give each candidate a direction emphasis (`balanced`, `dynamic`, `emotion`).
3. Modify the profile according to intensity: stable reduces extreme framing; standard keeps the normal profile; bold strengthens close-ups/tilts/effects and may propose breakout on climax beats.
4. Preview layout, reading-order numbers, camera flow, pose flow, and intensity without changing the current page.
5. Apply only the explicitly selected candidate.
6. Store purpose, seed, variant, and intensity provenance.

The same seed + purpose + panel-count + intensity inputs reproduce the same proposals, subject to the shipped profile catalog remaining unchanged.

## Selected-panel direction dice

The panel-level **🎲** keeps geometry, background content, balloons/dialogue, and narrative role. It re-proposes camera/effects/breakout and placed-character pose/expression/gaze. It remains undoable and supports the expanded Smart Manga purpose catalog.

## Panel overview

Each panel has a derived authoring-only summary. Prototype 0.7 strengthens the summary with the primary pose, expression, gaze, camera, background/time, dialogue count/snippet, effects, and breakout. It remains derived data and never appears in clean AI output.

## Handoff manifest as source of truth

The export manifest is the first file a downstream assistant should read. Prototype 0.7 uses `manga-blueprint-export-manifest/3`.

The manifest contains:

- package type and export identity;
- file mapping plus `fileEntries` with roles (`visual-spatial-reference`, `semantic-contract`, `generation-instructions`, `handoff-manifest`, optional `authoring-review`);
- `instructions.readFirst` pointing to the manifest itself;
- clean PNG as primary visual reference;
- `.manga.json` as semantic contract;
- prompt file as generation instructions;
- `characterGuidance` for all used base characters;
- `characterSheetsRequired` mapping for external Character Sheets;
- a short copyable user-message template.

## Short AI handoff message

The Output tab provides a copy button. The intended Japanese message is deliberately compact:

> このZIPを展開して、最初に中の *_manifest.json を読んで、その内容に従って漫画を生成してください。Character Sheet が必要と書かれているキャラクターは、別途添付した Character Sheet 画像を対応付けて使ってください。

When no Character Sheet is required, the second sentence instead tells the assistant to follow character guidance in the manifest.

## Export set and filenames

Files from one unchanged editor state share:

```text
<project-title>_YYYYMMDD_HHMMSS_<short-sha256>
```

The manifest records export UUID, full SHA-256 of serialized project state, short hash, timestamp, canvas, reading direction, package type, and filenames. The state hash proves same serialized source state; it is not a PNG-byte checksum.

## AI generation ZIP

Recommended direct handoff:

- `<prefix>_clean.png`;
- `<prefix>.manga.json`;
- `<prefix>_prompt.txt`;
- `<prefix>_manifest.json`.

The annotated review PNG is intentionally excluded.

## Review / archive ZIP

Human review/storage package containing the same state-linked files plus `<prefix>_annotated.png`.

## AI-safe boundary

Clean export removes authoring labels and keeps stick figures monochrome. The prompt uses a strict `TEXT TO RENDER` allowlist. Character identity comes from the manifest/semantic contract and, only when required, separately attached Character Sheets.

## Acceptance criteria

- all shipped canvas sizes remain selectable with unambiguous names;
- RTL default and LTR remain supported;
- visual layout thumbnails are available and require explicit apply;
- Smart Manga provides three non-mutating candidates and supports romance/cute/suspense/character-intro purposes plus stable/standard/bold intensity;
- chosen Smart Manga purpose/seed/variant/intensity are stored;
- base characters support `sheet`, `description`, and `free` identity modes;
- description mode works without any Character Sheet and carries appearance guidance into JSON/manifest/prompt;
- free mode works without any Character Sheet;
- sheet mode produces a visible warning when the reference key is empty;
- Output shows a character identity/Character Sheet map for used characters;
- manifest v3 is the read-first handoff authority and records file roles and character guidance;
- short Japanese/English AI handoff message can be copied;
- layout thumbnail gallery and camera diagram are localized/usable on narrow screens;
- background scene presets remain editable after application;
- balloon presets can create or modify a balloon without deleting existing text;
- panel summary remains derived and more informative;
- AI generation ZIP excludes annotated PNG;
- Review / archive ZIP adds annotated PNG under the same export identity;
- legacy 0.1/older 0.2 projects normalize without losing core layout/character semantics;
- clean AI PNG contains no authoring labels or panel summaries;
- mobile UI remains touch-usable and GitHub Pages deploys successfully.
