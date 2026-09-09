// Prototype 0.4: beginner-friendly page/layout presets, smart random setup,
// dynamic canvas size, camera vocabulary, panel summaries, and onboarding help.
const HELP_SEEN_KEY_04='manga-blueprint-studio/help-seen/0.4';

Object.assign(i18n.ja,{
  help:'使い方',randomCreate:'おまかせ作成',canvasSize:'原稿サイズ',canvasWidth:'幅',canvasHeight:'高さ',applySize:'このサイズを適用',panelLayout:'コマ割り',panelOverviewHeading:'コマ一覧',panelOverviewHelp:'各コマの内容を1行で確認できます。タップするとそのコマを選択します。',quickCamera:'かんたんカメラ',
  helpTitle:'はじめての使い方',helpLead:'難しい漫画用語を覚えなくても、ページ→コマ→キャラ→背景→文字→演出の順に決めれば使えます。',helpStep1Title:'原稿サイズとコマ割りを選ぶ',helpStep1Body:'迷ったら「現行サイズ」と「アクション3コマ」、または「おまかせ作成」で開始。',helpStep2Title:'コマをタップしてキャラを置く',helpStep2Body:'棒人間は外見ではなく、位置とポーズをAIへ伝える設計図です。',helpStep3Title:'カメラ・背景・吹き出し・演出を決める',helpStep3Body:'専門語には「超寄り」「あおり」のような日本語説明を併記しています。',helpStep4Title:'AI用PNG + JSON + Promptを出力',helpStep4Body:'AI用PNGからキャラ名やコマ番号は除去され、描画してよい文字だけPromptへ渡されます。',cheatClose:'寄り',cheatCloseBody:'顔や感情を見せる',cheatLong:'引き',cheatLongBody:'全身や位置関係を見せる',cheatLow:'あおり',cheatLowBody:'下から見上げて強く見せる',cheatHigh:'ふかん',cheatHighBody:'上から見下ろして弱さや全体を見せる',closeHelp:'使ってみる',
  randomTitle:'おまかせ作成',randomLead:'用途とコマ数から、漫画として成立しやすいレイアウトとカメラの初期案を作ります。あとから全部編集できます。',randomPurpose:'用途',randomPanelCount:'コマ数',randomKeepSize:'現在の原稿サイズを使う',cancel:'キャンセル',generateRandom:'作成する'
});
Object.assign(i18n.en,{
  help:'Help',randomCreate:'Smart setup',canvasSize:'Canvas size',canvasWidth:'Width',canvasHeight:'Height',applySize:'Apply this size',panelLayout:'Panel layout',panelOverviewHeading:'Panel overview',panelOverviewHelp:'See each panel at a glance. Tap a row to select that panel.',quickCamera:'Easy camera',
  helpTitle:'Quick start',helpLead:'You do not need to memorize film or manga terminology. Decide Page → Panel → Character → Background → Text → Effects.',helpStep1Title:'Choose canvas and layout',helpStep1Body:'If unsure, start with Standard + Action 3-panel, or use Smart setup.',helpStep2Title:'Tap a panel and place characters',helpStep2Body:'Stick figures define position and pose, not character appearance.',helpStep3Title:'Set camera, background, balloons, and effects',helpStep3Body:'Technical camera terms are paired with plain-language explanations.',helpStep4Title:'Export AI PNG + JSON + Prompt',helpStep4Body:'The clean AI PNG removes authoring labels; only allowed manga text is passed in the prompt.',cheatClose:'close',cheatCloseBody:'show face and emotion',cheatLong:'wide/full body',cheatLongBody:'show full body and spatial relation',cheatLow:'low angle',cheatLowBody:'look upward for power and impact',cheatHigh:'high angle',cheatHighBody:'look downward for vulnerability or overview',closeHelp:'Start editing',
  randomTitle:'Smart setup',randomLead:'Pick a purpose and panel count. The tool chooses a practical layout and initial camera pattern; everything remains editable.',randomPurpose:'Purpose',randomPanelCount:'Panel count',randomKeepSize:'Keep current canvas size',cancel:'Cancel',generateRandom:'Create'
});

