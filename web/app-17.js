// Prototype 0.10 integration: Scene Template beats follow panel reading order, and SFX can override writing direction.
Object.assign(i18n.ja,{
  sfxWritingMode:'オノマトペの文字方向',
  sfxWritingHelp:'オノマトペも吹き出しと同じ文字方向の既定を使います。必要なコマだけ縦書き / 横書きを変更できます。'
});
Object.assign(i18n.en,{
  sfxWritingMode:'Onomatopoeia writing direction',
  sfxWritingHelp:'Onomatopoeia uses the same project writing default as balloons. Override only the panels that need vertical or horizontal lettering.'
});

function ensureSfxWritingState17(target=project){
  for(const page of target?.pages||[])for(const panel of page.panels||[]){
    panel.effects ||= defaultEffects();
    if(!['inherit','vertical-rl','horizontal-tb'].includes(panel.effects.sfxWritingMode))panel.effects.sfxWritingMode='inherit';
  }
  return target;
}
function effectiveSfxWritingMode17(panel){
  const mode=panel?.effects?.sfxWritingMode||'inherit';
  return mode==='inherit'?defaultWritingMode15():mode;
}

const normalizeProjectBase17=normalizeProject;
normalizeProject=function(input){return ensureSfxWritingState17(normalizeProjectBase17(input));};
ensureSfxWritingState17(project);

function ensureSfxWritingUi17(){
  const effectsPanel=document.querySelector('.tool-panel[data-section="effects"]');
  if(!effectsPanel||$('sfxWritingMode17'))return;
  const sfxLabel=$('sfxText')?.closest('label');
  if(!sfxLabel)return;
  const label=document.createElement('label');
  label.id='sfxWritingModeWrap17';
  label.innerHTML=`<span data-i18n="sfxWritingMode">オノマトペの文字方向</span><select id="sfxWritingMode17"><option value="inherit"></option><option value="vertical-rl"></option><option value="horizontal-tb"></option></select>`;
  sfxLabel.insertAdjacentElement('afterend',label);
  const help=document.createElement('p');help.id='sfxWritingHelp17';help.className='help';help.dataset.i18n='sfxWritingHelp';label.insertAdjacentElement('afterend',help);
  $('sfxWritingMode17')?.addEventListener('change',e=>{const panel=selectedPanel();if(panel)mutate(()=>{panel.effects.sfxWritingMode=e.target.value;});});
}
function localizeSfxWritingUi17(){
  ensureSfxWritingUi17();
  const label=$('sfxWritingModeWrap17')?.querySelector('[data-i18n]');if(label)label.textContent=t('sfxWritingMode');
  const help=$('sfxWritingHelp17');if(help)help.textContent=t('sfxWritingHelp');
  const select=$('sfxWritingMode17');if(select){
    select.options[0].textContent=writingLabel15('inherit');
    select.options[1].textContent=t('writingVertical');
    select.options[2].textContent=t('writingHorizontal');
  }
}

const renderUiBase17=renderUi;
renderUi=function(){
  ensureSfxWritingState17(project);
  renderUiBase17();
  localizeSfxWritingUi17();
  const panel=selectedPanel(),select=$('sfxWritingMode17');
  if(select){select.disabled=!panel;select.value=panel?.effects?.sfxWritingMode||'inherit';}
};

// Template thumbnails use page-scale geometry for ordering, then draw the same numbers into thumbnail-scale geometry.
templateThumb13=function(tpl){
  const logicalRects=templateRects13(tpl,pageSize04()),order=previewOrder08(logicalRects),thumbRects=templateRects13(tpl,{w:100,h:132});
  return `<div class="template-thumb13">${thumbRects.map((r,i)=>`<span style="left:${r.x}%;top:${r.y/1.32}%;width:${r.w}%;height:${r.h/1.32}%">${order.get(logicalRects[i])}</span>`).join('')}</div>`;
};

function applyTemplateReadingAware17(){
  const id=selectedTemplateId13(),tpl=storyTemplates11[id];if(!tpl)return;
  const page=currentPage(),hasAuthored=page.panels.some(p=>p.characters?.length||p.balloons?.length||p.effects?.sfxText||p.actionIntent);
  if(hasAuthored&&!confirm(t('storyTemplateConfirm')))return;
  const withText=$('storyTemplateText11')?.checked!==false,base=currentBaseCharacter06?.()||project.characterLibrary?.[0]||null,size=pageSize04(),rects=templateRects13(tpl,size),defaultBg=tpl.background?.[language]||tpl.background?.ja||{};
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
      if(base)panel.characters=[makeStoryInstance11(base,panel,beat)];
      if(withText&&beat.dialogue)panel.balloons=[makeStoryBalloon11(panel,localized13x(beat.dialogue),base,beat.balloonType||'speech')];
      if(withText&&beat.sfx)panel.effects.sfxText=localized13x(beat.sfx);
    });
    selectedPanelId=ordered[0]?.id||page.panels[0]?.id||null;selectedCharacterId=null;selectedBalloonId=null;
  });
}
function bindReadingAwareTemplate17(){
  const old=$('applyStoryTemplate11');
  if(old){const fresh=old.cloneNode(true);old.replaceWith(fresh);fresh.addEventListener('click',applyTemplateReadingAware17);}
  $('readingDirectionSelect')?.addEventListener('change',()=>queueMicrotask(()=>{renderTemplateGallery13?.();renderTemplatePreview13?.();}));
}

const compilePromptBase17=compilePrompt;
compilePrompt=function(){
  ensureSfxWritingState17(project);
  const base=compilePromptBase17(),items=[];
  for(const panel of [...currentPage().panels].sort((a,b)=>a.order-b.order)){
    const text=String(panel.effects?.sfxText||'').trim();if(!text)continue;
    const mode=effectiveSfxWritingMode17(panel);
    items.push(`- Panel ${panel.order} onomatopoeia "${text}": ${mode==='vertical-rl'?'vertical Japanese writing, top-to-bottom with columns ordered right-to-left':'horizontal writing'}.`);
  }
  const section=['SFX LETTERING DIRECTION:',...(items.length?items:['- No non-empty onomatopoeia on this page.']),'- SFX writing direction follows the same project default as balloons unless explicitly overridden.'].join('\n');
  return base.includes('TEXT TO RENDER:')?base.replace('TEXT TO RENDER:',`${section}\n\nTEXT TO RENDER:`):`${base}\n\n${section}`;
};

if(typeof exportManifest08==='function'){
  const exportManifestBase17=exportManifest08;
  exportManifest08=function(identity,packageType,files){
    ensureSfxWritingState17(project);
    const manifest=exportManifestBase17(identity,packageType,files);
    manifest.lettering ||= {defaultWritingMode:defaultWritingMode15(),balloons:[]};
    manifest.lettering.onomatopoeia=[...currentPage().panels].sort((a,b)=>a.order-b.order).filter(p=>String(p.effects?.sfxText||'').trim()).map(p=>({panelId:p.id,order:p.order,writingMode:p.effects?.sfxWritingMode||'inherit',effectiveWritingMode:effectiveSfxWritingMode17(p)}));
    return manifest;
  };
}

const applyLanguageBase17=applyLanguage;
applyLanguage=function(){applyLanguageBase17();localizeSfxWritingUi17();renderTemplateGallery13?.();renderTemplatePreview13?.();};

ensureSfxWritingUi17();localizeSfxWritingUi17();bindReadingAwareTemplate17();render();
document.querySelector('footer')&&(document.querySelector('footer').textContent='Prototype 0.10 · vertical-first lettering · reading-order synchronized');
