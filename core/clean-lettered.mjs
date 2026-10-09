// Clean and deterministic lettering share the same page coordinate system.
// This is a human review reference, not the main model-facing Clean image.
export function composeCleanLetteredSvg(cleanSvg,letteringSvg){
  const end=/<\/svg>\s*$/i;
  if(typeof cleanSvg!=='string'||!/^\s*<svg\b/i.test(cleanSvg)||!end.test(cleanSvg))throw new Error('Invalid Clean SVG');
  if(typeof letteringSvg!=='string'||!/^\s*<svg\b/i.test(letteringSvg)||!end.test(letteringSvg))throw new Error('Invalid lettering SVG');
  if(!letteringSvg.includes('id="deterministic-lettering"'))throw new Error('Missing deterministic lettering glyphs');
  return cleanSvg.replace(end,'<g id="clean-lettered-overlay">'+letteringSvg+'</g></svg>');
}