const canvasPresets04={
  standard:{w:800,h:1130,ja:'現行サイズ',en:'Standard',helpJa:'現在の既定サイズ。縦長の1ページ漫画に使いやすい。',helpEn:'Current default portrait canvas for a manga page.'},
  square:{w:1080,h:1080,ja:'1:1 正方形',en:'1:1 Square',helpJa:'SNSの単発漫画・正方形投稿向け。',helpEn:'Square canvas for social posts and single-image manga.'},
  portrait45:{w:1080,h:1350,ja:'4:5 縦長SNS',en:'4:5 Portrait',helpJa:'スマホで大きく見せやすい縦長比率。',helpEn:'Portrait social ratio with good mobile visibility.'},
  portrait34:{w:900,h:1200,ja:'3:4 縦長',en:'3:4 Portrait',helpJa:'一般的な縦長イラスト・漫画に使いやすい。',helpEn:'General portrait illustration and manga ratio.'},
  vertical916:{w:1080,h:1920,ja:'9:16 スマホ縦',en:'9:16 Mobile',helpJa:'スマホ全面・縦長コンテンツ向け。',helpEn:'Full-height mobile / story ratio.'},
  landscape169:{w:1600,h:900,ja:'16:9 横長',en:'16:9 Landscape',helpJa:'横長1枚・映像的な構図向け。',helpEn:'Wide cinematic composition.'},
  b5:{w:1031,h:1456,ja:'B5 漫画比率',en:'B5 manga ratio',helpJa:'商業漫画でよく使われるB5系の縦横比を作業座標化。',helpEn:'Working canvas using a B5-like manga page ratio.'},
  a4:{w:1240,h:1754,ja:'A4 比率',en:'A4 ratio',helpJa:'印刷原稿・資料にも使いやすいA4系比率。',helpEn:'A4-like working ratio for print-oriented planning.'},
  webtoon:{w:800,h:2400,ja:'Webtoon 縦長',en:'Webtoon tall',helpJa:'縦スクロール用の長いキャンバス。',helpEn:'Tall canvas for vertical-scroll planning.'},
  custom:{w:null,h:null,ja:'カスタム',en:'Custom',helpJa:'幅と高さを自由指定。',helpEn:'Enter width and height manually.'}
};

const layoutPresets04={
  single:{ja:'1コマ',en:'Single panel',helpJa:'1ページを1つの強い絵に使う。',helpEn:'One strong image fills the page.'},
  'two-columns':{ja:'2コマ 左右',en:'2 panels — columns',helpJa:'対比・二人の会話・Before/After向け。',helpEn:'Good for comparison or two-sided dialogue.'},
  'two-rows':{ja:'2コマ 上下',en:'2 panels — rows',helpJa:'上で導入、下で結果・見せ場を作りやすい。',helpEn:'Setup above, result or payoff below.'},
  'three-vertical':{ja:'3コマ 1×3',en:'3 panels — 1×3',helpJa:'順番に読ませる会話・変化向け。',helpEn:'Linear dialogue or progression.'},
  action3:{ja:'アクション3コマ',en:'Action 3-panel',helpJa:'上2コマで動きを作り、下の大ゴマで決める。',helpEn:'Two setup beats above and a large climax panel below.'},
  'four-vertical':{ja:'4コマ 1×4',en:'4-koma — 1×4',helpJa:'縦に起承転結を読む定番4コマ。',helpEn:'Classic vertical four-panel rhythm.'},
  'four-grid':{ja:'4コマ 2×2',en:'4-koma — 2×2',helpJa:'1ページでまとまりやすい2×2配置。',helpEn:'Compact 2×2 four-panel page.'},
  'four-horizontal':{ja:'4コマ 4×1',en:'4 panels — 4×1',helpJa:'横長原稿で連続動作や比較を見せる。',helpEn:'Four columns for wide canvases and sequential motion.'},
  five:{ja:'5コマ 基本',en:'5-panel basic',helpJa:'4つの小〜中コマ＋最後の大きめコマ。',helpEn:'Four smaller beats plus a larger payoff.'},
  six:{ja:'6コマ 2×3',en:'6 panels — 2×3',helpJa:'情報量が多い会話・細かい反応向け。',helpEn:'Denser grid for dialogue and reactions.'},
  conversation:{ja:'会話向け',en:'Conversation',helpJa:'引き・切り返し・反応を混ぜやすい4コマ構成。',helpEn:'Four-panel pattern suited to establishing, dialogue, and reaction shots.'},
  action:{ja:'アクション向け',en:'Action',helpJa:'小さな動作→大きな結果へ面積差をつける。',helpEn:'Uses area contrast to move from action beats to impact.'},
  climax:{ja:'上3＋下大ゴマ',en:'3 top + big climax',helpJa:'上で溜めて、下半分以上を見せ場に使う。',helpEn:'Build with three small beats, then release into a large climax.'}
};

