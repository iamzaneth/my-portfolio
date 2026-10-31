import { expect, test, type Page } from '@playwright/test'
import sharp from 'sharp'

// Resolve browser colors (including color-mix) and composite transparent
// ancestors, so checks use each component's actual surface and interaction.
async function renderedContrast(page: Page, selector: string, paint: 'color' | 'backgroundColor' | 'borderTopColor' = 'color') {
  return page.locator(selector).evaluateAll((elements, paint) => {
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = 1
    const context = canvas.getContext('2d', { willReadFrequently: true })!
    const rgba = (color: string) => {
      context.clearRect(0, 0, 1, 1)
      context.fillStyle = color
      context.fillRect(0, 0, 1, 1)
      return [...context.getImageData(0, 0, 1, 1).data].map((value, index) => index === 3 ? value / 255 : value)
    }
    const composite = (front: number[], back: number[]) => front.slice(0, 3).map((value, index) => value * front[3] + back[index] * (1 - front[3])).concat(1)
    const luminance = (color: number[]) => color.slice(0, 3).map(value => {
      const s = value / 255
      return s <= .04045 ? s / 12.92 : ((s + .055) / 1.055) ** 2.4
    }).reduce((sum, value, index) => sum + value * [.2126, .7152, .0722][index], 0)
    return elements.map(element => {
      const ancestors = []
      for (let current: Element | null = element; current; current = current.parentElement) ancestors.unshift(current)
      const backdrop = paint === 'backgroundColor' ? ancestors.slice(0, -1) : ancestors
      const background = backdrop.reduce((back, current) => composite(rgba(getComputedStyle(current).backgroundColor), back), [0, 0, 0, 1])
      const foreground = composite(rgba(getComputedStyle(element)[paint]), background)
      const values = [luminance(foreground), luminance(background)].sort((a, b) => b - a)
      return { text: element.textContent?.trim(), ratio: (values[0] + .05) / (values[1] + .05) }
    })
  }, paint)
}

for (const width of [375, 1440]) {
  test(`rendered text retains AA contrast across surfaces and states at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    const samples = await renderedContrast(page, '.hero-description, .hero-role, .scene-coordinate, .scene-coordinate-right > span, .profile-card-top > span, .profile-fields dt, .profile-code, .about-current > span, .skill-description, .skill-focus, .skill-number, .skill-card .tech-list li, .skill-practice summary, .toolkit-footnote, .project-meta > span, .project-summary, .preview-stage, .project-card-stack li, .project-details-button, .contact-description, .contact-email, .footer > span, .cat-bubble, .cat-controls button, .scene-caption, .cat-hint')
    for (const card of await page.locator('.skill-card').all()) {
      await card.locator('summary').click()
      await card.locator('summary').hover()
      samples.push(...await renderedContrast(page, '.skill-practice summary[aria-expanded=true], .skill-practice[open] p'))
    }
    await page.locator('.project-card').hover()
    samples.push(...await renderedContrast(page, '.project-card .project-summary, .project-card .project-details-button, .project-card .text-link'))
    await page.getByRole('button', { name: 'View details: NexTick' }).click()
    samples.push(...await renderedContrast(page, '.project-dialog-toolbar > span, .project-description, .project-story dd, .project-highlights li, .stage-detail, .pipeline-inspector p, .stage-output'))
    await testInfo.attach('rendered-contrast.json', { body: JSON.stringify(samples, null, 2), contentType: 'application/json' })
    console.log('Rendered contrast sample:', JSON.stringify({ width, samples: samples.length, minimum: Math.min(...samples.map(sample => sample.ratio)) }))
    expect(samples.length).toBeGreaterThan(40)
    expect(samples.filter(sample => sample.ratio < 4.5)).toEqual([])
  })
}

for (const width of [320, 375, 768, 1440]) {
  test(`orbit paints a distinguishable stroke above ambient light at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    await page.locator('.mascot-scene').scrollIntoViewIfNeeded()
    const ring = await page.locator('.scene-orbit').boundingBox()
    // The exposed left arc avoids the character, markers, dialogue and guides.
    const clip = { x: Math.floor(ring!.x - 2), y: Math.floor(ring!.y + ring!.height / 2 - 55), width: 18, height: 40 }
    const visible = await page.screenshot({ clip })
    await page.locator('.scene-orbit-clip').evaluate(element => { (element as HTMLElement).style.visibility = 'hidden' })
    const hidden = await page.screenshot({ clip })
    const before = await sharp(hidden).removeAlpha().raw().toBuffer()
    const after = await sharp(visible).removeAlpha().raw().toBuffer()
    let definedPixels = 0
    for (let index = 0; index < before.length; index += 3) {
      if (Math.max(...[0, 1, 2].map(channel => Math.abs(before[index + channel] - after[index + channel]))) >= 30) definedPixels++
    }
    await testInfo.attach('exposed-orbit.png', { body: visible, contentType: 'image/png' })
    expect(definedPixels).toBeGreaterThan(12)
  })
}

for (const width of [375, 1440]) {
  test(`meaningful icons and control outlines retain non-text contrast at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    const samples = await renderedContrast(page, '.wordmark svg, .hero-actions svg, .hero-socials svg, .scroll-icon svg, .cat-controls svg, .skill-emblem svg, .skill-practice summary svg, .project-actions svg, .contact-arrow svg, .contact-details svg, .back-top svg')
    samples.push(...await renderedContrast(page, '.hero-contact, .cat-controls button, .project-details-button', 'borderTopColor'))
    samples.push(...await renderedContrast(page, '.preview-node', 'backgroundColor'))
    await page.getByRole('button', { name: 'View details: NexTick' }).click()
    for (const node of await page.locator('.pipeline-stage').all()) {
      await node.focus()
      await page.keyboard.press('Enter')
      await node.hover()
      samples.push(...await renderedContrast(page, '.stage-icon svg, .project-dialog-close svg, .stage-output svg'))
      samples.push(...await renderedContrast(page, '.stage-icon', 'borderTopColor'))
    }
    await testInfo.attach('non-text-contrast.json', { body: JSON.stringify(samples, null, 2), contentType: 'application/json' })
    console.log('Non-text contrast sample:', JSON.stringify({ width, samples: samples.length, minimum: Math.min(...samples.map(sample => sample.ratio)) }))
    expect(samples.filter(sample => sample.ratio < 3)).toEqual([])
  })
}
