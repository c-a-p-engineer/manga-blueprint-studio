import{createObservationRequest,evaluateObservedGeneration}from'../core/observation-extractor.mjs';
import{createImageObservation,evaluateGeneratedImage}from'../core/image-observation-adapter.mjs';

const expected={
  format:'manga-blueprint/0.2',
  meta:{title:'observe',readingDirection:'rtl',defaultWritingMode:'vertical-rl',pageWidth:1000,pageHeight:1000},
  characterLibrary:[{characterId:'hero',name:'Hero',referenceKey:'hero'}],
  pages:[{
    id:'page-1',
    pageNumber:1,
    panels:[
      {
        id:'panel-1',
        order:1,
        rect:{x:500,y:0,w:500,h:500},
        characters:[{
          id:'hero-1',
          characterId:'hero',
          name:'Hero',
          referenceKey:'hero',
          x:750,
          y:400,
          scale:1,
          renderPose:{
            occupancy:{x:700,y:200,w:100,h:200},
            joints:{head:{x:750,y:220},chest:{x:750,y:300}}
          }
        }],
        balloons:[{id:'b1',text:'了解',speakerId:'hero',x:850,y:100,size:80,writingMode:'inherit'}],
        effects:{sfxText:''}
      },
      {
        id:'panel-2',
        order:2,
        rect:{x:0,y:0,w:500,h:500},
        characters:[],
        balloons:[],
        effects:{sfxText:'ドン',sfxWritingMode:'inherit'}
      }
    ]
  }]
};

const request=createObservationRequest({project:expected,pageIndex:0,generatedAsset:'generated.png'});
if(request.schema!=='manga-blueprint-observation-request/1'||request.coordinateSpace!=='normalized'||request.expectedPanelCount!==2)throw Error('observation request');

const raw={
  schema:'manga-blueprint-observation/1',
  source:{kind:'manual',asset:'generated.png'},
  coordinateSpace:'normalized',
  readingDirection:'rtl',
  defaultWritingMode:'vertical-rl',
  panels:[
    {
      panelId:'panel-1',
      order:1,
      rect:{x:.5,y:0,w:.5,h:.5},
      characters:[{
        characterId:'hero',
        referenceKey:'hero',
        anchor:{x:.75,y:.4},
        occupancy:{x:.7,y:.2,w:.1,h:.2},
        joints:{head:{x:.75,y:.22},chest:{x:.75,y:.3}}
      }],
      lettering:[{kind:'dialogue',text:'了解',writingMode:'vertical-rl'}]
    },
    {
      panelId:'panel-2',
      order:2,
      rect:{x:0,y:0,w:.5,h:.5},
      characters:[],
      lettering:[{kind:'sfx',text:'ドン',writingMode:'vertical-rl'}]
    }
  ]
};

const ok=evaluateObservedGeneration(expected,raw);
if(ok.schema!=='manga-blueprint-observation-evaluation/1'||ok.verdict!=='good'||ok.structural.result.score<.999||ok.coverage.overall<.999||ok.diagnostics.length)throw Error(`observation good path ${JSON.stringify(ok)}`);

const drift=evaluateObservedGeneration(expected,{
  ...raw,
  readingDirection:'ltr',
  defaultWritingMode:'horizontal-tb',
  panels:[
    {...raw.panels[0],lettering:[{kind:'dialogue',text:'了介',writingMode:'horizontal-tb'}]},
    raw.panels[1]
  ]
});
const codes=new Set(drift.diagnostics.map(x=>x.code));
for(const code of ['reading-direction-drift','writing-mode-drift','visible-text-mismatch','lettering-writing-mode-drift'])if(!codes.has(code))throw Error(`missing diagnostic ${code}`);
if(drift.verdict!=='drift')throw Error('drift verdict');

const unidentified=evaluateObservedGeneration(expected,{
  ...raw,
  panels:[
    {...raw.panels[0],characters:[{occupancy:{x:.7,y:.2,w:.1,h:.2},joints:{head:{x:.75,y:.22},chest:{x:.75,y:.3}}}]},
    raw.panels[1]
  ]
});
if(unidentified.coverage.byObservable['character-occupancy']!==0)throw Error('unidentified character must not count as observed identity');
if(!unidentified.diagnostics.some(x=>x.code==='character-missing')||unidentified.verdict!=='drift')throw Error('unidentified character must remain a cast drift');

// EP004 regression: the image-adapter must not drop observed balloon tails or speaker IDs.
// A clear contradictory tail is a diagnostic, but an absent observation is not fabricated.
const observedImage=createImageObservation({
  asset:'rendered-ep004.png',width:1000,height:1000,
  readingDirection:'rtl',defaultWritingMode:'vertical-rl',
  panels:[
    {panelId:'panel-1',order:1,rect:{x:500,y:0,w:500,h:500},
      characters:[{characterId:'hero',referenceKey:'hero',anchor:{x:750,y:400},occupancy:{x:700,y:200,w:100,h:200}}],
      lettering:[{kind:'dialogue',text:'了解',writingMode:'vertical-rl',speakerId:'wrong-character',tailTargetId:'wrong-character'}]
    },
    {panelId:'panel-2',order:2,rect:{x:0,y:0,w:500,h:500},
      lettering:[{kind:'sfx',text:'ドン',writingMode:'vertical-rl'}]
    }
  ]
});
if(observedImage.panels[0].lettering[0].tailTargetId!=='wrong-character')throw Error('Image adapter erased visual tail evidence');
const imageDiagnostics=evaluateGeneratedImage(expected,observedImage).diagnostics.map(x=>x.code);
for(const code of ['balloon-speaker-mismatch','balloon-tail-target-mismatch'])
  if(!imageDiagnostics.includes(code))throw Error(`EP004 image review missing ${code}`);
const unobservedImage=createImageObservation({
  asset:'unobserved.png',width:1000,height:1000,
  panels:[{panelId:'panel-1',rect:{x:500,y:0,w:500,h:500},
    lettering:[{kind:'dialogue',text:'了解'}]},
    {panelId:'panel-2',rect:{x:0,y:0,w:500,h:500},lettering:[{kind:'sfx',text:'ドン'}]}]
});
const noTail=evaluateGeneratedImage(expected,unobservedImage).diagnostics.map(x=>x.code);
if(noTail.includes('balloon-tail-target-mismatch')||noTail.includes('balloon-speaker-mismatch'))
  throw Error('Missing image evidence must not be treated as an observed bad tail');

console.log('Observation extraction validation passed',ok.structural.result.score.toFixed(3),ok.coverage.overall.toFixed(3));
