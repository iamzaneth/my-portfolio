import { catSprites } from './catSprites'

export type CatMode = 'idle' | 'attentive' | 'walk' | 'run' | 'jump' | 'meow' | 'lieDown' | 'sleep' | 'wake' | 'groom' | 'groomPaw' | 'scratch' | 'stretch' | 'settle' | 'nuzzle' | 'purr' | 'paw' | 'pounce' | 'doubleHop' | 'prowl' | 'wiggle' | 'sitDown' | 'standUp' | 'sniff' | 'headTilt' | 'knead' | 'shake' | 'peek' | 'tailChase'
type CatPosture = 'standing' | 'sitting' | 'lying'
interface CatAnimation {
  asset: keyof typeof catSprites
  duration: number
  posture?: CatPosture
  endsIn?: CatPosture
  frames?: readonly [number, number]
  after?: number
  loop?: boolean
  label: string
  message: string
}

export const catAnimations: Record<CatMode, CatAnimation> = {
  idle: { asset: 'idle', duration: 1.5, label: 'Quietly curious', message: 'Hi, I’m your pixel companion.' },
  attentive: { posture: 'sitting', asset: 'sit', duration: 1, after: 2400, label: 'You have my attention', message: 'A visitor? For me?' },
  walk: { asset: 'walk', duration: 0.8, after: 1600, label: 'Exploring the possibilities', message: 'Let’s follow the data.' },
  run: { asset: 'run', duration: 0.55, after: 1100, label: 'A little burst of energy', message: 'Zoomies, but make it data.' },
  jump: { asset: 'meow', duration: 0.65, after: 850, label: 'One very happy cat', message: 'You had me at hello. ♡' },
  meow: { asset: 'meow', duration: 0.8, after: 1700, label: 'Purr-fect company', message: 'Thanks for the head pats!' },
  lieDown: { posture: 'sitting', endsIn: 'lying', frames: [4, 7], asset: 'lieDown', duration: 0.42, after: 460, loop: false, label: 'Getting comfortable', message: 'Just finding the perfect spot…' },
  sleep: { posture: 'lying', asset: 'sleep', duration: 1, label: 'Recharging the curiosity', message: 'Dreaming in Python…' },
  wake: { posture: 'lying', endsIn: 'sitting', asset: 'lieDown', frames: [7, 4], duration: 1.3, after: 1380, loop: false, label: 'Back from a little daydream', message: 'Oh, hello again!' },
  groom: { posture: 'sitting', asset: 'groom', duration: 0.9, after: 1800, label: 'A little self-care', message: 'Even pixel cats need a tidy coat.' },
  groomPaw: { posture: 'sitting', asset: 'groomPaw', duration: 0.95, after: 1900, label: 'Keeping the paws polished', message: 'Clean paws. Clear thoughts.' },
  scratch: { posture: 'sitting', asset: 'scratch', duration: 0.45, after: 1800, label: 'Just a tiny itch', message: 'One moment. Important cat business.' },
  stretch: { asset: 'wake', duration: 1.3, after: 1380, loop: false, label: 'Stretching the possibilities', message: 'A little stretch goes a long way.' },
  settle: { asset: 'idle', duration: 1.5, after: 360, label: 'Slowing things down', message: 'A little rest sounds nice.' },
  nuzzle: { asset: 'idle', duration: 1.5, after: 1500, label: 'Leaning into the head pats', message: 'A little closer, please. ♡' },
  purr: { posture: 'sitting', asset: 'sit', duration: 1, after: 1600, label: 'A very content little cat', message: 'Prrrr. This is a good day.' },
  paw: { posture: 'sitting', asset: 'groomPaw', duration: 0.8, after: 1600, label: 'A tiny paw for you', message: 'One little paw. A lot of affection.' },
  pounce: { asset: 'run', duration: 0.55, after: 1100, label: 'Ready, steady, pounce!', message: 'Caught an imaginary data bug!' },
  doubleHop: { asset: 'meow', duration: 0.65, after: 1500, label: 'Twice the bounce', message: 'One hop? Let’s make it two.' },
  prowl: { asset: 'walk', duration: 1.1, after: 1900, label: 'Following a tiny mystery', message: 'Shh. Something interesting over there.' },
  sitDown: { asset: 'lieDown', frames: [0, 4], endsIn: 'sitting', duration: 0.48, after: 520, loop: false, label: 'Taking a little seat', message: 'Let me get comfortable.' },
  standUp: { asset: 'lieDown', frames: [4, 0], posture: 'sitting', endsIn: 'standing', duration: 0.48, after: 520, loop: false, label: 'Back on my paws', message: 'Ready for the next little adventure.' },
  sniff: { asset: 'idle', duration: 1.2, after: 1800, label: 'Investigating a tiny mystery', message: 'Sniff sniff. Is that a new idea?' },
  headTilt: { asset: 'sit', posture: 'sitting', duration: 1, after: 1800, label: 'Considering your excellent idea', message: 'You have my undivided cat-tention.' },
  knead: { asset: 'groomPaw', posture: 'sitting', duration: 0.8, after: 2400, label: 'Making tiny pixel biscuits', message: 'Soft paws. Fresh biscuits. Just for you.' },
  shake: { asset: 'scratch', posture: 'sitting', duration: 0.3, after: 1200, label: 'A little fluff reset', message: 'Shake it out. All fluffy again.' },
  peek: { asset: 'idle', duration: 1.5, after: 1800, label: 'Peeking at the possibilities', message: 'What is happening over there?' },
  tailChase: { asset: 'run', duration: 0.6, after: 2400, label: 'Chasing a very familiar mystery', message: 'Wait. Has that tail always been mine?' },
  wiggle: { asset: 'idle', duration: 1.2, after: 1300, label: 'Warming up the wiggles', message: 'A little wiggle before the big leap.' },
}

