# Manga Blueprint Studio — User Guide

This guide describes the current shipped UI. It follows the manga-production flow rather than internal implementation names.

Product page: https://c-a-p-engineer.github.io/manga-blueprint-studio/

Public guide: https://c-a-p-engineer.github.io/manga-blueprint-studio/guide.html

Editor: https://c-a-p-engineer.github.io/manga-blueprint-studio/editor.html

The public root explains what Manga Blueprint Studio does. Actual manga authoring starts from the dedicated Editor entry above.

## The basic idea

Think of the editor as this hierarchy:

```text
作品
  → 必要なら 巻 / 章 / フォルダ
    → P001, P002, ...
      → ページ設定 / コマ割り
        → 各コマの人物・背景・文字・演出
          → AI生成ZIP
```

Volumes, chapters, and folders are optional. A short manga can simply be:

```text
作品
├─ P001
├─ P002
└─ P003
```

## First five minutes

1. Open or create a **作品**.
2. Choose the page from the row above the canvas. Pages are shown as `P001`, `P002`, ... .
3. Open **ページ設定** and choose manuscript size, reading direction, layout/Story Template/Smart Manga as needed.
4. Tap a panel and refine its panel shape, camera, characters, background, dialogue, and effects.
5. Open **出力** and download the **AI生成ZIP** for the current page.

## Screen layout

### 1. Application header

The top application header is for app-wide operations:

- **使い方** — quick help; from there the full guide can be opened.
- **元に戻す / やり直す** — Undo/Redo.
- **日本語 / English** — UI language.

On narrow mobile screens the header is deliberately **two rows**:

1. Manga Blueprint Studio + short explanation;
2. Help / Undo / Redo / language.

This prevents labels such as 「元に戻す」「やり直す」 from wrapping into awkward multi-line buttons.

The current work name is not mixed into these app-level actions.

### 2. Work / page context above the canvas

Below the app header, the current manga context is shown.

- the work title appears on its own line;
- tapping the work title opens **作品エクスプローラー**;
- the breadcrumb shows the current location, for example `第1巻 › 第3章 › P001`;
- `‹` / `›` switch pages;
- `＋` adds a page;
- the explorer shows saved works on the left and the selected work's page tree on the right; there is no separate 作品構成 button;
- the horizontal page strip lets you jump directly to another page.

### 3. Work Explorer / 作品エクスプローラー

**作品エクスプローラー** is the primary file-explorer-style navigation for works and pages.

```text
ロボ漫画
├─ 第1巻
│  ├─ 第1章
│  │  ├─ P001
│  │  └─ P002
│  └─ P003
└─ P004
```

Tap a work to switch works, or tap a page to open it. Page operations remain available as advanced controls. The dedicated 巻・章・フォルダ editor is not shown in the ordinary UI; legacy/imported nested containers still remain compatible.

### 4. Manga canvas

The center of the editor is the current manga page. Tap a panel, character, or balloon to select it.

Authoring-only labels and guides may be visible in the editor, but the clean AI PNG removes authoring metadata.

### 5. Editing tabs

The lower tabs edit the current page/panel rather than changing which work you are in.

#### ページ設定

Use for page-wide configuration:

- manuscript/canvas size;
- panel reading direction;
- page-wide art direction;
- panel layout;
- Story Template / Smart Manga starting patterns;
- page-level overview/checks.

**ページ設定 is not the primary page navigator.** Page selection lives above the canvas and in 作品エクスプローラー.

#### コマ

Use for the selected panel:

- story role / action intent;
- camera distance, angle, and viewpoint;
- focal/composition notes;
- frame style, breakout, and bleed where compatible;
- **コマ形状 / Panel shape**;
- support/motion/depth semantics where available.

#### キャラ / 背景 / 文字 / 演出 / 出力

- **キャラ** — reusable character identity and panel-specific pose/expression/gaze/placement.
- **背景** — location, time, weather, mood, detail amount, background treatment.
- **文字** — balloons/dialogue and writing direction.
- **演出** — line effects and SFX/onomatopoeia.
- **出力** — AI handoff and review packages.