const cameraDistanceOptions04=[
  ['extreme-long','Extreme long / 超引き — 人物を小さく、場所全体を見せる','Extreme long — show environment and scale'],
  ['long','Long / 引き — 全身や位置関係を見る','Long — show full body and spatial relation'],
  ['medium','Medium / 中距離 — 腰〜膝上、会話と動作の両方','Medium — balance dialogue and body language'],
  ['close','Close / 寄り — 顔〜胸元、表情を見せる','Close — emphasize face and emotion'],
  ['extreme-close','Extreme close / 超寄り — 目・口・手・拳など一部だけを大きく','Extreme close — isolate eyes, mouth, hand, fist, or another detail']
];
const cameraAngleOptions04=[
  ['eye-level','Eye level / 目線の高さ — 自然で中立','Eye level — neutral and natural'],
  ['low-angle','Low angle / あおり — 下から見上げて強く・迫力','Low angle — look upward for power and impact'],
  ['high-angle','High angle / ふかん — 上から見下ろして弱さ・全体','High angle — look downward for vulnerability or overview'],
  ['birds-eye',"Bird's-eye / 真上 — 配置や空間を見せる","Bird's-eye — near top-down spatial overview"],
  ['worms-eye',"Worm's-eye / 真下 — 地面近くから巨大感","Worm's-eye — near-ground upward view for extreme scale"],
  ['dutch-angle','Dutch angle / 傾き — 不安・混乱・衝撃','Dutch angle — tilt for instability or shock'],
  ['over-shoulder','Over shoulder / 肩ごし — 会話相手との関係','Over shoulder — frame dialogue through another character']
];
const cameraViewOptions04=[
  ['front','Front / 正面 — 表情・対峙','Front — expression and confrontation'],
  ['three-quarter-front','3/4 front / 斜め前 — 表情と立体感の定番','3/4 front — readable face with depth'],
  ['side','Side / 横 — 移動方向・シルエット','Side — movement direction and silhouette'],
  ['three-quarter-back','3/4 back / 斜め後ろ — 振り向き・距離感','3/4 back — look-back poses and relational depth'],
  ['back','Back / 背面 — 見ている先・孤独感','Back — observation, mystery, isolation'],
  ['pov','POV / 主観 — 本人の目線','POV — reader sees through the character'],
  ['near-object','Near object / 対象の近く — 拳・足・小物をド迫力','Near object — strong foreshortening near a fist, foot, or prop']
];
const cameraQuick04={
  none:{ja:'指定しない',en:'No quick preset'},
  face:{ja:'顔・表情を見せたい',en:'Show face / emotion',distance:'close',angle:'eye-level',viewpoint:'three-quarter-front'},
  full:{ja:'全身ポーズを見せたい',en:'Show full-body pose',distance:'long',angle:'eye-level',viewpoint:'three-quarter-front'},
  power:{ja:'強く・迫力を出したい',en:'Power / impact',distance:'medium',angle:'low-angle',viewpoint:'three-quarter-front'},
  vulnerable:{ja:'弱さ・孤立を見せたい',en:'Vulnerability / isolation',distance:'long',angle:'high-angle',viewpoint:'front'},
  dialogue:{ja:'会話を見せたい',en:'Dialogue',distance:'medium',angle:'over-shoulder',viewpoint:'three-quarter-front'},
  pov:{ja:'本人目線にしたい',en:'Character POV',distance:'medium',angle:'eye-level',viewpoint:'pov'},
  impact:{ja:'拳・手・小物をド迫力で',en:'Extreme object impact',distance:'extreme-close',angle:'low-angle',viewpoint:'near-object'}
};

