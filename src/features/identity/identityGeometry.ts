import type { CSSProperties } from 'react'

// One physical model supplies CSS dimensions and tessellation. Six chords per
// quarter circle stay within .206px of the rounded lip, with shared endpoints.
export const identityGeometry = {
  depth: 18, recess: 3, radius: 24, inset: 12, segments: 6,
  pitch: 2, yaw: -13, perspective: 1500,
} as const
const { radius, inset, segments } = identityGeometry
export const identityStyle = {
  '--id-depth': `${identityGeometry.depth}px`,
  '--id-radius': `${radius}px`,
  '--id-inset': `${inset}px`,
  '--id-recess': `${identityGeometry.recess}px`,
  '--id-pitch': `${identityGeometry.pitch}deg`,
  '--id-yaw': `${identityGeometry.yaw}deg`,
  '--id-perspective': `${identityGeometry.perspective}px`,
} as CSSProperties
const corners = [
  { name: 'top-left', start: 180, right: false, bottom: false },
  { name: 'top-right', start: 270, right: true, bottom: false },
  { name: 'bottom-right', start: 0, right: true, bottom: true },
  { name: 'bottom-left', start: 90, right: false, bottom: true },
]

function cornerWalls(inner: boolean) {
  const r = inner ? radius - inset : radius
  return corners.flatMap(corner => Array.from({ length: segments }, (_, index) => {
    const angle = corner.start + (index + .5) * 90 / segments
    const radians = angle * Math.PI / 180
    const apothem = r * Math.cos(Math.PI / (4 * segments))
    const x = Math.cos(radians) * apothem, y = Math.sin(radians) * apothem
    return {
      name: `${corner.name}-${index}`,
      style: {
        // Fixed upper-left environment light; no per-frame lighting work.
        '--edge-light': `${Math.round(22 + 25 * Math.max(0, -Math.cos(radians) * .6 - Math.sin(radians) * .8))}%`,
        left: corner.right ? `calc(100% - ${radius - x}px)` : `${radius + x}px`,
        top: corner.bottom ? `calc(100% - ${radius - y}px)` : `${radius + y}px`,
        height: `${2 * r * Math.sin(Math.PI / (4 * segments))}px`,
        transform: `translate3d(-50%, -50%, ${inner ? 'var(--well-z)' : '0px'}) rotateZ(${angle}deg) rotateY(${inner ? -90 : 90}deg)`,
      } satisfies CSSProperties & { '--edge-light': string },
    }
  }))
}

export const shellCorners = cornerWalls(false)
export const wellCorners = cornerWalls(true)
export const straightEdges = ['left', 'right', 'top', 'bottom'] as const
