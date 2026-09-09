# Prototype 0.12.9 baseline

Current release identity is centralized in `web/build-info.json`.

Release-facing documentation and export provenance must stay synchronized with that value. CI validates:

- `README.md` current prototype label;
- `docs/ROADMAP.md` shipped-through label;
- matching `docs/PROTOTYPE-<version>.md` release note;
- `web/app.js` runtime fallback version;
- manifest producer provenance runtime version.

GitHub Pages replaces only the deployed copy of build metadata with the exact deployment commit and timestamp; repository source stays a local/offline-safe fallback.

This prevents two recurring failure modes:

1. documentation says an older prototype even though implementation has advanced;
2. an exported ZIP cannot prove whether it came from current `master`, a stale Pages deployment, or a local fallback build.