const roleLabels04={setup:['導入','Setup'],exposition:['状況説明','Exposition'],reaction:['反応','Reaction'],beat:['間','Beat'],climax:['決め','Climax'],transition:['転換','Transition'],afterglow:['余韻','Afterglow']};
const effectLabels04={none:['効果線なし','No lines'],speed:['スピード線','Speed lines'],focus:['集中線','Focus lines'],impact:['衝撃線','Impact lines'],tension:['緊張線','Tension lines'],silence:['無音・間','Silence / beat']};

const pageSize04=()=>({w:Number(project.meta?.pageWidth)||PAGE_W,h:Number(project.meta?.pageHeight)||PAGE_H});
const clamp04=(n,min,max)=>Math.max(min,Math.min(max,n));
const layoutMetrics04=(w,h)=>{const m=Math.round(clamp04(Math.min(w,h)*.035,16,50));const g=Math.round(clamp04(Math.min(w,h)*.018,12,30));return{m,g,innerW:w-m*2,innerH:h-m*2};};
function gridRects04(w,h,cols,rows){
  const {m,g,innerW,innerH}=layoutMetrics04(w,h);const cw=(innerW-g*(cols-1))/cols,ch=(innerH-g*(rows-1))/rows;const out=[];
  for(let row=0;row<rows;row++)for(let col=0;col<cols;col++)out.push({x:m+col*(cw+g),y:m+row*(ch+g),w:cw,h:ch});
  return out;
}
function layoutRects04(id,w,h){
  const {m,g,innerW,innerH}=layoutMetrics04(w,h);
  if(id==='single')return[{x:m,y:m,w:innerW,h:innerH}];
  if(id==='two-columns')return gridRects04(w,h,2,1);
  if(id==='two-rows')return gridRects04(w,h,1,2);
  if(id==='three-vertical')return gridRects04(w,h,1,3);
  if(id==='four-vertical')return gridRects04(w,h,1,4);
  if(id==='four-grid')return gridRects04(w,h,2,2);
  if(id==='four-horizontal')return gridRects04(w,h,4,1);
  if(id==='six')return gridRects04(w,h,2,3);
  if(id==='action3'){
    const topH=(innerH-g)*.33,bottomH=innerH-g-topH,half=(innerW-g)/2;
    return[{x:m,y:m,w:half,h:topH},{x:m+half+g,y:m,w:half,h:topH},{x:m,y:m+topH+g,w:innerW,h:bottomH}];
  }
  if(id==='five'){
    const rowH=(innerH-g*2)*.26,bottomH=innerH-g*2-rowH*2,half=(innerW-g)/2;
    return[{x:m,y:m,w:half,h:rowH},{x:m+half+g,y:m,w:half,h:rowH},{x:m,y:m+rowH+g,w:half,h:rowH},{x:m+half+g,y:m+rowH+g,w:half,h:rowH},{x:m,y:m+rowH*2+g*2,w:innerW,h:bottomH}];
  }
  if(id==='conversation'){
    const h1=(innerH-g*2)*.30,h2=(innerH-g*2)*.34,h3=innerH-g*2-h1-h2,half=(innerW-g)/2;
    return[{x:m,y:m,w:innerW,h:h1},{x:m,y:m+h1+g,w:half,h:h2},{x:m+half+g,y:m+h1+g,w:half,h:h2},{x:m,y:m+h1+h2+g*2,w:innerW,h:h3}];
  }
  if(id==='action'){
    const topH=(innerH-g*2)*.25,midH=(innerH-g*2)*.27,bottomH=innerH-g*2-topH-midH,half=(innerW-g)/2;
    return[{x:m,y:m,w:half,h:topH},{x:m+half+g,y:m,w:half,h:topH},{x:m,y:m+topH+g,w:innerW,h:midH},{x:m,y:m+topH+midH+g*2,w:innerW,h:bottomH}];
  }
  if(id==='climax'){
    const topH=(innerH-g)*.28,bottomH=innerH-g-topH,third=(innerW-g*2)/3;
    return[{x:m,y:m,w:third,h:topH},{x:m+third+g,y:m,w:third,h:topH},{x:m+(third+g)*2,y:m,w:third,h:topH},{x:m,y:m+topH+g,w:innerW,h:bottomH}];
  }
  return layoutRects04('action3',w,h);
}
function inferCanvasPreset04(w,h){const match=Object.entries(canvasPresets04).find(([id,p])=>id!=='custom'&&p.w===w&&p.h===h);return match?.[0]||'custom';}

