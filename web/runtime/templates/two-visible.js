// Prototype 0.12.5: explicit two-visible Scene Templates and one-tap template filtering.

Object.assign(i18n.ja,{
  templateQuickFilter27:'すぐ絞り込み',templateFilterReset27:'すべて',templateFilterVisibleOne27:'👤 1人表示',templateFilterVisibleTwo27:'👥 2人表示',templateFilterRomance27:'💗 恋愛',templateFilterFriends27:'🙂 日常・友人',templateFilterBattle27:'⚔ バトル',templateFilterDialogueHigh27:'💬 会話多め',templateFilterColor27:'🎨 カラー向き',templateFilterMono27:'⚫ 白黒向き',
  templateNeedsTwoBases27:'このテンプレートは画面内に2人を配置します。ベースキャラクターを2人以上作成してから適用してください。',templateTwoBasesRequired27:'ベース2人必要',templateTwoVisible27:'2人表示',
  storyTwoVisibleChat27:'2人会話 4コマ',storyTwoVisibleAffection27:'2人いちゃいちゃ 4コマ',storyTwoVisibleGaze27:'見つめ合い 3コマ',storyTwoVisibleHug27:'2人ハグ 3コマ',storyTwoVisibleStandoff27:'2人対峙 3コマ',
  guideTwoVisible27:'2人を同じコマへ出すテンプレート',guideTwoVisibleBody27:'「2人表示」テンプレートは、選択中のベースキャラと別のベースキャラを実際に同じコマへ配置します。ベースキャラが1人しかない場合は、AIに知らない相手を作らせず適用前に止めます。'
});
Object.assign(i18n.en,{
  templateQuickFilter27:'Quick filters',templateFilterReset27:'All',templateFilterVisibleOne27:'👤 1 visible',templateFilterVisibleTwo27:'👥 2 visible',templateFilterRomance27:'💗 Romance',templateFilterFriends27:'🙂 Daily / friends',templateFilterBattle27:'⚔ Battle',templateFilterDialogueHigh27:'💬 Dialogue-heavy',templateFilterColor27:'🎨 Color-friendly',templateFilterMono27:'⚫ Monochrome-friendly',
  templateNeedsTwoBases27:'This template places two visible characters. Create at least two base characters before applying it.',templateTwoBasesRequired27:'Needs 2 bases',templateTwoVisible27:'2 visible',
  storyTwoVisibleChat27:'Two-person conversation 4-panel',storyTwoVisibleAffection27:'Two-person affection 4-panel',storyTwoVisibleGaze27:'Mutual gaze 3-panel',storyTwoVisibleHug27:'Two-person hug 3-panel',storyTwoVisibleStandoff27:'Two-person standoff 3-panel',
  guideTwoVisible27:'Templates with two visible characters',guideTwoVisibleBody27:'“2 visible” templates place the selected base character and another base character in the same panels. If only one base character exists, application stops instead of asking the downstream model to invent an unplanned partner.'
});

const activeTemplateFilters27={visible:'all',relationship:'all',dialogue:'all',art:'all'};

