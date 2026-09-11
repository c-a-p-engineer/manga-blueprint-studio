// Prototype 0.16.0: mobile header uses two explicit rows so action labels never wrap inside buttons.
const mobileHeaderStyle34=document.createElement('style');
mobileHeaderStyle34.id='mobileHeaderStyle34';
mobileHeaderStyle34.textContent=`
@media(max-width:760px){
  .topbar{position:static!important;min-height:0!important;display:grid!important;grid-template-columns:minmax(0,1fr)!important;align-items:stretch!important;gap:8px!important;padding:10px 12px!important}
  .brand-block{min-width:0}.brand{font-size:18px!important;line-height:1.15}.tagline{display:block!important;font-size:11px!important;line-height:1.35;margin-top:4px!important;white-space:normal}
  .top-actions{width:100%!important;margin:0!important;display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:6px!important;align-items:stretch!important}
  .top-actions>*{width:100%!important;min-width:0!important;max-width:none!important;min-height:40px!important;padding:6px 5px!important;font-size:12px!important;white-space:nowrap!important;overflow:hidden;text-overflow:ellipsis}
  .top-actions #helpBtn span,.top-actions #undoBtn span,.top-actions #redoBtn span{display:inline!important}
}
@media(max-width:390px){
  .topbar{padding:8px 10px!important}.brand{font-size:17px!important}.tagline{font-size:10px!important}.top-actions{gap:4px!important}.top-actions>*{font-size:11px!important;padding:5px 3px!important}
}
`;
document.head.appendChild(mobileHeaderStyle34);
