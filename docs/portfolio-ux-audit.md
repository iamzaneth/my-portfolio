# Zaneth portfolio V2 — UX audit and implementation

## Original experience

Inspected README, package and Playwright configuration, all page sections, navigation, tokens and section styling, mascot controller/reducer/motion/atlas catalog, project collection and dialogs, pipeline explorer, skill disclosure, data/type contracts, animation hooks, tests and existing design documentation. The checkout began clean.

The production site at https://zaneth.vercel.app/ was inspected in Chrome at desktop and mobile sizes. The original page has solid semantics and interaction machinery. Its visual weaknesses were a thin floating cat platform inside a dominant circular diagram, a narrow project card despite having only one project, similar boxed modules across sections, and a name-first introduction that separated the engineering proposition from the strongest typography. The hero could feel disconnected from the content below.

## Reference analysis

Sources: https://my-first-portfolio-six-gilt.vercel.app/en and https://www.alfari.my.id/ . Chrome screenshots were captured at 1440px and 375px, with full desktop captures, after the text browser failed to provide meaningful content. Reference A has a substantial loading/entrance sequence; an initial screenshot captured only its loader, and the later capture still showed partially entering content. A further 18-second capture successfully revealed its complete hero. Its inspected DOM includes a large identity introduction, About narrative, large typographic service chapters, projects, and skills. Its rounded navigation, grid atmosphere, orange emphasis, and expressive editorial scale informed hierarchy and spacing, without copying its layout or branding. Inspection of individual hover states and all mobile flows was limited.

Reference B shows a dark blue starfield, pill navigation, a left-aligned introduction and a large interactive hanging identity card. Adapted the principle of one distinctive characterful visual focal point and restrained atmospheric depth. The portfolio retains its pixel cat; no 3D/card dependency was added. Neither reference's text or claims were copied.

## Chosen direction

“Moon Garden”: an editorial engineering portfolio anchored by a framed, original pixel landscape. Midnight navy, lavender typography, cyan technical labels and a warm pixel moon. Sections alternate quiet planes; skill capabilities use open rows, About uses one collectible profile, and selected work uses a substantial project feature. Manrope and IBM Plex Mono remain self-hosted.

## Mascot overhaul

- Rebuilt scene composition as a bounded habitat with a curved corner, layered pixel mountains, plants, cratered moon, grounded platform and integrated control dock.
- Original code-native scenery is isolated in `MoonGarden.tsx`, hidden from assistive technology and pointer input. The CC0 LuizMelo atlas and all valid frame ranges remain intact. No new source animation or missing frame is claimed.
- Crisp integer sprite sizes at responsive breakpoints, preserved square frames and ground-row anchoring.
- Repositioned bubbles, metadata, action feedback and sleep markers for the new stage; separated background, geometry, character, and control layers.
- Pet and Play now expose pressed action feedback. Play introduces an illustrative star toy; it runs only during Play and pauses with the scene.
- Opening a project now sends a concise discovery through the existing typed companion context; pipeline stage discoveries remain. Discoveries expire after 12 seconds. Explicit routines take priority through the existing expression system. Automatic dialogue remains outside live announcements.
- Kept posture bridges, interruption landing, gait phase continuity, routine variety, pause/resume timers, offscreen/document visibility and live reduced-motion support. No page-traversing mascot or new render loop.

## Page changes and architecture

`Hero.tsx` now leads with the engineering proposition and clearly shows the full name and alias above it, practical system interests, work/contact actions and GitHub. About follows the user-supplied Software Engineering background. Toolkit retains data-driven capabilities and keyboard disclosures with open chapter styling. NexTick expands to a two-column feature for a one-project collection, includes verified highlights, and falls back to a stacked mobile layout. Multi-project collections retain their existing grid/filter behavior. Contact retains copy feedback, valid links and conditional résumé visibility.

The component architecture is intentionally retained. `MoonGarden.tsx` is a pure scene component; companion discovery remains in App/context; no navigation state is coupled to cat state. V2 composition rules live in their owning section, skill, project and navigation styles; shared color/spacing values live in `tokens.css`. No new dependency was introduced. `mascot.css` retains sprite playback and contains the new habitat layout. Native dialog focus containment, Escape, restoration and scroll locking remain.

