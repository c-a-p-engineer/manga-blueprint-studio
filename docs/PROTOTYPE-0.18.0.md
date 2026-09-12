# Prototype 0.18.0

Prototype 0.18.0 refreshes Story Template panel composition around manga-specific page rhythm rather than decorative skew.

## Shipped

- Added `duel2`, `opposed3`, `zigzag4`, `stair4`, `build4`, and `detail5` layout families.
- Replaced legacy wide-wedge diagonal geometry with narrow shared parallel seams; old `diagonal3` / `diagonal4` IDs remain compatible.
- Reorganized existing Story Templates by visual purpose: pressure/impact, dialogue/reaction, buildup/payoff, or intentionally stable layouts.
- Added `変化の前後 2コマ`, `転換点 4コマ`, and `手元→発見 5コマ`.
- Added deterministic checks for panel count, canvas bounds, inner whitespace, hero-panel area contrast, template mapping, and diagonal discovery integration.
- Added research rationale in `docs/PANEL-LAYOUT-GRAMMAR-2026-09-12.md`.

## Documentation

- Canonical behavior: `docs/PRODUCT.md`
- User workflow: `docs/USER-GUIDE.md`
- Public guide: `/guide.html`

Project format remains `manga-blueprint/0.2`; this release does not migrate serialized project schema.
