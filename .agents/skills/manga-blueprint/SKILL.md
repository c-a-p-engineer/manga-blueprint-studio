# Manga Blueprint Authoring Skill

Use this skill when an AI/coding agent is asked to turn story intent into a Manga Blueprint Studio Executable Name, edit an existing Name source, diagnose a generated blueprint, improve manga staging/layout, or translate a human manga-direction request into an image-generation brief.

## Read first

1. `/AGENTS.md`
2. `/docs/MANGA-KNOWLEDGE.md` — fundamentals, medium profiles and reasoning contract
3. `/docs/MANGA-DICTIONARY.md` — human-readable expression dictionary and effect/genre reverse lookup
4. `/core/name-schema.md`
5. `/docs/BLUEPRINT-ENGINE.md`
6. `/docs/MANGA-TECHNIQUES.md` — concise technique examples
7. `/docs/MANGA-EXPRESSION-CATALOG.md` — extended collection/taxonomy when exploring alternatives
8. `/schema/manga-blueprint.schema.json` only when changing canonical project data

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
8. Consult `/docs/MANGA-DICTIONARY.md` by desired effect first. Treat genre entries as candidate biases, not rules.
9. Choose transition/pacing, camera/composition, panel grammar and rendering style as separate axes.
10. Compile with the CLI. For multi-page work, use the optional `--contact-sheet` mode when one-shot cross-page preflight is useful.
11. Review Annotated output for human-readable intent and Clean output for generation-facing spatial fidelity. A Contact Sheet is a fast batch-review surface, not final page acceptance.
12. Patch semantic source and recompile. Do not manually edit generated Clean/Annotated assets as the normal workflow.

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
- `一瞬を長く` → consider moment-to-moment/decompression/hold rather than merely enlarging a panel.
- `いきなり見せない` → progressive reveal/cropped information; choose page-turn or viewport reveal according to medium.
- `もっと速く` → consider omission/accelerando/smaller rapid beats before adding decorative speed lines.
- `迫力を出す` → choose among low angle, foreshortening, exaggerated perspective, extreme foreground, panel contrast and action effects according to the subject.

See `/docs/MANGA-DICTIONARY.md` for the broader shared vocabulary and reverse lookup.

## CLI

