const PAGE_W = 800;
const PAGE_H = 1130;
const GUTTER = 18;
const STORAGE_KEY = 'manga-blueprint-studio/0.1';

const posePresets = {
  stand: { label: '立つ / Stand', description: 'neutral standing pose, balanced weight, torso upright, arms relaxed', joints: { head:[0,-72], neck:[0,-48], shoulderL:[-28,-40], shoulderR:[28,-40], elbowL:[-35,-5], elbowR:[35,-5], handL:[-36,30], handR:[36,30], hip:[0,12], kneeL:[-18,55], kneeR:[18,55], footL:[-24,98], footR:[24,98] } },
  run: { label: '走る / Run', description: 'running stride, torso leaning forward, opposite arm and leg drive, clear forward momentum', joints: { head:[10,-68], neck:[4,-45], shoulderL:[-25,-34], shoulderR:[31,-38], elbowL:[-51,-8], elbowR:[50,-18], handL:[-25,18], handR:[23,-5], hip:[0,13], kneeL:[-45,50], kneeR:[43,49], footL:[-74,72], footR:[22,96] } },
  jump: { label: '飛ぶ / Jump', description: 'airborne jump pose, no ground support, knees bent, arms spread for balance, upward dynamic silhouette', joints: { head:[0,-70], neck:[0,-46], shoulderL:[-28,-37], shoulderR:[28,-37], elbowL:[-57,-60], elbowR:[57,-60], handL:[-78,-38], handR:[78,-38], hip:[0,13], kneeL:[-42,45], kneeR:[42,45], footL:[-13,76], footR:[13,76] } },
  crouch: { label: 'しゃがむ / Crouch', description: 'low crouching pose, center of gravity lowered, knees deeply bent, compact silhouette', joints: { head:[8,-42], neck:[3,-20], shoulderL:[-25,-12], shoulderR:[29,-14], elbowL:[-40,12], elbowR:[41,8], handL:[-20,30], handR:[22,29], hip:[0,28], kneeL:[-42,50], kneeR:[41,50], footL:[-63,73], footR:[62,73] } },
  punch: { label: '右ストレート / Punch', description: 'committed right straight punch, weight driven forward, right shoulder rotated forward, punching arm extended, other hand guarding', joints: { head:[-5,-66], neck:[0,-44], shoulderL:[-30,-37], shoulderR:[30,-34], elbowL:[-42,-3], elbowR:[75,-30], handL:[-15,-7], handR:[124,-27], hip:[0,15], kneeL:[-35,55], kneeR:[40,60], footL:[-48,95], footR:[70,90] } },
  lookback: { label: '振り向く / Look back', description: 'body oriented away while upper torso and head turn back toward the viewer, asymmetric shoulder and pelvis relation', joints: { head:[20,-70], neck:[4,-47], shoulderL:[-32,-38], shoulderR:[26,-32], elbowL:[-36,-2], elbowR:[31,4], handL:[-24,30], handR:[17,35], hip:[-4,14], kneeL:[-22,57], kneeR:[15,58], footL:[-34,98], footR:[22,98] } }
};

const templates = {
  action3: [{ x:35,y:35,w:355,h:350 },{ x:410,y:35,w:355,h:350 },{ x:35,y:405,w:730,h:690 }],
  four: [{ x:35,y:35,w:355,h:520 },{ x:410,y:35,w:355,h:520 },{ x:35,y:575,w:355,h:520 },{ x:410,y:575,w:355,h:520 }],
  single: [{ x:35,y:35,w:730,h:1060 }]
};

const $ = id => document.getElementById(id);
const svg = $('blueprintSvg');
let drag = null;

function uid(prefix){ return `${prefix}_${Math.random().toString(36).slice(2,8)}${Date.now().toString(36).slice(-4)}`; }
function defaultCamera(){ return { distance:'medium', angle:'eye-level', focus:'' }; }
function makePanel(rect,order){ return { id:uid('panel'), order, rect:{...rect}, camera:defaultCamera(), characters:[] }; }
function makeProject(template='action3'){ return { format:'manga-blueprint/0.1', meta:{ title:'Untitled Manga Blueprint', readingDirection:'rtl', pageWidth:PAGE_W, pageHeight:PAGE_H }, pages:[{ id:'page_1', panels:templates[template].map((r,i)=>makePanel(r,i+1)) }] }; }

