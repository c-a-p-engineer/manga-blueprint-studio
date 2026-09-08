# Prompt and Image Handoff Contract

## Recommended handoff

Prefer the one-click export ZIP when moving a Manga Blueprint into ChatGPT or another assistant. It keeps the assets from one editor state together and gives them a shared identity.

The ZIP contains:

1. `<prefix>_clean.png` — default spatial reference for image generation;
2. `<prefix>_annotated.png` — human review reference, not the default generation image;
3. `<prefix>.manga.json` — semantic blueprint;
4. `<prefix>_prompt.txt` — generated semantic instructions;
5. `<prefix>_manifest.json` — export-set identity and filenames.

Character Sheet images remain separate until the user explicitly registers/provides them.

## Export-set identity

`<prefix>` has this form:

```text
<project-title>_YYYYMMDD_HHMMSS_<short-sha256>
```

The SHA-256 is calculated from the serialized Manga Blueprint project state. The manifest records the full state hash and an export UUID.

When clean PNG, annotated PNG, JSON, prompt, and manifest share the same state hash, they represent the same editor state. This state hash is not a checksum of PNG bytes and does not imply byte-identical rasterization across browsers.

## Do not use the annotated PNG as the default AI reference

The annotated PNG is intentionally human-readable and may contain character display names, panel numbers, camera labels, panel summaries, background notes, and anatomy guide colors. Multimodal generators can copy those labels/colors into final artwork.

Use the `_clean.png` image for generation. Its stick figures are monochrome pose references.

## Reusable character identity

Project-level `characterLibrary` entries provide reusable identity metadata through `characterId` and optional Character Sheet reference keys. A panel may contain multiple placed instances of the same base character with different poses, expressions, gaze, scale, or rotation.

Character appearance comes from the separately attached Character Sheet corresponding to the reference key. Stick figures do not define appearance.

## Text allowlist

The generated prompt contains:

```text
TEXT TO RENDER:
- ...
```

Only those exact strings are allowed to appear as manga text.

The following are always metadata unless the user explicitly includes them in `TEXT TO RENDER`:

- character display names;
- IDs;
- Character Sheet keys;
- panel numbers;
- camera settings;
- role names;
- background annotations;
- editor labels.

## Reading direction

The prompt reads `meta.readingDirection` from the same project state as the exported images. `rtl` means Japanese manga right-to-left; `ltr` means left-to-right. Do not infer reading direction from filename or panel shape when an explicit value exists.

## Balloon strategy

The clean blueprint includes balloon geometry/placement but not the dialogue glyphs. The semantic prompt contains exact dialogue. This separates spatial intent from text content and reduces accidental copying of authoring metadata.

## Example handoff

```text
Upload:
  My-Manga_20260908_131500_a1b2c3d4e5_clean.png
  My-Manga_20260908_131500_a1b2c3d4e5.manga.json
  hero-sheet.png

Prompt:
  contents of My-Manga_20260908_131500_a1b2c3d4e5_prompt.txt
```

When the assistant can inspect ZIP files directly, the complete ZIP is the preferred compact upload artifact.
