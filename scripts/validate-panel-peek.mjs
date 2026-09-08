import fs from 'node:fs';

const bootstrap=fs.readFileSync('web/app.js','utf8');
const app=fs.readFileSync('web/app-13.js','utf8');

if(!bootstrap.includes("'./app-13.js'"))throw new Error('Bootstrap must load app-13.js');
for(const phrase of [
  'openPanelPeek11=function',
  'peek-header13',
  'peek-scroll13',
  'peek-rows13',
  'peek-actions13',
  'background:#fff',
  'max-height:min(82dvh,680px)',
  'safe-area-inset-bottom',
  'overscroll-behavior:contain',
  'if(e.target===dialog)dialog.close()'
])if(!app.includes(phrase))throw new Error(`Missing Panel Peek mobile contract: ${phrase}`);

if(app.includes('peek-grid11'))throw new Error('Panel Peek hardening must not reuse the tall boxed legacy grid');
console.log('Panel Peek mobile contract validation passed.');
