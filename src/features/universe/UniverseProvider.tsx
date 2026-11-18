import { useCallback, useEffect, useMemo, useReducer, useState, type ReactNode } from 'react'
import type { Project } from '@/types/portfolio'
import ProjectDetailsModal from '@/features/projects/ProjectDetailsModal'
import { normalizeTechnologyId } from './knowledgeGraph'
import { useMotionPreference } from '@/hooks/useMotionPreference'
import { UniverseContext } from './UniverseContext'
import { initialUniverseState, universeReducer, type TechnologyTarget } from './universeState'
import { TECHNOLOGIES_PER_CLUSTER, projectTechnologies } from './constellationModel'

export default function UniverseProvider({ projects, children }: { projects: readonly Project[]; children: ReactNode }) {
  const [state, dispatch] = useReducer(universeReducer, projects[0]?.id ?? null, initialUniverseState)
  const [opened, setOpened] = useState<{ project: Project; trigger: HTMLButtonElement } | null>(null)
  const [stages, setStages] = useState<Record<string, string>>({})
  const reduced = useMotionPreference()
  const hover = useCallback((id: string | null) => dispatch({ type: 'hover', id }), [])
  const hoverTechnology = useCallback((target: TechnologyTarget | null) => dispatch({ type: 'hoverTechnology', target }), [])
  const inspectTechnology = useCallback((target: TechnologyTarget) => {
    const project = projects.find(item => item.id === target.projectId)
    const names=project?projectTechnologies(project):[]
    const index=names.findIndex(name=>normalizeTechnologyId(name)===normalizeTechnologyId(target.name))
    if (index >= 0) dispatch({ type: 'inspectTechnology', target:{...target,name:names[index]}, page: Math.floor(index / TECHNOLOGIES_PER_CLUSTER) })
  }, [projects])
  const setStackPage = useCallback((page: number) => dispatch({ type: 'stackPage', page }), [])
  const browse = useCallback((id: string) => dispatch({ type: 'browse', id }), [])
  const overview = useCallback(() => dispatch({ type: 'overview' }), [])
  const pause = useCallback(() => dispatch({ type: 'pause' }), [])
  const open = useCallback((project: Project, trigger: HTMLButtonElement) => {
    dispatch({ type: 'select', id: project.id })
    setOpened(current => ({ project, trigger: current?.trigger ?? trigger }))
  }, [])
  const dismiss = useCallback(() => {
    setOpened(null)
    dispatch({ type: 'close' })
  }, [])

  useEffect(() => {
    if (state.phase !== 'focusing' && state.phase !== 'returning') return
    const timer = setTimeout(() => dispatch({ type: 'settled' }), reduced ? 0 : 900)
    return () => clearTimeout(timer)
  }, [state.phase, reduced])

  // Preserve direct project anchors. Native links/history still own navigation.
  useEffect(() => {
    const sync = () => {
      const project = projects.find(item => `#${item.slug}` === location.hash)
      if (project) dispatch({ type: 'browse', id: project.id })
    }
    sync()
    window.addEventListener('hashchange', sync)
    window.addEventListener('popstate', sync)
    return () => { window.removeEventListener('hashchange', sync); window.removeEventListener('popstate', sync) }
  }, [projects])


  useEffect(()=>{const project=projects.find(item=>item.id===state.activeId);if(!project||location.hash!==`#${project.slug}`)return;const frame=requestAnimationFrame(()=>window.dispatchEvent(new Event('portfolio:restore')));return()=>cancelAnimationFrame(frame)},[projects,state.activeId])

  const value = useMemo(() => ({ state, projects, hover, hoverTechnology, inspectTechnology, setStackPage, browse, open, pause, overview }), [state, projects, hover, hoverTechnology, inspectTechnology, setStackPage, browse, open, pause, overview])
  return <UniverseContext value={value}>
    {children}
    {opened && <ProjectDetailsModal project={opened.project}
      number={projects.findIndex(project => project.id === opened.project.id) + 1}
      trigger={opened.trigger} onDismiss={dismiss} initialStageId={stages[opened.project.id]}
      onStageChange={id => setStages(current => ({ ...current, [opened.project.id]: id }))} />}
  </UniverseContext>
}
