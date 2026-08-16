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
all 5 cards with correct copy + node signatures (**settles the ASM-01 card that was never visually
confirmed**) · `/work/assignment-module` and `/work/linehaul-nexus` both render, 49 images load,
`noindex` intact · zero console errors.

## Phase 1 — parallel lanes (IN PROGRESS)
- [ ] Text: home/about/footer copy → sets the voice → then cases ASM→NDC→CLH→TCM→PLC → resume → SEO
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
