# 漫画演出辞典 — Manga Direction Dictionary

人間が読んで「こういう見せ方があるのか」と探せて、AIも同じ語彙を演出意図・Executable Name・生成プロンプトへ変換するための辞典です。

> **技法は目的ではなく手段。** 人間が技法を指定した場合はその指定を優先し、指定がない場合だけAI/Solverが目的から候補を選びます。

## 使い方

- **人間:** 「もっと迫力」「ここは寄り」「一拍置きたい」などから該当項目を探し、その名称をそのまま指定できます。
- **AI:** `目的 → 読ませる時間 → 注目点 → カメラ/構図 → 技法 → 絵柄` の順に解釈します。
- **プロンプト:** 技法名だけでなく、画像として観測できる結果に言い換えます。

各項目は `意味 / 効果 / 向く場面 / 注意 / AIへの言い方` を基本形とします。

---

# 1. カメラ距離

## 寄り / Close-up
**意味:** 被写体を画面内で大きく見せる。  
**効果:** 表情、感情、手元、重要物へ注意を集中。  
**向く:** 感情、決意、発見、重要なディテール。  
**注意:** 位置関係は分かりにくくなる。  
**AI:** `close framing; subject occupies most of the panel; primary attention on the face`

## 超寄り / Extreme close-up
**意味:** 目・口・指・武器など一部分を極端に拡大。  
**効果:** 緊張、執着、重要情報の強調。  
**AI:** `extreme close-up of the eye; crop surrounding information`

## 中景 / Medium shot
**意味:** 表情と身体動作を両方読める距離。  
**効果:** 会話・通常動作の読みやすさ。  
**AI:** `medium shot; preserve gesture and facial readability`

## 引き / Long shot
**意味:** 全身と周囲を広く見せる。  
**効果:** 場所、距離、人数、戦闘位置の理解。  
**AI:** `wide/long shot; show full bodies and spatial relationship`

## 大遠景 / Extreme long shot
**意味:** 人物より環境を主役にするほど引く。  
**効果:** スケール、孤独、場所の導入。  
**AI:** `extreme wide establishing shot; environment dominates`

---

# 2. カメラ角度・レンズ感

## アイレベル
目線程度の高さ。中立的で状況を読みやすい。

## あおり / Low angle
下から見上げる。巨大さ、威圧、英雄性、勢いを作りやすい。効果は文脈依存。

## 俯瞰 / High angle
上から見下ろす。位置関係、孤立、状況把握に向く。

## 真俯瞰 / Bird's-eye
ほぼ真上。地図的な位置関係、群衆、倒れた人物などに強い。

## ダッチアングル / Dutch angle
水平線を傾ける。不安定、異常、速度感。常用すると効果が薄れる。

## 主観 / POV
登場人物の視点をカメラにする。没入、恐怖、発見、対面に向く。

## 肩越し / Over-the-shoulder
手前人物の肩・頭を入れて相手を見る。会話の位置関係と対立を維持する。

## 魚眼 / Fisheye
強い広角歪み。近距離の圧迫、異常感、コミカルな誇張。

## 圧縮遠近 / Telephoto compression
前後距離を詰まって見せる。群衆、追跡、逃げ場のなさに使える。

## 誇張パース / Exaggerated perspective
近い部分を巨大に、遠い部分を急激に小さくする。拳、足、武器、突進を強調。

## 短縮法 / Foreshortening
身体や物体を視線方向へ向け、奥行き方向に短く見せる。攻撃や飛び出しに有効。

---

# 3. 構図・空間

## 前景・中景・背景
奥行きを三層以上に分ける基本。前景を大きく置くと立体感が強くなる。

## 極端な前景 / Extreme foreground
手、武器、物体などを画面手前で巨大にする。迫力と奥行き。

## ネガティブスペース / 余白
意図的な空白。孤独、静けさ、不安、視線誘導、文字スペース。

## シルエット構図
輪郭だけでも動作・人物関係が読めるようにする。アクションの可読性に重要。

## フレーム・イン・フレーム
窓、扉、鏡、柵などを画面内の第二の枠として使う。閉塞、覗き見、対象の限定。

## 対称構図
左右などを揃える。静けさ、儀式性、対峙。崩した瞬間も強い。

## 非対称構図
重心をずらし、動きや緊張を作る。

## 中央構図
対象を中央に固定。正面性、威圧、象徴性。連発すると単調。

## クロッピング
人物や物を意図的に画面外で切る。情報制限、近さ、速度、巨大さ。

---

# 4. コマ・枠

## 大ゴマ / Hero panel
相対的に大きなコマ。決め絵、登場、感情、景観、長いhold。`重要 = 必ず大` ではない。

## 小ゴマ
細かな反応、短い瞬間、ディテール。連続するとテンポを速く感じさせやすい。

