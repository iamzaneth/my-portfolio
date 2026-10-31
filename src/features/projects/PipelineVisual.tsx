import { useId, useRef, useState, type CSSProperties } from 'react'
import { Activity, ArrowRight, Database, Radio, Server, Workflow } from 'lucide-react'
import type { Project } from '@/types/portfolio'
import { useActivity } from '@/hooks/useActivity'
import { useCompanion } from '@/features/mascot/companionContext'

const icons = { source: Radio, stream: Workflow, storage: Database, backend: Server, chart: Activity }

export default function PipelineVisual({ project, initialStageId, onStageChange }: { project: Project; initialStageId?: string; onStageChange?: (id: string) => void }) {
  const stages = project.pipeline ?? []
  const [selected, setSelected] = useState(() => Math.max(0, stages.findIndex(stage => stage.id === initialStageId)))
  const container = useRef<HTMLDivElement>(null)
  const running = useActivity(container)
  const { discover } = useCompanion()
  const id = useId()
  const stage = stages[selected]
  if (!stage) return null

  return <div ref={container} className="pipeline-art" data-running={running}>
    <div className="pipeline-top"><span><span className="pipeline-logo" aria-hidden="true">{project.title[0]}</span> {project.title}</span><span className="diagram-label">Interactive architecture</span></div>
    <div className="pipeline-title"><strong>{project.visualTitle ?? 'A closer look at the system.'}</strong><p>Select a stage to look under the hood.</p></div>
    <div className="pipeline-route" tabIndex={stages.length > 5 ? 0 : undefined} role={stages.length > 5 ? 'region' : undefined} aria-label={stages.length > 5 ? `${project.title} scrollable architecture` : undefined}>
    <div className="pipeline-stages" style={{ '--stage-count': stages.length } as CSSProperties} role="group" aria-label={`${project.title} architecture stages`}>
      {stages.length > 1 && <div className="pipeline-track" aria-hidden="true"><div className="pipeline-progress" /><i className="event-packet" /><i className="event-packet packet-two" /></div>}
      {stages.map((item, index) => {
        const Icon = icons[item.icon]
        return <button type="button" className="pipeline-stage" key={item.id} aria-pressed={selected === index}
          aria-controls={`${id}-detail`}
          onClick={() => { setSelected(index); onStageChange?.(item.id); discover(item.companion ?? `Exploring ${project.title}, one connection at a time.`) }}>
          <span className="stage-icon"><Icon size={22} strokeWidth={1.5} aria-hidden="true" /></span>
          <span className="sr-only">Inspect </span><b>{item.name}</b>{' '}<span className="stage-detail">{item.detail}</span>
        </button>
      })}
    </div>
    </div>
    <div className="pipeline-inspector" id={`${id}-detail`}>
      <div className="inspector-index"><span>{String(selected + 1).padStart(2, '0')} / {String(stages.length).padStart(2, '0')}</span><span className="inspector-dots" aria-hidden="true">{stages.map((item, index) => <i key={item.id} data-selected={index === selected} />)}</span></div>
      <div aria-live="polite" aria-atomic="true"><div className="stage-narrative" key={stage.id}>
        <h4>{stage.name}<span>{stage.detail}</span></h4>
        <p>{stage.description}</p>
        <span className="stage-output"><ArrowRight size={14} aria-hidden="true" />{stage.output}</span>
      </div></div>
    </div>
    <div className="pipeline-bottom"><span className="status-dot" aria-hidden="true" />{project.visualNote ?? 'Illustrated architecture · not live data'}</div>
  </div>
}
