import { expect, test, type Page } from '@playwright/test'

const position = (page: Page, id: string) => page.locator(`#${id}`).evaluate(element => element.getBoundingClientRect().top)
const aligned = async (page: Page, id: string) => {
  const height = await page.locator('.site-header').evaluate(e => e.getBoundingClientRect().height)
  await expect.poll(async () => Math.abs(await position(page, id) - height)).toBeLessThan(3)
}

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
})

test('one moderate wheel gesture advances a compact chapter, reverses, and preserves native history policy', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('#home')).toHaveAttribute('data-compact', 'true')
  const history = await page.evaluate(() => window.history.length)
  await page.mouse.wheel(0, 120)
  await aligned(page, 'about')
  await expect(page.locator('.desktop-nav a[href="#about"]')).toHaveAttribute('aria-current', 'location')
  expect(await page.evaluate(() => window.history.length)).toBe(history)
  await page.waitForTimeout(220)
  await page.mouse.wheel(0, -120)
  await aligned(page, 'home')
})

test('small trackpad noise does not jump; accumulated input and momentum navigate only once', async ({ page }) => {
  await page.goto('/')
  for (let i = 0; i < 4; i++) await page.mouse.wheel(0, 2)
  await page.waitForTimeout(220)
  await aligned(page, 'home')
  for (let i = 0; i < 45; i++) { await page.mouse.wheel(0, i < 12 ? 8 : 3); await page.waitForTimeout(16) }
  await aligned(page, 'about')
  await page.waitForTimeout(250)
  await page.mouse.wheel(0, 120)
  await aligned(page, 'skills')
})

test('rapid wheels during settling cannot skip chapters or leave navigation locked', async ({ page }) => {
  await page.goto('/')
  for (let i = 0; i < 15; i++) { await page.mouse.wheel(0, 120); await page.waitForTimeout(20) }
  await aligned(page, 'about')
  await page.waitForTimeout(220)
  await page.mouse.wheel(0, -120)
  await aligned(page, 'home')
  await page.waitForTimeout(220)
  await page.mouse.wheel(0, 120)
  await page.waitForTimeout(220)
  for (let i = 0; i < 30; i++) { await page.mouse.wheel(0, 8); await page.waitForTimeout(20) }
  await aligned(page, 'about')
})

test('oversized content scrolls natively in both directions without premature navigation', async ({ page }) => {
  await page.goto('/#about')
  await page.locator('#about').evaluate(element => {
    const extra = document.createElement('p')
    extra.textContent = 'End of the extended chapter.'
    extra.style.cssText = 'padding-top:1400px'
    element.append(extra)
  })
  await expect(page.locator('#about')).toHaveAttribute('data-compact', 'false')
  await aligned(page, 'about')
  const before = await page.evaluate(() => scrollY)
  await page.mouse.wheel(0, 400)
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(before + 200)
  await expect(page.locator('html')).toHaveAttribute('data-chapter', 'about')
  await page.locator('#about > p').scrollIntoViewIfNeeded()
  await expect(page.locator('#about > p')).toBeInViewport()
  const reverseEnded = page.evaluate(() => new Promise<void>(resolve => window.addEventListener('scrollend', () => resolve(), { once: true })))
  const beforeReverse = await page.evaluate(() => scrollY)
  await page.mouse.wheel(0, -400)
  await reverseEnded
  expect(await page.evaluate(() => scrollY)).toBeLessThan(beforeReverse - 200)
  await expect(page.locator('#about')).toHaveAttribute('data-compact', 'false')
  await page.locator('#skills').evaluate(element => window.scrollTo({ top: element.offsetTop - 87 - 60, behavior: 'instant' }))
  await page.waitForTimeout(220)
  await page.mouse.wheel(0, 120)
  await aligned(page, 'skills')
})

test('expanded toolkit content remeasures without moving the document', async ({ page }) => {
  await page.goto('/#skills')
  await aligned(page, 'skills')
  const summary = page.locator('.skill-practice summary').first()
  await summary.focus({ preventScroll: true })
  const before = await page.evaluate(() => scrollY)
  await page.keyboard.press('Space')
  await expect(summary).toHaveAttribute('aria-expanded', 'true')
  await expect(page.locator('.skill-practice p').first()).toBeVisible()
  await page.waitForTimeout(500)
  expect(Math.abs(await page.evaluate(() => scrollY) - before)).toBeLessThan(3)
})

