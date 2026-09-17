# AI Name DSL

Manga Blueprint Studio accepts a lightweight semantic DSL intended primarily as **AI output**, not as the prose format a human must author by hand.

## Pipeline

```text
human natural-language name / request
        ↓
ChatGPT / coding agent
        ↓
AI Name DSL
        ↓
CLI + Blueprint Engine + manga expression grammar
        ↓
canonical manga-blueprint/0.2
        ↓
clean spatial visual + annotated review visual + prompt + manifest
```

The AI describes **manga intent**. It should not calculate IDs, joint coordinates, polygon points, or exact pixel placement when the compiler can derive them.

## Page syntax

```md
# Page 1: title
@layout: auto|vertical|grid|hero-bottom|hero-top
@background: classroom
@time: day
```

`@layout` is a bounded hint, not raw geometry. `auto` lets the compiler choose from the current grammar.

## Panel syntax

```md
コマ1: 少女が相手へ踏み込む
登場: girl@right, boy@left
強調: strong
コマサイズ: dominant
境界: diagonal-right
カメラ: close low-angle
ポーズ: girl> lean-forward reaching-right-hand
ポーズ: boy> recoil
視線: girl> boy.face
視線: boy> girl.right-hand
前後: girl> foreground
前後: boy> background
支持: girl> grounded
動作段階: girl> approach
接触: girl.right-hand > boy.left-shoulder
表情: girl> determined
効果音: ドン
演出: impact
```

Supported semantic fields:

- `コマN:` / `Panel N:` — story beat / action intent.
- `セリフ:` / `dialogue:` — exact visible dialogue, optionally `speaker> text`.
- `強調:` / `emphasis:` — `normal | strong | climax`.
- `コマサイズ:` / `size:` — `auto | small | medium | large | dominant | hero`; the compiler resolves geometry.
- `境界:` / `shape:` / `コマ形:` — `rectangle | diagonal-left | diagonal-right | trapezoid-left | trapezoid-right`.
- `インセット:` / `inset:` — parent panel plus anchor/size, e.g. `parent panel 1 top-left small`.
- `登場:` / `cast:` — comma-separated `token@slot`; coarse slots are `left | center | right | foreground | background`.
- `ポーズ:` / `pose:` — `token> semantic-pose`. Prefer short visual/action semantics, not joint coordinates.
- `表情:` / `expression:` — `token> description`.
- `視線:` / `gaze:` — `token> target`, e.g. `girl> boy.face`.
- `前後:` / `depth:` — `token> foreground | front | back | background`.
- `支持:` / `support:` — `token> grounded | airborne | supported | unknown`.
- `動作段階:` / `motion:` — `token> still | anticipation | approach | launch | airborne | impact | recovery`.
- `接触:` / `contact:` — body/prop relation. Preferred form: `source.part > target.part`.
- `カメラ:` / `camera:` — semantic distance/angle/viewpoint keywords.
- `背景:` / `background:` — panel-local background override.
- `効果音:` / `sfx:` — exact renderable SFX.
- `演出:` / `effect:` — line/effect intent.

## Insets

Insets are expressed semantically rather than by coordinates:

```md
コマ3: 目だけを見せる反応
登場: girl@center
インセット: parent panel 2 top-left small
カメラ: extreme-close
```

The compiler resolves the parent ID, anchor, size, rectangle and canonical `panel-in-panel` relation.

## Contact and pose rule

Contact is a relationship, not merely prose. When possible use:

```text
接触: girl.right-hand > boy.left-shoulder
```

The compiler preserves this as structured interaction metadata in canonical project state. Pose, gaze, support, motion phase and depth remain separately addressable so an image-model prompt adapter can reconstruct the intended body mechanics without reverse-engineering one long sentence.

## Character tokens

Character tokens are semantic handles, not finished display names. The compiler creates reusable characters in `description` mode when first encountered. Identity/appearance/reference binding can be refined independently from panel choreography.

## Authority

The DSL is an AI-facing authoring IR, not persistent project authority. After compilation, `manga-blueprint/0.2` is canonical. The Web editor is an optional GUI client over that project state; the CLI/Engine path is the primary automation path.
