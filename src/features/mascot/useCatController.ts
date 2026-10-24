import { useCallback, useEffect, useReducer, useRef, useState } from 'react'
import { useMotionPreference } from '@/hooks/useMotionPreference'
import { catAnimations, nextCatRoutine, planCatBehavior, type CatAction, type CatRoutineDeck } from './catConfig'
import { catReducer, initialCatState } from './catState'

export function useCatController() {
  const [state, dispatchEvent] = useReducer(catReducer, initialCatState)
  const decks = useRef<Record<CatAction, CatRoutineDeck>>({ pet: { remaining: [], previous: null }, play: { remaining: [], previous: null } })
  const dispatch = useCallback((event: { type: 'pet' | 'play' | 'nap' | 'approach' | 'leave' }) => {
    if (event.type === 'pet' || event.type === 'play') {
      const next = nextCatRoutine(event.type, decks.current[event.type])
      decks.current[event.type] = next.deck
      dispatchEvent({ type: event.type, routine: next.routine })
    } else dispatchEvent({ type: event.type })
  }, [])
  const countdown = useRef<{ version: number; remaining: number; event: 'auto' | 'finish'; mode?: ReturnType<typeof planCatBehavior>['mode'] } | null>(null)
  const [visible, setVisible] = useState(true)
  const [pageVisible, setPageVisible] = useState(!document.hidden)
  const scene = useRef<HTMLDivElement>(null)
  const reducedMotion = useMotionPreference()
  const running = visible && pageVisible && !reducedMotion

  useEffect(() => {
    let active = true
    const observer = new IntersectionObserver(([entry]) => {
      if (active) setVisible(entry.isIntersecting)
    }, { threshold: 0.1 })
    if (scene.current) observer.observe(scene.current)
    const onVisibility = () => setPageVisible(!document.hidden)
    document.addEventListener('visibilitychange', onVisibility)
    return () => { active = false; observer.disconnect(); document.removeEventListener('visibilitychange', onVisibility) }
  }, [reducedMotion])

  useEffect(() => {
    if (!countdown.current || countdown.current.version !== state.version) {
      if (state.mode === 'idle') {
        const plan = planCatBehavior(state.previousAuto)
        countdown.current = { version: state.version, remaining: plan.delay, event: 'auto', mode: plan.mode }
      } else {
        const delay = state.mode === 'sleep'
          ? state.origin === 'auto' ? 9000 + Math.random() * 5000 : undefined
          : catAnimations[state.mode].after
        countdown.current = delay === undefined ? null : { version: state.version, remaining: delay, event: 'finish' }
      }
    }
    const clock = countdown.current
    if (!clock || !visible || !pageVisible) return
    if (state.mode === 'idle' && (reducedMotion || state.engaged)) return
    if (reducedMotion && state.origin === 'auto') return
    const started = performance.now()
    const timer = window.setTimeout(() => {
      if (clock.event === 'auto') dispatchEvent({ type: 'auto', mode: clock.mode!, version: clock.version })
      else dispatchEvent({ type: 'finish', version: clock.version })
    }, clock.remaining)
    return () => {
      window.clearTimeout(timer)
      clock.remaining = Math.max(0, clock.remaining - (performance.now() - started))
    }
  }, [state.mode, state.origin, state.version, state.previousAuto, state.engaged, visible, pageVisible, reducedMotion])

  return { ...state, dispatch, scene, running, reducedMotion, visible, pageVisible }
}
