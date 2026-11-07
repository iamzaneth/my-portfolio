# Zaneth V3.1 — Stardust Comet & Five Cosmic Worlds

## Baseline and scope

Started from clean HEAD `d8a105d2b7ec7fd799f6ed7b1cdd18b11c4fc83b`, matching the
requested revision. Read the actual cursor, chapter styles/controller, App,
sections, glass materials, tests and capture tooling before editing.

The comet's 84px cap, double opacity taper, small core and low particle opacity
made it difficult to notice. Increasing only the cap would not solve that: the
following chain and index-based fade shortened its visible length. All chapters
also shared the same star distribution and circular pseudo-element, differing
primarily in glow color.

This change touches visual presentation only. `useChapterNavigation.ts`,
Navbar, project/dialog behavior, skill disclosure behavior, mascot controller,
GSAP orchestration, profile/project data and the glass material system are
unchanged. No dependency, runtime request, external image or new animation
framework was added.

## Comet parameters

| Parameter | V3 | V3.1 |
| --- | --- | --- |
| Following points | 20 | 28 |
| Particle slots | 20 | 28, reused |
| Tail arc budget | 84px | 136px |
| Core radius | 1.6px | 2.2px |
| Glow radius | 6px | 10px |
| Core opacity | 0.70 | 0.92 |
| Tail intensity multiplier | 0.38 | 0.58 |
| Tail width | 0.3–1.8px | approximately 0.25–2.35px |
| Follower time constant | 22ms | 30ms; head remains 9ms |
| Tail fade after grace | 300ms | 440ms |
| Emission distance / interval | 14px / 85ms | 11px / 75ms |
| Dust size | 1–1.7px | 1.4–2.6px |
| Dust lifetime | 280–500ms | 300–500ms |
| Prominent sparkle lifetime | none | 240–420ms |

The connected midpoint curves now taper by spatial arc length, rather than both
history index and distance. The final curve is interpolated at the arc budget
instead of dropping a whole segment after fast input. Color transitions from
pale lavender-white near the head toward cyan. The head's following time stays
unchanged to avoid introducing pointer lag.

Most emissions remain dots. Every fifth pooled emission is a four-point glint;
one other emission per ten is a small pixel cross. The rest are small white,
lavender or cyan dust. This is a predictable sparse distribution rather than
random bursts. Two cached Path2D shapes avoid rebuilding star geometry. Glints
briefly rise in brightness, expand subtly and fade; no per-particle shadowBlur
or new timers are used. Small randomized velocities keep drift to a few pixels.

One canvas, one demand-driven RAF chain, capped DPR=2, no pointer-driven React
state, visibility/resize/blur handling, capability detection, complete clearing,
listener cleanup and reduced-motion exclusion remain intact. Emission still
requires fresh movement. Backgrounds add no canvas or render loop.

## Five world compositions

### Home — Moonlit Observatory

Large open celestial arcs sweep around the far right of the Moon Garden.
Sparse clustered stars and small pixel glints frame the inhabited habitat.
Lavender/cyan light is concentrated behind the cat, with a trace of warm light.
The headline side stays calm. No second moon is introduced.

### About — Celestial Cartography

Original irregular star-map connections, celestial coordinate marks and faint
atlas annotations frame the outer edges. The indigo light originates from the
lower left, opposing the Home composition. Nodes and line sequences are authored
individually rather than generated as a dotted grid. Visual QA moved connections
clear of the headline and biography, with a medium-width gutter adjustment.

### Toolkit — Data Constellation

Angular circuit paths, bounded grid fragments and connected node clusters sit
around the capabilities. Cyan light comes from opposing corners. Orthogonal
routes and square fragments distinguish this engineered world from About's
organic navigation map. These are illustrative motifs with no live metrics.

### Selected Work — Event Horizon

A tilted, partial double accretion ellipse enters from the upper right, backed
by a distant dark planetary edge. Opposing directional light/geometry enters
from the lower left. This deliberately asymmetric silhouette is distinct from
Home's open vertical observatory arcs. The real NexTick architecture retains
its separate dark inset and interactive semantics.

