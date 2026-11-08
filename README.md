# Zaneth — Personal Portfolio

The personal website of **Tran Thien Phuc**, a Data Engineering student at **Ho Chi Minh City University of Technology and Engineering**, exploring AI engineering, data systems, and software development.

[Live website](https://zaneth.vercel.app/) · [GitHub](https://github.com/iamzaneth)

## Features

- Responsive navy/lavender design, self-hosted fonts, and frosted navigation.
- A native 64×64 lavender pixel cat (65 frames) with varied Pet/Play routines, sleep/wake controls, continuous sprite transitions, and contextual project discoveries.
- A floating portrait ID badge with a rounded black protective shell, 18px physical CSS 3D depth, recessed faces, keyboard/touch flipping, pointer tilt, and reduced-motion support.
- Keyboard-accessible, fixed-layout skill practice views.
- Compact project cards, category filters, and in-page case-study dialogs with focus and scroll restoration.
- A data-driven NexTick architecture explorer; Source and Demo links appear only when valid URLs are configured.
- Full-screen chapter navigation, a fast animated return to top, reduced-motion support, visible keyboard focus, and a skip link.
- Static cosmic constellations with independent orbits; the mascot orbit rotates automatically on PC and follows scrolling on mobile/tablet.
- Direct contact links and copy-email feedback.

## Stack

React 19, TypeScript 5, Vite 8, Tailwind CSS 4 via its Vite plugin, GSAP with ScrollTrigger and `@gsap/react`, and Lucide icons. ESLint checks code; Playwright and axe-core cover browser behavior and accessibility. Sharp and Fontsource support local asset preparation.

## Development

Use Node.js 22.12 or later and pnpm 11.18.0 (pinned in `package.json`). Install pnpm with `corepack enable` followed by `corepack install`, or use an existing pnpm 11.18.0 installation. Install the locked dependencies and start Vite:

```sh
git clone https://github.com/iamzaneth/my-portfolio.git
cd my-portfolio
pnpm install --frozen-lockfile
pnpm run dev
```

Open the local URL printed by Vite. The site needs no backend or environment variables.

```sh
pnpm run lint
pnpm run build
pnpm run preview
```

Check dependency advisories with `pnpm run audit` (all packages) or `pnpm run audit:prod` (runtime packages).

The build checks TypeScript and creates the static site in `dist/`.

## Tests and visual checks

```sh
pnpm exec playwright install chromium
pnpm run build
pnpm run test:e2e
```

Playwright starts the production preview and an isolated project-fixture preview. Tests cover responsive layouts, navigation, contact, accessibility, reduced motion, identity-badge geometry and interactions, project dialogs and collections, and cat state/motion continuity. Temporary projects stay in the fixture build and are checked for absence from the real portfolio bundle.

Reports, failure screenshots, and traces go under ignored `artifacts/`. To inspect a report:

```sh
pnpm exec playwright show-report artifacts/playwright-report
```

Run `pnpm run test:clean` after reviewing results to remove generated reports,
traces, and visual captures. Run it only after tests and capture commands finish;
fixture previews are rebuilt automatically on the next test run.

On PowerShell, use `pnpm.cmd` if execution policy blocks `.ps1` wrappers. If the bundled browser is unavailable, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to an installed Chrome/Chromium executable.

For manually managed servers, `PLAYWRIGHT_BASE_URL` and `PLAYWRIGHT_FIXTURE_URL` override the preview addresses. Run `pnpm run test:fixtures` after changing code when reusing a fixture server; its generated build is `artifacts/project-fixtures/`.

The capture command records deterministic reduced-motion views at 320–1920px. With a production preview running on port 4173:

```sh
pnpm run capture before http://127.0.0.1:4173
# After a change and rebuild:
pnpm run capture after http://127.0.0.1:4173 artifacts/visual before
```

The second command compares PNG pixels and fails on size changes or color differences larger than 2/255 per channel. This small allowance covers browser raster rounding; the JSON report also records every raw pixel difference. Capture output stays in `artifacts/visual/`. Set `PLAYWRIGHT_FIXTURE_URL` to a running fixture preview to include multi-project views.

## Structure

```text
assets/source/       Avatar and editable mascot PNG frames/manifest
public/              Served avatar, CV, favicon, fonts, mascot atlas, and licenses
src/
  App.tsx            Page composition and companion context
  animations/        Page entrance/scroll orchestration and shared timing
  components/        Shared navigation and section headings
  sections/          Hero, About, Toolkit, Projects, and Contact sections
  features/
    mascot/          Sprite definitions, state, motion, rendering, scene, and styles
    projects/        Collection, cards, dialog, previews, architecture, and styles
    skills/          Fixed-layout practice views and styles
    cosmic/          Static celestial scenes and SVG primitives
    cursor/          Immutable historical comet trail
    chapters/        Chapter navigation and bounded return-to-top action
    identity/        Volumetric badge, protective shell geometry, and materials
  data/              Profile, skills, and project configuration
  hooks/             Visibility/activity and reduced-motion subscriptions
  styles/            Global tokens, shared primitives, sections, and navigation
  types/             Project data contract
scripts/             Asset preparation and visual capture
tests/
  fixtures/          Isolated synthetic project data and preview
  mascot/            State, routines, rendering, continuity, and orbit checks
  projects/          Collections, dialogs, and architecture checks
  *.spec.ts          Portfolio, navigation, and skill checks
docs/                Current architecture and maintenance guide
```

## Update content

- **Personal details and navigation:** [`src/data/profile.ts`](src/data/profile.ts). This also controls resume-link visibility.
- **Skills:** [`src/data/skills.ts`](src/data/skills.ts).
- **Projects:** [`src/data/projects.ts`](src/data/projects.ts), following the `Project` type in [`src/types/portfolio.ts`](src/types/portfolio.ts). Use unique `id`/`slug` values, a concise summary, and real source/demo/documentation URLs. Omit unavailable links.
- **Project details:** optional description, highlights, technologies, story entries, image, and pipeline stages drive the shared dialog. Only the selected project's detail view is mounted.
- **Images:** add legitimate images under `public/` and use their public paths in project data, with descriptive alt text.

Page anchors remain `#home`, `#about`, `#skills`, `#projects`, and `#contact`.

## Asset sources and licenses

The pixel-cat atlas is derived from LuizMelo's CC0 **Pet Cats Pack**. Source, transformation details, and regeneration instructions are in [`public/mascot/ATTRIBUTION.md`](public/mascot/ATTRIBUTION.md); the original license is retained beside the atlas. Font licenses are in [`public/fonts/`](public/fonts/).

```sh
pnpm run assets:prepare
# Regenerate only the native 64px cat atlas and TypeScript catalog:
pnpm run assets:cat
pnpm run assets:cat:check
```

The script uses the retained avatar source to prepare the 256px thumbnail and 720px portrait derivative, and Fontsource packages to prepare the served fonts. It also packs all 65 retained native PNG frames into the 832×704 atlas and generates the sprite catalog from the manifest. No source-pack download or proprietary editor is needed. `assets:cat:check` verifies the lossless build, palette, binary alpha, ground bounds and native pixel detail. The original author’s CC0 license and provenance remain in `public/mascot/`.

See the [maintenance guide](docs/architecture.md) for animation boundaries, cosmic composition, keyboard behavior, validation and repository hygiene.

Targeted character review: `pnpm run capture:characters <unique-label> http://127.0.0.1:4173` records eight responsive sizes, card rotation angles, sprite clips and performance observations under `artifacts/characters/`. `pnpm run assets:cat:review` generates a contact sheet and pixel audit only when needed.

Run `pnpm run test:clean` after tests/captures finish to remove all generated reports, screenshots, recordings and fixture builds. Run `pnpm run clean` to also remove build output and caches. The repository retains active regression tests and editable assets; generated review files are recreated on demand.
