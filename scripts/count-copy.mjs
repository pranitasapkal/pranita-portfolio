#!/usr/bin/env node
/**
 * scripts/count-copy.mjs
 * Measures the reader-facing copy in a case study, so the ADR-004 length budget is a
 * check rather than a claim.
 *
 *   node scripts/count-copy.mjs                    all cases
 *   node scripts/count-copy.mjs transporter-panel  one case
 *
 * Method matches how the reference cases were measured (visible paragraph text only):
 * every string in the case object except identifiers and alt text, split at 12 words into
 * "prose" and "short elements". The ratio between those two is the point — the reference
 * pages carry most of their meaning in short elements, with prose only connecting them.
 */
import { build } from 'esbuild'
import { writeFileSync, mkdirSync, rmSync, readdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const casesDir = resolve(root, 'src/content/cases')
const tmp = resolve(root, '.copy-count-tmp')

// Identifiers and accessibility text — never rendered as reading copy.
const SKIP = new Set(['src', 'slug', 'code', 'id', 'href', 'poster', 'browserSlug', 'alt'])
const PROSE_MIN = 12

const words = (s) => (s.match(/\S+/g) || []).length
const pct = (a, p) => a[Math.floor(a.length * p)]

function collect(value, key, into) {
  if (typeof value === 'string') {
    if (SKIP.has(key)) return
    // Text.tsx splits a body on blank lines and renders one <p> per piece, so a block holding
    // three paragraphs is three paragraphs on the page — not one long one. Count what renders.
    // `{*}` is an asterisk marker, not a word.
    for (const para of value.split(/\n\n+/)) {
      const n = words(para.replace(/\{\*\}/g, ''))
      if (n) into.push(n)
    }
    return
  }
  if (Array.isArray(value)) return value.forEach((v) => collect(v, key, into))
  if (value && typeof value === 'object') {
    return Object.entries(value).forEach(([k, v]) => collect(v, k, into))
  }
}

// Accept a slug (`network-design-central`), a code (`NDC-02`) or any unambiguous prefix of
// either (`ndc`, `tpn`) — the three identifiers differ per case and guessing is pure friction.
const only = process.argv[2]?.toLowerCase()
const fileNames = readdirSync(casesDir)
  .filter((f) => f.endsWith('.tsx'))
  .map((f) => f.replace(/\.tsx$/, ''))

const matches = (cs) =>
  !only || cs.slug.toLowerCase().startsWith(only) || cs.code.toLowerCase().startsWith(only)

mkdirSync(tmp, { recursive: true })
// Import through the registry so we don't need to know each file's export name.
writeFileSync(resolve(tmp, 'entry.mjs'), `export { caseStudies } from '${casesDir}/index.ts'`)
await build({
  entryPoints: [resolve(tmp, 'entry.mjs')],
  bundle: true, format: 'esm', platform: 'node', logLevel: 'silent',
  outfile: resolve(tmp, 'bundle.mjs'),
})
const { caseStudies } = await import(`${resolve(tmp, 'bundle.mjs')}?v=${fileNames.join()}`)
rmSync(tmp, { recursive: true, force: true })

// Budget from ADR-004, revised 2026-08-15.
//
// There is deliberately NO total-words target. The first pass set one (750–900, taken from the
// reference portfolios) and cutting to it meant dropping six screens and four decision
// spotlights — evidence, not padding. Pranita's call: keep the full depth, around 4,600 words.
//
// So the gate is paragraph SHAPE, not page length. `max`/`over60` are the ones that matter: a
// 150-word paragraph is unreadable whatever the page total, while forty 28-word paragraphs are
// fine. `median`/`p75` are set to what a full-depth case actually sustains, so a pass here means
// something rather than being permanently red.
const BUDGET = { median: [18, 30], p75: 40, max: 60, over60: 0 }
let failed = false

let matched = 0
for (const cs of Object.values(caseStudies)) {
  if (!matches(cs)) continue
  matched++
  const lens = []
  collect(cs, 'root', lens)
  const prose = lens.filter((n) => n >= PROSE_MIN).sort((a, b) => a - b)
  const short = lens.filter((n) => n < PROSE_MIN)
  const total = lens.reduce((a, b) => a + b, 0)
  const median = pct(prose, 0.5)
  const p75 = pct(prose, 0.75)
  const max = prose[prose.length - 1]
  const over = prose.filter((n) => n > BUDGET.max).length

  const bad = []
  if (median < BUDGET.median[0] || median > BUDGET.median[1]) bad.push('median')
  if (p75 > BUDGET.p75) bad.push('p75')
  if (over > BUDGET.over60) bad.push('>60w')
  if (bad.length) failed = true

  console.log(`\n${cs.code}  ${cs.title}`)
  console.log(`  total            ${total}w`)
  console.log(`  prose            ${prose.length} paras, ${prose.reduce((a, b) => a + b, 0)}w`)
  console.log(`  short elements   ${short.length}   (ratio ${(short.length / prose.length).toFixed(1)}:1)`)
  console.log(`  median / p75     ${median} / ${p75}   (target ${BUDGET.median.join('–')} / ≤${BUDGET.p75})`)
  console.log(`  longest / >60w   ${max} / ${over}   (target ≤${BUDGET.max} / ${BUDGET.over60})`)
  console.log(bad.length ? `  OVER BUDGET: ${bad.join(', ')}` : '  within budget')
}

if (only && !matched) {
  console.error(`No case matched "${process.argv[2]}". Try a slug or a code, e.g. NDC-02. Files: ${fileNames.join(', ')}`)
  process.exit(1)
}

process.exit(failed ? 1 : 0)
