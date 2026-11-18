import { ArrowUpRight, Network } from 'lucide-react'
import { useUniverse } from '@/features/universe/UniverseContext'
import SceneSlot from '@/features/universe/SceneSlot'
import type { Project } from '@/types/portfolio'

/** Semantic index stays available even when WebGL cannot render. */
export default function ProjectCollection({ projects }: { projects: readonly Project[] }) {
  const { state, hover, open } = useUniverse()
  return <div className="project-collection" data-count={projects.length}>
    <div className="explorer-layout"><div className="explorer-scene">
      <SceneSlot mode="explorer" />
      <div className="constellation-legend"><span><i className="legend-root" />Zaneth</span><span><i className="legend-project" />Project worlds</span><span><i className="legend-technology" />Technologies</span></div>
    </div></div>
    <div className="project-index" role="group" aria-label="Project index">
      <span className="index-heading"><Network size={15} aria-hidden="true" /> EXPLORE WORLDS <span>/{String(projects.length).padStart(2,'0')}</span></span>
      <div className="project-index-items">{projects.map((project,index)=><button key={project.id} id={`project-panel-${project.id}`} type="button" aria-haspopup="dialog" aria-pressed={project.id===state.selectedId} onClick={event=>open(project,event.currentTarget)}
        onFocus={()=>hover(project.id)} onBlur={()=>hover(null)} onPointerEnter={event=>{if(event.pointerType==='mouse')hover(project.id)}} onPointerLeave={()=>hover(null)}>
        <span>{String(index+1).padStart(2,'0')}</span>{project.title}<ArrowUpRight size={14} aria-hidden="true" />
      </button>)}</div>
      {!projects.length&&<p className="empty-state">New worlds are taking shape.</p>}
    </div>
  </div>
}
