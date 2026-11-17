import { skills } from '@/data/skills'
export default function TechnologyMap({active,onSelect}:{active:string;onSelect:(id:string)=>void}) {
  return <div className="technology-map" data-reveal>
    <div className="constellation-art" aria-hidden="true"><svg viewBox="0 0 600 360" preserveAspectRatio="none"><path d="M80 80 380 65 510 240 180 285 80 80M80 80 510 240M380 65 180 285" />{[[80,80],[380,65],[510,240],[180,285]].map(([x,y])=><circle key={x} cx={x} cy={y} r="3" />)}</svg></div>
    <div className="technology-map-heading"><span>CONNECTED CAPABILITIES</span><span>SELECT A DISCIPLINE</span></div>
    <div className="technology-clusters" role="group" aria-label="Explore capability categories">{skills.map(skill=><button type="button" key={skill.id} className="technology-cluster" aria-pressed={active===skill.id} aria-controls={`skill-${skill.id}`} onClick={()=>onSelect(skill.id)}><i aria-hidden="true" /><strong>{skill.title}</strong><span>{skill.description}</span></button>)}</div>
    <p className="constellation-caption">Mathematical foundations. Reliable data. Thoughtful software.</p>
  </div>
}
