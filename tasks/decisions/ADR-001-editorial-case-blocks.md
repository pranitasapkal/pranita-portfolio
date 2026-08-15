# ADR-001: Editorial case layout + `board` block

**Date**: 2026-08-05
**Status**: Accepted

## Context
The case-study Block vocabulary is closed ("do NOT add block types without an ADR" — `src/content/types.ts`, `CLAUDE.md`), and `CaseLayout.tsx` hardcodes a sticky-nav 8-chapter shell. Pranita wants the CLH case to read like an elaborate, editorial long-scroll (ref: `krritika.framer.website/work/walletsprout`) — a serif hero + a vertical sequence of full-width designed **boards** (deck slides, UI screenshots, fresh diagrams) interleaved with narrative — richer than the current text-first template. The existing `image` block renders inside a browser/phone/plain frame at content width; it is not an edge-to-edge board and has no scroll reveal.

## Decision
1. Add one block type — **`board`**: `{ type:'board'; src; alt; caption?; tone?:'light'|'dark'; wide?; placeholder? }` — a full-width designed board on a light/dark mat with a reduced-motion-safe scroll reveal (`Board.tsx`). Handled in `BlockRenderer.tsx` (the `never` exhaustiveness check enforces it).
2. Add a second page shell — **`EditorialCaseLayout.tsx`** — selected per case via optional `CaseStudy.layout: 'editorial'` in `CaseStudyPage.tsx`. It reuses the existing `Chapter[]`/`Block[]` content model, `Spotlights`, `Reflection`, and `NextCase`; it only changes presentation (serif hero, Domain/Role/Timeline/Scale pills, cover board, no sticky nav, wider vertical rhythm). The three other cases keep `CaseLayout.tsx` until migrated.
3. Add optional presentational `CaseStudy` fields (`eyebrow`, `domain`, `scale`, `coverBoard`, `noindex`) — all optional, so existing cases are unaffected.

No new motion pattern is introduced: the board reveal is the existing fade/rise inside `gsap.matchMedia()` with a `prefers-reduced-motion: reduce` branch; master ease `cubic-bezier(0.65,0,0.35,1)`.

## Consequences
- Easier: image-driven, presentation-grade case studies without forking the content model; the same `CaseStudy` object can render standard or editorial.
- Harder / watch: two layouts to keep visually consistent; `board` assets are real (un-fuzzed) for CLH, so the CLH case is delivered **unlisted + `noindex`** and must not ship in a public `nda-scan`-gated `dist/`. A fuzzed public variant can be produced later from the same object via `fuzzing-map.json`.