Current export is **the selected page only**.

## Page names and P001

`P001`, `P002`, ... are display codes for humans and file sorting. The actual project stores numeric `pageNumber`.

```text
pageNumber 1   → P001
pageNumber 8   → P008
pageNumber 42  → P042
pageNumber 123 → P123
```

A page title is optional. The page code remains the visible locator even when the title is blank.

## Panel layouts and shaped panels

Prototype 0.16.0 adds real editable irregular panel geometry.

### Irregular layout templates

In **ページ設定 → コマ割り**, the layout list includes:

- **斜め3コマ** — upper two panels + lower large panel using slanted quadrilateral frames;
- **斜め4コマ 2×2** — a 2×2 rhythm with alternating slanted frames.

These are not decorative overlays. Applying them creates actual editable panel boundaries.

### Change one panel's shape

Select a panel, open the **コマ** tab, then use **コマ形状**.

Available presets:

- 長方形;
- 斜め（左へ流す）;
- 斜め（右へ流す）;
- 台形（左を絞る）;
- 台形（右を絞る）;
- カスタム四角形.

### Edit all four corners directly

Press **四隅を直接編集**. Four blue handles appear on the selected panel. Drag each handle independently.

The editor accepts only usable convex quadrilaterals. A move is rejected when it would create a self-intersection, almost-zero area, or unusably short edge.

Important current behavior:

- rectangle-only old projects remain compatible;
- irregular panels keep a rectangular bounding box internally for compatibility, but the four-point boundary controls the visible border, hit area, clipping, clean PNG, and AI render brief;
- irregular panels currently disable **断ち切り** rather than pretending rectangular bleed rules work on a slanted edge;
- resetting the shape to **長方形** uses the current bounding box;
- splitting an irregular panel currently creates rectangular child panels from its bounding box;
- arbitrary 5+ point polygons, curved borders, snapping, and linked neighboring-edge dragging are not shipped yet.

## Works, volumes, chapters, and folders

A **作品 / Work** is one manga project and is stored locally in IndexedDB.

Optional containers are:

- **巻 / Volume** — volume-level grouping;
- **章 / Chapter** — chapter/episode grouping;
- **フォルダ / Folder** — neutral organization.

A page can remain directly under the work. Deleting a non-empty container does not silently delete its pages.

## Story Template vs Smart Manga

### Story Template

**ストーリーテンプレート / Story Template** is the single canonical template feature name.

Use it for recognizable story/beat patterns such as confession, reaction, battle opening, counterattack, gag failure, or character introduction. Browsing/searching does not mutate the current page; only explicit apply changes it.

テンプレートは**カードを選ぶだけ**で選択されます。以前の重複した「ストーリーテンプレート」ドロップダウンは表示しません。カードには、そのテンプレートで使う主な演出がチップで表示されます。

ストーリーテンプレートは **ページ設定 → コマ割り** の上段フローに統合されています。カードを選ぶとコマ割り・カメラ・演出が決まり、**「サンプルのセリフ・効果音を使う」** のチェック有無でテンプレート内のセリフ/SFXを入れるか決めます。そのまま使用キャラクターを選び、常に見える **「このテンプレートを使う」** で適用します。独立した中段のストーリーテンプレート欄はありません。

クイック絞り込みでは、1人表示 / 2人表示 / 恋愛 / バトルなどに加えて、次の演出からサンプルを探せます。

- **演出あり / 演出なし** — 演出を使った例と素の構成を比較;
- **斜めコマ**;
- **衝撃枠 / 枠無し / 小窓**;
- **集中線 / スピード線 / 衝撃線 / 緊張線 / 無音・間**;
- **ブチ抜き**.

異なるグループの条件は組み合わせられるため、たとえば **2人表示 + 集中線**、**斜めコマ + 衝撃枠** のように絞れます。`突進→一撃`、`連続攻防`、`衝撃の発見`、`不穏な接近`、`静かな余韻`、`ツッコミ小窓` など、演出を試すための具体例も用意されています。

