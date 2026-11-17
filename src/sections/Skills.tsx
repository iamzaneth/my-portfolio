import { useState } from 'react'
import ChapterBody from '@/features/chapters/ChapterBody'
import { BrainCircuit, ChartNoAxesCombined, Database, Terminal } from 'lucide-react'
import { skills } from '@/data/skills'
import SectionHeading from '@/components/SectionHeading'
import SkillDisclosure from '@/features/skills/SkillDisclosure'
import TechnologyMap from '@/features/skills/TechnologyMap'

const icons = { brain: BrainCircuit, database: Database, chart: ChartNoAxesCombined, terminal: Terminal }

export default function Skills() {
  const [active,setActive]=useState<string>(skills[0].id)
  return (
    <section id="skills" className="section-space skills-section">
      <ChapterBody label="Toolkit">
        <div className="atlas-intro">
        <SectionHeading number="02" label="THE CAPABILITY MAP" aside="Different tools. Connected ideas. A toolkit that grows with every problem.">The tools that<br /><span className="text-accent">connect the dots.</span></SectionHeading>
        </div>
        <div className="toolkit-workspace">
        <TechnologyMap active={active} onSelect={setActive} />
        <div className="skills-grid">
          {skills.map((skill) => {
            const Icon = icons[skill.icon]
            return <article id={`skill-${skill.id}`} hidden={active!==skill.id} className={`skill-card glass-standard skill-${skill.id}`} data-focus={skill.focus} key={skill.id}>
              <div className="skill-top"><span className="skill-emblem"><Icon size={26} strokeWidth={1.5} aria-hidden="true" /></span><span className="skill-kind"><span className="skill-focus">{skill.focus === 'core' ? 'Core focus' : 'Supporting discipline'}</span><span className="skill-number">/{skill.number}</span></span></div>
              <div className="skill-body">
                <h3>{skill.title}</h3>
                <SkillDisclosure title={skill.title} practice={skill.practice}>
                <p className="skill-description">{skill.description}</p>
                <ul className="tech-list open-tech-list">{skill.technologies.map((technology) => <li key={technology}>{technology}</li>)}</ul>
                </SkillDisclosure>
              </div>
            </article>
          })}
        </div>
        </div>
        <p className="toolkit-footnote" data-reveal><span className="status-dot" aria-hidden="true" /> Always learning. Always a work in progress.</p>
      </ChapterBody>
    </section>
  )
}
