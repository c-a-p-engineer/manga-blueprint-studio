function bindValue(id, getter, setter, event='change'){
  $(id).addEventListener(event,()=>{const target=getter();if(!target)return;mutate(()=>setter(target,$(id).value));});
}
$('undoBtn').addEventListener('click',undo);$('redoBtn').addEventListener('click',redo);
$('languageSelect').addEventListener('change',()=>{language=$('languageSelect').value;localStorage.setItem(LANG_KEY,language);applyLanguage();});
document.querySelectorAll('.tab').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.tab').forEach(x=>x.classList.toggle('active',x===btn));document.querySelectorAll('.tool-panel').forEach(x=>x.classList.toggle('active',x.dataset.section===btn.dataset.tab));}));
$('templateSelect').addEventListener('change',()=>applyTemplate($('templateSelect').value));
$('splitVertical').addEventListener('click',()=>splitPanel('vertical'));$('splitHorizontal').addEventListener('click',()=>splitPanel('horizontal'));$('renumber').addEventListener('click',()=>mutate(renumberPanels));$('deletePanel').addEventListener('click',deletePanel);
$('addCharacter').addEventListener('click',addCharacter);$('addBalloon').addEventListener('click',addBalloon);
$('deleteCharacter').addEventListener('click',()=>{const p=selectedPanel(),c=selectedCharacter();if(!p||!c)return;mutate(()=>{p.characters=p.characters.filter(x=>x.id!==c.id);selectedCharacterId=null;});});
$('deleteBalloon').addEventListener('click',()=>{const p=selectedPanel(),b=selectedBalloon();if(!p||!b)return;mutate(()=>{p.balloons=p.balloons.filter(x=>x.id!==b.id);selectedBalloonId=null;});});
$('characterList').addEventListener('click',e=>{const btn=e.target.closest('[data-list-char]');if(btn){selectedCharacterId=btn.dataset.listChar;selectedBalloonId=null;render();}});
$('balloonList').addEventListener('click',e=>{const btn=e.target.closest('[data-list-balloon]');if(btn){selectedBalloonId=btn.dataset.listBalloon;selectedCharacterId=null;render();}});

bindValue('panelRole',selectedPanel,(p,v)=>p.role=v);bindValue('cameraDistance',selectedPanel,(p,v)=>p.camera.distance=v);bindValue('cameraAngle',selectedPanel,(p,v)=>p.camera.angle=v);bindValue('cameraViewpoint',selectedPanel,(p,v)=>p.camera.viewpoint=v);
bindValue('cameraFocus',selectedPanel,(p,v)=>p.camera.focus=v,'change');bindValue('cameraIntent',selectedPanel,(p,v)=>p.camera.intent=v,'change');bindValue('borderStyle',selectedPanel,(p,v)=>p.style.border=v);bindValue('bleedEdge',selectedPanel,(p,v)=>p.style.bleed=v);bindValue('breakoutMode',selectedPanel,(p,v)=>p.style.breakout=v);
bindValue('backgroundLocation',selectedPanel,(p,v)=>p.background.location=v,'change');bindValue('backgroundTime',selectedPanel,(p,v)=>p.background.timeOfDay=v);bindValue('backgroundWeather',selectedPanel,(p,v)=>p.background.weather=v,'change');bindValue('backgroundMood',selectedPanel,(p,v)=>p.background.mood=v,'change');bindValue('backgroundDetail',selectedPanel,(p,v)=>p.background.detailLevel=v);bindValue('backgroundRenderMode',selectedPanel,(p,v)=>p.background.renderMode=v);bindValue('backgroundNotes',selectedPanel,(p,v)=>p.background.notes=v,'change');
bindValue('lineEffect',selectedPanel,(p,v)=>p.effects.lineEffect=v);bindValue('effectStrength',selectedPanel,(p,v)=>p.effects.strength=v);bindValue('sfxText',selectedPanel,(p,v)=>p.effects.sfxText=v,'change');bindValue('sfxStyle',selectedPanel,(p,v)=>p.effects.sfxStyle=v);bindValue('effectNotes',selectedPanel,(p,v)=>p.effects.notes=v,'change');

