#!/usr/bin/env node
/**
 * scripts/check-facts.mjs
 * Guards the load-bearing facts in a case study across a rewrite.
 *
 *   node scripts/check-facts.mjs snapshot        write .facts-snapshot.json for all cases
 *   node scripts/check-facts.mjs check           diff current copy against that snapshot
 *   node scripts/check-facts.mjs check TPN-01    one case
 *
 * Why this exists: rewriting prose for readability quietly drops specifics. During the
 * compression pass it caught seven real regressions — a live-tracking string generalised to
 * "a distance", a traceable contract ID reduced to "Contract ID", a button label deleted, half
 * a before/after contrast removed. Specificity is what this portfolio competes on, so the
 * facts get a check rather than a promise.
 *
 * A flagged loss is not automatically a bug: punctuation moving outside a quotation mark
 * changes the extracted string. Read each one; don't wave the list through.
 */
import { build } from 'esbuild'
import { writeFileSync, readFileSync, existsSync, mkdirSync, rmSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const SNAPSHOT = resolve(root, '.facts-snapshot.json')
const tmp = resolve(root, '.facts-tmp')

// Identifiers and alt text are not reader-facing prose.
const SKIP = new Set(['src', 'slug', 'code', 'id', 'href', 'poster', 'browserSlug', 'alt'])

/** Figures carrying a unit, currency, percentage or arrow — the numbers a claim rests on. */
const FIGURES =
  /(?:₹\s?[\d,.]+(?:\s?(?:Cr|k|L))?|\d[\d,.]*\s?(?:%|km|hrs?|days?|weeks?|months?|screens?|tabs?|columns?|states?|rows?|clicks?|runs?|centres?|contracts?|trips?|ADRs?)|\d+\s?→\s?≤?\s?\d+|\b\d{2,}(?:,\d{3})*\+?\b)/gi

/** Product and UI vocabulary that must survive a plain-English rewrite. */
const PRODUCT_TERMS =
  /\b(?:No RFQ Linked|No GPS Present|Missed Earning|Total Earnings|Expected Earnings|Confirm Details|Raise Dispute|Pending Assignment|In-Transit|Historical Weight|Design Cycle|Command Center|Acknowledge|Simulate|Below Target|Trip ID|Contract ID|Partial Approved|Reopened|Reraise|No Response)\b/g

async function load() {
  mkdirSync(tmp, { recursive: true })
  writeFileSync(
    resolve(tmp, 'entry.mjs'),
    `export { caseStudies } from '${resolve(root, 'src/content/cases/index.ts')}'`,
  )
  await build({
    entryPoints: [resolve(tmp, 'entry.mjs')],
    bundle: true, format: 'esm', platform: 'node', logLevel: 'silent',
    outfile: resolve(tmp, 'bundle.mjs'),
  })
  const mod = await import(`${resolve(tmp, 'bundle.mjs')}?v=${Date.now()}`)
  rmSync(tmp, { recursive: true, force: true })
  return mod.caseStudies
}

function factsOf(cs) {
  const texts = []
  const walk = (v, k) => {
    if (typeof v === 'string') { if (!SKIP.has(k)) texts.push(v); return }
    if (Array.isArray(v)) return v.forEach((x) => walk(x, k))
    if (v && typeof v === 'object') return Object.entries(v).forEach(([kk, x]) => walk(x, kk))
  }
  walk(cs, 'root')
  const blob = texts.join(' \n ')
  const facts = new Set()
  for (const m of blob.matchAll(FIGURES)) facts.add(m[0].replace(/\s+/g, ' ').trim().toLowerCase())
  for (const m of blob.matchAll(/"([^"]{4,70})"/g)) facts.add(`"${m[1].trim().toLowerCase()}"`)
  for (const m of blob.matchAll(PRODUCT_TERMS)) facts.add(m[0].toLowerCase())
  return [...facts].sort()
}

const mode = process.argv[2] ?? 'check'
const only = process.argv[3]?.toLowerCase()
const cases = Object.values(await load()).filter(
  (cs) => !only || cs.code.toLowerCase().startsWith(only) || cs.slug.toLowerCase().startsWith(only),
)

if (mode === 'snapshot') {
  const out = {}
  for (const cs of cases) out[cs.code] = factsOf(cs)
  writeFileSync(SNAPSHOT, JSON.stringify(out, null, 2))
  const total = Object.values(out).reduce((a, b) => a + b.length, 0)
  console.log(`Snapshotted ${total} facts across ${Object.keys(out).length} cases → ${SNAPSHOT}`)
  process.exit(0)
}

if (!existsSync(SNAPSHOT)) {
  console.error('No snapshot. Run `node scripts/check-facts.mjs snapshot` before rewriting.')
  process.exit(1)
}
const before = JSON.parse(readFileSync(SNAPSHOT, 'utf8'))
let lostTotal = 0
for (const cs of cases) {
  const was = before[cs.code]
  if (!was) { console.log(`${cs.code}: not in snapshot, skipped`); continue }
  const now = factsOf(cs)
  const lost = was.filter((f) => !now.includes(f))
  lostTotal += lost.length
  console.log(`${cs.code}: ${was.length} → ${now.length} | lost ${lost.length}`)
  for (const f of lost) console.log(`    - ${f}`)
}
console.log(lostTotal ? `\n${lostTotal} fact(s) missing — check each before accepting.` : '\nNo facts lost.')
process.exit(lostTotal ? 1 : 0)
