import {runtimePaths, readRuntime} from './runtime-paths.mjs';

const app=readRuntime('interactionGenerationContract');
if(runtimePaths.interactionGenerationContract!=='web/runtime/handoff/interaction-generation-contract.js')throw new Error('Interaction-generation runtime owner is not registered');

for(const phrase of [
  "'approach-right'",
  "'hug-right'",
  "'hug-left'",
  "'hug-receive-left'",
  "storyTemplates11.twoVisibleHug27",
  "climax.actors27[0].pose='hug-right'",
  "climax.actors27[1].pose='hug-receive-left'",
  "afterglow.actors27[1].pose='hug-left'",
  'ACTION / POSE RESOLUTION:',
  'STORY ACTION INTENT is authoritative',
  'For physical-contact actions, render the required contact visibly',
  'CHARACTER APPEARANCE FIELD RULE:',
  'appearanceText and appearance.summary are authoritative',
  'emptyDetailedFieldMeaning',
  'specificActionIntentOverridesGenericPose',
  'appearanceSummaryRemainsAuthoritative',
  'cleanPngExpectedDimensions',
  'readinessActionPoseConflict29'
])if(!app.includes(phrase))throw new Error(`Missing generation-contract hardening: ${phrase}`);

if(!app.includes('width="${size.w}" height="${size.h}" viewBox="0 0 ${size.w} ${size.h}"'))throw new Error('Serialized SVG must carry explicit intrinsic dimensions');
if(!app.includes('ctx.drawImage(img,0,0,size.w,size.h)'))throw new Error('PNG rasterization must scale SVG to the full destination canvas');
if(!app.includes("if(!blob||!blob.size)throw new Error('PNG encoding failed')"))throw new Error('PNG export must reject an empty encoded blob');
if(!app.includes("if(kind!=='hug'||(panel.characters||[]).length<2)continue"))throw new Error('Readiness warning must remain bounded to actionable two-person hug conflicts');
if(!app.includes("if(kind==='hug')return id.startsWith('hug-')"))throw new Error('Hug readiness check must require explicit contact-aware pose semantics');

console.log('Prototype 0.12.7 generation contract validation passed.');
