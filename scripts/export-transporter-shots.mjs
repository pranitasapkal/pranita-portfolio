#!/usr/bin/env node
/**
 * scripts/export-transporter-shots.mjs
 * Exports the Transporter Panel SOT screens from `Figma- Assignment module/` into
 * public/work/transporter-panel/ at web scale.
 *
 * NDA: the Missing Trip screen embeds photographs of REAL challans. The document stays
 * sharp — the Trip ID in its green box is the point of the screen — but the personal data
 * on it is redacted, because it belongs to third parties: shipper name and address,
 * transporter name and ID, delivery address, driver name and mobile number. Every other
 * screen uses Figma dummy data (Karan Verma / TR-12345678-1234 / DL 01 AB 1234 /
 * Prashant Patel) and is exported as-is.
 *
 * Run: node scripts/export-transporter-shots.mjs
 * Requires: python3 with Pillow (already present on this machine).
 */
import { execFileSync } from 'node:child_process'
import { mkdirSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = resolve(root, 'public/work/transporter-panel')

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
  { src: 'Completed Trips/Raise Dispute - Form.png', out: 'raise-dispute-form.png' },
  { src: 'Completed Trips/Raise Dispute - Form Filled.png', out: 'raise-dispute-details.png' },
  { src: 'Completed Trips/Disputes - Overview.png', out: 'disputes-list.png' },
  {
    src: 'Completed Trips/Missing Trip - Raise Dispute.png',
    out: 'missing-trip-challan.png',
    // Uncropped, and the challan itself stays sharp — the whole point of the screen is that
    // the Trip ID is legible inside its green box, so blanket-blurring the document destroyed
    // the very thing the copy points at.
    //
    // What is redacted is only the personal data on those two sample challans, which belongs
    // to third parties rather than to this portfolio: the shipper's name and address, the
    // transporter's registered name and ID, the delivery address, and the driver's name and
    // mobile number. Boxes are fractions of the full frame, measured against this exact
    // source file — re-measure if the source screen is ever re-exported from Figma.
    blur: [
      [0.2578, 0.3944, 0.3492, 0.4053], // Origin Address — shipper name + street address
      [0.4127, 0.3687, 0.527, 0.3806], // Transporter ID + registered Transporter Name
      [0.4127, 0.4088, 0.4518, 0.4196], // From Address — delivery address
      [0.4127, 0.4459, 0.4312, 0.4538], // Driver Name
      [0.483, 0.4459, 0.5025, 0.4538], // Driver Contact No.
    ],
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

console.log(`Exporting ${JOBS.length} SOT screens → public/work/transporter-panel/`)
execFileSync('python3', ['-c', py, JSON.stringify(JOBS), SRC, OUT], { stdio: 'inherit' })
console.log('Done. Redacted: missing-trip-challan.png (personal data on the sample challans).')
