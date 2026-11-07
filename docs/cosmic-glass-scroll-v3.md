# Zaneth V3 — Cosmic Glass Universe

## 1. Baseline audit

Inspected the current local checkout, App composition, navbar, section styles,
GSAP orchestration, project dialog, mascot and cursor lifecycles, disclosures,
Playwright configuration and capture script. The checkout was clean at the start.
Chrome inspection of both the deployed https://zaneth.vercel.app/ and local
production build confirmed matching layouts. Baselines are in
`artifacts/v3/before-{local,live}-{1440,375}.png`.

The page used document scrolling, a sticky 87px desktop / 72px mobile header,
global smooth scrolling, an independent IntersectionObserver for active links,
and full-width opaque section planes. No wheel controller existed. Most desktop
sections exceeded a viewport: at 1440×900, Home was about 854px, About 1038px,
Toolkit 1202px, Work 990px, Contact 640px (beyond the 87px header). Sparse surfaces
and a largely flat background made the existing material treatment feel solid.

A native `scroll-snap-type:y proximity` experiment at 1440×1000 with a 120px
wheel gesture returned to scrollY=0 instead of reaching About. This demonstrated
that native proximity alone did not satisfy moderate-gesture navigation.

## 2. Design decisions

One calm space environment, with distinct lavender, indigo, cyan and warm
reflections. Preserve editorial hierarchy, real engineering content, Moon Garden
and the comet. Give the page viewport-aware chapters rather than restricting
content to fixed heights. Chapters are numbered Home 01 through Contact 05.

## 3. Glass material system

`tokens.css` defines subtle, standard and elevated materials, border reflection,
inner highlight and layered elevation shadows. `materials.css` applies them:

- Subtle material primitive: low frosting and a restrained edge, available for
  secondary surfaces; the scene footer and navigation controls use a quiet tint.
- Standard: developer identity card, capability cards and contact information.
- Elevated: featured project, with a brighter top edge and deeper layered shadow.
- Navbar: compact static 14px frosting, readable dark tint, stronger scrolled
  state and opaque fallback. No per-card pointer-lighting JavaScript.

Materials combine translucency, local lavender/cyan tint, diagonal reflection,
inner edge illumination and shadows. `@supports` retains readable opaque
backgrounds without backdrop filtering. Four simultaneous capability cards use
4px frosting after the first rendering profile showed occasional missed frames;
focal panels retain stronger frosting. Blur radius is never animated. The cat
sprite is never filtered, and no nested blur was added inside its habitat.

## 4. Cosmic background architecture

`chapters.css` owns two decorative pseudo-elements per chapter: broad static
radial light, two sparse star distributions, and faint concentric geometry.
Tint varies by chapter while the navy foundation remains related. No particles,
extra canvas, external asset, background JavaScript loop or document-wide filter
was added. Decorative CSS is absent from the accessibility tree and cannot
receive pointer events. The comet remains a separate fixed viewport canvas.

## 5. Scrolling architecture

`useChapterNavigation.ts` is the sole active-chapter authority. Navbar receives
its active chapter as a prop; its old section IntersectionObserver was removed.
The observer for the navbar's own scrolled material state remains independent.

The document is the only page scroll container. The centralized `--nav-height`
defines header height, mobile menu positioning, usable viewport and root
scroll-padding. Anchors have no second scroll-margin offset. Chapters use
min-height with vh/svh/dvh fallbacks. No document transform scrolling or new
smooth-scroll library is involved.

Native-first adaptation:

- At smaller mobile widths snapping is disabled; touch scroll is entirely native.
- Other coarse-pointer/tablet layouts may use proximity snap for compact chapters.
- Fine-pointer layouts avoid CSS snap retargeting anchors, keyboard scrolling or
  programmatic movement. At >=1024px, only an aligned, compact chapter receives
  the progressive wheel enhancement.
- A 70px normalized intent budget filters small noise. Pixel/line/page units are
  normalized without pretending to identify hardware by delta magnitude.
- The browser performs a single native smooth `scrollTo`; GSAP never animates the
  scroll position. One gesture consumes at most one compact transition.
- A 180ms event gap identifies a new gesture. A direction reversal may begin a
  fresh gesture once the browser settles. Momentum is consumed until the gesture
  ends, including events arriving after the destination is reached.
