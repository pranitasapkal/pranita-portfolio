/**
 * TPN-01 — The Transporter Panel
 * Source of truth for every UI claim: Figma- Assignment module/ (live version). The export holds
 * 182 files; the case claims 154 — the difference is 8 artboard fragments, 11 explicit copies
 * ((2)/(alt)/(v2)), 6 screens filed under the wrong tab, and 3 third-party vendor login screens.
 * Recount with the rule set in tasks/todo.md before changing any screen number.
 * Narrative source docs: Transporter Panel (1).pdf, Valmo Transporter Panel.pdf,
 * Transporter Payout and Negotiation (10).pdf — see tasks/transporter-panel-sot-map.md.
 * Structure + evidence record: content/case-studies/00-transporter-panel.md.
 *
 * Structure and length follow ADR-005 — the reference is smritidesign.work/work/ai-commentary,
 * measured at 1,401 words carrying 123 short labelled elements against 42 paragraphs. Meaning
 * lives in captions, matrices, stat tiles and named decisions; prose only connects them. This
 * file is the worked example the other four cases are cut onto.
 *
 * Two rules do most of the work here. One claim has one home — if a caption or a matrix cell
 * shows it, the paragraph above does not repeat it. And a decision is argued once: where a
 * spotlight makes the case, the chapter does not re-make it. Checked with
 * `npm run count:copy TPN` and `npm run check:facts check TPN`.
 *
 * All programme-level metrics are fuzzed per content/fuzzing-map.json; nothing here claims a
 * system-wide number as this module's own outcome.
 * Screens exported by scripts/export-transporter-shots.mjs (personal data on the sample
 * challans redacted); diagrams by scripts/gen-transporter-diagrams.mjs.
 */
import type { CaseStudy } from '../types'
import { summaries } from './summaries'

