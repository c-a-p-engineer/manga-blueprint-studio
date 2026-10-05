# Page 1: 月下の紅眼剣姫
@layout: hero-bottom
@layout-seed: 42
@layout-mutation: 0.18
@background: 月夜の崩れた大聖堂跡、瓦礫、折れた石柱、風に舞う灰
@time: night

コマ1: 長い金髪と赤い瞳を持つ美少女剣士が、月明かりの廃墟で漆黒の鎧騎士と間合いを取り対峙する
登場: heroine@left, black-knight@right
ポーズ: heroine> calm-low-guard-one-handed-sword-cape-in-wind
ポーズ: black-knight> heavy-forward-guard-greatsword
視線: heroine> black-knight.face
視線: black-knight> heroine.face
前後: heroine> foreground
前後: black-knight> background
支持: heroine> grounded
支持: black-knight> grounded
カメラ: long low-angle
主注目: heroine.face
副注目: black-knight.silhouette
重要度: narrative=0.35, visual=0.55, transition=0.45
間: medium
視線入口: top-right
視線出口: left

コマ2: 漆黒の鎧騎士が右上から左下へ大剣を叩き込み、金髪赤目の少女剣士が紙一重で身を沈めてかわす
登場: heroine@left, black-knight@right
境界: diagonal-right
ポーズ: heroine> low-evasive-duck-side-step-sword-ready
ポーズ: black-knight> overhead-power-slash-forward-step
視線: heroine> black-knight.weapon
視線: black-knight> heroine.torso
支持: heroine> grounded
支持: black-knight> grounded
動作段階: heroine> approach
動作段階: black-knight> impact
カメラ: medium dutch-angle
主注目: black-knight.sword
副注目: heroine.face
効果音: ザンッ
演出: speed impact
重要度: narrative=0.55, visual=0.80, transition=0.85
間: low
視線入口: top-right
視線出口: bottom-left

コマ3: 金髪赤目の少女剣士の赤い瞳だけを極端なアップで捉え、敵の斬撃軌道を完全に見切った瞬間を示す
登場: heroine@center
インセット: parent panel 2 top-right small
ポーズ: heroine> still-focused-after-dodge
視線: heroine> black-knight.weapon
カメラ: extreme-close eye-level
主注目: heroine.face
演出: tension focus
重要度: narrative=0.40, visual=0.75, transition=0.70
間: high

コマ4: 少女剣士が踏み込む足を止めず、腰を落として剣を身体の後ろへ引き、反撃の一閃を溜める
登場: heroine@center
コマサイズ: small
ポーズ: heroine> anticipation-horizontal-counter-slash-coiled-stance
視線: heroine> black-knight.torso
支持: heroine> grounded
動作段階: heroine> anticipation
カメラ: close low-angle
主注目: heroine.right-hand
副注目: heroine.foot
演出: silence tension
重要度: narrative=0.35, visual=0.55, transition=0.90
間: medium
視線入口: right
視線出口: bottom-left

コマ5: 金髪が大きく翻る中、赤い瞳の少女剣士が画面を横断する超高速の横薙ぎを放ち、漆黒の鎧騎士を一撃で吹き飛ばす
登場: heroine@left, black-knight@right
コマサイズ: hero
境界: diagonal-left
断ち切り: bottom
ブチ抜き: character
ポーズ: heroine> full-body-explosive-horizontal-finishing-slash-wide-stance
ポーズ: black-knight> violent-recoil-guard-broken-airborne
視線: heroine> black-knight.torso
視線: black-knight> heroine.sword
前後: heroine> foreground
前後: black-knight> background
支持: heroine> grounded
支持: black-knight> airborne
動作段階: heroine> impact
動作段階: black-knight> recovery
カメラ: long low-angle
主注目: heroine.sword
副注目: heroine.face
効果音: ズバァッ
演出: impact speed focus
重要度: narrative=1.0, visual=1.0, transition=0.30
間: medium
視線入口: top-right
視線出口: bottom-left
