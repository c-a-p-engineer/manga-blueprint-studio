// Prototype 0.12: scene-template cast contracts, affectionate templates, quick status, and stricter AI handoff.

Object.assign(i18n.ja,{
  quickStatus:'クイック確認',quickColor:'色',quickStyle:'画風',quickWriting:'文字',quickReading:'読み',quickTemplate:'テンプレ',quickCast:'登場',quickBackground:'背景',quickUnspecified:'未指定',quickNoTemplate:'手動',quickCastFormat:'{visible}表示 / {expected}想定',
  templateCast:'登場人物',templatePresentation:'見せ方',templateRelationship:'関係',templateDialogueLevel:'会話',templateArtHint:'向いている仕上がり',templateVisibleOneOffscreen:'1人表示＋画面外相手',templateTwoShot:'2人中心',templateSingle:'1人中心',templateDialogueLow:'少なめ',templateDialogueMedium:'標準',templateDialogueHigh:'多め',templateRelationRomance:'恋愛',templateRelationFriends:'友人・日常',templateRelationBattle:'対決',templateRelationSolo:'単独',templateArtBoth:'カラー / 白黒',templateArtColor:'カラー向き',templateArtMono:'白黒向き',
  storyAffectionDaily:'いちゃいちゃ日常 4コマ',storyTeaseBlush:'からかい→照れ 4コマ',storyFaceClose:'顔が近い 3コマ',storyAfterSchoolTwo:'二人きり放課後 4コマ',storyPamper:'甘やかし 4コマ',storyForeheadTouch:'おでこコツン 3コマ',storySurpriseHug:'不意打ちハグ 3コマ',storyShoulderLean:'肩にもたれる 3コマ',
  guideSceneContract:'テンプレートの人数と会話契約',guideSceneContractBody:'テンプレートには想定人数、画面内/画面外の見せ方、会話量、関係性を持たせます。ページ上のクイック確認では、カラー/白黒、画風、縦横書き、読み順、テンプレ、人数、背景を常時確認できます。'
});
Object.assign(i18n.en,{
  quickStatus:'Quick status',quickColor:'Color',quickStyle:'Style',quickWriting:'Text',quickReading:'Reading',quickTemplate:'Template',quickCast:'Cast',quickBackground:'Background',quickUnspecified:'Unspecified',quickNoTemplate:'Manual',quickCastFormat:'{visible} visible / {expected} expected',
  templateCast:'Cast',templatePresentation:'Presentation',templateRelationship:'Relationship',templateDialogueLevel:'Dialogue',templateArtHint:'Best finish',templateVisibleOneOffscreen:'1 visible + off-panel partner',templateTwoShot:'Two-person focus',templateSingle:'Single-character focus',templateDialogueLow:'Low',templateDialogueMedium:'Medium',templateDialogueHigh:'High',templateRelationRomance:'Romance',templateRelationFriends:'Friends / daily',templateRelationBattle:'Conflict',templateRelationSolo:'Solo',templateArtBoth:'Color / monochrome',templateArtColor:'Color-friendly',templateArtMono:'Monochrome-friendly',
  storyAffectionDaily:'Affectionate daily 4-panel',storyTeaseBlush:'Tease → blush 4-panel',storyFaceClose:'Faces getting close 3-panel',storyAfterSchoolTwo:'After school, just us 4-panel',storyPamper:'Pampering 4-panel',storyForeheadTouch:'Forehead touch 3-panel',storySurpriseHug:'Surprise hug 3-panel',storyShoulderLean:'Shoulder lean 3-panel',
  guideSceneContract:'Template cast and dialogue contract',guideSceneContractBody:'Templates carry expected cast, on/off-panel presentation, dialogue density, and relationship intent. Quick status keeps color mode, style, writing direction, reading order, template, cast, and background visible while editing.'
});