function actor27(index,x,pose='stand',expression='neutral',gaze='other-character',scale=.72,yOffset=0){return {index,x,pose,expression,gaze,scale,yOffset};}
function beatTwo27(role,ja,en,camera,actors,extra={}){return beat13(role,ja,en,actors?.[0]?.pose||'stand',actors?.[0]?.expression||'neutral',actors?.[0]?.gaze||'other-character',camera,{actors27:actors,...extra});}
function registerTwoVisibleTemplates27(){
  Object.assign(storyTemplates11,{
    twoVisibleChat27:{label:'storyTwoVisibleChat27',layout:'four-grid',background:bg13('放課後の教室','classroom after school','穏やか','calm','evening'),beats:[
      beatTwo27('setup','二人が同じ画面で向き合って会話を始める','both characters share the frame as the conversation starts',['long','eye-level','side'],[actor27(0,.31,'stand','smile'),actor27(1,.69,'stand','neutral')],{dialogue:{ja:'今日どうだった？',en:'How was your day?'},speakerIndex27:0}),
      beatTwo27('beat','相手が笑って返事をする','the partner smiles and replies',['medium','eye-level','side'],[actor27(0,.30,'stand','neutral'),actor27(1,.70,'stand','smile')],{dialogue:{ja:'けっこう楽しかったよ',en:'It was pretty fun.'},speakerIndex27:1}),
      beatTwo27('transition','話が弾んで次の約束を提案する','the conversation flows into making another plan',['medium','eye-level','three-quarter-front'],[actor27(0,.34,'stand','smile'),actor27(1,.66,'stand','smile')],{dialogue:{ja:'じゃあ今度、一緒に行こうよ',en:'Then let us go together next time.'},speakerIndex27:0}),
      beatTwo27('afterglow','相手も嬉しそうに同意する','the partner happily agrees',['medium','eye-level','front'],[actor27(0,.33,'stand','smile'),actor27(1,.67,'stand','smile')],{dialogue:{ja:'うん、行こ！',en:'Yeah, let us go!'},speakerIndex27:1})
    ]},
    twoVisibleAffection27:{label:'storyTwoVisibleAffection27',layout:'four-grid',background:bg13('明るい自室','bright room','甘い','sweet','day'),beats:[
      beatTwo27('setup','二人で並んでくつろぐ','the pair relax side by side',['long','eye-level','front'],[actor27(0,.34,'stand','smile'),actor27(1,.66,'stand','smile')],{dialogue:{ja:'今日、ゆっくりできていいね',en:'It is nice to take it easy today.'},speakerIndex27:0}),
      beatTwo27('beat','肩が触れるくらいまで距離が縮まる','they move close enough for their shoulders to touch',['medium','eye-level','side'],[actor27(0,.42,'stand','shy'),actor27(1,.58,'stand','shy')],{sfx:{ja:'そっ…',en:'lean'}}),
      beatTwo27('reaction','互いの照れた顔を見て笑う','they notice each other blushing and laugh',['medium','eye-level','front'],[actor27(0,.38,'stand','smile'),actor27(1,.62,'stand','smile')],{dialogue:{ja:'ふふ、照れてる',en:'Hehe, you are blushing.'},speakerIndex27:0}),
      beatTwo27('afterglow','二人で寄り添ったまま余韻を残す','they stay close together for the afterglow',['medium','eye-level','side'],[actor27(0,.43,'stand','shy'),actor27(1,.57,'stand','shy')],{dialogue:{ja:'このままでいよっか',en:'Want to stay like this?'},speakerIndex27:1})
    ]},
    twoVisibleGaze27:{label:'storyTwoVisibleGaze27',layout:'action3',background:bg13('静かな部屋','quiet room','親密','intimate','evening'),beats:[
      beatTwo27('setup','二人が向き合って立つ','the two stand facing each other',['long','eye-level','side'],[actor27(0,.34,'stand','neutral'),actor27(1,.66,'stand','neutral')]),
      beatTwo27('beat','目が合って互いに少し照れる','their eyes meet and both become shy',['medium','eye-level','side'],[actor27(0,.40,'stand','shy'),actor27(1,.60,'stand','shy')],{sfx:{ja:'…',en:'…'}}),
      beatTwo27('afterglow','距離を保ったまま笑い合う','they smile at each other without breaking the moment',['medium','eye-level','front'],[actor27(0,.40,'stand','smile'),actor27(1,.60,'stand','smile')],{dialogue:{ja:'…なんか照れるね',en:'…This is kind of embarrassing.'},speakerIndex27:0})
    ]},
    twoVisibleHug27:{label:'storyTwoVisibleHug27',layout:'action3',background:bg13('帰り道','walk home','嬉しい','happy','evening'),beats:[
      beatTwo27('setup','二人が近づいて向き合う','the two move close and face each other',['long','eye-level','front'],[actor27(0,.34,'stand','smile'),actor27(1,.66,'stand','surprised')]),
      beatTwo27('climax','片方が相手へ抱きつく','one character hugs the other',['medium','eye-level','side'],[actor27(0,.46,'stand','smile'),actor27(1,.54,'stand','surprised')],{sfx:{ja:'ぎゅっ',en:'HUG'}}),
      beatTwo27('afterglow','二人で抱き合ったまま照れ笑いする','they remain close and smile shyly',['medium','eye-level','front'],[actor27(0,.46,'stand','shy'),actor27(1,.54,'stand','shy')],{dialogue:{ja:'会いたかった',en:'I missed you.'},speakerIndex27:0})
    ]},
    twoVisibleStandoff27:{label:'storyTwoVisibleStandoff27',layout:'action3',background:bg13('戦闘エリア','battle area','緊張','tense','day'),beats:[
      beatTwo27('setup','二人の戦闘者が距離を取って対峙する','two fighters face off at a distance',['long','eye-level','side'],[actor27(0,.27,'stand','angry','other-character',.68),actor27(1,.73,'stand','angry','other-character',.68)]),
      beatTwo27('beat','互いに構えながら間合いを測る','both fighters hold their stance and measure distance',['long','low-angle','front'],[actor27(0,.30,'stand','angry','other-character',.70),actor27(1,.70,'stand','angry','other-character',.70)],{sfx:{ja:'…',en:'…'}}),
      beatTwo27('climax','二人が同時に踏み込んで激突する直前を見せる','both commit forward just before collision',['medium','dutch-angle','side'],[actor27(0,.38,'run','angry','other-character',.64),actor27(1,.62,'run','angry','other-character',.64)],{lineEffect:'speed',sfx:{ja:'ダッ',en:'DASH'}})
    ]}
  });

  templateMeta13('twoVisibleChat27','daily','二人を同じ画面に出したまま会話のキャッチボールを見せる4コマです。','A four-panel conversation that keeps both participants visibly in the scene.','友人同士の日常会話、掛け合い','Everyday dialogue and back-and-forth',['2人表示','会話','友人']);
  templateMeta13('twoVisibleAffection27','romance','二人を同じコマに出し、距離が縮まるいちゃいちゃを見せます。','Keeps both characters visible while their physical distance closes.','両想い、恋人、甘い日常','Mutual affection, couples, sweet daily scenes',['2人表示','いちゃいちゃ','甘い']);
  templateMeta13('twoVisibleGaze27','romance','二人の視線と距離を同じ画面内で見せる3コマです。','Shows mutual gaze and distance inside the same frame.','見つめ合い、静かな恋愛','Mutual gaze, quiet romance',['2人表示','見つめ合い','照れ']);
  templateMeta13('twoVisibleHug27','romance','抱きつく前後を二人とも画面に残して見せます。','Keeps both characters visible before and after a hug.','ハグ、再会、甘い場面','Hugs, reunions, affectionate scenes',['2人表示','ハグ','恋愛']);
  templateMeta13('twoVisibleStandoff27','battle','対峙する二人を同じ画面内に置いて間合いを見せる戦闘テンプレです。','A battle template that keeps both fighters visible to communicate spacing.','対決、間合い、戦闘導入','Conflict, spacing, battle setup',['2人表示','バトル','対峙']);

  for(const id of ['twoVisibleChat27','twoVisibleAffection27','twoVisibleGaze27','twoVisibleHug27','twoVisibleStandoff27']){
    const relationship=id==='twoVisibleStandoff27'?'battle':id==='twoVisibleChat27'?'friends':'romance';
    const dialogueDensity=id==='twoVisibleChat27'?'high':id==='twoVisibleStandoff27'?'low':'medium';
    defineSceneMeta22(id,{relationship,min:2,recommended:2,max:2,presentation:'two-shot',dialogueDensity,artHint:'both',offPanelPartner:false,dialoguePolicy:dialogueDensity==='high'?'conversation':undefined,minimumDialogueBeats:id==='twoVisibleChat27'?4:0});
    meta13[id].scene27={visibleMode:'two-visible',requiresBases:2};
  }
}
registerTwoVisibleTemplates27();

