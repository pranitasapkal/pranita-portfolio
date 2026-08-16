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
  /**
   * Two forms. The original two-string version (CLH-03) still works; the pair form added by
   * ADR-004 is what new writing should use — a named problem, the fix, and one sentence saying
   * what actually changed for the user.
   */
  | {
      type: 'challengeSolution'
      /** Legacy form. */
      challenge?: string
      solution?: string
      /** Pair form — e.g. "PROBLEM 1". */
      index?: string
      problem?: { title: string; body: string; quote?: string }
      fix?: { title: string; body: string }
      /** One sentence naming the change. Required whenever `problem`/`fix` are used. */
      effect?: string
      image?: { src: string; alt: string }
    }
  | { type: 'phaseCards'; items: { step?: string; title: string; body: string; tags?: string[] }[] }
  | { type: 'wordList'; title?: string; items: { word: string; note?: string }[]; highlight?: number }
  | { type: 'timeline'; items: { label: string; sub?: string }[] }
  | { type: 'screensGrid'; cols?: 2 | 3; items: { src: string; alt: string; caption?: string }[] }
  // Narrative blocks (ADR-004) — the reference template's devices.
  /** A problem with two or more facets, one visible at a time behind a pill switcher. */
  | { type: 'problemTabs'; items: { label: string; body: string }[] }
  /** Full-width band carrying the problem statement / how-might-we. */
  | { type: 'statementBand'; eyebrow: string; statement: string }
  /** Research insights as a sticky-note board. Each note is one declarative sentence. */
  | { type: 'insightNotes'; title?: string; notes: string[] }
  /** Labelled toggle between two images — the state before the work and after it. */
  | {
      type: 'beforeAfter'
      before: { src: string; alt: string; label: string }
      after: { src: string; alt: string; label: string }
      caption?: string
    }
  /** One screen plus callouts, each naming a change and why it was made. */
  | {
      type: 'annotatedShot'
      src: string
      alt: string
      caption?: string
      notes: { title?: string; body: string }[]
    }
  /**
   * Field-research photographs as a draggable card deck (ADR-006).
   * `src` is optional — a card without one renders a labelled placeholder frame,
   * so the section reads complete before the photographs arrive.
   */
  | {
      type: 'researchDeck'
      title?: string
      note?: string
      items: { src?: string; alt: string; caption: string; place?: string }[]
    }
  /** The NDA boundary, stated openly instead of implied by omission. */
  | { type: 'ndaNote'; title: string; body: string }
  // Debo-reference blocks (ADR-007) — the whylo case-study devices.
  /** A screenshot inside a laptop-display frame (screen only, no keyboard deck). */
  | { type: 'deviceFrame'; src: string; alt: string; caption?: string; placeholder?: boolean }
  /**
   * The reference's problem format: a central illustration with numbered
   * quote-cards around it — each a question in the persona's own voice plus one
   * terse context line — closed by a full-width punchline. `illustration` is
   * optional so the section reads complete before the image file arrives.
   */
  | {
      type: 'problemCards'
      illustration?: string
      illustrationAlt: string
      punchline?: string
      items: { quote: string; context: string }[]
    }

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
  /** Short beat name for the sticky nav, e.g. "Two failures". Falls back to `title`. */
  navLabel?: string
  /** Mono all-caps section label, Debo-style ("THE PROBLEM"). Replaces the STEP NN eyebrow when set. */
  eyebrow?: string
  /** One giant ghost word rendered behind the chapter header (editorial layout only). */
  ghost?: string
  blocks: Block[]
}

/**
 * The cheap half of a case study: identity plus the home-index card copy — and nothing
 * else. Authored in `cases/summaries.ts`, which the home page imports; keeping page prose
 * out of it is what stops all five case studies loading on the home route. Each case file
 * spreads its own summary, so a card and its page can never disagree about slug or code.
 */
export interface CaseSummary {
  slug: string
  code: string
  /** Card title — usually shorter than the case-page `title`. */
  cardTitle: string
  /** Card hook — usually shorter and punchier than the page `oneLiner`. */
  cardOneLiner: string
  /** Three pill stats along the bottom of the card. */
  stats: [string, string, string]
  /** Fake URL shown in the card's browser chrome. */
  browserSlug: string
  /** false = card renders un-linked with an "in assembly" tag. Defaults to true. */
  live?: boolean
}

export interface CaseStudy extends CaseSummary {
  /** Case-page title. */
  title: string
  /** Case-page hook — also the meta description for the route. */
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
  /** Hero mockup rendered under the meta row (Debo-style laptop screen, no keyboard). */
  heroShot?: { src: string; alt: string }
  meta: {
    role: string
    team: string
    timeline: string
    platform: string
    /** Disciplines applied, rendered as a list beside role/timeline/team. */
    skills: string[]
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
  /** Closing learnings — a short list, not a paragraph. Each title is a claim; body expands it. */
  reflections: { title: string; body?: string }[]
  next: {
    slug: string
    title: string
    code: string
  }
}
