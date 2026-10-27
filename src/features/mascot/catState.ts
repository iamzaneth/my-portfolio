import { autonomousCatSteps, catBridges, catRoutines, connectCatSteps, type CatMode, type CatRoutineId } from './catConfig'

type CatIntent = CatRoutineId | 'nap' | 'idle'
interface CatState {
  mode: CatMode
  expression: CatMode
  origin: 'user' | 'auto'
  pending: CatIntent | null
  routine: CatRoutineId | null
  steps: readonly CatMode[]
  engaged: boolean
  previousAuto: CatMode | null
  version: number
}
type CatEvent =
  | { type: 'pet' | 'play'; routine: CatRoutineId }
  | { type: 'nap' | 'approach' | 'leave' }
  | { type: 'auto'; mode: CatMode; version: number }
  | { type: 'finish'; version: number }

export const initialCatState: CatState = {
  mode: 'idle', expression: 'idle', origin: 'auto', pending: null, routine: null, steps: [], engaged: false, previousAuto: null, version: 0,
}

function move(state: CatState, mode: CatMode, patch: Partial<CatState> = {}): CatState {
  return { ...state, mode, version: state.version + 1, ...patch }
}
function startSteps(state: CatState, requested: readonly CatMode[], patch: Partial<CatState> = {}): CatState {
  const [mode, ...steps] = connectCatSteps(state.mode, requested)
  return move(state, mode, { pending: null, steps, ...patch })
}
function startIntent(state: CatState, intent: CatIntent): CatState {
  const routine = intent === 'nap' || intent === 'idle' ? null : intent
  const requested: readonly CatMode[] = intent === 'nap' ? ['settle', 'lieDown', 'sleep']
    : routine ? [...catRoutines[routine].steps, 'idle'] : ['idle']
  return startSteps(state, requested, { origin: 'user', routine, expression: routine ? catRoutines[routine].steps[0] : intent === 'nap' ? 'sleep' : 'idle' })
}
function requestIntent(state: CatState, intent: CatIntent): CatState {
  // Finish a short posture bridge before changing intention. Repeated clicks replace
  // the queue without restarting the current clip, its motion, or its countdown.
  if (catBridges.has(state.mode)) {
    return { ...state, origin: 'user', pending: intent, routine: intent === 'nap' || intent === 'idle' ? null : intent, expression: intent === 'nap' ? 'sleep' : intent === 'idle' ? 'idle' : catRoutines[intent].steps[0] }
  }
  return startIntent(state, intent)
}

export function catReducer(state: CatState, event: CatEvent): CatState {
  switch (event.type) {
    case 'pet':
    case 'play': return requestIntent(state, event.routine)
    case 'nap': return requestIntent(state, state.mode === 'sleep' || state.mode === 'lieDown' ? 'idle' : 'nap')
    case 'approach':
      if (state.engaged) return state
      if (state.mode === 'sleep') return startIntent({ ...state, engaged: true }, 'idle')
      if (state.mode === 'idle') return startSteps(state, ['attentive', 'idle'], { origin: 'user', engaged: true, expression: 'attentive' })
      return { ...state, engaged: true }
    case 'leave': return { ...state, engaged: false }
    case 'auto':
      if (state.version !== event.version || state.mode !== 'idle' || state.engaged) return state
      return startSteps(state, autonomousCatSteps(event.mode), { origin: 'auto', previousAuto: event.mode, routine: null, expression: event.mode })
    case 'finish': {
      if (state.version !== event.version) return state
      if (state.pending) return startIntent(state, state.pending)
      if (state.mode === 'sleep') return state.origin === 'auto' ? startSteps(state, ['idle'], { expression: 'idle' }) : state
      if (state.steps.length) {
        const next = state.steps[0]
        return move(state, next, { steps: state.steps.slice(1), ...(next === 'idle' ? { routine: null, expression: 'idle' } : {}) })
      }
      return startSteps(state, ['idle'], { pending: null, routine: null })
    }
  }
}
