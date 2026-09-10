# Prototype 0.15.0 — Manga-first editor shell

Prototype 0.15.0 reorganizes the authoring UI around the manga production hierarchy rather than individual configuration modules.

## User-visible model

The editor now presents the active context as:

```text
Work
  → optional volume / chapter / folder
    → page
      → panel layout and panel authoring
```

The work title is shown on its own line. A breadcrumb shows the current container path and page. The page tab is renamed **Page settings / ページ設定** so work/page navigation is not mixed with manuscript and panel-layout settings.

## Header / context shell

- compact application header keeps app-level actions such as Help, Undo/Redo, and language;
- current work title is shown separately below the application header;
- work title opens the Work Library;
- current location is shown as a breadcrumb such as `第1巻 › 第3章 › P001`;
- current page can be moved with previous/next buttons;
- a compact horizontally scrollable page strip supports direct page switching;
- visible page labels use zero-padded `P001`, `P002`, ... while canonical `pageNumber` remains numeric.

## Explorer-style work structure

The primary volume/chapter/folder navigation is now an explorer-style tree:

```text
作品
├─ 第1巻
│  ├─ 第1章
│  │  ├─ P001
│  │  └─ P002
│  └─ P003
└─ P004
```

- selecting a page in the tree opens that page;
- ordinary flat works remain valid and simply show pages directly below the work;
- existing detailed page and hierarchy CRUD controls remain available in collapsible advanced sections;
- the underlying `workId`, `containerId`, `pageId`, `pageNumber`, and hierarchy semantics are unchanged.

## Japanese-first clarity

The Japanese UI removes several English-only residues from the primary authoring surface:

- `P1` style labels become `P001`;
- unnamed page fallback uses `Nコマ` rather than `N panels`;
- autosave state is localized;
- panel status and canvas camera/role annotations are translated for Japanese authoring;
- **Additional style notes** becomes **追加の画風・仕上げ指示（任意）** with a Japanese example;
- the page tab becomes **ページ設定**.

Machine-readable semantic values remain English where required for interoperability; clean AI PNG and generation contracts remain unchanged.

## Compatibility

- project format remains `manga-blueprint/0.2`;
- manifest remains `manga-blueprint-export-manifest/3`;
- no project migration is required;
- no hierarchy or page identity changes are introduced;
- existing work/page/container CRUD functions are reused rather than replaced;
- the new shell is presentation/navigation only.

## Verification

CI adds `scripts/validate-editor-shell.mjs` to verify:

- the editor shell is registered as the final runtime UI layer;
- work/page context and explorer navigation contracts exist;
- page labels use zero-padded three-digit display formatting;
- Japanese page/settings/style wording is present;
- existing volume/chapter/folder semantics remain intact.
