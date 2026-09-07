# Product Contract

## Problem

Image-generation models can produce attractive manga-like images, but they frequently reinterpret author intent when composition is supplied only as prose. Ambiguity is especially high for:

- panel boundaries and reading order;
- which character occupies which position;
- pose and body direction;
- camera distance/angle;
- which character sheet belongs to which figure;
- which instructions apply to which panel.

Existing storyboard/pose tools often stop before AI handoff, while AI comic generators often make composition decisions on the user's behalf.

## Objective

Allow a human to visually author a manga page blueprint and export the same intent in a structured form that can be handed to a multimodal image-generation assistant together with character sheets.

## Primary workflow

1. Choose a manga page template.
2. Create/refine panel layout.
3. Select a panel.
4. Add named stick-figure character instances.
5. Assign pose presets and adjust placement.
6. Define camera intent for the panel.
7. Export:
   - visual blueprint PNG;
   - `.manga.json` semantic blueprint;
   - generated prompt.
8. Attach character sheets separately and provide all artifacts to an image-generation assistant.

## User-visible contract

### Panels

A panel has:

- stable ID;
- reading-order number;
- rectangle in page coordinates;
- camera distance;
- camera angle;
- optional camera focus note;
- zero or more character instances.

The prototype supports page templates and split operations. Freeform edge dragging is future work.

### Characters

A character instance has:

- stable instance ID;
- logical `characterId`;
- display name;
- optional character-sheet reference key;
- position;
- scale;
- rotation;
- pose preset ID.

Multiple instances may reference the same logical character in different panels.

### Poses

A pose preset provides two separate things:

1. a simplified stick-figure drawing for visual placement;
2. a semantic description for prompt generation.

A pose is not a character design.

### Camera

The prototype records:

- distance: long / medium / close / extreme close;
- angle: eye level / low angle / high angle / over shoulder;
- optional free-text focus.

Camera data is panel-level. More exact lens and POV contracts are future work.

### Export

#### Blueprint PNG

Must include:

- panel boundaries;
- panel numbers;
- character stick figures;
- character labels;
- compact camera labels where useful.

It is intentionally a planning reference, not final manga artwork.

#### `.manga.json`

Must contain enough semantic state to reload the project and regenerate the prompt without the PNG.

#### Prompt

Must:

- explain that the blueprint is a layout/pose reference;
- explain that panel numbers are reference markers and should not appear in final art;
- bind named figures to separately supplied character sheets;
- list panel instructions in reading order;
- preserve pose and camera intent;
- avoid provider-specific syntax in the core exporter.

## MVP acceptance

The prototype is acceptable when a user can complete this scenario in one browser session:

1. choose the 3-panel action template;
2. select panel 1;
3. add character `Tsuzuri`;
4. choose a jump pose;
5. drag the figure within the panel;
6. set a low-angle camera;
7. select another panel and add another pose;
8. split a selected panel;
9. export a blueprint PNG;
10. export JSON;
11. import that JSON and recover the authored state;
12. copy a prompt that describes the resulting panels and characters.

## Non-goals

Current MVP does not attempt:

- image generation itself;
- automatic character extraction;
- generated dialogue or story writing;
- 3D posing;
- advanced anatomy constraints;
- final speech balloons;
- PSD/Clip Studio export;
- cloud synchronization.
