// Prototype 0.10: vertical-first manga text direction and strict reading-order / panel-number synchronization.
const TEXT_VERTICAL_15='vertical';
const TEXT_HORIZONTAL_15='horizontal';

Object.assign(i18n.ja,{
  textDirectionDefault:'新しい文字の既定方向',
  textDirectionVertical:'縦書き（既定）',
  textDirectionHorizontal:'横書き',
  textDirectionHelp:'日本漫画向けに縦書きを既定にしています。吹き出しごと・オノマトペごとに横書きへ変更できます。',
  balloonWritingDirection:'この吹き出しの文字方向',
  sfxWritingDirection:'オノマトペの文字方向',
  readingHelp:'日本漫画は右→左が既定です。選択した読み方向に合わせてコマ番号・テンプレートの出来事順も自動で揃えます。',
  guideReadingBody:'右→左が日本漫画の既定です。左→右にも切り替えられます。選択した読み方向を正本として、ページ上のコマ番号・テンプレートの番号・各コマへ入る出来事の順番を揃えます。',
  guideTextDirection:'文字の縦書き / 横書き',
  guideTextDirectionBody:'漫画本文は縦書きが既定です。吹き出しとオノマトペは個別に縦書き / 横書きを変更でき、その指定はJSON・Prompt・manifestへ引き継がれます。'
});
Object.assign(i18n.en,{
  textDirectionDefault:'Default direction for new text',
  textDirectionVertical:'Vertical (default)',
  textDirectionHorizontal:'Horizontal',
  textDirectionHelp:'Vertical is the manga-oriented default. Each balloon and onomatopoeia can be changed to horizontal independently.',
  balloonWritingDirection:'Writing direction for this balloon',
  sfxWritingDirection:'Onomatopoeia writing direction',
  readingHelp:'Right-to-left is the Japanese manga default. Panel numbers and template beat order automatically follow the selected reading direction.',
  guideReadingBody:'Right-to-left is the Japanese manga default, with left-to-right available when needed. The selected direction is authoritative for visible panel numbers, template preview numbers, and the story beat assigned to each panel.',
  guideTextDirection:'Vertical / horizontal text',
  guideTextDirectionBody:'Manga text defaults to vertical. Balloons and onomatopoeia can independently use vertical or horizontal writing, and the choice is preserved in JSON, prompt, and manifest handoff data.'
});

function validTextDirection15(value){return value===TEXT_HORIZONTAL_15?TEXT_HORIZONTAL_15:TEXT_VERTICAL_15}
function ensureTextDirection15(p){
  p.meta ||= {};
  p.meta.textDirectionDefault=validTextDirection15(p.meta.textDirectionDefault);
  for(const page of p.pages||[])for(const panel of page.panels||[]){
    panel.effects ||= defaultEffects();
    panel.effects.sfxWritingDirection=validTextDirection15(panel.effects.sfxWritingDirection||p.meta.textDirectionDefault);
    panel.balloons ||= [];
    for(const b of panel.balloons)b.writingDirection=validTextDirection15(b.writingDirection||p.meta.textDirectionDefault);
  }
  return p;
}
const normalizeProject14Base15=normalizeProject;
normalizeProject=function(input){return ensureTextDirection15(normalizeProject14Base15(input))};
project=normalizeProject(project);

function orderedPanelsByReading15(page=currentPage()){
  return [...(page?.panels||[])].sort((a,b)=>{
    const threshold=Math.max(60,Math.min(a.rect.h,b.rect.h)*.25);
    if(Math.abs(a.rect.y-b.rect.y)>threshold)return a.rect.y-b.rect.y;
    return project.meta.readingDirection==='rtl'?b.rect.x-a.rect.x:a.rect.x-b.rect.x;
  });
}
function syncPanelNumbers15(){orderedPanelsByReading15().forEach((panel,index)=>panel.order=index+1)}

// Keep every visible panel number synchronized with the selected reading direction.
const render14Base15=render;
render=function(){ensureTextDirection15(project);syncPanelNumbers15();return render14Base15()};

// Newly added balloons inherit the project default (vertical by default).
const addBalloon14Base15=addBalloon;
addBalloon=function(){addBalloon14Base15();const b=selectedBalloon();if(b){b.writingDirection=validTextDirection15(project.meta.textDirectionDefault);save();render()}};

