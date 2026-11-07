import { devices, expect, test, type Page } from '@playwright/test'

const canvas = (page: Page) => page.locator('.comet-cursor')
const paint = (page: Page) => canvas(page).evaluate(element => {
  const c = element as HTMLCanvasElement
  const pixels = c.getContext('2d')!.getImageData(0, 0, c.width, c.height).data
  let count = 0
  for (let i = 3; i < pixels.length; i += 4) if (pixels[i]) count++
  return count
})
const clears = (page: Page) => canvas(page).getAttribute('data-test-clears')

// Count canvas clears, not global RAFs: GSAP and the cat own independent work.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    const clear = CanvasRenderingContext2D.prototype.clearRect
    CanvasRenderingContext2D.prototype.clearRect = function (...args) {
      if (this.canvas.classList.contains('comet-cursor')) {
        this.canvas.dataset.testFrameFills = '0'
        this.canvas.dataset.testClears = String(Number(this.canvas.dataset.testClears ?? 0) + 1)
      }
      return clear.apply(this, args)
    }
  })
})

test('mouse draws bounded light, fades completely, and stops canvas work when stationary', async ({ page }) => {
  await page.goto('/')
  await expect(canvas(page)).toBeVisible()
  await page.mouse.move(300, 300)
  await page.mouse.move(600, 350, { steps: 20 })
  await expect.poll(() => paint(page)).toBeGreaterThan(0)
  // Sparse effect must remain small relative to the viewport, even after a burst.
  expect(await paint(page)).toBeLessThan(15000)
  await expect.poll(() => paint(page)).toBe(0)
  const stopped = await clears(page)
  await page.waitForTimeout(250)
  expect(await clears(page)).toBe(stopped)
  await page.mouse.move(610, 353, { steps: 4 })
  await expect.poll(() => paint(page)).toBeGreaterThan(0)
  await expect.poll(() => paint(page)).toBe(0)
})

test('viewport exit, hidden tab, resize and live motion preferences clear stale trails', async ({ page }) => {
  await page.goto('/')
  await page.mouse.move(200, 200)
  await page.mouse.move(600, 400, { steps: 10 })
  await page.evaluate(() => window.dispatchEvent(new PointerEvent('pointerout', { pointerType: 'mouse', relatedTarget: null })))
  await expect.poll(() => paint(page)).toBe(0)
  await page.mouse.move(620, 410)
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, value: true })
    document.dispatchEvent(new Event('visibilitychange'))
  })
  await expect.poll(() => paint(page)).toBe(0)
  const stopped = await clears(page)
  await page.mouse.move(800, 500)
  await page.waitForTimeout(100)
  expect(await clears(page)).toBe(stopped)
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, value: false })
    document.dispatchEvent(new Event('visibilitychange'))
  })
  await page.setViewportSize({ width: 1024, height: 768 })
  expect(await canvas(page).evaluate(element => ({ width: (element as HTMLCanvasElement).width, height: (element as HTMLCanvasElement).height }))).toEqual({ width: 1024, height: 768 })
  await page.mouse.move(700, 350, { steps: 8 })
  await expect.poll(() => paint(page)).toBeGreaterThan(0)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(canvas(page)).toBeHidden()
  await expect.poll(() => paint(page)).toBe(0)
  await expect(canvas(page)).toHaveAttribute('width', '1')
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await expect(canvas(page)).toBeVisible()
  await page.mouse.move(740, 370)
  await expect.poll(() => paint(page)).toBeGreaterThan(0)
})

test('decoration preserves hit testing, native pointer, scrolling, cat and dialogs', async ({ page }) => {
  await page.goto('/')
  await expect(canvas(page)).toHaveAttribute('aria-hidden', 'true')
  await expect(canvas(page)).toHaveCSS('pointer-events', 'none')
  expect(await canvas(page).evaluate(element => element.hasAttribute('tabindex'))).toBe(false)
  await page.mouse.move(300, 280)
  expect(await page.locator('body').evaluate(element => getComputedStyle(element).cursor)).not.toBe('none')
  await page.getByRole('button', { name: 'Pet', exact: true }).click()
  await expect(page.locator('.mascot-scene')).toHaveAttribute('data-origin', 'user')
  await page.getByRole('button', { name: 'View details: NexTick' }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.getByRole('button', { name: /Inspect Kafka/ }).click()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await page.locator('#contact').scrollIntoViewIfNeeded()
  await expect(page.locator('#contact')).toBeInViewport()
})

test('reduced motion at startup never paints or starts a cursor loop', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  const initial = await clears(page)
  await page.mouse.move(500, 300, { steps: 20 })
  await page.waitForTimeout(100)
  await expect(canvas(page)).toBeHidden()
  expect(await paint(page)).toBe(0)
  expect(await clears(page)).toBe(initial)
})

