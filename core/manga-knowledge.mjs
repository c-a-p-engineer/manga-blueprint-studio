// Machine-readable subset of docs/MANGA-KNOWLEDGE.md.
// Human documentation explains nuance; this module exposes stable vocabulary and recommendation profiles to agents/solvers.

export const MEDIUM_PROFILES = Object.freeze({
  'print-page': {readingDirection:'rtl', progression:'page', panelCount:{min:3,neutral:[4,6],max:7}, notes:['publisher/printer template overrides defaults','use trim/bleed/safe-area/gutter semantics']},
  'web-page': {readingDirection:'rtl', progression:'page', panelCount:{min:3,neutral:[4,6],max:7}, notes:['optimize lettering/detail for phone display','platform export requirements are not manga grammar']},
  'vertical-scroll': {readingDirection:'ttb', progression:'scroll', panelCount:{min:null,neutral:null,max:null}, notes:['pace with vertical spacing','use scroll-distance reveals instead of page-turn assumptions']},
  'social-short': {readingDirection:'rtl', progression:'page-or-carousel', panelCount:{min:1,neutral:[2,4],max:null}, notes:['favor phone legibility','keep attention targets simple']}
});

export const GENRE_BIASES = Object.freeze({
  action:['diagonal-panel','depth-contrast','motion-lines','contact-focus','low-angle','hero-panel'],
  comedy:['stable-setup','reaction-closeup','pause','size-contrast'],
  romance:['closeup','detail-inset','pause','gaze-chain','spacious-panel'],
  horror:['negative-space','slow-reveal','cropped-information','odd-angle','reveal'],
  mystery:['clue-inset','attention-control','establishing-shot','reaction-shot'],
  slice_of_life:['medium-shot','establishing-shot','quiet-hold','stable-grid'],
  sports:['motion-direction','anticipation-impact-result','wide-geography','detail-inset'],
  drama:['reaction-shot','closeup','silence','size-contrast'],
  exposition:['stable-grid','clear-flow','detail-inset','moderate-camera-change']
});

export const TERMS = Object.freeze({
  yori:{ja:'寄り',en:'close framing',meaning:'Frame closer to the subject so it occupies more of the image.',semantic:{cameraDistance:'close'}},
  hiki:{ja:'引き',en:'wide framing',meaning:'Frame wider to show body, environment or spatial relationship.',semantic:{cameraDistance:'long'}},
  aori:{ja:'あおり',en:'low angle',meaning:'Look upward toward the subject.',semantic:{cameraAngle:'low-angle'}},
  fukan:{ja:'俯瞰',en:'high angle',meaning:'Look downward toward the subject or scene.',semantic:{cameraAngle:'high-angle'}},
  hero_panel:{ja:'大ゴマ',en:'hero panel',meaning:'Relatively large panel for hold, spectacle, reveal or emphasis.',technique:'hero-panel'},
  small_panel:{ja:'小ゴマ',en:'small panel',meaning:'Small panel for quick beats, detail or reaction.',technique:'small-panel'},
  diagonal:{ja:'斜めコマ',en:'diagonal panel',meaning:'Diagonal panel boundary reinforcing motion, collision or instability.',technique:'diagonal-panel'},
  bleed:{ja:'断ち切り',en:'bleed panel',meaning:'Artwork reaches the page trim/edge to expand perceived space.',technique:'bleed-panel'},
  breakout:{ja:'ブチ抜き',en:'breakout',meaning:'Character or object crosses panel boundaries.',technique:'breakout'},
  inset:{ja:'小窓',en:'inset',meaning:'Small overlaid/nested panel for detail, reaction or simultaneity.',technique:'inset'},
  hold:{ja:'間',en:'hold/pause',meaning:'Designed reading time or silence; independent from importance.',semantic:{timing:'hold'}},
  spread:{ja:'見開き',en:'spread',meaning:'Two facing pages treated as one composition.',technique:'spread'},
  page_turn:{ja:'ページめくり',en:'page-turn reveal',meaning:'Withhold information until the next page becomes visible.',technique:'page-turn'},
  speed_lines:{ja:'速度線・流線',en:'speed lines',meaning:'Lines that communicate movement direction/speed.',technique:'motion-lines'},
  focus_lines:{ja:'集中線',en:'focus lines',meaning:'Lines converging attention on a target.',technique:'focus-lines'}
});

export function recommendMangaDirection({medium='print-page',genre='',purpose='',importance=.5,hold=.5,motion='',attention=''}={}){
  const profile=MEDIUM_PROFILES[medium]||MEDIUM_PROFILES['print-page'];
  const techniques=new Set(GENRE_BIASES[String(genre).toLowerCase()]||[]);
  const why=[];
  const p=String(purpose).toLowerCase(),m=String(motion).toLowerCase();
  if(/climax|reveal|impact|決め|衝撃/.test(p)||importance>=.8){techniques.add('hero-panel');why.push('high-impact/important beat');}
  if(/impact|action|attack|collision|衝突|攻撃/.test(p)||/left|right|up|down|斜/.test(m)){techniques.add('diagonal-panel');why.push('directional action');}
  if(hold>=.75){techniques.add('spacious-panel');why.push('long reading hold');}
  if(attention&&/contact|hand|eye|face|prop|接触|手|目|顔/.test(String(attention).toLowerCase()))techniques.add('detail-inset');
  if(profile.progression==='scroll'&&/reveal|suspense|horror|驚|恐/.test(`${p} ${genre}`.toLowerCase()))techniques.add('scroll-distance-reveal');
  return {medium,profile,genreBias:GENRE_BIASES[String(genre).toLowerCase()]||[],techniques:[...techniques],why};
}
