import { LIFETIME, MAX_LENGTH, type TrailPoint } from './history'
export type EdgePoint = { x: number; y: number }

/** Fill caller-owned buffers. Each edge stays within 1.3px of its immutable
 * center sample; averaged unit tangents have no miter spikes or spline loops. */
export function ribbonEdges(points: readonly TrailPoint[], now: number, width: number, left: EdgePoint[], right: EdgePoint[]) {
  let distance = 0
  for (let i = points.length - 1; i >= 0; i--) {
    const p = points[i], before = points[Math.max(0, i - 1)], after = points[Math.min(points.length - 1, i + 1)]
    if (i < points.length - 1) distance += Math.hypot(p.x - after.x, p.y - after.y)
    const incoming = Math.hypot(p.x - before.x, p.y - before.y)
    const outgoing = Math.hypot(after.x - p.x, after.y - p.y)
    let dx = (incoming ? (p.x - before.x) / incoming : 0) + (outgoing ? (after.x - p.x) / outgoing : 0)
    let dy = (incoming ? (p.y - before.y) / incoming : 0) + (outgoing ? (after.y - p.y) / outgoing : 0)
    let length = Math.hypot(dx, dy)
    if (length < .001) { dx = p.x - before.x; dy = p.y - before.y; length = Math.hypot(dx, dy) || 1 }
    const taper = Math.max(0, 1 - distance / MAX_LENGTH)
    const age = Math.max(0, 1 - (now - p.time) / LIFETIME)
    const radius = Math.min(1.3, width / 2) * taper ** .8 * age ** .6
    const nx = -dy / length * radius, ny = dx / length * radius
    left[i].x = p.x + nx; left[i].y = p.y + ny
    right[i].x = p.x - nx; right[i].y = p.y - ny
  }
}
