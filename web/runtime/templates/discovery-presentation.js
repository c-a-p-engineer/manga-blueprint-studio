// Template discovery UX: remove the duplicate selector UI, expose presentation filters,
// and provide built-in examples for shape/frame/effect discovery.

Object.assign(i18n.ja,{
  templateFilterPresentation35:'演出',
  templateFilterWithEffects35:'演出あり',
  templateFilterPlain35:'演出なし',
  templateFilterDiagonal35:'斜めコマ',
  templateFilterImpactBorder35:'衝撃枠',
  templateFilterBorderless35:'枠無し',
  templateFilterInset35:'小窓',
  templateFilterFocus35:'集中線',
  templateFilterSpeed35:'スピード線',
  templateFilterImpact35:'衝撃線',
  templateFilterTension35:'緊張線',
  templateFilterSilence35:'無音・間',
  templateFilterBreakout35:'ブチ抜き',
  templateApplySelected35:'このテンプレを使う',
  storyRushImpact35:'突進→一撃 3コマ',
  storyRapidExchange35:'連続攻防 4コマ',
  storyShockReveal35:'衝撃の発見 3コマ',
  storyUneasyApproach35:'不穏な接近 3コマ',
  storyQuietAftermath35:'静かな余韻 3コマ',
  storyComicInset35:'ツッコミ小窓 4コマ'
});
Object.assign(i18n.en,{
  templateFilterPresentation35:'Presentation',
  templateFilterWithEffects35:'With effects',
  templateFilterPlain35:'No effects',
  templateFilterDiagonal35:'Diagonal panels',
  templateFilterImpactBorder35:'Impact border',
  templateFilterBorderless35:'Borderless',
  templateFilterInset35:'Inset',
  templateFilterFocus35:'Focus lines',
  templateFilterSpeed35:'Speed lines',
  templateFilterImpact35:'Impact lines',
  templateFilterTension35:'Tension lines',
  templateFilterSilence35:'Silence / beat',
  templateFilterBreakout35:'Breakout',
  templateApplySelected35:'Use this template',
  storyRushImpact35:'Rush → impact 3-panel',
  storyRapidExchange35:'Rapid exchange 4-panel',
  storyShockReveal35:'Shocking discovery 3-panel',
  storyUneasyApproach35:'Uneasy approach 3-panel',
  storyQuietAftermath35:'Quiet aftermath 3-panel',
  storyComicInset35:'Comedy inset 4-panel'
});

Object.assign(activeTemplateFilters27,{presentationFx:'all',geometry:'all',border:'all',effect:'all',breakout:'all'});

