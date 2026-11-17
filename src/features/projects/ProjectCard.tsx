import { useId } from 'react'
import { ArrowUpRight, Network, Sparkle } from 'lucide-react'
import type { Project } from '@/types/portfolio'
import { useUniverse } from '@/features/universe/UniverseContext'
import { projectTechnologies, technologyDescription } from '@/features/universe/constellationModel'
import ProjectVisual from './ProjectVisual'
import ProjectActions from './ProjectActions'
import { hasProjectDetails } from './projectContent'

interface ProjectCardProps {
  project: Project
  number: number
  onDetails: (project: Project, trigger: HTMLButtonElement) => void
}

export default function ProjectCard({ project, number, onDetails }: ProjectCardProps) {
  const titleId = useId()
  const technologyDetailsId = useId()
  const { state, inspectTechnology, hoverTechnology } = useUniverse()
  const technologies = projectTechnologies(project)
  const inspected = state.technology?.projectId===project.id?state.technology.name:null
  return <article className={`project-card glass-elevated${project.featured?' project-featured':''}`} id={project.slug} aria-labelledby={titleId} data-highlighted={state.hoveredId===project.id}>
    <div className="project-card-reading" tabIndex={0} role="region" aria-label={`${project.title} system brief`}>
    <div className="system-brief-heading"><span><Network size={13} aria-hidden="true" /> SYSTEM BRIEF</span><span>/{String(number).padStart(2,'0')}</span></div>
    <header className="project-header">
      <div className="project-meta"><span>{project.category}</span>{project.featured&&<span className="featured-label"><Sparkle size={11} aria-hidden="true" />Featured</span>}</div>
      <h3 id={titleId}>{project.title}</h3>
      <p className="project-summary">{project.summary}</p>
    </header>
    <div className="project-stack-heading"><span>CONNECTED TECHNOLOGIES</span><span>{technologies.length.toString().padStart(2,'0')}</span></div>
    <ul className="project-technology-stack" data-long={technologies.length>8} tabIndex={technologies.length>8?0:undefined} aria-label={`${project.title} technology connections`}>{technologies.map(technology=><li key={technology}><button type="button" aria-pressed={inspected===technology} aria-controls={technologyDetailsId} aria-label={`Highlight ${technology} in ${project.title}`}
      onClick={()=>inspectTechnology({projectId:project.id,name:technology})} onPointerEnter={event=>{if(event.pointerType==='mouse')hoverTechnology({projectId:project.id,name:technology})}} onPointerLeave={()=>hoverTechnology(null)} onFocus={()=>hoverTechnology({projectId:project.id,name:technology})} onBlur={()=>hoverTechnology(null)}><i aria-hidden="true" />{technology}</button></li>)}</ul>
    <p className="technology-inspector" id={technologyDetailsId} aria-live="polite">{inspected?technologyDescription(project,inspected):technologies.length?'Select a technology to trace its connection.':'Explore the case study for technical details.'}</p>
    <ProjectVisual project={project} number={number} compact />
    </div>
    <div className="project-actions">
      {hasProjectDetails(project)&&<button type="button" className="project-details-button" aria-haspopup="dialog" aria-label={`View details: ${project.title}`} onClick={event=>onDetails(project,event.currentTarget)}>Open mission control<ArrowUpRight size={15} aria-hidden="true" /></button>}
      <ProjectActions project={project} />
    </div>
  </article>
}
