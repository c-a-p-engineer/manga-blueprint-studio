# Product Contract

## Product purpose

Manga Blueprint Studio is a **human-directed manga planning and AI-handoff editor**. It exists to capture manga-specific intent before image generation: work/page structure, panel geometry and order, story action, character identity and pose, camera, background, dialogue/SFX, lettering direction, art direction, and manga effects.

The product should reduce ambiguity for downstream image-generation assistants without forcing the user to become a cinematography or prompt-engineering specialist.

The human remains the director. Assistance proposes; the user decides and edits.

## Current scope

The current product supports:

- multiple local works;
- optional volume/chapter/folder organization;
- multiple pages per work;
- manga-first work/page navigation;
- page/panel authoring;
- rectangle or convex-quadrilateral panel geometry;
- direct four-corner panel-shape editing and irregular layout presets;
- reusable character identity;
- Story Template Studio and Smart Manga;
- manga-specific camera/background/text/effect semantics;
- selected-page AI generation/review handoff packages.

The current product does **not** yet provide full backup/restore, multi-page/range/container/work-wide AI export, panel-first generation packages, generalized cross-page reference assets, arbitrary polygon/curved panel frames, or deterministic final post-generation typesetting. Those remain roadmap items.

## Primary mental model

The UI follows manga production hierarchy:

```text
Work / 作品
  → optional Volume / Chapter / Folder
    → Page (P001, P002, ...)
      → Page settings / panel layout
        → selected-panel authoring
          → selected-page AI handoff
```

Volumes/chapters/folders are optional. A flat work with pages directly under the work is fully valid.

## Manga-first editor shell

The current navigation shell is a product contract, not cosmetic decoration.

### Application header

The application header owns app-level actions such as:

- quick Help;
- Undo/Redo;
- UI language.

It should not carry the active work title as a large action that competes with app-level controls.

On narrow mobile screens, the app header uses two explicit rows: branding/tagline first, then Help / Undo / Redo / language. Action labels remain single-line instead of wrapping inside individual buttons.

### Current work / page context

The editor presents the current manga location above the canvas:

- work title on its own line;
- work title opens the **Work Explorer**, which combines work switching and page-tree navigation;
- breadcrumb shows optional volume/chapter/folder ancestry plus current page;
- page codes use minimum three-digit display formatting such as `P001`;
- previous/next/add page actions live in the same current-page context;
- a direct page strip allows page switching;
- there is no separate 「作品構成」 button; the work title itself is the explorer entry point.

`P001` is display formatting only. Canonical `pageNumber` remains a positive integer.

### Work Explorer / 作品エクスプローラー

Work Explorer is the primary work/page navigation surface and follows a file-explorer mental model.

It presents:

```text
Work
├─ P001
├─ Volume
│  ├─ Chapter
│  │  ├─ P002
│  │  └─ P003
│  └─ P004
└─ Folder
```

Requirements:

- direct page selection from the tree;
- ungrouped/root pages and grouped pages may coexist;
- `volume`, `chapter`, and `folder` containers may nest;
- page operations remain available as advanced controls; dedicated volume/chapter/folder editing is not shown in the primary UI;
- on narrow screens the structure view may become a full-screen/modal explorer, but the information hierarchy remains the same.

### Page settings / ページ設定

Page settings owns current-page-wide configuration such as manuscript size, reading direction, page-wide art direction, layout/templates, and page-level overview/checks.

It is **not** the primary page navigator and should not be used as the main work/container explorer.

## Work Library and persistence

A work has stable identity through `meta.workId`.

The Work Library must support:

- listing saved works with useful summary metadata;
- browsing without changing the active work;
- explicit open;
- create;
- rename without changing `workId`;
- duplicate as a new independent work;
- delete with confirmation.

Project persistence uses IndexedDB.

### Save vs activate

Saving work contents and activating a work are separate operations.

- ordinary autosave persists the current work contents;
- ordinary autosave must not change `activeWorkId`;
- explicit open/create/import changes active-work state;
- switching works resets editor history/selection at the work boundary and restores the target work's remembered page.

