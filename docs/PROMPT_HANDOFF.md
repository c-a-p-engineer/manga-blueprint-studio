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

## Manifest v4

Prototype 0.10 uses:

```text
manga-blueprint-export-manifest/4
```

The manifest retains export/package identity, file roles, instructions, character guidance, Story Template provenance, and panel action-intent indexing, then adds explicit reading-order and text-layout contracts.

### Reading-order contract

```json
{
  "readingOrderContract": {
    "direction": "rtl",
    "panelNumbersFollowReadingDirection": true,
    "storyBeatsFollowPanelNumbers": true
  }
}
```

This means the page number shown on a panel, the order used by Panel List/Prompt, and the Scene Template beat assigned to that panel all share the same geometry + reading-direction rule.

### Text-layout contract

```json
{
  "textLayout": {
    "defaultWritingDirection": "vertical",
    "balloons": [
      {
        "panelOrder": 1,
        "balloonId": "balloon_xxx",
        "writingDirection": "vertical"
      }
    ],
    "onomatopoeia": [
      {
        "panelOrder": 2,
        "writingDirection": "horizontal"
      }
    ]
  }
}
```

### File roles

`fileEntries` identifies clean PNG, `.manga.json`, prompt text, manifest itself, and annotated review PNG when present.

### Character guidance

`characterGuidance` is derived from reusable characters actually used on the page and contains identity mode, reference key, appearance guidance, and Character Sheet requirement/status.

`characterSheetsRequired` is the compact list for characters in `sheet` mode.

## Character identity modes

### `sheet`

Use the separately attached Character Sheet mapped by `referenceKey`.

### `description`

No Character Sheet is required. Structured/free-text appearance guidance from the base character is the visual identity contract.

### `free`

No Character Sheet is required. The model may choose a simple appearance but must preserve it consistently across panels.

## Story action intent

Panel `actionIntent` expresses what happens in the panel when pose alone is insufficient. It is semantic instruction, not manga lettering.

## Reading order

`meta.readingDirection` is authoritative:

- `rtl` = Japanese manga, right-to-left;
- `ltr` = left-to-right.

Prototype 0.10 synchronizes panel `order` from current geometry plus this selected direction before render/export. The same order is used by canvas numbers, layout/Smart/Scene Template previews, Panel Peek/List, Scene Template beat assignment, generated prompt, and manifest.

For a standard two-column row:

```text
RTL: right panel -> lower order number -> left panel
LTR: left panel  -> lower order number -> right panel
```

## Balloon and SFX writing direction

Reading order and writing direction are separate contracts.

Project default:

```json
{
  "meta": {
    "textDirectionDefault": "vertical"
  }
}
```

Per balloon:

```json
{
  "writingDirection": "vertical"
}
```

Per onomatopoeia:

```json
{
  "effects": {
    "sfxWritingDirection": "horizontal"
  }
}
```

Allowed values:

- `vertical` — handed off as Japanese-manga-style `vertical-rl`;
- `horizontal` — handed off as `horizontal-tb`.

New and legacy-unset text defaults to `vertical`. Each balloon and each SFX may be changed independently. Writing direction does not change panel reading order.

The generated prompt adds a `TEXT WRITING DIRECTION CONTRACT` with exact per-panel choices.

## Text allowlist

Only exact strings under:

```text
TEXT TO RENDER:
```

may become visible manga text. This normally includes balloon dialogue and onomatopoeia.

Forbidden as visible text includes character display names/IDs, Character Sheet keys, panel numbers, camera terms, Story Template names, action intent, writing-direction labels, Panel Peek/List/Chip summaries, Crop Guide labels, and editor/UI text.

## Visual-reference boundary

Clean PNG is the spatial reference. Stick figures communicate pose/placement, not appearance.

Editor-only overlays and lettering previews do not enter clean PNG. Writing direction is communicated through `.manga.json`, generated prompt, and manifest.

## Story Templates and text

A Scene Template may seed sample dialogue/SFX only when enabled before apply. Template-created text inherits `meta.textDirectionDefault` at apply time. Scene Template beat assignment follows the selected page reading direction.

## Export-set identity

`<prefix>` remains:

```text
<project-title>_YYYYMMDD_HHMMSS_<short-sha256>
```

SHA-256 is calculated from serialized Manga Blueprint project state. Manifest records the full state hash and export UUID.

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