NexTick source was checked at https://github.com/iamzaneth/NexTick . Its architecture includes parallel streaming paths as well as QuestDB history; the portfolio preserves the existing simplified five-stage overview and the explanatory storage/delivery descriptions, without claiming that all realtime events pass through QuestDB. There is no demo or performance claim.

## Accessibility and performance

Visible focus, 44px controls, semantic headings, skip link, keyboard disclosures and native dialogs are preserved. Decoration cannot intercept input. Motion is disabled by the shared reduced-motion rule, while action states remain functional. Scenery is a small inline SVG, no bitmap download or WebGL. The existing atlas, self-hosted fonts and lazy portrait remain. New discovery timer cleans up on update/unmount. No new dependency or runtime fetch was added.

## Validation

Locked installation, ESLint and TypeScript/Vite production build passed. Browser QA captured all seven requested widths (320, 375, 430, 768, 1024, 1440, 1920), each without horizontal overflow or page errors. Screenshots under ignored `artifacts/v2/` cover full pages, hero, sections, dialogs and Pet/Play/Nap/Wake. Mobile moon overlap was discovered visually and corrected. Full regression results are recorded below after completion.

## Remaining limitations

No deployment or push was performed. Core Web Vitals require representative device/network and field measurements; build sizes are not evidence of LCP/INP targets. Automated browser checks use the installed Google Chrome via the repository's executable-path override because bundled Playwright Chromium is absent. Reference hover/scroll/mobile interactions were sampled rather than exhaustively tested. The sprite artwork itself remains the licensed character: this upgrade changes its staging, scale, feedback and surrounding artwork rather than inventing a new sprite sheet.

### Installed versions and local performance sample

Verified installed versions using `pnpm list --depth 0`: React/React DOM 19.3.1, TypeScript 5.9.3, Vite 8.3.6, Tailwind 4.3.4, GSAP 3.15.1, @gsap/react 2.1.2, Lucide 0.577.0, Playwright 1.65.0 and axe Playwright 4.14.0. No lockfile or dependency changes.

A load-only PerformanceObserver sample on the local production preview, installed Chrome, without CPU/network throttling recorded: 375px LCP 824ms / CLS 0; 1440px LCP 796ms / CLS 0. Recorded in `artifacts/v2/local-vitals.json`. These are individual lab observations, not field performance guarantees; INP was not measured. Production build: JS 405.65kB (136.96kB gzip), CSS approximately 72kB (15kB gzip).

Initial regression failures included the intentionally replaced hero heading, compact-card limit and circular preview assertions. Those tests now verify the new hierarchy (including full identity), full-width single-project geometry, square pixel preview nodes and unchanged circular explorer nodes. A browser CSS pause-boundary synchronization was added before exact clock assertions; frame, world-pose and pending-action checks remain intact. Responsive skill row spacing and semantic whitespace between the hero heading's two lines were corrected during validation. Added two behavior regressions for Play feedback/reduced motion and expiring project discoveries with direct-action priority.

### Final verification result

- `pnpm install --frozen-lockfile`: passed; already up to date.
- `pnpm run lint`: passed.
- `pnpm run build`: passed; final JS 405.68kB / 136.97kB gzip, CSS 71.92kB / 15.03kB gzip.
- `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/opt/google/chrome/chrome pnpm run test:e2e`: **132 passed in 2.6 minutes**. Full result in `artifacts/playwright-report/`; execution log `/tmp/portfolio-v2-final-tests.log`.
- Includes axe A/AA page, fixture and dialog checks, navigation and menu behavior, native dialog focus/Escape/restoration, project collection fixtures, pipeline geometry, keyboard skills, cat sprite integrity, continuous playback, routines, interrupted posture/movement, hidden/offscreen behavior, reduced motion and live preference changes.
- Browser contrast samples: 109 text samples at each of 375px and 1440px, minimum 5.6168:1; 99 non-text samples at each size, minimum 3.6113:1. These are sampled controls/text states, not a claim of exhaustive manual WCAG certification.
- Final visual captures at 320/375/430/768/1024/1440/1920px: no horizontal overflow; no page errors. Inspected desktop/mobile hero, full pages, About, Toolkit, work, case-study dialog, Contact, and Pet/Play/Nap/Wake states. Wake messaging was corrected so a stored discovery cannot displace its direct reaction.
- `git diff --check`: passed. No push, deployment, new dependency or lockfile change.
