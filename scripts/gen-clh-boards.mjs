#!/usr/bin/env node
/**
 * scripts/gen-clh-boards.mjs
 * Renders CLH infographic boards (walletsprout-style: light cards, ring charts,
 * Says/Does/Thinks/Feels persona, chips, numbered headers) to 1040×585 PNGs in
 * public/work/clh/. Accent = site amber. Rendered via headless Chrome.
 * Run: node scripts/gen-clh-boards.mjs
 */
import { writeFileSync, mkdirSync } from 'fs'
import { execSync } from 'child_process'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = resolve(root, 'public/work/clh')
mkdirSync(outDir, { recursive: true })
const tmp = resolve(root, '.clh-board-tmp')
mkdirSync(tmp, { recursive: true })
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

const INK = '#17181D', MUT = '#6C7180', ACC = '#C77E1A', SOFT = '#F5E9D6'
const LINE = '#E7E3DB', TRACK = '#ECE8E1', PAPER = '#FBFAF7', CARD = '#FFFFFF'

const shell = (title, num, sub, body) => `<!doctype html><html><head><meta charset="utf8">
<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
*{margin:0;padding:0;box-sizing:border-box;font-family:'Poppins',-apple-system,'Helvetica Neue',Arial,sans-serif}
html,body{width:1040px;height:585px;overflow:hidden;background:${PAPER};color:${INK}}
.board{width:1040px;height:585px;padding:52px 56px;display:flex;flex-direction:column;gap:22px}
.eyebrow{font-size:13px;font-weight:600;letter-spacing:.12em;color:${ACC};text-transform:uppercase}
h1{font-size:30px;font-weight:700;letter-spacing:-.01em;line-height:1.1}
.sub{font-size:15px;color:${MUT};font-weight:400;margin-top:4px}
.rule{height:2px;background:${ACC};width:56px;border-radius:2px}
.row{display:flex;gap:18px}
.col{flex:1;display:flex;flex-direction:column;gap:10px}
.card{background:${CARD};border:1px solid ${LINE};border-radius:16px;padding:20px 22px}
.chip{display:inline-flex;align-items:center;gap:9px;background:${CARD};border:1px solid ${LINE};border-radius:999px;padding:9px 16px;font-size:14px;color:${INK};font-weight:500}
.dot{width:9px;height:9px;border-radius:99px;background:${ACC};flex:none}
.k{font-size:12px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:${MUT}}
.v{font-size:14px;color:${INK};line-height:1.5}
.big{font-size:42px;font-weight:700;letter-spacing:-.02em}
.arrow{align-self:center;color:${ACC};font-size:30px;font-weight:700}
.banner{background:${ACC};color:#fff;border-radius:12px;padding:14px 18px;font-size:15px;font-weight:500;line-height:1.45}
.pill2{background:${SOFT};color:${ACC};border-radius:999px;padding:7px 14px;font-size:13px;font-weight:600}
.node{background:${CARD};border:1px solid ${LINE};border-radius:12px;padding:12px 14px;font-size:13px;font-weight:600;text-align:center;flex:1}
.node .s{display:block;font-size:11px;font-weight:500;color:${MUT};margin-top:3px}
.gate{border-color:${ACC};background:${SOFT}}
.slot{border-radius:10px;padding:10px 14px;font-size:13px;font-weight:600;border:1px solid ${LINE};text-align:center}
.ok{background:#EAF3EC;border-color:#CBE3D1;color:#2E6B45}
.bad{background:#FBEAEA;border-color:#F0CFCF;color:#B23B3B}
.grid4{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
.foot{margin-top:auto;display:flex;gap:26px;align-items:center}
.stat .n{font-size:26px;font-weight:700;color:${INK}}
.stat .l{font-size:12px;color:${MUT}}
.avatar{width:52px;height:52px;border-radius:99px;background:${SOFT};color:${ACC};display:flex;align-items:center;justify-content:center;font-weight:700;font-size:20px;flex:none}
</style></head><body><div class="board">
<div><div class="eyebrow">${num} · ${title}</div><h1 style="margin-top:8px">${sub}</h1><div class="rule" style="margin-top:14px"></div></div>
${body}
</div></body></html>`