let project = loadAutosave() || makeProject('action3');
let selectedPanelId = project.pages[0].panels[0]?.id || null;
let selectedCharacterId = null;

function currentPage(){ return project.pages[0]; }
function selectedPanel(){ return currentPage().panels.find(p=>p.id===selectedPanelId) || null; }
function selectedCharacter(){ const p=selectedPanel(); return p?.characters.find(c=>c.id===selectedCharacterId) || null; }
function loadAutosave(){ try{ const raw=localStorage.getItem(STORAGE_KEY); if(!raw)return null; const parsed=JSON.parse(raw); return parsed?.format==='manga-blueprint/0.1'?parsed:null; }catch{return null;} }
function save(){ localStorage.setItem(STORAGE_KEY,JSON.stringify(project)); $('saveStatus').textContent=`saved ${new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}`; }
function escapeXml(value=''){ return String(value).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[m])); }
function line(a,b,cls='stick'){ return `<line class="${cls}" x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" />`; }

function characterSvg(ch,panel){
  const pose=posePresets[ch.poseId]||posePresets.stand; const j=pose.joints; const selected=ch.id===selectedCharacterId; const labelWidth=Math.max(80,ch.name.length*18+22); const transform=`translate(${ch.x} ${ch.y}) rotate(${ch.rotation}) scale(${ch.scale})`;
  return `<g class="character-group ${selected?'stick-selected':''}" data-char-id="${escapeXml(ch.id)}" data-panel-id="${escapeXml(panel.id)}" transform="${transform}" tabindex="0" role="button" aria-label="${escapeXml(ch.name)} ${escapeXml(pose.label)}">${line(j.neck,j.shoulderL)}${line(j.neck,j.shoulderR)}${line(j.shoulderL,j.elbowL)}${line(j.elbowL,j.handL)}${line(j.shoulderR,j.elbowR)}${line(j.elbowR,j.handR)}${line(j.neck,j.hip)}${line(j.hip,j.kneeL)}${line(j.kneeL,j.footL)}${line(j.hip,j.kneeR)}${line(j.kneeR,j.footR)}<circle class="stick-head" cx="${j.head[0]}" cy="${j.head[1]}" r="22" /><g transform="translate(0 126) scale(${1/Math.max(ch.scale,.01)})"><rect class="character-label-bg" x="${-labelWidth/2}" y="-18" width="${labelWidth}" height="30" rx="8" /><text class="character-label" x="0" y="4">${escapeXml(ch.name)}</text></g></g>`;
}

function renderSvg(){
  const page=currentPage();
  const defs=page.panels.map(p=>`<clipPath id="clip_${p.id}"><rect x="${p.rect.x}" y="${p.rect.y}" width="${p.rect.w}" height="${p.rect.h}" /></clipPath>`).join('');
  const body=page.panels.map(p=>{ const r=p.rect; const cameraText=`${p.camera.distance} · ${p.camera.angle}`; return `<g data-panel="${p.id}"><rect class="panel-outline ${p.id===selectedPanelId?'selected':''}" x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" /><rect class="panel-hit" data-panel-hit="${p.id}" x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" /><g clip-path="url(#clip_${p.id})">${p.characters.length?p.characters.map(ch=>characterSvg(ch,p)).join(''):`<text class="empty-note" x="${r.x+r.w/2}" y="${r.y+r.h/2}">tap panel → add character</text>`}</g><rect class="panel-number-bg" x="${r.x+r.w-43}" y="${r.y+12}" width="30" height="30" rx="15" /><text class="panel-number" x="${r.x+r.w-28}" y="${r.y+27}">${p.order}</text><text class="camera-label" x="${r.x+14}" y="${r.y+27}">${escapeXml(cameraText)}</text></g>`; }).join('');
  svg.innerHTML=`<defs>${defs}</defs><rect width="800" height="1130" fill="#fff" />${body}`;
}