test.describe('touch-only device', () => {
  test.use({ viewport: devices['Pixel 7'].viewport, isMobile: true, hasTouch: true, deviceScaleFactor: devices['Pixel 7'].deviceScaleFactor })
  test('coarse pointer disables canvas even for synthetic mouse events', async ({ page }) => {
    await page.goto('/')
    await expect(canvas(page)).toBeHidden()
    await page.mouse.move(200, 300, { steps: 10 })
    await page.touchscreen.tap(200, 350)
    expect(await paint(page)).toBe(0)
    await expect(canvas(page)).toHaveAttribute('width', '1')
  })
})

test('fine pointer ignores touch events and caps high-DPI backing store', async ({ browser }) => {
  const context = await browser.newContext({ deviceScaleFactor: 3, viewport: { width: 800, height: 600 } })
  const page = await context.newPage()
  await page.goto('/')
  await expect(canvas(page)).toHaveAttribute('width', '1600')
  await page.evaluate(() => window.dispatchEvent(new PointerEvent('pointermove', { pointerType: 'touch', clientX: 200, clientY: 200 })))
  expect(await paint(page)).toBe(0)
  await context.close()
})

test('stardust comet paints a brighter core and a continuous trail beyond the old 84px cap', async ({ page }) => {
  await page.goto('/')
  const metrics = await page.evaluate(async () => {
    // Steady input avoids comparing screenshots taken at unrelated mouse speeds.
    for (let i = 0; i < 65; i++) {
      window.dispatchEvent(new PointerEvent('pointermove', { pointerType: 'mouse', clientX: 230 + i * 9, clientY: 300 }))
      await new Promise(requestAnimationFrame)
    }
    const c = document.querySelector<HTMLCanvasElement>('.comet-cursor')!
    const { data } = c.getContext('2d')!.getImageData(0, 0, c.width, c.height)
    let peak = 0, seed = 0, bright = 0
    for (let y = 280; y < 320; y++) for (let x = 600; x < 840; x++) {
      const alpha = data[(y * c.width + x) * 4 + 3]
      if (alpha > peak) { peak = alpha; seed = y * c.width + x }
      if (alpha > 180) bright++
    }
    // Measure the connected luminous shape, excluding detached old dust.
    const queue = [seed], visited = new Set([seed])
    let left = seed % c.width, right = left
    while (queue.length) {
      const index = queue.pop()!, x = index % c.width, y = Math.floor(index / c.width)
      left = Math.min(left, x); right = Math.max(right, x)
      for (const dy of [-1, 0, 1]) for (const dx of [-1, 0, 1]) {
        const nx = x + dx, ny = y + dy, next = ny * c.width + nx
        if (nx >= 0 && nx < c.width && ny >= 280 && ny < 320 && !visited.has(next) && data[next * 4 + 3] >= 3) { visited.add(next); queue.push(next) }
      }
    }
    return { peak, bright, connectedWidth: right - left + 1 }
  })
  console.log('Stardust painted metrics:', JSON.stringify(metrics))
  expect(metrics.peak).toBeGreaterThan(210)
  expect(metrics.bright).toBeGreaterThanOrEqual(10)
  expect(metrics.connectedWidth).toBeGreaterThan(100)
  expect(metrics.connectedWidth).toBeLessThan(155)
  await expect.poll(() => paint(page)).toBe(0)
})