function ring(pct, label, val) {
  const r = 46, c = 2 * Math.PI * r, off = c * (1 - pct / 100)
  return `<div style="display:flex;flex-direction:column;align-items:center;gap:8px">
   <svg width="118" height="118" viewBox="0 0 118 118"><circle cx="59" cy="59" r="${r}" fill="none" stroke="${TRACK}" stroke-width="11"/>
   <circle cx="59" cy="59" r="${r}" fill="none" stroke="${ACC}" stroke-width="11" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${off}" transform="rotate(-90 59 59)"/>
   <text x="59" y="66" text-anchor="middle" font-size="24" font-weight="700" fill="${INK}" font-family="Poppins">${val}</text></svg>
   <div style="font-size:13px;color:${MUT};text-align:center;max-width:150px">${label}</div></div>`
}

const boards = {
  '01-pre-panel': shell('The problem', '01', 'Contracting lived everywhere except one place', `
    <div class="row" style="align-items:stretch;margin-top:6px">
      <div class="col" style="flex:1.1;gap:12px">
        <div class="k">Before — no single surface</div>
        <div class="chip"><span class="dot"></span>Bulk Excel uploads for assignment</div>
        <div class="chip"><span class="dot"></span>Phone calls to chase acceptance</div>
        <div class="chip"><span class="dot"></span>WhatsApp threads for disputes</div>
      </div>
      <div class="arrow">&rarr;</div>
      <div class="col" style="flex:1">
        <div class="k">After</div>
        <div class="card" style="height:100%;display:flex;flex-direction:column;justify-content:center;gap:8px">
          <div style="font-size:20px;font-weight:700">One CLH panel</div>
          <div class="v">Every contract, one auditable source of truth — "what needs my attention right now, across everything?"</div>
        </div>
      </div>
    </div>
    <div class="foot">
      <div class="stat"><div class="n">~2,400</div><div class="l">contracts / monthly cycle</div></div>
      <div class="stat"><div class="n">1</div><div class="l">central manager</div></div>
      <div class="stat"><div class="n">by hand</div><div class="l">reconciled across spreadsheets</div></div>
    </div>`),

  '02-objective': shell('Objective', '02', 'Know what’s broken in under one second', `
    <div class="row" style="margin-top:4px">
      <div class="node">Scan<span class="s">counts on every tab triage workload before a click</span></div>
      <div class="arrow" style="font-size:22px">&rarr;</div>
      <div class="node">Triage<span class="s">Action Required is the default landing tab</span></div>
      <div class="arrow" style="font-size:22px">&rarr;</div>
      <div class="node">Act<span class="s">inline assign / resolve, in context</span></div>
    </div>
    <div class="row" style="justify-content:center;gap:36px;margin-top:8px;align-items:flex-start">
      ${ring(90, 'auto-match &amp; carry forward', '~90%')}
      ${ring(5, 'near-match to review', '5%')}
      ${ring(2, 'adhoc, no upstream RFQ', '~1.7%')}
    </div>
    <div class="foot"><span class="pill2">Default tab = Action Required</span><span class="pill2">Business goal: D+7 cost predictability</span></div>`),

  '03-persona': shell('User Persona', '03', 'Primary persona — one central operator, portfolio-wide', `
    <div class="card" style="margin-top:2px;display:flex;flex-direction:column;gap:16px">
      <div style="display:flex;gap:16px;align-items:center">
        <div class="avatar">CM</div>
        <div><div style="font-size:18px;font-weight:700">CLH Manager</div><div class="v" style="color:${MUT}">Central Linehaul ops · desktop, Chrome ~1440×900 · bulk-Excel fluent</div></div>
        <div class="banner" style="margin-left:auto;max-width:430px">"What needs my attention right now — across everything?" Not "how is route X doing?"</div>
      </div>
      <div class="grid4">
        <div><div class="k">Says</div><div class="v" style="margin-top:6px">"Clear Action Required and my day is done." "Don't make me sum my own workload."</div></div>
        <div><div class="k">Does</div><div class="v" style="margin-top:6px">Triages the whole portfolio each cycle. Assigns in sequence, in bulk from Excel.</div></div>
        <div><div class="k">Thinks</div><div class="v" style="margin-top:6px">"A half-done route must not look finished." "Which contract am I about to lose?"</div></div>
        <div><div class="k">Feels</div><div class="v" style="margin-top:6px">Confident at density; wary of irreversible actions on live, paid contracts.</div></div>
      </div>
    </div>
    <div class="foot"><span class="pill2">Desktop-only · density is welcome</span><span class="pill2">Hindi toggle only on Terminate + Close</span></div>`),

  '05-flow-map': shell('User flow', '05', 'The assignment loop', `
    <div class="row" style="margin-top:6px;gap:10px;align-items:stretch">
      <div class="node">Action Required<span class="s">Assign — inline row expand</span></div>
      <div class="arrow" style="font-size:20px">&rarr;</div>
      <div class="node">Sent for Approval<span class="s">No-response nudge ≥7 days</span></div>
      <div class="arrow" style="font-size:20px">&rarr;</div>
      <div class="node gate">Approved<span class="s">explicit activation gate</span></div>
      <div class="arrow" style="font-size:20px">&rarr;</div>
      <div class="node">Active<span class="s">monitor · dispute · terminate</span></div>
      <div class="arrow" style="font-size:20px">&rarr;</div>
      <div class="node">Closed<span class="s">read-only</span></div>
    </div>
    <div class="row" style="gap:16px;margin-top:8px">
      <div class="card col"><div class="k">One gesture, two shapes</div><div class="v">RLH = a single form (transporter, amount, confirm). NLH = a slot list under the same inline expand.</div></div>
      <div class="card col" style="border-color:${ACC};background:${SOFT}"><div class="k" style="color:${ACC}">Worst-case-slot rule</div><div class="v">A partially-sent NLH item stays in Action Required until every slot is out.</div></div>
    </div>
    <div class="foot"><div class="stat"><div class="n">14</div><div class="l">end-to-end flows specified</div></div><div class="stat"><div class="n">3</div><div class="l">UI levels — L1 / L2 / L3</div></div></div>`),

  '07-nlh-slots': shell('The rule that holds it together', '07', 'Worst-case-slot placement', `
    <div class="row" style="margin-top:8px;align-items:center;gap:22px">
      <div class="col" style="flex:1.2">
        <div class="k">One NLH contract · 4 vehicle slots</div>
        <div class="row" style="gap:10px"><div class="slot ok">Approved</div><div class="slot ok">Approved</div><div class="slot ok">Approved</div><div class="slot bad">Unassigned</div></div>
        <div class="v" style="margin-top:4px">3 of 4 ready — but one slot is still open.</div>
      </div>
      <div class="arrow">&rarr;</div>
      <div class="col" style="flex:1">
        <div class="card" style="border-color:${ACC};background:${SOFT};text-align:center;padding:26px">
          <div class="k" style="color:${ACC}">The whole item lands in</div>
          <div class="big" style="color:${ACC};margin-top:6px">Action Required</div>
          <div class="v" style="margin-top:8px">Not Approved. An item's tab = its most-broken slot.</div>
        </div>
      </div>
    </div>
    <div class="foot"><span class="pill2">Nothing half-done can look finished</span><span class="pill2">One rule holds NLH (N slots) and RLH (1 slot)</span></div>`),
}

for (const [name, html] of Object.entries(boards)) {
  const htmlPath = resolve(tmp, `${name}.html`)
  writeFileSync(htmlPath, html)
  const out = resolve(outDir, `${name}.png`)
  execSync(
    `"${CHROME}" --headless --disable-gpu --hide-scrollbars --force-device-scale-factor=2 --virtual-time-budget=3500 --window-size=1040,585 --screenshot="${out}" "file://${htmlPath}"`,
    { stdio: 'ignore' },
  )
  console.log('rendered', name + '.png')
}
console.log('done → public/work/clh/')
