import {buildReaderFlowPlan,renderReaderFlowOverlaySvg} from '../core/review-flow.mjs';
import {renderExecutableNameSvg} from '../core/blueprint-renderer.mjs';
import {renderReviewFullPageSvg} from '../core/review-full.mjs';
import {buildContactSheetBatches,renderContactSheetSvg} from '../core/contact-sheet.mjs';

const p=(id,order,x,y)=>({id,order,rect:{x,y,w:300,h:200},actionIntent:'scene '+order,
  camera:{distance:'medium'},background:{location:'classroom'},
  importance:{energy:.5},attention:{primary:'hero.head'},
  style:{border:'normal'},effects:{sfxText:''},balloons:[],
  characters:[{id:id+'-hero',characterId:'hero',name:'hero',x:x+140,y:y+140,scale:1,gaze:{target:'hero.head'},
    renderPose:{joints:{head:{x:x+145,y:y+90},chest:{x:x+145,y:y+125},hip:{x:x+145,y:y+158}}}}]});
const project={
  meta:{title:'読順と視線',readingDirection:'rtl',pageWidth:780,pageHeight:600,defaultWritingMode:'vertical-rl'},
  characterLibrary:[{characterId:'hero',name:'hero',appearance:{outfit:'uniform'}}],
  pages:[{id:'page1',pageNumber:1,panels:[p('p1',1,450,35),p('p2',2,45,35),p('p3',3,450,310),p('p4',4,45,310)]}]
};
let count=0;
const verify=(x,msg)=>{if(!x)throw new Error(msg);count++};
const plan=buildReaderFlowPlan(project);
verify(plan.schema==='manga-reader-flow-plan/1'&&plan.nodes.length===4,'Four-panel flow plan');
verify(plan.links.length===3,'Transitions must be consecutive');
verify(plan.nodes.map(n=>n.order).join(',')==='1,2,3,4','Logical panel order');
verify(plan.readingDirection==='rtl'&&plan.nodes.every(n=>n.start.x>n.end.x),'Japanese RTL in-panel direction');
verify(plan.nodes.every(n=>n.source==='canonical-attention'&&n.focus),'Primary attention point used');
const clean=renderExecutableNameSvg(project,0,{annotated:false});
const annotated=renderExecutableNameSvg(project,0,{annotated:true});
const full=renderReviewFullPageSvg(project,0);
verify(!clean.includes('reader-flow')&&!clean.includes('arrow-review')&&!clean.includes('gaze'),'Clean must not receive human reader flow or gaze markers');
verify(annotated.includes('data-review="reader-flow"')&&annotated.includes('data-estimate="not-eye-tracking"'),'Annotated estimated reader path required');
verify(annotated.includes('data-review="gaze"'),'Existing character gaze guide preserved');
verify((annotated.match(/data-reader-flow-transition=/g)||[]).length===3,'Reader transition arrows');
verify(full.includes('data-review="reader-flow"')&&full.includes('data-review-full-panel="1"'),'Full Review includes arrows and sidecar');
const ltr=structuredClone(project);ltr.meta.readingDirection='ltr';
verify(buildReaderFlowPlan(ltr).nodes.every(n=>n.start.x<n.end.x),'LTR flow should reverse correctly');
const noFocus=structuredClone(project);noFocus.pages[0].panels[0].attention.primary='unknown.face';
verify(buildReaderFlowPlan(noFocus).nodes[0].source==='geometry-order-heuristic','Unknown attention must be explicitly heuristic');
verify(buildContactSheetBatches(8).map(b=>b.range).join(',')==='001-004,005-008','8P splits into two 4P sheets');
const subset={...project,pages:[project.pages[0]]};
verify(renderContactSheetSvg([renderExecutableNameSvg(subset,0,{annotated:true})],{pageNumbers:[8]}).includes('data-contact-sheet-page="P008"'),'Absolute source page code');
console.log('Reader flow regression passed:',count);
