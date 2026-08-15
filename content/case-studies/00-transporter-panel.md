---
slug: transporter-panel
code: TPN-01
title: The Transporter Panel
layout: editorial
---

# TPN-01 — The Transporter Panel

**The rendered case study is `src/content/cases/transporter-panel.tsx`. That file is the source
of truth.** This document records the structure and where each claim comes from, so the case can
be reviewed and argued with without reading TSX. It is deliberately not a second copy of the
prose — a duplicate would drift.

Evidence base: `tasks/transporter-panel-sot-map.md`, which traces every UI claim to a specific
screen in the 182-screen Figma SOT.

## Structure

Eight chapters, following the mandatory 8-step process. Each chapter's `kicker` carries the
process step; the `title` carries a claim; `navLabel` gives the sticky nav a short beat name.
This is the mechanism `ADR-002` established and `ADR-004` extended.

| Step | Beat | The claim | Carries |
|---|---|---|---|
| 01 Problem Understanding | The chat thread | "Every trip he ran existed as a message in a chat thread." | Scene opener · his own quote · three context stats · the before-state diagram · the problem in three facets |
| 02 Objective | The one sentence | "Confirmation had to become the payout trigger." | The problem stated as a question · four jobs · the three rules I held myself to |
| 03 User Persona | Who I designed for | "He owns the trucks. He is never on the truck." | Eight research observations · what he asked for vs what shipped · the challan screen |
| 04 Information Architecture | The right-hand edge | "The action column is the tab's thesis." | The hierarchy tree · the renaming-column table · the Completed tab annotated · disputes taken out of the trip |
| 05 User Flow | Where money moves | "Two screens can cost him money in a single click." | The lifecycle · two Problem→fix→effect pairs (reject, confirm-with-dispute) · the bilingual dispute form |
| 06 Lo-fi Wireframes | Rules I broke | "I wrote six rules for this table, then broke two of them on purpose." | The six rules · the three deviations, defended · six rejected patterns |
| 07 Prototype | What shipped | "182 screens, and 102 of them on the one tab that pays." | Before/after · screens per tab · state coverage and the gap on Cancelled |
| 08 Business Aspects | How we would know | "The panel is one link in a chain that ends in a payment." | The payout chain · three signals that would show it working · the attribution note |

Closing: two decision spotlights, then four reflections.

## Deliberate calls recorded here so they are not re-litigated

- **No Results section.** Module-level outcome numbers cannot be published — the programme
  metrics belong to the whole system-led trip programme. Chapter 08 states what would show the
  work landing, and the `ndaNote` block says plainly what is not being claimed.
- **Adhoc rows keep Confirm Details and Raise Dispute.** Adhoc most often runs without a linked
  contract, so those earnings are the least verifiable — exactly the rows that most need a route
  to correction. Kept as a spotlight because it is the clearest evidence of judgement in the case.
- **Rules 2 and 3 and Goal 2 were overruled, not missed.** All three are named in chapter 06.
- **Three gaps stay in the reflections**: Cancelled has no empty or loading state, disputes can
  only be raised from Completed, and role-based access did not ship.

## Length

Written to the `ADR-004` budget and checked with `npm run count:copy transporter-panel`:
median paragraph 22 words, 75th percentile 30, longest 40, nothing over 60, and short elements
outnumbering prose paragraphs 2.6 to 1. The evidence lives in blocks — matrices, rule lists,
annotated callouts, rejected patterns — rather than in paragraphs.
