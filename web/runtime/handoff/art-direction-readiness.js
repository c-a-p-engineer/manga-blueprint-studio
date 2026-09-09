// Prototype 0.11: global art direction, model-readiness diagnostics, and identity-safe handoff.
Object.assign(i18n.ja,{
  artDirectionHeading:'仕上がりスタイル',
  artDirectionHelp:'完成漫画の色・画風・線・陰影をプロジェクト全体で指定します。コマ割りやキャラクター同一性とは別の「描き方」の契約です。',
  artPreset:'スタイルプリセット',artPresetCustom:'カスタム',artPresetColorAnime:'カラーアニメ',artPresetMonoManga:'白黒漫画',artPresetPencil:'鉛筆画',artPresetInk:'墨・ペン画',artPresetWebtoon:'Webtoonカラー',artPresetWatercolor:'水彩',artPresetRough:'ラフネーム',artPresetCinematic:'シネマティック',
  artColorMode:'色',artColorAuto:'指定なし',artColorColor:'カラー',artColorMonochrome:'白黒',artColorGrayscale:'グレースケール',artColorLimited:'限定色',
  artRenderStyle:'デザインスタイル',artStyleAnime:'アニメ',artStyleManga:'漫画',artStylePencil:'鉛筆画',artStyleInk:'インク・ペン画',artStyleWatercolor:'水彩',artStyleWebtoon:'Webtoon',artStyleCel:'セル画',artStyleRealistic:'リアル寄り',artStyleSketch:'スケッチ',artStyleRetro:'レトロ漫画',artStyleChibi:'デフォルメ / SD',
  artLineStyle:'線',artLineClean:'クリーン',artLineBold:'太く力強い',artLineFine:'細く繊細',artLineRough:'ラフ',artLineBrush:'筆・ブラシ',artLinePencil:'鉛筆',
  artShading:'陰影・塗り',artShadeFlat:'フラット',artShadeCel:'セル塗り',artShadeSoft:'柔らかい陰影',artShadeScreentone:'スクリーントーン',artShadeCrosshatch:'クロスハッチ',artShadePencil:'鉛筆陰影',artShadePainted:'厚塗り',
  artDetail:'全体の描き込み',artDetailLow:'少なめ',artDetailMedium:'標準',artDetailHigh:'多め',
  artBackgroundFinish:'背景の仕上げ',artBgMatch:'人物と同じ画風',artBgDetailed:'高密度',artBgSimplified:'簡略化',artBgGraphic:'記号的・グラフィック',artBgMinimal:'最小限 / 白を活かす',
  artPalette:'色・パレットの補足',artPalettePlaceholder:'例: ピンクと黒を基調 / 低彩度 / 暖色中心',artTone:'画面の雰囲気',artTonePlaceholder:'例: 明るい、硬派、柔らかい、映画的',artNotes:'追加スタイル指示',artNotesPlaceholder:'例: 光沢を抑える。見せ場だけ描き込みを増やす。',
  generationReadiness:'生成準備チェック',readinessGood:'主要な受け渡し条件は揃っています。',readinessWarn:'確認推奨の項目があります。',readinessIdentityEmpty:'「容姿を文章で指定」ですが説明が空です。容姿を書くか「AIにおまかせ」へ変更してください。',readinessSheetMissing:'Character Sheetモードですが参照キーが空です。',readinessNearObject:'Near-object / 超前景ですが、何をカメラ手前へ出すか未指定です。',readinessStyleAuto:'仕上がりスタイルの色または画風が未指定です。モデル差を減らすなら指定してください。',
  readinessNoBlock:'チェックは助言です。出力を禁止しません。',identityDescriptionEmpty:'容姿説明が空です。モデルごとに別人になりやすいため、文章で指定するか「AIにおまかせ」を選んでください。',
  guideArtDirection:'仕上がりスタイル',guideArtDirectionBody:'カラー / 白黒、アニメ / 漫画 / 鉛筆画などをプロジェクト全体で指定できます。これはキャラクターの見た目そのものではなく、作品全体をどう描くかの指定です。'
});
Object.assign(i18n.en,{
  artDirectionHeading:'Art direction',
  artDirectionHelp:'Set the project-wide color, rendering style, line work, and shading. This controls how the manga is drawn, separate from panel layout and character identity.',
  artPreset:'Style preset',artPresetCustom:'Custom',artPresetColorAnime:'Color anime',artPresetMonoManga:'Monochrome manga',artPresetPencil:'Pencil drawing',artPresetInk:'Ink / pen',artPresetWebtoon:'Webtoon color',artPresetWatercolor:'Watercolor',artPresetRough:'Rough storyboard',artPresetCinematic:'Cinematic',
  artColorMode:'Color',artColorAuto:'Unspecified',artColorColor:'Color',artColorMonochrome:'Monochrome',artColorGrayscale:'Grayscale',artColorLimited:'Limited palette',
  artRenderStyle:'Design style',artStyleAnime:'Anime',artStyleManga:'Manga',artStylePencil:'Pencil',artStyleInk:'Ink / pen',artStyleWatercolor:'Watercolor',artStyleWebtoon:'Webtoon',artStyleCel:'Cel animation',artStyleRealistic:'Realistic',artStyleSketch:'Sketch',artStyleRetro:'Retro manga',artStyleChibi:'Chibi / SD',
  artLineStyle:'Line work',artLineClean:'Clean',artLineBold:'Bold',artLineFine:'Fine',artLineRough:'Rough',artLineBrush:'Brush',artLinePencil:'Pencil',
  artShading:'Shading / fill',artShadeFlat:'Flat',artShadeCel:'Cel shading',artShadeSoft:'Soft shading',artShadeScreentone:'Screentone',artShadeCrosshatch:'Crosshatch',artShadePencil:'Pencil shading',artShadePainted:'Painted',
  artDetail:'Overall detail',artDetailLow:'Low',artDetailMedium:'Medium',artDetailHigh:'High',
  artBackgroundFinish:'Background finish',artBgMatch:'Match character style',artBgDetailed:'Detailed',artBgSimplified:'Simplified',artBgGraphic:'Graphic / symbolic',artBgMinimal:'Minimal / use white space',
  artPalette:'Palette notes',artPalettePlaceholder:'Example: pink and black accents / muted colors / warm palette',artTone:'Visual tone',artTonePlaceholder:'Example: bright, hard-edged, soft, cinematic',artNotes:'Additional style notes',artNotesPlaceholder:'Example: avoid excessive gloss; increase detail only on climax panels.',
  generationReadiness:'Generation readiness',readinessGood:'The main handoff conditions are ready.',readinessWarn:'Some items should be reviewed.',readinessIdentityEmpty:'Identity mode is “describe appearance”, but the description is empty. Add appearance guidance or switch to AI-designed appearance.',readinessSheetMissing:'Character Sheet mode is selected but its reference key is empty.',readinessNearObject:'Near-object framing is selected, but the foreground object/depth target is unspecified.',readinessStyleAuto:'Color or rendering style is unspecified. Set them to reduce model-to-model variation.',
  readinessNoBlock:'These checks are advisory and never block export.',identityDescriptionEmpty:'Appearance description is empty. Different models may invent different characters; add guidance or choose AI-designed appearance.',
  guideArtDirection:'Art direction',guideArtDirectionBody:'Choose color/monochrome and styles such as anime, manga, or pencil drawing for the entire project. This controls how the work is drawn, not who the character is.'
});

