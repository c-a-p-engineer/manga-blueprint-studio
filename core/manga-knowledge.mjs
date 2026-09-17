// Executable manga-direction knowledge shared by agents, solvers and UI-facing adapters.
// Keep technique IDs stable. This module is the single machine-readable source of truth.

export const MEDIUM_PROFILES=Object.freeze({
 'print-page':{readingDirection:'rtl',progression:'page',capabilities:['page-turn','spread','bleed'],notes:['publisher/printer template overrides defaults','use trim/bleed/safe-area/gutter semantics']},
 'web-page':{readingDirection:'rtl',progression:'page',capabilities:['page-turn'],notes:['optimize lettering/detail for phone display','platform export requirements are not manga grammar']},
 'vertical-scroll':{readingDirection:'ttb',progression:'scroll',capabilities:['scroll-delay','viewport-reveal','continuous-pan'],notes:['pace with vertical spacing','check composition at mobile viewport scale','do not assume page-turn mechanics']},
 'social-short':{readingDirection:'rtl',progression:'page-or-carousel',capabilities:['carousel-turn'],notes:['favor phone legibility','keep attention targets simple']}
});

export const STYLE_AXES=Object.freeze({
 line:['clean','rough','brush','variable-weight'],value:['light','balanced','high-contrast','heavy-black'],color:['monochrome','limited','full-color','muted'],shape:['realistic','graphic','rounded','angular','chibi'],surface:['flat','watercolor','hatching','ink-wash','retro-print','collage'],background:['detailed','selective','minimal','symbolic']
});
export const STYLE_PRESETS=Object.freeze({
 'gekiga-like':{line:'variable-weight',value:'heavy-black',color:'monochrome',shape:'realistic',surface:'hatching',background:'detailed'},
 'shojo-decorative':{line:'clean',value:'light',color:'limited',shape:'rounded',surface:'flat',background:'symbolic'},
 'shonen-action':{line:'variable-weight',value:'high-contrast',color:'monochrome',shape:'angular',surface:'flat',background:'selective'},
 'seinen-realistic':{line:'clean',value:'balanced',color:'monochrome',shape:'realistic',surface:'hatching',background:'detailed'},
 'yonkoma-simple':{line:'clean',value:'light',color:'limited',shape:'rounded',surface:'flat',background:'minimal'},
 'webtoon-color':{line:'clean',value:'balanced',color:'full-color',shape:'graphic',surface:'flat',background:'selective'},
 'rough-storyboard':{line:'rough',value:'light',color:'monochrome',shape:'graphic',surface:'flat',background:'minimal'},
 'ink-wash':{line:'brush',value:'high-contrast',color:'monochrome',shape:'graphic',surface:'ink-wash',background:'selective'},
 'retro-print':{line:'variable-weight',value:'high-contrast',color:'limited',shape:'graphic',surface:'retro-print',background:'selective'},
 'collage-mixed-media':{line:'rough',value:'balanced',color:'limited',shape:'graphic',surface:'collage',background:'symbolic'}
});

export const GENRE_BIASES=Object.freeze({action:['diagonal-panel','foreshortening','motion-lines','contact-focus','low-angle','hero-panel'],comedy:['stable-grid','reaction-shot','pause','small-panel'],romance:['closeup','detail-inset','pause','negative-space'],horror:['negative-space','progressive-reveal','cropped-information','dutch-angle','silent-panel'],mystery:['detail-inset','attention-control','wide-shot','reaction-shot','misdirection'],slice_of_life:['wide-shot','pause','stable-grid'],sports:['motion-lines','anticipation','contact-focus','follow-through','wide-shot'],drama:['reaction-shot','closeup','silent-panel'],exposition:['stable-grid','detail-inset','wide-shot']});

