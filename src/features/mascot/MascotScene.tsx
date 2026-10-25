import { useRef, type CSSProperties } from 'react'
import { Heart, Moon, Play, Sparkles } from 'lucide-react'
import PixelCat from './PixelCat'
import { catAnimations, catRoutines } from './catConfig'
import { useCatController } from './useCatController'
import { useCatMotion } from './useCatMotion'

// Keep most stars around the edges so the cat has a quiet silhouette.
const skyStars = [
  [12, 12], [26, 8], [42, 13], [63, 7], [79, 13], [90, 24],
  [6, 29], [18, 24], [32, 19], [56, 21], [72, 26], [84, 33],
  [10, 43], [22, 38], [77, 43], [94, 47], [5, 59], [16, 54],
  [26, 49], [83, 57], [90, 65], [12, 71], [23, 65], [74, 67],
  [80, 78], [94, 81], [7, 85], [19, 88], [31, 77], [65, 84],
  [38, 5], [87, 8], [4, 17], [96, 35], [45, 89], [57, 78],
]

export default function MascotScene() {
  const { mode, expression, origin, routine, version, dispatch, scene, running, reducedMotion, visible, pageVisible } = useCatController()
  const character = useRef<HTMLSpanElement>(null)
  const facing = useRef<HTMLSpanElement>(null)
  const shadow = useRef<HTMLDivElement>(null)
  const animation = catAnimations[mode]

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
    <div className="scene-coordinate scene-tag">COMPANION_01 <span>✳</span></div>
    <div className="scene-coordinate scene-coordinate-right scene-tag">32 × 32 PX<br /><span>INFINITELY CURIOUS</span></div>
    <div className="scene-orbit-clip" aria-hidden="true"><div className="scene-orbit"><i /><i /><i /></div></div>
    <div className="pixel-stars" aria-hidden="true"><i className="star star-one">✦</i><i className="star star-two">+</i><i className="star star-three">✦</i><i className="pixel pixel-one" /><i className="pixel pixel-two" /><i className="pixel pixel-three" /><i className="pixel pixel-four" /><i className="pixel pixel-five" /></div>
    <div className="cat-bubble" aria-live={origin === 'user' ? 'polite' : 'off'}>{catAnimations[expression].message}</div>
    <div className="cat-stage">
      <div ref={shadow} className="cat-shadow" aria-hidden="true" />
      <button type="button" className="cat-interaction" aria-label="Pet the pixel cat" onClick={() => dispatch({ type: 'pet' })} onPointerEnter={() => dispatch({ type: 'approach' })} onPointerLeave={() => dispatch({ type: 'leave' })} onFocus={() => dispatch({ type: 'approach' })} onBlur={() => dispatch({ type: 'leave' })}>
        <span ref={character} className="cat-character"><span ref={facing} className="cat-facing"><PixelCat mode={mode} running={running} version={version} /></span></span>
        {mode === 'sleep' && <span className="cat-zzz" aria-hidden="true">z<span>z</span>Z</span>}
        {(action === 'pet' || mode === 'jump' || mode === 'meow') && <span key={routine ?? mode} className="cat-heart" aria-hidden="true">♡</span>}
      </button>
      <div className="cat-floor" aria-hidden="true"><i /><i /><i /></div>
    </div>
    <div className="scene-caption scene-note"><span className="status-dot" /> {animation.label}<span className="caption-id">/ curiosity online</span></div>
    <div className="cat-controls scene-note absolute top-[437px] flex w-full justify-center gap-1.5 max-tablet:top-[403px]
      max-md:top-[350px]" role="group" aria-label="Pixel cat interactions">
      <button type="button" className="flex min-h-11 items-center gap-[7px] rounded border border-line bg-surface px-[13px] py-0 font-mono
        text-[11px] text-muted transition-[background,color,border-color] duration-200 ease-[ease]
        hover:border-[#86739d] hover:bg-surface-accent hover:text-[#d2bfff] aria-pressed:border-[#86739d]
        aria-pressed:bg-surface-accent aria-pressed:text-[#d2bfff] max-md:px-[15px]" onClick={() => dispatch({ type: 'pet' })}><Heart size={13} /> Pet</button>
      <button type="button" className="flex min-h-11 items-center gap-[7px] rounded border border-line bg-surface px-[13px] py-0 font-mono
        text-[11px] text-muted transition-[background,color,border-color] duration-200 ease-[ease]
        hover:border-[#86739d] hover:bg-surface-accent hover:text-[#d2bfff] aria-pressed:border-[#86739d]
        aria-pressed:bg-surface-accent aria-pressed:text-[#d2bfff] max-md:px-[15px]" onClick={() => dispatch({ type: 'play' })}><Play size={13} /> Play</button>
      <button type="button" className="flex min-h-11 items-center gap-[7px] rounded border border-line bg-surface px-[13px] py-0 font-mono
        text-[11px] text-muted transition-[background,color,border-color] duration-200 ease-[ease]
        hover:border-[#86739d] hover:bg-surface-accent hover:text-[#d2bfff] aria-pressed:border-[#86739d]
        aria-pressed:bg-surface-accent aria-pressed:text-[#d2bfff] max-md:px-[15px]" onClick={() => dispatch({ type: 'nap' })} aria-pressed={resting}>{resting ? <Sparkles size={13} /> : <Moon size={13} />}{resting ? 'Wake' : 'Nap'}</button>
    </div>
    <span className="cat-hint scene-note">A tiny companion. Go on, say hello.</span>
  </div>
}
