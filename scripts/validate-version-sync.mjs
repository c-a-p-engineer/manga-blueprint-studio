import fs from 'node:fs';

const build=JSON.parse(fs.readFileSync('web/build-info.json','utf8'));
const version=String(build.appVersion||'').trim();
if(!/^\d+\.\d+\.\d+$/.test(version))throw new Error(`Invalid appVersion: ${version}`);

const checks=[
  ['README.md',`Current prototype: ${version}`],
  ['docs/ROADMAP.md',`Shipped through Prototype ${version}`],
  [`docs/PROTOTYPE-${version}.md`,`Prototype ${version}`],
  ['web/app.js',`appVersion:'${version}'`],
  ['web/runtime/handoff/producer-provenance.js',`appVersion:'${version}'`]
];

for(const [path,phrase] of checks){
  if(!fs.existsSync(path))throw new Error(`Missing version-synchronized file: ${path}`);
  const text=fs.readFileSync(path,'utf8');
  if(!text.includes(phrase))throw new Error(`${path} is not synchronized to Prototype ${version}; missing ${JSON.stringify(phrase)}`);
}

console.log(`Prototype ${version} version/document synchronization passed.`);
