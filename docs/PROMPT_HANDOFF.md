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

If annotated review is separately shown to an assistant, its labels and lettering preview remain authoring metadata and must not become visible final-art text unless the exact string is separately allowlisted under `TEXT TO RENDER`.

## Manifest v3

The package continues to use:

```text
manga-blueprint-export-manifest/3
```

The manifest retains export/package identity, file roles, instructions, character guidance, Story Template provenance, and panel action-intent indexing where available. `.manga.json` remains the complete semantic contract, including reading direction and Prototype 0.10 lettering direction.

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

Manifest may include:

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

## Reading order

`meta.readingDirection` is authoritative:

- `rtl` = Japanese manga, right-to-left;
- `ltr` = left-to-right.

Prototype 0.10 synchronizes panel `order` from current geometry plus this selected direction before committed renders. The resulting order is the common source used by canvas panel numbers, Panel Peek/List, generated prompt, and exported semantics.

For a standard two-column row:

```text
RTL: right panel -> lower order number -> left panel
LTR: left panel  -> lower order number -> right panel
```

## Balloon lettering direction

Reading order and writing direction are separate contracts.

Project default:

```json
{
  "meta": {
    "defaultWritingMode": "vertical-rl"
  }
}
```

Per balloon:

```json
{
  "writingMode": "inherit"
}
```

Allowed values:

- `inherit` — follow project default;
- `vertical-rl` — Japanese vertical writing: glyph flow top-to-bottom, columns ordered right-to-left;
- `horizontal-tb` — horizontal writing.

Prototype 0.10 defaults legacy/new projects to `vertical-rl` unless explicitly changed.

The generated prompt adds a semantic section such as:

```text
LETTERING DIRECTION:
- Default balloon writing mode: vertical-rl (vertical Japanese; top-to-bottom, columns right-to-left).
- Panel 1 balloon (speech): vertical Japanese writing, top-to-bottom with columns ordered right-to-left.
- Panel 2 balloon (speech): horizontal writing, left-to-right within the balloon.
- Writing direction controls lettering layout only; it does not change panel reading order.
```

These are layout instructions. They do not add any renderable strings.

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
- writing-mode labels such as `vertical-rl`;
- Panel Peek/List/Chip summaries;
- Crop Guide labels;
- editor/UI text.

## Visual-reference boundary

Clean PNG is the spatial reference. Stick figures communicate pose/placement, not appearance.

Editor-only overlays such as Panel Chips, `ⓘ`, Crop Guide, and balloon text previews do not enter clean PNG. Writing direction is communicated through `.manga.json` and generated prompt instead of rendering the authoring preview into the AI spatial reference.

## Story Templates and text

A Scene Template may seed sample dialogue/SFX only when the user enables that option before apply. Once applied, sample text becomes ordinary project dialogue/SFX and therefore appears under `TEXT TO RENDER` unless the user edits/removes it.

Template-created balloons use `inherit`, so they follow the project default writing direction unless the user overrides a balloon.

Template action intent remains semantic and is never automatically promoted to renderable text.

## Export-set identity

`<prefix>` remains:

```text
<project-title>_YYYYMMDD_HHMMSS_<short-sha256>
```

SHA-256 is calculated from serialized Manga Blueprint project state. Manifest records the full state hash and export UUID. Files created from the same unchanged state reuse the same in-session identity.

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