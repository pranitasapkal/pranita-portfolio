#!/usr/bin/env node
/**
 * scripts/optimize-images.mjs
 * The script `npm run optimize-images` has always pointed at and which never existed.
 *
 * public/work/ ships ~21 MB of lossless PNG screenshots with no WebP and no responsive
 * variants, so a 3200px-wide capture is downloaded in full on a 360px phone. This emits
 * WebP next to every PNG, and additionally emits width variants for the home-page covers
 * (the only images that need a real srcset).
 *
 * Source PNGs are left untouched — they stay the archival copy. Nothing is deleted.
 * Re-running is cheap: an output newer than its source is skipped.
 *
 * Run: npm run optimize-images
 */
import { readdirSync, statSync, existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { join, resolve, dirname, extname, basename, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const workDir = resolve(root, 'public/work')
const coversDir = resolve(workDir, 'covers')

/** Widths emitted for home-page covers. Matches the card slot at 1x and 2x. */
const COVER_WIDTHS = [640, 960, 1280, 1600]
/** Everything else is capped rather than upscaled — nothing renders wider than this. */
const MAX_WIDTH = 1600
const QUALITY = 82

function walk(dir) {
  if (!existsSync(dir)) return []
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name)
    return statSync(p).isDirectory() ? walk(p) : [p]
  })
}

/** Skip when the output already exists and is newer than the source. */
function isFresh(src, out) {
  return existsSync(out) && statSync(out).mtimeMs >= statSync(src).mtimeMs
}

let inBytes = 0
let outBytes = 0
let written = 0
let skipped = 0

async function emit(src, out, width) {
  if (isFresh(src, out)) {
    skipped++
    outBytes += statSync(out).size
    return
  }
  mkdirSync(dirname(out), { recursive: true })
  const img = sharp(src)
  const meta = await img.metadata()
  const target = width ? Math.min(width, meta.width) : Math.min(MAX_WIDTH, meta.width)
  await img.resize({ width: target, withoutEnlargement: true }).webp({ quality: QUALITY }).toFile(out)
  outBytes += statSync(out).size
  written++
}

const pngs = walk(workDir).filter((p) => extname(p).toLowerCase() === '.png')

if (!pngs.length) {
  console.log('no PNGs under public/work/ — nothing to do')
  process.exit(0)
}

/**
 * Intrinsic dimensions, keyed by the public path the content lane authors
 * (`/work/<case>/<name>.png`). ImageBlock reads this to reserve the box before decode —
 * without it every case-study image is a layout shift, which also drags ScrollTrigger
 * start positions around on a slow connection.
 */
const manifest = {}

for (const src of pngs) {
  inBytes += statSync(src).size
  const dir = dirname(src)
  const stem = basename(src, extname(src))

  if (dir === coversDir) {
    // Covers get a real srcset — they render at wildly different sizes across breakpoints.
    for (const w of COVER_WIDTHS) {
      await emit(src, join(dir, `${stem}-${w}.webp`), w)
    }
  } else {
    await emit(src, join(dir, `${stem}.webp`), null)
    const { width, height } = await sharp(src).metadata()
    const publicPath = '/' + src.slice(resolve(root, 'public').length + 1).split(sep).join('/')
    // Record the *rendered* size, which is the capped WebP, not the original PNG.
    const w = Math.min(MAX_WIDTH, width)
    manifest[publicPath] = [w, Math.round((height * w) / width)]
  }
}

const manifestPath = resolve(root, 'src/lib/image-manifest.json')
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n')
console.log(`manifest      ${Object.keys(manifest).length} entries → src/lib/image-manifest.json`)

const mb = (n) => (n / 1024 / 1024).toFixed(2)
console.log(`\nsource PNG    ${mb(inBytes)} MB across ${pngs.length} files`)
console.log(`emitted WebP  ${mb(outBytes)} MB  (${written} written, ${skipped} already fresh)`)
const saved = 1 - outBytes / inBytes
if (saved > 0) console.log(`payload       ${(saved * 100).toFixed(0)}% smaller than the PNG set`)