const ART_COLOR_18=['auto','color','monochrome','grayscale','limited'];
const ART_STYLE_18=['auto','anime','manga','pencil','ink','watercolor','webtoon','cel','realistic','sketch','retro-manga','chibi'];
const ART_LINE_18=['clean','bold','fine','rough','brush','pencil'];
const ART_SHADE_18=['flat','cel','soft','screentone','crosshatch','pencil','painted'];
const ART_DETAIL_18=['low','medium','high'];
const ART_BG_18=['match','detailed','simplified','graphic','minimal'];
const artDefaults18=()=>({preset:'custom',colorMode:'auto',renderStyle:'auto',lineStyle:'clean',shading:'cel',detailLevel:'medium',backgroundFinish:'match',palette:'',tone:'',notes:''});
const artPresets18={
  colorAnime:{colorMode:'color',renderStyle:'anime',lineStyle:'clean',shading:'cel',detailLevel:'high',backgroundFinish:'match',palette:'',tone:'bright, polished anime manga',notes:'Keep character rendering clean and consistent; reserve highest detail for climax panels.'},
  monoManga:{colorMode:'monochrome',renderStyle:'manga',lineStyle:'bold',shading:'screentone',detailLevel:'high',backgroundFinish:'match',palette:'black, white, and screentone only',tone:'Japanese monochrome manga',notes:'Use black ink, white space, speed lines, and screentone rather than color shading.'},
  pencil:{colorMode:'grayscale',renderStyle:'pencil',lineStyle:'pencil',shading:'pencil',detailLevel:'medium',backgroundFinish:'simplified',palette:'graphite grayscale',tone:'hand-drawn pencil study',notes:'Preserve visible construction energy and natural graphite texture.'},
  ink:{colorMode:'monochrome',renderStyle:'ink',lineStyle:'brush',shading:'crosshatch',detailLevel:'high',backgroundFinish:'match',palette:'black ink on white paper',tone:'expressive pen-and-ink comic',notes:'Favor confident ink strokes, hatching, and strong silhouettes.'},
  webtoon:{colorMode:'color',renderStyle:'webtoon',lineStyle:'clean',shading:'soft',detailLevel:'medium',backgroundFinish:'simplified',palette:'clean modern digital color',tone:'modern webtoon',notes:'Keep silhouettes readable and use clean gradients sparingly.'},
  watercolor:{colorMode:'color',renderStyle:'watercolor',lineStyle:'fine',shading:'painted',detailLevel:'medium',backgroundFinish:'match',palette:'soft watercolor palette',tone:'soft and atmospheric',notes:'Use translucent washes, paper-like variation, and restrained edges.'},
  rough:{colorMode:'monochrome',renderStyle:'sketch',lineStyle:'rough',shading:'flat',detailLevel:'low',backgroundFinish:'minimal',palette:'black pencil/ink only',tone:'rough manga name / storyboard',notes:'Prioritize composition and motion; backgrounds may be omitted or symbolic.'},
  cinematic:{colorMode:'color',renderStyle:'realistic',lineStyle:'fine',shading:'soft',detailLevel:'high',backgroundFinish:'detailed',palette:'cinematic natural color',tone:'cinematic, dramatic lighting',notes:'Use grounded materials, depth, and dramatic but coherent lighting.'}
};

