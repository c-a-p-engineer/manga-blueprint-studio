// Bridge shared Vite/Core layout recipes into the legacy editor state without creating a second layout model.
(function(){
  function currentCanvas(){
    return{width:Number(project?.meta?.pageWidth)||PAGE_W,height:Number(project?.meta?.pageHeight)||PAGE_H,panelCount:currentPage()?.panels?.length||0,language};
  }
  function currentSolverDecision(){
    const page=currentPage?.();
    const decision=page?.layoutDecision||null;
    if(decision)return JSON.parse(JSON.stringify(decision));
    return{
      solver:'manual-recipe',
      winner:project?.meta?.layoutRecipeId||project?.meta?.layoutPreset||null,
      recipeId:project?.meta?.layoutRecipeId||null,
      score:null,
      candidates:[],
      directionRationale:[]
    };
  }
  function applyLayoutRecipe(config){
    const rects=Array.isArray(config?.rects)?config.rects:[];if(!rects.length)return false;
    const ask=config?.ask!==false;
    if(ask&&typeof confirmReset04==='function'&&!confirmReset04())return false;
    mutate(()=>{
      currentPage().panels=rects.map((rect,index)=>makePanel({x:Number(rect.x),y:Number(rect.y),w:Number(rect.w),h:Number(rect.h)},index+1));
      project.meta.layoutPreset=config.recipeId||'custom';
      project.meta.layoutRecipeId=config.recipeId||null;
      project.meta.layoutSeed=String(config.seed??0);
      project.meta.layoutMutation=Number(config.mutation)||0;
      selectedPanelId=currentPage().panels[0]?.id||null;selectedCharacterId=null;selectedBalloonId=null;
      renumberPanels();
    });
    return true;
  }
  globalThis.MANGA_BLUEPRINT_LAYOUT_API=Object.freeze({currentCanvas,currentSolverDecision,applyLayoutRecipe});
})();
