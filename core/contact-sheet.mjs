import{buildExecutablePrompt}from'./generation-brief.mjs';
import{generationIdentityAuthority,validateReferenceBindings}from'./generation-adapter.mjs';

const esc=v=>String(v??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const clampColumns=(value,pageCount)=>Math.max(1,Math.min(Math.max(1,pageCount),Math.min(4,Number(value)||1)));
const pageCode=n=>'P'+String(n).padStart(3,'0');
const rangeCode=n=>String(n).padStart(3,'0');
export const CONTACT_SHEET_MAX_PAGES=4;

export function contactSheetRangeLabel(startPage,endPage){
  const start=Math.max(1,Number(startPage)||1),end=Math.max(start,Number(endPage)||start);
  return rangeCode(start)+'-'+rangeCode(end);
}

export function contactSheetAssetNames(range){
  const value=String(range||'').trim();
  if(!/^\d{3}-\d{3}$/.test(value))throw new Error('Contact sheet range must use NNN-NNN format');
  const prefix='contact-sheet.'+value;
  return{
    range:value,
    cleanSvg:prefix+'.clean.svg',
    blueprintSvg:prefix+'.blueprint.svg',
    cleanPng:prefix+'.clean.png',
    blueprintPng:prefix+'.blueprint.png',
    prompt:prefix+'.prompt.md',
    review:prefix+'.review.json',
    generation:prefix+'.generation.json'
  };
}

export function buildContactSheetBatches(pageCount,{batchSize=CONTACT_SHEET_MAX_PAGES,batchSizes=null,pageNumbers=[]}={}){
  const count=Math.max(0,Number(pageCount)||0);
  const limit=Math.max(1,Math.min(CONTACT_SHEET_MAX_PAGES,Number(batchSize)||CONTACT_SHEET_MAX_PAGES));
  const numbers=Array.isArray(pageNumbers)?pageNumbers:[];
  let sizes;
  if(batchSizes!==null){
    if(!Array.isArray(batchSizes)||batchSizes.some(size=>!Number.isInteger(size)||size<1||size>CONTACT_SHEET_MAX_PAGES)){
      throw new Error('Contact sheet batch sizes must be integers from 1 to 4.');
    }
    if(batchSizes.reduce((sum,size)=>sum+size,0)!==count){
      throw new Error('Contact sheet batch sizes must sum to the work page count ('+count+').');
    }
    sizes=[...batchSizes];
  }else{
    // Maximum four pages; a 3-page remainder uses 2x2. 6 becomes 4+2.
    sizes=[];
    let remaining=count;
    for(const size of [4,3,2,1]){
      if(size>limit)continue;
      while(remaining>=size){sizes.push(size);remaining-=size;}
    }
  }
  const batches=[];
  let startIndex=0;
  for(const size of sizes){
    const endIndex=startIndex+size;
    const startPage=Number(numbers[startIndex])||startIndex+1;
    const endPage=Number(numbers[endIndex-1])||endIndex;
    const range=contactSheetRangeLabel(startPage,endPage);
    batches.push({
      index:batches.length,
      startIndex,
      endIndex,
      pageCount:size,
      startPage,
      endPage,
      pageNumbers:Array.from({length:size},(_,i)=>Number(numbers[startIndex+i])||startIndex+i+1),
      range,
      assets:contactSheetAssetNames(range),
      layout:buildContactSheetLayout(size)
    });
    startIndex=endIndex;
  }
  return batches;
}

export function autoContactSheetPreset(pageCount){
  const count=Math.max(0,Number(pageCount)||0);
  if(count<=1)return{columns:1,rows:1,preset:'1x1'};
  if(count===2)return{columns:2,rows:1,preset:'2x1'};
  if(count<=4)return{columns:2,rows:2,preset:'2x2'};
  throw new Error('Contact sheet maximum is 4 pages; split into batches.');
}

export function buildContactSheetLayout(pageCount,{columns=null,pageWidth=1200,pageHeight=1697,gap=24,padding=24,labelHeight=52}={}){
  const count=Math.max(0,Number(pageCount)||0),auto=autoContactSheetPreset(count),manual=columns!==null&&columns!==undefined&&columns!=='auto';
  const cols=manual?clampColumns(columns,count||1):auto.columns;
  const rows=manual?Math.max(1,Math.ceil(count/cols)):auto.rows;
  const sheetWidth=padding*2+cols*pageWidth+Math.max(0,cols-1)*gap;
  const sheetHeight=padding*2+rows*(labelHeight+pageHeight)+Math.max(0,rows-1)*gap;
  return{
    schema:'manga-contact-sheet-layout/1',
    pageCount:count,
    columns:cols,
    rows,
    preset:manual?cols+'x'+rows:auto.preset,
    selection:manual?'override':'auto-preset',
    pageWidth,
    pageHeight,
    gap,
    padding,
    labelHeight,
    sheetWidth,
    sheetHeight,
    order:'row-major-page-number'
  };
}

function svgInner(svg){
  const text=String(svg||'').trim();
  const open=text.match(/^<svg\b[^>]*>/i);
  if(!open)throw new Error('Contact sheet page asset must be SVG');
  return text.slice(open[0].length).replace(/<\/svg>\s*$/i,'');
}

function svgViewBox(svg){
  const text=String(svg||'');
  const match=text.match(/^<svg\b[^>]*\bviewBox=["']([^"']+)["']/i);
  return match?match[1]:'0 0 1200 1697';
}

export function renderContactSheetSvg(pageSvgs,{columns=null,pageNumbers=[],...options}={}){
  if(!Array.isArray(pageSvgs)||pageSvgs.length===0)throw new Error('Contact sheet requires at least one page SVG');
  const layout=buildContactSheetLayout(pageSvgs.length,{columns,...options});
  if(pageNumbers.length&&pageNumbers.length!==pageSvgs.length)throw new Error('pageNumbers must match the page assets');
  const chunks=[
    '<svg xmlns="http://www.w3.org/2000/svg" width="'+layout.sheetWidth+'" height="'+layout.sheetHeight+'" viewBox="0 0 '+layout.sheetWidth+' '+layout.sheetHeight+'">',
    '<rect width="100%" height="100%" fill="#ececec"/>'
  ];
  for(let i=0;i<pageSvgs.length;i++){
    const row=Math.floor(i/layout.columns),column=i%layout.columns;
    const x=layout.padding+column*(layout.pageWidth+layout.gap);
    const y=layout.padding+row*(layout.pageHeight+layout.labelHeight+layout.gap);
    const code=pageCode(Number(pageNumbers[i])||i+1),pageY=y+layout.labelHeight;
    chunks.push(
      '<g data-contact-sheet-page="'+code+'">',
      '<text x="'+x+'" y="'+(y+34)+'" font-family="sans-serif" font-size="28" font-weight="700" fill="black">'+esc(code)+'</text>',
      '<rect x="'+(x-2)+'" y="'+(pageY-2)+'" width="'+(layout.pageWidth+4)+'" height="'+(layout.pageHeight+4)+'" fill="white" stroke="#555" stroke-width="4"/>',
      '<svg x="'+x+'" y="'+pageY+'" width="'+layout.pageWidth+'" height="'+layout.pageHeight+'" viewBox="'+esc(svgViewBox(pageSvgs[i]))+'" data-page-code="'+code+'">'+svgInner(pageSvgs[i])+'</svg>',
      '</g>'
    );
  }
  chunks.push('</svg>');
  return chunks.join('');
}

function characterContract(character){
  const a=character.appearance||{},parts=[
    a.hair&&'hair='+JSON.stringify(a.hair),
    a.eyes&&'eyes='+JSON.stringify(a.eyes),
    a.outfit&&'outfit='+JSON.stringify(a.outfit),
    a.features&&'features='+JSON.stringify(a.features)
  ].filter(Boolean);
  return'- '+(character.name||character.characterId)+': identityMode='+(character.identityMode||'description')+(parts.length?'; '+parts.join('; '):'');
}

export function buildContactSheetPrompt(project,{columns=null}={}){
  if(!project?.pages?.length)throw new Error('Contact sheet prompt requires project pages');
  const layout=buildContactSheetLayout(project.pages.length,{columns});
  const lines=[
    '# Manga Contact Sheet Preflight Brief',
    'Work: '+(project.meta?.title||'(untitled)'),
    'Pages: '+project.pages.length,
    'Sheet: '+layout.columns+' columns x '+layout.rows+' rows',
    'Page order: '+layout.order,
    'Internal page reading: '+(project.meta?.readingDirection||'rtl'),
    'Writing: '+(project.meta?.defaultWritingMode||'vertical-rl'),
    '',
    '## PURPOSE',
    '- Generate ONE contact-sheet image for multi-page preflight and batch review.',
    '- Each cell is an independent manga page. Do not merge story panels across page-cell gutters.',
    '- This contact sheet is NOT final publication artwork and does not replace page-level acceptance.',
    '- Outer Pxxx labels are review indexes only and are not manga lettering inside the page.',
    '',
    '## GLOBAL CONTINUITY CONTRACT',
    '- Preserve the same reusable character identity across all page cells.',
    '- Preserve each resolved per-panel outfit/condition state exactly; a change is allowed only where the embedded page brief marks an explicit transition.',
    '- Do not add, remove, recolor or redesign clothing merely because a new page cell begins.',
    '- Preserve scene progression and page order; do not rearrange P001..Pxxx.',
    ...(project.characterLibrary||[]).map(characterContract),
    '',
    '## REVIEW PRIORITY',
    '- High: page presence/order, panel topology, character identity, outfit continuity, major scene continuity, large pose/contact/read-flow errors.',
    '- Lower confidence at sheet scale: exact small glyphs, finger anatomy, subtle facial detail. Re-check those on individual page outputs.',
    ''
  ];
  for(let i=0;i<project.pages.length;i++){
    const code=pageCode(project.pages[i]?.pageNumber||i+1);
    lines.push('# ===== '+code+' =====',buildExecutablePrompt(project,i),'');
  }
  return lines.join('\n');
}

function resolvedPanelStates(page){
  return(page.panels||[]).map(panel=>({
    panelOrder:panel.order,
    characters:(panel.characters||[]).map(c=>({
      characterId:c.characterId,
      name:c.name,
      outfit:c.continuityState?.outfit||'',
      outfitSource:c.continuityState?.outfitSource||'',
      condition:c.continuityState?.condition||'',
      conditionSource:c.continuityState?.conditionSource||''
    }))
  }));
}

export function buildContactSheetReviewRequest(project,{columns=null}={}){
  const layout=buildContactSheetLayout(project.pages.length,{columns});
  return{
    schema:'manga-contact-sheet-review-request/1',
    purpose:'preflight-batch-review',
    finalAcceptance:false,
    layout,
    pageCells:project.pages.map((page,i)=>({
      pageIndex:i,
      pageNumber:page.pageNumber,
      pageId:page.id,
      code:pageCode(page.pageNumber||i+1),
      row:Math.floor(i/layout.columns),
      column:i%layout.columns,
      expectedPanelCount:(page.panels||[]).length,
      resolvedStates:resolvedPanelStates(page)
    })),
    checks:[
      {id:'page-presence-order',priority:'high'},
      {id:'panel-topology',priority:'high'},
      {id:'character-identity',priority:'high'},
      {id:'outfit-continuity',priority:'high'},
      {id:'scene-continuity',priority:'high'},
      {id:'reading-flow',priority:'high'},
      {id:'fine-lettering',priority:'page-level-recheck'},
      {id:'fine-anatomy',priority:'page-level-recheck'}
    ],
    outcomeModel:{
      perPage:['pass','review','repair'],
      expectedIssueTarget:'page/panel/character',
      repairPolicy:'regenerate only affected page when possible'
    }
  };
}

export function buildContactSheetGenerationPackage({
  project,
  cleanAssets=[],
  promptAssets=[],
  contactSheetAsset='contact-sheet.clean.svg',
  promptAsset='contact-sheet.prompt.md',
  reviewAsset='contact-sheet.review.json',
  referenceAssets=[],
  columns=null
}){
  const bindings=validateReferenceBindings(project,referenceAssets);
  const expected=project.pages.length;
  const assetsReady=cleanAssets.length===expected&&promptAssets.length===expected;
  return{
    schema:'manga-contact-sheet-generation-package/1',
    purpose:'preflight-batch-review',
    authority:{
      spatial:'contact-sheet-clean',
      semantic:'project+page-prompts',
      identity:generationIdentityAuthority(project),
      review:'contact-sheet-review-request'
    },
    inputs:{
      contactSheetAsset,
      promptAsset,
      reviewAsset,
      pageCleanAssets:[...cleanAssets],
      pagePromptAssets:[...promptAssets],
      references:referenceAssets.map(r=>({referenceKey:r.referenceKey,asset:r.asset,role:r.role||'identity'}))
    },
    constraints:{
      oneOutputImage:true,
      preservePageCells:true,
      preservePageOrder:true,
      preserveInternalReadingDirection:project.meta?.readingDirection||'rtl',
      preserveWritingMode:project.meta?.defaultWritingMode||'vertical-rl',
      preserveResolvedCharacterState:true,
      finalAcceptance:false
    },
    layout:buildContactSheetLayout(expected,{columns}),
    bindings,
    ready:assetsReady&&bindings.missing.length===0,
    providerAdapter:{mode:'external-boundary',canonicalStateProviderIndependent:true},
    capabilities:{batchPreflight:true,pageTargetedRepair:true}
  };
}
