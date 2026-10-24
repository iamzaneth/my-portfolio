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
    if (!visible || !pageVisible) return
    // Autonomous behavior is quiet while visitors interact, and disabled for reduced motion.
    if (state.mode === 'idle') {
      if (reducedMotion || state.engaged) return
      const plan = planCatBehavior(state.previousAuto)
      const timer = window.setTimeout(() => dispatchEvent({ type: 'auto', mode: plan.mode, version: state.version }), plan.delay)
      return () => window.clearTimeout(timer)
    }
    if (reducedMotion && state.origin === 'auto') return
    const delay = state.mode === 'sleep'
      ? state.origin === 'auto' ? 9000 + Math.random() * 5000 : undefined
      : catAnimations[state.mode].after
    if (delay === undefined) return
    const timer = window.setTimeout(() => dispatchEvent({ type: 'finish', version: state.version }), delay)
    return () => window.clearTimeout(timer)
  }, [state, visible, pageVisible, reducedMotion])

  return { ...state, dispatch, scene, running, reducedMotion, visible, pageVisible }
}
