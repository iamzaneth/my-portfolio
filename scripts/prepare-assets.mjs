import sharp from 'sharp'
import { mkdir, copyFile, readFile, writeFile } from 'node:fs/promises'

// Editable native 64px PNG frames and their manifest own the mascot build.
// Original source provenance is retained under assets/source/mascot.
await import('./build-cat-atlas.mjs')

await sharp('assets/source/avatar.png').resize(256, 256, { fit: 'cover' }).webp({ quality: 82 }).toFile('public/avatar.webp')
// A portrait derivative preserves the original composition for the larger ID.
await sharp('assets/source/avatar.png').resize({ width: 720, withoutEnlargement: true }).webp({ quality: 85 }).toFile('public/avatar-portrait.webp')
const fontFiles = [
  ['@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2', 'manrope-latin.woff2'],
  ['@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2', 'ibm-plex-mono-latin.woff2'],
]
await mkdir('public/fonts', { recursive: true })
for (const [sourceFile, target] of fontFiles) await copyFile(`node_modules/${sourceFile}`, `public/fonts/${target}`)
for (const pkg of ['@fontsource-variable/manrope', '@fontsource/ibm-plex-mono']) {
  const license = await readFile(`node_modules/${pkg}/LICENSE`, 'utf8')
  await writeFile(`public/fonts/${pkg.includes('manrope') ? 'MANROPE' : 'IBM-PLEX-MONO'}-LICENSE.txt`, license)
}
console.log('Local fonts, optimized avatar, and mascot assets prepared.')
