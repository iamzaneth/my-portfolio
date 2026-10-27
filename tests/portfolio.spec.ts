import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const widths = [320, 375, 430, 600, 768, 900, 1024, 1440, 1920]

for (const width of widths) {
  test(`readable, connected sections without overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Tran Thien')
    await page.evaluate(() => document.fonts.ready)
    for (const id of ['home', 'about', 'skills', 'projects', 'contact']) {
      const section = page.locator(`#${id}`)
      await section.scrollIntoViewIfNeeded()
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
      await expect(section).toBeVisible()
      const clipped = await section.locator('h1, h2, h3, p, .tech-list li').evaluateAll((elements) => elements.filter((el) => el.scrollWidth > el.clientWidth + 2).map((el) => el.textContent))
      expect(clipped).toEqual([])
    }
    expect(errors).toEqual([])
    const sections = await page.locator('main > section').evaluateAll(elements => elements.map(element => {
      const style = getComputedStyle(element)
      const bounds = element.getBoundingClientRect()
      const heading = element.querySelector('.section-heading, .contact-top')
      return { top: bounds.top, bottom: bounds.bottom, padding: parseFloat(style.paddingTop),
        background: style.backgroundColor, headingLeft: heading?.getBoundingClientRect().left,
        opacity: heading ? getComputedStyle(heading).opacity : null }
    }))
    for (let index = 1; index < sections.length; index++) {
      expect(Math.abs(sections[index].top - sections[index - 1].bottom)).toBeLessThan(1)
      expect(sections[index].padding).toBeGreaterThan(0)
      expect(sections[index].padding).toBeCloseTo(sections[1].padding, 0)
      expect(sections[index].headingLeft).toBeCloseTo(sections[1].headingLeft!, 0)
      expect(sections[index].opacity).toBe('1')
    }
    expect(sections[2].background).toBe(sections[4].background)
    expect(sections[2].background).not.toBe(sections[1].background)
  })
}

test('page introductions settle with the heading, actions, and companion visible', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  for (const selector of ['.hero-copy', '.hero-actions', '.hero-socials', '.cat-stage', '.scene-sky']) {
    await expect(page.locator(selector)).toHaveCSS('opacity', '1')
  }
  const lines = await page.locator('.name-line > span').evaluateAll(elements => elements.map(element => {
    const bounds = element.getBoundingClientRect()
    const parent = element.parentElement!.getBoundingClientRect()
    return bounds.top >= parent.top - 1 && bounds.bottom <= parent.bottom + 1
  }))
  expect(lines.every(Boolean)).toBe(true)
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
  await page.locator('.mascot-scene').scrollIntoViewIfNeeded()
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await expect(page.locator('.mascot-scene')).toHaveAttribute('data-reduced-motion', 'false')
  await expect(page.locator('.mascot-scene')).toHaveAttribute('data-running', 'true')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(page.locator('.mascot-scene')).toHaveAttribute('data-running', 'false')
})

test('local assets load and email can be copied', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  const failed: string[] = []
  page.on('response', (response) => { if (response.status() >= 400) failed.push(response.url()) })
  await page.goto('/')
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
