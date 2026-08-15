#!/usr/bin/env node
/**
 * scripts/gen-clh-diagrams.mjs
 * Renders the three CLH case-study diagrams (Excalidraw-style: hand-drawn font,
 * rough boxes, single amber accent) to PNG in public/work/clh/.
 *   dg-month.png   — the monthly deadline the whole system serves
 *   dg-model.png   — Design → Requirement → Contract (1:1 regional vs 1:N national)
 *   dg-flow.png    — the full flow map, including the exception loops
 * Run: node scripts/gen-clh-diagrams.mjs
 */
import { writeFileSync, mkdirSync } from 'fs'
import { execFileSync } from 'child_process'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = resolve(root, 'public/work/clh')
const tmp = resolve(root, '.clh-dg-tmp')
mkdirSync(outDir, { recursive: true })
mkdirSync(tmp, { recursive: true })
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

const INK = '#17181D', MUT = '#6C7180', ACC = '#C77E1A', SOFT = '#FBF0DE'
const LINE = '#D9D4CA', PAPER = '#FBFAF7', CARD = '#FFFFFF'

// hand-drawn box edge (classic CSS "sketch" radius)
const ROUGH = 'border-radius:255px 12px 225px 15px/15px 225px 15px 255px;'
const ROUGH2 = 'border-radius:15px 225px 15px 255px/225px 15px 255px 15px;'

const page = (w, h, title, sub, body) => `<!doctype html><html><head><meta charset="utf8">
<style>
@import url('https://fonts.googleapis.com/css2?family=Kalam:wght@400;700&display=swap');
*{margin:0;padding:0;box-sizing:border-box;font-family:'Kalam',cursive}
html,body{width:${w}px;height:${h}px;overflow:hidden;background:${PAPER};color:${INK}}
.wrap{width:${w}px;height:${h}px;padding:46px 54px;display:flex;flex-direction:column}
h1{font-size:34px;font-weight:700;letter-spacing:-.01em}
.sub{font-size:18px;color:${MUT};margin-top:4px}
.rule{width:70px;height:4px;background:${ACC};margin-top:12px;border-radius:3px}
.box{background:${CARD};border:2.5px solid ${INK};${ROUGH}padding:13px 18px;font-size:17px;font-weight:700;text-align:center}
.box .s{display:block;font-weight:400;font-size:14px;color:${MUT};margin-top:2px}
.acc{border-color:${ACC};background:${SOFT};color:${ACC}}
.ghost{border-style:dashed;border-color:${LINE};color:${MUT};font-weight:400;background:transparent}
.arw{color:${ACC};font-size:26px;font-weight:700;display:flex;align-items:center;justify-content:center}
.row{display:flex;align-items:center;gap:12px}
.note{font-size:15px;color:${MUT}}
.tag{display:inline-block;border:2px solid ${ACC};${ROUGH2}background:${SOFT};color:${ACC};font-size:14px;font-weight:700;padding:5px 12px}
</style></head><body><div class="wrap">
<div><h1>${title}</h1><div class="sub">${sub}</div><div class="rule"></div></div>
${body}</div></body></html>`

// ── 1 · THE MONTH ──────────────────────────────────────────────────────────
const month = page(1600, 620, 'One month, one deadline',
  'Everything in this system exists to get 2,400 routes signed before the 1st.', `
<div style="flex:1;display:flex;flex-direction:column;justify-content:center;gap:0">
  <div class="row" style="justify-content:space-between;align-items:flex-end;padding:0 20px">
    <div class="box" style="width:290px">21st of the month<span class="s">Planners publish next month's routes</span></div>
    <div class="box acc" style="width:360px">~10 days<span class="s" style="color:${ACC}">Find vendors · agree rates · collect signatures</span></div>
    <div class="box" style="width:290px">1st<span class="s">Every route must be running</span></div>
  </div>

  <div style="position:relative;margin:26px 20px 0">
    <div style="height:5px;background:${INK};border-radius:4px"></div>
    ${[8, 50, 92].map(p => `<div style="position:absolute;top:-7px;left:${p}%;width:19px;height:19px;background:${p === 50 ? ACC : INK};border-radius:50%;transform:translateX(-50%)"></div>`).join('')}
    <div style="position:absolute;top:20px;left:50%;transform:translateX(-50%);font-size:15px;color:${ACC};font-weight:700">the squeeze</div>
  </div>

  <div class="row" style="margin-top:56px;gap:16px;padding:0 20px">
    <span class="tag">2,400 routes</span>
    <span class="tag">1 central team</span>
    <span class="tag">every month</span>
    <span class="note" style="margin-left:8px">Miss the date and trucks run on no contract — or don't run at all.</span>
  </div>
</div>`)

