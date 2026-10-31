import { useState, type CSSProperties } from 'react'
import type { Project } from '@/types/portfolio'
import PipelineVisual from './PipelineVisual'

interface ProjectVisualProps {
  project: Project
  number: number
  compact?: boolean
  initialStageId?: string
  onStageChange?: (id: string) => void
}

export default function ProjectVisual({ project, number, compact = false, initialStageId, onStageChange }: ProjectVisualProps) {
  const [failedSource, setFailedSource] = useState<string | null>(null)
  if (project.visualization === 'pipeline' && project.pipeline?.length) {
    if (compact) {
      const stages = project.pipeline
      const preview = stages.length > 5 ? [stages[0], stages[1], null, stages.at(-2)!, stages.at(-1)!] : stages
      return <div className="project-visual project-pipeline-preview" data-visual="pipeline-preview" role="img" aria-label={`${project.title} architecture overview: ${stages.map(stage => stage.name).join(' → ')}`}>
        <div className="preview-stages" style={{ '--preview-count': preview.length } as CSSProperties} aria-hidden="true">
          {preview.map((stage, index) => <div className="preview-stage" key={stage?.id ?? 'more'}><span className={`preview-node${index === 0 ? ' preview-source' : ''}`} /><span>{stage?.name ?? '…'}</span></div>)}
        </div>
      </div>
    }
    return <div className="project-visual" data-visual="pipeline"><PipelineVisual project={project} initialStageId={initialStageId} onStageChange={onStageChange} /></div>
  }
  if (project.image?.src && project.image.src !== failedSource) {
    const { src, alt } = project.image
    return <div className="project-visual project-image" data-visual="image"><img src={src} alt={alt} width="960" height="600" loading="lazy" onError={() => setFailedSource(src)} /></div>
  }
  // Original decorative artwork gives image-free projects a deliberate preview.
  // It does not imply an architecture or a result that the data has not supplied.
  return <div className="project-visual project-abstract" data-visual="abstract" aria-hidden="true">
    <svg viewBox="0 0 400 160" fill="none" shapeRendering="crispEdges">
      <path d="M30 108h80V60h90v40h88V44h80" stroke="currentColor" strokeWidth="2" />
      <path d="M42 130h80v-20h60v20h60v-44h80" stroke="currentColor" opacity=".25" />
      {[30, 110, 200, 288, 368].map((x, index) => <rect key={x} x={x - 4} y={[104, 56, 96, 40, 40][index]} width="8" height="8" fill="currentColor" />)}
      <path d="M332 124h12v-12h12v12h12v12h-12v12h-12v-12h-12v-12Z" fill="currentColor" opacity=".25" />
    </svg>
    <span className="project-preview-number">{String(number).padStart(2, '0')}</span>
  </div>
}