```bash
npm install
npm run blueprint -- <name-source.md> <output-dir>
# optional multi-page preflight
npm run blueprint -- <name-source.md> <output-dir> --contact-sheet
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
- Optional Contact Sheet mode: `contact-sheet.clean.svg/png`, `contact-sheet.blueprint.svg/png`, `contact-sheet.prompt.md`, `contact-sheet.review.json`, `contact-sheet.generation.json` for batch preflight only. Contact Sheet PNGs are assembled from the already-rasterized per-page PNGs; Clean remains generation-facing and Blueprint remains human-review only. The default layout is page-count-aware: 2P→2×1, 3–4P→2×2, 5–8P→4×2; avoid manual column overrides unless there is a concrete reason.

Clean and Annotated must come from the same geometry/art source.

## Layout reasoning

Do not encode `important = large` as a universal rule. Consider relative energy, hold, neighbor contrast, attention path, reading direction, gaze, motion, medium and explicit human locks. A quiet pause may need space; a high-impact beat may work as a narrow sharp panel.

When proposing or debugging a layout, explain the winning composition in those terms rather than claiming an aesthetic score is objectively correct.

## Expression-axis separation

Do not collapse all visual direction into one `technique` or `style` label. Keep these conceptually separate when they matter:

- transition/editing;
- pacing/time;
- camera distance/angle/lens feel;
- composition/depth;
- panel/frame grammar;
- attention/reveal;
- action/effects;
- lettering;
- medium-native behavior;
- rendering/visual style.

A preset such as `劇画系` is shorthand for a bundle of rendering tendencies, not a replacement for camera, pacing or panel semantics.

## Human agency

The human is the director. Preserve explicit authored layout, named manga techniques, text, character assignment, camera, appearance policy and hard constraints. Solver/AI proposals may fill unlocked decisions but must not silently replace pinned intent.

## Visible text

Never turn action notes, IDs, camera labels, contact labels or annotation text into manga lettering. Only explicitly authored dialogue/SFX/narration belongs in the visible-text allowlist.

## Technique selection

Use `/docs/MANGA-KNOWLEDGE.md` for fundamentals and medium context. Use `/docs/MANGA-DICTIONARY.md` as the primary human-readable vocabulary and effect/genre reverse lookup. Use `/docs/MANGA-EXPRESSION-CATALOG.md` when searching the long tail of techniques/styles.

If the human names a technique, treat it as authored intent. If the human only describes an effect, encode semantics first and let techniques remain explainable candidates.

## Prompt handoff

When turning a blueprint into an image-model prompt:

1. Clean remains the spatial contract.
2. State medium/reading direction when relevant.
3. Translate named techniques into **observable image behavior**, not unexplained jargon alone.
4. State observable camera, pose, gaze, motion, contact, reveal and attention constraints.
5. State rendering-style axes separately from spatial composition.
6. State preservation requirements for panel boundaries/character occupancy.
7. Use only the exact visible-text allowlist.
8. Explicitly prohibit rendering blueprint annotations as manga text.
9. Do not duplicate every coordinate in prose when Clean already carries geometry.

## Compiled Workspace → image model (strict agent handoff)

For a request such as 「これで画像生成して」 concerning an existing work, apply the **manifest-first compiled-package workflow** in [Prompt and Image Handoff Contract](../../..//docs/PROMPT_HANDOFF.md#llm-execution-of-compiled-name-packages). This is **LLM execution policy**, not a request to add provider credentials or network calls to the compiler.

1. Resolve the actual requested work/revision, then read its \`manifest.json\`, \`work.manga.json\`, and matching \`*.generation.json\`. Never invent an unrelated story from previous conversation context.
2. For 2–8 page *rough preflight*, select its specific Contact Sheet batch/range. For publication-ready output select \`Pxxx.generation.json\` for one page. 8P rough is one sheet; final rendering stays page-scoped.
3. Check package references, page IDs/count, Clean visual, **complete** generation prompt and required character references. On a local checkout run \`npm run preflight:generation -- <compiled-dir> --contact-sheet [NNN-NNN]\` or \`--page P007\`; if no local runtime is available, perform the equivalent checks via retrieved files. Stop when required inputs are missing or conflict.
4. Resolve actual Clean SVG/PNG bytes, render SVG as PNG when the image model cannot accept SVG, and **attach the real image** plus the full relevant prompt to the image-model call. A repository path, tool argument claim, or prose-only summary **does not** mean the image was attached. If the image tool cannot take the required visual reference, report the blocked boundary; do not substitute prompt-only generation.
5. Keep Annotated review out of generation-facing image inputs. Preserve authored story beats, exact page order, character/ref/outfit state, RTL page reading and vertical Japanese writing. Text glyphs come only from \`TEXT TO RENDER\`; deterministic lettering is composited in final production when needed.
6. Inspect the actual generated image(s) against the canonical page panel count, actions, characters, special creature constraints, text and orientation. Use the existing observation → Structural Evaluator → bounded repair flow; missing visual evidence means **unverified**, not passed. Reject a wrong-story image even if its page grid looks right.
7. A contact sheet is never final acceptance. Mark failed pages for targeted regeneration; retain provenance and do not put unverified images into \`final/\`.

\`manga-generation-handoff-preflight/1\` reports \`prepared-not-attached\` or \`blocked\`, **never** claims model input attachment. The LLM must verify that part at the image-tool boundary. Runbook: \`docs/PROMPT_HANDOFF.md\` owns the detailed contract and refusal/repair conditions.

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
- selected expression techniques can be explained by intended effect;
- repository validation passes for code/contract changes.
