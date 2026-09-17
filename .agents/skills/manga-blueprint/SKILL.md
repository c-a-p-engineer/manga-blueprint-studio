# Manga Blueprint Authoring Skill

Use this skill when an AI/coding agent is asked to turn story intent into a Manga Blueprint Studio Executable Name, edit an existing Name source, diagnose a generated blueprint, or improve manga staging/layout.

## Read first

1. `/AGENTS.md`
2. `/core/name-schema.md`
3. `/docs/BLUEPRINT-ENGINE.md`
4. `/docs/MANGA-TECHNIQUES.md` when choosing manga direction techniques
5. `/schema/manga-blueprint.schema.json` only when changing canonical project data

Do not treat historical `PROTOTYPE-*`, dated research, or old layout notes as current authority.

## Core rule

**Author semantics; derive geometry.**

Prefer story beats, importance, hold, attention, gaze, motion, camera, pose, support, depth and contact over manually invented pixel coordinates. Coordinates are appropriate only when the human explicitly pins geometry or when repairing deterministic renderer/compiler code.

## Workflow

1. Extract page beats in reading order.
2. For each beat identify its purpose: establish, action, reaction, reveal, contact, pause, climax, transition, etc.
3. Record only meaningful direction. Do not fill every available field mechanically.
4. Use importance to express narrative/visual/transition weight; use hold separately for reading time.
5. State the primary attention target when composition depends on a specific face, hand, prop or contact point.
6. Use gaze and motion direction to support the intended reading path.
7. Express physical relationships as structured contact when contact matters.
8. Compile with the CLI.
9. Review Annotated output for human-readable intent and Clean output for generation-facing spatial fidelity.
10. Patch semantic source and recompile. Do not manually edit generated Clean/Annotated assets as the normal workflow.

## CLI

```bash
npm install
npm run blueprint -- <name-source.md> <output-dir>
```

For repository changes run:

```bash
npm run typecheck
npm run build
npm run validate
```

## Output authority

- `work.manga.json`: canonical compiled semantic state.
- `Pxxx.clean.svg/png`: generation-facing spatial contract; no authoring annotations.
- `Pxxx.blueprint.svg/png`: human-review view; never the default image-model input.
- `Pxxx.prompt.md`: semantic rendering brief and exact visible-text rules.
- `manifest.json`: read-first package/provenance information.

Clean and Annotated must come from the same geometry/art source.

## Layout reasoning

Do not encode `important = large` as a universal rule. Consider relative energy, hold, neighbor contrast, attention path, reading direction, gaze, motion and explicit human locks. A quiet pause may need space; a high-impact beat may work as a narrow sharp panel.

When proposing or debugging a layout, explain the winning composition in those terms rather than claiming an aesthetic score is objectively correct.

## Human agency

The human is the director. Preserve explicit authored layout, text, character assignment, camera, appearance policy and hard constraints. Solver/AI proposals may fill unlocked decisions but must not silently replace pinned intent.

## Visible text

Never turn action notes, IDs, camera labels, contact labels or annotation text into manga lettering. Only explicitly authored dialogue/SFX/narration belongs in the visible-text allowlist.

## Technique selection

Use `/docs/MANGA-TECHNIQUES.md` as a vocabulary/intent guide. Prefer the effect the author wants over forcing a named technique. For example, if the goal is fast down-left motion, encode motion/attention/importance first; a diagonal panel is one possible solver result, not mandatory.

## Definition of done

A blueprint task is done when:

- the semantic source reflects the requested story/direction;
- compilation succeeds deterministically;
- Clean is understandable without review annotations;
- Annotated exposes the important constraints for human review;
- contact/pose relationships that matter are spatially represented;
- exact visible text is controlled;
- repository validation passes for code/contract changes.
