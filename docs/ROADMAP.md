# Roadmap

This roadmap describes candidate stages, not promises. Shipped behavior is defined by `docs/PRODUCT.md` and the implementation.

## Stage 0 — Interactive prototype

- [x] static editor shell
- [x] manga page templates
- [x] panel selection
- [x] horizontal/vertical panel splitting
- [x] automatic panel numbering
- [x] named stick figures
- [x] pose presets
- [x] character drag / scale / rotation
- [x] camera controls
- [x] character-sheet reference key
- [x] JSON export/import
- [x] blueprint PNG export
- [x] provider-neutral prompt generation
- [x] local autosave
- [x] GitHub Pages workflow

## Stage 1 — Better page authoring

- drag panel borders;
- gutters/margins;
- bleed / panel-break markers;
- duplicate/delete/reorder panels;
- multi-page projects;
- page thumbnails;
- explicit right-to-left reading-path editor;
- undo/redo history.

## Stage 2 — Better pose authoring

- editable joints;
- pose mirroring;
- facing direction;
- support/weight metadata;
- body flow / line of action;
- contact points and props;
- pose families/variants;
- custom pose library.

## Stage 3 — Camera and staging

- camera icon/viewport overlay;
- lens/FOV hints;
- foreground/midground/background layers;
- POV contracts;
- occlusion/foreshortening hints;
- subject emphasis and focus targets.

## Stage 4 — Character sheets

- project character registry;
- local thumbnail attachment;
- multiple reference views;
- per-character identity notes;
- explicit instance-to-sheet bindings;
- export package containing blueprint + references + manifest.

## Stage 5 — AI handoff adapters

- prompt profiles for multimodal assistants;
- copy/download complete generation package;
- optional provider adapters;
- panel-by-panel generation workflow;
- regeneration of one panel without changing others.

Provider integration must remain optional. The core editor should continue to function offline.

## Stage 6 — Production workflow

- speech balloons and text zones;
- per-panel image replacement;
- page compositor;
- Clip Studio / PSD-oriented export research;
- project archive format;
- validation and regression fixtures.
