# Portfolio maintenance guide

## Runtime boundaries

- `useChapterNavigation` owns desktop chapter selection. The document is the only scroll plane. Compact sections fill viewport minus the measured navbar; genuinely tall content scrolls natively. Preserve wheel intent/momentum gating, native anchors, deep links, history and dialog isolation.
- `useBackToTop` owns only the bounded 650ms return action. Input interrupts it. Reduced motion returns instantly, and history/focus remain usable.
- `usePortfolioMotion` owns entrances, reveals and mascot-orbit choreography. Fine-pointer PC at 1024px+ gets a slow 64-second rotation, paused offscreen/in hidden tabs. Mobile/tablet retains its scene-range ScrollTrigger rotation. Live media changes revert the previous GSAP context before switching.
- Cat sprite/state/routine logic stays in `features/mascot`. Twelve orbit stars have six explicitly prominent cores; twinkling pauses with scene activity. The unused legacy pixel-star layer was removed.
- `SkillDisclosure` swaps overview/practice inside the existing card footprint. Hidden content is inert and aria-hidden. Button → practice-region keyboard order, Escape restoration and an internally scrollable region handle accessibility without grid expansion.
- The comet uses immutable timestamped viewport samples, bounded resampling, a 144px arc budget, a 450ms lifetime and reusable tapered-edge buffers. One filled silhouette plus a connected highlight eliminates per-segment cap seams. One demand-driven canvas RAF stops after fade; particles remain bounded. Never restore follower-chain physics.

## Cosmic artwork

`CosmicBackground` selects static desktop/mobile scene compositions. Source geometry remains local and uniformly scaled; preserve aspect ratio rather than stretching stellar coordinates.

- Home: peripheral Lyra, broad low observatory sweep, restrained Moon Garden illumination.
- About: upper-right Orion, separate broad atlas trajectory.
- Toolkit: left-side Cygnus, right-side heading, independent cyan trajectory.
- Projects: uniformly rotated Scorpius above the showcase, large lower trajectory and faint depth layer.
- Contact: low-left Ursa Major on wide desktop, quiet horizon; independently recomposed on phones.

`constellations.ts` contains approximate static equatorial positions with intentional star hierarchy and connections. These are decorative projections, not scientific finding charts. No constellation names are painted on the site.

`FeaturedConstellation` contains stars only. Chapter-scale orbits are configured independently in scene components. Absolute `MobileOrbit` viewports follow existing content gaps instead of full-section SVG scaling, preventing wrapped phone text from moving trajectories through stars. All decoration is pointer-transparent, nonfocusable and aria-hidden.

`ellipseArc` generates partial ellipses; rotation is an SVG transform. Non-scaling strokes keep primary paths near 1.1 CSS pixels. Avoid full concentric decorative rings, attached local arcs, animated blur, extra background RAFs and new scroll containers. Keep the mascot's functional circular habitat distinct from chapter artwork.

## Validation

```sh
pnpm install --frozen-lockfile
pnpm run lint
pnpm run build
pnpm run test:e2e
```

The Playwright suite covers real wheel positions at 1440×900/1920×1080, trackpad momentum, reverse navigation, long content, modals, history, mobile touch and reduced motion. Keep those tests when changing chapter CSS. Practice tests compare all card offsets/sizes and chapter height before/after opening every item across seven widths.

Orbit QA samples transformed SVG points against clipping viewports, measuring visible span and longest continuous run. Source path length alone cannot detect mostly clipped trajectories. Tests also hide constellation artwork to prove that orbit geometry and chapter measurements remain independent. Check full-content screenshots as well: geometry measurements cannot detect light lost behind glass.

With a preview running:

```sh
pnpm run capture current http://127.0.0.1:4173
node scripts/capture-cosmic-composition.mjs current http://127.0.0.1:4173
```

Capture tools write only to ignored `artifacts/`. The cosmic workflow includes full-content, background-only, constellation-only, orbit-only and grayscale contact-sheet views. No production debug UI is needed. Inspect 320/375/430px, tablet, desktop and short-height screens. Record timings as observations; do not assert a guaranteed frame rate.

Latest local verification (2026-11-08): frozen-lockfile install, lint and production build succeeded; all 184 E2E tests passed with no skipped/flaky tests. Desktop/mobile captures were reviewed before generated artifacts were removed.

## Repository hygiene

Keep source assets, served fonts/atlas, licenses, `README.md`, this guide and active regression tests/fixtures. `scripts/prepare-assets.mjs` needs `assets/source/avatar.png`; project fixtures are intentionally absent from the real production bundle.

Generated screenshots, HTML reports, traces and fixture builds under `artifacts/` are disposable after review. Do not commit them. Historical version/audit reports and one-off capture helpers were consolidated/removed; current reusable capture and geometry tools remain. Do not remove tests just because they expose a regression. Update assertions only when the intended interaction changes, and retain stronger geometry/accessibility checks.
