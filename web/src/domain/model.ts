export type ReadingDirection='rtl'|'ltr';
export type WritingMode='vertical-rl'|'horizontal-tb';
export type WritingModeOverride='inherit'|WritingMode;
export type IdentityMode='sheet'|'description'|'free';
export type PanelBorder='normal'|'borderless'|'inset'|'impact';
export type BleedEdge='none'|'top'|'right'|'bottom'|'left'|'all';
export type BreakoutMode='none'|'character'|'foreground'|'cross-panel';
export type LineEffect='none'|'speed'|'focus'|'impact'|'tension'|'silence';
export type EffectStrength='low'|'medium'|'high';
export type BackgroundDetail='none'|'low'|'medium'|'high';
export type BackgroundRenderMode='normal'|'selective-detail'|'white'|'blur'|'speed-lines'|'focus-lines'|'black';
export type BalloonType='speech'|'thought'|'shout'|'whisper'|'narration'|'offscreen';
export type ContainerKind='volume'|'chapter'|'folder';
export type PanelInsetAnchor='top-right'|'top-left'|'bottom-right'|'bottom-left'|'center';
export type PanelInsetSize='small'|'medium'|'large';

export type Point={x:number;y:number};
export type Rect={x:number;y:number;w:number;h:number};

export type WorkBrief={
  purpose:string;
  targetAudience:string;
  primaryMedium:string;
  keyMessage:string;
  sourceNotes:string;
};

export type ArtDirection={
  preset?:string;
  colorMode?:'auto'|'color'|'monochrome'|'grayscale'|'limited';
  renderStyle?:'auto'|'anime'|'manga'|'pencil'|'ink'|'watercolor'|'webtoon'|'cel'|'realistic'|'sketch'|'retro-manga'|'chibi';
  lineStyle?:'clean'|'bold'|'fine'|'rough'|'brush'|'pencil';
  shading?:'flat'|'cel'|'soft'|'screentone'|'crosshatch'|'pencil'|'painted';
  detailLevel?:'low'|'medium'|'high';
  backgroundFinish?:'match'|'detailed'|'simplified'|'graphic'|'minimal';
  palette?:string;
  tone?:string;
  notes?:string;
};

export type ProjectMeta={
  workId:string;
  title:string;
  readingDirection:ReadingDirection;
  defaultWritingMode?:WritingMode;
  pageWidth:number;
  pageHeight:number;
  canvasPreset?:string;
  layoutPreset?:string;
  storyTemplate?:string;
  randomPurpose?:string;
  randomSeed?:string;
  randomVariant?:'balanced'|'dynamic'|'emotion';
  randomIntensity?:'stable'|'standard'|'bold';
  artDirection?:ArtDirection;
  workBrief?:WorkBrief;
  [key:string]:unknown;
};

export type MangaContainer={
  id:string;
  kind:ContainerKind;
  title:string;
  order:number;
  parentId:string|null;
  [key:string]:unknown;
};

export type Appearance={
  summary?:string;
  hair?:string;
  eyes?:string;
  outfit?:string;
  features?:string;
  [key:string]:unknown;
};

export type BaseCharacter={
  characterId:string;
  name:string;
  referenceKey:string;
  poseId:string;
  notes?:string;
  identityMode?:IdentityMode;
  appearance?:Appearance;
  [key:string]:unknown;
};

export type Expression={type:string;intensity:number;notes:string;[key:string]:unknown};
export type Gaze={target:string;notes:string;[key:string]:unknown};

export type CharacterInstance={
  id:string;
  characterId:string;
  name:string;
  referenceKey:string;
  x:number;
  y:number;
  scale:number;
  rotation:number;
  poseId:string;
  supportState?:'auto'|'grounded'|'airborne'|'supported'|'unknown';
  motionPhase?:'auto'|'still'|'anticipation'|'approach'|'launch'|'airborne'|'impact'|'recovery';
  expression:Expression;
  gaze:Gaze;
  [key:string]:unknown;
};

export type Balloon={
  id:string;
  type:BalloonType;
  speakerId:string;
  text:string;
  writingMode?:WritingModeOverride;
  x:number;
  y:number;
  size:number;
  [key:string]:unknown;
};

export type PanelShape={
  kind:'quad';
  preset?:'rectangle'|'diagonal-left'|'diagonal-right'|'trapezoid-left'|'trapezoid-right'|'custom';
  points:[Point,Point,Point,Point]|Point[];
  [key:string]:unknown;
};

export type PanelInset={
  kind:'panel-in-panel';
  parentPanelId:string;
  anchor?:PanelInsetAnchor;
  size?:PanelInsetSize;
  [key:string]:unknown;
};

export type Camera={
  distance:'extreme-long'|'long'|'medium'|'close'|'extreme-close';
  angle:'eye-level'|'low-angle'|'high-angle'|'birds-eye'|'worms-eye'|'dutch-angle'|'over-shoulder';
  viewpoint:'front'|'three-quarter-front'|'side'|'three-quarter-back'|'back'|'pov'|'near-object';
  focus:string;
  intent:string;
  depthTarget?:'auto'|'right-hand'|'left-hand'|'right-foot'|'left-foot'|'face'|'prop'|'none';
  foreshortening?:'normal'|'strong'|'extreme';
  [key:string]:unknown;
};

export type PanelStyle={border:PanelBorder;bleed:BleedEdge;breakout:BreakoutMode;[key:string]:unknown};
export type PanelBackground={
  location:string;
  timeOfDay:string;
  weather:string;
  mood:string;
  detailLevel:BackgroundDetail;
  renderMode:BackgroundRenderMode;
  notes:string;
  sceneId?:string;
  continuityFrom?:string;
  anchorNotes?:string;
  [key:string]:unknown;
};
export type PanelEffects={
  lineEffect:LineEffect;
  strength:EffectStrength;
  sfxText:string;
  sfxStyle:string;
  sfxWritingMode?:WritingModeOverride;
  notes:string;
  [key:string]:unknown;
};

export type MangaPanel={
  id:string;
  order:number;
  rect:Rect;
  shape?:PanelShape;
  inset?:PanelInset;
  role:string;
  actionIntent?:string;
  style:PanelStyle;
  camera:Camera;
  background:PanelBackground;
  effects:PanelEffects;
  characters:CharacterInstance[];
  balloons:Balloon[];
  assistSeed?:string;
  [key:string]:unknown;
};

export type MangaPage={
  id:string;
  title?:string;
  pageNumber?:number;
  order?:number;
  containerId?:string|null;
  panels:MangaPanel[];
  [key:string]:unknown;
};

export type MangaProject={
  format:'manga-blueprint/0.2';
  meta:ProjectMeta;
  containers:MangaContainer[];
  characterLibrary:BaseCharacter[];
  pages:MangaPage[];
  [key:string]:unknown;
};

export type EditorSelection={
  pageId:string|null;
  panelId:string|null;
  characterId:string|null;
  balloonId:string|null;
};