### Contact — Starlit Horizon

A broad low planetary horizon, a quiet sparse starfield, and bottom-origin
lavender/cyan atmospheric light create closure. Visual QA lowered the horizon
below the footer text. The CTA and contact panel remain the focal content.

## Architecture and layering

`src/features/cosmic/CosmicBackground.tsx` supplies the shared decorative shell,
a typed world selection, and desktop/mobile SVG viewports. Five small scene
modules own their actual compositions. Shared primitives batch distant stars
into a single SVG path, draw connection graphs, and supply small pixel glints.
`cosmic.css` owns atmosphere, palette, opacity and responsive presentation.

Each section mounts one background directly inside the existing isolated section.
The background is absolute, z-index -1, pointer-events:none and aria-hidden; its
own overflow is clipped. It has no layout footprint and never clips readable
chapter content. Atmospheric gradients form the lower art plane and static SVG
geometry sits above them, with glass/content above both. The old shared ::before
and ::after wallpaper rules and obsolete chapter-light values were removed from
`chapters.css`; its scrolling and sizing rules remain unchanged.

Desktop and mobile are separately authored compositions, selected by CSS at the
existing 768px breakpoint. They do not require a React resize subscription.
Mobile reduces density, moves constellation clusters/circuits toward gutters,
removes node rings, lowers the project band below the introduction and preserves
the Contact horizon. Medium desktop/tablet widths expand the map/circuit art
slightly into the narrower gutters to keep lines clear of text.

Both SVG trees are static; the inactive one is display:none. Distant stars are
batched paths rather than hundreds of DOM particles. No background element uses
an SVG filter, animated blur, WebGL, continuous motion, or JavaScript lifecycle.
Offscreen artwork requires no animation pause observer because it never animates.

## Visual verification

Before/after color and grayscale screenshots:
`artifacts/v3.1/before/` and `artifacts/v3.1/after/`.
Each contains Home, About, Toolkit, Projects and Contact at 1440px and 375px,
plus a moving-comet capture. Additional art-only captures and labeled world
contact sheets allow comparison without the repeated content layout:
`after/worlds-contact-sheet.png` and `after/worlds-contact-sheet-gray.png`.

The first rendered pass exposed constellation strokes across introductory text
and a horizon through the footer. These were repositioned before final QA.
The grayscale comparison was inspected for composition, not just palette.

The existing `pnpm run capture v31 http://127.0.0.1:4173 artifacts/visual`
workflow also completed at 320, 375, 430, 768, 1024, 1440 and 1920px, covering
sections, menus, expanded skills, project previews and dialog states. The few
final artwork translations are covered by refreshed color/grayscale captures
and focused scene checks.

## Accessibility and interaction preservation

Static art remains visible with reduced motion. The comet remains entirely
disabled for reduced motion, coarse/touch-only pointers and non-mouse input.
Native cursor, hit testing, keyboard focus, buttons, selections and scrolling
are unchanged. Decorative SVGs cannot receive focus. Glass transparency and
blur values have not been increased. Existing axe and sampled contrast checks
run against the new scenes; they are not an exhaustive WCAG certification.

No scroll-controller, history, wheel threshold, modal lock or animation state
logic was edited. Existing chapter, mascot, cursor lifecycle and dialog tests
remain in the full suite.

## Tests and performance

Locked dependency installation, lint, TypeScript/Vite build, browser checks and
rendering observations are recorded below after final runs.

New cursor tests measure actual canvas pixels: peak core opacity, bright-pixel
footprint and connected trail width, excluding detached dust. The footprint cap
from the original tests remains unchanged. Additional instrumentation observes
Path2D sparkle draws and a strict per-frame fill bound (one head plus at most
28 pooled particles), followed by complete clearing and stopped canvas work.
It introduces no production diagnostics or test-only runtime flags.

