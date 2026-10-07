import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {rasterizeSvg} from '../core/svg-rasterizer.mjs';

const dir=fs.mkdtempSync(path.join(os.tmpdir(),'manga-blueprint-rasterizer-'));
try{
  const svg=path.join(dir,'sample.svg');
  const png=path.join(dir,'sample.png');
  fs.writeFileSync(svg,'<svg xmlns="http://www.w3.org/2000/svg" width="32" height="24"><rect width="32" height="24" fill="white"/><rect x="4" y="4" width="24" height="16" fill="black"/></svg>');
  const result=rasterizeSvg(svg,png);
  if(!result.ok)throw new Error('rasterizeSvg failed: '+result.reason);
  if(result.engine!=='resvg-js')throw new Error('resvg-js must be the primary rasterizer; got '+result.engine);
  const bytes=fs.readFileSync(png);
  const signature=[0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a];
  if(bytes.length<24||signature.some((value,index)=>bytes[index]!==value))throw new Error('Rasterized output is not a PNG');
  console.log('SVG rasterizer validation passed');
}finally{
  fs.rmSync(dir,{recursive:true,force:true});
}
