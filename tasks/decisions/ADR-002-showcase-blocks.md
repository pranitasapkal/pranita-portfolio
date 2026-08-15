# ADR-002: Showcase blocks + claim-based chapter headers (editorial layout)

**Date**: 2026-08-07
**Status**: Accepted

## Context
The first editorial CLH build (ADR-001) read as text walls with a few flat boards — Pranita: "does not look interesting at all, not even the design process is being shown completely." Four references were studied (Behance: Bao Solutions, Vaultix ASM, PlanIQ; wallofportfolios: Ashish Ranjan). Their common grammar: claim-based section titles with numbered eyebrows, giant stat bands, Challenge/Solution two-cols, process-phase cards with tags, ghost display text behind headers, iteration timelines, and galleries showing MANY real screens.

## Decision
Extend the closed Block vocabulary with six live-rendered showcase blocks (all reveal via the existing Board fade/rise inside `gsap.matchMedia()` with a reduced-motion branch — no new motion vocabulary):
- `heroStats` — giant stat row (Ashish's 4%→7%→+75% band) — `HeroStats.tsx`
- `challengeSolution` — two-col Challenge/Solution — `ChallengeSolution.tsx`
- `phaseCards` — phase/level cards with tag pills (PlanIQ) — `PhaseCards.tsx`
- `wordList` — big word list, one highlighted row (ASM/Vaultix) — `WordList.tsx`
- `timeline` — horizontal iteration/roadmap track with alternating pills (PlanIQ) — `TimelineBlock.tsx`
- `screensGrid` — 2/3-col gallery of real UI screens with captions — `ScreensGrid.tsx`

Chapter model gains optional `kicker` (process-step name shown in the eyebrow, e.g. "01 / PROBLEM UNDERSTANDING") and `ghost` (one giant decorative word behind the header, `aria-hidden`, ~4% opacity). Chapter `title` becomes a CLAIM ("Contracting lived everywhere except one place."), preserving the mandatory 8-step process via the kicker.

Shared `useReveal.ts` hook extracted so all blocks reuse one reveal implementation.

## Consequences
- Easier: reference-grade, image+data-rich case pages; the 8-step process reads as a narrative, not a form. Live-rendered blocks stay crisp at any DPR, animate, and are editable without re-exporting PNGs.
- Watch: `screensGrid` object-cover crops screen tops — pick source screens whose story reads in the upper 16:9; blocks are dark-theme-tuned (ink/signal), so a future light-band variant needs a tone prop, not new components.
