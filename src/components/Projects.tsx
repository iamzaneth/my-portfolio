import { useState } from 'react'
import { ArrowUpRight, FolderOpen } from 'lucide-react'
import { projects } from '@/data/projects'
import { profile } from '@/data/profile'
import ProjectCard from '@/features/projects/ProjectCard'
import SectionHeading from './SectionHeading'

export default function Projects() {
  const [category, setCategory] = useState('All')
  const categories = [...new Set(projects.map((project) => project.category))]
  const filtered = projects.filter((project) => category === 'All' || project.category === category)
  return (
    <section id="projects" className="section container projects-section">
      <SectionHeading number="03" label="SELECTED WORK" aside="Learning by building. A closer look at the systems I’m bringing to life.">Less theory.<br /><span className="text-muted">More building.</span></SectionHeading>
      {categories.length > 1 && <div className="project-filters" role="group" aria-label="Filter projects by category">{['All', ...categories].map((item) => <button type="button" key={item} aria-pressed={item === category} onClick={() => setCategory(item)}>{item}</button>)}</div>}
      <div className="projects-list" aria-live="polite">{filtered.length ? filtered.map((project, index) => <ProjectCard key={project.id} project={project} number={index + 1} />) : <p className="empty-state"><FolderOpen size={25} /> No projects in this category yet.</p>}</div>
      <a href={profile.github} target="_blank" rel="noreferrer" className="github-more" data-reveal><span>There’s more in the making.</span> Follow the commits on GitHub <ArrowUpRight size={16} /></a>
    </section>
  )
}
