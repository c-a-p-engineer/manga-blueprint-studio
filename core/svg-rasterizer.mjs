import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
import {Resvg} from '@resvg/resvg-js';

function attempt(command,args){
  const r=spawnSync(command,args,{stdio:'ignore',shell:false});
  return !r.error&&r.status===0;
}

function thumbnailWidth(svg,maxWidth){
  const limit=Number(maxWidth);
  if(!Number.isInteger(limit)||limit<1)return null;
  const match=String(svg).slice(0,600).match(/<svg\b[^>]*\bwidth=["']([0-9.]+)["']/i);
  return match&&Number(match[1])>limit?limit:null;
}

const japaneseFonts=['Noto Sans CJK JP','Noto Sans JP','IPAexGothic','IPAGothic','Yu Gothic','Meiryo'];
export function preferredJapaneseFont(families){
  return japaneseFonts.find(font=>families.includes(font))||null;
}
function installedFamilies(){
  const result=spawnSync('fc-list',['--format','%{family}\n'],{encoding:'utf8',shell:false});
  return result.status===0?result.stdout.split(/[\n,]/).map(x=>x.trim()):[];
}
function attemptResvg(svg,output,width){
  try{
    const font=preferredJapaneseFont(installedFamilies());
    const options={font:{loadSystemFonts:true,...(font?{defaultFontFamily:font}:{})}};
    if(width)options.fitTo={mode:'width',value:width};
    const png=new Resvg(svg,options).render().asPng();
    fs.writeFileSync(output,png);
    return true;
  }catch{
    return false;
  }
}

export function rasterizeSvg(input,output,{maxWidth=null}={}){
  const svg=fs.readFileSync(input);
  const width=thumbnailWidth(svg.toString('utf8'),maxWidth);
  if(attemptResvg(svg,output,width))return{ok:true,engine:'resvg-js',...(width?{maxWidth:width}:{})};
  const commands=process.platform==='win32'
    ?['magick','rsvg-convert']
    :['magick','rsvg-convert','convert'];
  for(const command of commands){
    const args=command==='rsvg-convert'?(width?['-w',String(width),'-o',output,input]:['-o',output,input]):
      width?[input,'-resize',String(width)+'x',output]:[input,output];
    if(attempt(command,args))return{ok:true,engine:command,...(width?{maxWidth:width}:{})};
  }
  return{
    ok:false,
    engine:'none',
    reason:'SVG rasterization failed with resvg-js and no ImageMagick/librsvg fallback succeeded.'
  };
}
