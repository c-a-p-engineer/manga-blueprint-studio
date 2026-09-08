# Prototype 0.11.1 — Cross-model handoff hardening

## Goal

Reduce avoidable interpretation drift when the same Manga Blueprint ZIP is handed to different image-generation assistants.

This hardening was derived from a real comparison where the same project produced materially different character identity, rendering style, action interpretation, and near-object emphasis across providers.

## Behavioral changes

### 1. Model-independent ownership priority

Generated prompt now states which artifact owns which part of the contract:

- Clean PNG owns panel geometry, proportions, and approximate 2D placement.
- Project JSON / prompt own story action, pose meaning, support state, motion phase, camera, depth, scene continuity, and lettering semantics.
- Character Guidance, plus Character Sheets only where explicitly required, owns character appearance and continuity.
- Art Direction owns color mode, rendering style, line work, shading, detail, and visual tone.

If the stick figure cannot visually express an airborne or near-object instruction precisely, semantic motion/depth state wins over simplifying the pose into a grounded run or sideways strike.

### 2. Remove stale Character-Sheet-only wording

The legacy pose-reference suffix previously said that character appearance still came from Character Sheets. Prompt compilation now removes that stale sentence and replaces it with mode-aware identity wording.

`description` and `free` identity modes therefore no longer receive a contradictory generic Character Sheet statement.

### 3. Smart Manga action beat hardening

Action/climax Smart Manga profiles no longer use an ambiguous third-beat `reaction` immediately before the decisive strike.

The intended four-beat action flow is now:

1. close the distance;
2. commit to the attack with momentum;
3. drop low / gather force / raise tension;
4. show the decisive strike.

The third beat uses a crouched anticipation-oriented direction rather than a surprised reaction.

### 4. One-character battle gaze

After applying an Action/Climax Smart Manga candidate, if a panel contains exactly one visible character and its gaze targets `other-character`, the target is normalized to `off-panel-target`.

This avoids telling downstream models that a visible second character must exist when the intended opponent is outside the frame.

Manual projects are not silently rewritten; Generation Readiness only warns when the same ambiguous single-character gaze state remains.

### 5. Near-object climax depth

For Action/Climax Smart Manga candidates whose final panel uses `near-object` framing:

- an inferable foreground strike target is promoted from `auto` to an explicit body part such as `right-hand`;
- foreshortening is promoted to `extreme`.

This keeps JSON/manifest semantics aligned with the intended large foreground fist/foot instead of relying on provider-specific inference.

### 6. Manifest handoff priority

Manifest v3 remains the same schema identifier, but may additionally carry:

- `handoffPriority`
- `crossModelHints`

These are derived export metadata and do not change project-format compatibility.

## Compatibility

- project format remains `manga-blueprint/0.2`;
- manifest remains `manga-blueprint-export-manifest/3`;
- existing projects normalize as before;
- Smart Manga remains preview-first, explicit-apply, reproducible, and editable;
- manual user-authored action/camera/depth state is not rewritten by this hardening unless it is part of the explicit Smart Manga apply path described above.

## Validation

CI must continue to pass all previous contracts plus `scripts/validate-cross-model-handoff.mjs` and JavaScript syntax through `web/app-20.js`.
