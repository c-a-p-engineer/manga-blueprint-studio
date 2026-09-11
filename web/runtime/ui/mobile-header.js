// Prototype 0.16.2: the mobile app header is always two explicit rows.
// Row 1 is branding; row 2 is Help / Undo / Redo / language. Work identity belongs
// in the separate editor-context shell and is hidden here if an older insertion path
// briefly leaves the work-library button inside the topbar.
const mobileHeaderStyle34=document.createElement('style');
mobileHeaderStyle34.id='mobileHeaderStyle34';
mobileHeaderStyle34.textContent=`
@media(max-width:760px){
  body .topbar{position:static!important;min-height:0!important;display:grid!important;grid-template-columns:minmax(0,1fr)!important;grid-template-areas:"brand" "actions"!important;align-items:stretch!important;gap:8px!important;padding:10px 12px!important}
  body .topbar .brand-block{grid-area:brand!important;min-width:0!important}
  body .topbar .brand{font-size:18px!important;line-height:1.15!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
  body .topbar .tagline{display:block!important;font-size:11px!important;line-height:1.35!important;margin-top:4px!important;white-space:normal!important}
  body .topbar .top-actions{grid-area:actions!important;width:100%!important;margin:0!important;display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:6px!important;align-items:stretch!important}
  body .topbar .top-actions>*{width:100%!important;min-width:0!important;max-width:none!important;min-height:38px!important;padding:6px 4px!important;font-size:12px!important;line-height:1.15!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
  body .topbar .top-actions #helpBtn span,body .topbar .top-actions #undoBtn span,body .topbar .top-actions #redoBtn span{display:inline!important}
  body .topbar #workLibraryBtn16{display:none!important}
}
@media(max-width:390px){
  body .topbar{padding:8px 10px!important;gap:6px!important}
  body .topbar .brand{font-size:17px!important}
  body .topbar .tagline{font-size:10px!important}
  body .topbar .top-actions{gap:4px!important}
  body .topbar .top-actions>*{font-size:10.5px!important;padding:5px 2px!important;min-height:36px!important}
}
`;
document.head.appendChild(mobileHeaderStyle34);