const normalizeProject03=normalizeProject;
normalizeProject=function(input){const p=normalizeProject03(input);p.meta.canvasPreset ||= inferCanvasPreset04(Number(p.meta.pageWidth)||PAGE_W,Number(p.meta.pageHeight)||PAGE_H);p.meta.layoutPreset ||= 'custom';return p;};
project=normalizeProject(project);

panelRect=function(panel){
  let {x,y,w,h}=panel.rect;const bleed=panel.style.bleed;const size=pageSize04();
  if(bleed==='top'||bleed==='all'){h+=y;y=0}if(bleed==='left'||bleed==='all'){w+=x;x=0}if(bleed==='right'||bleed==='all')w=size.w-x;if(bleed==='bottom'||bleed==='all')h=size.h-y;
  return{x,y,w,h};
};

function panelSummary04(panel){
  const idx=language==='ja'?0:1;const parts=[];parts.push(roleLabels04[panel.role]?.[idx]||panel.role);
  if(panel.characters?.length){const poses=[...new Set(panel.characters.map(c=>poseLabel(c.poseId).split(' / ')[language==='ja'?0:1]))];parts.push(poses.slice(0,2).join('＋'))}else parts.push(language==='ja'?'人物なし':'No character');
  const dist=cameraDistanceOptions04.find(x=>x[0]===panel.camera.distance),angle=cameraAngleOptions04.find(x=>x[0]===panel.camera.angle);if(dist)parts.push(language==='ja'?dist[1].split(' — ')[0]:dist[2].split(' — ')[0]);if(angle)parts.push(language==='ja'?angle[1].split(' — ')[0]:angle[2].split(' — ')[0]);
  if(panel.balloons?.length)parts.push(`💬${panel.balloons.length}`);if(panel.background?.location)parts.push(`🌆 ${panel.background.location}`);if(panel.effects?.lineEffect&&panel.effects.lineEffect!=='none')parts.push(effectLabels04[panel.effects.lineEffect]?.[idx]||panel.effects.lineEffect);if(panel.style?.breakout&&panel.style.breakout!=='none')parts.push(language==='ja'?'ブチ抜き':'Breakout');return parts.join(' / ');
}

const renderSvg03=renderSvg;
renderSvg=function(annotated=true){
  const size=pageSize04();let out=renderSvg03(annotated).replace(`<rect width="${PAGE_W}" height="${PAGE_H}" fill="#fff"/>`,`<rect width="${size.w}" height="${size.h}" fill="#fff"/>`);
  if(annotated){const overlays=currentPage().panels.map(p=>{const r=panelRect(p),text=panelSummary04(p),maxChars=Math.max(10,Math.floor((r.w-24)/8)),clipped=text.length>maxChars?`${text.slice(0,maxChars-1)}…`:text,y=r.y+r.h-36;return `<g class="authoring-text" pointer-events="none"><rect class="panel-summary-bg" x="${r.x+8}" y="${y}" width="${Math.max(80,r.w-16)}" height="28" rx="7"/><text class="panel-summary-text" x="${r.x+16}" y="${y+19}">${escapeXml(clipped)}</text></g>`}).join('');out+=overlays}
  return out;
};
renderCanvas=function(){const size=pageSize04();svg.setAttribute('viewBox',`0 0 ${size.w} ${size.h}`);svg.innerHTML=renderSvg(true)};

const compilePrompt03=compilePrompt;
compilePrompt=function(){const size=pageSize04();return compilePrompt03().replace(`PAGE: ${project.meta.title}`,`PAGE: ${project.meta.title}\nCANVAS: ${size.w} x ${size.h} logical units; preserve this aspect ratio.`)};

