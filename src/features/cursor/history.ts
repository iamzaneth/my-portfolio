export type TrailPoint = Readonly<{ x: number; y: number; time: number }>
export const MAX_LENGTH = 144
export const LIFETIME = 450
export const MAX_POINTS = 512
export function prune(points: TrailPoint[], now: number) {
  while (points.length && now - points[0].time > LIFETIME) points.shift()
  let length = 0
  for (let i = points.length - 1; i > 0; i--) {
    const a = points[i], b = points[i - 1]
    const distance = Math.hypot(a.x - b.x, a.y - b.y)
    if (length + distance > MAX_LENGTH) {
      const t = (MAX_LENGTH - length) / distance
      // Replace the visible boundary; never modify a recorded sample.
      points.splice(0, i, { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, time: a.time + (b.time - a.time) * t })
      break
    }
    length += distance
  }
  if (points.length > MAX_POINTS) points.splice(0, points.length - MAX_POINTS)
}
export function append(points: TrailPoint[], x: number, y: number, time: number) {
  if (![x, y, time].every(Number.isFinite)) return false
  let last = points.at(-1)
  if (last && time < last.time) return false
  if (last && (time - last.time > 180 || Math.hypot(x - last.x, y - last.y) > 600)) { points.length = 0; last = undefined }
  const distance = last ? Math.hypot(x - last.x, y - last.y) : 0
  if (last && distance < .2) return false
  const count = Math.min(64, Math.max(1, Math.ceil(distance / 3)))
  for (let i = 1; i <= count; i++) {
    const t = i / count
    points.push(last ? { x: last.x + (x - last.x) * t, y: last.y + (y - last.y) * t, time: last.time + (time - last.time) * t } : { x, y, time })
  }
  prune(points, time)
  return true
}

/** CSS pixels per millisecond over recent input. Styling only; history stays fixed. */
export function recentSpeed(points: readonly TrailPoint[]) {
  const newest = points.at(-1)
  if (!newest) return 0
  let distance = 0, oldest = newest
  for (let i = points.length - 2; i >= 0; i--) {
    const point = points[i]
    distance += Math.hypot(oldest.x - point.x, oldest.y - point.y)
    oldest = point
    if (newest.time - point.time >= 50) break
  }
  return Math.min(3, distance / Math.max(8, newest.time - oldest.time))
}

export function meteorProfile(speed: number) {
  const energy = Math.min(1, Math.max(0, speed) / .5)
  return { energy, lifetime: LIFETIME, width: 2 + .4 * energy, brightness: .65 + .15 * energy }
}
