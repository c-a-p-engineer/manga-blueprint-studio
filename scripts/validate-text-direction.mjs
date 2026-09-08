import fs from 'node:fs';

const bootstrap=fs.readFileSync('web/app.js','utf8');
const app15=fs.readFileSync('web/app-15.js','utf8');
const schema=JSON.parse(fs.readFileSync('schema/manga-blueprint.schema.json','utf8'));

if(!bootstrap.includes('./app-15.js'))throw new Error('Bootstrap must load app-15.js');
for(const phrase of [
  "const TEXT_VERTICAL_15='vertical'",
  "textDirectionDefault:'新しい文字の既定方向'",
  'balloonWritingDirection15',
  'sfxWritingDirection15',
  'project.meta.textDirectionDefault=validTextDirection15',
  'b.writingDirection=validTextDirection15',
  'panel.effects.sfxWritingDirection=validTextDirection15',
  'TEXT WRITING DIRECTION CONTRACT:',
  "manifest.schema='manga-blueprint-export-manifest/4'",
  'readingOrderContract',
  'panelNumbersFollowReadingDirection:true',
  'storyBeatsFollowPanelNumbers:true',
  'orderedPanelsByReading15',
  'templateThumb13=function',
  'order=previewOrder08(rects)',
  'applyTemplateReadingAware15',
  'const ordered=orderedPanelsByReading15(page)'
])if(!app15.includes(phrase))throw new Error(`Missing Prototype 0.10 contract: ${phrase}`);

const meta=schema.properties.meta.properties;
if(meta.textDirectionDefault?.default!=='vertical')throw new Error('Schema default text direction must be vertical');
if(JSON.stringify(schema.$defs.balloon.properties.writingDirection)!==JSON.stringify({$ref:'#/$defs/writingDirection'}))throw new Error('Balloon writingDirection schema missing');
if(JSON.stringify(schema.$defs.effects.properties.sfxWritingDirection)!==JSON.stringify({$ref:'#/$defs/writingDirection'}))throw new Error('SFX writingDirection schema missing');
const dir=schema.$defs.writingDirection?.enum||[];
if(!(dir.includes('vertical')&&dir.includes('horizontal')))throw new Error('Writing direction enum must support vertical and horizontal');

console.log('Prototype 0.10 text direction and reading-order contract validation passed.');
