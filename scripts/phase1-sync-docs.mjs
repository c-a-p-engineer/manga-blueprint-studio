import fs from 'node:fs';

const read=path=>fs.readFileSync(path,'utf8');
const write=(path,text)=>fs.writeFileSync(path,text.endsWith('\n')?text:`${text}\n`);
const mustReplace=(path,text,from,to)=>{
  if(!text.includes(from))throw new Error(`${path}: missing replacement anchor ${JSON.stringify(from.slice(0,120))}`);
  return text.replace(from,to);
};
const appendOnce=(text,marker,block)=>text.includes(marker)?text:`${text.trimEnd()}\n\n${block.trim()}\n`;

{
  const path='README.md';let text=read(path);
  text=mustReplace(path,text,'## Current prototype: 0.16.4','## Current prototype: 0.17.0');
  text=mustReplace(path,text,
    'Prototype **0.16.4** simplifies the authoring flow again: Story Template cards now live in the upper panel-layout area with the sample-dialogue/SFX checkbox, cast selection, and an always-visible apply button. The active work title now opens a file-explorer-style Work Explorer that combines work switching and page navigation; the separate volume/chapter/folder editor is no longer a primary UI surface. Prototype 0.16.3 remains the starter-character/cast-selection release.',
    'Prototype **0.17.0** starts the TypeScript + Vite cutover and makes the template workflow the primary Page-settings task. Story Template selection, sample dialogue/SFX choice, cast selection, and the apply CTA now live in one task-first surface; manual panel layout is secondary. The legacy volume/chapter/folder editor is removed from the primary Page UI while existing hierarchy data remains readable in Work Explorer.');
  text=text.replaceAll('作品構成 / Work Structure','作品エクスプローラー / Work Explorer');
  text=text.replaceAll('**作品構成**','**作品エクスプローラー**');
  text=appendOnce(text,'### Phase 1 runtime migration',`### Phase 1 runtime migration\n\nThe production site is now built with **Vite + TypeScript**. \`web/app.js\` is a thin entry shim, \`web/src/main.ts\` owns bootstrap/build provenance, and the existing \`web/runtime/*.js\` files remain a validated compatibility/reference layer during migration. Production runtime chunk cache keys include both app version and deployed commit so same-version source changes cannot silently reuse stale chunks.`);
  write(path,text);
}

{
  const path='docs/ROADMAP.md';let text=read(path);
  text=mustReplace(path,text,'## Shipped through Prototype 0.16.4','## Shipped through Prototype 0.17.0');
  text=mustReplace(path,text,'### Manga authoring\n\n','### Manga authoring\n\n- **Prototype 0.17.0 Phase 1 runtime/UI cutover**: Vite + TypeScript production entry, commit-aware cache busting, template-first Page settings, explicit apply CTA, progressive disclosure for manual layout, and removal of the legacy hierarchy editor from the primary Page surface;\n');
  text=appendOnce(text,'### Runtime migration track',`### Runtime migration track\n\nPrototype 0.17.0 establishes the migration boundary: TypeScript/Vite owns the production entry and new UI composition while the current classic-script runtime remains the behavioral reference. Later migration work should move semantic owners to typed ES modules incrementally, preserving export/project contracts and keeping rollback/reference coverage until equivalence is proven.`);
  write(path,text);
}

{
  const path='AGENTS.md';let text=read(path);
  text=mustReplace(path,text,
    'The app is a zero-build static GitHub Pages application. `web/app.js` loads ordered classic-script chunks from `web/runtime/`.',
    'The app is a Vite-built static GitHub Pages application. `web/app.js` is a thin entry shim into `web/src/main.ts`; TypeScript owns bootstrap and new UI composition. Ordered classic-script chunks under `web/runtime/` remain a temporary compatibility/reference layer during the Phase 1 migration and are copied into the production artifact.');
  text=mustReplace(path,text,
    '- preserve explicit load order unless deliberately refactoring the runtime;',
    '- preserve the explicit legacy runtime load order while that compatibility layer exists, unless deliberately migrating an owner to typed ES modules with behavior-equivalence evidence;');
  write(path,text);
}

