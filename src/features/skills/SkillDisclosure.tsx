import { useId, useRef, useState, type ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'

/** Swap content inside the existing card footprint; never expand the grid. */
export default function SkillDisclosure({ title, practice, children }: { title: string; practice: string; children: ReactNode }) {
  const [expanded, setExpanded] = useState(false)
  const trigger = useRef<HTMLButtonElement>(null)
  const id = useId()
  return <>
    <div className="skill-practice">
      <button ref={trigger} type="button" className="skill-practice-toggle" aria-expanded={expanded} aria-controls={id} onClick={() => setExpanded(!expanded)}>
        {expanded ? 'Back to overview' : 'In practice'}<span className="sr-only">: {title}</span><ChevronDown size={16} aria-hidden="true" />
      </button>
    </div>
    <div className="skill-explanation" data-expanded={expanded}>
      <div className="skill-overview" aria-hidden={expanded} inert={expanded}>{children}</div>
      <div className="skill-practice-body" id={id} role="region" aria-label={`${title}: in practice`} aria-hidden={!expanded} inert={!expanded} tabIndex={expanded ? 0 : -1}
        onKeyDown={event => { if (event.key === 'Escape') { setExpanded(false); trigger.current?.focus({ preventScroll: true }) } }}>
        <p>{practice}</p>
      </div>
    </div>

  </>
}
