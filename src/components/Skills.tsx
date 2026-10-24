import { BrainCircuit, ChartNoAxesCombined, Database, Terminal } from 'lucide-react'
import { skills } from '@/data/skills'
import SectionHeading from './SectionHeading'

const icons = { brain: BrainCircuit, database: Database, chart: ChartNoAxesCombined, terminal: Terminal }

export default function Skills() {
  return (
    <section id="skills" className="section skills-section">
      <div className="container">
        <SectionHeading number="02" label="TOOLS FOR THE THOUGHTFUL BUILDER" aside="Different tools. Connected ideas. A toolkit that grows with every problem.">A practical toolkit.<br /><span className="text-muted">An open mindset.</span></SectionHeading>
        <div className="skills-grid">
          {skills.map((skill) => {
            const Icon = icons[skill.icon]
            return <article className={`skill-card skill-${skill.id}`} key={skill.id}>
              <div className="skill-top"><Icon size={25} strokeWidth={1.5} /><span className="mono">/{skill.number}</span></div>
              <h3>{skill.title}</h3><p>{skill.description}</p>
              <ul className="tech-list">{skill.technologies.map((technology) => <li key={technology}>{technology}</li>)}</ul>
            </article>
          })}
        </div>
        <p className="toolkit-footnote" data-reveal><span className="status-dot" /> Always learning. Always a work in progress.</p>
      </div>
    </section>
  )
}
