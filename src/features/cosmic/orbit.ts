/** Local, unrotated elliptical arc. Scene rotation is a uniform SVG transform. */
export function ellipseArc(rx: number, ry: number, start: number, end: number) {
  const point = (angle: number) => [rx * Math.cos(angle * Math.PI / 180), ry * Math.sin(angle * Math.PI / 180)]
  return `M${point(start).join(' ')}A${rx} ${ry} 0 ${end - start > 180 ? 1 : 0} 1 ${point(end).join(' ')}`
}