function renderUi(){
  renderSvg(); const p=selectedPanel();
  $('panelStatus').textContent=p?`Panel ${p.order} / ${p.characters.length} character(s)`:'コマを選択してください。';
  $('cameraDistance').disabled=!p; $('cameraAngle').disabled=!p; $('cameraFocus').disabled=!p;
  if(p){ $('cameraDistance').value=p.camera.distance; $('cameraAngle').value=p.camera.angle; $('cameraFocus').value=p.camera.focus||''; }
  $('characterList').innerHTML=p?p.characters.map(ch=>`<button data-list-char="${escapeXml(ch.id)}" class="${ch.id===selectedCharacterId?'active':''}">${escapeXml(ch.name)} — ${escapeXml(posePresets[ch.poseId]?.label||ch.poseId)}</button>`).join(''):'';
  const ch=selectedCharacter(); $('noCharacter').hidden=!!ch; $('characterInspector').hidden=!ch;
  if(ch){ $('characterName').value=ch.name; $('characterId').value=ch.characterId; $('referenceKey').value=ch.referenceKey||''; $('poseSelect').value=ch.poseId; $('characterScale').value=ch.scale; $('characterRotation').value=ch.rotation; $('scaleOut').value=`${Number(ch.scale).toFixed(2)}×`; $('rotationOut').value=`${ch.rotation}°`; }
  $('promptOutput').value=compilePrompt(); save();
}

function addCharacter(){
  const p=selectedPanel(); if(!p)return; const index=p.characters.length+1; const name=`Character ${index}`;
  const ch={ id:uid('char'), characterId:name.toLowerCase().replace(/\s+/g,'-'), name, referenceKey:'', x:p.rect.x+p.rect.w/2, y:p.rect.y+p.rect.h/2, scale:Math.min(1.15,Math.max(.7,p.rect.h/500)), rotation:0, poseId:'stand' };
  p.characters.push(ch); selectedCharacterId=ch.id; renderUi();
}

function renumberPanels(){
  const panels=[...currentPage().panels]; panels.sort((a,b)=>{ const rowThreshold=80; if(Math.abs(a.rect.y-b.rect.y)>rowThreshold)return a.rect.y-b.rect.y; return project.meta.readingDirection==='rtl'?b.rect.x-a.rect.x:a.rect.x-b.rect.x; }); panels.forEach((p,i)=>p.order=i+1);
}

function splitPanel(axis){
  const p=selectedPanel(); if(!p)return; const idx=currentPage().panels.findIndex(x=>x.id===p.id); if(idx<0)return; const minSize=150; let r1,r2;
  if(axis==='vertical'){ if(p.rect.w<minSize*2+GUTTER)return alert('このコマはこれ以上左右分割できません。'); const w=(p.rect.w-GUTTER)/2; r1={x:p.rect.x,y:p.rect.y,w,h:p.rect.h}; r2={x:p.rect.x+w+GUTTER,y:p.rect.y,w,h:p.rect.h}; }
  else { if(p.rect.h<minSize*2+GUTTER)return alert('このコマはこれ以上上下分割できません。'); const h=(p.rect.h-GUTTER)/2; r1={x:p.rect.x,y:p.rect.y,w:p.rect.w,h}; r2={x:p.rect.x,y:p.rect.y+h+GUTTER,w:p.rect.w,h}; }
  const first=makePanel(r1,p.order); const second=makePanel(r2,p.order+1); first.camera=structuredClone(p.camera); first.characters=p.characters.map(c=>({...structuredClone(c),id:uid('char'),x:Math.min(r1.x+r1.w-50,Math.max(r1.x+50,c.x)),y:Math.min(r1.y+r1.h-60,Math.max(r1.y+60,c.y))})); currentPage().panels.splice(idx,1,first,second); selectedPanelId=first.id; selectedCharacterId=first.characters[0]?.id||null; renumberPanels(); renderUi();
}

function applyTemplate(name){
  if(!templates[name])return; if(currentPage().panels.some(p=>p.characters.length)&&!confirm('テンプレート変更で現在のコマとキャラ配置をリセットします。続行しますか？'))return; project=makeProject(name); selectedPanelId=project.pages[0].panels[0].id; selectedCharacterId=null; renderUi();
}

