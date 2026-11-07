import {chromium} from '@playwright/test'
import sharp from 'sharp'
import {mkdir,writeFile} from 'node:fs/promises'
import {inspectOrbits} from './lib/orbit-visibility.mjs'
const [label='current',url='http://127.0.0.1:4173',output='artifacts/cosmic']=process.argv.slice(2)
if(!/^[a-z0-9-]+$/i.test(label))throw Error('Use a simple capture label')
const root=`${output}/${label}`;await mkdir(root,{recursive:true})
const browser=await chromium.launch(),report=[]
for(const [width,height] of [[1440,900],[375,812],[320,900],[430,900],[768,900],[1024,900],[1920,1080],[1366,768]]){
 const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'})
 await page.goto(url,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready)
 const errors=[];page.on('pageerror',e=>errors.push(e.message))
 for(const id of ['home','about','skills','projects','contact']){
  const section=page.locator(`#${id}`);await section.scrollIntoViewIfNeeded()
  report.push({id,width,height,orbits:await section.evaluate(inspectOrbits),section:await section.evaluate(s=>({height:s.offsetHeight,compact:s.dataset.compact,overflow:document.documentElement.scrollWidth>innerWidth}))})
  for(const [mode,style] of Object.entries({full:'',background:'',constellation:'.celestial-orbit,.cosmic-stars,.cosmic-glint{visibility:hidden!important}',orbit:'[data-constellation],.cosmic-stars,.cosmic-glint{visibility:hidden!important}'})){
   if(![1440,375].includes(width)&&mode!=='full')continue
   const background=mode==='full'?'':'main>section .page-container{visibility:hidden!important}.featured-atlas,.mobile-orbit-band{visibility:visible!important}'
   await section.screenshot({path:`${root}/${id}-${width}-${mode}.png`,style:`.site-header{visibility:hidden!important}${background}${style}`})
  }
 }
 if(errors.length)throw Error(errors.join('\n'));await page.close()
}
await browser.close();await writeFile(`${root}/geometry.json`,JSON.stringify(report,null,2))
for(const width of [1440,375])for(const mode of ['background','full']){
 const tiles=await Promise.all(['home','about','skills','projects','contact'].map(async(id,i)=>({input:await sharp(`${root}/${id}-${width}-${mode}.png`).resize(300,360,{fit:'contain',background:'#0d1527'}).png().toBuffer(),left:i*300,top:0})))
 const sheet=sharp({create:{width:1500,height:360,channels:3,background:'#0d1527'}}).composite(tiles)
 await sheet.clone().png().toFile(`${root}/sheet-${width}-${mode}.png`);await sharp(await sheet.png().toBuffer()).grayscale().png().toFile(`${root}/grayscale-${width}-${mode}.png`)
}
console.log(`Captured ${root}; ${report.length} chapter/viewport audits.`)
