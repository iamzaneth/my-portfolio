export type ProjectCategory = 'Data Engineering' | 'AI Engineering' | 'Data Analysis'

export interface Project {
  id: string
  slug: string
  title: string
  summary: string
  description: string
  category: ProjectCategory
  technologies: string[]
  image?: { src: string; alt: string }
  featured?: boolean
  githubUrl?: string
  demoUrl?: string
  detailsUrl?: string
  highlights?: string[]
  status?: string
  visualization?: 'pipeline'
}
