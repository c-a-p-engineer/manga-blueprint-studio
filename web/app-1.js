const PAGE_W = 800;
const PAGE_H = 1130;
const GUTTER = 18;
const STORAGE_KEY = 'manga-blueprint-studio/0.3';
const LANG_KEY = 'manga-blueprint-studio/lang';
const HISTORY_LIMIT = 50;

const $ = id => document.getElementById(id);
const svg = $('blueprintSvg');
const clone = value => structuredClone(value);
const uid = prefix => `${prefix}_${Math.random().toString(36).slice(2,8)}${Date.now().toString(36).slice(-4)}`;
const escapeXml = (value='') => String(value).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[m]));

const i18n = {
  ja:{
    tagline:'漫画演出を設計し、AIへ安全に渡すBlueprintエディタ',undo:'元に戻す',redo:'やり直す',canvasHelp:'コマ・人物・吹き出しをタップして編集します。',safeExportNote:'AI用PNGではキャラ名・コマ番号・カメラ注記などの制作メタ文字を自動除去します。',
    tabPage:'ページ',tabPanel:'コマ',tabCharacter:'キャラ',tabBackground:'背景',tabText:'文字',tabEffects:'演出',tabOutput:'出力',pageHeading:'ページ',templateLabel:'テンプレート',splitVertical:'左右に分割',splitHorizontal:'上下に分割',renumber:'読み順で番号振り直し',pageHelp:'日本漫画は右→左を既定にしています。',
    panelHeading:'選択中のコマ',deletePanel:'削除',narrativeRole:'コマの役割',cameraHeading:'カメラ',cameraDistance:'距離',cameraAngle:'高さ・角度',cameraViewpoint:'視点方向',cameraFocus:'主対象・構図メモ',cameraIntent:'演出意図',frameHeading:'コマ枠',borderStyle:'枠タイプ',bleedEdge:'断ち切り',breakoutMode:'ブチ抜き',
    charactersHeading:'キャラクター',addCharacter:'＋ 追加',selectCharacter:'棒人間を選択してください。',displayName:'表示名',referenceKey:'Character Sheet参照キー',poseLabel:'ポーズ',expressionLabel:'表情',expressionIntensity:'表情強度',expressionNotes:'表情メモ',gazeLabel:'視線',gazeNotes:'視線メモ',scaleLabel:'スケール',rotationLabel:'回転',deleteCharacter:'キャラを削除',
    backgroundHeading:'背景',locationLabel:'場所',timeLabel:'時間帯',weatherLabel:'天気',moodLabel:'雰囲気',detailLabel:'描き込み量',renderModeLabel:'背景の見せ方',backgroundNotes:'背景メモ',
    balloonsHeading:'吹き出し',addBalloon:'＋ 吹き出し',balloonType:'種類',speaker:'話者',balloonText:'内容',balloonSize:'サイズ',deleteBalloon:'吹き出しを削除',textSafetyHeading:'AI文字出力の安全策',textSafetyHelp:'AI用PNGでは吹き出し位置だけ残し、本文はPrompt側へ渡します。これによりキャラ名などの誤写植を減らします。',
    effectsHeading:'漫画演出',lineEffect:'効果線',effectStrength:'強度',onomatopoeia:'オノマトペ',sfxStyle:'文字演出',effectNotes:'演出メモ',outputHeading:'出力',exportAiPng:'AI用クリーンPNG',exportAnnotatedPng:'確認用注釈PNG',importJson:'JSON読込',promptHeading:'生成プロンプト',copy:'コピー',
    metaWarning:'完成絵に表示してよい文字は「吹き出し本文」と「オノマトペ」だけ。キャラ名・Character ID・カメラ注記・コマ番号は描画禁止としてPromptへ明記します。'
  },
  en:{
    tagline:'Design manga direction and hand it to AI without leaking authoring labels',undo:'Undo',redo:'Redo',canvasHelp:'Tap panels, figures, and balloons to edit them.',safeExportNote:'AI PNG automatically removes authoring text such as character names, panel numbers, and camera annotations.',
    tabPage:'Page',tabPanel:'Panel',tabCharacter:'Character',tabBackground:'Background',tabText:'Text',tabEffects:'Effects',tabOutput:'Output',pageHeading:'Page',templateLabel:'Template',splitVertical:'Split L/R',splitHorizontal:'Split T/B',renumber:'Renumber by reading order',pageHelp:'Japanese right-to-left reading is the default.',
    panelHeading:'Selected panel',deletePanel:'Delete',narrativeRole:'Narrative role',cameraHeading:'Camera',cameraDistance:'Distance',cameraAngle:'Height / angle',cameraViewpoint:'View direction',cameraFocus:'Primary subject / composition',cameraIntent:'Dramatic intent',frameHeading:'Panel frame',borderStyle:'Border style',bleedEdge:'Bleed',breakoutMode:'Breakout',
    charactersHeading:'Characters',addCharacter:'+ Add',selectCharacter:'Select a stick figure.',displayName:'Display name',referenceKey:'Character Sheet reference key',poseLabel:'Pose',expressionLabel:'Expression',expressionIntensity:'Expression intensity',expressionNotes:'Expression notes',gazeLabel:'Gaze',gazeNotes:'Gaze notes',scaleLabel:'Scale',rotationLabel:'Rotation',deleteCharacter:'Delete character',
    backgroundHeading:'Background',locationLabel:'Location',timeLabel:'Time of day',weatherLabel:'Weather',moodLabel:'Mood',detailLabel:'Detail level',renderModeLabel:'Background treatment',backgroundNotes:'Background notes',
    balloonsHeading:'Balloons',addBalloon:'+ Balloon',balloonType:'Type',speaker:'Speaker',balloonText:'Text',balloonSize:'Size',deleteBalloon:'Delete balloon',textSafetyHeading:'AI text safety',textSafetyHelp:'AI PNG keeps balloon placement but removes text. Exact text is carried in the prompt, reducing accidental rendering of authoring labels.',
    effectsHeading:'Manga effects',lineEffect:'Line effect',effectStrength:'Strength',onomatopoeia:'Onomatopoeia',sfxStyle:'SFX style',effectNotes:'Effect notes',outputHeading:'Output',exportAiPng:'Clean AI PNG',exportAnnotatedPng:'Annotated review PNG',importJson:'Import JSON',promptHeading:'Generation prompt',copy:'Copy',
    metaWarning:'Only dialogue and onomatopoeia may appear as visible text. Character names, IDs, camera metadata, and panel numbers are explicitly forbidden from final art.'
  }
};