### Smart Manga

Smart Manga proposes a small set of bounded alternatives from purpose, panel count, seed, emphasis, and intensity. It also remains non-mutating until explicit apply.

## Character Sheet is optional

A reusable base character can use one of three appearance modes:

- **Character Sheet** — attach the external sheet when generation requires it;
- **文章で指定** — text appearance guidance; no sheet required;
- **AIにおまかせ** — downstream model chooses a simple consistent appearance.

新規作品には、編集可能な汎用ベースとして **高校生男子 / 高校生女子 / 成人男性 / 成人女性 / モブ男性 / モブ女性** の6人が最初から入ります。全員「文章で指定」方式で、髪・目・服装まで初期値があります。高校生は長袖シャツ/ブラウス＋ブレザー等の学校制服、成人・モブは長袖トップス＋ロングパンツ等の通常着を明示しています。名前・容姿・服装は自由に変更できます。既存作品や読み込んだ作品へは勝手に追加せず、**キャラ → かんたん追加** から必要なものだけ追加できます。

The stick figure is a **pose and placement reference**, not the character's finished appearance or clothing state. AI handoff explicitly tells the renderer not to interpret stick figures as unclothed bodies; explicit outfit guidance has priority.

## Reading direction and writing direction

### Page/panel reading direction

- `rtl` — Japanese manga: right to left.
- `ltr` — left to right.

This controls panel numbering and reading order.

### Text writing direction

- `vertical-rl` — vertical Japanese; default.
- `horizontal-tb` — horizontal.

Changing writing direction never changes panel reading order.

## Camera and art direction

Professional camera terms may remain for interoperability, but Japanese UI should explain them. Examples:

- **Extreme close / 超寄り** — isolate face/eyes/hand/fist.
- **Long / 引き** — show full body and surroundings.
- **Low angle / あおり** — emphasize power/impact.
- **High angle / ふかん** — show vulnerability or spatial overview.

Art direction includes color mode, rendering style, line style, shading, detail, background finish, palette/tone, and **追加の画風・仕上げ指示（任意）**.

Art direction controls how the manga is drawn. It does not replace character identity or panel geometry.

## AI handoff

### AI generation ZIP

Use this for image generation. It contains:

```text
<prefix>_clean.png
<prefix>.manga.json
<prefix>_prompt.txt
<prefix>_manifest.json
```

The manifest is the read-first authority. The package excludes annotated review PNG.

For quadrilateral panels, both the clean PNG and render brief carry the same four-point boundary. The downstream renderer must preserve those authored boundaries exactly; the Design Direction Pass may improve emphasis **inside** them but cannot reshape them.

Typical handoff message:

```text
このZIPを展開して、最初に中の *_manifest.json を読んで、その内容に従って漫画を生成してください。
Character Sheet が必要と書かれているキャラクターは、別途添付した Character Sheet 画像を対応付けて使ってください。
```

### Review/archive ZIP

Use this for checking/storage. It contains the same state-linked materials plus annotated PNG. The annotated PNG is not the default generation input.

## Current limitations / not shipped yet

The following remain roadmap work:

- full work backup/restore ZIP;
- selected-page-range / volume / whole-work generation export;
- panel-first generation packages and deterministic page recomposition;
- arbitrary polygon/curved panels and linked shared-boundary editing;
- generalized cross-page reference assets;
- expanded spatial continuity, perspective, eye-flow, gutter, spread, and deterministic final typesetting.

## Troubleshooting

### The mobile header buttons wrap onto multiple lines

Prototype 0.16.0 uses a two-row mobile header. If an old one-row layout remains after deployment, reload the latest page; entrypoint/runtime URLs are versioned to reduce stale-cache mixing.

### I cannot find another page

Use the page strip above the canvas or open **作品エクスプローラー**.

### I do not need volumes or chapters

Do not create them. Put pages directly under the work.

### The generated image copied labels from the editor