{
  const path='docs/ARCHITECTURE.md';let text=read(path);
  text=mustReplace(path,text,
    'Manga Blueprint Studio is a zero-build static web application served by GitHub Pages.\n\n`web/app.js` loads ordered classic-script chunks from `web/runtime/`. There is currently no application server, framework build step, external runtime script, analytics client, or image-generation API in the core app.\n\nThe explicit script order is a compatibility contract because later chunks intentionally extend globals established by earlier chunks. Runtime chunk URLs include the current application version so a new release does not silently reuse stale cached feature chunks.',
    'Manga Blueprint Studio is a static GitHub Pages application built with Vite.\n\n`web/app.js` is a thin module entry that delegates to `web/src/main.ts`. TypeScript owns build provenance, runtime startup, and the first task-first UI composition layer. The existing classic-script chunks under `web/runtime/` remain a compatibility/reference runtime during Phase 1 rather than being falsely treated as already migrated ES modules.\n\nThe explicit legacy script order remains a compatibility contract because later chunks intentionally extend globals established by earlier chunks. Production chunk URLs now include both the application version and deployed commit revision, while the Vite entry itself receives a hashed asset URL. This closes the same-version stale-cache gap observed on GitHub Pages.');
  text=text.replace('`scripts/runtime-paths.mjs` mirrors semantic owners for validators.','`web/src/legacy-runtime.ts` is the production compatibility loader, while `scripts/runtime-paths.mjs` mirrors semantic owners for validators.');
  text=text.replace('`handoff/producer-provenance.js` reads build metadata established by `web/app.js`/`web/build-info.json`','`handoff/producer-provenance.js` reads build metadata established by `web/src/main.ts`/`web/build-info.json`');
  text=appendOnce(text,'### Phase 1 typed UI owner',`### Phase 1 typed UI owner\n\n`+
`\`web/src/phase-one-ui.ts\` owns the new primary Page-settings composition boundary. It keeps the Story Template task together (template → sample dialogue/SFX choice → cast → apply), demotes manual panel layout behind progressive disclosure, and removes the legacy hierarchy editor from the primary Page surface without deleting compatible serialized hierarchy data. It deliberately calls existing canonical template-application functions rather than introducing a second template state model.\n\n`+
`The migration boundary is intentionally asymmetric: new composition code must be TypeScript/ESM; existing runtime owners remain classic scripts until migrated with characterization/equivalence coverage. This makes the old runtime a reference implementation instead of pretending a flag-day rewrite is complete.`);
  write(path,text);
}

{
  const path='docs/PRODUCT.md';let text=read(path);
  text=appendOnce(text,'## Prototype 0.17.0 — template-first Page settings',`## Prototype 0.17.0 — template-first Page settings\n\nThe primary Page-settings task is now **Story Template first**:\n\n1. choose a Story Template card (panel layout + direction/presentation);\n2. choose whether sample dialogue/SFX is used;\n3. choose the reusable character cast;\n4. press the explicit full-width apply action.\n\nBrowsing remains non-mutating. Manual panel-layout controls remain available behind progressive disclosure for direct editing. The legacy volume/chapter/folder editor is not a primary Page-settings surface; existing hierarchy data remains compatible and is navigated through **Work Explorer / 作品エクスプローラー**.\n\nThe production shell is now built through Vite with a TypeScript entry. This is a migration boundary, not a claim that every legacy runtime owner is already converted.`);
  write(path,text);
}

{
  const path='docs/USER-GUIDE.md';let text=read(path);
  text=appendOnce(text,'## Prototype 0.17.0: テンプレートから始める',`## Prototype 0.17.0: テンプレートから始める\n\nページ設定では、まず **テンプレートからページを作る** の流れを使うのが最短です。\n\n1. Story Templateカードを選ぶ。\n2. **サンプルのセリフ・効果音を使う** のチェックで、テンプレートの台詞/SFXを入れるか決める。\n3. 使用するキャラクター（必要なら2人目）を選ぶ。\n4. **このテンプレートを使う** を押す。\n\nこれでコマ割り・演出・必要なサンプル台詞を現在ページへまとめて適用できます。直接コマ割りを編集したい場合だけ **手動でコマ割りを調整** を開きます。旧「巻・章・フォルダ」編集欄はページ設定には表示せず、作品名から開く **作品エクスプローラー** をページ移動・作品切替の主経路にします。`);
  write(path,text);
}

{
  const path='web/runtime/README.md';let text=read(path);
  text=appendOnce(text,'## Phase 1 TypeScript/Vite bridge',`## Phase 1 TypeScript/Vite bridge\n\nPrototype 0.17.0 keeps this directory as the compatibility/reference runtime while the production entry moves to Vite + TypeScript. `+
`\`web/src/legacy-runtime.ts\` owns ordered loading and commit-aware cache busting. New top-level UI composition belongs in typed source under \`web/src/\`; do not add another chronology-named runtime patch file for Phase 1 presentation fixes.`);
  write(path,text);
}

{
  const path='web/guide.html';let text=read(path);
  if(!text.includes('id="phase1-template-guide"')){
    const block=`\n      <section id="phase1-template-guide">\n        <h2>テンプレートからページを作る</h2>\n        <ol class="steps">\n          <li><strong>Story Templateを選ぶ</strong><span>コマ割り・演出をカードからまとめて選びます。</span></li>\n          <li><strong>セリフとキャラを決める</strong><span>「サンプルのセリフ・効果音を使う」のチェックと、使用キャラクターを選びます。</span></li>\n          <li><strong>このテンプレートを使う</strong><span>大きな適用ボタンで現在ページへ反映します。直接編集したいときだけ「手動でコマ割りを調整」を開きます。</span></li>\n        </ol>\n        <p>旧「巻・章・フォルダ」編集欄はページ設定には表示しません。作品名を押して開く <strong>作品エクスプローラー</strong> から作品・ページを移動します。</p>\n      </section>\n`;
    if(!text.includes('</main>'))throw new Error(`${path}: missing </main>`);
    text=text.replace('</main>',`${block}</main>`);
  }
  write(path,text);
}

fs.rmSync('scripts/phase1-sync-docs.mjs',{force:true});
fs.rmSync('.github/workflows/phase1-sync.yml',{force:true});
console.log('Phase 1 documentation sync complete.');