This prevents a delayed autosave from an older work from silently reactivating it after the user has switched works.

### Identity on duplicate/import-as-new

Copying a work as a new work regenerates:

- `workId`;
- container IDs with parent remapping;
- page IDs with container remapping;
- panel IDs;
- placed-character instance IDs;
- balloon IDs.

Semantic reusable-character IDs may remain stable because they express character identity rather than placement-instance identity.

### Legacy browser storage

Historical browser project-autosave `localStorage` is intentionally not migrated. Portable `.manga.json` import is the compatibility path.

Language preference and browser-local custom Story Templates are separate local-storage concerns.

## Multi-page authoring

The current-page navigation/Work Explorer + advanced page controls must support:

- selecting a page without mutating another page;
- adding a page;
- duplicating the current page with fresh page/panel/placed-character/balloon instance IDs;
- deleting a page with confirmation while refusing to delete the final remaining page;
- moving a page earlier/later;
- sequential renumbering;
- editing a unique visible `pageNumber`;
- editing an optional page title;
- remembering the active page per work.

`selectedPageId` is editor selection state. Authoring/render/handoff operations resolve the current page through the selected-page model rather than assuming `pages[0]`.

## Volume / chapter / folder model

Containers organize pages without becoming page identity.

A container has:

- stable `id`;
- `kind: volume | chapter | folder`;
- mutable `title`;
- sibling `order`;
- optional `parentId`.

A page has optional `containerId`.

Requirements:

- create/rename/reorder/reparent container;
- prevent self/descendant cycles;
- assign page to a container or root;
- moving a page must preserve page identity;
- container deletion requires confirmation;
- deleting a non-empty container must never silently delete page content;
- direct pages and direct child containers are re-homed to the deleted container's parent before the container is removed.

## Page / panel layout

The product supports dynamic page size and named manuscript presets, including standard portrait/social/video formats, B5/A4, Webtoon, and custom dimensions.

Japanese manga RTL is the default panel reading direction; LTR is supported.

Panel `order` must remain synchronized with current geometry + reading direction on committed render paths. The same resulting order drives:

- canvas panel numbers;
- Story Template thumbnail numbering and beat placement;
- Panel Peek/List;
- generated prompt;
- manifest-derived order;
- exports.

The product includes common layout families such as single, 2/3 panel, 4-koma variants, 5/6 panel, conversation, action, and climax patterns. Prototype 0.16.0 additionally includes **斜め3コマ** and **斜め4コマ 2×2** layouts whose panels begin as actual editable quadrilaterals. Applying a layout/template is explicit when it would replace authored panel geometry.

### Panel shape

A panel always retains `rect` as its compatibility bounding box. It may additionally own an optional shape:

```json
{
  "shape": {
    "kind": "quad",
    "preset": "custom",
    "points": [
      {"x": 35, "y": 35},
      {"x": 390, "y": 55},
      {"x": 390, "y": 385},
      {"x": 35, "y": 365}
    ]
  }
}
```

When `shape.kind = quad` exists:

- its four points are authoritative for the visible panel boundary, selection hit area, and clipping;
- `rect` is synchronized to the quadrilateral bounding box for compatibility with existing placement/order systems;
- the panel inspector offers rectangle, diagonal-left/right, trapezoid-left/right, and custom shape choices;
- **四隅を直接編集** exposes four visible handles that may be dragged independently;
- invalid self-intersection, near-zero area, and unusably short edges are rejected;
- changing page size scales both the compatibility rect and quadrilateral points;
- resetting to rectangle removes `shape` and uses the current bounding box;
- irregular shapes currently disable bleed instead of applying rectangular bleed semantics to a non-rectangular edge;
- splitting an irregular panel currently degrades explicitly to rectangular children based on its bounding box.

Arbitrary 5+ point polygons, curves, linked shared-edge dragging, snapping, and topology-aware splitting are not current behavior.

## Story action intent

`Panel.actionIntent` expresses **what happens** in the panel when pose alone is insufficient.

Examples:

- `振り向いてこちらを見る`
- `コップを落として驚く`
- `踏み込んで右ストレートを放つ`

