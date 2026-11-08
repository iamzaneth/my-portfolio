import type { CSSProperties } from 'react'

// Concentric shell and opening: five facets per quarter circle deviate from
// the smooth 24px CSS radius by at most .30px. All vertices meet exactly.
const radius = 24
const inset = 12
const segments = 5
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
        left: corner.right ? `calc(100% - ${radius - x}px)` : `${radius + x}px`,
        top: corner.bottom ? `calc(100% - ${radius - y}px)` : `${radius + y}px`,
        height: `${2 * r * Math.sin(Math.PI / (4 * segments))}px`,
        transform: `translate3d(-50%, -50%, ${inner ? 'var(--well-z)' : '0px'}) rotateZ(${angle}deg) rotateY(${inner ? -90 : 90}deg)`,
      } satisfies CSSProperties,
    }
  }))
}

export const shellCorners = cornerWalls(false)
export const wellCorners = cornerWalls(true)
export const straightEdges = ['left', 'right', 'top', 'bottom'] as const
