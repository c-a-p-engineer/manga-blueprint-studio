// Prototype 0.12.3: component-responsive template cards and clearer character markers.
// Authoring-only identity markers must never leak into the clean AI PNG.

Object.assign(i18n.ja,{
  guideSkeleton:'キャラクター識別と骨格カラー',
  guideSkeletonBody:'編集画面と確認用注釈PNGでは、頭をキャラクターごとの識別色にして頭上へ名前を表示し、胴・腕・脚・手足は骨格色で読みやすくします。AI用クリーンPNGは名前を除去し、棒人間もモノクロのままです。',
  skeletonLegend:'キャラ識別 / 骨格カラー',
  skeletonLegendHelp:'頭＝キャラクターごとの識別色＋名前。胴 / 腕 / 脚 / 手足＝骨格カラー。AI用クリーンPNGはモノクロです。'
});
Object.assign(i18n.en,{
  guideSkeleton:'Character identity and skeleton colors',
  guideSkeletonBody:'In the editor and annotated review PNG, each character gets a stable head color plus a name tag above the head, while torso, arms, legs, hands, and feet keep anatomy colors. The clean AI PNG removes names and keeps pose figures monochrome.',
  skeletonLegend:'Character / skeleton colors',
  skeletonLegendHelp:'Head = per-character identity color + name. Torso / arms / legs / hands & feet = anatomy colors. Clean AI PNG stays monochrome.'
});

const CHARACTER_MARKER_PALETTE25=[
  {fill:'#fce7f3',stroke:'#be185d'},
  {fill:'#dbeafe',stroke:'#1d4ed8'},
  {fill:'#dcfce7',stroke:'#15803d'},
  {fill:'#fef3c7',stroke:'#b45309'},
  {fill:'#ede9fe',stroke:'#6d28d9'},
  {fill:'#cffafe',stroke:'#0e7490'},
  {fill:'#fee2e2',stroke:'#b91c1c'},
  {fill:'#e0e7ff',stroke:'#4338ca'}
];

function markerHash25(value){
  let h=2166136261;
  for(const ch of String(value||'')){
    h^=ch.codePointAt(0);
    h=Math.imul(h,16777619);
  }
  return h>>>0;
}
function characterMarker25(ch){
  const key=String(ch?.characterId||ch?.name||ch?.id||'character');
  return CHARACTER_MARKER_PALETTE25[markerHash25(key)%CHARACTER_MARKER_PALETTE25.length];
}
function characterMarkerName25(ch){
  const full=String(ch?.name||ch?.characterId||'Character').trim()||'Character';
  const glyphs=[...full];
  return {full,short:glyphs.length>7?`${glyphs.slice(0,6).join('')}…`:full};
}

const characterSvgBase25=characterSvg;
characterSvg=function(ch,annotated=true){
  let svg=characterSvgBase25(ch,annotated);
  if(!annotated)return svg;

  const marker=characterMarker25(ch);
  const pose=posePresets[ch.poseId]||posePresets.stand;
  const head=pose.joints.head;
  const name=characterMarkerName25(ch);
  const glyphCount=[...name.short].length;
  const tagWidth=Math.min(118,Math.max(46,glyphCount*13+18));
  const scale=Math.max(Number(ch.scale)||1,.35);
  const rotation=Number(ch.rotation)||0;
  const tag=`<g class="character-head-tag25 authoring-text" transform="translate(${head[0]} ${head[1]-38}) rotate(${-rotation}) scale(${1/scale})" pointer-events="none"><title>${escapeXml(name.full)}</title><rect x="${-tagWidth/2}" y="-15" width="${tagWidth}" height="25" rx="12.5"/><text x="0" y="3">${escapeXml(name.short)}</text></g>`;

  svg=svg.replace('class="character-group ','class="character-group character-identity25 ');
  svg=svg.replace(/data-char-id="[^"]+"/,match=>`${match} style="--char-fill25:${marker.fill};--char-stroke25:${marker.stroke}"`);
  return svg.replace(/\s*<\/g>\s*$/,`${tag}\n  </g>`);
};

function decorateCharacterList25(){
  const panel=selectedPanel();
  document.querySelectorAll('#characterList [data-list-char]').forEach(button=>{
    const ch=panel?.characters?.find(item=>item.id===button.dataset.listChar);
    if(!ch)return;
    const marker=characterMarker25(ch);
    button.style.setProperty('--char-fill25',marker.fill);
    button.style.setProperty('--char-stroke25',marker.stroke);
    if(!button.querySelector('.character-dot25')){
      const dot=document.createElement('i');
      dot.className='character-dot25';
      dot.setAttribute('aria-hidden','true');
      button.prepend(dot);
    }
  });
}

function installAuthoringClarityStyles25(){
  if(document.getElementById('authoringClarityStyle25'))return;
  const style=document.createElement('style');
  style.id='authoringClarityStyle25';
  style.textContent=`
/* Template cards react to the editor column width, not only the viewport width. */
.template-gallery13{container-type:inline-size;container-name:templateGallery25;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));align-items:start}
.template-card13{container-type:inline-size;container-name:templateCard25;align-self:start}
@container templateCard25 (max-width:230px){
  .template-card-main13{display:block;min-height:0;padding:8px}
  .template-card-main13>.template-thumb13{float:left;width:62px;height:84px;margin:0 8px 6px 0}
  .template-card-copy13{display:block;min-width:0}
  .template-card-copy13 strong,.template-card-copy13 small{display:block}
  .template-badges22{clear:both;padding-top:5px;margin-top:0}
  .template-card-copy13>span:last-child{display:block;clear:both;padding-top:4px}
  .template-card-main13::after{content:"";display:block;clear:both}
}
@media(max-width:760px){.template-gallery13{grid-template-columns:1fr}}

/* Character identity is authoring-only: stable head color + nearby name tag. */
.character-identity25 .stick-head.skel-head{fill:var(--char-fill25,#fff1f2)!important;stroke:var(--char-stroke25,#e11d48)!important}
.character-identity25>.authoring-text:not(.character-head-tag25){display:none}
.character-head-tag25 rect{fill:var(--char-fill25,#fff);stroke:var(--char-stroke25,#111827);stroke-width:2;vector-effect:non-scaling-stroke}
.character-head-tag25 text{fill:#111827;font-size:13px;font-weight:850;text-anchor:middle;dominant-baseline:middle;paint-order:stroke;stroke:#fff;stroke-width:2px;stroke-linejoin:round}
#characterList [data-list-char]{display:flex;align-items:center;gap:7px}
.character-dot25{width:12px;height:12px;border-radius:999px;flex:0 0 12px;background:var(--char-fill25);border:2px solid var(--char-stroke25)}
.swatch.head{background:linear-gradient(90deg,#f9a8d4,#93c5fd,#86efac,#fde68a)}
`;
  document.head.appendChild(style);
}

installAuthoringClarityStyles25();
const renderUiBase25=renderUi;
renderUi=function(){renderUiBase25();decorateCharacterList25();};
applyLanguage();
document.querySelector('footer')&&(document.querySelector('footer').textContent='Prototype 0.12.3 · responsive templates · character identity markers');
