import { useEffect, useRef } from 'react'
import './comet.css'

const CAPABILITY = '(hover: hover) and (pointer: fine)'
const MOTION = '(prefers-reduced-motion: reduce)'
const POINTS = 28
const PARTICLES = 28
const MAX_TAIL = 136

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
    const dust = Array.from({ length: PARTICLES }, () => ({ x: 0, y: 0, vx: 0, vy: 0, age: 0, life: 0, size: 1, shape: 0, color: 0 }))
    let width = 0, height = 0, frame = 0, previous = 0
    let x = 0, y = 0, lastMove = -Infinity, lastEmission = -Infinity
    let initialized = false, moved = false, inside = false, enabled = false
    let traveled = 0, slot = 0
    const star = new Path2D('M0-1L.22-.22L1 0L.22.22L0 1L-.22.22L-1 0L-.22-.22Z')
    const cross = new Path2D('M-.25-1H.25V-.25H1V.25H.25V1H-.25V.25H-1V-.25H-.25Z')
    const colors = ['#e8eff8', '#b49dff', '#6ec8d4']
    const glow = context.createRadialGradient(0, 0, 0, 0, 0, 10)
    glow.addColorStop(0, '#e8eff8df')
    glow.addColorStop(.23, '#b49dff80')
    glow.addColorStop(.6, '#6ec8d421')
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
      const opacity = Math.max(0, 1 - Math.max(0, elapsed - 40) / 440)
      // Exponential following stays consistent at both 60Hz and 120Hz.
      points[0].x += (x - points[0].x) * (1 - Math.exp(-dt / 9))
      points[0].y += (y - points[0].y) * (1 - Math.exp(-dt / 9))
      for (let i = 1; i < POINTS; i++) {
        const follow = 1 - Math.exp(-dt / 30)
        points[i].x += (points[i - 1].x - points[i].x) * follow
        points[i].y += (points[i - 1].y - points[i].y) * follow
      }
      if (opacity > 0) {
        let distance = 0
        let startX = points[0].x, startY = points[0].y
        context!.lineCap = 'round'
        // Clip the last curve at the arc budget, including abrupt fast input.
        // Midpoint curves stay connected; spatial taper does not double-fade
        // by both history index and arc length as the original tail did.
        for (let i = 1; i < POINTS - 1; i++) {
          const b = points[i], c = points[i + 1]
          let endX = (b.x + c.x) / 2, endY = (b.y + c.y) / 2
          const length = Math.hypot(b.x - startX, b.y - startY) + Math.hypot(endX - b.x, endY - b.y)
          const fraction = Math.min(1, (MAX_TAIL - distance) / Math.max(.001, length))
          const controlX = startX + (b.x - startX) * fraction
          const controlY = startY + (b.y - startY) * fraction
          endX = startX + (endX - startX) * fraction
          endY = startY + (endY - startY) * fraction
          const taper = Math.max(0, 1 - (distance + length * fraction / 2) / MAX_TAIL)
          context!.strokeStyle = `rgba(${Math.round(110 + 94 * taper)}, ${Math.round(200 + 20 * taper)}, ${Math.round(212 + 36 * taper)}, ${opacity * taper ** .8 * .58})`
          context!.lineWidth = .25 + 2.1 * taper
          context!.beginPath()
          context!.moveTo(startX, startY)
          context!.quadraticCurveTo(controlX, controlY, endX, endY)
          context!.stroke()
          distance += length * fraction
          startX = endX
          startY = endY
          if (fraction < 1 || distance >= MAX_TAIL) break
        }
        context!.save()
        context!.translate(points[0].x, points[0].y)
        context!.globalAlpha = opacity
        context!.fillStyle = glow
        context!.fillRect(-10, -10, 20, 20)
        context!.fillStyle = '#e8eff8'
        context!.globalAlpha = opacity * .92
        context!.beginPath()
        context!.arc(0, 0, 2.2, 0, Math.PI * 2)
        context!.fill()
        context!.restore()
      }
      if (inside && moved && elapsed < 60 && traveled >= 11 && now - lastEmission > 75) {
        const particle = dust[slot]
        particle.x = points[2].x
        particle.y = points[2].y
        particle.vx = (Math.random() - .5) * .018
        particle.vy = (Math.random() - .5) * .018
        particle.age = 0
        particle.shape = slot % 5 === 0 ? 1 : slot % 10 === 7 ? 2 : 0
        particle.life = particle.shape ? 240 + Math.random() * 180 : 300 + Math.random() * 200
        particle.size = 1.4 + Math.random() * 1.2
        particle.color = slot % colors.length
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
        const phase = particle.age / particle.life
        const brightness = Math.min(1, particle.age / 45) * (1 - phase) ** 1.4
        context!.fillStyle = colors[particle.color]
        context!.globalAlpha = brightness * (particle.shape ? .82 : .48)
        if (particle.shape) {
          context!.save()
          context!.translate(particle.x, particle.y)
          const scale = particle.size * (particle.shape === 1 ? 1.65 : .9) * (.85 + Math.sin(phase * Math.PI) * .15)
          context!.scale(scale, scale)
          context!.fill(particle.shape === 1 ? star : cross)
          context!.restore()
        } else {
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
