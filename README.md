# Zaneth — AI & Data Engineering

The personal portfolio of **Tran Thien Phuc (Zaneth)**, a Data Engineering student focused on AI Engineering, Data Engineering, and practical data analysis. A midnight-navy interface combines editorial typography, coordinated motion, an interactive lavender pixel cat, and an architecture-led project showcase.

Existing production URL: https://phuc-dev.vercel.app. Local changes are not automatically deployed.

## Stack

- React 19, TypeScript 5, Vite 7, Tailwind CSS 4.
- GSAP 3, ScrollTrigger, and `@gsap/react` for coordinated motion.
- CSS `steps()` for sprite-sheet playback and CSS transitions for small interactions.
- Lucide icons; self-hosted Manrope and IBM Plex Mono fonts (SIL Open Font License, included in `public/fonts`).
- Playwright and axe-core for browser verification; Sharp for asset preparation.

## Installation and commands

Use Node.js 22.12+ (Node 24 was used during implementation) and npm. On Windows PowerShell, use `npm.cmd` if execution policy blocks `npm.ps1`.

```powershell
npm.cmd ci
npm.cmd run dev
```

Vite prints the development URL, normally `http://localhost:5173`.

```powershell
npm.cmd run lint
npm.cmd run build
npm.cmd run preview
```

The production output is `dist/`. Stop the dev/preview server before running `npm ci` on Windows so native CSS modules are not locked.

