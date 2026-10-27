export type ProjectCategory = 'Data Engineering' | 'AI Engineering' | 'Data Analysis'

interface PipelineStage {
  id: string
  name: string
  detail: string
  description: string
  output: string
  companion?: string
  icon: 'source' | 'stream' | 'storage' | 'backend' | 'chart'
}

export interface Project {
  id: string
  slug: string
  title: string
  summary: string
  description?: string
  category: ProjectCategory
  technologies?: readonly string[]
  image?: { src: string; alt: string }
  featured?: boolean
  githubUrl?: string
  demoUrl?: string
  detailsUrl?: string
  highlights?: string[]
  status?: string
  visualization?: 'pipeline'
  visualTitle?: string
  visualNote?: string
  pipeline?: PipelineStage[]
  story?: { label: string; text: string }[]
}
