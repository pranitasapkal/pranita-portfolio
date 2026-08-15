/**
 * PLC-05 — Placement & Assignment — the Multi-Origin Route Builder
 * Typed CaseStudy object converted from content/case-studies/04-placement-multi-origin.md
 * IMG blocks point at placeholder paths; placeholder:true triggers the "asset pending" frame.
 * {*} markers preserved verbatim in all body strings — rendered as <Asterisk /> by BlockRenderer.
 * Rejected-patterns block is the centerpiece of the lo-fi chapter (STEP 06); spotlights cover them too.
 */
import type { CaseStudy } from '../types'
import { summaries } from './summaries'

export const placement: CaseStudy = {
  ...summaries['placement-multi-origin'],
  title: 'Placement & Assignment — the Multi-Origin Route Builder',
  oneLiner:
    "Six percent of trips were quietly corrupting the data everyone else depended on — and the fix wasn't allowed to cost the other ninety-four percent a single click.",
  eyebrow: 'VALMO (MEESHO) · INTERNAL TMS · PROTOTYPE',
  domain: 'Trip planning & assignment',
  scale: '~6% of trips · ~20% of national lanes',
  meta: {
    role: 'Product Designer — end-to-end (research, IA, interaction design, prototype)',
    team: 'Valmo TMS — Placement & Assignment pod (design, PM, ops-tech engineering)',
    timeline: 'TBC',
    platform: 'Desktop web panel (internal ops tool, Chrome)',
    skills: ['Product Design', 'UX Research', 'Interaction Design', 'Prototyping'],
  },
  tldr: {
    problem:
      'The trip-edit screen assumed one source node per trip, so ops teams handling multi-origin routes (~6% of trips, ~20% of national lanes) faked zero-bag challans or deleted and recreated live trips — both flagged in the requirements doc as data corruption.',
    outcomes: [
      'Multi-origin trips became a single editable record — the delete-and-recreate workaround and fake 0-bag challans were designed out',
      'Node add reduced to 2 clicks in the multi-origin builder; the 94% single-origin flow kept its existing layout with zero added steps',
      'Trip creation cut from minutes to seconds, with source data accuracy moved above 95%',
    ],
    stats: [{ value: '2→0' }, { value: '2-click' }, { value: '>95%', fuzzed: true }],
    summary:
      'I redesigned the Trip L2 edit screen so one vehicle collecting from multiple hubs is one trip record with explicit Source / Destination / RTO roles, bounded by an immutable contract snapshot. The single-origin majority renders a near-identical layout to today — the mode is decided once at page load, so 94% of users never see the new machinery.',
  },

  chapters: [
    // ── STEP 01 ───────────────────────────────────────────────────────────
    {
      id: 'problem-understanding',
      step: 1,
      kicker: 'Problem Understanding',
      navLabel: 'Faking it',
      ghost: 'FAKE',
      title: 'The tool could not express reality, so the ground invented one.',
      blocks: [
        {
          type: 'text',
          body: 'The Valmo TMS trip-edit screen assumed a trip has exactly one source node. That holds for roughly 94% of trips.\n\nIt fails for national linehaul routes where one vehicle collects from two or more hubs before the destination — about 6% of trips, but roughly 20% of national lanes, because multi-origin concentrates on the long hauls carrying the most freight.',
        },
        {
          type: 'text',
          body: 'The tool couldn\'t express that, so ground teams invented two workarounds. The requirements document named both as data corruption.\n\nEvery downstream consumer — billing, utilization reporting, transporter payouts — was reading data that a minority of trips had quietly falsified.',
        },
        {
          type: 'text',
          body: 'The constraint that shaped everything: the fix could not tax the majority. An Assignment Manager touches hundreds of trips a week and 94% are single-origin.\n\nOne extra click, field, or moment of "which mode am I in?" would cost more in aggregate than the 6% problem it solved. Make the 6% expressible, keep the 94% untouched.',
        },
        {
          type: 'problemTabs',
          items: [
            {
              label: 'Delete and recreate',
              body: 'Delete the trip after the first pickup, then recreate it from the second hub. The trip completes and its history is destroyed — the first leg orphaned from the record it belongs to.',
            },
            {
              label: 'Fake a zero-bag challan',
              body: 'Raise a dispatch document for nothing at the extra hub, so the system lets the vehicle through. A fabricated document enters the freight record, and everything downstream reads it as real.',
            },
            {
              label: 'Who pays for it',
              body: 'Billing, utilisation reporting and transporter payouts are all computed from these records. A minority of trips were quietly falsifying the input to all three.',
            },
          ],
        },
        {
          type: 'statRow',
          stats: [
            { value: '~6% of trips, ~20% of national lanes', label: 'multi-origin share' },
            { value: '2 (delete+recreate, fake 0-bag challans)', label: 'workarounds — both flagged as data corruption' },
          ],
        },
        {
          type: 'image',
          frame: 'none',
          src: '/src/assets/work/placement/before-after-diagram.png',
          alt: 'Before/after diagram — one physical route rendered as fake challans vs. one trip record',
          placeholder: true,
        },
      ],
    },

    // ── STEP 02 ───────────────────────────────────────────────────────────
    {
      id: 'objective',
      step: 2,
      kicker: 'Objective',
      navLabel: 'The 94% rule',
      ghost: '94%',
      title: 'Make the 6% expressible without charging the 94% a single click.',
      blocks: [
        {
          type: 'statementBand',
          eyebrow: 'The problem, stated',
          statement:
            'How might one vehicle collecting from several hubs become one honest trip record, without adding a single step for the 94% of trips that collect from one?',
        },
        {
          type: 'text',
          body: 'One measurable target with a hard guard-rail: a multi-origin route is one trip record with explicit node roles — Source, Destination, RTO Destination — and the single-origin flow gains zero clicks, fields or decisions.\n\nFour requirements came from the KRD: three node sections on the edit page; node additions restricted to the contract snapshot with no role changes post-creation; RTO always a subset of Source; reordering scoped within a section.\n\nOn top I set an interaction budget: adding a node costs at most 2 clicks, because an AM adding a fourth node should not pay a per-node tax a one-node form never charged.',
        },
        {
          type: 'text',
          body: 'The success measures were direct: both workarounds become unnecessary, trip creation drops from minutes to seconds{*}, and source data accuracy moves above 95%{*}.\n\nThe last two carry the business case — corrupted trip records were not a hygiene annoyance, they were the input to billing and payout calculations.',
        },
        {
          type: 'statRow',
          stats: [
            { value: '2 clicks', label: 'interaction budget to add a node' },
            { value: '>95%', label: 'source data accuracy target', fuzzed: true },
          ],
        },
      ],
    },

    // ── STEP 03 ───────────────────────────────────────────────────────────
    {
      id: 'user-persona',
      step: 3,
      kicker: 'User Persona',
      navLabel: 'Seconds per trip',
      ghost: 'SPEED',
      title: 'He measures the tool in seconds, because his week is trips times seconds.',
      blocks: [
        {
          type: 'text',
          body: 'The user is a Linehaul Assignment Manager — internal Valmo ops, desktop, Chrome on a mid-range laptop. He handles hundreds of routes a week: bulk-uploading templates, fixing validation failures, assigning vehicles and drivers, editing live trips when the ground shifts.\n\nHe is a power user in the strict sense: he knows the vocabulary better than the tool does, and he measures it in seconds per trip.',
        },
        {
          type: 'text',
          body: "Three traits drove the design. First, **throughput dominates**: any pattern that adds steps to a repeated action gets felt hundreds of times a week, which is why the 2-click budget and the rejection of every 3-click pattern were non-negotiable.\n\nSecond, **he edits live operational trips** — a vehicle may already be on the road when he opens the screen.\n\nThat rules out any interaction that commits a change without an explicit confirmation gate; a misclick on a live trip has a physical consequence. Third, **he is not the villain of the workaround story** — he is its victim.\n\nThe fake zero-bag challans weren't laziness; they were the only move the tool allowed. The persona insight that reframed the project: when a competent operator fabricates data, the tool's model of reality is wrong, not the operator.",
        },
        {
          type: 'text',
          body: "I validated the mental model against the existing screen he uses daily: source node at the top of Trip Overview, destination list below.\n\nThe single-origin render mode preserves that layout deliberately — his muscle memory is an asset the redesign was not allowed to spend.",
        },
        {
          type: 'statRow',
          stats: [
            { value: 'hundreds of routes and trips/week', label: 'AM weekly volume' },
          ],
        },
        {
          type: 'image',
          frame: 'browser',
          src: '/src/assets/work/placement/persona-snapshot.png',
          alt: 'Persona snapshot — Linehaul Assignment Manager at desktop with trip listing',
          placeholder: true,
        },
      ],
    },

    // ── STEP 04 ───────────────────────────────────────────────────────────
    {
      id: 'information-architecture',
      step: 4,
      kicker: 'Information Architecture',
      navLabel: 'Three roles',
      ghost: 'ROLES',
      title: 'Three node roles, and a contract snapshot that bounds them.',
      blocks: [
        {
          type: 'text',
          body: "The IA question was: where does \"which hub plays which role\" live? The answer became a three-layer structure with one immutable anchor.\n\nThe anchor is the **contract snapshot** — an immutable record of nodes and their roles (FIRST_ORIGIN / SUBSEQUENT_ORIGIN in the source column) captured at trip creation.\n\nEverything the AM can do on the edit screen is bounded by it: he can add only nodes present in the snapshot, and he cannot change a node's role after creation.\n\nThis single decision collapsed the validation surface — instead of designing rules for arbitrary node graphs, every edit is a selection from a known, finite set.",
        },
        {
          type: 'text',
          body: "Above the snapshot sits the **trip edit screen with two render modes**, decided once at page load from `trip.source_nodes.length`.\n\nOne source node → the existing single-origin layout, near-identical to today: source in Trip Overview, simple destination list, RTO as an auto-mirrored read-only row.\n\nTwo or more → the multi-origin layout with three visually distinct sections: Source Nodes (indigo accent), Destination Nodes (teal), and RTO Destination Nodes (amber, shown only for round trips).\n\nColor accents pair with text labels and section headers — never color alone.\n\nAround the screen sits the **trip lifecycle**: Action Required → Upcoming → Ongoing/In-Transit → Completed → Cancelled, with a source-node global filter gating the listing.\n\nRFQ auto-trips arrive locked — flagged \"Auto-Generated,\" with only vehicle and driver numbers editable — so the IA distinguishes trips the AM authored from trips the system authored.",
        },
        {
          type: 'statRow',
          stats: [
            { value: '3', label: 'node sections in multi-origin mode (Source · Destination · RTO)' },
          ],
        },
        {
          type: 'image',
          frame: 'none',
          src: '/src/assets/work/placement/ia-contract-snapshot.png',
          alt: 'IA diagram — contract snapshot bounding the edit screen, two render modes branching from source_nodes.length',
          placeholder: true,
        },
      ],
    },

    // ── STEP 05 ───────────────────────────────────────────────────────────
    {
      id: 'user-flow',
      step: 5,
      kicker: 'User Flow',
      navLabel: 'Two clicks',
      ghost: 'TWO',
      title: 'Adding a node had to cost two clicks, however many nodes there were.',
      blocks: [
        {
          type: 'text',
          body: "The core flow is the multi-origin node add, and it is deliberately short. The AM opens a trip; the page reads `source_nodes.length` once and renders the matching mode.\n\nIn multi-origin mode he sees the three sections populated from the trip, plus one add-node control: a Node Code dropdown and three always-enabled role buttons — Add as Source, Add as Destination, Add as RTO.\n\nPick a node, click a role button.\n\nTwo clicks. Validation runs on the click, not before: if the action is illegal, a specific inline error appears at the point of action (\"RTO must be a subset of Source\"), and nothing is committed.\n\nReordering is drag within a section; dragging across sections is impossible by construction, which enforces the no-role-change rule physically rather than through an error message.",
        },
        {
          type: 'text',
          body: "Two rules automate the round-trip case. Adding a node to Source auto-adds it to RTO; removing it from Source auto-removes it from RTO.\n\nThe AM touches RTO only for the one real decision it holds — excluding an origin from return freight — which he does by manually removing that node from the RTO section.\n\nDownstream, the flow legitimizes what the workarounds faked. If a hub genuinely has no freight, the AM dispatches with a 0-challan — an explicit, audited action, not a fabricated document.\n\nLoop close triggers a confirmation modal listing any still-open origins, and auto-closure on RTO arrival is disabled for multi-origin trips because forward and return node orders can differ — closing on the first RTO arrival would close a trip that isn't done.",
        },
        {
          type: 'statRow',
          stats: [
            { value: '2 clicks', label: 'node add (pick node → click role)' },
          ],
        },
        {
          type: 'image',
          frame: 'none',
          src: '/src/assets/work/placement/flow-add-node.png',
          alt: 'Flow diagram — add node, validate-on-click error, RTO mirror, 0-challan dispatch, loop close',
          placeholder: true,
        },
      ],
    },

    // ── STEP 06 ───────────────────────────────────────────────────────────
    {
      id: 'lo-fi-wireframes',
      step: 6,
      kicker: 'Lo-fi Wireframes',
      navLabel: 'Six, to ship one',
      ghost: 'SIX',
      title: 'I built six add-node patterns to ship one.',
      blocks: [
        {
          type: 'text',
          body: "The lo-fi phase was where the add-node interaction earned its shape, and it took six attempts to get there.\n\nI wireframed each candidate pattern and walked it against two test cases: \"AM adds the third origin to a live round-trip\" and \"AM edits a single-origin trip he's edited a hundred times before.\" Five patterns failed one or both.",
        },
        {
          type: 'rejected',
          items: [
            {
              pattern: 'Chip-bank ("Available from contract" chips)',
              reason: 'Render every snapshot node as a chip; tap to add. One click, cheapest on paper — but it exposes contract internals before the AM knows what is already in the trip, and the pattern exists nowhere else in the create flow.',
            },
            {
              pattern: 'Ghost row per section',
              reason: "Each section ends in an empty placeholder row; click it, pick a node, confirm. 3 clicks per add. On a route with four origins and three destinations, the AM pays a 50% click tax over the shipped pattern on every single node — a per-node cost the power-user persona feels hundreds of times a week.",
            },
            {
              pattern: 'Smart enable/disable on role buttons',
              reason: 'Disable whichever role buttons are invalid for the node. Creates "why can\'t I click this?" confusion — a disabled button says an action is impossible, not why, and the why is what the AM needs to learn.',
            },
            {
              pattern: 'Order-based role inference',
              reason: "Skip role selection entirely; infer role from add order (first node = source, rest = destinations). Breaks in edit mode, where nodes already exist and \"first\" is meaningless — and it structurally blocks adding a second source, which is the entire multi-origin use case. A pattern that cannot express the problem it was built for.",
            },
            {
              pattern: 'Auto-commit on dropdown selection',
              reason: "Selecting a node in the dropdown immediately adds it. Zero-confirmation mutation of a live operational trip — a misclick in the dropdown changes a route a vehicle is currently driving, with no gate between intent and commit. Watching this in the prototype against the live-trip scenario is what killed it.",
            },
          ],
        },
        {
          type: 'text',
          body: 'The surviving structure: three stacked sections with accent headers, one shared add-node row above them, and section-scoped drag handles. The RTO section carries an inline info affordance on its button (\"Add as RTO ⓘ\"), because the subset rule is the one constraint an AM cannot infer from layout.',
        },
        {
          type: 'statRow',
          stats: [
            { value: '6 (5 rejected, 1 shipped)', label: 'add-node patterns wireframed' },
            { value: '5', label: 'FTUX mockup versions' },
          ],
        },
        {
          type: 'image',
          frame: 'none',
          src: '/src/assets/work/placement/lofi-rejected-vs-shipped.png',
          alt: 'Lo-fi progression — rejected chip-bank and ghost-row sketches beside the shipped three-button row',
          placeholder: true,
        },
      ],
    },

    // ── STEP 07 ───────────────────────────────────────────────────────────
    {
      id: 'prototype',
      step: 7,
      kicker: 'Prototype',
      navLabel: 'Wired, not drawn',
      ghost: 'LIVE',
      title: 'Every rule in the spec is wired, not described.',
      blocks: [
        {
          type: 'text',
          body: "The canonical deliverable is a single-file, framework-free HTML prototype (`trip-edit-multi-origin.html`) implementing both render modes end-to-end, driven by real trip data shape — the mode branches on `trip.source_nodes.length`, exactly as production would.\n\nBuilding it as one file with two modes, rather than two prototypes, was itself an argument: it proved to engineering that the 94% and the 6% can share one screen, one codebase, and one data contract, with the mode read once at load and immutable for the trip's lifetime.",
        },
        {
          type: 'text',
          body: 'The prototype demonstrates the full interaction set. The 2-click node add with all three role buttons enabled. Validate-on-click with inline errors, including the RTO-subset rule. RTO auto-mirroring on source add and remove.\n\nSection-scoped drag that refuses cross-section moves. The amber RTO section appearing only on ROUND_TRIP. And single-origin mode rendering the legacy layout with an auto-mirrored read-only RTO row.',
        },
        {
          type: 'statRow',
          stats: [
            { value: '2, branched on source_nodes.length', label: 'render modes in one file' },
            { value: '59+', label: 'screen states covered' },
          ],
        },
        {
          type: 'prototype',
          slug: 'placement',
          title: 'Placement & Assignment — live prototype',
          note: 'Both render modes in one file. Open a single-origin trip for the legacy layout, then open a multi-origin trip to see the three-section builder. The 2-click node add, RTO mirroring, and cross-section drag prevention are all live.',
        },
        {
          type: 'image',
          frame: 'browser',
          src: '/src/assets/work/placement/prototype-multi-origin.png',
          alt: 'Prototype — multi-origin mode with three accent-colored sections and the add-node row',
          placeholder: true,
        },
      ],
    },

    // ── STEP 08 ───────────────────────────────────────────────────────────
    {
      id: 'business-aspects',
      step: 8,
      kicker: 'Business Aspects',
      navLabel: 'What it stops',
      ghost: 'TRUST',
      title: 'Corrupt trip data is what billing and payouts are computed from.',
      blocks: [
        {
          type: 'text',
          body: "The business case rests on data integrity, not screen aesthetics. Trip records feed billing, transporter payouts, vehicle utilization reporting, and network planning.\n\nWhen 6% of trips carry fabricated challans or amputated histories, every one of those consumers computes on corrupted input — and because multi-origin concentrates on national lanes (~20% of them), the corruption lands disproportionately on the highest-freight routes.\n\nLegitimizing the 0-challan dispatch as an audited action converts an invisible falsification into a visible, queryable event: finance can now distinguish \"vehicle dispatched empty from hub B\" from \"hub B never happened.\"",
        },
        {
          type: 'text',
          body: "The efficiency case: trip creation cut from minutes to seconds, with source data accuracy moved above 95%{*}.\n\nAt hundreds of trips per AM per week, seconds-per-trip is the unit that compounds — which is why the design's central trade-off was scoped the way it was.\n\nI spent complexity on the 6% and defended the 94% absolutely: the two-render-mode decision means the majority flow carries zero new cost, so the module's aggregate time-per-trip improves even before the multi-origin gains are counted.",
        },
        {
          type: 'text',
          body: "The trade-offs I accepted: the contract snapshot as a hard bound means an AM cannot handle a truly ad-hoc node mid-trip through this screen — that stays an exception process, by design, because an unbounded node picker would reopen the door to improvised data.\n\nDisabling auto-closure for multi-origin trades a small amount of ops-tech manual effort (explicit loop close with a confirmation modal) against the cost of prematurely closed trips corrupting completion data — the same class of corruption this project exists to end.\n\nConstraints that prevent bad data are the product here.",
        },
        {
          type: 'statRow',
          stats: [
            { value: 'minutes → seconds; accuracy >95%', label: 'efficiency gains', fuzzed: true },
            { value: '~20% of national lanes', label: 'lane exposure' },
          ],
        },
      ],
    },
  ],

  spotlights: [
    {
      decision:
        'Node Code dropdown + three always-enabled role buttons (Add as Source · Add as Destination · Add as RTO ⓘ), validate on click with specific inline errors. 2 clicks per add.',
      rejected:
        'Five patterns across three failure axes: chip-bank (comprehension), ghost row (throughput), smart-disable (comprehension), order-inference (correctness), auto-commit (live-trip safety).',
      why: "The pattern in the failures: three died on comprehension, one on throughput, one on safety. The shipped design is the only candidate that passed all three axes at once. Always-enabled + validate-on-click turns the RTO-subset rule into a teachable moment at the instant of intent — a disabled button would have communicated impossibility without explaining it.",
    },
    {
      decision:
        'One screen, two layouts, branched on `trip.source_nodes.length` at page load; the mode is immutable for that trip. Single-origin renders near-identical to the current production screen.',
      rejected:
        'A single unified layout where every trip shows the three-section structure, and a live-switching variant where the layout upgrades if a second source is added mid-session.',
      why: 'The unified layout taxes the 94%: every single-origin AM parses three sections to use one. Live-switching lets the screen restructure under his hands mid-edit, which is dangerous on a live trip.',
    },
    {
      decision:
        'The AM can add only nodes present in the immutable contract snapshot captured at trip creation, and no node changes role post-creation. Cross-section drag is physically impossible.',
      rejected:
        'A free node picker over the full node master, with role reassignment allowed during edit.',
      why: 'An unbounded picker recreates the original disease in a new body — improvised data diverging from the contracted route, exactly what the fake challans were. The snapshot collapses validation from "is this arbitrary graph legal?" to "is this node in a known set?", and keeps genuine ad-hoc changes in the exception process.',
    },
    {
      decision:
        'Adding a node to Source auto-adds it to RTO; removing auto-removes. The AM\'s only manual RTO action is removal — excluding an origin from return freight.',
      rejected: 'Fully manual RTO management, where the AM builds the RTO list node by node.',
      why: 'RTO must be a subset of Source, and the common case is "return freight goes back to every origin". Manual management makes the AM re-enter what the system knows, and opens a failure mode the mirror makes unrepresentable.',
    },
    {
      decision:
        'Auto-close on RTO arrival is disabled for NLH multi-origin — closure requires an explicit loop-close action with a confirmation modal listing any open origins. Zero-freight dispatch is a first-class audited action.',
      rejected:
        'Keeping the existing auto-close rule uniform across trip types, and treating zero-freight dispatch as an edge case to discourage rather than support.',
      why: "Forward and return node orders can differ, so the first RTO arrival does not mean the trip is done — auto-close would close trips early and corrupt completion data. The fake 0-bag challan existed because \"this hub has no freight today\" is a real state the tool refused to express. Fabricated data needs a logged path, not stricter walls.",
    },
  ],

  reflections: [
    {
      title: 'The most important design work was rejection, and rejection is slow.',
      body: 'I built or wireframed six add-node patterns to ship one. The ghost row and the chip-bank were each "done" at some point before a test case killed them.',
    },
    {
      title: 'Naming the evaluation axes up front turned days into hours.',
      body: 'Comprehension, throughput, live-trip safety. Once those three were explicit, a pattern only had to fail one of them to die.',
    },
    {
      title: 'I should have forced the data conversation before building, not after.',
      body: 'The design assumes the contract snapshot stores source and destination roles separately. That was still awaiting engineering confirmation when the prototype shipped for review.',
    },
    {
      title: '"The 94% pay nothing" sounded like a limitation and behaved like a compass.',
      body: 'Nearly every rejected pattern died against it, and the two-render-mode architecture exists only because that constraint made a unified layout unshippable.',
    },
  ],

  next: {
    slug: 'transporter-panel',
    title: 'The Transporter Panel',
    code: 'TPN-01',
  },
}
