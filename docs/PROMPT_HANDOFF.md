# Prompt and Image Handoff Contract

## Recommended handoff: AI generation ZIP

When moving a Manga Blueprint into ChatGPT or another image-generation assistant, use the **AI generation ZIP**.

The user-facing instruction can stay short:

> このZIPを展開して、最初に中の `*_manifest.json` を読んで、その内容に従って漫画を生成してください。Character Sheet が必要と書かれているキャラクターは、別途添付した Character Sheet 画像を対応付けて使ってください。

When no Character Sheet is required, the UI replaces the second sentence with a statement that character appearance should follow the manifest guidance.

The manifest, not the chat sentence, is the detailed handoff authority.

## AI generation ZIP contents

1. `<prefix>_clean.png` — visual composition reference;
2. `<prefix>.manga.json` — semantic blueprint;
3. `<prefix>_prompt.txt` — generated semantic/generation instructions;
4. `<prefix>_manifest.json` — read-first handoff manifest.

It deliberately does **not** contain the annotated review PNG.

## Review / archive ZIP

Use Review / archive ZIP for human review, troubleshooting, or storage. It contains the same state-linked materials plus `<prefix>_annotated.png`.

If that image is separately supplied to an assistant for discussion, its labels remain authoring metadata and must not become visible final-art text.

## Manifest v3

Prototype 0.7 uses:

```text
manga-blueprint-export-manifest/3
```

The manifest retains export identity/package fields and adds explicit handoff structure.

### File roles

`fileEntries` identifies each member using roles:

- `visual-spatial-reference` — clean PNG;
- `semantic-contract` — `.manga.json`;
- `generation-instructions` — prompt text;
- `handoff-manifest` — manifest itself;
- `authoring-review` — annotated PNG, Review ZIP only.

`requiredForGeneration` distinguishes machine-consumable generation inputs from optional human-review material.

### Instructions

`instructions` records:

- `readFirst` — manifest filename;
- `primaryVisual` — clean PNG;
- `semanticContract` — `.manga.json`;
- `generationInstructions` — prompt file;
- `annotatedReviewAllowedForGeneration: false`;
- Character Sheet policy.

### Character guidance

`characterGuidance` is derived for characters actually used on the current page.

Each entry includes:

- Character ID/display name;
- `identityMode`;
- `referenceKey`;
- structured/free-text appearance guidance;
- Character Sheet requirement/status.

`characterSheetsRequired` is a compact mapping for characters in `sheet` mode.

## Character identity modes

### `sheet`

Character appearance comes from a separately attached Character Sheet. `referenceKey` maps the external image to the character.

If the key is empty, the manifest marks `missing-reference-key`; the editor shows the same warning.

### `description`

No Character Sheet is required. The base character may define:

- a free “what kind of character?” summary;
- hair;
- eyes;
- outfit;
- distinctive features.

This guidance is written to the project JSON, manifest, and generated prompt. The downstream model should keep that design consistent across panels.

### `free`

No Character Sheet is required and appearance is intentionally left open. The downstream model may choose a simple design, but must keep it consistent across panels.

## Prompt character section

The generated prompt adds `CHARACTER IDENTITY GUIDANCE` after the normal manga direction contract.

It never treats stick-figure colors/shape as character appearance.

- sheet mode points to the external Character Sheet/reference key;
- description mode provides appearance text and explicitly says no sheet is required;
- free mode explicitly allows model-designed appearance while requiring consistency.

## Export-set identity

`<prefix>` remains:

```text
<project-title>_YYYYMMDD_HHMMSS_<short-sha256>
```

The SHA-256 is calculated from serialized Manga Blueprint project state. Manifest records the full state hash and export UUID. Files created from the same unchanged project state reuse the same in-session identity.

## Text allowlist

The generated prompt still contains:

```text
TEXT TO RENDER:
- ...
```

Only those exact strings are permitted as manga text. Character display names, IDs, Character Sheet keys, panel numbers, camera settings, summaries, and editor labels remain metadata.

## Reading direction

`meta.readingDirection` remains authoritative. `rtl` means Japanese manga right-to-left; `ltr` means left-to-right.

## Balloon strategy

Clean blueprint contains balloon geometry without dialogue glyphs. Exact dialogue remains in the prompt under the text allowlist.

## Example

Upload:

```text
My-Manga_20260908_153000_a1b2c3d4e5_ai.zip
hero-character-sheet.png   # only when manifest says the character requires it
```

Send:

```text
このZIPを展開して、最初に中の *_manifest.json を読んで、その内容に従って漫画を生成してください。
Character Sheet が必要と書かれているキャラクターは、別途添付した Character Sheet 画像を対応付けて使ってください。
```

For a description/free-only page, no Character Sheet image needs to be attached.
