// Prototype 0.9: searchable visual Story Template studio, scene packs, bounded derivation, and local custom templates.
const CUSTOM_TEMPLATE_KEY_13='manga-blueprint-studio/custom-story-templates/0.9';
const DERIVED_TEMPLATE_ID_13='__derived_story_template_13';
let derivedBaseId13='';

Object.assign(i18n.ja,{
  templateStudio:'シーンテンプレート',templateStudioLead:'「何を描くか」から選べます。カードで流れを確認してから適用できます。',
  templateCategory:'カテゴリ',templateCategoryAll:'すべて',templateCategoryRomance:'恋愛',templateCategoryBattle:'バトル',templateCategoryEmotion:'感情',templateCategoryDaily:'日常',templateCategoryComedy:'ギャグ',templateCategorySuspense:'サスペンス',templateCategoryCharacter:'キャラ紹介',templateCategoryCustom:'自作',
  templateSearch:'テンプレートを検索',templateSearchPlaceholder:'例: 告白 / キス / 反撃 / 泣く',templateUseCase:'向いている用途',templateBeats:'流れ',templatePanels:'コマ',templateNoMatch:'条件に合うテンプレートがありません。',
  templateDerive:'🎲 このテンプレから派生',templateDeriveReady:'元の流れを保ったまま、カメラ・表情・演出を少し変えた派生案です。',templateDerivedLabel:'派生案',
  templateSaveCurrent:'現在のページを自作テンプレに保存',templateSaveTitle:'自作テンプレートとして保存',templateSaveName:'テンプレート名',templateSaveNamePlaceholder:'例: 自分用・照れ告白4コマ',templateSave:'保存する',templateSaved:'自作テンプレートに保存しました。',templateDelete:'削除',templateDeleteConfirm:'この自作テンプレートを削除しますか？',templateCustomNote:'キャラクターの固有見た目は保存せず、構成・出来事・カメラ・ポーズ・表情・背景・台詞/SFXを保存します。',
  storyConfession:'告白 4コマ',storyKissBefore:'キス直前 3コマ',storyKissAfter:'キス後の余韻 3コマ',storyHoldHands:'手をつなぐ 3コマ',storyRomanceMisunderstanding:'すれ違いラブコメ 4コマ',
  storyBattleStandoff:'バトル導入 4コマ',storyDecisiveBlow:'一撃必殺 3コマ',storyCounterattack:'反撃 4コマ',storyAerialAttack:'飛び込み攻撃 3コマ',storyThrow:'投げ技 3コマ',storyAwakening:'覚醒・逆転 4コマ',
  storyCrying:'泣き顔 3コマ',storyAnger:'怒り爆発 3コマ',storyResolve:'覚悟を決める 3コマ',storyPresence:'背後の気配 3コマ',storyClassroomTalk:'教室トーク 4コマ',storySmugFail:'ドヤ顔失敗 4コマ',storyCharacterIntro:'キャラ初登場 4コマ'
});
Object.assign(i18n.en,{
  templateStudio:'Scene templates',templateStudioLead:'Start from what happens in the scene. Inspect the beat cards before applying.',
  templateCategory:'Category',templateCategoryAll:'All',templateCategoryRomance:'Romance',templateCategoryBattle:'Battle',templateCategoryEmotion:'Emotion',templateCategoryDaily:'Daily',templateCategoryComedy:'Comedy',templateCategorySuspense:'Suspense',templateCategoryCharacter:'Character intro',templateCategoryCustom:'Custom',
  templateSearch:'Search templates',templateSearchPlaceholder:'Example: confession / kiss / counterattack / crying',templateUseCase:'Best for',templateBeats:'Beat flow',templatePanels:'panels',templateNoMatch:'No templates match these filters.',
  templateDerive:'🎲 Derive from this template',templateDeriveReady:'A bounded variation that keeps the same story flow while changing some camera, expression, and emphasis choices.',templateDerivedLabel:'Derived variation',
  templateSaveCurrent:'Save current page as custom template',templateSaveTitle:'Save as custom template',templateSaveName:'Template name',templateSaveNamePlaceholder:'Example: My quiet confession 4-panel',templateSave:'Save',templateSaved:'Saved as a custom template.',templateDelete:'Delete',templateDeleteConfirm:'Delete this custom template?',templateCustomNote:'Character-specific appearance is not saved. Layout, action, camera, pose, expression, background, dialogue, and SFX are reusable.',
  storyConfession:'Confession 4-panel',storyKissBefore:'Before the kiss 3-panel',storyKissAfter:'After-kiss afterglow 3-panel',storyHoldHands:'Holding hands 3-panel',storyRomanceMisunderstanding:'Rom-com misunderstanding 4-panel',
  storyBattleStandoff:'Battle opening 4-panel',storyDecisiveBlow:'Decisive blow 3-panel',storyCounterattack:'Counterattack 4-panel',storyAerialAttack:'Aerial attack 3-panel',storyThrow:'Throw technique 3-panel',storyAwakening:'Awakening reversal 4-panel',
  storyCrying:'Crying 3-panel',storyAnger:'Anger burst 3-panel',storyResolve:'Resolve 3-panel',storyPresence:'Presence behind you 3-panel',storyClassroomTalk:'Classroom talk 4-panel',storySmugFail:'Smug failure 4-panel',storyCharacterIntro:'Character introduction 4-panel'
});

