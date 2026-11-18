import { useState } from 'react'
import ChapterBody from '@/features/chapters/ChapterBody'
import SectionHeading from '@/components/SectionHeading'
import TechnologyMap from '@/features/skills/TechnologyMap'
import SkillDetailsModal from '@/features/skills/SkillDetailsModal'
import { skills } from '@/data/skills'

export default function Skills() {
  const [selection, setSelection] = useState<{ id: string; trigger: HTMLButtonElement } | null>(null)
  const skill = skills.find(item => item.id === selection?.id)
  return <section id="skills" className="section-space skills-section">
    <ChapterBody label="Toolkit">
      <SectionHeading number="02" label="THE CAPABILITY MAP" aside="Different tools. Connected ideas. A toolkit that grows with every problem.">The tools that<br /><span className="text-accent">connect the dots.</span></SectionHeading>
      <TechnologyMap active={selection?.id ?? null} onSelect={(id, trigger) => setSelection({ id, trigger })} />
      <p className="toolkit-footnote" data-reveal><span className="status-dot" aria-hidden="true" /> Always learning. Always a work in progress.</p>
    </ChapterBody>
    {skill && selection && <SkillDetailsModal skill={skill} trigger={selection.trigger} onDismiss={() => setSelection(null)} />}
  </section>
}