// Story-template balloons also inherit the project default.
const makeStoryBalloon11Base15=makeStoryBalloon11;
makeStoryBalloon11=function(panel,text,base,type='speech'){
  const b=makeStoryBalloon11Base15(panel,text,base,type);b.writingDirection=validTextDirection15(project.meta.textDirectionDefault);return b;
};

function textDirectionLabel15(value){return t(validTextDirection15(value)===TEXT_VERTICAL_15?'textDirectionVertical':'textDirectionHorizontal')}
function directionOptions15(){return `<option value="vertical">${escapeXml(t('textDirectionVertical'))}</option><option value="horizontal">${escapeXml(t('textDirectionHorizontal'))}</option>`}

function installTextDirectionUi15(){
  const section=document.querySelector('.tool-panel[data-section="text"]');
  if(section&&!$('textDirectionDefault15')){
    const header=section.querySelector('.section-title-row');
    const block=document.createElement('div');block.id='textDirectionBlock15';block.className='text-direction-block15';block.innerHTML=`<label><span data-i18n="textDirectionDefault"></span><select id="textDirectionDefault15"></select></label><p class="help" data-i18n="textDirectionHelp"></p>`;
    header?.insertAdjacentElement('afterend',block);
    const textLabel=$('balloonText')?.closest('label');if(textLabel){const per=document.createElement('label');per.id='balloonWritingDirectionWrap15';per.innerHTML=`<span data-i18n="balloonWritingDirection"></span><select id="balloonWritingDirection15"></select>`;textLabel.insertAdjacentElement('afterend',per)}
  }
  const effects=document.querySelector('.tool-panel[data-section="effects"]');
  if(effects&&!$('sfxWritingDirection15')){
    const sfxLabel=$('sfxText')?.closest('label');const per=document.createElement('label');per.id='sfxWritingDirectionWrap15';per.innerHTML=`<span data-i18n="sfxWritingDirection"></span><select id="sfxWritingDirection15"></select>`;sfxLabel?.insertAdjacentElement('afterend',per);
  }
  if(!$('prototype10Style15')){const style=document.createElement('style');style.id='prototype10Style15';style.textContent=`
    .text-direction-block15{display:grid;gap:4px;margin:8px 0 12px;padding:10px;border:1px solid #dbe3ef;border-radius:12px;background:#f8fafc}
    .balloon-text-vertical15{writing-mode:vertical-rl;text-orientation:upright;letter-spacing:.04em}
    .reading-sync-badge15{display:inline-flex;align-items:center;gap:5px;margin-top:5px;padding:4px 8px;border-radius:999px;background:#eef6ff;color:#1d4ed8;font-size:10px;font-weight:700}
  `;document.head.appendChild(style)}
  installTextDirectionHelp15();
}
function installTextDirectionHelp15(){
  const dialog=$('helpDialog');if(!dialog||$('guideTextDirection15'))return;
  const reading=dialog.querySelector('[data-i18n="guideReading"]')?.closest('.guide-section');const section=document.createElement('section');section.id='guideTextDirection15';section.className='guide-section';section.innerHTML=`<h3 data-i18n="guideTextDirection"></h3><p data-i18n="guideTextDirectionBody"></p>`;reading?.insertAdjacentElement('afterend',section);
}
function refreshTextDirectionOptions15(){
  for(const id of ['textDirectionDefault15','balloonWritingDirection15','sfxWritingDirection15']){const el=$(id);if(!el)continue;const value=el.value;el.innerHTML=directionOptions15();if(['vertical','horizontal'].includes(value))el.value=value}
}
function renderTextDirectionUi15(){
  refreshTextDirectionOptions15();const p=selectedPanel(),b=selectedBalloon();
  if($('textDirectionDefault15'))$('textDirectionDefault15').value=validTextDirection15(project.meta.textDirectionDefault);
  if($('balloonWritingDirectionWrap15'))$('balloonWritingDirectionWrap15').hidden=!b;
  if($('balloonWritingDirection15')){$('balloonWritingDirection15').disabled=!b;if(b)$('balloonWritingDirection15').value=validTextDirection15(b.writingDirection)}
  if($('sfxWritingDirection15')){$('sfxWritingDirection15').disabled=!p;if(p)$('sfxWritingDirection15').value=validTextDirection15(p.effects.sfxWritingDirection)}
  const help=$('readingDirectionBlock')?.querySelector('.reading-sync-badge15');if(help)help.textContent=project.meta.readingDirection==='rtl'?(language==='ja'?'①は右上から':'① starts at upper right'):(language==='ja'?'①は左上から':'① starts at upper left');
}
function bindTextDirectionUi15(){
  $('textDirectionDefault15')?.addEventListener('change',()=>mutate(()=>{project.meta.textDirectionDefault=validTextDirection15($('textDirectionDefault15').value)}));
  $('balloonWritingDirection15')?.addEventListener('change',()=>{const b=selectedBalloon();if(b)mutate(()=>b.writingDirection=validTextDirection15($('balloonWritingDirection15').value))});
  $('sfxWritingDirection15')?.addEventListener('change',()=>{const p=selectedPanel();if(p)mutate(()=>p.effects.sfxWritingDirection=validTextDirection15($('sfxWritingDirection15').value))});
}

