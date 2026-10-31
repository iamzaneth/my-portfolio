import { chromium } from '@playwright/test'
import sharp from 'sharp'
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

// Usage: npm run capture -- after <preview URL> <output root> [before label]
const [label = 'current', url = 'http://127.0.0.1:4173', output = 'artifacts/visual', compare] = process.argv.slice(2)
if (!/^[a-z0-9-]+$/i.test(label) || (compare && !/^[a-z0-9-]+$/i.test(compare))) throw new Error('Capture labels must be simple directory names')
const directory = resolve(output, label)
await mkdir(directory, { recursive: true })
const browser = await chromium.launch(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
  ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH } : {})
const report = []
try {
  for (const width of [320, 375, 430, 768, 1024, 1440, 1920]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' })
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
    await page.goto(url, { waitUntil: 'networkidle' })
    await page.evaluate(() => document.fonts.ready)
    for (const id of ['home', 'about', 'skills', 'projects', 'contact']) {
      await page.locator(`#${id}`).screenshot({ path: `${directory}/${id}-${width}.png`, style: '.site-header { visibility: hidden; }' })
    }
    await page.locator('.hero-bottom').evaluate(element => window.scrollTo({ top: element.getBoundingClientRect().top + scrollY - 72, behavior: 'instant' }))
    await page.screenshot({ path: `${directory}/hero-about-${width}.png`, style: '.site-header { visibility: hidden; }' })
    for (const [previous, next] of [['about', 'skills'], ['skills', 'projects'], ['projects', 'contact']]) {
      await page.locator(`#${next}`).evaluate(element => window.scrollTo({ top: element.getBoundingClientRect().top + scrollY - 190, behavior: 'instant' }))
      await page.screenshot({ path: `${directory}/${previous}-${next}-${width}.png`, style: '.site-header { visibility: hidden; }' })
    }
    await page.locator('.project-pipeline-preview').first().screenshot({ path: `${directory}/pipeline-preview-${width}.png`, style: '.site-header { visibility: hidden; }' })
    await page.evaluate(async () => {
      window.scrollTo({ top: 0, behavior: 'instant' })
      await new Promise(requestAnimationFrame)
      await new Promise(requestAnimationFrame)
    })
    await page.screenshot({ path: `${directory}/full-${width}.png`, fullPage: true })
    if (width < 768) {
      await page.getByRole('button', { name: 'Open navigation' }).click()
      await page.screenshot({ path: `${directory}/menu-${width}.png` })
      await page.keyboard.press('Escape')
    }
    if ([375, 1440].includes(width)) {
      const disclosure = page.locator('.skill-practice summary').first()
      await disclosure.click()
      await page.locator('#skills').screenshot({ path: `${directory}/skills-expanded-${width}.png`, style: '.site-header { visibility: hidden; }' })
      await disclosure.click()
    }
    await page.getByRole('button', { name: 'View details: NexTick' }).click()
    const dialog = page.getByRole('dialog', { name: 'NexTick', exact: true })
    await page.screenshot({ path: `${directory}/dialog-top-${width}.png` })
    await dialog.getByRole('button', { name: /Inspect NestJS/ }).click()
    await dialog.locator('.pipeline-inspector').scrollIntoViewIfNeeded()
    await page.screenshot({ path: `${directory}/dialog-architecture-${width}.png` })
    await dialog.locator('.project-dialog-body').evaluate(element => { element.scrollTop = element.scrollHeight })
    await page.screenshot({ path: `${directory}/dialog-bottom-${width}.png` })
    await page.keyboard.press('Escape')
    await dialog.waitFor({ state: 'hidden' })
    if (process.env.PLAYWRIGHT_FIXTURE_URL && [375, 1440].includes(width)) {
      for (const count of [1, 2, 3, 12]) {
        await page.goto(`${process.env.PLAYWRIGHT_FIXTURE_URL}/tests/fixtures/projects.html?count=${count}`, { waitUntil: 'networkidle' })
        for (const img of await page.locator('img').all()) {
          await img.scrollIntoViewIfNeeded()
          await img.evaluate(element => element.decode())
        }
        await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
        await page.screenshot({ path: `${directory}/fixture-${count}-${width}.png`, fullPage: true })
      }
    }
    report.push({ width, errors, overflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth) })
    await page.close()
  }
  // Capture real scroll-linked transforms separately from the static,
  // reduced-motion section evidence. Save the return scroll as well.
  for (const width of [320, 375, 768, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } })
    await page.goto(url, { waitUntil: 'networkidle' })
    await page.waitForTimeout(1700)
    const scene = page.locator('.mascot-scene')
    const top = await scene.evaluate(element => Math.max(0, element.getBoundingClientRect().top + scrollY - 140))
    const states = []
    for (const [index, offset] of [0, 100, 200, 0].entries()) {
      await page.evaluate(top => window.scrollTo({ top, behavior: 'instant' }), top + offset)
      await page.waitForTimeout(350)
      // Page clipping preserves the chosen scroll position; locator screenshots
      // can scroll the scene into view and inadvertently change its rotation.
      const clip = await scene.boundingBox()
      if (!clip) throw new Error('Companion scene has no bounds')
      await page.screenshot({ path: `${directory}/orbit-${width}-${index}.png`,
        clip: { x: clip.x, y: Math.max(0, clip.y), width: clip.width, height: clip.height + Math.min(0, clip.y) },
        style: '.site-header { visibility: hidden; }' })
      states.push(await page.locator('.scene-orbit').evaluate(element => ({ scroll: scrollY, transform: getComputedStyle(element).transform })))
    }
    await writeFile(`${directory}/orbit-${width}.json`, JSON.stringify(states, null, 2))
    await page.close()
  }
} finally { await browser.close() }
await writeFile(`${directory}/audit.json`, JSON.stringify(report, null, 2))
if (report.some(item => item.errors.length || item.overflow)) throw new Error(`Capture failed: see ${directory}/audit.json`)
if (compare) {
  const differences = []
  const channelTolerance = 2
  // Live orbit evidence intentionally includes the browser-clock sprite and
  // is reviewed separately; only deterministic captures use exact comparison.
  const files = (await readdir(directory)).filter(file => file.endsWith('.png') && !file.startsWith('orbit-'))
  for (const file of files) {
    const before = await sharp(await readFile(resolve(output, compare, file))).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
    const after = await sharp(await readFile(resolve(directory, file))).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
    let changedPixels = 0
    let significantPixels = 0
    let maxChannelDelta = 0
    const sameSize = before.info.width === after.info.width && before.info.height === after.info.height
    if (sameSize) {
      for (let i = 0; i < before.data.length; i += 4) {
        let delta = 0
        for (let channel = 0; channel < 4; channel++) delta = Math.max(delta, Math.abs(before.data[i + channel] - after.data[i + channel]))
        maxChannelDelta = Math.max(maxChannelDelta, delta)
        if (delta) changedPixels++
        if (delta > channelTolerance) significantPixels++
      }
    }
    if (!sameSize || changedPixels) differences.push({ file, sameSize, changedPixels, significantPixels, maxChannelDelta })
  }
  const failed = differences.some(item => !item.sameSize || item.significantPixels)
  const comparison = { captures: files.length, channelTolerance, failed, differences }
  await writeFile(resolve(output, 'comparison.json'), JSON.stringify(comparison, null, 2))
  console.log(JSON.stringify(comparison, null, 2))
  if (failed) process.exitCode = 1
} else console.log(`Captured ${directory}; ${report.length} widths passed.`)
