# 漫画演出辞典 — Manga Direction Dictionary

人間が読んで「こういう見せ方があるのか」と探せて、AIも同じ語彙を演出意図・Executable Name・生成プロンプトへ変換するための辞典です。

> **技法は目的ではなく手段。** 人間が技法を指定した場合はその指定を優先し、指定がない場合だけAI/Solverが目的から候補を選びます。

## 正規情報源 / Single Source of Truth

機械可読な技法ID・カテゴリ・効果・意味・媒体制約・相性・競合は **`core/manga-knowledge.mjs` が唯一の正規情報源**です。

- Core / Solver / Agent は `core/manga-knowledge.mjs` を読む。
- 公開 `/dictionary.html` も同じmoduleを直接importして描画する。
- このMarkdownは人間向けの解説・ニュアンス・用例を担当する。ここに新しい機械語彙だけを先行追加しない。
- `web/dictionary-data.js` のような独立した技法データコピーは正規情報源として扱わない。
- 新しい技法を追加するときは **Coreへ追加 → 公開辞典で露出確認 → 必要ならこの文書へ長文解説を追加** の順にする。

これにより「Web辞典にはあるがAIは知らない」「AI/Solverにはあるが人間向け辞典に出ない」というP8の同期問題を防ぎます。

## 使い方

- **人間:** 公開辞典で「迫力」「恐怖」「reveal」「scroll」などを検索し、技法IDまたは日本語名を指定できます。
- **AI:** `目的 → 読ませる時間 → 注目点 → カメラ/構図 → 技法 → 絵柄` の順に解釈します。
- **プロンプト:** 技法名だけでなく、`semantic` にある画像として観測できる結果へ展開します。

## 代表語彙

### カメラ
- `closeup` — 寄り。感情・注目・情報へ集中。
- `extreme-closeup` — 超寄り。周辺情報を切り、目・手・小物などへ集中。
- `wide-shot` — 引き。人物と環境の空間関係を示す。
- `low-angle` — あおり。スケールや圧力を強める。
- `high-angle` — 俯瞰。位置関係や孤立を示す。
- `dutch-angle` — 傾き。不安定さや異常感。
- `pov` — 主観。登場人物視点への没入。

### 構図
- `foreshortening` — 誇張パース・短縮法。
- `extreme-foreground` — 極端な前景。
- `negative-space` — 余白。

### コマ
- `hero-panel` — 大ゴマ。
- `small-panel` — 小ゴマ。
- `diagonal-panel` — 斜めコマ。
- `detail-inset` — 小窓。
- `bleed` — 断ち切り。
- `character-breakout` — ブチ抜き。
- `stable-grid` / `grid-break` — 規則とその破壊。

### 遷移・時間
- `moment-to-moment` — 瞬間→瞬間。
- `action-to-action` — 動作→動作。
- `aspect-to-aspect` — 側面→側面。
- `reaction-shot` / `insert-shot` / `match-cut` / `montage`。
- `ellipsis` — 省略。
- `pause` — 間。
- `decompression` — 時間の引き伸ばし。
- `accelerando` — 加速。

### 動き
- `anticipation` → `contact-focus` → `follow-through` — 予備・接触・結果。
- `motion-lines` — 速度線。
- `focus-lines` — 集中線。
- `afterimage` — 残像。
- `impact-flash` — インパクトフラッシュ。

### 視線・心理
- `attention-control` — 視線・ジェスチャー・画面フローの整合。
- `progressive-reveal` — 段階的開示。
- `cropped-information` — 情報欠落。
- `misdirection` — ミスディレクション。
- `background-dropout` / `symbolic-background` — 心理背景。

### 媒体固有
- `page-turn-reveal` / `spread` — ページ媒体。
- `scroll-delay` / `viewport-reveal` / `continuous-vertical-pan` / `long-fall` — 縦スクロール。

## AI翻訳ルール

人間の「敵が出た瞬間をもっと怖く。いきなり全部見せない。最後だけ大きく。」は、単に技法名を列挙せず、たとえば `progressive-reveal + cropped-information + negative-space + hero-panel` の候補へ分解します。ページ媒体なら `page-turn-reveal`、縦スクロールなら `scroll-delay + viewport-reveal` を媒体制約に応じて選びます。

AIは最終プロンプトで、技法IDを観測可能な指示へ変換します。例: `Do not reveal the full antagonist immediately. Show a cropped partial silhouette before the final dominant reveal.`

## 運用ルール

1. 人間が明示した技法は保持する。
2. 未指定部分だけ目的から推薦する。
3. ジャンルは候補の偏りであり規則ではない。
4. 絵柄と構図を混同しない。
5. 媒体固有技法は `requires` を守る。
6. 重要度とコマサイズを同一視しない。
7. Promptでは観測可能な結果を書く。
8. Clean geometryをPromptで冗長に再定義しない。

## 関連

- `core/manga-knowledge.mjs` — **canonical machine-readable knowledge**
- `docs/MANGA-KNOWLEDGE.md` — Knowledge設計
- `docs/MANGA-EXPRESSION-CATALOG.md` — 収集・研究カタログ
- `docs/MANGA-TECHNIQUES.md` — 技法解説
- `web/dictionary.html` — Core直結の検索辞典
- `web/techniques.html` — 学習用ガイド
