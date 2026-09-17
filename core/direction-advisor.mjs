// Deterministic manga-direction advisor.
// Turns semantic intent into technique candidates without silently changing authored state.
const text=v=>String(v||'').toLowerCase();
const uniq=xs=>[...new Set(xs)];

export function advisePanelDirection(panel={},index=0,count=1){
  const purpose=text(panel.purpose||panel.actionIntent), motion=text(panel.motionDirection||Object.values(panel.motion||{}).join(' ')), focus=text(panel.attention?.primary), hold=panel.timing?.hold??.5, energy=panel.importance?.energy??.5;
  const techniques=[];
  if(/impact|衝突|攻撃|slash|punch|kick|爆発|climax|決め/.test(purpose)||energy>.78)techniques.push('hero-panel');
  if(/impact|衝突|加速|fall|落下|slash|attack/.test(purpose)||/(left|right|up|down|左|右|上|下)/.test(motion))techniques.push('diagonal-panel');
  if(/establish|景色|登場|reveal|広|全景/.test(purpose))techniques.push('bleed');
  if(/entrance|登場|必殺|power|hero/.test(purpose)&&energy>.65)techniques.push('character-breakout');
  if(/eye|hand|目|手|detail|細部/.test(focus))techniques.push('inset');
  if(hold>.72)techniques.push('ma-pause');
  if(hold<.32)techniques.push('short-beat');
  if(index===count-1&&(/reveal|疑問|途中|turn|次/.test(purpose)))techniques.push('page-turn-hook');
  return uniq(techniques).slice(0,4);
}

export function advisePageDirection(semanticPanels=[]){
  return semanticPanels.map((p,i)=>({panel:i+1,techniques:advisePanelDirection(p,i,semanticPanels.length)}));
}

export function directionReason(technique){
  return ({
    'hero-panel':'重要な瞬間を周囲との面積差で強調',
    'diagonal-panel':'動き・衝撃の方向性を枠形状でも補強',
    bleed:'画面外へ続くスケールや登場感を補強',
    'character-breakout':'人物を枠から越境させ存在感を補強',
    inset:'主要構図を保ったまま細部へ注意を追加',
    'ma-pause':'情報量とは別に読者の滞在時間を確保',
    'short-beat':'短い反応や瞬間を小さく刻む',
    'page-turn-hook':'次ページまで情報を保留してrevealを作る'
  })[technique]||'';
}