const cameraHelp = {
  distance:{
    'extreme-long':['遠景。人物より場所・スケール・孤立感を見せる。','Very wide establishing view; emphasizes environment and scale.'],
    'long':['全身が読みやすい。アクション開始、立ち位置、姿勢の説明向き。','Full-body framing for action and spatial relationships.'],
    'medium':['腰〜膝上中心。会話と身体演技のバランスが良い。','Balances dialogue, gesture, and body language.'],
    'close':['顔〜胸元中心。表情や感情を強調する。','Emphasizes face, emotion, and reaction.'],
    'extreme-close':['目・口・拳など一部を大きく切り取る。緊張、決め、情報強調向き。','Isolates a detail such as eyes or a fist for tension and emphasis.']
  },
  angle:{
    'eye-level':['水平。中立で自然。会話や状況説明に使いやすい。','Neutral, natural perspective.'],
    'low-angle':['下から見上げる。強さ、威圧感、ヒロイックさ、迫力を出しやすい。','Looks upward; useful for power, intimidation, and heroic impact.'],
    'high-angle':['上から見下ろす。弱さ、孤立、位置関係の説明に向く。','Looks downward; useful for vulnerability, isolation, and spatial clarity.'],
    'birds-eye':['真上に近い俯瞰。配置や群衆、迷路的空間を見せる。','Near top-down; strong for layout and spatial overview.'],
    'worms-eye':['地面近くからほぼ真上。極端な巨大感や迫力。','Near-ground upward view; creates extreme scale and force.'],
    'dutch-angle':['画面を傾ける。不安、不穏、衝撃、混乱を演出する。','Tilted horizon for unease, shock, or instability.'],
    'over-shoulder':['肩越し。対話相手・対立関係・視線の方向を明確にする。','Over-the-shoulder framing clarifies dialogue and confrontation.']
  },
  viewpoint:{
    front:['正面。表情・対称性・対峙を見せやすい。','Front view for expression and confrontation.'],
    'three-quarter-front':['斜め前。立体感と表情の両方を得やすい定番。','Three-quarter front view balances depth and facial readability.'],
    side:['横。移動方向、対峙、シルエットを明確にする。','Side view clarifies movement direction and silhouette.'],
    'three-quarter-back':['斜め後ろ。振り向き、距離感、相手を見る構図に強い。','Three-quarter back view supports look-back poses and relational depth.'],
    back:['背面。未知、孤独、対象を見る人物の気持ちを見せる。','Back view can emphasize mystery, isolation, or observation.'],
    pov:['主観視点。読者を人物の視点に置く。','Point-of-view shot places the reader inside the character viewpoint.'],
    'near-object':['拳・足・小物のすぐ近くにカメラを置き、短縮遠近を強くする。','Camera sits near an object such as a fist or foot for strong foreshortening.']
  }
};