## 斜めコマ
枠線を傾ける。方向性、衝突、不安定さ。動作ベクトルとの整合が重要。

## 断ち切り / Bleed
絵を仕上がり線まで伸ばす。空間がページ外へ続く感覚。

## ブチ抜き / Breakout
人物・物体がコマ枠を越える。存在感、連続動作、必殺技、登場。

## 小窓 / Inset
小さなコマを重ねる。目、手、時計、反応など同時刻の補足。

## 枠なし / Borderless panel
枠線を消す。回想、夢、余韻、広がり。周囲との境界が曖昧になる。

## オーバーラップコマ
コマ同士を重ねる。同時性、割込み、記憶、強い関連。

## グリッド / Stable grid
規則的な矩形配置。会話、日常、説明、コメディsetupなどの基準面。

## グリッド破壊 / Grid break
規則配置を続けた後に大ゴマ・斜め・越境で崩す。変化そのものが強調になる。

## 見開き / Spread
左右2ページを一画面として使う。景観、クライマックス、大人数。ノドに重要情報を置かない。

---

# 5. コマ間の編集・遷移

## Moment-to-moment / 瞬間→瞬間
ほぼ同じ場面の微小な時間変化。目を開く、手が少し動く。時間を引き伸ばす。

## Action-to-action / 動作→動作
同じ主体の連続行動。構える→振る→当たる。アクションの因果が読みやすい。

## Subject-to-subject / 主体→主体
同じ場面で人物A→人物Bなど対象を切り替える。会話・対峙。

## Scene-to-scene / 場面→場面
時間・場所を大きく飛ぶ。翌日、別都市、過去など。

## Aspect-to-aspect / 側面→側面
同じ場・時間の空、時計、手、雨、看板などへ視線を移す。雰囲気、静けさ、時間感覚を作る。

## Non-sequitur / 非連続
論理的連続が弱い画像を接続。夢、実験表現、不条理。

## リアクションカット
出来事そのものではなく、それを見た人物へ切る。出来事の大きさを反応で伝える。

## インサート / Insert
鍵、スマホ、目、指など重要ディテールへ一時的に切る。

## マッチカット的接続
形、方向、姿勢、意味が似た二つの絵を連続させる。時間・場所を跨いでも滑らかに接続。

## モンタージュ
複数の短い場面を連ね、訓練・移動・作業・時間経過などを圧縮。

## 省略 / Ellipsis
途中を描かず結果へ飛ぶ。速度、驚き、読者による補完。

## 反復フレーム / Repeat frame
ほぼ同じ構図を繰り返し、一部分だけ変える。沈黙、ギャグ、違和感、時間経過。

---

# 6. 時間・テンポ

## 間 / Hold
読者を意図的に留める時間。余白、大きさ、無言、情報量の少なさなどで作る。

## Decompression / 時間の引き伸ばし
一瞬を多数のコマへ分解。緊張、恋愛、決定的瞬間、ホラー。

## Compression / 時間圧縮
長い出来事を少数コマやモンタージュで処理。

## Accelerando / 加速
コマを細かく、変化を短く連続させてテンポを上げる。

## Decelerando / 減速
コマを広げ、余白や静止を増やして時間を伸ばす。

## 同時進行 / Parallel action
二地点の行動を交互に見せる。接近、競争、救出、サスペンス。

## ページめくりReveal
右ページなどで情報を抑え、次ページで答えを見せる。紙/ページ媒体固有の強み。

---

# 7. 動き・アクション

## 予備動作 / Anticipation
攻撃前に身体を引く、踏み込む。次の動作を読みやすくし、威力を増す。

## 接触 / Impact
拳、剣、足などが接触する瞬間。接触点を曖昧にしない。

## フォロースルー
攻撃後の身体・髪・服・武器の流れ。力の方向を伝える。

## リアクション
吹き飛ぶ、よろめく、顔が動くなど結果を見せる。

## 速度線 / Motion lines
移動方向に沿う線。速度とベクトル。

## 集中線 / Focus lines
一点へ収束する線。注目と衝撃。

## 残像 / Afterimage
同一人物・物体の過去位置を薄く/複数描く。高速移動。

## 多重像 / Multiple exposure
複数の姿勢を一画面に置き、連続動作を表す。

## インパクトフラッシュ
衝突瞬間に白/黒/高コントラストへ一時的に飛ばす。瞬間の断絶。

## 軌跡 / Motion arc
武器や腕の移動経路を弧・帯で示す。

## 予備→接触→結果
物理因果を明確にする基本三段階。全部を必ず描く必要はない。

---

# 8. 視線・情報制御

## 視線誘導 / Eye-flow guidance
顔の向き、視線、手、武器、吹き出し、枠線などを使って次の注目点へ導く。

## Leading line / 誘導線
道路、腕、剣、背景線などを視覚的な矢印として使う。

