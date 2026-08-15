/**
 * TCM-04 — Transporter Contract Management
 * Typed CaseStudy object converted from content/case-studies/03-transporter-contracts.md
 * IMG blocks point at placeholder paths; placeholder:true triggers the "asset pending" frame.
 * {*} markers preserved verbatim in all body strings — rendered as <Asterisk /> by BlockRenderer.
 * [UT-FINDINGS:...] placeholders preserved verbatim — renderer shows a "content pending" pill.
 *
 * Structure and length follow ADR-005; the worked example is transporter-panel.tsx. One claim,
 * one home — a number a statRow shows is not repeated by the paragraph above it — and a decision
 * is argued once: the spotlights carry the reasoning, the chapters state what shipped.
 *
 * NOTE: "the response deadline" is the fuzzed form of an internal SLA term. An earlier
 * find/replace left three artifacts behind (a lowercase bolded label, a missing word, and a
 * multi-word `ghost`), fixed 2026-08-16. Do NOT revert any of these to the original term.
 * Checked with `npm run count:copy TCM` and `npm run check:facts check TCM`.
 */
import type { CaseStudy } from '../types'
import { summaries } from './summaries'

export const transporter: CaseStudy = {
  ...summaries['transporter-contract-management'],
  title: 'Transporter Contract Management',
  oneLiner:
    'Everything that makes an ops power-tool good actively fails a user who reads slowly and trusts the screen literally — so the work was subtraction, with discipline.',
  eyebrow: 'VALMO (MEESHO) · TRANSPORTER-FACING · IN BUILD',
  domain: 'Vendor contract management',
  scale: '15–70 contracts a month · 34 row states',
  meta: {
    role: 'Product Designer — sole designer, end to end',
    team: 'Valmo Transportation (Meesho) — with PM and engineering counterparts',
    timeline: 'TBC',
    platform: 'Desktop web panel (transporter-facing)',
    skills: ['Product Design', 'UX Research', 'Accessibility', 'Usability Testing'],
  },
  tldr: {
    problem:
      'Transporters handling 15–70 contracts a month — low-literacy, Hindi-first, trusting the screen literally — had no self-serve way to accept, reject, track or dispute a contract without calling support.',
    outcomes: [
      'Four lifecycle tabs, one primary action per row, and a 34-row table proving every combination renders',
      'A self-review scored my own screens 2.8/5 and catalogued 27 issues — 7 of them ship-blockers I caught before engineering did',
      'Three decision records lock 13+ structural calls and a 6-term status vocabulary, pressure-tested in a moderated Hindi usability test',
    ],
    stats: [{ value: '34' }, { value: '27' }, { value: '3' }],
    summary:
      'The vendor-facing contract console for Valmo transporters, built by removing the patterns ops tools are usually praised for — dense filters, hover-hidden actions, clever conditional layouts.',
  },

  chapters: [
    // ── STEP 01 ───────────────────────────────────────────────────────────
    {
      id: 'problem-understanding',
      step: 1,
      navLabel: 'The wrong answer',
      ghost: 'LITERAL',
      title: 'The obvious answer was an ops dashboard. That answer was wrong.',
      blocks: [
        {
          type: 'text',
          body: 'Valmo — Meesho’s transportation arm — issues route contracts to independent Indian transporters. Each carries a deadline, a rate, a vehicle spec and real money.\n\nBefore this panel they lived in phone calls and PDFs. He heard about a contract from a Valmo contact, and had nowhere to see what was running, ending or gone.',
        },
        {
          type: 'problemTabs',
          items: [
            {
              label: 'Filters he has to assemble',
              body: 'Stacked dropdowns assume you already know which subset you want. He does not arrive with a query — he arrives with a question, and the panel has to answer it before he can phrase it.',
            },
            {
              label: 'Actions hidden until hover',
              body: 'A control revealed on hover is invisible to someone scanning for what to do next. If the action is not in the row at rest, for this reader it does not exist.',
            },
            {
              label: 'Columns that reshuffle per tab',
              body: 'Clever conditional layouts teach a literal reader that the panel is arbitrary. Once he believes that, he stops trusting any number on it — including the correct ones.',
            },
            {
              label: 'Status carried by colour',
              body: 'A coloured dot is a convention you have to be taught. Every urgency signal here is a chip carrying text as well: the colour decorates, the word informs.',
            },
          ],
        },
        {
          type: 'text',
          body: 'So the brief was not "build a contract table."\n\nIt was to take a real lifecycle — Pending → Upcoming → Active → Closed, disputes, terminations, performance flags — and present it so a slow, literal reader can act alone, on the first batch day.',
        },
        {
          type: 'statRow',
          stats: [
            { value: '15–70 contracts/month', label: 'contract volume' },
            { value: '4 tabs × 34 distinct row states', label: 'lifecycle states to represent' },
          ],
        },
        {
          type: 'image',
          frame: 'browser',
          src: '/src/assets/work/transporter/l1-panel-tabs.png',
          alt: 'L1 panel with the four lifecycle tabs — Pending, Upcoming, Active, Closed',
          placeholder: true,
        },
      ],
    },

    // ── STEP 02 ───────────────────────────────────────────────────────────
    {
      id: 'objective',
      step: 2,
      navLabel: 'Four jobs',
      ghost: 'ALONE',
      title: 'Four jobs, done alone, without a phone call.',
      blocks: [
        {
          type: 'statementBand',
          eyebrow: 'What had to become true',
          statement:
            'How might a transporter who reads slowly accept, reject, track and dispute a contract on his own — on the first batch day, without calling anyone?',
        },
        {
          type: 'wordList',
          title: 'Two halves, one measurable bar each',
          items: [
            {
              word: 'For him',
              note: 'Accept, reject, find what needs him today, and check whether an active contract is in trouble.',
            },
            {
              word: 'For the business',
              note: 'Protect the response deadlines Valmo commits to, and cut avoidable rejections.',
            },
            {
              word: 'For me',
              note: 'The screens had to survive a self-review against the locked spec, WCAG 2.1 AA and the persona.',
            },
          ],
          highlight: 2,
        },
        {
          type: 'statRow',
          stats: [{ value: '≤48 hours', label: 'urgency threshold — a delayed accept is a breach risk' }],
        },
      ],
    },

    // ── STEP 03 ───────────────────────────────────────────────────────────
    {
      id: 'user-persona',
      step: 3,
      navLabel: 'Reads it literally',
      ghost: 'TRUST',
      title: 'He reads the screen literally, so the screen cannot bluff.',
      blocks: [
        {
          type: 'text',
          body: 'A small operator running one to a handful of vehicles — from a mid-range laptop, not a phone, which surprises people who read "low-literacy" and assume "mobile".\n\nAnything consequential he understands in Hindi first, and his mental model is three questions: what needs me now, what is running, what is over.',
        },
        {
          type: 'insightNotes',
          title: 'Four traits, and the screen each one changed',
          notes: [
            'He reads the screen literally — a count that disagrees with another count is evidence the system is untrustworthy',
            'He has no tolerance for hidden navigation — hover tooltips, kebab menus and unlabelled filter states all fail him',
            'He fears making mistakes, which shaped the reject warning and the typed-confirmation terminate flow',
            'He shares his logged-in laptop with staff, which is why the contract area got its own passcode gate',
          ],
        },
        {
          type: 'text',
          body: 'The first trait produced ship-blocker #1 in my own review: I had shipped `Pending (22)` on a card next to `Pending (10)` on a tab.\n\nThe third produced the debrief question I put to every participant: "Did you feel safe doing actions here, or were you scared of making mistakes?"\n\nIt is also why the dispute-success modal lost its confetti. A grievance acknowledged is not a celebration. [UT-FINDINGS: pending from Pranita]',
        },
        {
          type: 'statRow',
          stats: [{ value: '6–8 transporters, literacy-mixed', label: 'moderated usability test, in Hindi' }],
        },
        {
          type: 'image',
          frame: 'none',
          src: '/src/assets/work/transporter/persona-card.png',
          alt: 'Persona context — transporter at laptop, one-page persona card',
          placeholder: true,
        },
      ],
    },

    // ── STEP 04 ───────────────────────────────────────────────────────────
    {
      id: 'information-architecture',
      step: 4,
      navLabel: 'Named views',
      ghost: 'NAMES',
      title: 'Named views instead of filters he has to assemble.',
      blocks: [
        {
          type: 'text',
          body: 'The IA is the contract lifecycle, stated plainly: four tabs — **Pending, Upcoming, Active, Closed** — in the order a contract moves.\n\nNo dashboard landing, no separate action centre. The tab names are the mental model.',
        },
        {
          type: 'text',
          body: '**Chips are named views, not filter toggles.** Pending has `Urgent (X)` and `All Pending (X)`. Active has up to four: `Below Target`, `Disputes`, `Ending Soon`, `All Active`.',
        },
        {
          type: 'matrix',
          title: 'Three rules that decided the whole structure',
          columns: ['Rule', 'What it killed'],
          rows: [
            [
              'Columns are invariant per tab (ADR-001 §7)',
              'Any chip restructuring the table. Row tags carry it instead, in two places only: performance tags beside the numbers they annotate, everything else under Contract ID.',
            ],
            [
              'A sub-metric exists only if it maps to a real chip (ADR-002)',
              '"Estimated Earnings" (not actionable), "All: X" (duplicates the header), "Starting Soon" (maps to no view). 4 → 3 cards.',
            ],
            [
              'Every closure names its actor',
              'The ambiguous "Auto rejected" and the actor-less "Cancelled" — three retired terms in all.',
            ],
          ],
          totalNote:
            'The locked vocabulary is six words: Rejected · Terminated by You · Terminated by Valmo · Cancelled by Valmo · Completed · No Response. A literal reader needs to know who did the thing.',
        },
        {
          type: 'image',
          frame: 'none',
          src: '/src/assets/work/transporter/tab-chip-structure.png',
          alt: 'Tab and chip structure diagram — named views with counts, not filter toggles',
          placeholder: true,
        },
      ],
    },

    // ── STEP 05 ───────────────────────────────────────────────────────────
    {
      id: 'user-flow',
      step: 5,
      navLabel: 'One action a row',
      ghost: 'ONE',
      title: 'One primary action per row, so the next step is never a choice.',
      blocks: [
        {
          type: 'text',
          body: 'One principle runs through every flow: destructive or consequential actions get friction, everything else gets none.',
        },
        {
          type: 'text',
          body: '**Accept** is one click from the default landing state on batch day. The Urgent chip auto-selects when non-empty, each row carries a filled `Accept` button, and a banner explains why "Reminder from Valmo" rows come first.\n\nThe modal splits into Review → Assign vehicle and driver, optional → Confirm, so assignment never blocks acceptance.',
        },
        {
          type: 'text',
          body: '**Reject** is a text link, deliberately weaker than Accept, and it interrupts — see the spotlight below.\n\n**Terminate** gets a harder gate: a typed confirmation, because it is irreversible and trips still run for a 3-day buffer afterwards, which the row counts down as "X days to complete remaining trips."',
        },
        {
          type: 'text',
          body: '**Dispute** is reachable only from an Active row without one already open; with one open the button disables and says why.\n\nThe success state is a neutral document icon and "We\'ve received your dispute. Expect an update within 24 hours".',
        },
        {
          type: 'text',
          body: '**Session entry** passes through a passcode gate on the contract area only, because he shares the laptop and rates are confidential. First run is OTP to the registered mobile, then set a password.\n\nIt is fronted by three short lines — "Private page / Your contracts and money / Only you can open it" — and an amber callout: "Do not tell anyone — not even your staff."',
        },
        {
          type: 'statRow',
          stats: [{ value: '3 days', label: 'trips still run after a termination' }],
        },
        {
          type: 'image',
          frame: 'browser',
          src: '/src/assets/work/transporter/accept-modal-3step.png',
          alt: 'Accept → assign → confirm 3-step modal',
          placeholder: true,
        },
        {
          type: 'image',
          frame: 'browser',
          src: '/src/assets/work/transporter/passcode-gate.png',
          alt: 'Passcode gate intro + OTP + set-password screens',
          placeholder: true,
        },
      ],
    },

    // ── STEP 06 ───────────────────────────────────────────────────────────
    {
      id: 'lo-fi-wireframes',
      step: 6,
      navLabel: 'What I removed',
      ghost: 'CUT',
      title: 'The work was removing what ops tools get praised for.',
      blocks: [
        {
          type: 'text',
          body: 'Five patterns were cut at lo-fi, each of which would pass review in a normal ops tool. I wrote down why, because a recorded reason is what stops the next iteration quietly adding it back.',
        },
        {
          type: 'rejected',
          items: [
            {
              pattern: 'An "Assign Pending" chip on Upcoming with per-row "Assign Now" buttons',
              reason: 'Two primary actions per row, pointing at a flow that did not exist from that surface.',
            },
            {
              pattern: 'A "New Contracts" chip on Pending',
              reason: 'See the spotlight — arrival is not a distinction this user acts on.',
            },
            {
              pattern: 'All contextual banners shown at once on Active',
              reason: 'One banner per active chip, so he always knows which view it belongs to.',
            },
            {
              pattern: 'Tags distributed across columns by topic',
              reason: 'Reinstated under a stricter rule that caps a worst-case tag stack at two.',
            },
            {
              pattern: 'A Performance filter on Active duplicating the Below Target chip',
              reason: 'Two controls doing one job. Kept only on Closed, where no chip exists.',
            },
          ],
        },
        {
          type: 'text',
          body: 'Every tag, chip and banner rule had to render correctly against every row before hi-fi started. That table is also the prototype’s test data, so the spec and the demo cannot drift.',
        },
        {
          type: 'matrix',
          title: 'Row state matrix — representative states',
          columns: ['Tab', 'State', 'Urgency', 'Primary CTA'],
          rows: [
            ['Pending', 'Deadline ≤48h, no response', 'Urgent (red)', 'Accept · Reject (text link)'],
            ['Pending', 'Deadline >48h, Valmo reminder sent', 'Normal (amber)', 'Accept · Reject (text link)'],
            ['Upcoming', 'Starts within 24h, no dispute', 'Near deadline', 'View'],
            ['Active', 'Below Target (on-time performance)', 'Flagged', 'View'],
            ['Active', 'Open dispute, under review', 'Urgent', 'View (dispute in progress)'],
            ['Closed', 'Terminated by You, buffer complete', '—', 'View (read-only)'],
          ],
          totalNote: '34 rows in the full matrix, across 4 tabs.',
        },
        {
          type: 'statRow',
          stats: [{ value: '5', label: 'patterns rejected, each with a written reason' }],
        },
        {
          type: 'image',
          frame: 'none',
          src: '/src/assets/work/transporter/state-matrix.png',
          alt: 'Row state matrix — 34 states across 4 lifecycle tabs',
          placeholder: true,
        },
      ],
    },

    // ── STEP 07 ───────────────────────────────────────────────────────────
    {
      id: 'prototype',
      step: 7,
      navLabel: 'I judged my own',
      ghost: '2.8',
      title: 'I scored my own screens 2.8 out of 5 before anyone else could.',
      blocks: [
        {
          type: 'text',
          body: 'Two artefacts carried the interaction design: 130+ hi-fi screens in Figma across the two export sets, and a single-file HTML prototype — ~1,450 lines, no framework, no build step, driven entirely by the row-state matrix.\n\nIt exists because tag-visibility, chip auto-hide and banner conditions are behavioural claims. A static mock cannot prove that switching to Below Target hides the now-redundant performance tags.',
        },
        {
          type: 'text',
          body: 'Then I reviewed it as a hostile reviewer would, against the locked spec, WCAG 2.1 AA and the persona. It scored **2.8/5** — strong skeleton, not ship-ready.\n\nAfter that it went in front of transporters: think-aloud, in Hindi, 45–60 minutes each, with per-task timing and unaided-success scoring.\n\n8 task scenarios, from "find and accept a new contract" to "this contract was terminated — can you still run trips?" [UT-FINDINGS: pending from Pranita]',
        },
        {
          type: 'statRow',
          stats: [
            { value: '2.8/5 · 27 issues · 7 P0', label: 'self-review, before handoff' },
            { value: '~1,450 lines, single file, no framework', label: 'prototype' },
          ],
        },
        {
          type: 'prototype',
          slug: 'transporter',
          title: 'Transporter Contract Management — live prototype',
          note: 'Chip auto-hide and tag-visibility rules are live — switch to Below Target and the redundant performance tag disappears from every row.',
        },
        {
          type: 'image',
          frame: 'browser',
          src: '/src/assets/work/transporter/self-review-issues.png',
          alt: 'Judge-mode issue list excerpt — P0 ship-blockers including conflicting counts and confetti on a grievance',
          placeholder: true,
        },
        {
          type: 'image',
          frame: 'browser',
          src: '/src/assets/work/transporter/prototype-active-tab.png',
          alt: 'Prototype Active tab with chip-driven tag hiding — Below Target view with performance tags suppressed',
          placeholder: true,
        },
      ],
    },

    // ── STEP 08 ───────────────────────────────────────────────────────────
    {
      id: 'business-aspects',
      step: 8,
      navLabel: 'What it protects',
      ghost: 'CLOCK',
      title: 'A late accept is a breach, so urgency had to be a deadline, not a mood.',
      blocks: [
        {
          type: 'phaseCards',
          items: [
            {
              step: '01',
              title: 'Response-deadline protection',
              body: 'A pending contract that expires unanswered is a route Valmo has to re-source.',
            },
            {
              step: '02',
              title: 'Avoidable-rejection reduction',
              body: 'A rejection costs Valmo a re-sourcing cycle and costs him a contract-length earning stream.',
            },
            {
              step: '03',
              title: 'Support-call deflection',
              body: 'Every flow that used to need a phone call has a self-serve path, with a reason and a timestamp.',
            },
          ],
        },
        {
          type: 'text',
          body: 'The first lever is why urgency is deadline-based, and why an expired contract gets an honest label — "No Response", not "Auto rejected".\n\nMislabelling the system’s action as the user’s erodes the trust the panel depends on.',
        },
        {
          type: 'text',
          body: 'The second is why the usability test asked: "What does the earning-loss figure mean to you — would you still reject?"\n\nThe point is not to block rejection. Nobody should reject a contract without knowing its price. [UT-FINDINGS: pending from Pranita]',
        },
        {
          type: 'text',
          body: 'The trade-offs were taken knowingly. Locked constraints slow future bolt-ons, since any new action must fit "one primary CTA per row", and the passcode gate adds a step.\n\nFull state coverage everywhere is engineering cost paid up front, so the screen never contradicts itself.',
        },
        {
          type: 'statRow',
          stats: [{ value: '3 ADRs, 13+ decisions, 6-term vocabulary', label: 'written before hi-fi' }],
        },
      ],
    },
  ],

  spotlights: [
    {
      decision: 'Chips are named views with an always-visible "All" fallback; action chips vanish at zero.',
      rejected: 'Conventional filter toggles, zero-count chips included.',
      why: 'A literal reader treats "Disputes (0)" as a fact, and an empty filtered table as a broken page. (ADR-001 §1–2.)',
    },
    {
      decision: 'Urgency is the deadline, not the arrival date — so there is no "New Contracts" chip.',
      rejected: 'The recency model every inbox-shaped tool ships with.',
      why: 'Contracts arrive in one monthly batch, so on batch day everything is new and the distinction carries no signal. "Respond now vs. later" is a property of the deadline, not the arrival. (ADR-001 §2.)',
    },
    {
      decision: 'Show the money before allowing a rejection — the earnings forfeited and the rating hit.',
      rejected: 'A bare "Are you sure?", or a guilt screen designed to stop him.',
      why: 'Rejecting forfeits a contract-length earnings stream — a lakh-plus figure on a typical contract{*}. A user who fears the screen clicks through a vague confirm.',
    },
  ],

  reflections: [
    {
      title: 'The 2.8/5 I gave my own screens is the most useful number here, and the least comfortable.',
      body: 'Three decision records and a locked vocabulary, and the screens still reached review contradicting themselves on one viewport.',
    },
    { title: 'Spec discipline and screen discipline turn out to be different skills.' },
    { title: 'Four lifecycle tabs may be one too many. I raised it, and deferred it to the test evidence.' },
    { title: 'Cutting features is easy. Writing down why is the discipline.' },
  ],

  next: {
    slug: 'placement-multi-origin',
    title: 'Placement & Assignment — the Multi-Origin Route Builder',
    code: 'PLC-05',
  },
}