const posePresets = {
  stand:{ja:'立つ',en:'Stand',description:'neutral standing pose, balanced weight, torso upright, arms relaxed',joints:{head:[0,-72],neck:[0,-48],shoulderL:[-28,-40],shoulderR:[28,-40],elbowL:[-35,-5],elbowR:[35,-5],handL:[-36,30],handR:[36,30],hip:[0,12],kneeL:[-18,55],kneeR:[18,55],footL:[-24,98],footR:[24,98]}},
  run:{ja:'走る',en:'Run',description:'running stride, torso leaning forward, opposite arm and leg drive, clear forward momentum',joints:{head:[10,-68],neck:[4,-45],shoulderL:[-25,-34],shoulderR:[31,-38],elbowL:[-51,-8],elbowR:[50,-18],handL:[-25,18],handR:[23,-5],hip:[0,13],kneeL:[-45,50],kneeR:[43,49],footL:[-74,72],footR:[22,96]}},
  jump:{ja:'飛ぶ',en:'Jump',description:'airborne jump, no ground support, knees bent, dynamic silhouette',joints:{head:[0,-70],neck:[0,-46],shoulderL:[-28,-37],shoulderR:[28,-37],elbowL:[-57,-60],elbowR:[57,-60],handL:[-78,-38],handR:[78,-38],hip:[0,13],kneeL:[-42,45],kneeR:[42,45],footL:[-13,76],footR:[13,76]}},
  crouch:{ja:'しゃがむ',en:'Crouch',description:'low crouching pose, center of gravity lowered, knees deeply bent',joints:{head:[8,-42],neck:[3,-20],shoulderL:[-25,-12],shoulderR:[29,-14],elbowL:[-40,12],elbowR:[41,8],handL:[-20,30],handR:[22,29],hip:[0,28],kneeL:[-42,50],kneeR:[41,50],footL:[-63,73],footR:[62,73]}},
  punch:{ja:'右ストレート',en:'Right straight',description:'committed right straight punch, weight driven forward, right shoulder rotated forward, punching arm extended, guard hand retained',joints:{head:[-5,-66],neck:[0,-44],shoulderL:[-30,-37],shoulderR:[30,-34],elbowL:[-42,-3],elbowR:[75,-30],handL:[-15,-7],handR:[124,-27],hip:[0,15],kneeL:[-35,55],kneeR:[40,60],footL:[-48,95],footR:[70,90]}},
  lookback:{ja:'振り向く',en:'Look back',description:'body oriented away while upper torso and head turn back, asymmetric shoulder and pelvis relationship',joints:{head:[20,-70],neck:[4,-47],shoulderL:[-32,-38],shoulderR:[26,-32],elbowL:[-36,-2],elbowR:[31,4],handL:[-24,30],handR:[17,35],hip:[-4,14],kneeL:[-22,57],kneeR:[15,58],footL:[-34,98],footR:[22,98]}}
};