- `scrollend` confirms completion. A 140ms actual-scroll debounce is the fallback;
  a 1500ms safety release prevents stale input lock after interruption. These
  are not a fixed cinematic transition duration or a post-navigation cooldown.
- After a native wheel crosses fully into the beginning of a compact chapter,
  scroll completion can settle it to that chapter. It cannot pull unread content
  out of an oversized chapter before the boundary is crossed.

Navigation uses native anchors for URL, focus and history creation. Ordinary
scrolling never writes history. React mounts after initial fragment resolution,
so an initial hash is aligned once after fonts settle unless the user has already
interacted. Browser Back/Forward is restored to the actual hash destination with
manual history restoration; the previous restoration mode returns on cleanup.
Active state always follows measured scroll position, not a requested destination.

## 6. Long-content behavior

A ResizeObserver caches section positions/heights and classifies compact versus
oversized sections. Tall sections never have a fixed height, internal scroll
trap, clipped overflow or intercepted ordinary wheel input. Disclosure expansion
remeasures content and suspends compact behavior if needed. At 1440×900 all five
chapters fit; at 1366×768 or mobile, several deliberately remain taller and scroll
normally. Font enlargement is treated as content growth, not a reason to shrink
text. The footer stays in normal document flow.

## 7. Motion coordination and discovered conflicts

Scrolling belongs to the browser/chapter hook. GSAP owns existing entrances,
section reveals and the decorative orbit only. The cat keeps its controller,
posture guarantees and visibility pauses. The comet keeps its own idle-stopping
canvas loop. Neither character nor cursor is remounted on chapter changes.

Two actual conflicts were found and repaired:

1. An initial ResizeObserver/ScrollTrigger refresh interrupted early smooth
   scrolling. Initial no-op observer callbacks no longer refresh or release the
   gesture. Real layout changes refresh only after scrolling settles and while
   no dialog is open.
2. ScrollTrigger can restore an inline `scroll-behavior:smooth` after refresh,
   defeating a live reduced-motion media rule. Its refresh completion and media
   changes remove that stale inline property, returning ownership to CSS.

Project dialogs retain their native top layer, fixed-body lock, independent
scrolling, Escape, scroll restoration and focus restoration. The chapter hook
ignores wheel input while a dialog is open and pauses its layout refresh. Existing
project-dialog behavior was not rewritten.

## 8. Responsive strategy

Required widths: 320, 375, 430, 768, 1024, 1440, 1920. Additional desktop heights:
1366×768, 1440×900, 1920×1080. Desktop cards use balanced grids; mobile stacks
without compressing typography to meet a viewport. Chapter layouts center their
content only when space allows. The habitat remains prominent and interactive.

## 9. Accessibility and user control

Native Tab and keyboard scrolling are preserved. There are no custom key
bindings. Inputs, selections, zoom gestures and independently scrollable widgets
bypass wheel interception. Native anchor focus remains intact. Reduced motion
uses immediate/native movement and disables the custom wheel enhancement.
Coarse/touch devices never receive desktop wheel behavior. Standard text and
controls keep the existing visible focus and AA contrast checks. Glass has an
opaque no-filter fallback; backdrop aesthetics are not needed for legibility.

## 10. Performance observations

Locked installation, lint, build, full browser suite and visual results are
recorded below when complete. Diagnostics under `artifacts/v3/performance.json`
include local Chrome LCP/CLS, interaction long tasks, frame samples, and layout,
style, script and task time. Environment: unthrottled local headless Chrome,
software rendering, with other browser test processes running. This is not a
physical-device or field Core Web Vitals result; INP is not measured.

The first profile recorded no long tasks during interaction; desktop median frame
interval 16.7ms and p95 33.3ms, mobile median 16.7ms and p95 16.8ms. These observations
prompted thinner Toolkit frosting. There is no blanket 60fps claim.

No dependencies, external runtime requests, background animation loops or heavy
3D framework were added. Scroll position reads are coalesced to one RAF only when
scroll events occur; positions/heights are cached outside that update. State and
chapter attributes change only when the active chapter changes. Resize/layout
refreshes are bounded and cleaned up along with listeners, timers and RAFs.

## 11. Browser and visual validation