// Authoring/review preview reflects vertical vs horizontal text. Clean AI PNG still removes the text.
balloonSvg=function(b,annotated=true){
  const p=selectedPanel();if(!p)return'';const w=120*b.size,h=(b.type==='narration'?70:85)*b.size,cls=`balloon ${b.type} ${b.id===selectedBalloonId?'balloon-selected':''}`;
  const shape=b.type==='narration'?`<rect class="${cls}" x="${b.x-w/2}" y="${b.y-h/2}" width="${w}" height="${h}" rx="6"/>`:`<ellipse class="${cls}" cx="${b.x}" cy="${b.y}" rx="${w/2}" ry="${h/2}"/>`;
  let text='';if(annotated&&b.text){const dir=validTextDirection15(b.writingDirection),max=dir===TEXT_VERTICAL_15?10:14,shown=`${escapeXml(b.text.slice(0,max))}${b.text.length>max?'…':''}`;text=dir===TEXT_VERTICAL_15?`<text class="balloon-text authoring-text balloon-text-vertical15" x="${b.x+5}" y="${b.y-h*.3}" text-anchor="start">${shown}</text>`:`<text class="balloon-text authoring-text" x="${b.x}" y="${b.y+4}">${shown}</text>`}
  return `<g data-balloon-id="${escapeXml(b.id)}">${shape}${text}</g>`;
};

// Layout thumbnails, story-template thumbnails, and story beats all obey the same reading direction.
templateThumb13=function(tpl){
  const size={w:100,h:132},rects=templateRects13(tpl,size),order=previewOrder08(rects);return `<div class="template-thumb13">${rects.map(r=>`<span style="left:${r.x}%;top:${r.y/1.32}%;width:${r.w}%;height:${r.h/1.32}%">${order.get(r)}</span>`).join('')}</div>`;
};
function applyTemplateReadingAware15(){
  const id=selectedTemplateId13(),tpl=storyTemplates11[id];if(!tpl)return;const page=currentPage(),hasAuthored=page.panels.some(p=>p.characters?.length||p.balloons?.length||p.effects?.sfxText||p.actionIntent);if(hasAuthored&&!confirm(t('storyTemplateConfirm')))return;
  const withText=$('storyTemplateText11')?.checked!==false,base=currentBaseCharacter06?.()||project.characterLibrary?.[0]||null,size=pageSize04(),rects=templateRects13(tpl,size),defaultBg=tpl.background?.[language]||tpl.background?.ja||{};
  mutate(()=>{
    page.panels=rects.map((r,i)=>makePanel(r,i+1));project.meta.layoutPreset=tpl.layout||'custom';project.meta.storyTemplate=id===DERIVED_TEMPLATE_ID_13?`${derivedBaseId13}:derived`:id;project.meta.randomPurpose='';project.meta.randomSeed='';project.meta.randomVariant=undefined;
    syncPanelNumbers15();const ordered=orderedPanelsByReading15(page);
    ordered.forEach((panel,i)=>{const beat=tpl.beats[i]||tpl.beats.at(-1)||{};panel.role=beat.role||'setup';panel.actionIntent=localized13x(beat.action);Object.assign(panel.camera,{distance:beat.camera?.[0]||'medium',angle:beat.camera?.[1]||'eye-level',viewpoint:beat.camera?.[2]||'front'});Object.assign(panel.background,beat.background?.[language]||beat.background?.ja||defaultBg);panel.effects.lineEffect=beat.lineEffect||'none';panel.effects.strength=beat.lineEffect?'high':'medium';panel.effects.sfxWritingDirection=validTextDirection15(project.meta.textDirectionDefault);panel.style.breakout=beat.breakout||'none';if(base)panel.characters=[makeStoryInstance11(base,panel,beat)];if(withText&&beat.dialogue)panel.balloons=[makeStoryBalloon11(panel,localized13x(beat.dialogue),base,beat.balloonType||'speech')];if(withText&&beat.sfx)panel.effects.sfxText=localized13x(beat.sfx)});
    selectedPanelId=ordered[0]?.id||page.panels[0]?.id||null;selectedCharacterId=null;selectedBalloonId=null;
  });
}
function bindReadingAwareTemplate15(){
  const old=$('applyStoryTemplate11');if(old){const fresh=old.cloneNode(true);old.replaceWith(fresh);fresh.addEventListener('click',applyTemplateReadingAware15)}
  const block=$('readingDirectionBlock');if(block&&!block.querySelector('.reading-sync-badge15')){const badge=document.createElement('div');badge.className='reading-sync-badge15';block.appendChild(badge)}
  $('readingDirectionSelect')?.addEventListener('change',()=>queueMicrotask(()=>{syncPanelNumbers15();renderLayoutThumbnails09?.();renderSmartCandidates08?.();renderTemplateGallery13?.();renderTemplatePreview13?.();render()}));
}

