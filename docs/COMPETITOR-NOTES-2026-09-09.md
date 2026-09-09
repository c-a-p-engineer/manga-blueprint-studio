# Competitor notes — 2026-09-09

Short research notes used to prioritize Manga Blueprint Studio. These are not product requirements and should be rechecked before implementation if competitor behavior changes.

## Directional findings

- Storyboard-oriented competitors generally work in frame/shot units rather than requiring one model call to honor an entire comic page at once.
- Mature manga/illustration tooling offers stronger perspective, 3D pose, final lettering, multi-page, and panel-geometry editing than Manga Blueprint Studio; Blueprint should borrow the semantic control ideas without trying to become a full drawing package.
- AI storyboard products increasingly emphasize reusable character/scene references and generated-result consistency checks.
- Manga Blueprint Studio's strongest differentiator is provider-independent, human-authored manga semantics: explicit RTL, Japanese lettering direction, panel geometry, action intent, camera/depth, identity policy, exact visible-text allowlists, and inspectable export contracts.

## Products to revisit

- Clip Studio Paint — manga page production, 3D/perspective, panel and lettering tools.
- Toon Boom Storyboard Pro — camera/stage/depth, shot continuity, animatic/timing.
- Boords — frame-based AI storyboard workflow, references, revisions/animatic.
- StoryboardHero — script-to-shot planning and shot metadata.
- Katalist — character/scene consistency and storyboard generation.
- ComicsAI — story/page/panel-oriented AI comic flow.
- Hugging Face Diffusers / ControlNet ecosystem — pose/depth/edge/segmentation conditioning for provider adapters.

Primary implementation priorities derived from this comparison are maintained in `docs/ROADMAP.md` and `docs/TASKS-RESEARCH-2026-09-09.md`.
