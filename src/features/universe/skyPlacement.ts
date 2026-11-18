import { overlaps, type SkyActivity, type SkyRect } from './SkyActivity'

export interface SkyPlacement extends SkyRect { cx: number; cy: number; size: number; angle: number; cell: number }

/** Bounded stratified sampling. Recently used cells lose priority, not geometry. */
export function placeConstellation(activity: SkyActivity, occupied: readonly SkyRect[], recent: readonly number[], random = Math.random): SkyPlacement | null {
  const { width, height, zones } = activity
  const cells = Array.from({ length: 12 }, (_, cell) => ({ cell, score: random() - recent.filter(value => value === cell).length * 2 })).sort((a, b) => b.score - a.score)
  for (const { cell } of cells) {
    for (let attempt = 0; attempt < 8; attempt++) {
      const size = Math.min(width * .3, height * .32, 250) * (1 - attempt * .09) * (.9 + random() * .1)
      if (size < 65) continue
      const cx = ((cell % 4) + .15 + random() * .7) / 4 * width
      const cy = (Math.floor(cell / 4) + .15 + random() * .7) / 3 * height
      // A square enclosing the rotated normalized figure protects every star/line.
      const rect = { x: cx - size / 2 - 10, y: cy - size / 2 - 10, width: size + 20, height: size + 20 }
      if (rect.x < 18 || rect.y < 18 || rect.x + rect.width > width - 18 || rect.y + rect.height > height - 18) continue
      if ([...zones, ...occupied].some(zone => overlaps(rect, zone))) continue
      return { ...rect, cx, cy, size, angle: (random() - .5) * .6, cell }
    }
  }
  return null
}
