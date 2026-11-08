import { rmSync } from 'node:fs'

// Fixed paths relative to this script keep cleanup within generated output,
// regardless of the caller's working directory. Run after test/capture servers stop.
const directories = [
  'artifacts', 'playwright-report', 'test-results', 'blob-report', 'coverage',
]
if (process.argv.includes('--build')) {
  directories.push(
    'dist', 'dist-ssr', '.vite', '.cache', 'node_modules/.tmp',
    'node_modules/.vite', 'node_modules/.vite-temp', 'node_modules/.cache',
  )
}
for (const directory of directories) {
  rmSync(new URL(`../${directory}/`, import.meta.url), { recursive: true, force: true })
}
console.log(`Removed generated ${process.argv.includes('--build') ? 'build, cache and ' : ''}test output.`)
