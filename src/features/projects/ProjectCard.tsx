import { useId } from 'react'
import { ArrowUpRight, Sparkle } from 'lucide-react'
import type { Project } from '@/types/portfolio'
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
  const technologies = project.technologies ?? []

  return <article className={`project-card${project.featured ? ' project-featured' : ''}`} id={project.slug} aria-labelledby={titleId}>
    <header className="project-header">
      <div className="project-meta"><span>{project.category}</span>
        {project.featured && <span className="featured-label"><Sparkle size={12} aria-hidden="true" /> Featured</span>}
      </div>
      <h3 id={titleId}>{project.title}</h3>
      <p className="project-summary">{project.summary}</p>
    </header>
    <ProjectVisual project={project} number={number} compact />
    {technologies.length > 0 && <ul className="tech-list open-tech-list project-card-stack" aria-label="Selected technologies">
      {technologies.slice(0, 3).map(technology => <li key={technology}>{technology}</li>)}
      {technologies.length > 3 && <li><span aria-label={`${technologies.length - 3} more technologies in project details`}>+{technologies.length - 3}</span></li>}
    </ul>}
    <div className="project-actions">
      {hasProjectDetails(project) && <button type="button" className="project-details-button" aria-haspopup="dialog" aria-label={`View details: ${project.title}`} onClick={event => onDetails(project, event.currentTarget)}>
        View details<ArrowUpRight size={15} aria-hidden="true" />
      </button>}
      <ProjectActions project={project} />
    </div>
  </article>
}
