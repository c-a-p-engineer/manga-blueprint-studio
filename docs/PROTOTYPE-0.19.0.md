# Prototype 0.19.0

Prototype 0.19.0 adds the first real **panel-in-panel / 差し込みコマ** model and shortens the two longest authoring surfaces with task-first progressive disclosure.

## Shipped

- A selected root panel can create one editable inset panel in its top-right area.
- The inset remains an ordinary panel for camera, character, background, text, effects, and frame editing while carrying an explicit one-level parent relation.
- Semantic reading order keeps an inset immediately after its parent; duplicate/import normalization preserves or repairs that relation.
- Deleting an inset removes only it. Deleting a parent with an inset requires confirmation and removes the child with the parent. The final root panel remains protected.
- The clean blueprint places an opaque white panel mask behind the inset, so the child is visibly a real overlapping manga panel rather than transparent decoration.
- Render Brief and export manifest identify inset parentage and require downstream renderers to preserve the physical overlay.
- The old `border=inset` presentation is retained for compatibility but is labeled **小窓風枠 / Inset-style border** so it is not confused with a true inset panel.
- Page settings use one submode layer: **テンプレート / 原稿設定 / 手動コマ割り**.
- Panel settings use native disclosure sections for **内容・役割 / カメラ / 枠・形状**, keeping the current panel summary visible while reducing long scrolling.
- Added deterministic validation for inset parentage, duplicate remapping, deletion, AI handoff, top-level tab preservation, disclosure semantics, and terminology.

## Compatibility

- Project format remains `manga-blueprint/0.2`.
- `Panel.inset` is an optional compatible addition; existing projects require no migration.
- P0 supports one level and one inset per parent. Nested insets, user-selectable anchor/size presets, parent-resize following, and Story Template catalog integration remain later work.

## Documentation

- Current behavior: `docs/PRODUCT.md`
- Architecture and ownership: `docs/ARCHITECTURE.md`
- AI handoff: `docs/PROMPT_HANDOFF.md`
- User workflow: `docs/USER-GUIDE.md` and `/guide.html`
