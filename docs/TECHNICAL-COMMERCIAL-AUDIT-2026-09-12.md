# Technical / Cost / Commercial Audit — 2026-09-12

This document is a dated planning snapshot, not a competing roadmap authority. Delivery status remains canonical in `docs/ROADMAP.md`.

## Executive decision

- Keep the browser/editor core in **TypeScript**.
- Continue retiring the ordered classic-script/global runtime incrementally instead of performing a full Rust/Go rewrite.
- Treat a future paid desktop product as a **separate shell/product boundary**, with **Tauri 2 + Rust** as the leading candidate and the existing Vite/TypeScript UI/core reused inside it.
- Keep the public Web edition low-cost/local-first as the acquisition and compatibility surface.
- Do not introduce a required cloud backend until a paid feature actually needs one.
- Before charging users, prioritize recoverability, deterministic project storage, tests around real user behavior, and release/signing/licensing operations over adding more authoring features.

## Current technical state

The production entry is Vite + TypeScript, but `web/src/legacy-runtime.ts` still loads the compatibility runtime as an explicitly ordered sequence of classic scripts. The same runtime list is also represented for repository validation in `scripts/runtime-paths.mjs`.

The highest-risk transitional area is `web/src/phase-one-ui.ts`: it composes new UI by querying, moving, hiding, and re-parenting legacy DOM, bridges to global runtime functions, and uses a `MutationObserver` to resynchronize surfaces. This was useful for the Phase 1 cutover but should not become the permanent paid-product architecture.

### Risk register

| Area | Current risk | Direction |
|---|---|---|
| UI ownership | TypeScript shell and classic runtime both own pieces of the same DOM | Move each authoring surface to one declarative owner |
| Runtime dependencies | 40+ classic chunks depend on load order and globals | Move domain functions behind typed ES-module boundaries |
| State mutation | Legacy globals and DOM events make mutation paths implicit | Introduce typed commands/services and explicit mutation boundary |
| Runtime list | Browser and validation maintain parallel runtime-order representations | Move to one canonical runtime manifest while legacy loading exists |
| Testing | Strong source/contract validators, weak real interaction coverage | Add unit/domain tests first; targeted browser E2E at release boundaries |
| Schema/types | JSON Schema is canonical but TypeScript domain types are not generated from it | Add generated/validated TS domain boundary without changing format |
| Release | Public web deploy is simple; commercial desktop has no release/sign/license path yet | Keep desktop release pipeline separate and release-triggered |

## Refactor target

Target repository shape before/while introducing Desktop:

```text
apps/
  web/                    # public Vite application
  desktop/                # private/commercial Tauri shell (may live in a separate private repo)
packages/
  core/                   # project/page/panel/template domain, no DOM
  editor/                 # commands, selection, undo/redo, authoring services
  handoff/                # render brief / manifest / export contracts
  ui/                     # declarative web editor UI
adapters/
  indexeddb/              # Web persistence
  native/                 # Desktop capability adapter
```

Do not move everything at once. The existing runtime remains the reference implementation until each migrated slice has equivalent deterministic tests.

## CI/CD cost baseline

As of this audit the repository is public. GitHub documents standard GitHub-hosted runners as free for public repositories, and GitHub Pages is available for public repositories on GitHub Free. Therefore the current direct GitHub CI/hosting cash cost is effectively **USD 0**.

For private repositories, GitHub currently lists standard runner prices of approximately:

- Linux 2-core: **USD 0.006/min**
- Windows 2-core: **USD 0.010/min**
- macOS standard: **USD 0.062/min**

GitHub bills partial job minutes by rounding each job up to a whole minute. Included private-repository minutes depend on plan.

The active development day 2026-09-12 had 24 Actions workflow runs by the time of this audit. Most normal validation/deploy jobs complete well under one minute, so the same short-job pattern in a private repository would be roughly 24 billable job-minutes before plan allowances, or about USD 0.144 if all were Linux jobs. This is not a normal-month forecast; it includes a concentrated development session.

### CI refactor in this branch

This branch establishes a cost/maintenance baseline:

- one canonical local/CI command: `npm run validate`;
- `npm ci` instead of `npm install` in CI;
- npm dependency caching;
- PR concurrency cancellation so superseded commits do not keep running;
- master no longer runs a separate duplicate validation workflow; the Pages workflow validates and builds once before deployment;
- validation stays in one Linux job, avoiding per-job billing rounding multiplication in a future private repository.

A typical private-repo flow after this change is one Linux job for a PR head and one Linux job for the eventual master deployment. At current rates that is a minimum of about USD 0.012 before included minutes, rather than adding a second master validation job.

## Language / framework decision

### TypeScript — keep as the product core

The editor is fundamentally browser/SVG/DOM-heavy, and Web remains an important free distribution surface. Rewriting the core in Rust, Go, C#, Dart, or Elixir would throw away mature browser code without reducing current hosting cost.

### Rust — use selectively for paid Desktop native capabilities

Tauri 2 supports existing web frontends and Rust application logic across desktop platforms. Rust is justified for native filesystem operations, packaging, OS integration, updater/signing integration, local process bridges, and performance-sensitive native work. It is not justified as a wholesale replacement for the current editor UI/domain solely to save money.

### Go / Wails — credible alternative, not current first choice

Go would likely provide simpler/faster native builds, but Wails v3 is still documented as beta as of this audit. Reconsider if Desktop becomes strictly Windows/macOS and build simplicity proves more important than Tauri's ecosystem/cross-platform direction.