function defineSceneMeta22(id,opts={}){
  if(!meta13[id])meta13[id]={category:'daily',desc:{ja:'',en:''},use:{ja:'',en:''},tags:[]};
  meta13[id].scene22={
    relationship:opts.relationship||'solo',
    cast:{min:opts.min||1,recommended:opts.recommended||opts.min||1,max:opts.max||opts.recommended||opts.min||1},
    presentation:opts.presentation||'single',dialogueDensity:opts.dialogueDensity||'low',artHint:opts.artHint||'both',offPanelPartner:!!opts.offPanelPartner
  };
  const tpl=storyTemplates11[id];
  if(tpl&&opts.dialoguePolicy){tpl.dialoguePolicy=opts.dialoguePolicy;tpl.minimumDialogueBeats=Number(opts.minimumDialogueBeats||tpl.minimumDialogueBeats||0);}
}

function registerAffectionTemplates22(){
  Object.assign(storyTemplates11,{
    affectionDaily:{label:'storyAffectionDaily',layout:'four-grid',background:bg13('明るい自室','bright room','甘い','sweet','day'),beats:[
      beat13('setup','二人で並んで何気ない時間を過ごす','the two share an ordinary moment side by side','stand','smile','other-character',['medium','eye-level','side'],{dialogue:{ja:'ねえ、もうちょっとこっち来て',en:'Hey, come a little closer.'}}),
      beat13('beat','肩が触れるくらいまで自然に距離を詰める','they casually move close enough for their shoulders to touch','stand','shy','other-character',['close','eye-level','three-quarter-front'],{dialogue:{ja:'近い？',en:'Too close?'}}),
      beat13('reaction','相手の反応を見て少しからかう','teases the partner after seeing the reaction','stand','smirk','other-character',['close','eye-level','front'],{dialogue:{ja:'ふふ、照れてる',en:'Hehe, you are blushing.'}}),
      beat13('afterglow','笑いながらそのまま寄り添って余韻を残す','ends with the two staying close and smiling','stand','smile','other-character',['medium','eye-level','side'],{dialogue:{ja:'このままでいよっか',en:'Let us stay like this.'}})
    ]},
    teaseBlush:{label:'storyTeaseBlush',layout:'four-grid',background:bg13('放課後の教室','classroom after school','軽く甘い','playful and sweet','evening'),beats:[
      beat13('setup','相手の様子を見ていたずらっぽく笑う','smiles mischievously while watching the partner','stand','smirk','other-character',['medium','eye-level','three-quarter-front'],{dialogue:{ja:'さっきからこっち見てない？',en:'Have you been looking at me this whole time?'}}),
      beat13('reaction','相手に指摘されて一瞬言葉に詰まる','gets caught off guard by the partner reply','stand','surprised','other-character',['close','eye-level','front'],{dialogue:{ja:'え、そっちこそ',en:'W-well, so have you.'}}),
      beat13('beat','ごまかそうとして視線を外す','tries to play it off and looks away','stand','shy','away',['close','eye-level','three-quarter-front'],{dialogue:{ja:'べつに意味ないし',en:'It does not mean anything.'}}),
      beat13('afterglow','最後に小さく笑って本音を匂わせる','ends with a small smile that gives away the truth','stand','smile','other-character',['close','eye-level','front'],{dialogue:{ja:'…でも、見てたかも',en:'…Maybe I was looking.'}})
    ]},
    faceClose:{label:'storyFaceClose',layout:'action3',background:bg13('静かな部屋','quiet room','親密','intimate','evening'),beats:[
      beat13('setup','近い距離で向き合い、互いを意識する','faces each other at close distance','stand','shy','other-character',['medium','eye-level','side'],{dialogue:{ja:'どうしたの？',en:'What is it?'}}),
      beat13('beat','顔の距離がさらに縮まり、言葉が止まる','their faces move even closer and the words stop','stand','shy','other-character',['close','eye-level','side'],{sfx:{ja:'…',en:'…'}}),
      beat13('afterglow','触れそうな距離で照れながら見つめ合う','holds the near-touching distance with a shy gaze','stand','shy','other-character',['extreme-close','eye-level','side'],{dialogue:{ja:'…近いね',en:'…We are close.'}})
    ]},
    afterSchoolTwo:{label:'storyAfterSchoolTwo',layout:'climax',background:bg13('夕方の教室','classroom at sunset','静かで甘い','quiet and sweet','evening'),beats:[
      beat13('setup','放課後の教室に二人だけ残っている状況を見せる','establishes that only the two remain after school','stand','neutral','other-character',['long','eye-level','side'],{dialogue:{ja:'みんな帰っちゃったね',en:'Everyone has gone home.'}}),
      beat13('beat','静かな空気の中で相手を意識する','becomes aware of the partner in the quiet room','stand','shy','away',['medium','eye-level','three-quarter-front'],{dialogue:{ja:'なんか静かすぎるね',en:'It is really quiet now.'}}),
      beat13('reaction','相手に見つめられて照れる','blushes after noticing the partner gaze','stand','shy','other-character',['close','eye-level','front'],{dialogue:{ja:'…なに？',en:'…What?'}}),
      beat13('afterglow','二人きりの時間を嬉しそうに受け入れる','softly accepts the private moment together','stand','smile','other-character',['close','eye-level','three-quarter-front'],{dialogue:{ja:'もう少しだけ、ここにいよっか',en:'Want to stay a little longer?'}})
    ]},
    pamper:{label:'storyPamper',layout:'four-grid',background:bg13('自室','bedroom','優しい','gentle','evening'),beats:[
      beat13('setup','疲れている相手の様子に気づく','notices the partner looks tired','stand','neutral','other-character',['medium','eye-level','three-quarter-front'],{dialogue:{ja:'疲れてる？',en:'Tired?'}}),
      beat13('beat','相手のそばへ寄って休むよう促す','moves closer and tells the partner to rest','stand','smile','other-character',['medium','eye-level','side'],{dialogue:{ja:'今日はもう頑張らなくていいよ',en:'You do not have to push yourself today.'}}),
      beat13('reaction','安心した反応を見て柔らかく笑う','smiles softly at the relieved response','stand','smile','other-character',['close','eye-level','front'],{dialogue:{ja:'よしよし',en:'There, there.'}}),
      beat13('afterglow','寄り添ったまま穏やかに締める','ends with a calm moment staying close','stand','shy','other-character',['close','eye-level','three-quarter-front'],{dialogue:{ja:'ゆっくりしてて',en:'Just relax.'}})
    ]},
    foreheadTouch:{label:'storyForeheadTouch',layout:'action3',background:bg13('静かな部屋','quiet room','甘い','sweet','evening'),beats:[
      beat13('setup','相手の顔を近くで見つめる','looks at the partner from close range','stand','smile','other-character',['medium','eye-level','front'],{dialogue:{ja:'ちょっとじっとして',en:'Hold still for a second.'}}),
      beat13('beat','おでこをそっと近づける','gently moves the forehead closer','stand','shy','other-character',['close','eye-level','side'],{sfx:{ja:'こつん',en:'tap'}}),
      beat13('afterglow','おでこを合わせたまま笑う','smiles while keeping foreheads together','stand','shy','other-character',['extreme-close','eye-level','side'],{dialogue:{ja:'ふふ、近い',en:'Hehe, close.'}})
    ]},
    surpriseHug:{label:'storySurpriseHug',layout:'action3',background:bg13('帰り道','walk home','嬉しい','happy','evening'),beats:[
      beat13('setup','相手を見つけて嬉しそうに駆け寄る','spots the partner and approaches happily','run','smile','other-character',['long','eye-level','three-quarter-front'],{dialogue:{ja:'いた！',en:'There you are!'}}),
      beat13('climax','勢いのまま抱きつく','hugs the partner with the momentum of the approach','stand','smile','other-character',['medium','eye-level','side'],{sfx:{ja:'ぎゅっ',en:'HUG'}}),
      beat13('afterglow','抱きついたまま照れ笑いする','stays in the hug and smiles shyly','stand','shy','other-character',['close','eye-level','front'],{dialogue:{ja:'会いたかった',en:'I missed you.'}})
    ]},
    shoulderLean:{label:'storyShoulderLean',layout:'action3',background:bg13('帰りの電車','train ride home','穏やか','calm','evening'),beats:[
      beat13('setup','隣同士で静かに座っている','the two sit quietly side by side','stand','neutral','other-character',['medium','eye-level','side'],{dialogue:{ja:'今日はちょっと眠いかも',en:'I am a little sleepy today.'}}),
      beat13('beat','そっと相手の肩にもたれる','gently leans onto the partner shoulder','stand','sleepy','other-character',['close','eye-level','side'],{sfx:{ja:'そっ…',en:'lean'}}),
      beat13('afterglow','安心した表情でそのまま目を閉じる','closes the eyes with a relaxed expression','stand','sleepy','closed',['close','eye-level','three-quarter-front'],{dialogue:{ja:'少しだけ、このまま…',en:'Just like this for a bit…'}})
    ]}
  });
  templateMeta13('affectionDaily','romance','日常の中で自然に距離が縮まる、甘めのいちゃいちゃ4コマです。','A sweet daily-life scene where the pair naturally grows closer.','恋人・両想い・甘い日常','Couples, mutual affection, sweet daily scenes',['いちゃいちゃ','甘い','二人']);
  templateMeta13('teaseBlush','romance','軽いからかいから照れへ転ぶラブコメ会話です。','A playful rom-com exchange that turns teasing into blushes.','からかい、照れ、軽い会話','Teasing, blushing, playful dialogue',['からかい','照れ','会話']);
  templateMeta13('faceClose','romance','顔の距離が縮まる過程を寄りのカメラで見せます。','Uses progressively tighter shots as faces move closer.','近距離、ドキドキ、キス前の空気','Close distance, tension, pre-kiss mood',['近い','ドキドキ']);
  templateMeta13('afterSchoolTwo','romance','放課後に二人だけ残った静かな甘さを描きます。','A quiet, sweet after-school moment with just the two of them.','放課後、二人きり、片思い・両想い','After school, just the two, romance',['放課後','二人きり','会話']);
  templateMeta13('pamper','romance','疲れた相手を気遣い、甘やかす流れです。','A caring scene focused on comforting a tired partner.','甘やかし、癒やし、恋人','Pampering, comfort, couples',['甘やかし','癒やし']);
  templateMeta13('foreheadTouch','romance','おでこを近づけて触れる小さな親密シーンです。','A small intimate scene built around a gentle forehead touch.','親密、照れ、距離感','Intimacy, blushes, close distance',['おでこ','照れ']);
  templateMeta13('surpriseHug','romance','嬉しさの勢いで抱きつき、余韻へつなぎます。','A happy approach that turns into a surprise hug and afterglow.','ハグ、再会、甘い見せ場','Hugs, reunion, affectionate beat',['ハグ','再会']);
  templateMeta13('shoulderLean','romance','肩にもたれる静かな接触と安心感を描きます。','A quiet physical-contact scene centered on leaning on a shoulder.','寄り添い、眠気、安心','Leaning close, sleepy comfort',['肩','寄り添い']);
}
registerAffectionTemplates22();