It is semantic data and may appear in authoring summaries, prompt, and manifest index. It is never visible manga text and never belongs in `TEXT TO RENDER`.

## Story Template Studio

**Story Template / ストーリーテンプレート is the single canonical template feature name.** “Scene Template” is not a separate feature or alias.

Story Template Studio provides recognizable editable story/beat patterns.

### Discovery

Templates may be discovered by:

- category;
- free-text search over title/description/use case/tags/actions **and presentation terms** such as `衝撃枠`, `集中線`, or `枠無し`;
- visual cards and shape-aware layout thumbnails;
- presentation chips that summarize diagonal geometry, special frame types, line effects, and breakout;
- panel count;
- beat-flow preview;
- cast/relationship/dialogue/art quick filters where available;
- presentation quick filters for `演出あり / 演出なし`, diagonal panels, `impact / borderless / inset` frames, `focus / speed / impact / tension / silence` line effects, and breakout.

Quick-filter groups are conjunctive across groups, so users can ask for combinations such as **2人表示 + 集中線** or **斜めコマ + 衝撃枠**. Within a single group, choosing another value replaces the prior value. The shipped catalog includes multiple concrete samples for the presentation filters so filters are useful as an effect sampler rather than empty taxonomy.

Categories include romance, battle, emotion, daily, comedy, suspense, character introduction, and custom.

### Apply behavior

- Story Template discovery is presented inside the upper Page settings / panel-layout flow rather than as a separate middle Story Template section;
- the sample-dialogue/SFX checkbox sits in the same apply flow and decides whether template dialogue/SFX is created;
- the primary apply button remains visible in that same upper surface;
- the redundant legacy middle preview is not presented as a second Story Template surface; the selected template, cast selectors, sample-text option, and primary apply action form one task-oriented apply area;
- after choosing a template card, the user explicitly chooses the reusable character(s) that will be used before applying;
- one-visible templates use the selected primary character; two-visible templates require and use two distinct selected reusable characters;
- browsing/filtering/searching/previewing does not mutate the current page;
- template selection is card-first; the duplicate legacy Story Template dropdown is not presented as a second selection surface;
- applying over authored content requires explicit confirmation;
- sample dialogue/SFX inclusion is explicitly controlled;
- applied state becomes ordinary editable project state;
- `meta.storyTemplate` records provenance only;
- template thumbnail number, panel `order`, and applied beat index must express the same selected RTL/LTR reading sequence.

### Bounded derivation

Derivation may create a temporary variation that preserves the core story action/beat flow while varying a bounded subset of camera/emphasis/effects. It remains non-mutating until explicit apply.

### Custom Story Templates

The user may save a current page pattern as a browser-local custom Story Template.

Custom templates may store normalized geometry and reusable direction but must not store character-specific finished visual identity or Character Sheet file content.

## Smart Manga

Smart Manga is distinct from Story Template Studio.

It proposes bounded alternatives from inputs such as purpose, panel count, seed, emphasis variant, intensity, and optional reusable-character placement.

Requirements:

- one request returns a small bounded candidate set;
- browsing candidates does not mutate the page;
- applying a candidate is explicit;
- seed/variant/intensity provenance is persisted where defined;
- applied candidates remain editable;
- selected-panel direction dice remains narrower than whole-page proposal and preserves authored content it is not responsible for.

## Reusable character identity

`characterLibrary` stores reusable base-character identity. Placed instances own panel-specific pose/expression/gaze/placement.

Identity modes:

1. `sheet` — separately attached Character Sheet required;
2. `description` — no sheet required; text appearance guidance is identity contract;
3. `free` — no sheet required; downstream model may choose a simple consistent appearance.

A Character Sheet is therefore optional, not universal.

New works begin with six editable starter base characters in `description` mode: high-school boy/girl, adult man/woman, and male/female background characters. These remain generic starting identities, but each starter now carries concrete hair, eye, and fully specified everyday/school clothing so downstream rendering never has to infer clothing from the planning figure. Existing/imported works are not silently populated; the Character tab may explicitly add any missing starter.

