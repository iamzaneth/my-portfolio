import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import { ArrowUpRight, Eye, Network, Orbit, Pause, Play, RotateCcw, Plus, Minus, Rotate3d, Hand } from 'lucide-react'
import { useMotionPreference } from '@/hooks/useMotionPreference'
import { useUniverse } from './UniverseContext'
import { buildKnowledgeGraph, layoutKnowledgeGraph, visibleKnowledgeGraph, ROOT_ID, normalizeTechnologyId } from './knowledgeGraph'
import { useCompactScene } from './useCompactScene'
import ConstellationFallback from './ConstellationFallback'
import type { createUniverseEngine, SceneSettings } from './UniverseEngine'

type Engine=ReturnType<typeof createUniverseEngine>
export default function UniverseViewport({chapter='home'}:{chapter?:string}) {
  const {state,projects,hover,hoverTechnology,inspectTechnology,open,pause,overview}=useUniverse()
  const reduced=useMotionPreference(),compact=useCompactScene()
  const [host]=useState(()=>{const element=document.createElement('div');element.className='universe-viewport';return element})
  const canvas=useRef<HTMLCanvasElement>(null),engine=useRef<Engine|null>(null)
  const [mode,setMode]=useState<'hero'|'explorer'>('hero'),[visible,setVisible]=useState(false),[status,setStatus]=useState<'loading'|'ready'|'failed'>('loading'),[enabled,setEnabled]=useState(true),[attempt,setAttempt]=useState(0),[touchRotate,setTouchRotate]=useState(false)
  const fullGraph=useMemo(()=>layoutKnowledgeGraph(buildKnowledgeGraph(projects)),[projects])
  const graph=useMemo(()=>visibleKnowledgeGraph(fullGraph,state.focusedId,state.stackPage),[fullGraph,state.focusedId,state.stackPage])
  const settings=useMemo<SceneSettings>(()=>({state,graph,reduced,visible,mode,chapter,touchRotate}),[state,graph,reduced,visible,mode,chapter,touchRotate])
  const latest=useRef(settings)
  useEffect(()=>{latest.current=settings;engine.current?.update(settings)},[settings])
  useEffect(()=>{engine.current?.update(latest.current)},[status])
  useEffect(()=>{
    const slots=Array.from(document.querySelectorAll<HTMLElement>('[data-universe-viewport]')),heights=new Map<HTMLElement,number>()
    if(slots[0])slots[0].append(host)
    const observer=new IntersectionObserver(entries=>{
      entries.forEach(entry=>heights.set(entry.target as HTMLElement,entry.isIntersecting?entry.intersectionRect.height:0))
      const best=slots.reduce<HTMLElement|undefined>((current,slot)=>(heights.get(slot)??0)>(current?heights.get(current)??0:0)?slot:current,undefined)
      setVisible(Boolean(best));if(best&&host.parentElement!==best){best.append(host);setMode(best.dataset.universeViewport==='explorer'?'explorer':'hero');hover(null)}
    },{threshold:[0,.1,.3,.5,.7,1]})
    slots.forEach(slot=>observer.observe(slot));return()=>{observer.disconnect();host.remove()}
  },[host,hover])
  useEffect(()=>{
    if(!enabled)return
    let alive=true,instance:Engine|undefined
    const fail=()=>{if(alive)setStatus('failed')}
    void import('./UniverseEngine').then(({createUniverseEngine})=>{
      if(!alive||!canvas.current)return
      try{instance=createUniverseEngine(canvas.current,host,latest.current,{hover,hoverTechnology,inspectTechnology,overview,select:id=>{const project=projects.find(item=>item.id===id);const trigger=Array.from(host.querySelectorAll<HTMLButtonElement>('[data-project-node]')).find(element=>element.dataset.projectNode===id);if(project&&trigger)open(project,trigger)},failure:fail,ready:()=>{if(alive)setStatus('ready')}});engine.current=instance}catch{fail()}
    }).catch(fail)
    return()=>{alive=false;instance?.dispose();engine.current=null}
  },[host,enabled,attempt,hover,hoverTechnology,inspectTechnology,overview,open,projects])
  useEffect(()=>{if(status==='failed'){engine.current?.dispose();engine.current=null;hover(null)}},[status,hover])
  function retry(){setStatus('loading');setEnabled(true);setAttempt(value=>value+1)}
  const fallback=!enabled||status!=='ready',technologyTarget=state.hoveredTechnology??state.technology,focusId=state.hoveredId??state.focusedId
  function reset(){overview();engine.current?.reset()}
  return <>
    <div className="global-cosmic-environment" data-state={fallback?'still':'ready'} data-theme={chapter} aria-hidden="true"><div className="cosmic-environment-fallback" /><canvas key={`${enabled}-${attempt}`} ref={canvas} className="global-universe-canvas" data-ready={!fallback} /></div>
    {createPortal(<>
      <div className="scene-topline"><span>{mode==='hero'?<Orbit size={14} aria-hidden="true" />:<Network size={14} aria-hidden="true" />}{mode==='hero'?'ZN / CENTRAL WORLD':state.focusedId?'ZN / PROJECT FOCUS':'ZN / ENGINEERING UNIVERSE'}</span><span className="scene-signal"><i />{fallback?'STILL VIEW':'CONNECTED SYSTEMS'}</span>{mode==='explorer'&&!fallback&&<div className="scene-aux-controls"><button type="button" onClick={pause} disabled={reduced} aria-label={state.paused?'Resume ambient motion':'Pause ambient motion'}>{state.paused||reduced?<Play size={15} />:<Pause size={15} />}</button>{compact&&<button type="button" onClick={()=>setTouchRotate(value=>!value)} aria-pressed={touchRotate} aria-label="Enable touch graph rotation"><Hand size={15} /></button>}</div>}</div>
      {fallback&&(mode==='hero'?<div className="planet-fallback" aria-hidden="true"><div /></div>:<ConstellationFallback graph={graph} />)}
      {mode==='hero'&&<div className="planet-signature" aria-hidden="true"><span>Z A N E T H</span><small>A universe of engineering</small></div>}
      {!fallback&&mode==='explorer'&&<div className="constellation-labels">
        <button type="button" className="root-node-label" data-node-label={ROOT_ID} data-root-node="zaneth" onClick={reset} aria-label="Show Zaneth universe overview"><strong>ZANETH</strong><span>IDENTITY ROOT</span></button>
        {graph.nodes.filter(node=>node.type==='project').map(node=>{
          const project=projects.find(item=>item.id===node.projectId)!
          return <button type="button" key={node.id} className="project-node-label" data-node-label={node.id} data-project-node={project.id} data-active={focusId===project.id} data-hovered={state.hoveredId===project.id} style={{'--node-color':node.color} as CSSProperties} aria-haspopup="dialog" aria-label={`Open project: ${project.title}`}
            onPointerEnter={event=>{if(event.pointerType==='mouse')hover(project.id)}} onPointerLeave={()=>hover(null)} onFocus={()=>hover(project.id)} onBlur={()=>hover(null)} onClick={event=>open(project,event.currentTarget)}>
            <span className="project-node-category">{project.category}</span><span className="project-node-title"><span>{project.title}</span><ArrowUpRight size={15} aria-hidden="true" /></span><span className="project-node-caption">EXPLORE SYSTEM</span><span className="project-node-preview"><span>{project.summary}</span><small>{project.technologies?.slice(0,3).join(' · ')}</small></span>
          </button>
        })}
        {graph.nodes.filter(node=>node.type==='technology').map(node=>{
          const owner=node.projectIds.includes(state.activeId??'')?state.activeId!:node.projectIds[0]
          return <button type="button" className="technology-node-label" key={node.id} tabIndex={-1} data-node-label={node.id} data-technology-node={node.label} data-technology-id={node.technologyId} data-project-ids={node.projectIds.join(',')} data-active={normalizeTechnologyId(technologyTarget?.name??'')===node.technologyId} aria-label={`Inspect ${node.label}, used by ${node.projectIds.map(id=>projects.find(project=>project.id===id)?.title).join(', ')}`}
            onPointerEnter={event=>{if(event.pointerType==='mouse')hoverTechnology({projectId:owner,name:node.label})}} onPointerLeave={()=>hoverTechnology(null)} onFocus={()=>hoverTechnology({projectId:owner,name:node.label})} onBlur={()=>hoverTechnology(null)} onClick={()=>inspectTechnology({projectId:owner,name:node.label})}><i aria-hidden="true" />{node.label}{node.projectIds.length>1&&<small>×{node.projectIds.length}</small>}</button>
        })}
      </div>}
      <div className="scene-bottomline"><span className="scene-caption">{fallback?'Still view · all project information available':reduced?'Stable view · reduced motion':mode==='hero'?'A world built around curiosity.':technologyTarget?`${technologyTarget.name} · connected technology`:'Drag to rotate · + / − to zoom'}</span><div className="scene-controls" aria-label="Scene controls">
        {enabled&&status!=='failed'?<>
          {mode==='hero'&&<button type="button" onClick={pause} disabled={reduced||fallback} aria-label={state.paused?'Resume ambient motion':'Pause ambient motion'}>{state.paused||reduced?<Play size={15} />:<Pause size={15} />}</button>}
          {mode==='explorer'&&<><button type="button" onClick={()=>engine.current?.zoom(.84)} aria-label="Zoom in on graph"><Plus size={15} /></button><button type="button" onClick={()=>engine.current?.zoom(1.19)} aria-label="Zoom out of graph"><Minus size={15} /></button><button type="button" onClick={()=>engine.current?.side()} aria-label="View graph from side"><Rotate3d size={15} /></button></>}
          <button type="button" onClick={reset} disabled={fallback} aria-label="Restore default camera"><RotateCcw size={15} /></button>
          <button type="button" onClick={()=>{setEnabled(false);hover(null)}} aria-label="Use lightweight still view"><Eye size={15} /></button>
        </>:<button className="scene-retry" type="button" onClick={retry}>{status==='failed'?'Retry 3D':'Enable 3D'}<RotateCcw size={14} /></button>}
      </div></div>
    </>,host)}
  </>
}
