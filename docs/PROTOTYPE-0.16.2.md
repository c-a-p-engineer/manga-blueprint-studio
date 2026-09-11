# Prototype 0.16.2 — Story Template presentation catalog

Prototype 0.16.2 turns Story Template discovery into a practical manga-effect sampler while keeping the human-directed, non-mutating browsing contract.

## What changed

- Story Template selection is card-first; the duplicate legacy template dropdown is hidden.
- Existing cast/story quick filters can be combined with presentation filters.
- New presentation filters cover **演出あり / 演出なし**, diagonal panels, impact/borderless/inset frames, focus/speed/impact/tension/silence effects, and breakout.
- Template cards show presentation chips and shaped thumbnails, so users can see the relevant technique before applying it.
- Free-text search recognizes presentation terms such as `衝撃枠`, `枠無し`, and `集中線`.
- Six additional samples ship for trying presentation patterns directly: `突進→一撃`, `連続攻防`, `衝撃の発見`, `不穏な接近`, `静かな余韻`, and `ツッコミ小窓`.
- The two-visible battle sample also demonstrates a combined **2人表示 + 集中線** query, while diagonal battle samples demonstrate **斜めコマ + 衝撃枠**.

## Contracts preserved

- browsing, filtering, searching, and preview remain non-mutating;
- explicit apply is still required before page content changes;
- `meta.storyTemplate` remains provenance only;
- project format remains `manga-blueprint/0.2`;
- export manifest remains `manga-blueprint-export-manifest/3`;
- existing rectangle and quadrilateral panel geometry remain compatible.

## Verification

Repository validation now checks the presentation-filter contract, compound-filter hooks, shaped-thumbnail integration, and minimum sample coverage for impact/borderless/inset frames plus focus/speed/impact/tension/silence effects. CI remains the static contract check; deployed-page availability is verified separately after merge.

## Cache freshness

The application version is bumped to **0.16.2** so versioned runtime-chunk URLs fetch the new Story Template catalog and filter behavior after GitHub Pages deployment.

## Documentation

Current behavior is synchronized in `docs/PRODUCT.md`, `docs/USER-GUIDE.md`, `docs/ROADMAP.md`, the repository `README.md`, and the public `/guide.html`.