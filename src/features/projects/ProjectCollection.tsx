import { useCallback, useLayoutEffect, useState } from 'react'
import { FolderOpen } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Project } from '@/types/portfolio'
import ProjectCard from './ProjectCard'
import ProjectDetailsModal from './ProjectDetailsModal'

gsap.registerPlugin(ScrollTrigger)

export default function ProjectCollection({ projects }: { projects: readonly Project[] }) {
  const [category, setCategory] = useState('All')
  const [opened, setOpened] = useState<{ project: Project; trigger: HTMLButtonElement } | null>(null)
  const [inspectedStages, setInspectedStages] = useState<Record<string, string>>({})
  const dismiss = useCallback(() => setOpened(null), [])
  const featured = projects.filter(project => project.featured)
  const standard = projects.filter(project => !project.featured)
  const ordered = [...featured, ...standard]
  const categories = [...new Set(ordered.map(project => project.category))]
  const activeCategory = category === 'All' || categories.includes(category as Project['category']) ? category : 'All'
  const showFilters = projects.length > 1 && categories.length > 1
  const matches = (project: Project) => activeCategory === 'All' || activeCategory === project.category
  const count = ordered.filter(matches).length

  useLayoutEffect(() => {
    // Filtering preserves card identity and only remeasures the page.
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => cancelAnimationFrame(frame)
  }, [activeCategory, projects.length])

  return <div className="project-collection" data-count={projects.length}>
    {showFilters && <div className="project-collection-bar">
      <div className="project-filters" role="group" aria-label="Filter projects by category">
        {['All', ...categories].map(item => <button type="button" key={item} aria-pressed={item === activeCategory} onClick={() => setCategory(item)}>{item}</button>)}
      </div>
      <p className="project-results" aria-live="polite" aria-atomic="true">{count} of {projects.length} projects</p>
    </div>}
    <div className="projects-grid">
      {ordered.map((project, index) => <div key={project.id} className="project-cell" hidden={!matches(project)}>
        <ProjectCard project={project} number={index + 1} onDetails={(project, trigger) => setOpened({ project, trigger })} />
      </div>)}
    </div>
    {count === 0 && <p className="empty-state"><FolderOpen size={23} aria-hidden="true" />{projects.length ? 'No projects in this category yet.' : 'Projects are being prepared.'}</p>}
    {opened && <ProjectDetailsModal key={opened.project.id} project={opened.project}
      number={ordered.findIndex(project => project.id === opened.project.id) + 1}
      trigger={opened.trigger} onDismiss={dismiss}
      initialStageId={inspectedStages[opened.project.id]}
      onStageChange={stage => setInspectedStages(current => ({ ...current, [opened.project.id]: stage }))} />}
  </div>
}
