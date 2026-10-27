import { expect, test } from '@playwright/test'
import { catSprites } from '../../src/features/mascot/catSprites'

test('idle playback advances through consecutive atlas frames on the browser clock', async ({ page }) => {
  await page.goto('/')
  const frames = await page.evaluate(async () => {
    const sprite = document.querySelector<HTMLElement>('.pixel-cat-sprite[data-active=true]')!
    const result = []
    const until = performance.now() + 1600
    while (performance.now() < until) {
      await new Promise(requestAnimationFrame)
      const style = getComputedStyle(sprite)
      result.push(Math.round(-parseFloat(style.backgroundPositionX) / sprite.offsetWidth))
    }
    return result
  })
  expect(new Set(frames).size).toBeGreaterThanOrEqual(8)
  expect(frames.every(frame => frame >= 0 && frame < catSprites.idle.frames)).toBe(true)
  expect(frames.slice(1).every((frame, index) => (frame - frames[index] + 10) % 10 <= 1)).toBe(true)
})

test('visibility events preserve the current sprite, world pose, and pending action', async ({ page }) => {
  await page.clock.install()
  await page.goto('/')
  await page.getByRole('button', { name: 'Pet', exact: true }).click()
  await page.clock.runFor(350)
  const scene = page.locator('.mascot-scene')
  const setHidden = (hidden: boolean) => page.evaluate(hidden => {
    Object.defineProperty(document, 'hidden', { configurable: true, value: hidden })
    document.dispatchEvent(new Event('visibilitychange'))
  }, hidden)
  await setHidden(true)
  await expect(scene).toHaveAttribute('data-tab-active', 'false')
  const read = () => page.evaluate(() => {
    const sprite = document.querySelector('.pixel-cat-sprite[data-active=true]')!
    return {
      frame: getComputedStyle(sprite).backgroundPositionX,
      clock: sprite.getAnimations()[0]?.currentTime,
      transform: getComputedStyle(document.querySelector('.cat-character')!).transform,
      mode: document.querySelector('.mascot-scene')!.getAttribute('data-state'),
    }
  })
  const paused = await read()
  await page.clock.runFor(20000)
  expect(await read()).toEqual(paused)
  await setHidden(false)
  await expect(scene).toHaveAttribute('data-running', 'true')
  await page.clock.runFor(550)
  await expect(scene).toHaveAttribute('data-state', 'meow')
})

test('atlas cells contain artwork and rapid actions expose exactly one valid frame', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' })
  const cells = await page.evaluate(async sheets => {
    const image = new Image()
    image.src = '/mascot/cat-atlas.png'
    await image.decode()
    const canvas = document.createElement('canvas')
    canvas.width = image.width
    canvas.height = image.height
    const context = canvas.getContext('2d')!
    context.drawImage(image, 0, 0)
    return Object.entries(sheets).flatMap(([asset, sheet]) => Array.from({ length: sheet.frames }, (_, frame) => {
      const data = context.getImageData(frame * 32, sheet.row * 32, 32, 32).data
      return { asset, frame, painted: data.some((value, index) => index % 4 === 3 && value > 0) }
    }))
  }, catSprites)
  expect(cells.every(cell => cell.painted)).toBe(true)
  const samples = await page.evaluate(async sheets => {
    const buttons = document.querySelectorAll<HTMLButtonElement>('.cat-controls button')
    const samples: { visible: number; frame: number; limit: number; x: number }[] = []
    for (let frame = 0; frame < 120; frame++) {
      if (frame % 6 === 0) buttons[(frame / 6) % 3].click()
      await new Promise(requestAnimationFrame)
      const sprites = [...document.querySelectorAll<HTMLElement>('.pixel-cat-sprite')]
      const sprite = sprites.find(element => element.dataset.active === 'true')!
      const style = getComputedStyle(sprite)
      const asset = sprite.dataset.asset as keyof typeof sheets
      samples.push({
        visible: sprites.filter(element => Number(getComputedStyle(element).opacity) > 0).length,
        frame: Math.round(-parseFloat(style.backgroundPositionX) / sprite.offsetWidth),
        limit: sheets[asset].frames,
        x: new DOMMatrixReadOnly(getComputedStyle(document.querySelector('.cat-character')!).transform).m41,
      })
    }
    return samples
  }, catSprites)
  expect(samples.every(sample => sample.visible === 1 && sample.frame >= 0 && sample.frame < sample.limit)).toBe(true)
  expect(Math.max(...samples.slice(1).map((sample, index) => Math.abs(sample.x - samples[index].x)))).toBeLessThan(10)
})

