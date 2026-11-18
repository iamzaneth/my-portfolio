import { useId, useLayoutEffect, useRef, type KeyboardEvent, type MouseEvent } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { skills } from '@/data/skills'
import { useMotionPreference } from '@/hooks/useMotionPreference'
import { skillIcons } from './skillIcons'
import SkillDisclosure from './SkillDisclosure'

type Skill = (typeof skills)[number]
export default function SkillDetailsModal({ skill, trigger, onDismiss }: { skill: Skill; trigger: HTMLButtonElement; onDismiss: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const closing = useRef(false)
  const reduced = useMotionPreference(), title = useId(), description = useId()
  const Icon = skillIcons[skill.icon]

  useLayoutEffect(() => {
    const element = dialog.current!, body = document.body, previous = body.style.cssText
    const position = { x: scrollX, y: scrollY }, gutter = innerWidth - document.documentElement.clientWidth
    Object.assign(body.style, { position: 'fixed', top: `${-position.y}px`, left: `${-position.x}px`, width: '100%', overflow: 'hidden', paddingRight: `${(parseFloat(getComputedStyle(body).paddingRight) || 0) + gutter}px` })
    element.showModal()
    return () => {
      clearTimeout(timer.current)
      if (element.open) element.close()
      body.style.cssText = previous
      window.scrollTo({ left: position.x, top: position.y, behavior: 'instant' })
      if (trigger.isConnected) trigger.focus({ preventScroll: true })
    }
  }, [trigger])

  function close() {
    if (!dialog.current?.open || closing.current) return
    closing.current = true
    if (reduced) { dialog.current.close(); return }
    dialog.current.dataset.closing = 'true'
    timer.current = setTimeout(() => dialog.current?.close(), 220)
  }
  function backdrop(event: MouseEvent<HTMLDialogElement>) {
    if (event.target !== event.currentTarget) return
    const r = event.currentTarget.getBoundingClientRect()
    if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) close()
  }
  function focus(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== 'Tab') return
    const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button:not([disabled]), summary, a[href], [tabindex="0"]')).filter(el => el.getClientRects().length > 0)
    const first = controls[0], last = controls.at(-1)
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
  }
  return createPortal(<dialog ref={dialog} className="skill-dialog" aria-labelledby={title} aria-describedby={description} onKeyDown={focus} onClick={backdrop} onCancel={event => { event.preventDefault(); close() }} onClose={event => { if (!event.currentTarget.open) onDismiss() }}>
    <div className="skill-dialog-toolbar"><span>TOOLKIT / DISCIPLINE {skill.number}</span><button type="button" autoFocus onClick={close} aria-label="Close toolkit details">Close <X size={18} aria-hidden="true" /></button></div>
    <div className="skill-dialog-body" tabIndex={0} role="region" aria-label={`${skill.title} details`}>
      <div className="skill-dialog-identity"><span className="capability-icon"><Icon size={30} strokeWidth={1.4} aria-hidden="true" /></span><span>{skill.focus === 'core' ? 'Core focus' : 'Supporting discipline'}</span></div>
      <h2 id={title}>{skill.title}</h2><p id={description} className="skill-description">{skill.description}</p>
      <SkillDisclosure title={skill.title} practice={skill.practice}>
        <h3>Connected technologies</h3><ul className="skill-technologies">{skill.technologies.map(technology => <li key={technology}>{technology}</li>)}</ul>
      </SkillDisclosure>
    </div>
  </dialog>, document.body)
}