## Gaze chain / 視線の連鎖
AがBを見る→Bが物を見る、のように人物視線を連結。

## Entry / Exit
一つのコマの視線出口を次コマの入口へ近づける。

## Reveal / 情報開示
最初は隠し、後で見せる。恐怖、謎、驚き、オチ。

## Progressive reveal / 段階的開示
輪郭→一部→全体のように複数Beatで情報を増やす。

## Cropped information / 情報欠落
意図的に顔、敵、物体の一部を見せない。読者に補完させる。

## Misdirection / ミスディレクション
注意を別の対象へ向けてから本命を開示。ミステリー、ホラー、ギャグ。

---

# 9. 心理・感情の画面処理

## 背景消失 / Background dropout
現実背景を消し人物だけにする。感情・発言・内面を優先。

## ベタ背景
黒面を強く使う。重圧、恐怖、決意、夜など。意味は文脈依存。

## 白背景
情報を削ぎ、静寂、衝撃、孤独、純化。

## 心象背景 / Symbolic background
花、光、ひび、渦、炎、雨など現実でない背景で心理を可視化。

## メタファー挿入 / Metaphoric insert
氷が割れる、花が散る等、出来事を象徴画像へ置換/併置。

## デフォルメ切替
通常頭身からSD・誇張顔へ急変。ギャグ、照れ、感情の即時伝達。

## 顔の陰影落とし
目元などを暗くする。表情を隠す、怒り、不穏。過剰な固定意味にしない。

## 無表情反復
同じ表情を保ち周囲だけ変える。乾いたギャグ、恐怖、異常性。

---

# 10. 文字・吹き出し・SFX

## 吹き出し配置
文字も視線誘導装置。読み順に沿って配置し、顔や重要動作を塞がない。

## 吹き出しサイズ差
声量・重要性・間を視覚化。ただし台詞量との可読性を優先。

## 枠外台詞 / Off-panel speech
話者を見せず声だけ入れる。登場予告、距離、情報先行。

## 描き文字 / SFX
音だけでなく形・大きさ・傾き・位置が画面構成になる。

## SFX越境
効果音を複数コマ/枠へ跨がせ、連続する衝撃や大音量を示す。

## 無言コマ
文字を完全に抜く。読者の観察時間を作る。

---

# 11. 縦スクロール固有

## Scroll delay
大きな縦余白を挟み、次情報へ到達するまでの指スクロールを時間として使う。

## Viewport reveal
一画面に同時表示されない距離へ答えを置き、スクロールで開示。

## Continuous vertical pan
縦長背景を連続させ、カメラが上下へパンするように見せる。

## Long fall
落下・高さ・巨大物を長い縦距離で体感させる。

## Tight-scroll burst
コマ間隔を狭め、短いBeatを連打して高速感を作る。

## Screen hold
スマホ画面の大部分/全体を一つの絵で占有し、強制的に注目時間を作る。

## Gutter SFX
コマ間の余白へ音を置き、前後Beatを接続する。

## Color-wash transition
背景色や光の帯を縦方向へ変化させ、時間・場所・感情の転換を滑らかにする。

---

# 12. 絵柄・レンダリング言語

絵柄は一語のpresetではなく、次の独立軸で考えるとAIにも伝わりやすい。

| 軸 | 例 |
|---|---|
| line | clean, rough, brush-ink, thin, heavy, variable |
| value | high-key, balanced, heavy-black, high-contrast |
| color | monochrome, limited-palette, full-color |
| shading | screentone, cel, hatching, cross-hatching, painterly |
| deformation | realistic, stylized, chibi/SD, exaggerated |
| texture | clean-digital, paper-grain, dry-brush, print-noise |
| background | realistic, simplified, symbolic, minimal |
| edge | crisp, soft, broken, ink-bleed |

## 劇画系
写実寄りの人体、強い陰影、太め/表情ある線、ベタやハッチング。緊張・重量感に向く。

## 少女漫画的装飾
繊細な線、目・髪・花・光・余白など心理装飾を積極利用。感情と関係性を画面へ拡張。

## 少年アクション系
明瞭なシルエット、誇張パース、強い動作線、接触、読みやすい高エネルギー構図。

## 青年リアル系
現実寄り比率、環境描写、抑えた表情、陰影。日常から重いドラマまで。

## 4コマ / Yonkoma
安定した反復枠を利用し、起承転結やsetup→punchlineの差を際立たせる。

## SD / Chibi
頭身を大きく下げ感情を記号化。ギャグ、補足、リアクション。

## セル塗り
明確な輪郭＋段階の少ない影。アニメ的な明快さ。

## 水彩
透明感、色のにじみ、柔らかな境界。回想、情緒、幻想。

## 墨絵 / Brush ink
筆圧、かすれ、余白、墨の濃淡を活かす。勢い、和風、抽象性。