function installSceneMeta22(){
  defineSceneMeta22('cuteDaily',{relationship:'friends',recommended:1,presentation:'single',dialogueDensity:'medium',artHint:'both'});
  defineSceneMeta22('romance',{relationship:'romance',recommended:2,presentation:'one-visible-offscreen',dialogueDensity:'medium',artHint:'color',offPanelPartner:true,dialoguePolicy:'conversation',minimumDialogueBeats:3});
  defineSceneMeta22('confession',{relationship:'romance',recommended:2,presentation:'one-visible-offscreen',dialogueDensity:'medium',artHint:'both',offPanelPartner:true,dialoguePolicy:'conversation',minimumDialogueBeats:2});
  defineSceneMeta22('kissBefore',{relationship:'romance',recommended:2,presentation:'two-shot',dialogueDensity:'low',artHint:'color'});
  defineSceneMeta22('kissAfter',{relationship:'romance',recommended:2,presentation:'two-shot',dialogueDensity:'low',artHint:'color'});
  defineSceneMeta22('holdHands',{relationship:'romance',recommended:2,presentation:'two-shot',dialogueDensity:'low',artHint:'both'});
  defineSceneMeta22('romanceMisunderstanding',{relationship:'romance',recommended:2,presentation:'one-visible-offscreen',dialogueDensity:'medium',artHint:'both',offPanelPartner:true,dialoguePolicy:'conversation',minimumDialogueBeats:2});
  defineSceneMeta22('classroomTalk',{relationship:'friends',recommended:2,presentation:'one-visible-offscreen',dialogueDensity:'high',artHint:'both',offPanelPartner:true,dialoguePolicy:'conversation',minimumDialogueBeats:4});
  for(const id of ['battleStandoff','decisiveBlow','counterattack','aerialAttack','throwTechnique'])defineSceneMeta22(id,{relationship:'battle',recommended:2,presentation:'one-visible-offscreen',dialogueDensity:'low',artHint:'mono',offPanelPartner:true});
  for(const id of ['affectionDaily','teaseBlush','afterSchoolTwo','pamper'])defineSceneMeta22(id,{relationship:'romance',recommended:2,presentation:'one-visible-offscreen',dialogueDensity:'high',artHint:'color',offPanelPartner:true,dialoguePolicy:'conversation',minimumDialogueBeats:3});
  for(const id of ['faceClose','foreheadTouch','surpriseHug','shoulderLean'])defineSceneMeta22(id,{relationship:'romance',recommended:2,presentation:'two-shot',dialogueDensity:'low',artHint:'color'});
  if(storyTemplates11.classroomTalk?.beats?.[2])storyTemplates11.classroomTalk.beats[2].speakerRole='partner';
}
installSceneMeta22();

