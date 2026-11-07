import { ellipseArc } from './orbit'
import type { Figure } from './constellations'
export type Point = readonly [number, number]

/** Batch distant stars into one path, rather than one animated DOM node each. */
export function Stars({ points }: { points: readonly Point[] }) {
  return <path className="cosmic-stars" d={points.map(([x, y], i) => `M${x} ${y}h${i % 4 ? 1.3 : 2}v${i % 4 ? 1.3 : 2}h-${i % 4 ? 1.3 : 2}z`).join('')} />
}

export function PixelGlint({ x, y, size = 3 }: { x: number; y: number; size?: number }) {
  return <path className="cosmic-glint" transform={`translate(${x} ${y}) scale(${size})`} d="M-1-3h2v2h2v2H1v2h-2V1h-2v-2h2z" />
}

export function OrbitalPath({ cx, cy, rx, ry, rotation, start, end, variant = 'primary' }: { cx: number; cy: number; rx: number; ry: number; rotation: number; start: number; end: number; variant?: string }) {
  return <path className={`celestial-orbit orbit-${variant}`} transform={`translate(${cx} ${cy}) rotate(${rotation})`} d={ellipseArc(rx, ry, start, end)} fill="none" />
}

export function Constellation({ figure, x, y, size }: { figure: Figure; x: number; y: number; size: number }) {
 return <svg x={x} y={y} width={size} height={size} viewBox="0 0 300 300" preserveAspectRatio="xMidYMid meet" data-constellation={figure.name}>
 <path className="stellar-links" fill="none" d={figure.connections.map(([a,b]) => { const p=figure.stars.find(s=>s.id===a)!, q=figure.stars.find(s=>s.id===b)!; return `M${p.x} ${p.y}L${q.x} ${q.y}` }).join('')} />
 {figure.stars.map(star => <g key={star.id} data-star={star.id} className={`stellar-${star.emphasis}`}><circle className="stellar-halo" cx={star.x} cy={star.y} r="6"/><circle cx={star.x} cy={star.y} r={star.emphasis === 'primary' ? 2.7 : star.emphasis === 'secondary' ? 1.7 : 1} /></g>)}
 </svg>
}