function ensureArtDirection18(target=project){
  if(!target?.meta)return target;
  const src=target.meta.artDirection&&typeof target.meta.artDirection==='object'?target.meta.artDirection:{};
  const d=artDefaults18();
  const value={...d,...src};
  if(!ART_COLOR_18.includes(value.colorMode))value.colorMode='auto';
  if(!ART_STYLE_18.includes(value.renderStyle))value.renderStyle='auto';
  if(!ART_LINE_18.includes(value.lineStyle))value.lineStyle='clean';
  if(!ART_SHADE_18.includes(value.shading))value.shading='cel';
  if(!ART_DETAIL_18.includes(value.detailLevel))value.detailLevel='medium';
  if(!ART_BG_18.includes(value.backgroundFinish))value.backgroundFinish='match';
  for(const key of ['preset','palette','tone','notes'])value[key]=String(value[key]||'');
  target.meta.artDirection=value;
  return target;
}
const normalizeProjectBase18=normalizeProject;
normalizeProject=function(input){return ensureArtDirection18(normalizeProjectBase18(input));};
ensureArtDirection18(project);

function artDirection18(){ensureArtDirection18(project);return project.meta.artDirection;}
function setArtPreset18(id){
  const preset=artPresets18[id];if(!preset)return;
  mutate(()=>{project.meta.artDirection={...artDefaults18(),...preset,preset:id};});
}
function artOption18(value,label){return `<option value="${value}">${escapeXml(t(label))}</option>`;}
function injectArtUi18(){
  const page=document.querySelector('.tool-panel[data-section="page"]');if(!page||$('artDirection18'))return;
  const anchor=$('readingDirectionBlock')||$('applyCanvasSize');
  const box=document.createElement('section');box.id='artDirection18';box.className='art-direction18';box.innerHTML=`
    <div class="subhead" data-i18n="artDirectionHeading">仕上がりスタイル</div>
    <p class="help" data-i18n="artDirectionHelp"></p>
    <label><span data-i18n="artPreset">スタイルプリセット</span><select id="artPreset18"></select></label>
    <div class="two-columns">
      <label><span data-i18n="artColorMode">色</span><select id="artColor18"></select></label>
      <label><span data-i18n="artRenderStyle">デザインスタイル</span><select id="artStyle18"></select></label>
      <label><span data-i18n="artLineStyle">線</span><select id="artLine18"></select></label>
      <label><span data-i18n="artShading">陰影・塗り</span><select id="artShade18"></select></label>
      <label><span data-i18n="artDetail">全体の描き込み</span><select id="artDetail18"></select></label>
      <label><span data-i18n="artBackgroundFinish">背景の仕上げ</span><select id="artBg18"></select></label>
    </div>
    <label><span data-i18n="artPalette">色・パレットの補足</span><input id="artPalette18" type="text" data-i18n-placeholder="artPalettePlaceholder"></label>
    <label><span data-i18n="artTone">画面の雰囲気</span><input id="artTone18" type="text" data-i18n-placeholder="artTonePlaceholder"></label>
    <label><span data-i18n="artNotes">追加スタイル指示</span><textarea id="artNotes18" rows="3" data-i18n-placeholder="artNotesPlaceholder"></textarea></label>
    <div id="artSummary18" class="summary-card"></div>`;
  anchor?.insertAdjacentElement('afterend',box);

  const preset=$('artPreset18');
  [['custom','artPresetCustom'],['colorAnime','artPresetColorAnime'],['monoManga','artPresetMonoManga'],['pencil','artPresetPencil'],['ink','artPresetInk'],['webtoon','artPresetWebtoon'],['watercolor','artPresetWatercolor'],['rough','artPresetRough'],['cinematic','artPresetCinematic']].forEach(([v,k])=>preset.insertAdjacentHTML('beforeend',artOption18(v,k)));
  const add=(id,defs)=>{const el=$(id);defs.forEach(([v,k])=>el.insertAdjacentHTML('beforeend',artOption18(v,k)));};
  add('artColor18',[['auto','artColorAuto'],['color','artColorColor'],['monochrome','artColorMonochrome'],['grayscale','artColorGrayscale'],['limited','artColorLimited']]);
  add('artStyle18',[['auto','artColorAuto'],['anime','artStyleAnime'],['manga','artStyleManga'],['pencil','artStylePencil'],['ink','artStyleInk'],['watercolor','artStyleWatercolor'],['webtoon','artStyleWebtoon'],['cel','artStyleCel'],['realistic','artStyleRealistic'],['sketch','artStyleSketch'],['retro-manga','artStyleRetro'],['chibi','artStyleChibi']]);
  add('artLine18',[['clean','artLineClean'],['bold','artLineBold'],['fine','artLineFine'],['rough','artLineRough'],['brush','artLineBrush'],['pencil','artLinePencil']]);
  add('artShade18',[['flat','artShadeFlat'],['cel','artShadeCel'],['soft','artShadeSoft'],['screentone','artShadeScreentone'],['crosshatch','artShadeCrosshatch'],['pencil','artShadePencil'],['painted','artShadePainted']]);
  add('artDetail18',[['low','artDetailLow'],['medium','artDetailMedium'],['high','artDetailHigh']]);
  add('artBg18',[['match','artBgMatch'],['detailed','artBgDetailed'],['simplified','artBgSimplified'],['graphic','artBgGraphic'],['minimal','artBgMinimal']]);

  preset.addEventListener('change',e=>{if(e.target.value!=='custom')setArtPreset18(e.target.value);else mutate(()=>{project.meta.artDirection.preset='custom';});});
  const bind=(id,key)=>$(id)?.addEventListener('change',e=>mutate(()=>{project.meta.artDirection[key]=e.target.value;project.meta.artDirection.preset='custom';}));
  bind('artColor18','colorMode');bind('artStyle18','renderStyle');bind('artLine18','lineStyle');bind('artShade18','shading');bind('artDetail18','detailLevel');bind('artBg18','backgroundFinish');
  for(const [id,key] of [['artPalette18','palette'],['artTone18','tone'],['artNotes18','notes']])$(id)?.addEventListener('change',e=>mutate(()=>{project.meta.artDirection[key]=e.target.value;project.meta.artDirection.preset='custom';}));
}

