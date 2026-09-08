// Prototype 0.8 hardening: make Smart Manga story-readable too and keep new placeholders localized.
const smartActionProfiles12={
  action:{ja:['相手との距離を詰める','勢いをつけて攻撃へ移る','攻撃を受けた反応を見せる','決定打の瞬間を見せる'],en:['closes the distance to the opponent','commits to the attack with momentum','shows the reaction to the attack','shows the decisive impact']},
  conversation:{ja:['二人の位置関係と会話の場を見せる','相手へ話しかける','言葉を受けて反応する','会話の余韻を見せる'],en:['establishes the speakers and their space','speaks to the other character','reacts to what was said','lets the conversation settle']},
  gag:{ja:['普通の状況を見せる','自信を持って前振りする','予想外のズレに気づく','オチの反応を見せる'],en:['establishes the normal situation','sets up the joke with confidence','notices the unexpected mismatch','delivers the reaction to the punchline']},
  daily:{ja:['日常の状況を見せる','相手や出来事に気づく','小さな感情の変化を見せる','穏やかな余韻で締める'],en:['establishes the everyday situation','notices the other person or event','shows a small emotional change','ends on a gentle afterglow']},
  climax:{ja:['見せ場前の状況を整える','見せ場へ向けて動き出す','直前の反応や緊張を見せる','最大の見せ場を大きく見せる'],en:['sets up the moment before the climax','moves decisively toward the climax','shows the reaction or tension just before it','shows the main climax at full emphasis']},
  fourkoma:{ja:['状況を提示する','前振りを進める','予想をずらす','結末・オチで締める'],en:['sets up the situation','develops the setup','shifts the expectation','lands the ending or punchline']},
  romance:{ja:['二人の距離や空気を見せる','相手を意識するきっかけが起きる','照れや迷いで視線を外す','関係の変化を感じさせる'],en:['establishes the distance and mood between them','creates a moment of awareness of the other person','looks away with hesitation or blush','shows a small change in their relationship']},
  cute:{ja:['かわいい日常の状況を見せる','こちらに気づいて反応する','少し近づいて表情を見せる','印象的なかわいい仕草で締める'],en:['establishes a cute everyday moment','notices the viewer and reacts','moves a little closer to show expression','ends with a memorable cute gesture']},
  suspense:{ja:['静かな状況を提示する','違和感や物音に気づく','不安が高まる反応を見せる','危険や異変を強く示す'],en:['establishes a quiet situation','notices something wrong or a suspicious sound','shows rising unease','reveals the danger or anomaly strongly']},
  intro:{ja:['人物の全体像を見せる','特徴的な仕草や性格を見せる','表情や視線で印象を深める','その人物らしい決めカットで締める'],en:['shows the character clearly','shows a distinctive gesture or personality trait','deepens the impression through expression or gaze','ends with a signature character shot']}
};

function smartActionIntent12(purpose,index,total,role){
  const profile=smartActionProfiles12[purpose]||smartActionProfiles12.daily,values=profile[language]||profile.ja;
  if(total<=1)return values.at(-1);
  const mapped=Math.round(index*(values.length-1)/(total-1));
  return values[Math.max(0,Math.min(values.length-1,mapped))]||`${role||''}`;
}

const applySmartCandidate08Base12=applySmartCandidate08;
applySmartCandidate08=function(index){
  const before=snapshot(),candidate=smartCandidates08[index];
  applySmartCandidate08Base12(index);
  if(!candidate||snapshot()===before)return;
  const ordered=[...currentPage().panels].sort((a,b)=>a.order-b.order);
  ordered.forEach((panel,i)=>{if(!panel.actionIntent?.trim())panel.actionIntent=smartActionIntent12(candidate.purpose,i,ordered.length,panel.role)});
  project.meta.storyTemplate='';
  render();
};

function localizePrototype08Fields12(){
  const action=$('actionIntent11');if(action)action.placeholder=t('actionIntentPlaceholder');
}
localizePrototype08Fields12();
$('languageSelect')?.addEventListener('change',()=>queueMicrotask(localizePrototype08Fields12));

