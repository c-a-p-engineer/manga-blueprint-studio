# Page 1: 廃墟の決闘
@layout: hero-bottom
@background: 崩れた都市の広場、瓦礫と折れた柱
@time: day

コマ1: 剣士Aと剣士Bが瓦礫の広場で間合いを取り、互いに正面から対峙する
登場: fighter-a@left, fighter-b@right
ポーズ: fighter-a> low-guard-ready
ポーズ: fighter-b> forward-guard-ready
視線: fighter-a> fighter-b.face
視線: fighter-b> fighter-a.face
前後: fighter-a> foreground
前後: fighter-b> background
カメラ: long low-angle
強調: normal

コマ2: 剣士Aが地面を蹴って一気に踏み込み、剣士Bも迎撃の斬撃を振り抜く
登場: fighter-a@left, fighter-b@right
境界: diagonal-right
ポーズ: fighter-a> explosive-lunge-two-handed-sword
ポーズ: fighter-b> counter-slash-twisting-torso
視線: fighter-a> fighter-b.chest
視線: fighter-b> fighter-a.weapon
支持: fighter-a> grounded
支持: fighter-b> grounded
動作段階: fighter-a> launch
動作段階: fighter-b> impact
接触: fighter-a.sword > fighter-b.sword
カメラ: medium dutch-angle
効果音: ギィン
演出: impact speed
強調: strong

コマ3: 激突した剣越しに剣士Aの鋭い目を極端なアップで捉える
登場: fighter-a@center
インセット: parent panel 2 top-right small
ポーズ: fighter-a> braced-after-clash
視線: fighter-a> fighter-b.face
カメラ: extreme-close dutch-angle
演出: tension
強調: strong

コマ4: 剣士Aが剣士Bの防御を弾き、全身をひねった大きな横薙ぎを放つ。剣士Bは後方へ体勢を崩す
登場: fighter-a@left, fighter-b@right
コマサイズ: dominant
境界: diagonal-left
ポーズ: fighter-a> full-body-power-horizontal-slash-wide-stance
ポーズ: fighter-b> recoiling-off-balance-guard-broken
視線: fighter-a> fighter-b.torso
視線: fighter-b> fighter-a.sword
前後: fighter-a> foreground
前後: fighter-b> background
支持: fighter-a> grounded
支持: fighter-b> supported
動作段階: fighter-a> impact
動作段階: fighter-b> recovery
カメラ: long low-angle
効果音: ズバッ
演出: impact speed focus
強調: climax
