export interface SkyRect { x: number; y: number; width: number; height: number }
export interface SkyActivity {
  width: number
  height: number
  zones: SkyRect[]
  revision: number
  modal: boolean
  transitioning: boolean
  layoutPending?: boolean
}
export const overlaps = (a: SkyRect, b: SkyRect) => a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y

/** Slab intersection checks the entire streak, not just its moving head. */
export function clearSkyPath(a: readonly number[], b: readonly number[], zones: readonly SkyRect[], padding = 10) {
  return !zones.some(rect => {
    let enter = 0, exit = 1
    for (let axis = 0; axis < 2; axis++) {
      const origin = a[axis], delta = b[axis] - origin
      const low = (axis ? rect.y : rect.x) - padding, high = low + (axis ? rect.height : rect.width) + padding * 2
      if (Math.abs(delta) < .0001) { if (origin < low || origin > high) return false; continue }
      const first = (low - origin) / delta, second = (high - origin) / delta
      enter = Math.max(enter, Math.min(first, second)); exit = Math.min(exit, Math.max(first, second))
      if (enter > exit) return false
    }
    return true
  })
}

/** DOM reads happen on layout events, never in the renderer's frame loop. */
export function createSkyActivity(invalidate: () => void) {
  const snapshot: SkyActivity = { width: innerWidth, height: innerHeight, zones: [], revision: 0, modal: false, transitioning: false }
  const selectors = '[data-sky-avoid], .site-header, .hero-text, .hero-universe-link, .hero-bottom, .section-heading > div, .section-aside, .about-copy, .identity-stage, .technology-map, .toolkit-footnote, .project-index, .project-card, .explorer-scene, .github-more, .contact-top, .contact-heading, .contact-details, .footer, .scene-topline > span, .scene-aux-controls, .scene-caption, .scene-controls'
  let timer: ReturnType<typeof setTimeout> | undefined, frame = 0, disposed = false
  const observed = new Set<Element>()
  const resizeObserver = new ResizeObserver(schedule)
  function flags() {
    snapshot.modal = Boolean(document.querySelector('dialog[open]'))
    snapshot.transitioning = document.documentElement.dataset.navigation === 'navigating'
    invalidate()
  }
  function measure() {
    frame = 0
    if (disposed) return
    flags()
    snapshot.width = innerWidth; snapshot.height = innerHeight
    const viewport = { x: 0, y: 0, width: innerWidth, height: innerHeight }, zones: SkyRect[] = []
    const elements = new Set(document.querySelectorAll<HTMLElement>(selectors))
    for (const element of observed) if (!elements.has(element as HTMLElement)) { resizeObserver.unobserve(element); observed.delete(element) }
    for (const element of elements) {
      if (!observed.has(element)) { observed.add(element); resizeObserver.observe(element) }
      if (!element.getClientRects().length || element.closest('[hidden]')) continue
      const r = element.getBoundingClientRect()
      if (r.width && r.height && overlaps(viewport, { x: r.left, y: r.top, width: r.width, height: r.height })) zones.push({ x: r.left - 12, y: r.top - 12, width: r.width + 24, height: r.height + 24 })
    }
    // The planet's physical composition is smaller than its transparent DOM slot.
    const slot = document.querySelector<HTMLElement>('.scene-slot-hero')?.getBoundingClientRect()
    if (slot && slot.top < innerHeight && slot.bottom > 0) zones.push({ x: slot.left + slot.width * .12, y: slot.top + slot.height * .23, width: slot.width * .76, height: slot.height * .54 })
    snapshot.zones = zones; snapshot.revision++
    snapshot.layoutPending = false
    invalidate()
  }
  function schedule() {
    if (disposed) return
    snapshot.layoutPending = true
    clearTimeout(timer)
    timer = setTimeout(() => { if (!frame) frame = requestAnimationFrame(measure) }, 140)
  }
  const stateObserver = new MutationObserver(() => { flags(); schedule() })
  stateObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-navigation', 'data-chapter'] })
  const modalObserver = new MutationObserver(records => {
    if (records.some(record => record.type === 'attributes' || [...record.addedNodes, ...record.removedNodes].some(node => node instanceof Element && (node.matches('dialog') || node.querySelector('dialog'))))) { flags(); schedule() }
  })
  modalObserver.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['open'] })
  window.addEventListener('resize', schedule, { passive: true }); window.addEventListener('scroll', schedule, { passive: true, capture: true })
  void document.fonts.ready.then(schedule)
  measure()
  return { snapshot, refresh: schedule, dispose() { disposed = true; clearTimeout(timer); cancelAnimationFrame(frame); resizeObserver.disconnect(); stateObserver.disconnect(); modalObserver.disconnect(); window.removeEventListener('resize', schedule); window.removeEventListener('scroll', schedule, true) } }
}
