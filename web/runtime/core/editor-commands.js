let history=[];
let future=[];

const snapshot=()=>JSON.stringify(project);

function pushHistory(){
  const state=snapshot();
  if(history.at(-1)!==state)history.push(state);
  if(history.length>HISTORY_LIMIT)history.shift();
  future=[];
}

function restore(state){
  project=ensureProjectIdentity(JSON.parse(state));
  if(!project.pages.some(page=>page.id===selectedPageId))selectedPageId=project.pages[0]?.id||null;
  const panels=currentPage()?.panels||[];
  if(!panels.some(panel=>panel.id===selectedPanelId))selectedPanelId=panels[0]?.id||null;
  selectedCharacterId=null;
  selectedBalloonId=null;
  render();
}

function undo(){
  if(!history.length)return;
  future.push(snapshot());
  restore(history.pop());
}

function redo(){
  if(!future.length)return;
  history.push(snapshot());
  restore(future.pop());
}

function mutate(fn){
  pushHistory();
  fn();
  render();
}

function resetEditorHistory(){
  history=[];
  future=[];
}
