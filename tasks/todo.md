# Task: Full revamp — two parallel lanes (ACTIVE, started 2026-08-15)

Pranita rewrites all copy; a collaborator rebuilds the visual system via a GitHub fork + PRs.
Branch: `revamp` (pushed to origin) ← `text/*` and `design/*`. Merges to `public-main` at the end.
Contract: [CONTRIBUTING.md](../CONTRIBUTING.md) · Design floor: [docs/DESIGN-BRIEF.md](../docs/DESIGN-BRIEF.md)

## Phase 0 — the contract (DONE, commit `186f1e6`)
- [x] P0.1 Extract all site copy → `src/content/site.ts`; components render it, zero visual change
- [x] P0.2 Kill the `CaseIndex` duplicate `CASES` array → `src/content/cases/summaries.ts`;
      `CaseStudy extends CaseSummary`; `CASE_ORDER` is the single source of display order;
      `NODE_SIGNATURES` re-keyed by slug (blank-card trap gone)
- [x] P0.3 `CONTRIBUTING.md` — ownership map, branch flow, NDA-scan rules, absent files
- [x] P0.4 `docs/DESIGN-BRIEF.md` — what the rebuild may change, and the a11y/motion/perf floor
- [x] P0.5 `nda-scan` fixed — numeric tokens anchored, `geo/` skipped, deliberate publications
      allowlisted with rationale. **224 hits → clean exit.**
- [x] P0.6 `revamp` branch created and pushed to origin

**Caught in passing:** deriving the home cards from the full case registry pulled all five case
studies into the initial bundle (360 kB → prose in the eager chunk, incl. the un-fuzzed CLH
figure). Splitting card copy from page copy fixed it — main chunk now 239 kB, case prose back in
the lazy `CaseStudyPage` chunk.

**Verified:** `npm run build` green (1.87s, tsc clean) · `npm run nda-scan` clean · home renders
all 5 cards with correct copy + node signatures (**settles the TPN-01 card that was never visually
confirmed**) · `/work/transporter-panel` and `/work/linehaul-nexus` both render, 49 images load,
`noindex` intact · zero console errors.

## Phase 1 — parallel lanes (NEXT)
- [ ] Text: home/about/footer copy → sets the voice → then cases TPN→NDC→CLH→TCM→PLC → resume → SEO
- [ ] Design: new system in `/dev/kitchen-sink` first, then applied; decides the two-layout question
- [ ] Rebase `text/*` on `revamp` whenever a design PR merges

## Phase 2 — integration
- [ ] Design PRs merged, text merged last, full verification sweep, `revamp` → `public-main`

## Blocked on Pranita (blocks copy completeness)
Portrait photo · anonymized Hindi UT findings (TCM) · per-project timelines + ship status ·
2018–21 gap one-liner · Wizrdom/AuraSmart metric · SetuX rollout numbers confirmation
(209 vendors / 98% / 38K+ trips — currently sourced only from her self-review draft).

---

# Task: 3D Portfolio Website + Resume Overhaul

Master plan: `~/.claude/plans/https-pranitas-framer-website-i-need-to-zazzy-eagle.md`

## Plan
- [x] P0 — Scaffold: Vite+React19+TS+Tailwind v4, tokens, folders, noise texture, favicon, build green, git init
- [ ] P1 — Content layer: fuzzing-map.json, resume.json, 4 case-study narratives (8-step each) — **content gate: Pranita review before visual build of case pages**
- [ ] P2a — Resume PDFs: designed + ATS from resume.json, pdftotext parse verification
- [ ] P2b — Asset pipeline: sanitized prototype copies → public/prototypes/, screenshot capture via Chrome MCP, optimize-images
- [ ] P3 — Tokens/primitives/chrome + /dev/kitchen-sink (verify: 3-breakpoint screenshots, keyboard nav, reduced-motion)
- [ ] P4 — Case-study template + NDC page end-to-end (verify: Lighthouse a11y ≥95, iframe facade works)
- [ ] P5 — Home page 2D-complete with poster hero placeholder
- [ ] P6 — 3D network hero (verify: ≥50fps trace, unmount leak check, fallback paths)
- [ ] P7 — Remaining 3 case studies + secondary sections
- [ ] P8 — Polish + audit gate: NDA scan zero-match, Lighthouse targets, OG images, responsive sweep 360→1920

---

# Task: Transporter Panel case study (was "Assignment Module" — renamed TPN-01, position #1)

Contract Management (TCM-03) is **paused**, untouched. SOT = `Figma- Assignment module/` (182 PNGs, 5 tabs), the version live in production.

