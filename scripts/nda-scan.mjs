import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join, extname, sep } from 'node:path'

// Scans build output + sanitized prototypes + public case-study content for banned strings.
// Usage: node scripts/nda-scan.mjs [dir ...]   (defaults: dist, public/prototypes, content/case-studies)
// content/fuzzing-map.json is deliberately gitignored — it pairs every fuzzed public phrase
// with its real private value, so it must never reach a public remote. Without it there is
// nothing to scan for, so skip cleanly rather than crashing a fresh clone's tooling.
const MAP_PATH = 'content/fuzzing-map.json'
if (!existsSync(MAP_PATH)) {
  console.log(
    `NDA scan skipped — ${MAP_PATH} is not present.\n` +
      'That file holds the banned-string list and is intentionally excluded from this repo.\n' +
      'Ask the repo owner for a copy if you need to run this check.',
  )
  process.exit(0)
}
const map = JSON.parse(readFileSync(MAP_PATH, 'utf8'))
const banned = map.banned_strings_for_scan
const targets = process.argv.slice(2).length ? process.argv.slice(2) : ['dist', 'public/prototypes', 'content/case-studies']
const SCAN_EXT = new Set(['.html', '.js', '.css', '.json', '.md', '.txt', '.svg', '.xml', '.webmanifest'])

// Generated map geometry — thousands of coordinates, no prose, nothing to leak.
// Kept out of the scan entirely so a leak can never hide behind coordinate noise.
const SKIP_DIRS = new Set(['geo'])

/**
 * Deliberate publications. Each was raised with Pranita and reaffirmed (2026-08-15).
 * These are decisions, not defects — do not "fix" one without asking her first.
 * The scan still reports them, it just does not fail on them. Anything NOT listed
 * here fails as normal, so a genuinely new leak is never masked.
 */
const ALLOWED = [
  {
    string: 'SetuX',
    path: 'resume',
    why: 'The resume keeps real product names by design; she chose to publish its web outputs too.',
  },
  {
    string: '2,400',
    path: 'linehaul-nexus',
    why: 'CLH ships the real RFQ volume — her explicit call, made twice.',
  },
  {
    string: '2,400',
    path: 'CaseStudyPage',
    why: 'Built bundle carrying the CLH case study above.',
  },
  {
    string: '2,400',
    path: 'CLH-SCRIPT-v3.md',
    why: 'CLH working script — same decision as the case study.',
  },
]

/**
 * Anchors a banned string so it matches a standalone figure or word, not the head of a
 * longer one. Without this, the bare token `0.77` matches the map coordinate `-0.779`
 * 206 times over and buries every real hit in noise.
 */
function toMatcher(s) {
  const esc = s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const pre = /^\d/.test(s) ? '(?<![\\d.,\\-])' : /^[A-Za-z]/.test(s) ? '(?<![A-Za-z])' : ''
  const post = /\d$/.test(s) ? '(?!\\d)' : /[A-Za-z]$/.test(s) ? '(?![A-Za-z])' : ''
  return new RegExp(pre + esc + post, 'g')
}

const MATCHERS = banned.map((s) => [s, toMatcher(s)])

function isAllowed(string, path) {
  return ALLOWED.find((a) => a.string === string && path.includes(a.path))
}

let hits = 0
const allowedHits = new Map()

function scan(path) {
  if (!existsSync(path)) return
  const st = statSync(path)
  if (st.isDirectory()) {
    if (SKIP_DIRS.has(path.split(sep).pop())) return
    for (const f of readdirSync(path)) scan(join(path, f))
    return
  }
  if (!SCAN_EXT.has(extname(path))) return
  const text = readFileSync(path, 'utf8')
  for (const [s, re] of MATCHERS) {
    re.lastIndex = 0
    let m
    while ((m = re.exec(text)) !== null) {
      const allowed = isAllowed(s, path)
      if (allowed) {
        const key = `${s} → ${path}`
        allowedHits.set(key, (allowedHits.get(key) ?? 0) + 1)
        continue
      }
      const ctx = text.slice(Math.max(0, m.index - 40), m.index + s.length + 40).replace(/\n/g, ' ')
      console.error(`BANNED "${s}" in ${path}: …${ctx}…`)
      hits++
    }
  }
}

for (const t of targets) scan(t)

if (allowedHits.size) {
  console.log('Published by decision (allowlisted, not failures):')
  for (const [key, n] of allowedHits) console.log(`  ${key} ×${n}`)
  console.log('')
}

if (hits) {
  console.error(`\nNDA scan FAILED: ${hits} hit(s).`)
  process.exit(1)
}
console.log(`NDA scan clean across: ${targets.join(', ')}`)
