export const PLANET_RADIUS = 1.48
export type UniversePhase = 'ambient' | 'hovered' | 'focusing' | 'focused' | 'returning'
export interface TechnologyTarget { projectId: string; name: string }
export interface UniverseState {
  phase: UniversePhase
  activeId: string | null
  hoveredId: string | null
  selectedId: string | null
  focusedId: string | null
  hoveredTechnology: TechnologyTarget | null
  technology: TechnologyTarget | null
  stackPage: number
  paused: boolean
}
export function initialUniverseState(activeId: string | null): UniverseState {
  return { phase: 'ambient', activeId, hoveredId: null, selectedId: null, focusedId: null, hoveredTechnology: null, technology: null, stackPage: 0, paused: false }
}
export type UniverseEvent =
  | { type: 'hover'; id: string | null }
  | { type: 'hoverTechnology'; target: TechnologyTarget | null }
  | { type: 'inspectTechnology'; target: TechnologyTarget; page: number }
  | { type: 'stackPage'; page: number }
  | { type: 'browse'; id: string }
  | { type: 'select'; id: string }
  | { type: 'close' }
  | { type: 'settled' }
  | { type: 'pause' }
  | { type: 'overview' }

export function universeReducer(state: UniverseState, event: UniverseEvent): UniverseState {
  const locked = state.phase === 'focusing' || state.phase === 'focused' || state.phase === 'returning'
  const modalOpen = state.phase === 'focusing' || state.phase === 'focused'
  switch (event.type) {
    case 'hover':
      if (locked || (state.hoveredId === event.id && !state.hoveredTechnology)) return state
      return { ...state, hoveredId: event.id, hoveredTechnology: null, phase: event.id ? 'hovered' : 'ambient' }
    case 'hoverTechnology':
      if (locked) return state
      return { ...state, hoveredTechnology: event.target, hoveredId: event.target?.projectId ?? null, phase: event.target ? 'hovered' : 'ambient' }
    case 'inspectTechnology':
      if (modalOpen) return state
      return { ...state, activeId: event.target.projectId, focusedId: event.target.projectId, technology: event.target, stackPage: event.page }
    case 'stackPage':
      return { ...state, stackPage: Math.max(0, event.page), technology: null, hoveredTechnology: null }
    case 'browse':
      if (modalOpen) return state
      return { ...state, activeId: event.id, focusedId: event.id, hoveredId: null, hoveredTechnology: null, technology: null, stackPage: 0, phase: 'ambient' }
    case 'select':
      return { ...state, activeId: event.id, selectedId: event.id, focusedId: event.id, hoveredId: null, hoveredTechnology: null, stackPage: state.activeId === event.id ? state.stackPage : 0, phase: 'focusing' }
    case 'close':
      return { ...state, phase: 'returning', hoveredId: null, selectedId: null, hoveredTechnology: null }
    case 'settled':
      return state.phase === 'focusing' ? { ...state, phase: 'focused' }
        : state.phase === 'returning' ? { ...state, phase: 'ambient' } : state
    case 'overview': return { ...state, focusedId: null, technology: null, hoveredTechnology: null, hoveredId: null, stackPage: 0 }
    case 'pause': return { ...state, paused: !state.paused }
  }
}

/** Analytically integrated time scale; pauses and tab resumption have no jumps. */
export class SceneClock {
  time = 0
  rate = 1
  advance(delta: number, targetRate: number, immediate = false) {
    const dt = Math.min(Math.max(delta, 0), .05)
    if (immediate) this.rate = targetRate
    const decay = Math.exp(-9 * dt)
    this.time += targetRate * dt + (this.rate - targetRate) * (1 - decay) / 9
    this.rate = targetRate + (this.rate - targetRate) * decay
    return this.time
  }
}
