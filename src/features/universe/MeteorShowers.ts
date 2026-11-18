import * as THREE from 'three'
import { clearSkyPath, type SkyActivity } from './SkyActivity'

export interface MeteorTiming { first: readonly [number, number]; interval: readonly [number, number]; duration: readonly [number, number]; count: readonly [number, number] }
export const METEOR_TIMING: MeteorTiming = { first: [25, 55], interval: [90, 180], duration: [3, 7], count: [3, 8] }
const PREVIEW_TIMING: MeteorTiming = { first: [2, 4], interval: [7, 12], duration: [3, 5], count: [3, 8] }
export function skyPreviewEnabled() { return import.meta.env.DEV && new URLSearchParams(location.search).has('skyPreview') }
const STEPS = 18, CAPACITY = 8
const VERTICES = [[0, -1], [1, -1], [1, 1], [0, -1], [1, 1], [0, 1]] as const
interface Meteor { start: THREE.Vector3; end: THREE.Vector3; screenStart: number[]; screenEnd: number[]; born: number; duration: number; tail: number; width: number; brightness: number }

/** Project a CSS-pixel location onto a real depth plane of the existing sky camera. */
export function skyPoint(x: number, y: number, z: number, camera: THREE.PerspectiveCamera, width: number, height: number) {
  const ray = new THREE.Vector3(x / width * 2 - 1, 1 - y / height * 2, .5).unproject(camera).sub(camera.position)
  return ray.multiplyScalar((z - camera.position.z) / ray.z).add(camera.position)
}

