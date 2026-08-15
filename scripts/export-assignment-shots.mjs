#!/usr/bin/env node
/**
 * scripts/export-assignment-shots.mjs
 * Exports the Assignment Module SOT screens from `Figma- Assignment module/` into
 * public/work/assignment/ at web scale.
 *
 * NDA: the Missing Trip screen embeds photographs of REAL challans carrying a real
 * vendor name, transporter ID, driver name, phone number and addresses. That region is
 * blurred before export — the shot still shows "we point at the document", without the
 * document's contents. Every other screen uses Figma dummy data (Karan Verma /
 * TR-12345678-1234 / DL 01 AB 1234 / Prashant Patel) and is exported as-is.
 *
 * Run: node scripts/export-assignment-shots.mjs
 * Requires: python3 with Pillow (already present on this machine).
 */
import { execFileSync } from 'node:child_process'
import { mkdirSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = resolve(root, 'public/work/assignment')

// The SOT folder has been copied in at two different depths across sessions; resolve whichever
// level actually contains the tab directories.
const CANDIDATES = [
  resolve(root, 'Figma- Assignment module'),
  resolve(root, 'Figma- Assignment module/Figma- Assignment module'),
  resolve(root, '../Assignment Model/Figma- Assignment module'),
]
const SRC = CANDIDATES.find((c) => existsSync(resolve(c, 'Pending Assignment')))
if (!SRC) {
  console.error(
    `No SOT folder found containing a "Pending Assignment" directory. Looked in:\n  ${CANDIDATES.join('\n  ')}`,
  )
  process.exit(1)
}
console.log(`SOT: ${SRC}`)
mkdirSync(OUT, { recursive: true })

/**
 * Each job: source file, output name, optional crop (fractions of w/h) and blur regions.
 * Crops are fractional so they survive a re-export at a different Figma scale.
 */
const JOBS = [
  { src: 'Pending Assignment/Pending Assignment - Default.png', out: 'pending-default.png' },
  { src: 'Pending Assignment/Reject Trip - Reason Dropdown.png', out: 'reject-consequences.png' },
  {
    src: 'Pending Assignment/Trip Detail - Payment & Route.png',
    out: 'route-timeline.png',
    width: 1800,
  },
  { src: 'Upcoming Trips/Upcoming Trips List.png', out: 'upcoming-list.png' },
  { src: 'In-Transpit trips/In- Transit Trips.png', out: 'in-transit.png' },
  { src: 'Completed Trips/Completed Trips - Default.png', out: 'completed-default.png' },
  { src: 'Completed Trips/Confirm - Active Dispute.png', out: 'confirm-active-dispute.png' },
  { src: 'Completed Trips/Raise Dispute - Form.png', out: 'raise-dispute-form.png', crop: [0, 0, 0.56, 1] },
  {
    src: 'Completed Trips/False Missing Trip - Step 1.png',
    out: 'missing-trip-challan.png',
    crop: [0, 0, 0.56, 0.56],
    // challan photo strip — real vendor/driver/address data, must not ship legible.
    // Top edge sits just below the "Find your Trip ID on the Challan" caption so the
    // instruction stays readable while the document contents do not.
    blur: [[0.2, 0.337, 0.54, 0.52]],
  },
  { src: 'Cancelled trips/Cancelled Trips Page.png', out: 'cancelled-remarks.png' },
]

const py = `
import sys, json
from PIL import Image, ImageFilter
jobs = json.loads(sys.argv[1]); SRC = sys.argv[2]; OUT = sys.argv[3]
for j in jobs:
    im = Image.open(SRC + '/' + j['src']).convert('RGB')
    W, H = im.size
    for (x0, y0, x1, y1) in j.get('blur', []):
        box = (int(x0*W), int(y0*H), int(x1*W), int(y1*H))
        im.paste(im.crop(box).filter(ImageFilter.GaussianBlur(radius=max(6, W//160))), box)
    if 'crop' in j:
        x0, y0, x1, y1 = j['crop']
        im = im.crop((int(x0*W), int(y0*H), int(x1*W), int(y1*H)))
    target = j.get('width', 2000)
    if im.width > target:
        im = im.resize((target, round(im.height * target / im.width)), Image.LANCZOS)
    im.save(OUT + '/' + j['out'], 'PNG', optimize=True)
    print(f"  {j['out']:28s} {im.width}x{im.height}")
`

console.log(`Exporting ${JOBS.length} SOT screens → public/work/assignment/`)
execFileSync('python3', ['-c', py, JSON.stringify(JOBS), SRC, OUT], { stdio: 'inherit' })
console.log('Done. Blurred: missing-trip-challan.png (real challan data).')
