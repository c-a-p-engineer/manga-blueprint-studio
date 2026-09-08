// Prototype 0.8 UI hardening: keep Panel Peek compact, opaque, and viewport-bounded on mobile.
(function(){
  function peekRow13(label,value,extra=''){
    return `<div class="peek-row13 ${extra}"><b>${escapeXml(label)}</b><span>${escapeXml(value||'—')}</span></div>`;
  }

  openPanelPeek11=function(id=selectedPanelId){
    if(id&&id!==selectedPanelId){selectedPanelId=id;selectedCharacterId=null;selectedBalloonId=null;render();}
    const panel=selectedPanel(),dialog=$('panelPeek11');if(!panel||!dialog)return;
    const chars=(panel.characters||[]).map(c=>`${c.name||c.characterId}: ${humanPose11(c.poseId)} / ${humanExpression11(c.expression?.type)} / ${humanGaze11(c.gaze?.target)}`).join('\n')||'—';
    const bg=[panel.background?.location,panel.background?.timeOfDay,panel.background?.weather,panel.background?.mood].filter(Boolean).join(' / ')||'—';
    const dialogue=panelDialogue11(panel);
    const effects=[panel.effects?.lineEffect&&panel.effects.lineEffect!=='none'?panel.effects.lineEffect:'',panel.effects?.sfxText?`SFX ${panel.effects.sfxText}`:'',panel.style?.breakout&&panel.style.breakout!=='none'?`breakout=${panel.style.breakout}`:''].filter(Boolean).join(' / ')||'—';
    const frame=framingStatus11(panel),role=humanRole11(panel.role),action=panel.actionIntent?.trim()||t('panelListEmptyAction');
    const camera=`${humanDistance11(panel.camera.distance)} / ${humanAngle11(panel.camera.angle)} / ${panel.camera.viewpoint}`;
    const dialogueText=dialogue.length?dialogue.map(x=>`「${x}」`).join(' / '):t('panelListNoDialogue');

    dialog.innerHTML=`<form method="dialog" class="modal-card panel-peek-card11" aria-labelledby="panelPeekTitle13">
      <header class="peek-header13">
        <div class="peek-heading13"><div><h2 id="panelPeekTitle13">${escapeXml(t('panelPeekTitle'))} ${panel.order}</h2><span class="peek-role13">${escapeXml(role)}</span></div><p>${escapeXml(action)}</p></div>
        <button class="peek-close13" value="close" aria-label="${escapeXml(t('panelPeekClose'))}">×</button>
      </header>
      <div class="peek-scroll13">
        <div class="peek-rows13">
          ${peekRow13(t('panelPeekCharacters'),chars)}
          ${peekRow13(t('panelPeekCamera'),camera)}
          ${peekRow13(t('panelPeekBackground'),bg)}
          ${peekRow13(t('panelPeekDialogue'),dialogueText)}
          ${peekRow13(t('panelPeekEffects'),effects)}
        </div>
        <div class="peek-framing13 ${escapeXml(frame.kind)}"><span>${escapeXml(frame.text)}</span></div>
      </div>
      <div class="peek-actions13">
        <button id="peekEdit11" type="button" class="primary">${escapeXml(t('panelPeekEdit'))}</button>
        <button id="peekText11" type="button">${escapeXml(t('panelPeekText'))}</button>
        <button id="peekDice11" type="button">${escapeXml(t('panelPeekDice'))}</button>
        <button value="close">${escapeXml(t('panelPeekClose'))}</button>
      </div>
    </form>`;

    $('peekEdit11')?.addEventListener('click',()=>{dialog.close();document.querySelector('.tab[data-tab="panel"]')?.click()});
    $('peekText11')?.addEventListener('click',()=>{dialog.close();document.querySelector('.tab[data-tab="text"]')?.click()});
    $('peekDice11')?.addEventListener('click',()=>{dialog.close();if(typeof randomizePanel08==='function')randomizePanel08()});
    if(!dialog.dataset.sheetBackdrop13){dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});dialog.dataset.sheetBackdrop13='1';}
    if(!dialog.open)dialog.showModal();
    dialog.querySelector('.peek-scroll13')?.scrollTo?.({top:0});
  };

  if(!$('panelPeekMobileStyle13')){
    const style=document.createElement('style');style.id='panelPeekMobileStyle13';style.textContent=`
      .panel-peek-dialog11{padding:0!important;background:transparent!important;box-shadow:none!important;overflow:visible!important;width:min(620px,calc(100vw - 24px));max-width:620px}
      .panel-peek-card11{display:flex;flex-direction:column;padding:0!important;overflow:hidden!important;max-height:min(84dvh,720px)!important;background:#fff;color:#111827;border:1px solid #d7dee8;border-radius:20px;box-shadow:0 24px 80px rgba(0,0,0,.30)}
      .peek-header13{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex:0 0 auto;padding:14px 14px 11px 16px;border-bottom:1px solid #e5e7eb;background:#fff}
      .peek-heading13{min-width:0}.peek-heading13>div{display:flex;align-items:center;gap:8px;min-width:0}.peek-heading13 h2{margin:0;font-size:18px;line-height:1.25}.peek-heading13 p{margin:6px 0 0;color:#334155;font-size:13px;line-height:1.45;overflow-wrap:anywhere}.peek-role13{display:inline-flex;align-items:center;min-height:24px;padding:3px 8px;border-radius:999px;background:#eef2ff;color:#4338ca;font-size:11px;font-weight:800;white-space:nowrap}
      .peek-close13{flex:0 0 44px;width:44px;height:44px;min-height:44px;padding:0;border-radius:12px;font-size:24px;line-height:1;background:#f8fafc}
      .peek-scroll13{min-height:0;overflow-y:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;padding:4px 16px 10px;background:#fff}
      .peek-rows13{display:grid}.peek-row13{display:grid;grid-template-columns:76px minmax(0,1fr);gap:10px;align-items:start;padding:10px 0;border-bottom:1px solid #eef2f7}.peek-row13 b{color:#64748b;font-size:11px;line-height:1.45}.peek-row13 span{min-width:0;color:#111827;font-size:13px;line-height:1.5;white-space:pre-line;overflow-wrap:anywhere}
      .peek-framing13{margin:10px 0 2px;padding:8px 10px;border-radius:10px;background:#f8fafc;color:#475569;font-size:12px;line-height:1.45}.peek-framing13.small,.peek-framing13.large{background:#fff7ed;color:#9a3412}.peek-framing13.good{background:#f0fdf4;color:#166534}
      .peek-actions13{display:grid;grid-template-columns:1fr 1fr;gap:8px;flex:0 0 auto;padding:10px 12px calc(10px + env(safe-area-inset-bottom));border-top:1px solid #e5e7eb;background:#fff}.peek-actions13 button{width:100%;min-height:46px;margin:0;padding:9px 8px;font-size:13px}
      @media(max-width:760px){
        .panel-peek-dialog11{width:100%!important;max-width:none!important;margin:auto 0 0 0!important;max-height:calc(100dvh - 6px)!important}
        .panel-peek-card11{max-width:none!important;max-height:min(82dvh,680px)!important;border-left:0;border-right:0;border-bottom:0;border-radius:20px 20px 0 0}
        .peek-header13{padding:12px 12px 10px 14px}.peek-heading13 h2{font-size:17px}.peek-heading13 p{font-size:12px;margin-top:4px}
        .peek-scroll13{padding:2px 14px 8px}.peek-row13{grid-template-columns:68px minmax(0,1fr);gap:8px;padding:8px 0}.peek-row13 span{font-size:12px}.peek-actions13{padding-left:10px;padding-right:10px}.peek-actions13 button{font-size:12px}
      }
      @media(max-width:390px){.peek-row13{grid-template-columns:60px minmax(0,1fr)}.peek-actions13{gap:6px}.peek-actions13 button{padding-left:5px;padding-right:5px}}
    `;document.head.appendChild(style);
  }
})();
