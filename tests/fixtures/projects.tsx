import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ProjectCollection from '../../src/features/projects/ProjectCollection'
import { fixtureProjects } from './projectData'
import '../../src/index.css'

const query = new URLSearchParams(location.search)
const count = Math.min(50, Math.max(0, Number(query.get('count') ?? 12)))
const inventory = fixtureProjects(count, query.get('mode') ?? 'mixed')

createRoot(document.getElementById('root')!).render(<StrictMode>
  <main className="page-container" style={{ paddingBlock: 48 }}>
    <h1 style={{ fontSize: 28, marginBottom: 12 }}>Project collection test fixture</h1>
    <p style={{ marginBottom: 32, color: 'var(--muted)' }}>Temporary data for browser tests. These entries are not portfolio content.</p>
    <ProjectCollection projects={inventory} />
  </main>
</StrictMode>)
