# Manga Blueprint Studio

[English](README.md) | **日本語**

**漫画の「どう見せるか」を、画像生成の前に決めるための人間＋AI共同設計ツール。**

Manga Blueprint Studio は、ネームの役割を人間とAIの両方が扱える **Executable Name（実行可能なネーム）** として再設計します。物語の意図からコマ割り、重要度、視線、カメラ、ポーズ、接触、文字領域までを構造化し、画像生成モデルへ渡せる空間設計とプロンプトを生成します。

> **人が監督。AIは補助。** AIの提案やSolverの結果は検査・編集でき、人間が指定した意図を黙って置き換えません。

## まず触る

- 公開ページ: https://c-a-p-engineer.github.io/manga-blueprint-studio/
- Webエディタ: https://c-a-p-engineer.github.io/manga-blueprint-studio/editor.html
- 漫画演出ガイド: https://c-a-p-engineer.github.io/manga-blueprint-studio/techniques.html
- 操作ガイド: https://c-a-p-engineer.github.io/manga-blueprint-studio/guide.html

## 何が違う？

一般的な画像生成では「漫画にして」という指示に、コマ割り・読み順・視線誘導・人物位置・接触・表示文字まで背負わせがちです。本プロジェクトでは責務を分離します。

```text
物語 / ネーム意図
  ↓
AI Name DSL
  ↓
Energy / Attention / Reading Flow
  ↓
Layout Candidate Solver
  ↓
Pose / Contact Solver
  ↓
Executable Name
  ├─ Clean SVG/PNG      → 画像生成用の空間契約
  ├─ Annotated SVG/PNG  → 人間レビュー用
  ├─ work.manga.json    → 意味の正本
  └─ Prompt             → 生成指示
```

## Blueprint Engine

Markdownベースの軽量Name DSLから、座標を手入力せず漫画ページをコンパイルできます。

```md
# Page 1: 決闘
@background: 崩れた都市の広場

コマ1: 二人の剣士が対峙する
登場: fighter-a@left, fighter-b@right
カメラ: long low-angle

コマ2: 同時に踏み込み、剣が激突する
登場: fighter-a@left, fighter-b@right
ポーズ: fighter-a> explosive-lunge-two-handed-sword
ポーズ: fighter-b> counter-slash-twisting-torso
接触: fighter-a.sword > fighter-b.sword
強調: strong

コマ3: 勝負を決める横薙ぎ
登場: fighter-a@left, fighter-b@right
強調: climax
```

```bash
npm install
npm run blueprint -- examples/combat-1p.md blueprint-out
```

固定入力に対して決定論的に、canonical JSON、Clean/Annotated blueprint、ページPrompt、manifestを生成します。PNGは利用可能なローカルrasterizerがある場合に追加生成します。

## 漫画技法を知らなくても使える

「断ち切り」「ブチ抜き」「斜めコマ」「視線誘導」「大ゴマ」「小窓」「間」「ページめくり」などを、単なる用語集ではなく **何のために使うか / いつ使うか / AIへ何を伝えるか** の形で説明する公開ガイドを用意しています。

→ [漫画演出ガイド](https://c-a-p-engineer.github.io/manga-blueprint-studio/techniques.html)

## 技術構成

- JavaScript ES Modules / Node.js — compiler, solvers, renderer, CLI
- TypeScript + Vite — Web client/build
- SVG — Clean/Annotatedの共通空間表現
- JSON Schema — canonical `manga-blueprint/0.2`
- IndexedDB — Web作品のローカル保存

Pythonはコア実行に必須ではありません。

## AIエージェントから使う

AI/Coding Agentは最初に [`AGENTS.md`](AGENTS.md) を読み、Blueprint作成タスクでは [`.agents/skills/manga-blueprint/SKILL.md`](.agents/skills/manga-blueprint/SKILL.md) を使用してください。人間向け座標入力を増やすのではなく、意味をName DSLへ記述しCompiler/Solverに解決させるのが基本方針です。

## ドキュメント

- [`docs/BLUEPRINT-ENGINE.md`](docs/BLUEPRINT-ENGINE.md) — headless compiler
- [`core/name-schema.md`](core/name-schema.md) — AI Name DSL
- [`docs/MANGA-TECHNIQUES.md`](docs/MANGA-TECHNIQUES.md) — 漫画演出の基礎
- [`docs/PRODUCT.md`](docs/PRODUCT.md) — 製品仕様
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — アーキテクチャ
- [`docs/PROMPT_HANDOFF.md`](docs/PROMPT_HANDOFF.md) — AI handoff
- [`docs/ROADMAP.md`](docs/ROADMAP.md) — Roadmap

## 開発

```bash
npm install
npm run typecheck
npm run build
npm run validate
```

## License

MIT
