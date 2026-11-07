# Cosmic Motion & Celestial V3.3

## Audit
Local and remote HEAD both matched `9e8a6bfd07b4a4e49d34c7f2f9484b9da6a9d1bb`; the starting tree was clean. Audited cursor, all five scene files, shared primitives, SVG sizing, chapter controller, motion hook, materials and tokens. The original cursor updated 28 follower positions every frame and drew midpoint quadratic curves. Its historical geometry therefore moved after input. Sparkles used follower point 2. About and Toolkit used fragmented indexed networks; Toolkit also used circuit paths. Projects used paired full ellipses. Contact used a filled ellipse and repeated horizon lines. Outer SVGs stretched independently on each axis. Glass surfaces and mascot own separate visual layers and were preserved.

Baseline captures are reconstructed from the exact original commit in an isolated `/tmp` directory; initial capture attempts were blocked by a missing browser and sandbox restrictions. No working source was rolled back for capture.

## Historical cursor
`history.ts` stores readonly timestamped samples, outside React state. Pointer events use coalesced samples when available and client coordinates exclusively. Coalesced timestamps are translated relative to the dispatch event onto the performance clock. Invalid coordinates and regressing timestamps are rejected. Near-identical input is deduplicated. A gap over 180ms or jump over 600px starts a new path. Re-entry, resize, blur and visibility resets prevent connecting unrelated positions.

Linear resampling uses 3px spacing with at most 64 subdivisions per input sample. New samples lie on the observed segment. Retention is bounded by 144px cumulative polyline length, 600ms and 512 points. Arc trimming creates a new visible boundary point, never mutating an existing sample. This boundary slides only along the recorded segment. Canvas draws round straight segments with spatial taper and age opacity; there is no geometric easing. The core remains at the latest accepted coordinate. Stationary history fades in place.

The existing 28-slot dust pool, dots, reusable four-point paths and pixel crosses remain. Emissions use the actual latest recorded location. Particles alone drift independently. One demand-driven RAF loop stops after the core/history and particles expire. DPR remains capped at two, with no frame-time layout reads or pointer-triggered React renders.

## Stellar data and sources
Home: Lyra (Vega plus compact parallelogram). About: Orion (shoulders, Belt, sword, legs). Toolkit: Cygnus (Northern Cross and extended wings). Projects: Scorpius (head, Antares and hooked tail). Contact: Ursa Major (Dipper and supporting body/leg stars).

Reference: [IAU constellation charts and explanation](https://iauarchive.eso.org/public/themes/constellations/). The IAU defines sky regions, not a unique official stick figure. These are simplified editorial figures using static approximate equatorial positions, not scientific finding charts. RA is converted to degrees with a cosine declination correction before uniform normalization. Explicit stable IDs, visual emphasis and connections replace index-based star importance. No astronomical data is fetched at runtime.

## Orbital composition
A shared SVG arc primitive maps ellipse endpoints from angles, uses the correct large-arc flag and rotates in local coordinates. All current arcs sweep forward less than a full revolution. Home uses a broad tilted observatory trajectory and quieter offset support. About enters from the left like a celestial atlas. Toolkit uses a narrow cool cyan orbit. Projects has the strongest broad tilted sweep with offset depth. Contact has one wide faint horizon arc. None uses full ellipses or concentric background rings. Functional Moon Garden geometry remains intact.

## Responsive integration and accessibility
Outer compositions and nested stellar SVGs use uniform scaling. Mobile uses separate placements, smaller complete figures and one orbit; secondary tracks are hidden. Artwork is static, aria-hidden, nonfocusable, pointer-transparent and has no layout footprint. Existing glass, contrast palette, focus, dialogs, scrolling and mascot behavior remain. Reduced motion disables the cursor while retaining static art. No dependencies or background animation loops were added.

## Evidence and validation
Screenshots: `artifacts/v3.3/before` and `artifacts/v3.3/after`, covering all five chapters at 320, 375, 430, 768, 1024, 1440 and 1920 pixels. After captures also include straight, L, S, circular, reversal, zigzag and stationary-fade cursor states. The captures report no horizontal overflow at those widths. Pure tests cover history immutability, corners, reversal, in-place expiry, cumulative length, bounded memory, discontinuity, invalid input, and static figure integrity. Browser regression checks inspect both branches of an L and reject a diagonal shortcut, alongside existing lifecycle, native cursor, cat and dialog checks.

Performance observations from the initial browser run: connected luminous width 148px; peak alpha 254; sparse-pool peak 7 fills and 675 lit pixels in the test region. These are bounded workload observations, not a frame-rate claim. No fixed frame rate has been asserted.

## Limitations
Approximate stellar projection is appropriate for decoration, not astrometry. The 64-subdivision cap means exceptionally long accepted segments may exceed 3px spacing. SVG artwork remains behind translucent surfaces, so some stars become quieter behind glass. Baseline and after screenshots are review artifacts, not pixel-equality tests. Automated screenshot capture does not substitute for device-based subjective motion assessment.

### Visual review
Desktop and mobile grayscale contact sheets were inspected, alongside Home, About, Projects and cursor captures. Background-only captures also check the complete decorative plane independently of glass. Short-height checks at 375×600 and 1440×600 reported no horizontal overflow. Projects' figure was reduced and moved into the top margin so its hooked tail stays above the featured card. Mobile figures use compact top-right placement. Contact's arc uses the upper ellipse sector, keeping a faint horizon visible.

![Original Home](../artifacts/v3.3/before/home-1440.png)
![Refined Home](../artifacts/v3.3/after/home-1440.png)
![Refined mobile About](../artifacts/v3.3/after/about-375.png)
![Historical right-angle trail](../artifacts/v3.3/after/cursor-L.png)

### Command results
- `pnpm install --frozen-lockfile`: passed; lockfile unchanged.
- `pnpm run lint`: passed.
- `pnpm run build`: passed; final JS approximately 422.42kB (141.89kB gzip).
- Initial development-server suite: 159 passed, 2 failed. Transfer budget correctly rejected the development payload; a mascot footfall timing test failed, then passed in the production run.
- `pnpm run test:e2e` against production: 166 passed, 1 infrastructure failure. The remaining failure was `browserContext.close: ENOENT` for a trace file, caused by concurrent targeted runs sharing Playwright's default artifact directory. It was not a failed UI assertion. A separate-output isolated rerun follows below.
- Final targeted cosmic and geometry suite: 16 passed, including ellipse endpoints/flags, all requested responsive widths, immutable history and observed-segment resampling.
- Cursor targeted suite: all cursor checks passed, including the historical L regression.
- Production browser sample: 210,487 transferred bytes, CLS 0, 905 DOM nodes. Text contrast minimum 5.52; non-text contrast minimum 3.75 in the existing rendered checks.

No tests were weakened. No push or deployment was performed.

Isolated production rerun with `--output artifacts/v3.3/recheck-results` and a separate HTML report: **1 passed**. The missing-trace failure did not recur.
