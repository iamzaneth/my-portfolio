# Repository cleanup record

October 27, 2026. Cleanup of the latest working portfolio; no push, deployment, staging, or history reset.

## Baseline and preservation

The starting working tree already contained the earlier redesigns, compact project dialog, mascot continuity work, and untracked feature/test files. Its status, complete tracked diff, 92-file inventory, and text snapshot were recorded under ignored `artifacts/cleanup/` before source changes. Baseline lint, production build, fixture build, and **113 browser tests passed**.

The source import graph had 34 reachable application modules and no orphan modules. CSS inspection was cross-checked against template-generated skill classes, conditional content, data attributes, animation names, asset URLs, build scripts, fixtures, and documentation. Dynamically generated skill styles were retained. The mascot state machine, motion controller, sprite renderer, atlas catalog, content, public URLs, and section IDs retain their behavior.

All 11 files under `public/` and `assets/source/` are protected by before/after SHA-256, size, and modification-time checks. This includes the original avatar, served avatar, CV, favicon, both fonts and their licenses, atlas, artist license, and attribution. The external source-pack download and regeneration procedure remains in the mascot attribution and README.

## Removed and consolidated

| Files or area | Verifiable reason |
| --- | --- |
| `src/features/projects/ProjectDetails.tsx` | A nine-line story mapper with one consumer; its unchanged `dl` markup is now in the modal that owns it |
| `src/styles/motion.css` | Contained only mobile-menu rules; merged into `navigation.css` |
| `motion.micro` | No references; removed the unused timing property |
| `CatPosture`, `catPosture`, `CatState`, `CatEvent`, `PipelineStage` exports | Used only within their defining modules; made implementation details private without changing logic |
| `.pipeline-title strong span` | Impossible for the current string-only title rendering |
| `.project-stack-more` | Its color was always overridden by the shared technology-list selector; removed the ineffective rule and marker class |
| `scripts/inspect-portfolio.mjs`, `inspect-composition.mjs`, `inspect-projects.mjs`, `inspect-section-transitions.mjs` | Overlapping historical capture tools; replaced by one maintained `npm run capture` command |
| `scripts/measure-portfolio.mjs` | One-off redesign profiling/report generator; ongoing production transfer, layout stability, and DOM budgets remain tested |
| Seven dated redesign reports | Superseded execution history with stale paths and generated evidence; current architecture/content/setup guidance is in README and this record |
| Old generated screenshots, comparisons, profiling files, migration/debug scripts, and root test reports | Not runtime assets or regression fixtures; inventoried and hashed before deletion |

The removed reports were `balanced-showcase.md`, `compact-projects.md`, `cosmic-atmosphere.md`, `editorial-composition.md`, `nebula-refinement.md`, `portfolio-redesign.md`, and `section-transitions.md`. None contained required license notices. The current reports and raw deletion inventory stay under `artifacts/cleanup/`.

Generated cleanup removed **756 files / 153,766,375 bytes**. Every recursive target and descendant was checked to remain within this checkout; links were rejected. Current cleanup evidence and the active fixture build were preserved. No generated artifacts were tracked in Git.

After verification, another 83 intermediate files created during this cleanup were removed because the baseline/final captures and complete final report supersede them. Their separate [inventory](../artifacts/cleanup/removed-intermediate-files.json) records paths, hashes, and reasons.

## Organization

- Moved the five page sections from `src/components/` to `src/sections/`. Shared `Navbar` and `SectionHeading` remain in `components/`.
- Moved mascot/project CSS beside their features and extracted skill styling beside `SkillDisclosure`.
- Renamed `portfolio.css` to `sections.css`; shared technology-list primitives now live in `utilities.css`.
- Centralized the identical mobile navigation/resume link class string without changing classes or behavior.
- Kept the existing project data/card/collection/dialog/visualization/actions separation and the mascot's state/config/render/motion separation.
- Scoped Tailwind detection to application sources so documentation and diagnostic scripts cannot generate unused utilities. This uses Tailwind's [documented source base](https://tailwindcss.com/docs/detecting-classes-in-source-files#setting-your-base-path).
- ESLint now checks JavaScript tooling as well as TypeScript and excludes generated output. Playwright output is collected under ignored `artifacts/`; `.gitignore` also covers coverage and build caches.

The [move log](../artifacts/cleanup/moves.json), [source removal log](../artifacts/cleanup/removed-source-files.json), and [generated-file removal log](../artifacts/cleanup/removed-generated-files.json) record exact paths, reasons, and available hashes/sizes.

