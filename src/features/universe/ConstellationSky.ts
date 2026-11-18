import * as THREE from 'three'
import { skyFigures } from '../cosmic/constellations'
import { overlaps, type SkyActivity } from './SkyActivity'
import { placeConstellation, type SkyPlacement } from './skyPlacement'
import { skyPoint, skyPreviewEnabled } from './MeteorShowers'

/** Cached catalog geometry, with transforms and opacity as the only runtime changes. */
export function createConstellationSky(compact: boolean, random = Math.random) {
  const group = new THREE.Group(), preview = skyPreviewEnabled()
  const figures = skyFigures.map(figure => {
    const root = new THREE.Group(), points = new Float32Array(figure.stars.length * 3)
    figure.stars.forEach((star, i) => points.set([(star.x - 150) / 300, (150 - star.y) / 300, 0], i * 3))
    const geometry = new THREE.BufferGeometry(); geometry.setAttribute('position', new THREE.BufferAttribute(points, 3))
    geometry.setAttribute('aSize', new THREE.Float32BufferAttribute(figure.stars.map(star => Math.max(2, 5.3 - star.magnitude * .52)), 1))
    geometry.setAttribute('aLight', new THREE.Float32BufferAttribute(figure.stars.map(star => Math.max(.28, 1 - star.magnitude * .12)), 1))
    const material = new THREE.ShaderMaterial({ uniforms: { uOpacity: { value: 0 }, uAge: { value: 0 }, uColor: { value: new THREE.Color('#c2deee') } },
      vertexShader: 'attribute float aSize;attribute float aLight;varying float vLight;void main(){vLight=aLight;gl_PointSize=aSize;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
      fragmentShader: 'uniform float uOpacity;uniform float uAge;uniform vec3 uColor;varying float vLight;void main(){float r=length(gl_PointCoord-.5)*2.;float reveal=smoothstep((1.-vLight)*1.8,(1.-vLight)*1.8+1.1,uAge);gl_FragColor=vec4(uColor,pow(max(0.,1.-r),1.6)*uOpacity*vLight*reveal);}',
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    })
    root.add(new THREE.Points(geometry, material))
    const byId = new Map(figure.stars.map((star, index) => [star.id, index]))
    const linePoints = figure.connections.flatMap(edge => edge.flatMap(id => Array.from(points.slice(byId.get(id)! * 3, byId.get(id)! * 3 + 3))))
    const lineGeometry = new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(linePoints, 3))
    const lineMaterial = new THREE.LineBasicMaterial({ color: '#91c8dd', transparent: true, opacity: 0, depthWrite: false })
    root.add(new THREE.LineSegments(lineGeometry, lineMaterial)); root.visible = false; group.add(root)
    return { figure, root, material, lineMaterial }
  })
  type Visible = { index: number; placement: SkyPlacement; born: number; until: number; fadeAt: number }
  let visible: Visible[] = [], nextAt = preview ? 1 : 3 + random() * 4, revision = -1, quiet = 1, viewport = ''
  const recentCells: number[] = [], recentFigures: number[] = []
  const stats = { visible: 0, appearances: 0, names: '', placements: '' }
  function updateStats() {
    stats.visible = visible.length
    stats.names = visible.map(item => figures[item.index].figure.name).join(',')
    stats.placements = visible.map(item => `${figures[item.index].figure.id}:${item.placement.cell}:${Math.round(item.placement.cx)},${Math.round(item.placement.cy)}`).join('|')
  }
  return { group, stats,
    update(time: number, dt: number, activity: SkyActivity, camera: THREE.PerspectiveCamera, disabled: boolean, shower: boolean, low: boolean, accent: THREE.Color) {
      const narrow = compact || low || activity.width < 768
      visible.slice(narrow ? 1 : 2).forEach(item => { item.fadeAt = Math.min(item.fadeAt, time) })
      const targetQuiet = disabled || activity.modal ? 0 : activity.transitioning ? .1 : shower ? .4 : 1
      quiet = THREE.MathUtils.lerp(quiet, targetQuiet, disabled ? 1 : 1 - Math.exp(-5 * dt))
      if (disabled) { visible = []; nextAt = time + (preview ? 1 : 4) }
      const dimensions = `${activity.width}:${activity.height}`
      if (viewport !== dimensions) {
        visible.forEach(item => { item.fadeAt = Math.min(item.fadeAt, time) })
        if (visible.length) nextAt = Math.max(nextAt, time + 3.1)
        viewport = dimensions
      }
      if (revision !== activity.revision || activity.transitioning) {
        for (const item of visible) if (activity.transitioning || activity.zones.some(zone => overlaps(item.placement, zone))) item.fadeAt = Math.min(item.fadeAt, time)
        revision = activity.revision
      }
      const expired = visible.filter(item => time >= Math.min(item.until, item.fadeAt) + 3)
      if (expired.length) { visible = visible.filter(item => !expired.includes(item)); updateStats() }
      if (!disabled && !activity.modal && !activity.transitioning && !activity.layoutPending && !shower && time >= nextAt) {
        if (visible.length < (narrow ? 1 : 2)) {
          const placement = placeConstellation(activity, visible.map(item => item.placement), recentCells, random)
          const candidates = figures.map((_, i) => i).filter(i => !visible.some(item => item.index === i)).sort((a, b) => recentFigures.filter(i => i === a).length - recentFigures.filter(i => i === b).length)
          if (placement && candidates.length) {
            const index = candidates[Math.floor(random() * Math.min(2, candidates.length))], entry = figures[index]
            const z = -32 - random() * 20
            entry.root.position.copy(skyPoint(placement.cx, placement.cy, z, camera, activity.width, activity.height))
            entry.root.quaternion.copy(camera.quaternion); entry.root.rotateZ(-placement.angle)
            entry.root.scale.setScalar(placement.size * 2 * (camera.position.z - z) * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) / activity.height)
            visible.push({ index, placement, born: time, until: time + (preview ? 6 : 15 + random() * 18), fadeAt: Infinity })
            recentCells.push(placement.cell); recentFigures.push(index)
            if (recentCells.length > 6) recentCells.shift()
            if (recentFigures.length > 3) recentFigures.shift()
            stats.appearances++; updateStats()
          }
        }
        nextAt = time + (preview ? 2 + random() * 2 : 6 + random() * 10)
      }
      for (const entry of figures) entry.root.visible = false
      for (const item of visible) {
        const entry = figures[item.index], age = time - item.born
        const fade = Math.min(1, Math.max(0, (Math.min(item.until, item.fadeAt) + 3 - time) / 3))
        const stars = THREE.MathUtils.smoothstep(age, 0, 2.5) * fade * quiet
        const lines = THREE.MathUtils.smoothstep(age, 1, 3.2) * fade * quiet
        entry.root.visible = stars > .002
        entry.material.uniforms.uOpacity.value = stars * (narrow ? .45 : .65)
        entry.material.uniforms.uAge.value = age
        entry.material.uniforms.uColor.value.set('#d1e4ee').lerp(accent, .12)
        entry.lineMaterial.opacity = lines * (narrow ? .12 : .19)
      }
      if (disabled) updateStats()
    },
  }
}
