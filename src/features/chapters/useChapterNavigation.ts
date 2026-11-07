import { useEffect, useState } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

type Chapter = { element: HTMLElement; top: number; height: number; compact: boolean }

/** Document scrolling is the only scroll plane. Active state follows measured position. */
export function useChapterNavigation() {
  const [active, setActive] = useState('home')
  useEffect(() => {
    const root = document.documentElement
    const sections = Array.from(document.querySelectorAll<HTMLElement>('main > section[id]'))
    const header = document.querySelector<HTMLElement>('.site-header')
    if (!header || !sections.length) return
    const previousRestoration = history.scrollRestoration
    history.scrollRestoration = 'manual'
    const motion = matchMedia('(prefers-reduced-motion: reduce)')
    const desktop = matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine)')
    let alive = true, interacted = false
    let chapters: Chapter[] = [], offset = 0, current = 0, updateFrame = 0, measureFrame = 0, historyFrame = 0, motionFrame = 0
    let nativeInput = false
    let settling = false, consumed = false, direction = 0, intent = 0, lastWheel = 0, lastScroll = 0
    let fallback: ReturnType<typeof setTimeout> | undefined
    let refresh: ReturnType<typeof setTimeout> | undefined
    let safety: ReturnType<typeof setTimeout> | undefined

    function modal() { return document.querySelector('dialog[open]') !== null }
    function update() {
      updateFrame = 0
      if (modal()) return
      const line = scrollY + offset + Math.min(180, (innerHeight - offset) * .25)
      current = 0
      chapters.forEach((chapter, index) => { if (chapter.top <= line) current = index })
      const id = chapters[current]?.element.id ?? 'home'
      if (root.dataset.chapter !== id) {
        root.dataset.chapter = id
        setActive(id)
      }
    }
    function finish() {
      settling = false
      delete root.dataset.chapterMoving
      clearTimeout(safety)
      update()
      const chapter = chapters[current]
      const start = chapter ? chapter.top - offset : 0
      // Resume chapter alignment only after native wheel input has actually
      // crossed into a compact chapter. Never pull unread tall content away.
      if (nativeInput && desktop.matches && !motion.matches && !modal() && chapter?.compact && scrollY > start + 4 && scrollY < start + (innerHeight - offset) * .4) {
        nativeInput = false
        navigate(start)
      } else nativeInput = false
      // consumed stays true until a fresh gesture, including its inertial tail.
    }
    function scroll() {
      lastScroll = performance.now()
      if (!updateFrame) updateFrame = requestAnimationFrame(update)
      clearTimeout(fallback)
      // scrollend is authoritative; the debounce covers browsers without it and
      // interrupted scrolls. It resets on actual scrolling, never on wheel noise.
      fallback = setTimeout(finish, 140)
    }
    function measure() {
      measureFrame = 0
      if (modal()) return
      const previous = chapters
      const oldOffset = offset
      offset = header!.offsetHeight
      chapters = sections.map(element => {
        const height = element.offsetHeight
        const compact = height <= innerHeight - offset + 2
        element.dataset.compact = String(compact)
        return { element, top: element.offsetTop, height, compact }
      })
      const changed = previous.length > 0 && (oldOffset !== offset || chapters.some((chapter, i) => chapter.height !== previous[i].height))
      update()
      if (changed) {
        cancelGesture()
        clearTimeout(refresh)
        const refreshWhenIdle = () => {
          if (modal() || settling || performance.now() - lastScroll < 180) refresh = setTimeout(refreshWhenIdle, 180)
          else ScrollTrigger.refresh()
        }
        refresh = setTimeout(refreshWhenIdle, 180)
      }
    }
    function scheduleMeasure() {
      if (!measureFrame) measureFrame = requestAnimationFrame(measure)
    }
    function nestedScroll(target: Element | null) {
      for (let element = target; element && element !== document.body; element = element.parentElement) {
        if (element.matches('dialog, input, textarea, select, [contenteditable=true], [role=slider], .pipeline-route')) return true
        if (/(auto|scroll)/.test(getComputedStyle(element).overflowY) && element.scrollHeight > element.clientHeight + 1) return true
      }
      return false
    }
    function wheel(event: WheelEvent) {
      interacted = true
      if (!desktop.matches || motion.matches || modal() || event.ctrlKey || event.metaKey || event.shiftKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return
      if (Boolean(window.getSelection()?.toString()) || nestedScroll(event.target instanceof Element ? event.target : null)) return
      const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1)
      if (!delta) return
      const now = performance.now(), sign = Math.sign(delta)
      // A pause during an unfinished transition must not reopen the gate for
      // the remainder of that input burst after the browser lands.
      if (settling) {
        lastWheel = now
        direction = sign
        consumed = true
        event.preventDefault()
        return
      }
      const fresh = now - lastWheel > 180
      if (fresh || sign !== direction) { intent = 0; consumed = false }
      lastWheel = now
      direction = sign
      if (consumed) { event.preventDefault(); return }
      const chapter = chapters[current]
      // Oversized chapters always use native scrolling, including their edges.
      if (!chapter?.compact || Math.abs(scrollY - (chapter.top - offset)) > 4) { nativeInput = true; return }
      const destination = chapters[current + sign]
      if (!destination) return
      event.preventDefault()
      intent += delta
      if (Math.abs(intent) < 70) return
      navigate(destination.top - offset)
    }
    function navigate(top: number) {
      nativeInput = false
      consumed = settling = true
      root.dataset.chapterMoving = 'true'
      window.scrollTo({ top, behavior: 'smooth' })
      // Safety only: an interrupted/no-op browser animation must never lock input.
      clearTimeout(safety)
      safety = setTimeout(finish, 1500)
    }
    function cancelGesture() { nativeInput = false; finish(); consumed = false; intent = 0 }
    function anchor(event: MouseEvent) {
      interacted = true
      const target = event.target instanceof Element ? event.target.closest('a[href^="#"]') : null
      if (target) cancelGesture() // Native links own hash, focus, and history.
    }
    function clearBehavior() { root.style.removeProperty('scroll-behavior') }
    function preference() {
      cancelGesture()
      clearBehavior()
      cancelAnimationFrame(motionFrame)
      motionFrame = requestAnimationFrame(clearBehavior)
    }
    function userInput() { interacted = true; cancelGesture() }
    function restoreHistory() {
      cancelGesture()
      cancelAnimationFrame(historyFrame)
      historyFrame = requestAnimationFrame(() => {
        measure()
        const destination = chapters.find(chapter => `#${chapter.element.id}` === location.hash)
        window.scrollTo({ top: destination ? destination.top - offset : 0, behavior: 'instant' })
        update()
      })
    }
    function visibility() { if (document.hidden) cancelGesture() }
    const observer = new ResizeObserver(scheduleMeasure)
    sections.forEach(section => observer.observe(section))
    observer.observe(header)
    measure()
    // React mounts after native fragment resolution. Restore an initial deep link
    // once fonts settle, without adding history or animating from Home.
    void document.fonts.ready.then(() => {
      if (!alive) return
      measure()
      const chapter = chapters.find(item => `#${item.element.id}` === location.hash)
      if (chapter && !interacted) {
        window.scrollTo({ top: chapter.top - offset, behavior: 'instant' })
        update()
      }
    })
    window.addEventListener('scroll', scroll, { passive: true })
    window.addEventListener('scrollend', finish)
    window.addEventListener('wheel', wheel, { passive: false })
    window.addEventListener('resize', scheduleMeasure, { passive: true })
    window.addEventListener('hashchange', cancelGesture)
    window.addEventListener('popstate', restoreHistory)
    window.addEventListener('keydown', userInput)
    window.addEventListener('pointerdown', userInput, { passive: true })
    document.addEventListener('click', anchor)
    document.addEventListener('visibilitychange', visibility)
    motion.addEventListener('change', preference)
    ScrollTrigger.addEventListener('refresh', clearBehavior)
    return () => {
      alive = false
      history.scrollRestoration = previousRestoration
      observer.disconnect()
      clearBehavior()
      cancelAnimationFrame(historyFrame)
      cancelAnimationFrame(motionFrame)
      cancelAnimationFrame(updateFrame)
      cancelAnimationFrame(measureFrame)
      clearTimeout(fallback)
      clearTimeout(refresh)
      clearTimeout(safety)
      delete root.dataset.chapterMoving
      delete root.dataset.chapter
      sections.forEach(section => delete section.dataset.compact)
      window.removeEventListener('scroll', scroll)
      window.removeEventListener('scrollend', finish)
      window.removeEventListener('wheel', wheel)
      window.removeEventListener('resize', scheduleMeasure)
      window.removeEventListener('hashchange', cancelGesture)
      window.removeEventListener('popstate', restoreHistory)
      window.removeEventListener('keydown', userInput)
      window.removeEventListener('pointerdown', userInput)
      document.removeEventListener('click', anchor)
      document.removeEventListener('visibilitychange', visibility)
      motion.removeEventListener('change', preference)
      ScrollTrigger.removeEventListener('refresh', clearBehavior)
    }
  }, [])
  return active
}
