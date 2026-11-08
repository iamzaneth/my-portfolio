import { expect, test, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import sharp from 'sharp'

const flip = (page: Page) => page.getByRole('button', { name: 'Flip card: Zaneth identity', exact: true })
const settle = (page: Page, back: boolean) => expect.poll(() => page.locator('.identity-body').evaluate(element => {
  const matrix = new DOMMatrixReadOnly(getComputedStyle(element).transform)
  return Math.round(matrix.m11 * 1000) / 1000
})).toBe(back ? -1 : 1)

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/#about')
  await page.evaluate(() => document.fonts.ready)
  await expect(page.locator('.identity-reveal')).toHaveCSS('opacity', '1')
})

test('portrait loads on the initial front; verified details are exposed only on the back', async ({ page }) => {
  await expect(flip(page)).toHaveAttribute('aria-pressed', 'false')
  const portrait = page.getByRole('img', { name: 'Portrait of Tran Thien Phuc' })
  await expect(portrait).toBeVisible()
  expect(await portrait.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true)
  expect(await portrait.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBe(720)
  await expect(page.locator('.identity-front')).toContainText('AI Engineering / Data Engineering')
  await expect(page.locator('.identity-front')).toContainText('ZANETH.')
  await expect(page.locator('.identity-front')).toContainText('STUDENT')
  await expect(page.locator('.identity-front')).toContainText('Tran Thien Phuc')
  await expect(page.getByRole('term')).toHaveCount(0)
  await flip(page).click()
  await settle(page, true)
  await expect(page.getByRole('term')).toHaveText(['Name', 'Alias', 'Location', 'Focus', 'Approach', 'Exploring'])
  await expect(page.getByRole('definition')).toHaveText([
    'Tran Thien Phuc', 'Zaneth', 'Ho Chi Minh City, Vietnam', 'AI Engineering / Data Engineering',
    'Learn. Build. Understand.', 'Streaming infrastructure & intelligent applications',
  ])
  await expect(page.getByRole('img', { name: 'Portrait of Tran Thien Phuc' })).toHaveCount(0)
  await expect(page.locator('.identity-front')).toHaveAttribute('inert', '')
  await expect(page.locator('.identity-stage a')).toHaveCount(0)
  await flip(page).click()
  await settle(page, false)
  await expect(flip(page)).toHaveAttribute('aria-pressed', 'false')
  await expect(portrait).toBeVisible()
})

test('rapid real clicks resolve predictably without extra spins, focus loss, or layout changes', async ({ page }) => {
  const before = await page.locator('#about').evaluate(e => ({ height: e.offsetHeight, top: e.offsetTop, scroll: scrollY }))
  const bounds = await flip(page).boundingBox()
  for (let i = 0; i < 9; i++) await page.mouse.click(bounds!.x + bounds!.width / 2, bounds!.y + bounds!.height / 2)
  await settle(page, true)
  await expect(flip(page)).toHaveAttribute('aria-pressed', 'true')
  await expect(flip(page)).toBeFocused()
  for (let i = 0; i < 3; i++) await page.mouse.click(bounds!.x + bounds!.width / 2, bounds!.y + bounds!.height / 2)
  await settle(page, false)
  expect(await page.locator('#about').evaluate(e => ({ height: e.offsetHeight, top: e.offsetTop, scroll: scrollY }))).toEqual(before)
  await expect(page.locator('#about')).toHaveAttribute('data-compact', 'true')
})

test('Tab, Enter and Space retain focus, announce the face, and leave via the toolkit link', async ({ page }) => {
  await page.getByRole('link', { name: 'Meet my toolkit' }).focus()
  await page.keyboard.press('Shift+Tab')
  await expect(flip(page)).toBeFocused()
  expect(await flip(page).evaluate(e => e.matches(':focus-visible'))).toBe(true)
  await expect(flip(page)).toHaveCSS('outline-style', 'solid')
  await page.keyboard.press('Enter')
  await settle(page, true)
  await expect(flip(page)).toBeFocused()
  await expect(page.locator('.identity-stage [role=status]')).toHaveText('Back: personal and technical details.')
  await page.keyboard.press('Space')
  await settle(page, false)
  await expect(flip(page)).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: 'Meet my toolkit' })).toBeFocused()
})

test('live reduced motion stops floating and tilt while keeping instant flips and both faces accessible', async ({ page }) => {
  const bounds = await flip(page).boundingBox()
  await page.mouse.move(bounds!.x + 20, bounds!.y + 20)
  await expect.poll(() => page.locator('.identity-tilt').evaluate(e => (e as HTMLElement).style.getPropertyValue('--pointer-x'))).not.toBe('')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(page.locator('.identity-float')).toHaveCSS('animation-name', 'none')
  await expect(page.locator('.identity-body')).toHaveCSS('transition-duration', '0s')
  const rest = await page.locator('.identity-tilt').evaluate(e => getComputedStyle(e).transform)
  await page.mouse.move(bounds!.x + bounds!.width - 10, bounds!.y + 60)
  expect(await page.locator('.identity-tilt').evaluate(e => getComputedStyle(e).transform)).toBe(rest)
  for (const back of [true, false]) {
    await flip(page).click()
    await settle(page, back)
    const accessibility = await new AxeBuilder({ page }).include('#about').analyze()
    expect(accessibility.violations).toEqual([])
  }
})

