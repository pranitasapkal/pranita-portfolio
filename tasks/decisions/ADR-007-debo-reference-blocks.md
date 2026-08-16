# ADR-007: Debo-reference blocks — deviceFrame, problemCards, chapter eyebrows

**Date**: 2026-08-16
**Status**: Accepted

## Context

The Transporter Panel page is being rebuilt on the structure of
`debodyutibiswas.framer.website/whylo` (direction re-confirmed with Manav 2026-08-16 after
the prior session drifted; all four asks verified real — Mac-mockup hero, 3D illustrations,
competitor table, primary-research-before-secondary). The reference's devices were derived
from the live site, not from memory: white page, multi-accent palette (yellow/red/blue/
green/purple), Geist Mono all-caps section labels, serif body, sticky left section nav with
GO BACK, hero meta as ROLE · TIMELINE · TEAM · SKILLS, and a problem section built as
numbered persona-voice quote cards around an illustration with a closing punchline.

The Block union is a closed vocabulary; additions require an ADR (this one).

## Decision

Three additions, one restyle:

1. **`deviceFrame` block + `CaseStudy.heroShot`** — a screenshot inside a laptop display
   (screen only, no keyboard deck — Pranita's spec). `heroShot` renders it under the hero
   meta row in `CaseLayout`; the block form is available anywhere.
2. **`problemCards` block** — central illustration (optional; labelled placeholder until
   the file arrives), N numbered cards each carrying a question in the persona's own voice
   plus one terse persona/context line, closed by a punchline. Rendered as a `pop-blue`
   panel with white text (7.72:1; dimmed lines use white/85 ≈ 6.9:1 — the mock's grays
   would fail AA). Composition and the seven Transporter Panel questions locked with
   Manav's mock, 2026-08-16. Text is live HTML, never baked into the image.
3. **`Chapter.eyebrow`** — mono all-caps section label ("THE PROBLEM") replacing the
   STEP NN eyebrow in `CaseLayout` and hiding the step counter in `ChapterNav` when set.
4. **`.v1-paper` type re-declaration** — within white case pages, `--font-display`/
   `--font-serif`/`--font-body` resolve to Fraunces (Tiempos stand-in) and `--font-mono`
   to Geist Mono. The `pop-*` accent set lives in the v1 `@theme` block with computed
   contrast pairs documented in `theme.css`.

## Consequences

- Easier: reference-faithful case pages without touching block components (token +
  font re-declaration does the reskin); the problem section reads complete before the
  illustration file exists.
- Harder: the Block union grows by two; `problemCards` is styled for light pages only
  (white text on pop-blue) — using it inside `.v1-ink` would need a variant.
- The Transporter Panel switched `layout: 'editorial'` → `'standard'` (sticky nav);
  `EditorialCaseLayout` still serves CLH-03.
