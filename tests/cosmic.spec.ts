import { expect, test } from '@playwright/test'

for (const width of [320, 375, 430, 768, 1024, 1440, 1920]) {
  test(`five distinct, static decorative scenes preserve layout and content at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    await expect(page.locator('.cosmic-world')).toHaveCount(5)
    const ids = ['home', 'about', 'skills', 'projects', 'contact']
    const worlds = ['home', 'about', 'toolkit', 'projects', 'contact']
    const silhouettes: string[] = []
    for (const [index, id] of ids.entries()) {
      const section = page.locator(`#${id}`)
      await section.scrollIntoViewIfNeeded()
      const art = section.locator('.cosmic-world')
      await expect(art).toHaveAttribute('data-cosmic-world', worlds[index])
      await expect(art).toHaveAttribute('aria-hidden', 'true')
      await expect(art).toHaveCSS('pointer-events', 'none')
      const svg = art.locator(width < 768 ? '.cosmic-mobile' : '.cosmic-desktop')
      await expect(svg).toBeVisible()
      silhouettes.push(await svg.locator('path').evaluateAll(paths => paths.map(path => path.getAttribute('d')).join('|')))
      expect(await art.evaluate(element => element.getAnimations({ subtree: true }).length)).toBe(0)
      const sizes = await section.evaluate(element => {
        const section = element.getBoundingClientRect(), art = element.querySelector('.cosmic-world')!.getBoundingClientRect()
        return { section: section.height, art: art.height }
      })
      expect(sizes.art).toBeCloseTo(sizes.section, 0)
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
      expect(await art.locator('a, button, [tabindex]').count()).toBe(0)
    }
    expect(new Set(silhouettes).size).toBe(5)
    await expect(page.locator('.comet-cursor')).toBeHidden()
  })
}