function sceneInfo22(id){return meta13[id]?.scene22||null;}
function sceneLabel22(type,value){
  const maps={relationship:{romance:'templateRelationRomance',friends:'templateRelationFriends',battle:'templateRelationBattle',solo:'templateRelationSolo'},presentation:{'one-visible-offscreen':'templateVisibleOneOffscreen','two-shot':'templateTwoShot',single:'templateSingle'},dialogue:{low:'templateDialogueLow',medium:'templateDialogueMedium',high:'templateDialogueHigh'},art:{both:'templateArtBoth',color:'templateArtColor',mono:'templateArtMono'}};
  return maps[type]?.[value]?t(maps[type][value]):String(value||'');
}
function templateBadges22(id){const s=sceneInfo22(id);if(!s)return'';const bits=[`👥 ${s.cast.recommended}${language==='ja'?'人':''}`,sceneLabel22('relationship',s.relationship),sceneLabel22('dialogue',s.dialogueDensity),sceneLabel22('art',s.artHint)];return `<span class="template-badges22">${bits.filter(Boolean).map(x=>`<em>${escapeXml(x)}</em>`).join('')}</span>`;}

const renderTemplateGalleryBase22=renderTemplateGallery13;
renderTemplateGallery13=function(){
  const box=$('templateGallery13');if(!box)return renderTemplateGalleryBase22();const category=$('templateCategory13')?.value||'all',q=$('templateSearch13')?.value?.trim()||'',selected=selectedTemplateId13();
  const entries=Object.entries(storyTemplates11).filter(([id,tpl])=>id!==DERIVED_TEMPLATE_ID_13&&templateMatches13(id,tpl,category,q));
  box.innerHTML=entries.length?entries.map(([id,tpl])=>{const m=meta13[id]||{},custom=id.startsWith('custom13:');return `<article class="template-card13 ${selected===id?'selected':''}" data-template-card13="${escapeXml(id)}"><button type="button" class="template-card-main13" data-template-pick13="${escapeXml(id)}">${templateThumb13(tpl)}<span class="template-card-copy13"><strong>${escapeXml(storyName13(id,tpl))}</strong><small>${templatePanelCount13(tpl)} ${escapeXml(t('templatePanels'))} · ${escapeXml(t(categoryKeys13[m.category]||'templateCategoryDaily'))}</small>${templateBadges22(id)}<span>${escapeXml(localized13x(m.desc)||'')}</span></span></button>${custom?`<button type="button" class="template-delete13" data-template-delete13="${escapeXml(id)}">${escapeXml(t('templateDelete'))}</button>`:''}</article>`}).join(''):`<p class="help">${escapeXml(t('templateNoMatch'))}</p>`;
};