const meta13={};
function templateMeta13(id,category,descJa,descEn,useJa,useEn,tags=[]){meta13[id]={category,desc:{ja:descJa,en:descEn},use:{ja:useJa,en:useEn},tags};}
function bg13(jaLoc,enLoc,jaMood='普通',enMood='neutral',time='day'){return {ja:{location:jaLoc,timeOfDay:time,weather:'',mood:jaMood},en:{location:enLoc,timeOfDay:time,weather:'',mood:enMood}}}
function beat13(role,ja,en,pose='stand',expression='neutral',gaze='camera',camera=['medium','eye-level','front'],extra={}){return {role,action:{ja,en},pose,expression,gaze,camera,...extra}}

Object.assign(storyTemplates11,{
  confession:{label:'storyConfession',layout:'climax',background:bg13('夕方の教室','classroom at sunset','静か','quiet','evening'),beats:[
    beat13('setup','二人きりになった空気を見せる','establishes that the two are alone','stand','neutral','other-character',['long','eye-level','three-quarter-front'],{dialogue:{ja:'ちょっと話したいことがあるの',en:'There is something I want to tell you.'}}),
    beat13('beat','言い出せず一度視線を外す','hesitates and looks away before speaking','stand','shy','away',['close','eye-level','three-quarter-front'],{sfx:{ja:'ドキ',en:'THUMP'}}),
    beat13('climax','勇気を出して好きだと伝える','finds the courage to confess','stand','shy','other-character',['medium','eye-level','front'],{dialogue:{ja:'ずっと、好きでした',en:'I have liked you for a long time.'}}),
    beat13('reaction','相手の返事を待つ緊張した表情を見せる','waits tensely for the answer','stand','surprised','other-character',['close','eye-level','front'])
  ]},
  kissBefore:{label:'storyKissBefore',layout:'action3',background:bg13('静かな部屋','quiet room','親密','intimate','evening'),beats:[
    beat13('setup','二人が近い距離で見つめ合う','the two hold eye contact at close distance','stand','shy','other-character',['medium','eye-level','three-quarter-front']),
    beat13('beat','少しずつ顔の距離を縮める','slowly closes the distance between their faces','stand','shy','other-character',['close','eye-level','side'],{sfx:{ja:'…',en:'…'}}),
    beat13('climax','唇が触れる直前で時間を止める','holds the moment just before their lips touch','stand','shy','other-character',['extreme-close','eye-level','side'])
  ]},
  kissAfter:{label:'storyKissAfter',layout:'action3',background:bg13('静かな部屋','quiet room','柔らかい','soft','evening'),beats:[
    beat13('climax','短いキスの瞬間を見せる','shows a brief kiss','stand','shy','other-character',['close','eye-level','side']),
    beat13('beat','離れたあと言葉のない間を置く','leaves a silent beat after they part','stand','surprised','away',['extreme-close','eye-level','front'],{sfx:{ja:'…',en:'…'}}),
    beat13('afterglow','照れながら少し笑って余韻を残す','ends on a shy smile and afterglow','stand','shy','other-character',['close','eye-level','three-quarter-front'],{dialogue:{ja:'…照れるね',en:'…That was embarrassing.'}})
  ]},
  holdHands:{label:'storyHoldHands',layout:'action3',background:bg13('帰り道','walk home','穏やか','gentle','evening'),beats:[
    beat13('setup','並んで歩く二人の距離を見せる','shows the distance between two people walking together','stand','neutral','other-character',['long','eye-level','side']),
    beat13('beat','迷いながら手を近づける','hesitantly moves a hand closer','stand','shy','down',['close','eye-level','near-object'],{sfx:{ja:'そっ…',en:'REACH'}}),
    beat13('afterglow','手をつないで互いに照れる','they hold hands and both become shy','stand','shy','away',['medium','eye-level','three-quarter-front'])
  ]},
  romanceMisunderstanding:{label:'storyRomanceMisunderstanding',layout:'four-grid',background:bg13('学校の廊下','school hallway','軽い','light'),beats:[
    beat13('setup','楽しそうに話す相手を見かける','spots the other person talking happily','stand','neutral','other-character',['long','eye-level','three-quarter-front']),
    beat13('reaction','勘違いして少し不機嫌になる','misunderstands the situation and gets quietly upset','lookback','sad','away',['close','eye-level','three-quarter-back']),
    beat13('transition','誤解だったと気づく','realizes it was a misunderstanding','stand','surprised','other-character',['medium','eye-level','front'],{dialogue:{ja:'え、そういうこと？',en:'Oh, that is what happened?'}}),
    beat13('afterglow','安心したのをごまかして強がる','hides the relief behind a tough response','stand','shy','away',['close','eye-level','three-quarter-front'],{dialogue:{ja:'べ、別に気にしてないし',en:'I-I was not worried or anything.'}})
  ]},
  battleStandoff:{label:'storyBattleStandoff',layout:'climax',background:bg13('戦闘エリア','battle area','緊張','tense'),beats:[
    beat13('setup','離れた位置で二人が対峙する','two opponents face each other at a distance','stand','angry','other-character',['long','eye-level','side']),
    beat13('beat','構えて間合いを測る','takes a stance and measures the distance','stand','angry','other-character',['medium','low-angle','three-quarter-front']),
    beat13('transition','一気に踏み込んで距離を詰める','bursts forward to close the distance','run','angry','other-character',['medium','dutch-angle','side'],{lineEffect:'speed',sfx:{ja:'ダッ',en:'DASH'}}),
    beat13('climax','最初の一撃がぶつかる瞬間を見せる','shows the instant the first strike lands','punch','angry','other-character',['close','low-angle','near-object'],{lineEffect:'impact',breakout:'foreground',sfx:{ja:'ガッ',en:'BAM'}})
  ]},
  decisiveBlow:{label:'storyDecisiveBlow',layout:'action3',background:bg13('戦闘エリア','battle area','緊張','tense'),beats:[
    beat13('setup','相手との間合いを一瞬見極める','reads the opponent distance for one beat','stand','angry','other-character',['long','eye-level','side']),
    beat13('transition','床を踏み込んで攻撃へ移る','plants the step and commits to the attack','run','angry','other-character',['medium','low-angle','three-quarter-front'],{lineEffect:'speed',sfx:{ja:'ドン',en:'THUD'}}),
    beat13('climax','決定打を極端な前景で見せる','shows the decisive strike in extreme foreground','punch','angry','other-character',['extreme-close','low-angle','near-object'],{lineEffect:'impact',breakout:'foreground',sfx:{ja:'バキッ',en:'CRACK'}})
  ]},
  counterattack:{label:'storyCounterattack',layout:'climax',background:bg13('戦闘エリア','battle area','切迫','urgent'),beats:[
    beat13('setup','相手の攻撃を受けて追い込まれる','gets pressured by the opponent attack','crouch','angry','other-character',['medium','high-angle','three-quarter-front'],{lineEffect:'speed'}),
    beat13('reaction','耐えながら相手の動きを見る','endures and watches the opponent movement','crouch','angry','other-character',['close','eye-level','front']),
    beat13('transition','一瞬の隙を見つける','spots a brief opening','stand','surprised','other-character',['extreme-close','eye-level','front'],{sfx:{ja:'！',en:'!'}}),
    beat13('climax','隙へ踏み込んで反撃を決める','steps into the opening and counters','punch','angry','other-character',['close','low-angle','near-object'],{lineEffect:'impact',breakout:'foreground',sfx:{ja:'ドゴッ',en:'WHAM'}})
  ]},
  aerialAttack:{label:'storyAerialAttack',layout:'action3',background:bg13('戦闘エリア','battle area','高速','fast'),beats:[
    beat13('setup','高い位置から相手へ狙いを定める','targets the opponent from above','stand','angry','other-character',['long','high-angle','three-quarter-front']),
    beat13('transition','空中から一気に接近する','dives rapidly toward the opponent','run','angry','other-character',['medium','dutch-angle','side'],{lineEffect:'speed',sfx:{ja:'シュッ',en:'WHOOSH'}}),
    beat13('climax','接近の勢いを乗せて打撃する','strikes with the momentum of the dive','punch','angry','other-character',['close','low-angle','near-object'],{lineEffect:'impact',breakout:'foreground',sfx:{ja:'ズガン',en:'BOOM'}})
  ]},
  throwTechnique:{label:'storyThrow',layout:'action3',background:bg13('道場','dojo','緊張','tense'),beats:[
    beat13('setup','相手と組み合って重心を探る','locks up and reads the opponent balance','stand','angry','other-character',['medium','eye-level','side']),
    beat13('transition','相手の重心を崩して身体を入れる','breaks the opponent balance and moves in','crouch','angry','other-character',['close','low-angle','three-quarter-front'],{sfx:{ja:'グッ',en:'GRIP'}}),
    beat13('climax','投げが決まる瞬間を大きく見せる','shows the decisive moment of the throw','stand','angry','other-character',['long','low-angle','side'],{lineEffect:'impact',sfx:{ja:'ドン',en:'THUD'}})
  ]},
  awakening:{label:'storyAwakening',layout:'climax',background:bg13('戦闘エリア','battle area','劇的','dramatic'),beats:[
    beat13('setup','追い込まれて動けない状態を見せる','shows the character cornered and unable to move','crouch','sad','down',['long','high-angle','front']),
    beat13('beat','何かを決意してゆっくり顔を上げる','makes a decision and slowly raises their head','crouch','angry','other-character',['close','eye-level','front']),
    beat13('transition','立ち上がり空気が変わる','stands up as the atmosphere changes','stand','angry','other-character',['medium','low-angle','front'],{lineEffect:'focus',sfx:{ja:'ゴゴ…',en:'RUMBLE'}}),
    beat13('climax','逆転の決意を大ゴマで見せる','shows the reversal resolve in a dominant shot','stand','smirk','other-character',['close','low-angle','front'],{lineEffect:'focus',breakout:'character'})
  ]},
  crying:{label:'storyCrying',layout:'action3',background:bg13('静かな場所','quiet place','静か','quiet'),beats:[
    beat13('setup','泣くのを我慢して平静を保つ','tries to stay composed while holding back tears','stand','sad','away',['medium','eye-level','three-quarter-front']),
    beat13('beat','感情がこらえきれなくなる','can no longer hold the emotion back','stand','sad','down',['close','eye-level','front'],{sfx:{ja:'…っ',en:'…'}}),
    beat13('climax','涙がこぼれる表情を寄りで見せる','shows tears finally spilling in a close shot','stand','sad','camera',['extreme-close','eye-level','front'])
  ]},
  angerBurst:{label:'storyAnger',layout:'action3',background:bg13('室内','room','張りつめた','tense'),beats:[
    beat13('setup','不満を抑えて黙って聞いている','listens in silence while holding anger back','stand','neutral','other-character',['medium','eye-level','front']),
    beat13('beat','拳や表情に怒りがにじむ','anger appears in the hands and expression','stand','angry','down',['close','eye-level','near-object'],{sfx:{ja:'ギリ…',en:'GRIT'}}),
    beat13('climax','感情が爆発して強く言い返す','the emotion bursts out in a forceful response','stand','angry','other-character',['close','low-angle','front'],{dialogue:{ja:'もういい加減にして！',en:'Enough already!'},lineEffect:'focus'})
  ]},
  resolve:{label:'storyResolve',layout:'action3',background:bg13('静かな場所','quiet place','引き締まる','focused'),beats:[
    beat13('setup','迷いながら立ち止まる','stops while still uncertain','stand','sad','down',['long','eye-level','three-quarter-front']),
    beat13('beat','目を閉じて考えを決める','closes the eyes and makes a decision','stand','neutral','down',['close','eye-level','front']),
    beat13('climax','顔を上げて前を見る','raises the head and looks forward with resolve','stand','smirk','camera',['close','low-angle','front'],{lineEffect:'focus'})
  ]},
  presenceBehind:{label:'storyPresence',layout:'action3',background:bg13('夜の廊下','hallway at night','不穏','uneasy','night'),beats:[
    beat13('setup','静かな場所を一人で進む','moves alone through a quiet place','stand','neutral','away',['long','eye-level','three-quarter-back']),
    beat13('transition','背後の小さな物音に気づく','notices a faint sound from behind','lookback','fear','away',['medium','dutch-angle','three-quarter-back'],{sfx:{ja:'…カサ',en:'RUSTLE'}}),
    beat13('climax','恐る恐る振り返る','slowly turns back in fear','lookback','fear','other-character',['close','eye-level','front'])
  ]},
  classroomTalk:{label:'storyClassroomTalk',layout:'four-grid',background:bg13('学校の教室','classroom','日常','casual'),beats:[
    beat13('setup','教室で二人が話している状況を見せる','establishes two people talking in the classroom','stand','neutral','other-character',['long','eye-level','side']),
    beat13('exposition','一人が話題を切り出す','one person brings up a topic','stand','smile','other-character',['medium','eye-level','three-quarter-front'],{dialogue:{ja:'そういえばさ',en:'By the way…'}}),
    beat13('reaction','相手が少し意外そうに反応する','the other reacts with mild surprise','stand','surprised','other-character',['close','eye-level','front'],{dialogue:{ja:'え、ほんと？',en:'Wait, really?'}}),
    beat13('afterglow','二人の会話が続く穏やかな空気で締める','ends on the relaxed feeling of the conversation continuing','stand','smile','other-character',['medium','eye-level','side'])
  ]},
  smugFail:{label:'storySmugFail',layout:'four-vertical',background:bg13('シンプルな室内','simple room','軽い','light'),beats:[
    beat13('setup','自信満々に宣言する','makes a confident declaration','stand','smirk','camera',['medium','eye-level','front'],{dialogue:{ja:'任せて',en:'Leave it to me.'}}),
    beat13('exposition','得意げに実行する','does it with full confidence','stand','smirk','camera',['medium','low-angle','three-quarter-front']),
    beat13('transition','派手に失敗して固まる','fails spectacularly and freezes','crouch','surprised','down',['close','high-angle','front'],{sfx:{ja:'ガシャーン',en:'CRASH'}}),
    beat13('reaction','無言でこちらを見る','silently looks at the viewer','stand','neutral','camera',['close','eye-level','front'],{dialogue:{ja:'…今のなし',en:'…That did not happen.'}})
  ]},
  characterIntro:{label:'storyCharacterIntro',layout:'climax',background:bg13('印象的な場所','signature location','印象的','distinctive'),beats:[
    beat13('setup','全身と立ち位置を見せる','shows the full body and setting','stand','neutral','camera',['long','eye-level','three-quarter-front']),
    beat13('exposition','特徴的な仕草や持ち物を見せる','shows a distinctive gesture or prop','stand','smile','away',['medium','eye-level','three-quarter-front']),
    beat13('beat','表情や視線を寄りで見せる','shows expression and gaze more closely','lookback','smirk','camera',['close','eye-level','front']),
    beat13('climax','その人物らしい決めカットで締める','ends on a signature character shot','stand','smirk','camera',['close','low-angle','front'],{lineEffect:'focus'})
  ]}
});

