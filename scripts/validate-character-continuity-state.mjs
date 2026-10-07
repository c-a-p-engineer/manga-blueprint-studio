import {compileMangaName} from '../core/manga-grammar.mjs';
import {buildExecutablePrompt} from '../core/generation-brief.mjs';
import {applyContinuityGraph} from '../core/continuity-graph.mjs';

const src=`# Page 1: continuity
コマ1: heroine stands in classroom
登場: heroine@right
状態: heroine> outfit=navy blazer worn, white shirt worn, red ribbon worn, pleated skirt worn

コマ2: heroine walks to the door
登場: heroine@left

# Page 2: change
コマ1: heroine removes blazer
登場: heroine@right
状態: heroine> outfit=navy blazer carried, white shirt worn, red ribbon worn, pleated skirt worn

コマ2: heroine walks outside
登場: heroine@left
`;

const project=compileMangaName(src,{title:'continuity-state'});
const chars=project.pages.flatMap(page=>page.panels.flatMap(panel=>panel.characters.filter(c=>c.name==='heroine')));
if(chars.length!==4)throw new Error('expected four heroine appearances');
const [a,b,c,d]=chars.map(x=>x.continuityState);
if(a.outfitSource!=='explicit')throw new Error('first authored outfit must be explicit');
if(b.outfit!==a.outfit||b.outfitSource!=='inherited')throw new Error('panel 2 did not inherit outfit');
if(c.outfitSource!=='explicit'||c.outfit===b.outfit)throw new Error('explicit outfit transition not preserved');
if(d.outfit!==c.outfit||d.outfitSource!=='inherited')throw new Error('post-transition outfit not inherited');
if((project.meta.continuityGraph?.issues||[]).some(x=>x.type==='outfit-state-change'))throw new Error('explicit outfit transition incorrectly diagnosed as drift');

const prompt1=buildExecutablePrompt(project,0);
const prompt2=buildExecutablePrompt(project,1);
if(!prompt1.includes('OUTFIT CONTINUITY: heroine')||!prompt1.includes('navy blazer worn'))throw new Error('inherited outfit missing from generation brief');
if(!prompt2.includes('OUTFIT TRANSITION: heroine')||!prompt2.includes('navy blazer carried'))throw new Error('explicit outfit transition missing from generation brief');

project.characterLibrary[0].appearance.outfit='school uniform baseline';
delete project.pages[0].panels[0].characters[0].continuityState;
delete project.pages[0].panels[1].characters[0].continuityState;
applyContinuityGraph(project);
const baseA=project.pages[0].panels[0].characters[0].continuityState;
const baseB=project.pages[0].panels[1].characters[0].continuityState;
if(baseA.outfit!=='school uniform baseline'||baseA.outfitSource!=='base')throw new Error('base outfit not materialized');
if(baseB.outfit!=='school uniform baseline'||baseB.outfitSource!=='inherited')throw new Error('base outfit not inherited');

console.log('Character continuity state validation passed');
