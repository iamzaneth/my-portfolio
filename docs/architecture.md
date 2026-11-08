# Portfolio maintenance guide

## Runtime boundaries

- `useChapterNavigation` owns desktop chapter selection. The document is the only scroll plane. Compact sections fill viewport minus the measured navbar; genuinely tall content scrolls natively. Preserve wheel intent/momentum gating, native anchors, deep links, history and dialog isolation.
- `useBackToTop` owns only the bounded 650ms return action. Input interrupts it. Reduced motion returns instantly, and history/focus remain usable.
- `usePortfolioMotion` owns entrances, reveals and mascot-orbit choreography. Fine-pointer PC at 1024px+ gets a slow 64-second rotation, paused offscreen/in hidden tabs. Mobile/tablet retains its scene-range ScrollTrigger rotation. Live media changes revert the previous GSAP context before switching.
- `IdentityCard3D` keeps separate reveal, float, perspective, tilt, and flip layers. GSAP reveals only the outer layout wrapper and clears its temporary styles. The black shell spans Z=±9px; printed faces sit at ±6px, joined to the lip by 3px recess walls. `identityGeometry.ts` is the single physical model for dimensions, radius, facet count, −13° yaw, 2° pitch and 1500px perspective; it supplies CSS variables and builds rounded corner facets once. Preserve the 3D chain without clipping, filters, opacity, or containment; rounded clipping belongs on the printed faces. The native flip button remains outside both faces, and the inactive face is inert and aria-hidden. Reduced motion disables drift, tilt, and transitions while retaining face switching.
- Cat sprite/state/routine logic stays in `features/mascot`. The 64×64 source PNGs and `assets/source/mascot/manifest.json` generate the 832×704 atlas and `catSprites.ts`. The generated catalog owns frame dimensions, measured groundRow 44 and visible envelopes. CSS receives the ground ratio; GSAP movement bounds use the symmetric envelope. Responsive display sizes, two-layer switching, gait phase, all timings and posture bridges remain unchanged. Twelve orbit stars have six explicitly prominent cores; twinkling pauses with scene activity.
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

Badge tests verify both outer and recessed wall coordinates, rendered edge pixels at oblique and 90° angles, responsive typography, stable layout, keyboard/touch flipping, reduced motion, and compact chapter navigation. Keep these regression checks when adjusting the shell. Generate `public/avatar-portrait.webp` from the retained full-resolution source rather than enlarging the square thumbnail.

## Mascot asset maintenance

`assets/source/mascot/manifest.json` and its 65 transparent PNGs are the editable
source of truth. `pnpm run assets:cat` packs them without resizing and generates
the atlas/catalog. `pnpm run assets:cat:check` validates exact RGBA packing,
dimensions, palette, binary alpha, native pixel detail, counts, bounds and ground
alignment without creating review artifacts. Optional `pnpm run assets:cat:review`
writes a contact sheet and audit under `artifacts/mascot/`.

Keep frame order and timing separate: the renderer preserves two-layer atomic
switching and gait phase; the controller owns routines, posture bridges and
pause/resume. Logical waking reverses Laying into sitting; the source Stretching
clip remains for standing stretches. See `public/mascot/ATTRIBUTION.md` for the
original CC0 source and project modifications.

`pnpm run capture:characters <label> http://127.0.0.1:4173` records the badge at
0°, 15°, 30°, 45°, 60°, 90°, 120° and 180°, plus eight responsive sizes, locomotion
bounds, all source clips and local performance observations. Output is disposable
under `artifacts/characters/`.

## Repository hygiene

Keep source assets, served atlas/fonts, licenses, active regression tests and
fixtures. `scripts/prepare-assets.mjs` needs the original avatar and mascot PNGs.
Fixture content is isolated from the production bundle and built by Playwright.

Run `pnpm run test:clean` after all test/capture processes stop. It removes the
entire generated `artifacts/` tree, including fixture builds, plus root reports
and coverage. The next test run regenerates fixtures automatically.
`pnpm run clean` also removes `dist/`, `dist-ssr/`, build caches and TypeScript
incremental metadata. Neither command removes dependencies, source code or Git.

Do not retain generated screenshots, videos, traces, historical implementation
reports or capture-only tests in source control. Use the reusable capture commands
when visual evidence is needed. Keep regression assertions for behavior, geometry,
accessibility, page budgets and source-asset integrity.
