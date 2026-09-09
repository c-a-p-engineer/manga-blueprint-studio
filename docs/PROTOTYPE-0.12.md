# Prototype 0.12 — Scene Contract / Quick Status

Prototype 0.12 reduces ambiguity between Scene Templates, the page editor, and downstream image-generation models.

## Template scene metadata

Built-in templates may carry authoring-only scene metadata:

- expected cast count;
- relationship intent;
- presentation (`single`, `one-visible-offscreen`, `two-shot`);
- dialogue density;
- recommended art direction.

This metadata helps the user choose a template and helps export derive a scene contract. It does not become permanent authority over later manual edits.

## Conversation behavior

Conversation-first templates declare a minimum useful amount of seeded dialogue when **Include sample dialogue and SFX** is enabled. Classroom Talk uses four seeded dialogue beats and explicitly treats the reaction line as an off-panel partner line when only one visible base character is available.

Templates that expect an off-panel partner normalize `other-character` gaze to `off-panel-target` on apply, avoiding a false Generation Readiness warning immediately after applying the template.

## Affection template pack

Prototype 0.12 adds:

- Affectionate daily 4-panel;
- Tease → blush 4-panel;
- Faces getting close 3-panel;
- After school, just us 4-panel;
- Pampering 4-panel;
- Forehead touch 3-panel;
- Surprise hug 3-panel;
- Shoulder lean 3-panel.

All remain ordinary editable template output after apply.

## Quick Status

A compact status strip is shown next to the page canvas and keeps the following visible while editing:

- color mode;
- rendering style;
- writing direction;
- reading direction;
- applied template;
- visible / expected cast;
- background location.

Unspecified color or rendering style is visibly warned. Status chips are authoring-only and are not included in clean AI output.

## AI handoff hardening

Generated prompt and manifest now derive explicit output constraints:

- preserve panel count and reading order;
- preserve color mode when specified;
- preserve rendering style when specified;
- preserve character identity from Character Identity Guidance;
- do not invent visible participants when a template describes an off-panel partner;
- render dialogue from the recorded exact text rather than replacing it with newly invented lines.

Manifest additions are derived metadata (`outputConstraints`, `sceneTemplateContract`) and do not change the existing manifest schema identifier.