```text
assets/source/                  Original avatar
public/                         Runtime assets and required licenses
src/
  App.tsx, main.tsx, index.css
  animations/                   Portfolio motion and shared timings
  components/                   Navbar, SectionHeading
  sections/                     Hero, About, Skills, Projects, Contact
  data/                         Authentic profile, skills, and projects
  features/
    mascot/                     State, routines, atlas definitions, motion, rendering, scene, CSS
    projects/                   Collection, cards, modal, actions, previews, explorer, CSS
    skills/                     Disclosure animation and CSS
  hooks/                        Activity and motion preference
  styles/                       Tokens, shared utilities, sections, navigation
  types/                        Project contract
scripts/                        prepare-assets.mjs, capture-portfolio.mjs
tests/
  fixtures/                     Synthetic data, preview, shared fixture URL helper
  mascot/                       behavior, continuity, orbit, rendering, routines
  projects/                     architecture, collection, dialog
  navigation.spec.ts
  portfolio.spec.ts
  skills.spec.ts
docs/                           cleanup.md
artifacts/                      Ignored current build/test/capture output
README.md, index.html
package.json, package-lock.json
*.config.*, tsconfig*.json       Build, lint, styling, and test configuration
```

## Dependencies and tests

**Removed packages: none.** Every direct dependency has a runtime, build, type-checking, lint, accessibility/test, font-source, or asset-preparation role. In particular, Fontsource and Sharp are needed even though they are not application imports. The lockfile and esbuild install allowlist are retained; its allowed version matches the installed locked version. No transitive packages were edited.

Tests now follow their owning feature. Mixed `engineering-experience` and `mascot-navigation` cases were split among mascot rendering/behavior, project architecture, skill, and navigation suites. Project tests share their fixture URL helper. Continuity, posture bridges, stale timers, footfall phase, interruption recovery, sprite grounding, routine variation, keyboard controls, links, filters, accessibility, and reduced motion remain covered.

Seven section-rhythm cases were folded into the nine responsive page checks, and duplicate mobile-menu overlay/focus checks were merged. Old nebula-removal assertions and screenshot-only writes were removed. Layout checks use reduced motion and settled fonts instead of fixed animation delays; a dedicated normal-motion introduction check protects entrance visibility. Failure traces/screenshots remain enabled. The suite has **106 tests**, down from 113, with the preserved coverage distributed by responsibility.

The only identified fixture defect was a pre-existing automatic `/favicon.ico` 404, observed during the baseline capture. The fixture now references the existing SVG favicon; the portfolio's favicon and UI are unchanged.

## Validation

| Check | Before cleanup | After cleanup |
| --- | --- | --- |
| `npm.cmd run lint` | Pass | Pass, including JavaScript tooling |
| `npm.cmd run build` | Pass | Pass |
| `npm.cmd run test:fixtures` | Pass | Pass |
| `npm.cmd run test:e2e` | 113 passed in 4.6 minutes | **106 passed in 3.4 minutes** |
| Responsive visual comparison | 76 baseline captures | Pass: 75 pixel-identical; one has 249 pixels differing by at most 2/255 per channel, with identical dimensions |
| Public/source asset integrity | 11 files recorded | All hashes, sizes, and mtimes unchanged |
| Source/import audit | 34 reachable modules | 33 reachable modules; no missing imports, orphan modules, or cycles |
| Documentation links | Historical reports included stale implementation references | Current relative links resolve |
| `git diff --check` | Not separately recorded | Pass |

The final production CSS is 66.30kB versus 69.62kB before cleanup; JavaScript is 381.59kB versus 381.70kB. The final local browser budget sample recorded 198,057 transferred bytes, zero layout shift, and 585 DOM nodes. These are local measurements rather than deployed performance claims.

The [visual comparison JSON](../artifacts/cleanup/comparison.json), [preservation audit](../artifacts/cleanup/preservation-audit.json), [baseline browser report](../artifacts/cleanup/baseline-report/index.html), and [final browser report](../artifacts/cleanup/final-report/index.html) contain the inspectable results. All required checks completed. Browser coverage uses installed Chrome on Windows, including touch/mobile emulation; physical iOS, Safari, and Firefox are outside this run.

The capture command preserves raw difference counts and permits at most 2/255 channel rounding. Before/after images, comparison JSON, browser reports, asset-integrity checks, and the Git preservation audit are local ignored evidence under `artifacts/cleanup/`.

## Git review

The cleanup changes the README, ignore/lint/test configuration, application section imports, navigation class duplication, project-story ownership, feature stylesheet organization, private implementation exports, capture tooling, and test organization listed above. The package lock, authentic data files, original asset-preparation script, public assets, and unrelated initial changes are preserved. The audit found **46 original files byte-identical** at their original or moved paths and **no unexpected modifications or missing files**. The mascot configuration and reducer implementation text is unchanged apart from the removed export visibility.

Git's index was left untouched; no commit, push, deployment, or reset was performed. Current generated verification output is ignored. Exact initial status/diff and movement/deletion inventories are retained under `artifacts/cleanup/` so the pre-existing work can be distinguished from this cleanup.
