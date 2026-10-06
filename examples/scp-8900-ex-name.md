<!-- Fanwork blueprint inspired by SCP-8900-EX "Sky Blue Sky" by tunedtoadeadchannel. -->
<!-- Source: https://scp-wiki.wikidot.com/scp-8900-ex -->
<!-- SCP Foundation content is licensed under CC BY-SA 3.0. -->
<!-- This example is intended to follow that share-alike requirement. -->

# Page 1: 異常発生
@layout: dialogue-stagger
@background: Foundation monitoring room / monochrome world
@time: day

コマ1: 財団の監視室。壁一面のモニターに灰色の街が映る。職員も街も空も木もすべて無彩色
登場: staff-a@right
importance: narrative=0.4, visual=0.4, transition=0.4
hold: medium
primary attention: monitor.wall
entry: top-right
exit: bottom-left
カメラ: long
セリフ: 19██年。
セリフ: 最初の異常は、小さな町で確認された。
detail: hero=medium, 群衆=簡略, 背景=中

コマ2: 監視映像の灰色の街。一本の木の葉一枚だけが鮮やかな緑色になっている
登場: staff-a@foreground
importance: narrative=0.7, visual=1.0, transition=0.9
hold: 0.8
primary attention: green.leaf
secondary attention: staff-a.face
entry: top-right
exit: bottom-left
カメラ: close
演出: progressive-reveal selective-color
セリフ: staff-a> ……何だ、これは

コマ3: 職員Aの目の極端なアップ。瞳に緑色の葉が映り込む
登場: staff-a@center
importance: narrative=0.5, visual=0.8, transition=0.6
hold: medium
primary attention: staff-a.eye
カメラ: extreme-close
表情: staff-a> confusion
セリフ: staff-a> 画像データの破損か？

コマ4: 研究員が資料写真を机に置く。写真の一部に赤、青、黄色が混じっている
登場: researcher@right, staff-a@left
importance: narrative=0.8, visual=0.7, transition=0.8
hold: medium
primary attention: evidence.photos
secondary attention: researcher.hand
カメラ: medium
セリフ: researcher> 違います
セリフ: researcher> 現地でも、同じものが見えています

# Page 2: 感染
@layout: detail-payoff
@background: town under containment / mostly monochrome
@time: day

コマ1: 同じ町の俯瞰。灰色の街の一部だけが色づき始め、緑の木、赤い看板、青みを帯びた空が点在する。住民は不安そうに見上げている
importance: narrative=0.7, visual=0.9, transition=0.8
hold: 0.8
primary attention: color.spread
entry: top-right
exit: bottom-left
カメラ: high-angle long
演出: selective-color spreading-anomaly
セリフ: 異常は拡大した。
crowd detail: silhouette

コマ2: 防護服の財団職員がトングで鮮烈な赤色のリンゴを持ち上げる。周囲はほぼ無彩色
登場: staff-b@right, researcher@left
importance: narrative=0.6, visual=0.8, transition=0.5
hold: medium
primary attention: red.apple
カメラ: medium close
セリフ: staff-b> 物質変化は？
セリフ: researcher> ありません

コマ3: 検査装置と数値。研究員が淡々と結果を読む
登場: researcher@left
importance: narrative=0.6, visual=0.3, transition=0.6
hold: 0.25
primary attention: instrument.display
カメラ: close
セリフ: researcher> 質量も、成分も、温度も――全部正常です

コマ4: 赤いリンゴだけを大きく見せる。背景は無彩色の実験室
importance: narrative=0.7, visual=1.0, transition=0.8
hold: 0.8
primary attention: red.apple
カメラ: extreme-close
セリフ: staff-b> なら……何が変わった？

コマ5: 研究員の顔。静かに答える
登場: researcher@center
importance: narrative=0.9, visual=0.6, transition=0.8
hold: 0.8
primary attention: researcher.face
カメラ: close
表情: researcher> grave calm
セリフ: researcher> 見え方です