## 鉛筆・ラフ
線の重なりや紙感を残す。親密さ、記憶、制作物感。

## ハッチング
線の密度・方向で陰影を作る。質感、重量、古典的印刷感。

## レトロ印刷
網点、版ズレ、限定色、紙ノイズ。古い雑誌/コミック印刷の質感。

## コラージュ
写真、紙、文字、異質素材を混成。実験、夢、不穏、メタ表現。

## Painterly
筆致と色面を重視し、線画への依存を減らす。幻想・背景主導の画面に向く。

## フルカラーWebtoon
スマホ表示を前提に明瞭な色面、人物分離、縦方向の光/背景変化を活用。

---

# 13. ジャンルから逆引き

## アクション
候補: `誇張パース / 短縮法 / 斜めコマ / 速度線 / 接触 / 極端な前景 / 大ゴマ / action-to-action`

## 恋愛
候補: `寄り / 超寄り / gaze chain / aspect-to-aspect / 間 / 背景消失 / 心象背景 / 余白`

## ホラー
候補: `cropped information / progressive reveal / 余白 / ダッチアングル / repeat-frame / aspect-to-aspect / 黒面 / scroll delay`

## コメディ
候補: `stable grid / repeat-frame / reaction cut / 無言コマ / デフォルメ切替 / 急なサイズ差`

## ミステリー
候補: `insert / misdirection / establishing shot / cropped information / reaction cut / match-cut的接続`

## 日常
候補: `medium / stable grid / aspect-to-aspect / hold / establishing / 背景描写`

## スポーツ
候補: `引き / anticipation / foreshortening / impact / follow-through / motion arc / reaction`

## ドラマ
候補: `close-up / reaction / silence / background dropout / panel-size contrast / aspect-to-aspect`

---

# 14. やりたい効果から逆引き

| やりたいこと | 候補 |
|---|---|
| 迫力を出す | 誇張パース、極端な前景、あおり、斜めコマ、大ゴマ、短縮法 |
| 一瞬を長く感じさせる | moment-to-moment、decompression、間、aspect-to-aspect |
| 速くする | 小ゴマ連打、ellipsis、accelerando、速度線 |
| 静かにする | 余白、無言、背景消失、aspect-to-aspect、stable grid |
| 怖くする | 情報欠落、段階的開示、余白、反復、傾き、黒面 |
| 感情へ寄る | close-up、reaction、目/手のinsert、心象背景 |
| 場所を理解させる | 引き、大遠景、俯瞰、前中背景、establishing |
| 衝撃を作る | anticipation→impact、集中線、impact flash、急なサイズ差 |
| オチを強くする | stable setup、間、reaction、repeat-frame、ページ/scroll reveal |
| 読者を誘導する | gaze chain、leading line、entry/exit、吹き出し配置 |
| 巨大さを出す | あおり、極端な前景、人物とのスケール比較、縦長構図 |
| 孤独を出す | extreme long、negative space、小さな人物、静かなhold |

---

# 15. AI翻訳ルール

人間:

```text
敵が出た瞬間をもっと怖く。いきなり全部見せない。最後だけ大きく。
```

AI内部表現の例:

```yaml
purpose: reveal
emotion: fear
pacing:
  strategy: decompressed
attention:
  strategy: progressive-reveal
transition:
  - aspect-to-aspect
  - subject-to-subject
camera:
  progression: [detail, partial, close]
panel:
  final_emphasis: hero-panel
style:
  value: high-contrast
  background: minimal-to-dark
```

画像生成向けには技法名だけでなく観測可能な指示へ変換する:

```text
Do not reveal the full antagonist immediately. First show an environmental detail, then a cropped partial silhouette, then reveal the face/body in the final dominant panel. Increase negative space and dark value contrast before the reveal. Preserve the supplied panel geometry and reading order.
```

## 原則

1. 人間が指定した技法は保持する。
2. 指定がなければ目的から候補を選ぶ。
3. ジャンルはbiasであり命令ではない。
4. 絵柄と構図を混同しない。
5. 媒体固有技法を別媒体へ機械的に移植しない。
6. 重要度とコマサイズを同一視しない。
7. 技法名だけでなく、最終画像で観測可能な結果をPromptへ書く。
8. Cleanが持つ座標情報をPromptで冗長に再記述しない。

---

## 関連資料

- `docs/MANGA-KNOWLEDGE.md` — 漫画の基本・媒体・サイズ・AI reasoning contract
- `docs/MANGA-EXPRESSION-CATALOG.md` — 技法体系・収集カタログ
- `docs/MANGA-TECHNIQUES.md` — 主要技法の短いガイド
- `web/techniques.html` — 人間向け公開ガイド
- `core/manga-knowledge.mjs` — AI/Solver向け機械可読サブセット