/** One reusable ribbon buffer and point pool, with no timers or per-event materials. */
export function createMeteorShowers(compact: boolean, random = Math.random) {
  const timing = skyPreviewEnabled() ? PREVIEW_TIMING : METEOR_TIMING
  const range = ([a, b]: readonly number[]) => a + random() * (b - a)
  const group = new THREE.Group()
  const positions = new Float32Array(CAPACITY * STEPS * 6 * 3), strengths = new Float32Array(CAPACITY * STEPS * 6), sides = new Float32Array(strengths.length)
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage))
  geometry.setAttribute('aStrength', new THREE.BufferAttribute(strengths, 1).setUsage(THREE.DynamicDrawUsage))
  geometry.setAttribute('aSide', new THREE.BufferAttribute(sides, 1))
  const material = new THREE.ShaderMaterial({
    vertexShader: 'attribute float aStrength;attribute float aSide;varying float vStrength;varying float vSide;void main(){vStrength=aStrength;vSide=aSide;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader: 'varying float vStrength;varying float vSide;void main(){gl_FragColor=vec4(.78,.9,1.,vStrength*pow(max(0.,1.-abs(vSide)),1.7));}',
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
  })
  const ribbons = new THREE.Mesh(geometry, material); ribbons.frustumCulled = false
  const headPositions = new Float32Array(CAPACITY * 3), headStrengths = new Float32Array(CAPACITY), headSizes = new Float32Array(CAPACITY)
  const headsGeometry = new THREE.BufferGeometry()
  headsGeometry.setAttribute('position', new THREE.BufferAttribute(headPositions, 3).setUsage(THREE.DynamicDrawUsage))
  headsGeometry.setAttribute('aStrength', new THREE.BufferAttribute(headStrengths, 1).setUsage(THREE.DynamicDrawUsage))
  headsGeometry.setAttribute('aSize', new THREE.BufferAttribute(headSizes, 1))
  const heads = new THREE.Points(headsGeometry, new THREE.ShaderMaterial({
    vertexShader: 'attribute float aStrength;attribute float aSize;varying float vStrength;void main(){vStrength=aStrength;gl_PointSize=aSize;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader: 'varying float vStrength;void main(){float r=length(gl_PointCoord-.5)*2.;gl_FragColor=vec4(.88,.95,1.,pow(max(0.,1.-r),2.)*vStrength);}', transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  })); heads.frustumCulled = false; group.add(ribbons, heads); group.renderOrder = -70
  let events: Meteor[] = [], endAt = 0, nextAt = range(timing.first), nextSoloAt = range([65, 110]), activeSolo = false, cancelAt = Infinity, revision = -1, viewport = ''
  const stats = { phase: 'scheduled' as 'idle' | 'scheduled' | 'active' | 'cooldown', showers: 0, singles: 0, meteors: 0, live: 0, skipped: 0, nextAt, signature: '' }
  const head = new THREE.Vector3(), direction = new THREE.Vector3(), normal = new THREE.Vector3(), point = new THREE.Vector3(), right = new THREE.Vector3()

  function spawn(time: number, activity: SkyActivity, camera: THREE.PerspectiveCamera, low: boolean, solo = false) {
    events = []; cancelAt = Infinity; activeSolo = solo
    const duration = solo ? 2 : range(timing.duration), requested = solo ? 1 : Math.min(compact || low || activity.width < 768 ? 3 : CAPACITY, Math.floor(range([timing.count[0], timing.count[1] + .99])))
    const horizontal = random() > .5 ? 1 : -1, showerAngle = range([.3, .55])
    for (let attempt = 0; attempt < 100 && events.length < requested; attempt++) {
      const start = [range([-.1, 1.1]) * activity.width, range([-.12, .8]) * activity.height]
      const angle = showerAngle + range([-.08, .08]), dx = Math.cos(angle) * horizontal, dy = Math.sin(angle)
      const distance = range([.11, .28]) * activity.width, tailPixels = Math.min(low ? 85 : 140, distance * range([.22, .45]))
      const end = [start[0] + dx * distance, start[1] + dy * distance]
      const sweptStart = [start[0] - dx * tailPixels, start[1] - dy * tailPixels]
      if (Math.max(start[0], end[0]) < 0 || Math.min(start[0], end[0]) > activity.width || end[1] < 0 || start[1] > activity.height) continue
      if (!clearSkyPath(sweptStart, end, activity.zones, 14)) continue
      const z = -14 - random() * 35, unit = 2 * (camera.position.z - z) * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) / activity.height
      const depth = (49 + z) / 35
      events.push({ start: skyPoint(start[0], start[1], z, camera, activity.width, activity.height), end: skyPoint(end[0], end[1], z, camera, activity.width, activity.height), screenStart: sweptStart, screenEnd: end, born: time + random() * Math.max(.5, duration - 1.6), duration: range([.85, 1.65]) * (1.25 - depth * .35), tail: tailPixels * unit, width: unit * range([1.1, 1.8]), brightness: range([.22, .42]) * (.7 + .3 * depth) })
    }
    endAt = Math.max(time + duration, ...events.map(event => event.born + event.duration)); revision = activity.revision
    viewport = `${activity.width}:${activity.height}`
    stats.phase = 'active'; if (solo) stats.singles++; else stats.showers++; stats.meteors = events.length
    stats.signature = events.map(event => `${event.start.x.toFixed(2)},${event.start.y.toFixed(2)},${event.duration.toFixed(2)}`).join('|')
    if (!events.length) stats.skipped++
  }
  return { group, stats,
    update(time: number, activity: SkyActivity, camera: THREE.PerspectiveCamera, disabled: boolean, low: boolean, pointerBusy: boolean) {
      if (disabled) { events = []; stats.phase = 'idle'; stats.meteors = 0; nextAt = time + range(timing.first) }
      else if (stats.phase === 'idle') { stats.phase = 'scheduled'; nextAt = time + range(timing.first); nextSoloAt = time + range([65, 110]) }
      if (stats.phase === 'cooldown') {
        stats.phase = 'scheduled'
        if (activeSolo) nextSoloAt = time + range([65, 110])
        else { nextAt = time + range(timing.interval); nextSoloAt = Math.max(nextSoloAt, time + 20) }
      }
      if (stats.phase === 'scheduled' && !activity.modal && !activity.transitioning && !activity.layoutPending) {
        if (time >= nextAt) spawn(time, activity, camera, low)
        else if (time >= nextSoloAt) spawn(time, activity, camera, low, true)
      }
      if (stats.phase === 'active' && (activity.modal || activity.transitioning || activity.layoutPending || viewport !== `${activity.width}:${activity.height}` || (revision !== activity.revision && events.some(event => !clearSkyPath(event.screenStart, event.screenEnd, activity.zones, 12))))) cancelAt = Math.min(cancelAt, time)
      if (stats.phase === 'active' && (time >= endAt || time >= cancelAt + .25)) { events = []; stats.phase = 'cooldown'; stats.meteors = 0 }
      stats.nextAt = nextAt
      const quiet = activity.modal || disabled ? 0 : (pointerBusy ? .65 : 1) * (cancelAt === Infinity ? 1 : Math.max(0, 1 - (time - cancelAt) / .25))
      strengths.fill(0); headStrengths.fill(0); stats.live = 0
      right.setFromMatrixColumn(camera.matrixWorld, 0)
      events.forEach((event, index) => {
        const age = (time - event.born) / event.duration
        if (age <= 0 || age >= 1) return
        if (quiet > 0) stats.live++
        const opacity = Math.min(1, age * 7, (1 - age) * 4) * event.brightness * quiet
        head.lerpVectors(event.start, event.end, age); direction.copy(event.end).sub(event.start).normalize()
        normal.crossVectors(direction, camera.getWorldDirection(point)).normalize()
        if (normal.lengthSq() < .1) normal.copy(right)
        headPositions[index * 3] = head.x; headPositions[index * 3 + 1] = head.y; headPositions[index * 3 + 2] = head.z
        headStrengths[index] = opacity * 2; headSizes[index] = compact || low || activity.width < 768 ? 3 : 4.5
        for (let step = 0; step < STEPS; step++) {
          VERTICES.forEach(([advance, side], vertex) => {
            const t = (step + advance) / STEPS, offset = (index * STEPS + step) * 6 + vertex
            point.copy(head).addScaledVector(direction, -t * event.tail).addScaledVector(normal, side * event.width * (1 - t))
            positions[offset * 3] = point.x; positions[offset * 3 + 1] = point.y; positions[offset * 3 + 2] = point.z
            strengths[offset] = opacity * (1 - t) ** 1.4; sides[offset] = side
          })
        }
      })
      geometry.attributes.position.needsUpdate = true; geometry.attributes.aStrength.needsUpdate = true
      geometry.attributes.aSide.needsUpdate = true; headsGeometry.attributes.position.needsUpdate = true; headsGeometry.attributes.aStrength.needsUpdate = true; headsGeometry.attributes.aSize.needsUpdate = true
      group.visible = events.length > 0 && quiet > 0
    },
  }
}