test('rounded protective shell, recessed inserts and connecting walls preserve the solid geometry', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const geometry = await page.locator('.identity-body').evaluate(body => {
    const front = new DOMMatrixReadOnly(getComputedStyle(body.querySelector('.identity-front')!).transform)
    const back = new DOMMatrixReadOnly(getComputedStyle(body.querySelector('.identity-back')!).transform)
    const vertices = (edge: HTMLElement) => {
      const style = getComputedStyle(edge), matrix = new DOMMatrixReadOnly(style.transform)
      const [ox, oy] = style.transformOrigin.split(' ').map(parseFloat)
      const width = parseFloat(style.width), height = parseFloat(style.height)
      const points = [[0, 0], [width, 0], [0, height], [width, height]].map(([x, y]) => {
        const point = new DOMPoint(x - ox, y - oy).matrixTransform(matrix)
        return { x: parseFloat(style.left) + ox + point.x, y: parseFloat(style.top) + oy + point.y, z: point.z }
      })
      return { edge: edge.dataset.edge, points }
    }
    const walls = [...body.querySelectorAll<HTMLElement>('.identity-edge')].map(vertices)
    const wells = [...body.querySelectorAll<HTMLElement>('.identity-well')].map(vertices)
    const shells = [...body.querySelectorAll('.identity-shell')].map(e => ({
      z: new DOMMatrixReadOnly(getComputedStyle(e).transform).m43,
      border: parseFloat(getComputedStyle(e).borderTopWidth), radius: parseFloat(getComputedStyle(e).borderTopLeftRadius),
    }))
    const structural = [...document.querySelectorAll('.identity-float, .identity-scene, .identity-tilt, .identity-body')].map(e => {
      const s = getComputedStyle(e)
      return { preserve: s.transformStyle, overflow: s.overflow, opacity: s.opacity, filter: s.filter, backdrop: s.backdropFilter,
        clip: s.clipPath, isolation: s.isolation, contain: s.contain, blend: s.mixBlendMode }
    })
    const size = getComputedStyle(body)
    return { front: front.m43, back: back.m43, outward: back.m11, width: parseFloat(size.width), height: parseFloat(size.height), walls, wells, shells, structural }
  })
  expect(geometry.front).toBe(3.5)
  expect(geometry.back).toBe(-3.5)
  expect(geometry.outward).toBe(-1)
  expect(geometry.shells).toEqual([{ z: 5, border: 12, radius: 24 }, { z: -5, border: 12, radius: 24 }])
  expect(geometry.walls.slice(0, 4).map(w => w.edge)).toEqual(['left', 'right', 'top', 'bottom'])
  expect(geometry.walls).toHaveLength(24)
  expect(geometry.wells).toHaveLength(48)
  for (const wall of geometry.walls) {
    expect(Math.min(...wall.points.map(p => p.z))).toBeCloseTo(-5, 2)
    expect(Math.max(...wall.points.map(p => p.z))).toBeCloseTo(5, 2)
    for (const p of wall.points) {
      expect(p.x).toBeGreaterThanOrEqual(-.02)
      expect(p.x).toBeLessThanOrEqual(geometry.width + .02)
      expect(p.y).toBeGreaterThanOrEqual(-.02)
      expect(p.y).toBeLessThanOrEqual(geometry.height + .02)
      // Endpoints meet straight tangent lines or the true 24px corner circle.
      const x = Math.min(p.x, geometry.width - p.x), y = Math.min(p.y, geometry.height - p.y)
      expect(Math.min(Math.abs(x), Math.abs(y), Math.abs(Math.hypot(x - 24, y - 24) - 24))).toBeLessThan(.03)
    }
  }
  for (const wall of geometry.wells) {
    const z = wall.points.map(p => p.z), back = Math.max(...z) < 0
    expect(Math.min(...z)).toBeCloseTo(back ? -5 : 3.5, 2)
    expect(Math.max(...z)).toBeCloseTo(back ? -3.5 : 5, 2)
    for (const p of wall.points) {
      const x = Math.min(p.x, geometry.width - p.x), y = Math.min(p.y, geometry.height - p.y)
      expect(x).toBeGreaterThanOrEqual(11.98)
      expect(y).toBeGreaterThanOrEqual(11.98)
      expect(Math.min(Math.abs(x - 12), Math.abs(y - 12), Math.abs(Math.hypot(x - 24, y - 24) - 12))).toBeLessThan(.03)
    }
  }
  for (const s of geometry.structural) expect(s).toEqual({ preserve: 'preserve-3d', overflow: 'visible', opacity: '1', filter: 'none', backdrop: 'none', clip: 'none', isolation: 'auto', contain: 'none', blend: 'normal' })
  await expect(page.locator('.identity-scene')).toHaveCSS('perspective', '1100px')
})

