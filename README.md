# Manga Blueprint Studio

Manga Blueprint Studio is becoming an **AI/human co-authoring system for manga planning**. The canonical project state remains `manga-blueprint/0.2`; the Web editor is one client, while the new Blueprint Engine can compile a lightweight manga name directly into AI-ready project state and visual handoff assets.

**The human remains the director.** AI may draft or revise beats, layout intent, camera, cast, text, and effects, but the resulting blueprint stays inspectable and editable.

## Current prototype: 0.19.0

Blueprint Engine is an experimental preview track layered on the current prototype.

- canonical project format: `manga-blueprint/0.2`
- existing Web export manifest: `manga-blueprint-export-manifest/3`
- AI Name package preview: `manga-blueprint-name-package/2`
- Web editor export scope: selected page only
- Blueprint Engine input: lightweight Markdown Name DSL

## Links

- **Repository:** https://github.com/c-a-p-engineer/manga-blueprint-studio
- **Product page:** https://c-a-p-engineer.github.io/manga-blueprint-studio/
- **Editor:** https://c-a-p-engineer.github.io/manga-blueprint-studio/editor.html
- **Full user guide:** https://c-a-p-engineer.github.io/manga-blueprint-studio/guide.html
- **Canonical schema:** https://c-a-p-engineer.github.io/manga-blueprint-studio/schema/manga-blueprint.schema.json
- **AI Name DSL:** [`core/name-schema.md`](core/name-schema.md)
- **Blueprint Engine guide:** [`docs/BLUEPRINT-ENGINE.md`](docs/BLUEPRINT-ENGINE.md)

The root GitHub Pages URL remains the **public product landing page**. The dedicated Web editor remains available as an optional visual client.

## AI-first workflow

```text
Name / beats (Markdown DSL)
        ↓
Blueprint Engine
        ↓
canonical work.manga.json
        ├─ Web editor (optional human refinement)
        ├─ clean blueprint visual
        ├─ annotated review visual
        ├─ page generation prompt
        └─ manifest-first package
```

The author does not need to manually enter IDs or pixel coordinates. The Name DSL expresses story beats and useful direction such as cast, expression, camera, background, dialogue, SFX, emphasis, and coarse layout hints. The compiler owns deterministic IDs, initial panel geometry, character placement, balloon placement, and canonical project serialization.

### Example

```md
# Page 1: 受信
@layout: hero-bottom
@background: 明るいリビング
@time: day

コマ1: 少女がスマホを見る
登場: girl@right
カメラ: close high-angle
セリフ: girl> ……え？

コマ2: 画面の内容に気づく
登場: girl@center
表情: girl> shock
強調: strong

コマ3: スマホを落とす
登場: girl@center
セリフ: girl> そんな……
効果音: ガタン
演出: impact
強調: climax
```

Compile:

```bash
npm install
npm run blueprint -- examples/name.md blueprint-out
```

The generated `.manga.json` uses the same canonical project format as the Web editor, so AI-authored output can be handed to the GUI instead of creating a second project model.

## Existing Web editor capabilities

### Organize a manga work

- multiple local works with IndexedDB persistence;
- multiple pages with stable identity and `P001` navigation;
- optional volume / chapter / folder hierarchy through Work Explorer;
- per-work active-page restoration and explicit activation.

### Design pages and panels

- manuscript presets and RTL/LTR reading order;
- manga-aware layouts;
- rectangle and convex-quadrilateral panel geometry;
- editable inset panels;
- camera, action intent, pose/expression/gaze, backgrounds, balloons, SFX, effects, bleed, and breakout semantics.

### Character and story direction

- reusable characters with `sheet | description | free` identity modes;
- Story Template Studio;
- bounded Smart Manga proposals;
- starter character bases.

### AI handoff

The existing Web generation package separates:

```text
clean visual          → spatial composition
.manga.json + prompt  → story / camera / pose / background / lettering semantics
character guidance    → identity / appearance
art direction         → rendering language
TEXT TO RENDER        → exact visible text allowlist
```

The Blueprint Engine follows the same authority split: semantic project state remains canonical, clean visuals carry spatial structure, and exact visible strings are explicitly allowlisted.

## Architecture at a glance

```text
core/blueprint-engine.mjs   AI Name DSL parser/compiler + visual/prompt package builders
core/name-schema.md         human/AI authoring DSL contract
cli/                        headless compiler entry
web/                        optional Web editor/client
schema/                     canonical serialized project schema
docs/                       product/architecture/handoff/roadmap authorities
scripts/                    build and regression validation
```

The intended architecture is **Core first, clients second**. The Web editor should consume the same project contract rather than own a competing manga model.

## Development

```bash
npm install
npm run typecheck
npm run build
npm run validate
```

Blueprint compiler regression coverage is included in the main CI validator.

For the current Web workflow, see [`docs/USER-GUIDE.md`](docs/USER-GUIDE.md).

## Documentation map

- [`docs/USER-GUIDE.md`](docs/USER-GUIDE.md) — current Web editor workflow.
- [`docs/PRODUCT.md`](docs/PRODUCT.md) — canonical user-visible product behavior.
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — runtime/state/ownership.
- [`docs/PROMPT_HANDOFF.md`](docs/PROMPT_HANDOFF.md) — AI handoff authority split.
- [`docs/ROADMAP.md`](docs/ROADMAP.md) — delivery/status authority.
- [`docs/BLUEPRINT-ENGINE.md`](docs/BLUEPRINT-ENGINE.md) — headless compiler workflow.
- [`schema/manga-blueprint.schema.json`](schema/manga-blueprint.schema.json) — canonical serialized data contract.
- [`core/name-schema.md`](core/name-schema.md) — AI/human Name DSL.

## License

MIT
