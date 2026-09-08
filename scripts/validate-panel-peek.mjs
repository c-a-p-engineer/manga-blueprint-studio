import fs from 'node:fs';

const app=fs.readFileSync('web/app-12.js','utf8');
for(const phrase of [
  'openPanelPeek11=function',
  'peek-header12',
  'peek-scroll12',
  'peek-rows12',
  'peek-actions12',
  'background:#fff',
  'max-height:min(82dvh,680px)',
  'safe-area-inset-bottom',
  'overscroll-behavior:contain',
  'if(e.target===dialog)dialog.close()'
])if(!app.includes(phrase))throw new Error(`Missing Panel Peek mobile contract: ${phrase}`);

console.log('Panel Peek mobile contract validation passed.');
