import type { Project } from '@/types/portfolio'

// Treat external resources as data, never as placeholder or executable links.
export function externalUrl(value?: string) {
  if (!value?.trim()) return undefined
  try {
    const url = new URL(value)
    return ['https:', 'http:'].includes(url.protocol) && url.hostname ? value.trim() : undefined
  } catch { return undefined }
}

export function hasProjectDetails(project: Project) {
  return Boolean(project.description || project.highlights?.length || project.story?.length
    || project.technologies?.length || project.image?.src || externalUrl(project.detailsUrl)
    || (project.visualization === 'pipeline' && project.pipeline?.length))
}
