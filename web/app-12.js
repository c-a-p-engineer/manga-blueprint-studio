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
