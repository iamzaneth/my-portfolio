import type { Project, ProjectCategory } from '../../src/types/portfolio'
import { projects } from '../../src/data/projects'

// Test-only inventory. This module is not imported by the portfolio entrypoint.
export function fixtureProjects(count: number, mode: string): Project[] {
  const categories: ProjectCategory[] = ['Data Engineering', 'AI Engineering', 'Data Analysis']
  return Array.from({ length: count }, (_, index) => {
    const project: Project = {
      id: `fixture-${index + 1}`, slug: `fixture-${index + 1}`,
      title: `Fixture system ${String(index + 1).padStart(2, '0')}`,
      summary: 'Temporary project data for collection layout and interaction testing.',
      category: mode === 'single-category' ? categories[0] : categories[index % categories.length],
      featured: mode !== 'standard' && index === 0,
    }
    if (mode === 'minimal') {
      // Even an incomplete visualization configuration needs a useful fallback.
      project.visualization = 'pipeline'
      return project
    }
    project.description = 'This is a browser-test fixture, not an additional portfolio project. It exercises optional content and responsive composition.'
    project.technologies = index % 3 ? ['TypeScript', 'SQL', 'Docker'] : []
    project.githubUrl = index % 3 === 2 ? undefined : 'https://example.com/test-source'
    project.detailsUrl = index % 2 ? 'https://example.com/test-documentation' : undefined
    project.demoUrl = index % 4 === 2 ? 'https://example.com/test-demo' : undefined
    if (mode === 'invalid-links') {
      project.githubUrl = 'javascript:alert(1)'
      project.demoUrl = ['#', '', '/not-a-demo', 'javascript:alert(1)', 'https://'][index % 5]
      project.detailsUrl = '#'
    }
    if (index % 4 === 0 || index % 4 === 3) {
      project.visualization = 'pipeline'
      project.pipeline = projects[0].pipeline
      if (mode === 'short-pipeline') project.pipeline = project.pipeline?.slice(0, 3)
      if (mode === 'long-pipeline') project.pipeline = Array.from({ length: 8 }, (_, step) => ({
        ...projects[0].pipeline![step % 5], id: `test-stage-${step}`, name: `Stage ${step + 1}`,
      }))
      project.visualTitle = 'A test of the architecture renderer.'
    } else if (index % 4 === 1) {
      project.image = { src: mode === 'broken' ? '/broken-preview.webp' : '/avatar.webp', alt: 'Temporary test preview' }
    }
    if (index % 2 === 0) project.story = [{ label: 'Fixture notes', text: 'Temporary supporting evidence used only to exercise the project details layout.' }]
    return project
  })
}