test('walk to run retains the footfall phase at the rendered boundary', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Play', exact: true }).click()
  const boundary = await page.evaluate(async () => {
    const scene = document.querySelector('.mascot-scene')!
    const read = () => {
      const sprite = document.querySelector<HTMLElement>('.pixel-cat-sprite[data-active=true]')!
      return { mode: scene.getAttribute('data-state'), frame: -parseFloat(getComputedStyle(sprite).backgroundPositionX) / sprite.offsetWidth }
    }
    let previous = read()
    const deadline = performance.now() + 3500
    while (performance.now() < deadline) {
      await new Promise(requestAnimationFrame)
      const current = read()
      if (previous.mode === 'walk' && current.mode === 'run') return { previous, current }
      previous = current
    }
    return null
  })
  expect(boundary).not.toBeNull()
  const delta = Math.abs(boundary!.current.frame - boundary!.previous.frame)
  expect(Math.min(delta, 8 - delta)).toBeLessThanOrEqual(1)
})

for (const width of [320, 1440]) {
  test(`sprite grounding, square scaling, and touch controls at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')
    const scene = page.locator('.mascot-scene')
    await scene.scrollIntoViewIfNeeded()
    await expect(page.locator('.cat-stage')).toHaveCSS('opacity', '1')
    await page.getByRole('button', { name: 'Nap', exact: true }).click()
    await expect(scene).toHaveAttribute('data-state', 'sleep')
    const ground = await scene.evaluate(async element => {
      const active = element.querySelector<HTMLElement>('.pixel-cat-sprite[data-active=true]')!
      const style = getComputedStyle(active)
      const sprite = active.getBoundingClientRect()
      const floor = element.querySelector('.cat-floor')!.getBoundingClientRect()
      const image = new Image()
      image.src = '/mascot/cat-atlas.png'
      await image.decode()
      const canvas = document.createElement('canvas')
      canvas.width = canvas.height = 32
      const context = canvas.getContext('2d')!
      const frame = Math.round(-parseFloat(style.backgroundPositionX) / active.offsetWidth)
      const row = Math.round(-parseFloat(style.backgroundPositionY) / active.offsetHeight)
      context.drawImage(image, frame * 32, row * 32, 32, 32, 0, 0, 32, 32)
      const pixels = context.getImageData(0, 0, 32, 32).data
      let baseline = 0
      for (let y = 0; y < 32; y++) for (let x = 0; x < 32; x++) {
        if (pixels[(y * 32 + x) * 4 + 3]) baseline = y + 1
      }
      return { paws: sprite.top + sprite.height * baseline / 32, floor: floor.top }
    })
    expect(Math.abs(ground.paws - ground.floor)).toBeLessThan(2)
    await page.getByRole('button', { name: 'Wake', exact: true }).click()
    await expect(scene).toHaveAttribute('data-state', 'wake')
    const sprite = page.locator('.pixel-cat-sprite[data-active=true]')
    const size = await sprite.evaluate(element => ({ width: element.clientWidth, height: element.clientHeight, rendering: getComputedStyle(element).imageRendering }))
    expect(size.width).toBe(size.height)
    expect(size.rendering).toBe('pixelated')
    const controls = await page.locator('.cat-controls').boundingBox()
    const bubble = await page.locator('.cat-bubble').boundingBox()
    expect(controls!.y).toBeGreaterThan(bubble!.y + bubble!.height)
    for (const button of await page.locator('.cat-controls button').all()) {
      const box = await button.boundingBox()
      expect(box!.height).toBeGreaterThanOrEqual(44)
    }
  })
}