function localizeArtUi18(){
  injectArtUi18();
  document.querySelectorAll('#artDirection18 [data-i18n]').forEach(el=>el.textContent=t(el.dataset.i18n));
  document.querySelectorAll('#artDirection18 [data-i18n-placeholder]').forEach(el=>el.placeholder=t(el.dataset.i18nPlaceholder));
  const relabel=(id,pairs)=>{const el=$(id);if(!el)return;pairs.forEach(([v,k])=>{const o=[...el.options].find(x=>x.value===v);if(o)o.textContent=t(k);});};
  relabel('artPreset18',[['custom','artPresetCustom'],['colorAnime','artPresetColorAnime'],['monoManga','artPresetMonoManga'],['pencil','artPresetPencil'],['ink','artPresetInk'],['webtoon','artPresetWebtoon'],['watercolor','artPresetWatercolor'],['rough','artPresetRough'],['cinematic','artPresetCinematic']]);
  relabel('artColor18',[['auto','artColorAuto'],['color','artColorColor'],['monochrome','artColorMonochrome'],['grayscale','artColorGrayscale'],['limited','artColorLimited']]);
  relabel('artStyle18',[['auto','artColorAuto'],['anime','artStyleAnime'],['manga','artStyleManga'],['pencil','artStylePencil'],['ink','artStyleInk'],['watercolor','artStyleWatercolor'],['webtoon','artStyleWebtoon'],['cel','artStyleCel'],['realistic','artStyleRealistic'],['sketch','artStyleSketch'],['retro-manga','artStyleRetro'],['chibi','artStyleChibi']]);
  relabel('artLine18',[['clean','artLineClean'],['bold','artLineBold'],['fine','artLineFine'],['rough','artLineRough'],['brush','artLineBrush'],['pencil','artLinePencil']]);
  relabel('artShade18',[['flat','artShadeFlat'],['cel','artShadeCel'],['soft','artShadeSoft'],['screentone','artShadeScreentone'],['crosshatch','artShadeCrosshatch'],['pencil','artShadePencil'],['painted','artShadePainted']]);
  relabel('artDetail18',[['low','artDetailLow'],['medium','artDetailMedium'],['high','artDetailHigh']]);
  relabel('artBg18',[['match','artBgMatch'],['detailed','artBgDetailed'],['simplified','artBgSimplified'],['graphic','artBgGraphic'],['minimal','artBgMinimal']]);
}

