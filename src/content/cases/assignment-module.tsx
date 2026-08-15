/**
 * ASM-01 — The Assignment Module
 * Typed CaseStudy converted from content/case-studies/00-assignment-module.md.
 * Source of truth for every UI claim: Figma- Assignment module/ (182 screens, live version).
 * Narrative source docs: Transporter Panel (1).pdf, Valmo Transporter Panel.pdf,
 * Transporter Payout and Negotiation (10).pdf — see tasks/assignment-sot-map.md.
 * All programme-level metrics are fuzzed per content/fuzzing-map.json; nothing here claims a
 * system-wide number as this module's own outcome.
 * Screens are exported by scripts/export-assignment-shots.mjs (challan region blurred — real
 * vendor/driver data); diagrams by scripts/gen-assignment-diagrams.mjs. Both write public/work/assignment/.
 */
import type { CaseStudy } from '../types'
import { summaries } from './summaries'

export const assignment: CaseStudy = {
  ...summaries['assignment-module'],
  title: "The Assignment Module — moving a transporter's whole trip life out of WhatsApp",
  oneLiner:
    "Every trip ran on a chat thread and got paid two months later. I designed the panel that replaced both — and its hardest screen is the one where a man who reads English slowly agrees, irreversibly, to what he's owed.",
  meta: {
    role: 'Product Designer — sole designer, end to end',
    team: 'Valmo Transportation (Meesho) — with PM, FinOps and engineering counterparts',
    timeline: 'Sept – Nov 2025 · design review Nov 2025',
    platform: 'Desktop web panel (transporter-facing) — live',
  },
  tldr: {
    problem:
      'Trip assignment ran entirely on WhatsApp — a channel that broke past roughly 20 trips a day per vendor while real transporters were running 20–80 — and payout reconciliation ran on manual invoice-to-tracker matching, so a transporter first saw his own trip data during a reconciliation cycle measured in months. Roughly a third of trips carried a data error before they ever reached finance.',
    outcomes: [
      'Replaced the chat thread with a five-state panel — 182 designed screens, 102 of them on Completed, because confirm-or-dispute is where the money and the risk are',
      "Made confirmation the payout trigger: the panel is the transporter's auditable ledger, which is what lets self-invoicing and automated payouts exist at all",
      'Every irreversible action names its cost first — Reject lists three consequences above the reason field, and confirming a trip with an open dispute states exactly what it destroys',
    ],
    stats: [{ value: '182' }, { value: '5 states' }, { value: '20→80', fuzzed: true }],
    summary:
      "I designed the transporter-facing trip module in Valmo's TMS — the desktop panel where a fleet owner assigns a vehicle and driver, accepts before a deadline, tracks the run, and finally confirms or disputes his earnings. I wrote six table rules for the listing before drawing it, shipped a version that deliberately overrules two of them, and pushed disputes out of the trip row into their own top-level surface so the row could stay readable.",
  },

  chapters: [
    // ── STEP 01 ───────────────────────────────────────────────────────────
    {
      id: 'problem-understanding',
      step: 1,
      title: 'Problem Understanding',
      blocks: [
        {
          type: 'text',
          body: "Valmo — Meesho's transportation arm — places linehaul trips with independent Indian transporters. The whole lifecycle after placement ran on chat. Two separate failures met in the middle.",
        },
        {
          type: 'text',
          body: 'Bad data going in. Trips were created in TMS from placement sheets kept by sort-centre staff, and those staff are measured on departures, not on data accuracy — their job is to get a truck out, so a vendor name or vehicle number typed under time pressure is good enough to dispatch and wrong enough to break the payout three weeks later. When a transporter swapped a vehicle at the last minute, nobody updated the sheet. The result: roughly a third of trips carried a data inaccuracy, spread across wrong vehicle numbers, wrong transporter mapping, missing GPS, and — the largest single error class — round trips booked as two separate one-way trips.',
        },
        {
          type: 'text',
          body: 'No visibility coming out. After execution, a vendor had no view into which trips Valmo had even acknowledged. Each one kept a private spreadsheet to raise invoices from, and FinOps matched the two by hand over a reconciliation cycle measured in months. Mismatches were resolved by phone. Disputes happened over email and got lost.',
        },
        {
          type: 'quote',
          text: "I don't know when and how much I'll be paid.",
          attribution: "the transporter's own summary, quoted in the requirements",
        },
        {
          type: 'text',
          body: "Before this panel, the team's interim answer to the first problem was a WhatsApp assignment module — trips pushed to transporters as messages they could accept, reject, or update vehicle and driver on. It worked, and it worked for the right reason: it moved data ownership from ground ops to the person whose payout depends on the data being right. But it had a hard ceiling. The flow degrades past roughly 20 trips a day per vendor, and the transporters who matter most run 20–80. At that volume a POC scrolls a chat thread hunting for what's still unassigned, vehicles get mistagged between trips, and nobody can answer the three questions that actually matter: which trips still need a vehicle, which vehicles are free, and what am I going to be paid.",
        },
        {
          type: 'text',
          body: "That ceiling is the design brief. Everything the chat thread structurally could not hold — a sortable list, a filter, a bulk action, a dispute with evidence attached, a payment history — is what the panel exists to do.",
        },
        {
          type: 'statRow',
          stats: [
            { value: 'roughly 1 in 3', label: 'trips carrying a data inaccuracy', fuzzed: true },
            { value: '~20/day vs 20–80/day', label: 'where WhatsApp broke vs what transporters actually run' },
            { value: '182 (102 on Completed)', label: 'designed screens in the shipped file' },
          ],
        },
        {
          type: 'image',
          frame: 'browser',
          src: '/work/assignment/pending-default.png',
          alt: 'The five-tab transporter panel with the Trip Management summary cards',
          caption: 'Pending Assignment — the panel that replaced the chat thread.',
        },
      ],
    },

    // ── STEP 02 ───────────────────────────────────────────────────────────
    {
      id: 'objective',
      step: 2,
      title: 'Objective',
      blocks: [
        {
          type: 'text',
          body: 'The business objective is one sentence and everything else follows from it: make confirmation the payout trigger. If a transporter agrees on-screen that a trip’s route, vehicle and earnings are correct, the invoice can be generated from system data instead of reconstructed from his spreadsheet — which is the precondition for self-invoicing and automated payouts, and therefore for collapsing a payout cycle currently measured in months down to within the same week.',
        },
        {
          type: 'text',
          body: 'For the transporter that decomposes into four jobs, one per lifecycle state, each of which had to complete without a phone call.',
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
              note: "Inline on the assignment banner, the payments explainer and every dispute category. Not on filter labels.",
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

    // ── STEP 03 ───────────────────────────────────────────────────────────
    {
      id: 'user-persona',
      step: 3,
      title: 'User Persona',
      blocks: [
        {
          type: 'text',
          body: "This is not the driver's phone. It is a desktop panel for the person who owns the trucks — a fleet operator running dozens of trips at once, often through more than one point of contact, who needs a dense table because he is comparing rows rather than reading one.",
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
          body: "Three things about this person changed concrete decisions. He is Hindi-first and reads English slowly, so the two surfaces where he risks money carry Hindi inline rather than behind a toggle. He trusts the interface literally, so a disabled Accept has to make its own precondition visible rather than just being grey. And he works from paper — the challan in his hand carries the Trip ID he has to type — so the Missing Trip form shows him photographs of a real challan with the ID box outlined in green instead of describing the format in words.",
        },
        {
          type: 'image',
          frame: 'browser',
          src: '/work/assignment/missing-trip-challan.png',
          alt: 'Missing Trip form showing two challan photographs with the Trip ID outlined in green',
          caption: 'Recognition over recall, using the paper the transporter is already holding.',
        },
      ],
    },

    // ── STEP 04 ───────────────────────────────────────────────────────────
    {
      id: 'information-architecture',
      step: 4,
      title: 'Information Architecture',
      blocks: [
        {
          type: 'text',
          body: 'Five tabs, ordered as the trip actually moves: Pending Assignment → Upcoming → In-Transit → Completed → Cancelled. Above them, three summary cards that each carry the one number that would make you go there: Pending Assignment (10) with a red "2 Trip at risk" pill, In-Transit Trips (12) split On Time / Delayed, Completed Trips split Pending Confirmation / Trips Under Dispute.',
        },
        {
          type: 'text',
          body: "The structural idea I kept returning to: the action column is the tab's thesis. Read the right-hand edge and the lifecycle explains itself — Accept/Reject, then Update/Reject, then nothing at all, then Confirm/Raise Dispute, then nothing again. In-Transit and Cancelled have no action column because there is genuinely nothing to do, and I would rather a column disappear than sit there full of disabled buttons.",
        },
        {
          type: 'image',
          frame: 'none',
          src: '/work/assignment/dg-actions.png',
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
          body: 'The biggest IA call was to take disputes out of the trip. A dispute can be about a trip, but it can equally be about a rate card that was never agreed, a TDS deduction, a GST mismatch, a bank account, or a POD disagreement. If disputes live inside the trip row, then the trip listing gets cluttered, the payments screen fills with dispute banners, the contract screens need dispute rows, and every module has to carry its own dispute logic forever. So Disputes became a top-level nav item — one list, raised from anywhere, tracked in one place, backed by the existing support-ticketing backend rather than a bespoke workflow. The trip row keeps a single entry point; the machinery lives somewhere it can scale.',
        },
        {
          type: 'text',
          body: 'Completed carries the most structure because it carries the most risk. It splits into four sub-pills that state value, not just count — All / 50 trips, Pending Confirmation / 10 trips worth ₹37,500, Confirmed by You / 20 trips, No Action Needed / 20 trips (SC-SC, FM Carting & others). The one worth money leads with the money. And because four billing realities coexist in that one table — Regular against a contract ID, Adhoc against a per-km rate, and SC-SC / FM Carting which are not settled on this panel at all — the tab opens with a plain-language explainer, "What should I do for my Payments?", that tells you which of the four you are before you touch a row.',
        },
        {
          type: 'text',
          body: "Adhoc rows get the full Confirm Details / Raise Dispute pair, exactly like Regular ones, and that was a deliberate call rather than an oversight. Adhoc is the billing type most likely to have no linked contract at all — the great majority of adhoc trips run without an RFQ — so those are precisely the trips whose number a transporter cannot check against anything he agreed to. Suppressing the actions on the rows with the weakest paper trail would have left the least verifiable earnings with no route to correction. Instead the row shows the basis it does have — Rate: ₹20/km where Regular shows Contract ID: 001-RFQ-009 — and keeps both actions live. What genuinely doesn't belong on this panel is SC-SC and FM Carting, which settle through an existing billing process elsewhere; those rows say so in words and offer More info instead of a button that would do nothing.",
        },
        {
          type: 'image',
          frame: 'browser',
          src: '/work/assignment/completed-default.png',
          alt: 'Completed tab with four sub-pills and the illustrated payments explainer',
          caption: 'Four billing realities in one table — the explainer tells you which one you are.',
        },
        {
          type: 'image',
          frame: 'browser',
          src: '/work/assignment/cancelled-remarks.png',
          alt: 'Cancelled tab — Trip ID, Route, Placement Time, Missed Earning, Remark',
          caption: "Cancelled renames the money column Missed Earning, and keeps the transporter's own words in Remark.",
        },
      ],
    },

    // ── STEP 05 ───────────────────────────────────────────────────────────
    {
      id: 'user-flow',
      step: 5,
      title: 'User Flow',
      blocks: [
        {
          type: 'image',
          frame: 'none',
          src: '/work/assignment/dg-lifecycle.png',
          alt: 'The five-state trip lifecycle with its three exception paths',
          caption: 'The whole module in one frame — five states, and the three ways a trip leaves the happy path.',
        },
        {
          type: 'text',
          body: 'Assign and accept. A pending row shows Assign Vehicle and Assign Driver as empty outlined pickers, and Accept is disabled. Fill both — each a searchable dropdown with a real no-results state, each firing its own confirmation snackbar — and Accept turns solid. The button’s state is the instruction. Above the table, one banner says the rest of it in both languages: "Assign vehicle and driver, then Accept the trip, if the trip is not accepted before placement time will be automatically rejected."',
        },
        {
          type: 'image',
          frame: 'browser',
          src: '/work/assignment/upcoming-list.png',
          alt: 'Upcoming tab — filled vehicle and driver dropdowns, Update disabled until a change is made',
          caption: 'Once staffed, the same row becomes editable: Update stays disabled until something actually changes.',
        },
        {
          type: 'text',
          body: 'Reject. The modal leads with consequences, not a form: "This action cannot be undone and may result in:" → Trip cancellation fees · Impact on your performance ratings · Loss of scheduled earnings. Only underneath does it ask for a reason, from six options ending in Other with a free-text field. The order is the point — a transporter who was going to reject anyway loses nothing; one who didn’t understand the cost finds out before he commits. Rejections then persist on Cancelled with the reason attached, so the same conversation doesn’t have to happen twice.',
        },
        {
          type: 'image',
          frame: 'browser',
          src: '/work/assignment/reject-consequences.png',
          alt: 'Reject Trip modal listing three consequences above the reason dropdown',
          caption: 'Three costs, then the reason field. Never the other way round.',
        },
        {
          type: 'text',
          body: "Track. In-Transit replaces the action column with Live Updates — \"40km to NDSL New Delhi Hub\" when there's a signal, \"-\" when there isn't, and an amber No GPS Present chip on the trip itself. A vehicle without a tracker is stated as a fact about the vehicle rather than hidden behind a stale last-known position. The driver's phone number sits under his name with a copy button: on a running trip the panel's job is to shorten the distance to a phone call, not replace it.",
        },
        {
          type: 'image',
          frame: 'browser',
          src: '/work/assignment/in-transit.png',
          alt: 'In-Transit tab with Live Updates column and a No GPS Present chip',
          caption: 'No action column. Live Updates instead — and an honest No GPS Present where there is no signal.',
        },
        {
          type: 'image',
          frame: 'none',
          src: '/work/assignment/route-timeline.png',
          alt: 'Route Timelines panel showing STA / ATA / STD / ATD per node beside a live tracking placeholder',
          caption: 'The route panel spells out its own abbreviations at the bottom rather than assuming them.',
        },
        {
          type: 'text',
          body: 'Confirm or dispute. Each completed row shows what the payment is based on (Contract ID: 001-RFQ-009, or Rate: ₹20/km for Adhoc), how long the transporter has (Dispute Window Open till 1 Apr), and two actions. Confirming a clean trip flips the row to "Confirmed by you on 1 Nov" / "Payment will be initiated". A checkbox on every row supports confirming a batch at once, which is the only way this screen works for someone closing out a month.',
        },
        {
          type: 'text',
          body: 'Confirming a trip that already has an open dispute does not just go through. It raises the guard this module is built around.',
        },
        {
          type: 'quote',
          text: "Confirm Trip & Dismiss Dispute? — You have an active dispute on this trip. Confirming this trip will dismiss your dispute immediately. You won't be able to raise it again, and payment will be based on current trip details.",
          attribution: 'the modal, verbatim',
        },
        {
          type: 'image',
          frame: 'browser',
          src: '/work/assignment/confirm-active-dispute.png',
          alt: 'Confirm Trip & Dismiss Dispute modal over the Completed tab',
          caption: 'The one action that could silently destroy a claim is the one that cannot happen silently.',
        },
        {
          type: 'text',
          body: 'Raise a dispute. Category (Existing Trip or Missing Trip), Trip ID, then sub-categories as a multi-select — with the multi-select behaviour explained rather than assumed: "You can select multiple issue types if they’re all related to the same trip." All seven options carry their Hindi underneath: Wrong trip amount (rate mismatch) / ट्रिप रेट गलत है, Contract ID mismatch / missing / कॉन्ट्रैक्ट नंबर गलत है या नहीं दिख रहा, and so on. Those categories are not generic — they were chosen against the actual dispute mix, where the overwhelming majority of weekly disputes were about rate, not service.',
        },
        {
          type: 'image',
          frame: 'browser',
          src: '/work/assignment/raise-dispute-form.png',
          alt: 'Raise Dispute form with seven bilingual sub-categories, English over Devanagari',
          caption: 'Not a language toggle — both languages, permanently, on the highest-stakes form in the module.',
        },
        {
          type: 'text',
          body: 'Report a missing trip. A three-step flow with one guard that matters more than the rest: type a Trip ID that already exists and the form refuses to open a ticket — "This trip isn’t missing! Trip TRP1234567890 is currently In-Transit tab." with a View Trip link. The support ticket that never gets created is the best outcome that flow can have.',
        },
        {
          type: 'statRow',
          stats: [
            {
              value: '13',
              label:
                'dispute lifecycle states designed — including Partial Approved, Reopened and Reraise',
            },
          ],
        },
        {
          type: 'image',
          frame: 'none',
          src: '/work/assignment/dg-confirm.png',
          alt: 'The confirm-or-dispute fork on Completed, with both guards called out',
          caption: 'The money screen, and the two paths that had to be guarded.',
        },
      ],
    },

    // ── STEP 06 ───────────────────────────────────────────────────────────
    {
      id: 'lo-fi-wireframes',
      step: 6,
      title: 'Lo-fi Wireframes',
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
          body: 'Rule 2 said Trip ID must not lead, because a transporter recognises a trip by route and vehicle long before he recognises an ID. Rather than reorder the table I made the first cell carry two handles — "TR-12345678-1234 | Regular" over "DL 01 AB 1234 | 32 ft" — so vehicle number, the second-strongest memory hook, sits in the column where the eye already lands. The ID stays first because this is the tab where disputes get raised, and a dispute is quoted by ID: the one screen where rule 2’s exception applies is this one.',
        },
        {
          type: 'text',
          body: "Rule 3 lost to rule 5's underlying reason. The two columns over budget are Placement Time and Completed Time, and a dispute about timing is unarguable without both — \"Time related issue / समय से जुड़ी दिक्कत\" is one of the seven categories, and it cannot be checked from a listing that shows only one timestamp. Six columns is the right ceiling for a scanning table; it is the wrong ceiling for an evidence table, and Completed is an evidence table.",
        },
        {
          type: 'text',
          body: "The third deviation is the one I'd defend hardest. I'd written that Raise Dispute should live inside trip details, not the listing, to keep the row clean. It ships in the row, next to Confirm Details. Putting the safe action and the corrective action side by side matters more than column hygiene: a transporter who spots a wrong number should not have to open a detail page to say so, because that friction only ever suppresses the legitimate dispute, never the frivolous one.",
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
                'One list is one mental model, but a table where the action means "confirm this" on one row and "nothing to do here" on the next teaches a literal reader that the panel is arbitrary. Four sub-pills cost one click and buy an unambiguous action column.',
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

    // ── STEP 07 ───────────────────────────────────────────────────────────
    {
      id: 'prototype',
      step: 7,
      title: 'Prototype',
      blocks: [
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
          body: 'State coverage on Completed is met: Loading State, Error State, No Data State, Missing Trip - Empty State, Report Missing - Upload Failed, Confirm - Dispute Failed, plus four variants of the custom date-range picker. Search dropdowns on Pending and Upcoming both carry explicit no-result states. Unsaved edits on Upcoming are guarded by a save prompt. The dispute lifecycle is drawn to its terminal states, including the awkward ones — Partial Approved, Reopened, Reraise.',
        },
        {
          type: 'text',
          body: "It is not met everywhere, and I'd rather name that than round it up. Cancelled has no empty state and no loading state. That is the honest edge of this file.",
        },
      ],
    },

    // ── STEP 08 ───────────────────────────────────────────────────────────
    {
      id: 'business-aspects',
      step: 8,
      title: 'Business Aspects',
      blocks: [
        {
          type: 'text',
          body: 'The commercial case is a chain, and the panel is one link in it: accurate assignment data makes system-computed payouts possible, and on-screen confirmation makes self-invoicing possible. Without the first, finance is provisioning against numbers that are wrong a third of the time. Without the second, every invoice still has to be matched by hand against a vendor’s private spreadsheet — the manual work that made the reconciliation cycle months long in the first place.',
        },
        {
          type: 'text',
          body: 'That framing decided the details. The dispute form asks for a category and a trip ID rather than a paragraph, because a structured dispute can be routed, measured and SLA’d while a phone call cannot. The false-missing-trip guard exists because every ticket it prevents is real cost removed from a resolving team. The earnings cell always shows its basis — Contract ID or Rate: ₹20/km — because a rate the transporter can trace against his own contract is a rate he argues about less, and because the dispute data said the argument was almost always about rate. And No RFQ Linked is displayed rather than suppressed: a trip running without a linked contract is precisely the trip that gets disputed later, so the panel says so at assignment time instead of at payout time.',
        },
        {
          type: 'text',
          body: 'The trade-off I took knowingly: this module never hides a bad number to keep the queue quiet. Missed Earning on every cancelled row, No RFQ Linked on the pending ones, the dispute window stated in plain text on every completed row. It surfaces more disagreement in the short term, in exchange for disagreement that arrives as a categorised, evidenced dispute instead of a call to FinOps two months later.',
        },
        {
          type: 'statRow',
          stats: [
            {
              value: '2',
              label:
                'settlement paths the tab keeps distinct — panel-settled (NLH/RLH) vs existing billing process',
            },
            {
              value: 'a clear majority',
              label: 'of weekly disputes were about rate, not service — which shaped the category list',
              fuzzed: true,
            },
          ],
        },
        {
          type: 'text',
          body: "One attribution note I want on the record: the headline programme improvements — data accuracy, provisioning delta, payout turnaround, billing discounts — belong to the whole system-led trip programme, not to this module alone. I'm not claiming them as this panel's outcome.",
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
      why: "For a literal reader, an error after the fact reads as the system breaking. The disabled button plus two visibly empty pickers makes the precondition physical — you can see what's missing without reading anything. This is also the whole point of the module: the interim WhatsApp flow proved transporters will supply accurate vehicle and driver data when their payout depends on it, and the panel's job is to make supplying it the path of least resistance rather than a message someone has to remember to send.",
    },
    {
      decision:
        'Confirming a trip that has an open dispute triggers a full-stop modal that names the loss — "You won’t be able to raise it again, and payment will be based on current trip details." — with Close as the visually dominant option.',
      rejected: 'A toast-with-undo, or silently blocking Confirm while a dispute is open.',
      why: "Confirmation freezes the trip for payout: data final, dispute window closed. That makes it the one action in the module that can destroy a legitimate money claim in a single click, and it's reachable from a row that otherwise looks routine. An undo toast assumes the user notices it; blocking silently teaches him the button is broken. Naming the consequence and making the safe choice the easy one is the only version that survives a user who trusts the screen.",
    },
    {
      decision:
        'Disputes got their own top-level nav item and their own list, instead of living inside the trip row.',
      rejected:
        'Managing disputes inline per module — a dispute section on trips, another on payments, another on contracts.',
      why: 'Only some disputes are about a trip. Rate cards, TDS and GST, bank details, POD disagreements — a trip listing cannot scale to hold any of that elegantly, and the inline version means every module maintains its own dispute UI and logic forever. One consolidated surface on top of the existing ticketing backend gave a single place to raise from anywhere and track in one list, and it kept the trip row readable, which rules 3 and 6 were already under pressure from.',
    },
    {
      decision:
        'Hindi is printed under every dispute sub-category and inside both money banners, permanently — not behind a toggle.',
      rejected: 'A full Hindi locale switch for the panel.',
      why: "A toggle asks the user to predict where he'll struggle, and it doubles the copy surface for the entire panel to serve the four screens that actually matter. Printing both languages at the point of highest stakes costs vertical space on one form and nothing else, and it means a Hindi-first user and an English-first user read the same screen without either changing state.",
    },
    {
      decision:
        'The Missing Trip form validates the Trip ID against live trips and redirects instead of filing — "This trip isn’t missing! Trip TRP1234567890 is currently In-Transit tab." — and shows photographs of a challan with the ID location outlined.',
      rejected: 'Accepting the report and letting the resolving team close it as invalid.',
      why: 'A "missing" trip is usually a trip the transporter couldn’t find, not one the system lost — most often because he mistyped an ID he was reading off paper. Fixing the lookup at the point of entry converts a support ticket into a link, and showing the actual document beats describing an ID format to someone who is holding that document.',
    },
    {
      decision:
        'Adhoc rows keep Confirm Details / Raise Dispute against a per-km rate; SC-SC and FM Carting get More info only.',
      rejected: 'Suppressing the confirm/dispute actions on Adhoc because it has no contract ID to check against.',
      why: 'Adhoc is the billing type most likely to run without a linked RFQ, which makes those the trips whose earnings a transporter can least verify — exactly the rows that most need a route to correction. Suppressing the actions there would have stranded the weakest paper trail with no recourse. SC-SC and FM Carting are different: they genuinely settle through an existing billing process off this panel, so the row says so in words instead of offering a button that would do nothing.',
    },
  ],

  reflection:
    "The lesson I keep from this module is about where design effort belongs. Five tabs, and one of them holds more than half the screens — not because Completed is visually complicated, but because it's the only tab where being wrong costs the user money he has already earned. Effort should be allocated by consequence, not by surface area. The second is about my own rules. I wrote six constraints for the listing table and shipped a version that overrules two of them. That isn't a failure of the rules; it's what rules are for — they made the cost of each violation explicit, so the compromise was chosen rather than drifted into. A rule you never break was probably never load-bearing. And the third, which I now use constantly: an empty cell is a design decision you haven't made yet. No RFQ Linked, No GPS Present, As per existing Billing Process — each started as a blank space in a table, and each one, once named, stopped generating a phone call. What's still open, and I'd rather name it than let the case study imply otherwise: Cancelled has no empty or loading state; disputes can only be raised from Completed, so a rate disagreement that's obvious at assignment time has to wait for the trip to finish; and role-based access — transporters explicitly asked to hide rate detail from their POCs — is not in this release.",

  next: {
    slug: 'network-design-central',
    title: 'Network Design Central',
    code: 'NDC-02',
  },
}