function registerPresentationSampleTemplates35(){
  Object.assign(storyTemplates11,{
    rushImpact35:{label:'storyRushImpact35',layout:'diagonal3',background:bg13('戦闘エリア','battle area','高速','fast'),beats:[
      beat13('setup','相手へ一気に駆け出す','bursts into a run toward the opponent','run','angry','other-character',['long','eye-level','side'],{lineEffect:'speed',sfx:{ja:'ダッ',en:'DASH'}}),
      beat13('transition','踏み込んで拳を振り抜く','plants the step and drives the fist through','punch','angry','other-character',['medium','low-angle','three-quarter-front'],{lineEffect:'speed',sfx:{ja:'ゴッ',en:'WHOOSH'}}),
      beat13('climax','決定打が当たる瞬間を最大化する','maximizes the instant the decisive hit lands','punch','angry','other-character',['extreme-close','low-angle','near-object'],{lineEffect:'impact',border:'impact',breakout:'foreground',sfx:{ja:'バキッ',en:'CRACK'}})
    ]},
    rapidExchange35:{label:'storyRapidExchange35',layout:'diagonal4',background:bg13('戦闘エリア','battle area','激しい','intense'),beats:[
      beat13('setup','互いに踏み込んで攻防が始まる','both fighters step in as the exchange begins','run','angry','other-character',['long','eye-level','side'],{lineEffect:'speed',sfx:{ja:'ダッ',en:'DASH'}}),
      beat13('beat','最初の打撃を受け流す','deflects the first strike','stand','angry','other-character',['medium','dutch-angle','three-quarter-front'],{lineEffect:'impact',sfx:{ja:'ガッ',en:'CLACK'}}),
      beat13('transition','間髪入れず追撃へ移る','immediately turns the defense into a follow-up','punch','angry','other-character',['medium','low-angle','side'],{lineEffect:'speed',sfx:{ja:'シュッ',en:'SWISH'}}),
      beat13('climax','最後の一撃を衝撃枠で締める','ends the exchange with a final impact-framed strike','punch','angry','other-character',['close','low-angle','near-object'],{lineEffect:'impact',border:'impact',breakout:'foreground',sfx:{ja:'ドゴッ',en:'WHAM'}})
    ]},
    shockReveal35:{label:'storyShockReveal35',layout:'action3',background:bg13('室内','room','張りつめた','tense'),beats:[
      beat13('setup','手元の小さな違和感へ気づく','notices a small inconsistency nearby','stand','neutral','down',['medium','eye-level','near-object'],{border:'inset'}),
      beat13('reaction','意味を理解して表情が変わる','understands what it means and reacts','stand','surprised','down',['close','eye-level','front'],{lineEffect:'focus',sfx:{ja:'！',en:'!'}}),
      beat13('climax','発見した事実を強い寄りで見せる','reveals the discovery in a strong close shot','stand','surprised','camera',['extreme-close','eye-level','front'],{lineEffect:'focus',sfx:{ja:'まさか…',en:'NO WAY…'}})
    ]},
    uneasyApproach35:{label:'storyUneasyApproach35',layout:'action3',background:bg13('夜の廊下','hallway at night','不穏','uneasy','night'),beats:[
      beat13('setup','遠くの人影に気づいて足を止める','stops after noticing a distant silhouette','stand','fear','other-character',['long','eye-level','front']),
      beat13('transition','人影がゆっくり近づいてくる','the silhouette slowly moves closer','lookback','fear','other-character',['medium','dutch-angle','front'],{lineEffect:'tension',sfx:{ja:'…コツ',en:'…STEP'}}),
      beat13('climax','相手の気配だけを残して枠を消す','drops the frame and leaves only the approaching presence','stand','fear','away',['close','eye-level','front'],{lineEffect:'tension',border:'borderless'})
    ]},
    quietAftermath35:{label:'storyQuietAftermath35',layout:'action3',background:bg13('夕方の部屋','room at sunset','静か','quiet','evening'),beats:[
      beat13('setup','出来事の直後、動かず息を整える','stays still and catches their breath after the event','stand','neutral','down',['medium','eye-level','three-quarter-front'],{lineEffect:'silence'}),
      beat13('beat','言葉にせず視線だけを動かす','moves only the eyes without speaking','stand','sad','away',['close','eye-level','front'],{lineEffect:'silence'}),
      beat13('afterglow','枠を消した静かな大きめの余韻で締める','ends on a quiet borderless afterglow','stand','neutral','away',['close','eye-level','three-quarter-front'],{lineEffect:'silence',border:'borderless'})
    ]},
    comicInset35:{label:'storyComicInset35',layout:'four-grid',background:bg13('シンプルな室内','simple room','軽い','light'),beats:[
      beat13('setup','普通に話を続ける','continues the conversation normally','stand','neutral','other-character',['medium','eye-level','front'],{dialogue:{ja:'だから大丈夫だって',en:'I said it is fine.'}}),
      beat13('reaction','小窓で相手の微妙な表情を抜く','cuts to the partner awkward expression in an inset','stand','neutral','camera',['close','eye-level','front'],{border:'inset',lineEffect:'silence'}),
      beat13('transition','言い切った直後に失敗へ気づく','realizes the mistake immediately after finishing the claim','crouch','surprised','down',['close','high-angle','front'],{border:'inset',sfx:{ja:'あっ',en:'OH'}}),
      beat13('reaction','無音でこちらを見る','silently looks toward the viewer','stand','neutral','camera',['close','eye-level','front'],{lineEffect:'silence',dialogue:{ja:'…今の忘れて',en:'…Forget that.'}})
    ]}
  });

  templateMeta13('rushImpact35','battle','斜め3コマで突進から決定打までを一気に見せます。','A diagonal three-panel rush that drives directly into a decisive impact.','突進、一撃必殺、斜めコマ、衝撃枠','Rush attacks, finishers, diagonal panels, impact frames',['斜め','衝撃枠','スピード線','衝撃線']);
  templateMeta13('rapidExchange35','battle','斜め4コマで受け流しと追撃を高速に往復します。','A diagonal four-panel exchange that alternates defense and follow-up attacks.','連続攻防、格闘、速度感','Rapid exchanges, martial arts, speed',['斜め','連続攻防','衝撃枠']);
  templateMeta13('shockReveal35','emotion','小窓から集中線へ切り替え、発見の衝撃を段階的に強めます。','Builds a discovery from an inset detail into focused reaction shots.','発見、ひらめき、驚き、小窓、集中線','Discovery, realization, surprise, inset, focus lines',['小窓','集中線','発見']);
  templateMeta13('uneasyApproach35','suspense','緊張線と枠無しを使い、近づく気配を不穏に見せます。','Uses tension lines and a borderless finish for an approaching presence.','ホラー、不穏、接近、緊張線、枠無し','Horror, unease, approach, tension lines, borderless',['緊張線','枠無し','ホラー']);
  templateMeta13('quietAftermath35','emotion','無音の間を重ね、最後は枠無しで静かな余韻を残します。','Stacks silent beats and ends borderless for a quiet afterglow.','余韻、沈黙、感情整理、枠無し','Aftermath, silence, emotional pause, borderless',['無音','間','枠無し']);
  templateMeta13('comicInset35','comedy','小窓と無音の間を使ってツッコミ待ちの空気を作ります。','Uses inset reaction shots and silence to create a comedy beat.','ギャグ、小窓、無言オチ、ツッコミ','Comedy, inset reactions, silent punchlines',['小窓','無音','ギャグ']);

  defineSceneMeta22('rushImpact35',{relationship:'battle',min:2,recommended:2,max:2,presentation:'single',dialogueDensity:'low',artHint:'both',offPanelPartner:true});
  defineSceneMeta22('rapidExchange35',{relationship:'battle',min:2,recommended:2,max:2,presentation:'single',dialogueDensity:'low',artHint:'both',offPanelPartner:true});
  defineSceneMeta22('shockReveal35',{relationship:'solo',min:1,recommended:1,max:1,presentation:'single',dialogueDensity:'low',artHint:'both',offPanelPartner:false});
  defineSceneMeta22('uneasyApproach35',{relationship:'solo',min:1,recommended:1,max:1,presentation:'single',dialogueDensity:'low',artHint:'mono',offPanelPartner:false});
  defineSceneMeta22('quietAftermath35',{relationship:'solo',min:1,recommended:1,max:1,presentation:'single',dialogueDensity:'low',artHint:'both',offPanelPartner:false});
  defineSceneMeta22('comicInset35',{relationship:'friends',min:2,recommended:2,max:2,presentation:'single',dialogueDensity:'medium',artHint:'both',offPanelPartner:true});
}
registerPresentationSampleTemplates35();