function artSummaryText18(){
  const a=artDirection18();
  const parts=[a.colorMode,a.renderStyle,a.lineStyle,a.shading,a.detailLevel,a.backgroundFinish].filter(Boolean);
  return `${parts.join(' · ')}${a.palette?` · ${a.palette}`:''}${a.tone?` · ${a.tone}`:''}`;
}

function readinessIssues18(){
  const issues=[];
  for(const base of typeof usedBaseCharacters09==='function'?usedBaseCharacters09():project.characterLibrary||[]){
    if(base.identityMode==='sheet'&&!String(base.referenceKey||'').trim())issues.push({kind:'identity',text:`${base.name||base.characterId}: ${t('readinessSheetMissing')}`});
    if(base.identityMode==='description'&&typeof appearanceText09==='function'&&!appearanceText09(base).trim())issues.push({kind:'identity',text:`${base.name||base.characterId}: ${t('readinessIdentityEmpty')}`});
  }
  const a=artDirection18();if(a.colorMode==='auto'||a.renderStyle==='auto')issues.push({kind:'style',text:t('readinessStyleAuto')});
  for(const p of currentPage().panels||[]){if(p.camera?.viewpoint==='near-object'&&!String(p.camera?.depthTarget||p.camera?.focus||'').trim())issues.push({kind:'camera',text:`Panel ${p.order}: ${t('readinessNearObject')}`});}
  return issues;
}
function injectReadiness18(){
  const out=document.querySelector('.tool-panel[data-section="output"]');if(!out||$('generationReadiness18'))return;
  const block=document.createElement('section');block.id='generationReadiness18';block.innerHTML=`<div class="subhead" data-i18n="generationReadiness"></div><div id="readinessStatus18" class="summary-card"></div><p class="help" data-i18n="readinessNoBlock"></p>`;
  const prompt=out.querySelector('[data-i18n="promptHeading"]')?.closest('.subhead')||$('promptOutput')?.closest('label');
  prompt?.insertAdjacentElement('beforebegin',block);
}
function renderReadiness18(){
  injectReadiness18();const box=$('readinessStatus18');if(!box)return;const issues=readinessIssues18();
  box.innerHTML=issues.length?`<strong>⚠ ${escapeXml(t('readinessWarn'))}</strong><ul>${issues.map(x=>`<li>${escapeXml(x.text)}</li>`).join('')}</ul>`:`<strong>✓ ${escapeXml(t('readinessGood'))}</strong>`;
}

