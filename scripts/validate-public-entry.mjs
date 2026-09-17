import fs from 'node:fs';

const read=path=>fs.readFileSync(path,'utf8');
for(const path of ['web/index.html','web/editor.html','web/landing.css','web/guide.html','web/techniques.html','vite.config.ts','README.md','README.ja.md']){
  if(!fs.existsSync(path))throw new Error(`Missing public-entry file: ${path}`);
}

const landing=read('web/index.html');
const editor=read('web/editor.html');
const landingCss=read('web/landing.css');
const guide=read('web/guide.html');
const techniques=read('web/techniques.html');
const vite=read('vite.config.ts');
const readme=read('README.md');

for(const phrase of ['<meta name="description"','<main id="main">','class="skip-link"','href="./editor.html"','href="./guide.html"','href="./techniques.html"','AIに描かせる前に','人が監督。AIは補助。','Executable Name']){
  if(!landing.includes(phrase))throw new Error(`Landing page contract missing ${JSON.stringify(phrase)}`);
}
if(landing.includes('id="blueprintSvg"')||landing.includes('src="./app.js"'))throw new Error('Public landing must not bootstrap or duplicate the editor runtime.');

for(const phrase of ['id="blueprintSvg"','id="helpBtn"','src="./app.js"','href="./styles.css"'])if(!editor.includes(phrase))throw new Error(`Dedicated editor entry missing ${JSON.stringify(phrase)}`);
if(!guide.includes('href="./editor.html"'))throw new Error('Public guide must link back to the dedicated editor entry.');
for(const phrase of ['断ち切り','ブチ抜き','斜めコマ','視線誘導','間','href="./editor.html"'])if(!techniques.includes(phrase))throw new Error(`Technique guide missing ${JSON.stringify(phrase)}`);

for(const phrase of ["landing:resolve(webRoot,'index.html')","app:resolve(webRoot,'editor.html')","guide:resolve(webRoot,'guide.html')","techniques:resolve(webRoot,'techniques.html')"])if(!vite.includes(phrase))throw new Error(`Vite multi-entry contract missing ${JSON.stringify(phrase)}`);

for(const phrase of ['https://c-a-p-engineer.github.io/manga-blueprint-studio/','https://c-a-p-engineer.github.io/manga-blueprint-studio/editor.html','https://c-a-p-engineer.github.io/manga-blueprint-studio/techniques.html','Executable Name'])if(!readme.includes(phrase))throw new Error(`README public-entry contract missing ${JSON.stringify(phrase)}`);

for(const phrase of ['a:focus-visible','min-height:48px','@media(max-width:620px)','@media(prefers-reduced-motion:reduce)'])if(!landingCss.includes(phrase))throw new Error(`Landing accessibility/responsive contract missing ${JSON.stringify(phrase)}`);

console.log('Public landing / editor / guide / techniques entry contract passed.');