// ── 2 · OBJECT MODEL ───────────────────────────────────────────────────────
const truck = (label, state, acc) => `<div class="box ${acc ? 'acc' : ''}" style="width:168px;font-size:15px;padding:10px 12px">${label}<span class="s"${acc ? ` style="color:${ACC}"` : ''}>${state}</span></div>`
const model = page(1600, 760, 'A route is not a contract',
  'One month\'s plan fans out into individual truck contracts — and they move at different speeds.', `
<div style="flex:1;display:flex;align-items:center;gap:26px;margin-top:8px">

  <div class="box" style="width:210px;padding:18px">DESIGN<span class="s">April batch<br/>2,400 routes</span></div>
  <div class="arw">→</div>

  <div style="display:flex;flex-direction:column;gap:30px;flex:1">

    <div class="row">
      <div class="box" style="width:230px">REGIONAL ROUTE<span class="s">needs 1 truck</span></div>
      <div class="arw">→</div>
      ${truck('1 contract', 'one vendor, one rate', false)}
      <div class="note" style="margin-left:12px">Simple: the route <b>is</b> the contract.</div>
    </div>

    <div class="row" style="align-items:flex-start">
      <div class="box" style="width:230px;margin-top:34px">NATIONAL ROUTE<span class="s">needs 4 trucks</span></div>
      <div class="arw" style="margin-top:34px">→</div>
      <div style="display:grid;grid-template-columns:repeat(2,auto);gap:10px">
        ${truck('Contract 1', 'upload error', true)}
        ${truck('Contract 2', 'no vendor yet', true)}
        ${truck('Contract 3', 'vendor declined', true)}
        ${truck('Contract 4', 'out for signature', true)}
      </div>
    </div>

  </div>
</div>
<div class="row" style="gap:14px;padding-bottom:6px">
  <span class="tag">the design problem</span>
  <span class="note">One route can sit in four different states at the same time. So where does the route itself live?</span>
</div>`)

// ── 3 · FLOW MAP ───────────────────────────────────────────────────────────
const stage = (n, name, queues) => `<div style="display:flex;flex-direction:column;gap:8px;align-items:center;width:198px">
  <div class="box" style="width:100%;font-size:16px;padding:11px 10px">${name}<span class="s">stage ${n}</span></div>
  ${queues.map(q => `<div class="box ghost" style="width:100%;font-size:13px;padding:6px 8px">${q}</div>`).join('')}
</div>`
const flow = page(1600, 940, 'How a route becomes a running contract',
  'Five stages, their work queues, and the exceptions that send a route backwards.', `
<div style="flex:1;display:flex;flex-direction:column;justify-content:center;gap:0">

  <div class="row" style="gap:10px">
    <div class="box acc" style="width:250px">NETWORK DESIGN<span class="s" style="color:${ACC}">upload · validate · publish</span></div>
    <div class="arw">→</div>
    <div class="note">One bad row rejects the whole batch. A clean file becomes the month's routes.</div>
  </div>
  <div style="margin:2px 0 6px 122px;display:flex;flex-direction:column;align-items:flex-start">
    <div style="width:3px;height:26px;background:${ACC};border-radius:2px"></div>
    <div class="arw" style="margin:-12px 0 0 -10px">↓</div>
  </div>

  <div class="row" style="align-items:flex-start;gap:8px">
    ${stage(1, 'ACTION REQUIRED', ['Unassigned', 'Upload errors', 'Rejected', 'Pre-closed'])}
    <div class="arw" style="margin-top:24px">→</div>
    ${stage(2, 'SENT FOR APPROVAL', ['Awaiting response', 'No response ≥ 7 days'])}
    <div class="arw" style="margin-top:24px">→</div>
    ${stage(3, 'UPCOMING', ['Verify &amp; activate'])}
    <div class="arw" style="margin-top:24px">→</div>
    ${stage(4, 'ACTIVE', ['On track', 'Disputed'])}
    <div class="arw" style="margin-top:24px">→</div>
    ${stage(5, 'CLOSED', ['read-only'])}
  </div>

  <div style="margin-top:26px;border-top:2.5px dashed ${LINE};padding-top:18px">
    <div class="note" style="color:${ACC};font-weight:700;font-size:16px;margin-bottom:12px">
      <span style="font-family:system-ui,sans-serif">&#8635;</span> &nbsp;where routes go backwards
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:11px 34px">
    ${[
      ['Vendor declines', 'back to Action Required → Rejected, reason attached'],
      ['No reply after 7 days', 'reminder, or reassign to someone else'],
      ['Dates change on a live contract', 'contract closes and is reissued for acceptance'],
      ['Planners remove a route mid-cycle', 'its contracts pre-close on notice'],
      ['Termination', 'straight to Closed, after a stated notice period'],
    ].map(([a, b]) => `<div class="row" style="gap:9px"><span class="tag" style="min-width:236px;text-align:center">${a}</span><span class="arw" style="font-size:18px">→</span><span class="note" style="font-size:14px">${b}</span></div>`).join('')}
    </div>
  </div>
</div>`)

const jobs = [['dg-month', month], ['dg-model', model], ['dg-flow', flow]]
for (const [name, html] of jobs) {
  const p = resolve(tmp, `${name}.html`)
  writeFileSync(p, html)
  const out = resolve(outDir, `${name}.png`)
  execFileSync(CHROME, [
    '--headless', '--disable-gpu', '--hide-scrollbars',
    '--force-device-scale-factor=2', '--virtual-time-budget=4000',
    `--window-size=${html.match(/width:(\d+)px;height:(\d+)px/)[1]},${html.match(/width:(\d+)px;height:(\d+)px/)[2]}`,
    `--screenshot=${out}`, `file://${p}`,
  ], { stdio: 'ignore' })
  console.log('rendered', name + '.png')
}
console.log('done → public/work/clh/')
