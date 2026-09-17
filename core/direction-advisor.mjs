// Deterministic manga-direction advisor.
// Turns authored semantic intent into explainable technique candidates without mutating authored state.
import{recommendMangaDirection,techniqueRecord}from'./manga-knowledge.mjs';
const text=v=>String(v||'').toLowerCase();

export function advisePanelDirection(panel={},index=0,count=1,context={}){
 const purpose=text(panel.purpose||panel.actionIntent),motion=text(panel.motionDirection||Object.values(panel.motion||{}).join(' ')),attention=text(panel.attention?.primary),hold=panel.timing?.hold??.5,importance=panel.importance?.energy??.5;
 const result=recommendMangaDirection({medium:context.medium||panel.medium||'print-page',genre:context.genre||panel.genre||'',purpose,importance,hold,motion,attention});
 let techniques=[...result.techniques];
 if(index===count-1&&/reveal|疑問|途中|turn|次|正体/.test(purpose)){const id=result.profile.progression==='scroll'?'viewport-reveal':'page-turn-reveal';if(!techniques.includes(id))techniques.unshift(id)}
 techniques=techniques.slice(0,6);
 return {techniques,rejected:result.rejected,reasons:techniques.map(id=>({technique:id,reason:directionReason(id)}))};
}

export function advisePageDirection(semanticPanels=[],context={}){return semanticPanels.map((p,i)=>({panel:i+1,...advisePanelDirection(p,i,semanticPanels.length,context)}));}
export function directionReason(id){const t=techniqueRecord(id);if(!t)return'';const map={
 'hero-panel':'周囲との面積差で重要Beatを強調','diagonal-panel':'枠形状で動き・不安定さを補強','bleed':'画面外へ続くスケールを作る','character-breakout':'枠越境で存在感を強める','detail-inset':'主構図を保ちながら細部へ注意を追加','pause':'情報密度を落として滞在時間を作る','small-panel':'短いBeatとして刻む','page-turn-reveal':'次ページまで情報を保留','viewport-reveal':'現在viewport外へ情報を保留','scroll-delay':'縦距離そのものを間として使う','foreshortening':'前後差を誇張して奥行きと威力を作る','contact-focus':'接触点を物理因果の主注目にする','reaction-shot':'出来事の意味を受け手の反応で伝える','negative-space':'空白で静けさ・孤立・緊張を作る','progressive-reveal':'情報量を段階的に増やして期待を作る','cropped-information':'必要な一部を隠して補完を促す','motion-lines':'動きのベクトルと速度を補強','anticipation':'本動作前の溜めで次の動作を明確化','follow-through':'動作後の流れで力の方向と結果を示す','closeup':'被写体を大きくして感情・情報へ集中','wide-shot':'環境と人物の位置関係を明確化'};return map[id]||`${t.category}: ${t.effects.join(', ')}`;}
