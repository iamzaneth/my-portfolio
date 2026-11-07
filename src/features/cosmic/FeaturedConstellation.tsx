import { figures } from './constellations'
import { Constellation } from './primitives'

/** A reserved atlas illustration beside the introduction, never behind copy. */
export default function FeaturedConstellation({ world }: { world: 'about' | 'toolkit' }) {
  const figure = figures[world]
  return <svg className={`featured-atlas atlas-${world}`} viewBox="0 0 360 340" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">
    <Constellation figure={figure} x={world === 'about' ? 82 : 25} y={0} size={300} featured />
  </svg>
}