const sceneInfoBase27=sceneInfo22;
sceneInfo22=function(id){
  const scene=sceneInfoBase27(id);if(!scene)return scene;
  const baseId=id===DERIVED_TEMPLATE_ID_13?derivedBaseId13:id;
  if(meta13[baseId]?.scene27?.visibleMode==='two-visible')return {...scene,presentation:'two-shot',offPanelPartner:false};
  return scene;
};

function isTwoVisibleTemplate27(id){const baseId=id===DERIVED_TEMPLATE_ID_13?derivedBaseId13:id;return meta13[baseId]?.scene27?.visibleMode==='two-visible';}
function templateBases27(){
  const list=(project.characterLibrary||[]).filter(Boolean);
  const first=currentBaseCharacter06?.()||list[0]||null;
  if(!first)return[];
  return [first,...list.filter(x=>x.characterId!==first.characterId)];
}

const templateCastSummaryBase27=templateCastSummary26;
templateCastSummary26=function(id){
  const c=templateCastCounts26(id);if(c?.visible>=2&&c.offPanel===0)return language==='ja'?`👥 ${c.visible}人表示（想定${c.expected}人）`:`👥 ${c.visible} visible (${c.expected} expected)`;
  return templateCastSummaryBase27(id);
};
const templateBadgesBase27=templateBadges22;
templateBadges22=function(id){
  let html=templateBadgesBase27(id);
  if(isTwoVisibleTemplate27(id)&&(project.characterLibrary||[]).length<2){
    html=html.replace('</span>',`<em class="template-needs-bases27">⚠ ${escapeXml(t('templateTwoBasesRequired27'))}</em></span>`);
  }
  return html;
};