## Plan
- [x] A0 — Inventory SOT + confirm what's missing (KRD absent; PDF extraction unavailable)
- [x] A1 — Read anchor screens: 5 tab defaults + confirm/dispute/reject/missing-trip flows
- [x] A2 — Write `tasks/transporter-panel-sot-map.md` (verbatim UI facts, evidence base)
- [x] A3 — Write `content/case-studies/00-transporter-panel.md` (8-step narrative, SOT-accurate)
- [x] A3b — 3 source PDFs added + extracted (PyMuPDF); rewrote problem statement / objective / business from them; 7 new fuzz pairs + 11 banned strings added to `fuzzing-map.json`; banned-string scan on the case study returns zero — **at P1 content gate: Pranita review before A4**
- [x] A4 — Built `src/content/cases/transporter-panel.tsx` (typed Block[], closed vocabulary — text/quote/flow/statRow/matrix/wordList/rejected/image only)
- [x] A5 — Registered first in `caseStudyList`; codes renumbered to match display order (TPN-01 · NDC-02 · CLH-03 · TCM-04 · PLC-05); next-cycle closed PLC-05 → TPN-01
- [x] A6 — 10 SOT screens exported + 3 diagrams rendered → `public/work/transporter-panel/` (13 images, all wired, zero placeholders left). Scripts: `npm run shots:transporter` · `npm run diagrams:transporter`
- [x] A7 — `npm run build` green (1.96s, tsc clean). `npm run nda-scan`: **zero hits attributable to this work**; 224 pre-existing hits remain in files this task didn't touch — see Known NDA debt below.

## Corrections against the old draft (`../reactive-resume/tasks/case-studies/assignment-module.md`)
- **Platform was wrong.** Draft says "TMS panel, mobile-first". SOT is a **desktop transporter web panel** (left nav, 5-tab dense table, 7-col rows).
- Sub-tab taxonomy is **4 pills, not 3**: All / Pending Confirmation / Confirmed by You / No Action Needed. The draft's claim that the "All tab defeats the purpose" describes a rejected V2 argument — All shipped.
- Draft's "V3 collapsed four trip-type names to two" is unverified against this SOT — do not publish.

