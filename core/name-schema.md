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
重要度: narrative=0.7, visual=0.9, transition=0.5
間: 0.3
主注目: girl.right-hand
副注目: boy.face
視線入口: top-right
視線出口: bottom-left
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
- `重要度:` / `importance:` — three optional weights: `narrative`, `visual`, `transition`. Each accepts `0..1` or `low | medium | high | climax`. These are **layout/attention weights**, not direct size commands.
- `間:` / `hold:` / `滞留:` — desired perceptual hold time from `0..1` or qualitative weight. Useful for reaction beats and pauses that are not story-dominant.
- `主注目:` / `primary attention:` — the first visual target the reader should acquire inside the panel.
- `副注目:` / `secondary attention:` — secondary target after the primary attention point.
- `視線入口:` / `entry:` — coarse panel-entry target/direction such as `top-right`, `face`, `weapon`.
- `視線出口:` / `exit:` — coarse panel-exit target/direction used to connect to the next panel.
- `強調:` / `emphasis:` — legacy shorthand `normal | strong | climax`; the expression grammar also uses it as a bounded importance hint.
- `コマサイズ:` / `size:` — `auto | small | medium | large | dominant | hero`; explicit human/AI override when size itself is authored intent.
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

## Importance, energy and layout

The compiler does not map `importance=high` directly to “make this a large panel”. Instead it derives a bounded panel-energy score from narrative, visual and transition importance plus hold time. The score is stored in canonical state together with the delta from the previous beat.

That distinction matters because manga pacing is relative. A panel can be narratively minor but transition-heavy, or visually minor but deliberately held for a pause. Layout selection should compare neighboring beats and page context instead of independently converting each score into area.

Example:

```md
コマ1: 二人が対峙する
重要度: narrative=0.3, visual=0.4, transition=0.3
間: low

コマ2: 剣士Aが踏み込む
重要度: narrative=0.5, visual=0.7, transition=0.9
間: low

コマ3: 剣同士が激突する
重要度: narrative=0.8, visual=1.0, transition=0.5
主注目: fighter-a.sword
副注目: fighter-b.face
視線入口: top-right
視線出口: bottom-left

コマ4: 無言の目アップ
重要度: narrative=0.2, visual=0.5, transition=0.6
間: high

コマ5: 必殺技
重要度: narrative=1.0, visual=1.0, transition=0.2
間: medium
```

The intended downstream solver model is:

```text
story beats
  → importance / hold
  → attention targets
  → gaze + motion + reading flow
  → layout candidates
  → candidate scoring
  → canonical panel geometry
```

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