const renderBaseCharactersBase18=typeof renderBaseCharacters06==='function'?renderBaseCharacters06:null;
if(renderBaseCharactersBase18){renderBaseCharacters06=function(){renderBaseCharactersBase18();const base=currentBaseCharacter06?.();if(base?.identityMode==='description'&&typeof appearanceText09==='function'&&!appearanceText09(base).trim()){const status=$('identityStatus09');if(status){status.textContent=t('identityDescriptionEmpty');status.dataset.level='warning';}}};}

const renderUiBase18=renderUi;
renderUi=function(){
  ensureArtDirection18(project);renderUiBase18();localizeArtUi18();injectReadiness18();
  const a=artDirection18();
  if($('artPreset18'))$('artPreset18').value=artPresets18[a.preset]?a.preset:'custom';
  if($('artColor18'))$('artColor18').value=a.colorMode;if($('artStyle18'))$('artStyle18').value=a.renderStyle;if($('artLine18'))$('artLine18').value=a.lineStyle;if($('artShade18'))$('artShade18').value=a.shading;if($('artDetail18'))$('artDetail18').value=a.detailLevel;if($('artBg18'))$('artBg18').value=a.backgroundFinish;
  if($('artPalette18'))$('artPalette18').value=a.palette;if($('artTone18'))$('artTone18').value=a.tone;if($('artNotes18'))$('artNotes18').value=a.notes;if($('artSummary18'))$('artSummary18').textContent=artSummaryText18();
  renderReadiness18();
};