function hasActiveSemanticQuickFilters27(filters=activeTemplateFilters27){
  return ['visible','relationship','dialogue','art'].some(key=>filters[key]!=='all');
}
function templateMatchesQuick27(id){
  const c=templateCastCounts26(id),scene=c?.scene;
  if(!c||!scene)return !hasActiveSemanticQuickFilters27();
  if(activeTemplateFilters27.visible==='1'&&c.visible!==1)return false;
  if(activeTemplateFilters27.visible==='2'&&c.visible<2)return false;
  if(activeTemplateFilters27.relationship!=='all'&&scene.relationship!==activeTemplateFilters27.relationship)return false;
  if(activeTemplateFilters27.dialogue==='high'&&scene.dialogueDensity!=='high')return false;
  if(activeTemplateFilters27.art==='color'&&!['color','both'].includes(scene.artHint))return false;
  if(activeTemplateFilters27.art==='mono'&&!['mono','both'].includes(scene.artHint))return false;
  return true;
}

renderTemplateGallery13=function(){
  const box=$('templateGallery13');if(!box)return;
  const category=$('templateCategory13')?.value||'all',q=$('templateSearch13')?.value?.trim()||'',selected=selectedTemplateId13();
  const entries=Object.entries(storyTemplates11).filter(([id,tpl])=>id!==DERIVED_TEMPLATE_ID_13&&templateMatches13(id,tpl,category,q)&&templateMatchesQuick27(id));
  box.innerHTML=entries.length?entries.map(([id,tpl])=>{const m=meta13[id]||{},custom=id.startsWith('custom13:');return `<article class="template-card13 ${selected===id?'selected':''}" data-template-card13="${escapeXml(id)}"><button type="button" class="template-card-main13" data-template-pick13="${escapeXml(id)}">${templateThumb13(tpl)}<span class="template-card-copy13"><strong>${escapeXml(storyName13(id,tpl))}</strong><small>${templatePanelCount13(tpl)} ${escapeXml(t('templatePanels'))} · ${escapeXml(t(categoryKeys13[m.category]||'templateCategoryDaily'))}</small>${templateBadges22(id)}<span>${escapeXml(localized13x(m.desc)||'')}</span></span></button>${custom?`<button type="button" class="template-delete13" data-template-delete13="${escapeXml(id)}">${escapeXml(t('templateDelete'))}</button>`:''}</article>`}).join(''):`<p class="help">${escapeXml(t('templateNoMatch'))}</p>`;
  syncQuickFilterButtons27();
};

