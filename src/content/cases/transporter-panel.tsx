/**
 * TPN-01 — The Transporter Panel
 * Source of truth for every UI claim: Figma- Assignment module/ (182 screens, live version).
 * Narrative source docs: Transporter Panel (1).pdf, Valmo Transporter Panel.pdf,
 * Transporter Payout and Negotiation (10).pdf — see tasks/transporter-panel-sot-map.md.
 * Structure + evidence record: content/case-studies/00-transporter-panel.md.
 *
 * Structure follows ADR-004 — claim titles, the process step in the kicker, evidence in blocks.
 * Depth is deliberate: this case argues from traced detail, so paragraphs stay full rather than
 * trimmed to a total word target. What still applies is paragraph SHAPE — median around 22 words,
 * nothing over 60 — checked with `npm run count:copy transporter-panel`.
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
    "Every trip ran on a chat thread and got paid two months later. I designed the panel that replaced both — and its hardest screen is the one where a man who reads English slowly agrees, irreversibly, to what he's owed.",
  layout: 'editorial',
  eyebrow: 'VALMO (MEESHO) · TRANSPORTER-FACING · LIVE',
  domain: 'Logistics ops tooling',
  scale: '5 lifecycle states · 182 designed screens',
  meta: {
    role: 'Product Designer — sole designer, end to end',
    team: 'Valmo Transportation (Meesho) — with PM, FinOps and engineering counterparts',
    timeline: 'Sept – Nov 2025 · design review Nov 2025',
    platform: 'Desktop web panel (transporter-facing) — live',
    skills: ['Product Design', 'UX Research', 'Information Architecture', 'Content Design'],
  },
  tldr: {
    problem:
      'Trip assignment ran on WhatsApp, which breaks past roughly 20 trips a day while real transporters run 20–80. Payouts were reconciled by hand, so a transporter first saw his own data months later. A third of trips carried an error before reaching finance.',
    outcomes: [
      'Replaced the chat thread with a five-state panel — 182 designed screens, 102 of them on Completed, because confirm-or-dispute is where the money and the risk are',
      "Made confirmation the payout trigger: the panel is the transporter's auditable ledger, which is what lets self-invoicing and automated payouts exist at all",
      'Every irreversible action names its cost first — Reject lists three consequences above the reason field, and confirming a trip with an open dispute states exactly what it destroys',
    ],
    stats: [{ value: '182' }, { value: '5 states' }, { value: '20→80', fuzzed: true }],
    summary:
      "The transporter-facing trip module in Valmo's TMS — where a fleet owner assigns a vehicle, accepts before a deadline, tracks the run, and finally confirms or disputes his earnings.",
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
          body: "Valmo — Meesho's transportation arm — places linehaul trips with independent Indian transporters: the people who own the trucks. The whole lifecycle after placement ran on chat, and two separate failures met in the middle.",
        },
        {
          type: 'quote',
          text: "I don't know when and how much I'll be paid.",
          attribution: "the transporter's own summary, quoted in the requirements",
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
              body: 'Trips were created in TMS from placement sheets kept by sort-centre staff, who are measured on departures, not accuracy. A vehicle number typed under pressure is good enough to dispatch and wrong enough to break the payout weeks later. Wrong vehicle numbers, wrong transporter mapping, missing GPS — and the biggest class, round trips booked as two.',
            },
            {
              label: 'No visibility coming out',
              body: 'A vendor had no view into which trips Valmo had even acknowledged. Each kept a private spreadsheet to invoice from, and FinOps matched the two by hand over a cycle measured in months. Mismatches were resolved by phone; disputes happened over email and got lost.',
            },
            {
              label: 'A ceiling at twenty trips',
              body: 'The interim answer was a WhatsApp assignment module — trips pushed as messages to accept, reject or update. It worked for the right reason: it moved data ownership to the person whose payout depends on it. But at volume you are scrolling a thread hunting for what is unassigned.',
            },
          ],
        },
        {
          type: 'text',
          body: 'At that volume nobody can answer the three questions that actually matter: which trips still need a vehicle, which vehicles are free, and what am I going to be paid.',
        },
        {
          type: 'text',
          body: 'That ceiling is the design brief. Everything the chat thread structurally could not hold — a sortable list, a filter, a bulk action, a dispute with evidence attached, a payment history — is what the panel exists to do.',
        },
        {
          type: 'image',
          frame: 'browser',
          src: '/work/transporter-panel/pending-default.png',
          alt: 'The five-tab transporter panel with the Trip Management summary cards',
          caption: 'Pending Assignment — the panel that replaced the chat thread.',
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
          body: 'The business objective is one sentence and everything else follows from it. If a transporter agrees on screen that a trip’s route, vehicle and earnings are correct, the invoice can be generated from system data instead of reconstructed from his spreadsheet.',
        },
        {
          type: 'text',
          body: 'That is the precondition for self-invoicing and automated payouts, and therefore for collapsing a payout cycle currently measured in months down to within the same week.',
        },
        {
          type: 'text',
          body: 'For the transporter it decomposes into four jobs, one per lifecycle state, each of which had to complete without a phone call.',
        },
        {
          type: 'flow',
          steps: [
            'Get a new trip staffed and accepted before its deadline — and know what rejecting it costs',
            'Change a vehicle or driver on an accepted trip — without silently losing the change',
            "Know where a running truck is — including knowing when the system genuinely doesn't know",
            'Confirm or dispute the earnings on a finished trip — and never destroy a live claim by accident',
          ],
        },
        {
          type: 'text',
          body: 'The targets set against those jobs were behavioural, not interface-shaped: near-universal vehicle-and-driver confirmation before placement, a large drop in missed assignments, and better GPS coverage on tagged trips.',
        },
        {
          type: 'wordList',
          title: 'The bar I set for myself — and what the shipped screens are built against',
          items: [
            {
              word: 'No blank cells',
              note: 'No RFQ Linked · No GPS Present · As per existing Billing Process · No action needed on panel. An absence is always a labelled value — the research said missing earnings read as anxiety, not as "pending".',
            },
            {
              word: 'Consequence before input',
              note: 'Any irreversible action states its cost above the field that commits it.',
            },
            {
              word: 'Hindi where money is',
              note: 'Inline on the assignment banner, the payments explainer and every dispute category. Not on filter labels.',
            },
          ],
          highlight: 0,
        },
        {
          type: 'statRow',
          stats: [
            { value: '4', label: 'urgency bands on Pending, colour + text' },
            { value: '7', label: 'dispute sub-categories, all bilingual' },
            { value: '6', label: 'rejection reasons, last is Other + free text' },
          ],
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
          body: "This is not the driver's phone. It is a desktop panel for the person who owns the trucks — a fleet operator running dozens of trips at once, who needs a dense table because he compares rows rather than reads one.",
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
          title: 'What transporters asked for, and what it became',
          columns: ['They asked for', 'What it became'],
          rows: [
            [
              'One central dashboard for all trip types, with route-level status',
              'Five lifecycle tabs plus three summary cards that each drill into one',
            ],
            [
              'Recorded acknowledgment instead of a verbal yes',
              'Accept on Pending, Confirm Details on Completed — both timestamped and shown back ("Confirmed by you on 1 Nov")',
            ],
            [
              'Rate cards and estimated cost per trip upfront',
              'Expected Earnings with its 001-RFQ-00944 source visible from the Pending tab onward',
            ],
            [
              'Real-time payout tracking',
              'Dispute Window Open till 1 Apr · Payment will be initiated, stated in the row',
            ],
            [
              'Owner vs POC access — hide financial detail from POCs',
              'Not in this release. Named in the gaps.',
            ],
          ],
          totalNote: 'Research asks mapped against what the live panel actually does.',
        },
        {
          type: 'text',
          body: 'Three things about this person changed concrete decisions. He is Hindi-first and reads English slowly, so the two surfaces where he risks money carry Hindi inline rather than behind a toggle.',
        },
        {
          type: 'text',
          body: 'He trusts the interface literally, so a disabled Accept has to make its own precondition visible rather than just being grey. And he works from paper — the challan in his hand carries the Trip ID he has to type.',
        },
        {
          type: 'text',
          body: 'So the Missing Trip form shows him photographs of a real challan with the ID box outlined in green, instead of describing the format in words.',
        },
        {
          type: 'image',
          frame: 'browser',
          src: '/work/transporter-panel/missing-trip-challan.png',
          alt: 'Missing Trip form showing two challan photographs with the Trip ID outlined in green',
          caption: 'Recognition over recall, using the paper the transporter is already holding.',
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
          body: 'Five tabs, ordered as the trip actually moves: Pending Assignment → Upcoming → In-Transit → Completed → Cancelled. Above them, three summary cards that each carry the one number that would make you go there.',
        },
        {
          type: 'text',
          body: 'Pending Assignment (10) with a red "2 Trip at risk" pill. In-Transit Trips (12) split On Time / Delayed. Completed Trips split Pending Confirmation / Trips Under Dispute.',
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
          body: 'The structural idea I kept returning to: read the right-hand edge and the lifecycle explains itself — Accept/Reject, then Update/Reject, then nothing at all, then Confirm/Raise Dispute, then nothing again.',
        },
        {
          type: 'text',
          body: 'In-Transit and Cancelled have no action column because there is genuinely nothing to do, and I would rather a column disappear than sit there full of disabled buttons.',
        },
        {
          type: 'image',
          frame: 'none',
          src: '/work/transporter-panel/dg-actions.png',
          alt: 'The action column read down all five tabs — Accept, Update, none, Confirm Details, none',
          caption: 'One primary action per row, always visible at rest.',
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
          body: 'The biggest IA call was to take disputes out of the trip. A dispute can be about a trip, but equally about a rate card never agreed, a TDS deduction, a GST mismatch, a bank account, a POD disagreement.',
        },
        {
          type: 'text',
          body: 'If disputes live inside the trip row, the trip listing gets cluttered, the payments screen fills with dispute banners, the contract screens need dispute rows, and every module carries its own dispute logic forever.',
        },
        {
          type: 'text',
          body: 'So Disputes became a top-level nav item — one list, raised from anywhere, tracked in one place, backed by the existing support-ticketing backend rather than a bespoke workflow. The trip row keeps a single entry point; the machinery lives somewhere it can scale.',
        },
        {
          type: 'text',
          body: 'Completed carries the most structure because it carries the most risk. It splits into four sub-pills that state value, not just count — the one worth money leads with the money.',
        },
        {
          type: 'annotatedShot',
          src: '/work/transporter-panel/completed-default.png',
          alt: 'Completed tab with four sub-pills and the illustrated payments explainer',
          caption: 'Four billing realities in one table — the explainer tells you which one you are.',
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
              body: 'SC-SC and FM Carting settle through an existing billing process elsewhere, so those rows say so in words and offer More info instead of a dead button.',
            },
          ],
        },
        {
          type: 'text',
          body: 'Adhoc rows get the full Confirm Details / Raise Dispute pair, exactly like Regular ones, and that was a deliberate call rather than an oversight. Adhoc is the billing type most likely to have no linked contract at all.',
        },
        {
          type: 'text',
          body: 'Those are precisely the trips whose number a transporter cannot check against anything he agreed to. Suppressing the actions on the rows with the weakest paper trail would have left the least verifiable earnings with no route to correction.',
        },
        {
          type: 'text',
          body: 'Instead the row shows the basis it does have — Rate: ₹20/km where Regular shows Contract ID: 001-RFQ-009 — and keeps both actions live.',
        },
        {
          type: 'image',
          frame: 'browser',
          src: '/work/transporter-panel/cancelled-remarks.png',
          alt: 'Cancelled tab — Trip ID, Route, Placement Time, Missed Earning, Remark',
          caption: "Cancelled renames the money column Missed Earning, and keeps the transporter's own words in Remark.",
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
          caption: 'The whole module in one frame — five states, and the three ways a trip leaves the happy path.',
        },
        {
          type: 'text',
          body: 'Assign and accept. A pending row shows Assign Vehicle and Assign Driver as empty outlined pickers, and Accept is disabled. Fill both — each a searchable dropdown with a real no-results state — and Accept turns solid. The button’s state is the instruction.',
        },
        {
          type: 'text',
          body: 'Above the table, one banner says the rest in both languages: assign vehicle and driver, then Accept — and a trip not accepted before placement time is automatically rejected.',
        },
        {
          type: 'image',
          frame: 'browser',
          src: '/work/transporter-panel/upcoming-list.png',
          alt: 'Upcoming tab — filled vehicle and driver dropdowns, Update disabled until a change is made',
          caption: 'Once staffed, the same row becomes editable: Update stays disabled until something actually changes.',
        },
        {
          type: 'challengeSolution',
          index: 'Problem 1',
          problem: {
            title: 'Rejecting a trip looked free',
            body: 'The reject flow opened with a reason dropdown. Nothing on screen said what rejecting actually costs him, and the costs are real: cancellation fees, a performance rating, scheduled earnings he loses.',
          },
          fix: {
            title: 'Name the three costs, then ask why',
            body: 'The modal leads with "This action cannot be undone and may result in": trip cancellation fees, impact on performance ratings, loss of scheduled earnings. Only underneath does it ask for a reason, from six options ending in Other with a free-text field.',
          },
          effect:
            'A transporter who was always going to reject loses nothing. One who did not understand the cost finds out before he commits. Rejections then persist on Cancelled with the reason attached, so the same conversation does not happen twice.',
          image: {
            src: '/work/transporter-panel/reject-consequences.png',
            alt: 'Reject Trip modal listing three consequences above the reason dropdown',
          },
        },
        {
          type: 'text',
          body: 'Track. In-Transit replaces the action column with Live Updates — "40km to NDSL New Delhi Hub" when there is a signal, "-" when there is not, and an amber No GPS Present chip on the trip itself.',
        },
        {
          type: 'text',
          body: 'A vehicle without a tracker is stated as a fact, not hidden behind a stale last-known position. The driver’s number sits under his name with a copy button: on a running trip the panel shortens the distance to a phone call rather than replacing it.',
        },
        {
          type: 'image',
          frame: 'browser',
          src: '/work/transporter-panel/in-transit.png',
          alt: 'In-Transit tab with Live Updates column and a No GPS Present chip',
          caption: 'No action column. Live Updates instead — and an honest No GPS Present where there is no signal.',
        },
        {
          type: 'image',
          frame: 'none',
          src: '/work/transporter-panel/route-timeline.png',
          alt: 'Route Timelines panel showing STA / ATA / STD / ATD per node beside a live tracking placeholder',
          caption: 'The route panel spells out its own abbreviations at the bottom rather than assuming them.',
        },
        {
          type: 'text',
          body: 'Confirm or dispute. Each completed row shows what the payment is based on, how long he has — Dispute Window Open till 1 Apr — and two actions. Confirming a clean trip flips the row to "Confirmed by you on 1 Nov".',
        },
        {
          type: 'text',
          body: 'A checkbox on every row supports confirming a batch at once, which is the only way this screen works for someone closing out a month.',
        },
        {
          type: 'challengeSolution',
          index: 'Problem 2',
          problem: {
            title: 'Confirming could silently destroy a live claim',
            body: 'Confirmation freezes a trip for payout: data final, dispute window closed. Reached from a row that otherwise looks routine, it can dismiss an open dispute the transporter is still waiting on.',
            quote:
              "You won't be able to raise it again, and payment will be based on current trip details.",
          },
          fix: {
            title: 'A full stop that names the loss',
            body: 'Confirming a disputed trip raises a modal that states exactly what it destroys, with Close as the visually dominant option. Not a toast with undo, and not a silent block.',
          },
          effect:
            'An undo toast assumes the user notices it. Blocking silently teaches him the button is broken. Naming the consequence and making the safe choice the easy one is the only version that survives a user who trusts the screen.',
          image: {
            src: '/work/transporter-panel/confirm-active-dispute.png',
            alt: 'Confirm Trip & Dismiss Dispute modal over the Completed tab',
          },
        },
        {
          type: 'text',
          body: 'Raise a dispute. Category, Trip ID, then sub-categories as a multi-select — with the behaviour explained rather than assumed: "You can select multiple issue types if they’re all related to the same trip."',
        },
        {
          type: 'text',
          body: 'All seven options carry their Hindi underneath: Wrong trip amount (rate mismatch) / ट्रिप रेट गलत है, Contract ID mismatch or missing / कॉन्ट्रैक्ट नंबर गलत है या नहीं दिख रहा, and so on.',
        },
        {
          type: 'text',
          body: 'Those categories are not generic — they were chosen against the actual dispute mix, where the overwhelming majority of weekly disputes were about rate, not service.',
        },
        {
          type: 'image',
          frame: 'browser',
          src: '/work/transporter-panel/raise-dispute-form.png',
          alt: 'Raise Dispute form with seven bilingual sub-categories, English over Devanagari',
          caption: 'Not a language toggle — both languages, permanently, on the highest-stakes form in the module.',
        },
        {
          type: 'text',
          body: 'Report a missing trip. A three-step flow with one guard that matters most: type a Trip ID that already exists and the form refuses to open a ticket — "This trip isn’t missing!" — offering a View Trip link instead.',
        },
        {
          type: 'text',
          body: 'The support ticket that never gets created is the best outcome that flow can have.',
        },
        {
          type: 'statRow',
          stats: [
            {
              value: '13',
              label: 'dispute lifecycle states designed — including Partial Approved, Reopened and Reraise',
            },
          ],
        },
        {
          type: 'image',
          frame: 'none',
          src: '/work/transporter-panel/dg-confirm.png',
          alt: 'The confirm-or-dispute fork on Completed, with both guards called out',
          caption: 'The money screen, and the two paths that had to be guarded.',
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
            {
              word: 'Scan is horizontal',
              note: 'Leftmost → middle → earnings → status → action. The leftmost cell has to let him recognise the trip.',
            },
            {
              word: 'Route, then vehicle, then earnings',
              note: 'He remembers a trip by route and vehicle number, and by Trip ID almost never — except when quoting one in a dispute. So Trip ID cannot be the first thing he sees.',
            },
            { word: 'Six columns maximum', note: 'Past six, scanning degrades.' },
            { word: 'Earnings and Action stay right', note: 'Universal table-scanning behaviour.' },
            {
              word: 'Vehicle and driver must appear',
              note: 'Wrong vehicle entry is a dispute cause — but it must not take much space.',
            },
            { word: 'Listing is signal', note: 'The details page is depth.' },
          ],
        },
        {
          type: 'text',
          body: 'The shipped table breaks rules 2 and 3, and both breaks were chosen. Completed ships with seven content columns plus a bulk-select checkbox, and Trip Info is leftmost.',
        },
        {
          type: 'text',
          body: 'Rule 2 said Trip ID must not lead, because a transporter recognises a trip by route and vehicle long before an ID. Rather than reorder the table I made the first cell carry two handles — the ID over the vehicle number.',
        },
        {
          type: 'text',
          body: 'So the vehicle number, his second-strongest memory hook, sits where the eye already lands. The ID stays first because this is the tab where disputes get raised, and a dispute is quoted by ID.',
        },
        {
          type: 'text',
          body: "Rule 3 lost to rule 5's underlying reason. The two columns over budget are Placement Time and Completed Time, and a dispute about timing is unarguable without both — Time related issue / समय से जुड़ी दिक्कत is one of the seven categories.",
        },
        {
          type: 'text',
          body: 'It cannot be checked from a listing showing one timestamp. Six columns is the right ceiling for a scanning table, the wrong one for an evidence table — and Completed is an evidence table.',
        },
        {
          type: 'text',
          body: "The third deviation is the one I'd defend hardest. I'd written that Raise Dispute should live inside trip details, not the listing, to keep the row clean. It ships in the row, next to Confirm Details.",
        },
        {
          type: 'text',
          body: 'Putting the safe action and the corrective action side by side matters more than column hygiene: a transporter who spots a wrong number should not have to open a detail page to say so. That friction only suppresses the legitimate dispute.',
        },
        {
          type: 'rejected',
          items: [
            {
              pattern: 'A language toggle for the whole panel',
              reason:
                "It makes the user choose a language before he knows which words he'll struggle with, and it doubles the copy surface I have to keep in sync. Bilingual inline on the few screens that decide money is narrower and never needs a decision.",
            },
            {
              pattern: 'A single unified Completed list with a mixed action column',
              reason:
                'One list is one mental model, but a table where the action means "confirm this" on one row and "nothing to do" on the next teaches a literal reader that the panel is arbitrary. Four sub-pills cost one click.',
            },
            {
              pattern: 'Actions revealed on hover',
              reason:
                'A hover-revealed control is invisible to someone scanning for what to do next. Every action is visible in the row at rest.',
            },
            {
              pattern: 'Colour-only status',
              reason:
                'Every urgency and delay signal is a coloured chip with text — Delayed by 1hr, On Time, No GPS Present, Assign by Today.',
            },
            {
              pattern: 'A disabled Raise Dispute button past the window',
              reason:
                'The row states the rule ("Dispute Window Open till 1 Apr") rather than showing a dead control.',
            },
            {
              pattern: 'Blank cells',
              reason:
                'Replaced everywhere by a named absence — No RFQ Linked, No GPS Present, As per existing Billing Process.',
            },
          ],
        },
        {
          type: 'statRow',
          stats: [
            { value: '6 written, 2 overruled', label: 'self-imposed table rules' },
            { value: '6', label: 'patterns rejected and replaced' },
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
          type: 'text',
          body: 'The deliverable is the Figma file engineering built from, and it is the version now live. Its weight is distributed the way the risk is.',
        },
        {
          type: 'matrix',
          title: 'Screens per tab',
          columns: ['Tab', 'Screens', 'Share'],
          rows: [
            ['Pending Assignment', '30', '16%'],
            ['Upcoming', '29', '16%'],
            ['In-Transit', '10', '6%'],
            ['Completed', '102', '56%'],
            ['Cancelled', '7', '4%'],
          ],
          totalNote:
            '182 screens total. Completed takes 56% of the file for one tab, because that is the only tab where being wrong costs the user money he has already earned.',
        },
        {
          type: 'text',
          body: 'State coverage on Completed is met: Loading State, Error State, No Data State, Missing Trip - Empty State, Report Missing - Upload Failed, Confirm - Dispute Failed, plus four variants of the custom date-range picker.',
        },
        {
          type: 'text',
          body: 'Search dropdowns on Pending and Upcoming carry explicit no-result states, unsaved edits are guarded by a save prompt, and the dispute lifecycle is drawn to its terminal states — including Partial Approved, Reopened, Reraise.',
        },
        {
          type: 'text',
          body: "It is not met everywhere, and I'd rather name that than round it up. Cancelled has no empty state and no loading state. That is the honest edge of this file.",
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
          body: 'The commercial case is a chain: accurate assignment data makes system-computed payouts possible, and on-screen confirmation makes self-invoicing possible. Without the first, finance is provisioning against numbers that are wrong a third of the time.',
        },
        {
          type: 'text',
          body: 'Without the second, every invoice still has to be matched by hand against a vendor’s private spreadsheet — the manual work that made the reconciliation cycle months long in the first place.',
        },
        {
          type: 'text',
          body: 'That framing decided the details. The dispute form asks for a category and a trip ID rather than a paragraph, because a structured dispute can be routed and measured while a phone call cannot.',
        },
        {
          type: 'text',
          body: 'The false-missing-trip guard exists because every ticket it prevents is cost removed from a resolving team. The earnings cell always shows its basis — Contract ID or Rate: ₹20/km — because a rate he can trace is a rate he argues about less.',
        },
        {
          type: 'text',
          body: 'And No RFQ Linked is displayed rather than suppressed: a trip running without a linked contract is precisely the trip that gets disputed later, so the panel says so at assignment time instead of at payout time.',
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
          body: 'The trade-off I took knowingly: this module never hides a bad number to keep the queue quiet. Missed Earning on every cancelled row, No RFQ Linked on the pending ones, the dispute window stated in plain text on every completed row.',
        },
        {
          type: 'text',
          body: 'It surfaces more disagreement in the short term, in exchange for disagreement that arrives as a categorised, evidenced dispute instead of a call to FinOps two months later.',
        },
        {
          type: 'statRow',
          stats: [
            {
              value: '2',
              label: 'settlement paths the tab keeps distinct — panel-settled vs existing billing process',
            },
            {
              value: 'a clear majority',
              label: 'of weekly disputes were about rate, not service — which shaped the category list',
              fuzzed: true,
            },
          ],
        },
        {
          type: 'ndaNote',
          title: 'On the numbers I am not claiming',
          body: 'The headline programme improvements — data accuracy, provisioning delta, payout turnaround, billing discounts — belong to the whole system-led trip programme. This panel contributes to them; it does not own them, so I have claimed none here.',
        },
      ],
    },
  ],

  spotlights: [
    {
      decision:
        "Accept stays disabled until both vehicle and driver are assigned, and the row's own controls are the only instruction needed.",
      rejected:
        'An always-enabled Accept that throws a validation error, or a required-fields asterisk pattern.',
      why: "For a literal reader, an error after the fact reads as the system breaking. The disabled button plus two visibly empty pickers makes the precondition physical — you see what's missing without reading. The WhatsApp flow already proved transporters supply accurate data when their payout depends on it.",
    },
    {
      decision:
        'Disputes got their own top-level nav item and their own list, instead of living inside the trip row.',
      rejected:
        'Managing disputes inline per module — a dispute section on trips, another on payments, another on contracts.',
      why: 'Only some disputes are about a trip. Rate cards, TDS and GST, bank details, POD disagreements — a trip listing cannot hold that, and inline means every module maintains its own dispute logic forever.',
    },
    {
      decision:
        'Adhoc rows keep Confirm Details / Raise Dispute against a per-km rate; SC-SC and FM Carting get More info only.',
      rejected:
        'Suppressing the confirm/dispute actions on Adhoc because it has no contract ID to check against.',
      why: 'Adhoc most often runs without a linked RFQ, which makes those earnings the least verifiable — exactly the rows that most need a route to correction. Suppressing the actions would strand the weakest paper trail with no recourse. SC-SC and FM Carting genuinely settle off this panel.',
    },
    {
      decision:
        'Hindi is printed under every dispute sub-category and inside both money banners, permanently — not behind a toggle.',
      rejected: 'A full Hindi locale switch for the panel.',
      why: "A toggle asks the user to predict where he'll struggle, and doubles the copy surface of the whole panel to serve four screens. Printing both languages costs vertical space on one form, and lets a Hindi-first and an English-first user read the same screen.",
    },
    {
      decision:
        'The Missing Trip form validates the Trip ID against live trips and redirects instead of filing, and shows photographs of a challan with the ID location outlined.',
      rejected: 'Accepting the report and letting the resolving team close it as invalid.',
      why: 'A "missing" trip is usually one he couldn’t find, not one the system lost — most often a mistyped ID read off paper. Fixing the lookup at entry converts a support ticket into a link, and showing the document beats describing its format.',
    },
  ],

  reflections: [
    {
      title: 'Effort belongs where the consequence is, not where the surface area is.',
      body: 'Five tabs, and one of them holds more than half the screens. Not because Completed is visually complicated, but because it is the only tab where being wrong costs the user money he has already earned.',
    },
    {
      title: 'A rule you never break was probably never load-bearing.',
      body: "I wrote six constraints for the listing table and shipped a version that overrules two. That isn't a failure of the rules; it is what rules are for — they made each violation cost something visible, so the compromise was chosen rather than drifted into.",
    },
    {
      title: "An empty cell is a design decision you haven't made yet.",
      body: 'No RFQ Linked. No GPS Present. As per existing Billing Process. Each started as a blank space in a table, and each one, once named, stopped generating a phone call.',
    },
    {
      title: 'Three things are still open, and I would rather name them.',
      body: 'Cancelled has no empty or loading state. Disputes can only be raised from Completed, so a rate disagreement obvious at assignment time has to wait for the trip to finish. Role-based access — which transporters explicitly asked for, to hide rate detail from their POCs — is not in this release.',
    },
  ],

  next: {
    slug: 'network-design-central',
    title: 'Network Design Central',
    code: 'NDC-02',
  },
}
