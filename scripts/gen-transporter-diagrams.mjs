#!/usr/bin/env node
/**
 * scripts/gen-transporter-diagrams.mjs
 * Renders the Transporter Panel case-study diagrams to PNG in public/work/transporter-panel/.
 * Same visual language as the CLH diagrams (hand-drawn boxes, single amber accent).
 *
 *   dg-lifecycle.png  — the five-state user flow, with the exception loops that leave it
 *   dg-actions.png    — the action column read down the five tabs (the IA thesis)
 *   dg-confirm.png    — the confirm/dispute fork on Completed, incl. both guards
 *
 * Run: node scripts/gen-transporter-diagrams.mjs
 * Contains no NDA-sensitive values — labels come from the live SOT UI only.
 */
import { writeFileSync, mkdirSync } from 'fs'
import { execFileSync } from 'child_process'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = resolve(root, 'public/work/transporter-panel')
const tmp = resolve(root, '.asm-dg-tmp')
mkdirSync(outDir, { recursive: true })
mkdirSync(tmp, { recursive: true })
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

const INK = '#17181D', MUT = '#6C7180', ACC = '#C77E1A', SOFT = '#FBF0DE'
const LINE = '#D9D4CA', PAPER = '#FBFAF7', CARD = '#FFFFFF', STOP = '#B4322B'

const ROUGH = 'border-radius:255px 12px 225px 15px/15px 225px 15px 255px;'
const ROUGH2 = 'border-radius:15px 225px 15px 255px/225px 15px 255px 15px;'

const page = (w, h, title, sub, body) => `<!doctype html><html><head><meta charset="utf8">
<style>
@import url('https://fonts.googleapis.com/css2?family=Kalam:wght@400;700&display=swap');
*{margin:0;padding:0;box-sizing:border-box;font-family:'Kalam','Bradley Hand','Segoe Print',cursive}
html,body{width:${w}px;height:${h}px;overflow:hidden;background:${PAPER};color:${INK}}
.wrap{width:${w}px;height:${h}px;padding:46px 54px;display:flex;flex-direction:column}
h1{font-size:34px;font-weight:700;letter-spacing:-.01em}
.sub{font-size:18px;color:${MUT};margin-top:4px}
.rule{width:70px;height:4px;background:${ACC};margin-top:12px;border-radius:3px}
.box{background:${CARD};border:2.5px solid ${INK};${ROUGH}padding:13px 18px;font-size:17px;font-weight:700;text-align:center}
.box .s{display:block;font-weight:400;font-size:14px;color:${MUT};margin-top:3px;line-height:1.35}
.acc{border-color:${ACC};background:${SOFT};color:${ACC}}
.acc .s{color:${ACC}}
.stop{border-color:${STOP};background:#FBEAE8;color:${STOP}}
.stop .s{color:${STOP}}
.ghost{border-style:dashed;border-color:${LINE};color:${MUT};font-weight:400;background:transparent}
.arw{color:${ACC};font-size:26px;font-weight:700;display:flex;align-items:center;justify-content:center}
.row{display:flex;align-items:center;gap:12px}
.note{font-size:15px;color:${MUT}}
.tag{display:inline-block;border:2px solid ${ACC};${ROUGH2}background:${SOFT};color:${ACC};font-size:14px;font-weight:700;padding:5px 12px}
.tagq{display:inline-block;border:2px dashed ${LINE};${ROUGH2}color:${MUT};font-size:14px;padding:5px 12px}
</style></head><body><div class="wrap">
<div><h1>${title}</h1><div class="sub">${sub}</div><div class="rule"></div></div>
${body}</div></body></html>`