# Page 3: 収容不能
@layout: quiet-build
@background: global containment failure
@time: day

コマ1: 世界地図の各地に色の領域が広がる。封鎖線や隔離区域を越えて増殖している
importance: narrative=0.7, visual=0.7, transition=0.9
hold: 0.25
primary attention: worldmap.color-spread
カメラ: high-angle
セリフ: 封鎖。隔離。情報統制。

コマ2: 防護壁の隙間を越えて黄色い花が咲く。壁と地面は無彩色
importance: narrative=0.5, visual=0.8, transition=0.9
hold: 0.25
primary attention: yellow.flower
カメラ: close low-angle
演出: visual-metaphor breach
セリフ: 失敗。

コマ3: 海岸。手前は灰色だが、水平線の向こうから海と空が鮮烈な青へ変わって迫ってくる
登場: field-staff@right
importance: narrative=0.8, visual=1.0, transition=0.9
hold: medium
primary attention: blue.horizon
secondary attention: field-staff.silhouette
entry: top-right
exit: bottom-left
カメラ: long
演出: advancing-color-front
セリフ: field-staff> 拡大速度、予測値を突破！

コマ4: 財団上層部の会議室。壁の世界地図はほぼ全面が色で覆われ、出席者は沈黙している
登場: director@right, researcher@left
importance: narrative=0.8, visual=0.6, transition=0.7
hold: 0.8
primary attention: worldmap.full-color
secondary attention: director
カメラ: medium long
セリフ: director> ……収容は？
セリフ: researcher> 不可能です

コマ5: 責任者の顔へ寄る
登場: director@center
importance: narrative=0.9, visual=0.7, transition=0.9
hold: 0.8
primary attention: director.face
カメラ: close
表情: director> resolved despair
セリフ: director> では

コマ6: 黒背景。責任者の口元だけを見せる
登場: director@center
importance: narrative=1.0, visual=0.9, transition=1.0
hold: 0.8
primary attention: director.mouth
カメラ: extreme-close
演出: suspense hard-cut
セリフ: director> 異常の方を――正常にする

# Page 4: 青い、青い空
@layout: detail-payoff
@background: post-Ennui world becoming full color
@time: day

コマ1: 白い処置室。人々が列を作り、記憶処理を受ける。世界の大部分はすでに色づいている
importance: narrative=0.7, visual=0.6, transition=0.7
hold: medium
primary attention: amnestic.line
カメラ: long
セリフ: 人類全体の認識を修正。
セリフ: 過去の記録を修正。
crowd detail: silhouette

コマ2: 教室。先生が青い空、緑の草、赤い花、黄色い太陽が描かれた絵を子供たちへ見せる
登場: teacher@right, children@left
importance: narrative=0.9, visual=0.8, transition=0.9
hold: medium
primary attention: picture.book
secondary attention: children
カメラ: medium
セリフ: teacher> 空は何色？
セリフ: children> 青ー！
crowd detail: 簡略

コマ3: 教室の窓際に老人が一人立ち、子供たちを見る。わずかな違和感だけが表情に残る
登場: old-man@left
importance: narrative=0.5, visual=0.5, transition=0.8
hold: 0.8
primary attention: old-man.face
カメラ: close
表情: old-man> faint unease
セリフ: old-man> …………

コマ4: 現在の世界。真っ青な空、白い雲、緑の木々、色とりどりの服の人々。美しく、ごく普通の日常
importance: narrative=1.0, visual=1.0, transition=0.4
hold: climax
primary attention: blue.sky
secondary attention: ordinary.people
entry: top-right
exit: bottom-left
コマサイズ: hero
断ち切り: all
カメラ: long
演出: full-color reveal serene-normality
セリフ: こうして異常は消えた。
セリフ: 少なくとも――私たちの記憶からは。
セリフ: SCP-8900-EX
セリフ: 青い、青い空
crowd detail: 簡略
