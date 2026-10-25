import { useRef } from 'react'
import { Heart, Moon, Play, Sparkles } from 'lucide-react'
import PixelCat from './PixelCat'
import { catAnimations, catRoutines } from './catConfig'
import { useCatController } from './useCatController'
import { useCatMotion } from './useCatMotion'

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
