# About Section — Full-Bleed Portrait 3D Identity Card Refinement (v4.3)

## 1. Current Front-Face Weaknesses (Pre-v4.3)
Prior to v4.3, the 3D identity badge front face divided the available card area into three separate vertical blocks:
- A distinct top header (`.identity-header`) reserving 64px for `ZANETH. DEVELOPER`.
- A cropped portrait rectangle (`.identity-portrait`) confined to the remaining middle area.
- A solid bottom nameplate (`.identity-name`) with a 2px cyan border line occupying 54px for `Tran Thien Phuc` and focus role.

This tri-part structure diminished the personal impact of the portrait, reduced the visual dominance of the avatar to a small rectangular window, and visually blended into the dark About section background due to weak local lighting and hard-bounded bounding-box artifacts in ambient glow layers.

## 2. Full-Bleed Portrait Implementation
The front face (`.identity-front`) was refactored into a unified, full-bleed portrait canvas:
- The avatar image (`/avatar-portrait.webp`, 720 × 964px) now fills 100% width and 100% height of the printable insert face using `object-fit: cover` and absolute positioning.
- The 12px black protective shell (`.identity-shell`), 3D recess walls (`.identity-well`), 24px corner radius, and physical 10px depth remain completely intact.
- Typography is overlaid directly on top of the portrait inside an absolute layer (`.identity-front-content`) with `pointer-events: none` to preserve seamless interaction with the transparent native flip button.

## 3. Image Crop Decisions
- Configured `object-position: center 32%` to ensure optimal headroom, clear eye-level alignment, and full visibility of all key facial features.
- Upper headroom accommodates the `ZANETH.` brand and `DEVELOPER` micro-label without encroaching on the subject's forehead or eyes.
- Lower chest and device area naturally host the candidate nameplate and technical focus subtitle with strong negative space backing.

## 4. Typography Overlay Design
- **Top Brand**: `ZANETH.` rendered in bold white Manrope at 28px (scaling up to 34px on wide displays, down to 24px on compact phones) with a vivid cyan accent dot (`#6ec8d4`) and soft drop shadow.
- **Micro-Label**: `DEVELOPER` displayed in IBM Plex Mono at 10–11px with 2.5px letterspacing in high-contrast muted white (`rgba(255, 255, 255, 0.72)`).
- **Full Nameplate**: `Tran Thien Phuc` rendered in Manrope at weight 650 (19–20px) with high-contrast drop shadow for crisp edge definition over varied photo values.
- **Professional Focus**: `AI ENGINEERING / DATA ENGINEERING` in IBM Plex Mono (11px) using brand cyan (`#6ec8d4`) with uppercase tracking.

## 5. Local Contrast Improvements & Seamless Boundaries
- **Gradient Scrims**: Dual localized linear scrims (`.identity-front-shading`) protect text legibility without dimming the facial region:
  - Top: `linear-gradient(to bottom, rgba(5, 10, 20, 0.55) 0%, rgba(5, 10, 20, 0.18) 22%, transparent 38%)`.
  - Bottom: `linear-gradient(to top, rgba(5, 10, 20, 0.82) 0%, rgba(5, 10, 20, 0.45) 18%, rgba(5, 10, 20, 0.10) 35%, transparent 50%)`.
- **Elimination of Rectangular Bounding Artifacts**: The previous ambient aura had an abrupt rectangular cutoff at its bounding box due to gradient falloff extending past its bounds. By configuring `radial-gradient(ellipse closest-side ...)` with `transparent 100%` within a restrained inset (`-25px -10px 15px`) and `border-radius: 40px`, the aura transitions to true zero alpha before reaching any element border, completely eliminating harsh rectangular outlines against the cosmic background.
- **Depth Shadow**: Redesigned `.identity-shadow` with an organic radial falloff and 18px blur, providing depth and detachment without dark tilted block artifacts.