// Mobile Panel Peek hardening: opaque bottom sheet, compact key/value rows,
// scrollable content area, and always-reachable actions.
function peekRow12(label,value){
  return `<div class="peek-row12"><b>${escapeXml(label)}</b><span>${escapeXml(value||'—')}</span></div>`;
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

  dialog.innerHTML=`<form method="dialog" class="modal-card panel-peek-card11" aria-labelledby="panelPeekTitle12">
    <header class="peek-header12">
      <div class="peek-heading12"><div><h2 id="panelPeekTitle12">${escapeXml(t('panelPeekTitle'))} ${panel.order}</h2><span class="peek-role12">${escapeXml(role)}</span></div><p>${escapeXml(action)}</p></div>
      <button class="peek-close12" value="close" aria-label="${escapeXml(t('panelPeekClose'))}">×</button>
    </header>
    <div class="peek-scroll12">
      <div class="peek-rows12">
        ${peekRow12(t('panelPeekCharacters'),chars)}
        ${peekRow12(t('panelPeekCamera'),camera)}
        ${peekRow12(t('panelPeekBackground'),bg)}
        ${peekRow12(t('panelPeekDialogue'),dialogueText)}
        ${peekRow12(t('panelPeekEffects'),effects)}
      </div>
      <div class="peek-framing12 ${escapeXml(frame.kind)}"><span>${escapeXml(frame.text)}</span></div>
    </div>
    <div class="peek-actions12">
      <button id="peekEdit11" type="button" class="primary">${escapeXml(t('panelPeekEdit'))}</button>
      <button id="peekText11" type="button">${escapeXml(t('panelPeekText'))}</button>
      <button id="peekDice11" type="button">${escapeXml(t('panelPeekDice'))}</button>
      <button value="close">${escapeXml(t('panelPeekClose'))}</button>
    </div>
  </form>`;

  $('peekEdit11')?.addEventListener('click',()=>{dialog.close();document.querySelector('.tab[data-tab="panel"]')?.click()});
  $('peekText11')?.addEventListener('click',()=>{dialog.close();document.querySelector('.tab[data-tab="text"]')?.click()});
  $('peekDice11')?.addEventListener('click',()=>{dialog.close();if(typeof randomizePanel08==='function')randomizePanel08()});
  if(!dialog.dataset.sheetBackdrop12){dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});dialog.dataset.sheetBackdrop12='1';}
  if(!dialog.open)dialog.showModal();
  dialog.querySelector('.peek-scroll12')?.scrollTo?.({top:0});
};

if(!$('panelPeekMobileStyle12')){
  const style=document.createElement('style');style.id='panelPeekMobileStyle12';style.textContent=`
    .panel-peek-dialog11{padding:0!important;background:transparent!important;box-shadow:none!important;overflow:visible!important;width:min(620px,calc(100vw - 24px));max-width:620px}
    .panel-peek-card11{display:flex;flex-direction:column;padding:0!important;overflow:hidden!important;max-height:min(84dvh,720px)!important;background:#fff;color:#111827;border:1px solid #d7dee8;border-radius:20px;box-shadow:0 24px 80px rgba(0,0,0,.30)}
    .peek-header12{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex:0 0 auto;padding:14px 14px 11px 16px;border-bottom:1px solid #e5e7eb;background:#fff}
    .peek-heading12{min-width:0}.peek-heading12>div{display:flex;align-items:center;gap:8px;min-width:0}.peek-heading12 h2{margin:0;font-size:18px;line-height:1.25}.peek-heading12 p{margin:6px 0 0;color:#334155;font-size:13px;line-height:1.45;overflow-wrap:anywhere}.peek-role12{display:inline-flex;align-items:center;min-height:24px;padding:3px 8px;border-radius:999px;background:#eef2ff;color:#4338ca;font-size:11px;font-weight:800;white-space:nowrap}
    .peek-close12{flex:0 0 44px;width:44px;height:44px;min-height:44px;padding:0;border-radius:12px;font-size:24px;line-height:1;background:#f8fafc}
    .peek-scroll12{min-height:0;overflow-y:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;padding:4px 16px 10px;background:#fff}
    .peek-rows12{display:grid}.peek-row12{display:grid;grid-template-columns:76px minmax(0,1fr);gap:10px;align-items:start;padding:10px 0;border-bottom:1px solid #eef2f7}.peek-row12 b{color:#64748b;font-size:11px;line-height:1.45}.peek-row12 span{min-width:0;color:#111827;font-size:13px;line-height:1.5;white-space:pre-line;overflow-wrap:anywhere}
    .peek-framing12{margin:10px 0 2px;padding:8px 10px;border-radius:10px;background:#f8fafc;color:#475569;font-size:12px;line-height:1.45}.peek-framing12.small,.peek-framing12.large{background:#fff7ed;color:#9a3412}.peek-framing12.good{background:#f0fdf4;color:#166534}
    .peek-actions12{display:grid;grid-template-columns:1fr 1fr;gap:8px;flex:0 0 auto;padding:10px 12px calc(10px + env(safe-area-inset-bottom));border-top:1px solid #e5e7eb;background:#fff}.peek-actions12 button{width:100%;min-height:46px;margin:0;padding:9px 8px;font-size:13px}
    @media(max-width:760px){
      .panel-peek-dialog11{width:100%!important;max-width:none!important;margin:auto 0 0 0!important;max-height:calc(100dvh - 6px)!important}
      .panel-peek-card11{max-width:none!important;max-height:min(82dvh,680px)!important;border-left:0;border-right:0;border-bottom:0;border-radius:20px 20px 0 0}
      .peek-header12{padding:12px 12px 10px 14px}.peek-heading12 h2{font-size:17px}.peek-heading12 p{font-size:12px;margin-top:4px}
      .peek-scroll12{padding:2px 14px 8px}.peek-row12{grid-template-columns:68px minmax(0,1fr);gap:8px;padding:8px 0}.peek-row12 span{font-size:12px}.peek-actions12{padding-left:10px;padding-right:10px}.peek-actions12 button{font-size:12px}
    }
    @media(max-width:390px){.peek-row12{grid-template-columns:60px minmax(0,1fr)}.peek-actions12{gap:6px}.peek-actions12 button{padding-left:5px;padding-right:5px}}
  `;document.head.appendChild(style);
}