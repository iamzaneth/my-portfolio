import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const widths = [320, 375, 430, 600, 768, 900, 1024, 1440, 1920]

for (const width of widths) {
  test(`readable page and working anchors at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Tran Thien')
    await page.waitForTimeout(1700)
    for (const id of ['home', 'about', 'skills', 'projects', 'contact']) {
      const section = page.locator(`#${id}`)
      await section.scrollIntoViewIfNeeded()
      await page.waitForTimeout(1000)
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
      await expect(section).toBeVisible()
      const clipped = await section.locator('h1, h2, h3, p, .tech-list li').evaluateAll((elements) => elements.filter((el) => el.scrollWidth > el.clientWidth + 2).map((el) => el.textContent))
      expect(clipped).toEqual([])
      if ([375, 768, 1440].includes(width) && ['home', 'skills', 'projects'].includes(id)) {
        await section.screenshot({ path: `artifacts/${id}-${width}.png` })
      }
    }
    expect(errors).toEqual([])
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
    await page.waitForTimeout(300)
    await page.screenshot({ path: `artifacts/viewport-${width}.png`, fullPage: true })
  })
}

test('cat has exclusive interactive states, sleeps, wakes, and pauses offscreen', async ({ page }) => {
  await page.goto('/')
  const scene = page.locator('.mascot-scene')
  await expect(scene).toHaveAttribute('data-state', 'idle')
  await expect(scene).toHaveAttribute('data-running', 'true')
  await page.getByRole('button', { name: 'Pet', exact: true }).click()
  await expect(scene).toHaveAttribute('data-state', 'jump')
  await expect(page.locator('.cat-bubble')).toContainText('hello')
  await expect(scene).toHaveAttribute('data-state', 'meow', { timeout: 2500 })
  await page.getByRole('button', { name: 'Play', exact: true }).click()
  await expect(scene).toHaveAttribute('data-state', 'walk')
  await expect(scene).toHaveAttribute('data-state', 'run', { timeout: 3000 })
  await page.getByRole('button', { name: 'Nap', exact: true }).click()
  await expect(scene).toHaveAttribute('data-state', 'sleep')
  await page.getByRole('button', { name: 'Wake', exact: true }).click()
  await expect(scene).toHaveAttribute('data-state', 'wake')
  await expect(scene).toHaveAttribute('data-state', 'idle', { timeout: 2500 })
  await page.locator('#contact').scrollIntoViewIfNeeded()
  await expect(scene).toHaveAttribute('data-running', 'false')
})

test('sprite frames animate, and an autonomous nap includes lying down first', async ({ page }) => {
  await page.addInitScript(() => { Math.random = () => 0.99 })
  await page.clock.install()
  await page.goto('/')
  const scene = page.locator('.mascot-scene')
  await expect(scene).toHaveAttribute('data-running', 'true')
  const sprite = page.locator('.pixel-cat-sprite[data-active=true]')
  expect(await sprite.evaluate((element) => getComputedStyle(element).animationName)).toBe('cat-frames')
  await page.clock.runFor(9700)
  await expect(scene).toHaveAttribute('data-state', 'lieDown')
  await page.clock.runFor(1200)
  await expect(scene).toHaveAttribute('data-state', 'sleep')
})

test('mobile navigation removes hidden links from keyboard order and closes with Escape', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/')
  const menu = page.getByRole('button', { name: /^(Open|Close) navigation$/ })
  await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toBeHidden()
  await menu.click()
  await expect(menu).toHaveAttribute('aria-expanded', 'true')
  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: 'About', exact: true })).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(menu).toBeFocused()
  await expect(menu).toHaveAttribute('aria-expanded', 'false')
  await menu.click()
  await page.getByRole('link', { name: 'Selected work', exact: true }).click()
  await expect(page).toHaveURL(/#projects$/)
  await expect(menu).toHaveAttribute('aria-expanded', 'false')
})

