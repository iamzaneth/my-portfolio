import { useLayoutEffect, useRef, type RefObject } from 'react'
import gsap from 'gsap'
import { catAnimations, type CatMode } from './catConfig'

export function useCatMotion(
  character: RefObject<HTMLSpanElement | null>,
  facing: RefObject<HTMLSpanElement | null>,
  shadow: RefObject<HTMLDivElement | null>,
  mode: CatMode, running: boolean, reducedMotion: boolean, version: number,
) {
  const playback = useRef<gsap.core.Timeline | null>(null)
  useLayoutEffect(() => {
    const element = character.current
    const direction = facing.current
    if (!element || !direction) return
    if (reducedMotion) {
      gsap.set([element, direction, shadow.current].filter(Boolean), { clearProps: 'transform,opacity' })
      return
    }
    const timeline = gsap.timeline({ defaults: { ease: 'sine.inOut' } })
    playback.current = timeline
    const anchor = Number(gsap.getProperty(element, 'x')) || 0
    const spriteSize = element.querySelector<HTMLElement>('.pixel-cat-sprite')?.offsetWidth ?? 0
    // The widest running frame occupies 30 of its 32 columns. Leave space for
    // the silhouette, landing tilt, and shadow instead of clipping at the stage.
    const limit = Math.min(54, Math.max(0, (element.clientWidth - spriteSize * 30 / 32) / 2 - 5))
    const clampX = gsap.utils.clamp(-limit, limit)
    const grounded = { y: 0, rotate: 0, scaleX: 1, scaleY: 1 }
    const pose = (vars: gsap.TweenVars) => {
      timeline.to(element, vars)
      if (shadow.current) timeline.to(shadow.current, {
        ...(vars.x !== undefined ? { x: vars.x } : {}),
        scaleX: typeof vars.y === 'number' && vars.y < -10 ? 0.7 : 1,
        opacity: typeof vars.y === 'number' && vars.y < -10 ? 0.55 : 1,
        duration: vars.duration, ease: vars.ease ?? 'sine.inOut',
      }, '<')
    }
    const turn = (sign: number) => timeline.to(direction, { rotationY: sign < 0 ? 180 : 0, duration: 0.16 })
    const travel = (distance: number) => {
      let sign = Number(gsap.getProperty(direction, 'rotationY')) > 90 ? -1 : 1
      if (Math.abs(anchor + distance * sign) > limit) sign *= -1
      const facingLeft = Number(gsap.getProperty(direction, 'rotationY')) > 90
      if (facingLeft !== (sign < 0)) turn(sign)
      pose({ ...grounded, x: clampX(anchor + distance * sign), duration: 1.1, ease: 'none' })
    }
    // Interrupting an airborne action lands from the current pose, instead of
    // teleporting to the ground or beginning the next movement in midair.
    if (Number(gsap.getProperty(element, 'y')) < -4) pose({ ...grounded, duration: 0.18, ease: 'power2.in' })

    if (mode === 'jump' || mode === 'doubleHop') {
      const heights = mode === 'doubleHop' ? [-32, -48] : [-58]
      for (const height of heights) {
        pose({ y: 0, rotate: 0, scaleY: 0.93, scaleX: 1.04, duration: 0.1 })
        pose({ y: height, scaleY: 1.03, scaleX: 0.98, rotate: -2, duration: 0.25, ease: 'power2.out' })
        pose({ y: 0, rotate: 0, scaleY: 0.94, scaleX: 1.035, duration: 0.28, ease: 'power2.in' })
        pose({ scaleY: 1, scaleX: 1, duration: 0.15 })
      }
    } else if (mode === 'nuzzle') {
      pose({ ...grounded, x: anchor + 7, rotate: -3, y: -2, duration: 0.4 })
      pose({ x: anchor - 5, rotate: 2, duration: 0.5 })
      pose({ ...grounded, x: anchor, duration: 0.6 })
    } else if (mode === 'purr' || mode === 'knead') {
      pose({ ...grounded, duration: 0.2 })
      for (let beat = 0; beat < (mode === 'knead' ? 4 : 2); beat++) {
        pose({ scaleY: 1.012, y: -1, rotate: mode === 'knead' ? (beat % 2 ? 1 : -1) : 0, duration: 0.3 })
        pose({ ...grounded, duration: 0.3 })
      }
    } else if (mode === 'paw' || mode === 'headTilt') {
      pose({ ...grounded, rotate: -2, duration: 0.3 })
      pose({ y: mode === 'paw' ? -3 : 0, rotate: mode === 'paw' ? 2 : 4, duration: 0.6 })
      pose({ ...grounded, duration: 0.5 })
    } else if (mode === 'pounce') {
      const sign = Number(gsap.getProperty(direction, 'rotationY')) > 90 ? -1 : 1
      const target = clampX(anchor + 22 * sign)
      pose({ scaleY: 0.9, scaleX: 1.04, duration: 0.16 })
      pose({ x: target, y: -28, rotate: -3 * sign, scaleY: 1.02, scaleX: 1, duration: 0.28, ease: 'power2.out' })
      pose({ x: target, y: 0, rotate: sign, scaleY: 0.94, duration: 0.26, ease: 'power2.in' })
      pose({ ...grounded, duration: 0.3 })
    } else if (mode === 'prowl') {
      travel(18)
      pose({ scaleY: 0.93, duration: 0.35 })
    } else if (mode === 'wiggle' || mode === 'shake') {
      pose({ ...grounded, scaleY: 0.96, duration: 0.2 })
      for (let beat = 0; beat < 6; beat++) pose({ x: anchor + (beat % 2 ? 3 : -3), rotate: beat % 2 ? 2 : -2, duration: 0.12 })
      pose({ ...grounded, x: anchor, duration: 0.25 })
    } else if (mode === 'walk' || mode === 'run') {
      travel(mode === 'walk' ? 23 : 32)
    } else if (mode === 'sniff') {
      pose({ ...grounded, scaleY: 0.96, rotate: 2, duration: 0.4 })
      pose({ x: anchor + 5, y: 1, scaleY: 0.94, duration: 0.4 })
      pose({ x: anchor + 2, rotate: 1, duration: 0.35 })
      pose({ ...grounded, x: anchor, duration: 0.45 })
    } else if (mode === 'peek') {
      pose({ ...grounded, y: -4, scaleY: 1.025, rotate: -2, duration: 0.5 })
      pose({ rotate: 2, duration: 0.65 })
      pose({ ...grounded, duration: 0.5 })
    } else if (mode === 'tailChase') {
      for (const sign of [-1, 1, -1]) {
        turn(sign)
        pose({ ...grounded, x: clampX(anchor + sign * 17), rotate: sign * 2, duration: 0.42 })
      }
      turn(1)
      pose({ ...grounded, x: anchor, duration: 0.3 })
    } else {
      // Stationary actions keep their place in the scene; only posture settles.
      pose({ ...grounded, duration: 0.3 })
    }
    const budget = catAnimations[mode].after
    if (budget) timeline.duration(budget / 1000)
    // Killing preserves the current transform at action boundaries. Visibility
    // changes use pause/resume below and never rebuild this timeline.
    return () => { timeline.kill(); playback.current = null }
  }, [character, facing, shadow, mode, reducedMotion, version])

  useLayoutEffect(() => {
    if (running) playback.current?.resume()
    else playback.current?.pause()
  }, [running, mode, version, reducedMotion])
}
