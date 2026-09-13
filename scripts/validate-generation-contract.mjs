import {requireText,runtimeFamilySource} from './contract-source.mjs';

const handoff=runtimeFamilySource('handoff/');

for(const phrase of [
  "'approach-right'",
  "'hug-right'",
  "'hug-left'",
  "'hug-receive-left'",
  'storyTemplates11.twoVisibleHug27',
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
])requireText(handoff,phrase,'registered handoff owners');

// These strings/operations define observable export and readiness behavior, not a specific chunk location.
requireText(handoff,'width="${size.w}" height="${size.h}" viewBox="0 0 ${size.w} ${size.h}"','serialized SVG intrinsic dimensions');
requireText(handoff,'ctx.drawImage(img,0,0,size.w,size.h)','full-canvas PNG rasterization');
requireText(handoff,"if(!blob||!blob.size)throw new Error('PNG encoding failed')",'empty PNG rejection');
requireText(handoff,"if(kind!=='hug'||(panel.characters||[]).length<2)continue",'bounded two-person hug readiness warning');
requireText(handoff,"if(kind==='hug')return id.startsWith('hug-')",'contact-aware hug pose semantics');

console.log('Generation contract validation passed across the registered handoff semantic family.');
