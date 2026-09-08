# Product Contract

## Problem

Image-generation assistants can render manga-style images, but text-only prompts leave ambiguity around panel composition, pose, camera, background, dialogue placement, and manga-specific techniques. Visual references create another risk: authoring labels visible in the reference can be copied into final art.

Manga Blueprint Studio lets the user explicitly author those decisions and exports a clean visual reference plus semantic instructions.

## Primary user flow

1. Choose or create a page layout.
2. Select a panel and define its narrative role / frame treatment.
3. Define camera distance, angle, viewpoint, focus, and dramatic intent.
4. Place characters, select pose, expression, and gaze.
5. Define background location / time / weather / mood / detail / treatment.
6. Add balloons / narration and exact text.
7. Add manga effects, bleed, breakout, and onomatopoeia.
8. Export clean AI PNG + prompt + Character Sheets + `.manga.json`.

## Clean AI PNG

The clean export keeps spatially meaningful graphics: panel treatment, stick figures, balloon shapes/placement, and visual effect lines. It removes authoring text such as character names, panel numbers, camera labels, background annotations, balloon text, SFX text, and editor metadata.

## Annotated review PNG

The annotated export intentionally keeps authoring labels for human review. It is not the recommended image-generation reference.

## Prompt compiler

The prompt identifies characters by `characterId` and optional Character Sheet key, carries camera/background/panel/effect semantics, contains an explicit `TEXT TO RENDER` allowlist, and forbids all other metadata text from final art.

## Camera help

The UI explains camera settings in manga terms and their common dramatic uses. Distance, vertical angle, and viewpoint are separate choices so combinations such as `extreme-close + low-angle + three-quarter-back` are explicit rather than inferred from one label.

## Background

Per-panel background supports location, time of day, weather, mood, detail level, treatment (`normal`, selective detail, white, blur, speed-lines, focus-lines, black), and free notes.

## Manga techniques

Per-panel direction includes normal / borderless / inset / impact border, bleed / 断ち切り, breakout / ブチ抜き, panel narrative role, line effects, silence/beat, onomatopoeia, expression, gaze, and speech / thought / shout / whisper / narration / offscreen balloon intent.

## Acceptance criteria

- legacy 0.1 JSON imports without losing core layout data;
- a Japanese display name such as `綴理` does not appear in clean AI PNG;
- generated prompt forbids rendering authoring metadata;
- only dialogue/SFX are in the text render allowlist;
- camera setting explanations are visible;
- background and frame semantics persist in JSON;
- balloons persist exact text and placement;
- mobile UI exposes all editing sections through touch tabs.
