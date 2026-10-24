import { useLayoutEffect, useRef, type CSSProperties } from 'react'
import { catAnimations, type CatMode } from './catConfig'
import { catAtlas, catSprites } from './catSprites'

const initialStyle = {
  '--atlas-columns': catAtlas.columns,
  '--atlas-rows': catAtlas.rows,
  '--frames': catSprites.idle.frames,
  '--sprite-row': catSprites.idle.row,
  '--sprite-duration': '1.5s',
} as CSSProperties

export default function PixelCat({ mode, running }: { mode: CatMode; running: boolean }) {
  const renderer = useRef<HTMLSpanElement>(null)
  const active = useRef(0)
  const asset = useRef<keyof typeof catSprites>('idle')

  useLayoutEffect(() => {
    const layers = renderer.current?.querySelectorAll<HTMLElement>('.pixel-cat-sprite')
    const animation = catAnimations[mode]
    if (!layers || asset.current === animation.asset) return
    const outgoing = layers[active.current]
    const next = 1 - active.current
    const incoming = layers[next]
    const sheet = catSprites[animation.asset]

    // One style read per state change freezes the outgoing frame, never a per-frame loop.
    const lastFrame = getComputedStyle(outgoing).backgroundPositionX
    outgoing.style.animationName = 'none'
    outgoing.style.backgroundPositionX = lastFrame
    incoming.style.setProperty('--frames', String(sheet.frames))
    incoming.style.setProperty('--sprite-row', String(sheet.row))
    incoming.style.setProperty('--sprite-duration', `${animation.duration}s`)
    incoming.style.backgroundPositionX = '0px'
    incoming.style.animationIterationCount = animation.loop === false ? '1' : 'infinite'
    incoming.style.animationTimingFunction = `steps(${animation.loop === false ? Math.max(1, sheet.frames - 1) : sheet.frames})`
    incoming.style.animationName = animation.loop === false ? 'cat-pose' : 'cat-frames'
    incoming.dataset.asset = animation.asset
    outgoing.dataset.active = 'false'
    incoming.dataset.active = 'true'
    active.current = next
    asset.current = animation.asset
  }, [mode])

  return <span ref={renderer} className="pixel-cat-renderer" aria-hidden="true" style={initialStyle}>
    <span className="pixel-cat-sprite" data-active="true" data-asset="idle" style={{ animationPlayState: running ? 'running' : 'paused' }} />
    <span className="pixel-cat-sprite" data-active="false" data-asset="idle" style={{ animationPlayState: running ? 'running' : 'paused' }} />
  </span>
}
