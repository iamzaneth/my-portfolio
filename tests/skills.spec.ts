import { expect, test } from '@playwright/test'

test('practice switches content in place by keyboard and Escape restores overview',async({page})=>{
 await page.goto('/')
 for(const card of await page.locator('.skill-card').all()) {
  const toggle=card.locator('.skill-practice-toggle')
  await toggle.focus();await page.keyboard.press('Enter')
  await expect(toggle).toHaveAttribute('aria-expanded','true')
  await expect(card.locator('.skill-practice-body')).toBeVisible()
  await expect(card.locator('.skill-overview')).toBeHidden()
  await page.keyboard.press('Tab');await expect(card.locator('.skill-practice-body')).toBeFocused()
  await page.keyboard.press('Escape');await expect(toggle).toBeFocused()
  await expect(toggle).toHaveAttribute('aria-expanded','false')
  await expect(card.locator('.tech-list')).toBeVisible()
 }
})

test('rapid toggles and reduced motion leave one accessible content view',async({page})=>{
 await page.goto('/')
 const card=page.locator('.skill-card').first(),toggle=card.locator('.skill-practice-toggle')
 await toggle.click();await toggle.click();await expect(toggle).toHaveAttribute('aria-expanded','false')
 await page.emulateMedia({reducedMotion:'reduce'});await toggle.click()
 await expect(card.locator('.skill-practice-body')).toBeVisible()
 expect(await card.locator('.skill-practice-body').evaluate(e=>e.getAnimations().length)).toBe(0)
 await expect(card.locator('.skill-overview')).toHaveAttribute('inert','')
})

for(const width of [320,375,430,768,1024,1440,1920])test(`practice never changes card or chapter geometry at ${width}px`,async({page})=>{
 await page.setViewportSize({width,height:900});await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/')
 const section=page.locator('#skills'),cards=section.locator('.skill-card')
 await expect(cards).toHaveCount(4)
 await expect(cards.locator('h3')).toHaveText(['AI & Mathematics','Data Engineering','Data Analysis','Engineering & Tools'])
 const measure=()=>section.evaluate(e=>({height:(e as HTMLElement).offsetHeight,cards:[...e.querySelectorAll<HTMLElement>('.skill-card')].map(c=>({top:c.offsetTop,left:c.offsetLeft,width:c.offsetWidth,height:c.offsetHeight}))}))
 const baseline=await measure()
 for(const card of await cards.all()) {
  const toggle=card.locator('.skill-practice-toggle');await toggle.click()
  await expect(toggle).toHaveAttribute('aria-expanded','true');await expect(card.locator('.skill-practice-body p')).toBeVisible()
  expect(await measure()).toEqual(baseline)
  const clipped=await card.locator('h3, p, li, .skill-kind').evaluateAll(elements=>elements.filter(e=>e.scrollWidth>e.clientWidth+1).map(e=>e.textContent))
  expect(clipped).toEqual([])
  await toggle.click();await expect(card.locator('.tech-list')).toBeVisible();expect(await measure()).toEqual(baseline)
 }
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true)
})