Use the **AI generation ZIP / clean PNG**, not the annotated review PNG.

## Documentation / technical links

- Documentation map: [`README.md`](README.md)
- Product contract: [`PRODUCT.md`](PRODUCT.md)
- Architecture: [`ARCHITECTURE.md`](ARCHITECTURE.md)
- AI handoff contract: [`PROMPT_HANDOFF.md`](PROMPT_HANDOFF.md)
- Roadmap: [`ROADMAP.md`](ROADMAP.md)
- Schema: [`../schema/manga-blueprint.schema.json`](../schema/manga-blueprint.schema.json)

## Prototype 0.17.0: テンプレートから始める

ページ設定では、まず **テンプレートからページを作る** の流れを使うのが最短です。

1. Story Templateカードを選ぶ。
2. **サンプルのセリフ・効果音を使う** のチェックで、テンプレートの台詞/SFXを入れるか決める。
3. 使用するキャラクター（必要なら2人目）を選ぶ。
4. **このテンプレートを使う** を押す。

これでコマ割り・演出・必要なサンプル台詞を現在ページへまとめて適用できます。直接コマ割りを編集したい場合だけ **手動でコマ割りを調整** を開きます。旧「巻・章・フォルダ」編集欄はページ設定には表示せず、作品名から開く **作品エクスプローラー** をページ移動・作品切替の主経路にします。

## コマ割り文法：余白を増やさず、大小で見せる

Prototype 0.18.0 では、斜めコマを「各コマを別々に傾ける」方式から、隣り合うコマが**細い共有斜線**を持つ方式へ変更しました。これにより斜め枠の間に大きな白いV字・十字の余白ができにくくなります。

ページ設定のコマ割りでは次を使えます。

- **対比2コマ（斜め）**: Before/After、対比、対峙
- **対向3コマ（斜め）**: 上2コマで圧を作り、下の大ゴマで決める
- **ジグザグ4コマ**: 上下で斜線を反転し、高速な攻防を送る
- **段違い4コマ**: 均等2×2ではなく左右の幅を変え、会話・リアクションにメリハリを作る
- **溜め→大ゴマ 4コマ**: 状況→細部→反応→大きな決め
- **ディテール→大ゴマ 5コマ**: 小さな観察を積んでから大きく発見を見せる

Story Template もこの文法へ整理されています。たとえば `怒り爆発` / `一撃必殺` は対向3コマ、`反撃` / `連続攻防` はジグザグ4コマ、日常会話や軽いリアクションは段違い4コマ、告白・覚醒・キャラ登場は溜め→大ゴマを基準にします。静かな余韻や親密な場面では、斜め枠を乱用せず安定した長方形レイアウトを残します。

旧 **斜め3コマ / 斜め4コマ 2×2** を含む既存データは読み込めます。旧IDも新しい細い共有斜線の形で表示されます。

## 差し込みコマと短い編集パネル

### ページ設定

ページタブでは、長い設定を一列に並べず **テンプレート / 原稿設定 / 手動コマ割り** を切り替えます。Story Templateから始めるときはテンプレート、原稿サイズや読み方向は原稿設定、直接コマを割るときだけ手動コマ割りを開きます。

### コマ設定

選択中コマの概要は常に見えます。その下の **内容・役割 / カメラ / 枠・形状** は必要なところだけ開閉できます。

### 差し込みコマ

親にしたい通常コマを選び、**コマ → 枠・形状 → ＋ 差し込みコマ** を押します。P0では右上へ中サイズの差し込みコマを1つ作成します。作成後はその小コマが選択され、通常のコマと同じくキャラ・背景・文字・演出・カメラを編集できます。

- 差し込みコマの中へさらに差し込みは作れません。
- 子コマを削除すると子だけ消えます。
- 親コマを削除するときは確認後、子コマも一緒に削除されます。
- P0では親子関係があるコマの分割はできません。
- 枠タイプの **小窓風枠** は見た目だけの枠で、実際の差し込みコマとは別機能です。