New `tests/chapters.spec.ts` covers moderate/reverse wheels, accumulated trackpad
intent and momentum, rapid repeated events, tall content and resuming compact
alignment, disclosure expansion, dialog isolation, hash/refresh/history, resize,
font enlargement, reduced motion, zoom/selected text and touch gestures.

The original mascot, comet, navigation, project, skill, responsive, contrast and
axe tests remain. No original tests were removed or relaxed. The new modal test
uses real pointer coordinates because locator.click can deliberately scroll a
transforming reveal into view before clicking; restoration is checked against
the position at the actual user interaction.

The documented `pnpm run capture v3 ...` workflow completed at all seven widths,
including section views, transitions, mobile menus, expanded skills and modal
views. Additional viewport screenshots and a timed chapter scroll sequence are
under `artifacts/v3/`. Baseline and final rendered views were inspected.

## 12. Known limitations

Browser validation uses installed Google Chrome via the documented executable
path override. Native smooth-scroll timing is browser-owned, not a guaranteed
550–850ms animation. Gesture separation necessarily uses an event-gap heuristic;
physical mouse/trackpad devices and Safari/Firefox still merit hands-on checks.
Mobile intentionally uses natural scrolling rather than desktop chapter stepping.
Short windows and enlarged content intentionally exceed a viewport. No field CWV,
INP or physical 120Hz claim is made. Playwright video recording was unavailable
because its ffmpeg binary is absent; timed PNG sequences were captured instead.
No push or deployment was performed.

## Final validation record

- `pnpm install --frozen-lockfile`: passed; dependencies already up to date.
- `pnpm run lint`: passed.
- `pnpm run build`: passed; approximately 413.7kB JS / 138.8kB gzip and
  80.9kB CSS / 16.8kB gzip. No dependency or lockfile changes.
- Full `pnpm run test:e2e` with installed Chrome: **149 passed in 3.3 minutes**.
  This includes all original tests and eleven new chapter regressions.
- A final focused run additionally rechecks the chapter gate after tightening
  paused wheel bursts during an unfinished transition (result below).
- Sampled text contrast minimum 5.518:1 at desktop; sampled meaningful non-text
  contrast minimum 3.747:1 at desktop and mobile. Axe page, fixture and dialog
  checks passed. This is not exhaustive WCAG certification.
- The documented capture workflow passed for all seven widths under
  `artifacts/visual/v3-final/`. Latest viewport/short-window captures under
  `artifacts/v3/` additionally include the final mobile email/padding refinement.
  No horizontal overflow was found. A timed transition sequence shows Home →
  About settling at scrollY=813, without another chapter advance.
- Initial full-suite failures exposed real startup/history/reduced-motion
  conflicts and a legacy Contact padding override. They were repaired without
  modifying the original test suite. Final mobile visual QA also corrected a
  wrapped email address by reclaiming its decorative icon column.
- `git diff --check`: passed. No commit, push or deployment.

### Isolated local rendering sample

`artifacts/v3/performance-isolated.json` records the final local run with no other
browser test processes, headless software-rendered Chrome, unthrottled CPU/network.
At 1440×900: LCP 808ms, CLS about 0.00000026; sampled interaction layout time
0.83ms, style recalculation 50.57ms and script time 37.32ms across roughly three
seconds. No interaction long tasks were observed (a 53ms task occurred during
initial page startup). Median frame interval 16.7ms, p95 33.4ms; 15 of 153 sampled
intervals exceeded 25ms. At 375×900: LCP 796ms, CLS 0, no long tasks, median/p95
frame intervals 16.7ms and one interval above 25ms out of 167.

The desktop tail latency remains a limitation of this measured software-rendered
run; it is not reported as stable 60fps or as a physical-GPU result. Field LCP,
CLS and INP and real hardware browser/trackpad testing remain unverified.

Final focused result: **11 chapter tests passed in 26.2 seconds** after the
paused-burst gate refinement. The tall-content regression waits for native
`scrollend` before starting its next deliberate gesture, and explicitly checks
that reverse scrolling moved through the long content. Final lint passed.
Final production output: JS 413.70kB / 138.83kB gzip; CSS 81.39kB / 16.84kB gzip.
The full-suite result above precedes this isolated gate refinement; the focused
chapter suite validates its final behavior. All other feature code is unchanged
from the passing full run. Physical-device smoothness remains unverified.