const templates = {
  action3:[{x:410,y:35,w:355,h:350},{x:35,y:35,w:355,h:350},{x:35,y:405,w:730,h:690}],
  four:[{x:410,y:35,w:355,h:520},{x:35,y:35,w:355,h:520},{x:410,y:575,w:355,h:520},{x:35,y:575,w:355,h:520}],
  single:[{x:35,y:35,w:730,h:1060}]
};

const defaultCamera = () => ({distance:'medium',angle:'eye-level',viewpoint:'three-quarter-front',focus:'',intent:''});
const defaultStyle = () => ({border:'normal',bleed:'none',breakout:'none'});
const defaultBackground = () => ({location:'',timeOfDay:'',weather:'',mood:'',detailLevel:'medium',renderMode:'normal',notes:''});
const defaultEffects = () => ({lineEffect:'none',strength:'medium',sfxText:'',sfxStyle:'impact',notes:''});
const makePanel = (rect,order) => ({id:uid('panel'),order,rect:{...rect},role:'setup',style:defaultStyle(),camera:defaultCamera(),background:defaultBackground(),effects:defaultEffects(),characters:[],balloons:[]});
const makeProject = (template='action3') => ({format:'manga-blueprint/0.2',meta:{title:'Untitled Manga Blueprint',readingDirection:'rtl',pageWidth:PAGE_W,pageHeight:PAGE_H},pages:[{id:'page_1',panels:templates[template].map((r,i)=>makePanel(r,i+1))}]});

function normalizeProject(input){
  const p=clone(input);
  if(!p || !Array.isArray(p.pages) || !p.pages.length) return makeProject();
  p.format='manga-blueprint/0.2';
  p.meta ||= {title:'Untitled Manga Blueprint',readingDirection:'rtl',pageWidth:PAGE_W,pageHeight:PAGE_H};
  p.meta.readingDirection ||= 'rtl'; p.meta.pageWidth ||= PAGE_W; p.meta.pageHeight ||= PAGE_H;
  for(const page of p.pages){
    page.panels ||= [];
    for(const panel of page.panels){
      panel.role ||= 'setup';
      panel.style={...defaultStyle(),...(panel.style||{})};
      panel.camera={...defaultCamera(),...(panel.camera||{})};
      panel.background={...defaultBackground(),...(panel.background||{})};
      panel.effects={...defaultEffects(),...(panel.effects||{})};
      panel.characters ||= [];
      panel.balloons ||= [];
      for(const ch of panel.characters){
        ch.referenceKey ||= '';
        ch.poseId ||= 'stand';
        ch.scale=Number(ch.scale||1); ch.rotation=Number(ch.rotation||0);
        ch.expression={type:'neutral',intensity:0.5,notes:'',...(ch.expression||{})};
        ch.gaze={target:'camera',notes:'',...(ch.gaze||{})};
      }
      for(const b of panel.balloons){
        b.id ||= uid('balloon'); b.type ||= 'speech'; b.speakerId ||= '';
        b.text ||= ''; b.x=Number(b.x ?? panel.rect.x+panel.rect.w*.7); b.y=Number(b.y ?? panel.rect.y+80); b.size=Number(b.size||1);
      }
    }
  }
  return p;
}