Stick figures are pose/placement references. They communicate body relation, pose, approximate scale, and direction, not finished character appearance or clothing state. Generation must use explicit character outfit guidance when present; an unspecified outfit falls back to ordinary scene-appropriate clothing rather than treating a stick figure as unclothed.

## Camera, pose, depth, and scene semantics

The editor can record camera distance/angle/viewpoint/focus/intent and richer pose/depth semantics such as support state, motion phase, near-object depth target, foreshortening, contact-aware interaction guidance, and scene continuity anchors where supported.

Camera/figure-size diagnostics and Crop Guide are advisory authoring aids. They do not silently mutate state and are excluded from clean AI output.

Professional camera terms may remain for interoperability, but Japanese UI should pair them with understandable Japanese wording/explanation rather than unexplained English-only labels.

## Background / balloons / manga effects

Background authoring includes location, time, weather, mood, detail level, render treatment, and free notes.

Balloon authoring includes speech/thought/shout/whisper/narration/off-screen types, speaker, text, size/position, and writing-mode semantics where available.

Frame/effect authoring includes border/bleed/breakout and speed/focus/impact/tension/silence-style line effects plus SFX/onomatopoeia.

## Reading direction vs lettering direction

These are separate contracts.

### Panel reading direction

`meta.readingDirection = rtl | ltr`

- `rtl` is Japanese manga default;
- this controls panel sequence/numbering.

### Text writing direction

`meta.defaultWritingMode = vertical-rl | horizontal-tb`

Balloon/SFX may use:

- `inherit`;
- `vertical-rl`;
- `horizontal-tb`.

Changing writing direction must never change panel reading order.

Editor/review may preview writing direction. Clean AI output removes balloon/SFX text and carries exact strings + writing direction semantically.

## Art direction

The project may define global rendering guidance such as:

- color mode;
- rendering style;
- line style;
- shading;
- detail level;
- background finish;
- palette;
- tone;
- additional finish/style notes.

Art direction controls how the manga is rendered. It does not override character identity, story action, panel geometry, or exact visible text.

In Japanese UI, open-ended authoring labels should be understandable without English knowledge. For example, `artDirection.notes` is shown as **追加の画風・仕上げ指示（任意）** with a Japanese example.

## Panel Peek / Panel List / Panel Chips

The user should understand a page without opening every editor field.

### Panel Peek

- normal tap selects;
- long-press may open quick Peek;
- a visible `ⓘ` provides the same feature so long-press is not hidden-only UX;
- summary includes relevant action/characters/camera/background/dialogue/effects/framing status;
- mobile presentation remains opaque and viewport-bounded.

### Panel List / page overview

Page settings may provide detailed/compact semantic rows in reading order. Selecting a row changes editor selection, not project semantics.

### Panel Chips

Compact canvas chips are authoring overlays only and never part of clean AI output.

## Manga Check

Manga Check is non-blocking lint. It may warn about missing action intent, camera/figure mismatch, repeated camera, missing background locations, or repeated expressions.

Warnings are advice. They do not block export or rewrite the page automatically.

## Help and user guidance

The app provides:

- a compact in-editor Help surface for quick reference;
- a dedicated full user guide page at `web/guide.html` / public `/guide.html`;
- Markdown source guidance at `docs/USER-GUIDE.md`.

The full guide should explain the manga-first mental model, current screen layout, hierarchy, P001 page codes, editing tabs, panel-shape editing, Story Template vs Smart Manga, identity modes, and AI handoff without requiring knowledge of internal runtime names.

## AI-safe output boundary

### Visual authority

Clean AI PNG communicates panel geometry/proportions and approximate spatial placement. For shaped panels, the quadrilateral boundary is the visual authority and must be preserved exactly. Stick-figure joints are guidance rather than finished anatomy.

### Semantic authority

`.manga.json` + generated prompt carry story action, pose meaning, camera, depth, background, continuity, lettering semantics, panel geometry metadata, and related direction.

### Character identity

Reusable character guidance and only the separately required Character Sheets control finished character identity.

### Exact text

