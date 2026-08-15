#!/usr/bin/env node
/**
 * scripts/copy-hotspots.mjs
 * Says WHERE the words are. `count-copy.mjs` tells you a case is over budget; this tells you
 * which chapter and which paragraph to cut, which is the part that actually takes time.
 *
 *   node scripts/copy-hotspots.mjs TPN        one case by code or slug prefix
 *
 * Prints words + prose-paragraph count per chapter, then the longest paragraphs with a path
 * into the object (e.g. `.chapters[4].blocks[3].fix.body`) so the edit target is unambiguous.
 * Same counting rules as count-copy.mjs — split on blank lines, skip identifiers and alt text.
 */
import { build } from 'esbuild'
import { writeFileSync, mkdirSync, rmSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const tmp = resolve(root, '.hotspots-tmp')
const SKIP = new Set(['src', 'slug', 'code', 'id', 'href', 'poster', 'browserSlug', 'alt'])
const words = (s) => (s.replace(/\{\*\}/g, '').match(/\S+/g) || []).length

mkdirSync(tmp, { recursive: true })
writeFileSync(resolve(tmp, 'entry.mjs'), `export { caseStudies } from '${resolve(root, 'src/content/cases/index.ts')}'`)
await build({
  entryPoints: [resolve(tmp, 'entry.mjs')],
  bundle: true, format: 'esm', platform: 'node', logLevel: 'silent',
  outfile: resolve(tmp, 'bundle.mjs'),
})
const { caseStudies } = await import(`${resolve(tmp, 'bundle.mjs')}?v=${process.pid}`)
rmSync(tmp, { recursive: true, force: true })

const only = process.argv[2]?.toLowerCase()
const cs = Object.values(caseStudies).find(
  (c) => !only || c.code.toLowerCase().startsWith(only) || c.slug.toLowerCase().startsWith(only),
)
if (!cs) {
  console.error(`No case matched "${process.argv[2]}". Try a code, e.g. TPN.`)
  process.exit(1)
}

/** Every paragraph as it renders, with the path that produced it. */
function paragraphs(value, key, path, into) {
  if (typeof value === 'string') {
    if (SKIP.has(key)) return
    value.split(/\n\n+/).forEach((p, i) => {
      const n = words(p)
      if (n) into.push({ n, path: `${path}.${key}${i ? `¶${i + 1}` : ''}`, head: p.slice(0, 64) })
    })
    return
  }
  if (Array.isArray(value)) return value.forEach((v, i) => paragraphs(v, key, `${path}[${i}]`, into))
  if (value && typeof value === 'object') {
    return Object.entries(value).forEach(([k, v]) => paragraphs(v, k, path, into))
  }
}

console.log(`\n${cs.code}  ${cs.title}\n`)
console.log('  chapter                       words   prose paras')
for (const [i, ch] of cs.chapters.entries()) {
  const p = []
  paragraphs(ch, 'root', `.chapters[${i}]`, p)
  const total = p.reduce((a, b) => a + b.n, 0)
  console.log(`  ${ch.id.padEnd(28)} ${String(total).padStart(5)}   ${p.filter((x) => x.n >= 12).length}`)
}

for (const [field, label] of [['tldr', 'tldr'], ['spotlights', 'spotlights'], ['reflections', 'reflections']]) {
  const p = []
  paragraphs(cs[field], 'root', `.${field}`, p)
  console.log(`  ${label.padEnd(28)} ${String(p.reduce((a, b) => a + b.n, 0)).padStart(5)}   ${p.filter((x) => x.n >= 12).length}`)
}

const all = []
paragraphs(cs, 'root', '', all)
const prose = all.filter((p) => p.n >= 12).sort((a, b) => b.n - a.n)
console.log(`\n  longest paragraphs (${prose.length} prose paragraphs in total)\n`)
for (const p of prose.slice(0, Number(process.argv[3]) || 25)) {
  console.log(`  ${String(p.n).padStart(3)}w  ${p.path.slice(0, 46).padEnd(46)}  ${p.head}`)
}