exportPng=async function(annotated){
  const size=pageSize04(),temp=document.createElementNS('http://www.w3.org/2000/svg','svg');temp.setAttribute('viewBox',`0 0 ${size.w} ${size.h}`);temp.setAttribute('xmlns','http://www.w3.org/2000/svg');temp.innerHTML=renderSvg(annotated);temp.querySelectorAll('.selected,.stick-selected,.balloon-selected').forEach(el=>el.classList.remove('selected','stick-selected','balloon-selected'));if(!annotated)temp.querySelectorAll('.authoring-text').forEach(el=>el.remove());
  const css=[...document.styleSheets].flatMap(sheet=>{try{return[...sheet.cssRules].map(r=>r.cssText)}catch{return[]}}).join('\n'),source=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size.w} ${size.h}"><style>${css}</style>${temp.innerHTML}</svg>`,img=new Image(),url=URL.createObjectURL(new Blob([source],{type:'image/svg+xml'}));await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=reject;img.src=url});const canvas=document.createElement('canvas');canvas.width=size.w;canvas.height=size.h;const ctx=canvas.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,size.w,size.h);ctx.drawImage(img,0,0);URL.revokeObjectURL(url);canvas.toBlob(blob=>blob&&downloadBlob(blob,annotated?'blueprint-annotated.png':'blueprint-ai-clean.png'),'image/png');
};

function pageHasContent04(){return currentPage().panels.some(p=>p.characters?.length||p.balloons?.length||p.background?.location||p.effects?.sfxText)}
function confirmReset04(){return !pageHasContent04()||confirm(language==='ja'?'コマ割り変更で現在の配置内容をリセットします。続行しますか？':'Changing layout resets current panel content. Continue?')}
function applyLayout04(id,{ask=true}={}){if(!layoutPresets04[id])return;if(ask&&!confirmReset04())return false;const size=pageSize04(),rects=layoutRects04(id,size.w,size.h);mutate(()=>{currentPage().panels=rects.map((r,i)=>makePanel(r,i+1));project.meta.layoutPreset=id;selectedPanelId=currentPage().panels[0]?.id||null;selectedCharacterId=null;selectedBalloonId=null;renumberPanels()});return true;}
applyTemplate=function(name){applyLayout04(name)};

function resizeProjectCanvas04(w,h,preset='custom'){
  const old=pageSize04(),sx=w/old.w,sy=h/old.h,scale=Math.sqrt(sx*sy);
  for(const page of project.pages){
    for(const p of page.panels){
      p.rect={x:p.rect.x*sx,y:p.rect.y*sy,w:p.rect.w*sx,h:p.rect.h*sy};
      for(const c of p.characters){c.x*=sx;c.y*=sy;c.scale*=scale}
      for(const b of p.balloons){b.x*=sx;b.y*=sy;b.size*=scale}
    }
  }
  project.meta.pageWidth=w;project.meta.pageHeight=h;project.meta.canvasPreset=preset;
}
function applyCanvas04(w,h,preset='custom'){
  w=Math.round(Number(w));h=Math.round(Number(h));if(!Number.isFinite(w)||!Number.isFinite(h)||w<320||h<320||w>4000||h>6000){alert(language==='ja'?'幅320〜4000、高さ320〜6000で指定してください。':'Use width 320–4000 and height 320–6000.');return false}
  const old=pageSize04();if(old.w===w&&old.h===h){mutate(()=>{project.meta.canvasPreset=preset});return true}
  if(project.pages.length>1&&!confirm(language==='ja'?`原稿サイズは作品共通です。全${project.pages.length}ページを ${w}×${h} に合わせて拡大・縮小します。続行しますか？`:`Canvas size is shared by this work. Resize all ${project.pages.length} pages to ${w}×${h}?`))return false;
  mutate(()=>resizeProjectCanvas04(w,h,preset));return true;
}

