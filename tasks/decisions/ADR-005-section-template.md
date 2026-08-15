# ADR-005: One section template, measured against a reference case

**Date**: 2026-08-15
**Status**: Accepted — supersedes ADR-004's length table and its `kicker` convention

## Context

The case pages read as essays. ADR-004 already said so, using Debodyuti Biswas's portfolio as the
reference, and set a length budget. That budget was then overridden: a first compression pass cut
`TPN-01` from 4,599 to 2,510 words, and Pranita reversed it — *"lets keep the wording to 4,599w"* —
because the cut had also dropped six screens and four decision spotlights. So the length rule was
abandoned and only paragraph shape was gated.

On 2026-08-15 she pointed at a second reference, **smritidesign.work/work/ai-commentary**, and asked
for its section grammar and its brevity to become the template every case follows. The earlier
reversal is not a contradiction once you read what she actually rejected: **losing evidence, not
losing prose.** The new reference settles the question — it carries its meaning in short labelled
elements and uses prose only to connect them.

## The reference, measured

Counted from the live page (165 `p`/`li` nodes):

| | Reference | TPN-01 before | TPN-01 after |
|---|---|---|---|
| Reading copy (p/li words) | **1,401** | 4,618 | 2,009 |
| Prose paragraphs (≥12w) | **42** | 158 | 75 |
| Median / p75 | **20 / 30** | 23 / 31 | 24 / 31 |
| Longest | **46** | 51 | 48 |

Nine devices, all of which our existing block vocabulary already supports — **no new block types**:

| Device | Shape | Our block |
|---|---|---|
| Title | a claim carrying the outcome | `title` + `oneLiner` |
| Why it mattered | one 24-word sentence | `tldr.summary` |
| Challenge / Breakthrough / Outcome | 3 labels + 36–46w each | `tldr` |
| Narrative beat | runs of 7–15 word paragraphs | consecutive `text` |
| Success metrics | 4 lines of 7–16w | `wordList` |
| Key design decisions | 3 named × one 15–28w sentence | `spotlights` / `challengeSolution` |
| Principles | 3 items of 3–10 words | `wordList` |
| Edge-case logic | IF/THEN pairs of 1–4 words | `matrix` |
| Impact | stat tiles + three 20–30w paragraphs | `heroStats` + `statRow` |
| Reflections | four 10–11 word lines | `reflections` |

## Decision

**1 · Nine editing rules, applied identically to every case.**

- R1 One claim, one home — the fact lives in the block that *shows* it.
- R2 No connective paragraphs — a `text` block with no number, quoted UI string or named artifact goes.
- R3 Research states a finding once — `insightNotes` **or** `matrix`, never both plus prose.
- R4 A decision is argued once. Where a spotlight makes the case, the chapter does not re-make it.
- R5 Reflections are one line each.
- R6 `wordList[].note` ≤ 12w · `rejected[].reason` ≤ 15w.
- R7 Rationale essays become structure — a `matrix` or one verdict sentence.
- R8 **No process eyebrows.** `kicker` is deleted from every chapter; the claim title carries the
  section. Both layouts already render it conditionally, so this is content-only. This reverses
  ADR-004's convention of printing the 8-step process name in the eyebrow. The process still governs
  how the work is done — it just stops being printed at the reader.
- R9 A caption never repeats the paragraph above it.

**2 · The budget, gated in `scripts/count-copy.mjs`.**
Reading copy ≤ 1,800w · prose paragraphs ≤ 50 · median 16–24 · p75 ≤ 32 · longest ≤ 48 · at most 3
paragraphs over 40w.

**3 · Screen counts are unique screens, not exported files.**
An export folder contains artboard fragments, explicit copies (`(2)`, `(alt)`, `(v2)`), screens filed
under the wrong tab, and third-party vendor screens. None of those are design work. Every case states
the unique number and, where the two differ noticeably, says so on the page.

## Consequences

**Easier.** The reader gets the argument without the essay. The gate is measurable, so "it reads
short" stops being a claim. Nothing needed a new component.

**Harder.** Rich cases cannot reach 1,800 words without deleting evidence. `TPN-01` lands at 2,009
with 23 screenshots, 4 matrices, 3 rule lists and 2 problem/fix pairs — the labelled elements alone
approach the target before a connecting sentence. **When the choice is the budget or the proof, the
proof wins and the miss gets reported.** That is the whole content of Pranita's earlier reversal, and
this ADR does not quietly undo it.

**Two measurement corrections made while writing this.**
1. `count-copy.mjs` counted every string over 12 words as a paragraph, including chapter titles,
   table cells and captions — inflating `TPN-01` to 98 paragraphs when about half were headings. The
   reference was counted on `p`/`li` only. Both filters now apply, in that order.
2. The short-to-prose **ratio gate was removed**. The reference's 123 "short elements" are one-word
   `p` tags used as labels (`PROBLEM`, `IF`, `THEN`); our vocabulary puts those in `label`, `word`
   and `value` fields that render as spans. Gating on the ratio measured markup style, not writing.

## Status of the rollout

`TPN-01` is the worked example and is done. `NDC-02`, `CLH-03`, `TCM-04` and `PLC-05` are **not
started** — Pranita's instruction was to get one right first so the others can follow it. Their
per-file cut lists are recorded in `tasks/todo.md`.
