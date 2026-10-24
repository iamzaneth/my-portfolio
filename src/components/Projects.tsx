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
    <section id="projects" className="section-space page-container projects-section">
      <SectionHeading number="03" label="SELECTED WORK" aside="Learning by building. A closer look at the systems I’m bringing to life.">Less theory.<br /><span className="text-faint">More building.</span></SectionHeading>
      {categories.length > 1 && <div className="project-filters mb-[30px] flex flex-wrap gap-2 [&>button]:rounded [&>button]:border
        [&>button]:border-line [&>button]:bg-surface [&>button]:px-[15px] [&>button]:py-[13px]
        [&>button]:text-[14px] [&>button]:text-muted [&>button[aria-pressed=true]]:border-accent
        [&>button[aria-pressed=true]]:bg-surface-accent [&>button[aria-pressed=true]]:text-accent" role="group" aria-label="Filter projects by category">{['All', ...categories].map((item) => <button type="button" key={item} aria-pressed={item === category} onClick={() => setCategory(item)}>{item}</button>)}</div>}
      <div className="projects-list grid gap-9" aria-live="polite">{filtered.length ? filtered.map((project, index) => <ProjectCard key={project.id} project={project} number={index + 1} />) : <p className="empty-state flex items-center gap-[15px] border border-line p-[35px] text-muted"><FolderOpen size={25} /> No projects in this category yet.</p>}</div>
      <a href={profile.github} target="_blank" rel="noreferrer" className="github-more mt-5 flex min-h-11 items-center justify-end gap-[9px] text-[12px] hover:text-accent
        max-md:mt-4 max-md:flex-wrap max-md:justify-start [&>span]:mr-1 [&>span]:text-faint
        max-md:[&>span]:basis-full [&>svg]:text-accent" data-reveal><span>There’s more in the making.</span> Follow the commits on GitHub <ArrowUpRight size={16} /></a>
    </section>
  )
}
