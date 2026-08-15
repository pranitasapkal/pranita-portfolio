/**
 * TCM-04 — Transporter Contract Management
 * Typed CaseStudy object converted from content/case-studies/03-transporter-contracts.md
 * IMG blocks point at placeholder paths; placeholder:true triggers the "asset pending" frame.
 * {*} markers preserved verbatim in all body strings — rendered as <Asterisk /> by BlockRenderer.
 * [UT-FINDINGS: ...] placeholders preserved verbatim — renderer shows a "content pending" pill.
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
      'Transporters handling 15–70 contracts a month — low-literacy, Hindi-first, trusting the screen literally — had no self-serve way to accept, reject, track, or dispute contracts without calling support.',
    outcomes: [
      'Cut the interface down to 4 lifecycle tabs, 1 primary CTA per row, and a 34-row state matrix that proves every combination renders correctly',
      'Judge-mode self-review scored my own screens 2.8/5 and catalogued 27 issues — 7 of them ship-blockers I caught before engineering did',
      '3 ADRs lock 13+ structural decisions and a 6-term status vocabulary; validated with a moderated Hindi usability test across 6–8 literacy-mixed transporters',
    ],
    stats: [{ value: '34' }, { value: '27' }, { value: '3' }],
    summary:
      'I designed the vendor-facing contract console for Valmo transporters by systematically removing the patterns ops tools are usually praised for — dense filters, hover-hidden actions, clever conditional layouts. What shipped instead is a panel of named views, deadline-based urgency, and one action per row, hardened by a 27-issue self-audit and a moderated usability test in Hindi.',
  },

  chapters: [
    // ── STEP 01 ───────────────────────────────────────────────────────────
    {
      id: 'problem-understanding',
      step: 1,
      kicker: 'Problem Understanding',
      navLabel: 'The wrong answer',
      ghost: 'LITERAL',
      title: 'The obvious answer was an ops dashboard. That answer was wrong.',
      blocks: [
        {
          type: 'text',
          body: "Valmo — Meesho's transportation arm — issues route contracts to independent Indian transporters.\n\nA transporter receives 15–70 contracts per month, mostly in one monthly batch, each with a response deadline, a rate, a vehicle spec, and real money attached.\n\nBefore this panel, the contract lifecycle lived in phone calls and PDFs: transporters found out about new contracts from a Valmo point of contact, disagreed by calling someone, and had no single place to see what was running, what was ending, or why something disappeared.",
        },
        {
          type: 'text',
          body: "The obvious answer was an ops-style contract dashboard. That answer was wrong, and understanding why became the core of the project. This user is not an ops analyst.\n\nHe runs a small fleet from a mid-range laptop, reads slowly, comprehends critical decisions in Hindi first, and trusts the screen literally — if a chip says \"Disputes (0)\" he reads it as a fact about his business, not as an empty filter state.\n\nEvery convention that makes an internal power-tool efficient — stacked filter dropdowns, actions revealed on hover, tabs whose columns reshuffle per filter, status conveyed by color dots — either confuses him or, worse, teaches him the panel lies.",
        },
        {
          type: 'text',
          body: "So the design problem was not \"build a contract table.\"\n\nIt was: take a domain with a genuinely complex lifecycle — Pending → Upcoming → Active → Closed, disputes, terminations with a 3-day trip buffer, performance flags, SLA reminders — and present it so a slow, literal reader can act on it correctly, alone, on the first monthly batch day.\n\nThe whole project is subtraction: from a full ops-tool vocabulary down to what survives contact with this persona.",
        },
        {
          type: 'problemTabs',
          items: [
            {
              label: 'Filters he has to assemble',
              body: 'Stacked dropdowns assume you already know which subset you want. This user does not arrive with a query — he arrives with a question, and the panel has to answer it before he can phrase it.',
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
              body: 'A coloured dot is a convention you have to be taught. Every urgency and delay signal here is a chip carrying text as well, because the colour is the decoration and the word is the message.',
            },
          ],
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
      kicker: 'Objective',
      navLabel: 'Four jobs',
      ghost: 'ALONE',
      title: 'Four jobs, done alone, without a phone call.',
      blocks: [
        {
          type: 'statementBand',
          eyebrow: 'The problem, stated',
          statement:
            'How might a transporter who reads slowly accept, reject, track and dispute a contract on his own — on the first batch day, without calling anyone?',
        },
        {
          type: 'text',
          body: "The objective had two halves — one for the transporter, one for the business — and one measurable bar for each.\n\nFor the transporter: complete the four core jobs — accept a contract, reject one, find what needs action today, and check whether an active contract is in trouble — without calling support and without a walkthrough.\n\nThe proxy metrics I designed against: land on the actionable subset by default, never strand the user in an empty filtered view, and keep every row to exactly one primary CTA.\n\nSo the Urgent chip auto-selects when its count is above zero, an \"All\" fallback chip stays visible on every tab, and the correct next action is never a choice among equals.\n\nFor the business: protect SLA compliance on pending contracts (a delayed accept is a breach risk — hence deadline-based urgency at ≤48 hours), and reduce avoidable rejections by showing economic consequences before the reject action commits.",
        },
        {
          type: 'text',
          body: 'I also set an explicit quality bar for myself rather than for the user: before handoff, the screen set had to survive a judge-mode review against the locked spec, WCAG 2.1 AA, and the persona — scored, catalogued, and written into an ADR.\n\nIt scored 2.8/5 on the first pass, which is exactly what that gate was for: 27 issues, including 7 ship-blockers, caught by me instead of by engineering or by a transporter in the field.',
        },
        {
          type: 'statRow',
          stats: [
            { value: '≤48 hours', label: 'urgency threshold' },
            { value: '2.8/5, 27 issues, 7 ship-blockers', label: 'self-review gate' },
          ],
        },
      ],
    },

    // ── STEP 03 ───────────────────────────────────────────────────────────
    {
      id: 'user-persona',
      step: 3,
      kicker: 'User Persona',
      navLabel: 'Reads it literally',
      ghost: 'TRUST',
      title: 'He reads the screen literally, so the screen cannot bluff.',
      blocks: [
        {
          type: 'text',
          body: "The user is an Indian transporter — a delivery partner or small logistics operator running one to a handful of vehicles for Valmo.\n\nHe works from a mid-range laptop, not a phone; this is a desktop panel, which surprised people who assume \"low-literacy\" means \"mobile.\" His literacy is low, his comprehension of anything consequential is Hindi-first, and his mental model of the domain is three questions: which contracts do I need to act on right now, which are running, which are over.",
        },
        {
          type: 'text',
          body: "Four traits drove every decision in this project.\n\n**He reads the screen literally.** A count that disagrees with another count on the same screen is not a rendering bug to him — it is evidence the system is untrustworthy.\n\nThis is why \"reconcile all counts to one source\" was P0 issue #1 in my self-review (I found `Pending (22)` on a card next to `Pending (10)` on a tab).\n\n**He has no tolerance for hidden navigation.** Hover-only tooltips, actions behind kebab menus, and filter states with no visible label all fail him. Everything is a named, labelled, counted view.\n\n**He fears making mistakes.** The usability-test debrief asked directly: \"Did you feel safe doing actions here, or were you scared of making mistakes?\" That fear shaped the reject warning, the typed-confirmation terminate flow, and the removal of celebratory treatment from the dispute-success modal — a grievance is not a confetti moment.\n\n**He shares his device.** Staff and points-of-contact use the same logged-in laptop, which is why the contract area got its own session passcode gate.",
        },
        {
          type: 'text',
          body: 'The moderated usability test (6–8 transporters, literacy-mixed, conducted in Hindi) pressure-tested exactly these traits. [UT-FINDINGS: pending from Pranita]',
        },
        {
          type: 'statRow',
          stats: [
            { value: '6–8 transporters, literacy-mixed', label: 'UT sample' },
          ],
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
      kicker: 'Information Architecture',
      navLabel: 'Named views',
      ghost: 'NAMES',
      title: 'Named views instead of filters he has to assemble.',
      blocks: [
        {
          type: 'text',
          body: 'The IA is the contract lifecycle, stated plainly: four tabs — **Pending, Upcoming, Active, Closed** — in the order a contract actually moves. No dashboard-first landing, no separate "action center." The tab names are the mental model.\n\nWithin each tab, the structure follows three locked rules, each written into an ADR because each was violated in an earlier iteration.',
        },
        {
          type: 'text',
          body: '**Chips are named views, not filter toggles (ADR-001).** Pending has `Urgent (X)` and `All Pending (X)`. Active has up to four: `Below Target`, `Disputes`, `Ending Soon`, `All Active`.\n\nAction chips hide entirely when their count is zero — a "Disputes (0)" chip is noise that invites a dead-end click — but the "All" fallback is always visible, so the user can never be stranded in a filtered view he doesn\'t understand.\n\n**Columns are invariant per tab (ADR-001 §7).** No chip ever restructures the table.\n\nAll contextual variation is carried by row-level tags, which live in exactly two places: performance tags in the Performance column, co-located with the TAT% and on-time-placement numbers they annotate; lifecycle and dispute tags under the Contract ID.\n\n**Sub-metrics on overview cards exist only if they map to a real chip (ADR-002).** That rule killed the Estimated Earnings card (not actionable), the "All: X" sub-metric (duplicates the header count), and "Starting Soon" (maps to no view). Four cards became three.',
        },
        {
          type: 'text',
          body: 'A locked 6-term closure vocabulary — Rejected, Terminated by You, Terminated by Valmo, Cancelled by Valmo, Completed, No Response — replaced ambiguous words like "Auto rejected" and actor-less "Cancelled," because a literal reader needs to know *who* did the thing.',
        },
        {
          type: 'statRow',
          stats: [
            { value: '6 locked terms, 3 retired', label: 'closure vocabulary' },
            { value: '4 → 3', label: 'overview cards after chip-backed sub-metric rule' },
          ],
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
      kicker: 'User Flow',
      navLabel: 'One action a row',
      ghost: 'ONE',
      title: 'One primary action per row, so the next step is never a choice.',
      blocks: [
        {
          type: 'text',
          body: 'The flows follow one principle: destructive or consequential actions get friction; everything else gets none.',
        },
        {
          type: 'text',
          body: "**Accept** — the highest-frequency action — is one click from the default landing state on batch day: the Urgent chip auto-selects when non-empty, an SLA banner explains why \"Reminder from Valmo\" rows come first, and each row carries a filled `Accept` button.\n\nThe accept modal splits into three steps (Review → Assign vehicle/driver, optional → Confirm) so the assignment decision doesn't block acceptance — assignment can also happen later from the detail view, never from the list row.",
        },
        {
          type: 'text',
          body: "**Reject** is a text link, deliberately weaker than Accept, and it interrupts: before confirming, the flow shows the economic consequence — the total earning the transporter is walking away from, a lakh-plus figure on a typical contract{*} — plus the performance-rating impact, then asks for a reason from an acceptance-time list (rate, vehicle size, period).\n\n**Terminate**, a different act with different reasons (driver exit, breakdown, route closed), gets a harder gate: a typed-confirmation second step, because it is irreversible and trips must still run for a 3-day buffer afterwards — a countdown the row surfaces as \"X days to complete remaining trips.\"",
        },
        {
          type: 'text',
          body: "**Dispute** is reachable only from Active rows without an open dispute; with one open, the CTA disables with a plain-language tooltip.\n\nThe success state is a neutral document icon and \"We've received your dispute.\n\nExpect an update within 24 hours\" — the confetti treatment from an earlier screen was removed because a grievance acknowledged is not a celebration.\n\n**Session entry** passes through a passcode gate on the contract area only: transporters share their logged-in laptop with staff, and contract rates are confidential.\n\nFirst-time flow is OTP-to-registered-mobile → create password, fronted by an intro screen in three 2–4-word bullets (\"Private page / Your contracts and money / Only you can open it\") and an amber callout: \"Do not tell anyone — not even your staff.\"",
        },
        {
          type: 'statRow',
          stats: [
            { value: '3 days', label: 'terminate buffer' },
          ],
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
      kicker: 'Lo-fi Wireframes',
      navLabel: 'What I removed',
      ghost: 'CUT',
      title: 'The work was removing what ops tools get praised for.',
      blocks: [
        {
          type: 'text',
          body: "The lo-fi stage was where most of the subtraction happened, and I kept a written record of what was cut — five rejected patterns, each of which would pass review in a normal ops tool.",
        },
        {
          type: 'rejected',
          items: [
            {
              pattern: 'An "Assign Pending" chip on Upcoming with per-row "Assign Now" buttons',
              reason: 'Created two primary actions per row and referenced a flow that didn\'t exist from that surface. Upcoming became view-only at list level; assignment lives at acceptance and in the detail view (ADR-001 §4).',
            },
            {
              pattern: 'A "New Contracts" chip on Pending',
              reason: 'Contracts arrive in one monthly batch — "new vs. existing" is not a distinction this user acts on. Only "respond now vs. later" matters, so urgency became deadline-based (≤48h), not arrival-based.',
            },
            {
              pattern: 'All contextual banners shown simultaneously on the Active tab',
              reason: 'Rejected for stacking; one banner per active chip instead, so the user always knows which view\'s context the banner belongs to.',
            },
            {
              pattern: 'Tags distributed across columns by topic',
              reason: 'Rejected in ADR-001, partially reinstated in ADR-002 with a stricter rule — performance tags belong with the performance numbers; everything else stays under Contract ID, capping worst-case tag stacks at 2.',
            },
            {
              pattern: 'A Performance filter dropdown on Active duplicating the Below Target chip',
              reason: 'Two controls doing one job. Removed from Active, kept only on Closed where no chip exists.',
            },
          ],
        },
        {
          type: 'text',
          body: 'The wireframes were validated against a 34-row state matrix — every tag, chip, and banner rule had to render correctly against every row before hi-fi started.\n\nThe matrix is also the prototype\'s test data, so the spec and the demo can\'t drift.',
        },
        {
          type: 'matrix',
          title: 'Row State Matrix — representative states',
          columns: ['Tab', 'State', 'Urgency', 'Primary CTA'],
          rows: [
            ['Pending', 'Deadline ≤48h, no response', 'Urgent (red)', 'Accept · Reject (text link)'],
            ['Pending', 'Deadline >48h, Valmo reminder sent', 'Normal (amber)', 'Accept · Reject (text link)'],
            ['Upcoming', 'Starts within 24h, no dispute', 'Near deadline', 'View'],
            ['Active', 'Below Target (TAT%)', 'Flagged', 'View'],
            ['Active', 'Open dispute, under review', 'Urgent', 'View (dispute in progress)'],
            ['Closed', 'Terminated by You, buffer complete', '—', 'View (read-only)'],
          ],
          totalNote: '34 states documented in the full matrix',
        },
        {
          type: 'statRow',
          stats: [
            { value: '5', label: 'rejected patterns, each documented with reason' },
            { value: '34 rows across 4 tabs', label: 'state matrix' },
          ],
        },
        {
          type: 'image',
          frame: 'none',
          src: '/src/assets/work/transporter/state-matrix.png',
          alt: 'Row-state matrix table — 34 states across 4 lifecycle tabs',
          placeholder: true,
        },
      ],
    },

    // ── STEP 07 ───────────────────────────────────────────────────────────
    {
      id: 'prototype',
      step: 7,
      kicker: 'Prototype',
      navLabel: 'I judged my own',
      ghost: '2.8',
      title: 'I scored my own screens 2.8 out of 5 before anyone else could.',
      blocks: [
        {
          type: 'text',
          body: "Two artifacts carried the interaction design: hi-fi screens in Figma (the visual source of truth — 130+ screens across the two export sets) and a single-file HTML prototype, ~1,450 lines of vanilla JS with no framework and no build step, driven entirely by the 34-row state matrix.\n\nThe prototype exists because tag-visibility rules, chip auto-hide logic, and banner conditions are behavioral claims — a static mock can't prove that switching to the Below Target chip hides the now-redundant performance tags, or that the Disputes chip disappears when its last dispute resolves.",
        },
        {
          type: 'text',
          body: "Before handoff I ran the screen set through a judge-mode review against the locked spec, WCAG 2.1 AA, and the persona — scoring my own work as a hostile reviewer would. It scored **2.8/5**: strong skeleton, not ship-ready.\n\nThe review catalogued **27 issues** across P0/P1/P2, written into ADR-003 so none could be quietly forgotten.\n\nThe seven P0 ship-blockers included counts that disagreed across cards, tabs, and chips on the same screen; a duplicated sub-metric where Disputes should have been; Reject and Raise Dispute buttons leaking onto the view-only Upcoming detail; the confetti dispute-success modal; and Closed detail views that showed a bare contract card with no closure reason, timestamp, or next step.",
        },
        {
          type: 'text',
          body: 'The prototype then went in front of transporters: a moderated, think-aloud usability test in Hindi — 6–8 participants, literacy-mixed, 45–60 minutes each, 8 task scenarios from "find and accept a new contract" to "this contract was terminated — can you still run trips?", with per-task timing, unaided-success scoring, and verbatim confusion quotes. [UT-FINDINGS: pending from Pranita]',
        },
        {
          type: 'statRow',
          stats: [
            { value: '2.8/5 · 27 issues · 7 P0', label: 'judge-mode review' },
            { value: '~1,450 lines, single file, no framework', label: 'prototype' },
            { value: '8 tasks · 6–8 participants · Hindi, think-aloud', label: 'UT protocol' },
          ],
        },
        {
          type: 'prototype',
          slug: 'transporter',
          title: 'Transporter Contract Management — live prototype',
          note: 'Driven by the 34-row state matrix. Chip auto-hide logic and tag-visibility rules are live — switch to Below Target and the redundant performance tag disappears from every row.',
        },
        {
          type: 'image',
          frame: 'browser',
          src: '/src/assets/work/transporter/judge-mode-issues.png',
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
      kicker: 'Business Aspects',
      navLabel: 'What it protects',
      ghost: 'SLA',
      title: 'A late accept is a breach, so urgency had to be a deadline, not a mood.',
      blocks: [
        {
          type: 'text',
          body: "The panel's business case rests on three levers.\n\n**SLA protection.** A pending contract that expires unanswered is a route Valmo has to re-source.\n\nThe deadline-based urgency model (≤48h), the auto-selected Urgent chip, and the \"Reminder from Valmo\" banner exist to compress response time on exactly the contracts where a delayed accept becomes an SLA breach.\n\nContracts that still expire unanswered get an honest closure label — \"No Response,\" not \"Auto rejected\" — because mislabelling the system's action as the user's erodes the trust the whole panel depends on.",
        },
        {
          type: 'text',
          body: "**Avoidable-rejection reduction.** A rejection costs Valmo a re-sourcing cycle and costs the transporter a contract-length earning stream.\n\nThe reject warning surfaces both — the full earning loss (a lakh-plus figure on a typical contract{*}) and the performance-rating consequence — before the decision commits.\n\nThe usability test probed this directly: \"What does the earning-loss figure mean to you — would you still reject?\" The point is not to block rejection; it is to make sure no transporter rejects a contract without understanding its price. [UT-FINDINGS: pending from Pranita]",
        },
        {
          type: 'text',
          body: "**Support-call deflection.** Every flow that previously required a phone call — what's new, why was this closed, raising a rate dispute, when a terminated contract actually stops — has a self-serve path with reason, timestamp, and next action attached.\n\nThe trade-offs were accepted knowingly. Three ADRs' worth of locked constraints slow future bolt-ons, because any new action must fit \"one primary CTA per row\". The passcode gate adds a session-entry step.\n\nAnd full state coverage — empty, loading and error on every surface — is real engineering cost paid up front, to keep the screen from ever contradicting itself in front of a literal reader.",
        },
        {
          type: 'statRow',
          stats: [
            { value: '3 ADRs, 13+ decisions, 6-term vocabulary', label: 'decision record' },
          ],
        },
      ],
    },
  ],

  spotlights: [
    {
      decision:
        'Chips are named views with an always-visible "All" fallback — action chips vanish at zero count.',
      rejected:
        'Conventional filter toggles — including zero-count chips and filter states with no labelled escape.',
      why: 'A literal reader treats "Disputes (0)" as a fact and an empty filtered table as a broken page. Every chip is a named view with a count; action chips vanish at zero; the "All" chip never does. The user can always answer "show me everything" without understanding the filter model. (ADR-001 §1–2.)',
    },
    {
      decision:
        'Hide the tag that matches the active chip — inside the Below Target view, the "Below Target" row tag disappears.',
      rejected:
        "Showing every row's full tag set in every view — the standard \"more information is safer\" table pattern.",
      why: 'Inside the Below Target view, a "Below Target" tag on every row is pure redundancy — and for a slow reader, redundancy is cost, not reassurance. Hiding the implied tag leaves only the tags that add information, cutting worst-case stacks from 3+ to 2. The rule is mechanical enough to verify against all 34 matrix rows.',
    },
    {
      decision:
        'Deadline-based urgency (≤48h), not arrival-based — no "New Contracts" chip.',
      rejected:
        'A "New Contracts" chip — the default recency model in every inbox-shaped tool.',
      why: "Contracts arrive in one monthly batch, so on batch day everything is \"new\" and the distinction carries zero signal. The only question the transporter acts on is \"respond now or later,\" which is a property of the deadline, not the arrival. Urgent = deadline within 48 hours, colour-graded red/amber/grey by proximity. (ADR-001 §2.)",
    },
    {
      decision:
        'Exactly one primary CTA per row — Pending gets Accept (filled) with Reject demoted to a text link; Upcoming and Closed get View only.',
      rejected:
        'Per-row action clusters — Assign Now on Upcoming, Raise Dispute buttons alongside View, the standard ops-tool action column.',
      why: 'Two buttons of equal weight is a decision the persona shouldn\'t have to make on every row. My judge-mode review caught this rule being violated on the Upcoming detail screen — Reject and Raise Dispute had crept back in — and removing them was P0 #3. (ADR-001 §5, ADR-003 P0.)',
    },
    {
      decision:
        'Show the economics before allowing rejection — earning loss plus performance-rating impact, before the decision commits.',
      rejected:
        'A bare confirm dialog ("Are you sure?") — and, at the other extreme, a dark-pattern guilt screen.',
      why: "Rejecting a contract forfeits a contract-length earning stream — a lakh-plus figure on a typical contract — and affects the transporter's performance rating. A user who fears the screen will click through a vague confirm; a user shown the actual number makes an informed call. (ADR-003 P1 #13; UT Task 3.)",
    },
  ],

  reflections: [
    {
      title: 'The 2.8/5 I gave my own screens is the most useful number here, and the least comfortable.',
      body: 'The structural thinking was done — three ADRs, a locked vocabulary, a 34-row matrix — and the screens still reached review with counts that contradicted each other on one viewport and a confetti animation on a grievance flow.',
    },
    {
      title: 'Spec discipline and screen discipline are different skills.',
      body: 'Rules I had written myself were violated in my own Figma files within a day. That is why the judge-mode pass is now a standing gate in my process rather than a one-off.',
    },
    {
      title: 'Four lifecycle tabs may be one too many for this user.',
      body: 'ADR-003 raised it and deferred it. The honest answer waits on usability-test evidence, not on my preference.',
    },
    {
      title: 'Cutting features is easy. Writing down why is the discipline.',
      body: 'A recorded reason is what stops the next iteration quietly adding it back.',
    },
  ],

  next: {
    slug: 'placement-multi-origin',
    title: 'Placement & Assignment — the Multi-Origin Route Builder',
    code: 'PLC-05',
  },
}
