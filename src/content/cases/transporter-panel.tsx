/**
 * TPN-01 — The Transporter Panel
 * Source of truth for every UI claim: Figma- Assignment module/ (182 screens, live version).
 * Narrative source docs: Transporter Panel (1).pdf, Valmo Transporter Panel.pdf,
 * Transporter Payout and Negotiation (10).pdf — see tasks/transporter-panel-sot-map.md.
 * Prose version: content/case-studies/00-transporter-panel.md.
 *
 * Written to the ADR-004 length budget: ~750–900 words total, median paragraph 18–22 words,
 * nothing over 60. Evidence lives in blocks (matrix, wordList, annotatedShot, rejected),
 * not in paragraphs — that ratio is what the reference cases get right and the old draft did not.
 *
 * All programme-level metrics are fuzzed per content/fuzzing-map.json; nothing here claims a
 * system-wide number as this module's own outcome.
 * Screens exported by scripts/export-transporter-shots.mjs (challan region blurred — real
 * vendor/driver data); diagrams by scripts/gen-transporter-diagrams.mjs.
 */
import type { CaseStudy } from '../types'
import { summaries } from './summaries'

export const transporterPanel: CaseStudy = {
  ...summaries['transporter-panel'],
  title: 'The Transporter Panel',
  oneLiner:
    'Every trip ran on a chat thread and got paid two months later. I designed the panel that replaced both.',
  layout: 'editorial',
  eyebrow: 'VALMO (MEESHO) · TRANSPORTER-FACING · LIVE',
  domain: 'Logistics ops tooling',
  scale: '5 lifecycle states · 182 designed screens',
  meta: {
    role: 'Product Designer — sole designer, end to end',
    team: 'Valmo Transportation (Meesho) — with PM, FinOps and engineering',
    timeline: 'Sept – Nov 2025 · design review Nov 2025',
    platform: 'Desktop web panel (transporter-facing) — live',
    skills: ['Product Design', 'UX Research', 'Information Architecture', 'Content Design'],
  },
  tldr: {
    problem:
      'Trip assignment ran on WhatsApp, which breaks past about twenty trips a day. The transporters who matter run twenty to eighty. Payouts were reconciled by hand, over months.',
    outcomes: [
      'Replaced the chat thread with a five-state panel — 182 designed screens, 102 of them on the one tab where being wrong costs him money',
      'Made on-screen confirmation the payout trigger, which is what lets self-invoicing exist at all',
      'Every irreversible action names its cost before the field that commits it',
    ],
    stats: [{ value: '182' }, { value: '5 states' }, { value: '20→80', fuzzed: true }],
    summary:
      'The desktop panel where a fleet owner assigns a vehicle, accepts before a deadline, tracks the run, and finally confirms or disputes what he is owed.',
  },

  chapters: [
    // ── 01 ────────────────────────────────────────────────────────────────
    {
      id: 'problem-understanding',
      step: 1,
      kicker: 'Problem Understanding',
      navLabel: 'The chat thread',
      ghost: 'CHAT',
      title: 'Every trip he ran existed as a message in a chat thread.',
      blocks: [
        {
          type: 'text',
          body: 'Monday morning. A fleet owner with forty trucks on the road opens WhatsApp to work out which of last night’s trips still need a vehicle. That thread is his only record.',
        },
        {
          type: 'text',
          body: 'Valmo is Meesho’s logistics arm. It places long-haul trips with independent Indian fleet owners — the people who own the trucks. After placement, the entire lifecycle ran on chat.',
        },
        {
          type: 'quote',
          text: "I don't know when and how much I'll be paid.",
          attribution: 'a transporter, quoted in the requirements',
        },
        {
          type: 'heroStats',
          items: [
            { value: '20–80', label: 'trips a day he actually runs', sub: 'The chat flow degrades past about twenty' },
            { value: '1 in 3', label: 'trips carrying a data error', sub: 'Before they ever reached finance' },
            { value: 'months', label: 'to reconcile a payout', sub: 'Two records matched by hand' },
          ],
        },
        {
          type: 'image',
          frame: 'none',
          src: '/work/transporter-panel/before-chaos.png',
          alt: 'The pre-panel state — one trip held in five places that never agreed',
          caption: 'One trip, five records, and he could see only his own.',
        },
        {
          type: 'problemTabs',
          items: [
            {
              label: 'Bad data going in',
              body: 'Trips were typed in from placement sheets kept by sort-centre staff, who are measured on departures, not accuracy. A number typed under pressure is good enough to dispatch and wrong enough to break the payout.',
            },
            {
              label: 'No visibility coming out',
              body: 'He could not see which trips Valmo had acknowledged, so he kept a private spreadsheet to invoice from. Finance matched the two by hand. Disagreements happened over email and got lost.',
            },
            {
              label: 'A ceiling at twenty trips',
              body: 'The interim fix was a WhatsApp assignment module, and it worked for the right reason: it moved data ownership to the person whose payout depends on it. It could not scale past a scroll.',
            },
          ],
        },
        {
          type: 'text',
          body: 'That ceiling is the brief. Everything a chat thread cannot hold — a sortable list, a bulk action, a dispute with evidence attached — is what the panel exists to do.',
        },
      ],
    },

    // ── 02 ────────────────────────────────────────────────────────────────
    {
      id: 'objective',
      step: 2,
      kicker: 'Objective',
      navLabel: 'The one sentence',
      ghost: 'AGREE',
      title: 'Confirmation had to become the payout trigger.',
      blocks: [
        {
          type: 'statementBand',
          eyebrow: 'The problem, stated',
          statement:
            'How might a transporter agree — on the record, without a phone call — that a trip really ran the way the system says it did?',
        },
        {
          type: 'text',
          body: 'If he agrees on screen that the route, vehicle and earnings are right, the invoice can be generated from system data rather than rebuilt from his spreadsheet. Automated payouts need exactly that.',
        },
        {
          type: 'flow',
          steps: [
            'Get a trip staffed and accepted before its deadline — and know what rejecting it costs',
            'Change a vehicle or driver without silently losing the change',
            "Know where a running truck is — including when the system genuinely doesn't know",
            'Confirm or dispute the earnings — and never destroy a live claim by accident',
          ],
        },
        {
          type: 'wordList',
          title: 'Three rules I held myself to',
          items: [
            {
              word: 'No blank cells',
              note: 'An absence is always a labelled value. Research said a missing number reads as anxiety, not as "pending".',
            },
            {
              word: 'Consequence before input',
              note: 'Any irreversible action states its cost above the field that commits it.',
            },
            {
              word: 'Hindi where the money is',
              note: 'Printed inline on the four screens that decide money. Not on filter labels.',
            },
          ],
          highlight: 0,
        },
      ],
    },

    // ── 03 ────────────────────────────────────────────────────────────────
    {
      id: 'user-persona',
      step: 3,
      kicker: 'User Persona',
      navLabel: 'Who I designed for',
      ghost: 'OWNER',
      title: 'He owns the trucks. He is never on the truck.',
      blocks: [
        {
          type: 'text',
          body: 'This is not the driver’s phone. It is a desktop panel for a fleet operator running dozens of trips at once, who needs a dense table because he compares rows rather than reads them.',
        },
        {
          type: 'insightNotes',
          title: 'What research surfaced',
          notes: [
            'He wants one dashboard for every trip type, with status at route level',
            'A verbal yes is worth nothing — he wants the acknowledgment recorded',
            'He wants the rate and the expected earning before he accepts, not after',
            'He wants to know when he gets paid, not just how much',
            'He wants to hide the money detail from his own point of contact',
            'He reads English slowly and decides anything consequential in Hindi',
            'He trusts the screen literally — a zero is a fact about his business',
            'He works from paper; the challan in his hand carries the Trip ID',
          ],
        },
        {
          type: 'matrix',
          title: 'What he asked for, and what it became',
          columns: ['He asked for', 'What shipped'],
          rows: [
            ['One dashboard, status at route level', 'Five lifecycle tabs plus three summary cards'],
            ['Recorded acknowledgment, not a verbal yes', 'Accept and Confirm Details, both timestamped and read back'],
            ['Rates and expected cost upfront', 'Expected Earnings with its contract ID, from the first tab onward'],
            ['Real-time payout tracking', '"Dispute Window Open till 1 Apr · Payment will be initiated"'],
            ['Hide rates from my point of contact', 'Not in this release. Named in the gaps.'],
          ],
        },
        {
          type: 'text',
          body: 'The last three changed concrete screens. Because he works from paper, the Missing Trip form shows photographs of a real challan with the ID box outlined, rather than describing the format.',
        },
        {
          type: 'image',
          frame: 'browser',
          src: '/work/transporter-panel/missing-trip-challan.png',
          alt: 'Missing Trip form showing challan photographs with the Trip ID outlined in green',
          caption: 'Recognition over recall, using the paper he is already holding.',
        },
      ],
    },

    // ── 04 ────────────────────────────────────────────────────────────────
    {
      id: 'information-architecture',
      step: 4,
      kicker: 'Information Architecture',
      navLabel: 'The right-hand edge',
      ghost: 'SHAPE',
      title: "The action column is the tab's thesis.",
      blocks: [
        {
          type: 'text',
          body: 'Five tabs, ordered the way a trip actually moves. Read only the right-hand edge and the lifecycle explains itself: Accept, then Update, then nothing, then Confirm, then nothing again.',
        },
        {
          type: 'image',
          frame: 'none',
          src: '/work/transporter-panel/hierarchy-tree.png',
          alt: 'The five tabs under one root, each with its columns and its single action',
          caption: 'Completed carries the most structure because it carries the most risk.',
        },
        {
          type: 'text',
          body: 'In-Transit and Cancelled have no action column at all. I would rather a column disappear than sit there full of disabled buttons.',
        },
        {
          type: 'matrix',
          title: 'The column renames itself when its meaning changes',
          columns: ['Column', 'Pending / Upcoming', 'In-Transit', 'Completed', 'Cancelled'],
          rows: [
            ['Time', 'Placement Time', 'Departure Time', 'Placement + Completed', 'Placement Time'],
            ['Money', 'Expected Earnings', 'Expected Earnings', 'Total Earnings', 'Missed Earning'],
          ],
          totalNote:
            'Calling the last one Missed Earning rather than reusing Expected Earnings is the difference between a log and an explanation.',
        },
        {
          type: 'annotatedShot',
          src: '/work/transporter-panel/completed-default.png',
          alt: 'The Completed tab with four sub-pills and the illustrated payments explainer',
          caption: 'Completed — four billing realities in one table.',
          notes: [
            {
              title: 'The pill worth money leads with the money',
              body: 'Sub-pills state value, not just count: Pending Confirmation shows ten trips worth ₹37,500.',
            },
            {
              title: 'An explainer before a single row',
              body: '"What should I do for my Payments?" tells him which of the four billing types he is before he touches anything.',
            },
            {
              title: 'Two settlement paths, kept visibly apart',
              body: 'SC-SC and FM Carting settle elsewhere, so those rows say so in words and offer More info instead of a dead button.',
            },
          ],
        },
        {
          type: 'text',
          body: 'The biggest structural call was taking disputes out of the trip. A dispute can be about a rate card, a tax deduction, a bank account — none of which is a trip. So Disputes became its own surface.',
        },
      ],
    },

    // ── 05 ────────────────────────────────────────────────────────────────
    {
      id: 'user-flow',
      step: 5,
      kicker: 'User Flow',
      navLabel: 'Where money moves',
      ghost: 'RISK',
      title: 'Two screens can cost him money in a single click.',
      blocks: [
        {
          type: 'image',
          frame: 'none',
          src: '/work/transporter-panel/dg-lifecycle.png',
          alt: 'The five-state trip lifecycle with its three exception paths',
          caption: 'Five states, and the three ways a trip leaves the happy path.',
        },
        {
          type: 'challengeSolution',
          index: 'Problem 1',
          problem: {
            title: 'Rejecting a trip looked free',
            body: 'The reject flow opened with a reason dropdown. Nothing on screen said what rejecting actually costs him, and the costs are real.',
          },
          fix: {
            title: 'Name the three costs, then ask why',
            body: 'The modal leads with "This action cannot be undone and may result in": cancellation fees, a hit to his performance rating, lost scheduled earnings. Only underneath does it ask for a reason.',
          },
          effect:
            'A transporter who was always going to reject loses nothing. One who did not understand the cost finds out before he commits.',
          image: {
            src: '/work/transporter-panel/reject-consequences.png',
            alt: 'Reject Trip modal listing three consequences above the reason dropdown',
          },
        },
        {
          type: 'challengeSolution',
          index: 'Problem 2',
          problem: {
            title: 'Confirming could silently destroy a live claim',
            body: 'Confirmation freezes a trip for payout. Reached from a row that looks routine, it can dismiss an open dispute the transporter is still waiting on.',
            quote:
              "You won't be able to raise it again, and payment will be based on current trip details.",
          },
          fix: {
            title: 'A full stop that names the loss',
            body: 'Confirming a disputed trip raises a modal that states exactly what it destroys, with Close as the visually dominant option. No toast, no silent block.',
          },
          effect:
            'An undo toast assumes he notices it. Blocking silently teaches him the button is broken. Naming the loss is the only version that survives a literal reader.',
          image: {
            src: '/work/transporter-panel/confirm-active-dispute.png',
            alt: 'Confirm Trip & Dismiss Dispute modal over the Completed tab',
          },
        },
        {
          type: 'text',
          body: 'Disputes are structured rather than free-text: a category, a trip ID, seven sub-categories printed in English over Hindi. A routed dispute can be measured and answered. A phone call cannot.',
        },
        {
          type: 'image',
          frame: 'browser',
          src: '/work/transporter-panel/raise-dispute-form.png',
          alt: 'Raise Dispute form with seven bilingual sub-categories, English over Devanagari',
          caption: 'Not a language toggle — both languages, permanently, on the highest-stakes form.',
        },
      ],
    },

    // ── 06 ────────────────────────────────────────────────────────────────
    {
      id: 'lo-fi-wireframes',
      step: 6,
      kicker: 'Lo-fi Wireframes',
      navLabel: 'Rules I broke',
      ghost: 'RULES',
      title: 'I wrote six rules for this table, then broke two of them on purpose.',
      blocks: [
        {
          type: 'text',
          body: 'Before drawing the Completed listing I wrote down what it had to obey, because this is the screen where a layout mistake costs someone money.',
        },
        {
          type: 'wordList',
          title: 'Six rules for the listing table',
          items: [
            { word: 'Scanning is horizontal', note: 'Leftmost cell has to let him recognise the trip.' },
            { word: 'Route, then vehicle, then earnings', note: 'He almost never recognises a trip by its ID.' },
            { word: 'Six columns maximum', note: 'Past six, scanning degrades.' },
            { word: 'Earnings and action stay right', note: 'Universal table-scanning behaviour.' },
            { word: 'Vehicle and driver must appear', note: 'A wrong vehicle entry is a dispute cause.' },
            { word: 'Listing is signal', note: 'The details page is depth.' },
          ],
        },
        {
          type: 'text',
          body: 'Rule two says the Trip ID must not lead. It leads anyway, because a dispute is quoted by ID. I stacked the vehicle number into that same cell instead of reordering.',
        },
        {
          type: 'text',
          body: 'Rule three says six columns. It ships with seven, because a timing dispute cannot be checked from one timestamp. Six is the right ceiling for a scanning table, the wrong one for evidence.',
        },
        {
          type: 'text',
          body: 'The third break I would defend hardest. I had written that Raise Dispute belonged inside trip details. It ships in the row: friction there only suppresses the legitimate dispute.',
        },
        {
          type: 'rejected',
          items: [
            {
              pattern: 'A language toggle for the whole panel',
              reason:
                'It makes him choose a language before he knows which words he will struggle with, and doubles the copy surface. Bilingual inline on four screens is narrower and needs no decision.',
            },
            {
              pattern: 'One Completed list with a mixed action column',
              reason:
                'A table where the action means "confirm this" on one row and "nothing to do" on the next teaches a literal reader that the panel is arbitrary.',
            },
            {
              pattern: 'Actions revealed on hover',
              reason: 'A hover-revealed control is invisible to someone scanning for what to do next.',
            },
            {
              pattern: 'Colour-only status',
              reason: 'Every urgency and delay signal is a coloured chip carrying text as well.',
            },
            {
              pattern: 'A dead Raise Dispute button past the window',
              reason: 'The row states the rule instead — "Dispute Window Open till 1 Apr".',
            },
            {
              pattern: 'Blank cells',
              reason:
                'Replaced everywhere by a named absence: No RFQ Linked, No GPS Present, As per existing Billing Process.',
            },
          ],
        },
      ],
    },

    // ── 07 ────────────────────────────────────────────────────────────────
    {
      id: 'prototype',
      step: 7,
      kicker: 'Prototype',
      navLabel: 'What shipped',
      ghost: '182',
      title: '182 screens, and 102 of them on the one tab that pays.',
      blocks: [
        {
          type: 'beforeAfter',
          before: {
            src: '/work/transporter-panel/before-chaos.png',
            alt: 'The pre-panel state — one trip held across five disconnected records',
            label: 'Before',
          },
          after: {
            src: '/work/transporter-panel/pending-default.png',
            alt: 'The five-tab transporter panel with its Trip Management summary cards',
            label: 'After',
          },
          caption: 'Five records nobody could reconcile, replaced by five states anyone can read.',
        },
        {
          type: 'matrix',
          title: 'Where the file’s weight went',
          columns: ['Tab', 'Screens', 'Share'],
          rows: [
            ['Pending Assignment', '30', '16%'],
            ['Upcoming', '29', '16%'],
            ['In-Transit', '10', '6%'],
            ['Completed', '102', '56%'],
            ['Cancelled', '7', '4%'],
          ],
          totalNote:
            'Completed takes 56% of the file for one tab, because it is the only tab where being wrong costs him money he has already earned.',
        },
        {
          type: 'text',
          body: 'Completed is covered to its edges — loading, error, no data, upload failed, dispute failed, and thirteen dispute states including the awkward ones: Partial Approved, Reopened, Reraise.',
        },
        {
          type: 'text',
          body: 'It is not covered everywhere, and I would rather name that than round it up. Cancelled has no empty state and no loading state — the honest edge of this file.',
        },
      ],
    },

    // ── 08 ────────────────────────────────────────────────────────────────
    {
      id: 'business-aspects',
      step: 8,
      kicker: 'Business Aspects',
      navLabel: 'How we would know',
      ghost: 'CHAIN',
      title: 'The panel is one link in a chain that ends in a payment.',
      blocks: [
        {
          type: 'text',
          body: 'Accurate assignment data makes system-computed payouts possible; on-screen confirmation makes self-invoicing possible. Without the first, finance provisions against numbers that are wrong a third of the time.',
        },
        {
          type: 'phaseCards',
          items: [
            {
              step: '01',
              title: 'Vehicle and driver confirmed before placement',
              body: 'If this approaches universal, the data going into finance is finally the transporter’s own.',
            },
            {
              step: '02',
              title: 'Missed assignments falling',
              body: 'A deadline he can see should beat a deadline buried in a chat thread.',
            },
            {
              step: '03',
              title: 'Disputes arriving categorised, not by phone',
              body: 'A structured dispute can be routed, measured and answered against an SLA. A call to FinOps cannot.',
            },
          ],
        },
        {
          type: 'text',
          body: 'The trade-off I took knowingly: this panel never hides a bad number to keep the queue quiet. It surfaces more disagreement now, in exchange for disagreement that arrives as evidence.',
        },
        {
          type: 'ndaNote',
          title: 'On the numbers I am not claiming',
          body: 'The headline programme improvements — data accuracy, provisioning recovered, payout turnaround — belong to the whole system-led trip programme. This panel contributes to them; it does not own them, so I have claimed none of them here.',
        },
      ],
    },
  ],

  spotlights: [
    {
      decision:
        'Accept stays disabled until both vehicle and driver are assigned, and the row’s own empty pickers are the only instruction.',
      rejected: 'An always-enabled Accept that throws a validation error after the fact.',
      why: 'For a literal reader, an error after the fact reads as the system breaking. Two visibly empty pickers make the precondition physical — he sees what is missing without reading.',
    },
    {
      decision:
        'Adhoc rows keep Confirm Details and Raise Dispute against a per-kilometre rate.',
      rejected: 'Suppressing both actions on Adhoc because it has no contract ID to check against.',
      why: 'Adhoc is the billing type most likely to run without a linked contract, which makes those earnings the least verifiable. Suppressing the actions would strand the weakest paper trail.',
    },
  ],

  reflections: [
    {
      title: 'Effort belongs where the consequence is, not where the surface area is.',
      body: 'One tab holds more than half the screens. Not because Completed is visually complicated, but because it is the only tab where being wrong costs him money he has already earned.',
    },
    {
      title: 'A rule you never break was probably never load-bearing.',
      body: 'I wrote six constraints for the listing table and shipped a version that overrules two. Writing them down made each break cost something explicit, so the compromise was chosen rather than drifted into.',
    },
    {
      title: "An empty cell is a design decision you haven't made yet.",
      body: 'No RFQ Linked. No GPS Present. As per existing Billing Process. Each began as a blank space in a table, and each one, once named, stopped generating a phone call.',
    },
    {
      title: 'Three things are still open, and I would rather name them.',
      body: 'Cancelled has no empty or loading state. Disputes can only be raised from Completed, so a rate disagreement obvious at assignment time waits for the trip to finish. Role-based access, which transporters explicitly asked for, is not in this release.',
    },
  ],

  next: {
    slug: 'network-design-central',
    title: 'Network Design Central',
    code: 'NDC-02',
  },
}
