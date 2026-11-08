import { expect, test } from '@playwright/test'
import sharp from 'sharp'
import { readFile } from 'node:fs/promises'
import { catAtlas, catSprites } from '../../src/features/mascot/catSprites'

// Inspect real source pixels rather than trusting a .png extension, a changed
// file hash, or a nominal frame size. Palette remapping alone cannot pass.
test('all 65 native frames match the source manifest, binary alpha and authored detail', async () => {
  const root = 'assets/source/mascot'
  const manifest = JSON.parse(await readFile(`${root}/manifest.json`, 'utf8'))
  const atlas = await sharp('public/mascot/cat-atlas.png').ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  expect(atlas.info.width).toBe(catAtlas.columns * catAtlas.frameWidth)
  expect(atlas.info.height).toBe(catAtlas.rows * catAtlas.frameHeight)
  expect(catAtlas.frameWidth).toBe(64)
  expect(catAtlas.frameHeight).toBe(64)
  const palette = new Set(Object.values(manifest.palette))
  expect(palette.size).toBeLessThanOrEqual(14)
  const total = Object.values(catSprites).reduce((sum, clip) => sum + clip.frames, 0)
  expect(total).toBe(65)
  for (const [name, clip] of Object.entries(catSprites)) {
    for (let frame = 0; frame < clip.frames; frame++) {
      const source = manifest.animations[name].sources[frame]
      const pixels = await sharp(`${root}/${source.source}`).ensureAlpha().raw().toBuffer()
      const cell = await sharp('public/mascot/cat-atlas.png').extract({ left: frame * catAtlas.frameWidth, top: clip.row * catAtlas.frameHeight, width: catAtlas.frameWidth, height: catAtlas.frameHeight }).ensureAlpha().raw().toBuffer()
      expect(cell.equals(pixels), `${name}/${frame}: lossless packing`).toBe(true)
      let painted = 0, nativeBlocks = 0
      const invalidAlpha: number[] = [], invalidColors = new Set<string>()
      const bounds = { left: 64, top: 64, right: 0, bottom: 0 }
      for (let y = 0; y < 64; y++) for (let x = 0; x < 64; x++) {
        const i = (y * 64 + x) * 4
        if (pixels[i + 3] !== 0 && pixels[i + 3] !== 255) invalidAlpha.push(i / 4)
        if (!pixels[i + 3]) continue
        painted++
        const color = '#' + pixels.subarray(i, i + 3).toString('hex')
        if (!palette.has(color)) invalidColors.add(color)
        bounds.left = Math.min(bounds.left, x); bounds.top = Math.min(bounds.top, y)
        bounds.right = Math.max(bounds.right, x + 1); bounds.bottom = Math.max(bounds.bottom, y + 1)
      }
      for (let y = 0; y < 64; y += 2) for (let x = 0; x < 64; x += 2) {
        const offsets = [0, 1, 64, 65].map(d => (y * 64 + x + d) * 4)
        if (offsets.some(i => pixels[i + 3]) && offsets.some(i => !pixels.subarray(i, i + 4).equals(pixels.subarray(offsets[0], offsets[0] + 4)))) nativeBlocks++
      }
      expect(invalidAlpha, `${name}/${frame}: binary alpha`).toEqual([])
      expect([...invalidColors], `${name}/${frame}: palette`).toEqual([])
      expect(painted).toBeGreaterThan(80)
      expect(nativeBlocks, `${name}/${frame}: genuine native detail`).toBeGreaterThanOrEqual(20)
      expect(bounds).toEqual(source.visibleBounds)
      expect(bounds.bottom).toBeLessThanOrEqual(catAtlas.groundRow)
    }
  }
})

// Sleep, sitting, standing and the ends of the lying bridge remain on one
// measured floor. Airborne gait cells may lift paws, just as in the original.
test('posture endpoints meet the same measured ground row', async () => {
  for (const [asset, frame] of [['idle', 0], ['walk', 0], ['run', 0], ['sit', 0], ['sleep', 0], ['lieDown', 0], ['lieDown', 4], ['lieDown', 7]] as const) {
    const { data } = await sharp(`assets/source/mascot/${asset}/${String(frame).padStart(2, '0')}.png`).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
    let ground = 0
    for (let y = 0; y < catAtlas.frameHeight; y++) for (let x = 0; x < catAtlas.frameWidth; x++) if (data[(y * catAtlas.frameWidth + x) * 4 + 3]) ground = y + 1
    expect(ground, `${asset}/${frame}`).toBe(catAtlas.groundRow)
  }
})
