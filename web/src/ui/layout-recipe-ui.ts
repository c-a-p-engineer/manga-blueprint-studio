import{buildLayoutRecipe,getLayoutRecipe,listLayoutRecipes,layoutSettingsSnippet}from'../../../core/layout-recipes.mjs';
import{getLayoutRecipeApi}from'../runtime/legacy-api';
import'./layout-recipe-ui.css';
const escapeHtml=(value:unknown)=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]||char));

function previewSvg(rects:Array<{x:number;y:number;w:number;h:number}>,width:number,height:number){
  return `<svg viewBox="0 0 ${width} ${height}" aria-label="Layout recipe preview"><rect width="${width}" height="${height}" fill="#fff"/>${rects.map((r,i)=>`<rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" rx="4" fill="#f8fafc" stroke="#111827" stroke-width="5"/><text x="${r.x+r.w/2}" y="${r.y+r.h/2}" text-anchor="middle" dominant-baseline="middle" font-size="${Math.max(18,Math.min(42,Math.min(r.w,r.h)*.18))}" font-family="sans-serif" fill="#475569">P${i+1}</text>`).join('')}</svg>`;
}
async function copyText(text:string){
  if(navigator.clipboard?.writeText)return navigator.clipboard.writeText(text);
  const area=document.createElement('textarea');area.value=text;document.body.append(area);area.select();document.execCommand('copy');area.remove();
}
export function installLayoutRecipeUi(){
  const api=getLayoutRecipeApi(),anchor=document.getElementById('layoutHelp');if(!api||!anchor||document.getElementById('layoutRecipeUi'))return;
  const layoutApi=api;
  const initial=layoutApi.currentCanvas(),params=new URLSearchParams(location.search);
  const host=document.createElement('section');host.id='layoutRecipeUi';host.className='layout-recipe-ui';
  host.innerHTML=`
    <div class="layout-recipe-title"><strong>Recipe Bank</strong><a id="layoutRecipeCatalogLink" href="./layout-catalog.html" target="_blank" rel="noopener">コマ割りカタログ ↗</a></div>
    <p class="layout-recipe-help">基本コマ割りを選び、seed と変異度で近い別案を作れます。斜め・差し込み・断ち切り等はその後の演出として調整します。</p>
    <div class="layout-recipe-fields">
      <label>コマ数<select id="layoutRecipePanelCount">${[1,2,3,4,5,6].map(n=>`<option value="${n}">${n}</option>`).join('')}</select></label>
      <label>ベース<select id="layoutRecipeSelect"></select></label>
      <label>seed<input id="layoutRecipeSeed" type="text" inputmode="numeric" value="0"/></label>
      <label>変異度 <output id="layoutRecipeMutationOut">0.20</output><input id="layoutRecipeMutation" type="range" min="0" max="1" step="0.05" value="0.20"/></label>
    </div>
    <div id="layoutRecipeDeepLinkNotice" class="layout-recipe-deeplink" role="status" aria-live="polite" hidden></div>\n    <div id="layoutRecipeDescription" class="layout-recipe-description"></div>
    <div id="layoutRecipePreview" class="layout-recipe-preview"></div>
    <details id="layoutSolverInspector" class="layout-solver-inspector"><summary>Solver decision / 判断理由</summary><div id="layoutSolverDecision"></div></details>
    <div class="layout-recipe-actions"><button id="layoutRecipeApply" class="primary" type="button">このコマ割りを使う</button><button id="layoutRecipeReroll" type="button">seedを変える</button><button id="layoutRecipeCopy" type="button">設定をコピー</button></div>
  `;
  anchor.insertAdjacentElement('afterend',host);
  const panelCount=host.querySelector<HTMLSelectElement>('#layoutRecipePanelCount')!,select=host.querySelector<HTMLSelectElement>('#layoutRecipeSelect')!,seed=host.querySelector<HTMLInputElement>('#layoutRecipeSeed')!,mutation=host.querySelector<HTMLInputElement>('#layoutRecipeMutation')!,out=host.querySelector<HTMLOutputElement>('#layoutRecipeMutationOut')!,preview=host.querySelector<HTMLElement>('#layoutRecipePreview')!,description=host.querySelector<HTMLElement>('#layoutRecipeDescription')!,catalog=host.querySelector<HTMLAnchorElement>('#layoutRecipeCatalogLink')!,solverDecision=host.querySelector<HTMLElement>('#layoutSolverDecision')!;
  panelCount.value=params.get('layoutPanels')||String(Math.max(1,Math.min(6,initial.panelCount||4)));seed.value=params.get('layoutSeed')||'0';mutation.value=params.get('layoutMutation')||'.20';
  function refreshRecipes(preferred=params.get('layoutRecipe')){
    const count=Number(panelCount.value)||4,recipes=listLayoutRecipes({panelCount:count});select.innerHTML=recipes.map((recipe:any)=>`<option value="${escapeHtml(recipe.id)}">${escapeHtml(initial.language==='en'?recipe.en:recipe.ja)} — ${escapeHtml(recipe.id)}</option>`).join('');
    if(preferred&&recipes.some((recipe:any)=>recipe.id===preferred))select.value=preferred;
    refreshPreview();
  }
  function refreshSolverDecision(){
    const decision=layoutApi.currentSolverDecision(),candidates=(decision.candidates||[]).slice(0,5),rationale=decision.directionRationale||[];
    const winner=decision.recipeId||decision.winner||'manual';
    const score=typeof decision.score==='number'?decision.score.toFixed(3):'—';
    const candidateText=candidates.length?candidates.map((c:any)=>`${c.recipeId||c.name||'?'}: ${typeof c.score==='number'?c.score.toFixed(3):'—'}`).join(' / '):'候補スコアなし';
    const reasonText=rationale.flatMap((entry:any)=>(entry.reasons||[]).map((r:any)=>`P${entry.panel||'?'} ${r.technique}: ${r.reason}`)).slice(0,6).join(' / ');
    solverDecision.textContent=`winner=${winner} / score=${score} / ${candidateText}${reasonText?` / ${reasonText}`:''}`;
  }
  function refreshPreview(){
    const canvas=layoutApi.currentCanvas(),count=Number(panelCount.value)||4,recipe=getLayoutRecipe(select.value);if(!recipe)return;
    const mutationValue=Number(mutation.value)||0,built=buildLayoutRecipe(recipe.id,{width:canvas.width,height:canvas.height,panelCount:count,seed:seed.value,mutation:mutationValue});out.value=mutationValue.toFixed(2);description.textContent=initial.language==='en'?recipe.helpEn:recipe.helpJa;preview.innerHTML=previewSvg(built.rects,canvas.width,canvas.height);
    const q=new URLSearchParams({panels:String(count),recipe:recipe.id,seed:seed.value,mutation:mutationValue.toFixed(2)});catalog.href=`./layout-catalog.html?${q}`;refreshSolverDecision();
  }
  panelCount.addEventListener('change',()=>refreshRecipes(select.value));select.addEventListener('change',refreshPreview);seed.addEventListener('input',refreshPreview);mutation.addEventListener('input',refreshPreview);
  host.querySelector('#layoutRecipeReroll')?.addEventListener('click',()=>{seed.value=String(Math.floor(Math.random()*1_000_000));refreshPreview();});
  host.querySelector('#layoutRecipeCopy')?.addEventListener('click',async()=>{const count=Number(panelCount.value)||4;await copyText(layoutSettingsSnippet({recipeId:select.value,panelCount:count,seed:seed.value,mutation:Number(mutation.value)||0})+`\n# CLI: --layout ${select.value} --seed ${seed.value} --mutation ${Number(mutation.value).toFixed(2)}`);});
  host.querySelector('#layoutRecipeApply')?.addEventListener('click',()=>{const canvas=layoutApi.currentCanvas(),count=Number(panelCount.value)||4,built=buildLayoutRecipe(select.value,{width:canvas.width,height:canvas.height,panelCount:count,seed:seed.value,mutation:Number(mutation.value)||0});layoutApi.applyLayoutRecipe({recipeId:select.value,seed:seed.value,mutation:Number(mutation.value)||0,rects:built.rects,ask:true});});
  const deepLinkedRecipe=params.get('layoutRecipe');
  refreshRecipes(deepLinkedRecipe||params.get('recipe'));
  if(deepLinkedRecipe){
    const notice=host.querySelector<HTMLElement>('#layoutRecipeDeepLinkNotice'),apply=host.querySelector<HTMLButtonElement>('#layoutRecipeApply');
    if(notice){notice.hidden=false;notice.textContent=initial.language==='en'?'Catalog settings loaded. Review the preview, then apply when ready.':'カタログの設定を読み込みました。プレビューを確認し、「このコマ割りを使う」で適用してください。';}
    if(apply)apply.textContent=initial.language==='en'?'Apply catalog layout':'カタログ設定を適用';
    // A catalog handoff is an explicit request to inspect layout settings, not
    // permission to mutate the page. Reveal the Manual layout tab so the
    // prefilled Recipe Bank controls and notice are immediately visible.
    (document.getElementById('phase1PageModeLayout') as HTMLButtonElement|null)?.click();
  }
}
