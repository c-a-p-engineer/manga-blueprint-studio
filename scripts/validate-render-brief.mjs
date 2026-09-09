import fs from 'node:fs';
import {runtimePaths, readRuntime} from './runtime-paths.mjs';

const bootstrap=fs.readFileSync('web/app.js','utf8');
const app=readRuntime('renderBrief');
const src=`./${runtimePaths.renderBrief.slice('web/'.length)}`;

if(!bootstrap.includes(src))throw new Error(`Bootstrap must load ${src}`);

for(const phrase of [
  'CURRENT PAGE RENDER CONTRACT — READ THIS FIRST:',
  'COMPLETE, SELF-CONTAINED contract',
  'Ignore story, genre, setting, characters, dialogue, props, titles, and visual defaults from prior conversation turns or prior generated images',
  'Visible text allowlist:',
  'Do not add titles, captions, narration, UI, explanatory labels, extra dialogue, or genre/setting substitutions.',
  'ART DIRECTION changes rendering language only',
  'CURRENT PANEL BEATS:',
  'manga-blueprint-render-brief/1',
  'ignorePriorConversationUnlessRepeated',
  'ignorePriorGeneratedImagesUnlessExplicitReference',
  'forbiddenInventions',
  'manifest.renderBrief=renderBriefObject30()',
  'manifest.contextIsolation',
  'preferCurrentPageRenderBrief',
  'rejectPriorContextCarryover',
  'artDirectionDoesNotChangeStoryGenre',
  'patchTwoVisibleStandoff30',
  "beat.pose='guard'",
  "actor.pose='guard'",
  'readinessGuardPoseConflict30',
  'readinessBattleToneConflict30'
])if(!app.includes(phrase))throw new Error(`Missing render-brief hardening: ${phrase}`);

const interactionIndex=bootstrap.indexOf('./runtime/handoff/interaction-generation-contract.js');
const briefIndex=bootstrap.indexOf(src);
if(interactionIndex<0||briefIndex<0||briefIndex<interactionIndex)throw new Error('Render brief must load after interaction-generation-contract so it is the final prompt/manifest wrapper');

console.log('Prototype 0.12.8 current-page render brief validation passed.');
