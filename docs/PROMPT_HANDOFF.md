# Prompt and Image Handoff Contract

## Recommended handoff: AI generation ZIP

When moving a Manga Blueprint into ChatGPT or another image-generation assistant, use the **AI generation ZIP**. It keeps one editor state's machine-consumable assets together while deliberately excluding the annotated review image.

The AI generation ZIP contains:

1. `<prefix>_clean.png` — the visual composition reference for image generation;
2. `<prefix>.manga.json` — semantic blueprint;
3. `<prefix>_prompt.txt` — generated semantic instructions;
4. `<prefix>_manifest.json` — export-set identity, package type, and filenames.

**It does not contain `<prefix>_annotated.png`.** This is intentional. If authoring labels are not needed by the image model, removing them from the input is safer than relying only on a negative prompt telling the model to ignore them.

Character Sheet images remain separate until the user explicitly registers/provides them.

## Review / archive ZIP

Use the Review / archive ZIP for human review, troubleshooting, or storage. It contains the same state-linked materials plus:

- `<prefix>_annotated.png` — human-readable review reference.

The annotated PNG may contain character display names, panel numbers, camera labels, panel summaries, background notes, and anatomy guide colors. It is not a final-art text source.

If the annotated PNG is separately supplied to an assistant for discussion, the prompt contract states that its labels are authoring metadata only and must not be rendered into the finished manga.

## Export-set identity

`<prefix>` has this form:

```text
<project-title>_YYYYMMDD_HHMMSS_<short-sha256>
```

The SHA-256 is calculated from the serialized Manga Blueprint project state. The manifest records the full state hash and an export UUID.

Files/packages created from the same unchanged project state reuse the same in-session prefix and export UUID. This lets a clean PNG and later review PNG be recognized as belonging to the same design state even though they are delivered in different ZIP package types.

The state hash is not a checksum of PNG bytes and does not imply byte-identical rasterization across browsers.

## Manifest package type

Prototype 0.6 uses `manga-blueprint-export-manifest/2`.

`packageType` is one of:

- `ai-generation` — safe direct handoff; no annotated PNG;
- `review-archive` — human-review package; annotated PNG included.

The manifest identifies:

- `visualReference` — the clean PNG;
- `authoringReview` — annotated PNG filename for review packages, otherwise `null`;
- `aiGenerationSafe` — true only for the AI generation package;
- `handoffRule` — use clean PNG for generation; authoring review labels are not final artwork.

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
- panel summaries;
- editor labels.

The prompt also contains a `REFERENCE IMAGE RULE` that names the clean PNG as the intended composition reference and explains the annotated/review boundary.

## Reading direction

The prompt reads `meta.readingDirection` from the same project state as the exported images. `rtl` means Japanese manga right-to-left; `ltr` means left-to-right. Do not infer reading direction from filename or panel shape when an explicit value exists.

## Balloon strategy

The clean blueprint includes balloon geometry/placement but not the dialogue glyphs. The semantic prompt contains exact dialogue. This separates spatial intent from text content and reduces accidental copying of authoring metadata.

## Example AI handoff

Upload the AI generation ZIP:

```text
My-Manga_20260908_131500_a1b2c3d4e5_ai.zip
```

Inside:

```text
My-Manga_20260908_131500_a1b2c3d4e5_clean.png
My-Manga_20260908_131500_a1b2c3d4e5.manga.json
My-Manga_20260908_131500_a1b2c3d4e5_prompt.txt
My-Manga_20260908_131500_a1b2c3d4e5_manifest.json
```

Attach Character Sheets separately when needed.

For human inspection or archival comparison, export the matching `_review.zip`; its shared state hash/export identity links it back to the same design state.
