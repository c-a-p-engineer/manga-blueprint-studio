# Manga Blueprint Authoring Skill

Use this skill when an AI/coding agent is asked to turn story intent into a Manga Blueprint Studio Executable Name, edit an existing Name source, diagnose a generated blueprint, improve manga staging/layout, or translate a human manga-direction request into an image-generation brief.

## Read first

1. `/AGENTS.md`
2. `/docs/MANGA-KNOWLEDGE.md` — shared human/AI fundamentals, medium profiles, genre heuristics and terminology
3. `/core/name-schema.md`
4. `/docs/BLUEPRINT-ENGINE.md`
5. `/docs/MANGA-TECHNIQUES.md` — technique-focused examples
6. `/schema/manga-blueprint.schema.json` only when changing canonical project data

For programmatic recommendation/vocabulary, use `/core/manga-knowledge.mjs`. Human documentation is the nuance authority; the module is a machine-readable subset.

Do not treat historical `PROTOTYPE-*`, dated research, or old layout notes as current authority.

## Core rule

**Author semantics; derive geometry.**

Prefer story beats, importance, hold, attention, gaze, motion, camera, pose, support, depth and contact over manually invented pixel coordinates. Coordinates are appropriate only when the human explicitly pins geometry or when repairing deterministic renderer/compiler code.

## Before designing

Identify:

1. **medium** — print/page, Web page, vertical scroll, social short, or an explicit platform/publisher;
2. **reading direction** — do not assume RTL for vertical-scroll work;
3. **genre and scene purpose** — genre is a bias, scene purpose is stronger;
4. **production constraints** — publisher/printer/platform requirements override generic recommendations.

Do not confuse upload/export dimensions with manga composition rules.

## Workflow

1. Extract page/scroll beats in reading order.
2. For each beat identify its purpose: establish, action, reaction, reveal, contact, pause, climax, transition, etc.
3. Record only meaningful direction. Do not fill every available field mechanically.
4. Use importance to express narrative/visual/transition weight; use hold separately for reading time.
5. State the primary attention target when composition depends on a specific face, hand, prop or contact point.
6. Use gaze and motion direction to support the intended reading path.
7. Express physical relationships as structured contact when contact matters.
8. Consult medium/genre guidance and choose techniques that serve the beat. Do not force every genre convention.
9. Compile with the CLI.
10. Review Annotated output for human-readable intent and Clean output for generation-facing spatial fidelity.
11. Patch semantic source and recompile. Do not manually edit generated Clean/Annotated assets as the normal workflow.

## Translating human manga terms

Understand ordinary direction such as:

- `寄って` → closer framing / close-up; preserve the requested subject as attention target.
- `引いて` → wider framing to expose body/environment/relationships.
- `あおり` → low-angle camera.
- `俯瞰` → high-angle camera; `真俯瞰` means near-overhead.
- `大ゴマ` → explicit relative large-panel constraint when human-specified.
- `断ち切り` → page-edge/trim-reaching composition.
- `ブチ抜き` → subject crosses panel boundary.
- `間を入れて` → increase reading hold / quiet beat; do not automatically lower importance.

See `/docs/MANGA-KNOWLEDGE.md` for the complete shared vocabulary.

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

Do not encode `important = large` as a universal rule. Consider relative energy, hold, neighbor contrast, attention path, reading direction, gaze, motion, medium and explicit human locks. A quiet pause may need space; a high-impact beat may work as a narrow sharp panel.

When proposing or debugging a layout, explain the winning composition in those terms rather than claiming an aesthetic score is objectively correct.

## Human agency

The human is the director. Preserve explicit authored layout, named manga techniques, text, character assignment, camera, appearance policy and hard constraints. Solver/AI proposals may fill unlocked decisions but must not silently replace pinned intent.

## Visible text

Never turn action notes, IDs, camera labels, contact labels or annotation text into manga lettering. Only explicitly authored dialogue/SFX/narration belongs in the visible-text allowlist.

## Technique selection

Use `/docs/MANGA-KNOWLEDGE.md` for fundamentals, medium/genre context and terminology. Use `/docs/MANGA-TECHNIQUES.md` for technique-oriented explanation. Prefer the effect the author wants over forcing a named technique.

If the human names a technique, treat it as authored intent. If the human only describes an effect, encode semantics first and let techniques remain explainable candidates.

## Prompt handoff

When turning a blueprint into an image-model prompt:

1. Clean remains the spatial contract.
2. State medium/reading direction when relevant.
3. State observable camera, pose, gaze, motion, contact and attention constraints.
4. State preservation requirements for panel boundaries/character occupancy.
5. Use only the exact visible-text allowlist.
6. Explicitly prohibit rendering blueprint annotations as manga text.
7. Do not duplicate every coordinate in prose when Clean already carries geometry.

## Definition of done

A blueprint task is done when:

- medium and reading model are known or deliberately left generic;
- semantic source reflects the requested story/direction;
- compilation succeeds deterministically;
- Clean is understandable without review annotations;
- Annotated exposes important constraints for human review;
- contact/pose relationships that matter are spatially represented;
- exact visible text is controlled;
- named human techniques/hard locks are preserved;
- repository validation passes for code/contract changes.
