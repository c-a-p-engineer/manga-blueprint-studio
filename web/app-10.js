// Prototype 0.7 hardening: keep appearance controls and background preset values aligned with UI language.
const backgroundSceneData10={
  classroomDay:{ja:{location:'学校の教室',timeOfDay:'day',weather:'晴れ',mood:'明るい',detailLevel:'medium',renderMode:'normal'},en:{location:'school classroom',timeOfDay:'day',weather:'sunny',mood:'bright',detailLevel:'medium',renderMode:'normal'}},
  classroomEvening:{ja:{location:'学校の教室',timeOfDay:'evening',weather:'晴れ',mood:'静か',detailLevel:'medium',renderMode:'selective-detail'},en:{location:'school classroom',timeOfDay:'evening',weather:'clear',mood:'quiet',detailLevel:'medium',renderMode:'selective-detail'}},
  rooftopSunset:{ja:{location:'屋上',timeOfDay:'evening',weather:'晴れ',mood:'柔らかい',detailLevel:'medium',renderMode:'normal'},en:{location:'rooftop',timeOfDay:'evening',weather:'clear',mood:'soft',detailLevel:'medium',renderMode:'normal'}},
  bedroomNight:{ja:{location:'寝室',timeOfDay:'night',weather:'',mood:'静か',detailLevel:'low',renderMode:'selective-detail'},en:{location:'bedroom',timeOfDay:'night',weather:'',mood:'quiet',detailLevel:'low',renderMode:'selective-detail'}},
  stationRain:{ja:{location:'駅のホーム',timeOfDay:'evening',weather:'雨',mood:'寂しい',detailLevel:'medium',renderMode:'normal'},en:{location:'train platform',timeOfDay:'evening',weather:'rain',mood:'lonely',detailLevel:'medium',renderMode:'normal'}},
  alleyRain:{ja:{location:'路地裏',timeOfDay:'night',weather:'雨',mood:'不穏',detailLevel:'medium',renderMode:'normal'},en:{location:'back alley',timeOfDay:'night',weather:'rain',mood:'ominous',detailLevel:'medium',renderMode:'normal'}},
  cafeDay:{ja:{location:'カフェ',timeOfDay:'day',weather:'晴れ',mood:'柔らかい',detailLevel:'medium',renderMode:'selective-detail'},en:{location:'cafe',timeOfDay:'day',weather:'sunny',mood:'soft',detailLevel:'medium',renderMode:'selective-detail'}},
  parkEvening:{ja:{location:'公園',timeOfDay:'evening',weather:'晴れ',mood:'静か',detailLevel:'medium',renderMode:'normal'},en:{location:'park',timeOfDay:'evening',weather:'clear',mood:'quiet',detailLevel:'medium',renderMode:'normal'}},
  white:{ja:{location:'',timeOfDay:'',weather:'',mood:'',detailLevel:'none',renderMode:'white'},en:{location:'',timeOfDay:'',weather:'',mood:'',detailLevel:'none',renderMode:'white'}},
  speed:{ja:{location:'',timeOfDay:'',weather:'',mood:'激しい',detailLevel:'low',renderMode:'speed-lines'},en:{location:'',timeOfDay:'',weather:'',mood:'intense',detailLevel:'low',renderMode:'speed-lines'}},
  focus:{ja:{location:'',timeOfDay:'',weather:'',mood:'強い',detailLevel:'low',renderMode:'focus-lines'},en:{location:'',timeOfDay:'',weather:'',mood:'strong',detailLevel:'low',renderMode:'focus-lines'}}
};

function localizeBackgroundPresetData10(){
  for(const [id,localized] of Object.entries(backgroundSceneData10))if(backgroundScenePresets09[id])backgroundScenePresets09[id].data=structuredClone(localized[language]||localized.ja);
}
function localizeAppearanceFields10(){
  const summary=$('baseAppearanceSummary09');if(summary)summary.placeholder=t('appearanceSummaryPlaceholder');
  const base=currentBaseCharacter06?.();const free=base?.identityMode==='free';
  for(const id of ['baseAppearanceHair09','baseAppearanceEyes09','baseAppearanceOutfit09','baseAppearanceFeatures09'])if($(id))$(id).disabled=!!free;
  if(summary)summary.disabled=!!free;
  const details=$('appearanceDetails09');if(details){details.style.opacity=free?'.55':'1';details.toggleAttribute('data-disabled',!!free)}
}

localizeBackgroundPresetData10();
const renderBaseCharacters09Hardening10=renderBaseCharacters06;
renderBaseCharacters06=function(){renderBaseCharacters09Hardening10();localizeAppearanceFields10()};

$('languageSelect')?.addEventListener('change',()=>queueMicrotask(()=>{
  localizeBackgroundPresetData10();
  localizeAppearanceFields10();
  renderBackgroundPreset09?.();
}));

localizeAppearanceFields10();
