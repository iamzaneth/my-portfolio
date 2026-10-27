import { mergeConfig } from 'vite'
import { resolve } from 'node:path'
import base from '../../vite.config.ts'

// Isolate synthetic content from dist/ and from the real portfolio build.
export default mergeConfig(base, {
  build: {
    outDir: resolve(process.cwd(), 'artifacts/project-fixtures'),
    emptyOutDir: true,
    rollupOptions: { input: resolve(process.cwd(), 'tests/fixtures/projects.html') },
  },
})