// ── 1 · THE LIFECYCLE ──────────────────────────────────────────────────────
const STATES = [
  ['Pending Assignment', 'Assign vehicle + driver,<br/>then Accept', 'Accept · Reject'],
  ['Upcoming', 'Staffed and waiting<br/>for placement time', 'Update · Reject'],
  ['In-Transit', 'Running. Live Updates<br/>replace the actions', '— nothing to do —'],
  ['Completed', 'Agree the earnings,<br/>or dispute them', 'Confirm · Raise Dispute'],
]
const lifecycle = page(1760, 730, 'One trip, five states',
  "The action column is the tab's thesis — read the right-hand edge and the lifecycle explains itself.", `
<div style="flex:1;display:flex;flex-direction:column;justify-content:center">

  <div class="row" style="justify-content:space-between;align-items:stretch">
    ${STATES.map((s, i) => `
      <div style="display:flex;align-items:center;gap:10px">
        <div class="box ${i === 3 ? 'acc' : ''}" style="width:300px;padding:15px 14px">
          ${s[0]}<span class="s">${s[1]}</span>
          <span class="s" style="margin-top:9px;font-weight:700;color:${i === 2 ? MUT : i === 3 ? ACC : INK}">${s[2]}</span>
        </div>
        ${i < 3 ? '<div class="arw">→</div>' : ''}
      </div>`).join('')}
  </div>

  <div style="margin-top:40px;display:flex;gap:22px;align-items:flex-start">
    <div class="box ghost" style="width:300px;padding:15px 14px">Cancelled
      <span class="s">Read-only log. Missed Earning<br/>+ the reason, in his own words</span>
      <span class="s" style="margin-top:9px">— nothing to do —</span></div>
    <div style="flex:1;display:flex;flex-direction:column;gap:11px;padding-top:4px">
      <div class="note" style="font-weight:700;color:${INK};font-size:16px">Three ways a trip leaves the happy path</div>
      ${[
        ['Rejected before placement', 'consequences shown first, then a reason from 6 — lands in Cancelled'],
        ['Not assigned by the deadline', 'auto-rejected at placement time — the banner says so up front'],
        ['Earnings look wrong', 'Raise Dispute → 7 bilingual categories → tracked in the Disputes tab'],
      ].map(([a, b]) => `<div class="row" style="gap:9px"><span class="tag" style="min-width:250px;text-align:center">${a}</span><span class="arw" style="font-size:18px">→</span><span class="note" style="font-size:14px">${b}</span></div>`).join('')}
    </div>
  </div>

  <div class="row" style="margin-top:34px;gap:14px">
    <span class="tagq">Placement Time</span><span class="arw" style="font-size:18px">→</span>
    <span class="tagq">Departure Time</span>
    <span class="note" style="margin-left:14px">Expected Earnings</span><span class="arw" style="font-size:18px">→</span>
    <span class="note">Total Earnings</span><span class="arw" style="font-size:18px">→</span>
    <span class="tag">Missed Earning</span>
    <span class="note" style="margin-left:12px">— the column renames itself when its meaning changes.</span>
  </div>
</div>`)

// ── 2 · THE ACTION COLUMN ──────────────────────────────────────────────────
const ROWS = [
  ['Pending Assignment', 'Accept', 'disabled until vehicle + driver are both assigned', 'Reject'],
  ['Upcoming', 'Update', 'disabled until something actually changes', 'Reject'],
  ['In-Transit', '—', 'no action column at all — the truck is moving', ''],
  ['Completed', 'Confirm Details', 'freezes the trip for payout', 'Raise Dispute'],
  ['Cancelled', '—', 'no action column at all — it already happened', ''],
]
const actions = page(1600, 660, 'What the right-hand edge says',
  'I would rather a column disappear than sit there full of disabled buttons.', `
<div style="flex:1;display:flex;flex-direction:column;justify-content:center;gap:14px">
  ${ROWS.map(([tab, primary, note, secondary]) => `
  <div class="row" style="gap:16px">
    <div class="box ghost" style="width:270px;text-align:left;font-weight:700;color:${INK};padding:11px 16px">${tab}</div>
    <div class="arw" style="font-size:20px">→</div>
    <div class="box ${primary === '—' ? 'ghost' : primary === 'Confirm Details' ? 'acc' : ''}" style="width:200px;padding:10px 12px;font-size:16px">${primary}</div>
    ${secondary ? `<div class="box ghost" style="width:170px;padding:10px 12px;font-size:15px">${secondary}</div>` : '<div style="width:170px"></div>'}
    <div class="note" style="font-size:15px">${note}</div>
  </div>`).join('')}
  <div class="note" style="margin-top:20px;font-size:16px;color:${INK}">
    One primary action per row, always visible at rest — never revealed on hover, never a colour alone.
  </div>
</div>`)