function configurePresentationExamples35(){
  const setLayout=(id,layout)=>{if(storyTemplates11[id])storyTemplates11[id].layout=layout;};
  const setBeat=(id,index,patch)=>{
    const beats=storyTemplates11[id]?.beats;if(!beats?.length)return;
    const target=index<0?beats[beats.length+index]:beats[index];if(target)Object.assign(target,patch);
  };
  setLayout('decisiveBlow','diagonal3');
  setBeat('decisiveBlow',-1,{border:'impact'});
  setLayout('aerialAttack','diagonal3');
  setBeat('aerialAttack',-1,{border:'impact'});
  setLayout('counterattack','diagonal4');
  setBeat('counterattack',-1,{border:'impact'});
  setLayout('angerBurst','diagonal3');
  setBeat('angerBurst',-1,{border:'impact'});
  setBeat('characterIntro',-1,{border:'borderless'});
  setBeat('kissAfter',-1,{border:'borderless'});
  setBeat('smugFail',2,{border:'inset'});
  setBeat('smugFail',-1,{lineEffect:'silence'});
  setBeat('presenceBehind',1,{lineEffect:'tension'});
  setBeat('twoVisibleStandoff27',1,{lineEffect:'focus'});
  setBeat('twoVisibleStandoff27',-1,{border:'impact'});
}
configurePresentationExamples35();

