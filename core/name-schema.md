# AI Name DSL

Manga Blueprint Studio accepts a lightweight text DSL for AI/human co-authoring.

## Goals

- do not require coordinates or IDs from the author;
- keep authored manga intent readable in plain text;
- compile deterministically into canonical `manga-blueprint/0.2` project state;
- keep the Web editor optional: `.manga.json` remains importable/editable there;
- let an AI revise story beats without directly manipulating pixel geometry.

## Syntax

```md
# Page 1: title
@layout: auto|vertical|grid|hero-bottom|hero-top
@background: classroom
@time: day

コマ1: 少女がスマホを見る
登場: girl@right
カメラ: close high-angle
セリフ: girl> ……え？
強調: normal

コマ2: 画面の内容に気づく
登場: girl@center
表情: girl> shock
強調: strong

コマ3: スマホを落とす
登場: girl@center
セリフ: girl> そんな……
強調: climax
```

## Directives

Page directives begin with `@`.

- `@layout`: optional layout hint. `auto` keeps compiler selection.
- `@background`: default location for panels on the page.
- `@time`: default time of day for panels on the page.

Panel fields:

- `コマN:` / `Panel N:` — action/beat.
- `セリフ:` / `dialogue:` — visible dialogue. `speaker> text` optionally records a speaker token.
- `強調:` / `emphasis:` — `normal | strong | climax`.
- `登場:` / `cast:` — comma-separated `token@slot` entries; slot is `left | center | right | foreground | background`.
- `表情:` / `expression:` — `token> description`.
- `カメラ:` / `camera:` — free text with recognizable distance/angle keywords.
- `背景:` / `background:` — panel-local background override.
- `効果音:` / `sfx:` — exact renderable SFX.
- `演出:` / `effect:` — free effect hint; common words map to line effects.

## Character tokens

Character tokens are semantic handles, not finished display names. The compiler creates reusable characters in `description` mode when first encountered. An AI or human may later refine appearance in the Web editor or the resulting JSON.

## Authority

The DSL is an authoring convenience, not a competing saved-project format. `manga-blueprint/0.2` remains the canonical project state after compilation.
