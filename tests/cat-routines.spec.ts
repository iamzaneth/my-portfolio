import { expect, test } from '@playwright/test'
import { catRoutines, type CatRoutineId } from '../src/features/mascot/catConfig'

for (const action of ['pet', 'play'] as const) {
  const count = Object.values(catRoutines).filter((routine) => routine.action === action).length
  test(`${action} visits all ${count} routines per cycle without adjacent repeats`, async ({ page }) => {
    await page.goto('/')
    const scene = page.locator('.mascot-scene')
    const button = page.getByRole('button', { name: action === 'pet' ? 'Pet' : 'Play', exact: true })
    const visited: string[] = []
    for (let index = 0; index < count * 2; index++) {
      await button.click()
      await expect(scene).toHaveAttribute('data-action', action)
      if (visited.length) await expect(scene).not.toHaveAttribute('data-routine', visited[visited.length - 1])
      visited.push((await scene.getAttribute('data-routine'))!)
    }
    expect(new Set(visited.slice(0, count)).size).toBe(count)
    expect(new Set(visited.slice(count)).size).toBe(count)
  })

  test(`${action} completes each multi-step routine and stays inside the mobile viewport`, async ({ page }) => {
    await page.setViewportSize({ width: action === 'play' ? 320 : 375, height: 900 })
    await page.clock.install()
    await page.goto('/')
    const scene = page.locator('.mascot-scene')
    const button = page.getByRole('button', { name: action === 'pet' ? 'Pet' : 'Play', exact: true })
    const completed: CatRoutineId[] = []
    for (let index = 0; index < count; index++) {
      await button.click()
      const routine = (await scene.getAttribute('data-routine')) as CatRoutineId
      completed.push(routine)
      const observed: string[] = []
      for (let elapsed = 0; elapsed < 30000; elapsed += 160) {
        const mode = (await scene.getAttribute('data-state'))!
        if (observed[observed.length - 1] !== mode) observed.push(mode)
        if (mode === 'idle') break
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
        await page.clock.runFor(160)
      }
      let cursor = 0
      for (const expected of catRoutines[routine].steps) {
        const index = observed.indexOf(expected, cursor)
        expect(index, `${routine}: missing ${expected} in ${observed.join(' → ')}`).toBeGreaterThanOrEqual(cursor)
        cursor = index + 1
      }
      await expect(scene).toHaveAttribute('data-state', 'idle')
      await expect(scene).toHaveAttribute('data-routine', 'none')
    }
    expect(new Set(completed).size).toBe(count)
  })
}

test('a new request during waking replaces the old queued routine', async ({ page }) => {
  await page.goto('/')
  const scene = page.locator('.mascot-scene')
  await page.getByRole('button', { name: 'Nap', exact: true }).click()
  await expect(scene).toHaveAttribute('data-state', 'sleep')
  await page.getByRole('button', { name: 'Play', exact: true }).click()
  await expect(scene).toHaveAttribute('data-state', 'wake')
  await expect(scene).toHaveAttribute('data-action', 'play')
  await page.getByRole('button', { name: 'Pet', exact: true }).click()
  await expect(scene).toHaveAttribute('data-state', 'wake')
  await expect(scene).toHaveAttribute('data-routine', 'happyHop')
  await expect(scene).toHaveAttribute('data-state', 'jump')
  await expect(scene).toHaveAttribute('data-state', 'meow')
  await expect(scene).toHaveAttribute('data-state', 'idle')
  await expect(scene).toHaveAttribute('data-routine', 'none')
})

test('mobile submenu links provide hover, keyboard focus, and pressed feedback', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/')
  await page.getByRole('button', { name: 'Open navigation' }).click()
  const menu = page.getByRole('navigation', { name: 'Mobile navigation' })
  const links = menu.getByRole('link')
  const backgrounds = await links.evaluateAll((elements) => elements.map((element) => getComputedStyle(element).backgroundColor))
  for (let index = 0; index < await links.count(); index++) {
    await links.nth(index).hover()
    await expect(links.nth(index)).not.toHaveCSS('background-color', backgrounds[index])
  }
  await page.mouse.move(0, 0)
  await page.keyboard.press('Tab')
  const first = links.first()
  await expect(first).toBeFocused()
  await expect(first).not.toHaveCSS('background-color', backgrounds[0])
  await expect(first).toHaveCSS('outline-style', 'solid')
  await first.hover()
  await page.waitForTimeout(250)
  const hoverColor = await first.evaluate((element) => getComputedStyle(element).backgroundColor)
  await page.mouse.down()
  await expect(first).not.toHaveCSS('background-color', hoverColor)
  await page.mouse.up()
  await expect(menu).toBeHidden()
  await expect(page).toHaveURL(/#about$/)
})
