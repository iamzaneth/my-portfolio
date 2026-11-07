import { useEffect, useRef } from 'react'
import './comet.css'

const CAPABILITY = '(hover: hover) and (pointer: fine)'
const MOTION = '(prefers-reduced-motion: reduce)'
const POINTS = 20
const PARTICLES = 20
const MAX_TAIL = 84

/** One demand-driven canvas. Pointer input never updates React state. */
export default function CometCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return
    const capability = matchMedia(CAPABILITY)
    const motion = matchMedia(MOTION)
    const points = Array.from({ length: POINTS }, () => ({ x: 0, y: 0 }))
    const dust = Array.from({ length: PARTICLES }, () => ({ x: 0, y: 0, vx: 0, vy: 0, age: 0, life: 0, size: 1, pixel: false }))
    let width = 0, height = 0, frame = 0, previous = 0
    let x = 0, y = 0, lastMove = -Infinity, lastEmission = -Infinity
    let initialized = false, moved = false, inside = false, enabled = false
    let traveled = 0, slot = 0
    const glow = context.createRadialGradient(0, 0, 0, 0, 0, 6)
    glow.addColorStop(0, '#e8eff8a0')
    glow.addColorStop(.3, '#b49dff55')
    glow.addColorStop(1, '#6ec8d400')

    function reset() {
      cancelAnimationFrame(frame)
      frame = 0
      previous = 0
      initialized = inside = moved = false
      traveled = 0
      for (const particle of dust) particle.life = 0
      context!.clearRect(0, 0, width, height)
    }

    function resize() {
      reset()
      width = innerWidth
      height = innerHeight
      // Cap backing-store cost on high-density displays. No layout reads in tick.
      const ratio = Math.min(devicePixelRatio || 1, 2)
      canvas!.width = enabled ? Math.ceil(width * ratio) : 1
      canvas!.height = enabled ? Math.ceil(height * ratio) : 1
      context!.setTransform(ratio, 0, 0, ratio, 0, 0)
    }

    function configure() {
      enabled = capability.matches && !motion.matches
      canvas!.hidden = !enabled
      resize()
    }

    function tick(now: number) {
      frame = 0
      if (!enabled || document.hidden) { reset(); return }
      const dt = Math.min(previous ? now - previous : 16.67, 40)
      previous = now
      context!.clearRect(0, 0, width, height)
      const elapsed = now - lastMove
      const opacity = Math.max(0, 1 - Math.max(0, elapsed - 40) / 300)
      // Exponential following stays consistent at both 60Hz and 120Hz.
      points[0].x += (x - points[0].x) * (1 - Math.exp(-dt / 9))
      points[0].y += (y - points[0].y) * (1 - Math.exp(-dt / 9))
      for (let i = 1; i < POINTS; i++) {
        const follow = 1 - Math.exp(-dt / 22)
        points[i].x += (points[i - 1].x - points[i].x) * follow
        points[i].y += (points[i - 1].y - points[i].y) * follow
      }
      if (opacity > 0) {
        let distance = 0
        context!.lineCap = 'round'
        // Curves between segment midpoints avoid hard polyline corners.
        for (let i = 1; i < POINTS - 1; i++) {
          const a = points[i - 1], b = points[i], c = points[i + 1]
          distance += Math.hypot(b.x - a.x, b.y - a.y)
          if (distance > MAX_TAIL) break
          const taper = (1 - i / POINTS) * (1 - distance / MAX_TAIL)
          context!.strokeStyle = `rgba(${Math.round(110 + 70 * taper)}, ${Math.round(200 - 43 * taper)}, ${Math.round(212 + 43 * taper)}, ${opacity * taper * .38})`
          context!.lineWidth = .3 + taper * 1.5
          context!.beginPath()
          context!.moveTo((a.x + b.x) / 2, (a.y + b.y) / 2)
          context!.quadraticCurveTo(b.x, b.y, (b.x + c.x) / 2, (b.y + c.y) / 2)
          context!.stroke()
        }
        context!.save()
        context!.translate(points[0].x, points[0].y)
        context!.globalAlpha = opacity
        context!.fillStyle = glow
        context!.fillRect(-6, -6, 12, 12)
        context!.fillStyle = '#e8eff8'
        context!.globalAlpha = opacity * .7
        context!.beginPath()
        context!.arc(0, 0, 1.6, 0, Math.PI * 2)
        context!.fill()
        context!.restore()
      }
      if (inside && moved && elapsed < 60 && traveled >= 14 && now - lastEmission > 85) {
        const particle = dust[slot]
        particle.x = points[2].x
        particle.y = points[2].y
        particle.vx = (Math.random() - .5) * .018
        particle.vy = (Math.random() - .5) * .018
        particle.age = 0
        particle.life = 280 + Math.random() * 220
        particle.size = 1 + Math.random() * .7
        particle.pixel = slot % 5 === 0
        slot = (slot + 1) % PARTICLES
        traveled = 0
        lastEmission = now
      }
      moved = false
      let alive = false
      for (const particle of dust) {
        if (!particle.life) continue
        particle.age += dt
        if (particle.age >= particle.life) { particle.life = 0; continue }
        alive = true
        particle.x += particle.vx * dt
        particle.y += particle.vy * dt
        context!.globalAlpha = .32 * (1 - particle.age / particle.life) ** 2
        context!.fillStyle = particle.pixel ? '#b49dff' : '#6ec8d4'
        if (particle.pixel) context!.fillRect(particle.x, particle.y, particle.size, particle.size)
        else {
          context!.beginPath()
          context!.arc(particle.x, particle.y, particle.size / 2, 0, Math.PI * 2)
          context!.fill()
        }
      }
      context!.globalAlpha = 1
      if (opacity > 0 || alive) frame = requestAnimationFrame(tick)
      else reset()
    }

    function move(event: PointerEvent) {
      if (!enabled || document.hidden || event.pointerType !== 'mouse') return
      const distance = Math.hypot(event.clientX - x, event.clientY - y)
      if (initialized && inside && distance < .2) return
      if (!initialized || !inside) {
        for (const point of points) { point.x = event.clientX; point.y = event.clientY }
        initialized = true
        traveled = 0
      } else traveled = Math.min(traveled + distance, MAX_TAIL)
      x = event.clientX
      y = event.clientY
      inside = moved = true
      lastMove = performance.now()
      if (!frame) frame = requestAnimationFrame(tick)
    }
    function leave(event: PointerEvent) {
      if (event.relatedTarget !== null) return
      inside = moved = false
      lastMove = Math.min(lastMove, performance.now() - 100)
    }
    function visibility() { if (document.hidden) reset() }

    configure()
    capability.addEventListener('change', configure)
    motion.addEventListener('change', configure)
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerout', leave, { passive: true })
    window.addEventListener('pointercancel', reset)
    window.addEventListener('blur', reset)
    window.addEventListener('resize', resize, { passive: true })
    document.addEventListener('visibilitychange', visibility)
    return () => {
      reset()
      capability.removeEventListener('change', configure)
      motion.removeEventListener('change', configure)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerout', leave)
      window.removeEventListener('pointercancel', reset)
      window.removeEventListener('blur', reset)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', visibility)
    }
  }, [])

  return <canvas ref={canvasRef} className="comet-cursor" aria-hidden="true" hidden />
}
