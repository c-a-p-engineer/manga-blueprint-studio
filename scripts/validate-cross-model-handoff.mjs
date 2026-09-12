import {runtimePaths, readRuntime} from './runtime-paths.mjs';

const app20=readRuntime('crossModel');
if(runtimePaths.crossModel!=='web/runtime/handoff/cross-model.js')throw new Error('Cross-model runtime owner is not registered');

for(const phrase of [
  'MODEL-INDEPENDENT INTERPRETATION PRIORITY:',
  'CLEAN Manga Blueprint PNG owns panel geometry',
  'character appearance follows CHARACTER IDENTITY GUIDANCE',
  "smartActionProfiles12.action",
  "role:'beat'",
  "pose:'crouch'",
  '低く身を沈めて力を溜め、決定打に備える',
  "ch.gaze.target='off-panel-target'",
  "climax.camera.depthTarget=target",
  "climax.camera.foreshortening='extreme'",
  'handoffPriority',
  'crossModelHints',
  'preserveAirborneSemantics',
  'preserveNearObjectForeshortening'
])if(!app20.includes(phrase))throw new Error(`Missing cross-model hardening contract: ${phrase}`);

if(!app20.includes(".replace(/- The clean AI blueprint uses monochrome pose figures; character appearance still comes from Character Sheets"))throw new Error('Legacy Character-Sheet-only pose reference wording must be removed at prompt compile time');
if(!app20.includes("if((panel.characters||[]).length===1&&panel.characters[0]?.gaze?.target==='other-character')"))throw new Error('Single-actor ambiguous gaze readiness warning missing');
if(!app20.includes("if(!['action','climax'].includes(purpose))return false"))throw new Error('Smart Manga hardening must remain bounded to action/climax purposes');

console.log('Prototype 0.11.1 cross-model handoff contract passed.');
