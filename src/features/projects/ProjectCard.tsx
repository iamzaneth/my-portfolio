import { ArrowUpRight, Check, Github } from 'lucide-react'
import type { Project } from '@/types/portfolio'
import PipelineVisual from './PipelineVisual'

export default function ProjectCard({ project, number }: { project: Project; number: number }) {
  return <article className={`project-card group/project grid grid-cols-[1.15fr_1fr] items-center gap-9 max-desktop:grid-cols-2 max-desktop:gap-6 max-tablet:grid-cols-1 [&:not(:has(.project-visual))]:grid-cols-1 ${project.featured ? 'project-featured' : ''}`} id={project.slug}>
    {(project.visualization || project.image) && <div className="project-visual min-w-0 overflow-hidden rounded-lg border border-line transition-[border-color]
      duration-300 ease-[ease] group-hover/project:border-[#78648f] [&>img]:aspect-[1.3] [&>img]:h-auto
      [&>img]:w-full [&>img]:object-cover">{project.visualization === 'pipeline' ? <PipelineVisual /> : project.image && <img src={project.image.src} alt={project.image.alt} loading="lazy" width="960" height="600" />}</div>}
    <div className="project-content max-tablet:max-w-[600px] [&_h3]:mt-[17px] [&_h3]:mb-2.5 [&_h3]:text-[39px]
      [&_h3]:leading-[1.2] [&_h3]:font-[550] [&_h3]:tracking-[-1.7px] max-md:[&_h3]:text-[37px]
      [&_h3>span]:ml-3 [&_h3>span]:inline-block [&_h3>span]:text-[28px] [&_h3>span]:text-accent
      [&_h3>span]:transition-transform [&_h3>span]:duration-300 [&_h3>span]:ease-[ease]
      group-hover/project:[&_h3>span]:[transform:translate(4px,-4px)] [&_.tech-list]:gap-[5px]
      [&_.tech-list>li]:px-[7px] [&_.tech-list>li]:py-1 [&_.tech-list>li]:text-[10px]" data-reveal>
      <div className="project-meta flex flex-wrap items-center gap-4 text-[11px] text-muted"><span className="font-mono text-cyan">{String(number).padStart(2, '0')} / {project.category}</span>{project.featured && <span className="featured-label flex items-center gap-1.5 rounded-[3px] border border-[#625173] px-2 py-[5px] font-mono
        text-[9px] text-[#c7b0e6] [&>span]:size-[3px] [&>span]:bg-accent"><span /> FEATURED</span>}{project.status && <span>{project.status}</span>}</div>
      <h3>{project.title}<span>↗</span></h3>
      <p className="project-summary mb-4 text-[16px] text-[#d9deea] max-md:text-[15px]">{project.summary}</p>
      <p className="project-description mb-5 text-[15px] leading-[1.9] text-muted max-md:text-[14px]">{project.description}</p>
      {project.highlights && <ul className="project-highlights mb-6 grid list-none gap-2 p-0 [&>li]:flex [&>li]:items-center [&>li]:gap-2
        [&>li]:text-[12px] [&>li]:text-[#aab9cd] [&_svg]:text-cyan">{project.highlights.map((highlight) => <li key={highlight}><Check size={14} />{highlight}</li>)}</ul>}
      <ul className="tech-list m-0 flex list-none flex-wrap gap-[7px] p-0 max-md:gap-1.5 [&>li]:rounded-[3px] [&>li]:border
        [&>li]:border-line [&>li]:bg-surface-raised [&>li]:px-2 [&>li]:py-1.5 [&>li]:font-mono [&>li]:text-[11px]
        [&>li]:leading-[1.45] [&>li]:text-muted max-md:[&>li]:px-[7px] max-md:[&>li]:py-[5px]
        max-md:[&>li]:text-[10px] max-phone:[&>li]:text-[11px]">{project.technologies.map((technology) => <li key={technology}>{technology}</li>)}</ul>
      <div className="project-actions mt-5 flex flex-wrap items-center gap-[23px] max-md:gap-[22px] [&>.button]:min-h-[42px]
        [&>.button]:gap-2 [&>.button]:px-[13px] [&>.button]:text-[12px] max-md:[&>.button]:min-h-11
        [&>.text-link]:text-[12px]">
        {project.githubUrl && <a className="button border-line bg-surface text-foreground hover:border-accent hover:bg-surface-raised" href={project.githubUrl} target="_blank" rel="noreferrer"><Github size={16} /> Source code <ArrowUpRight size={15} /></a>}
        {project.demoUrl ? <a className="text-link" href={project.demoUrl} target="_blank" rel="noreferrer">Live demo <ArrowUpRight size={16} /></a> : project.detailsUrl && <a className="text-link" href={project.detailsUrl} target="_blank" rel="noreferrer">Read the story <ArrowUpRight size={16} /></a>}
      </div>
    </div>
  </article>
}
