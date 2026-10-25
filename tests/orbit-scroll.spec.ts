import { devices, expect, test, type Page } from '@playwright/test'

const rotation = (page: Page) => page.locator('.scene-orbit').evaluate((element) => {
  const matrix = new DOMMatrixReadOnly(getComputedStyle(element).transform)
  return Math.atan2(matrix.b, matrix.a) * 180 / Math.PI
})

const angleDelta = (after: number, before: number) => (after - before + 540) % 360 - 180

async function showScene(page: Page) {
  await page.goto('/', { waitUntil: 'networkidle' })
  await page.waitForTimeout(1700)
  await page.locator('.mascot-scene').evaluate((element) => {
    window.scrollTo({ top: Math.max(0, element.getBoundingClientRect().top + scrollY - 180), behavior: 'instant' })
  })
  await page.waitForTimeout(250)
}

for (const viewport of [{ width: 1440, height: 900 }, { width: 820, height: 1180 }, { width: 390, height: 844 }, { width: 320, height: 700 }]) {
  test(`orbit responds promptly to short scrolls in both directions at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport)
    await showScene(page)
    const before = await rotation(page)
    await page.evaluate(() => window.scrollBy({ top: 100, behavior: 'instant' }))
    await expect.poll(async () => angleDelta(await rotation(page), before), { timeout: 500, intervals: [16] }).toBeGreaterThan(15)
    await page.waitForTimeout(250)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    const after = await rotation(page)
    await page.evaluate(() => window.scrollBy({ top: -100, behavior: 'instant' }))
    await expect.poll(async () => angleDelta(after, await rotation(page)), { timeout: 500, intervals: [16] }).toBeGreaterThan(15)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  })
}

test.describe('touch scrolling', () => {
  test.use({
    viewport: devices['Pixel 7'].viewport,
    userAgent: devices['Pixel 7'].userAgent,
    deviceScaleFactor: devices['Pixel 7'].deviceScaleFactor,
    isMobile: true,
    hasTouch: true,
  })

  test('a swipe over the cat turns the orbit on mobile', async ({ page, context }) => {
    await showScene(page)
    const before = await rotation(page)
    const scrollBefore = await page.evaluate(() => scrollY)
    const touch = await context.newCDPSession(page)
    await touch.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 195, y: 470 }] })
    for (const y of [450, 420, 390, 360]) {
      await touch.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 195, y }] })
      await page.waitForTimeout(40)
    }
    await touch.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
    await expect.poll(async () => (await page.evaluate(() => scrollY)) - scrollBefore).toBeGreaterThan(50)
    await expect.poll(async () => angleDelta(await rotation(page), before), { timeout: 500, intervals: [16] }).toBeGreaterThan(15)
  })
})

test('orbit stays within the viewport throughout its rotation on narrow screens', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 })
  await showScene(page)
  for (const offset of [0, 60, 120, 180, 240, 300, 360]) {
    await page.locator('.mascot-scene').evaluate((element, offset) => {
      window.scrollTo({ top: element.getBoundingClientRect().top + scrollY - 180 + offset, behavior: 'instant' })
    }, offset)
    await page.waitForTimeout(250)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  }
  await page.screenshot({ path: 'artifacts/orbit-mobile-scrolled.png' })
})

test('orbit respects live changes to reduced motion', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await showScene(page)
  await page.evaluate(() => window.scrollBy({ top: 100, behavior: 'instant' }))
  await expect(page.locator('.scene-orbit')).toHaveCSS('transform', 'none')
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.waitForTimeout(1700)
  const before = await rotation(page)
  await page.evaluate(() => window.scrollBy({ top: 100, behavior: 'instant' }))
  await expect.poll(async () => angleDelta(await rotation(page), before)).toBeGreaterThan(15)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(page.locator('.scene-orbit')).toHaveCSS('transform', 'none')
})

test('orbit still responds after resizing from desktop to mobile', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await showScene(page)
  await page.setViewportSize({ width: 390, height: 844 })
  await page.locator('.mascot-scene').evaluate((element) => {
    window.scrollTo({ top: element.getBoundingClientRect().top + scrollY - 180, behavior: 'instant' })
  })
  await page.waitForTimeout(500)
  const before = await rotation(page)
  await page.evaluate(() => window.scrollBy({ top: 100, behavior: 'instant' }))
  await expect.poll(async () => angleDelta(await rotation(page), before), { timeout: 500, intervals: [16] }).toBeGreaterThan(15)
})
