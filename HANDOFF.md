# Handoff — current state of the portfolio

**Date:** 2026-08-15 · **Status:** in progress, builds green

Read this before changing anything. It covers what just landed, what is half-finished, and the traps.

A fuller session log lives at `tasks/todo.md` (phase tracker + a known-issues table). This file is the summary.

---

## Where things stand

`npm run build` is green with everything currently in the tree (`tsc -b && vite build`, ~1.9s). The site has five case studies, all routable, all rendering.

| Code | Case study | Layout |
|---|---|---|
| `ASM-01` | The Assignment Module | standard |
| `NDC-02` | Network Design Central | standard |
| `CLH-03` | Contract Lifecycle Hub | **editorial** |
| `TCM-04` | Transporter Contract Management | standard |
| `PLC-05` | Multi-Origin Route Builder | standard |

## The big open thread: two layout systems

There are currently **two** case-study layouts, and the migration between them is 1-of-5 done.

- `CaseLayout.tsx` — the original. Sticky chapter nav, eight process steps. Four case studies use it.
- `EditorialCaseLayout.tsx` — newer, long-scroll, board-driven. Only Linehaul Nexus (`CLH-03`) uses it.

`src/pages/CaseStudyPage.tsx` branches on `cs.layout === 'editorial'`. The design intent is in `tasks/decisions/ADR-001-editorial-case-blocks.md`, `ADR-002-showcase-blocks.md`, `ADR-003-decision-story-structure.md`.

**Whether the remaining four get migrated is an open question for Pranita** — the editorial layout may be a deliberate one-off for CLH rather than the new default. Don't mass-convert without asking.

The editorial system added block types to the `Block` union in `src/content/types.ts` (`board`, `heroStats`, `challengeSolution`, `phaseCards`, `wordList`, `timeline`, `screensGrid`) with components in `src/components/caseStudy/blocks/`. `Block` is a **closed** union — new types need an ADR, not a quick extension.

## Most recent work: the Assignment Module (`ASM-01`)

Built end to end this session and finished. Source of truth was a 182-screen Figma export plus three internal PDFs (none of which are in this repo — see below).

- Narrative: `content/case-studies/00-assignment-module.md`
- Rendered: `src/content/cases/assignment-module.tsx`
- Evidence base: `tasks/assignment-sot-map.md` — every UI claim traced to a specific screen. If you want to know why the case study says something, it is in here.
- Images: 13 in `public/work/assignment/` — 10 screenshot exports + 3 generated diagrams

Verified: build green, all 13 image paths resolve, the page renders (checked via headless screenshot), home and registry codes match.

One thing **not** verified: the ASM card's appearance in the home Work section. The hero is ScrollTrigger-pinned, so a static headless capture just re-renders the hero, and Chrome's remote-debugging port wouldn't bind in that environment. Run `npm run dev`, scroll to Work, and confirm the first card renders with its node signature.

## Known issues

| Issue | Detail |
|---|---|
| `npm run covers` needs a live dev server | It captures the sanitized prototypes over http from :5173. Run `npm run dev` first. |
| `npm run nda-scan` is inert here | It needs `content/fuzzing-map.json`, which is gitignored and not in this repo, so it prints a notice and exits 0 **without checking anything**. A green run proves nothing. The old 224-hit era is over on `revamp` (numeric tokens anchored, `geo/` skipped) but the gate itself is a no-op without that file. |
| `content/case-studies/CLH-SCRIPT-v3.md` | A working draft sitting in a scanned directory. Probably belongs in `tasks/`. |
| Case data is duplicated | `src/components/home/CaseIndex.tsx` has its own hardcoded `CASES` array separate from `src/content/cases/index.ts`. This is deliberate (home copy is shorter) but the `code` field renders in both places and must stay in sync. `NODE_SIGNATURES` is indexed by card position — a new card without a matching SVG renders blank. |

## What is intentionally missing from this repo

| Missing | Consequence |
|---|---|
| `content/fuzzing-map.json` | `nda-scan` prints a notice and exits 0. Nothing else reads it. |
| `Figma- Assignment module/` | `shots:assignment` exits with a clear message. The sanitized outputs it produced are committed in `public/work/assignment/`. |
| Root `*.jpeg` | Visual research only — reference screenshots of other designers' portfolios. Nothing references them. |

Everything builds and runs without all three.

## Open questions for Pranita

1. Does the editorial layout roll out to the other four case studies, or is CLH a deliberate one-off?
2. Two flat resume PDFs (`pranita-sapkal-resume.pdf`, `-ats.pdf`) were deleted from `public/resume/` when the DOCX/SVG/JSON-Resume generators landed. Intentional, or should they still be generated?
3. `content/case-studies/CLH-SCRIPT-v3.md` — safe to move to `tasks/`, or still in use by `gen-clh-boards.mjs` / `gen-clh-diagrams.mjs`?

## Suggested first move

```bash
npm install && npm run dev
```

Open the home page, scroll through the Work section, then read one case study of each kind — `/work/assignment-module` (standard) and `/work/linehaul-nexus` (editorial) — to see the two layout systems side by side. That comparison is the main thing to have an opinion about.