function templatePresentationFeatures35(id,tpl=storyTemplates11[id]){
  const features={geometry:new Set(),border:new Set(),effect:new Set(),breakout:new Set()};
  if(!tpl)return features;
  if(['diagonal3','diagonal4'].includes(tpl.layout))features.geometry.add('diagonal');
  const normalizedPanels=Array.isArray(tpl.normalizedPanels)?tpl.normalizedPanels:[];
  if(normalizedPanels.some(panel=>panel?.shape?.kind==='quad'))features.geometry.add('diagonal');
  for(const beat of tpl.beats||[]){
    const border=typeof storyTemplateBorder34==='function'?storyTemplateBorder34(beat.border):(beat.border||'normal');
    if(border!=='normal')features.border.add(border);
    const effect=String(beat.lineEffect||'none');
    if(effect!=='none')features.effect.add(effect);
    const breakout=String(beat.breakout||'none');
    if(breakout!=='none')features.breakout.add(breakout);
  }
  return features;
}
function hasPresentationEffects35(features){return !!(features.geometry.size||features.border.size||features.effect.size||features.breakout.size);}
function matchesPresentationFilters35(features,filters=activeTemplateFilters27){
  const hasAny=hasPresentationEffects35(features);
  if(filters.presentationFx==='with'&&!hasAny)return false;
  if(filters.presentationFx==='plain'&&hasAny)return false;
  if(filters.geometry==='diagonal'&&!features.geometry.has('diagonal'))return false;
  if(filters.border!=='all'&&!features.border.has(filters.border))return false;
  if(filters.effect!=='all'&&!features.effect.has(filters.effect))return false;
  if(filters.breakout==='any'&&!features.breakout.size)return false;
  return true;
}

function presentationSearchTerms35(id,tpl=storyTemplates11[id]){
  const f=templatePresentationFeatures35(id,tpl),terms=[];
  if(f.geometry.has('diagonal'))terms.push('斜め','斜めコマ','diagonal');
  if(f.border.has('impact'))terms.push('衝撃枠','impact border');
  if(f.border.has('borderless'))terms.push('枠無し','枠なし','borderless');
  if(f.border.has('inset'))terms.push('小窓','inset');
  if(f.effect.has('focus'))terms.push('集中線','focus lines');
  if(f.effect.has('speed'))terms.push('スピード線','speed lines');
  if(f.effect.has('impact'))terms.push('衝撃線','impact lines');
  if(f.effect.has('tension'))terms.push('緊張線','tension lines');
  if(f.effect.has('silence'))terms.push('無音','間','silence');
  if(f.breakout.size)terms.push('ブチ抜き','ぶち抜き','breakout');
  if(hasPresentationEffects35(f))terms.push('演出あり','with effects');else terms.push('演出なし','no effects','plain');
  return terms;
}

