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