// Metadata for shipped templates, including the original 0.8 set.
templateMeta13('cuteDaily','daily','かわいい日常の小さな変化を4コマで見せます。','A four-panel cute everyday progression.','日常、キャラのかわいさ、SNS向け短編','Daily life, cute character moments, short social posts',['日常','かわいい']);
templateMeta13('romance','romance','照れや距離感の変化を中心にしたラブコメです。','A rom-com pattern centered on blush and changing distance.','ラブコメ、学園、関係変化','Rom-com, school scenes, relationship shifts',['恋愛','照れ']);
templateMeta13('surprise','emotion','平常から物音・発見・驚きへ素早く転換します。','Quickly moves from normality to discovery and surprise.','リアクション、短い事件、驚き','Reaction shots, small incidents, surprise',['驚き']);
templateMeta13('gag','comedy','前振り・ズレ・オチの基本4コマです。','A basic setup-misdirection-punchline four-panel pattern.','ギャグ、ボケツッコミ、短いオチ','Comedy, punchlines, short jokes',['ギャグ']);
templateMeta13('action','battle','接近から決定打までを3コマで圧縮します。','Compresses approach to decisive impact into three panels.','短いバトル、必殺技、見せ場','Short battles, finishing moves, impact moments',['バトル']);
templateMeta13('confession','romance','ためらいを挟み、告白と返事待ちを大きく見せます。','Builds hesitation before the confession and waiting for an answer.','告白、学園恋愛、感情のピーク','Confessions, school romance, emotional peaks',['告白']);
templateMeta13('kissBefore','romance','顔の距離が縮まる過程と直前の「間」を見せます。','Shows closing physical distance and the pause immediately before a kiss.','親密な恋愛、キス直前、緊張感','Intimate romance, pre-kiss tension',['キス','親密']);
templateMeta13('kissAfter','romance','キスそのものより、その後の沈黙と照れを重視します。','Emphasizes silence and blush after the kiss rather than spectacle.','恋愛の余韻、関係変化','Romantic afterglow, relationship change',['キス','余韻']);
templateMeta13('holdHands','romance','手が近づく小さな動作を見せ場にします。','Makes the small motion of reaching for a hand the key beat.','初々しい恋愛、距離感','Tender romance, physical distance',['手をつなぐ']);
templateMeta13('romanceMisunderstanding','romance','勘違いから安心と照れへ転がすラブコメです。','A rom-com misunderstanding that turns into relief and embarrassment.','すれ違い、ツンデレ、軽い恋愛ギャグ','Misunderstandings, tsundere beats, light romance',['すれ違い']);
templateMeta13('battleStandoff','battle','対峙から初撃まで、戦闘開始の流れを作ります。','Builds from standoff to the first collision.','バトル導入、ライバル対決','Battle openings, rival confrontations',['対峙']);
templateMeta13('decisiveBlow','battle','間合い・踏み込み・決定打の3段階です。','Three beats: distance, step-in, decisive strike.','一撃必殺、パンチ、必殺技','Finishing blows, punches, signature attacks',['一撃']);
templateMeta13('counterattack','battle','追い込まれる→隙を見つける→反撃の逆転です。','Turns pressure into an opening and counterattack.','逆転、反撃、攻防','Reversals, counters, exchanges',['反撃']);
templateMeta13('aerialAttack','battle','高低差と接近速度を使う空中攻撃です。','An aerial attack built around height difference and closing speed.','飛び込み、ジャンプ攻撃、速度感','Diving attacks, aerial action, speed',['空中']);
templateMeta13('throwTechnique','battle','組み・崩し・投げの身体関係を段階表示します。','Shows grip, balance break, and throw as separate body-relation beats.','投げ技、格闘、組み技','Throws, grappling, martial arts',['投げ']);
templateMeta13('awakening','battle','苦戦から立ち上がり、逆転の空気へ変えます。','Moves from being cornered to a dramatic reversal.','覚醒、逆転、ヒーロー演出','Awakening, comeback, heroic reversal',['覚醒']);
templateMeta13('crying','emotion','我慢から涙がこぼれるまでを寄りへ収束させます。','Narrows from restraint to tears in a close emotional progression.','泣き、悲しみ、感情の解放','Crying, sadness, emotional release',['泣き']);
templateMeta13('angerBurst','emotion','抑えた怒りを手元から表情、発言へ爆発させます。','Escalates contained anger from hands to face to speech.','怒り、口論、感情爆発','Anger, arguments, emotional burst',['怒り']);
templateMeta13('resolve','emotion','迷いから決意へ、視線とカメラ高さを変えます。','Uses gaze and camera height to move from doubt to resolve.','決意、覚悟、転機','Resolve, turning points, decisions',['決意']);
templateMeta13('presenceBehind','suspense','静けさ→物音→振り返りで不安を作ります。','Builds unease through quiet, sound, and a fearful turn.','ホラー、サスペンス、背後の気配','Horror, suspense, unseen presence',['ホラー']);
templateMeta13('classroomTalk','daily','引き・話者・聞き手・関係ショットを混ぜた会話です。','Mixes establishing, speaker, listener, and relationship shots.','教室、日常会話、二人芝居','Classrooms, casual dialogue, two-person scenes',['会話']);
templateMeta13('smugFail','comedy','ドヤ顔から派手な失敗、無言のオチへ落とします。','Drops from smug confidence into failure and a silent punchline.','失敗ギャグ、リアクション','Failure comedy, reaction jokes',['失敗']);
templateMeta13('characterIntro','character','全身・特徴・表情・決めカットで人物を紹介します。','Introduces a character through full body, trait, expression, and signature shot.','新キャラ登場、プロフィール紹介','New character introductions, profile-style pages',['紹介']);