function compilePrompt(){
  const panels=[...currentPage().panels].sort((a,b)=>a.order-b.order);
  const lines=['Create a manga page using the attached Manga Blueprint image as the spatial/layout reference.','','IMPORTANT REFERENCE RULES:','- Panel numbers in the blueprint are reference markers only. Do NOT draw those numbers in the final manga.','- Stick figures are pose/position references only. Do NOT copy their appearance.','- Use the separately attached Character Sheets for identity, face, hair, body, and clothing.','- Preserve panel boundaries, character assignment, pose intent, and camera intent unless an instruction explicitly allows variation.',`- Reading direction: ${project.meta.readingDirection==='rtl'?'Japanese manga, right-to-left, top-to-bottom.':'left-to-right, top-to-bottom.'}`,'',`PAGE: ${project.meta.title}`,`Canvas intent: ${project.meta.pageWidth} x ${project.meta.pageHeight} blueprint coordinates.`,''];
  for(const p of panels){ lines.push(`PANEL ${p.order}:`); lines.push(`- Camera: ${p.camera.distance}, ${p.camera.angle}${p.camera.focus?`; focus/composition: ${p.camera.focus}`:''}.`); if(!p.characters.length)lines.push('- Characters: none placed in blueprint.'); else for(const ch of p.characters){ const pose=posePresets[ch.poseId]||posePresets.stand; lines.push(`- ${ch.name} [characterId=${ch.characterId}${ch.referenceKey?`, sheet=${ch.referenceKey}`:''}]: ${pose.description}. Approximate placement x=${Math.round(ch.x)}, y=${Math.round(ch.y)}, scale=${Number(ch.scale).toFixed(2)}, rotation=${ch.rotation}°.`); } lines.push(''); }
  lines.push('Treat the blueprint image and this prompt as one contract: image = spatial intent, text = semantic intent, Character Sheets = visual identity.'); return lines.join('\n');
}

function downloadBlob(blob,filename){ const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=filename; a.click(); setTimeout(()=>URL.revokeObjectURL(url),1000); }
function exportJson(){ downloadBlob(new Blob([JSON.stringify(project,null,2)],{type:'application/json'}),'project.manga.json'); }

async function exportPng(){
  const clone=svg.cloneNode(true); clone.setAttribute('xmlns','http://www.w3.org/2000/svg'); clone.querySelectorAll('.panel-outline.selected').forEach(el=>el.classList.remove('selected')); clone.querySelectorAll('.stick-selected').forEach(el=>el.classList.remove('stick-selected'));
  const cssText=[...document.styleSheets].flatMap(sheet=>{ try{return [...sheet.cssRules].map(r=>r.cssText);}catch{return[];} }).join('\n'); const style=document.createElementNS('http://www.w3.org/2000/svg','style'); style.textContent=cssText; clone.prepend(style); const source=new XMLSerializer().serializeToString(clone); const blob=new Blob([source],{type:'image/svg+xml;charset=utf-8'}); const url=URL.createObjectURL(blob); const img=new Image();
  img.onload=()=>{ const canvas=document.createElement('canvas'); canvas.width=1200; canvas.height=Math.round(1200*PAGE_H/PAGE_W); const ctx=canvas.getContext('2d'); ctx.fillStyle='#fff'; ctx.fillRect(0,0,canvas.width,canvas.height); ctx.drawImage(img,0,0,canvas.width,canvas.height); URL.revokeObjectURL(url); canvas.toBlob(png=>downloadBlob(png,'manga-blueprint.png'),'image/png'); }; img.onerror=()=>{URL.revokeObjectURL(url);alert('PNG export failed.');}; img.src=url;
}

function importJson(file){
  const reader=new FileReader(); reader.onload=()=>{ try{ const parsed=JSON.parse(reader.result); if(parsed?.format!=='manga-blueprint/0.1'||!Array.isArray(parsed.pages)||!parsed.pages[0]?.panels)throw new Error('Unsupported blueprint format'); project=parsed; selectedPanelId=currentPage().panels[0]?.id||null; selectedCharacterId=null; renderUi(); }catch(error){ alert(`JSONを読み込めませんでした: ${error.message}`); } }; reader.readAsText(file);
}

function svgPointFromEvent(event){ const rect=svg.getBoundingClientRect(); return { x:(event.clientX-rect.left)*PAGE_W/rect.width, y:(event.clientY-rect.top)*PAGE_H/rect.height }; }