const renderTemplatePreviewBase22=renderTemplatePreview13;
renderTemplatePreview13=function(){
  renderTemplatePreviewBase22();const box=$('storyTemplatePreview11'),s=sceneInfo22(selectedTemplateId13());if(!box||!s)return;const extra=document.createElement('div');extra.className='template-scene-meta22';extra.innerHTML=`<span><b>${escapeXml(t('templateCast'))}:</b> ${s.cast.recommended}${language==='ja'?'人':''}</span><span><b>${escapeXml(t('templatePresentation'))}:</b> ${escapeXml(sceneLabel22('presentation',s.presentation))}</span><span><b>${escapeXml(t('templateRelationship'))}:</b> ${escapeXml(sceneLabel22('relationship',s.relationship))}</span><span><b>${escapeXml(t('templateDialogueLevel'))}:</b> ${escapeXml(sceneLabel22('dialogue',s.dialogueDensity))}</span><span><b>${escapeXml(t('templateArtHint'))}:</b> ${escapeXml(sceneLabel22('art',s.artHint))}</span>`;box.appendChild(extra);
};

function templateId22(){const raw=String(project.meta.storyTemplate||'');return raw.endsWith(':derived')?raw.slice(0,-8):raw;}
function visibleCast22(){const ids=new Set();for(const p of currentPage().panels||[])for(const ch of p.characters||[])if(ch.characterId)ids.add(ch.characterId);return ids.size;}
function normalizeTemplateBeat22(beat,scene){const x={...beat};if(scene?.offPanelPartner&&x.gaze==='other-character')x.gaze='off-panel-target';return x;}
function makeTemplateBalloon22(panel,beat,base){const text=localized13x(beat.dialogue);if(!text)return null;const partner=beat.speakerRole==='partner',b=makeStoryBalloon11(panel,text,partner?null:base,partner?'offscreen':(beat.balloonType||'speech'));b.speakerRole=partner?'partner':'primary';b.listenerRole=partner?'primary':'partner';return b;}