function choose04(list){return list[Math.floor(Math.random()*list.length)]}
function smartRandom04(purpose='auto',panelCount='auto',keepSize=true){
  const p=purpose==='auto'?choose04(['action','conversation','gag','daily','climax']):purpose,count=panelCount==='auto'?null:Number(panelCount),byCount={1:['single'],2:['two-columns','two-rows'],3:['action3','three-vertical'],4:['four-vertical','four-grid','conversation','action','climax'],5:['five'],6:['six']},byPurpose={action:['action3','action','climax'],conversation:['conversation','four-grid','three-vertical'],gag:['four-vertical','four-grid','five'],daily:['conversation','four-grid','three-vertical'],climax:['climax','action3','action'],fourkoma:['four-vertical','four-grid']};let candidates=(byPurpose[p]||Object.values(byPurpose).flat()).filter(id=>!count||layoutRects04(id,800,1130).length===count);if(!candidates.length)candidates=byCount[count]||['action3'];const layout=choose04(candidates);
  if(!keepSize){const preset=choose04(p==='fourkoma'?['standard','portrait45','square']:['standard','portrait45','portrait34','square']),c=canvasPresets04[preset];resizeProjectCanvas04(c.w,c.h,preset)}
  const size=pageSize04();currentPage().panels=layoutRects04(layout,size.w,size.h).map((r,i)=>makePanel(r,i+1));project.meta.layoutPreset=layout;renumberPanels();const ordered=[...currentPage().panels].sort((a,b)=>a.order-b.order),roles=p==='gag'?['setup','setup','transition','climax']:p==='conversation'?['exposition','setup','reaction','afterglow']:p==='daily'?['setup','reaction','beat','afterglow']:['setup','transition','reaction','climax'];
  ordered.forEach((pan,i)=>{pan.role=roles[Math.min(i,roles.length-1)]||'setup';if(p==='action'||p==='climax'){const c=[['long','eye-level','three-quarter-front'],['medium','low-angle','side'],['close','eye-level','three-quarter-front'],['extreme-close','low-angle','near-object']][Math.min(i,3)];[pan.camera.distance,pan.camera.angle,pan.camera.viewpoint]=c}else if(p==='conversation'){const c=[['long','eye-level','front'],['medium','over-shoulder','three-quarter-front'],['close','eye-level','three-quarter-front'],['medium','eye-level','front']][Math.min(i,3)];[pan.camera.distance,pan.camera.angle,pan.camera.viewpoint]=c}else if(p==='gag'){pan.camera.distance=i===ordered.length-1?'close':'medium';pan.camera.angle='eye-level';pan.camera.viewpoint='front'}});selectedPanelId=ordered[0]?.id||null;selectedCharacterId=null;selectedBalloonId=null;
}