const categoryKeys13={all:'templateCategoryAll',romance:'templateCategoryRomance',battle:'templateCategoryBattle',emotion:'templateCategoryEmotion',daily:'templateCategoryDaily',comedy:'templateCategoryComedy',suspense:'templateCategorySuspense',character:'templateCategoryCharacter',custom:'templateCategoryCustom'};
function localized13x(value){return typeof value==='string'?value:(value?.[language]||value?.ja||value?.en||'')}
function storyName13(id,tpl=storyTemplates11[id]){if(tpl?.customName)return tpl.customName;return tpl?.label?t(tpl.label):id}
function selectedTemplateId13(){return $('storyTemplateSelect11')?.value||''}

function loadCustomTemplates13(){try{const raw=JSON.parse(localStorage.getItem(CUSTOM_TEMPLATE_KEY_13)||'[]');return Array.isArray(raw)?raw:[]}catch{return []}}
function saveCustomTemplates13(list){localStorage.setItem(CUSTOM_TEMPLATE_KEY_13,JSON.stringify(list))}
function registerCustomTemplates13(){
  for(const key of Object.keys(storyTemplates11))if(key.startsWith('custom13:'))delete storyTemplates11[key];
  for(const item of loadCustomTemplates13()){
    const id=`custom13:${item.id}`;storyTemplates11[id]={...item.template,customName:item.name,customId:item.id};
    meta13[id]={category:'custom',desc:item.description||{ja:'保存したページ構成を再利用します。',en:'Reuses a saved page pattern.'},use:{ja:'自分専用の繰り返し構成',en:'Your own recurring page patterns'},tags:['custom']};
  }
}
registerCustomTemplates13();

