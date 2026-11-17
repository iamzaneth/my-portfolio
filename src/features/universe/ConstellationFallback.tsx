import type { KnowledgeGraph } from './knowledgeGraph'
import { useUniverse } from './UniverseContext'
export default function ConstellationFallback({graph}:{graph:KnowledgeGraph}) {
  const {state,projects,open,overview}=useUniverse()
  const project=projects.find(item=>item.id===state.activeId)??projects[0]
  return <div className="constellation-fallback">
    <button className="fallback-root" type="button" onClick={overview}>ZANETH<span>IDENTITY ROOT</span></button>
    <svg viewBox="0 0 600 420" aria-hidden="true"><path d="M170 190 Q260 140 350 190" fill="none" stroke="#b299df" strokeOpacity=".5" />{graph.nodes.filter(node=>node.type==='technology').slice(0,8).map((node,i)=>{const angle=i*Math.PI*2/8,x=365+Math.cos(angle)*120,y=190+Math.sin(angle)*115;return<g key={node.id}><path d={`M350 190L${x} ${y}`} stroke="#7279b7" strokeOpacity=".35" /><circle cx={x} cy={y} r="4" fill="#82d8e6" /><text x={x} y={y-12} textAnchor="middle">{node.label}</text></g>})}<circle cx="170" cy="190" r="45" fill="#4d3b7c" stroke="#aa92de" /><circle cx="350" cy="190" r="27" fill="#253658" stroke="#7ab9d4" /></svg>
    {project&&<button className="fallback-project-button" type="button" aria-haspopup="dialog" onClick={event=>open(project,event.currentTarget)}>{project.title}<span>Open mission control ↗</span></button>}
  </div>
}
