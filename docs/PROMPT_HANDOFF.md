# AI Handoff Contract

## Goal

Manga Blueprint Studio does not ask an image model to invent the page structure. It packages author decisions so the model can render them with less ambiguity.

## Handoff package

A generation request should contain three independent sources of intent:

1. **Blueprint image** — spatial layout, panel boundaries, approximate character placement, pose silhouette.
2. **Generated prompt** — semantic mapping of panel number, character ID, pose intent, and camera intent.
3. **Character sheets** — visual identity: face, hair, body, clothing, accessories, and style references.

```text
blueprint.png        -> WHERE / HOW LARGE / APPROXIMATE BODY RELATION
project.manga.json   -> MACHINE-READABLE SOURCE OF TRUTH
prompt.txt           -> MODEL-FACING SEMANTIC INSTRUCTIONS
character sheets     -> WHO THE FIGURES ARE
```

## Interpretation rules for multimodal models

- Panel numbers are cross-reference markers. Do not draw them in final art.
- Stick figures are not character designs.
- Character names/IDs bind a stick figure to a separately attached character sheet.
- Keep panel layout, pose intent, and camera intent unless the user explicitly authorizes variation.
- If the visual blueprint and prompt appear inconsistent, the semantic `.manga.json`/prompt meaning should be clarified rather than silently guessed.

## Why both image and JSON exist

A raster blueprint is good at conveying relative space but weak at exact semantics. JSON is good at conveying exact semantics but awkward for quickly communicating page composition to a vision model.

The two representations are intentionally complementary:

```text
image = spatial evidence
JSON = semantic evidence
character sheet = identity evidence
```

## Provider adapters

Future OpenAI/Gemini/ComfyUI-specific adapters may transform this package into provider-specific requests. They must not mutate the underlying author decisions.