function quickFilterButton27(group,value,key){return `<button type="button" class="template-filter-chip27" data-template-filter-group27="${group}" data-template-filter-value27="${value}" data-i18n="${key}"></button>`;}
function installQuickFilters27(){
  const studio=$('templateStudio13'),anchor=studio?.querySelector('.template-filter13');if(!studio||!anchor||$('templateQuickFilters27'))return;
  const row=document.createElement('div');row.id='templateQuickFilters27';row.className='template-quick-filters27';row.innerHTML=`<strong data-i18n="templateQuickFilter27"></strong><button type="button" class="template-filter-chip27 reset" data-template-filter-reset27 data-i18n="templateFilterReset27"></button>${quickFilterButton27('visible','1','templateFilterVisibleOne27')}${quickFilterButton27('visible','2','templateFilterVisibleTwo27')}${quickFilterButton27('relationship','romance','templateFilterRomance27')}${quickFilterButton27('relationship','friends','templateFilterFriends27')}${quickFilterButton27('relationship','battle','templateFilterBattle27')}${quickFilterButton27('dialogue','high','templateFilterDialogueHigh27')}${quickFilterButton27('art','color','templateFilterColor27')}${quickFilterButton27('art','mono','templateFilterMono27')}`;
  anchor.insertAdjacentElement('afterend',row);
  row.addEventListener('click',e=>{
    const reset=e.target.closest('[data-template-filter-reset27]');
    if(reset){for(const k of Object.keys(activeTemplateFilters27))activeTemplateFilters27[k]='all';renderTemplateGallery13();return;}
    const btn=e.target.closest('[data-template-filter-group27]');if(!btn)return;
    const group=btn.dataset.templateFilterGroup27,value=btn.dataset.templateFilterValue27;
    activeTemplateFilters27[group]=activeTemplateFilters27[group]===value?'all':value;
    renderTemplateGallery13();
  });
  applyLanguage();
}
function syncQuickFilterButtons27(){
  document.querySelectorAll('[data-template-filter-group27]').forEach(btn=>btn.classList.toggle('active',activeTemplateFilters27[btn.dataset.templateFilterGroup27]===btn.dataset.templateFilterValue27));
  const any=Object.values(activeTemplateFilters27).some(v=>v!=='all');$('templateQuickFilters27')?.querySelector('[data-template-filter-reset27]')?.classList.toggle('active',!any);
}

function makeActorInstance27(base,panel,beat,actor){
  const actorBeat={...beat,pose:actor.pose||beat.pose,expression:actor.expression||beat.expression,gaze:actor.gaze||beat.gaze};
  const ch=makeStoryInstance11(base,panel,actorBeat);
  ch.x=panel.rect.x+panel.rect.w*Math.max(.08,Math.min(.92,Number(actor.x)||.5));
  ch.y+=panel.rect.h*(Number(actor.yOffset)||0);
  ch.scale=Math.max(.35,ch.scale*(Number(actor.scale)||.72));
  return ch;
}
function applyTwoVisibleTemplate27(){
  const id=selectedTemplateId13(),tpl=storyTemplates11[id];if(!tpl)return;
  if(!isTwoVisibleTemplate27(id)){applyTemplateReadingAware17();return;}
  const bases=templateBases27();
  if(bases.length<2){alert(t('templateNeedsTwoBases27'));document.querySelector('.tab[data-tab="character"]')?.click();return;}
  const page=currentPage(),hasAuthored=page.panels.some(p=>p.characters?.length||p.balloons?.length||p.effects?.sfxText||p.actionIntent);
  if(hasAuthored&&!confirm(t('storyTemplateConfirm')))return;
  const withText=$('storyTemplateText11')?.checked!==false,size=pageSize04(),rects=templateRects13(tpl,size),defaultBg=tpl.background?.[language]||tpl.background?.ja||{};
  mutate(()=>{
    page.panels=rects.map((r,i)=>makePanel(r,i+1));
    project.meta.layoutPreset=tpl.layout||'custom';project.meta.storyTemplate=id===DERIVED_TEMPLATE_ID_13?`${derivedBaseId13}:derived`:id;project.meta.randomPurpose='';project.meta.randomSeed='';project.meta.randomVariant=undefined;
    renumberPanels();
    const ordered=readingOrderedPanels16(page);
    ordered.forEach((panel,i)=>{
      const beat=tpl.beats[i]||tpl.beats.at(-1)||{};
      panel.role=beat.role||'setup';panel.actionIntent=localized13x(beat.action);
      Object.assign(panel.camera,{distance:beat.camera?.[0]||'medium',angle:beat.camera?.[1]||'eye-level',viewpoint:beat.camera?.[2]||'front'});
      Object.assign(panel.background,beat.background?.[language]||beat.background?.ja||defaultBg);
      panel.effects.lineEffect=beat.lineEffect||'none';panel.effects.strength=beat.lineEffect?'high':'medium';panel.effects.sfxWritingMode='inherit';panel.style.breakout=beat.breakout||'none';
      const actors=beat.actors27?.length?beat.actors27:[actor27(0,.32),actor27(1,.68)];
      panel.characters=actors.slice(0,2).map((actor,index)=>makeActorInstance27(bases[actor.index??index]||bases[index]||bases[0],panel,beat,actor));
      if(withText&&beat.dialogue){
        const speakerIndex=Math.max(0,Math.min(1,Number(beat.speakerIndex27)||0)),speakerBase=bases[speakerIndex],speakerActor=actors.find(a=>(a.index??0)===speakerIndex)||actors[speakerIndex]||actors[0];
        const balloon=makeStoryBalloon11(panel,localized13x(beat.dialogue),speakerBase,beat.balloonType||'speech');
        balloon.x=panel.rect.x+panel.rect.w*((Number(speakerActor?.x)||.5)<.5?.27:.73);panel.balloons=[balloon];
      }
      if(withText&&beat.sfx)panel.effects.sfxText=localized13x(beat.sfx);
    });
    selectedPanelId=ordered[0]?.id||page.panels[0]?.id||null;selectedCharacterId=null;selectedBalloonId=null;
  });
}
function bindTwoVisibleApply27(){const old=$('applyStoryTemplate11');if(old){const fresh=old.cloneNode(true);old.replaceWith(fresh);fresh.addEventListener('click',applyTwoVisibleTemplate27);}}