for (const width of [375, 1440]) {
  test(`real wall pixels remain visible at oblique and edge-on angles at ${width}px`, async ({ page }, info) => {
    await page.setViewportSize({ width, height: 900 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.addStyleTag({ content: '.identity-tilt{transform:none!important}.identity-body{transition:none!important}' })
    await page.locator('.identity-stage').scrollIntoViewIfNeeded()
    for (const angle of [0, 30, 60, 90, 120, 180]) {
      await page.locator('.identity-body').evaluate((e, angle) => { (e as HTMLElement).style.transform = `rotateY(${angle}deg)` }, angle)
      const stage = page.locator('.identity-stage')
      const visible = await stage.screenshot()
      await info.attach(`card-${width}-${angle}.png`, { body: visible, contentType: 'image/png' })
      if ([30, 60, 90, 120].includes(angle)) {
        await page.locator('.identity-edge').evaluateAll(edges => edges.forEach(e => { (e as HTMLElement).style.visibility = 'hidden' }))
        const hidden = await stage.screenshot()
        await page.locator('.identity-edge').evaluateAll(edges => edges.forEach(e => { (e as HTMLElement).style.removeProperty('visibility') }))
        const a = await sharp(visible).removeAlpha().raw().toBuffer()
        const b = await sharp(hidden).removeAlpha().raw().toBuffer()
        let pixels = 0
        for (let i = 0; i < a.length; i += 3) if (Math.max(...[0, 1, 2].map(c => Math.abs(a[i + c] - b[i + c]))) > 20) pixels++
        expect(pixels, `Actual wall pixels at ${angle}°`).toBeGreaterThan(300)
      }
      if (angle === 90) {
        const edge = await page.locator('.identity-edge-left').boundingBox()
        expect(edge!.width).toBeGreaterThan(10)
        expect(edge!.width).toBeLessThan(13)
        expect(edge!.height).toBeGreaterThan(390)
      }
    }
  })
}

for (const width of [320, 375, 430, 768, 1024, 1440, 1920]) {
  test(`both faces fit their footprint with no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.locator('.identity-stage').scrollIntoViewIfNeeded()
    for (const back of [false, true]) {
      if (back) await flip(page).click()
      const geometry = await page.locator('.identity-stage').evaluate(stage => {
        const active = stage.querySelector<HTMLElement>('.identity-face[aria-hidden=false]')!
        return { overflow: document.documentElement.scrollWidth > innerWidth, clipped: active.scrollHeight > active.clientHeight + 1,
          clippedText: [...active.querySelectorAll('p, h3, dd')].filter(e => e.scrollWidth > e.clientWidth + 1).map(e => e.textContent),
          bounds: stage.getBoundingClientRect().toJSON() }
      })
      expect(geometry.overflow).toBe(false)
      expect(geometry.clipped).toBe(false)
      expect(geometry.clippedText).toEqual([])
      expect(geometry.bounds.left).toBeGreaterThan(10)
      expect(geometry.bounds.right).toBeLessThan(width - 10)
    }
    const type = await page.locator('.identity-body').evaluate(body => {
      const front = body.querySelector<HTMLElement>('.identity-front')!, portrait = body.querySelector<HTMLElement>('.identity-portrait')!
      const frontRect = front.getBoundingClientRect(), portraitRect = portrait.getBoundingClientRect()
      return { width: parseFloat(getComputedStyle(body).width), height: parseFloat(getComputedStyle(body).height),
        portrait: portraitRect.height / frontRect.height,
        portraitWidth: portraitRect.width / frontRect.width,
        title: parseFloat(getComputedStyle(body.querySelector('.identity-brand')!).fontSize),
        name: parseFloat(getComputedStyle(body.querySelector('.identity-front-bottom h3')!).fontSize),
        role: parseFloat(getComputedStyle(body.querySelector('.identity-front-bottom p')!).fontSize),
        labels: parseFloat(getComputedStyle(body.querySelector('.identity-fields dt')!).fontSize),
        values: parseFloat(getComputedStyle(body.querySelector('.identity-fields > div:nth-child(2) dd')!).fontSize),
        fonts: document.fonts.check('650 20px Manrope') && document.fonts.check('400 11px "IBM Plex Mono"'),
        objectFit: getComputedStyle(body.querySelector('.identity-portrait img')!).objectFit,
        hasOpaqueHeader: !!body.querySelector('.identity-front > .identity-header'),
        hasOpaqueName: !!body.querySelector('.identity-front > .identity-name'),
      }
    })
    expect(type.width / type.height).toBeCloseTo(.7, 2)
    // Full-bleed portrait: fills entire printable face
    expect(type.portrait).toBeGreaterThanOrEqual(.95)
    expect(type.portraitWidth).toBeGreaterThanOrEqual(.99)
    expect(type.objectFit).toBe('cover')
    // No separate opaque header or footer blocks
    expect(type.hasOpaqueHeader).toBe(false)
    expect(type.hasOpaqueName).toBe(false)
    expect(type.title).toBeGreaterThanOrEqual(24)
    expect(type.name).toBeGreaterThanOrEqual(16)
    expect(type.role).toBeGreaterThanOrEqual(10)
    expect(type.labels).toBeGreaterThanOrEqual(10)
    expect(type.values).toBeGreaterThanOrEqual(12)
    expect(type.fonts).toBe(true)
    expect(type.width).toBeCloseTo(width >= 1600 ? 350 : width >= 1280 ? 340 : width >= 768 ? 300 : width >= 375 ? 290 : 260, 0)
  })
}

for (const [width, height] of [[1024, 900], [1366, 768], [1440, 900], [1920, 1080]]) {
  test(`height-aware shell sizing and chapter classification at ${width}x${height}`, async ({ page }) => {
    await page.setViewportSize({ width, height })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await expect(page.locator('#about')).toHaveAttribute('data-compact', height < 800 ? 'false' : 'true')
    const geometry = await page.locator('.identity-body').evaluate(e => ({ width: parseFloat(getComputedStyle(e).width), height: parseFloat(getComputedStyle(e).height) }))
    expect(geometry.width / geometry.height).toBeCloseTo(.7, 2)
    if (height < 800) expect(geometry.width).toBeLessThan(325)
    await flip(page).click()
    expect(await page.locator('.identity-back').evaluate(e => e.scrollHeight <= e.clientHeight + 1)).toBe(true)
  })
}

for (const deviceScaleFactor of [1, 2]) {
  test(`DOM typography and protected faces remain legible at DPR ${deviceScaleFactor}`, async ({ browser }, info) => {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor, reducedMotion: 'reduce' })
    const page = await context.newPage()
    await page.goto('/#about')
    await page.evaluate(() => document.fonts.ready)
    for (const side of ['front', 'back']) {
      if (side === 'back') await flip(page).click()
      const shot = await page.locator('.identity-stage').screenshot()
      await info.attach(`type-${side}-dpr${deviceScaleFactor}.png`, { body: shot, contentType: 'image/png' })
      expect(await page.locator(`.identity-${side}`).evaluate(e => getComputedStyle(e).filter)).toBe('none')
      await expect(page.locator('.identity-stage canvas')).toHaveCount(0)
      expect(await page.locator(`.identity-${side}`).evaluate(e => e.scrollHeight <= e.clientHeight + 1)).toBe(true)
    }
    await context.close()
  })
}

test('touch taps flip both ways; a swipe starting on the badge scrolls the document', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' })
  const page = await context.newPage()
  await page.goto('/#about')
  await flip(page).tap()
  await expect(flip(page)).toHaveAttribute('aria-pressed', 'true')
  await flip(page).tap()
  await expect(flip(page)).toHaveAttribute('aria-pressed', 'false')
  const bounds = await flip(page).boundingBox(), startY = Math.min(700, bounds!.y + bounds!.height - 25)
  const before = await page.evaluate(() => scrollY)
  const cdp = await context.newCDPSession(page)
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 180, y: startY }] })
  for (const delta of [30, 90, 170, 250]) {
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 180, y: startY - delta }] })
    await page.waitForTimeout(30)
  }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(before + 80)
  await expect(flip(page)).toHaveAttribute('aria-pressed', 'false')
  await context.close()
})

test('flipping leaves compact chapter navigation and the editorial introduction intact', async ({ page }) => {
  await expect(page.locator('.about-lead')).toHaveText('I’m Phuc, a Data Engineering student at Ho Chi Minh City University of Technology and Engineering, drawn to the space where data, mathematics, and software meet.')
  await flip(page).click()
  await settle(page, true)
  await page.mouse.wheel(0, 120)
  await expect.poll(() => page.locator('#skills').evaluate(e => Math.abs(e.getBoundingClientRect().top - 87))).toBeLessThan(3)
  await page.waitForTimeout(220)
  await page.mouse.wheel(0, -120)
  await expect.poll(() => page.locator('#about').evaluate(e => Math.abs(e.getBoundingClientRect().top - 87))).toBeLessThan(3)
  await expect(flip(page)).toHaveAttribute('aria-pressed', 'true')
})
