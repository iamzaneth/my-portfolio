import { expect, test } from '@playwright/test'

test('desktop navigation forms a right-aligned group next to the contact link', async ({ page }) => {
  for (const width of [768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')
    const logo = await page.locator('.wordmark').boundingBox()
    const nav = await page.locator('.desktop-nav').boundingBox()
    const contact = await page.locator('.nav-contact').boundingBox()
    expect(logo && nav && contact).toBeTruthy()
    expect(contact!.x - (nav!.x + nav!.width)).toBeLessThan(45)
    expect(nav!.x - (logo!.x + logo!.width)).toBeGreaterThan(50)
  }
})

test('mobile menu rotates and morphs its persistent bars into an X', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/')
  const toggle = page.getByRole('button', { name: /^(Open|Close) navigation$/ })
  const glyph = page.locator('.menu-glyph')
  await expect(glyph.locator('span')).toHaveCount(3)
  await toggle.click()
  await expect(glyph.locator('span').nth(1)).toHaveCSS('opacity', '0')
  await expect(glyph).toHaveCSS('transform', 'matrix(-1, 0, 0, -1, 0, 0)')
  await page.screenshot({ path: 'artifacts/mobile-menu-open.png' })
  await page.keyboard.press('Escape')
  await expect(glyph.locator('span').nth(1)).toHaveCSS('opacity', '1')
  await expect(glyph).toHaveCSS('transform', 'none')
})

test('random behaviors vary without interrupting user actions or repeating consecutively', async ({ page }) => {
  await page.addInitScript(() => { Math.random = () => 0 })
  await page.clock.install()
  await page.goto('/')
  const scene = page.locator('.mascot-scene')
  await page.clock.runFor(5300)
  await expect(scene).toHaveAttribute('data-state', 'groom')
  await expect(scene).toHaveAttribute('data-origin', 'auto')
  await expect(page.locator('.cat-bubble')).toHaveAttribute('aria-live', 'off')
  await page.clock.runFor(6800)
  await expect(scene).toHaveAttribute('data-state', 'groomPaw')
  await page.getByRole('button', { name: 'Pet', exact: true }).click()
  await expect(scene).toHaveAttribute('data-state', 'jump')
  await expect(scene).toHaveAttribute('data-origin', 'user')
  await page.clock.runFor(3000)
  await expect(scene).toHaveAttribute('data-state', 'idle')
  await page.locator('#contact').scrollIntoViewIfNeeded()
  await expect(scene).toHaveAttribute('data-running', 'false')
  await page.clock.fastForward(20000)
  await expect(scene).toHaveAttribute('data-state', 'idle')
})

test('sleeping cat wakes before responding to a play request', async ({ page }) => {
  await page.goto('/')
  const scene = page.locator('.mascot-scene')
  await page.getByRole('button', { name: 'Nap', exact: true }).click()
  await expect(scene).toHaveAttribute('data-state', 'sleep')
  await page.getByRole('button', { name: 'Play', exact: true }).click()
  await expect(scene).toHaveAttribute('data-state', 'wake')
  await expect(scene).toHaveAttribute('data-state', 'walk')
})

test('sprite changes overlap without a blank frame or new image requests', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' })
  await page.waitForTimeout(1500)
  const newImages: string[] = []
  page.on('request', (request) => { if (request.resourceType() === 'image') newImages.push(request.url()) })
  const samples = await page.evaluate(async () => {
    const button = document.querySelector<HTMLButtonElement>('.cat-controls button')!
    button.click()
    const result: { total: number; blended: boolean; images: string[] }[] = []
    for (let i = 0; i < 16; i++) {
      await new Promise(requestAnimationFrame)
      const styles = Array.from(document.querySelectorAll('.pixel-cat-sprite'), (element) => getComputedStyle(element))
      const opacity = styles.map((style) => Number(style.opacity))
      result.push({ total: opacity[0] + opacity[1], blended: opacity.every((value) => value > 0.01 && value < 0.99), images: styles.map((style) => style.backgroundImage) })
    }
    return result
  })
  expect(samples.every(({ total }) => total >= 0.98)).toBe(true)
  expect(samples.some(({ blended }) => blended)).toBe(true)
  expect(samples.every(({ images }) => images.every((url) => url.includes('cat-atlas.png')))).toBe(true)
  expect(newImages).toEqual([])
})

test('interrupting a walk with a pet preserves the current horizontal position', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Play', exact: true }).click()
  await page.waitForTimeout(600)
  const { before, after } = await page.evaluate(async () => {
    const element = document.querySelector('.cat-character')!
    const before = new DOMMatrixReadOnly(getComputedStyle(element).transform).m41
    document.querySelector<HTMLButtonElement>('.cat-controls button')!.click()
    await new Promise(requestAnimationFrame)
    await new Promise(requestAnimationFrame)
    return { before, after: new DOMMatrixReadOnly(getComputedStyle(element).transform).m41 }
  })
  expect(before).toBeGreaterThan(10)
  expect(Math.abs(after - before)).toBeLessThan(4)
})

test('reduced motion disables random behavior and menu/sprite transitions', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.clock.install()
  await page.goto('/')
  await page.clock.fastForward(30000)
  await expect(page.locator('.mascot-scene')).toHaveAttribute('data-state', 'idle')
  await expect(page.locator('.menu-glyph')).toHaveCSS('transition-duration', '0s')
  await page.getByRole('button', { name: 'Pet', exact: true }).click()
  await expect(page.locator('.pixel-cat-sprite[data-active=true]')).toHaveAttribute('data-asset', 'meow')
  await expect(page.locator('.pixel-cat-sprite[data-active=true]')).toHaveCSS('transition-duration', '0s')
})