export const transporterPanel: CaseStudy = {
  ...summaries['transporter-panel'],
  title: 'The Transporter Panel',
  oneLiner:
    'Every trip ran on a chat thread and got paid two months later. I designed the panel that replaced it — and its hardest screen is the one where a man agrees, irreversibly, to what he’s owed.',
  // Debo-reference structure (2026-08-16): sticky section nav, white page, mono
  // section eyebrows. The editorial long-scroll was this page's previous shell.
  layout: 'standard',
  eyebrow: 'VALMO (MEESHO) · TRANSPORTER-FACING · LIVE',
  domain: 'Logistics ops tooling',
  scale: '5 lifecycle states · 154 unique screens',
  heroShot: {
    src: '/work/transporter-panel/pending-default.png',
    alt: 'The Transporter Panel on the Pending tab — five lifecycle tabs, three summary cards, the trips table',
  },
  meta: {
    role: 'Product Designer — sole designer, end to end',
    team: 'Valmo Transportation (Meesho) — with PM, FinOps and engineering counterparts',
    timeline: 'Sept – Nov 2025 · design review Nov 2025',
    platform: 'Desktop web panel (transporter-facing) — live',
    skills: ['Product Design', 'UX Research', 'Information Architecture', 'Content Design'],
  },
  tldr: {
    problem:
      'Trip assignment ran on WhatsApp, which breaks past roughly 20 trips a day while real transporters run 20–80. Payouts were reconciled by hand, so he saw his own data months later — a third of it already wrong.',
    outcomes: [
      'A five-state panel replacing the chat thread — 154 unique screens, 92 of them on Completed, where the money and the risk are',
      'Confirmation as the payout trigger: the panel, not his private spreadsheet, becomes the record his payment is built from',
      'Every irreversible action names its cost first — Reject lists three consequences above the reason field',
    ],
    stats: [{ value: '154' }, { value: '5 states' }, { value: '20–80/day', fuzzed: true }],
    summary:
      'Valmo’s transporter-facing trip module — where a fleet owner assigns a vehicle, accepts before a deadline, tracks the run, then confirms or disputes his earnings.',
  },

  chapters: [
    // ── 01 ────────────────────────────────────────────────────────────────────
    {
      id: 'problem-understanding',
      step: 1,
      navLabel: 'The Problem',
      ghost: 'CHAT',
      eyebrow: 'THE PROBLEM',
      title: 'Every trip he ran existed as a message in a chat thread.',
      blocks: [
        {
          type: 'text',
          body: 'Monday morning. A fleet owner with forty trucks on the road opens WhatsApp to work out which of last night’s trips still need a vehicle.\n\nThe thread is his only record.',
        },
        {
          type: 'text',
          body: 'Valmo — Meesho’s transportation arm — books long-distance truck runs with independent transporters. Their life with it has three parts: getting set up, running trips, getting paid. This is the middle one.',
        },
        {
          type: 'quote',
          text: 'I don’t know when and how much I’ll be paid.',
          attribution: 'the transporter’s own summary, in the requirements',
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
          alt: 'Before the panel: one trip held in five places — the WhatsApp thread, the placement sheet, his own spreadsheet, the email chain, and FinOps matching records by hand. None of them agreed, and he could see only his own.',
        },
        {
          // The reference's problem device (ADR-007): his questions around the
          // illustration, each with the persona point that explains it beneath.
          // Composition + the seven questions locked with Manav 2026-08-16 (his
          // mock); facts unchanged from the problemTabs block this replaces.
          type: 'problemCards',
          illustration: '/work/transporter-panel/problem-questions.png',
          illustrationAlt:
            'A fleet owner, hand over his face — the nightly reconciliation mood',
          composite: true,
          items: [
            {
              quote: 'Which of last night’s trips still needs a truck?',
              context: 'He runs 20–80 trips a day. The thread stops being a record at twenty.',
            },
            {
              quote: 'What is the ETA of this trip?',
              context: 'He owns the trucks. He is never on the truck — the screen is all he sees of a run.',
            },
            {
              quote: 'Why is the vehicle number wrong again?',
              context: 'Retyped at every depot. One in three trips carried an error.',
            },
            {
              quote: 'Did Valmo even acknowledge this trip?',
              context: 'Nothing led back to a record. He invoiced from his own spreadsheet.',
            },
            {
              quote: 'When and how much will I be paid?',
              context: 'His words, verbatim. The spreadsheet is the only record he trusts.',
            },
            {
              quote: 'Who do I call about this payment?',
              context: 'One person he happened to know. Busy contact, stalled payout.',
            },
            {
              quote: 'Where do I raise the dispute about this trip?',
              context: 'By phone, uncategorised — if he knew whom to call.',
            },
          ],
          punchline:
            'Nobody refused to pay him. The records just never agreed on what to pay.',
        },
        {
          type: 'text',
          body: 'Behind the questions, one machine. An area manager’s plan reached the system by hand — retyped at every depot by temporary hires measured on compliance targets. Wrong numbers, wrong transporter, missing GPS — and the biggest class, return journeys booked as two separate one-way trips.\n\nThe interim answer was a WhatsApp assignment module — trips pushed as messages to accept, reject or update. It worked for the right reason: data ownership moved to whoever’s payout depended on it. It could not survive a scroll.\n\nWhatsApp stayed on as a notification channel; the panel became the record.',
        },
        // The pending-default screenshot that closed this chapter now lives in the
        // hero mockup — one image, one home.
      ],
    },

    // ── 02 ────────────────────────────────────────────────────────────────────
    {
      id: 'objective',
      step: 2,
      navLabel: 'Objective',
      ghost: 'AGREE',
      eyebrow: 'OBJECTIVE',
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
          body: 'The answer is a button called Confirm Details. He agrees on screen that the route, vehicle and earnings are right, and the invoice generates from system data.\n\nA payout not gated by a manual match needs exactly that.',
        },
        {
          type: 'wordList',
          title: 'Three goals, and the bar I set against each',
          items: [
            { word: 'Fewer trips carrying wrong data', note: 'Vehicle and driver confirmed before placement.' },
            { word: 'One clear owner for that data', note: 'The person whose payout depends on it.' },
            { word: 'One place to work', note: 'Instead of a chat thread and a spreadsheet.' },
          ],
          highlight: 1,
        },
        {
          type: 'wordList',
          title: 'And three rules the shipped screens are built against',
          items: [
            {
              word: 'An absence is a value',
              note: 'An empty earnings cell reads as anxiety, so every one got a name.',
            },
            { word: 'Consequence before input', note: 'Stated above the field that commits it.' },
            { word: 'Hindi where money is', note: 'On the money banners and every dispute category. Not on filter labels.' },
          ],
          highlight: 0,
        },
        {
          type: 'heroStats',
          items: [
            {
              value: '13',
              label: 'dispute states designed',
              sub: 'A claim never dead-ends at "submitted"',
            },
            {
              value: '6',
              label: 'failure states on the money tab',
              sub: 'Loading · error · no data · empty · upload failed · dispute failed',
            },
            {
              value: '4',
              label: 'urgency bands, colour and text',
              sub: 'Colour plus text, so it survives a squint and a scan',
            },
          ],
        },
      ],
    },

    // ── 03 ────────────────────────────────────────────────────────────────────
    {
      id: 'user-persona',
      step: 3,
      navLabel: 'Research',
      ghost: 'OWNER',
      eyebrow: 'RESEARCH',
      title: 'He owns the trucks. He is never on the truck.',
      blocks: [
        {
          type: 'text',
          body: 'Not the driver’s phone. A desktop panel for the man who owns the trucks, because the work is bulk — a night’s trips, a month’s earnings.',
        },
        {
          type: 'wordList',
          title: 'How I found this out',
          items: [
            { word: 'I talked to them', note: '20\u201330 transporters and their points of contact, in person and on calls.' },
            {
              word: 'I read the complaints',
              note: 'The dispute ticket log, grouped by what people were actually angry about.',
            },
            {
              word: 'I watched the old thing work',
              note: 'The WhatsApp assignment module, in use, before we replaced it.',
            },
          ],
        },
        {
          type: 'text',
          body: 'The ticket log settled one thing early: the overwhelming majority of complaints were about the rate, not the service. Hence these seven categories.',
        },
        {
          type: 'researchDeck',
          title: 'On the ground',
          note: 'I went to the sort centres and watched the handover happen — the paperwork, the phone calls, the moment a vehicle number gets typed. Then I sat with transporters, in person and on calls, and asked them to walk me through their last week.',
          items: [
            {
              alt: 'At a sort centre during the night dispatch window',
              caption: 'Watching a dispatch get recorded',
              place: 'Sort centre',
            },
            {
              alt: 'The paper challan a driver carries, photographed on the desk',
              caption: 'The challan, where the Trip ID actually lives',
              place: 'Sort centre',
            },
            {
              alt: 'A transporter showing his own spreadsheet of trips and expected payments',
              caption: 'His spreadsheet — the record he actually trusted',
              place: 'In person',
            },
            {
              alt: 'The WhatsApp assignment thread open on a transporter phone',
              caption: 'The thread the panel had to replace',
              place: 'In person',
            },
            {
              alt: 'A remote interview session with a fleet owner',
              caption: 'Walking through a week of trips, call by call',
              place: 'Virtual',
            },
            {
              alt: 'Notes and affinity clusters from the interview rounds',
              caption: 'Where the eight findings came from',
              place: 'Synthesis',
            },
          ],
        },
        {
          type: 'insightNotes',
          title: 'Three things he never asked for, that changed the screens',
          notes: [
            'He reads English slowly, and decides anything consequential in Hindi',
            'He trusts the screen literally — a zero is a fact about his business',
            'He works from paper; the challan — the paper trip slip — carries the Trip ID',
          ],
        },
        {
          type: 'text',
          body: 'After the field work, the desk work: I looked at how the platforms running comparable fleets put trips and money in front of a transporter.',
        },
        {
          // DRAFT — competitor rows pending Pranita's fact-check before publish
          // (public sources only; no internal knowledge of these platforms).
          type: 'matrix',
          title: 'What comparable platforms give a transporter',
          columns: ['Platform', 'What its transporter-facing tool covers', 'What that left open'],
          rows: [
            [
              'Amazon Relay',
              'A carrier portal and app — load board, trip status, settlements in one account',
              'Built for literate, English-first fleet back offices',
            ],
            [
              'Flipkart',
              'Transport partners run on internal vendor portals; nothing trip-level is public',
              'No public evidence of a per-trip money view for the fleet owner',
            ],
            [
              'Delhivery',
              'Partner and fleet apps — trip assignment, proof of delivery, driver-first',
              'The owner sees operations; payout agreement stays offline',
            ],
            [
              'Swiggy',
              'A delivery-partner app — gig onboarding, shift earnings for the rider',
              'Individual-rider model; no fleet-owner bulk view at all',
            ],
          ],
          totalNote:
            'In what these platforms show publicly, none puts the fleet owner’s payout agreement on a screen — the trip is tracked, the money is announced. That gap is the panel’s whole thesis.',
        },
        {
          type: 'matrix',
          title: 'What transporters asked for, and what it became',
          columns: ['They asked for', 'What it became'],
          rows: [
            ['One dashboard for all trip types, status at route level', 'Five lifecycle tabs, three summary cards'],
            ['Recorded acknowledgment instead of a verbal yes', 'Accept, then Confirm Details — timestamped, and shown back to him'],
            ['Rate cards and estimated cost upfront', 'Expected Earnings, with its 001-RFQ-00944 source, from Pending onward'],
            ['Real-time payout tracking', 'The dispute deadline and the payment status, stated in the row itself'],
            ['Separate access for the owner and his staff, so rates stay private', 'Not in this release. Named in the gaps.'],
          ],
          totalNote:
            'The asks shaped the structure. The three observations shaped the screens — Hindi where he risks money, a disabled button showing its precondition, a form showing him his own paper.',
        },
      ],
    },

    // ── 04 ────────────────────────────────────────────────────────────────────
    {
      id: 'user-flow',
      step: 4,
      navLabel: 'User Flow',
      ghost: 'RISK',
      eyebrow: 'USER FLOW',
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
          type: 'text',
          body: 'Assign and accept. A pending row shows Assign Vehicle and Assign Driver empty, Accept disabled. Fill both and it turns solid — the button’s state is the instruction. Once staffed, Update stays disabled until something changes.\n\nEvery deadline counts down to placement time — the hour the loaded vehicle must be at the depot. Miss it without accepting and the trip auto-rejects.',
        },
        {
          type: 'challengeSolution',
          index: 'Problem 1',
          problem: {
            title: 'Rejecting a trip looked free',
            body: 'The flow opened with a reason dropdown. Nothing said what rejecting costs him, and the costs are real.',
          },
          fix: {
            title: 'Name the three costs, then ask why',
            body: 'It leads with "This action cannot be undone and may result in": cancellation fees, impact on performance ratings, loss of scheduled earnings. Only then does it ask why.',
          },
          effect:
            'Rejections persist on Cancelled with the reason attached — the conversation happens once.',
          image: {
            src: '/work/transporter-panel/reject-consequences.png',
            alt: 'Reject Trip modal listing three consequences above the reason dropdown',
          },
        },
        {
          type: 'text',
          body: 'Track. In-Transit swaps the action column for Live Updates — "40km to NDSL New Delhi Hub" with a signal, "-" without, plus an amber No GPS Present chip.\n\nA missing tracker is stated, not hidden behind a stale position, and the route panel spells out its own abbreviations rather than assuming them.',
        },
        {
          type: 'text',
          body: 'Each row shows its payment basis, its deadline — Dispute Window Open till 1 Apr — and two actions. Confirming flips it to "Confirmed by you on 1 Nov".\n\nA checkbox confirms a batch, carrying the same guard: "Trips already processed or with an active dispute will be skipped."',
        },
        {
          type: 'challengeSolution',
          index: 'Problem 2',
          problem: {
            title: 'Confirming could silently destroy a live claim',
            body: 'Confirmation freezes a trip for payout — data final, window closed. Reached from a routine-looking row, it can dismiss a dispute he is still waiting on.',
            quote: 'You won’t be able to raise it again, and payment will be based on current trip details.',
          },
          fix: {
            title: 'A full stop that names the loss',
            body: 'A modal naming what confirming destroys, Close visually dominant. Not a toast with undo — he may not notice it. Not a silent block — that teaches him the button is broken.',
          },
          effect:
            'He can still confirm a disputed trip — never without being told what it costs him.',
          image: {
            src: '/work/transporter-panel/confirm-active-dispute.png',
            alt: 'Confirm Trip & Dismiss Dispute modal over the Completed tab',
          },
        },
        {
          type: 'text',
          body: 'Raise a disagreement. Seven sub-categories, each with its Hindi underneath — Wrong trip amount (rate mismatch) / ट्रिप रेट गलत है.',
        },
        {
          type: 'image',
          frame: 'browser',
          src: '/work/transporter-panel/raise-dispute-form.png',
          alt: 'Raise Dispute form with seven bilingual sub-categories, English over Devanagari',
          caption: 'Not a toggle — both languages, permanently, on the highest-stakes form.',
        },
        {
          type: 'text',
          body: 'Tick one and the right side wakes up: a card per issue, asking what the panel says against what he says. ₹4,500/trip against his contracted rate; a 12ft vehicle against the 22ft he sent.',
        },
        {
          type: 'image',
          frame: 'browser',
          src: '/work/transporter-panel/raise-dispute-details.png',
          alt: 'Raise Dispute with all seven sub-categories ticked — the right panel shows one Dispute Details card per issue, each with a current and an expected value',
          caption: 'Nobody has to interpret a paragraph.',
        },
        {
          type: 'text',
          body: 'Report a missing trip. The form asks for a number he cannot look up — the trip never arrived. He has it on paper.\n\nOne guard matters more than the form: type a number that already exists and it refuses to file — "This trip isn’t missing!" — offering a View Trip link instead.',
        },
        {
          type: 'image',
          frame: 'browser',
          src: '/work/transporter-panel/missing-trip-challan.png',
          alt: 'Missing Trip form with two example challans below the Trip ID field, the ID outlined on each',
          caption:
            'Both challan layouts, the Trip ID boxed where it sits. Personal details on the samples are redacted here.',
        },
        {
          type: 'text',
          body: 'The ticket that never gets created is the best outcome that flow can have.',
        },
        {
          type: 'image',
          frame: 'browser',
          src: '/work/transporter-panel/disputes-list.png',
          alt: 'Dispute Management list with All, Open, Approved, Rejected and Cancelled tabs and a Last Updates column',
          caption:
            'The answer to "what happened to my complaint" — a status, a last update, and "Can be reopened till 14 Dec".',
        },
        {
          type: 'statRow',
          stats: [
            { value: '13', label: 'dispute lifecycle states, drawn to their terminal ends' },
          ],
        },
        {
          type: 'image',
          frame: 'none',
          src: '/work/transporter-panel/dg-confirm.png',
          alt: 'The confirm-or-dispute fork on Completed, with both guards called out',
          caption: 'The money screen, and the two paths that had to be guarded.',
        },
        {
          type: 'text',
          body: 'Both guards went in front of transporters in usability testing. A modal that reads as friction to a designer reads as an accusation to someone paid late before.',
        },
      ],
    },

    // ── 05 ────────────────────────────────────────────────────────────────────
    {
      id: 'prototype',
      step: 5,
      navLabel: 'Screens',
      ghost: '154',
      eyebrow: 'THE SCREENS',
      title: '154 screens, and 92 of them on the one tab that pays.',
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
          caption: 'Five records nobody could reconcile — five states anyone can read.',
        },
        {
          type: 'matrix',
          title: 'Screens per tab',
          columns: ['Tab', 'Screens', 'Share'],
          rows: [
            ['Pending Assignment', '26', '17%'],
            ['Upcoming', '23', '15%'],
            ['In-Transit', '6', '4%'],
            ['Completed', '92', '60%'],
            ['Cancelled', '7', '4%'],
          ],
          totalNote:
            '154 unique screens, after stripping duplicates and fragments from a 182-file export. The weight follows the risk: every failure state on Completed, the dispute lifecycle drawn to Partial Approved, Reopened and Reraise.',
        },
        {
          type: 'text',
          body: 'The bar was that every tab ships its full state set — loading, empty, error. Not met everywhere; the gap is named below.',
        },
      ],
    },

    // ── 06 ────────────────────────────────────────────────────────────────────
    {
      id: 'lo-fi-wireframes',
      step: 6,
      navLabel: 'Design Decisions',
      ghost: 'RULES',
      eyebrow: 'DESIGN DECISIONS',
      title: 'I wrote six rules for this table, then broke two of them on purpose.',
      blocks: [
        {
          type: 'wordList',
          title: 'Six rules for the Completed listing',
          items: [
            { word: 'Scan is horizontal', note: 'Leftmost → earnings → status → action.' },
            { word: 'Route, then vehicle, then earnings', note: 'He remembers a trip by route, rarely by number.' },
            { word: 'Six columns maximum', note: 'Past six, scanning degrades.' },
            { word: 'Earnings and Action stay right', note: 'Where every dense table he uses puts them.' },
            { word: 'Vehicle and driver must appear', note: 'A wrong vehicle entry is a dispute cause.' },
            { word: 'Listing is signal', note: 'The details page is depth.' },
          ],
        },
        {
          type: 'matrix',
          title: 'Two rules the shipped table overrules, and what it bought',
          columns: ['Rule', 'What shipped', 'Why it was worth it'],
          rows: [
            [
              'Trip number must not lead',
              'Trip Info leftmost, carrying the number over the vehicle',
              'A dispute is always quoted by number. Number over vehicle in one cell keeps his strongest identifier where the eye lands.',
            ],
            [
              'Six columns maximum',
              'Seven, plus a bulk-select checkbox',
              'The two over budget are Placement Time and Completed Time. "Time related issue / समय से जुड़ी दिक्कत" cannot be argued from one timestamp.',
            ],
          ],
          totalNote:
            'Six columns is the right ceiling for a scanning table and the wrong one for evidence — and Completed is evidence.',
        },
        {
          type: 'text',
          body: 'A third deviation, from a note outside the six. I had written that Raise Dispute belongs inside trip details; it ships in the row, beside Confirm Details.',
        },
        {
          type: 'text',
          body: 'A man who spots a wrong number should not open a detail page to say so.',
        },
        {
          type: 'rejected',
          items: [
            {
              pattern: 'A single unified Completed list with a mixed action column',
              reason: 'An action meaning "confirm this" on one row and "nothing to do" on the next reads as arbitrary.',
            },
            {
              pattern: 'Colour-only status',
              reason: 'Every signal is a coloured chip with text — Delayed by 1hr, On Time, No GPS Present, Assign by Today.',
            },
            {
              pattern: 'A disabled Raise Dispute button past the window',
              reason: 'The row states the rule instead of showing a dead control.',
            },
          ],
        },
        {
          type: 'statRow',
          stats: [
            { value: '6 written, 2 overruled', label: 'self-imposed table rules' },
            { value: '3', label: 'patterns rejected and replaced' },
          ],
        },
      ],
    },

    // ── 07 ────────────────────────────────────────────────────────────────────
    {
      id: 'information-architecture',
      step: 7,
      navLabel: 'Tab by Tab',
      ghost: 'SHAPE',
      eyebrow: 'TAB BY TAB',
      title: 'The action column is the tab’s thesis.',
      blocks: [
        {
          type: 'text',
          body: 'Five tabs in the order a trip moves. Above them, three summary cards, each carrying the number that sends him there.\n\nPending Assignment (10) with a red "2 Trip at risk" pill. In-Transit Trips (12) split On Time / Delayed. Completed split Pending Confirmation / Trips Under Dispute.',
        },
        {
          type: 'image',
          frame: 'none',
          src: '/work/transporter-panel/hierarchy-tree.png',
          alt: 'The five tabs under one root, each with its columns and its single action',
          caption: 'One root, five tabs, one action each.',
        },
        {
          type: 'screensGrid',
          cols: 2,
          items: [
            {
              src: '/work/transporter-panel/pending-default.png',
              alt: 'Pending Assignment tab — empty vehicle and driver pickers, Accept and Reject in the action column',
              caption: '01 · Pending — staff it, then Accept.',
            },
            {
              src: '/work/transporter-panel/upcoming-list.png',
              alt: 'Upcoming tab — vehicle and driver filled in, Update and Reject in the action column',
              caption: '02 · Upcoming — now editable: Update or Reject.',
            },
            {
              src: '/work/transporter-panel/in-transit.png',
              alt: 'In-Transit tab — Live Updates column where the action column would be',
              caption: '03 · In-Transit — Live Updates, no action column.',
            },
            {
              src: '/work/transporter-panel/completed-default.png',
              alt: 'Completed tab — four sub-pills and the Confirm Details / Raise Dispute pair on every row',
              caption: '04 · Completed — Confirm Details or Raise Dispute.',
            },
            {
              src: '/work/transporter-panel/cancelled-remarks.png',
              alt: 'Cancelled tab — Missed Earning column and the Remark the transporter gave',
              caption: '05 · Cancelled — Missed Earning, and his own Remark.',
            },
          ],
        },
        {
          type: 'image',
          frame: 'none',
          src: '/work/transporter-panel/dg-actions.png',
          alt: 'The action column read down all five tabs — Accept, Update, none, Confirm Details, none',
          caption: 'A column should disappear, not fill with dead buttons.',
        },
        {
          type: 'matrix',
          title: 'The vocabulary shifts with the state, because the column means a different thing',
          columns: ['Column', 'Pending / Upcoming', 'In-Transit', 'Completed', 'Cancelled'],
          rows: [
            ['Time', 'Placement Time', 'Departure Time', 'Placement + Completed Time', 'Placement Time'],
            ['Money', 'Expected Earnings', 'Expected Earnings', 'Total Earnings', 'Missed Earning'],
          ],
          totalNote:
            'Naming the last one Missed Earning rather than reusing Expected Earnings is the difference between a log and an explanation.',
        },
        {
          type: 'text',
          body: 'The biggest structural call was taking disagreements out of the trip — a dispute can be about a rate, a deduction, a bank account.\n\nSo Disputes became a top-level surface, tracked in one list. This release wires one entry point, from Completed; the structure lets others land later.',
        },
        {
          type: 'annotatedShot',
          src: '/work/transporter-panel/completed-default.png',
          alt: 'Completed tab with four sub-pills and the illustrated payments explainer',
          caption: 'The most structure, because the most risk.',
          notes: [
            {
              title: 'The pill worth money leads with the money',
              body: 'Sub-pills state value, not count: ten trips worth ₹37,500.',
            },
            {
              title: 'An explainer before a single row',
              body: '"What should I do for my Payments?" — which billing type he is, before he touches a row.',
            },
            {
              title: 'Every row shows what its money rests on',
              body: 'A contracted row shows its contract — Contract ID: 001-RFQ-00944. A trip booked without one shows Rate: ₹20/km instead, and its earnings cell says No RFQ Linked.',
            },
          ],
        },
      ],
    },

    // ── 08 ────────────────────────────────────────────────────────────────────
    {
      id: 'business-aspects',
      step: 8,
      navLabel: 'Impact',
      ghost: 'CHAIN',
      eyebrow: 'IMPACT',
      title: 'The panel is one link in a chain that ends in a payment.',
      blocks: [
        {
          type: 'text',
          body: 'Upstream, dispatch is now verified at the depot — a photo of the loaded vehicle, or a one-time code from the driver.\n\nSo the trip he confirms rests on physical proof, not a ticked checkbox — instead of finance setting money aside against numbers wrong a third of the time.',
        },
        {
          type: 'text',
          body: 'That chain decided the details. A dispute is a category and a trip number, because a structured complaint can be routed and measured.\n\nNo RFQ Linked is shown rather than suppressed: a trip with no contract behind it is the one disputed later.',
        },
        {
          type: 'text',
          body: 'Three signals hold this module accountable, each against a number above.',
        },
        {
          type: 'phaseCards',
          items: [
            {
              step: '01',
              title: 'Vehicle and driver confirmed before placement',
              body: 'Measured against a third of trips carrying an error.',
            },
            {
              step: '02',
              title: 'Missed assignments falling',
              body: 'Measured against a deadline he had to scroll a thread to find.',
            },
            {
              step: '03',
              title: 'Disputes arriving categorised, not by phone',
              body: 'Measured against months of reconciling by phone.',
            },
          ],
        },
        {
          type: 'text',
          body: 'The trade-off I took knowingly: this module never hides a bad number to keep the queue quiet. It surfaces more disagreement now — as evidence, not as a call two months later.',
        },
        {
          type: 'statRow',
          stats: [
            { value: '4', label: 'billing realities on one tab, told apart before he touches a row' },
          ],
        },
        {
          type: 'ndaNote',
          title: 'On the numbers I am not claiming',
          body: 'The headline improvements — data accuracy, payout turnaround, billing discounts — belong to the whole system-led trip programme. This panel contributes; it does not own them, so I claim none here.',
        },
      ],
    },
  ],

  spotlights: [
    {
      decision: 'Accept stays disabled until both vehicle and driver are assigned.',
      rejected: 'An always-enabled Accept that throws a validation error.',
      why: 'For a literal reader, an error after the fact reads as the system breaking. A disabled button beside two empty pickers makes the precondition physical.',
    },
    {
      decision: 'Trips with no contract keep Confirm Details / Raise Dispute; the two types that settle elsewhere get More info only.',
      rejected: 'Suppressing both actions there, since those rows have no contract ID to check against.',
      why: 'Those earnings are the least verifiable, so they most need a route to correction. The other two settle off this panel.',
    },
    {
      decision: 'Hindi printed under every dispute sub-category and inside both money banners, permanently.',
      rejected: 'A full Hindi locale switch for the panel.',
      why: 'A toggle makes him predict where he’ll struggle, and doubles the copy surface to serve four screens. Printing both costs vertical space.',
    },
  ],

  reflections: [
    {
      title: 'Whether he confirms in the window, or waits to be chased.',
      body: 'The model assumes he acts inside the dispute window. If he doesn’t, the panel moved the phone call rather than removed it.',
    },
    {
      title: 'Whether the guards actually stop the click, or just delay it.',
      body: 'Both modals were tested, not shipped on my argument alone. What I’d watch is the second month, once they stop being new.',
    },
    {
      title: 'Whether an empty cell with a name still generates a phone call.',
      body: 'No RFQ Linked. No GPS Present. As per existing Billing Process. Each replaced a blank people rang in about.',
    },
    {
      title: 'And three gaps I would rather name than round up.',
      body: 'No empty or loading state on Cancelled. Disputes raised only from Completed. Separate access for his own staff, not built yet.',
    },
  ],

  next: {
    slug: 'network-design-central',
    title: 'Network Design Central',
    code: 'NDC-02',
  },
}