The CSS build uses the Tailwind 4 PostCSS adapter. It already handles imports and vendor prefixes, as described in the [Tailwind upgrade guide](https://tailwindcss.com/docs/upgrade-guide#using-postcss). Shared colors and typography live in `src/styles/tokens.css`.

`sharp` and the Fontsource packages are development tools used by `assets:prepare`. The original avatar is an input to that script. The public mascot directory contains the runtime atlas and its license/attribution; intermediate sprite sheets stay in memory. Browser screenshots and reports are generated on demand by the Playwright suite and ignored by Git.

## Structure

```text
assets/source/avatar.png          Preserved original, excluded from the served build
public/
  avatar.webp                     Optimized 256px profile image
  cv.pdf                          Existing résumé
  favicon.svg                     Pixel face identity
  fonts/                          Local WOFF2 files and font licenses
  mascot/                         Runtime sprite atlas, license, attribution
src/
  animations/usePortfolioMotion.ts Hero and ScrollTrigger orchestration
  components/                     Sections, navigation, shared section heading
  data/                           Verified profile, skill, and project content
  features/
    mascot/                       Configuration, controller, sprite, scene
    projects/                     Reusable ProjectCard and PipelineVisual
  hooks/useMotionPreference.ts    Live system preference subscription
  styles/tokens.css               Shared colors and typography
  types/portfolio.ts              Typed project contract
  App.tsx                         Page composition
  index.css                       Visual system and responsive rules
  main.tsx                        Strict Mode entry point
scripts/prepare-assets.mjs         Reproducible local asset optimization
tests/portfolio.spec.ts            Browser, accessibility, and budget checks
playwright.config.mjs
```

## Motion architecture and technology choices

[`usePortfolioMotion`](src/animations/usePortfolioMotion.ts) owns the page-level timelines. It uses [`useGSAP`](https://gsap.com/resources/React/) with a root scope and automatic context cleanup. [`gsap.matchMedia`](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()) responds to motion preferences and desktop breakpoints; its cleanup reverts timelines and ScrollTriggers on changes and unmount, including React Strict Mode’s extra setup cycle.

The opening sequence combines masked, staggered name lines with scene arrival and supporting text/buttons. Content sections rise into view once; skills stagger into place; the project artwork opens with a mask. On desktop, a restrained scroll-linked orbit and pipeline progression provide depth. Native anchor navigation and scrolling remain intact, with no pinned or forced-scroll segments.

Responsibilities are separate: GSAP moves the character’s parent, CSS steps advance sprite frames, and CSS handles button/link feedback. They do not animate the same property of the same element.

Alternatives investigated:

| Technology | Decision |
| --- | --- |
| [GSAP + ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) | Selected for timeline choreography, scroll scrubbing, media conditions, and React cleanup. Distributed under GSAP’s [standard no-charge license](https://gsap.com/standard-license/). |
| [Motion for React](https://motion.dev/docs/react) | Useful for layout/gesture transitions, but would duplicate GSAP for this page. Not installed. |
| [PixiJS](https://pixijs.com/) | Suitable for larger sprite worlds; unnecessary canvas/GPU complexity for a single character. Not installed. |
| [Rive](https://rive.app/docs/runtimes/react/react) | Requires suitable `.riv` art; the licensed sprite pack directly preserves pixel aesthetics. Not installed. |
| [Lenis](https://lenis.dev/) | Native scrolling already supports this composition. Not installed. |

## Pixel cat: origin, rendering, and behavior

Art comes from **[LuizMelo’s Pet Cats Pack](https://luizmelo.itch.io/pet-cat-pack)**, explicitly **CC0**, including commercial reuse. The author’s license is retained in [`public/mascot/LICENSE.txt`](public/mascot/LICENSE.txt). Provenance, selected sheets, and modifications are documented in [`ATTRIBUTION.md`](public/mascot/ATTRIBUTION.md).

The pack’s Cat 1 sheets were cropped into aligned 32 × 32 frames and palette-mapped to lavender with preserved transparency. `image-rendering: pixelated` preserves sharp edges. Eleven animations are packed into a single **4,731-byte atlas**, preloaded in `index.html`, so state changes do not fetch or decode a new image. No assets are fetched from itch.io at runtime.

- `catSprites.ts`: generated atlas row/frame metadata; regenerate with the asset script.
- `catConfig.ts`: animation timing, labels, and weighted random behavior selection.
- `catState.ts`: pure state machine with queued intentions and stale-event protection.
- `useCatController.ts`: visibility detection and scheduling with timer cleanup.
- `PixelCat.tsx`: two CSS sprite layers sharing the atlas, with a 140ms opacity transition.
- `useCatMotion.ts`: GSAP parent movement; interrupted timelines are killed without reverting the current position.
- `MascotScene.tsx`: accessible controls, speech bubble, and scene composition.

States include idle, attention, walking/running, jumping, resting, grooming, scratching, stretching, nuzzling, purring, paw gestures, prowling, pouncing, double hops, and wiggling. Approaching with a pointer or focus makes the cat attentive, or wakes it. **Pet and Play each have four distinct multi-step routines**:

| Action | Routine | Sequence |
| --- | --- | --- |
| Pet | Happy hop | Anticipation → jump → landing → meow |
| Pet | Head rub | Lean and nuzzle → contented purr |
| Pet | Paw thanks | Paw gesture → nuzzle → meow |
| Pet | Happy stretch | Stretch → purr → paw gesture |
| Play | Zoomies | Walk → run → pounce |
| Play | Double bounce | Two alternating hops → paw gesture |
| Play | Stalk and pounce | Slow prowl → low forward pounce → meow |
| Play | Wiggle dance | Wiggle → double hop → purr |

Each action has an independent shuffle bag. The first press keeps the original familiar reaction, the remaining three routines vary, and all four are used before reshuffling. Consecutive presses never repeat the same routine, including across cycle boundaries. A new press can replace the current routine smoothly; its versioned queue prevents an old timer from resuming an interrupted sequence.

**Nap/Wake** settles, lies down, sleeps, and stretches awake. Requests made while sleeping are queued until waking finishes; a newer request replaces the pending one. One-shot lying/stretching clips hold their last frame; the outgoing sprite freezes its current frame while the incoming clip starts at frame zero. Related states using the same sheet keep their frame phase, avoiding an unnecessary restart. Sleep includes subtle breathing and floating Zs; petting adds a floating heart. Horizontal clipping contains the moving sprite layers on narrow screens while allowing vertical jumps and an inset keyboard focus ring.

After **5–9 seconds** of idle time, a weighted random choice produces grooming, paw cleaning, scratching, stretching, looking around, walking, or an occasional nap. Consecutive choices differ. Autonomous naps wake naturally after **9–14 seconds**; naps requested by the visitor persist until another interaction. Random actions are suspended while the cat has pointer/keyboard attention, offscreen, in a hidden tab, or under reduced motion. User actions take priority and autonomous speech does not repeatedly announce through the screen reader’s live region.

The mobile menu uses three persistent bars with a 180-degree rotation and bar-to-X morph. Submenu links have lavender hover/focus surfaces, an accent marker, arrow movement, and pressed feedback for touch. Desktop navigation sits as one right-aligned group beside “Let’s talk”. Both respect reduced motion.

Offscreen scenes and hidden tabs pause sprite playback, character movement, and behavior timers. The intersection observer is renewed when the motion preference changes, and callbacks from retired observers are ignored, preventing a stale paused state while the scene entrance is recreated. All listeners, observers, timers, and GSAP contexts are cleaned up. There are no pointer-move React updates or custom animation loops.

Regenerate derived assets after downloading/extracting the author’s pack:

```powershell
npm.cmd run assets:prepare -- 'C:\path\to\Pet Cats Pack'
```

Without the argument, the script only refreshes the avatar and fonts. The original avatar is preserved in `assets/source/`; only the 6.7 KB WebP is served.

## Content and adding projects

Edit `src/data/profile.ts` for contact details, `skills.ts` for verified skills, and `projects.ts` for work. Existing personal details are preserved. GitHub consistently points to `iamzaneth`, verified against the existing project repository. Facebook retains the original profile link. No employment or dated education timeline is presented because verified dates were not supplied.

Projects use the `Project` type in `src/types/portfolio.ts`. Add an entry with a unique `id` and `slug`:

```ts
{
  id: 'your-project',
  slug: 'your-project',
  title: 'Your project',
  summary: 'One clear sentence describing the result.',
  description: 'An accurate description of what you built.',
  category: 'Data Engineering',
  technologies: ['Python', 'SQL'],
  image: { src: '/projects/your-project.webp', alt: 'Descriptive image text' },
  githubUrl: 'https://github.com/your-account/your-project',
  featured: false,
}
```

Optional fields include `image`, `featured`, `githubUrl`, `demoUrl`, `detailsUrl`, `highlights`, `status`, and a supported `visualization`. Only set `demoUrl` for a real running demo. The existing NexTick README is labeled **Read the story**, never **Live demo**. The diagram is a simplified architecture illustration, not market data or a screenshot of the app.

`ProjectCard` renders any number of entries with stable IDs. Category filters appear automatically when the data contains more than one category; empty results have an explicit state. Repository and detail actions remain visible on touch devices. Add local optimized artwork in `public/projects/`; no section markup changes are needed.

## Accessibility and responsive behavior

- Semantic sections and headings, a skip link, visible keyboard focus, accessible icon controls, and descriptive artwork labels.
- Mobile navigation uses `hidden` to remove closed links from tab order. Escape closes it and returns focus; selecting a section or clicking outside closes it.
- Mascot controls work with keyboard, pointer, and touch. Speech changes are announced politely.
- Email opens the visitor’s mail app; copying reports success or a useful fallback. This is not a server-backed contact form.
- Reduced motion skips all GSAP entrances, disables sprite playback and decorative transforms, and shows content immediately. Cat expressions and controls remain functional. Preference changes are handled live.
- Intentional single-column mobile composition, responsive skill cards, no mobile pinning, and persistent project actions.

## Browser verification

Build first, then run the browser suite against Vite’s production preview:

```powershell
npm.cmd run build
npx.cmd playwright install chromium
npm.cmd run test:e2e
```

An existing compatible Chromium can be selected without another browser download:

```powershell
$env:PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH = 'C:\path\to\chrome.exe'
npm.cmd run test:e2e
```

The suite checks widths **320, 375, 430, 600, 768, 900, 1024, 1440, and 1920**, clipping/overflow, runtime errors, all eight Pet/Play routines and their mobile movement bounds, complete shuffle cycles without adjacent repeats, mascot states and visibility, autonomous behavior without consecutive repeats, sleeping/waking bridges, replacement of queued requests, user priority, uninterrupted sprite coverage, shared-atlas image requests, position continuity, right-aligned desktop navigation, rotating mobile menu bars, submenu hover/focus/press feedback, keyboard navigation, reduced-motion changes, correct project links, clipboard behavior, local assets, axe WCAG A/AA scans, transferred-resource size, and layout stability. Screenshots are saved under ignored `artifacts/`; failure traces and the HTML report are under `test-results/` and `playwright-report/`.

Local Chromium budgets are 650 KB transferred resources, CLS below 0.1, and fewer than 1,000 DOM nodes. These are regression checks on a local production server, not field Core Web Vitals, a Lighthouse score, or a guarantee of performance on physical mobile devices. Automated axe checks supplement, rather than replace, human accessibility review.

## Implementation verification — October 24, 2026

Executed in this workspace with Node 24.18.1, npm 11.16.0, Playwright 1.61.1, and the installed Chromium headless browser:

| Check | Actual result |
| --- | --- |
| `npm ci` | Passed offline in an isolated directory using the cleaned package manifest and lockfile. |
| `npm run assets:prepare -- <source-pack>` | Passed; reproduced the atlas without publishing intermediate sprite sheets. |
| `npm run lint` | Passed, including the browser test source. |
| `npm run build` | Passed TypeScript and Vite; application JS 347.84 KB / 120.37 KB gzip. |
| `npm run test:e2e` | **30 passed** after removing redundant dependencies and unused files, including all nine viewport widths and animated/reduced-motion states. |
| Preference-switch regression | Passed in the current full suite; also passed 10 consecutive runs during the initial redesign. |
| axe WCAG A/AA scans | 0 detected violations at 375px and 1440px, including the open mobile menu. |
| Runtime/asset checks | No page errors in responsive checks; tested local assets returned HTTP 200. |
| Local resource sample | 181,966 bytes transferred; 472 DOM nodes; CLS below 0.000001. |
| `git diff --check` | Passed. |

Desktop, tablet, and mobile screenshots were generated and visually reviewed, including the updated desktop/mobile header, submenu hover feedback, action routines, grooming, and sleeping. The original avatar is preserved outside `public/`; its served WebP is 6,694 bytes. The runtime sprite atlas is 4,731 bytes. Intermediate animation sheets are assembled in memory rather than published as unused files.

These results cover local Chromium automation and screenshot inspection. Physical-device testing, other browser engines, field performance, and a full manual accessibility audit remain outside this verification. The interface has no fabricated work history, project statistics, or live-demo links. No deployment, remote push, or production infrastructure change was performed.

## Design references and scope

The brief’s navy/lavender palette, generous spacing, character focus, and typographic hierarchy guided the original design. [Xyslab](https://xyslab.com/) was available in text form; the supplied Pinterest short link was inaccessible. The described reference screenshot was not attached, so it was not visually inspected. The asset candidates [Elthen](https://elthen.itch.io/2d-pixel-art-cat-sprites) and [PixelFight](https://pixelfight.itch.io/cat-pack) were also reviewed; LuizMelo’s explicit CC0 license and complete free pack were the best fit.

## Deployment

Keep the existing Vercel project and choose:

```text
Framework preset: Vite
Install command: npm ci
Build command: npm run build
Output directory: dist
```

No environment variables, backend service, or new production infrastructure is required. `dist/` can also be served by any static host. This implementation does not push, deploy, or change the existing Vercel configuration.
