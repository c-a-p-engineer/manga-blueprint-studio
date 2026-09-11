// Template discovery UX: remove the duplicate selector UI, expose presentation filters,
// and provide built-in examples for shape/frame/effect discovery.

Object.assign(i18n.ja,{
  templateFilterPresentation35:'演出',
  templateFilterDiagonal35:'斜めコマ',
  templateFilterImpactBorder35:'衝撃枠',
  templateFilterBorderless35:'枠無し',
  templateFilterFocus35:'集中線',
  templateFilterSpeed35:'スピード線',
  templateFilterImpact35:'衝撃線',
  templateFilterBreakout35:'ブチ抜き',
  templateApplySelected35:'このテンプレを使う'
});
Object.assign(i18n.en,{
  templateFilterPresentation35:'Presentation',
  templateFilterDiagonal35:'Diagonal panels',
  templateFilterImpactBorder35:'Impact border',
  templateFilterBorderless35:'Borderless',
  templateFilterFocus35:'Focus lines',
  templateFilterSpeed35:'Speed lines',
  templateFilterImpact35:'Impact lines',
  templateFilterBreakout35:'Breakout',
  templateApplySelected35:'Use this template'
});

Object.assign(activeTemplateFilters27,{geometry:'all',border:'all',effect:'all',breakout:'all'});

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

const templateMatchesQuickBase35=templateMatchesQuick27;
templateMatchesQuick27=function(id){
  if(!templateMatchesQuickBase35(id))return false;
  const f=templatePresentationFeatures35(id);
  if(activeTemplateFilters27.geometry==='diagonal'&&!f.geometry.has('diagonal'))return false;
  if(activeTemplateFilters27.border!=='all'&&!f.border.has(activeTemplateFilters27.border))return false;
  if(activeTemplateFilters27.effect!=='all'&&!f.effect.has(activeTemplateFilters27.effect))return false;
  if(activeTemplateFilters27.breakout==='any'&&!f.breakout.size)return false;
  return true;
};

function presentationFeatureLabels35(id){
  const f=templatePresentationFeatures35(id),labels=[];
  if(f.geometry.has('diagonal'))labels.push(t('templateFilterDiagonal35'));
  if(f.border.has('impact'))labels.push(t('templateFilterImpactBorder35'));
  if(f.border.has('borderless'))labels.push(t('templateFilterBorderless35'));
  if(f.effect.has('focus'))labels.push(t('templateFilterFocus35'));
  if(f.effect.has('speed'))labels.push(t('templateFilterSpeed35'));
  if(f.effect.has('impact'))labels.push(t('templateFilterImpact35'));
  if(f.breakout.size)labels.push(t('templateFilterBreakout35'));
  return labels;
}

const templateBadgesBase35=templateBadges22;
templateBadges22=function(id){
  const base=templateBadgesBase35(id),labels=presentationFeatureLabels35(id);
  if(!labels.length)return base;
  const chips=labels.map(label=>`<em class="template-presentation-chip35">${escapeXml(label)}</em>`).join('');
  return `${base}<span class="template-presentation-badges35">${chips}</span>`;
};

function installPresentationFilters35(){
  const row=$('templateQuickFilters27');if(!row||$('templatePresentationFilters35'))return;
  const group=document.createElement('span');group.id='templatePresentationFilters35';group.className='template-presentation-filters35';
  group.innerHTML=`<span class="template-filter-group-label35" data-i18n="templateFilterPresentation35"></span>${quickFilterButton27('geometry','diagonal','templateFilterDiagonal35')}${quickFilterButton27('border','impact','templateFilterImpactBorder35')}${quickFilterButton27('border','borderless','templateFilterBorderless35')}${quickFilterButton27('effect','focus','templateFilterFocus35')}${quickFilterButton27('effect','speed','templateFilterSpeed35')}${quickFilterButton27('effect','impact','templateFilterImpact35')}${quickFilterButton27('breakout','any','templateFilterBreakout35')}`;
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
