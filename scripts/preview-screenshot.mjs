import { chromium } from '@playwright/test'
import { mkdir } from 'node:fs/promises'

const browser = await chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH })
const page = await browser.newPage({ viewport: { width: 1440, height: 1050 } })
page.on('pageerror', (error) => console.error(error.message))
await page.goto('http://127.0.0.1:5173', { waitUntil: 'networkidle' })
await page.waitForTimeout(2200)
await mkdir('artifacts', { recursive: true })
await page.screenshot({ path: 'artifacts/desktop-first-pass.png' })
for (const section of ['about', 'skills', 'projects', 'contact']) {
  await page.locator(`#${section}`).scrollIntoViewIfNeeded()
  await page.waitForTimeout(1200)
}
await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
await page.screenshot({ path: 'artifacts/desktop-full.png', fullPage: true })
console.log(await page.evaluate(() => ({ title: document.title, width: window.innerWidth, scrollWidth: document.documentElement.scrollWidth })))
await browser.close()
