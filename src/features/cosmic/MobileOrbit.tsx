import { OrbitalPath } from './primitives'
import type { CosmicWorld } from './CosmicBackground'

const trajectories = {
  home: { cx: 200, cy: 766, rx: 780, ry: 760, rotation: 0, start: 230, end: 310 },
  about: { cx: 200, cy: 650, rx: 600, ry: 630, rotation: 3, start: 195, end: 345 },
  toolkit: { cx: 200, cy: -580, rx: 620, ry: 620, rotation: 0, start: 15, end: 165 },
  projects: { cx: 200, cy: 640, rx: 600, ry: 630, rotation: -1, start: 195, end: 345 },
  contact: { cx: 200, cy: 780, rx: 780, ry: 760, rotation: 0, start: 230, end: 310 },
} as const

/** Independent, viewport-wide trajectory anchored to a content gap. Its absolute
 * viewport follows text wrapping without moving or measuring constellation stars. */
export default function MobileOrbit({ world }: { world: CosmicWorld }) {
  return <svg className="mobile-orbit-band" data-orbit-world={world} viewBox="0 0 400 80" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">
    <OrbitalPath {...trajectories[world]} />
  </svg>
}
