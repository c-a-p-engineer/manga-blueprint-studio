let persistenceReady=false;

const save=()=>{
  if(!persistenceReady)return;
  const workId=project.meta.workId;
  $('saveStatus').textContent='saving…';
  queueProjectSave(project,{
    onSaved:savedWorkId=>{
      if(savedWorkId===workId&&project.meta.workId===workId){
        $('saveStatus').textContent=`saved ${new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}`;
      }
    },
    onError:error=>{
      console.warn('Project autosave failed.',error);
      if(project.meta.workId===workId)$('saveStatus').textContent='save failed';
    }
  });
};

async function initializeEditorState(){
  let loaded=null;
  let canPersist=false;
  if(projectStorage.supported()){
    try{
      loaded=await projectStorage.loadActive();
      canPersist=true;
    }catch(error){
      console.warn('Project storage initialization failed.',error);
    }
  }
  project=loaded?ensureProjectIdentity(loaded):createProjectWithIdentity();
  selectedPageId=project.pages[0]?.id||null;
  selectedPanelId=currentPage()?.panels[0]?.id||null;
  selectedCharacterId=null;
  selectedBalloonId=null;
  resetEditorHistory();
  persistenceReady=canPersist;
  render();
  if(!persistenceReady)$('saveStatus').textContent='autosave unavailable';
}