test('dialog wheel scrolling suspends page navigation and restores scroll and focus', async ({ page }) => {
  await page.goto('/#projects')
  await aligned(page, 'projects')
  const before = await page.evaluate(() => scrollY)
  const trigger = page.getByRole('button', { name: 'View details: NexTick' })
  // Use real pointer coordinates: locator.click may deliberately scroll a
  // transforming reveal into view before opening, changing the saved position.
  const bounds = await trigger.boundingBox()
  expect(bounds!.y).toBeGreaterThan(87)
  expect(bounds!.y + bounds!.height).toBeLessThan(1000)
  await page.mouse.click(bounds!.x + bounds!.width / 2, bounds!.y + bounds!.height / 2)
  await expect(page.getByRole('dialog')).toBeVisible()
  const body = page.locator('.project-dialog-body')
  await body.hover()
  await page.mouse.wheel(0, 500)
  await expect.poll(() => body.evaluate(e => e.scrollTop)).toBeGreaterThan(100)
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await expect(trigger).toBeFocused()
  expect(Math.abs(await page.evaluate(() => scrollY) - before)).toBeLessThan(3)
  await aligned(page, 'projects')
})

test('navbar links, direct hashes, refresh and browser history align below one navbar offset', async ({ page }) => {
  await page.goto('/#projects')
  await aligned(page, 'projects')
  await page.reload()
  await aligned(page, 'projects')
  await page.locator('.desktop-nav a[href="#about"]').click()
  await aligned(page, 'about')
  await page.locator('.desktop-nav a[href="#projects"]').click()
  await aligned(page, 'projects')
  await page.goBack()
  await aligned(page, 'about')
  await page.goForward()
  await aligned(page, 'projects')
})

test('resize and font enlargement preserve long content and the current chapter', async ({ page }) => {
  await page.goto('/#about')
  await aligned(page, 'about')
  await page.setViewportSize({ width: 1366, height: 768 })
  await expect(page.locator('html')).toHaveAttribute('data-chapter', 'about')
  await page.addStyleTag({ content: 'body {font-size: 125%} .about-copy p {font-size: 24px}' })
  await expect(page.locator('#about')).toHaveAttribute('data-compact', 'false')
  await page.locator('.about-current').scrollIntoViewIfNeeded()
  await expect(page.locator('.about-current')).toBeInViewport()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})

test('live reduced motion disables enhancement while anchors and keyboard remain functional', async ({ page }) => {
  await page.goto('/')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(page.locator('html')).toHaveCSS('scroll-behavior', 'auto')
  await page.mouse.wheel(0, 100)
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(20)
  expect(await page.evaluate(() => scrollY)).toBeLessThan(500)
  await page.locator('.desktop-nav a[href="#projects"]').click()
  await aligned(page, 'projects')
  await page.keyboard.press('Home')
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0)
})

test('zoom wheel and selected text never invoke chapter interception', async ({ page }) => {
  await page.goto('/')
  const prevented = await page.evaluate(() => {
    const event = new WheelEvent('wheel', { deltaY: 120, ctrlKey: true, cancelable: true, bubbles: true })
    window.dispatchEvent(event)
    return event.defaultPrevented
  })
  expect(prevented).toBe(false)
  await page.locator('.hero-description').evaluate(e => { const range = document.createRange(); range.selectNodeContents(e); getSelection()!.addRange(range) })
  expect(await page.evaluate(() => { const e = new WheelEvent('wheel', { deltaY: 120, cancelable: true }); window.dispatchEvent(e); return e.defaultPrevented })).toBe(false)
})

test('touch gestures retain native document scrolling and no nested page scroll plane', async ({ browser }) => {
  const context = await browser.newContext({ isMobile: true, hasTouch: true, viewport: { width: 375, height: 812 } })
  const page = await context.newPage()
  await page.goto('/')
  const cdp = await context.newCDPSession(page)
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 150, y: 650 }] })
  for (const y of [600, 520, 420, 300]) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 150, y }] }); await page.waitForTimeout(30) }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(100)
  await expect(page.locator('html')).toHaveCSS('scroll-snap-type', 'none')
  await page.locator('#contact').scrollIntoViewIfNeeded()
  await page.locator('.footer').scrollIntoViewIfNeeded()
  await expect(page.locator('.footer')).toBeInViewport()
  await context.close()
})