## 6. Protective Shell Preservation
- All 6 exterior surfaces (front, back, left, right, top, bottom), 20 faceted curved corner walls (5 facets per corner), and 48 recess well walls remain 100% preserved.
- Refined graphite frame tones (`#1e2636 #0a0d15 #070a10 #141a26`) and top-edge lavender / left-edge cyan specular highlights (`inset 0 1px 0 #b49dff20, inset 1px 0 0 #6ec8d412`) give the shell realistic physical substance.

## 7. 3D Animation Compatibility
- Full 180° Y-axis rotation flipping (`setFlipped`) operates seamlessly across all devices.
- CSS 3D floating keyframes (`identity-float 5.6s ease-in-out infinite`) continue uninhibited.
- Pointer-driven tactile tilt with smooth spring reset (`onPointerMove` / `onPointerLeave`) is preserved.

## 8. Responsive Behavior
- Tested across standard viewports: 320px, 375px, 430px, 768px, 1024px, 1366px, 1440px, and 1920px.
- Zero horizontal overflow (`document.documentElement.scrollWidth <= innerWidth`).
- Proportional typography scaling prevents clipping or text truncation on narrow mobile screens.

## 9. Accessibility & Interaction
- The card itself serves as a direct interactive surface via a transparent native `<button className="identity-flip">` with accessible label `Flip card: Zaneth identity` and `aria-pressed`. Clicking or tapping anywhere on the card flips it seamlessly.
- The redundant visual "Flip card" cue below the badge was removed to give the card an uncompromised, clean floating object presence.
- Face visibility respects `aria-hidden` and HTML `inert` attributes for screen readers.
- Respects `prefers-reduced-motion: reduce`: instantly disables floating and pointer tilt while preserving instant flip functionality.

## 10. Chapter-Scroll Compatibility
- The About section remains classified as compact (`data-compact="true"`) on standard desktop viewports (1440×900, 1920×1080).
- Wheel gestures and chapter navigation (`useChapterNavigation`) transition smoothly between `#home`, `#about`, `#skills`, `#projects`, and `#contact` without jitter or gesture lock.

## 11. Performance Observations
- Zero additional bundle dependencies (pure CSS 3D and native DOM elements).
- No WebGL / canvas overhead.
- Production build footprint remains optimal: CSS ~91 kB (18.88 kB gzip), JS ~429 kB (144.66 kB gzip).

## 12. Test Results
- `tests/identity-card.spec.ts`: 22 / 22 tests passed (45.4s).
- `tests/chapters.spec.ts`: 15 / 15 tests passed (48.4s).
- `tests/visual-capture.spec.ts`: 1 / 1 test passed (8.4s).
- ESLint: 0 errors, 0 warnings.
- Production TypeScript build (`tsc -b && vite build`): successful.

## 13. Visual QA Capture Reference
All screenshots captured during visual regression verification:
- `artifacts/visual/v4.3/02-new-front.png` — Full-bleed portrait card front.
- `artifacts/visual/v4.3/03-new-front-closeup.png` — Card stage close-up.
- `artifacts/visual/v4.3/04-front-slight-angle.png` — Perspective tilt at an angle.
- `artifacts/visual/v4.3/06-new-back.png` — Preserved technical information back face.
- `artifacts/visual/v4.3/07-mid-flip-60deg.png` — Intermediate 60° flip showing physical 3D side walls.
- `artifacts/visual/v4.3/07-mid-flip-90deg.png` — Edge-on 90° flip proving solid wall thickness.
- `artifacts/visual/v4.3/08-full-about-desktop-1440x900.png` — Full desktop About section composition.
- `artifacts/visual/v4.3/09-full-about-mobile-375x812.png` — Mobile About section composition.
- `artifacts/visual/v4.3/10-full-about-1366x768.png` — Balanced 1366×768 desktop presentation.

## 14. Known Limitations
- Browsers with 3D transform hardware acceleration disabled may render edge facets with software rasterization; fallbacks ensure solid readability and accessibility.
