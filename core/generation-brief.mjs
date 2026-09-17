const q=(v)=>JSON.stringify(String(v));
export function buildExecutablePrompt(project,pageIndex=0){
  const page=project.pages[pageIndex],text=page.panels.flatMap(p=>[...p.balloons.map(b=>b.text),...(p.effects.sfxText?[p.effects.sfxText]:[])]);
  const lines=['# Executable Manga Generation Brief',`Work: ${project.meta.title}`,`Page: P${String(page.pageNumber).padStart(3,'0')}`,`Reading: ${project.meta.readingDirection}`,'','## INPUT AUTHORITY','- Pxxx.clean.svg/png is the spatial composition contract.','- work.manga.json is the semantic authority.','- Preserve panel geometry, character placement, solved pose silhouette, weapon/contact location and reading flow.','- Do not reproduce labels from the annotated blueprint.','','## TEXT TO RENDER',...(text.length?text.map(t=>`- ${q(t)}`):['- (none)']),''];
  for(const p of page.panels){
    lines.push(`## Panel ${p.order}`,`ACTION: ${p.actionIntent}`,`CAMERA: ${p.camera.distance}, ${p.camera.angle}, ${p.camera.viewpoint}`,`BACKGROUND: ${p.background.location||'(unspecified)'} ${p.background.timeOfDay||''}`.trim(),`ENERGY: ${Number(p.importance?.energy??.5).toFixed(2)}`);
    if(p.attention?.primary)lines.push(`PRIMARY ATTENTION: ${p.attention.primary}`);
    if(p.flow?.entry||p.flow?.exit)lines.push(`READING FLOW: ${p.flow?.entry||'auto'} -> ${p.flow?.exit||'auto'}`);
    lines.push(`CAST: ${p.characters.map(c=>`${c.name} [pose=${c.poseId}; expression=${c.expression.type}; gaze=${c.gaze?.target||'auto'}; support=${c.supportState}; motion=${c.motionPhase}; depth=${c.depthOrder??0}]`).join(', ')||'(none)'}`);
    for(const x of p.interactions||[])lines.push(`CONTACT: ${x.intent||`${x.source?.character}.${x.source?.part} > ${x.target?.character}.${x.target?.part}`}`);
    lines.push(`EFFECT: ${p.effects.lineEffect}${p.effects.sfxText?`; SFX ${q(p.effects.sfxText)}`:''}`,'');
  }
  return lines.join('\n');
}