const PRESENTATION={
 closeup:['寄り','Close-up','表情や重要物へ注意を集める。','感情・決意・発見。','位置関係の説明とは競合しやすい。'],
 'extreme-closeup':['超寄り','Extreme close-up','一部分を極端に拡大する。','緊張・執着・重要情報。','連発すると全体状況を失う。'],
 'wide-shot':['引き','Wide shot','人物と周囲の位置関係を見せる。','場所・距離・人数の理解。','細かな表情は弱くなる。'],
 'low-angle':['あおり','Low angle','下から見上げスケールを強める。','威圧・英雄性・巨大さ。','常用すると意味が薄れる。'],
 'high-angle':['俯瞰','High angle','上から状況を見下ろす。','位置関係・孤立・状況把握。','感情の細部には不向き。'],
 'dutch-angle':['ダッチアングル','Dutch angle','水平を傾け不安定さを作る。','異常・恐怖・速度感。','無目的な傾斜を避ける。'],
 pov:['主観','POV','登場人物の視点に近づける。','没入・対面・発見。','視点人物を曖昧にしない。'],
 foreshortening:['誇張パース','Foreshortening','手前を大きくして奥行きを誇張する。','攻撃・突進・飛び出し。','接触点と人体を破綻させない。'],
 'extreme-foreground':['極端な前景','Extreme foreground','大きな前景で奥行きと圧力を作る。','迫力・誘導・主観。','主対象を完全に隠さない。'],
 'negative-space':['余白','Negative space','意図的な空白を演出に使う。','静けさ・孤独・不安。','単なる未描画と区別する。'],
 'hero-panel':['大ゴマ','Hero panel','周囲より相対的に大きなコマ。','決め絵・登場・感情ピーク。','重要=常に大ゴマではない。'],
 'small-panel':['小ゴマ','Beat panel','短い瞬間を小さく刻む。','反応・手元・テンポ。','長台詞を詰め込まない。'],
 'diagonal-panel':['斜めコマ','Diagonal panel','枠に方向性と不安定さを与える。','衝突・加速・異常。','読み順を壊さない。'],
 'detail-inset':['小窓','Inset','補助ディテールを小コマで追加する。','目・手・時計・反応。','主従関係を崩さない。'],
 bleed:['断ち切り','Bleed','絵をページ端まで伸ばす。','広がり・スケール。','安全域と塗り足しを守る。'],
 'character-breakout':['ブチ抜き','Breakout','人物をコマ枠から越境させる。','登場・必殺技・存在感。','読み順を曖昧にしない。'],
 'stable-grid':['グリッド','Stable grid','規則的なコマ配置を反復する。','会話・日常・比較。','長時間続けると単調。'],
 'grid-break':['グリッド破壊','Grid break','規則配置を意図的に崩す。','驚き・転換・衝撃。','先に基準となる規則性が必要。'],
 'moment-to-moment':['瞬間→瞬間','Moment-to-moment','微小な時間変化を刻む。','一瞬を長く見せる。','高速化したい場面では停滞する。'],
 'action-to-action':['動作→動作','Action-to-action','同一主体の連続行動を追う。','動作因果・アクション。','全過程を描きすぎない。'],
 'aspect-to-aspect':['側面→側面','Aspect-to-aspect','同一場面の別要素へ視点を移す。','空気・環境・不穏さ。','目的なく散らさない。'],
 'reaction-shot':['リアクションカット','Reaction shot','出来事への反応を見せる。','感情・驚き・笑い。','反応だけで因果を切らない。'],
 'insert-shot':['インサート','Insert shot','重要な物や細部を挿入する。','情報・伏線・手元。','重要度を過剰に見せない。'],
 'match-cut':['マッチカット','Match cut','形や動きの類似で場面を接続する。','連続性・対比。','対応関係を読者に認識可能にする。'],
 montage:['モンタージュ','Montage','複数の断片で時間や情報を圧縮する。','経過・訓練・説明。','因果の要所を落とさない。'],
 ellipsis:['省略','Ellipsis','中間過程を飛ばす。','高速化・驚き。','必要な因果まで省略しない。'],
 pause:['間','Pause','読ませる時間を意図的に伸ばす。','感情・恐怖・余韻。','目的のない停止を避ける。'],
 decompression:['時間の引き伸ばし','Decompression','一瞬を複数Beatへ展開する。','緊張・感情ピーク。','長すぎると冗長。'],
 accelerando:['加速','Accelerando','Beatを短くしてテンポを上げる。','追跡・連打・焦り。','可読性を失わない。'],
 anticipation:['予備動作','Anticipation','本動作の前兆を見せる。','攻撃・跳躍・ギャグ。','予備が長すぎると勢いを失う。'],
 'contact-focus':['接触','Contact focus','衝突点を主注目にする。','打撃・握手・物体操作。','接触位置を曖昧にしない。'],
 'follow-through':['フォロースルー','Follow-through','動作後の慣性や結果を見せる。','重量・速度・結果。','接触前と混同しない。'],
 'motion-lines':['速度線','Motion lines','線で運動方向と速度を示す。','高速移動・攻撃。','方向を動作と一致させる。'],
 'focus-lines':['集中線','Focus lines','線を注目点へ収束させる。','衝撃・発見・決め。','複数焦点を作らない。'],
 afterimage:['残像','Afterimage','複数像で高速移動を示す。','超高速・連続動作。','位置関係を失わない。'],
 'impact-flash':['インパクトフラッシュ','Impact flash','極端な明暗差で瞬間を切る。','衝撃・驚き。','連発すると飽和する。'],
 'attention-control':['視線誘導','Attention control','視線・身振り・構図を読み方向へ揃える。','理解・流れ・伏線。','不自然な誘導を避ける。'],
 'progressive-reveal':['段階的開示','Progressive reveal','情報を一度に見せず段階的に開く。','恐怖・登場・正体。','引っ張りすぎない。'],
 'cropped-information':['情報欠落','Cropped information','意図的に全体を見せない。','恐怖・謎・期待。','理解に必要な情報まで消さない。'],
 misdirection:['ミスディレクション','Misdirection','一度別の対象へ注意を向ける。','驚き・ミステリー。','フェアな手掛かりを壊さない。'],
 'background-dropout':['背景消失','Background dropout','背景を落として人物へ集中する。','感情・決意・ギャグ。','場所説明が必要なBeatでは避ける。'],
 'symbolic-background':['心象背景','Symbolic background','現実背景を感情的な記号へ置換する。','恋愛・恐怖・心理。','現実空間との区別を保つ。'],
 'silent-panel':['無言コマ','Silent panel','台詞を置かず画面だけで読ませる。','余韻・恐怖・感情。','情報不足と沈黙を混同しない。'],
 'cross-panel-sfx':['SFX越境','Cross-panel SFX','効果音をコマ境界へ跨がせる。','衝撃・連続性。','読み順や文字を塞がない。'],
 'page-turn-reveal':['ページめくりReveal','Page-turn reveal','ページめくりで情報を初めて見せる。','登場・正体・驚き。','縦スクロールへ移植しない。'],
 spread:['見開き','Spread','左右ページを一画面として使う。','巨大景観・クライマックス。','ノドと重要要素の位置に注意。'],
 'scroll-delay':['Scroll delay','Scroll delay','縦余白で到達までの時間を作る。','恐怖・間・Reveal。','空白を過剰にしない。'],
 'viewport-reveal':['Viewport reveal','Viewport reveal','画面外からスクロールで情報を出す。','登場・驚き。','端末viewport依存を固定値化しない。'],
 'continuous-vertical-pan':['Continuous vertical pan','Continuous vertical pan','連続背景で縦移動を体感させる。','落下・建物・移動。','位置関係を途中で破綻させない。'],
 'long-fall':['Long fall','Long fall','スクロール距離そのものを落下距離にする。','落下・巨大さ・恐怖。','冗長な空白だけにしない。']
};

