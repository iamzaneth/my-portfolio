import { devices, expect, test, type Page } from '@playwright/test'

const canvas = (page: Page) => page.locator('.comet-cursor')
const paint = (page: Page) => canvas(page).evaluate(element => {
  const c = element as HTMLCanvasElement
  const pixels = c.getContext('2d')!.getImageData(0, 0, c.width, c.height).data
  let count = 0
  for (let i = 3; i < pixels.length; i += 4) if (pixels[i]) count++
  return count
})
const clears = (page: Page) => canvas(page).getAttribute('data-test-clears')

// Count canvas clears, not global RAFs: GSAP and the cat own independent work.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    const clear = CanvasRenderingContext2D.prototype.clearRect
    CanvasRenderingContext2D.prototype.clearRect = function (...args) {
      if (this.canvas.classList.contains('comet-cursor')) {
        this.canvas.dataset.testClears = String(Number(this.canvas.dataset.testClears ?? 0) + 1)
      }
      return clear.apply(this, args)
    }
  })
})

test('mouse draws bounded light, fades completely, and stops canvas work when stationary', async ({ page }) => {
  await page.goto('/')
  await expect(canvas(page)).toBeVisible()
  await page.mouse.move(300, 300)
  await page.mouse.move(600, 350, { steps: 20 })
  await expect.poll(() => paint(page)).toBeGreaterThan(0)
  // Sparse effect must remain small relative to the viewport, even after a burst.
  expect(await paint(page)).toBeLessThan(15000)
  await expect.poll(() => paint(page)).toBe(0)
  const stopped = await clears(page)
  await page.waitForTimeout(250)
  expect(await clears(page)).toBe(stopped)
  await page.mouse.move(610, 353, { steps: 4 })
  await expect.poll(() => paint(page)).toBeGreaterThan(0)
  await expect.poll(() => paint(page)).toBe(0)
})

test('viewport exit, hidden tab, resize and live motion preferences clear stale trails', async ({ page }) => {
  await page.goto('/')
  await page.mouse.move(200, 200)
  await page.mouse.move(600, 400, { steps: 10 })
  await page.evaluate(() => window.dispatchEvent(new PointerEvent('pointerout', { pointerType: 'mouse', relatedTarget: null })))
  await expect.poll(() => paint(page)).toBe(0)
  await page.mouse.move(620, 410)
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, value: true })
    document.dispatchEvent(new Event('visibilitychange'))
  })
  await expect.poll(() => paint(page)).toBe(0)
  const stopped = await clears(page)
  await page.mouse.move(800, 500)
  await page.waitForTimeout(100)
  expect(await clears(page)).toBe(stopped)
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, value: false })
    document.dispatchEvent(new Event('visibilitychange'))
  })
  await page.setViewportSize({ width: 1024, height: 768 })
  expect(await canvas(page).evaluate(element => ({ width: (element as HTMLCanvasElement).width, height: (element as HTMLCanvasElement).height }))).toEqual({ width: 1024, height: 768 })
  await page.mouse.move(700, 350, { steps: 8 })
  await expect.poll(() => paint(page)).toBeGreaterThan(0)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(canvas(page)).toBeHidden()
  await expect.poll(() => paint(page)).toBe(0)
  await expect(canvas(page)).toHaveAttribute('width', '1')
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await expect(canvas(page)).toBeVisible()
  await page.mouse.move(740, 370)
  await expect.poll(() => paint(page)).toBeGreaterThan(0)
})

test('decoration preserves hit testing, native pointer, scrolling, cat and dialogs', async ({ page }) => {
  await page.goto('/')
  await expect(canvas(page)).toHaveAttribute('aria-hidden', 'true')
  await expect(canvas(page)).toHaveCSS('pointer-events', 'none')
  expect(await canvas(page).evaluate(element => element.hasAttribute('tabindex'))).toBe(false)
  await page.mouse.move(300, 280)
  expect(await page.locator('body').evaluate(element => getComputedStyle(element).cursor)).not.toBe('none')
  await page.getByRole('button', { name: 'Pet', exact: true }).click()
  await expect(page.locator('.mascot-scene')).toHaveAttribute('data-origin', 'user')
  await page.getByRole('button', { name: 'View details: NexTick' }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.getByRole('button', { name: /Inspect Kafka/ }).click()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await page.locator('#contact').scrollIntoViewIfNeeded()
  await expect(page.locator('#contact')).toBeInViewport()
})

test('reduced motion at startup never paints or starts a cursor loop', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  const initial = await clears(page)
  await page.mouse.move(500, 300, { steps: 20 })
  await page.waitForTimeout(100)
  await expect(canvas(page)).toBeHidden()
  expect(await paint(page)).toBe(0)
  expect(await clears(page)).toBe(initial)
})

test.describe('touch-only device', () => {
  test.use({ viewport: devices['Pixel 7'].viewport, isMobile: true, hasTouch: true, deviceScaleFactor: devices['Pixel 7'].deviceScaleFactor })
  test('coarse pointer disables canvas even for synthetic mouse events', async ({ page }) => {
    await page.goto('/')
    await expect(canvas(page)).toBeHidden()
    await page.mouse.move(200, 300, { steps: 10 })
    await page.touchscreen.tap(200, 350)
    expect(await paint(page)).toBe(0)
    await expect(canvas(page)).toHaveAttribute('width', '1')
  })
})

test('fine pointer ignores touch events and caps high-DPI backing store', async ({ browser }) => {
  const context = await browser.newContext({ deviceScaleFactor: 3, viewport: { width: 800, height: 600 } })
  const page = await context.newPage()
  await page.goto('/')
  await expect(canvas(page)).toHaveAttribute('width', '1600')
  await page.evaluate(() => window.dispatchEvent(new PointerEvent('pointermove', { pointerType: 'touch', clientX: 200, clientY: 200 })))
  expect(await paint(page)).toBe(0)
  await context.close()
})
