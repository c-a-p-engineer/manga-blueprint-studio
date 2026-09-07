# AGENTS.md — Manga Blueprint Studio

## Mission

Manga Blueprint Studio is a visual manga planning tool that lets a human explicitly decide panel layout, character placement, pose, and camera direction, then exports those decisions as both a visual blueprint and machine-readable data for image-generation assistants.

The project is **not** an autonomous AI comic generator. The human remains the director; AI is a downstream renderer/assistant.

## Source of truth

Use this order when documents disagree:

1. `AGENTS.md` — repository operating rules and invariant boundaries
2. `docs/PRODUCT.md` — user-visible product contract and MVP acceptance
3. `schema/manga-blueprint.schema.json` — persisted blueprint format
4. `docs/ARCHITECTURE.md` — implementation boundaries and data flow
5. implementation under `web/`
6. `docs/ROADMAP.md` — future work only; roadmap items are not shipped behavior

If implementation and schema disagree, do not silently change one to match the other. Decide whether the behavior or the format is stale, then update both intentionally.

## Product invariants

### Human direction first

- The user controls manga composition before image generation.
- AI must not silently replace panel layout, pose, character identity, or camera decisions recorded in a blueprint.
- Suggested automation may be added later, but suggestions must remain editable and distinguishable from user-authored decisions.

### Visual blueprint + semantic blueprint

Every meaningful composition should be representable in two forms:

- **visual blueprint**: a PNG/SVG-like page reference that communicates spatial arrangement to a multimodal model;
- **semantic blueprint**: `.manga.json`, where panel order, character identity, pose intent, camera, and coordinates remain explicit.

Neither representation replaces the other.

### Stick figures are pose references, not character identity

- A stick figure represents body relation, pose, position, facing, and approximate scale.
- The label/`characterId` binds it to a character sheet supplied separately.
- Do not infer hairstyle, clothing, body type, gender, age, or visual style from the stick figure.
- Pose preset IDs are editable shorthand, not immutable anatomy.

### Panel order is semantic

- Panel numbers are authoring/reference markers.
- They may appear in the exported blueprint image to help an AI correlate prompt instructions.
- Generated comic art should not render those numbers unless explicitly requested.
- Japanese manga defaults to right-to-left reading order.

### Provider independence

Core blueprint data must not depend on OpenAI, Gemini, Stable Diffusion, ComfyUI, or another image provider.
Provider-specific adapters, if introduced, belong at the export/integration boundary.

### Editable intermediate artifacts

Prefer structures where one bad panel, pose, or prompt can be replaced without regenerating an entire page.
Do not collapse authoring state into a single opaque prompt.

## Current implementation phase

The current `web/` application is a zero-dependency static prototype. This is intentional:

- no build step is required;
- GitHub Pages can deploy the exact prototype files;
- interaction semantics can stabilize before choosing a larger UI framework.

A later migration to React/TypeScript or another framework is allowed if it preserves the product contract and `.manga.json` compatibility.

## Development commands

Serve locally from the repository root:

```bash
python3 -m http.server 4173
```

Then open:

```text
http://localhost:4173/web/
```

The prototype must also work when hosted under:

```text
https://c-a-p-engineer.github.io/manga-blueprint-studio/
```

## GitHub Pages

Pages is deployed through `.github/workflows/pages.yml`.
The workflow uploads `web/` as the Pages artifact and deploys it with the official Pages actions.
Do not add a second deployment mechanism unless there is a documented migration.

## Change rules

When changing persisted data:

1. update `schema/manga-blueprint.schema.json`;
2. update `docs/PRODUCT.md` if behavior changes;
3. update `docs/ARCHITECTURE.md` if ownership/data flow changes;
4. preserve old files when practical or increment the format version with an explicit migration strategy.

When adding a pose preset:

- give it a stable ID;
- provide a human-readable label;
- provide a semantic description used by prompt export;
- keep the drawing representation separate from character identity.

When adding camera controls:

- keep narrative intent in semantic fields;
- treat visual overlays as aids, not the canonical camera definition.

## Security and privacy

- The prototype is client-side only.
- Do not upload local character sheets or project JSON anywhere unless an explicit network feature is introduced and documented.
- Do not add analytics, telemetry, external fonts, remote scripts, or API calls without documenting the data boundary.
- Never commit API keys, access tokens, cookies, or private character assets.

## Definition of done for prototype changes

A user-visible change is complete only when relevant checks pass:

- the page loads without console errors;
- the main editor remains usable on desktop and narrow/mobile widths;
- a panel can be selected;
- characters can be added, selected, moved, and assigned a pose;
- blueprint JSON export still round-trips through import;
- prompt export reflects current panel/character state;
- blueprint PNG export still produces the page reference;
- no hidden network dependency is introduced;
- Pages workflow remains valid for the deployed directory.

## Non-goals for the current prototype

- final manga rendering;
- text-to-image API calls;
- authentication or cloud project storage;
- full 3D posing;
- exact anatomy simulation;
- speech balloon typesetting;
- multi-user collaboration.
