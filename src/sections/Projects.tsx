import { ArrowUpRight } from 'lucide-react'
import { projects } from '@/data/projects'
import { profile } from '@/data/profile'
import ProjectCollection from '@/features/projects/ProjectCollection'
import SectionHeading from '@/components/SectionHeading'

export default function Projects() {
  return (
    <section id="projects" className="section-space page-container projects-section">
      <SectionHeading number="03" label="SELECTED WORK" aside="Learning by building. A closer look at the systems I’m bringing to life.">Less theory.<br /><span className="text-faint">More building.</span></SectionHeading>
      <ProjectCollection projects={projects} />
      <a href={profile.github} target="_blank" rel="noreferrer" className="github-more mt-5 flex min-h-11 items-center justify-end gap-[9px] text-[12px] hover:text-accent
        max-md:mt-4 max-md:flex-wrap max-md:justify-start [&>span]:mr-1 [&>span]:text-faint
        max-md:[&>span]:basis-full [&>svg]:text-accent" data-reveal><span>There’s more in the making.</span> Follow the commits on GitHub <ArrowUpRight size={16} /></a>
    </section>
  )
}
