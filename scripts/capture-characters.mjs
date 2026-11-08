import {chromium} from '@playwright/test'
import sharp from 'sharp'
import {mkdir,writeFile,readFile} from 'node:fs/promises'

const [label='after',url='http://127.0.0.1:4173']=process.argv.slice(2)
if(!/^[a-z0-9-]+$/i.test(label))throw new Error('Use a simple unique label')
const out=`artifacts/characters/${label}`
await mkdir(out,{recursive:true})
const browser=await chromium.launch()
const matrix=[[320,700],[375,812],[430,932],[768,1024],[1024,768],[1366,768],[1440,900],[1920,1080]]
const report=[]
const manifest=JSON.parse(await readFile('assets/source/mascot/manifest.json','utf8'))
try {
for(const [width,height] of matrix) {
  const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'})
  const errors=[];page.on('pageerror',e=>errors.push(e.message))
  await page.goto(url,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready)
  await page.locator('.mascot-scene').screenshot({path:`${out}/garden-${width}.png`})
  const initial=await page.evaluate(()=>({sprite:getComputedStyle(document.querySelector('.pixel-cat-sprite')).width,overflow:document.documentElement.scrollWidth>innerWidth,chapters:[...document.querySelectorAll('main>section')].map(e=>({id:e.id,height:e.offsetHeight,compact:e.dataset.compact}))}))
  await page.goto(`${url}/#about`,{waitUntil:'networkidle'})
  await page.locator('.identity-stage').screenshot({path:`${out}/card-rest-${width}.png`})
  await page.getByRole('button',{name:'Flip card: Zaneth identity',exact:true}).click()
  await page.locator('.identity-stage').screenshot({path:`${out}/card-back-${width}.png`})
  if([375,1440].includes(width)) {
    await page.addStyleTag({content:'.identity-tilt{transform:none!important}.identity-body{transition:none!important}'})
    await page.locator('.identity-stage').evaluate(element=>{
      const box=element.getBoundingClientRect()
      window.scrollBy({top:box.top-(innerHeight-box.height)/2,behavior:'instant'})
    })
    for(const angle of [0,15,30,45,60,90,120,180]) {
      await page.locator('.identity-body').evaluate((e,a)=>e.style.transform=`rotateY(${a}deg)`,angle)
      // Projection extends beyond the unchanged layout box. Include breathing
      // room so the evidence shows the complete top/bottom corner geometry.
      const box=await page.locator('.identity-stage').boundingBox()
      await page.screenshot({path:`${out}/card-${width}-${angle}.png`,clip:{x:box.x-16,y:box.y-48,width:box.width+32,height:box.height+96}})
    }
  }
  report.push({width,height,...initial,errors});await page.close()
}
// Exercise real controller/GSAP locomotion at every responsive size, with a
// controlled browser clock. Use the measured symmetric source envelope rather
// than the transparent frame box, including pounce and landing rotations.
const sourceBounds=Object.values(manifest.animations).flatMap(clip=>clip.sources.map(frame=>frame.visibleBounds))
const sourceMargin=Math.min(...sourceBounds.map(b=>Math.min(b.left,manifest.frameWidth-b.right)))
const motionAudit=[]
for(const [width,height] of matrix) {
  const page=await browser.newPage({viewport:{width,height}})
  await page.clock.install();await page.goto(url)
  await page.locator('.mascot-scene').scrollIntoViewIfNeeded()
  await page.clock.runFor(1800)
  await page.getByRole('button',{name:'Play',exact:true}).click()
  let minLeft=Infinity,minRight=Infinity
  const states=new Set()
  for(let elapsed=0;elapsed<4000;elapsed+=160) {
    await page.clock.runFor(160)
    const sample=await page.evaluate(({margin,frameWidth})=>{
      const stage=document.querySelector('.cat-stage').getBoundingClientRect()
      const sprite=document.querySelector('.pixel-cat-sprite[data-active=true]').getBoundingClientRect()
      const inset=sprite.width*margin/frameWidth
      return {left:sprite.left+inset-stage.left,right:stage.right-sprite.right+inset,state:document.querySelector('.mascot-scene').dataset.state,overflow:document.documentElement.scrollWidth>innerWidth}
    },{margin:sourceMargin,frameWidth:manifest.frameWidth})
    minLeft=Math.min(minLeft,sample.left);minRight=Math.min(minRight,sample.right);states.add(sample.state)
    // DOMMatrix projection can report −1.0000019 at the existing one-pixel
    // raster tolerance. Compare at 1/1000px precision, not binary float noise.
    if(Math.round(sample.left*1000)<-1000||Math.round(sample.right*1000)<-1000||sample.overflow)throw new Error(`Motion bounds at ${width}px: ${JSON.stringify(sample)}`)
  }
  if(!['walk','run','pounce'].every(state=>states.has(state)))throw new Error(`Incomplete locomotion review at ${width}px: ${[...states]}`)
  motionAudit.push({width,height,minLeft,minRight,states:[...states]})
  await page.close()
}
await writeFile(`${out}/motion-bounds.json`,JSON.stringify(motionAudit,null,2))
// Browser-clock playback review: all 11 clips, native source dimensions, no
// application debug APIs or production controller hooks. Embedded PNG only.
const atlas=(await readFile('public/mascot/cat-atlas.png')).toString('base64')
const clips=Object.entries(manifest.animations)
const previewDurations={idle:1.5,walk:.8,run:.55,meow:.8,sleep:1,wake:1.3,sit:1,lieDown:1.3,groom:.9,groomPaw:.95,scratch:.45}
const html=`<!doctype html><meta charset="utf-8"><title>Cat animation review</title><style>body{margin:24px;background:#172136;color:#eee5ff;font:14px monospace}.grid{display:grid;grid-template-columns:repeat(3,320px);gap:16px}.sprite{width:320px;height:320px;image-rendering:pixelated;background:url(data:image/png;base64,${atlas});background-size:${manifest.columns*320}px ${manifest.rows*320}px;animation:frames var(--duration,1.5s) steps(var(--count)) infinite}@keyframes frames{from{background-position-x:0}to{background-position-x:calc(var(--count)*-320px)}}</style><h1>Zaneth — all 65 frames / 11 clips</h1><div class="grid">${clips.map(([name,c])=>`<section><p>${name} · ${c.frames} frames</p><div class="sprite" style="--count:${c.frames};--duration:${previewDurations[name]}s;background-position-y:${c.row*-320}px;${c.frames===1?'animation:none':''}"></div></section>`).join('')}</div>`
await writeFile(`${out}/animation-review.html`,html)
const page=await browser.newPage({viewport:{width:1050,height:900},recordVideo:{dir:out,size:{width:1050,height:900}}})
await page.setContent(html);await page.screenshot({path:`${out}/animation-review.png`,fullPage:true})
for(const top of [0,600,1200]){await page.evaluate(top=>scrollTo(0,top),top);await page.waitForTimeout(1800)}
const video=page.video();await page.close();await video.saveAs(`${out}/animation-review.webm`)
// Sample ordinary live rendering at a fixed scene viewport. CPU/task and frame
// intervals are observations, not a guaranteed FPS or cross-device benchmark.
const live=await browser.newPage({viewport:{width:1440,height:900}})
await live.goto(url,{waitUntil:'networkidle'});await live.waitForTimeout(1700)
const cdp=await live.context().newCDPSession(live);await cdp.send('Performance.enable')
const before=await cdp.send('Performance.getMetrics')
const performanceSample=await live.evaluate(async()=>{
  const intervals=[],start=performance.now();let last=start
  const observer=new MutationObserver(()=>mutations++);let mutations=0
  observer.observe(document.querySelector('.pixel-cat-renderer'),{attributes:true,childList:true,subtree:true})
  while(performance.now()-start<1800){await new Promise(requestAnimationFrame);const now=performance.now();intervals.push(now-last);last=now}
  observer.disconnect();intervals.sort((a,b)=>a-b)
  return {samples:intervals.length,medianMs:intervals[Math.floor(intervals.length*.5)],p95Ms:intervals[Math.floor(intervals.length*.95)],rendererMutations:mutations,heap:performance.memory?.usedJSHeapSize??null}
})
const after=await cdp.send('Performance.getMetrics')
performanceSample.taskDurationSeconds=after.metrics.find(m=>m.name==='TaskDuration').value-before.metrics.find(m=>m.name==='TaskDuration').value
performanceSample.scriptDurationSeconds=after.metrics.find(m=>m.name==='ScriptDuration').value-before.metrics.find(m=>m.name==='ScriptDuration').value
performanceSample.jsHeapUsedBytes=after.metrics.find(m=>m.name==='JSHeapUsedSize').value
performanceSample.layoutCount=after.metrics.find(m=>m.name==='LayoutCount').value-before.metrics.find(m=>m.name==='LayoutCount').value
await writeFile(`${out}/performance.json`,JSON.stringify(performanceSample,null,2))
await live.close()
await writeFile(`${out}/responsive.json`,JSON.stringify(report,null,2))
// Magnified six-pose model from the editable source frames.
const names=['idle','walk','run','sit','sleep','meow'],cells=[]
for(const [i,name]of names.entries()) {
 const input=await sharp(`assets/source/mascot/${name}/00.png`).resize(320,320,{kernel:'nearest'}).png().toBuffer()
 cells.push({input,left:i%3*320,top:Math.floor(i/3)*320})
}
await sharp({create:{width:960,height:640,channels:4,background:'#172136'}}).composite(cells).png().toFile(`${out}/model-sheet.png`)
console.log(`Captured ${out}; ${matrix.length} viewports, 16 angle views, 11 animated clips.`)
if(report.some(r=>r.overflow||r.errors.length))throw new Error('Responsive audit failed')
}finally{await browser.close()}