test('sparkles use reusable paths, stay sparse under repeated fast motion, and stop completely', async ({ page }) => {
  await page.addInitScript(() => {
    const original = CanvasRenderingContext2D.prototype.fill
    CanvasRenderingContext2D.prototype.fill = function (...args: Parameters<CanvasRenderingContext2D['fill']>) {
      if (this.canvas.classList.contains('comet-cursor')) {
        const fills = Number(this.canvas.dataset.testFrameFills ?? 0) + 1
        this.canvas.dataset.testFrameFills = String(fills)
        this.canvas.dataset.testPeakFills = String(Math.max(Number(this.canvas.dataset.testPeakFills ?? 0), fills))
      }
      if (this.canvas.classList.contains('comet-cursor') && args[0] instanceof Path2D) {
        this.canvas.dataset.testGlints = String(Number(this.canvas.dataset.testGlints ?? 0) + 1)
      }
      return Reflect.apply(original, this, args)
    }
  })
  await page.goto('/')
  const samples = await page.evaluate(async () => {
    const c = document.querySelector<HTMLCanvasElement>('.comet-cursor')!
    let maxLit = 0
    for (let i = 0; i < 100; i++) {
      window.dispatchEvent(new PointerEvent('pointermove', { pointerType: 'mouse', clientX: 400 + Math.sin(i / 8) * 170, clientY: 280 + Math.cos(i / 8) * 80 }))
      await new Promise(requestAnimationFrame)
      if (i % 10 === 0) {
        const { data } = c.getContext('2d')!.getImageData(200, 160, 420, 240)
        let lit = 0
        for (let j = 3; j < data.length; j += 4) if (data[j]) lit++
        maxLit = Math.max(maxLit, lit)
      }
    }
    return { glints: Number(c.dataset.testGlints), maxLit, peakFills: Number(c.dataset.testPeakFills) }
  })
  console.log('Stardust sparse-pool metrics:', JSON.stringify(samples))
  expect(samples.peakFills).toBeLessThanOrEqual(29) // One head plus at most 28 pooled particles.
  expect(samples.glints).toBeGreaterThan(5)
  // Visible shape budget stays compact despite rapid motion and extra glints.
  expect(samples.maxLit).toBeLessThan(4000)
  await expect.poll(() => paint(page)).toBe(0)
  const stopped = await clears(page)
  await page.waitForTimeout(250)
  expect(await clears(page)).toBe(stopped)
})

test('recorded L remains fixed while head moves; no diagonal replacement',async({page})=>{
 await page.goto('/')
 const result=await page.evaluate(async()=>{
 const send=(x:number,y:number)=>window.dispatchEvent(new PointerEvent('pointermove',{pointerType:'mouse',clientX:x,clientY:y}))
 send(300,300);send(350,300);send(350,340)
 await new Promise(requestAnimationFrame)
 send(350,360)
 await new Promise(requestAnimationFrame)
 const c=document.querySelector<HTMLCanvasElement>('.comet-cursor')!,ctx=c.getContext('2d')!
 const alpha=(x:number,y:number)=>ctx.getImageData(x,y,1,1).data[3]
 return {horizontal:alpha(330,300),vertical:alpha(350,325),shortcut:alpha(330,330)}
 })
 expect(result.horizontal).toBeGreaterThan(0);expect(result.vertical).toBeGreaterThan(0);expect(result.shortcut).toBe(0)
})

test('meteor streak responds to speed and the stopped effect clears within 550ms',async({page})=>{
 await page.goto('/')
 const metrics=await page.evaluate(async()=>{
 const c=document.querySelector<HTMLCanvasElement>('.comet-cursor')!,ctx=c.getContext('2d')!
 const sample=async(step:number)=>{
 window.dispatchEvent(new Event('blur'))
 for(let i=0;i<25;i++) {window.dispatchEvent(new PointerEvent('pointermove',{pointerType:'mouse',clientX:300+i*step,clientY:260}));await new Promise(requestAnimationFrame)}
 const pixels=ctx.getImageData(250,245,350,30).data
 let lit=0;for(let i=3;i<pixels.length;i+=4)if(pixels[i]>3)lit++
 return lit
 }
 const slow=await sample(1),fast=await sample(9)
 await new Promise(r=>setTimeout(r,550))
 const pixels=ctx.getImageData(0,0,c.width,c.height).data
 return {slow,fast,clear:pixels.every((v,i)=>i%4!==3||v===0)}
 })
 console.log("Meteor speed and fade:",metrics)
 expect(metrics.fast).toBeGreaterThan(metrics.slow*1.5);expect(metrics.clear).toBe(true)
 const stopped=await clears(page);await page.waitForTimeout(150);expect(await clears(page)).toBe(stopped)
})

test('comet draws one connected highlight per frame rather than per-sample strokes',async({page})=>{
 await page.addInitScript(()=>{
 const stroke=CanvasRenderingContext2D.prototype.stroke,clear=CanvasRenderingContext2D.prototype.clearRect
 CanvasRenderingContext2D.prototype.stroke=function(...args){
 if(this.canvas.classList.contains('comet-cursor')) {const n=Number(this.canvas.dataset.strokes||0)+1;this.canvas.dataset.strokes=String(n);this.canvas.dataset.peakStrokes=String(Math.max(n,Number(this.canvas.dataset.peakStrokes||0)))}
 return Reflect.apply(stroke,this,args)
 }
 CanvasRenderingContext2D.prototype.clearRect=function(...args){if(this.canvas.classList.contains('comet-cursor'))this.canvas.dataset.strokes='0';return clear.apply(this,args)}
 })
 await page.goto('/');await page.mouse.move(300,300);await page.mouse.move(440,310,{steps:40})
 expect(Number(await canvas(page).getAttribute('data-peak-strokes'))).toBe(1)
 await expect.poll(()=>paint(page)).toBe(0)
})
