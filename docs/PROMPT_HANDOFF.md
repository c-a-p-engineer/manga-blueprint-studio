# Prompt and Image Handoff Contract

## Recommended handoff: AI generation ZIP

When moving a Manga Blueprint into ChatGPT or another image-generation assistant, use the **AI generation ZIP**.

The user-facing instruction stays deliberately short:

> このZIPを展開して、最初に中の `*_manifest.json` を読んで、その内容に従って漫画を生成してください。Character Sheet が必要と書かれているキャラクターは、別途添付した Character Sheet 画像を対応付けて使ってください。

When no Character Sheet is required, the UI uses the corresponding no-sheet wording. The manifest, not the chat sentence, is the detailed handoff authority.

## AI generation ZIP contents

1. `<prefix>_clean.png` — visual composition reference;
2. `<prefix>.manga.json` — semantic blueprint;
3. `<prefix>_prompt.txt` — generated generation/direction instructions;
4. `<prefix>_manifest.json` — read-first handoff manifest.

The AI package deliberately excludes annotated review PNG.

## Review / archive ZIP

Review/archive ZIP contains the same state-linked materials plus `<prefix>_annotated.png`. It is for human checking/storage, not the default image-generation input.

If annotated review is separately shown to an assistant, its labels remain authoring metadata and must not become visible final-art text.

## Manifest v3

Prototype 0.8 continues:

```text
manga-blueprint-export-manifest/3
```

The manifest retains export/package identity, file roles, instructions, and character guidance, and additionally carries Story Template provenance and panel action-intent indexing where available.

### File roles

`fileEntries` identifies:

- `visual-spatial-reference` — clean PNG;
- `semantic-contract` — `.manga.json`;
- `generation-instructions` — prompt text;
- `handoff-manifest` — manifest itself;
- `authoring-review` — annotated PNG, Review ZIP only.

### Read-first instructions

`instructions` identifies manifest itself as `readFirst`, clean PNG as `primaryVisual`, project JSON as `semanticContract`, prompt file as `generationInstructions`, and states `annotatedReviewAllowedForGeneration: false`.

### Character guidance

`characterGuidance` is derived from reusable characters actually used on the page and contains identity mode, reference key, appearance guidance, and Character Sheet requirement/status.

`characterSheetsRequired` is the compact list for characters in `sheet` mode.

### Story action index

Prototype 0.8 may add:

```json
{
  "storyTemplate": "cuteDaily",
  "panelIntentIndex": [
    {
      "panelId": "panel_1",
      "order": 1,
      "role": "setup",
      "actionIntent": "部屋でこちらに気づく"
    }
  ]
}
```

`storyTemplate` is provenance only. `panelIntentIndex` is a convenient manifest index; `.manga.json` remains the semantic source of truth.

## Character identity modes

### `sheet`

Use the separately attached Character Sheet mapped by `referenceKey`.

### `description`

No Character Sheet is required. Structured/free-text appearance guidance from the base character is the visual identity contract.

### `free`

No Character Sheet is required. The model may choose a simple appearance but must preserve it consistently across panels.

## Critical prompt identity rule

The generated prompt must **not** say that all visual identity comes only from Character Sheets.

Prototype 0.8 uses this semantic rule:

```text
Character visual identity follows CHARACTER IDENTITY GUIDANCE.
Use separately attached Character Sheets only for characters whose identity mode requires them.
```

The appended `CHARACTER IDENTITY GUIDANCE` section then states the correct mode for each used character.

## Story action intent

Panel `actionIntent` expresses what happens in the panel when pose alone is insufficient.

When non-empty, the prompt adds a semantic section such as:

```text
STORY ACTION INTENT:
- Panel 1: notices the viewer in the room
- Panel 2: turns back after being called
```

These strings are **instructions**, not manga lettering. They must never become visible text merely because they appear in the prompt.

## Text allowlist

Only exact strings under:

```text
TEXT TO RENDER:
```

may become visible manga text. This normally includes balloon dialogue and onomatopoeia.

Forbidden as visible text includes:

- character display names / Character IDs;
- Character Sheet keys;
- panel numbers;
- camera terms;
- Story Template names;
- action intent;
- Panel Peek/List/Chip summaries;
- Crop Guide labels;
- editor/UI text.

## Visual-reference boundary

Clean PNG is the spatial reference. Stick figures communicate pose/placement, not appearance.

Prototype 0.8 editor-only overlays such as Panel Chips, `ⓘ`, and Crop Guide do not enter clean PNG. Camera-framing diagnostics therefore improve authoring without polluting downstream image-generation input.

## Story Templates and text

A Story Template may seed sample dialogue/SFX only when the user enables that option before apply. Once applied, sample text becomes ordinary project dialogue/SFX and therefore appears under `TEXT TO RENDER` unless the user edits/removes it.

Template action intent remains semantic and is never automatically promoted to renderable text.

## Export-set identity

`<prefix>` remains:

```text
<project-title>_YYYYMMDD_HHMMSS_<short-sha256>
```

SHA-256 is calculated from serialized Manga Blueprint project state. Manifest records the full state hash and export UUID. Files created from the same unchanged state reuse the same in-session identity.

## Reading direction

`meta.readingDirection` remains authoritative. `rtl` means Japanese manga right-to-left; `ltr` means left-to-right.

## Example

Upload:

```text
My-Manga_20260908_153000_a1b2c3d4e5_ai.zip
hero-character-sheet.png   # only when manifest requires it
```

Send:

```text
このZIPを展開して、最初に中の *_manifest.json を読んで、その内容に従って漫画を生成してください。
Character Sheet が必要と書かれているキャラクターは、別途添付した Character Sheet 画像を対応付けて使ってください。
```

For a description/free-only page, no Character Sheet image needs to be attached.
