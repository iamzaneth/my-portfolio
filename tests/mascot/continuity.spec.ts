import { expect, test } from '@playwright/test'
import { catReducer, initialCatState } from '../../src/features/mascot/catState'

// This checks actual semantic boundaries: an uninterrupted wake ends seated,
// and a newer intention cannot restart its clip or revive a stale intention.
test('queued requests finish the current posture bridge and ignore retired timers', () => {
  let state = catReducer(initialCatState, { type: 'nap' })
  while (state.mode !== 'sleep') state = catReducer(state, { type: 'finish', version: state.version })
  state = catReducer(state, { type: 'play', routine: 'zoomies' })
  expect(state.mode).toBe('wake')
  const wakingVersion = state.version
  state = catReducer(state, { type: 'pet', routine: 'biscuitTime' })
  expect(state.version).toBe(wakingVersion)
  expect(state.pending).toBe('biscuitTime')
  state = catReducer(state, { type: 'finish', version: wakingVersion })
  expect(state.mode).toBe('headTilt')
  expect(catReducer(state, { type: 'finish', version: wakingVersion })).toBe(state)
  const modes: string[] = []
  while (state.mode !== 'idle') {
    modes.push(state.mode)
    state = catReducer(state, { type: 'finish', version: state.version })
  }
  expect(modes).toEqual(['headTilt', 'knead', 'purr', 'standUp'])
})

test('sleep, wake, and standing clips connect through their matching end poses', async ({ page }) => {
  await page.clock.install()
  await page.goto('/')
  const scene = page.locator('.mascot-scene')
  const sprite = page.locator('.pixel-cat-sprite[data-active=true]')
  await page.getByRole('button', { name: 'Nap', exact: true }).click()
  await page.clock.runFor(420)
  await expect(scene).toHaveAttribute('data-state', 'sitDown')
  await expect(sprite).toHaveAttribute('data-from', '0')
  await expect(sprite).toHaveAttribute('data-to', '4')
  await page.clock.runFor(540)
  await expect(scene).toHaveAttribute('data-state', 'lieDown')
  await expect(sprite).toHaveAttribute('data-from', '4')
  await expect(sprite).toHaveAttribute('data-to', '7')
  await page.clock.runFor(500)
  await expect(scene).toHaveAttribute('data-state', 'sleep')
  await page.getByRole('button', { name: 'Play', exact: true }).click()
  await expect(scene).toHaveAttribute('data-state', 'wake')
  await expect(sprite).toHaveAttribute('data-asset', 'lieDown')
  await expect(sprite).toHaveAttribute('data-from', '7')
  await expect(sprite).toHaveAttribute('data-to', '4')
  await page.clock.runFor(1420)
  await expect(scene).toHaveAttribute('data-state', 'standUp')
  await expect(sprite).toHaveAttribute('data-from', '4')
  await expect(sprite).toHaveAttribute('data-to', '0')
  await page.clock.runFor(560)
  await expect(scene).toHaveAttribute('data-state', 'walk')
})

test('offscreen pauses retain the motion, sprite frame, and remaining action time', async ({ page }) => {
  await page.clock.install()
  await page.goto('/')
  const scene = page.locator('.mascot-scene')
  await page.getByRole('button', { name: 'Pet', exact: true }).click()
  await page.clock.runFor(520)
  await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }))
  await page.clock.runFor(70)
  await expect(scene).toHaveAttribute('data-running', 'false')
  const pose = () => page.evaluate(() => ({
    transform: getComputedStyle(document.querySelector('.cat-character')!).transform,
    frame: getComputedStyle(document.querySelector('.pixel-cat-sprite[data-active=true]')!).backgroundPositionX,
    mode: document.querySelector('.mascot-scene')!.getAttribute('data-state'),
  }))
  const paused = await pose()
  await page.clock.runFor(15000)
  expect(await pose()).toEqual(paused)
  await page.locator('.mascot-scene').scrollIntoViewIfNeeded()
  await page.clock.runFor(60)
  await expect(scene).toHaveAttribute('data-running', 'true')
  await page.clock.runFor(380)
  await expect(scene).toHaveAttribute('data-state', 'meow')
})

test('changing walking speed retains footfall phase and world position', async ({ page }) => {
  await page.addInitScript(() => { Math.random = () => 0 })
  await page.goto('/')
  await page.getByRole('button', { name: 'Play', exact: true }).click()
  await page.waitForTimeout(950)
  const continuity = await page.evaluate(async () => {
    // Freeze only the sprite clock while measuring the speed-change boundary.
    // A live animation can naturally cross a frame during the awaited paint.
    document.querySelector('.pixel-cat-sprite[data-active=true]')!.getAnimations().forEach(animation => animation.pause())
    const read = () => {
      const sprite = document.querySelector('.pixel-cat-sprite[data-active=true]')!
      return {
        frame: getComputedStyle(sprite).backgroundPositionX,
        x: new DOMMatrixReadOnly(getComputedStyle(document.querySelector('.cat-character')!).transform).m41,
        asset: sprite.getAttribute('data-asset'),
      }
    }
    const before = read()
    document.querySelector<HTMLButtonElement>('.cat-controls button:nth-child(2)')!.click()
    await new Promise(requestAnimationFrame)
    return { before, after: read(), mode: document.querySelector('.mascot-scene')!.getAttribute('data-state') }
  })
  expect(continuity.mode).toBe('prowl')
  expect(continuity.after.asset).toBe('walk')
  expect(continuity.after.frame).toBe(continuity.before.frame)
  expect(Math.abs(continuity.after.x - continuity.before.x)).toBeLessThan(3)
})

test('interrupting a jump lands from the current height without a ground snap', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Pet', exact: true }).click()
  await page.waitForTimeout(350)
  const samples = await page.evaluate(async () => {
    const character = document.querySelector('.cat-character')!
    const read = () => new DOMMatrixReadOnly(getComputedStyle(character).transform).m42
    const before = read()
    document.querySelector<HTMLButtonElement>('.cat-controls button:nth-child(2)')!.click()
    await new Promise(requestAnimationFrame)
    return { before, after: read() }
  })
  expect(samples.before).toBeLessThan(-30)
  expect(Math.abs(samples.after - samples.before)).toBeLessThan(8)
  await page.waitForTimeout(450)
  expect(await page.locator('.cat-character').evaluate((element) => new DOMMatrixReadOnly(getComputedStyle(element).transform).m42)).toBeCloseTo(0, 1)
})

test('mobile locomotion keeps the full running silhouette inside the stage', async ({ page }) => {
  await page.clock.install()
  for (const width of [320, 375, 430]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')
    await page.getByRole('button', { name: 'Play', exact: true }).click()
    for (let elapsed = 0; elapsed < 4000; elapsed += 160) {
      await page.clock.runFor(160)
      const bounds = await page.evaluate(() => {
        const stage = document.querySelector('.cat-stage')!.getBoundingClientRect()
        const sprite = document.querySelector('.pixel-cat-sprite[data-active=true]')!
        const box = sprite.getBoundingClientRect()
        // The running silhouette spans columns 1..30; both facing directions
        // have the same symmetric envelope. This also includes landing tilt.
        const inset = box.width / 32
        return { left: box.left + inset - stage.left, right: stage.right - box.right + inset }
      })
      expect(bounds.left, `${width}px left edge`).toBeGreaterThanOrEqual(-1)
      expect(bounds.right, `${width}px right edge`).toBeGreaterThanOrEqual(-1)
    }
  }
})
