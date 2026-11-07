import { useEffect, useRef, type MouseEvent } from 'react'
import gsap from 'gsap'

/** One bounded return action, independent of chapter selection and native history. */
export function useBackToTop() {
  const playback = useRef<gsap.core.Tween | null>(null)
  useEffect(() => {
    const cancel = () => { playback.current?.kill(); playback.current = null }
    for (const type of ['wheel', 'touchstart', 'pointerdown', 'keydown']) window.addEventListener(type, cancel, { capture: true, passive: true })
    return () => {
      cancel()
      for (const type of ['wheel', 'touchstart', 'pointerdown', 'keydown']) window.removeEventListener(type, cancel, true)
    }
  }, [])
  return (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    playback.current?.kill()
    if (location.hash !== '#home') history.pushState(history.state, '', '#home')
    const finish = () => { playback.current = null; document.getElementById('main')?.focus({ preventScroll: true }) }
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      window.scrollTo({ top: 0, behavior: 'instant' }); finish(); return
    }
    const position = { y: scrollY }
    playback.current = gsap.to(position, { y: 0, duration: .65, ease: 'power3.out',
      onUpdate: () => window.scrollTo({ top: position.y, behavior: 'instant' }), onComplete: finish,
    })
  }
}
