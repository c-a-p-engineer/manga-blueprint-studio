# Prototype 0.16.3 — Template cast selection and starter characters

Prototype 0.16.3 simplifies Story Template application around the actual authoring task: choose a template, choose who appears, then apply.

## What changed

- Removed the redundant middle Story Template preview surface.
- Kept card-first template discovery and presentation filters as the single selection surface.
- Added an explicit **使用するキャラクター / Characters to use** apply card below the template gallery.
- One-visible templates use the selected primary reusable character.
- Two-visible templates require two distinct selected reusable characters and use those exact two characters.
- Rebound the final apply action to the presentation-aware canonical pipeline, so selected panel geometry/effects and selected cast are applied together.
- New works start with six editable description-mode starters: high-school boy/girl, adult man/woman, and male/female background characters.
- Existing/imported works are not silently modified; the Character tab provides explicit quick-add buttons for the same starter set.
- Mobile controls stack the cast selectors and keep the primary apply action touch-friendly.

## Compatibility

- Project format remains `manga-blueprint/0.2`.
- Export manifest remains `manga-blueprint-export-manifest/3`.
- Template browsing/filtering/cast selection remains non-mutating until explicit apply.
- Starter characters use the existing reusable-character `description` identity contract; no schema change is required.

## Cache freshness

The application version is **0.16.3** so GitHub Pages requests the new integration runtime instead of stale cached chunks.

## Documentation

Current behavior is synchronized in `docs/PRODUCT.md`, `docs/USER-GUIDE.md`, `docs/ARCHITECTURE.md`, `docs/ROADMAP.md`, the runtime documentation, the repository README, and the public `/guide.html`.
