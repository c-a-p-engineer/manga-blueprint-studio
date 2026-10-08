// Read-only handoff preflight. It never invokes an image provider.
// The caller must independently attach the selected *actual image bytes* to its image tool.
const pageCode = n => 'P' + String(n).padStart(3, '0');
const unsafe = value => typeof value !== 'string' || !value ||
  /(^\/|^[A-Za-z]:|\\|(?:^|\/)\.\.(?:\/|$)|[\u0000-\u001f])/.test(value);
const uniq = values => [...new Set(values)];
const issue = (code, detail, asset) => ({code, detail, ...(asset ? {asset} : {})});
const safeTitle = value => String(value ?? '').trim();

export function validateGenerationHandoff({manifest, project, generation, target, readAsset}) {
  const errors = [], warnings = [], files = [];
  const fail = (code, detail, asset) => errors.push(issue(code, detail, asset));
  const warn = (code, detail, asset) => warnings.push(issue(code, detail, asset));
  if (typeof readAsset !== 'function') throw new TypeError('readAsset must be a function');
  const read = (name, role, {required = true, visual = false} = {}) => {
    if (unsafe(name)) {
      if (required) fail('unsafe-or-empty-path', role + ' has no safe relative file path', String(name));
      return null;
    }
    const value = readAsset(name);
    if (!value?.exists) {
      if (required) fail('missing-asset', role + ' is missing', name);
      return null;
    }
    if (visual && !/\.(svg|png)$/i.test(name)) fail('invalid-visual-extension', role + ' must be SVG or PNG', name);
    if (visual && value.validImage === false) fail('invalid-visual-bytes', role + ' has invalid image bytes', name);
    files.push({role, path:name, mediaType:/\.png$/i.test(name)?'image/png':/\.svg$/i.test(name)?'image/svg+xml':'text/plain'});
    return value;
  };
  const checkPrompt = (name, code, panelCount, combined = false, expectedPages = []) => {
    const value = read(name, combined ? 'contact-sheet-prompt' : 'page-prompt');
    if (!value) return;
    const source = value.text;
    if (typeof source !== 'string') { fail('unreadable-prompt', 'Prompt is not text', name); return; }
    const title = safeTitle(project?.meta?.title);
    if (title && !source.split(/\r?\n/).some(line => line.trim() === 'Work: ' + title))
      fail('wrong-work-prompt', 'Prompt does not identify the canonical work title', name);
    if (!source.includes('## TEXT TO RENDER')) fail('missing-text-allowlist', 'Prompt has no exact text allowlist', name);
    if (combined) {
      const seen=[...source.matchAll(/^# ===== (P\d{3}) =====\s*$/gm)].map(m=>m[1]);
      const expected=expectedPages.map(p=>pageCode(p.pageNumber));
      if (JSON.stringify(seen)!==JSON.stringify(expected))
        fail('batch-prompt-page-order', 'Merged prompt headings do not match the exact batch page order', name);
    }
    for (const canonicalPage of expectedPages) {
      for (const panel of canonicalPage.panels || []) {
        if (String(panel.actionIntent||'').trim() && !source.includes('ACTION: '+panel.actionIntent))
          fail('story-action-mismatch', pageCode(canonicalPage.pageNumber)+' is missing canonical story action for panel '+panel.order, name);
      }
    }
    if (!combined) {
      if (!source.split(/\r?\n/).some(line => line.trim() === 'Page: ' + code))
        fail('wrong-page-prompt', 'Prompt does not identify ' + code, name);
      const found = [...source.matchAll(/^## Panel \d+\s*$/gm)].length;
      if (found !== panelCount) fail('panel-brief-mismatch', code + ' has ' + panelCount + ' canonical panels but ' + found + ' panel briefs', name);
    }
  };
  if (manifest?.format !== 'manga-blueprint-name-package/2') fail('manifest-format', 'Expected headless Name package manifest');
  if (project?.format !== 'manga-blueprint/0.2') fail('project-format', 'Expected canonical manga-blueprint/0.2');
  const pages = Array.isArray(project?.pages) ? project.pages : [];
  const declared = Array.isArray(manifest?.pages) ? manifest.pages : [];
  if (!pages.length || pages.length !== declared.length) fail('page-inventory-mismatch', 'Manifest and project must list the same nonzero number of pages');
  for (let i = 0; i < Math.min(pages.length, declared.length); i++) {
    if (pages[i].id !== declared[i].pageId || pages[i].pageNumber !== declared[i].pageNumber)
      fail('page-identity-mismatch', 'Page identity/order disagree at index ' + i);
  }
  const title = safeTitle(project?.meta?.title);
  if (!title) fail('missing-work-title', 'Canonical project title is missing');
  if (!['rtl','ltr'].includes(project?.meta?.readingDirection)) fail('reading-direction', 'Canonical reading direction is invalid');

  if (target?.kind === 'contact-sheet') {
    if (generation?.schema !== 'manga-contact-sheet-generation-package/1')
      fail('package-schema', 'Expected contact-sheet generation package');
    if (generation?.ready === false || generation?.bindings?.missing?.length)
      fail('unready-package', 'Contact sheet reports unresolved reference bindings');
    const batches = manifest?.contactSheet?.batches || (manifest?.contactSheet ? [manifest.contactSheet] : []);
    const selected = batches.find(b => b.range === target.range) || (target.range ? null : (batches.length === 1 ? batches[0] : null));
    if (!selected) fail('batch-selection', 'Select an existing contact sheet range when multiple batches exist');
    if (selected) {
      const group = declared.filter(p => p.pageNumber >= selected.startPage && p.pageNumber <= selected.endPage);
      const expectedCodes = group.map(p => pageCode(p.pageNumber));
      if (selected.pageCount !== group.length || group.length > 8 || !group.length)
        fail('batch-page-count', 'Batch must cover 1 to 8 existing pages with matching count');
      const i = generation?.inputs || {};
      const selectedAsset = selected.png && readAsset(selected.png)?.exists ? selected.png : selected.clean;
      if (i.contactSheetAsset !== selected.clean && i.contactSheetAsset !== selected.png)
        fail('sheet-spatial-mismatch', 'Generation package points outside manifest Clean sheet', i.contactSheetAsset);
      const visual = read(selectedAsset, 'generation-facing-clean-contact-sheet', {visual:true});
      if (visual && /\.svg$/i.test(selectedAsset)) warn('raster-may-be-required', 'Confirm the image tool accepts SVG; otherwise rasterize before invoking it',selectedAsset);
      const annotated = selected.blueprint;
      if (selectedAsset === annotated || /blueprint|annotated/i.test(selectedAsset || ''))
        fail('annotated-input', 'Annotated image is not the generation-facing spatial authority',selectedAsset);
      if (i.promptAsset !== selected.prompt) fail('sheet-prompt-mismatch', 'Generation package prompt differs from manifest', i.promptAsset);
      if (i.reviewAsset !== selected.review) fail('sheet-review-mismatch', 'Generation package review path differs from manifest', i.reviewAsset);
      if (JSON.stringify(i.pageCleanAssets) !== JSON.stringify(group.map(p=>p.cleanBlueprint)))
        fail('sheet-page-visual-order', 'Page Clean assets differ from manifest or have wrong order');
      if (JSON.stringify(i.pagePromptAssets) !== JSON.stringify(group.map(p=>p.prompt)))
        fail('sheet-page-prompt-order', 'Page prompts differ from manifest or have wrong order');
      checkPrompt(selected.prompt, null, null, true,group.map(item=>pages.find(p=>p.pageNumber===item.pageNumber)));

      const review = read(selected.review, 'contact-sheet-review-map');
      if (review) {
        try {
          const parsed = JSON.parse(review.text);
          if (JSON.stringify(parsed.pageCells?.map(c => c.code)) !== JSON.stringify(expectedCodes))
            fail('sheet-review-order', 'Review map does not cover the same page order', selected.review);
        } catch {fail('invalid-review-json', 'Review request must be readable JSON', selected.review);}
      }
      for (const [index,p] of group.entries()) {
        const page = pages.find(q=>q.pageNumber===p.pageNumber);
        read(p.cleanBlueprint, 'page-clean-reference',{visual:true});
        checkPrompt(p.prompt, expectedCodes[index],page?.panels?.length ?? 0,false,[page]);
      }
      if (generation?.layout?.pageCount !== undefined && generation.layout.pageCount !== group.length)
        fail('generation-page-count', 'Generation package layout disagrees with selected batch');
    }
    if (generation?.constraints?.preserveInternalReadingDirection !== project?.meta?.readingDirection)
      fail('reading-mismatch', 'Contact generation request disagrees with canonical reading direction');
    if (generation?.constraints?.finalAcceptance !== false)
      fail('batch-not-preflight', 'Contact sheet may only be used for rough/preflight generation');
  } else if (target?.kind === 'page') {
    const pageNumber = target.pageNumber;
    const index = declared.findIndex(p=>p.pageNumber===pageNumber);
    if (index < 0) fail('unknown-page', 'Requested page does not exist: ' + pageNumber);
    else {
      const p=declared[index],page=pages[index],i=generation?.request?.inputs||{};
      if (generation?.schema !== 'manga-generation-package/1') fail('package-schema', 'Expected single-page generation package');
      if (generation?.ready === false || generation?.bindings?.missing?.length)
        fail('unready-package', 'Page generation reports unresolved reference bindings');
      if (generation?.request?.pageId !== p.pageId) fail('page-package-identity', 'Generation request pageId does not match manifest');
      if (i.cleanAsset !== p.cleanBlueprint && i.cleanAsset !== p.cleanBlueprint?.replace(/\.svg$/,'.png'))
        fail('page-clean-mismatch', 'Generation request clean asset differs from manifest',i.cleanAsset);
      if (i.prompt !== p.prompt) fail('page-prompt-mismatch', 'Generation request prompt differs from manifest',i.prompt);
      const preferredPng = p.cleanBlueprint?.replace(/\.svg$/,'.png');
      const primary = preferredPng && readAsset(preferredPng)?.exists ? preferredPng : i.cleanAsset;
      const visual = read(primary,'generation-facing-clean-page',{visual:true});
      if (visual && /\.svg$/i.test(primary)) warn('raster-may-be-required','Confirm image tool accepts SVG or rasterize first',primary);
      if (/blueprint|annotated/i.test(primary||'')) fail('annotated-input','Use Clean, not Annotated',primary);
      checkPrompt(p.prompt,pageCode(pageNumber),page?.panels?.length??0,false,[page]);
      if (i.letteringAsset) read(i.letteringAsset,'lettering-overlay');
      if (i.letteringPlan) read(i.letteringPlan,'lettering-plan');
      if (generation?.request?.constraints?.preserveReadingDirection !== project?.meta?.readingDirection)
        fail('reading-mismatch','Page generation request disagrees with canonical reading direction');
    }
  } else fail('unknown-target', 'Target kind must be contact-sheet or page');

  const referenced = target?.kind === 'page' ? generation?.request?.inputs?.references : generation?.inputs?.references;
  for (const ref of referenced || []) if (ref?.asset) read(ref.asset,'character-reference',{visual:true});
  const unrefined = (manifest?.characters || []).filter(c=>c.needsRefinement);
  if (unrefined.length) warn('identity-needs-refinement', 'Some character identities still lack appearance guidance: '+unrefined.map(c=>c.token).join(', '));
  const nameSource = manifest?.source;
  const root = manifest?.project;
  if (root) read(root,'canonical-project');
  if (!root || unsafe(root)) fail('project-path', 'Manifest must point to canonical project');
  if (generation?.ready === false) fail('unready-package','Generation package is marked unready');
  const uniqueFiles = uniq(files.map(f => f.role + ':' + f.path)).map(key => files.find(f => f.role + ':' + f.path === key));
  return {
    schema:'manga-generation-handoff-preflight/1',
    target,
    work:title,
    pageCount:pages.length,
    readingDirection:project?.meta?.readingDirection || null,
    status:errors.length?'blocked':'prepared-not-attached',
    readyForModel:false,
    attachmentVerification:'REQUIRED: caller must attach the actual resolved Clean visual and the complete exact semantic prompt to the image-model invocation; file paths alone do not count',
    imageRole:'Clean only; Annotated is human-review only',
    files:uniqueFiles,
    source:nameSource || null,
    errors,warnings
  };
}
