import { useRef, type CSSProperties } from 'react'
import { Heart, Moon, Play, Sparkles } from 'lucide-react'
import PixelCat from './PixelCat'
import { catAnimations, catRoutines } from './catConfig'
import { useCatController } from './useCatController'
import { useCatMotion } from './useCatMotion'
import { useCompanion } from './companionContext'

// Keep stars within the circular celestial dome, framing the cat cleanly.
const skyStars = [
  // Upper celestial arch
  [14, 33], [24, 35], [21, 26], [30, 31], [28, 18], [36, 25],
  [37, 14], [43, 23], [47, 12], [50, 24], [57, 10], [58, 20],
  [66, 15], [64, 26], [74, 21], [70, 29], [81, 28], [73, 36],
  [88, 36], [80, 42],
  // Left flank & mid
  [13, 50], [20, 50], [11, 60], [22, 57], [17, 69], [24, 65],
  [25, 75], [32, 68],
  // Right flank & mid
  [86, 50], [78, 50], [87, 60], [77, 57], [85, 70], [76, 65],
  [77, 77], [68, 68],
  // Lower perimeter
  [26, 80], [33, 84], [67, 84], [74, 80],
  // Deep space twinklers
  [33, 19], [48, 16], [54, 15], [67, 21]
]

export default function MascotScene() {
  const { mode, expression, origin, routine, version, dispatch, scene, running, reducedMotion, visible, pageVisible } = useCatController()
  const character = useRef<HTMLSpanElement>(null)
  const facing = useRef<HTMLSpanElement>(null)
  const shadow = useRef<HTMLDivElement>(null)
  const animation = catAnimations[mode]
  const { discovery } = useCompanion()

  useCatMotion(character, facing, shadow, mode, running, reducedMotion, version)
  const action = routine ? catRoutines[routine].action : 'none'
  const resting = mode === 'sleep' || mode === 'lieDown'

  return <div ref={scene} className="mascot-scene" data-running={running} data-state={mode} data-origin={origin} data-action={action} data-routine={routine ?? 'none'} data-onscreen={visible} data-tab-active={pageVisible} data-reduced-motion={reducedMotion}>
    <div className="scene-sky" aria-hidden="true">
      {skyStars.map(([x, y], index) => <i key={index} className="sky-star" style={{
        left: `${x}%`, top: `${y}%`,
        '--twinkle-delay': `${-index * 1.37}s`,
        '--twinkle-duration': `${4 + index % 5}s`,
      } as CSSProperties} />)}
    </div>
    <div className="scene-header scene-tag"><span className="scene-coordinate">COMPANION_01 <span aria-hidden="true">✳</span></span><span className="scene-coordinate scene-coordinate-right">32 × 32 PX<br /><span>INFINITELY CURIOUS</span></span></div>
    <div className="scene-orbit-clip" aria-hidden="true"><div className="scene-orbit"><i /><i /><i /></div></div>
    <div className="pixel-stars" aria-hidden="true"><i className="star star-one">✦</i><i className="star star-two">+</i><i className="star star-three">✦</i><i className="pixel pixel-one" /><i className="pixel pixel-two" /><i className="pixel pixel-three" /><i className="pixel pixel-four" /><i className="pixel pixel-five" /></div>
    <div className="scene-world">
    <div className="cat-bubble" aria-live={origin === 'user' ? 'polite' : 'off'}>{expression === 'idle' && discovery ? discovery : catAnimations[expression].message}</div>
    <div className="cat-stage">
      <div ref={shadow} className="cat-shadow" aria-hidden="true" />
      <button type="button" className="cat-interaction" aria-label="Pet the pixel cat" onClick={() => dispatch({ type: 'pet' })} onPointerEnter={() => dispatch({ type: 'approach' })} onPointerLeave={() => dispatch({ type: 'leave' })} onFocus={() => dispatch({ type: 'approach' })} onBlur={() => dispatch({ type: 'leave' })}>
        <span ref={character} className="cat-character"><span ref={facing} className="cat-facing"><PixelCat mode={mode} running={running} version={version} /></span></span>
        {mode === 'sleep' && <span className="cat-zzz" aria-hidden="true">z<span>z</span>Z</span>}
        {(action === 'pet' || mode === 'jump' || mode === 'meow') && <span key={routine ?? mode} className="cat-heart" aria-hidden="true">♡</span>}
      </button>
      <div className="cat-floor" aria-hidden="true"><i /><i /><i /></div>
      <svg className="scene-terrain" viewBox="0 0 400 52" preserveAspectRatio="none" fill="none" shapeRendering="crispEdges" aria-hidden="true">
        <path d="M24 8h352v8h-12v8h-28v8H64v-8H36v-8H24V8Z" fill="var(--surface-raised)" />
        <path d="M24 8h352v4H24z" fill="var(--accent)" opacity=".55" />
        <path d="M64 32h272v4H64zM96 36h208v4H96zM140 40h120v4H140z" fill="var(--surface)" />
        <path d="M44 16h20v4H44zM88 24h12v4H88zM312 20h20v4H312zM284 32h12v4H284z" fill="var(--cyan)" opacity=".3" />
        <path d="M58 8V-4h4V8h-4Zm-8-4V0h8v4h-8Zm12-8v-4h8v4h-8Z" fill="var(--cyan)" />
        <path d="M340 8V-8h12V8h-12Z" fill="var(--surface-raised)" />
      </svg>
    </div>
    </div>
    <div className="scene-footer">
    <div className="scene-caption scene-note"><span className="status-dot" /> {animation.label}<span className="caption-id">/ curiosity online</span></div>
    <div className="cat-controls scene-note flex w-full justify-center gap-1.5" role="group" aria-label="Pixel cat interactions">
      <button type="button" className="flex min-h-11 items-center gap-[7px] rounded border border-line bg-surface px-[13px] py-0 font-mono
        text-[12px] text-muted transition-[background,color,border-color] duration-200 ease-[ease]
        hover:border-accent hover:bg-surface-accent hover:text-accent aria-pressed:border-accent
        aria-pressed:bg-surface-accent aria-pressed:text-accent max-md:px-[15px]" onClick={() => dispatch({ type: 'pet' })}><Heart size={13} /> Pet</button>
      <button type="button" className="flex min-h-11 items-center gap-[7px] rounded border border-line bg-surface px-[13px] py-0 font-mono
        text-[12px] text-muted transition-[background,color,border-color] duration-200 ease-[ease]
        hover:border-accent hover:bg-surface-accent hover:text-accent aria-pressed:border-accent
        aria-pressed:bg-surface-accent aria-pressed:text-accent max-md:px-[15px]" onClick={() => dispatch({ type: 'play' })}><Play size={13} /> Play</button>
      <button type="button" className="flex min-h-11 items-center gap-[7px] rounded border border-line bg-surface px-[13px] py-0 font-mono
        text-[12px] text-muted transition-[background,color,border-color] duration-200 ease-[ease]
        hover:border-accent hover:bg-surface-accent hover:text-accent aria-pressed:border-accent
        aria-pressed:bg-surface-accent aria-pressed:text-accent max-md:px-[15px]" onClick={() => dispatch({ type: 'nap' })} aria-pressed={resting}>{resting ? <Sparkles size={13} /> : <Moon size={13} />}{resting ? 'Wake' : 'Nap'}</button>
    </div>
    <span className="cat-hint scene-note">A tiny companion. Go on, say hello.</span>
    </div>
  </div>
}