function applyTemplateSceneContract22(){
  const id=selectedTemplateId13(),tpl=storyTemplates11[id];if(!tpl)return;const page=currentPage(),hasAuthored=page.panels.some(p=>p.characters?.length||p.balloons?.length||p.effects?.sfxText||p.actionIntent);if(hasAuthored&&!confirm(t('storyTemplateConfirm')))return;
  const withText=$('storyTemplateText11')?.checked!==false,base=currentBaseCharacter06?.()||project.characterLibrary?.[0]||null,size=pageSize04(),rects=templateRects13(tpl,size),defaultBg=tpl.background?.[language]||tpl.background?.ja||{},scene=sceneInfo22(id);
  mutate(()=>{page.panels=rects.map((r,i)=>makePanel(r,i+1));project.meta.layoutPreset=tpl.layout||'custom';project.meta.storyTemplate=id===DERIVED_TEMPLATE_ID_13?`${derivedBaseId13}:derived`:id;project.meta.randomPurpose='';project.meta.randomSeed='';project.meta.randomVariant=undefined;renumberPanels();const ordered=readingOrderedPanels16(page);ordered.forEach((panel,i)=>{const beat=normalizeTemplateBeat22(tpl.beats[i]||tpl.beats.at(-1)||{},scene);panel.role=beat.role||'setup';panel.actionIntent=localized13x(beat.action);Object.assign(panel.camera,{distance:beat.camera?.[0]||'medium',angle:beat.camera?.[1]||'eye-level',viewpoint:beat.camera?.[2]||'front'});Object.assign(panel.background,beat.background?.[language]||beat.background?.ja||defaultBg);panel.effects.lineEffect=beat.lineEffect||'none';panel.effects.strength=beat.lineEffect?'high':'medium';panel.effects.sfxWritingMode='inherit';panel.style.breakout=beat.breakout||'none';if(base)panel.characters=[makeStoryInstance11(base,panel,beat)];if(withText&&beat.dialogue){const b=makeTemplateBalloon22(panel,beat,base);if(b)panel.balloons=[b];}if(withText&&beat.sfx)panel.effects.sfxText=localized13x(beat.sfx);});selectedPanelId=ordered[0]?.id||page.panels[0]?.id||null;selectedCharacterId=null;selectedBalloonId=null;});
}
function bindTemplateApply22(){const old=$('applyStoryTemplate11');if(!old)return;const fresh=old.cloneNode(true);old.replaceWith(fresh);fresh.addEventListener('click',applyTemplateSceneContract22);}

