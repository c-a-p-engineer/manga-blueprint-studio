// Prototype 0.12.2: desktop layout hardening.
// Keep sticky editor/canvas geometry derived from the real topbar height instead of a hard-coded offset.

(function installDesktopLayout24(){
  const styleId='desktopLayoutStyle24';
  if(!document.getElementById(styleId)){
    const style=document.createElement('style');
    style.id=styleId;
    style.textContent=`
@media (min-width:761px){
  .top-actions{flex-wrap:nowrap}
  .top-actions button{white-space:nowrap;flex:0 0 auto}
  .top-actions select{width:auto;min-width:120px;flex:0 0 auto}
  .canvas-column,.control-shell{top:var(--desktop-sticky-top24,80px)}
  .control-shell{position:sticky;align-self:start}
  .tabbar{position:static;top:auto}
  .panels{max-height:calc(100vh - var(--desktop-sticky-top24,80px) - 44px);max-height:calc(100dvh - var(--desktop-sticky-top24,80px) - 44px)}
}
@media (max-width:760px){
  .control-shell{position:static;top:auto}
  .top-actions{flex-wrap:wrap}
  .top-actions select{width:100%;min-width:0}
}
`;
    document.head.appendChild(style);
  }

  const root=document.documentElement;
  const topbar=document.querySelector('.topbar');
  let frame=0;
  const syncOffset=()=>{
    cancelAnimationFrame(frame);
    frame=requestAnimationFrame(()=>{
      const height=Math.ceil(topbar?.getBoundingClientRect?.().height||68);
      root.style.setProperty('--desktop-sticky-top24',`${height+12}px`);
    });
  };

  syncOffset();
  window.addEventListener('resize',syncOffset,{passive:true});
  if(topbar&&'ResizeObserver' in window){
    const observer=new ResizeObserver(syncOffset);
    observer.observe(topbar);
  }
})();

document.querySelector('footer')&&(document.querySelector('footer').textContent='Prototype 0.12.2 · desktop responsive layout hardening');
