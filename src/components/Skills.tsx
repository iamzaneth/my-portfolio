import { BrainCircuit, ChartNoAxesCombined, Database, Terminal } from 'lucide-react'
import { skills } from '@/data/skills'
import SectionHeading from './SectionHeading'

const icons = { brain: BrainCircuit, database: Database, chart: ChartNoAxesCombined, terminal: Terminal }

export default function Skills() {
  return (
    <section id="skills" className="section-space skills-section border-y border-line bg-bg-subtle">
      <div className="page-container">
        <SectionHeading number="02" label="TOOLS FOR THE THOUGHTFUL BUILDER" aside="Different tools. Connected ideas. A toolkit that grows with every problem.">A practical toolkit.<br /><span className="text-faint">An open mindset.</span></SectionHeading>
        <div className="skills-grid grid grid-cols-4 gap-4 max-desktop:grid-cols-2 max-md:gap-3 max-phone:grid-cols-1">
          {skills.map((skill) => {
            const Icon = icons[skill.icon]
            return <article className={`skill-card rounded-md border border-line bg-surface px-5 py-[22px] transition-[border-color,background] duration-250 ease-[ease] hover:border-[#8c78a3] hover:bg-surface-raised wide:p-6 max-desktop:p-[22px] max-md:p-5 [&_h3]:mb-[11px] [&_h3]:text-[16px] [&_h3]:font-[650] [&_h3]:tracking-[-.3px] [&>p]:mb-4 [&>p]:min-h-[45px] [&>p]:text-[14px] [&>p]:leading-[1.85] [&>p]:text-muted max-desktop:[&>p]:min-h-[auto] max-md:[&>p]:text-[13px] max-phone:[&>p]:text-[14px] skill-${skill.id}`} key={skill.id}>
              <div className="skill-top mb-[18px] flex items-center justify-between [&>svg]:text-accent [.skill-data_&>svg]:text-cyan
                [.skill-analysis_&>svg]:text-cyan [&>.font-mono]:text-[11px] [&>.font-mono]:text-faint"><Icon size={25} strokeWidth={1.5} /><span className="font-mono">/{skill.number}</span></div>
              <h3>{skill.title}</h3><p>{skill.description}</p>
              <ul className="tech-list m-0 flex list-none flex-wrap gap-[7px] p-0 max-md:gap-1.5 [&>li]:rounded-[3px] [&>li]:border
                [&>li]:border-line [&>li]:bg-surface-raised [&>li]:px-2 [&>li]:py-1.5 [&>li]:font-mono [&>li]:text-[11px]
                [&>li]:leading-[1.45] [&>li]:text-muted max-md:[&>li]:px-[7px] max-md:[&>li]:py-[5px]
                max-md:[&>li]:text-[10px] max-phone:[&>li]:text-[11px]">{skill.technologies.map((technology) => <li key={technology}>{technology}</li>)}</ul>
            </article>
          })}
        </div>
        <p className="toolkit-footnote mt-[18px] flex items-center gap-2.5 font-mono text-[11px] text-faint max-md:text-[10px]
          max-md:leading-[1.7] [&>.status-dot]:size-1 [&>.status-dot]:bg-accent [&>.status-dot]:shadow-none" data-reveal><span className="status-dot" /> Always learning. Always a work in progress.</p>
      </div>
    </section>
  )
}
