// Continuity Graph v1: deterministic cross-panel/page state and advisory diagnostics.
const lower=v=>String(v||'').toLowerCase();
const side=(c,p)=>c.x<(p.rect.x+p.rect.w/2)?'left':'right';
const sameScene=(a,b)=>!a||!b||!a.sceneId||!b.sceneId||a.sceneId===b.sceneId;

function baseFor(project,c){
  return(project.characterLibrary||[]).find(x=>x.characterId===c.characterId||x.referenceKey&&x.referenceKey===c.referenceKey)||null;
}

export function resolveCharacterContinuity(project){
  const lastByCharacter=new Map();
  for(const page of[...(project.pages||[])].sort((a,b)=>(a.order||a.pageNumber||0)-(b.order||b.pageNumber||0))){
    for(const panel of[...(page.panels||[])].sort((a,b)=>(a.order||0)-(b.order||0))){
      for(const c of panel.characters||[]){
        const base=baseFor(project,c),previous=lastByCharacter.get(c.characterId)||{};
        const authored=c.continuityState||{};
        const outfitExplicit=!!authored.outfit&&!['base','inherited'].includes(authored.outfitSource);
        const conditionExplicit=!!authored.condition&&!['base','inherited'].includes(authored.conditionSource);
        const baseOutfit=base?.appearance?.outfit||'';
        const outfit=outfitExplicit?authored.outfit:(previous.outfit||baseOutfit||authored.outfit||'');
        const condition=conditionExplicit?authored.condition:(previous.condition||authored.condition||'');
        const outfitSource=outfitExplicit?'explicit':previous.outfit?'inherited':outfit?'base':'';
        const conditionSource=conditionExplicit?'explicit':previous.condition?'inherited':condition?'base':'';
        c.continuityState={...authored,outfit,condition,outfitSource,conditionSource};
        lastByCharacter.set(c.characterId,{outfit,condition});
      }
    }
  }
  return project;
}

function eventFor(project,page,panel,c){
  const base=baseFor(project,c),props=(c.renderPose?.props||[]).map(p=>({kind:p.kind,hand:p.hand||''}));
  return{
    id:`${page.id}:${panel.id}:${c.id}`,
    pageId:page.id,
    pageNumber:page.pageNumber,
    panelId:panel.id,
    panelOrder:panel.order,
    characterId:c.characterId,
    name:c.name,
    sceneId:panel.background?.sceneId||panel.background?.location||'',
    side:side(c,panel),
    facing:c.renderPose?.facing??null,
    gaze:c.gaze?.target||'',
    movement:panel.motionDirection||c.motionPhase||'',
    props,
    outfit:c.continuityState?.outfit||base?.appearance?.outfit||'',
    outfitSource:c.continuityState?.outfitSource||'',
    condition:c.continuityState?.condition||'',
    conditionSource:c.continuityState?.conditionSource||'',
    intentionalBreak:!!panel.continuity?.break,
    breakReason:panel.continuity?.reason||''
  };
}

function crossingSignal(a,b){
  const text=lower(`${a.movement} ${b.movement}`);
  return/cross|turn|reverse|回り込|横切|振り向|反転|入れ替/.test(text);
}

function compare(a,b){
  const issues=[];
  if(a.intentionalBreak||b.intentionalBreak||!sameScene(a,b))return issues;
  if(a.side!==b.side&&a.facing!=null&&b.facing!=null&&a.facing!==b.facing&&!crossingSignal(a,b)){
    issues.push({type:'screen-side-inversion',severity:'review',characterId:b.characterId,from:a.id,to:b.id,evidence:{side:[a.side,b.side],facing:[a.facing,b.facing]}});
  }
  for(const pa of a.props){
    const pb=b.props.find(p=>p.kind===pa.kind);
    if(pb&&pa.hand&&pb.hand&&pa.hand!==pb.hand&&!crossingSignal(a,b)){
      issues.push({type:'prop-hand-switch',severity:'review',characterId:b.characterId,from:a.id,to:b.id,evidence:{prop:pa.kind,hand:[pa.hand,pb.hand]}});
    }
  }
  if(a.outfit&&b.outfit&&a.outfit!==b.outfit&&b.outfitSource!=='explicit'){
    issues.push({type:'outfit-state-change',severity:'review',characterId:b.characterId,from:a.id,to:b.id,evidence:{from:a.outfit,to:b.outfit,source:b.outfitSource||'unknown'}});
  }
  if(a.condition&&b.condition&&a.condition!==b.condition&&b.conditionSource!=='explicit'&&!/change|damage|heal|変化|負傷|回復/.test(lower(b.condition))){
    issues.push({type:'condition-state-change',severity:'review',characterId:b.characterId,from:a.id,to:b.id,evidence:{from:a.condition,to:b.condition,source:b.conditionSource||'unknown'}});
  }
  return issues;
}

export function buildContinuityGraph(project){
  const nodes=[],edges=[],issues=[],lastByCharacter=new Map();
  for(const page of[...(project.pages||[])].sort((a,b)=>(a.order||a.pageNumber||0)-(b.order||b.pageNumber||0))){
    for(const panel of[...(page.panels||[])].sort((a,b)=>(a.order||0)-(b.order||0))){
      for(const c of panel.characters||[]){
        const event=eventFor(project,page,panel,c),prev=lastByCharacter.get(c.characterId);
        nodes.push(event);
        if(prev){
          const edgeIssues=compare(prev,event);
          edges.push({from:prev.id,to:event.id,characterId:c.characterId,intentionalBreak:event.intentionalBreak,issues:edgeIssues.map(x=>x.type)});
          issues.push(...edgeIssues);
        }
        lastByCharacter.set(c.characterId,event);
      }
    }
  }
  return{
    schema:'manga-blueprint-continuity-graph/1',
    nodes,
    edges,
    issues,
    summary:{characters:new Set(nodes.map(x=>x.characterId)).size,nodes:nodes.length,edges:edges.length,issues:issues.length}
  };
}

export function applyContinuityGraph(project){
  resolveCharacterContinuity(project);
  const graph=buildContinuityGraph(project);
  project.meta.continuityGraph=graph;
  for(const page of project.pages||[]){
    const ids=new Set((page.panels||[]).map(p=>p.id));
    page.continuityIssues=graph.issues.filter(issue=>{
      const from=graph.nodes.find(n=>n.id===issue.from),to=graph.nodes.find(n=>n.id===issue.to);
      return ids.has(from?.panelId)||ids.has(to?.panelId);
    });
  }
  return project;
}