Only exact strings explicitly allowlisted under `TEXT TO RENDER` may become visible manga text.

Forbidden authoring text includes character display names/IDs, panel numbers, camera terms, Story Template name, action intent, writing-mode labels, Panel Peek/List/Chip summaries, Crop Guide labels, and editor UI text.

## Manifest-first handoff

The current AI generation package is selected-page scoped.

### AI generation ZIP

Contains:

```text
<prefix>_clean.png
<prefix>.manga.json
<prefix>_prompt.txt
<prefix>_manifest.json
```

The manifest is read first. Annotated PNG is deliberately excluded.

### Review/archive ZIP

Contains the same state-linked materials plus `<prefix>_annotated.png`.

Annotated review is for human checking/storage and must not become the default generation reference.

### Producer provenance

Export manifest includes producer/build metadata so users can distinguish exports made by stale Pages/cache builds from the current application release.

## Provider independence / privacy

Core project state is provider-independent. Provider adapters belong at the export boundary.

The app is local-first and static by default:

- no analytics/telemetry;
- no silent Character Sheet upload;
- no external API calls/tokens/credentials without an explicit documented feature boundary.

## Compatibility

Current project format: `manga-blueprint/0.2`.

Current export manifest: `manga-blueprint-export-manifest/3`.

Current compatible optional fields include stable work/page/container identity, Story Template provenance, action intent, writing direction, art direction, richer pose/depth/continuity semantics, assistance provenance, and optional convex-quadrilateral `Panel.shape` geometry.

Older portable files may normalize missing compatible fields to safe defaults. Rectangle-only panels remain valid. UI-only changes such as `P001` display formatting do not require a project-format bump.

## Acceptance criteria

A current release is product-compatible when all relevant items remain true:

- app header is app-level; current work/page context is presented separately;
- on narrow screens the app header uses branding + actions as two explicit rows and does not wrap Help/Undo/Redo labels inside buttons;
- work title, breadcrumb, `P001` page code, page switching, and Work Structure are available above the canvas;
- Work Structure is the primary explorer-style work/container/page navigator;
- Page settings owns page-wide configuration rather than primary work navigation;
- Work Library browsing does not change active-work state;
- ordinary autosave cannot change active work;
- multi-page CRUD/selection preserves independent page state and stable identity;
- container hierarchy supports root/grouped pages and non-destructive confirmed deletion;
- page display codes are minimum three-digit padded while `pageNumber` stays numeric;
- RTL/LTR and panel geometry drive consistent panel order across UI and handoff;
- rectangle-only pages remain compatible;
- optional quadrilateral panels use one convex four-point boundary consistently for editor border, hit testing, clipping, clean output, and render-brief geometry;
- invalid quadrilateral corner movement is rejected and direct shape editing participates in Undo/Redo;
- irregular layout presets create editable quadrilateral panels rather than decorative overlays;
- writing direction remains independent from panel reading order;
- Story Template browsing and Smart Manga candidate browsing do not mutate project state;
- character identity modes do not universally require Character Sheets;
- clean AI output excludes authoring metadata and visible text not allowlisted under `TEXT TO RENDER`;
- AI generation ZIP excludes annotated PNG; review ZIP includes it;
- manifest remains read-first authority;
- current export remains explicitly selected-page scoped until scoped export ships;
- user guide/public guide and current product documentation match shipped terminology/workflow;
- public UI changes are not declared visually verified solely because CI passed.

## Prototype 0.17.0 — template-first Page settings

The primary Page-settings task is now **Story Template first**:

1. choose a Story Template card (panel layout + direction/presentation);
2. choose whether sample dialogue/SFX is used;
3. choose the reusable character cast;
4. press the explicit full-width apply action.

Browsing remains non-mutating. Manual panel-layout controls remain available behind progressive disclosure for direct editing. The legacy volume/chapter/folder editor is not a primary Page-settings surface; existing hierarchy data remains compatible and is navigated through **Work Explorer / 作品エクスプローラー**.

The production shell is now built through Vite with a TypeScript entry. This is a migration boundary, not a claim that every legacy runtime owner is already converted.