function renderPresetControls04(){
  const idx=language==='ja'?'ja':'en',size=pageSize04(),currentPreset=project.meta.canvasPreset||inferCanvasPreset04(size.w,size.h);$('canvasPresetSelect').innerHTML=Object.entries(canvasPresets04).map(([id,p])=>`<option value="${id}">${escapeXml(p[idx])}${p.w?` — ${p.w}×${p.h}`:''}</option>`).join('');$('canvasPresetSelect').value=canvasPresets04[currentPreset]?currentPreset:'custom';$('canvasWidth').value=size.w;$('canvasHeight').value=size.h;const cp=canvasPresets04[$('canvasPresetSelect').value]||canvasPresets04.custom;$('canvasPresetHelp').textContent=language==='ja'?cp.helpJa:cp.helpEn;
  $('templateSelect').innerHTML=Object.entries(layoutPresets04).map(([id,p])=>`<option value="${id}">${escapeXml(p[idx])}</option>`).join('');const layout=project.meta.layoutPreset;$('templateSelect').value=layoutPresets04[layout]?layout:'action3';const lp=layoutPresets04[$('templateSelect').value];$('layoutHelp').textContent=language==='ja'?lp.helpJa:lp.helpEn;
  $('cameraDistance').innerHTML=cameraDistanceOptions04.map(x=>`<option value="${x[0]}">${escapeXml(language==='ja'?x[1]:x[2])}</option>`).join('');$('cameraAngle').innerHTML=cameraAngleOptions04.map(x=>`<option value="${x[0]}">${escapeXml(language==='ja'?x[1]:x[2])}</option>`).join('');$('cameraViewpoint').innerHTML=cameraViewOptions04.map(x=>`<option value="${x[0]}">${escapeXml(language==='ja'?x[1]:x[2])}</option>`).join('');$('cameraQuickPreset').innerHTML=Object.entries(cameraQuick04).map(([id,p])=>`<option value="${id}">${escapeXml(language==='ja'?p.ja:p.en)}</option>`).join('');$('cameraQuickPreset').value='none';
}
function renderOverview04(){
  const p=selectedPanel(),ordered=[...currentPage().panels].sort((a,b)=>a.order-b.order);$('panelOverview').innerHTML=ordered.map(x=>`<button type="button" data-overview-panel="${escapeXml(x.id)}" class="${x.id===selectedPanelId?'active':''}"><span class="overview-index">${x.order}</span><span class="overview-copy"><strong>${escapeXml(roleLabels04[x.role]?.[language==='ja'?0:1]||x.role)}</strong><span>${escapeXml(panelSummary04(x))}</span></span></button>`).join('');$('selectedPanelSummary').textContent=p?panelSummary04(p):(language==='ja'?'コマを選択してください。':'Select a panel.');const size=pageSize04();$('canvasSizeStatus').textContent=`${size.w}×${size.h} · ${currentPage().panels.length} panels`;if($('balloonX'))$('balloonX').max=size.w;if($('balloonY'))$('balloonY').max=size.h;
}
const renderUi03=renderUi;
renderUi=function(){renderUi03();renderOverview04();const p=selectedPanel();if(p){$('cameraDistance').value=p.camera.distance;$('cameraAngle').value=p.camera.angle;$('cameraViewpoint').value=p.camera.viewpoint}$('canvasWidth').value=pageSize04().w;$('canvasHeight').value=pageSize04().h};

$('helpBtn').addEventListener('click',()=>$('helpDialog').showModal());$('helpDialog').addEventListener('close',()=>localStorage.setItem(HELP_SEEN_KEY_04,'1'));
$('randomBtn').addEventListener('click',()=>$('randomDialog').showModal());for(const id of ['randomCloseX','randomCancel'])$(id).addEventListener('click',()=>$('randomDialog').close());
$('randomForm').addEventListener('submit',e=>{e.preventDefault();if(!confirmReset04())return;pushHistory();smartRandom04($('randomPurpose').value,$('randomPanelCount').value,$('randomKeepSize').checked);$('randomDialog').close();render()});
$('canvasPresetSelect').addEventListener('change',()=>{const p=canvasPresets04[$('canvasPresetSelect').value];if(p?.w){$('canvasWidth').value=p.w;$('canvasHeight').value=p.h}$('canvasPresetHelp').textContent=language==='ja'?p.helpJa:p.helpEn});
$('applyCanvasSize').addEventListener('click',()=>applyCanvas04($('canvasWidth').value,$('canvasHeight').value,$('canvasPresetSelect').value));
$('templateSelect').addEventListener('change',()=>{const p=layoutPresets04[$('templateSelect').value];$('layoutHelp').textContent=language==='ja'?p.helpJa:p.helpEn});
$('panelOverview').addEventListener('click',e=>{const btn=e.target.closest('[data-overview-panel]');if(!btn)return;selectedPanelId=btn.dataset.overviewPanel;selectedCharacterId=null;selectedBalloonId=null;document.querySelector('.tab[data-tab="panel"]')?.click();render()});
$('cameraQuickPreset').addEventListener('change',()=>{const q=cameraQuick04[$('cameraQuickPreset').value],p=selectedPanel();if(!p||!q?.distance)return;mutate(()=>{p.camera.distance=q.distance;p.camera.angle=q.angle;p.camera.viewpoint=q.viewpoint})});
$('languageSelect').addEventListener('change',()=>queueMicrotask(()=>{renderPresetControls04();render()}));

renderPresetControls04();render();
if(!localStorage.getItem(HELP_SEEN_KEY_04))setTimeout(()=>{if(!$('helpDialog').open)$('helpDialog').showModal()},250);