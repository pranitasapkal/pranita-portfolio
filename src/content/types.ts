/**
 * Case-study content model — closed discriminated-union Block vocabulary.
 * Do NOT add block types without an ADR.
 */

export type Block =
  | { type: 'text'; body: string }
  | { type: 'statRow'; stats: StatItem[] }
  | { type: 'image'; frame: 'browser' | 'phone' | 'none'; src: string; alt: string; caption?: string; slug?: string; placeholder?: boolean }
  | { type: 'compare'; before: { label: string; body: string }; after: { label: string; body: string } }
  | { type: 'rejected'; items: { pattern: string; reason: string }[] }
  | { type: 'flow'; steps: string[] }
  | { type: 'prototype'; slug: string; poster?: string; title: string; note?: string }
  | { type: 'quote'; text: string; attribution?: string }
  | { type: 'matrix'; title: string; columns: string[]; rows: string[][]; totalNote?: string }
  // Full-width designed "board" (a deck slide, a UI screenshot, or a fresh diagram),
  // rendered edge-to-edge in the editorial layout. Added per ADR-001.
  | { type: 'board'; src: string; alt: string; caption?: string; tone?: 'light' | 'dark'; wide?: boolean; placeholder?: boolean }
  // Editorial showcase blocks (ADR-002) — live-rendered, reference-grade presentation.
  | { type: 'heroStats'; items: { value: string; label: string; sub?: string }[] }
  | { type: 'challengeSolution'; challenge: string; solution: string }
  | { type: 'phaseCards'; items: { step?: string; title: string; body: string; tags?: string[] }[] }
  | { type: 'wordList'; title?: string; items: { word: string; note?: string }[]; highlight?: number }
  | { type: 'timeline'; items: { label: string; sub?: string }[] }
  | { type: 'screensGrid'; cols?: 2 | 3; items: { src: string; alt: string; caption?: string }[] }

export interface StatItem {
  value: string
  label: string
  fuzzed?: boolean
}

export interface Chapter {
  id: string
  step: number
  title: string
  /** Process-step name shown in the eyebrow when `title` is a claim (editorial layout), e.g. "Problem Understanding". */
  kicker?: string
  /** One giant ghost word rendered behind the chapter header (editorial layout only). */
  ghost?: string
  blocks: Block[]
}

export interface CaseStudy {
  slug: string
  code: string
  title: string
  oneLiner: string
  /** Page shell: 'standard' = sticky-nav chapters (default); 'editorial' = walletsprout-style long-scroll of boards. */
  layout?: 'standard' | 'editorial'
  /** Real-content cases stay unlisted + noindex (e.g. CLH carries un-fuzzed client detail). */
  noindex?: boolean
  /** Editorial-hero presentation (fall back to code/platform when absent). */
  eyebrow?: string
  domain?: string
  scale?: string
  coverBoard?: { src: string; alt: string; placeholder?: boolean; tone?: 'light' | 'dark' }
  meta: {
    role: string
    team: string
    timeline: string
    platform: string
  }
  tldr: {
    problem: string
    outcomes: string[]
    summary: string
    /** Curated display values for the 3 outcome stat cards (parallel to outcomes). Falls back to 01/02/03 index marks when absent. */
    stats?: { value: string; fuzzed?: boolean }[]
  }
  /** Exactly 8 chapters mapping to the 8 UX process steps. */
  chapters: Chapter[]
  spotlights: {
    decision: string
    rejected: string
    why: string
  }[]
  reflection: string
  next: {
    slug: string
    title: string
    code: string
  }
}
