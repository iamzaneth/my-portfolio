import { catRoutines, type CatMode, type CatRoutineId } from './catConfig'

export interface CatState {
  mode: CatMode
  origin: 'user' | 'auto'
  pending: CatRoutineId | null
  routine: CatRoutineId | null
  steps: readonly CatMode[]
  engaged: boolean
  previousAuto: CatMode | null
  version: number
}
export type CatEvent =
  | { type: 'pet' | 'play'; routine: CatRoutineId }
  | { type: 'nap' | 'approach' | 'leave' }
  | { type: 'auto'; mode: CatMode; version: number }
  | { type: 'finish'; version: number }

export const initialCatState: CatState = {
  mode: 'idle', origin: 'auto', pending: null, routine: null, steps: [], engaged: false, previousAuto: null, version: 0,
}

function move(state: CatState, mode: CatMode, patch: Partial<CatState> = {}): CatState {
  return { ...state, mode, version: state.version + 1, ...patch }
}
function startRoutine(state: CatState, routine: CatRoutineId): CatState {
  if (state.mode === 'sleep' || state.mode === 'lieDown' || state.mode === 'wake') {
    return move(state, 'wake', { origin: 'user', pending: routine, routine, steps: [] })
  }
  const [first, ...steps] = catRoutines[routine].steps
  return move(state, first, { origin: 'user', pending: null, routine, steps })
}

export function catReducer(state: CatState, event: CatEvent): CatState {
  switch (event.type) {
    case 'pet':
    case 'play': return startRoutine(state, event.routine)
    case 'nap':
      return state.mode === 'sleep' || state.mode === 'lieDown'
        ? move(state, 'wake', { origin: 'user', pending: null, routine: null, steps: [] })
        : move(state, 'settle', { origin: 'user', pending: null, routine: null, steps: [] })
    case 'approach':
      if (state.engaged) return state
      if (state.mode === 'sleep') return move(state, 'wake', { origin: 'user', engaged: true, pending: null, routine: null, steps: [] })
      if (state.mode === 'idle') return move(state, 'attentive', { origin: 'user', engaged: true })
      return { ...state, engaged: true }
    case 'leave': return { ...state, engaged: false }
    case 'auto':
      if (state.version !== event.version || state.mode !== 'idle' || state.engaged) return state
      return move(state, event.mode, { origin: 'auto', previousAuto: event.mode, pending: null, routine: null, steps: [] })
    case 'finish': {
      if (state.version !== event.version) return state
      if (state.mode === 'settle') return move(state, 'lieDown')
      if (state.mode === 'lieDown') return move(state, 'sleep')
      if (state.mode === 'sleep') return state.origin === 'auto' ? move(state, 'wake') : state
      if (state.mode === 'wake' && state.pending) return startRoutine(move(state, 'idle'), state.pending)
      if (state.steps.length) return move(state, state.steps[0], { steps: state.steps.slice(1) })
      return move(state, 'idle', { pending: null, routine: null, steps: [] })
    }
  }
}
