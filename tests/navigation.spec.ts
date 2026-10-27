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
  await page.keyboard.press('Escape')
  await expect(glyph.locator('span').nth(1)).toHaveCSS('opacity', '1')
  await expect(glyph).toHaveCSS('transform', 'none')
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

for (const width of [375, 1440]) {
  test(`glass header stays readable and fixed in size while scrolling at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')
    const header = page.locator('.site-header')
    await expect(header).toHaveAttribute('data-scrolled', 'false')
    const alpha = () => header.evaluate(element => Number(getComputedStyle(element).backgroundColor.match(/[\d.]+/g)?.[3] ?? 1))
    const initial = await alpha()
    expect(initial).toBeLessThan(1)
    expect(initial).toBeGreaterThan(.65)
    expect(initial).toBeLessThan(width < 768 ? .85 : .78)
    const height = (await header.boundingBox())!.height
    // A deliberately bright surface beneath the glass exercises its worst-case
    // contrast, without relying on the current dark section contents.
    await page.evaluate(() => {
      const surface = document.createElement('div')
      surface.setAttribute('aria-hidden', 'true')
      surface.style.cssText = 'position:absolute;top:200px;left:0;width:100%;height:120px;background:white;z-index:1;pointer-events:none'
      document.body.append(surface)
      window.scrollTo({ top: 200, behavior: 'instant' })
    })
    await expect(header).toHaveAttribute('data-scrolled', 'true')
    await expect.poll(alpha).toBeGreaterThan(initial + .03)
    await page.waitForTimeout(350)
    const bounds = (await header.boundingBox())!
    expect(bounds.y).toBe(0)
    expect(bounds.height).toBe(height)
    const contrast = () => header.evaluate(element => {
      const background = getComputedStyle(element).backgroundColor.match(/[\d.]+/g)!.map(Number)
      const foreground = getComputedStyle(element.querySelector('.desktop-nav a')!).color.match(/[\d.]+/g)!.slice(0, 3).map(Number)
      const opacity = background[3] ?? 1
      const glass = background.slice(0, 3).map(channel => channel * opacity + 255 * (1 - opacity))
      function luminance(rgb: number[]) {
        const channels = rgb.map(value => { const normalized = value / 255; return normalized <= .04045 ? normalized / 12.92 : ((normalized + .055) / 1.055) ** 2.4 })
        return channels[0] * .2126 + channels[1] * .7152 + channels[2] * .0722
      }
      return (luminance(foreground) + .05) / (luminance(glass) + .05)
    })
    expect(await contrast()).toBeGreaterThanOrEqual(4.5)
    expect(await alpha()).toBeLessThan(width < 768 ? .9 : .88)
    // A white surface at the document top also exercises the clearer top state.
    await page.evaluate(() => {
      const surface = document.querySelector<HTMLElement>('body > div[aria-hidden=true]')!
      surface.style.top = '0'
      window.scrollTo({ top: 0, behavior: 'instant' })
    })
    await expect(header).toHaveAttribute('data-scrolled', 'false')
    await page.waitForTimeout(350)
    expect(await contrast()).toBeGreaterThanOrEqual(4.5)
  })
}

test('opaque navigation fallback works without the backdrop-filter support branch', async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => {
    function removeGlassSupport(group: CSSStyleSheet | CSSGroupingRule) {
      for (let index = group.cssRules.length - 1; index >= 0; index--) {
        const rule = group.cssRules[index]
        if (rule instanceof CSSSupportsRule && rule.conditionText.includes('backdrop-filter')) group.deleteRule(index)
        else if (rule instanceof CSSGroupingRule) removeGlassSupport(rule)
      }
    }
    for (const sheet of document.styleSheets) removeGlassSupport(sheet)
  })
  await expect(page.locator('.site-header')).toHaveCSS('background-color', 'rgb(29, 43, 64)')
  await expect(page.locator('.site-header')).toHaveCSS('backdrop-filter', 'none')
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Selected work', exact: true }).click()
  await expect(page).toHaveURL(/#projects$/)
  await expect(page.locator('#nextick')).toBeVisible()
})

test('mobile navigation removes hidden links from keyboard order and closes with Escape', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/')
  const menu = page.getByRole('button', { name: /^(Open|Close) navigation$/ })
  await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toBeHidden()
  await menu.click()
  await expect(menu).toHaveAttribute('aria-expanded', 'true')
  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: 'About', exact: true })).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(menu).toBeFocused()
  await expect(menu).toHaveAttribute('aria-expanded', 'false')
  await page.locator('#skills').scrollIntoViewIfNeeded()
  await menu.click()
  const contact = page.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('link', { name: 'Contact', exact: true })
  expect(await contact.evaluate(element => {
    const bounds = element.getBoundingClientRect()
    return element.contains(document.elementFromPoint(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2))
  })).toBe(true)
  await page.keyboard.press('Escape')
  await expect(menu).toBeFocused()
  await menu.click()
  await page.getByRole('link', { name: 'Selected work', exact: true }).click()
  await expect(page).toHaveURL(/#projects$/)
  await expect(menu).toHaveAttribute('aria-expanded', 'false')
})