const REL={
 closeup:{pairs:['reaction-shot','negative-space','background-dropout'],conflicts:['wide-shot']},'extreme-closeup':{pairs:['insert-shot','progressive-reveal'],conflicts:['wide-shot']},'wide-shot':{pairs:['closeup','high-angle'],conflicts:['extreme-closeup']},'low-angle':{pairs:['foreshortening','hero-panel']},'dutch-angle':{pairs:['cropped-information','diagonal-panel']},pov:{pairs:['extreme-foreground','progressive-reveal']},foreshortening:{pairs:['low-angle','extreme-foreground','motion-lines']},'negative-space':{pairs:['pause','silent-panel']},'hero-panel':{pairs:['bleed','low-angle']},'small-panel':{pairs:['accelerando','insert-shot']},'diagonal-panel':{pairs:['motion-lines','foreshortening']},'detail-inset':{pairs:['insert-shot','closeup']},bleed:{pairs:['hero-panel','spread']},'character-breakout':{pairs:['hero-panel','foreshortening']},'stable-grid':{pairs:['grid-break']},'grid-break':{pairs:['stable-grid','hero-panel'],requires:['prior-stable-rhythm']},'moment-to-moment':{pairs:['decompression','pause']},'action-to-action':{pairs:['anticipation','contact-focus','follow-through']},'reaction-shot':{pairs:['closeup','pause']},'insert-shot':{pairs:['detail-inset','cropped-information']},ellipsis:{pairs:['accelerando']},pause:{pairs:['negative-space','silent-panel']},decompression:{pairs:['moment-to-moment','pause']},accelerando:{pairs:['small-panel','ellipsis']},anticipation:{pairs:['contact-focus','follow-through']},'contact-focus':{pairs:['anticipation','follow-through','focus-lines']},'follow-through':{pairs:['contact-focus','motion-lines']},'motion-lines':{pairs:['diagonal-panel','foreshortening']},'focus-lines':{pairs:['contact-focus','hero-panel']},'progressive-reveal':{pairs:['cropped-information','page-turn-reveal','viewport-reveal']},'cropped-information':{pairs:['progressive-reveal','dutch-angle']},misdirection:{pairs:['insert-shot','reaction-shot']},'background-dropout':{pairs:['closeup','silent-panel']},'symbolic-background':{pairs:['closeup','pause']},'silent-panel':{pairs:['pause','negative-space']},'cross-panel-sfx':{pairs:['hero-panel','contact-focus']},'page-turn-reveal':{pairs:['progressive-reveal'],requires:['page'],conflicts:['viewport-reveal','scroll-delay']},spread:{pairs:['hero-panel','bleed'],requires:['page']},'scroll-delay':{pairs:['viewport-reveal','progressive-reveal'],requires:['scroll'],conflicts:['page-turn-reveal']},'viewport-reveal':{pairs:['scroll-delay','progressive-reveal'],requires:['scroll'],conflicts:['page-turn-reveal']},'continuous-vertical-pan':{pairs:['scroll-delay'],requires:['scroll']},'long-fall':{pairs:['continuous-vertical-pan','motion-lines'],requires:['scroll']}
};

