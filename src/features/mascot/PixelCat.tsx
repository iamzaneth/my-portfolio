import { useLayoutEffect, useRef, type CSSProperties } from 'react'
import { catAnimations, type CatMode } from './catConfig'
import { catAtlas, catSprites } from './catSprites'

const initialStyle = {
  '--atlas-columns': catAtlas.columns,
  '--atlas-rows': catAtlas.rows,
  '--frames': catSprites.idle.frames,
  '--frame-start': 0,
  '--frame-end': catSprites.idle.frames,
  '--sprite-row': catSprites.idle.row,
  '--sprite-duration': '1.5s',
} as CSSProperties

export default function PixelCat({ mode, running, version }: { mode: CatMode; running: boolean; version: number }) {
  const renderer = useRef<HTMLSpanElement>(null)
  const active = useRef(0)
  const clip = useRef('idle:0:9:loop')
  const duration = useRef(1.5)

  useLayoutEffect(() => {
    const layers = renderer.current?.querySelectorAll<HTMLElement>('.pixel-cat-sprite')
    if (!layers) return
    const animation = catAnimations[mode]
    const sheet = catSprites[animation.asset]
    const [first, last] = animation.frames ?? [0, sheet.frames - 1]
    const looping = animation.loop !== false
    const key = `${animation.asset}:${first}:${last}:${looping ? 'loop' : version}`
    const outgoing = layers[active.current]
    const previousAsset = outgoing.dataset.asset
    const previousPlayback = outgoing.getAnimations().find((item) => item instanceof CSSAnimation)
    const gaitChange = (previousAsset === 'walk' || previousAsset === 'run') && (animation.asset === 'walk' || animation.asset === 'run')
    const gaitPhase = gaitChange ? (Number(previousPlayback?.currentTime ?? 0) / (duration.current * 1000)) % 1 : 0
    if (clip.current === key) {
      // Changing gait speed must not reset the footfall to frame zero.
      const playback = outgoing.getAnimations().find((item) => item instanceof CSSAnimation)
      const phase = Number(playback?.currentTime ?? 0) / (duration.current * 1000)
      outgoing.style.setProperty('--sprite-duration', `${animation.duration}s`)
      if (playback) playback.currentTime = phase * animation.duration * 1000
      duration.current = animation.duration
      return
    }
    const next = 1 - active.current
    const incoming = layers[next]
    // Freeze only at state boundaries. There is no JavaScript frame loop.
    const lastFrame = getComputedStyle(outgoing).backgroundPositionX
    outgoing.style.animationName = 'none'
    outgoing.style.backgroundPositionX = lastFrame
    incoming.style.setProperty('--frames', String(Math.max(1, last - first + 1)))
    incoming.style.setProperty('--frame-start', String(first))
    incoming.style.setProperty('--frame-end', String(looping ? last + 1 : last))
    incoming.style.setProperty('--sprite-row', String(sheet.row))
    incoming.style.setProperty('--sprite-duration', `${animation.duration}s`)
    incoming.style.backgroundPositionX = `calc(-1 * ${first} * var(--sprite-size))`
    incoming.style.animationIterationCount = looping ? 'infinite' : '1'
    incoming.style.animationTimingFunction = `steps(${Math.max(1, looping ? last - first + 1 : Math.abs(last - first))})`
    incoming.style.animationName = sheet.frames === 1 ? 'none' : looping ? 'cat-frames' : 'cat-pose'
    // Walking and running share eight aligned footfall frames. Carry the phase
    // between their atlas rows rather than restarting the gait on each change.
    if (gaitChange) {
      const playback = incoming.getAnimations().find((item) => item instanceof CSSAnimation)
      if (playback) playback.currentTime = gaitPhase * animation.duration * 1000
    }
    incoming.dataset.asset = animation.asset
    incoming.dataset.from = String(first)
    incoming.dataset.to = String(last)
    outgoing.dataset.active = 'false'
    incoming.dataset.active = 'true'
    active.current = next
    clip.current = key
    duration.current = animation.duration
  }, [mode, version])

  return <span ref={renderer} className="pixel-cat-renderer" aria-hidden="true" style={initialStyle}>
    <span className="pixel-cat-sprite" data-active="true" data-asset="idle" style={{ animationPlayState: running ? 'running' : 'paused' }} />
    <span className="pixel-cat-sprite" data-active="false" data-asset="idle" style={{ animationPlayState: running ? 'running' : 'paused' }} />
  </span>
}
