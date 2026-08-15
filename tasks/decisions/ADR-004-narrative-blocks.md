# ADR-004: Narrative blocks — scene, tabs, insights, problem→solution, before/after

**Date**: 2026-08-15
**Status**: Accepted

## Context

The case pages read as eight essays with process-step headings. Two reference sets were studied
before rewriting `TPN-01`:

1. Fourteen screenshots Pranita supplied — an Expedia partner-tools case, a business-travel
   confirmation case, a Digit health-claims case, a banking platform case. Source of specific
   devices: a tabbed problem, sticky-note research, an HMW band, annotated screens, before/after.
2. **debodyutibiswas.framer.website** — three cases read in full (`/proactively`, `/whylo`,
   `/superveggie`). All three run one template: **CAPS eyebrow → claim title → one or two short
   paragraphs → a punchline**, with a scene opener, a Problem→Solution→effect spine, conditional
   success metrics, an openly-stated NDA gate, and a short list of learnings at the end.

The gap is measurable. Counting every paragraph on both sides:

| | Debo (3 cases) | Our ASM-01 |
|---|---|---|
| Total words | 552 / 670 / 791 | 3,981 |
| Prose paragraphs | 19 / 20 / 21 | 81 |
| Median paragraph | 17 / 16 / 22 words | 38 words |
| Longest paragraph | 35 / 84 / 53 words | 238 words |
| Short elements (eyebrow, title, card, label) | 54 / 64 / 73 | — |

His 552-word case carries **54 short elements against 19 paragraphs**: the structure does the
talking and the prose only connects it. Ours inverts that — 125-word paragraphs doing the job a
`matrix` row or a callout should do. The fix is not deletion but **redistribution into blocks**,
which the current vocabulary cannot absorb.

## Decision

Extend the closed `Block` union with six narrative blocks, extend one existing block, and change
three shapes on `CaseStudy`. All are authored generically for **all five case studies**, not
special-cased to TPN-01.

New blocks:
- `problemTabs` — faceted problem behind a pill switcher — `ProblemTabs.tsx`
- `statementBand` — full-width band carrying the HMW / problem statement — `StatementBand.tsx`
- `insightNotes` — research insights as a sticky-note board — `InsightNotes.tsx`
- `beforeAfter` — labelled toggle between two images — `BeforeAfter.tsx`
- `annotatedShot` — one screen plus numbered callouts explaining each change — `AnnotatedShot.tsx`
- `ndaNote` — the NDA gate, stated openly rather than implied — `NdaNote.tsx`

Extended: `challengeSolution` becomes Debo's Problem→Solution pair — optional index, a problem
with an optional user quote, a solution, and a required **effect** line ("This shifted the
experience from reading numbers to understanding personal progress"). The old two-string form is
kept working so CLH-03 does not need rewriting in this commit.

Shape changes on `CaseStudy`: `reflection: string` → `reflections: { title, body? }[]` (the
learnings list) · `meta` gains `skills: string[]` (completing the ROLE / TIMELINE / TEAM / SKILLS
strip) · `Chapter` gains optional `navLabel` (a short beat name for the sticky nav, so the nav
reads "The morning list · Two failures · Who I designed for" while the kicker still prints
"01 · Problem Understanding").

Deferred, noted so it isn't re-litigated: Debo's `Iteration 1 / Iteration 2 / Final Design`
triptych. We have no iteration artifacts for this module.

Length budget, to be enforced when the copy lands: total 750–900 words, median paragraph 18–22,
nothing over 60, 60–75 short elements.

## Consequences

- Easier: the reference template becomes expressible, and the word budget becomes reachable
  without dropping a single traced claim — the Adhoc rationale, six table rules, four billing
  realities and 13 dispute states all move into blocks rather than out of the page.
- The mandatory 8-step process survives: `kicker` carries the step, `title` carries the claim
  (the mechanism `ADR-002` already established), and `navLabel` handles the nav.
- Cost: `BlockRenderer`'s `never` check means every new type needs a renderer before `tsc` passes,
  so components ship in the same commit as the types. They are written **plain and correct, not
  styled to finish** — deliberate scaffolding for the visual rebuild, listed in
  `docs/DESIGN-BRIEF.md` as the friend's to restyle.
- Cost: `types.ts` is a shared file under `CONTRIBUTING.md`. This change is agreed and recorded
  here rather than made silently.
- Watch: `reflections` and `meta.skills` are required, so all five cases migrate in this commit —
  mechanical, but it touches every case file.
