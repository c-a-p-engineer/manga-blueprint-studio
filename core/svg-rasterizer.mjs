import {spawnSync} from 'node:child_process';

function attempt(command,args){const r=spawnSync(command,args,{stdio:'ignore',shell:false});return !r.error&&r.status===0;}
export function rasterizeSvg(input,output){
  const attempts=process.platform==='win32'?
    [['magick',[input,output]],['rsvg-convert',['-o',output,input]]]:
    [['magick',[input,output]],['rsvg-convert',['-o',output,input]],['convert',[input,output]]];
  for(const [command,args] of attempts)if(attempt(command,args))return {ok:true,engine:command};
  return {ok:false,engine:'none',reason:'Install ImageMagick (magick) or librsvg (rsvg-convert) for PNG output.'};
}