const templateMatchesBase35=templateMatches13;
templateMatches13=function(id,tpl,category,q){
  if(templateMatchesBase35(id,tpl,category,q))return true;
  const m=meta13[id]||{category:'daily'};
  if(category!=='all'&&m.category!==category)return false;
  const needle=String(q||'').trim().toLowerCase();if(!needle)return true;
  return presentationSearchTerms35(id,tpl).join(' ').toLowerCase().includes(needle);
};

const templateMatchesQuickBase35=templateMatchesQuick27;
templateMatchesQuick27=function(id){
  if(!templateMatchesQuickBase35(id))return false;
  return matchesPresentationFilters35(templatePresentationFeatures35(id),activeTemplateFilters27);
};

function presentationFeatureLabels35(id){
  const f=templatePresentationFeatures35(id),labels=[];
  if(f.geometry.has('diagonal'))labels.push(t('templateFilterDiagonal35'));
  if(f.border.has('impact'))labels.push(t('templateFilterImpactBorder35'));
  if(f.border.has('borderless'))labels.push(t('templateFilterBorderless35'));
  if(f.border.has('inset'))labels.push(t('templateFilterInset35'));
  if(f.effect.has('focus'))labels.push(t('templateFilterFocus35'));
  if(f.effect.has('speed'))labels.push(t('templateFilterSpeed35'));
  if(f.effect.has('impact'))labels.push(t('templateFilterImpact35'));
  if(f.effect.has('tension'))labels.push(t('templateFilterTension35'));
  if(f.effect.has('silence'))labels.push(t('templateFilterSilence35'));
  if(f.breakout.size)labels.push(t('templateFilterBreakout35'));
  return labels;
}

function presentationSampleInventory35(){
  const out={withEffects:0,plain:0,diagonal:0,impactBorder:0,borderless:0,inset:0,focus:0,speed:0,impact:0,tension:0,silence:0,breakout:0};
  for(const [id,tpl] of Object.entries(storyTemplates11)){
    if(id===DERIVED_TEMPLATE_ID_13)continue;
    const f=templatePresentationFeatures35(id,tpl),hasAny=hasPresentationEffects35(f);
    out[hasAny?'withEffects':'plain']++;
    if(f.geometry.has('diagonal'))out.diagonal++;
    if(f.border.has('impact'))out.impactBorder++;
    if(f.border.has('borderless'))out.borderless++;
    if(f.border.has('inset'))out.inset++;
    if(f.effect.has('focus'))out.focus++;
    if(f.effect.has('speed'))out.speed++;
    if(f.effect.has('impact'))out.impact++;
    if(f.effect.has('tension'))out.tension++;
    if(f.effect.has('silence'))out.silence++;
    if(f.breakout.size)out.breakout++;
  }
  return out;
}

globalThis.templatePresentationSampleInventory35=presentationSampleInventory35;

const templateBadgesBase35=templateBadges22;
templateBadges22=function(id){
  const base=templateBadgesBase35(id),labels=presentationFeatureLabels35(id);
  if(!labels.length)return base;
  const chips=labels.map(label=>`<em class="template-presentation-chip35">${escapeXml(label)}</em>`).join('');
  return `${base}<span class="template-presentation-badges35">${chips}</span>`;
};

function thumbPoints35(spec){
  if(spec?.shape?.kind==='quad'&&Array.isArray(spec.shape.points)&&spec.shape.points.length===4)return spec.shape.points;
  const r=spec.rect;return[{x:r.x,y:r.y},{x:r.x+r.w,y:r.y},{x:r.x+r.w,y:r.y+r.h},{x:r.x,y:r.y+r.h}];
}
templateThumb13=function(tpl){
  const logicalSpecs=templatePanelSpecs34(tpl,pageSize04()),logicalRects=logicalSpecs.map(spec=>spec.rect),order=previewOrder08(logicalRects),thumbSpecs=templatePanelSpecs34(tpl,{w:100,h:132});
  return `<svg class="template-thumb13 template-thumb-shape35" viewBox="0 0 100 132" aria-hidden="true">${thumbSpecs.map((spec,index)=>{const r=spec.rect,points=thumbPoints35(spec).map(point=>`${Number(point.x).toFixed(2)},${Number(point.y).toFixed(2)}`).join(' '),n=order.get(logicalRects[index])||index+1;return `<polygon points="${points}"/><text x="${r.x+r.w/2}" y="${r.y+r.h/2+3}" text-anchor="middle">${n}</text>`;}).join('')}</svg>`;
};