function templateRects13(tpl,size){
  if(Array.isArray(tpl.normalizedRects))return tpl.normalizedRects.map(r=>({x:r.x*size.w,y:r.y*size.h,w:r.w*size.w,h:r.h*size.h}));
  return layoutRects04(tpl.layout,size.w,size.h);
}
function templateThumb13(tpl){
  const size={w:100,h:132},rects=templateRects13(tpl,size);return `<div class="template-thumb13">${rects.map((r,i)=>`<span style="left:${r.x}%;top:${r.y/1.32}%;width:${r.w}%;height:${r.h/1.32}%">${i+1}</span>`).join('')}</div>`;
}
function beatPreview13(tpl){return (tpl.beats||[]).map((b,i)=>`${i+1}. ${localized13x(b.action)}`).join(' → ')}
function templatePanelCount13(tpl){return Array.isArray(tpl.beats)?tpl.beats.length:0}
function templateMatches13(id,tpl,category,q){const m=meta13[id]||{category:'daily',desc:{ja:'',en:''},use:{ja:'',en:''},tags:[]};if(category!=='all'&&m.category!==category)return false;if(!q)return true;const hay=[storyName13(id,tpl),localized13x(m.desc),localized13x(m.use),...(m.tags||[]),...(tpl.beats||[]).map(b=>localized13x(b.action))].join(' ').toLowerCase();return hay.includes(q.toLowerCase())}