// Generation handoff records exact writing direction instead of leaving typography implicit.
const compilePrompt14Base15=compilePrompt;
compilePrompt=function(){
  const base=compilePrompt14Base15(),panels=orderedPanelsByReading15(),lines=['','TEXT WRITING DIRECTION CONTRACT:',`- Default for new manga text: ${validTextDirection15(project.meta.textDirectionDefault)==='vertical'?'vertical-rl (Japanese manga vertical writing)':'horizontal-tb'}.`];
  for(const panel of panels){for(const b of panel.balloons||[])if(b.text?.trim())lines.push(`- Panel ${panel.order} balloon text "${b.text.trim()}": ${validTextDirection15(b.writingDirection)==='vertical'?'vertical-rl':'horizontal-tb'}.`);if(panel.effects?.sfxText?.trim())lines.push(`- Panel ${panel.order} onomatopoeia "${panel.effects.sfxText.trim()}": ${validTextDirection15(panel.effects.sfxWritingDirection)==='vertical'?'vertical-rl':'horizontal-tb'}.`)}
  lines.push('- Preserve these writing directions in the final lettering.');return `${base}\n${lines.join('\n')}`;
};
const exportManifest09Base15=exportManifest08;
exportManifest08=function(identity,packageType,files){
  const manifest=exportManifest09Base15(identity,packageType,files);manifest.schema='manga-blueprint-export-manifest/4';manifest.textLayout={defaultWritingDirection:validTextDirection15(project.meta.textDirectionDefault),balloons:orderedPanelsByReading15().flatMap(panel=>(panel.balloons||[]).filter(b=>b.text?.trim()).map(b=>({panelOrder:panel.order,balloonId:b.id,writingDirection:validTextDirection15(b.writingDirection)}))),onomatopoeia:orderedPanelsByReading15().filter(panel=>panel.effects?.sfxText?.trim()).map(panel=>({panelOrder:panel.order,writingDirection:validTextDirection15(panel.effects.sfxWritingDirection)}))};manifest.readingOrderContract={direction:project.meta.readingDirection,panelNumbersFollowReadingDirection:true,storyBeatsFollowPanelNumbers:true};return manifest;
};

const renderUi14Base15=renderUi;
renderUi=function(){ensureTextDirection15(project);renderUi14Base15();renderTextDirectionUi15()};
const applyLanguage14Base15=applyLanguage;
applyLanguage=function(){applyLanguage14Base15();refreshTextDirectionOptions15();renderTextDirectionUi15();renderTemplateGallery13?.();renderTemplatePreview13?.()};

installTextDirectionUi15();bindTextDirectionUi15();bindReadingAwareTemplate15();applyLanguage();render();
document.querySelector('footer')&&(document.querySelector('footer').textContent='Prototype 0.10 · vertical-first lettering · reading-order synchronized');