test('reduced motion leaves content visible and keeps cat controls useful', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await expect(page.locator('.name-line > span').first()).toHaveCSS('transform', 'none')
  await expect(page.locator('.mascot-scene')).toHaveAttribute('data-running', 'false')
  await expect(page.locator('.pixel-cat-sprite[data-active=true]')).toHaveCSS('animation-name', 'none')
  for (const selector of ['.hero-copy', '.about-copy', '.skill-card', '.project-visual', '.contact-heading']) {
    await expect(page.locator(selector).first()).toHaveCSS('opacity', '1')
  }
  await page.getByRole('button', { name: 'Pet', exact: true }).click()
  await expect(page.locator('.cat-bubble')).toContainText('hello')
  await expect(page.locator('.cat-character')).toHaveCSS('transform', 'none')
  await page.screenshot({ path: 'artifacts/reduced-motion.png', fullPage: true })
  await page.locator('.mascot-scene').scrollIntoViewIfNeeded()
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await expect(page.locator('.mascot-scene')).toHaveAttribute('data-reduced-motion', 'false')
  await expect(page.locator('.mascot-scene')).toHaveAttribute('data-running', 'true')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(page.locator('.mascot-scene')).toHaveAttribute('data-running', 'false')
})

test('project links are truthful, local assets load, and email can be copied', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  const failed: string[] = []
  page.on('response', (response) => { if (response.status() >= 400) failed.push(response.url()) })
  await page.goto('/')
  await expect(page.getByRole('link', { name: /Source code/ })).toHaveAttribute('href', 'https://github.com/iamzaneth/NexTick')
  await expect(page.getByRole('link', { name: /Read the story/ })).toHaveAttribute('href', /#readme$/)
  await expect(page.getByRole('link', { name: /Live demo/ })).toHaveCount(0)
  await expect(page.locator('a[href*="Zane-Theodore"]')).toHaveCount(0)
  const email = await page.locator('.contact-email').innerText()
  await page.getByRole('button', { name: 'Copy email address' }).click()
  await expect(page.getByRole('status')).toHaveText('Copied!')
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(email)
  for (const url of ['/cv.pdf', '/avatar.webp', '/favicon.svg', '/mascot/cat-atlas.png', '/fonts/manrope-latin.woff2', '/fonts/ibm-plex-mono-latin.woff2']) {
    expect((await page.request.get(url)).status()).toBe(200)
  }
  expect(failed).toEqual([])
})

for (const width of [375, 1440]) {
  test(`WCAG A/AA automated accessibility at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze()
    expect(results.violations).toEqual([])
    if (width < 768) {
      await page.getByRole('button', { name: 'Open navigation' }).click()
      const openMenu = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze()
      expect(openMenu.violations).toEqual([])
    }
  })
}

test('production page stays within transfer and layout stability budgets', async ({ page }) => {
  await page.addInitScript(() => {
    Object.assign(window, { layoutShiftScore: 0 })
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const shift = entry as PerformanceEntry & { hadRecentInput: boolean; value: number }
        if (!shift.hadRecentInput) {
          const target = window as Window & { layoutShiftScore?: number }
          target.layoutShiftScore = (target.layoutShiftScore ?? 0) + shift.value
        }
      }
    }).observe({ type: 'layout-shift', buffered: true })
  })
  await page.goto('/', { waitUntil: 'networkidle' })
  await page.waitForTimeout(2500)
  const metrics = await page.evaluate(() => ({
    bytes: performance.getEntriesByType('resource').reduce((sum, entry) => sum + (entry as PerformanceResourceTiming).transferSize, 0),
    cls: (window as Window & { layoutShiftScore: number }).layoutShiftScore,
    domNodes: document.querySelectorAll('*').length,
  }))
  console.log('Local Chromium performance sample:', JSON.stringify(metrics))
  expect(metrics.bytes).toBeLessThan(650000)
  expect(metrics.cls).toBeLessThan(0.1)
  expect(metrics.domNodes).toBeLessThan(1000)
})
