import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  timeout: 45000,
  outputDir: 'artifacts/test-results',
  reporter: [['list'], ['html', { open: 'never', outputFolder: process.env.PLAYWRIGHT_HTML_OUTPUT_DIR || 'artifacts/playwright-report' }]],
  use: {
    ...devices['Desktop Chrome'],
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:4173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    launchOptions: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH } : {},
  },
  // A supplied base URL belongs to the caller; do not launch a second preview.
  webServer: [
    ...(process.env.PLAYWRIGHT_BASE_URL ? [] : [{
      command: 'npm run preview -- --host 127.0.0.1 --port 4173 --strictPort',
      url: 'http://127.0.0.1:4173',
      reuseExistingServer: !process.env.CI,
    }]),
    ...(process.env.PLAYWRIGHT_FIXTURE_URL ? [] : [{
      command: 'npm run test:fixtures && node node_modules/vite/bin/vite.js preview --outDir artifacts/project-fixtures --host 127.0.0.1 --port 4176 --strictPort',
      url: 'http://127.0.0.1:4176/tests/fixtures/projects.html',
      reuseExistingServer: !process.env.CI,
    }]),
  ],
})
