import { expect, test } from '@playwright/test'

test('toolkit disclosures work by keyboard without hiding the technology lists', async ({ page }) => {
  await page.goto('/')
  for (const card of await page.locator('.skill-card').all()) {
    const summary = card.locator('summary')
    await summary.focus()
    await page.keyboard.press('Enter')
    await expect(card.locator('details')).toHaveAttribute('open', '')
    await expect(card.locator('details p')).toBeVisible()
    await expect(card.locator('.tech-list')).toBeVisible()
    await page.keyboard.press('Enter')
    await expect(card.locator('details')).not.toHaveAttribute('open', '')
  }
})

test('skill disclosure supports reversal, explicit expanded state, and reduced motion', async ({ page }) => {
  await page.goto('/')
  const details = page.locator('.skill-practice').first()
  const summary = details.locator('summary')
  await summary.focus()
  await page.keyboard.press('Enter')
  await expect(summary).toHaveAttribute('aria-expanded', 'true')
  await page.waitForTimeout(80)
  const heights = await details.evaluate(async element => {
    const body = element.querySelector('.skill-practice-body')!
    const before = body.getBoundingClientRect().height
    element.querySelector<HTMLElement>('summary')!.click()
    await new Promise(requestAnimationFrame)
    return { before, after: body.getBoundingClientRect().height }
  })
  expect(heights.before).toBeGreaterThan(0)
  expect(Math.abs(heights.after - heights.before)).toBeLessThan(12)
  await expect(details).not.toHaveAttribute('open', '')
  await expect(summary).toHaveAttribute('aria-expanded', 'false')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await summary.click()
  await expect(details).toHaveAttribute('open', '')
  await expect(summary).toHaveAttribute('aria-expanded', 'true')
  expect(await details.locator('.skill-practice-body').evaluate(element => element.getAnimations().length)).toBe(0)
})

for (const width of [320, 375, 430, 768, 1024, 1440, 1920]) {
  test(`toolkit modules share geometry and expand independently at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    const cards = page.locator('.skill-card')
    await expect(cards).toHaveCount(4)
    await expect(cards.locator('h3')).toHaveText(['AI & Mathematics', 'Data Engineering', 'Data Analysis', 'Engineering & Tools'])
    await expect(cards.locator('.skill-focus')).toHaveText(['Core focus', 'Core focus', 'Supporting discipline', 'Supporting discipline'])
    const surfaces = await cards.evaluateAll(elements => elements.map(element => {
      const style = getComputedStyle(element)
      return { padding: style.padding, background: style.backgroundColor, border: style.borderWidth,
        radius: style.borderRadius, heading: getComputedStyle(element.querySelector('h3')!).fontSize }
    }))
    expect(surfaces.every(surface => JSON.stringify(surface) === JSON.stringify(surfaces[0]))).toBe(true)
    const boxes = await cards.evaluateAll(elements => elements.map(element => {
      const box = element.getBoundingClientRect()
      return { x: box.x, y: box.y, width: box.width, height: box.height }
    }))
    expect(boxes[0].width).toBeCloseTo(boxes[1].width, 0)
    if (width >= 768) {
      expect(boxes[0].y).toBeCloseTo(boxes[1].y, 0)
      expect(boxes[2].y).toBeCloseTo(boxes[3].y, 0)
      expect(boxes[1].x).toBeGreaterThan(boxes[0].x + boxes[0].width)
    } else expect(boxes[1].y).toBeGreaterThan(boxes[0].y + boxes[0].height)
    const neighborHeight = boxes[1].height
    const summary = cards.first().locator('summary')
    await summary.focus()
    await page.keyboard.press('Space')
    await expect(summary).toHaveAttribute('aria-expanded', 'true')
    await expect(cards.first().locator('details p')).toBeVisible()
    expect((await cards.nth(1).boundingBox())!.height).toBeCloseTo(neighborHeight, 0)
    for (const card of await cards.all()) {
      await card.locator('summary').click()
      const clipped = await card.locator('h3, p, li, summary, .skill-kind').evaluateAll(elements =>
        elements.filter(element => element.scrollWidth > element.clientWidth + 1).map(element => element.textContent))
      expect(clipped).toEqual([])
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  })
}
