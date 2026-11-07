export type Point = readonly [number, number]

/** Batch distant stars into one path, rather than one animated DOM node each. */
export function Stars({ points }: { points: readonly Point[] }) {
  return <path className="cosmic-stars" d={points.map(([x, y], i) => `M${x} ${y}h${i % 4 ? 1.3 : 2}v${i % 4 ? 1.3 : 2}h-${i % 4 ? 1.3 : 2}z`).join('')} />
}

export function Connections({ points, links }: { points: readonly Point[]; links: readonly (readonly [number, number])[] }) {
  return <g className="cosmic-connections">
    <path d={links.map(([a, b]) => `M${points[a].join(' ')}L${points[b].join(' ')}`).join('')} fill="none" />
    {points.map(([x, y], i) => <g key={i}><circle cx={x} cy={y} r={i % 3 ? 2 : 3} /><circle className="cosmic-node-ring" cx={x} cy={y} r="7" /></g>)}
  </g>
}

export function PixelGlint({ x, y, size = 3 }: { x: number; y: number; size?: number }) {
  return <path className="cosmic-glint" transform={`translate(${x} ${y}) scale(${size})`} d="M-1-3h2v2h2v2H1v2h-2V1h-2v-2h2z" />
}
