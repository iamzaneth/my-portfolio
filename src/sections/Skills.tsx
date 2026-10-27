import { BrainCircuit, ChartNoAxesCombined, Database, Terminal } from 'lucide-react'
import { skills } from '@/data/skills'
import SectionHeading from '@/components/SectionHeading'
import SkillDisclosure from '@/features/skills/SkillDisclosure'

const icons = { brain: BrainCircuit, database: Database, chart: ChartNoAxesCombined, terminal: Terminal }

export default function Skills() {
  return (
    <section id="skills" className="section-space skills-section">
      <div className="page-container">
        <SectionHeading number="02" label="TOOLS FOR THE THOUGHTFUL BUILDER" aside="Different tools. Connected ideas. A toolkit that grows with every problem.">A practical toolkit.<br /><span className="text-faint">An open mindset.</span></SectionHeading>
        <div className="skills-grid">
          {skills.map((skill) => {
            const Icon = icons[skill.icon]
            return <article className={`skill-card skill-${skill.id}`} key={skill.id}>
              <div className="skill-top"><span className="skill-emblem"><Icon size={28} strokeWidth={1.4} aria-hidden="true" /></span><span className="skill-kind">{skill.id === 'ai' || skill.id === 'data' ? 'Core focus' : 'Supporting discipline'}<span className="skill-number">/{skill.number}</span></span></div>
              <div className="skill-body">
                <h3>{skill.title}</h3><p className="skill-description">{skill.description}</p>
                <ul className="tech-list open-tech-list">{skill.technologies.map((technology) => <li key={technology}>{technology}</li>)}</ul>
                <SkillDisclosure title={skill.title}>{skill.practice}</SkillDisclosure>
              </div>
            </article>
          })}
        </div>
        <p className="toolkit-footnote" data-reveal><span className="status-dot" aria-hidden="true" /> Always learning. Always a work in progress.</p>
      </div>
    </section>
  )
}
