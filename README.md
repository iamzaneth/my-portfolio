# Zaneth — Personal Portfolio

The personal website of **Tran Thien Phuc**, a Data Engineering student exploring AI engineering, data systems, and software development.

[Live website](https://zaneth.vercel.app/) · [GitHub](https://github.com/iamzaneth)

## Features

- Responsive navy/lavender design, self-hosted fonts, and frosted navigation.
- An interactive pixel cat with varied Pet/Play routines, sleep/wake controls, continuous sprite transitions, and contextual project discoveries.
- Keyboard-accessible skill disclosures.
- Compact project cards, category filters, and in-page case-study dialogs with focus and scroll restoration.
- A data-driven NexTick architecture explorer; Source and Demo links appear only when valid URLs are configured.
- Scroll reveals, reduced-motion support, visible keyboard focus, and a skip link.
- Direct contact links and copy-email feedback.

## Stack

React 19, TypeScript 5, Vite 7, Tailwind CSS 4, PostCSS, GSAP with ScrollTrigger and `@gsap/react`, and Lucide icons. ESLint checks code; Playwright and axe-core cover browser behavior and accessibility. Sharp and Fontsource support local asset preparation.

## Development

Use Node.js 22.12 or later and npm. Install the locked dependencies and start Vite:

```sh
git clone https://github.com/iamzaneth/my-portfolio.git
cd my-portfolio
npm ci
npm run dev
```

Open the local URL printed by Vite. The site needs no backend or environment variables.

```sh
npm run lint
npm run build
npm run preview
```

The build checks TypeScript and creates the static site in `dist/`.

## Tests and visual checks

```sh
npx playwright install chromium
npm run build
npm run test:e2e
```

Playwright starts the production preview and an isolated project-fixture preview. Tests cover responsive layouts, navigation, contact, accessibility, reduced motion, project dialogs and collections, and cat state/motion continuity. Temporary projects stay in the fixture build and are checked for absence from the real portfolio bundle.

Reports, failure screenshots, and traces go under ignored `artifacts/`. To inspect a report:

```sh
npx playwright show-report artifacts/playwright-report
```

On PowerShell, use `npm.cmd` and `npx.cmd` if execution policy blocks `.ps1` wrappers. If the bundled browser is unavailable, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to an installed Chrome/Chromium executable.

For manually managed servers, `PLAYWRIGHT_BASE_URL` and `PLAYWRIGHT_FIXTURE_URL` override the preview addresses. Run `npm run test:fixtures` after changing code when reusing a fixture server; its generated build is `artifacts/project-fixtures/`.

The capture command records deterministic reduced-motion views at 320–1920px. With a production preview running on port 4173:

```sh
npm run capture -- before http://127.0.0.1:4173
# After a change and rebuild:
npm run capture -- after http://127.0.0.1:4173 artifacts/visual before
```

The second command compares PNG pixels and fails on size changes or color differences larger than 2/255 per channel. This small allowance covers browser raster rounding; the JSON report also records every raw pixel difference. Capture output stays in `artifacts/visual/`. Set `PLAYWRIGHT_FIXTURE_URL` to a running fixture preview to include multi-project views.

## Structure

```text
assets/source/       Original avatar used by asset preparation
public/              Served avatar, CV, favicon, fonts, mascot atlas, and licenses
src/
  App.tsx            Page composition and companion context
  animations/        Page entrance/scroll orchestration and shared timing
  components/        Shared navigation and section headings
  sections/          Hero, About, Toolkit, Projects, and Contact sections
  features/
    mascot/          Sprite definitions, state, motion, rendering, scene, and styles
    projects/        Collection, cards, dialog, previews, architecture, and styles
    skills/          Animated skill disclosure and styles
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
docs/                Cleanup record and validation evidence
```

## Update content

- **Personal details and navigation:** [`src/data/profile.ts`](src/data/profile.ts). This also controls resume-link visibility.
- **Skills:** [`src/data/skills.ts`](src/data/skills.ts).
- **Projects:** [`src/data/projects.ts`](src/data/projects.ts), following the `Project` type in [`src/types/portfolio.ts`](src/types/portfolio.ts). Use unique `id`/`slug` values, a concise summary, and real source/demo/documentation URLs. Omit unavailable links.
- **Project details:** optional description, highlights, technologies, story entries, image, and pipeline stages drive the shared dialog. Only the selected project's detail view is mounted.
- **Images:** add legitimate images under `public/` and use their public paths in project data, with descriptive alt text.

Page anchors remain `#home`, `#about`, `#skills`, `#projects`, and `#contact`.

## Asset sources and licenses

The pixel-cat atlas is derived from LuizMelo's CC0 **Pet Cats Pack**. Source, transformation details, and a reproducible download/regeneration path are in [`public/mascot/ATTRIBUTION.md`](public/mascot/ATTRIBUTION.md); the original license is retained beside the atlas. Font licenses are in [`public/fonts/`](public/fonts/).

```sh
npm run assets:prepare
# Also regenerate the cat atlas/catalog from the author's extracted pack:
npm run assets:prepare -- "<extracted Pet Cats Pack directory>"
```

The script uses the retained avatar source and Fontsource packages to prepare the served avatar/fonts. The optional pack argument rebuilds the atlas and generated sprite catalog. It does not download or hotlink runtime assets.

The [cleanup record](docs/cleanup.md) lists reorganized and removed files, preserved assets/dependencies, test consolidation, and before/after validation.
