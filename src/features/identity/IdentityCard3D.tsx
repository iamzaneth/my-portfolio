import { useId, useRef, useState, type PointerEvent } from 'react'
import { RotateCw, Sparkles } from 'lucide-react'
import { profile } from '@/data/profile'
import { useMotionPreference } from '@/hooks/useMotionPreference'
import { shellCorners, straightEdges, wellCorners } from './identityGeometry'
import './identity-card.css'

const fields = [
  ['Name', profile.name],
  ['Alias', profile.alias],
  ['Location', profile.location],
  ['Focus', profile.focus],
  ['Approach', profile.approach],
  ['Exploring', profile.exploring],
]

export default function IdentityCard3D() {
  const [flipped, setFlipped] = useState(false)
  const reducedMotion = useMotionPreference()
  const tilt = useRef<HTMLDivElement>(null)
  const id = useId()

  function point(event: PointerEvent<HTMLButtonElement>) {
    if (reducedMotion || event.pointerType !== 'mouse' || !matchMedia('(hover: hover) and (pointer: fine)').matches) return
    // Measure the stable hit area, never the moving solid. No React updates per move.
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1))
    const y = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1))
    tilt.current?.style.setProperty('--pointer-x', `${-y * 2}deg`)
    tilt.current?.style.setProperty('--pointer-y', `${x * 3}deg`)
  }

  function resetTilt() {
    tilt.current?.style.removeProperty('--pointer-x')
    tilt.current?.style.removeProperty('--pointer-y')
  }

  return (
    <div className="identity-stage" data-face={flipped ? 'back' : 'front'}>
      <div className="identity-aura" aria-hidden="true" />
      <div className="identity-shadow" aria-hidden="true" />
      <div className="identity-float">
        <div className="identity-scene">
          <div className="identity-tilt" ref={tilt}>
            <div className="identity-body" data-flipped={flipped}>
              <div className="identity-shell identity-shell-front" aria-hidden="true" />
              <div className="identity-shell identity-shell-back" aria-hidden="true" />
              <div className="identity-face identity-front" id={`${id}-front`} aria-hidden={flipped} inert={flipped}>
                <div className="identity-header"><span>{profile.alias.toUpperCase()}<span className="identity-header-dot">.</span></span><span className="identity-developer">DEVELOPER</span></div>
                <div className="identity-portrait">
                  <img src="/avatar-portrait.webp" width="720" height="964" loading="lazy" alt={`Portrait of ${profile.name}`} />
                </div>
                <div className="identity-name"><h3>{profile.name}</h3><p>{profile.focus}</p></div>
              </div>
              <div className="identity-face identity-back" id={`${id}-back`} aria-hidden={!flipped} inert={!flipped}>
                <div className="identity-header"><span>{profile.alias.toUpperCase()}<span className="identity-header-dot">.</span></span><Sparkles size={16} aria-hidden="true" /></div>
                <dl className="identity-fields">{fields.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
              </div>
              {straightEdges.map(edge => (
                <div key={edge} className={`identity-edge identity-edge-${edge}`} data-edge={edge} aria-hidden="true" />
              ))}
              {shellCorners.map(({ name, style }) => <div key={name} className="identity-edge identity-edge-corner" data-edge={name} style={style} aria-hidden="true" />)}
              {/* Recess walls join each printed face to the protective lip. */}
              {(['front', 'back'] as const).map(side => <div key={side} className={`identity-well-group identity-well-${side}`} aria-hidden="true">
                {straightEdges.map(edge => <div key={edge} className={`identity-well identity-well-${edge}`} />)}
                {wellCorners.map(({ name, style }) => <div key={name} className="identity-well identity-well-corner" style={style} />)}
              </div>)}
            </div>
          </div>
        </div>
      </div>
      {/* A stable, transparent native button covers the card and its single hint.
          Face content stays semantic sibling content, outside button semantics. */}
      <button className="identity-flip" type="button" aria-label="Flip card: Zaneth identity" aria-pressed={flipped}
        aria-describedby={`${id}-state`} aria-controls={`${id}-front ${id}-back`}
        onClick={() => setFlipped(current => !current)} onPointerMove={point} onPointerLeave={resetTilt} onBlur={resetTilt}>
        <span className="identity-hint"><RotateCw size={14} aria-hidden="true" /><span>Flip card</span></span>
      </button>
      <span className="sr-only" id={`${id}-state`} role="status">{flipped ? 'Back: personal and technical details.' : 'Front: portrait and identity.'}</span>
    </div>
  )
}