svg.addEventListener('pointerdown',event=>{ const charEl=event.target.closest('[data-char-id]'); if(charEl){ selectedPanelId=charEl.dataset.panelId; selectedCharacterId=charEl.dataset.charId; const ch=selectedCharacter(); const point=svgPointFromEvent(event); drag={charId:ch.id,panelId:selectedPanelId,dx:point.x-ch.x,dy:point.y-ch.y}; svg.setPointerCapture(event.pointerId); renderUi(); event.stopPropagation(); return; } const hit=event.target.closest('[data-panel-hit]'); if(hit){ selectedPanelId=hit.dataset.panelHit; selectedCharacterId=null; renderUi(); } });
svg.addEventListener('pointermove',event=>{ if(!drag)return; const p=selectedPanel(); const ch=selectedCharacter(); if(!p||!ch||ch.id!==drag.charId)return; const point=svgPointFromEvent(event); ch.x=Math.max(p.rect.x+25,Math.min(p.rect.x+p.rect.w-25,point.x-drag.dx)); ch.y=Math.max(p.rect.y+50,Math.min(p.rect.y+p.rect.h-70,point.y-drag.dy)); renderUi(); });
svg.addEventListener('pointerup',event=>{ if(drag){ drag=null; try{svg.releasePointerCapture(event.pointerId);}catch{} } });

$('poseSelect').innerHTML=Object.entries(posePresets).map(([id,p])=>`<option value="${id}">${p.label}</option>`).join('');
$('templateSelect').addEventListener('change',e=>applyTemplate(e.target.value));
$('splitVertical').addEventListener('click',()=>splitPanel('vertical'));
$('splitHorizontal').addEventListener('click',()=>splitPanel('horizontal'));
$('renumber').addEventListener('click',()=>{renumberPanels();renderUi();});
$('addCharacter').addEventListener('click',addCharacter);
$('cameraDistance').addEventListener('change',e=>{const p=selectedPanel();if(p){p.camera.distance=e.target.value;renderUi();}});
$('cameraAngle').addEventListener('change',e=>{const p=selectedPanel();if(p){p.camera.angle=e.target.value;renderUi();}});
$('cameraFocus').addEventListener('input',e=>{const p=selectedPanel();if(p){p.camera.focus=e.target.value;$('promptOutput').value=compilePrompt();save();}});
$('characterList').addEventListener('click',e=>{const btn=e.target.closest('[data-list-char]');if(btn){selectedCharacterId=btn.dataset.listChar;renderUi();}});
$('characterName').addEventListener('input',e=>{const c=selectedCharacter();if(c){c.name=e.target.value||'Character';renderUi();}});
$('characterId').addEventListener('input',e=>{const c=selectedCharacter();if(c){c.characterId=e.target.value||c.id;$('promptOutput').value=compilePrompt();save();}});
$('referenceKey').addEventListener('input',e=>{const c=selectedCharacter();if(c){c.referenceKey=e.target.value;$('promptOutput').value=compilePrompt();save();}});
$('poseSelect').addEventListener('change',e=>{const c=selectedCharacter();if(c){c.poseId=e.target.value;renderUi();}});
$('characterScale').addEventListener('input',e=>{const c=selectedCharacter();if(c){c.scale=Number(e.target.value);renderUi();}});
$('characterRotation').addEventListener('input',e=>{const c=selectedCharacter();if(c){c.rotation=Number(e.target.value);renderUi();}});
$('deleteCharacter').addEventListener('click',()=>{const p=selectedPanel();if(!p||!selectedCharacterId)return;p.characters=p.characters.filter(c=>c.id!==selectedCharacterId);selectedCharacterId=null;renderUi();});
$('exportJson').addEventListener('click',exportJson);
$('exportPng').addEventListener('click',exportPng);
$('importJson').addEventListener('change',e=>{const f=e.target.files?.[0];if(f)importJson(f);e.target.value='';});
$('copyPrompt').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(compilePrompt());$('copyPrompt').textContent='コピー済み';setTimeout(()=>$('copyPrompt').textContent='コピー',1200);}catch{alert('クリップボードへコピーできませんでした。');}});

renderUi();
