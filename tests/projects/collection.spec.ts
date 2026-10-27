import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { readFile, readdir } from 'node:fs/promises'

import { projectFixture as fixture } from '../fixtures/urls'

for (const count of [1, 2, 3, 6, 12]) {
  const widths = [1, 12].includes(count) ? [320, 375, 430, 768, 1024, 1440, 1920] : [375, 1024, 1440, 1920]
  for (const width of widths) test(`${count} compact projects remain coherent at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    await page.goto(fixture(count), { waitUntil: 'networkidle' })
    await expect(page.getByRole('article')).toHaveCount(count)
    await expect(page.locator('.project-featured')).toHaveCount(1)
    await expect(page.getByRole('group', { name: 'Filter projects by category' })).toHaveCount(count > 1 ? 1 : 0)
    await expect(page.locator('.pipeline-art, .project-card .project-description, .project-card .project-story')).toHaveCount(0)
    const clipped = await page.locator('h3, p, .tech-list li').evaluateAll(elements => elements.filter(element => element.scrollWidth > element.clientWidth + 2).map(element => element.textContent))
    expect(clipped).toEqual([])
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    const boxes = await page.locator('.project-card').evaluateAll(elements => elements.map(element => {
      const bounds = element.getBoundingClientRect()
      const actions = element.querySelector('.project-actions')!.getBoundingClientRect()
      return { x: bounds.x, y: bounds.y, height: bounds.height, width: bounds.width, actionBottom: actions.bottom }
    }))
    if (count === 1) expect(boxes[0].width).toBeLessThanOrEqual(580)
    if (width >= 1024) {
      expect(boxes[0].height).toBeLessThan(380)
      for (const box of boxes) {
        const row = boxes.filter(item => Math.abs(item.y - box.y) < 1)
        expect(Math.max(...row.map(item => item.height)) - Math.min(...row.map(item => item.height))).toBeLessThan(1)
        expect(Math.max(...row.map(item => item.actionBottom)) - Math.min(...row.map(item => item.actionBottom))).toBeLessThan(1)
      }
      if (count > 1) {
        expect(boxes[1].y).toBeCloseTo(boxes[0].y, 0)
        expect(boxes[1].x).toBeGreaterThan(boxes[0].x + boxes[0].width)
      }
    }
    if (width < 768 && count > 1) expect(boxes[1].y).toBeGreaterThan(boxes[0].y + boxes[0].height)
    expect(errors).toEqual([])
  })
}

test('filtering retains card identity and the last inspected architecture stage', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto(fixture(12))
  const first = page.locator('.project-card').first()
  await first.getByRole('button', { name: /View details/ }).click()
  await page.getByRole('button', { name: /Inspect Kafka/ }).click()
  await page.keyboard.press('Escape')
  await first.evaluate(element => { element.setAttribute('data-identity-check', 'retained') })
  const filters = page.getByRole('group', { name: 'Filter projects by category' })
  await filters.getByRole('button', { name: 'AI Engineering', exact: true }).focus()
  await page.keyboard.press('Enter')
  await expect(first).toBeHidden()
  await expect(page.locator('.project-cell:visible')).toHaveCount(4)
  await filters.getByRole('button', { name: 'All', exact: true }).click()
  await expect(first).toHaveAttribute('data-identity-check', 'retained')
  await first.getByRole('button', { name: /View details/ }).click()
  await expect(page.locator('.pipeline-inspector h4')).toContainText('Kafka')
})

test('minimal metadata and incomplete visualization use a compact fallback without empty actions', async ({ page }) => {
  await page.goto(fixture(5, 'minimal'))
  await expect(page.locator('.project-card')).toHaveCount(5)
  await expect(page.locator('[data-visual=abstract]')).toHaveCount(5)
  await expect(page.locator('.project-actions:visible')).toHaveCount(0)
  await expect(page.getByRole('link', { name: /View demo/ })).toHaveCount(0)
})

test('images, image failures, and pipeline previews render without mounting explorers', async ({ page }) => {
  await page.goto(fixture(5), { waitUntil: 'networkidle' })
  const image = page.locator('[data-visual=image] img')
  await expect(image).toHaveJSProperty('complete', true)
  expect(await image.evaluate(element => (element as HTMLImageElement).naturalWidth)).toBeGreaterThan(0)
  await expect(page.locator('[data-visual=pipeline-preview]')).toHaveCount(3)
  await expect(page.locator('.pipeline-art')).toHaveCount(0)
  await page.goto(fixture(3, 'broken'), { waitUntil: 'networkidle' })
  await expect(page.locator('#fixture-2 [data-visual=abstract]')).toBeVisible()
  await expect(page.locator('#fixture-2 img')).toHaveCount(0)
})

test('featured styling, a single category, and an empty inventory leave no empty groups', async ({ page }) => {
  await page.goto(fixture(3, 'standard'))
  await expect(page.locator('.project-featured')).toHaveCount(0)
  await expect(page.locator('.project-card')).toHaveCount(3)
  await page.goto(fixture(5, 'single-category'))
  await expect(page.getByRole('group', { name: 'Filter projects by category' })).toHaveCount(0)
  await expect(page.locator('.project-card')).toHaveCount(5)
  await page.goto(fixture(0))
  await expect(page.locator('.project-card')).toHaveCount(0)
  await expect(page.locator('.empty-state')).toHaveText('Projects are being prepared.')
})

test('fixture collection passes accessibility with filtered and image-free projects', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto(fixture(5, 'minimal'))
  await page.getByRole('button', { name: 'Data Analysis', exact: true }).click()
  const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze()
  expect(result.violations).toEqual([])
})

test('synthetic fixture inventory is absent from the actual production bundle', async () => {
  for (const file of await readdir('dist/assets')) {
    if (!file.endsWith('.js')) continue
    const content = await readFile(`dist/assets/${file}`, 'utf8')
    expect(content).not.toContain('Fixture system')
    expect(content).not.toContain('Temporary project data for collection layout')
  }
})

test('pipeline geometry follows configured stage counts inside a mobile dialog', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  for (const [mode, count] of [['short-pipeline', 3], ['long-pipeline', 8]] as const) {
    await page.goto(fixture(1, mode))
    await page.getByRole('button', { name: /View details/ }).click()
    const stages = page.getByRole('group', { name: /architecture stages/ }).getByRole('button')
    await expect(stages).toHaveCount(count)
    await stages.last().focus()
    await page.keyboard.press('Enter')
    await expect(stages.last()).toHaveAttribute('aria-pressed', 'true')
    const last = await stages.last().boundingBox()
    expect(last!.x).toBeGreaterThanOrEqual(0)
    expect(last!.x + last!.width).toBeLessThanOrEqual(320)
    expect(await page.locator('.project-dialog-body').evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true)
    await page.keyboard.press('Escape')
  }
})
