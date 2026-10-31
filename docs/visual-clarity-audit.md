# Section clarity and NexTick node refinement

This pass starts from the latest local implementation, including all unpushed refinements and the removal of the discipline strip. It does not restore the strip or add a separator component.

## Findings and root causes

| Finding | Cause | Resolution |
| --- | --- | --- |
| Hero and About read as one chapter | Both inherited the same foundation background | Give About its own full-width slate plane |
| Section surfaces could not fill the viewport | About and Projects applied `page-container` to the section itself | Move container alignment to an inner wrapper |
| Card edges could disappear against a new section plane | Page surfaces and module elevation had not been assigned independently | Separate chapter tokens from card surfaces; lift profile and project modules |
| Some control boundaries were too quiet | Interactive borders reused the low-emphasis module border | Use stronger control edges while keeping decorative card borders restrained |
| Companion metadata competed with rotating guides | A high stacking level alone does not cover lines beneath transparent text areas | Add opaque reading planes at the existing header/footer layer |
| Architecture shapes differed across representations | Preview markers were squares; mobile stage icons measured 42 × 46 px | Render 14 px preview circles and 52/44 px square-box stage circles |
| Connectors and nodes could drift | Preview gaps changed centers; explorer line positions were separately hardcoded; hover translated the icon | Use gap-free equal tracks and shared node-size calculations; use surface/outline feedback without moving node centers |

## Section surfaces and spacing

| Chapter | Token | Color |
| --- | --- | --- |
| Hero | `--bg` | `#1B293D` |
| About | `--section-profile` | `#28364B` |
| Toolkit | `--section-surface` | `#1D2F42` |
| Selected Work | `--section-work` | `#263C4B` |
| Contact | `--section-contact` | `#252F46` |

The sequence moves through primary navy, slate, technical navy, a cooler showcase plane, and an indigo closing plane. All backgrounds reach the viewport edges. The shared container still controls heading and content alignment.

Existing balanced section padding is retained: 48–72 px, with the Hero footer's 16/24 px mobile/desktop spacing. The stronger separation comes from surfaces, not additional empty space. The profile surface is `#35425D`; project cards use the existing raised surface. Main, secondary, and quiet text retain separate roles.

## Visibility, interaction, and layers

The mascot retains atmosphere 0 → orbital geometry 1 → character world 2 → reading/controls 3. Metadata and status text now paint over a navy reading plane, so guides and stars cannot pass behind their glyphs. The halo, orbit rotation, sprite renderer, controller, and motion timelines remain intact.

Control borders use `--line: #879AB3`; quiet card edges continue using `--module-line`. Project filters and the details action receive readable control boundaries. The details action uses primary text on the raised surface. `--diagram-line` centralizes connector contrast.

The native project modal, sticky close toolbar, navigation glass fallback, keyboard focus indicators, skill-disclosure animation, reduced motion, conditional Demo/Source actions, and event-packet lifecycle remain intact. A new interrupted-animation check covers live motion preference changes and rapid traversal through scroll reveals.

## NexTick geometry

- Compact nodes use `.preview-node`, equal 14 px dimensions, circular borders, and a cyan/lavender outline against the inset preview.
- Explorer nodes use one `--stage-size`: 52 px desktop, 44 px mobile. Icons stay centered; click and keyboard targets retain their existing buttons.
- Both connector systems derive their vertical position from the node center. Equal grid tracks align connector endpoints with the first and last nodes.
- The selected stage has an additional inner ring and a visible circular marker, beyond its color change. Inspector dots and event packets use round markers.
- Hover/focus feedback changes surface and border contrast without translating the node away from its connector.
- Variable 3/8-stage fixtures verify circles, selection, connector alignment, internal scrolling, and absence of modal overflow. Compact long-pipeline summaries still compress to five positions.
- Brand marks and unrelated decorative pixel geometry remain unchanged.

## Visual evidence

[Interactive before/after gallery](../artifacts/visual/clarity-review.html)

