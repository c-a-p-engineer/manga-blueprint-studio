import {requireText,runtimeFamilySource} from './contract-source.mjs';

const handoff=runtimeFamilySource('handoff/');

for(const phrase of [
  'MODEL-INDEPENDENT INTERPRETATION PRIORITY:',
  'CLEAN Manga Blueprint PNG owns panel geometry',
  'character appearance follows CHARACTER IDENTITY GUIDANCE',
  'smartActionProfiles12.action',
  "role:'beat'",
  "pose:'crouch'",
  '低く身を沈めて力を溜め、決定打に備える',
  "ch.gaze.target='off-panel-target'",
  'climax.camera.depthTarget=target',
  "climax.camera.foreshortening='extreme'",
  'handoffPriority',
  'crossModelHints',
  'preserveAirborneSemantics',
  'preserveNearObjectForeshortening'
])requireText(handoff,phrase,'registered handoff owners');

requireText(handoff,".replace(/- The clean AI blueprint uses monochrome pose figures; character appearance still comes from Character Sheets",'legacy Character-Sheet-only wording removal');
requireText(handoff,"if((panel.characters||[]).length===1&&panel.characters[0]?.gaze?.target==='other-character')",'single-actor ambiguous gaze readiness warning');
requireText(handoff,"if(!['action','climax'].includes(purpose))return false",'bounded Smart Manga action/climax hardening');

console.log('Cross-model handoff contract passed across the registered handoff semantic family.');
