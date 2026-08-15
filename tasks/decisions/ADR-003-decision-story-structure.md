# ADR-003: Case studies use a decision-story spine, not the 8-step process form

**Date**: 2026-08-07
**Status**: Accepted

## Context
Two drafts of the CLH case were rejected. The copy was written for insiders (CLH, RFQ, NLH/RLH, "slot" — never defined), and the page was organised as the mandatory 8-step UX process, one chapter per step. Secondary research was run against both a broad sweep of acclaimed case studies and the five references Pranita supplied.

Findings that drove this decision:
- **NN/g (HIGH credibility)**: for readers in a *tangential field* — design hiring managers reading a logistics case — terms need full definition; target ~12th-grade reading level; define inline (Intercom's "our information architecture (IA) — the framework that organizes how features, settings, and workflows fit together"), never in a glossary block.
- **Convergent across sources**: Problem→Objective→Persona→IA→Flows→Wireframes→Prototype→Business is a *production checklist, not a narrative structure*. Compress the situation into 1–2 sentences; spend the body on 2–4 hard decisions, each as constraint → options rejected → choice → why.
- **Hiring managers** apply a fast 3-filter (role fit / seniority signal / relevance) and look for *decision quality*, not process completeness. Pixelated images and typos alone cause rejection.
- **Reference text analysis**: of the 5 references supplied, 4 carry only 50–85 words total (SEO boilerplate); only Ashish Ranjan's portfolio is genuinely written (~1,000 words, ~63–87 words per screen) and it runs a fixed rhetorical skeleton with verdict headings, problem-first orientation, first person only at the frame, and captions of one bold claim + one sentence.

## Decision
1. **Structure**: chapters carry decision stories, not process steps — The tension → How it works today → Decision 01–04 → How it was made (8 steps compressed to one band) → See it running → What I'd test next. The 8-step process still ran and stays visible; it just stops being the narrative skeleton. `Chapter.kicker` carries the label; `title` carries the verdict.
2. **Writing rules**: define every domain term inline on first use; headings are verdicts; first person only at open and close; captions are one bold claim + one sentence; real numbers stated flat, speculative ones hedged; ~1,000 words total.
3. **Assets**: source frames from `clh-rfq-panel/New SOT CLH panel /` (Jul 2026 source of truth; note trailing space in the folder name), never the superseded `prototype/` folder. Tab naming follows that build (Action Required · Sent for Approval · **Upcoming** · Active · Closed — "Upcoming", not "Approved").
4. `spotlights` is now optional and hidden when empty — the decision chapters replace it. `Board` captions render `**bold**` inline.

## Consequences
- Easier: passes the 30-second skim; a reader with no logistics background can follow it; decisions are the visible content.
- Harder / watch: the 8-step process is now one compressed band, so process rigour must be legible in a glance — if a reviewer wants the full process, it needs the two-tier treatment considered and deferred here. The case still lacks a measured outcome metric and any real user quote; both are called out honestly in the closing rather than invented.
