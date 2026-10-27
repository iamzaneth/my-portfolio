import { useId, useLayoutEffect, useRef, type MouseEvent } from 'react'
import { createPortal } from 'react-dom'
import { ArrowUpRight, Check, X } from 'lucide-react'
import type { Project } from '@/types/portfolio'
import { useMotionPreference } from '@/hooks/useMotionPreference'
import ProjectActions from './ProjectActions'
import ProjectVisual from './ProjectVisual'
import { externalUrl } from './projectContent'

interface ProjectDetailsModalProps {
  project: Project
  number: number
  trigger: HTMLButtonElement
  onDismiss: () => void
  initialStageId?: string
  onStageChange: (id: string) => void
}

export default function ProjectDetailsModal({ project, number, trigger, onDismiss, initialStageId, onStageChange }: ProjectDetailsModalProps) {
  const dialog = useRef<HTMLDialogElement>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const closing = useRef(false)
  const reducedMotion = useMotionPreference()
  const titleId = useId()
  const summaryId = useId()
  const documentation = externalUrl(project.detailsUrl)
  const hasVisual = Boolean((project.visualization === 'pipeline' && project.pipeline?.length) || project.image?.src)

  useLayoutEffect(() => {
    const element = dialog.current!
    const body = document.body
    const scroll = { x: window.scrollX, y: window.scrollY }
    const previousBodyStyle = body.style.cssText
    const gutter = innerWidth - document.documentElement.clientWidth
    const padding = parseFloat(getComputedStyle(body).paddingRight) || 0
    // Fixed positioning also locks background scrolling on mobile browsers.
    Object.assign(body.style, {
      position: 'fixed', top: `${-scroll.y}px`, left: `${-scroll.x}px`,
      width: '100%', overflow: 'hidden', paddingRight: `${padding + gutter}px`,
    })
    element.showModal()
    return () => {
      clearTimeout(closeTimer.current)
      if (element.open) element.close()
      body.style.cssText = previousBodyStyle
      window.scrollTo({ left: scroll.x, top: scroll.y, behavior: 'instant' })
      if (trigger.isConnected) trigger.focus({ preventScroll: true })
    }
  }, [trigger])

  useLayoutEffect(() => {
    if (reducedMotion && closing.current) dialog.current?.close()
  }, [reducedMotion])

  function requestClose() {
    const element = dialog.current
    if (!element?.open || closing.current) return
    closing.current = true
    if (reducedMotion) { element.close(); return }
    element.dataset.closing = 'true'
    // Animationend closes normally; this also handles interrupted animations.
    closeTimer.current = setTimeout(() => element.close(), 230)
  }

  function backdropClick(event: MouseEvent<HTMLDialogElement>) {
    if (event.target !== event.currentTarget) return
    const bounds = event.currentTarget.getBoundingClientRect()
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) requestClose()
  }

  return createPortal(<dialog className="project-dialog" ref={dialog} aria-labelledby={titleId} aria-describedby={summaryId}
    onCancel={event => { event.preventDefault(); requestClose() }}
    onClose={event => { if (!event.currentTarget.open) onDismiss() }} onClick={backdropClick}
    onAnimationEnd={event => { if (event.target === event.currentTarget && event.animationName === 'project-dialog-exit') event.currentTarget.close() }}>
    <div className="project-dialog-toolbar">
      <span><i className="dialog-pixel" aria-hidden="true" /> Project details <span className="dialog-number">/ {String(number).padStart(2, '0')}</span></span>
      <button type="button" className="project-dialog-close" autoFocus onClick={requestClose} aria-label="Close project details"><span>Close</span><X size={20} aria-hidden="true" /></button>
    </div>
    <div className="project-dialog-body">
      <header className="project-case-header">
        <div className="project-meta"><span>{project.category}</span>{project.status && <span>{project.status}</span>}</div>
        <h2 id={titleId}>{project.title}</h2>
        <p id={summaryId} className="project-case-summary">{project.summary}</p>
        {(externalUrl(project.githubUrl) || externalUrl(project.demoUrl)) && <div className="project-actions"><ProjectActions project={project} /></div>}
      </header>
      {project.description && <section className="project-case-section"><h3>Overview</h3><p className="project-description">{project.description}</p></section>}
      {hasVisual && <section className="project-case-section"><h3>{project.visualization === 'pipeline' && project.pipeline?.length ? 'Architecture explorer' : 'Project preview'}</h3>
        <ProjectVisual project={project} number={number} initialStageId={initialStageId} onStageChange={onStageChange} />
      </section>}
      {Boolean(project.story?.length) && <section className="project-case-section"><h3>Design notes</h3>
        <dl className="project-story">{project.story!.map((part, index) => <div key={part.label}>
          <dt><span className="story-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><span>{part.label}</span></dt>
          <dd>{part.text}</dd>
        </div>)}</dl>
      </section>}
      {Boolean(project.highlights?.length) && <section className="project-case-section"><h3>Technical highlights</h3>
        <ul className="project-highlights">{project.highlights!.map(highlight => <li key={highlight}><Check size={16} aria-hidden="true" />{highlight}</li>)}</ul>
      </section>}
      {Boolean(project.technologies?.length) && <section className="project-case-section"><h3>Technology stack</h3>
        <ul className="tech-list open-tech-list" aria-label="Full technology stack">{project.technologies!.map(technology => <li key={technology}>{technology}</li>)}</ul>
      </section>}
      {documentation && <section className="project-case-section"><h3>Resources</h3>
        <a className="text-link" href={documentation} target="_blank" rel="noopener noreferrer">Project documentation <ArrowUpRight size={15} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>
      </section>}
    </div>
  </dialog>, document.body)
}
