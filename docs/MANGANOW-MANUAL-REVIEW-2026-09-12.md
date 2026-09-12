# MangaNow manual review — 2026-09-12

Source reviewed: https://media.manganow.ai/manual/

This note records product ideas worth adopting into Manga Blueprint Studio without copying MangaNow's product architecture or turning the editor into a hosted AI generation service.

## What MangaNow emphasizes

Its public manual presents a five-step workflow:

1. provide source material and define purpose / target reader;
2. choose characters and other recurring assets;
3. choose art style and color;
4. choose a page/layout format suited to the publishing medium;
5. split content into pages, review the text/storyboard structure, then generate and edit images.

The manual also treats non-character items such as products, logos, services, and locations as reusable manga assets, and supports later local image correction / regeneration.

## Already covered by Manga Blueprint Studio

- manga-first page/layout planning before image generation;
- reusable character identity;
- art direction and color-mode guidance;
- square / portrait / 9:16 / 16:9 / B5 / A4 / Webtoon canvas presets;
- Story Templates and explicit layout application;
- multi-page works and page organization;
- exact-text safety, vertical Japanese lettering semantics, and AI handoff packages;
- review-first planning where panel geometry, dialogue, camera, effects, and cast can be edited before downstream rendering.

These areas do not need a duplicate subsystem merely because another product exposes them as numbered steps.

## Adopt now — Work Brief P0

The clearest missing low-cost concept is a **work-level creation brief**. Manga Blueprint Studio now stores optional guidance for:

- purpose;
- target audience;
- primary output medium;
- key message;
- source/material notes.

The brief is deliberately advisory. It may guide tone, emphasis, and suitability for the intended reader/medium, but it must never override authored panel geometry, cast, action, exact dialogue/SFX, or the strict visible-text allowlist.

The brief is serialized in `meta.workBrief`, included in the render brief / manifest handoff, and edited through a collapsed disclosure in Page → Manuscript so it does not lengthen the normal workflow unless needed.

## Keep on roadmap instead of pulling forward

### Generalized Reference Asset Library

MangaNow's treatment of products, logos, services, and locations as reusable assets confirms the value of the existing Phase 6 Reference Asset Library direction. Manga Blueprint Studio should keep its provider-independent/local-first version with stable IDs and explicit package inclusion rather than silently uploading assets.

Do not rush this before Backup / Restore and scoped export, because binary/reference ownership needs a portable package contract first.

### Source ingestion and automatic page splitting

URL/PDF/audio ingestion and AI-generated page splitting are useful for a hosted generation product, but they are not the current local-first editor's next dependency. They imply remote extraction/model execution, cost/privacy boundaries, and a second planning authority.

A later planner may accept source text and `---` manual page boundaries or optional AI-assisted splitting, but authored pages must remain explicit project state.

### Inpainting / final image editor

Local image inpainting and text cleanup are downstream-generation/post-production concerns. They should not be mixed into the blueprint semantic core until Panel-first / Hybrid generation exists and the ownership boundary is clear.

## Product principle reinforced by the comparison

The useful lesson is not to copy MangaNow's five screens. It is to keep **intent → assets → style → layout → page review → rendering** as a legible pipeline while preserving Manga Blueprint Studio's stronger separation between authored semantic intent and downstream image generation.