Seven scene tests check unique path composition, desktop/mobile selection,
static reduced-motion art, correct section-sized decoration, hidden semantics,
pointer transparency and no overflow. All original behavior assertions remain.

Rendering diagnostics cover fast mouse movement, chapter transitions, glass
hover and independent project-modal scrolling. Local headless Chrome measurements
are diagnostic; no fixed 60/120Hz frame-rate, field INP or physical-device claim
is made. An isolated run is preferred to separate test-process CPU contention.

## Known limitations

Visual and functional browser validation uses installed Google Chrome through
the documented Playwright executable override. Physical high-refresh displays,
Safari/Firefox, field performance and extended device profiling are unverified.
Backgrounds intentionally remain static to preserve the existing motion budget.
The arc budget is a conservative control-polygon bound; visible raster length
varies with speed, curvature, DPI and fading. The mobile SVG planes recompose
paths/objects but use normalized coordinates across naturally tall chapters.
No push or deployment is performed.

## Final verification record

- `pnpm install --frozen-lockfile`: passed, already up to date.
- `pnpm run lint`: passed.
- `pnpm run build`: passed. Final JS 420.36kB / 141.76kB gzip; CSS 83.73kB /
  17.40kB gzip. Relative to original HEAD: about +2.93kB gzipped JS and +0.56kB
  gzipped CSS, with no dependency change.
- Full `pnpm run test:e2e`: **158 passed in 3.6 minutes**, including all original
  chapter, mascot, dialog, keyboard, reduced-motion, touch and axe checks.
- After the final artwork clearance/opacity translations, focused chapter,
  cursor and cosmic suites: **26 passed in 45.9 seconds**. No original assertion
  or original footprint bound was relaxed. New cursor tests only add checks.
- Canvas observation at steady movement: peak alpha 253/255, 18 bright pixels,
  connected luminous width 137px. Rapid-motion sample: 95 observed glint draw
  calls across frames, at most 669 lit pixels, peak seven fill calls in a frame
  (one head plus six particles). These are draws, not 95 simultaneous particles.
- Complete fade, inactive draw count, touch/reduced-motion exclusion, resize,
  native-pointer behavior, clickable controls and independent dialogs passed.
- Sampled text contrast minimum 5.518:1; meaningful non-text minimum 3.747:1.
- All seven required widths passed the documented visual workflow and scene
  layout checks without horizontal overflow. Desktop/mobile color and grayscale
  artwork was inspected; additional 768px/1024px captures check narrow gutters.
- `git diff --check`: passed. Navigation, glass and mascot source diffs are empty.

### Matched local rendering observations

`artifacts/v3.1/performance.json` contains the refined build's diagnostic sample.
A separate temporary `git archive HEAD` build was served on port 4178 for the
same script, without changing the working tree; results are in
`performance-baseline.json`. Both use unthrottled headless Chrome at 1440×900,
no concurrent browser test processes, and equivalent pointer/wheel/modal phases.
Frame sampling stops fully between phases. Values are individual local samples,
not statistically controlled benchmarks or physical-display FPS guarantees.

| Phase | Original median / p95 interval | V3.1 median / p95 interval | V3.1 script / layout time |
| --- | --- | --- | --- |
| Fast comet | 16.7 / 16.7ms | 16.7 / 16.7ms | 23.74 / 0ms |
| Chapters + glass hover | 16.7 / 49.9ms | 16.7 / 33.4ms | 24.63 / 0.60ms |
| Project modal | 33.3 / 33.4ms | 33.3 / 50.0ms | 21.51 / 4.59ms |

Neither build produced interaction long tasks in these phases. Whole-page task
time for the comet sample was 378.72ms original versus 338.65ms refined; modal
sample task time was 197.89ms versus 182.30ms. These short samples do not establish
a causal performance improvement. Modal frame delivery remains variable in
headless software rendering, including a slower refined p95 despite lower sampled
main-thread work. Stable 60/120Hz, physical trackpads/GPUs and field INP remain
unverified. No performance target is claimed from these observations.