bindValue('characterName',selectedCharacter,(c,v)=>c.name=v,'change');bindValue('characterId',selectedCharacter,(c,v)=>c.characterId=v,'change');bindValue('referenceKey',selectedCharacter,(c,v)=>c.referenceKey=v,'change');bindValue('poseSelect',selectedCharacter,(c,v)=>c.poseId=v);
bindValue('expressionType',selectedCharacter,(c,v)=>c.expression.type=v);bindValue('expressionIntensity',selectedCharacter,(c,v)=>c.expression.intensity=Number(v));bindValue('expressionNotes',selectedCharacter,(c,v)=>c.expression.notes=v,'change');bindValue('gazeTarget',selectedCharacter,(c,v)=>c.gaze.target=v);bindValue('gazeNotes',selectedCharacter,(c,v)=>c.gaze.notes=v,'change');
bindValue('characterScale',selectedCharacter,(c,v)=>c.scale=Number(v),'change');bindValue('characterRotation',selectedCharacter,(c,v)=>c.rotation=Number(v),'change');

bindValue('balloonType',selectedBalloon,(b,v)=>b.type=v);bindValue('balloonSpeaker',selectedBalloon,(b,v)=>b.speakerId=v);bindValue('balloonText',selectedBalloon,(b,v)=>b.text=v,'change');bindValue('balloonX',selectedBalloon,(b,v)=>b.x=Number(v),'change');bindValue('balloonY',selectedBalloon,(b,v)=>b.y=Number(v),'change');bindValue('balloonSize',selectedBalloon,(b,v)=>b.size=Number(v),'change');

$('copyPrompt').addEventListener('click',async()=>{try{await navigator.clipboard.writeText($('promptOutput').value);$('copyPrompt').textContent=language==='ja'?'コピー済み':'Copied';setTimeout(()=>{$('copyPrompt').textContent=t('copy')},1000);}catch{}});
$('exportAiPng').addEventListener('click',()=>exportPng(false));$('exportAnnotatedPng').addEventListener('click',()=>exportPng(true));$('exportJson').addEventListener('click',exportJson);
$('importJson').addEventListener('change',async e=>{
  const file=e.target.files?.[0];if(!file)return;
  try{
    let incoming=ensureProjectIdentity(JSON.parse(await file.text()));
    if(await projectStorage.has(incoming.meta.workId)){
      const choice=prompt(
        `同じ作品IDのデータが既にあります。\n1: 別作品として取り込む\n2: 既存作品を上書き\n3: キャンセル\n\n作品: ${incoming.meta.title||'(無題)'}\n既存ページ数: ${(await projectStorage.list()).find(x=>x.workId===incoming.meta.workId)?.pageCount??'?'}\n取込ページ数: ${incoming.pages.length}`,
        '1'
      );
      if(choice==='1')incoming=cloneProjectAsNewWork(incoming);
      else if(choice==='2'){
        if(!confirm(`「${incoming.meta.title||'(無題)'}」を上書きします。既存のローカル変更は置き換えられます。続行しますか？`))return;
      }else return;
    }
    pushHistory();
    project=incoming;
    selectedPageId=project.pages[0]?.id||null;
    selectedPanelId=currentPage()?.panels[0]?.id||null;
    selectedCharacterId=null;
    selectedBalloonId=null;
    render();
  }catch(err){console.warn('Project JSON import failed.',err);alert('JSONを読み込めませんでした。');}
  finally{e.target.value='';}
});

$('poseSelect').innerHTML=Object.entries(posePresets).map(([id,p])=>`<option value="${id}">${escapeXml(p.ja)} / ${escapeXml(p.en)}</option>`).join('');
applyLanguage();
