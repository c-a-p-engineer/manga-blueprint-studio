from pathlib import Path

# Fix stale five-column mobile page navigation and title tooltip.
path=Path('web/runtime/ui/editor-shell.js')
text=path.read_text()
old="@media(max-width:430px){.editor-context-actions17 #workLibraryBtn16{font-size:11px}.editor-structure-button17{font-size:11px}.editor-page-line17{grid-template-columns:36px minmax(110px,1fr) 36px 36px auto;gap:4px}.editor-page-line17 button{padding:4px 6px}}"
new="@media(max-width:430px){.editor-context-actions17 #workLibraryBtn16{font-size:11px}.editor-page-line17{grid-template-columns:36px minmax(110px,1fr) 36px 36px;gap:4px}.editor-page-line17 button{padding:4px 6px}}"
if old not in text: raise SystemExit('mobile grid anchor missing')
text=text.replace(old,new,1)
text=text.replace(".compact17{font-size:20px;line-height:1}.editor-current-page17{font-weight:850;text-align:left}.editor-structure-button17{justify-self:start}",".compact17{font-size:20px;line-height:1}.editor-current-page17{font-weight:850;text-align:left}",1)
old="$('currentWorkButton17').textContent=title;$('currentWorkButton17').title=esText17('workLibrary');"
new="$('currentWorkButton17').textContent=title;$('currentWorkButton17').title=esText17('structure');"
if old not in text: raise SystemExit('work title anchor missing')
text=text.replace(old,new,1)
path.write_text(text)

# Keep public guide aligned with the actual explorer entry point.
path=Path('web/guide.html')
text=path.read_text()
old='作品名をタップすると作品一覧を開けます。'
new='作品名をタップすると作品エクスプローラーを開けます。'
if old not in text: raise SystemExit('guide explorer anchor missing')
path.write_text(text.replace(old,new,1))

# Remove temporary files from the final branch state.
for temp in ['.github/workflows/fix-ux-0.16.4.yml','scripts/fix-ux-0.16.4.py']:
    p=Path(temp)
    if p.exists(): p.unlink()
