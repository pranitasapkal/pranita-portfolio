# HANDOFF TO THE CONTENT PASS (2026-08-16, evening — branch `merge/design-foundation`)

The design round is pushed; the next reviewer owns CONTENT. Everything below is live on the
branch (build green, nda-scan clean, check:facts TPN 0 lost at every commit).

**What changed today (design lane, Manav directing):** white case pages on the Debo structure ·
Bricolage Grotesque display + Hanken body · one-cobalt rule (#1d41d0 light / #5b7cff dark)
across the whole site · Namrata-family accent palette (mustard/brick/cobalt/forest/lavender,
contrast table in theme.css) · problem section = Manav's composite image, live cards <lg ·
his 3D before-diagram + line-art fold scene + nav avatar · research deck auto-shuffles with
6 real field photos · Beyond Pixels: 9 cat photos + 25 art originals + per-row hovers ·
sticky dark navbar · re-inked generated diagrams · Decision Spotlights section REMOVED.

**Content reviewer's queue (in order):**
1. Competitor matrix rows in THE RESEARCH (Transporter Panel) — DRAFT, fact-check before publish.
2. qc-05.jpg (public/beyond/) is a photo of Pranita herself; field-04..06 show colleagues'
   faces — confirm she's fine with these on the public repo/site.
3. Decision Spotlights no longer render — spotlights data still in content files; keep or fold.
4. All `site-v2-draft.ts` strings are still DRAFT — her voice pass pending; captions on the
   QC row ("Two supervisors") now understate the roster.
5. Copy budget honest misses: TPN 1,919w vs 1,800 / 71 paras vs 50 — evidence-carried.
6. PR #1 is open with commits already merged by hand — close or retarget, never merge.

---

# Task: Transporter Panel page on the Debo reference (ACTIVE, 2026-08-16)

Reference: debodyutibiswas.framer.website/whylo — re-derived live (colors, type, layout, card
formats), not from the prior session's handoff. Plan: `~/.claude/plans/go-through-the-meory-harmonic-island.md`

## Plan
- [x] D1 Checkpoint commit `7d70a87` — white `.v1-paper` pages + ResearchDeck
- [x] D2 Palette + type: `pop-*` accent set in v1 @theme (contrast table in theme.css);
      `.v1-paper` re-declares fonts → Fraunces display/serif/body, Geist Mono (installed)
- [x] D3 Layout + hero: TPN moved `editorial` → `standard` (sticky ChapterNav + GO BACK);
      `heroShot` renders `deviceFrame` (laptop screen, no keyboard) under the meta row.
      `heroMeta` block NOT needed — CaseLayout's meta row already carries ROLE/TEAM/TIMELINE/SKILLS
- [x] D4 Chapters reordered: problem → objective → research → flow → screens → rules →
      tab-by-tab → business; Debo eyebrows on all 8 (THE PROBLEM … SUCCESS METRICS)
- [x] D4b Problem cards SHIPPED per Manav's mock: blue `pop-blue` panel, SEVEN questions
      (his two additions: ETA + where-to-raise-dispute), persona line under each, punchline;
      `problemTabs` folded in, leftover facts in a follow-up text block. 0 facts lost.
- [x] D5 Competitor matrix in THE RESEARCH (Amazon Relay · Flipkart · Delhivery · Swiggy) —
      **DRAFT: Pranita must fact-check the rows before publish** (public sources only)
- [ ] D6 3D illustration: style spec + ONE sample SVG → approval gate → second illo
- [~] D7 Verified: build green · nda-scan clean · check:facts 0 lost · live browser at 1440
      (blue panel, 7 cards, eyebrows, GO BACK, hero mockup all render). Still owed: 360 sweep,
      reduced-motion pass, count:copy honest misses (1,887w / 71 paras — evidence-carried)

## Blocked
- Memoji image file (user to drop at `refs/problem-memoji.png`) — placeholder until then
- On-ground research photos → `researchDeck.items[].src`
- PR #1 open, commits already in by hand — close/retarget, never merge
- **Contract case = case 02 (2026-10-08):** built with `templates/case-study-v5/build_case.py` from `cases/contract/content.py`; prototype `cases/contract/Contract Prototype.html` matched to Figma (Untitled.fig, section 1:5343), 22 scenes. LIVE at `pranitasapkal.github.io/pranita-portfolio/contract/` (pushed `126213d`). Framer code file `RUMaTe7` now shows it full-screen (component sizes itself to 100vw because Framer preview ignored Fill on that instance). One more commit `0c2fe91` (overview facts card stacks on narrow screens) is on `gh-pages` but NOT pushed: Pranita runs `git push origin gh-pages`. Impact/outcome numbers are DUMMY; research section written as themes, needs her review.
- **Trips case v5 = case 01 (2026-10-08):** Claude Design bundle (`case-study-redesign-request/`) staged as-is on orphan branch `gh-pages` (commit `75bc7cb`, worktree in session scratchpad) for GitHub Pages at `pranitasapkal.github.io/pranita-portfolio/trips/`. LIVE since 2026-10-08 (Pranita pushed + enabled Pages; the auto-mode classifier blocks Claude's pushes even with allow rules). Framer code file `ra1OAVX` (TripsPanelCase) now iframes it full-screen below the navbar (topOffset 96), so Home 001 and /work/trips-panel already show v5. Old v3 kept in `framer/archive/`. Still to do: set `SITE` in `trips/index.html` once the Framer site is published. Supersedes the v3 item below. Impact numbers in v5 are still the DUMMY ones.
- **Trips case v3 (2026-10-06, superseded by v5):** push branch `assets/trips-v3-frames` (commit `6e9da28`, worktree in the session scratchpad) and merge into `public-main` so jsDelivr serves `in-transit-v2.png` + `dispute-categories.png`. Then paste `framer/TripsPanelCase.tsx` into Framer code file `ra1OAVX` and check the pins visually.
- **Trips impact numbers are DUMMY** (3×, < 1 day, 90%, 0): replace before publishing
- `before-chaos.png` has a baked-in em dash: re-export from source

---

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

## Phase 1 — parallel lanes (IN PROGRESS)
- [x] Text: all five cases cut onto the ADR-005 template (TPN→NDC→CLH→TCM→PLC)
- [ ] Text: home/about/footer copy → sets the voice → then resume → SEO
- [ ] Design: new system in `/dev/kitchen-sink` first, then applied; decides the two-layout question
- [ ] Rebase `text/*` on `revamp` whenever a design PR merges

### Design lane — ADR-004 landed (2026-08-15, branch `design/foundation`, uncommitted)
- [x] Dropped "THE NETWORK" + WebGL entirely — deleted `src/components/three/` (808 lines),
      `public/geo/*` (~342 kB), `scripts/generate-india-points.mjs`, the `three`/`@react-three/*`
      deps, and the `manualChunks` block that existed only to split them.
      **Desktop first load 1,300.8 kB → 422.4 kB** (gzip 377.0 → 140.9, −62%).
- [x] Hero rebuilt type-led; the 150vh pin is gone, so static screenshots of `/` work now.
- [x] Corrected `docs/DESIGN-BRIEF.md`, `CLAUDE.md`, `README.md` — they mandated the WebGL floor
      and the dropped identity. Also killed the reference to the master plan that no longer exists.
- [x] `tasks/decisions/ADR-004-visual-system-v2.md` written (concept + WebGL drop; token
      replacement appended once a direction is picked).
- [x] **2px overflow at 360 fixed** — root cause was the footer email's `1.375rem` clamp *floor*
      overriding `5.2vw`, not `.grain`/route-overlay as previously recorded. Measured 0px.
- [x] Motion compliance: 6 components moved off one-shot `window.matchMedia` onto
      `withReducedMotion()` / the new reactive hook. `withReducedMotion` now passes a cleanup fn.
- [x] `src/lib/useMediaQuery.ts` (`useSyncExternalStore`) — fixes the read-once-never-update bug
      in `Hero`/`MagneticWrap`/`Footer`/`CaseIndex`/`SmoothScroll`.
- [x] `KitchenSink` lazy-loaded — was shipping a dev route in every visitor's main chunk.
- [x] ~~Blocked: reference brief~~ — **resolved 2026-08-15: Manav supplied the brief himself**
      (6 refs + screenshot section map). Research digest: `.design/RESEARCH.md`.

### Design lane — v2 homepage SHIPPED (2026-08-15, later same day, uncommitted)
- [x] v2 token layer: light-first + always-dark bands, working dark toggle (pre-paint script,
      no FOUC), all contrast pairs computed ≥ AA (table in theme.css). v1 tokens scoped to
      case pages via `.v1-ink`.
- [x] Fonts: + Fraunces Variable, Hanken Grotesk Variable, Caveat.
- [x] New primitives: PillButton, MetaLine, SectionTag, RolePill, UnderlineAccent, ThemeToggle,
      DragCard (drag/fling/peek/shuffle, inert on touch + reduced motion). Kitchen sink rebuilt.
- [x] New chrome: floating pill Navbar (name · Work · LinkedIn · Resume · toggle, `.force-dark`
      on case routes), Footer = contact band. Loader + GrainOverlay deleted (dead concept).
- [x] New home: Hero → StatementFold → WorkIndex → BeyondGrid → Approach → PluginsShowcase →
      WritingStrip → Footer. Old About/CaseIndex/RouteSpine/Toolkit/SecondaryWork/ProcessStrip/
      Writing deleted.
- [x] Copy quarantine: every net-new string in `src/content/site-v2-draft.ts` (marked DRAFT,
      **Pranita rewrites**); real slots still read site.ts/summaries.ts.
- [x] **Verified in browser**: light+dark at 1440 and 360 — 0px overflow, 0 stuck reveals under
      forced reduced motion (Lenis correctly off), all 5 covers load, drag+shuffle cycle the
      deck, Peek hidden on touch, case pages unchanged w/ legible dark nav, theme persists
      through reload with correct pre-paint value + theme-color meta. Build green (tsc clean),
      main chunk 410.75 kB.
- [x] scroll-world skill installed globally (`~/.claude/skills/scroll-world`) — install-only,
      not used on the site.
- [ ] Pranita: rewrite `site-v2-draft.ts`, decide fate of now-unrendered site.ts fields
      (hero.ghost/stats, about, process), swap DragCard deck content, portrait, resume PDF.

### Design lane — v2 homepage LOCKED with Manav, section by section (2026-08-16)
Single standard mode (no theme toggle; `.force-dark` per section — all dark except footer).
- [x] S1 Hero: hello line + meesho RolePill + serif headline (marker highlight + underline) +
      DragCard deck (Peek/Shuffle). 4+ years copy, one-line subline, no em dashes anywhere.
- [x] S2 Signature fold: compact manifesto on grid paper + wagging vector cat (chibi, SVG tail).
- [x] S3 Selected Work: roshan-sahu-style fixed frame, per-project wipe/settle + pre-blurred
      backdrops, CSS sticky + raw scroll math (NO ScrollTrigger pin — it silently failed).
      Perf-tuned: 60fps measured (194 frames, worst 17.6ms).
- [x] S4 Rooted: ASC screenshot marquee w/ edge vignettes (pause n/a) + How-it-works green trio.
- [x] S5 Beyond grid: uniform black cards, hover lift/accent; Valmo pair → Rooted/Yantrava
      links → earlier work.
- [x] S6 Approach: 4 cols, hero dark. S7 Plugins: compact uniform 4×2 grid w/ accent icons.
- [x] S8 Beyond Pixels: "Things that aren't on my resume" — hover-expand rows w/ pause-on-hover
      marquee carousels (cats real, placeholders for the rest → public/beyond/).
- [x] S9 Writing card. S10 Footer: light closer, compact, magnetic bold email.
- [x] Committed on design/foundation for Pranita's review.

**Correction to earlier notes:** `npm run optimize-images` is **not** broken — the script exists
and works (commit `e6aacc9`). And `npm run nda-scan` is **inert**, not clean: without
`content/fuzzing-map.json` it exits 0 without checking anything. Docs corrected.

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


---

# Task: Port home-page copy into the Framer template (Eric Cole copy → Pranita) — 2026-09-05

Source of truth for copy: `src/content/site.ts` + `src/content/cases/summaries.ts` (already NDA-fuzzed for public).
Target: Framer project `Eric-Cole-copy`, Home page, edited live via Chrome (CDP :9222).
Rule: only slots that exist in the template get filled; nothing invented; no private numbers.

## Plan
- [ ] Hero: `ERIC`/`CO LE` → `PRANITA`/`SAP KAL`; description → hero.subline; timezone LA/WAT → BLR/IST
- [ ] Intro: statement → about.paragraphs[0]; `[BASED IN BERLIN // WORKING GLOBALLY]` → `[BASED IN BENGALURU // WORKING ACROSS INDIA]`
- [ ] Work: intro line → "SELECTED SYSTEMS…"; 001–005 → the five case titles (CASE_ORDER); 006 → Dispute-flow Redesign (secondaryWork)
- [ ] Work aside: `AVAILABLE FOR COLLABORATION` → `OPEN TO PRODUCT DESIGN ROLES`; email → sapkalp1997@gmail.com
- [ ] Approach: heading → "EVERY CASE STUDY DOCUMENTS A SYSTEM, NOT A SURFACE."; cards 001–004 → Systems not screens / Empathy first / The same eight steps / Tools I wish existed
- [ ] Services: two headings → logistics-persona framing; 001–004 → about.services (Ops workbenches / Contract lifecycle systems / Low-literacy mobile & panel UX / Design-ops tooling)
- [ ] `HAVE A PROJECT? LET'S CHAT` mailto → sapkalp1997@gmail.com (template still points at the author's email)
- [ ] About: `I'M ERIC COLE` → `I'M PRANITA SAPKAL`; philosophy headings → about.paragraphs[1] + toolkit line; photo left as-is (needs her OK — see todo queue item 2)
- [ ] Contact: headline → "START A CONVERSATION."; `WHAT ARE YOU BUILDING?*` → `WHAT ARE YOU WORKING ON?*`; budget chips → `FULL-TIME ROLE / CONSULTING / JUST SAYING HI`
- [ ] Client proof (3 fake testimonials): hide or keep — USER DECISION
- [ ] Footer: GITHUB→BEHANCE, X/TWITTER→DRIBBBLE, LINKEDIN→real URL, EMAIL→mailto; add MEDIUM if a 5th slot is cheap
- [ ] Re-enable `loader` visibility before publish
- [ ] Verify: screenshot every section on Desktop + Phone; grep the a11y snapshot for "ERIC", "COLE", "BERLIN", "itszineddine" → 0 hits

## Blocked
- Photo in About: qc-05.jpg is her but not yet approved for public use → leave template photo, flag.

## Review
(pending)

## Add-on (2026-09-05): "Beyond Pixels" section in Framer, after About
Source copy: `src/content/site-v2-draft.ts` → `beyondPixels` (tag, headline, subline, 3 items). Images: `public/beyond/` (cats.jpg + qc-01..09, art-01..25; item 2 is a text placeholder).
Approach: duplicate `section-about` (dark, photo + text + 6-image row + tag line) → Detach Instance → rename `section-beyond` → rewrite texts → swap photo + 6 row images → tag line carries the placeholder item.
- [ ] Duplicate + detach + rename + Scroll Section name `beyond`
- [ ] Heading BE/YON/D · small+big title · scramble tag · subline · [BEYOND PIXELS] · two body lines
- [ ] Photo → cats.jpg · row → art-01..06 · tag line → "ART [25] // QC TEAM [10] // WHERE MY MONEY GOES [TBD]"
- [ ] Verify on Desktop/Tablet/Phone; loader back on before publish

## Review — Framer Home content port + Beyond Pixels (2026-09-05)
**Shipped (Framer, Eric-Cole-copy → Home, all 3 breakpoints):** hero name/subline/resume CTA · intro statement + Bengaluru tag · work titles 001–006 + email + "open to roles" · approach heading + 4 cards · services headings + 4 items · About (NAMASTE / I'M PRANITA SAPKAL / Meesho-Valmo line / empathy + plugins lines) · contact form labels/placeholders/chips · new `section-beyond` after About (detached copy of About: BE/YON/D heading, "THINGS THAT AREN'T ON MY RESUME.", subline, [BEYOND PIXELS], QC-team + Ctrl+Z lines, cats.jpg, art-01…06 row at 120px, tag "ART [25] // QC TEAM [10] // WHERE MY MONEY GOES [TBD]") · loader Visible restored to Yes.
**Deferred:** footer + CLIENT PROOF block (renders after contact, not found in any layer tree — ask Pranita to click it in Framer) · mailto/href fixes (LET'S CHAT ×3, footer EMAIL/X → template author) · hero/footer clock LA/WAT → BLR/IST · contact headline kept as template copy · About photo/logos + testimonials kept as placeholders per Pranita.
**Known risks:** Framer edits were made via DOM automation; verify visually in Preview before Publish. Repo: `public/resume/*.pdf` + regenerated `resume/*.html` are uncommitted build outputs.

## Review addendum — Beyond Pixels rebuilt as marquee rows (2026-09-05, late)
- Pranita flagged the About-clone layout as broken and asked for the portfolio's scrollable strips. Rebuilt via Framer's own Agent (brief in chat "Build beyond section"), then filled the cats ticker by hand: 10 cards (cats.jpg + qc-01…09), painting ticker keeps art-01…06.
- Structure now: GSAP "BEYOND" · [BEYOND PIXELS] · headline · subline · 3 hairline rows (Quality control + Cats ticker · Money placeholder · Art + Painting ticker) · end divider. Verified in Preview (Desktop).
- Lesson: detaching a template component copy loses its scroll/appear effects — for new sections prefer Framer's Agent with a precise brief, then patch content by hand.
- Still open: 19 more paintings (art-07…25) if wanted; footer/CLIENT PROOF links; clock LA/WAT.

## Review addendum 2 — accordion + About photo (2026-09-05, late)
- Beyond rows are now a single "Beyond accordion" component (Framer Agent): states Row 1/2/3 open + all closed, default = Quality control open, header click toggles, only one open. Verified in Preview by clicking rows.
- Cats ticker: 10 distinct photos (cats.jpg + qc-01…09). Painting ticker: art-01…06.
- About portrait replaced with Pranita's own photo (Downloads/"Image from iOS (4).jpg", downscaled to 2400px) in all 6 About variants (image prop is per variant). Alt: "Pranita Sapkal holding her cat".
- Framer workspace is now OUT of Agent credits — further structural work is manual.

## Restructure — session 1 (2026-09-05, night)
**P0 credibility — DONE, verified in live preview (0 hits each):**
- Footer socials → LINKEDIN · BEHANCE · MEDIUM · EMAIL with her real URLs (was GITHUB / x.com/itszineddine / bare domains). Footer lives in `Navigation/footer`.
- CLIENT PROOF heading + its testimonial `ticker` hidden in all 3 footer variants (Daniel Kim / Michael Turner / Emma Richards gone).
- `timezone` component: LA → BLR, WAT → IST (one component edit fixes hero + footer + menu overlay).
- Last `mailto:hey@itszineddine.com` fixed — it was the `Link To` on the `text` layer INSIDE the `email-link` component, not on the instance.

**Toolkit section — DONE.** `section-services` repurposed rather than rebuilt (no agent credits): heading GSAP letters S/E/RVICE/S → T/OO/LKI/T (script face keeps the middle segment), `[HOW I HELP]` → `[TOOLKIT]`, headings → "I build the tools I wish existed." + the plugins line, the `services` list → plugins 1-4, duplicated for 5-8, and the `HAVE A PROJECT? / LET'S CHAT` block hidden in all 6 variants. This also removes the duplicated "what I do" copy.

**Technique that works:** the Layers **search box** filters the tree to just the matching rows, all visible at once — far more reliable than scroll-scanning, which degrades after ~5 selections. Panel props are only readable after scrolling the properties panel to the top (`Link To` sits above the fold).

**Next:** hero role line · thesis band · Work → column view + covers + stats · process strip · More work strip · About paragraph + Lottie cat · nav SERVICES → TOOLKIT.

## Loader swapped — Skiper8 "Words preloader" (2026-09-06)
Pranita asked for skiper-ui.com/v1/preview/skiper8 instead of the TV loader. Pulled the real
implementation out of that site's JS bundle (chunk `5450-*.js`) rather than eyeballing it, so the
timings and easing match the original exactly.

- Source of truth: `framer/WordsPreloader.tsx` in this repo (also pasted into Framer as a code file).
- Behaviour: white sheet, curved bottom edge bulging 300px below the fold; word fades to 0.75 opacity;
  first word holds 1000ms then 150ms per word; on exit the curve flattens (0.7s) while the sheet
  slides to -100vh (0.8s), both `cubic-bezier(0.76, 0, 0.24, 1)`.
- Words default to `Hello · नमस्ते · bonjour · Ciao · Olà · やあ · Hallå · ನಮಸ್ಕಾರ` (swapped the stock
  Punjabi/German for Hindi + Kannada). Editable as an array prop, plus Font / Sheet / Text / Opacity /
  First / Step / Hold / "Play on canvas" controls.
- Installed via the layer context menu → **Replace With → Project → WordsPreloader** on the `loader`
  instance, which swapped all 3 breakpoints at once and kept Fixed / 100% × 100vh / z-index 10.
  Then Visible → Yes on all three.
- Verified in Preview: caught mid-cycle on ನಮಸ್ಕಾರ, and it fully unmounts to reveal the hero.

**How to add a code file in Framer (for next time):** Assets → hover the "Code" section header → the
"+" is a plain div, not a button → New Code File → name it → Monaco opens → paste via a synthetic
`ClipboardEvent` on `textarea.inputarea` after Cmd+A → **⌘S to save**. The Insert panel does NOT list
project code components; use Replace With, or drag from Assets.

## Reverted: Toolkit → Services (2026-09-06)
Pranita asked for the Services section back, so `section-services` is restored to what it was before
the Toolkit conversion. Verified in a cache-busted preview: OPS WORKBENCHES 4 · CLH 0 · [HOW I HELP] 4
· HAVE A PROJECT 4 · TOOLKIT 0.

Restored: heading letters S/E/RVICE/S · `[HOW I HELP]` · "I design for the people who move things…" ·
"Dense desktop panels and low-literacy mobile flows…" · the 4 services (Ops workbenches / Contract
lifecycle systems / Low-literacy mobile & panel UX / Design-ops tooling) · the HAVE A PROJECT? /
LET'S CHAT block (its mailto is now hers, not the template author's). Deleted the duplicate `services`
list the Toolkit build had added.

The Toolkit content is NOT lost — the 8 plugins live in `src/content/site.ts` (`site.toolkit.plugins`)
and can be rebuilt as its own section whenever she wants.

**Two traps that cost time here, worth remembering:**
1. Framer's **preview caches aggressively** — it kept rendering the old Toolkit copy for several
   reloads after the component was already correct. The component canvas is the reliable check;
   for the preview, append a `&_cb=<timestamp>` to force a fresh load.
2. The properties panel **lags a selection behind**, so reading a prop right after selecting a layer
   can return the PREVIOUS layer's value. A "skip if already correct" guard built on that read will
   silently skip rows that still need fixing. Wait ~900ms after selecting, or just write unconditionally.

## Task: Trips panel case study (Figma long-page) — started 2026-09-06
Plan: `~/.claude/plans/can-you-open-the-luminous-dewdrop.md`. Copy draft: `tasks/case-study-trips-copy.md`.

- [x] Inventory Figma file `placement-module` page 0:1 (~150 frames, 6 sections; template `2:128286` ignored)
- [x] Mine `Assignment Model/`, `tasks/transporter-panel-sot-map.md`, `fuzzing-map.json`, TPN-01 for facts
- [x] Skeleton approved: 10 blocks, whole panel, disputes as one chapter, Figma long-page output
- [x] Copy draft v1 written with `[INPUT n]` placeholders
- [ ] Pranita answers inputs 1–10 → fill placeholders → copy v2 approved
- [x] Plugin written: `figma/case-study-builder/` (manifest.json + code.js, 257 lines, `node --check` OK) — builds page "Case study", 1440 root, 12-col/24 gutter/120 margin, 13 section frames, clones screens by node id, pins + why-rail, `[INPUT n]` placeholders kept
- [x] ~~Plugin route~~ dead-ended: Figma web has no dev-plugin import, desktop has no CDP port, macOS accessibility is company-locked. **Replaced by SVG paste-import**: `figma/case-study-svg/{spec,build}.mjs` → `out/case-study.svg` (58 KB, 29 placeholder rects `img:<name>`, `out/manifest.json`), handed to the Figma tab via `out/bridge.html` (postMessage from a local CORS server on :8898 → synthetic `paste` ClipboardEvent on the canvas). Landed as frame `18:2` (1440×15555) on page "Case study" `17:42776`.
- [x] Screens embedded directly (no manual fills): `build.mjs --embed` inlines the PNGs as data-URIs, which Figma's paste turns into image-filled rects. 29 placements / 25 unique assets. Live page = frame `18:1067` (1440×14598).
- [x] Six targeted pattern crops exported as their own Figma nodes (`2:41609` live-updates · `2:59825` bilingual categories · `2:45840` no-action-needed · `2:5639` reject modal · `2:65316` challan examples · `2:42648` cancelled table) — each verified by eye before use
- [x] Corrected against the real screens: In-Transit v2 DOES have an action column (Raise/View Dispute + status), so the lifecycle verb and caption changed; Cancelled is the tab with no action column
- [ ] Pranita answers inputs 1–10 (+ VERIFY 11: dispute entry points) → fill placeholders → rebuild + re-paste
- [ ] Place screens by node id (2:10638 · 2:41370 · 2:22306 · 2:49385 · 2:59700 · 2:74141 + sub-flow frames), annotate
- [ ] Illustrated blocks 01 / 02 / 05 rail / 08 grid
- [ ] Export PDF + PNG; grep exported text against `banned_strings_for_scan` → 0 hits
- [ ] Cold read as an outsider; every caption ≤40 words; every screen ≥3 callouts

## Blocked
- Figma write path (solved): SVG text pasted via synthetic ClipboardEvent → editable layers (text stays text; `<image>` → image-fill rect; tspans split into one text per line; font-weight maps only to 400/700). Localhost fetch is CSP-blocked inside figma.com; native ⌘V doesn't fire; base64 retyped by hand corrupts — hence the postMessage bridge.
- Figma MCP `get_screenshot` fails ("n.reduce is not a function") → frame selection relies on names/text; retry before build.


## Task: Trips-panel case study on the Framer site — 2026-09-06
Source of truth for the page: `framer/TripsPanelCase.tsx` (single Framer code component, ~470 lines after
Framer's reformat). Local preview harness: `figma/case-study-svg/out/framer-preview.html`
(React + Babel from CDN, strips the `framer` import) served by the CORS server on :8898.

- [x] Read the site's real theme instead of guessing: fonts **Geist / Geist Mono / Inspiration**
  (from the editor's font requests), colours **Black #000 · Dark #242424 · Grey #424242 ·
  Grey 50 · Light Grey #9E9E9E · White · Off White #E0E0E0 · White 0** (from Assets → Color)
- [x] Component written to that contract: mono `[BRACKET]` eyebrows, uppercase Geist headings with one
  Inspiration-script word (the site's own convention), hairlines, 1200 max-width, `clamp()` type
- [x] **No flicker**: no scramble/GSAP letter effects. One IntersectionObserver fade-up per block
  (0.7s, cubic-bezier .65,0,.35,1), disabled under `prefers-reduced-motion`
- [x] Screens sit in a quiet macOS **browser-window mockup** (traffic lights, URL pill, 1px border,
  14px radius) instead of bare frames — `Shot` in the component; `flat` prop for diagrams
- [x] Images served from the already-public repo via jsDelivr
  (`cdn.jsdelivr.net/gh/pranitasapkal/pranita-portfolio@public-main/public/work/transporter-panel/*.png`)
  — 17 screens verified 200 + resolutions before use, no new uploads needed
- [x] Code file created in Framer (**code view → "New File" button → dialog → Create**; the Assets-panel
  "New Code File" menu item does nothing) and filled via the postMessage bridge → synthetic paste → ⌘S
- [x] Page created: **/work/trips-panel** (Pages "+" → New Page, then typed the path). Component dropped
  on it with a synthetic pointer drag from Assets → canvas, Width set to **Fill**
- [x] Verified in Framer Preview: navbar + case study render, fonts correct, images load, no flicker
- [x] Linked from the Work section: the `work` instance on Home exposes **Link 1–6** as component
  properties (chain: `work` → `work-column` → `block-holder-1`, whose Link To is bound to the
  `Link 1` variable). Set **Link 1 = /work/trips-panel**, replacing `framer.link/zineddine35`.
  Desktop / Tablet / Phone share the property, so one edit covered all three.
  Verified in Preview: clicking "001 THE TRANSPORTER PANEL" opens the case study (checked at Phone 390 —
  single column, mockup scales, type readable).
- [ ] Links 2–6 still point at the template author's `framer.link/zineddine35` — same field, whenever
  those case studies exist
- [x] Flipped to the **light theme** to match the home page. Checked the source first: `section-intro`
  Fill = **White**, `section-work` has no fill, so the home page is white with black type.
  Palette now: page/cards **White**, headings **Black**, body **Dark #242424**, labels/captions
  **Grey #424242** (Light Grey #9E9E9E fails AA on white for text — kept it for index numbers only),
  hairlines `rgba(0,0,0,0.12)`, card + mockup plate `rgba(0,0,0,0.04)`, browser dots `rgba(0,0,0,0.15)`.
  Verified in Framer Preview at Desktop 1200.
- [ ] Publish (left to Pranita)

**Framer automation notes (new):**
- Menu items in the Assets panel do not respond to synthetic or real clicks; the code view's
  "New File" button + modal does. Dialog inputs accept the native-setter + `input` event trick.
- Framer's own size dropdowns are native `<select>`s with **numeric** option values (Fill = "3"),
  but they ignore programmatic `value` sets — click the visible label ("Fit") instead.
- Dragging an asset onto the canvas works as a synthetic pointer sequence: pointerdown on the asset row,
  ~12 pointermove steps dispatched on `document`, pointerup over the canvas.
- framer.com blocks `fetch` to localhost (CSP), same as Figma → reuse `out/bridge.html?url=<target>`.
- The single-threaded python http.server deadlocks on keep-alive; the server is now `ThreadingHTTPServer`.

---

## Task: Contract Management case study (case 02) — Framer only — started 2026-09-06

Source: Figma `placement-module` page 3 `19:42770` → section **`20:44008` "Contract Management- Transporter"**
(~100 frames). SOT docs: `../contract-management/{CLAUDE.md,TRANSPORTER-CONTEXT.md,tasks/decisions/ADR-001..003}`.
Same process as the trips-panel case (`tasks/records/2026-09-06-trips-panel-case-study.md`) **minus the
Figma long-page** — Pranita asked for the Portfolio/Framer version only this time.

### Plan
- [x] P1 · Inventoried `20:44008` — 137 top-level frames, 73 full screens, 12 named flows
- [x] P2 · Eyeballed 20 frames before use; six SOT/deck facts corrected (24hr buffer not 3-day, `Under Dispute`/`Ending Early` chips, no Performance column, `Ended early by You`, alert strips not cards, shared reason list)
- [x] P3 · Copy → `tasks/case-study-contracts-copy.md`
- [x] P4 · 24 PNGs at 1.5× → `public/work/contract-panel/`, quantised 4.6 MB → 1.7 MB, pushed to `public-main` (`66d0033`), all 24 verified HTTP 200 on jsDelivr
- [x] P5 · Built `framer/ContractPanelCase.tsx` (light theme, Geist / Geist Mono / Inspiration, Reveal fade-up, browser mockups)
- [x] P6 · Framer code file `RUMaTe7` + page `/contract-panel` (node `Xfm4Cw5V9`); component placed, Width = Fill / Height = Fit Content
- [ ] P7 · **BLOCKED (manual):** Home work item **004** still points at `framer.link/zineddine35`
- [x] P8 · Verified on the canvas: 21/21 referenced images resolve, every section heading present, hero reads `[CASE 04]`

### Blocked
- **Link 4 on the Home `work` instance.** Framer's link popout cannot be opened through CDP — the
  `data-is-popout-button` div takes trusted clicks but `#canvas_popover_portal` never fills, and the
  React `onClick` is a no-op from script. Manual, ~15 seconds: Home → Layers → search `work` →
  select Desktop `section-work → container → work` → Style panel, scroll to the bottom → **Link 4**
  → pick `/contract-panel`. (Links 2, 3, 5, 6 are still the template author's.)

### Review
- **Shipped:** one Framer case-study page for the transporter Contract Management panel, site item
  **004**. Ten blocks, four key screens each with supporting shots, six pattern crops, and a candid
  *"what I'd fix before I'd call it done"* block (unreconciled counts, one reason list serving both
  Reject and Ending Early, performance still absent from the panel).
- **Deferred by instruction:** no Figma long-page this round — Pranita asked for the Portfolio only.
- **Deferred by choice:** the page sits at `/contract-panel`, not nested under `/work` like case 01.
  Cosmetic; drag it under `/work` in the Pages panel to match.
- **Known risks:** nothing is published; `framer/ContractPanelCase.tsx` and the copy doc are
  uncommitted on `merge/design-foundation`, matching how the trips-panel files were left.
- Full record: `tasks/records/2026-09-06-contract-panel-case-study.md`.
  New automation lessons appended to `tasks/records/2026-09-06-figma-framer-automation-lessons.md`.

---

## Task: Behance work — Smart Home case, graphics page, art carousel — 2026-09-06

Sources (all already public on Pranita's Behance, no NDA gate):
- `176219023` Smart Home Application → **AURA Smart Home App**, 15 boards, full 8-step UX case study (Aug 2023)
- `227583837` Creative Design Portfolio | Wizrdom → 17 slides, agency **client** work
- `199660711` Brand Mascot Design – Curatal → 16 slides, **Cubot** mascot system
- `200660903` Creative Marketing Social Media Posts → 1 tall board, Wizrdom's **own-brand** posts (distinct from the deck)
- `132892099` watercolor paintings → 13 images, **12 unique** (the parrot appears twice)

### Dedupe against the Home art ticker (6 paintings already there)
| Behance painting | On Home already? |
|---|---|
| tiger, chai + samosa, boy portrait, girl w/ flower crown, girl w/ red lips | **yes — repeats** |
| parrot · lion + cub · three cats · kettle on fire · onions · bananas · girl w/ lighter | new (7) |
Home also has a spice-jar shelf painting that is not in the Behance gallery.
→ add 6 of the 7 new ones (dropping *bananas*, the weakest), giving a curated **12**.

### Plan
- [x] P1 · 46 assets → `smart-home/` (13) · `graphics/` (21) · `art/` (12); photographic ones re-encoded as JPEG, boards quantised. Pushed to `public-main` (`7002a3a`), all 46 verified HTTP 200 on jsDelivr. 7.8 MB total.
- [x] P2 · `framer/SmartHomeCase.tsx` → Framer code file `VigLApV`, page `/smart-home` (node `irwTOwAJ1`), Width = Fill
- [x] P3 · `framer/GraphicsWork.tsx` → code file `JNRrlSr`, page `/graphics` (node `CoCI5o9UT`), Width = Fill
- [x] P4 · `framer/ArtTicker.tsx` → code file `twhyW_3`. Twelve paintings, 288×224 cards, pause-on-hover, edge fades, `fit`/`focus` props for the portrait crops
- [ ] P5 · **Manual:** drag ArtTicker into Beyond Pixels row 3 and delete the hand-built ticker — I did not drop it on Home, because a stray drop into that auto-layout would disturb the section
- [x] P6 · Verified on the Framer canvas: smart-home 13/13 images + 6 section headings + `[CASE 07]`; graphics 21/21 images + 4 headings. Also verified all three locally at 1280 before uploading.

### Known constraint
The Home `work` component has exactly six Link/Title/Image slots, all six already named for Valmo
projects. Smart Home and Graphics need either a 7th slot (component surgery) or entries on the
`/work` page. Link fields cannot be set from automation either way — same manual step as case 004.

### Review
- **Shipped:** a full Smart Home case page in the same 10-block shape as the two Valmo cases, a
  three-section Graphics page (Cubot mascot · agency roster · own-brand social), and an ArtTicker
  component holding the deduped set of twelve paintings.
- **Curation calls:** kept 9 of 16 mascot boards, 10 of 17 Wizrdom slides, 13 of 15 Smart Home
  boards (dropped the title GIF and the thank-you), and 6 of the 7 unique paintings (dropped
  *bananas*). The social-posts gallery turned out to be Wizrdom's **own** brand, not a repeat of the
  client deck, so it earns its own section.
- **Corrected before shipping:** the Graphics hero claimed "nine clients" — I can only name eight
  brands across the tiles I actually show, so it now reads "an agency roster". `[CASE 07]` numbering
  is provisional; see the linking constraint above.
- **Honest gap on the Smart Home page:** it is a 2023 concept that was never built and never
  usability-tested, and the page says so in its own block rather than implying a shipped product.
- Full record: `tasks/records/2026-09-06-behance-additions.md`.

---

## Phase — DoJoin Ride, case 03 (2026-09-11)

Source: `behance.net/gallery/200843597/Multi-Service-Application-Design`, the link Pranita sent for
the reserved case-03 slot. Employer facts from `content/resume.json`: **Huntment, UI/UX Designer
(Remote, UAE), Nov 2023 – Jan 2024.**

- [x] D1 · Downloaded all 25 boards at source resolution (up to 5760px wide) and read every
      text-bearing one — About/Objective, Problems/Solutions, personas, demographics, research
      methods, key findings, user flow, colour palette
- [x] D2 · Cropped **20 individual product screens out of** the boards (normalised crop fractions
      per board, long edge ≤1400, JPEG q86, 1.8 MB total) — no board is embedded anywhere
- [x] D3 · Pushed `public/work/dojoin/` to `public-main` (`29c0894`); all 20 verified HTTP 200 on
      jsDelivr
- [x] D4 · Wrote `framer/DoJoinCase.tsx` — 11 blocks in the established grammar, 18 images
- [x] D5 · Verified locally at 1440 via `figma/case-study-svg/out/dojoincase-preview.html`
      (18/18 images loaded, 9 headings, no console errors)
- [x] D6 · Framer code file `DuZI3rK` → `DoJoinCase.tsx`, pasted + `Cmd+S`, save confirmed by
      reloading `view=code:codeFile/DuZI3rK` in a second tab
- [x] D7 · Page `/dojoin` (node `Xag1FG9Ce`) created, component placed, **Width = Fill /
      Height = Fit Content**; canvas snapshot shows all 18 jsDelivr images and every heading
- [x] D8 · Deleted the stray "Design 2" canvas page created by the wrong "+" button
- [x] D9 · Opened the site preview in Chrome — Home in front, `/dojoin` in the tab behind

### Review
- **Shipped:** case 03, written as text. Blocks: hero · the problem · who it's for (three age bands
  with Emily/David/Susan as examples) · research (four methods, four findings) · architecture (one
  entry, six uneven branches, one four-step shared spine) · the decision that mattered (vary the
  form, never vary the checkout) · Umrah without the agent · groceries as a saved list · eight
  surfaces + the system underneath · three decisions I'd defend · outcome, what I'd fix, what I
  learned.
- **Contrast computed, not asserted:** indigo `#4A51F7` **5.45:1** and crimson `#D31D4D` **5.18:1**
  on white both pass AA for text; green `#3BB77E` is **2.54:1**, so the page states it is only ever
  a fill behind dark text.
- **Naming call:** the onboarding screens say "Huntment Ride" on two and "DoJoin Ride" on the third.
  `resume.json` says DoJoin Ride, so the page uses that and credits Huntment in the label. Flagged
  to Pranita in case she wants it flipped.
- **Six honest gaps on the page,** all verifiable from the boards: leftover lorem ipsum in
  product/FAQ copy, a Berlin address in an AED checkout, UPI beside Tabby in a UAE payment sheet,
  no Arabic/RTL, no dark mode, and no post-launch numbers.
- Full record: `tasks/records/2026-09-06-behance-additions.md` (Revision 3).

### Still open (carried, unchanged)
- [ ] Link all five case pages from Home — blocked on the six-slot `work` component (all six named
      for Valmo projects) *and* on Framer's link picker, which still cannot be driven from CDP
- [ ] Drag ArtTicker into Beyond Pixels row 3 and delete the hand-built ticker (manual)
- [ ] Nothing is published
- [ ] `framer/*.tsx`, `diagrams/`, `figma/`, `tasks/records/` still uncommitted on
      `merge/design-foundation`

## Task: Site down to four cases, all on the v5 template (2026-10-08)
Order: 01 Trips · 02 Contract · 03 Multi-Service (Huntment, Behance 200843597) · 04 Smart Home (AuraSmart, Behance 176219023).
Cases 03/04 carry only what their Behance gallery shows: no invented research, iterations, impact or lessons.
- [x] Generator: blocks mode (TEMPLATE §11): hero phones, no lightbox, TOC from sections, phone panels/rows/trees/palettes
- [x] cases/multi-service: content.py from the boards + 28 cropped screens
- [x] cases/smart-home: content.py from the boards + 28 cropped screens (wireframes from the 5760px source board)
- [x] QA both locally: 0 em dashes, 0 banned words, 0 broken images, no overflow at 390px
- [x] Staged on gh-pages (b79b367) with Contract's top-window nav fix; next chain 01→02→03→04→01
- [ ] **Pranita pushes gh-pages** (0c2fe91 + b79b367): until then /dojoin and /smart-home show a GitHub 404 inside Framer
- [x] Framer: /dojoin → DoJoinCase (DuZI3rK) is now a CaseStudyFrame on /multi-service/; /smart-home page (gg9IAu2DR) duplicated from it, src → /smart-home/
- [x] Framer Home work list: titles + links + cover images for 4 items; rows 5–6 deleted from work-column (both frames) and work-list
- [ ] Not touched on Home: the Rooted showcase and the MoreWork section (it still lists DoJoin as "earlier work"); /rooted and /graphics pages still exist, just unlinked from the list
- [ ] /smart-home page SEO title is inherited from /dojoin (duplicate); set it in page settings
- [x] Whole frames (2026-10-08, her feedback): heroes unclipped on all 4 cases, phone screens trimmed inside their bezels + one device frame (gh-pages 1685a38)
- [x] Home: "OPEN TO PRODUCT DESIGN ROLES" block-holder deleted; work images link to their case (Link N per variant) with the VIEW LIVE cursor
- [x] Home (2026-10-09): WORK section heading (W / O-script / RK, black, left) above [COLUMN] [LIST]; work-column-element title 14 -> 20px; non-hovered block-holders Max Width 216 -> 360 in Desktop 1-4 (hovered row has no cap, so it still reaches 390); Phone layout has no cap and fits. Verified in preview: no title clips on hover
- [x] gh-pages pushed through 1685a38 (live 200 on all four)
- [x] Four frame colours (trips blue, contract black, multi-service violet, smart-home navy); headings rewritten (tasks/copy-review-2026-10-08.md); alignment + AA pass (tasks/qa-alignment-2026-10-08.md); Home covers re-uploaded in the new colours
- [ ] **Pranita pushes gh-pages commit 126f27e** (colours + copy + alignment); Claude's push was blocked this time
- [ ] Left for Pranita: white on the green "~20 tracked" bar is 4.25:1; Multi-Service hero has left text over centred phones (design call)
- [x] Covers 2–4 match Trips: centred hero, new two-line H1s (Contract 'Contracts truck owners can question, not just accept', Multi-Service 'Five everyday services, one app for the UAE', Smart Home 'Every device in the home, one tap away'), meta row dropped; Home covers re-uploaded; gh-pages 5th commit unpushed
- [x] Hero frames bleed off the bottom at 60% (desktop + phone heroes), Home covers re-uploaded; gh-pages commit unpushed
- [x] Full-screen opening hero (fold_hero) on all 4 + covers from the 1440x810 opening screen; gh-pages commit unpushed
- [x] Contract: 4 new illustrations (phone-desk, megaphone, megaphone-man, handshake) + 2 new faces on lilac #D9CCFF / mint #BDEBD3; explicit two-line H1s (h1_lines) on cases 2-4
- [x] Reels: no highlight box/dim; zoom + cursor; popups zoom to fill (reference-trips script + trips page); 24 steps + 79 hotspots checked
- [x] Home hero TV: hero-image Video = tv-cases.mp4 (4 case screens, glitch cuts, grain, scanlines; 10.7s, 1.4MB) on all breakpoints. Source + script in framer/assets/

## 2026-10-09 · Contract heading, Home More fold, Approach removed
- [x] Contract case 02 heading → "Every truck contract, / decided on screen" (her pick). It appears in three places: the L2 H1, the page `<title>`, and the L1 hover cover (`hero-2.jpg`, re-captured at 1440×810 and uploaded to `work` → Image 2; Tablet and Phone inherit it)
- [x] Contract copy deepened from `Contract Management .pdf` (lifecycle deck, part 3, pp. 35–47):
  - the loop with the Valmo team
  - the four rules: one stage, named views, one primary action, the panel does the math
  - the acceptance review sheet
  - the priced rejection
  - reasons that ask for their own data
  - "Completed is earned"
  - the login gate
- [x] Screen details follow the Figma frames, not the deck. The deck shows 5 overview cards and a Performance column; the frames show 3 cards and no Performance column. Vocabulary is Terminate / Ended early. No NDA terms, no em dashes
- [x] gh-pages commit `6215534` (local). **Pranita: `git push origin gh-pages`.** Until then, the live L2 still shows the old heading
- [x] Home: `section-approach` deleted (Desktop primary; Tablet and Phone follow)
- [x] Home: `MoreWork` (code file `YMQYGsa`) is now one section:
  - the "MORE" title plus one intro line
  - Rooted as a single feature card: one line, a "Live on the App Store" pill, the screenshot strip inside the card, and the link
  - Yantrava, Tibil and Evaluationz cards under it
  - DoJoin card dropped (it duplicated case 03); the three Rooted step cards dropped
  - Plugins kept
  - v1 archived at `framer/archive/MoreWork.v1.tsx`
  - Verified at 1440 and 390 (no side scroll) and in the Framer preview
- [ ] Open: whether the plugins block stays on Home (her "those sections in the bottom" may have meant it)

## 2026-10-09 · Illustrations + persona faces on cases 03 and 04
- [x] Case 03 (Multi-Service):
  - illustrations beside Problem (apps), Research (hands building UI), Structure (flows) and Final Design (type and UI)
  - persona faces: Emily = hijab woman, David = man in blazer, Susan = woman with green glasses (cropped from the flows illustration)
- [x] Case 04 (Smart Home):
  - illustrations beside Overview (home hub), Research (overwhelmed), Competitors (board), Structure (card sort) and Final Design (robot vacuum)
  - bulb above "Each device gets its own controls", gears above "Automations start from a trigger"
  - faces: Rohan from the card-sort man, Kalika from the gears woman
- [x] Template: section `ill`, block `ill`, face discs (TEMPLATE.md §13). Contract output byte-identical. Checked at 1440 and 390 (no overflow)
- [x] gh-pages commit local. **Pranita pushes**
- [ ] **Watermarks:** the robot-vacuum and home-hub illustrations carry a stock-site ".com" watermark; the bulb and board ones come from the same source. Swap in the licensed downloads before pushing (same file names: `cases/smart-home/assets/ill-vacuum|ill-hub|ill-bulb|ill-board.webp`, then rebuild)

## 2026-10-09 · Illustration polish on 03/04 (her feedback: "forced and hanging", "no bg")
- [x] New `aside` block: each illustration sits beside the text it belongs to, vertically centred.
  - Case 03: Problem lead, Research lead (new; it restates the method cards), Structure lead, Final's first h3+p.
  - Case 04: under the Overview facts; Research, Competitors and Structure leads (Structure's lead is new and restates the tree); Find/connect (bulb), Each device (vacuum), Automations (gears).
- [x] Backgrounds: every illustration is trimmed to its drawing. Off-white and grey backgrounds are now pure white: the beige behind "overwhelmed" and the icon grid behind the card sort are gone. The 4 watermarked previews (vacuum, hub, bulb, board) are untouched; their pale stripes go when she supplies the licensed files.
- [x] Persona portraits replace the scene crops: Rohan uses the red-background man, Kalika the teal woman with glasses. Susan keeps the crop because only one woman portrait was supplied. Three portraits are unused (bearded man in pink, man in orange, line-art man with the yellow badge).
- [x] Verified at 1440 and 390. Contract is byte-identical. gh-pages commit is local.
- [x] Case 04 (2026-10-09): the Style guide block (palette and chips) is removed. The six wireframes are redrawn as SVG by `cases/smart-home/make_wireframes.py`, because the Behance board embeds them pixelated even at its 5760px source size. Layouts are traced from board 09, with grey bars where the original text is illegible. The caption says "redrawn from the project board".
- [x] 2026-10-09: Figma plugins block removed from MoreWork, so More is now Rooted plus three side builds. Published to gray-football-641289.framer.app with her OK, and checked with curl: the new section is live; plugins, Rooted steps, DoJoin card and Approach are gone.
- [ ] gh-pages still unpushed. The live Home cover now says "Every truck contract, decided on screen", but the hosted Contract page shows the old heading until she runs `git push origin gh-pages`.
- [x] 2026-10-09: "More" is now one section with one grid of 6 equal cards (MoreWork v3; v2 archived). Each card links out in a new tab:
  - Rooted → rootedplant.org
  - Yantrava → yantrava.com
  - Evaluationz → Behance "SaaS Website Redesign"
  - Wizrdom portfolio, Cubot/Curatal and Creative marketing posts → Behance
  - Covers are Behance og:images. Yantrava has a text tile, because yantrava.com is IP-restricted from here
  - Published and verified live with curl
- [ ] Tibil card dropped: no Behance page and no reachable site. She needs to send a link if she wants it back
- [x] 2026-10-09 More v3.1, published and verified live:
  - Evaluationz is replaced by the Casino game dashboard (Behance 208113485).
  - Yantrava links to `yantrava-website.vercel.app`, the repo's homepage. yantrava.com is the canonical domain but returns 403 / "restricted" from here, so it's unverifiable. Its cover is a laptop mockup of the live hero, uploaded as the MoreWork image prop "Yantrava cover"; the source is `.tmp-upload/yantrava-cover.jpg`.
  - Rooted cover uses `yantrava/rooted-marketing-site` public/screenshots 02-04 via jsDelivr. Its link stays rootedplant.org, because the repo's Vercel homepage returns 404.
- [x] 2026-10-09 Beyond "Where my money actually goes" row now has a strip of 6 game screenshots: Wukong ×3, God of War ×2, GTA VI. Built as the cat and painting rows are.
  - Home renders the CODE component `BeyondPixels.tsx` (Framer code file `QPesiG5`), not the "Beyond accordion" Framer component. That accordion is unused; a test strip I pasted into its Money content is harmless.
  - Six image props Game 1-6 were added; images were uploaded on the Home instance. v1 is archived in framer/archive.
  - Published, and 12 game images (6 × 2 loop) are present on the live page.
- [ ] Money caption still reads "Placeholder: plants, cat treats, and fonts I did not need." She needs to write the line; I suggested one.
- [x] 2026-10-09: painting cards in the Ctrl+Z row now fit each painting. Card height is 280 and width is set from the scan's own ratio (the PAINTINGS tuple carries w/h), so there is no crop and no letterbox. The loop length is summed from the real widths. Cats and games keep their 288×224 cover crop. BeyondPixels v2 is archived. Published, and the live cards measure 195-384 × 280.
- [x] 2026-10-09:
  - Removed the photo of her holding the white cat (N4zN9Dg…) from the cats strip in BeyondPixels; v3 is archived.
  - Hero TV video is now `framer/assets/tv-cases-v2.mp4` (22.3 s), built by `make_tv2.py`: the 4 cases + Rooted, Yantrava, Casino, Wizrdom, Cubot, Social. Published, and the live site serves it.
  - All case heroes, via the generator's `fold_hero` and a hand patch on trips/index.html: the mockup is cut at 60% height and the theme colour ends at the cut (no 100vh header). The frame is up to 1440px wide; tall frames (contract 1280×1010) are capped to 52vh of window. Phone heroes have bigger phones with the window at 37vw.
  - gh-pages commit `ee0333f` is local; she must push.
- [x] 2026-10-09: all three Beyond strips can be dragged. The CSS marquee is replaced by a requestAnimationFrame drift (speed px/s) plus pointer drag (mouse/pen/touch, touch-action pan-y) that wraps both ways. Drift pauses on hover and while dragging; arrow keys step one card when the strip is focused; reduced motion means no drift, drag only. Tested in the harness: 60 px/s drift, drag ±300 → ±300. Published (live check: code present). v4 archived.
- [x] 2026-10-09 Trips impact: the dummy 3× / <1 day / 90% / 0 are replaced with doc-backed outcomes (1 channel, 100% auto-ticketed, live sync, 2-way). Applied in both the Overview outcome cards and the Impact section. Source: the "Transporter Panel" section of the engineer's achievements doc only. gh-pages is committed locally.
- [ ] Contract impact numbers (2×, < 24 hrs, 0) are still placeholders; that doc has no contract section.
- [x] 2026-10-09: Trips uses the prototype and hero from `export/` (her edited version). The prototype is unpacked to `trips/Valmo Trips Prototype.dc.html` + `assets/proto/v2/`, and all 19 scenes and 24 highlight targets are verified. All 4 case heroes now copy that hero exactly (generator `export_hero`). Committed locally on gh-pages.
- [x] 2026-10-09 Footer → `framer/RadioFooter.tsx` (code file `HJTptEX`), "Pranita FM". It replaces the full-screen TV `footer` inside the site's layout component (`eXLn7mkjm`), so it shows on every page.
  - **TV:** the hero TV is cut out (`framer/assets/tv-cut.webp`, uploaded as the "TV (cut out)" prop). Its screen shows her cat through a CRT: tint per channel, scanlines, flicker, on-screen display, lyric lines and a live equaliser.
  - **Dials:** the two printed dials are real controls. The top one changes channel, with static. The bottom one is volume: drag, arrow keys or scroll wheel.
  - **Deck:** prev / play / next, plus 4 channel dots.
  - **Music:** generated live with Web Audio (4 lo-fi channels), with optional Track CH1-4 file props to swap in real songs.
  - **Right side:** "Let's make it feel obvious." email + copy, LinkedIn, Behance, Medium, résumé, BLR clock, ©, back to top.
  - Verified in the harness (audio levels, channel switch, 390px no overflow) and live after publishing.
- [x] 2026-10-09 (round 2, published + verified live) Footer v2 "Pranita FM": 4 stations, each with its own cat + song + joke (This Is Fine FM / Radiohead No Surprises; Standup Survivor / Cigarettes After Sex Apocalypse; Post-Review Recovery / Prateek Kuhad cold/mess; Guardian of the Grid / Tame Impala Let It Happen). Apple 30s previews looked up live, "full song" links out. Cat images uploaded to the RadioFooter props in layout `Main` (eXLn7mkjm); CH2 = yawning-cat default. Hero "HI, I'M" aligned to PRANITA (both x=402). Intro indent removed on Desktop, Tablet AND Phone (each breakpoint had its own copy of the text with leading spaces). Section heading = CASE STUDIES. Site title/description = Pranita Sapkal (was Eric Cole); project renamed "Pranita Sapkal Portfolio". Go back + Next project verified on all 4 live cases.
- [x] 2026-10-09 Nav SERVICES removed from all 3 navbar variants (her call). Hero tagline "MAKING COMPLEX SYSTEMS FEEL OBVIOUS." deleted. Footer no longer auto-advances: a station loops until Next is pressed. Published + verified live. (/services, /about, /work empty template pages still exist, unlinked.)
- [ ] Hero Download button has download="file.txt" (component default, no setting); harmless cross-origin, opens the PDF in a new tab.
- [x] 2026-10-09 (round 4, published + pushed, verified live) Footer copy "Still here? / Say hi." + bigger TV (grid 1.5fr/1fr, max 1360). Socials: www LinkedIn, www Behance, medium.com/@sapkalp1997. Resume: PDF email fixed to sapkalp1997@gmail.com (old Pranitasapkal03@ shape removed, Poppins 12pt re-set, mailto relinked) + Portfolio link -> live site; preview modal (page images) opens from ANY resume link incl. hero button; download behind name/email/company form -> FormSubmit to sapkalp1997@gmail.com (activation email sent 2026-10-09; she must click "Activate Form"). Intro plays only on first visit/refresh. Case links on Home were target=_blank (work-column component, 8 layers) -> same tab. Go back = real _top link to main page "/". Prototype iframes + images lazy. Home weight 17 MB -> 5.6 MB.
- [ ] Glitch overlay video (1.5 MB, locked layer "glitch-gif") still full size.
- [ ] FormSubmit: Pranita clicks "Activate Form" in her inbox.

## Round 5 (2026-10-09) — nav right, fast Go back, resume behind a checked email
- [x] Navbar (component qZ2qtCxfp): Desktop container Distribute Start + gap 20, `links` Fill + Distribute End, so WORK / ABOUT / CONTACT sit together on the right. Phone variant container set back to Space between (the Desktop change had pulled the menu button left).
- [x] Go back / Next: hosted pages post `pf-nav` and wait 400ms for `pf-nav-ok`; the Framer frames (TripsPanelCase ra1OAVX, ContractPanelCase RUMaTe7, DoJoinCase DuZI3rK, all now = CaseStudyFrame.tsx) answer and switch route in place via pushState + popstate with Framer route ids. Live: case to Home in 136ms, same document, no intro. gh-pages 08513b5.
- [x] Resume (RadioFooter HJTptEX): name + email first, preview and download only after. Email check = format, typo fix ("Did you mean ...@gmail.com?"), throwaway-inbox list, placeholder names, live MX lookup (Cloudflare / Google DNS, lets the reader through if the lookup can't run). Pranita gets two kinds of email: "X opened your resume", "X downloaded your resume". Returning readers on the same device skip the form. Footer Resume link is `#resume` now, so the PDF URL isn't in that link.
- [ ] The email check can't prove the reader owns the inbox (that needs a one-time code and a backend).
- [ ] Route ids in CaseStudyFrame ROUTES are hard-coded; a recreated page needs its id re-read (fallback is a normal page load).

## Round 6 (2026-10-09): songs, no typo suggestions, speed
- [x] Radio: Talking Heads "Burning Down the House", Pink Floyd "Time", ELO "Mr. Blue Sky", The White Stripes "Seven Nation Army" (English, studio originals picked by exact title + artist). Prateek Kuhad and Radiohead removed.
- [x] Resume email: typo domains get "Check the spelling after the @." with no suggested address and no "Use this" button.
- [x] Speed, Home first visit 5.5 MB to 2.4 MB: glitch overlay video (5% opacity) 1.5 MB to 109 KB (6s loop, glitch-6s.mp4 on all 3 breakpoints); Beyond rows build their image strips only when opened, cats at scale-down-to=768, games at 640; footer warms channel images only when it is about a screen away, TV capped at 1600.
- [x] Case pages: 13 PNGs to WebP, 2.7 MB to 0.4 MB (gh-pages bb805fd). A 610 KB PNG in the Trips prototype was a 42px avatar sprite.

## Round 7 (2026-10-10): full check by 3 reviewers (copy, code, live QA), fixes published
- [x] Phone menu: opening it switched the navbar to the Desktop variant and it never came back. Two causes: (1) `@import` inside rendered `<style>` in RadioFooter/BeyondPixels/GraphicsWork/MoreWork made SSR and client differ (React #422/#425), so the page re-rendered client-side; fonts now load via a `<link>` added in useEffect (`useFonts`). (2) The navbar overlay's "On open" variant was unset on the Desktop (primary) instance in the Main template, so opening fell back to Desktop at every size; set to Phone. Verified live: open/close twice stays Phone, console clean.
- [x] Phone menu SERVICES (dead link) hidden in menu-overlay (bh08i2g0z).
- [x] Resume: stale Pranitasapkal03 email removed from the PDF's hidden link and its screen-reader text; summary "the systems that the screens" -> "the systems behind the screens"; bullet "Taken ... that made ... and added" -> "Took ... making ... and adding". Hero Download button and footer now both serve this PDF (old SetuX resume no longer linked). Preview page 1 image updated.
- [x] Copy: em dashes removed from /graphics; "Placeholder:" removed from Beyond row 2; Olá / Bonjour in the intro.
- [x] Code review fixes: stale-song race on fast tuning, DNS SERVFAIL no longer rejects real emails, .om/.cm and mail@ accepted, Indic names accepted, closing the form mid-check sends nothing, 15s download timeout, focus trap, 44px dots/Copy/Write, case-frame double-click + 5s fallback, closed Beyond rows inert and paused, idle TV no longer says PAUSE, Back to top is a button.
- [ ] Her calls: Huntment Ride vs DoJoin Ride naming; phone number (+91 80806 05988 vs 8767897103); Contract numbers (case 73 screens/12 flows vs resume 130+/14); case 001 name (Transporter Panel vs Trips panel); Rooted LIVE vs beta; Yantrava URL; Beyond row 2 caption (plants) vs its game images.
- [ ] /graphics is desktop-only and unlinked. ATS resume in repo still has SetuX, em dashes, old Medium (not public).

## Round 8 (2026-10-10): her calls applied, phones fixed site-wide
- [x] Phone +91 80806 05988 everywhere (resume.json, both generated resumes; her designed PDF already had it). Medium = medium.com/@sapkalp1997 (the real profile; @Pranitasapkal is empty) in resume.json, ATS and src/content/site.ts. Yantrava = https://yantrava.com (vercel URL was a copy; yantrava.com is blocked only by the office Netskope).
- [x] ATS + designed resumes rebuilt: no SetuX, no em dashes, LinkedIn casing, portfolio link, Rooted (live).
- [x] Her designed resume (PranitaSapkal_Resume.pdf): Rooted "(now in beta)" -> "(live)" redrawn in Poppins; preview images v3 uploaded to the footer; hero Download + footer serve the same final PDF (verified byte-identical).
- [x] Case 001 = "Transporter Panel" on the hosted page (eyebrow, intro, caption, outcomes label, meta) and Smart Home's next-project card. gh-pages db34c47 (also 44px Go back).
- [x] Rooted = live: /rooted page copy, RootedCase em dashes (17) removed, its font @import moved to useFonts.
- [x] Beyond row 2 caption: "Games. Every new release costs me a weekend and most of my wallet."
- [x] Footer CH2 back to the yawning cat (resume image had been uploaded into CH2 by mistake in round 7).
- [x] Top fade: RadioFooter portals a 96-120px backdrop-blur band (mask fades out, z 7 under the navbar's z 8) on every page.
- [x] Phone menu button 48x48 (padding 19/12). Go back 44px on case pages.
- [x] All six inner pages (/work/trips-panel, /contract-panel, /dojoin, /smart-home, /graphics, /rooted) had only a Desktop breakpoint, so phones rendered them 1200px wide (viewport width=1200). Added Tablet + Phone breakpoints; all now width=device-width. /graphics linked from Home ("See all graphics and brand work", in-place route switch, routeId CoCI5o9UT).
- [x] Radio verified live with real clicks: all 4 previews match Apple's studio tracks; rapid Next (warm and cold) lands on the right channel and song.
- [ ] Optional: /services, /about, /work are empty template pages still published (unlinked).

## Round 9 (2026-10-10): hero and navbar latency
- [x] Template appear delays were tuned for the old LOADER, so they ran even when the intro is skipped: navbar 5s (every page), PRANITA 4.5s, SAP KAL 4.7s, TV block 4.7s, tagline/resume button 5s, BLR clock 5s. Set to 0.2 / 0.2 / 0.35 / 0.45 / 0.6 / 0.6 (Framer appear effects; navbar instance in Main template, hero layers on Home Desktop; Tablet/Phone inherit).
- [x] "HI, I'M" (TextScramble, shows its text on mount) got an Appear effect (opacity 0, y 12, delay 0.2) so it arrives with the name.
- [x] Live, intro skipped: desktop HI 0.31s / name 0.36s / everything settled 1.37s (was ~6s); phone 0.38s / 1.40s; tablet settled 1.38s; case-page navbar 1.0s (was 5.6s). First visit still plays the Hello intro (~3.4s) with the hero already settled underneath.

## Round 10 (2026-10-10): tab icon, share image, plugins line
- [x] Removed "I also build the tools I use: eight Figma plugins..." (component section-about gBxn3Sps_, second text-wrapper hidden in the primary variant; all six variants inherit). Philosophy line kept as is (her call).
- [x] Tab icon was the template author's photo; social share image was the template's "ERIC COLE / Software Engineer" card on every page. Replaced in Site settings > Site images (favicon light + dark, apple touch icon = yawning cat face; social preview = new card) and Home page social preview. Sources in public/brand/ (card rendered from social-preview.source.html, 2400x1260).

## Round 12 (2026-10-10): hero TV latency
- [x] (superseded below) Home hero TV (`hero-image`, section-hero > container > bottom-content) still waited 4.5s and grew over 2s: its effect was a *scroll* animation ("Layer in view", scale 0 to 1), which round 9's appear-delay sweep missed. Now: trigger On appear, delay 0.3s, spring time 1.2s (Tablet/Phone inherit). Published. Live: desktop TV visible 1.0s, full 1.6s (was 5.0s / 7.0s); phone full 1.6s.
- [x] Her call: the TV comes about 1s after the name. Framer's Appear delay on this instance was unreliable (one load ignored it, another stretched it to 2.5s), so the effect is removed and the timing lives in a code override: `withFetchPriorityReveal` in Others/FetchPriority (code file `LISKFFX`, source in `framer/overrides/FetchPriority.tsx`). It is a CSS keyframe animation (scale 0 to 1, 0.9s, master ease, 1.3s delay) in the server HTML, so it runs from first paint; reduced motion = no scale. Live: name starts 0.58 to 0.66s, TV 1.07 to 1.15s later (desktop warm/cold, phone), no restart on hydration.

## Round 13 (2026-10-10): navigation in the Framer editor preview
- [x] Reproduced in her preview: Go back / Next project did nothing; WORK/ABOUT from a case page needed two clicks; "See all graphics" and ← Work loaded a page into the preview frame. Live site was 32/32 the whole time.
- [x] Fix (framer/ sources + Framer code files, saved): CaseStudyFrame copies (TripsPanelCase ra1OAVX, ContractPanelCase RUMaTe7, DoJoinCase DuZI3rK), MoreWork YMQYGsa, GraphicsWork JNRrlSr, RootedCase Fm60nsG switch pages with Framer's router inside the editor only; RadioFooter HJTptEX also lands on the section after a click or a "pf-section" event, and keeps the pending section across the page change.
- [x] Preview matrix: 4 cases x (open, Go back, Next, WORK, ABOUT, CONTACT, logo) 28/28; View prototype Trips + Contract; Home navbar 5/5; Graphics open, WORK/ABOUT/CONTACT, ← Work 5/5. Cases 03/04 have no prototype CTA by design.
- [ ] Publish (her OK), then re-run the live matrix (desktop + phone) because RadioFooter's click trigger also runs live.
- Note: /rooted is not linked from anywhere on the site (the Rooted card goes to rootedplant.org).
