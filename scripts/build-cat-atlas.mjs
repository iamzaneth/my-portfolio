import sharp from 'sharp'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { createHash } from 'node:crypto'

const root = 'assets/source/mascot'
const expected = {idle:10,walk:8,run:8,meow:4,sleep:1,wake:13,sit:1,lieDown:8,groom:5,groomPaw:5,scratch:2}
const m = JSON.parse(await readFile(`${root}/manifest.json`,'utf8'))
const assert = (condition, message) => { if(!condition) throw new Error(message) }
assert(m.frameWidth===64&&m.frameHeight===64,'Native frames must be 64×64')
assert(m.columns===13&&m.rows===11,'Unexpected atlas layout')
assert(Number.isInteger(m.groundRow)&&m.groundRow>0&&m.groundRow<=m.frameHeight,'Invalid ground reference')
assert(Object.keys(m.animations).join()===Object.keys(expected).join(),'Missing or reordered animation')
const palette = new Set(Object.values(m.palette).map(hex=>hex.toLowerCase()))
const catalog={}, review=[]
const atlasWidth=m.columns*m.frameWidth, atlasHeight=m.rows*m.frameHeight
const packed=Buffer.alloc(atlasWidth*atlasHeight*4)
const boundsOf=(data,width)=>{
  const points=[];for(let i=0;i<data.length;i+=4)if(data[i+3])points.push([i/4%width,Math.floor(i/4/width)])
  assert(points.length,'Empty frame')
  return {left:Math.min(...points.map(p=>p[0])),top:Math.min(...points.map(p=>p[1])),right:Math.max(...points.map(p=>p[0]))+1,bottom:Math.max(...points.map(p=>p[1]))+1}
}
const all=[]
for(const [name,frames] of Object.entries(expected)) {
  const sheet=m.animations[name]
  assert(sheet.frames===frames&&sheet.sources.length===frames,`${name}: wrong count`)
  assert(sheet.row===Object.keys(catalog).length,`${name}: wrong row`)
  const bounds=[]
  for(const [frame,source] of sheet.sources.entries()) {
    assert(!path.isAbsolute(source.source)&&!source.source.split(/[\\/]/).includes('..'),'Unsafe source path')
    const input=await readFile(path.join(root,source.source))
    const metadata=await sharp(input).metadata()
    assert(metadata.width===m.frameWidth&&metadata.height===m.frameHeight&&metadata.hasAlpha,`${source.source}: dimensions/alpha`)
    const data=await sharp(input).ensureAlpha().raw().toBuffer()
    let painted=0,subpixelBlocks=0
    for(let i=0;i<data.length;i+=4) {
      assert(data[i+3]===0||data[i+3]===255,`${source.source}: semitransparent pixel`)
      if(data[i+3]){painted++;assert(palette.has('#'+data.subarray(i,i+3).toString('hex')),`${source.source}: undeclared color`)}
    }
    // A palette remap alone is insufficient: native 2×2 blocks must contain
    // genuinely subdivided pixel clusters, contours and features in every pose.
    for(let y=0;y<64;y+=2)for(let x=0;x<64;x+=2) {
      const ids=[0,1,64,65].map(d=>(y*64+x+d)*4)
      if(ids.some(i=>data[i+3])&&ids.some(i=>!data.subarray(i,i+4).equals(data.subarray(ids[0],ids[0]+4))))subpixelBlocks++
    }
    assert(subpixelBlocks>=20,`${source.source}: insufficient native detail`)
    const actual=boundsOf(data,m.frameWidth)
    assert(JSON.stringify(actual)===JSON.stringify(source.visibleBounds),`${source.source}: stale bounds; update manifest after editing`)
    assert(actual.bottom<=m.groundRow,`${source.source}: artwork sinks below ground`)
    bounds.push(actual);all.push(actual)
    // Copy RGBA rows directly: compositing libraries may alter RGB beneath
    // transparent pixels. The production atlas preserves all source bytes.
    for(let y=0;y<m.frameHeight;y++) {
      const offset=((sheet.row*m.frameHeight+y)*atlasWidth+frame*m.frameWidth)*4
      data.copy(packed,offset,y*m.frameWidth*4,(y+1)*m.frameWidth*4)
    }
    review.push({asset:name,frame,painted,nativeDetailBlocks:subpixelBlocks,visibleBounds:actual,sha256:createHash('sha256').update(input).digest('hex')})
  }
  const envelope={left:Math.min(...bounds.map(b=>b.left)),top:Math.min(...bounds.map(b=>b.top)),right:Math.max(...bounds.map(b=>b.right)),bottom:Math.max(...bounds.map(b=>b.bottom))}
  catalog[name]={row:sheet.row,frames,visibleBounds:envelope}
}
const visibleBounds={left:Math.min(...all.map(b=>b.left)),top:Math.min(...all.map(b=>b.top)),right:Math.max(...all.map(b=>b.right)),bottom:Math.max(...all.map(b=>b.bottom))}
const atlas={frameWidth:m.frameWidth,frameHeight:m.frameHeight,columns:m.columns,rows:m.rows,groundRow:m.groundRow,visibleBounds}
const png=await sharp(packed,{raw:{width:atlasWidth,height:atlasHeight,channels:4}}).png({compressionLevel:9,palette:false}).toBuffer()
assert((await sharp(png).ensureAlpha().raw().toBuffer()).equals(packed),'PNG must preserve source RGBA bytes exactly')
const meta=await sharp(png).metadata()
assert(meta.width===832&&meta.height===704,'Invalid output')
// Review artifacts are opt-in; normal builds/checks leave no QA files behind.
if(process.argv.includes('--review')) {
  await mkdir('artifacts/mascot',{recursive:true})
  await sharp(png).resize(1664,1408,{kernel:'nearest'}).flatten({background:'#172136'}).png().toFile('artifacts/mascot/cat-contact.png')
  await writeFile('artifacts/mascot/artwork-audit.json',JSON.stringify({atlas,frames:review,total:review.length,pngBytes:png.length,decodedBytes:atlasWidth*atlasHeight*4},null,2)+'\n')
}
if(process.argv.includes('--check')) {
  assert(png.equals(await readFile('public/mascot/cat-atlas.png')),'Atlas is stale; run pnpm run assets:cat')
} else {
  await writeFile('public/mascot/cat-atlas.png',png)
}
const ts=`// Generated from assets/source/mascot/manifest.json by scripts/build-cat-atlas.mjs.\n// Never edit by hand: the manifest and transparent source PNGs own geometry.\nexport const catAtlas = ${JSON.stringify(atlas,null,2)} as const\n\nexport const catSprites = ${JSON.stringify(catalog,null,2)} as const\n`
if(process.argv.includes('--check'))assert(ts===await readFile('src/features/mascot/catSprites.ts','utf8'),'Sprite catalog is stale')
else await writeFile('src/features/mascot/catSprites.ts',ts)
console.log(`Validated ${review.length} native 64×64 frames; atlas ${meta.width}×${meta.height}, ${png.length} bytes.`)
