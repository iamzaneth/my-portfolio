import { inspectOrbits } from '../scripts/lib/orbit-visibility.mjs'
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

test('recognizable figures use uniform local coordinates and open orbit paths', async ({page})=>{
 await page.goto('/')
 for(const [world,name] of [['home','Lyra'],['about','Orion'],['toolkit','Cygnus'],['projects','Scorpius'],['contact','Ursa Major']]) {
 const section=page.locator(`#${world === 'toolkit' ? 'skills' : world}`)
 const art=section.locator(world === 'about' || world === 'toolkit' ? '.featured-atlas' : '.cosmic-desktop')
 await expect(art.locator('[data-constellation]')).toHaveAttribute('data-constellation',name)
 await expect(art.locator('[data-constellation]')).toHaveAttribute('preserveAspectRatio','xMidYMid meet')
 expect(await art.locator('ellipse').count()).toBe(0)
 expect(await section.locator('.cosmic-desktop .orbit-primary').count()).toBe(1)
 if(world==='about'||world==='toolkit')expect(await art.locator('.celestial-orbit').count()).toBe(0)
 }
})

for (const width of [320,375,430,768,1024,1440,1920]) test(`unlabeled complete figures and independent expansive trajectories at ${width}`,async({page})=>{
 await page.setViewportSize({width,height:900});await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/')
 expect(await page.locator('.cosmic-world text, .featured-atlas text').count()).toBe(0)
 for(const id of ['about','skills']) {
 const section=page.locator(`#${id}`);await section.scrollIntoViewIfNeeded()
 const svg=section.locator('.featured-atlas')
 await expect(svg).toHaveAttribute('aria-hidden','true');await expect(svg).toHaveCSS('pointer-events','none')
 expect(await svg.locator('[tabindex],a,button').count()).toBe(0)
 const sizes=await svg.locator('.stellar-featured').boundingBox();expect(sizes!.height).toBeGreaterThan(width<768?180:190)
 const geometry=await section.evaluate(el=>{
 const art=el.querySelector('.featured-atlas')!.getBoundingClientRect()
 const contentElement=el.querySelector(el.id==='about'?'.about-copy':'.skills-grid')!
 const content=contentElement.getBoundingClientRect()
 return {bottom:art.bottom,top:content.top+parseFloat(getComputedStyle(contentElement).paddingTop)}
 });expect(geometry.bottom).toBeLessThanOrEqual(geometry.top + 1)
 }
 for(const id of ['home','about','skills','projects','contact']) {
 const section=page.locator(`#${id}`)
 const band=section.locator('.mobile-orbit-band')
 await expect(band).toHaveAttribute('aria-hidden','true');await expect(band).toHaveCSS('pointer-events','none')
 expect(await band.locator('text,a,button,[tabindex]').count()).toBe(0)
 if(width<768){
  await expect(band).toBeVisible()
  const collision=await section.evaluate(el=>{
   const band=el.querySelector('.mobile-orbit-band')!.getBoundingClientRect()
   const svg=el.querySelector('.featured-atlas [data-constellation]')??el.querySelector('.cosmic-mobile [data-constellation]')!
   return [...svg.querySelectorAll('.stellar-core')].some(c=>{const r=c.getBoundingClientRect();return r.left<band.right&&r.right>band.left&&r.top<band.bottom&&r.bottom>band.top})
  })
  expect(collision).toBe(false)
 }else await expect(band).toBeHidden()
 const orbits=await section.evaluate(inspectOrbits)
 const primary=orbits.find(o=>o.variant.includes('orbit-primary'))!
 expect(primary.visibleFraction).toBeGreaterThan(.2)
 expect(primary.longestRun).toBeGreaterThan(width*.28)
 expect(primary.spanX).toBeGreaterThan(width*.32)
 expect(primary.spanY).toBeGreaterThan(10)
 expect(primary.parameters).toBeTruthy()
 const figures=await section.evaluate(el=>{
 const svg=el.querySelector('.featured-atlas [data-constellation]')??el.querySelector(innerWidth<768?'.cosmic-mobile [data-constellation]':'.cosmic-desktop [data-constellation]')!
 const bounds=el.getBoundingClientRect()
 return [...svg.querySelectorAll('.stellar-core')].map(c=>{const p=new DOMPoint(Number(c.getAttribute('cx')),Number(c.getAttribute('cy'))).matrixTransform((c as SVGGraphicsElement).getScreenCTM()!);return {inside:p.x>=bounds.left&&p.x<=bounds.right&&p.y>=bounds.top&&p.y<=bounds.bottom}})
 })
 expect(figures.length).toBeGreaterThan(4);expect(figures.every(p=>p.inside)).toBe(true)
 }
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true)
})

test('hiding constellation art leaves orbit geometry and chapter measurements unchanged',async({page})=>{
 await page.setViewportSize({width:1440,height:900});await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/')
 const sections=page.locator('main>section')
 const before=[]
 for(const section of await sections.all())before.push({height:await section.evaluate(e=>(e as HTMLElement).offsetHeight),orbits:await section.evaluate(inspectOrbits)})
 const style=await page.addStyleTag({content:'[data-constellation]{display:none!important}'})
 for(const [i,section] of (await sections.all()).entries()){
 expect(await section.evaluate(e=>(e as HTMLElement).offsetHeight)).toBe(before[i].height)
 const after=await section.evaluate(inspectOrbits)
 expect(after.map(o=>o.parameters)).toEqual(before[i].orbits.map(o=>o.parameters))
 for(let j=0;j<after.length;j++)expect(after[j].visibleLength).toBeCloseTo(before[i].orbits[j].visibleLength,1)
 }
 await style.evaluate(e=>e.remove())
})