export type CatAction = 'pet' | 'play'
export const catRoutines = {
  happyHop: { action: 'pet', steps: ['jump', 'meow'] },
  headRub: { action: 'pet', steps: ['nuzzle', 'purr'] },
  pawThanks: { action: 'pet', steps: ['paw', 'nuzzle', 'meow'] },
  happyStretch: { action: 'pet', steps: ['stretch', 'purr', 'paw'] },
  biscuitTime: { action: 'pet', steps: ['headTilt', 'knead', 'purr'] },
  fluffyThanks: { action: 'pet', steps: ['shake', 'paw', 'nuzzle'] },
  zoomies: { action: 'play', steps: ['walk', 'run', 'pounce'] },
  doubleBounce: { action: 'play', steps: ['doubleHop', 'paw'] },
  stalkAndPounce: { action: 'play', steps: ['prowl', 'pounce', 'meow'] },
  wiggleDance: { action: 'play', steps: ['wiggle', 'doubleHop', 'purr'] },
  curiousExplorer: { action: 'play', steps: ['sniff', 'prowl', 'peek', 'pounce'] },
  tailDetective: { action: 'play', steps: ['peek', 'tailChase', 'headTilt'] },
} as const satisfies Record<string, { action: CatAction; steps: readonly CatMode[] }>
export type CatRoutineId = keyof typeof catRoutines
export interface CatRoutineDeck { remaining: CatRoutineId[]; previous: CatRoutineId | null }

function shuffle(routines: CatRoutineId[], random: () => number) {
  for (let i = routines.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[routines[i], routines[j]] = [routines[j], routines[i]]
  }
  return routines
}

// Each action visits every routine before reshuffling. Preserve the familiar
// first reaction, then vary subsequent clicks without repeating across bag boundaries.
export function nextCatRoutine(action: CatAction, deck: CatRoutineDeck, random = Math.random) {
  const options = (Object.keys(catRoutines) as CatRoutineId[]).filter((id) => catRoutines[id].action === action)
  let remaining = [...deck.remaining]
  if (!remaining.length) {
    remaining = deck.previous === null ? [options[0], ...shuffle(options.slice(1), random)] : shuffle(options, random)
    if (remaining[0] === deck.previous) [remaining[0], remaining[1]] = [remaining[1], remaining[0]]
  }
  const routine = remaining.shift()!
  return { routine, deck: { remaining, previous: routine } }
}

const autonomousBehaviors: { mode: CatMode; weight: number }[] = [
  { mode: 'groom', weight: 25 }, { mode: 'groomPaw', weight: 18 },
  { mode: 'scratch', weight: 12 }, { mode: 'stretch', weight: 18 },
  { mode: 'attentive', weight: 9 }, { mode: 'walk', weight: 12 },
  { mode: 'sniff', weight: 10 }, { mode: 'headTilt', weight: 8 },
  { mode: 'knead', weight: 8 }, { mode: 'shake', weight: 6 },
  { mode: 'peek', weight: 8 }, { mode: 'tailChase', weight: 4 },
  { mode: 'lieDown', weight: 6 },
]

// Randomness stays outside the reducer. Exclude the last choice to avoid repetitive loops.
export function planCatBehavior(previous: CatMode | null, random = Math.random) {
  const delay = 5000 + random() * 4000
  const choices = autonomousBehaviors.filter(({ mode }) => mode !== previous)
  const total = choices.reduce((sum, { weight }) => sum + weight, 0)
  let choice = random() * total
  const selected = choices.find(({ weight }) => { choice -= weight; return choice < 0 }) ?? choices[choices.length - 1]
  return { delay, mode: selected.mode }
}

// Connect the actual end pose of one clip to the entry pose of the next.
// Wake reverses the actual lying-down frames into a seated pose. The artist's
// stretching sheet begins and ends standing; grooming requires a sitting bridge.
function catPosture(mode: CatMode, end = false): CatPosture {
  const animation = catAnimations[mode]
  return (end ? animation.endsIn : undefined) ?? animation.posture ?? 'standing'
}
export const catBridges = new Set<CatMode>(['sitDown', 'standUp', 'lieDown', 'wake', 'stretch'])
export function connectCatSteps(from: CatMode, requested: readonly CatMode[]): CatMode[] {
  let posture = catPosture(from, true)
  const steps: CatMode[] = []
  for (const mode of requested) {
    const destination = catPosture(mode)
    while (posture !== destination) {
      const bridge = posture === 'lying' ? 'wake'
        : posture === 'standing' ? 'sitDown'
          : destination === 'standing' ? 'standUp' : 'lieDown'
      steps.push(bridge)
      posture = catPosture(bridge, true)
    }
    steps.push(mode)
    posture = catPosture(mode, true)
  }
  return steps
}

export function autonomousCatSteps(mode: CatMode): readonly CatMode[] {
  if (mode === 'lieDown') return ['lieDown', 'sleep']
  if (mode === 'walk') return ['walk', 'sniff', 'peek', 'idle']
  if (mode === 'groom') return ['groom', 'groomPaw', 'idle']
  if (mode === 'knead') return ['knead', 'purr', 'idle']
  if (mode === 'tailChase') return ['peek', 'tailChase', 'headTilt', 'idle']
  return [mode, 'idle']
}