function artColorLabel22(v){return t({auto:'artColorAuto',color:'artColorColor',monochrome:'artColorMonochrome',grayscale:'artColorGrayscale',limited:'artColorLimited'}[v]||'artColorAuto');}
function artStyleLabel22(v){return t({auto:'artColorAuto',anime:'artStyleAnime',manga:'artStyleManga',pencil:'artStylePencil',ink:'artStyleInk',watercolor:'artStyleWatercolor',webtoon:'artStyleWebtoon',cel:'artStyleCel',realistic:'artStyleRealistic',sketch:'artStyleSketch','retro-manga':'artStyleRetro',chibi:'artStyleChibi'}[v]||'artColorAuto');}
function quickCast22(){const visible=visibleCast22(),expected=sceneInfo22(templateId22())?.cast?.recommended||visible||1;return t('quickCastFormat').replace('{visible}',String(visible)).replace('{expected}',String(expected));}
function quickTemplate22(){const id=templateId22();return storyTemplates11[id]?storyName13(id,storyTemplates11[id]):t('quickNoTemplate');}
function quickBackground22(){return (currentPage().panels||[]).map(p=>String(p.background?.location||'').trim()).find(Boolean)||t('quickUnspecified');}
function jumpQuick22(tab,target){document.querySelector(`.tab[data-tab="${tab}"]`)?.click();queueMicrotask(()=>$(target)?.scrollIntoView?.({behavior:'smooth',block:'center'}));}
function renderQuickStatus22(){const box=$('quickStatus22');if(!box)return;const art=artDirection18(),reading=project.meta.readingDirection==='ltr'?(language==='ja'?'LTR 左→右':'LTR left-to-right'):(language==='ja'?'RTL 右→左':'RTL right-to-left'),writing=defaultWritingMode15()==='horizontal-tb'?t('writingHorizontal'):t('writingVertical'),chips=[['page','artDirection18',`${t('quickColor')}: ${artColorLabel22(art.colorMode)}`,art.colorMode==='auto'],['page','artDirection18',`${t('quickStyle')}: ${artStyleLabel22(art.renderStyle)}`,art.renderStyle==='auto'],['text','writingControls15',`${t('quickWriting')}: ${writing}`,false],['page','readingDirectionBlock',`${t('quickReading')}: ${reading}`,false],['page','storyTemplateBlock11',`${t('quickTemplate')}: ${quickTemplate22()}`,false],['character','characterList',`${t('quickCast')}: ${quickCast22()}`,false],['background','backgroundLocation',`${t('quickBackground')}: ${quickBackground22()}`,false]];box.innerHTML=`<span class="quick-status-title22">${escapeXml(t('quickStatus'))}</span>${chips.map(([tab,target,label,warn])=>`<button type="button" class="quick-chip22${warn?' warn':''}" data-quick-tab22="${tab}" data-quick-target22="${target}">${warn?'⚠ ':''}${escapeXml(label)}</button>`).join('')}`;}
function injectQuickStatus22(){const column=document.querySelector('.canvas-column');if(!column||$('quickStatus22'))return;const box=document.createElement('div');box.id='quickStatus22';box.className='quick-status22';column.querySelector('.canvas-toolbar')?.insertAdjacentElement('afterend',box);box.addEventListener('click',e=>{const b=e.target.closest('[data-quick-tab22]');if(b)jumpQuick22(b.dataset.quickTab22,b.dataset.quickTarget22);});}

