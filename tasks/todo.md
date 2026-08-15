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

# Task: Assignment Module case study (NEW — position #1)

Contract Management (TCM-03) is **paused**, untouched. SOT = `Figma- Assignment module/` (182 PNGs, 5 tabs), the version live in production.

## Plan
- [x] A0 — Inventory SOT + confirm what's missing (KRD absent; PDF extraction unavailable)
- [x] A1 — Read anchor screens: 5 tab defaults + confirm/dispute/reject/missing-trip flows
- [x] A2 — Write `tasks/assignment-sot-map.md` (verbatim UI facts, evidence base)
- [x] A3 — Write `content/case-studies/00-assignment-module.md` (8-step narrative, SOT-accurate)
- [x] A3b — 3 source PDFs added + extracted (PyMuPDF); rewrote problem statement / objective / business from them; 7 new fuzz pairs + 11 banned strings added to `fuzzing-map.json`; banned-string scan on the case study returns zero — **at P1 content gate: Pranita review before A4**
- [x] A4 — Built `src/content/cases/assignment-module.tsx` (typed Block[], closed vocabulary — text/quote/flow/statRow/matrix/wordList/rejected/image only)
- [x] A5 — Registered first in `caseStudyList`; codes renumbered to match display order (ASM-01 · NDC-02 · CLH-03 · TCM-04 · PLC-05); next-cycle closed PLC-05 → ASM-01
- [x] A6 — 10 SOT screens exported + 3 diagrams rendered → `public/work/assignment/` (13 images, all wired, zero placeholders left). Scripts: `npm run shots:assignment` · `npm run diagrams:assignment`
- [x] A7 — `npm run build` green (1.96s, tsc clean). `npm run nda-scan`: **zero hits attributable to this work**; 224 pre-existing hits remain in files this task didn't touch — see Known NDA debt below.

## Corrections against the old draft (`../reactive-resume/tasks/case-studies/assignment-module.md`)
- **Platform was wrong.** Draft says "TMS panel, mobile-first". SOT is a **desktop transporter web panel** (left nav, 5-tab dense table, 7-col rows).
- Sub-tab taxonomy is **4 pills, not 3**: All / Pending Confirmation / Confirmed by You / No Action Needed. The draft's claim that the "All tab defeats the purpose" describes a rejected V2 argument — All shipped.
- Draft's "V3 collapsed four trip-type names to two" is unverified against this SOT — do not publish.

## Blocked / waiting on Pranita
- ~~Assignment-module KRD~~ — **resolved 2026-08-08**, 3 PDFs added
- ~~PDF extraction~~ — **resolved**, use PyMuPDF (`import fitz`); `pdftotext`/`markitdown` are absent
- ~~Timeline~~ — **resolved**: Sept – Nov 2025, design review 18 Nov 2025 (corroborated by the product-status tracker's "Last updated Nov 20, 2025")
- ~~Rule 2/3 deviations~~ and ~~Adhoc actions~~ — **resolved**: SOT Figma is authoritative, both written up as deliberate calls with their rationale (see assignment-sot-map.md § Resolved calls)
- Nothing — ASM-01 is complete and rendering.
- Portrait photo (high-res, plain background)
- Hindi UT top findings (anonymized) for CS3
- Per-project timelines + ship status
- 2018–2021 gap one-liner
- SetuX rollout numbers confirmation (resume claim)
- Pre-Meesho metrics (Wizrdom/AuraSmart)

## Review
(to be filled at completion)

## Known NDA debt (pre-existing, NOT introduced by the assignment work)

`npm run nda-scan` exits 1 with 224 hits, all in files this task did not create or modify:

| File | Hits | String | Verdict |
|---|---|---|---|
| `dist/geo/india-points.json`, `dist/geo/hubs.json` | 206 | `0.77` | **False positive** — map coordinates. The `0.77` banned token needs to be scoped (e.g. `₹0.77`) or geo/ excluded. |
| `dist/assets/CaseStudyPage-*.js` | 7 | `2,400` | **Real leak** — CLH ships the un-fuzzed RFQ volume into the public bundle. Should use the `rfq_volume` fuzz pair. |
| `content/case-studies/CLH-SCRIPT-v3.md` | 7 | `2,400` | Working doc in a scanned dir. Move to `tasks/` like `assignment-sot-map.md`. |
| `dist/resume/*.svg`, `*.jsonresume.json` | 4 | `SetuX` | **Real exposure** — the private resume, which intentionally keeps real names/numbers, is being emitted into the public `dist/`. Either stop publishing it or gate it. |

Fixing these is out of scope for the assignment case study; flagged for a follow-up pass.

## Assignment image set (13, all in public/work/assignment/)

| Step | Images |
|---|---|
| 01 Problem | `pending-default` |
| 03 Persona | `missing-trip-challan` *(challan region blurred — real vendor/driver/address data)* |
| 04 IA | `dg-actions` · `completed-default` · `cancelled-remarks` |
| 05 User Flow | `dg-lifecycle` · `upcoming-list` · `reject-consequences` · `in-transit` · `route-timeline` · `confirm-active-dispute` · `raise-dispute-form` · `dg-confirm` |

Three diagrams are generated, not screenshots — `dg-lifecycle` (five states + the three exception
paths), `dg-actions` (the action column read down all five tabs), `dg-confirm` (the confirm/dispute
fork with both guards). Same hand-drawn visual language as the CLH diagrams. No NDA values in any of them.

**Verified:** `npm run build` green · every `/work/assignment/*` ref resolves to a file on disk ·
page renders at `/work/assignment-module` (headless screenshot: hero, TLDR stats, flow block,
wordList, matrix table and the browser-framed blurred challan all correct) · NDA scan shows zero
assignment-attributable hits.

**Known dangling reference (pre-existing):** `npm run optimize-images` points at
`scripts/optimize-images.mjs`, which does not exist. The assignment export script does its own
LANCZOS downscale + PNG optimize, so it isn't blocked by this — but the npm script is broken for
everything else.

## Repo hygiene done this session
- `.gitignore` now excludes `Figma- Assignment module/` — 182 raw SOT PNGs plus 3 source PDFs containing provisioning figures, the ticketing-vendor name, and NPS targets. They were untracked but would have been committed.
- `tasks/assignment-sot-map.md` moved out of `content/case-studies/` (a scanned dir) since it names banned strings by design.