function installTwoVisibleHelp27(){
  const d=$('helpDialog');if(!d||$('guideTwoVisibleSection27'))return;
  const s=document.createElement('section');s.id='guideTwoVisibleSection27';s.className='guide-section';s.innerHTML=`<h3 data-i18n="guideTwoVisible27"></h3><p data-i18n="guideTwoVisibleBody27"></p>`;
  ($('guideCastMeaningSection26')||$('guideCastFallback23')||$('guideSceneContract22'))?.insertAdjacentElement('afterend',s);
}
function installTwoVisibleStyles27(){
  if($('twoVisibleStyle27'))return;const s=document.createElement('style');s.id='twoVisibleStyle27';s.textContent=`
.template-quick-filters27{display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin:8px 0 10px}.template-quick-filters27>strong{font-size:12px;color:#475569;margin-right:2px}.template-filter-chip27{min-height:32px;border:1px solid #cbd5e1;background:#fff;border-radius:999px;padding:5px 9px;font-size:11px}.template-filter-chip27.active{background:#111827;color:#fff;border-color:#111827}.template-needs-bases27{background:#fff7ed!important;color:#9a3412!important;border:1px solid #fdba74}.template-card13:has(.template-needs-bases27){border-color:#fdba74}@media(max-width:760px){.template-quick-filters27{flex-wrap:nowrap;overflow-x:auto;padding-bottom:3px}.template-quick-filters27>strong,.template-filter-chip27{flex:0 0 auto}}
`;document.head.appendChild(s);
}

const applyLanguageBase27=applyLanguage;
applyLanguage=function(){
  applyLanguageBase27();installQuickFilters27();installTwoVisibleHelp27();
  document.querySelectorAll('#templateQuickFilters27 [data-i18n],#guideTwoVisibleSection27 [data-i18n]').forEach(el=>el.textContent=t(el.dataset.i18n));
  syncTemplateSelect13();renderTemplateGallery13();renderTemplatePreview13();renderQuickStatus22();syncQuickFilterButtons27();
};

installTwoVisibleStyles27();installQuickFilters27();installTwoVisibleHelp27();syncTemplateSelect13();bindTwoVisibleApply27();renderTemplateGallery13();renderTemplatePreview13();renderQuickStatus22();render();
document.querySelector('footer')&&(document.querySelector('footer').textContent='Prototype 0.12.5 · two-visible templates · quick filters');
