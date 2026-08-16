#!/usr/bin/env node
/**
 * scripts/gen-case-covers.mjs
 * Produces one 16:9 cover image per case study for the home-page work cards.
 *
 * Two sources, because only two cases shipped screenshots:
 *   - transporter-panel, linehaul-nexus → pick an existing frame from public/work/
 *   - network-design-central, transporter-contract-management, placement-multi-origin
 *     → captured live from their sanitized prototype in public/prototypes/
 *
 * The prototypes are the same sanitized copies the case pages embed, so nothing new
 * is exposed: whatever the iframe already shows a visitor is what gets captured.
 *
 * Requires the dev server on :5173 (npm run dev) so the prototypes load with their
 * own relative assets. Chrome path matches gen-transporter-diagrams.mjs.
 *
 * Run: npm run covers
 */
import { mkdirSync, existsSync, copyFileSync, writeFileSync, rmSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = resolve(root, 'public/work/covers')
mkdirSync(outDir, { recursive: true })

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const ORIGIN = process.env.COVER_ORIGIN ?? 'http://localhost:5173'

// Cover frame. 16:9 to match the BrowserFrame slot on the card; 2x for retina.
const W = 1600
const H = 900

/** Cases that already have a usable frame committed under public/work/. */
const FROM_FILE = [
  ['linehaul-nexus', 'public/work/clh/cover.png'],
  // NOT pending-default.png: that export is corrupted — every text run in it carries a
  // strikethrough. Verified against the rest of the transporter set, which is clean, so it
  // is that one file rather than the export pipeline. It is still referenced by the ASM
  // case study, so it needs a re-export regardless of what the cover uses.
  ['transporter-panel', 'public/work/transporter-panel/upcoming-list.png'],
]

/**
 * Cases with no screenshots. `settle` is extra virtual-time for the prototype to
 * finish its own boot before the frame is grabbed — ndc mounts React, so it needs more.
 */
const FROM_PROTOTYPE = [
  { slug: 'network-design-central', proto: 'ndc', settle: 9000 },
  // The transporter prototype opens on its passcode gate, which would make the cover a
  // picture of a locked door. The gate reads sessionStorage 'cmUnlocked' (see the prototype
  // around line 1743), so we seed that from a same-origin shim and let it redirect through.
  { slug: 'transporter-contract-management', proto: 'transporter', settle: 7000, unlock: true },
  { slug: 'placement-multi-origin', proto: 'placement', settle: 6000 },
]

/** Same-origin shim: seeds the unlock flag, then hands off to the real prototype. */
const SHIM_NAME = '__cover-unlock.html'
const shimPath = resolve(root, 'public', SHIM_NAME)

function writeShim(proto) {
  writeFileSync(
    shimPath,
    `<!doctype html><meta charset="utf8"><script>
try { sessionStorage.setItem('cmUnlocked','1') } catch (e) {}
location.replace('/prototypes/${proto}/index.html')
</script>`,
  )
}

let made = 0

for (const [slug, rel] of FROM_FILE) {
  const src = resolve(root, rel)
  if (!existsSync(src)) {
    console.warn(`skip ${slug} — missing ${rel}`)
    continue
  }
  copyFileSync(src, resolve(outDir, `${slug}.png`))
  console.log(`copied  ${slug}.png  ← ${rel}`)
  made++
}

for (const { slug, proto, settle, unlock } of FROM_PROTOTYPE) {
  if (unlock) writeShim(proto)
  const url = unlock ? `${ORIGIN}/${SHIM_NAME}` : `${ORIGIN}/prototypes/${proto}/index.html`
  const out = resolve(outDir, `${slug}.png`)
  try {
    execFileSync(
      CHROME,
      [
        '--headless',
        '--disable-gpu',
        '--hide-scrollbars',
        '--force-device-scale-factor=2',
        `--virtual-time-budget=${settle}`,
        `--window-size=${W},${H}`,
        `--screenshot=${out}`,
        url,
      ],
      { stdio: 'ignore' },
    )
    if (!existsSync(out)) throw new Error('chrome produced no file')
    console.log(`captured ${slug}.png  ← ${url}`)
    made++
  } catch (err) {
    console.error(`FAILED  ${slug} from ${url} — ${err.message}`)
    console.error('        is the dev server running? (npm run dev)')
  } finally {
    if (unlock) rmSync(shimPath, { force: true })
  }
}

console.log(`\n${made}/${FROM_FILE.length + FROM_PROTOTYPE.length} covers → public/work/covers/`)
console.log('now run: npm run optimize-images')
