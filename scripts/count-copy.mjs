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

/**
 * Prose is decided by the FIELD, not by length — corrected 2026-08-15.
 *
 * The first version split on a 12-word threshold, so a 13-word chapter title counted as a
 * paragraph. That inflated TPN-01 to 98 "paragraphs" when about half were headings, table cells
 * and captions. It also made the comparison against the reference dishonest: the reference page
 * was measured by counting `p` and `li` elements, which excludes every `h1`–`h4`.
 *
 * The reference was counted in two steps and this must match, or the comparison is meaningless:
 *   1. take only the elements that render as `p` or `li` — that excludes every heading, caption,
 *      table cell and label. The reference's 1,401 words are p/li words ONLY.
 *   2. of those, the ones running 12 words or more are the "prose paragraphs" — 42 of them.
 *
 * So `body`, `note`, `notes`, `sub`, `reason`, `why`, `effect` and friends below are p/li text.
 * `title`, `caption`, `label`, `word`, `value`, `rows`, `columns`, `pattern`, `decision`,
 * `rejected` and `step` are headings, cells and chips — reported as `furniture`, never as prose.
 * A 20-word caption is still worth fixing; it just isn't a paragraph, and pretending it is
 * inflated TPN-01 by roughly half.
 */
const PROSE_FIELDS = new Set([
  'body', 'statement', 'text', 'effect', 'why', 'reason', 'note', 'sub',
  'totalNote', 'summary', 'problem', 'outcomes', 'oneLiner', 'notes',
])

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
      if (n) into.push({ n, prose: PROSE_FIELDS.has(key) })
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

// Budget from ADR-005 (2026-08-15), replacing ADR-004's.
//
// The total-words target is back, and the history matters. A first pass cut to 750–900 words and
// Pranita reversed it — but that cut had also dropped six screens and four decision spotlights,
// so what she rejected was losing EVIDENCE, not losing prose. The reference she then chose
// (smritidesign.work/work/ai-commentary) settles it: 1,401 words carrying 123 short labelled
// elements against only 42 paragraphs. Meaning lives in the structure; prose only connects it.
//
// `total` and `paras` cap the page; `median`/`p75`/`max`/`over40` cap the shape.
//
// There is deliberately NO short-to-prose ratio gate. The reference appears to carry 123 "short
// elements" against 42 paragraphs, but those are one-word `p` tags used as labels — literally
// `PROBLEM`, `IF`, `THEN`. Our block vocabulary puts labels in dedicated fields (`label`, `word`,
// `value`) that render as spans and chips, so the same page structure scores 24 instead of 123.
// Gating on that ratio would measure markup style, not writing, and would fail forever.
//
// Reference actuals, for calibration: 1,401w of p/li text · 42 paragraphs · median 20 · p75 30 ·
// max 46 · 1 paragraph over 40w.
const BUDGET = { total: 1800, paras: 50, median: [16, 24], p75: 32, max: 48, over40: 3 }
let failed = false

let matched = 0
for (const cs of Object.values(caseStudies)) {
  if (!matches(cs)) continue
  matched++
  const lens = []
  collect(cs, 'root', lens)
  // Step 1 — p/li only, which is what the reference's 1,401 words covers.
  const flowing = lens.filter((x) => x.prose)
  const furniture = lens.filter((x) => !x.prose)
  // Step 2 — of those, 12 words or more is a paragraph.
  const prose = flowing.filter((x) => x.n >= 12).map((x) => x.n).sort((a, b) => a - b)
  const short = flowing.filter((x) => x.n < 12)
  const total = flowing.reduce((a, b) => a + b.n, 0)
  const furnitureWords = furniture.reduce((a, b) => a + b.n, 0)
  const median = pct(prose, 0.5)
  const p75 = pct(prose, 0.75)
  const max = prose[prose.length - 1]
  const over = prose.filter((n) => n > 40).length

  const bad = []
  if (total > BUDGET.total) bad.push('total')
  if (prose.length > BUDGET.paras) bad.push('paras')
  if (median < BUDGET.median[0] || median > BUDGET.median[1]) bad.push('median')
  if (p75 > BUDGET.p75) bad.push('p75')
  if (max > BUDGET.max) bad.push('longest')
  if (over > BUDGET.over40) bad.push('>40w')
  if (bad.length) failed = true

  console.log(`\n${cs.code}  ${cs.title}`)
  console.log(`  reading copy     ${total}w   (target ≤${BUDGET.total}; reference 1,401)`)
  console.log(`  furniture        ${furnitureWords}w in ${furniture.length} headings/captions/cells (not compared)`)
  console.log(`  prose            ${prose.length} paras, ${prose.reduce((a, b) => a + b, 0)}w   (target ≤${BUDGET.paras} paras)`)
  console.log(`  short lines      ${short.length}   (p/li under 12 words)`)
  console.log(`  median / p75     ${median} / ${p75}   (target ${BUDGET.median.join('–')} / ≤${BUDGET.p75})`)
  console.log(`  longest / >40w   ${max} / ${over}   (target ≤${BUDGET.max} / ≤${BUDGET.over40})`)
  console.log(bad.length ? `  OVER BUDGET: ${bad.join(', ')}` : '  within budget')
}

if (only && !matched) {
  console.error(`No case matched "${process.argv[2]}". Try a slug or a code, e.g. NDC-02. Files: ${fileNames.join(', ')}`)
  process.exit(1)
}

process.exit(failed ? 1 : 0)
