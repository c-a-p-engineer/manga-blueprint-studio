import fs from 'node:fs';

const bootstrap=fs.readFileSync('web/app.js','utf8');
const app=fs.readFileSync('web/app-25.js','utf8');

if(!bootstrap.includes("'./app-25.js'"))throw new Error('Bootstrap must load app-25.js');

for(const phrase of [
  'container-type:inline-size',
  'grid-template-columns:repeat(auto-fit,minmax(180px,1fr))',
  '@container templateCard25 (max-width:230px)',
  'float:left',
  'clear:both',
  '@media(max-width:760px){.template-gallery13{grid-template-columns:1fr}}'
])if(!app.includes(phrase))throw new Error(`Missing component-responsive template-card contract: ${phrase}`);

for(const phrase of [
  'CHARACTER_MARKER_PALETTE25',
  'ch?.characterId||ch?.name||ch?.id',
  'if(!annotated)return svg',
  'character-head-tag25 authoring-text',
  '--char-fill25',
  'character-dot25',
  'character-identity25>.authoring-text:not(.character-head-tag25){display:none}'
])if(!app.includes(phrase))throw new Error(`Missing character identity-marker contract: ${phrase}`);

if(!app.includes('AI用クリーンPNGは名前を除去し、棒人間もモノクロのままです。'))throw new Error('Japanese help must explain the clean-export boundary');
if(!app.includes('The clean AI PNG removes names and keeps pose figures monochrome.'))throw new Error('English help must explain the clean-export boundary');

console.log('Prototype 0.12.3 authoring clarity validation passed.');
