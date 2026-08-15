/**
 * PLC-05 — Placement & Assignment — the Multi-Origin Route Builder
 * Typed CaseStudy object converted from content/case-studies/04-placement-multi-origin.md
 * IMG blocks point at placeholder paths; placeholder:true triggers the "asset pending" frame.
 * {*} markers preserved verbatim in all body strings — rendered as <Asterisk /> by BlockRenderer.
 *
 * Structure and length follow ADR-005; the worked example is transporter-panel.tsx. One claim,
 * one home, and a decision argued once — the spotlights carry the reasoning, the chapters state
 * what shipped. The `rejected` block in STEP 06 is the densest evidence here; keep all five.
 *
 * VOCABULARY, settled 2026-08-16 — three parallel namings had drifted through this file.
 * Use **node** (matches `source_nodes` and the section names), not "stop". Use **RTO** (matches
 * the shipped button `Add as RTO`), not "return stop", and gloss it once as the return leg. An
 * earlier find/replace also left the broken phrase "the first the return stop arrival"; fixed.
 * Checked with `npm run count:copy PLC` and `npm run check:facts check PLC`.
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
      'The trip-edit screen assumed one source node per trip, so ops teams handling multi-origin routes faked zero-bag challans or deleted and recreated live trips — both flagged in the requirements doc as data corruption.',
    outcomes: [
      'Multi-origin trips became a single editable record — both workarounds were designed out',
      'Node add reduced to 2 clicks; the 94% single-origin flow kept its existing layout with zero added steps',
      'Trip creation cut from minutes to seconds, with source data accuracy moved above 95%',
    ],
    stats: [{ value: '2→0' }, { value: '2-click' }, { value: '>95%', fuzzed: true }],
    summary:
      'One vehicle collecting from several hubs becomes one trip record with explicit node roles, bounded by an immutable contract. The single-origin majority sees the layout it already knows.',
  },

  chapters: [
    // ── STEP 01 ───────────────────────────────────────────────────────────
    {
      id: 'problem-understanding',
      step: 1,
      navLabel: 'Faking it',
      ghost: 'FAKE',
      title: 'The tool could not express reality, so the ground invented one.',
      blocks: [
        {
          type: 'text',
          body: 'The trip-edit screen assumed a trip collects from exactly one place. That holds for roughly 94% of trips.',
        },
        {
          type: 'text',
          body: 'It fails on national linehaul, where one vehicle collects from two or more hubs before the destination.\n\nAbout 6% of trips — but roughly 20% of national lanes, because multi-origin concentrates on the long hauls carrying the most freight.',
        },
        {
          type: 'text',
          body: 'The tool could not express that, so ground teams invented two workarounds. The requirements document named both as data corruption.',
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
              body: 'Raise a dispatch note for nothing at the extra hub, so the system lets the vehicle through. A fabricated document enters the freight record, and everything downstream reads it as real.\n\nIt existed because "this hub has no freight today" is a real situation the tool refused to express.',
            },
            {
              label: 'Who pays for it',
              body: 'Billing, utilisation reporting and transporter payouts are all computed from these records. A minority of trips were quietly falsifying the input to all three.',
            },
          ],
        },
        {
          type: 'text',
          body: 'The constraint that shaped everything: the fix could not tax the majority. A planner touches hundreds of trips a week, and 94% of them collect from one place.',
        },
        {
          type: 'text',
          body: 'One extra click, field, or moment of "which mode am I in?" would cost more in aggregate than the 6% problem it solved.',
        },
        {
          type: 'statRow',
          stats: [
            { value: '~6% of trips, ~20% of national lanes', label: 'multi-origin share' },
            { value: '2', label: 'workarounds — delete-and-recreate, and fake 0-bag challans' },
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
      navLabel: 'The 94% rule',
      ghost: '94%',
      title: 'Make the 6% expressible without charging the 94% a single click.',
      blocks: [
        {
          type: 'statementBand',
          eyebrow: 'The constraint, stated first',
          statement:
            'How might one vehicle collecting from several hubs become one honest trip record, without adding a single step for the 94% of trips that collect from one?',
        },
        {
          type: 'text',
          body: 'One target, one guard-rail. A multi-origin route becomes one trip record with explicit node roles.\n\nThe single-origin flow gains zero clicks, fields or decisions.',
        },
        {
          type: 'wordList',
          title: 'Four requirements from the KRD, and one I added',
          items: [
            { word: 'Three node sections', note: 'Source, Destination and RTO — the return leg.' },
            { word: 'Bounded by the contract', note: 'Only nodes on its stop list, and no role changes after creation.' },
            { word: 'RTO mirrors collection', note: 'Return nodes are always drawn from the source nodes.' },
            { word: 'Reordering stays in section', note: 'Drag within a section, never across one.' },
            {
              word: 'An interaction budget — mine',
              note: 'Adding a node costs at most 2 clicks. A planner adding a fourth should not pay a per-node tax a one-node form never charged.',
            },
          ],
          highlight: 4,
        },
        {
          type: 'text',
          body: 'The success measures were direct: both workarounds become unnecessary, trip creation drops from minutes to seconds{*}, and source data accuracy moves above 95%{*}.',
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
      navLabel: 'Seconds per trip',
      ghost: 'SPEED',
      title: 'He measures the tool in seconds, because his week is trips times seconds.',
      blocks: [
        {
          type: 'text',
          body: 'An Assignment Manager inside Valmo operations, handling hundreds of routes a week.\n\nBulk-uploading templates, fixing failures, assigning vehicles and drivers, editing live trips when the ground shifts.',
        },
        {
          type: 'text',
          body: 'A power user in the strict sense. He knows the vocabulary better than the tool does.',
        },
        {
          type: 'insightNotes',
          title: 'Three traits, and what each one ruled out',
          notes: [
            'Throughput dominates — any pattern adding steps to a repeated action gets felt hundreds of times a week',
            'He edits live trips — a vehicle may already be on the road, so nothing commits without an explicit gate',
            'He is the victim of the workaround, not its villain — the fake challans were the only move the tool allowed',
          ],
        },
        {
          type: 'text',
          body: 'That third one reframed the project. When a competent operator fabricates data, the tool’s model of reality is wrong, not the operator.',
        },
        {
          type: 'text',
          body: 'I checked the mental model against the screen he already uses daily — source node at the top of Trip Overview, destination list below.\n\nHis muscle memory is an asset the redesign was not allowed to spend.',
        },
        {
          type: 'statRow',
          stats: [{ value: 'hundreds of routes and trips/week', label: 'his weekly volume' }],
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
      navLabel: 'Three roles',
      ghost: 'ROLES',
      title: 'Three node roles, and a contract that bounds them.',
      blocks: [
        {
          type: 'text',
          body: 'The IA question was where "which hub plays which role" lives. The answer is a three-layer structure with one immutable anchor.',
        },
        {
          type: 'text',
          body: 'The anchor is the **contract’s stop list** — nodes and their roles (`FIRST_ORIGIN` / `SUBSEQUENT_ORIGIN`) captured at trip creation. Everything the planner can do is bounded by it.',
        },
        {
          type: 'matrix',
          title: 'Two render modes, decided once at page load',
          columns: ['`trip.source_nodes.length`', 'What renders'],
          rows: [
            [
              'One',
              'The existing single-origin layout — source in Trip Overview, simple destination list, the RTO row mirrored automatically and read-only.',
            ],
            [
              'Two or more',
              'Three sections: Source Nodes (indigo), Destination Nodes (teal), RTO Nodes (amber, on round trips only). Accents always pair with a text label.',
            ],
          ],
          totalNote:
            'Around the screen sits the trip lifecycle — Action Required → Upcoming → Ongoing/In-Transit → Completed → Cancelled. RFQ auto-trips arrive locked and flagged "Auto-Generated", with only vehicle and driver editable, so the IA distinguishes trips the planner authored from trips the system did.',
        },
        {
          type: 'statRow',
          stats: [{ value: '3', label: 'node sections in multi-origin mode — Source · Destination · RTO' }],
        },
        {
          type: 'image',
          frame: 'none',
          src: '/src/assets/work/placement/ia-contract-snapshot.png',
          alt: 'IA diagram — contract stop list bounding the edit screen, two render modes branching from source_nodes.length',
          placeholder: true,
        },
      ],
    },

    // ── STEP 05 ───────────────────────────────────────────────────────────
    {
      id: 'user-flow',
      step: 5,
      navLabel: 'Two clicks',
      ghost: 'TWO',
      title: 'Adding a node had to cost two clicks, however many nodes there were.',
      blocks: [
        {
          type: 'text',
          body: 'He opens a trip; the page reads `source_nodes.length` once and renders the matching mode. In multi-origin he sees the three sections, plus one add-node row.',
        },
        {
          type: 'text',
          body: 'A node dropdown and three always-live role buttons: `Add as Source`, `Add as Destination`, `Add as RTO`. Pick a node, click a role. Two clicks.',
        },
        {
          type: 'text',
          body: 'Validation runs on the click, not before. An illegal action raises a specific inline error at the point of action — "RTO must be a subset of Source" — and nothing commits.',
        },
        {
          type: 'text',
          body: 'Reordering is drag within a section. Dragging across sections is impossible by construction, which enforces the no-role-change rule physically rather than through an error message.',
        },
        {
          type: 'text',
          body: 'Two rules automate the round trip: adding a node to Source auto-adds it to RTO, and removing a source node removes its return too.\n\nHe touches RTO only for the one real decision it holds — excluding an origin from return freight.',
        },
        {
          type: 'text',
          body: 'Downstream, the flow legitimises what the workarounds faked. If a hub genuinely has no freight, he dispatches with a 0-challan — an explicit, audited action rather than a fabricated document.',
        },
        {
          type: 'text',
          body: 'Loop close raises a confirmation modal listing any still-open origins.\n\nAuto-closure on RTO arrival is disabled here, because forward and return orders can differ — closing on the first RTO arrival would close a trip that isn’t done.',
        },
        {
          type: 'statRow',
          stats: [{ value: '2 clicks', label: 'pick a node, click a role' }],
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
      navLabel: 'Six, to ship one',
      ghost: 'SIX',
      title: 'I built six add-node patterns to ship one.',
      blocks: [
        {
          type: 'text',
          body: 'I wireframed each candidate and walked it against two test cases: "AM adds the third origin to a live round-trip", and "AM edits a single-origin trip he\'s edited a hundred times before."',
        },
        {
          type: 'text',
          body: 'Five failed one or both.',
        },
        {
          type: 'rejected',
          items: [
            {
              pattern: 'Chip-bank ("Available from contract" chips)',
              reason:
                'One click, cheapest on paper — but it exposes contract internals before he knows what is already in the trip, and the pattern exists nowhere else in the create flow.',
            },
            {
              pattern: 'Ghost row per section',
              reason:
                '3 clicks per add. On a route with four origins and three destinations that is a 50% click tax on every node, felt hundreds of times a week.',
            },
            {
              pattern: 'Smart enable/disable on role buttons',
              reason:
                'Creates "why can\'t I click this?" — a disabled button says an action is impossible, not why.',
            },
            {
              pattern: 'Order-based role inference',
              reason:
                'Breaks in edit mode, where "first" is meaningless, and structurally blocks adding a second source — the entire use case.',
            },
            {
              pattern: 'Auto-commit on dropdown selection',
              reason:
                'Zero-confirmation mutation of a live trip. Watching it in the prototype against the live-trip scenario is what killed it.',
            },
          ],
        },
        {
          type: 'text',
          body: 'What survived: three stacked sections with accent headers, one shared add-node row above them, and section-scoped drag handles.',
        },
        {
          type: 'text',
          body: 'The RTO button carries an inline info affordance — "Add as RTO ⓘ" — because the subset rule is the one constraint a planner cannot infer from layout.',
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
      navLabel: 'Wired, not drawn',
      ghost: 'LIVE',
      title: 'Every rule in the spec is wired, not described.',
      blocks: [
        {
          type: 'text',
          body: 'A single-file, framework-free HTML prototype — `trip-edit-multi-origin.html` — implementing both render modes end-to-end on the real trip data shape.',
        },
        {
          type: 'text',
          body: 'Building it as one file with two modes, rather than two prototypes, was itself the argument.\n\nIt proved to engineering that the 94% and the 6% can share one screen, one codebase and one data contract.',
        },
        {
          type: 'text',
          body: 'Wired, not described: the 2-click add with all three role buttons live, validate-on-click with inline errors, RTO mirroring on source add and remove.\n\nDrag that refuses cross-section moves, the amber RTO section only on `ROUND_TRIP`, and single-origin mode rendering the legacy layout.',
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
          note: 'Open a single-origin trip for the legacy layout, then a multi-origin trip for the three-section builder. The 2-click add, the RTO mirroring and cross-section drag prevention are all live.',
        },
        {
          type: 'image',
          frame: 'browser',
          src: '/src/assets/work/placement/prototype-multi-origin.png',
          alt: 'Prototype — multi-origin mode with three accent-coloured sections and the add-node row',
          placeholder: true,
        },
      ],
    },

    // ── STEP 08 ───────────────────────────────────────────────────────────
    {
      id: 'business-aspects',
      step: 8,
      navLabel: 'What it stops',
      ghost: 'TRUST',
      title: 'Corrupt trip data is what billing and payouts are computed from.',
      blocks: [
        {
          type: 'text',
          body: 'Trip records feed billing, transporter payouts, vehicle utilisation reporting and network planning.\n\nWhen 6% carry fabricated challans or amputated histories, every one of those computes on corrupted input.',
        },
        {
          type: 'text',
          body: 'And because multi-origin concentrates on national lanes, the corruption lands disproportionately on the highest-freight routes.',
        },
        {
          type: 'text',
          body: 'Legitimising the 0-challan dispatch converts an invisible falsification into a queryable event. Finance can now tell "vehicle dispatched empty from hub B" from "hub B never happened".',
        },
        {
          type: 'text',
          body: 'On efficiency, seconds-per-trip is the unit that compounds at his volume.\n\nThat is why the central trade-off was scoped the way it was, and why the majority flow carries zero new cost.',
        },
        {
          type: 'text',
          body: 'The trade-offs I accepted: a truly ad-hoc node mid-trip cannot be handled on this screen.\n\nThat stays an exception process by design — an unbounded picker would reopen the door to improvised data.',
        },
        {
          type: 'text',
          body: 'And disabling auto-closure trades a little manual ops effort against prematurely closed trips corrupting completion data — the same class of corruption this project exists to end.',
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
      decision: 'A node dropdown plus three always-live role buttons, validated on click. Two clicks to add.',
      rejected: 'Five patterns, each failing on comprehension, throughput or live-trip safety.',
      why: 'Three died on comprehension, one on speed, one on safety. Keeping every button live turns the RTO subset rule into something he learns at the moment he needs it.',
    },
    {
      decision: 'One screen, two layouts, decided at page load and fixed for that trip.',
      rejected: 'One layout showing all three sections to everyone; or one that rearranges when a second origin is added.',
      why: 'One layout for everyone taxes the 94%. Rearranging mid-edit moves the screen under his hands while he changes a trip already on the road.',
    },
    {
      decision: 'Only nodes on the contract, and no role changes afterwards. Cross-section drag is impossible.',
      rejected: 'A free picker over every node in the system, with roles reassignable while editing.',
      why: 'An open picker recreates the original disease in a new body. Working from the contract turns validation from "is this route legal?" into "is this node on the contract?"',
    },
  ],

  reflections: [
    {
      title: 'The most important design work was rejection, and rejection is slow.',
      body: 'The ghost row and the chip-bank were each "done" at some point, before a test case killed them.',
    },
    { title: 'Naming the evaluation axes up front turned days into hours.' },
    {
      title: 'I should have forced the data conversation before building, not after.',
      body: 'The design assumes the contract stores source and destination roles separately. That was still awaiting engineering confirmation when the prototype shipped for review.',
    },
    { title: '"The 94% pay nothing" sounded like a limitation and behaved like a compass.' },
  ],

  next: {
    slug: 'transporter-panel',
    title: 'The Transporter Panel',
    code: 'TPN-01',
  },
}
