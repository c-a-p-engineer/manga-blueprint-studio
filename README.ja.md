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

## 人間とAIが同じ漫画知識を使う

漫画の基本、ページサイズ、媒体別のおすすめ、ジャンル別の演出傾向、「寄り」「引き」「あおり」「俯瞰」「断ち切り」「ブチ抜き」などの用語は、[`docs/MANGA-KNOWLEDGE.md`](docs/MANGA-KNOWLEDGE.md) を共有知識の正本として整理しています。

- 人間 → 公開[漫画演出ガイド](https://c-a-p-engineer.github.io/manga-blueprint-studio/techniques.html)を見て技法を選び、そのまま「寄って」「最後は大ゴマ」「ブチ抜きにして」と指定できる。
- AI → 同じ知識を読み、媒体・ジャンル・Beat目的・重要度・視線・動きから技法候補を選ぶ。
- 実装 → [`core/manga-knowledge.mjs`](core/manga-knowledge.mjs) の機械可読subsetをSolver/Agentから利用できる。
- 画像生成 → 技法名をそのまま投げるのではなく、カメラ・Attention・Motion・Contactなど観測可能な制約へ変換する。

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

公開ガイドは以下をカテゴリ別に説明します。

- 漫画の基本
- ページサイズと印刷用語
- 紙 / Webページ / 縦スクロール / SNS短編の媒体別おすすめ
- アクション / コメディ / 恋愛 / ホラー / ミステリー / 日常 / スポーツ / ドラマの技法傾向
- 大ゴマ / 小ゴマ / 斜めコマ / 断ち切り / ブチ抜き / 小窓
- 視線誘導 / カメラ / 時間 / アクション / 吹き出し / ページ演出
- 寄り / 引き / あおり / 俯瞰 / 真俯瞰 / 前景 / 余白 / ノド / トンボ等の専門用語
- 人間の指定をAI Name DSL・Solver・画像生成プロンプトへどう翻訳するか

→ [漫画演出ガイド](https://c-a-p-engineer.github.io/manga-blueprint-studio/techniques.html)

## 技術構成

- JavaScript ES Modules / Node.js — compiler, solvers, renderer, CLI
- TypeScript + Vite — Web client/build
- SVG — Clean/Annotatedの共通空間表現
- JSON Schema — canonical `manga-blueprint/0.2`
- IndexedDB — Web作品のローカル保存

Pythonはコア実行に必須ではありません。

## AIエージェントから使う

AI/Coding Agentは最初に [`AGENTS.md`](AGENTS.md) を読み、Blueprint作成タスクでは [`.agents/skills/manga-blueprint/SKILL.md`](.agents/skills/manga-blueprint/SKILL.md) を使用してください。AIは `docs/MANGA-KNOWLEDGE.md` を読んで媒体・用語・ジャンル・演出意図を理解し、意味をName DSLへ記述してCompiler/Solverに幾何を解決させます。

## ドキュメント

- [`docs/MANGA-KNOWLEDGE.md`](docs/MANGA-KNOWLEDGE.md) — 人間＋AI共有の漫画知識
- [`docs/MANGA-TECHNIQUES.md`](docs/MANGA-TECHNIQUES.md) — 漫画演出の技法リファレンス
- [`docs/BLUEPRINT-ENGINE.md`](docs/BLUEPRINT-ENGINE.md) — headless compiler
- [`core/name-schema.md`](core/name-schema.md) — AI Name DSL
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
