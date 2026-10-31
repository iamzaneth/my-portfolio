import { expect, test } from '@playwright/test'

test('architecture stages work by keyboard and preserve companion discoveries', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await page.getByRole('button', { name: 'View details: NexTick' }).click()
  const stages = page.getByRole('group', { name: 'NexTick architecture stages' }).getByRole('button')
  await expect(stages).toHaveCount(5)
  for (const [index, name] of ['Binance', 'Kafka', 'QuestDB', 'NestJS', 'React'].entries()) {
    await stages.nth(index).focus()
    await page.keyboard.press('Enter')
    await expect(stages.nth(index)).toHaveAttribute('aria-pressed', 'true')
    await expect(page.locator('.pipeline-stage[aria-pressed=true]')).toHaveCount(1)
    await expect(page.locator('.pipeline-inspector h4')).toContainText(name)
    await expect(page.locator('.stage-output')).not.toBeEmpty()
  }
  await expect(page.locator('.pipeline-bottom')).toContainText('not live market data')
  await page.keyboard.press('Escape')
  await page.locator('#home').scrollIntoViewIfNeeded()
  await expect(page.locator('.cat-bubble')).toContainText('From raw events to something you can see.')
  await page.getByRole('button', { name: 'Pet', exact: true }).click()
  await expect(page.locator('.cat-bubble')).toContainText('hello')
})

test('event packets pause offscreen, resume in place, and respect reduced motion', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'View details: NexTick' }).click()
  const art = page.locator('.pipeline-art')
  const packet = page.locator('.event-packet').first()
  await art.scrollIntoViewIfNeeded()
  await expect(art).toHaveAttribute('data-running', 'true')
  await page.waitForTimeout(250)
  await page.locator('.project-dialog-body').evaluate(element => { element.scrollTop = element.scrollHeight })
  await expect(art).toHaveAttribute('data-running', 'false')
  const phase = () => packet.evaluate(element => element.getAnimations()[0]?.currentTime)
  const frozen = await phase()
  await page.waitForTimeout(200)
  expect(await phase()).toBe(frozen)
  await art.scrollIntoViewIfNeeded()
  await expect(art).toHaveAttribute('data-running', 'true')
  await expect.poll(phase).not.toBe(frozen)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(packet).toHaveCSS('animation-name', 'none')
  await expect(packet).toHaveCSS('display', 'none')
  await page.getByRole('button', { name: /Inspect NestJS/ }).click()
  await expect(page.locator('.pipeline-inspector')).toContainText('NestJS')
})

for (const width of [320, 375, 430, 768, 1024, 1440, 1920]) {
  test(`circular nodes, centered connectors and selection remain aligned at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    const preview = await page.locator('.preview-stages').evaluate(element => {
      const bounds = element.getBoundingClientRect()
      const line = getComputedStyle(element, '::before')
      return { left: bounds.left + parseFloat(line.left), right: bounds.right - parseFloat(line.right),
        y: bounds.top + parseFloat(line.top) + parseFloat(line.height) / 2,
        nodes: [...element.querySelectorAll('.preview-node')].map(node => {
          const box = node.getBoundingClientRect()
          return { x: box.x + box.width / 2, y: box.y + box.height / 2,
            width: box.width, height: box.height, radius: getComputedStyle(node).borderRadius }
        }) }
    })
    expect(preview.nodes).toHaveLength(5)
    expect(preview.left).toBeCloseTo(preview.nodes[0].x, 0)
    expect(preview.right).toBeCloseTo(preview.nodes.at(-1)!.x, 0)
    for (const node of preview.nodes) {
      expect(node.width).toBe(node.height)
      expect(node.radius).toBe('50%')
      expect(node.y).toBeCloseTo(preview.y, 0)
    }
    await page.getByRole('button', { name: 'View details: NexTick' }).click()
    const stages = page.locator('.pipeline-stage')
    await stages.nth(3).focus()
    await page.keyboard.press('Space')
    await expect(stages.nth(3)).toHaveAttribute('aria-pressed', 'true')
    await expect(page.locator('.pipeline-inspector h4')).toContainText('NestJS')
    await stages.nth(1).hover()
    const geometry = await page.locator('.pipeline-stages').evaluate(element => {
      const line = element.querySelector('.pipeline-progress')!.getBoundingClientRect()
      return { left: line.left, right: line.right, y: line.y + line.height / 2,
        nodes: [...element.querySelectorAll('.stage-icon')].map(node => {
          const box = node.getBoundingClientRect(), icon = node.querySelector('svg')!.getBoundingClientRect()
          return { x: box.x + box.width / 2, y: box.y + box.height / 2, width: box.width, height: box.height,
            radius: getComputedStyle(node).borderRadius, iconX: icon.x + icon.width / 2, iconY: icon.y + icon.height / 2 }
        }), selected: getComputedStyle(element.querySelector('[aria-pressed=true] .stage-icon')!).boxShadow,
        marker: getComputedStyle(element.querySelector('[aria-pressed=true] .stage-icon')!, '::after').opacity }
    })
    expect(geometry.left).toBeCloseTo(geometry.nodes[0].x, 0)
    expect(geometry.right).toBeCloseTo(geometry.nodes.at(-1)!.x, 0)
    for (const node of geometry.nodes) {
      expect(node.width).toBe(node.height)
      expect(node.radius).toBe('50%')
      expect(node.y).toBeCloseTo(geometry.y, 0)
      expect(node.iconX).toBeCloseTo(node.x, 0)
      expect(node.iconY).toBeCloseTo(node.y, 0)
    }
    expect(geometry.selected).not.toBe('none')
    expect(geometry.marker).toBe('1')
  })
}
