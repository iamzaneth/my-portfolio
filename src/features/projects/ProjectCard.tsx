import { ArrowUpRight, Check, Github } from 'lucide-react'
import type { Project } from '@/types/portfolio'
import PipelineVisual from './PipelineVisual'

export default function ProjectCard({ project, number }: { project: Project; number: number }) {
  return <article className={`project-card ${project.featured ? 'project-featured' : ''}`} id={project.slug}>
    {(project.visualization || project.image) && <div className="project-visual">{project.visualization === 'pipeline' ? <PipelineVisual /> : project.image && <img src={project.image.src} alt={project.image.alt} loading="lazy" width="960" height="600" />}</div>}
    <div className="project-content" data-reveal>
      <div className="project-meta"><span className="mono">{String(number).padStart(2, '0')} / {project.category}</span>{project.featured && <span className="featured-label"><span /> FEATURED</span>}{project.status && <span>{project.status}</span>}</div>
      <h3>{project.title}<span>↗</span></h3>
      <p className="project-summary">{project.summary}</p>
      <p className="project-description">{project.description}</p>
      {project.highlights && <ul className="project-highlights">{project.highlights.map((highlight) => <li key={highlight}><Check size={14} />{highlight}</li>)}</ul>}
      <ul className="tech-list">{project.technologies.map((technology) => <li key={technology}>{technology}</li>)}</ul>
      <div className="project-actions">
        {project.githubUrl && <a className="button button-secondary" href={project.githubUrl} target="_blank" rel="noreferrer"><Github size={16} /> Source code <ArrowUpRight size={15} /></a>}
        {project.demoUrl ? <a className="text-link" href={project.demoUrl} target="_blank" rel="noreferrer">Live demo <ArrowUpRight size={16} /></a> : project.detailsUrl && <a className="text-link" href={project.detailsUrl} target="_blank" rel="noreferrer">Read the story <ArrowUpRight size={16} /></a>}
      </div>
    </div>
  </article>
}
