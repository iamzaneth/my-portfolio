import { rmSync } from 'node:fs'

// Resolve against the repository, regardless of the caller's working directory.
// Fixture builds are inputs to browser tests, so keep them available.
const directories = [
  'artifacts/playwright-report', 'artifacts/test-results',
  'artifacts/inspect', 'artifacts/visual', 'artifacts/cosmic',
  'playwright-report', 'test-results', 'blob-report', 'coverage',
]

for (const directory of directories) {
  rmSync(new URL(`../${directory}/`, import.meta.url), { recursive: true, force: true })
}
console.log('Removed generated test reports, traces, and captures.')
