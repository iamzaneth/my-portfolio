import { ArrowUpRight, Github } from 'lucide-react'
import type { Project } from '@/types/portfolio'
import { externalUrl } from './projectContent'

export default function ProjectActions({ project }: { project: Project }) {
  const source = externalUrl(project.githubUrl)
  const demo = externalUrl(project.demoUrl)
  return <>
    {source && <a className="text-link" href={source} target="_blank" rel="noopener noreferrer"><Github size={16} aria-hidden="true" /> Source code <ArrowUpRight size={14} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>}
    {demo && <a className="text-link" href={demo} target="_blank" rel="noopener noreferrer">View demo <ArrowUpRight size={14} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>}
  </>
}
