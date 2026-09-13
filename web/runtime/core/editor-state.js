// Active editor state and domain-level editing operations.
// History, persistence lifecycle, and rendering are owned by sibling core runtime chunks.
// Legacy browser project key 'manga-blueprint-studio/0.1' is intentionally not migrated; portable .manga.json import remains the compatibility path.
let project=createProjectWithIdentity();
let selectedPageId=project.pages[0]?.id||null;
let selectedPanelId=project.pages[0]?.panels[0]?.id||null;
let selectedCharacterId=null;
let selectedBalloonId=null;
let language=localStorage.getItem(LANG_KEY)||'ja';
let drag=null;

const currentPage=()=>project.pages.find(page=>page.id===selectedPageId)||project.pages[0]||null;
const selectedPanel=()=>currentPage()?.panels.find(panel=>panel.id===selectedPanelId)||null;
const selectedCharacter=()=>selectedPanel()?.characters.find(character=>character.id===selectedCharacterId)||null;
const selectedBalloon=()=>selectedPanel()?.balloons.find(balloon=>balloon.id===selectedBalloonId)||null;

function poseLabel(id){
  const pose=posePresets[id]||posePresets.stand;
  return language==='ja'?`${pose.ja} / ${pose.en}`:pose.en;
}

function t(key){
  return i18n[language]?.[key]||i18n.ja[key]||key;
}

function applyLanguage(){
  document.documentElement.lang=language;
  document.querySelectorAll('[data-i18n]').forEach(element=>{
    const key=element.dataset.i18n;
    if(t(key))element.textContent=t(key);
  });
  $('languageSelect').value=language;
  render();
}

function addCharacter(){
  const panel=selectedPanel();
  if(!panel)return;
  mutate(()=>{
    const n=panel.characters.length+1;
    const character={
      id:uid('char'),
      characterId:`character-${n}`,
      name:`Character ${n}`,
      referenceKey:'',
      x:panel.rect.x+panel.rect.w/2,
      y:panel.rect.y+panel.rect.h/2,
      scale:Math.min(1.15,Math.max(.7,panel.rect.h/500)),
      rotation:0,
      poseId:'stand',
      expression:{type:'neutral',intensity:.5,notes:''},
      gaze:{target:'camera',notes:''}
    };
    panel.characters.push(character);
    selectedCharacterId=character.id;
    selectedBalloonId=null;
  });
}

function addBalloon(){
  const panel=selectedPanel();
  if(!panel)return;
  mutate(()=>{
    const balloon={
      id:uid('balloon'),
      type:'speech',
      speakerId:panel.characters[0]?.characterId||'',
      text:'',
      x:panel.rect.x+panel.rect.w*.72,
      y:panel.rect.y+Math.min(100,panel.rect.h*.2),
      size:1
    };
    panel.balloons.push(balloon);
    selectedBalloonId=balloon.id;
    selectedCharacterId=null;
  });
}

function renumberPanels(){
  const panels=[...currentPage().panels];
  panels.sort((a,b)=>{
    const threshold=Math.max(60,Math.min(a.rect.h,b.rect.h)*.25);
    if(Math.abs(a.rect.y-b.rect.y)>threshold)return a.rect.y-b.rect.y;
    return project.meta.readingDirection==='rtl'?b.rect.x-a.rect.x:a.rect.x-b.rect.x;
  });
  panels.forEach((panel,index)=>panel.order=index+1);
}

function splitPanel(axis){
  const panel=selectedPanel();
  if(!panel)return;
  const index=currentPage().panels.findIndex(candidate=>candidate.id===panel.id);
  const min=150;
  let firstRect,secondRect;
  if(axis==='vertical'){
    if(panel.rect.w<min*2+GUTTER)return alert('このコマはこれ以上左右分割できません。');
    const width=(panel.rect.w-GUTTER)/2;
    firstRect={x:panel.rect.x,y:panel.rect.y,w:width,h:panel.rect.h};
    secondRect={x:panel.rect.x+width+GUTTER,y:panel.rect.y,w:width,h:panel.rect.h};
  }else{
    if(panel.rect.h<min*2+GUTTER)return alert('このコマはこれ以上上下分割できません。');
    const height=(panel.rect.h-GUTTER)/2;
    firstRect={x:panel.rect.x,y:panel.rect.y,w:panel.rect.w,h:height};
    secondRect={x:panel.rect.x,y:panel.rect.y+height+GUTTER,w:panel.rect.w,h:height};
  }
  mutate(()=>{
    const first=makePanel(firstRect,panel.order),second=makePanel(secondRect,panel.order+1);
    first.camera=clone(panel.camera);second.camera=clone(panel.camera);
    first.background=clone(panel.background);second.background=clone(panel.background);
    first.style=clone(panel.style);second.style=clone(panel.style);
    first.effects=clone(panel.effects);second.effects=clone(panel.effects);
    first.role=panel.role;second.role=panel.role;
    for(const character of panel.characters){
      const target=(axis==='vertical'?character.x>=secondRect.x:character.y>=secondRect.y)?second:first;
      target.characters.push({...clone(character),id:uid('char')});
    }
    currentPage().panels.splice(index,1,first,second);
    selectedPanelId=first.id;
    selectedCharacterId=first.characters[0]?.id||null;
    selectedBalloonId=null;
    renumberPanels();
  });
}

function applyTemplate(name){
  if(!templates[name])return;
  if(currentPage().panels.some(panel=>panel.characters.length||panel.balloons.length)&&!confirm('テンプレート変更で現在の配置をリセットします。続行しますか？'))return;
  mutate(()=>{
    const workId=project.meta.workId,title=project.meta.title;
    project=createProjectWithIdentity(name,workId);
    project.meta.title=title;
    selectedPageId=project.pages[0].id;
    selectedPanelId=project.pages[0].panels[0].id;
    selectedCharacterId=null;
    selectedBalloonId=null;
  });
}

function deletePanel(){
  const panel=selectedPanel();
  if(!panel||currentPage().panels.length<=1)return alert('最後の1コマは削除できません。');
  mutate(()=>{
    currentPage().panels=currentPage().panels.filter(candidate=>candidate.id!==panel.id);
    renumberPanels();
    selectedPanelId=currentPage().panels[0]?.id||null;
    selectedCharacterId=null;
    selectedBalloonId=null;
  });
}
