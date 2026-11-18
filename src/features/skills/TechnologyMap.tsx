import { ArrowUpRight } from 'lucide-react'
import { skillIcons } from './skillIcons'
import { skills } from '@/data/skills'

export default function TechnologyMap({ active, onSelect }: { active: string | null; onSelect: (id: string, trigger: HTMLButtonElement) => void }) {
  return <div className="technology-map" data-reveal data-sky-avoid>
    <div className="capability-links" aria-hidden="true"><svg viewBox="0 0 1000 500" preserveAspectRatio="none"><path d="M250 125 750 375M750 125 250 375M250 125H750V375H250Z" /><circle cx="500" cy="250" r="5" /></svg></div>
    <div className="technology-map-heading"><span>CONNECTED CAPABILITIES / 04</span><span>OPEN A DISCIPLINE <ArrowUpRight size={12} /></span></div>
    <div className="technology-clusters" role="group" aria-label="Explore capability categories">
      {skills.map(skill => {
        const Icon = skillIcons[skill.icon]
        return <button type="button" key={skill.id} className="technology-cluster" data-selected={active === skill.id} aria-haspopup="dialog" onClick={event => onSelect(skill.id, event.currentTarget)}>
          <span className="capability-top"><span className="capability-icon"><Icon size={26} strokeWidth={1.4} aria-hidden="true" /></span><span className="capability-kind">{skill.focus === 'core' ? 'Core focus' : 'Supporting discipline'}<small>/{skill.number}</small></span></span>
          <strong>{skill.title}</strong><span className="capability-description">{skill.description}</span>
          <span className="capability-action">Explore discipline <ArrowUpRight size={15} aria-hidden="true" /></span>
        </button>
      })}
    </div>
    <p className="constellation-caption">Mathematical foundations. Reliable data. Thoughtful software.</p>
  </div>
}