function syncTemplateSelect13(){
  const sel=$('storyTemplateSelect11');if(!sel)return;const current=sel.value;sel.innerHTML=`<option value="">${escapeXml(t('storyTemplateNone'))}</option>`+Object.entries(storyTemplates11).filter(([id])=>id!==DERIVED_TEMPLATE_ID_13).map(([id,tpl])=>`<option value="${escapeXml(id)}">${escapeXml(storyName13(id,tpl))}</option>`).join('');if(storyTemplates11[current])sel.value=current;
}
function renderTemplateGallery13(){
  const box=$('templateGallery13');if(!box)return;const category=$('templateCategory13')?.value||'all',q=$('templateSearch13')?.value?.trim()||'',selected=selectedTemplateId13();
  const entries=Object.entries(storyTemplates11).filter(([id,tpl])=>id!==DERIVED_TEMPLATE_ID_13&&templateMatches13(id,tpl,category,q));
  box.innerHTML=entries.length?entries.map(([id,tpl])=>{const m=meta13[id]||{},custom=id.startsWith('custom13:');return `<article class="template-card13 ${selected===id?'selected':''}" data-template-card13="${escapeXml(id)}"><button type="button" class="template-card-main13" data-template-pick13="${escapeXml(id)}">${templateThumb13(tpl)}<span class="template-card-copy13"><strong>${escapeXml(storyName13(id,tpl))}</strong><small>${templatePanelCount13(tpl)} ${escapeXml(t('templatePanels'))} · ${escapeXml(t(categoryKeys13[m.category]||'templateCategoryDaily'))}</small><span>${escapeXml(localized13x(m.desc)||'')}</span></span></button>${custom?`<button type="button" class="template-delete13" data-template-delete13="${escapeXml(id)}">${escapeXml(t('templateDelete'))}</button>`:''}</article>`}).join(''):`<p class="help">${escapeXml(t('templateNoMatch'))}</p>`;
}
function renderTemplatePreview13(){
  const box=$('storyTemplatePreview11');if(!box)return;const id=selectedTemplateId13(),tpl=storyTemplates11[id];if(!tpl){box.innerHTML=`<span>${escapeXml(t('storyTemplateHelp'))}</span>`;return}const m=meta13[id]||{};box.innerHTML=`<div class="template-preview-head13">${templateThumb13(tpl)}<div><strong>${escapeXml(storyName13(id,tpl))}</strong><p>${escapeXml(localized13x(m.desc)||'')}</p><small><b>${escapeXml(t('templateUseCase'))}:</b> ${escapeXml(localized13x(m.use)||'—')}</small></div></div><div class="template-flow13"><b>${escapeXml(t('templateBeats'))}</b><span>${escapeXml(beatPreview13(tpl))}</span></div>${id===DERIVED_TEMPLATE_ID_13?`<p class="derived-note13">${escapeXml(t('templateDeriveReady'))}</p>`:''}`;
}
function selectTemplate13(id){const sel=$('storyTemplateSelect11');if(!sel||!storyTemplates11[id])return;sel.value=id;renderTemplateGallery13();renderTemplatePreview13()}

function applyTemplate13(){
  const id=selectedTemplateId13(),tpl=storyTemplates11[id];if(!tpl)return;const page=currentPage(),hasAuthored=page.panels.some(p=>p.characters?.length||p.balloons?.length||p.effects?.sfxText||p.actionIntent);if(hasAuthored&&!confirm(t('storyTemplateConfirm')))return;
  const withText=$('storyTemplateText11')?.checked!==false,base=currentBaseCharacter06?.()||project.characterLibrary?.[0]||null,size=pageSize04(),rects=templateRects13(tpl,size),defaultBg=tpl.background?.[language]||tpl.background?.ja||{};
  mutate(()=>{
    page.panels=rects.map((r,i)=>makePanel(r,i+1));project.meta.layoutPreset=tpl.layout||'custom';project.meta.storyTemplate=id===DERIVED_TEMPLATE_ID_13?`${derivedBaseId13}:derived`:id;project.meta.randomPurpose='';project.meta.randomSeed='';project.meta.randomVariant=undefined;
    page.panels.forEach((panel,i)=>{const beat=tpl.beats[i]||tpl.beats.at(-1)||{};panel.role=beat.role||'setup';panel.actionIntent=localized13x(beat.action);Object.assign(panel.camera,{distance:beat.camera?.[0]||'medium',angle:beat.camera?.[1]||'eye-level',viewpoint:beat.camera?.[2]||'front'});Object.assign(panel.background,beat.background?.[language]||beat.background?.ja||defaultBg);panel.effects.lineEffect=beat.lineEffect||'none';panel.effects.strength=beat.lineEffect?'high':'medium';panel.style.breakout=beat.breakout||'none';if(base)panel.characters=[makeStoryInstance11(base,panel,beat)];if(withText&&beat.dialogue)panel.balloons=[makeStoryBalloon11(panel,localized13x(beat.dialogue),base,beat.balloonType||'speech')];if(withText&&beat.sfx)panel.effects.sfxText=localized13x(beat.sfx)});
    renumberPanels();selectedPanelId=page.panels.find(p=>p.order===1)?.id||page.panels[0]?.id||null;selectedCharacterId=null;selectedBalloonId=null;
  });
}