const BASE={
 closeup:['camera',['emotion','attention','information'],{cameraDistance:'close',subjectScale:'large'}],'extreme-closeup':['camera',['emotion','attention','fear'],{cameraDistance:'extreme-close',cropContext:true}],'wide-shot':['camera',['information','space'],{cameraDistance:'long',showEnvironment:true}],'low-angle':['camera',['impact','scale'],{cameraAngle:'low-angle'}],'high-angle':['camera',['information','isolation'],{cameraAngle:'high-angle'}],'dutch-angle':['camera',['fear','instability','impact'],{cameraRoll:'tilted'}],pov:['camera',['immersion','fear','information'],{cameraMode:'first-person'}],foreshortening:['composition',['impact','speed','depth'],{depthContrast:'high',foregroundScale:'large'}],'extreme-foreground':['composition',['impact','depth','attention'],{foregroundScale:'very-large',depthContrast:'high'}],'negative-space':['composition',['pause','emotion','fear','attention'],{negativeSpace:'high',density:'low'}],'hero-panel':['panel',['impact','emotion','reveal','hold'],{relativePanelScale:'large'}],'small-panel':['panel',['speed','detail'],{relativePanelScale:'small',beatDuration:'short'}],'diagonal-panel':['panel',['impact','speed','instability'],{panelShape:'diagonal'}],'detail-inset':['panel',['information','attention','emotion'],{inset:true}],bleed:['panel',['scale','impact'],{reachesTrim:true}],'character-breakout':['panel',['impact','presence'],{crossPanelBoundary:true}],'stable-grid':['panel',['clarity','setup'],{panelRhythm:'regular'}],'grid-break':['panel',['impact','surprise'],{panelRhythm:'break'}],'moment-to-moment':['transition',['hold','emotion'],{transition:'moment-to-moment'}],'action-to-action':['transition',['clarity','speed'],{transition:'action-to-action'}],'aspect-to-aspect':['transition',['mood','hold'],{transition:'aspect-to-aspect'}],'reaction-shot':['transition',['emotion','surprise'],{transition:'reaction'}],'insert-shot':['transition',['information','attention'],{transition:'insert'}],'match-cut':['transition',['continuity','contrast'],{transition:'match-cut'}],montage:['transition',['compression','information'],{transition:'montage'}],ellipsis:['pacing',['speed','surprise'],{omitIntermediate:true}],pause:['pacing',['hold','emotion','fear'],{holdDelta:.3,densityDelta:-.25}],decompression:['pacing',['hold','emotion','fear'],{beatExpansion:true}],accelerando:['pacing',['speed','impact'],{beatDurationTrend:'shorter'}],anticipation:['action',['clarity','impact'],{motionPhase:'anticipation'}],'contact-focus':['action',['impact','clarity'],{motionPhase:'contact',attentionTarget:'contact'}],'follow-through':['action',['impact','direction'],{motionPhase:'follow-through'}],'motion-lines':['action',['speed','direction'],{motionLines:true}],'focus-lines':['action',['attention','impact'],{focusLines:true}],afterimage:['action',['speed'],{afterimage:true}],'impact-flash':['action',['impact','surprise'],{valueContrast:'extreme'}],'attention-control':['attention',['clarity','flow'],{alignGazeGestureFlow:true}],'progressive-reveal':['attention',['reveal','fear'],{informationRelease:'progressive'}],'cropped-information':['attention',['fear','mystery'],{cropContext:true}],misdirection:['attention',['surprise','mystery'],{attentionDecoy:true}],'background-dropout':['psychology',['emotion','attention'],{backgroundMode:'dropout'}],'symbolic-background':['psychology',['emotion','mood'],{backgroundMode:'symbolic'}],'silent-panel':['lettering',['hold','emotion','fear'],{dialogue:'none'}],'cross-panel-sfx':['lettering',['impact','continuity'],{sfxCrossBoundary:true}],'page-turn-reveal':['medium',['reveal','surprise'],{revealMechanism:'page-turn'}],spread:['medium',['scale','impact'],{pageSpan:2}],'scroll-delay':['medium',['hold','fear','reveal'],{scrollGap:'large'}],'viewport-reveal':['medium',['reveal','surprise'],{revealMechanism:'viewport'}],'continuous-vertical-pan':['medium',['space','hold'],{continuousVerticalEnvironment:true}],'long-fall':['medium',['impact','fear','speed'],{scrollEmbodiesDistance:true}]
};