### Elixir — reserve for a future service boundary

Elixir would make more sense for collaboration, job orchestration, realtime sessions, or cloud synchronization than for the local editor/Desktop shell. Do not add it before those requirements exist.

## Desktop commercialization model

Recommended product split:

| Capability | Free Web | Paid Desktop Pro |
|---|---:|---:|
| Core manga authoring / Story Templates | yes | yes |
| Open project format / data portability | yes | yes |
| Backup / Restore | yes | yes |
| Single-page AI handoff | yes | yes |
| Native project folders / file watching | no | yes |
| Automatic local backup / version history | limited/browser | yes |
| Multi-page / range batch export | limited | yes |
| Reference asset library with native files | no | yes |
| Local tool / CLI / ComfyUI-style integration | no | yes |
| Release-quality offline workflow | browser constraints | yes |
| Auto-update / signed installers | no | yes |

Keep user data safety and portability free. Charge for workflow acceleration, native integration, batch capability, and professional convenience rather than locking project files behind a license.

### Payment and licensing

A Merchant of Record is attractive for a solo/small product because it can absorb international sales-tax/VAT handling. Paddle currently advertises **5% + USD 0.50 per checkout transaction** and acts as Merchant of Record. Re-check pricing before launch.

Recommended first licensing model:

- one-time Desktop Pro purchase with a defined update window, rather than a subscription with no recurring cloud value;
- license capability is checked at the Desktop boundary, not scattered through editor UI conditions;
- signed license token with offline verification/grace behavior;
- optional activation service only if device limits become necessary;
- never make an always-online license check a requirement for opening user projects.

Pricing is a hypothesis to validate, not a product contract. A reasonable experiment is an early-access one-time price around JPY 4,980–6,980, then a stable Pro price around JPY 8,800–12,800 depending on native/batch features. A recurring plan should wait for recurring cloud value such as sync, collaboration, hosted generation, or managed asset services.

### Platform launch order

Start **Windows-first** for paid Desktop unless user demand clearly requires macOS at launch. A Windows-first launch avoids paying for and maintaining a macOS signing/notarization/release lane before demand exists. Tauri preserves the option to add macOS later. Apple currently lists the Developer Program at USD 99/year; macOS Actions runners are also materially more expensive than Linux/Windows in a private repository.

## Task inventory produced by this audit

| Priority | Track | Task | Exit condition |
|---|---|---|---|
| P0 | Reliability | Central CI entrypoint and deduplicated master validation | `npm run validate` equals CI; PR + master paths green |
| P0 | Architecture | Canonical runtime manifest | Browser loader and validators derive from one ordered manifest |
| P0 | Architecture | Typed project/domain boundary | Project/Page/Panel/Inset/Template types and invariants no longer depend on globals/DOM |
| P0 | Architecture | Command/mutation boundary | Authoring actions route through explicit typed commands compatible with Undo/Redo |
| P0 | UI | Retire `MutationObserver` composition ownership | Template/Page/Panel surfaces have one owner; no DOM re-parenting synchronization loop |
| P0 | Testing | Domain behavioral tests | Template apply, inset semantics, page clone/delete, order, export contracts run as behavior tests |
| P0 | Product safety | Backup / Restore | Phase 3 roadmap acceptance criteria shipped before paid launch |
| P1 | UI | Declarative editor shell evaluation | React/Preact/Lit decision based on migration prototype, not preference |
| P1 | Product | Inset P1 | position/size presets, parent resize following, template integration |
| P1 | Desktop | Tauri Windows spike | same project opens/saves via native path; current Web remains unchanged |
| P1 | Desktop | Capability adapter | Web and Desktop native features selected through typed capabilities |
| P1 | Commercial | Free/Pro feature contract | no data lock-in; paid boundaries testable independently of UI |
| P1 | Commercial | Checkout/license proof | sandbox purchase → signed license → offline verification |
| P1 | Release | Windows signing/update pipeline | signed installer + release-only build + rollback/update procedure |
| P2 | Product | Scoped Export | selected pages/ranges/containers/work export |
| P2 | Desktop | macOS demand gate | add macOS only after demand justifies Apple/signing/CI overhead |
| P2 | Product | Panel-first / Hybrid | deterministic unit generation/recomposition contract |
| Later | Cloud | Optional sync/collaboration | introduce backend only with explicit recurring-value requirement |

## Recheck gates

Re-evaluate stack replacement only if at least two of these become true:

- TypeScript/browser runtime cannot satisfy a required native/performance contract;
- measured runtime hot spots justify a native module;
- Desktop becomes the dominant product and Web becomes secondary;
- the legacy compatibility layer has been removed enough that migration cost is bounded;
- team/tooling constraints materially favor a different runtime.

Until then, a wholesale language rewrite is a cost increase, not a cost optimization.

## Pricing sources checked on 2026-09-12

- GitHub Actions billing: https://docs.github.com/billing/managing-billing-for-github-actions/about-billing-for-github-actions
- GitHub Actions runner pricing: https://docs.github.com/en/billing/reference/actions-runner-pricing
- GitHub Pages availability/limits: https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits
- Tauri 2: https://v2.tauri.app/
- Wails v3: https://v3.wails.io/
- Paddle pricing: https://www.paddle.com/pricing
- Apple Developer Program: https://developer.apple.com/help/account/membership/program-enrollment/