function installPresentationFilters35(){
  const row=$('templateQuickFilters27');if(!row||$('templatePresentationFilters35'))return;
  const group=document.createElement('span');group.id='templatePresentationFilters35';group.className='template-presentation-filters35';
  group.innerHTML=`<span class="template-filter-group-label35" data-i18n="templateFilterPresentation35"></span>${quickFilterButton27('presentationFx','with','templateFilterWithEffects35')}${quickFilterButton27('presentationFx','plain','templateFilterPlain35')}${quickFilterButton27('geometry','diagonal','templateFilterDiagonal35')}${quickFilterButton27('border','impact','templateFilterImpactBorder35')}${quickFilterButton27('border','borderless','templateFilterBorderless35')}${quickFilterButton27('border','inset','templateFilterInset35')}${quickFilterButton27('effect','focus','templateFilterFocus35')}${quickFilterButton27('effect','speed','templateFilterSpeed35')}${quickFilterButton27('effect','impact','templateFilterImpact35')}${quickFilterButton27('effect','tension','templateFilterTension35')}${quickFilterButton27('effect','silence','templateFilterSilence35')}${quickFilterButton27('breakout','any','templateFilterBreakout35')}`;
  row.appendChild(group);
}

function hideDuplicateTemplateSelect35(){
  const select=$('storyTemplateSelect11'),label=select?.closest('label');
  if(label){label.hidden=true;label.setAttribute('aria-hidden','true');}
  const apply=$('applyStoryTemplate11');
  if(apply){apply.dataset.i18n='templateApplySelected35';apply.textContent=t('templateApplySelected35');}
}

function installDiscoveryPresentationStyles35(){
  if($('templateDiscoveryPresentationStyle35'))return;
  const style=document.createElement('style');style.id='templateDiscoveryPresentationStyle35';style.textContent=`
.template-presentation-filters35{display:contents}
.template-filter-group-label35{font-size:11px;color:#64748b;font-weight:700;margin-left:6px}
.template-presentation-badges35{display:flex;gap:4px;flex-wrap:wrap;margin-top:2px}
.template-presentation-chip35{font-style:normal;font-size:10px;line-height:1.2;padding:2px 6px;border:1px solid #cbd5e1;border-radius:999px;background:#f8fafc;color:#334155}
.template-thumb-shape35 polygon{fill:#fff;stroke:#111827;stroke-width:1.6;vector-effect:non-scaling-stroke}
.template-thumb-shape35 text{fill:#111827;font-size:9px;font-weight:800;font-family:system-ui,sans-serif}
@media(max-width:760px){.template-filter-group-label35{flex:0 0 auto;margin-left:2px}.template-presentation-filters35{display:contents}}
`;
  document.head.appendChild(style);
}

const applyLanguageBase35=applyLanguage;
applyLanguage=function(){
  applyLanguageBase35();
  installPresentationFilters35();hideDuplicateTemplateSelect35();
  document.querySelectorAll('#templatePresentationFilters35 [data-i18n]').forEach(el=>el.textContent=t(el.dataset.i18n));
  renderTemplateGallery13?.();renderTemplatePreview13?.();
};

installDiscoveryPresentationStyles35();
installPresentationFilters35();
hideDuplicateTemplateSelect35();
applyLanguage();