export const TECHNIQUES=Object.freeze(Object.fromEntries(Object.entries(BASE).map(([id,[category,effects,semantic]])=>{const p=PRESENTATION[id]||[id,id,id,'',''];const r=REL[id]||{};return[id,Object.freeze({id,category,effects,semantic,ja:p[0],en:p[1],summary:p[2],use:p[3],caution:p[4],strength:{weak:'subtle cue',standard:'clear authored cue',strong:'dominant cue; preserve readability'},pairs:r.pairs||[],conflicts:r.conflicts||[],requires:r.requires||[]})]})));

export const TERMS=Object.freeze(Object.fromEntries(Object.values(TECHNIQUES).map(t=>[t.id.replaceAll('-','_'),{ja:t.ja,en:t.en,technique:t.id}])));
const uniq=xs=>[...new Set(xs.filter(Boolean))];
const mediumRequirementOk=(t,p)=>!(t.requires||[]).some(r=>r==='page'&&p.progression==='scroll'||r==='scroll'&&p.progression!=='scroll');
export function techniqueRecord(id){return TECHNIQUES[id]||null;}
export function stylePreset(id){return STYLE_PRESETS[id]||null;}
export function composeTechniques(candidates,{medium='print-page',limit=6}={}){const profile=MEDIUM_PROFILES[medium]||MEDIUM_PROFILES['print-page'];const accepted=[],rejected=[];for(const id of uniq(candidates)){const t=TECHNIQUES[id];if(!t){rejected.push({id,reason:'unknown'});continue}if(!mediumRequirementOk(t,profile)){rejected.push({id,reason:'medium-conflict'});continue}if(accepted.some(a=>t.conflicts.includes(a)||(TECHNIQUES[a]?.conflicts||[]).includes(id))){rejected.push({id,reason:'technique-conflict'});continue}accepted.push(id);if(accepted.length>=limit)break}return{techniques:accepted,rejected};}
export function recommendMangaDirection({medium='print-page',genre='',purpose='',importance=.5,hold=.5,motion='',attention=''}={}){const profile=MEDIUM_PROFILES[medium]||MEDIUM_PROFILES['print-page'];const candidates=[],why=[];const genreBias=[...(GENRE_BIASES[String(genre).toLowerCase()]||[])];const p=String(purpose).toLowerCase(),m=String(motion).toLowerCase(),a=String(attention).toLowerCase();if(profile.progression==='scroll'&&/reveal|suspense|horror|驚|恐/.test(`${p} ${genre}`.toLowerCase())){candidates.push('scroll-delay','viewport-reveal');why.push('scroll-native reveal')}if(profile.progression==='page'&&/reveal|驚|正体/.test(p)){candidates.push('page-turn-reveal');why.push('page-turn reveal')}candidates.push(...genreBias);if(/climax|reveal|impact|決め|衝撃/.test(p)||importance>=.8){candidates.push('hero-panel');why.push('high-impact/important beat')}if(/impact|action|attack|collision|衝突|攻撃/.test(p)){candidates.push('anticipation','contact-focus','follow-through');why.push('action phase clarity')}if(/impact|attack|collision|突進|攻撃/.test(p)||/left|right|up|down|左|右|上|下/.test(m)){candidates.push('diagonal-panel','motion-lines');why.push('directional action')}if(/fear|horror|suspense|恐|不安/.test(`${p} ${genre}`.toLowerCase()))candidates.push('cropped-information','progressive-reveal','negative-space');if(/emotion|confession|reaction|感情|告白|反応/.test(p))candidates.push('closeup','reaction-shot');if(/establish|location|位置|場所|全景/.test(p))candidates.push('wide-shot');if(hold>=.75){candidates.push('pause','negative-space');why.push('long reading hold')}if(a&&/contact|hand|eye|face|prop|接触|手|目|顔/.test(a))candidates.push('detail-inset');return{medium,profile,genreBias,...composeTechniques(candidates,{medium}),why};}
