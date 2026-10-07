import {spawnSync} from 'node:child_process';

function attempt(command,args){
  const result=spawnSync(command,args,{stdio:'ignore',shell:false});
  return !result.error&&result.status===0;
}

function positiveInt(value,fallback){
  const n=Number(value);
  return Number.isInteger(n)&&n>0?n:fallback;
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
  const attempts=buildContactSheetMontageAttempts(inputs,output,options);
  if(!attempts.length)return{ok:false,engine:'none',reason:'Contact Sheet PNG montage requires at least one page PNG and an output path.'};
  for(const [command,args] of attempts){
    if(attempt(command,args))return{ok:true,engine:command==='magick'?'magick montage':'montage'};
  }
  return{ok:false,engine:'none',reason:'Install ImageMagick montage support to combine page PNGs into Contact Sheet PNG output.'};
}