## Blocked / waiting on Pranita
- ~~Assignment-module KRD~~ — **resolved 2026-08-08**, 3 PDFs added
- ~~PDF extraction~~ — **resolved**, use PyMuPDF (`import fitz`); `pdftotext`/`markitdown` are absent
- ~~Timeline~~ — **resolved**: Sept – Nov 2025, design review 18 Nov 2025 (corroborated by the product-status tracker's "Last updated Nov 20, 2025")
- ~~Rule 2/3 deviations~~ and ~~Adhoc actions~~ — **resolved**: SOT Figma is authoritative, both written up as deliberate calls with their rationale (see transporter-panel-sot-map.md § Resolved calls)
- Nothing — TPN-01 is complete and rendering.
- Portrait photo (high-res, plain background)
- Hindi UT top findings (anonymized) for CS3
- Per-project timelines + ship status
- 2018–2021 gap one-liner
- SetuX rollout numbers confirmation (resume claim)
- Pre-Meesho metrics (Wizrdom/AuraSmart)

## Review
(to be filled at completion)

## Known NDA debt (pre-existing, NOT introduced by the Transporter Panel work)

`npm run nda-scan` exits 1 with 224 hits, all in files this task did not create or modify:

| File | Hits | String | Verdict |
|---|---|---|---|
| `dist/geo/india-points.json`, `dist/geo/hubs.json` | 206 | `0.77` | **False positive** — map coordinates. The `0.77` banned token needs to be scoped (e.g. `₹0.77`) or geo/ excluded. |
| `dist/assets/CaseStudyPage-*.js` | 7 | `2,400` | **Real leak** — CLH ships the un-fuzzed RFQ volume into the public bundle. Should use the `rfq_volume` fuzz pair. |
| `content/case-studies/CLH-SCRIPT-v3.md` | 7 | `2,400` | Working doc in a scanned dir. Move to `tasks/` like `transporter-panel-sot-map.md`. |
| `dist/resume/*.svg`, `*.jsonresume.json` | 4 | `SetuX` | **Real exposure** — the private resume, which intentionally keeps real names/numbers, is being emitted into the public `dist/`. Either stop publishing it or gate it. |

Fixing these is out of scope for the Transporter Panel case study; flagged for a follow-up pass.

## Assignment image set (13, all in public/work/transporter-panel/)

| Step | Images |
|---|---|
| 01 Problem | `pending-default` |
| 03 Persona | `missing-trip-challan` *(challan region blurred — real vendor/driver/address data)* |
| 04 IA | `dg-actions` · `completed-default` · `cancelled-remarks` |
| 05 User Flow | `dg-lifecycle` · `upcoming-list` · `reject-consequences` · `in-transit` · `route-timeline` · `confirm-active-dispute` · `raise-dispute-form` · `dg-confirm` |

Three diagrams are generated, not screenshots — `dg-lifecycle` (five states + the three exception
paths), `dg-actions` (the action column read down all five tabs), `dg-confirm` (the confirm/dispute
fork with both guards). Same hand-drawn visual language as the CLH diagrams. No NDA values in any of them.

**Verified:** `npm run build` green · every `/work/transporter-panel/*` ref resolves to a file on disk ·
page renders at `/work/transporter-panel` (headless screenshot: hero, TLDR stats, flow block,
wordList, matrix table and the browser-framed blurred challan all correct) · NDA scan shows zero
assignment-attributable hits.

**Known dangling reference (pre-existing):** `npm run optimize-images` points at
`scripts/optimize-images.mjs`, which does not exist. The assignment export script does its own
LANCZOS downscale + PNG optimize, so it isn't blocked by this — but the npm script is broken for
everything else.

## Repo hygiene done this session
- `.gitignore` now excludes `Figma- Assignment module/` — 182 raw SOT PNGs plus 3 source PDFs containing provisioning figures, the ticketing-vendor name, and NPS targets. They were untracked but would have been committed.
- `tasks/transporter-panel-sot-map.md` moved out of `content/case-studies/` (a scanned dir) since it names banned strings by design.

## 2026-08-15 — screens pass + review-deck reframe (TPN-01)

**Shipped**
- Un-cropped `raise-dispute-form` (all seven bilingual sub-categories now visible) — the 56%-width crop was what cut the text.
- New exports: `disputes-list` (Dispute Management landing, five status tabs, full table) and `raise-dispute-details` (right-hand Dispute Details panel — one current-vs-expected card per selected issue).
- `missing-trip-challan` re-sourced from `Missing Trip - Raise Dispute.png` — **no error state**, and the challan is no longer blanket-blurred. Only five personal-data fields are redacted (shipper name + address, transporter name + ID, delivery address, driver name, driver mobile); the Trip ID inside its green box stays sharp, which is the point of the screen. Boxes are fractions of the full frame, measured against that exact source — re-measure if it is re-exported from Figma.
- Ch04: `screensGrid` (cols 2) of all five tab defaults in lifecycle order, each caption naming the tab's one action. The standalone `cancelled-remarks` image was dropped — the gallery carries it, and its Missed Earning / Remark point moved into the caption.
- Ch05: right-hand dispute panel + disputes list added; missing-trip copy rewritten around the challan rather than the error, with the false-missing guard kept as copy.
- Deck-informed copy: programme context in ch01 (three parts, this is the middle one), sharper root cause (a large changing pool of temporary depot staff measured on compliance targets), no-traceability / single-point-of-contact dependence, and the three goals stated plainly in ch02.
- **Self-invoicing removed** from the TL;DR outcome, ch02 and ch08. The payout argument now rests on accurate assignment data + an agreed on-screen record.

**Deliberately not taken from the deck:** placement, onboarding, fleet management, driver app, WhatsApp comms, payments screens (separate project); the deck's older vocabulary (Opt-Out, five dispute categories, a Payments tab) — the Figma wins; and its private figures (35% inaccuracy, the ~25/16/33/53/35% breakdown, 1000+ SC operators, 30+45 day cycle, 15–20 day disputes, 80%+ automated payouts). `nda-scan` does not carry those tokens, so that one is discipline, not a gate — grepped clean.

**Verified:** `npm run build` green · `npm run nda-scan` clean · `count:copy TPN` 4,618w, median 23 / p75 31 / longest 51 / zero >60w — within budget · `check:facts check TPN` 55→60, single loss was a quote-pairing artifact (`"missing"`), the claim itself is intact · browser walk at `/work/transporter-panel`: 23 images all load, gallery renders 5 cells at 456px in two columns, the three new shots render full-width in browser frames, "self-invoic" appears nowhere.

**Corrected:** ADR-002's note that `screensGrid` crops screen tops was stale — it does not crop. Replaced with the real constraint (legibility per column count).

## 2026-08-15 — Fable review panel on TPN-01, and the fixes

Four Fable reviewers ran against the Transporter Panel only (comprehension on the rendered page,
design craft, copy quality, gaps). NDC/CLH/TCM/PLC were not touched.

**The comprehension test passed** — a design lead with no logistics context wrote an accurate
paragraph on what was designed and why after one read. What failed was the perimeter.

### Fixed
- **Factual error: the screens-per-tab table summed to 178, not 182.** Counted against the SOT
  export — Pending 30 · Upcoming 29 · In-Transit 10 · **Completed 106** · Cancelled 7 = 182. The
  case said 102 for Completed. Corrected in the matrix, the chapter title and the TL;DR outcome;
  shares recomputed to 16/16/5/58/4.
- **The TL;DR never rendered on this page.** `TldrBlock` was wired into `CaseLayout` only, and this
  case is `layout: 'editorial'` — so the problem statement, three outcomes and stat tiles were
  authored and invisible. Now rendered in both layouts (`EditorialCaseLayout.tsx`).
- **A flat contradiction:** ch4 said disputes are "raised from anywhere", the closing said "only
  from Completed". Both can't be true — now says built for anywhere, one entry point wired in this
  release.
- **Six passages broken by the earlier cut** — an orphaned "Not met everywhere", "Three traits"
  pointing at a matrix of asks, Problem 2's `effect` field holding the rejection rationale, ch2 and
  ch8 opening mid-thought, unintroduced phaseCards.
- **"handshake"** inverted its own meaning in a payments story → "physical proof".
- **Research provenance** — the eight findings read as assumptions. Now names the three methods
  Pranita confirmed (talked to transporters · read the dispute ticket log · watched the WhatsApp
  module in use), with no invented counts. The complaint-mix analysis moved out of ch5 into the
  research chapter, where a reader looks for it.
- **Validation** — usability testing on both guard modals is now stated in ch5. Nothing on the page
  says testing happened before this.
- **"Placement time"** — the term every deadline, urgency chip and auto-rejection hangs on, never
  defined. Now glossed at first use.
- **"Confirmation" had no referent** for two chapters — ch2 now names Confirm Details.
- **The closing heading is hardcoded "What I'd test next."** over reflections that were aphorisms.
  Reflections rewritten as actual open questions.
- **One illegal outcome claim deleted** — "Each one, once named, stopped generating a phone call"
  was a measured result in a case whose credibility rests on claiming none.
- Decisions argued in three places collapsed to one home each (Adhoc/settlement, Hindi inline);
  two strawman rejected-patterns dropped; jargon glossed (challan, Adhoc, TMS, POC, RFQ).

### Measurement bug found in my own gate
`count-copy.mjs` counted every string over 12 words as a "prose paragraph", including chapter
titles, table cells and captions — inflating TPN-01 to 98 paragraphs when about half were headings.
The reference was measured by counting `p`/`li` elements only. Corrected to the same two-step
method, and the short-to-prose ratio gate was removed: the reference's "123 short elements" are
one-word `p` tags used as labels (`PROBLEM`, `IF`, `THEN`), which our block vocabulary puts in
dedicated fields. Gating on it would measure markup style, not writing.

### Where TPN-01 landed
Reading copy 1,990w against a 1,800 target (reference 1,401) · 74 prose paragraphs against 50 ·
median 24 · p75 30 · longest 41 · one paragraph over 40 words. Build green, NDA scan clean, no fact
lost that wasn't a deliberate correction.

The two gates it misses are honest: this case carries 23 screenshots, 4 matrices, 3 rule lists, 2
problem/fix pairs and 8 research notes, and the reference carries far less. Cutting to 1,800 from
here means deleting evidence, which is the thing Pranita reversed last time.

### Still owed by Pranita — each is one edit when she has it
- **Research scale**: roughly how many transporters, over what period. She chose "methods only, no
  numbers" for now; the counts would make the strongest section stronger.
- **Usability testing specifics**: how many participants, and one thing the testing changed. The
  page currently says testing happened and claims nothing about what it found.
- **Go-live date and rollout scope** — the eyebrow says LIVE (she confirmed: built and in
  production) but the page never says when, or whether it was a pilot or everyone.
- **Anything observable post-launch**, even qualitative. Ch8 speaks in the future conditional on a
  product that has been live for months, which reads worse than "I can't share the numbers".
- **The money tail**: after Confirm Details the invoice generates — and the page stops. No payout
  surface for a case whose thesis is payment.
- **Trip creation**: the opening villain is depot staff retyping trips, and the biggest error class
  is a creation-side error. The panel starts at "trip exists", so the villain of act one is never
  defeated on the page.