// ── 3 · THE CONFIRM FORK ───────────────────────────────────────────────────
const confirm = page(1700, 700, 'The screen where money changes hands',
  'Confirming freezes the trip for payout: data final, dispute window closed. Both dangerous paths are guarded.', `
<div style="flex:1;display:flex;flex-direction:column;justify-content:center;gap:26px">

  <div class="row" style="gap:14px">
    <div class="box" style="width:250px">A completed trip<span class="s">Earnings + the basis they<br/>were computed from</span></div>
    <div class="arw">→</div>
    <div class="box ghost" style="width:230px">Does the number<br/>look right?</div>
    <div class="arw">→</div>
    <div class="box acc" style="width:230px">Confirm Details<span class="s">"Payment will be initiated"</span></div>
    <div class="note" style="max-width:280px;font-size:14px">Bulk-select confirms a batch — the only way this works at month end.</div>
  </div>

  <div class="row" style="gap:14px;padding-left:278px">
    <div class="arw" style="transform:rotate(90deg)">→</div>
    <div class="box" style="width:230px">Raise Dispute<span class="s">7 categories, each printed<br/>in English and Hindi</span></div>
    <div class="arw">→</div>
    <div class="box ghost" style="width:250px">Tracked in the Disputes tab<span class="s">Draft → Review → Approved /<br/>Partial / Rejected / Reopened</span></div>
  </div>

  <div style="height:2px;background:${LINE};margin:6px 0"></div>

  <div class="row" style="gap:20px;align-items:stretch">
    <div class="box stop" style="width:400px;text-align:left;padding:15px 18px">Guard 1 — Confirm with a live dispute
      <span class="s">"Confirming this trip will dismiss your dispute immediately. You won't be able to raise it again."</span>
      <span class="s" style="margin-top:7px;font-weight:700">Close is the dominant option.</span></div>
    <div class="box stop" style="width:400px;text-align:left;padding:15px 18px">Guard 2 — Reporting a trip that exists
      <span class="s">"This trip isn't missing! Trip TRP1234567890 is currently In-Transit tab."</span>
      <span class="s" style="margin-top:7px;font-weight:700">A link, not a support ticket.</span></div>
    <div style="flex:1;display:flex;flex-direction:column;justify-content:center;align-items:flex-start;gap:9px">
      <span class="tag">Consequence before input</span>
      <span class="tag">No blank cells — an absence is a value</span>
      <span class="tag">Hindi where money is at stake</span>
    </div>
  </div>
</div>`)

const jobs = [['dg-lifecycle', lifecycle], ['dg-actions', actions], ['dg-confirm', confirm]]
for (const [name, html] of jobs) {
  const p = resolve(tmp, `${name}.html`)
  writeFileSync(p, html)
  const out = resolve(outDir, `${name}.png`)
  const [, w, h] = html.match(/width:(\d+)px;height:(\d+)px/)
  execFileSync(CHROME, [
    '--headless', '--disable-gpu', '--hide-scrollbars',
    '--force-device-scale-factor=2', '--virtual-time-budget=4000',
    `--window-size=${w},${h}`, `--screenshot=${out}`, `file://${p}`,
  ], { stdio: 'ignore' })
  console.log('rendered', name + '.png')
}
console.log('done → public/work/transporter-panel/')