function rand13(list){return list[Math.floor(Math.random()*list.length)]}
function deriveTemplate13(){
  const baseId=selectedTemplateId13();if(!baseId||baseId===DERIVED_TEMPLATE_ID_13)return;const source=storyTemplates11[baseId];if(!source)return;const copy=structuredClone(source),distanceAlt={long:['long','medium'],medium:['medium','close','long'],close:['close','medium','extreme-close'],'extreme-close':['extreme-close','close']},angleAlt={'eye-level':['eye-level','low-angle','high-angle'],'low-angle':['low-angle','eye-level'],'high-angle':['high-angle','eye-level'],'dutch-angle':['dutch-angle','eye-level']};
  copy.beats=(copy.beats||[]).map((b,i)=>{const x=structuredClone(b);if(i>0||Math.random()>.45){x.camera=x.camera||['medium','eye-level','front'];x.camera[0]=rand13(distanceAlt[x.camera[0]]||[x.camera[0]]);x.camera[1]=rand13(angleAlt[x.camera[1]]||[x.camera[1]])}if(['battle','emotion','romance'].includes(meta13[baseId]?.category)&&Math.random()>.55)x.lineEffect=x.lineEffect==='none'||!x.lineEffect?'focus':x.lineEffect;return x});
  copy.label='templateDerivedLabel';copy.customName=`${storyName13(baseId,source)} · ${t('templateDerivedLabel')}`;storyTemplates11[DERIVED_TEMPLATE_ID_13]=copy;meta13[DERIVED_TEMPLATE_ID_13]={...(meta13[baseId]||{}),desc:{ja:t('templateDeriveReady'),en:t('templateDeriveReady')}};derivedBaseId13=baseId;
  const sel=$('storyTemplateSelect11');if(sel){sel.querySelector(`option[value="${DERIVED_TEMPLATE_ID_13}"]`)?.remove();const o=document.createElement('option');o.value=DERIVED_TEMPLATE_ID_13;o.textContent=copy.customName;sel.appendChild(o);sel.value=DERIVED_TEMPLATE_ID_13}renderTemplateGallery13();renderTemplatePreview13();
}

function captureCurrentTemplate13(name){
  const page=currentPage(),size=pageSize04(),ordered=[...page.panels].sort((a,b)=>a.order-b.order),normalizedRects=ordered.map(p=>{const r=panelRect(p);return {x:r.x/size.w,y:r.y/size.h,w:r.w/size.w,h:r.h/size.h}}),beats=ordered.map(p=>{const ch=p.characters?.[0];const dialogue=panelDialogue11(p)[0]||'';return {role:p.role||'setup',action:{ja:p.actionIntent||'',en:p.actionIntent||''},pose:ch?.poseId||'stand',expression:ch?.expression?.type||'neutral',gaze:ch?.gaze?.target||'camera',camera:[p.camera?.distance||'medium',p.camera?.angle||'eye-level',p.camera?.viewpoint||'front'],background:{ja:structuredClone(p.background||{}),en:structuredClone(p.background||{})},dialogue:dialogue?{ja:dialogue,en:dialogue}:undefined,sfx:p.effects?.sfxText?{ja:p.effects.sfxText,en:p.effects.sfxText}:undefined,lineEffect:p.effects?.lineEffect||'none',breakout:p.style?.breakout||'none'}});
  return {id:`${Date.now()}-${Math.random().toString(36).slice(2,8)}`,name,template:{customName:name,layout:'custom',normalizedRects,beats},description:{ja:'現在のページから保存した自作テンプレートです。',en:'Custom template saved from the current page.'}};
}
function openSaveTemplateDialog13(){const d=$('customTemplateDialog13');if(!d)return;$('customTemplateName13').value='';if(!d.open)d.showModal()}
function saveCurrentTemplate13(){const input=$('customTemplateName13'),name=input?.value?.trim();if(!name){input?.focus();return}const list=loadCustomTemplates13();list.push(captureCurrentTemplate13(name));saveCustomTemplates13(list);registerCustomTemplates13();syncTemplateSelect13();renderTemplateGallery13();$('customTemplateDialog13')?.close();toast?.(t('templateSaved'))}
function deleteCustomTemplate13(id){const tpl=storyTemplates11[id];if(!tpl?.customId||!confirm(t('templateDeleteConfirm')))return;saveCustomTemplates13(loadCustomTemplates13().filter(x=>x.id!==tpl.customId));if(selectedTemplateId13()===id)$('storyTemplateSelect11').value='';registerCustomTemplates13();syncTemplateSelect13();renderTemplateGallery13();renderTemplatePreview13()}