function outputConstraints22(){const art=artDirection18(),id=templateId22(),scene=sceneInfo22(id),visible=visibleCast22();return{preservePanelCount:currentPage().panels?.length||0,preserveColorMode:art.colorMode||'auto',preserveRenderStyle:art.renderStyle||'auto',preserveCharacterIdentity:true,template:id||'',expectedCast:scene?.cast?.recommended||visible,visibleCast:visible,presentation:scene?.presentation||'unspecified',offPanelPartner:!!scene?.offPanelPartner};}
function sceneContractPrompt22(){const x=outputConstraints22(),lines=['SCENE / CAST CONTRACT:',`- Preserve exactly ${x.preservePanelCount} panel(s) and the recorded reading order.`];if(x.preserveColorMode!=='auto')lines.push(`- Preserve global color mode exactly: ${x.preserveColorMode}. Do not switch color/monochrome on your own.`);if(x.preserveRenderStyle!=='auto')lines.push(`- Preserve global rendering style: ${x.preserveRenderStyle}.`);lines.push('- Do not replace a specified character with a different person. Follow CHARACTER IDENTITY GUIDANCE.');if(x.expectedCast>1)lines.push(`- Scene context expects ${x.expectedCast} participants. ${x.offPanelPartner?'Only characters explicitly placed in a panel are visible; treat the other participant as off-panel unless the blueprint explicitly places them.':'Do not invent or remove visible participants beyond what the blueprint places.'}`);lines.push('- Dialogue text is exact content to render. Do not rewrite the meaning or invent replacement lines.');return lines.join('\n');}
const compilePromptBase22=compilePrompt;compilePrompt=function(){return `${compilePromptBase22()}\n\n${sceneContractPrompt22()}`;};

if(typeof exportManifest08==='function'){const exportManifestBase22=exportManifest08;exportManifest08=function(identity,packageType,files){const manifest=exportManifestBase22(identity,packageType,files),id=templateId22(),scene=sceneInfo22(id);manifest.outputConstraints=outputConstraints22();if(scene)manifest.sceneTemplateContract={templateId:id,relationship:scene.relationship,cast:scene.cast,presentation:scene.presentation,dialogueDensity:scene.dialogueDensity,artHint:scene.artHint,offPanelPartner:scene.offPanelPartner};return manifest;};}

function installSceneContractHelp22(){const d=$('helpDialog');if(!d||$('guideSceneContract22'))return;const s=document.createElement('section');s.id='guideSceneContract22';s.className='guide-section';s.innerHTML=`<h3 data-i18n="guideSceneContract"></h3><p data-i18n="guideSceneContractBody"></p>`;($('guideTemplateQuality21')||$('guideStoryReadable11'))?.insertAdjacentElement('afterend',s);}
function installSceneContractStyle22(){if($('sceneContractStyle22'))return;const s=document.createElement('style');s.id='sceneContractStyle22';s.textContent=`.quick-status22{display:flex;gap:6px;align-items:center;overflow-x:auto;padding:8px 4px 10px;scrollbar-width:thin}.quick-status-title22{font-size:12px;font-weight:700;white-space:nowrap;color:#475569}.quick-chip22{border:1px solid #cbd5e1;background:#fff;border-radius:999px;padding:7px 10px;font-size:12px;white-space:nowrap}.quick-chip22.warn{border-color:#f59e0b;background:#fffbeb;color:#92400e}.template-badges22{display:flex;gap:4px;flex-wrap:wrap;margin:4px 0}.template-badges22 em{font-style:normal;font-size:11px;padding:2px 6px;border-radius:999px;background:#eef2ff;color:#3730a3}.template-scene-meta22{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:5px;margin-top:8px;font-size:12px}.template-scene-meta22 span{padding:6px 8px;border:1px solid #e2e8f0;border-radius:8px;background:#fff}@media(max-width:760px){.quick-status22{position:sticky;top:0;z-index:8;background:rgba(255,255,255,.96)}.template-scene-meta22{grid-template-columns:1fr}}`;document.head.appendChild(s);}

const renderUiBase22=renderUi;renderUi=function(){renderUiBase22();renderQuickStatus22();};
const applyLanguageBase22=applyLanguage;applyLanguage=function(){applyLanguageBase22();installSceneContractHelp22();renderTemplateGallery13();renderTemplatePreview13();renderQuickStatus22();document.querySelectorAll('#guideSceneContract22 [data-i18n]').forEach(el=>el.textContent=t(el.dataset.i18n));};

injectQuickStatus22();installSceneContractHelp22();installSceneContractStyle22();syncTemplateSelect13();bindTemplateApply22();renderTemplateGallery13();renderTemplatePreview13();renderQuickStatus22();render();
document.querySelector('footer')&&(document.querySelector('footer').textContent='Prototype 0.12 · scene contract · quick status');
