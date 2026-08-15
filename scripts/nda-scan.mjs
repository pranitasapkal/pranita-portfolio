import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join, extname } from 'node:path'

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

let hits = 0
function scan(path) {
  if (!existsSync(path)) return
  const st = statSync(path)
  if (st.isDirectory()) {
    for (const f of readdirSync(path)) scan(join(path, f))
    return
  }
  if (!SCAN_EXT.has(extname(path))) return
  const text = readFileSync(path, 'utf8')
  for (const s of banned) {
    let idx = text.indexOf(s)
    while (idx !== -1) {
      const ctx = text.slice(Math.max(0, idx - 40), idx + s.length + 40).replace(/\n/g, ' ')
      console.error(`BANNED "${s}" in ${path}: …${ctx}…`)
      hits++
      idx = text.indexOf(s, idx + 1)
    }
  }
}

for (const t of targets) scan(t)
if (hits) {
  console.error(`\nNDA scan FAILED: ${hits} hit(s).`)
  process.exit(1)
}
console.log(`NDA scan clean across: ${targets.join(', ')}`)