function injectTemplateStudio13(){
  const block=$('storyTemplateBlock11');if(!block||$('templateStudio13'))return;block.querySelector('.subhead')?.setAttribute('data-i18n','templateStudio');block.querySelector('.help')?.setAttribute('data-i18n','templateStudioLead');
  const top=document.createElement('div');top.id='templateStudio13';top.innerHTML=`<div class="template-filter13"><label><span data-i18n="templateCategory"></span><select id="templateCategory13">${Object.entries(categoryKeys13).map(([v,k])=>`<option value="${v}" data-i18n="${k}"></option>`).join('')}</select></label><label><span data-i18n="templateSearch"></span><input id="templateSearch13" type="search" data-i18n-placeholder="templateSearchPlaceholder"/></label></div><div id="templateGallery13" class="template-gallery13"></div><div class="button-grid template-tools13"><button id="deriveTemplate13" type="button" data-i18n="templateDerive"></button><button id="saveCurrentTemplate13" type="button" data-i18n="templateSaveCurrent"></button></div><p class="help" data-i18n="templateCustomNote"></p>`;
  const firstLabel=block.querySelector('label');firstLabel?.insertAdjacentElement('beforebegin',top);
  if(!$('customTemplateDialog13')){const d=document.createElement('dialog');d.id='customTemplateDialog13';d.className='modal';d.innerHTML=`<form method="dialog" class="modal-card"><div class="section-title-row"><h2 data-i18n="templateSaveTitle"></h2><button value="close" aria-label="Close">×</button></div><label><span data-i18n="templateSaveName"></span><input id="customTemplateName13" data-i18n-placeholder="templateSaveNamePlaceholder"/></label><p class="help" data-i18n="templateCustomNote"></p><div class="dialog-actions"><button value="close" type="button" onclick="this.closest('dialog').close()">Cancel</button><button id="confirmSaveTemplate13" type="button" class="primary" data-i18n="templateSave"></button></div></form>`;document.body.appendChild(d)}
  const style=document.createElement('style');style.id='prototype09Style13';style.textContent=`
    .template-filter13{display:grid;grid-template-columns:1fr 1.4fr;gap:8px}.template-gallery13{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;max-height:420px;overflow:auto;padding:2px}.template-card13{border:1px solid #d7dee8;border-radius:12px;background:#fff;overflow:hidden;display:grid}.template-card13.selected{border:2px solid #111827}.template-card-main13{display:grid;grid-template-columns:76px 1fr;gap:9px;text-align:left;border:0;border-radius:0;min-height:112px;padding:8px}.template-card-copy13{display:grid;align-content:start;gap:3px;min-width:0}.template-card-copy13 strong{font-size:.84rem}.template-card-copy13 small{font-size:.7rem;color:#667085}.template-card-copy13>span{font-size:.74rem;line-height:1.35;color:#475467}.template-delete13{border:0;border-top:1px solid #eee;border-radius:0;min-height:34px;font-size:.72rem;color:#b42318}.template-thumb13{position:relative;width:72px;height:96px;background:#eef1f5;border:1px solid #cfd6df;border-radius:6px;overflow:hidden;flex:none}.template-thumb13 span{position:absolute;display:grid;place-items:center;background:#fff;border:1.5px solid #111827;font-size:9px;font-weight:800;min-width:5px;min-height:5px}.template-preview-head13{display:flex;gap:10px;align-items:flex-start}.template-preview-head13>div{display:grid;gap:4px}.template-preview-head13 p{margin:0;font-size:.78rem}.template-preview-head13 small{font-size:.72rem}.template-flow13{display:grid;gap:3px;margin-top:9px;border-top:1px solid #e5e7eb;padding-top:8px}.template-flow13 span{font-size:.76rem;line-height:1.45}.derived-note13{margin:8px 0 0;padding:7px;border-radius:8px;background:#eef6ff;font-size:.74rem}.template-tools13{margin-top:9px}
    @media(max-width:760px){.template-filter13{grid-template-columns:1fr}.template-gallery13{grid-template-columns:1fr;max-height:52vh}.template-card-main13{grid-template-columns:68px 1fr}.template-thumb13{width:64px;height:86px}.template-tools13{grid-template-columns:1fr}.template-preview-head13 .template-thumb13{display:none}}
  `;document.head.appendChild(style);
  syncTemplateSelect13();
  const oldApply=$('applyStoryTemplate11');if(oldApply){const fresh=oldApply.cloneNode(true);oldApply.replaceWith(fresh);fresh.addEventListener('click',applyTemplate13)}
  $('templateCategory13')?.addEventListener('change',renderTemplateGallery13);$('templateSearch13')?.addEventListener('input',renderTemplateGallery13);$('storyTemplateSelect11')?.addEventListener('change',()=>queueMicrotask(()=>{renderTemplateGallery13();renderTemplatePreview13()}));$('deriveTemplate13')?.addEventListener('click',deriveTemplate13);$('saveCurrentTemplate13')?.addEventListener('click',openSaveTemplateDialog13);$('confirmSaveTemplate13')?.addEventListener('click',saveCurrentTemplate13);
  $('templateGallery13')?.addEventListener('click',e=>{const pick=e.target.closest('[data-template-pick13]');if(pick){selectTemplate13(pick.dataset.templatePick13);return}const del=e.target.closest('[data-template-delete13]');if(del)deleteCustomTemplate13(del.dataset.templateDelete13)});
}

const applyLanguage12Base13=applyLanguage;
applyLanguage=function(){applyLanguage12Base13();const s=$('templateSearch13');if(s)s.placeholder=t('templateSearchPlaceholder');renderTemplateGallery13();renderTemplatePreview13()};
injectTemplateStudio13();applyLanguage();renderTemplateGallery13();renderTemplatePreview13();
document.querySelector('footer')&&(document.querySelector('footer').textContent='Prototype 0.9 · Client-side only · Local autosave');
