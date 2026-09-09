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

### Prototype 0.12.1 visible-cast fallback

The baseline template application path places one selected/reusable base character per panel. Two-person templates that do not opt into explicit multi-character placement are therefore represented as **one visible character + an explicit off-panel partner**.

This keeps the expected story cast visible in Quick Status while preventing downstream models from inventing an unplanned second visible character. Prototype 0.12.5 adds dedicated `two-shot` templates that intentionally place two distinct reusable base characters in the same panel and therefore do not use this fallback.

### Prototype 0.12.4 explicit cast meaning

Template cards and details separate scene-wide cast from frame visibility:

- **Expected cast / 想定登場** = main characters expected across the scene;
- **Visible together / 同時表示** = characters intentionally shown in the same panel by the template contract;
- **Off-panel partner / 画面外相手** = expected participant intentionally kept outside the frame.

A two-person template is therefore not assumed to show two people in every panel. Cards summarize the distinction instead of presenting an unexplained bare character count.

### Prototype 0.12.5 explicit two-visible templates

Templates marked as `two-shot` may define two actor placements per beat. These templates place the selected reusable base character plus another reusable base character in the same panel.

- application requires at least two reusable base characters;
- application stops rather than inventing an unknown visible partner when only one base exists;
- quick filters can narrow the template gallery by one-visible / two-visible presentation, relationship, dialogue density, and art-direction suitability;
- two-visible cards state both visible and expected counts.

### Prototype 0.12.6 cast by panel

The selected template preview includes **Cast by panel / コマごとの登場** in reading order.

Each beat shows:

- primary character visibility;
- partner visibility when the scene expects a partner;
- whether each role is visible or off-panel;
- which role owns seeded dialogue for that beat.

This makes scene-wide expected cast, simultaneous visibility, and per-panel staging inspectable before template application. The panel-cast flow is authoring-only metadata and does not become manga lettering or a competing project source of truth.

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
