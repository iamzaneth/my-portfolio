# Portfolio visual refinement · 27 October 2026

The implementation preserves the navy, lavender, cyan, pixel-art identity while giving reading areas, capability modules, project previews, and interactions distinct roles.

## Findings and decisions

- Similar background and card tones flattened the page. Most accents also repeated at the same scale. Reading chapters now sit on the foundation; Toolkit and Contact use a lighter section plane; cards, identity surfaces, and technical previews have separate elevations.
- The Toolkit's core groups had surfaces, padding, and larger headings, while supporting groups used open layouts. All four now use the same module geometry, heading scale, icon wells, technology lists, and disclosure states. Focus is explicit metadata in `skills.ts`, expressed through a small label and marker.
- The hero repeated disciplines in the role, social row, and strip. The strip has been removed entirely; the hero and About retain the professional focus and principles. The hero footer reserves 24 px on desktop and 16 px on mobile before About’s existing section padding, creating a quiet transition without a replacement separator.
- Very transparent orbital strokes had little contrast against the halo. The scene now uses explicit nonnegative layers: atmosphere 0, geometry 1, character world 2, header/footer 3. One-pixel solid/dashed rings use dedicated tokens, the halo is softer, and atmospheric stars are reduced from 96 to 36. Geometry ends before the caption and controls.
- The Developer Field Card has a restrained identity tint and clearer internal hierarchy. Technical cyan gives Selected Work a focal point, inset previews improve diagram readability, and Contact closes with larger typography and quieter boundaries.

## Palette and component hierarchy

| Role | Token | Value |
| --- | --- | --- |
| Reading foundation | `--bg` | `#1B293D` |
| Secondary reading/dialog plane | `--bg-subtle` | `#213249` |
| Toolkit / closing section | `--section-surface` | `#23344B` |
| Content module | `--surface` | `#2B3D56` |
| Interactive elevation | `--surface-raised` | `#344A65` |
| Developer Field Card | `--surface-identity` | `#303B55` |
| Technical preview | `--surface-inset` | `#1E3044` |
| Primary / secondary / quiet text | `--text` / `--muted` / `--faint` | `#EDF3FA` / `#C0CEDE` / `#B2C2D6` |
| Identity / selected state | `--accent` | `#BEA9FF` |
| Technical systems | `--cyan` | `#84D6DF` |
| Rare featured detail | `--warm` | `#EFCB91` |

Shared tokens distinguish control boundaries from quiet decorative edges. Tinted states derive from semantic accent tokens. Mobile body copy, technology lists, action labels, and companion metadata are more readable. The project-details label switches to primary text on the raised card hover surface to retain contrast.

## Behavior preserved

GSAP entrance/reveal/orbit logic, scroll direction reversal, the cat controller, sprite renderer, motion timelines, and disclosure animation are retained. Reduced motion remains live. Project collections remain data-driven, compact, and conditional on valid action URLs. Native modal focus containment, independent scrolling, close controls, and return focus remain intact.

Cards expand independently without stretching the neighboring card. Closed desktop technology lists reserve two lines for alignment, while mobile lists size naturally. The section rhythm uses composition and flat surface planes; no nebula dividers were added.

## Visual evidence

Local baseline, production baseline, and final local production-build captures are saved under `artifacts/visual/{before,production,after}`. These generated artifacts are intentionally gitignored.

- [Interactive before/after gallery](../artifacts/visual/index.html)
- [Toolkit before](../artifacts/visual/before/skills-1440.png) / [after](../artifacts/visual/after/skills-1440.png)
- [Companion before](../artifacts/visual/before/orbit-1440-0.png) / [after](../artifacts/visual/after/orbit-1440-0.png)
- [Mobile full page before](../artifacts/visual/before/full-375.png) / [after](../artifacts/visual/after/full-375.png)
- [Final capture audit](../artifacts/visual/after/audit.json)

The historical baselines include Hero, the former ribbon, About, Toolkit, Projects, Contact, full page, and modal views at 320, 375, 430, 768, 1024, 1440, and 1920 px. Expanded Toolkit views are captured at 375/1440 px. Live orbit captures include forward and return scroll positions at 320/375/768/1440 px; their JSON files record actual transforms. Final project fixture captures cover collections of 1, 2, 3, and 12 entries at 375/1440 px.

The capture command excludes live orbit images from exact pixel comparison because their sprite poses follow the browser clock. Those images remain available for visual inspection.

## Verification

The browser suite adds shared-module/responsive/independent-expansion checks, explicit scene-layer and footer separation checks, composited text contrast checks in normal/expanded/hover/modal states, and a screenshot pixel comparison proving an exposed orbit stroke paints above ambient light. Existing navigation, accessibility, project inventory/modal, mascot state/continuity, and scroll checks remain.

The navigation fallback test now compares against the foundation instead of the previous hardcoded navy. The speed-change continuity test pauses the sprite clock at the measured boundary so a natural frame advance between animation frames cannot produce a false failure; its exact frame and world-position assertions remain.

Final verification:

- `npm run lint` — passed.
- `npm run build` — passed.
- `npm run test:e2e` — 120/120 passed in Chromium against the production preview, including the project fixtures.
- Text contrast — 110 rendered combinations at each of 375/1440 px; minimum 4.59:1, including expanded, hover, and modal states.
- Axe WCAG A/AA checks — page, mobile navigation, open case study, and project fixture checks passed.
- Visual capture audit — all seven widths returned no browser errors or horizontal overflow; live orbit evidence and independent expansion were also inspected.
- Local performance sample — 197,620 resource-transfer bytes, layout shift score 0, and 526 DOM nodes. This is a local Chromium measurement, not a production field-performance claim.

The [Playwright report](../artifacts/playwright-report/index.html) retains contrast attachments and orbit-paint evidence.

To reproduce locally:

```bash
npm run lint
npm run build
npm run test:e2e
npm run capture -- after http://127.0.0.1:4173
```

Use `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` when running with a system Chrome installation. A supplied `PLAYWRIGHT_BASE_URL` uses an existing production preview.

## Limits

Visual inspection used Chromium at the requested viewport widths, plus the existing touch-emulation tests. Physical devices, Safari, and Firefox were not inspected. Production was accessible through Chrome; no user screenshot attachments were present in this conversation. This work changes the local codebase only and does not publish a deployment.

Strip-removal follow-up: `artifacts/visual/no-strip` captures the current page without the ribbon; strip-specific CSS, capture steps, and contrast selectors have been removed. Lint and build passed, and all 43 relevant Playwright checks passed (portfolio, navigation, orbit, sprite rendering, and visual system). All seven capture widths passed without overflow or browser errors. The [desktop transition](../artifacts/visual/no-strip/hero-about-1440.png), [mobile transition](../artifacts/visual/no-strip/hero-about-375.png), and [follow-up test report](../artifacts/no-strip-playwright-report/index.html) document this change. The earlier gallery and verification numbers above document the preceding refinement pass.
