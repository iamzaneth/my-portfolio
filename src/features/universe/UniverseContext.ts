import { createContext, useContext } from 'react'
import type { Project } from '@/types/portfolio'
import type { TechnologyTarget, UniverseState } from './universeState'

export interface UniverseContextValue {
  state: UniverseState
  projects: readonly Project[]
  hover: (id: string | null) => void
  hoverTechnology: (target: TechnologyTarget | null) => void
  inspectTechnology: (target: TechnologyTarget) => void
  setStackPage: (page: number) => void
  browse: (id: string) => void
  open: (project: Project, trigger: HTMLButtonElement) => void
  overview: () => void
  pause: () => void
}
export const UniverseContext = createContext<UniverseContextValue | null>(null)
export function useUniverse() {
  const value = useContext(UniverseContext)
  if (!value) throw new Error('Universe controls require UniverseProvider')
  return value
}
