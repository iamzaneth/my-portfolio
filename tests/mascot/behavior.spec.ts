import { expect, test } from '@playwright/test'

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

test('random behaviors vary without interrupting user actions or repeating consecutively', async ({ page }) => {
  await page.addInitScript(() => { Math.random = () => 0 })
  await page.clock.install()
  await page.goto('/')
  const scene = page.locator('.mascot-scene')
  await page.clock.runFor(5700)
  await expect(scene).toHaveAttribute('data-state', 'groom')
  await expect(scene).toHaveAttribute('data-origin', 'auto')
  await expect(page.locator('.cat-bubble')).toHaveAttribute('aria-live', 'off')
  await page.clock.runFor(10000)
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

test('sprite changes switch atomically without ghost layers, blank frames, or new image requests', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' })
  await expect(page.locator('.cat-stage')).toHaveCSS('opacity', '1')
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
  expect(samples.some(({ blended }) => blended)).toBe(false)
  expect(samples.every(({ images }) => images.every((url) => url.includes('cat-atlas.png')))).toBe(true)
  expect(newImages).toEqual([])
})

test('interrupting a walk with a pet preserves the current horizontal position', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Play', exact: true }).click()
  await page.waitForTimeout(1000)
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