| View | Before | After |
| --- | --- | --- |
| Hero → About | [Desktop](../artifacts/visual/clarity-before/hero-about-1440.png) | [Desktop](../artifacts/visual/clarity-after/hero-about-1440.png) |
| About → Toolkit | [Desktop](../artifacts/visual/clarity-before/about-skills-1440.png) | [Desktop](../artifacts/visual/clarity-after/about-skills-1440.png) |
| Toolkit → Projects | [Mobile](../artifacts/visual/clarity-before/skills-projects-375.png) | [Mobile](../artifacts/visual/clarity-after/skills-projects-375.png) |
| Projects → Contact | [Desktop](../artifacts/visual/clarity-before/projects-contact-1440.png) | [Desktop](../artifacts/visual/clarity-after/projects-contact-1440.png) |
| Compact architecture | [Preview](../artifacts/visual/clarity-before/pipeline-preview-1440.png) | [Preview](../artifacts/visual/clarity-after/pipeline-preview-1440.png) |
| Explorer | [320 px](../artifacts/visual/clarity-before/dialog-architecture-320.png) | [320 px](../artifacts/visual/clarity-after/dialog-architecture-320.png) |
| Entire page | [Desktop](../artifacts/visual/clarity-before/full-1440.png) / [mobile](../artifacts/visual/clarity-before/full-375.png) | [Desktop](../artifacts/visual/clarity-after/full-1440.png) / [mobile](../artifacts/visual/clarity-after/full-375.png) |

Fresh local before/after captures cover 320, 375, 430, 768, 1024, 1440, and 1920 px. Every capture width includes all sections and boundaries, the compact preview, and modal views. Expanded skills and multi-project fixtures are captured at 375/1440 px. Live companion captures record forward/return scroll states and actual transform matrices at 320/375/768/1440 px. The generated artifacts are gitignored.

## Files modified in this pass

| Area | Files |
| --- | --- |
| Section surfaces / wrappers | [tokens.css](../src/styles/tokens.css), [sections.css](../src/styles/sections.css), [About.tsx](../src/sections/About.tsx), [Projects.tsx](../src/sections/Projects.tsx) |
| Project diagrams / controls | [ProjectVisual.tsx](../src/features/projects/ProjectVisual.tsx), [PipelineVisual.tsx](../src/features/projects/PipelineVisual.tsx), [projects.css](../src/features/projects/projects.css) |
| Companion reading layers | [mascot.css](../src/features/mascot/mascot.css) |
| QA | [capture-portfolio.mjs](../scripts/capture-portfolio.mjs), [portfolio.spec.ts](../tests/portfolio.spec.ts), [architecture.spec.ts](../tests/projects/architecture.spec.ts), [collection.spec.ts](../tests/projects/collection.spec.ts), [visual-system.spec.ts](../tests/visual-system.spec.ts), this report |

Other pending changes from previous tasks remain in the workspace and were not reverted.

## Verification and limits

Lint and the production build passed. The focused browser run passed 32 checks. The final full suite passed **130/130 tests**, with zero failures, flaky tests, or skips, as recorded in the [browser report](../artifacts/clarity-playwright-report/index.html). This includes mascot continuity, navigation, disclosures, project actions/modal, variable-stage geometry, rapid scroll reveals, accessibility, and reduced motion.

The capture audit returned no browser errors or horizontal overflow at any of the seven widths. Text checks sampled 109 rendered combinations at each of 375/1440 px, with a minimum contrast ratio of 4.59:1. Icon/control checks sampled 100 combinations at each width, including selected/hover/focus node states, with a minimum ratio of 3.83:1. These are sampled rendered combinations, not a claim that every pixel or possible browser state has been exhaustively certified.

Visual QA used local production builds in Chromium, with existing touch emulation. Physical devices, Firefox, and Safari remain unverified. The local baseline is used because it includes the user's unpushed work; no deployment was changed.
