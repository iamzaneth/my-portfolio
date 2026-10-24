import { expect, test } from '@playwright/test'
import { catAnimations, catRoutines, type CatRoutineId } from '../src/features/mascot/catConfig'

for (const action of ['pet', 'play'] as const) {
  test(`${action} visits all four routines per cycle without adjacent repeats`, async ({ page }) => {
    await page.goto('/')
    const scene = page.locator('.mascot-scene')
    const button = page.getByRole('button', { name: action === 'pet' ? 'Pet' : 'Play', exact: true })
    const visited: string[] = []
    for (let index = 0; index < 8; index++) {
      await button.click()
      await expect(scene).toHaveAttribute('data-action', action)
      if (visited.length) await expect(scene).not.toHaveAttribute('data-routine', visited[visited.length - 1])
      visited.push((await scene.getAttribute('data-routine'))!)
    }
    expect(new Set(visited.slice(0, 4)).size).toBe(4)
    expect(new Set(visited.slice(4)).size).toBe(4)
  })

  test(`${action} completes each multi-step routine and stays inside the mobile viewport`, async ({ page }) => {
    await page.setViewportSize({ width: action === 'play' ? 320 : 375, height: 900 })
    await page.clock.install()
    await page.goto('/')
    const scene = page.locator('.mascot-scene')
    const button = page.getByRole('button', { name: action === 'pet' ? 'Pet' : 'Play', exact: true })
    const completed: CatRoutineId[] = []
    for (let index = 0; index < 4; index++) {
      await button.click()
      const routine = (await scene.getAttribute('data-routine')) as CatRoutineId
      completed.push(routine)
      for (const mode of catRoutines[routine].steps) {
        await expect(scene).toHaveAttribute('data-state', mode)
        const duration = catAnimations[mode].after!
        for (let elapsed = 0; elapsed < duration; elapsed += 200) {
          await page.clock.runFor(Math.min(200, duration - elapsed))
          expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
        }
        await page.clock.runFor(40)
      }
      await expect(scene).toHaveAttribute('data-state', 'idle')
      await expect(scene).toHaveAttribute('data-routine', 'none')
    }
    expect(new Set(completed).size).toBe(4)
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
