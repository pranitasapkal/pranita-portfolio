import sharp from 'sharp'

// Deterministic monochrome noise tile for the grain overlay (128px, tiled).
const size = 128
const buf = Buffer.alloc(size * size)
let seed = 42
const rand = () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296
for (let i = 0; i < buf.length; i++) buf[i] = Math.floor(rand() * 256)

await sharp(buf, { raw: { width: size, height: size, channels: 1 } })
  .png({ compressionLevel: 9 })
  .toFile('public/textures/noise.png')

console.log('noise.png written')