function artPrompt18(){
  const a=artDirection18();
  const color={auto:'unspecified; choose only if other guidance requires it',color:'full color',monochrome:'strict black-and-white / monochrome manga',grayscale:'grayscale',limited:'limited color palette'}[a.colorMode]||a.colorMode;
  const render={auto:'unspecified',anime:'anime illustration',manga:'manga/comic rendering',pencil:'pencil drawing',ink:'pen-and-ink drawing',watercolor:'watercolor painting',webtoon:'modern webtoon rendering',cel:'cel-animation look',realistic:'realistic/semi-realistic rendering',sketch:'rough sketch / storyboard','retro-manga':'retro manga rendering',chibi:'chibi / super-deformed rendering'}[a.renderStyle]||a.renderStyle;
  return [
    'ART DIRECTION (GLOBAL):',
    `- Color mode: ${color}.`,
    `- Rendering style: ${render}.`,
    `- Line work: ${a.lineStyle}.`,
    `- Shading / fill: ${a.shading}.`,
    `- Overall detail: ${a.detailLevel}.`,
    `- Background finish: ${a.backgroundFinish}.`,
    `- Palette notes: ${a.palette||'none specified'}.`,
    `- Visual tone: ${a.tone||'none specified'}.`,
    `- Additional style notes: ${a.notes||'none'}.`,
    '- Art direction controls rendering language only. Do not use it to replace CHARACTER IDENTITY GUIDANCE, panel layout, pose, camera, text, or scene semantics.'
  ].join('\n');
}
const compilePromptBase18=compilePrompt;
compilePrompt=function(){
  ensureArtDirection18(project);let base=compilePromptBase18();
  base=base.replace('- Character visual identity comes only from the separately attached Character Sheets.','- Character visual identity follows CHARACTER IDENTITY GUIDANCE. Use separately attached Character Sheets only for characters whose identity mode requires them.');
  return `${artPrompt18()}\n\n${base}`;
};

if(typeof exportManifest08==='function'){
  const exportManifestBase18=exportManifest08;
  exportManifest08=function(identity,packageType,files){
    const manifest=exportManifestBase18(identity,packageType,files);manifest.artDirection=structuredClone(artDirection18());manifest.generationReadiness={blocking:false,issues:readinessIssues18().map(x=>({kind:x.kind,message:x.text}))};return manifest;
  };
}

function installArtHelp18(){
  const dialog=$('helpDialog');if(!dialog||$('guideArtDirection18'))return;const section=document.createElement('section');section.id='guideArtDirection18';section.className='guide-section';section.innerHTML=`<h3 data-i18n="guideArtDirection"></h3><p data-i18n="guideArtDirectionBody"></p>`;const camera=dialog.querySelector('[data-i18n="guideCamera"]')?.closest('.guide-section');camera?.insertAdjacentElement('beforebegin',section);
}
function installStyles18(){if($('prototype11Style18'))return;const s=document.createElement('style');s.id='prototype11Style18';s.textContent=`.art-direction18{margin:12px 0;padding:12px;border:1px solid #dbe2ea;border-radius:12px;background:#fbfcfe}.art-direction18 .summary-card{margin-top:8px}.identity-status[data-level="warning"]{border-color:#f59e0b;background:#fffbeb}.summary-card ul{margin:8px 0 0;padding-left:20px}.summary-card li{margin:4px 0;line-height:1.45}@media(max-width:760px){.art-direction18{padding:10px}}`;document.head.appendChild(s);}

const applyLanguageBase18=applyLanguage;
applyLanguage=function(){applyLanguageBase18();localizeArtUi18();installArtHelp18();document.querySelectorAll('#generationReadiness18 [data-i18n],#guideArtDirection18 [data-i18n]').forEach(el=>el.textContent=t(el.dataset.i18n));renderReadiness18();};

injectArtUi18();injectReadiness18();installStyles18();installArtHelp18();localizeArtUi18();render();
document.querySelector('footer')&&(document.querySelector('footer').textContent='Prototype 0.11 · art direction · model-readiness diagnostics');
