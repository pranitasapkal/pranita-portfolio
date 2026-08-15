/**
 * NDC-02 — Network Design Central
 * Typed CaseStudy object converted from content/case-studies/01-network-design-central.md
 * IMG blocks point at placeholder paths; placeholder:true triggers the "asset pending" frame.
 * {*} markers preserved verbatim in all body strings — rendered as <Asterisk /> by BlockRenderer.
 */
import type { CaseStudy } from '../types'
import { summaries } from './summaries'

export const ndc: CaseStudy = {
  ...summaries['network-design-central'],
  title: 'Network Design Central',
  oneLiner: 'The solver designs the routes. I designed the agreement.',
  eyebrow: 'VALMO (MEESHO) · INTERNAL OPS PANEL · 0→1',
  domain: 'Network planning',
  scale: '~80 depots · 10,000+ delivery centres',
  meta: {
    role: 'Product Designer — solo design owner',
    team: 'Product, Data Science, Analytics, Tech (linehaul pod)',
    timeline: 'TBC',
    platform: 'Desktop web ops panel (internal)',
    skills: ['Product Design', 'Information Architecture', 'Systems Design', 'Interaction Design'],
  },
  tldr: {
    problem:
      'Monthly regional-linehaul network planning ran on Google Sheets with no shared state between the central planner who generates route designs and the dozens of regional ops leads who must agree to them before an irreversible monthly freeze.',
    outcomes: [
      'Clicks to start the primary task cut from 5 to ≤2',
      '6 conflicting status vocabularies collapsed into 1 canonical lifecycle',
      'Time-to-orient target of <30 seconds on the Command Center, enforced by design',
    ],
    stats: [{ value: '5→≤2' }, { value: '6→1' }, { value: '<30s' }],
    summary:
      'I designed a net-new desktop workbench where a central planner triggers routing runs, compares them, and drives a structured row-by-row alignment loop with regional ops leads to a guarded, irreversible freeze. 13 locked design decisions and 2 ADRs turned an unstructured monthly negotiation into a repeatable ritual with one status language.',
  },

  chapters: [
    // ── STEP 01 ───────────────────────────────────────────────────────────
    {
      id: 'problem-understanding',
      step: 1,
      kicker: 'Problem Understanding',
      navLabel: 'The bottleneck',
      ghost: 'AGREE',
      title: 'The solver was never the bottleneck. Agreement was.',
      blocks: [
        {
          type: 'text',
          body: 'Every month, Valmo redesigns the long-distance leg of its delivery network: which vehicle leaves which depot, visiting which delivery points, in what order.\n\nAt the scale in scope — around 80 depots, 10,000+ delivery points, hundreds of planning runs a cycle{*} — a routing model — a solver — already produced the designs.\n\nComputation was never the bottleneck.\n\nAt the scale in scope — ~80 depots, 10,000+ delivery centres, hundreds of routing runs per cycle{*} — a data-science solver already produced the designs.\n\nComputation was never the bottleneck.',
        },
        {
          type: 'text',
          body: 'The bottleneck was agreement. The model\'s output is a proposal; the people who know whether a route is actually drivable are dozens of regional operations leads, each expert in their own depot.\n\nBefore the tool that negotiation ran across disconnected spreadsheets — exported, mailed around, edited contradictorily, reconciled by hand against a deadline after which the design becomes a vendor contract.\n\nIn one recent cycle, 32 delivery points silently fell out of coverage across around 10 depots, because impossible vehicle inputs never reached anyone who could catch them.\n\nBefore the tool that negotiation ran across disconnected Google Sheets — exported, mailed around, edited contradictorily, reconciled by hand against a deadline after which the design becomes a vendor contract.\n\nIn one recent cycle, 32 delivery centres silently fell out of coverage across ~10 depots because infeasible vehicle inputs never reached anyone who could catch them.',
        },
        {
          type: 'text',
          body: 'I audited the PM-built prototype meant to replace this and found a feature inventory, not a tool. A planner could not answer three questions: what is happening across my network, what needs me, and where did I leave off.',
        },
        {
          type: 'problemTabs',
          items: [
            {
              label: 'An empty dashboard',
              body: 'Three navigation cards and nothing else. The screen a planner lands on every morning held no state, no queue and no deadline — so orientation happened somewhere other than the tool.',
            },
            {
              label: 'An invisible pipeline',
              body: 'Inputs → Creation → Review → Alignment existed in the requirements and nowhere in the interface. Nothing enforced the order, so a planner could push a design built on inputs that were never validated.',
            },
            {
              label: 'Six vocabularies for one lifecycle',
              body: 'Six modules had each invented their own words for the same states. Amber alone meant four different things depending on the screen, which makes a status colour worse than none.',
            },
            {
              label: 'Two roles in one shell',
              body: 'A central planner and a regional reviewer shared one interface with a role switch. An agreement process only works if reviewers physically cannot touch inputs, runs, or another region\'s plan.',
            },
          ],
        },
        {
          type: 'text',
          body: 'So I reframed it. The tool\'s job isn\'t producing route designs — the model does that. Its job is getting dozens of regional leads to agree with one central planner before a deadline that cannot be undone. **Designing the panel meant designing the ritual.**',
        },
        {
          type: 'statRow',
          stats: [
            { value: '~80', label: 'depots' },
            { value: '10,000+', label: 'delivery centres', fuzzed: true },
          ],
        },
        {
          type: 'image',
          frame: 'none',
          src: '/src/assets/work/ndc/before-spreadsheet.png',
          alt: 'Before state — solver output living in a Google Sheets export, no shared state',
          placeholder: true,
        },
      ],
    },

    // ── STEP 02 ───────────────────────────────────────────────────────────
    {
      id: 'objective',
      step: 2,
      kicker: 'Objective',
      navLabel: 'The targets',
      ghost: 'TARGET',
      title: 'I wrote the targets before I drew a screen.',
      blocks: [
        {
          type: 'statementBand',
          eyebrow: 'The problem, stated',
          statement:
            'How might one central planner and dozens of regional ops leads reach a shared, checkable agreement before a freeze that cannot be undone?',
        },
        {
          type: 'text',
          body: 'I set measurable targets in the spec before touching a screen, because "make it usable" is not a brief.\n\n**Time-to-orient** — the state of the network understood in under 30 seconds. Previously unmeasurable, because the dashboard held nothing.\n\n**Clicks to primary task** — creating a route design, from 5 to ≤2.\n\n**Status vocabularies** — from 6 to 1. Amber alone had meant four different things.\n\n**"Where is design X?"** — answerable from one view. All four states — empty, loading, error, populated — defined on every screen.',
        },
        {
          type: 'statRow',
          stats: [
            { value: '5 → ≤2', label: 'clicks to primary task' },
            { value: '6 → 1', label: 'status vocabularies' },
            { value: '<30s', label: 'time-to-orient target' },
          ],
        },
        {
          type: 'text',
          body: 'Behind these sat the business objective: make model-led planning the default, targeting a double-digit gain in how full each vehicle runs and a shorter average route{*}.\n\nMy design targets sit deliberately upstream — if the planner can\'t orient, compare runs and close agreement before the deadline, no routing improvement ships.\n\nMy design metrics sit deliberately upstream — if the planner can\'t orient, compare runs and close alignment before the freeze, no solver improvement ships.',
        },
        {
          type: 'image',
          frame: 'none',
          src: '/src/assets/work/ndc/objective-table.png',
          alt: 'Objective table from the redesign spec — five measurable targets with current-state baselines',
          placeholder: true,
        },
      ],
    },

    // ── STEP 03 ───────────────────────────────────────────────────────────
    {
      id: 'user-persona',
      step: 3,
      kicker: 'User Persona',
      navLabel: 'Two shells',
      ghost: 'ROLES',
      title: 'Two users, and letting them share a shell was the mistake.',
      blocks: [
        {
          type: 'text',
          body: 'Two users, and the most consequential decision was refusing to let them share one interface.',
        },
        {
          type: 'text',
          body: 'The inherited prototype used a role toggle inside one shared interface. I locked the opposite: real per-user login and two different shells — the regional lead sees only the agreement screen and the map.\n\nThe prototype keeps a labelled "Demo: view as…" switch, because a prototype has no login. This is a trust decision as much as a design one.\n\nThe prototype keeps a labelled "Demo: view as…" switch, because a prototype has no auth. This is a trust decision as much as a UX one.',
        },
        {
          type: 'matrix',
          title: 'Two users who need opposite things from the same data',
          columns: ['', 'Central Network Planner', 'Ops Lead / Regional PoC'],
          rows: [
            ['How many', 'One, for the whole network', '3–4 per depot'],
            ['Owns', 'Inputs, runs, comparison, the freeze', 'Judgement about their own region'],
            ['Scarce resource', 'Situational awareness across ~80 depots', 'Time — this is not their main job'],
            ['Should see', 'Everything, densely', 'One plan and a map. Nothing else.'],
            ['Shipped as', 'Full planner shell', 'Stripped shell — Ops Alignment and the map'],
          ],
          totalNote:
            'The PM prototype gave both a persona toggle inside one interface. Production is per-user login with two different shells.',
        },
        {
          type: 'statRow',
          stats: [
            { value: '3–4', label: 'ops leads per depot' },
          ],
        },
        {
          type: 'image',
          frame: 'browser',
          src: '/src/assets/work/ndc/two-shell-ia.png',
          alt: 'Two-shell IA diagram: Planner view (full nav) vs Ops Lead view (Alignment + map only)',
          slug: 'pranita.design/ndc/ia',
          placeholder: true,
        },
      ],
    },

    // ── STEP 04 ───────────────────────────────────────────────────────────
    {
      id: 'information-architecture',
      step: 4,
      kicker: 'Information Architecture',
      navLabel: 'One spine',
      ghost: 'SPINE',
      title: 'One spine, one vocabulary, one place for navigation.',
      blocks: [
        {
          type: 'text',
          body: 'The IA had to make the ritual legible in the navigation itself. Three moves did most of the work.\n\n**One spine: the design lifecycle.** Every design carries one stage — Draft → Running → Created → In Review → Pushed → In Alignment → Acknowledged → Finalised — and every screen reads from it.\n\nThe pipeline chips, the runs view and each module are projections of the same state, under one vocabulary with one rule: **amber means "needs a human decision" and nothing else.**',
        },
        {
          type: 'text',
          body: '**One container per month.** A Design Cycle — the month’s named plan group — scopes every upload, run and agreement, capped at 80 runs. Without it, hundreds of runs a cycle{*} become an undifferentiated archive.\n\n**Navigation lives in the sidebar, and only there.** The planner\'s shell reads as the ritual in order: Command Center → Design Inputs → Design Creation → Review & Alignment → Runs → Help.\n\nAn earlier build also drew a horizontal strip of the same stages above every module, duplicating the sidebar. I deleted it. Switching module is infrequent and belongs in the sidebar; filtering is frequent and belongs in the content.\n\n**Nav lives in the sidebar, and only there.** The Planner shell reads as the ritual in order: Command Center → Design Inputs → Design Creation → Review & Alignment → Runs → Help.\n\nADR-002 records the correction: an earlier build also drew a horizontal "lifecycle rail" above every module, duplicating the sidebar. I deleted it. Module switching is infrequent and belongs in the sidebar; filters are frequent and belong in the content.',
        },
        {
          type: 'statRow',
          stats: [
            { value: '13', label: 'decisions locked before hi-fi' },
            { value: '2', label: 'architecture decisions (ADRs)' },
          ],
        },
        {
          type: 'image',
          frame: 'browser',
          src: '/src/assets/work/ndc/lifecycle-diagram.png',
          alt: 'Lifecycle state diagram: Draft through Finalised, with single status vocabulary overlay',
          slug: 'pranita.design/ndc/lifecycle',
          placeholder: true,
        },
      ],
    },

    // ── STEP 05 ───────────────────────────────────────────────────────────
    {
      id: 'user-flow',
      step: 5,
      kicker: 'User Flow',
      navLabel: 'The month',
      ghost: 'CYCLE',
      title: 'The month is the flow.',
      blocks: [
        {
          type: 'text',
          body: 'The monthly ritual, end to end, with real cycle anchors: volume data lands around the 10th; design due early the next month; a one-week feedback window; freeze; finalise within three days of freeze.',
        },
        {
          type: 'flow',
          steps: [
            'Gate the inputs — upload volume files and masters; a read-only node surfaces only flagged warnings as a pre-plan gate. Exit is an explicit success state: "✓ Inputs clean · Start Design Creation" — a gate you can\'t see pass is a gate people route around.',
            'Trigger runs — select depots, pick a volume file, set vehicles and Historical Weight (a 0 / 0.5 / 1 dial for how much of last month\'s routes to preserve versus re-optimize). Each run is one async solver job per depot per weight value.',
            'Compare and choose — Design Review shows per-run metrics (coverage, cost per shipment, utilization, routes, vehicles, distance) with a mandatory side-by-side of the three Historical-Weight runs. No reject button — an un-pushed run is a discarded simulation.',
            'Push to alignment — name reviewers (PoCs from the sort-centre master); the plan appears in each Ops Lead\'s stripped shell.',
            'Row-by-row feedback — Ops Leads mark each route Pending / Aligned / Needs Change / Blocker and flag specific cells — vehicle type, coordinates, touchpoints, cutoffs — with suggested corrections.',
            'Simulate, decide, freeze — planner runs Simulate per row (metric deltas only), accepts or rejects each suggestion, then Acknowledges — the irreversible freeze that locks every reviewer — and Finalises. The finalised design hands off downstream as vendor contracts.',
          ],
        },
        {
          type: 'statRow',
          stats: [
            { value: '~1 week', label: 'feedback window (push → freeze)' },
          ],
        },
        {
          type: 'image',
          frame: 'none',
          src: '/src/assets/work/ndc/flow-end-to-end.png',
          alt: 'End-to-end monthly ritual flow diagram with cycle milestone anchors',
          placeholder: true,
        },
      ],
    },

    // ── STEP 06 ───────────────────────────────────────────────────────────
    {
      id: 'lo-fi-wireframes',
      step: 6,
      kicker: 'Lo-fi Wireframes',
      navLabel: 'The cockpit',
      ghost: 'LO-FI',
      title: 'The dashboard held three cards. It needed a cockpit.',
      blocks: [
        {
          type: 'text',
          body: 'I wireframed twice — once to inventory the PM prototype, once to restructure it around the ritual — and ranked the top 10 fixes before any hi-fi work. Structure first, because most of what was wrong was structural.\n\nThe wireframe that mattered was the **Command Center**. Three nav cards became a cockpit answering the planner\'s three questions in fixed positions.\n\nA deadline-health hero ("18 days to freeze · At risk"). A "Needs You" queue where every item requires the planner. Pipeline chips that filter rather than decorate. And a Start Something strip putting run creation ≤2 clicks from landing.',
        },
        {
          type: 'text',
          body: '**The grouping rule.** At this scale a flat list of 80+ items is a design failure, so every list groups by depot or zone with roll-up headers, collapsible groups, filters and "showing N of M". This did more for orientation than any visual treatment.\n\n**Unified wizard chrome.** Three multi-step flows had each invented their own stepper. One pattern replaced them — stepper on top, body, persistent footer with validation bottom-left and the primary action bottom-right, later steps locked until earned. Locked steps are the dependency model made physical.',
        },
        {
          type: 'statRow',
          stats: [
            { value: 'top 10', label: 'prioritized fixes (P0–P2)' },
          ],
        },
        {
          type: 'image',
          frame: 'browser',
          src: '/src/assets/work/ndc/command-center-lofi.png',
          alt: 'Command Center lo-fi wireframe: deadline-health hero, Needs You queue, pipeline chips, Start Something strip',
          slug: 'pranita.design/ndc/wireframes',
          placeholder: true,
        },
      ],
    },

    // ── STEP 07 ───────────────────────────────────────────────────────────
    {
      id: 'prototype',
      step: 7,
      kicker: 'Prototype',
      navLabel: 'At real scale',
      ghost: 'SCALE',
      title: 'I prototyped at eighty depots, not five.',
      blocks: [
        {
          type: 'text',
          body: 'The deliverable is a single-file interactive prototype — the full panel, both shells, on seeded data at realistic scale: 80 depots, 239 runs, 11,500 delivery points, 41 plans.\n\nI prototype at scale deliberately: a design that works with five mock rows tells you nothing about a tool whose whole problem is eighty.\n\nTwo rules governed it. **No dead controls** — every button and filter is wired, and anything needing a backend says "coming soon" rather than failing silently. And **every list ships grouped**, with breadcrumbs back to the user\'s home screen.\n\nI prototype at scale deliberately: a design that works with 5 mock rows tells you nothing about a tool whose whole problem is 80.\n\nTwo rules governed it. **No dead controls** — every button and filter is wired, and backend-dependent writes surface an honest "coming soon" rather than silence. And **every list ships grouped** per the Step-06 convention, with breadcrumbs back to the persona\'s home.',
        },
        {
          type: 'statRow',
          stats: [
            { value: '~80', label: 'depots (seeded)' },
            { value: '~239', label: 'routing runs' },
            { value: '~11.5k', label: 'delivery centres' },
            { value: '~41', label: 'plans' },
          ],
        },
        {
          type: 'prototype',
          slug: 'ndc',
          title: 'Network Design Central — live prototype',
          note: 'Seeded with demo data at realistic scale. Use the "Demo: view as Ops Lead" switch in the panel header to explore both persona shells. All interactions are wired — backend-dependent writes surface a "coming soon" toast.',
        },
        {
          type: 'text',
          body: 'Visual system: Meesho\'s internal design system{*} with the product\'s navy override, dense tables, WCAG 2.1 AA contrast, and status never carried by colour alone.\n\nOnboarding is deliberately sparing: a four-step dismissible tour plus tooltips on the six genuinely non-obvious ideas.\n\nOnboarding is sparing by locked decision: a 4-step dismissible tour plus tooltips on the six genuinely non-obvious concepts.',
        },
      ],
    },

    // ── STEP 08 ───────────────────────────────────────────────────────────
    {
      id: 'business-aspects',
      step: 8,
      kicker: 'Business Aspects',
      navLabel: 'What pays for it',
      ghost: 'COST',
      title: 'A design only saves money if it survives alignment intact.',
      blocks: [
        {
          type: 'text',
          body: 'The tool exists to make model-led planning the default, and the model exists to cut cost per parcel — a double-digit utilisation target and a shorter average route{*}.\n\nBut the metric that pays for those is human: a design realises its modelled savings only if it survives agreement intact and freezes on time.\n\nThe programme tracks how many routes reach the contract stage unchanged, which is why I treated the agreement loop, not the planning screens, as the highest-leverage surface.\n\nBut the metric that pays for those is human: a design realizes its modelled savings only if it survives alignment intact and freezes on time.\n\nThe programme tracks how many routes reach the contract stage unmodified, which is why I treated the alignment loop, not the solver UI, as the highest-leverage surface.',
        },
        {
          type: 'text',
          body: '**Changing a route costs real money**: routes become vendor contracts, so every changed route triggers a re-negotiation — which is why the controls for keeping last month\'s routes are first-class, not buried in advanced settings.\n\n**Model time is scarce**: a full re-plan takes hours per depot on a limited licence, so Simulate honestly shows the change in the numbers rather than pretending to re-plan.\n\n**The deadline is contractual**: miss it and the network runs another month on the old design, so the dashboard\'s hero is deadline health, not vanity metrics.\n\n**Solver time is scarce**: full re-plans take hours per depot on limited licenses, so Simulate honestly shows metric deltas rather than pretending to re-optimize.\n\n**The freeze date is contractual**: miss it and the network runs another month on the old design, so the Command Center\'s hero is deadline health, not vanity metrics.',
        },
        {
          type: 'text',
          body: 'Trade-offs I accepted knowingly: two saved versions instead of a full history, file-level validation instead of per-cell editing, no month-over-month comparison in V1 — each cutting scope from the edges to protect the core.\n\nA phased release, shipping the agreement module alone for the next cycle, was kept open: agreement is the bottleneck the business feels first.\n\nA phased release, shipping the alignment module alone for the next cycle, was kept open — agreement is the bottleneck the business feels first.',
        },
        {
          type: 'statRow',
          stats: [
            { value: 'double-digit%', label: 'vehicle utilization improvement target', fuzzed: true },
          ],
        },
        {
          type: 'ndaNote',
          title: 'On the numbers I am not claiming',
          body: 'The utilization and distance targets belong to the solver programme, not to this panel — the panel exists so a solver-led design survives alignment and freezes on time. The design targets here (clicks, orientation time, one vocabulary) are enforced by the spec and stakeholder review, not measured on a live cycle.',
        },
        {
          type: 'image',
          frame: 'browser',
          src: '/src/assets/work/ndc/deadline-health-hero.png',
          alt: 'Command Center — deadline-health hero showing freeze countdown with at-risk status, populated with realistic data',
          slug: 'pranita.design/ndc/command-center',
          placeholder: true,
        },
      ],
    },
  ],

  spotlights: [
    {
      decision:
        'Acknowledge is an irreversible, guarded freeze: a confirmation dialog that names exactly which reviewers get locked. After it, no Ops Lead can edit anything. There is no undo.',
      rejected: 'A silent status flip; a reversible "lock/unlock" toggle.',
      why: 'The freeze is the entire point — after it, the design becomes vendor contracts. A reversible lock invites late edits that pull the contract out of step with the plan. Irreversibility is only safe if the screen shows its blast radius before the click.',
    },
    {
      decision:
        'Design Review has Push to Alignment and nothing else. A run the planner doesn\'t push simply expires with the cycle.',
      rejected: 'The conventional Approve/Reject pair on every run card.',
      why: 'The planner runs each depot three ways, so most runs are explorations by design — hundreds of runs{*} funnel into at most eighty pushed plans. A Reject button would force bookkeeping on throwaway work, and wrongly imply a rejected run is a decision someone might audit.',
    },
    {
      decision:
        'The panel auto-carries forward last cycle\'s finalised plan as the reference plan and forces a manual pick only for brand-new depots, with bulk-apply for the rest.',
      rejected: 'A per-sort-centre picker as the default path for all 80.',
      why: 'The right answer is the same roughly 79 times out of 80 — last month\'s finished design. Asking for it explicitly at this scale is eighty chances to mis-click before the cycle even starts. Defaults are where a tool proves it understands the job.',
    },
  ],

  reflections: [
    {
      title: 'Most of the work was subtraction, not invention.',
      body: 'I inherited a prototype where every feature existed and nothing was usable. Deleting a duplicate navigation tier, collapsing six status vocabularies into one, removing a Reject button, refusing an audit log — that was the contribution.',
    },
    {
      title: 'Two structural calls were corrections, not insights.',
      body: 'The route-grain review in ADR-001 and the master-detail rethink in ADR-002 both came after I had built the wrong thing once. The evidence was in the requirements the whole time.',
    },
    {
      title: 'The targets are design-enforced, not field-measured.',
      body: 'Under 30 seconds to orient and two clicks to start are validated by spec-fidelity checks and stakeholder review, not by a planner running a live cycle. I designed the ritual; the network has not voted yet.',
    },
  ],

  next: {
    slug: 'linehaul-nexus',
    title: 'Contract Lifecycle Hub',
    code: 'CLH-03',
  },
}
