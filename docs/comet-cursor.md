# Cosmic comet cursor

A single `CometCursor` mounts at the App root. It is independent of GSAP and the
mascot controller. No dependency or cursor replacement is introduced.

## Appearance

- Soft white/lavender core: 3.2px, with a faint 12px glow footprint.
- Midpoint quadratic curves, tapered width/opacity, lavender-to-cyan coloring.
- Tail path capped at 84px; exponential following produces a shorter tail at low speeds.
- Twenty preallocated position samples and twenty reusable particle slots.
- Dust requires movement over 14px, with at least 85ms between emissions. It lives
  280–500ms and drifts only a few pixels. Every fifth emission is a tiny square.
- Head/tail fade over 300ms after a 40ms grace period. Dust finishes independently.

## Lifecycle and accessibility

One requestAnimationFrame chain runs only while light or dust remains visible.
No React state changes or DOM geometry reads occur during pointer movement or
animation frames. Positions, particles and clocks are effect-local. A cached
radial gradient avoids rebuilding the glow each frame. DPR is capped at 2.

`(hover: hover) and (pointer: fine)` enables the canvas; mouse PointerEvents are
required as well. Reduced motion disables the effect entirely, including live
preference changes. Disabled canvases release their viewport backing store to
1×1. Touch/pen events do not emit light. Resize clears old positions, resizes the
backing store and waits for fresh movement.

Viewport exit fades the trail without further emission. Hidden tabs, pointer
cancellation and window blur clear it and cancel its frame. Unmount cancels the
frame and removes all window, document and media-query listeners. There are no
animation timers, unbounded queues or accumulating particle allocations.

The canvas is fixed, aria-hidden, unfocusable and pointer-events:none. Its z-index
40 stays below the navigation and native dialog top layer. Native selection,
scrolling, pointers and focus states remain unchanged. The effect intentionally
stays behind project dialogs.

## Verification

Focused tests in `tests/cursor.spec.ts` cover visible paint, bounded footprint,
complete fade, stopped canvas work, restarting, exit, visibility, resize, live and
startup reduced motion, touch-only capability, ignored touch events, capped DPR,
native pointer, hit testing, scrolling, cat interactions and project dialogs.

Chrome captures of slow/fast motion and an idle frame are under ignored
`artifacts/comet/`; the trail was visually inspected against the actual hero.
Local performance observations are saved alongside them. They include all page
work and browser automation overhead and are not isolated cursor benchmarks or
field Core Web Vitals. Allocation is bounded by construction and event/frame
cleanup is explicit; a short heap sample cannot prove absence of every leak.

The original portfolio redesign working changes were preserved.

Final checks: `pnpm run lint`, `pnpm run build`, and the complete
`pnpm run test:e2e` suite passed (**138 tests in 2.8 minutes**, using the repository's
`PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/opt/google/chrome/chrome` override).
`git diff --check` also passed. Final build JS is 409.27kB / 138.32kB gzip,
about 1.35kB gzip above the preceding portfolio build. No runtime request or
new dependency was added.

Five whole-page retained-heap samples after pointer bursts and forced GC ranged
from 2.78MB to 2.97MB. This short sample includes GSAP, the mascot, browser/JIT
caches and React, so it does not isolate cursor retention or establish a heap
plateau. The stronger cursor-specific lifecycle evidence is the exact stopped
canvas-clear count after fade/hidden state and its fixed-size pools. Extended
heap profiling and physical 120Hz/device testing were not performed. Slow/fast
Chrome captures showed a short restrained trail; no page errors were observed.
