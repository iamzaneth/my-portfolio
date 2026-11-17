import { ArrowUpRight, ChevronLeft, ChevronRight, Network } from 'lucide-react'
import { useUniverse } from '@/features/universe/UniverseContext'
import { projectTechnologies, TECHNOLOGIES_PER_CLUSTER } from '@/features/universe/constellationModel'
import SceneSlot from '@/features/universe/SceneSlot'
import type { Project } from '@/types/portfolio'
import ProjectCard from './ProjectCard'

export default function ProjectCollection({ projects }: { projects: readonly Project[] }) {
  const { state, browse, hover, open, setStackPage } = useUniverse()
  const activeIndex = Math.max(0,projects.findIndex(project=>project.id===state.activeId))
  const active = projects[activeIndex]
  const technologies = active?projectTechnologies(active):[]
  const stackPages = Math.ceil(technologies.length/TECHNOLOGIES_PER_CLUSTER)
  const stackPage = Math.min(state.stackPage,Math.max(0,stackPages-1))
  return <div className="project-collection" data-count={projects.length}>
    <div className="project-index" role="group" aria-label="Project index">
      <span className="index-heading"><Network size={15} aria-hidden="true" /> SYSTEM INDEX <span>/{String(projects.length).padStart(2,'0')}</span></span>
      <div className="project-index-items">{projects.map((project,index)=><button key={project.id} type="button" aria-pressed={project.id===active?.id} aria-controls={`project-panel-${project.id}`} onClick={()=>browse(project.id)}
        onFocus={()=>hover(project.id)} onBlur={()=>hover(null)} onPointerEnter={event=>{if(event.pointerType==='mouse')hover(project.id)}} onPointerLeave={()=>hover(null)}>
        <span>{String(index+1).padStart(2,'0')}</span>{project.title}<ArrowUpRight size={14} aria-hidden="true" />
      </button>)}</div>

    </div>
    <div className="explorer-layout">
      <div className="explorer-scene">
        <SceneSlot mode="explorer" />
        <div className="constellation-legend"><span><i className="legend-root" />Zaneth root</span><span><i className="legend-project" />Project</span><span><i className="legend-technology" />Technology</span><span className="legend-relationship">Shared relationships</span></div>
        {stackPages>1&&<div className="stack-paging"><span>{active?.title} · technologies {stackPage*TECHNOLOGIES_PER_CLUSTER+1}–{Math.min((stackPage+1)*TECHNOLOGIES_PER_CLUSTER,technologies.length)} of {technologies.length}</span><div><button type="button" aria-label="Previous technology nodes" disabled={stackPage===0} onClick={()=>setStackPage(stackPage-1)}><ChevronLeft size={16} /></button><button type="button" aria-label="Next technology nodes" disabled={stackPage>=stackPages-1} onClick={()=>setStackPage(stackPage+1)}><ChevronRight size={16} /></button></div></div>}
      </div>
      <div className="project-panels">{projects.map((project,index)=><div id={`project-panel-${project.id}`} key={project.id} hidden={project.id!==active?.id}><ProjectCard project={project} number={index+1} onDetails={open} /></div>)}
        {!active&&<p className="empty-state">The next project is taking shape. Follow the work on GitHub.</p>}
      </div>
    </div>
    <p className="explorer-access-note">One identity. Real projects. Connected technologies. Explore the depth, then open a case study.</p>
  </div>
}
