const q=v=>JSON.stringify(String(v));
const baseFor=(project,c)=>(project.characterLibrary||[]).find(x=>x.characterId===c.characterId||x.referenceKey&&x.referenceKey===c.referenceKey)||null;
const speakerName=(project,panel,speakerId)=>{
  if(!speakerId)return'(no in-panel speaker)';
  const cast=(panel.characters||[]).find(c=>c.characterId===speakerId||c.id===speakerId);
  return cast?.name||(project.characterLibrary||[]).find(c=>c.characterId===speakerId)?.name||'(speaker unresolved)';
};
function characterStateLines(project,c){
  const base=baseFor(project,c),appearance=base?.appearance||{},state=c.continuityState||{},outfit=state.outfit||appearance.outfit||'',lines=[];
  const identity=[appearance.hair&&`hair=${q(appearance.hair)}`,appearance.eyes&&`eyes=${q(appearance.eyes)}`,appearance.features&&`features=${q(appearance.features)}`].filter(Boolean);
  if(identity.length)lines.push(`CHARACTER IDENTITY: ${c.name}: ${identity.join('; ')}`);
  if(outfit){
    lines.push(`CHARACTER OUTFIT: ${c.name}: ${q(outfit)} (source=${state.outfitSource||'base'})`);
    lines.push(state.outfitSource==='explicit'
      ?`OUTFIT TRANSITION: ${c.name}: this panel explicitly sets the resolved outfit above; carry this exact outfit forward until another explicit outfit state.`
      :`OUTFIT CONTINUITY: ${c.name}: preserve the exact resolved outfit above from the previous state; do not add, remove, recolor, or redesign clothing items.`);
  }
  if(state.condition)lines.push(`CHARACTER CONDITION: ${c.name}: ${q(state.condition)} (source=${state.conditionSource||'inherited'})`);
  return lines;
}
export function buildExecutablePrompt(project,pageIndex=0){
  const page=project.pages[pageIndex],text=page.panels.flatMap(p=>[...p.balloons.map(b=>b.text),...(p.effects.sfxText?[p.effects.sfxText]:[])]);
  const lettering=project.meta?.letteringStrategy||'overlay-preferred';
  const lines=[
    '# Executable Manga Generation Brief',
    `Work: ${project.meta.title}`,
    `Page: P${String(page.pageNumber).padStart(3,'0')}`,
    `Reading: ${project.meta.readingDirection}`,
    `Writing: ${project.meta.defaultWritingMode||'vertical-rl'}`,
    `Lettering strategy: ${lettering}`,
    '',
    '## INPUT AUTHORITY',
    '- Pxxx.clean.svg/png is the spatial composition contract.',
    '- work.manga.json is the semantic authority.',
    '- Preserve panel geometry, character placement, solved pose silhouette, weapon/contact location and reading flow.',
    '- Do not reproduce labels from the annotated blueprint.',
    '- Pxxx.lettering.svg/json is the deterministic lettering authority when present.',
    '- The numbered BALLOON entries below preserve the authored balloon sequence and speakerId. Do not swap speech tails or reverse dialogue to fit the artwork.',
    '- Character Sheet / authored appearance guidance sets named-character facial and body identity. Attach required identity images as actual image inputs, not just filenames.',
    '- A style-only reference defines line, palette, shading and finish ONLY; never copy its face, hair, eyes, body, clothing, pose or cast into another character.',
    '- A pose or spatial reference guides position/contact ONLY; it cannot replace character identity.',
    '- Canonical scene and continuity state controls current outfit/condition; do not borrow them from unrelated sample art.',
    lettering==='overlay-only'
      ?'- Do not draw dialogue/SFX glyphs into generated art; leave authored lettering regions clear for overlay.'
      :'- If the model renders text, only exact allowlisted strings are permitted; deterministic overlay may replace model text.',
    '',
    '## TEXT TO RENDER',
    ...(text.length?text.map(t=>`- ${q(t)}`):['- (none)']),
    ''
  ];
  for(const p of page.panels){
    lines.push(
      `## Panel ${p.order}`,
      `ACTION: ${p.actionIntent}`,
      `CAMERA: ${p.camera.distance}, ${p.camera.angle}, ${p.camera.viewpoint}`,
      `BACKGROUND: ${p.background.location||'(unspecified)'} ${p.background.timeOfDay||''}`.trim(),
      `ENERGY: ${Number(p.importance?.energy??.5).toFixed(2)}`
    );
    if(p.attention?.primary)lines.push(`PRIMARY ATTENTION: ${p.attention.primary}`);
    if(p.flow?.entry||p.flow?.exit)lines.push(`READING FLOW: ${p.flow?.entry||'auto'} -> ${p.flow?.exit||'auto'}`);
    const frame=[];
    if(p.shape?.preset)frame.push(`shape=${p.shape.preset}`);
    if(p.frameCoupling)frame.push(`gutter-coupling=${p.frameCoupling.mode}; side=${p.frameCoupling.side}; gutter=${p.frameCoupling.gutter}; paired-panel=${p.frameCoupling.neighborPanelId||p.frameCoupling.sourcePanelId}`);
    if(p.inset?.kind)frame.push(`inset=${p.inset.kind}:${p.inset.anchor||'auto'}:${p.inset.size||'auto'}`);
    if(p.style?.bleed&&p.style.bleed!=='none')frame.push(`bleed=${p.style.bleed}`);
    if(p.style?.breakout&&p.style.breakout!=='none')frame.push(`breakout=${p.style.breakout}`);
    if(frame.length)lines.push(`FRAME DIRECTION: ${frame.join('; ')}`);
    lines.push(`CAST: ${p.characters.map(c=>`${c.name} [pose=${c.poseId}; expression=${c.expression.type}; gaze=${c.gaze?.target||'auto'}; support=${c.supportState}; motion=${c.motionPhase}; depth=${c.depthOrder??0}; detail=${c.detailLevel||'medium'}]`).join(', ')||'(none)'}`);
    // Per-balloon speaker/tail mapping is a generation constraint, not visible manga text.
    // Do not infer the speaker from the balloon's proximity to another character.
    for(const [index,balloon] of (p.balloons||[]).entries()){
      const speakerId=balloon.speakerId||'';
      const name=speakerName(project,p,speakerId);
      const hasTail=['speech','shout','whisper','thought'].includes(balloon.type);
      lines.push(`BALLOON ${index+1}: text=${q(balloon.text)}; speaker=${q(name)}; speakerId=${q(speakerId)}; center=(${Math.round(balloon.x)},${Math.round(balloon.y)}); ${hasTail?(speakerId?'tail must point to that speaker, not the listener':'speaker unresolved: do not invent a tail target'):'no in-panel speaker tail required'}; preserve this balloon order in ${project.meta.readingDirection||'rtl'} reading.`);
    }
    for(const c of p.characters)lines.push(...characterStateLines(project,c));
    if(p.detailBudget)lines.push(`DETAIL/SALIENCE: crowd=${p.detailBudget.crowd||'low'}; background=${p.detailBudget.background||'medium'}; characters=${Object.entries(p.detailBudget.characters||{}).map(([k,v])=>`${k}:${v}`).join(', ')||'derived'}`);
    if(['low','silhouette','none'].includes(p.detailBudget?.crowd))lines.push('CROWD RULE: background extras are simplified; omit eye detail and nonessential facial features.');
    if(p.compositionPlan?.negativeSpace)lines.push(`NEGATIVE SPACE: preserve derived region x=${Math.round(p.compositionPlan.negativeSpace.x)}, y=${Math.round(p.compositionPlan.negativeSpace.y)}, w=${Math.round(p.compositionPlan.negativeSpace.w)}, h=${Math.round(p.compositionPlan.negativeSpace.h)}`);
    if(p.continuity?.break)lines.push(`CONTINUITY: intentional break/cut — ${p.continuity.reason||'authored'}`);
    for(const x of p.interactions||[])lines.push(`CONTACT: ${x.intent||`${x.source?.character}.${x.source?.part} > ${x.target?.character}.${x.target?.part}`}`);
    lines.push(`EFFECT: ${p.effects.lineEffect}${p.effects.sfxText?`; SFX ${q(p.effects.sfxText)}`:''}`,'');
  }
  const continuity=(project.meta?.continuityGraph?.issues||[]).filter(issue=>{
    const ids=new Set((page.panels||[]).map(p=>p.id));
    const nodes=project.meta?.continuityGraph?.nodes||[],from=nodes.find(n=>n.id===issue.from),to=nodes.find(n=>n.id===issue.to);
    return ids.has(from?.panelId)||ids.has(to?.panelId);
  });
  if(continuity.length){
    lines.push('## CONTINUITY REVIEW');
    for(const issue of continuity)lines.push(`- ${issue.type}: ${issue.characterId||''}`);
    lines.push('');
  }
  return lines.join('\n');
}
