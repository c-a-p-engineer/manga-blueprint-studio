import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
import {Resvg} from '@resvg/resvg-js';

function attempt(command,args){
  const result=spawnSync(command,args,{stdio:'ignore',shell:false});
  return !result.error&&result.status===0;
}

function positiveInt(value,fallback){
  const n=Number(value);
  return Number.isInteger(n)&&n>0?n:fallback;
}

function pngSize(buffer){
  if(!Buffer.isBuffer(buffer)||buffer.length<24||buffer.toString('ascii',1,4)!=='PNG')throw new Error('Invalid PNG input');
  return{width:buffer.readUInt32BE(16),height:buffer.readUInt32BE(20)};
}

function xml(value){
  return String(value).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
}

export function buildContactSheetMontageSvg(inputs,{columns=4,rows=null,gap=24,background='#ececec'}={}){
  const pages=Array.isArray(inputs)?inputs.filter(Boolean):[];
  if(!pages.length)throw new Error('Contact Sheet PNG montage requires at least one page PNG.');
  const cols=positiveInt(columns,1);
  const resolvedRows=positiveInt(rows,Math.ceil(pages.length/cols));
  const spacing=Math.max(0,Number(gap)||0);
  const images=pages.map(file=>{
    const data=fs.readFileSync(file);
    const size=pngSize(data);
    return{file,data,size};
  });
  const cellWidth=Math.max(...images.map(x=>x.size.width));
  const cellHeight=Math.max(...images.map(x=>x.size.height));
  const width=cols*cellWidth+(cols+1)*spacing;
  const height=resolvedRows*cellHeight+(resolvedRows+1)*spacing;
  const body=images.map((item,index)=>{
    const col=index%cols,row=Math.floor(index/cols);
    const scale=Math.min(cellWidth/item.size.width,cellHeight/item.size.height);
    const w=item.size.width*scale,h=item.size.height*scale;
    const x=spacing+col*cellWidth+col*spacing+(cellWidth-w)/2;
    const y=spacing+row*cellHeight+row*spacing+(cellHeight-h)/2;
    const href='data:image/png;base64,'+item.data.toString('base64');
    return '<image x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" preserveAspectRatio="xMidYMid meet" href="'+xml(href)+'"/>';
  }).join('');
  return '<svg xmlns="http://www.w3.org/2000/svg" width="'+width+'" height="'+height+'" viewBox="0 0 '+width+' '+height+'"><rect width="100%" height="100%" fill="'+xml(background||'#ececec')+'"/>'+body+'</svg>';
}

function attemptResvgMontage(inputs,output,options){
  try{
    const svg=buildContactSheetMontageSvg(inputs,options);
    const png=new Resvg(svg,{font:{loadSystemFonts:true}}).render().asPng();
    fs.writeFileSync(output,png);
    return true;
  }catch{
    return false;
  }
}

export function buildContactSheetMontageAttempts(inputs,output,{columns=4,rows=null,gap=24,background='#ececec'}={}){
  const pages=Array.isArray(inputs)?inputs.filter(Boolean):[];
  if(!pages.length||!output)return[];
  const cols=positiveInt(columns,1);
  const resolvedRows=positiveInt(rows,Math.ceil(pages.length/cols));
  const spacing=Math.max(0,Number(gap)||0);
  const common=[
    ...pages,
    '-tile',cols+'x'+resolvedRows,
    '-geometry','+'+spacing+'+'+spacing,
    '-background',String(background||'#ececec'),
    output
  ];
  return process.platform==='win32'
    ?[['magick',['montage',...common]]]
    :[['magick',['montage',...common]],['montage',common]];
}

export function composeContactSheetPng(inputs,output,options={}){
  const pages=Array.isArray(inputs)?inputs.filter(Boolean):[];
  if(!pages.length||!output)return{ok:false,engine:'none',reason:'Contact Sheet PNG montage requires at least one page PNG and an output path.'};
  if(attemptResvgMontage(pages,output,options))return{ok:true,engine:'resvg-js-montage'};
  const attempts=buildContactSheetMontageAttempts(pages,output,options);
  for(const [command,args] of attempts){
    if(attempt(command,args))return{ok:true,engine:command==='magick'?'magick montage':'montage'};
  }
  return{ok:false,engine:'none',reason:'PNG montage failed with resvg-js and no ImageMagick fallback succeeded.'};
}
