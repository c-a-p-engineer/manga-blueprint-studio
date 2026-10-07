import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
import {Resvg} from '@resvg/resvg-js';

function attempt(command,args){
  const r=spawnSync(command,args,{stdio:'ignore',shell:false});
  return !r.error&&r.status===0;
}

function attemptResvg(input,output){
  try{
    const svg=fs.readFileSync(input);
    const png=new Resvg(svg,{font:{loadSystemFonts:true}}).render().asPng();
    fs.writeFileSync(output,png);
    return true;
  }catch{
    return false;
  }
}

export function rasterizeSvg(input,output){
  if(attemptResvg(input,output))return{ok:true,engine:'resvg-js'};
  const attempts=process.platform==='win32'?
    [['magick',[input,output]],['rsvg-convert',['-o',output,input]]]:
    [['magick',[input,output]],['rsvg-convert',['-o',output,input]],['convert',[input,output]]];
  for(const [command,args] of attempts){
    if(attempt(command,args))return{ok:true,engine:command};
  }
  return{
    ok:false,
    engine:'none',
    reason:'SVG rasterization failed with resvg-js and no ImageMagick/librsvg fallback succeeded.'
  };
}
