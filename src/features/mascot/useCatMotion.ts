import { useLayoutEffect, type RefObject } from 'react'
import gsap from 'gsap'
import type { CatMode } from './catConfig'

export function useCatMotion(character: RefObject<HTMLSpanElement | null>, mode: CatMode, running: boolean, reducedMotion: boolean, version: number) {
  useLayoutEffect(() => {
    const element = character.current
    if (!element) return
    if (reducedMotion) {
      gsap.set(element, { clearProps: 'transform' })
      return
    }
    if (!running) return
    const timeline = gsap.timeline({ defaults: { overwrite: 'auto' } })
    const home = { x: 0, y: 0, rotate: 0, scaleX: 1, scaleY: 1 }
    if (mode === 'jump') {
      timeline.to(element, { scaleY: 0.94, scaleX: 1.04, duration: 0.1 })
        .to(element, { y: -65, scaleY: 1.03, scaleX: 0.98, rotate: -3, duration: 0.27, ease: 'power2.out' })
        .to(element, { ...home, scaleY: 0.96, scaleX: 1.03, duration: 0.32, ease: 'power2.in' })
        .to(element, { scaleY: 1, scaleX: 1, duration: 0.14, ease: 'sine.out' })
    } else if (mode === 'nuzzle') {
      timeline.to(element, { ...home, x: 9, rotate: -4, y: -3, duration: 0.35, ease: 'sine.inOut' })
        .to(element, { x: -7, rotate: 3, duration: 0.45, ease: 'sine.inOut' })
        .to(element, { ...home, duration: 0.55, ease: 'sine.inOut' })
    } else if (mode === 'purr') {
      timeline.to(element, { ...home, duration: 0.2 })
        .to(element, { scaleY: 1.015, y: -1, duration: 0.35, repeat: 3, yoyo: true, ease: 'sine.inOut' })
    } else if (mode === 'paw') {
      timeline.to(element, { ...home, rotate: -2, duration: 0.25 })
        .to(element, { y: -4, rotate: 2, duration: 0.3, repeat: 2, yoyo: true, ease: 'sine.inOut' })
        .to(element, { ...home, duration: 0.3 })
    } else if (mode === 'pounce') {
      timeline.to(element, { scaleY: 0.9, scaleX: 1.04, duration: 0.16 })
        .to(element, { x: 27, y: -28, rotate: -3, scaleY: 1.02, scaleX: 1, duration: 0.28, ease: 'power2.out' })
        .to(element, { x: 14, y: 0, rotate: 1, scaleY: 0.95, duration: 0.23, ease: 'power2.in' })
        .to(element, { ...home, duration: 0.35, ease: 'power2.out' })
    } else if (mode === 'doubleHop') {
      for (const [x, height] of [[-15, -34], [15, -52]]) {
        timeline.to(element, { scaleY: 0.94, scaleX: 1.03, duration: 0.1 })
          .to(element, { x, y: height, scaleY: 1.02, scaleX: 1, rotate: x < 0 ? -2 : 2, duration: 0.22, ease: 'power2.out' })
          .to(element, { y: 0, scaleY: 0.96, rotate: 0, duration: 0.22, ease: 'power2.in' })
          .to(element, { scaleY: 1, duration: 0.1 })
      }
      timeline.to(element, { ...home, duration: 0.18 })
    } else if (mode === 'prowl') {
      timeline.to(element, { ...home, scaleY: 0.94, x: -22, duration: 1.2, ease: 'sine.inOut' })
        .to(element, { x: -12, scaleY: 0.91, duration: 0.6, ease: 'sine.inOut' })
    } else if (mode === 'wiggle') {
      timeline.to(element, { ...home, scaleY: 0.94, duration: 0.18 })
        .to(element, { x: -5, rotate: -3, duration: 0.14 })
        .to(element, { x: 5, rotate: 3, duration: 0.14, repeat: 4, yoyo: true, ease: 'sine.inOut' })
        .to(element, { ...home, duration: 0.22 })
    } else if (mode === 'walk' || mode === 'run') {
      timeline.to(element, { ...home, x: mode === 'walk' ? 20 : -20, duration: mode === 'walk' ? 0.8 : 0.55, ease: 'sine.inOut' })
        .to(element, { x: 0, duration: mode === 'walk' ? 0.8 : 0.55, ease: 'sine.inOut' })
    } else {
      timeline.to(element, { ...home, duration: 0.3, ease: 'power2.out' })
    }
    // Kill preserves the current pose; reverting here would snap back between states.
    return () => { timeline.kill() }
  }, [character, mode, running, reducedMotion, version])
}
