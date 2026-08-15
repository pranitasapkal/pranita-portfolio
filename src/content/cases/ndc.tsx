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
  scale: '~80 sort centres · 10,000+ delivery centres',
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
      'I designed a net-new desktop workbench where a central planner triggers optimizer runs, compares them, and drives a structured row-by-row alignment loop with regional ops leads to a guarded, irreversible freeze. 13 locked design decisions and 2 ADRs turned an unstructured monthly negotiation into a repeatable ritual with one status language.',
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
          body: 'Every month, Valmo redesigns its regional linehaul network: which vehicle leaves which sort centre, visiting which delivery centres, in what sequence.\n\nAt the scale in scope — ~80 sort centres, 10,000+ delivery centres, hundreds of optimizer runs per cycle{*} — a data-science solver (a vehicle-routing model) already produced the route designs.\n\nThe bottleneck was never computation.',
        },
        {
          type: 'text',
          body: 'The bottleneck was agreement. A solver output is a proposal; the people who know whether a route is actually drivable are dozens of regional ops leads, each expert in their own sort centre.\n\nBefore the tool, that negotiation happened across disconnected Google Sheets: the planner exported solver output, mailed it around, collected contradictory edits, and manually reconciled them against a monthly deadline after which the design becomes a vendor contract and cannot change.\n\nIn one recent cycle, 32 delivery centres silently fell out of coverage across ~10 sort centres because infeasible vehicle inputs never surfaced to anyone who could catch them.',
        },
        {
          type: 'text',
          body: 'When I audited the PM-built feature prototype meant to replace this, I found a feature inventory, not a tool. A planner opening it could not answer three questions: what is happening across my network, what needs me, and where did I leave off.',
        },
        {
          type: 'problemTabs',
          items: [
            {
              label: 'An empty dashboard',
              body: 'Three navigation cards and nothing else. The screen a planner lands on every morning held no state, no queue, and no sense of the deadline — so orientation happened somewhere other than the tool.',
            },
            {
              label: 'An invisible pipeline',
              body: 'Inputs → Creation → Review → Alignment existed in the requirements and nowhere in the interface. Nothing enforced the order, so a planner could push a design built on inputs that had never been validated.',
            },
            {
              label: 'Six vocabularies for one lifecycle',
              body: 'Six modules had each invented their own words for the same states. Amber alone meant four different things depending on which screen you were reading, which makes a status colour worse than no status at all.',
            },
            {
              label: 'Two roles in one shell',
              body: 'A central planner and a regional reviewer shared an interface with a persona toggle. An alignment ritual only works if reviewers physically cannot touch inputs, runs, or another region’s plan.',
            },
          ],
        },
        {
          type: 'text',
          body: 'So I reframed the problem. The tool\'s real job isn\'t producing route designs — the solver does that. Its job is getting dozens of regional ops leads to agree with a central planner before an irreversible monthly freeze. **Designing the panel meant designing the ritual.**',
        },
        {
          type: 'statRow',
          stats: [
            { value: '~80', label: 'sort centres' },
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
          body: 'I set measurable process targets in the redesign spec before touching a single screen, because "make it usable" is not a brief.\n\n**Time-to-orient** — a planner landing on the dashboard understands the state of the network in under 30 seconds. Previously unmeasurable because the dashboard held nothing.\n\n**Clicks to primary task** — create a route design from 5 to ≤2 from the dashboard.\n\n**Status vocabularies** — from 6 to 1. Six modules had each invented their own words for the same lifecycle; amber alone meant four different things.\n\n**"Where is design X?"** — answerable from one view, without hunting. All four states (empty / loading / error / populated) defined on every screen.',
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
          body: 'Behind these sat the business objective the tool serves: full adoption of solver-led design, targeting a double-digit improvement in vehicle utilization and a shorter average network distance{*}.\n\nMy design metrics were deliberately upstream of those numbers — if the planner can\'t orient, compare runs, and close alignment before the freeze date, no solver improvement ships.',
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
          body: 'Two personas, and the single most consequential persona decision was refusing to let them share a shell.\n\n**Central Network Planner (primary).** One person responsible for the whole network. Owns inputs, triggers runs, compares outputs, pushes plans for alignment, and executes the freeze.\n\nTheir scarce resource is situational awareness: with ~80 sort centres and hundreds of runs per cycle{*}, they need to know what needs them right now, not browse.\n\nExpert internal user, desktop, dense tables welcome.\n\n**Ops Lead / Regional PoC (secondary).** Regional operators who review a pushed plan row-by-row and flag what won\'t work on the ground: a vehicle type the local vendor doesn\'t run, a coordinate that\'s wrong, a cutoff that\'s undrivable.\n\nThey should see exactly one thing: the plan assigned to them, plus a map. Everything else is noise and risk.',
        },
        {
          type: 'text',
          body: 'The PM prototype handled this with a persona toggle in one shared interface.\n\nI locked the opposite: production is real per-user login with two different shells — the Ops Lead gets a stripped interface containing only Ops Alignment and the map (the prototype keeps a clearly-labelled "Demo: view as…" switch, because a prototype has no auth).\n\nThis is a trust decision as much as a UX one: an alignment ritual only works if reviewers physically cannot touch inputs, runs, or other regions\' plans.',
        },
        {
          type: 'matrix',
          title: 'Two users who need opposite things from the same data',
          columns: ['', 'Central Network Planner', 'Ops Lead / Regional PoC'],
          rows: [
            ['How many', 'One, for the whole network', '3–4 per sort centre'],
            ['Owns', 'Inputs, runs, comparison, the freeze', 'Judgement about their own region'],
            ['Scarce resource', 'Situational awareness across ~80 sort centres', 'Time — this is not their main job'],
            ['Should see', 'Everything, densely', 'One plan and a map. Nothing else.'],
            ['Shipped as', 'Full planner shell', 'Stripped shell — Ops Alignment and the map'],
          ],
          totalNote:
            'The PM prototype gave both a persona toggle inside one interface. Production is per-user login with two different shells.',
        },
        {
          type: 'statRow',
          stats: [
            { value: '3–4', label: 'ops leads per sort centre' },
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
          body: 'The IA had to make the monthly ritual legible in the navigation itself. Three moves did most of the work.\n\n**One spine: the design lifecycle.** Every design carries a single lifecycle stage — Draft → Running → Created → In Review → Pushed → In Alignment → Acknowledged → Finalised — and every screen reads from it.\n\nThe dashboard\'s pipeline chips, the runs view, and each module are projections of the same state.\n\nOn top of it sits one status vocabulary (Draft / In Progress / Needs Attention / Blocked / Done) with one rule enforced ruthlessly: **amber means "needs a human decision" and nothing else.**',
        },
        {
          type: 'text',
          body: '**One scoping container: the Design Cycle.** A named monthly plan group scopes every upload, run, and alignment, capped at ≤80 runs. Without it, hundreds of runs per cycle{*} stack into an undifferentiated archive; with it, the planner always works inside this month.\n\n**Nav lives in the sidebar, and only there.** The Planner shell reads as the ritual in order: Command Center → Design Inputs → Design Creation → Review & Alignment → Runs → Help.\n\nADR-002 records the correction that got us there: an earlier build also drew a horizontal "lifecycle rail" above every module, duplicating the sidebar.\n\nI deleted it and set the rule: module switching is infrequent, so it lives in the persistent sidebar; filters and sub-views are frequent, so they live in the content.',
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
            'Trigger runs — select sort centres, pick a volume file, set vehicles and Historical Weight (a 0 / 0.5 / 1 dial for how much of last month\'s routes to preserve versus re-optimize). Each run is one async solver job per sort centre per weight value.',
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
          body: 'I wireframed the panel twice — once to inventory the PM prototype\'s screens, once to restructure them around the ritual — and wrote a critique document ranking the top 10 fixes before any hi-fi work. Structure first, because most of what was wrong was structural.\n\nThe wireframe that mattered most was the **Command Center**.\n\nThe old dashboard was 3 nav cards. The lo-fi replaced it with a cockpit answering the three planner questions in fixed positions.\n\nA deadline-health hero ("18 days to freeze · At risk" with the cycle\'s milestone timeline). A "Needs You" queue where every item is a state requiring the planner.\n\nPipeline chips showing counts per lifecycle stage — each a click-through filter, not a decoration. And a Start Something strip that puts run creation ≤2 clicks from landing.',
        },
        {
          type: 'text',
          body: '**The grouping rule.** At this scale, a flat list of 80+ items is a design failure, so I made it a standing convention — every list groups by sort centre or zone with roll-up progress headers, collapsible groups, segment filters, and "showing N of M".\n\nThis rule alone did more for orientation than any visual treatment.\n\n**Unified wizard chrome.** Three multi-step flows had each invented their own stepper; I collapsed them into one pattern — stepper on top, step body, persistent footer with the validation summary bottom-left and the primary action bottom-right, later steps locked until earned.\n\nLocked steps are the pipeline\'s dependency model made physical.',
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
      title: 'I prototyped at eighty sort centres, not five.',
      blocks: [
        {
          type: 'text',
          body: 'The canonical deliverable is a single-file interactive HTML prototype — the full V1 panel, both persona shells, running against seeded data at realistic scale: ~80 sort centres, ~239 runs, ~11.5k delivery centres, ~41 plans.\n\nI prototype at scale deliberately; a design that works with 5 mock rows tells you nothing about a tool whose whole problem is 80.\n\nTwo rules governed the build. **No dead controls** — every button, filter, and action is wired; backend-dependent writes surface an honest "coming soon" toast rather than a silent nothing.\n\nAnd **every list ships grouped** per the Step-06 convention, with breadcrumbs on every drill-in returning to the persona\'s home.',
        },
        {
          type: 'statRow',
          stats: [
            { value: '~80', label: 'sort centres (seeded)' },
            { value: '~239', label: 'optimizer runs' },
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
          body: 'Visual system: Meesho\'s internal design system{*} with the product\'s navy override, 13px base type, dense tables with deliberate hierarchy, WCAG 2.1 AA contrast, and status never conveyed by colour alone.\n\nFTUX is sparing by locked decision: a 4-step dismissible tour plus contextual tooltips on the six genuinely non-obvious concepts (Historical Weight, reference plan, validation flags, Design Cycle, Acknowledge, Simulate).',
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
          body: 'The tool exists to make solver-led network design the default, and the solver exists to cut cost per shipment — via a double-digit vehicle-utilization improvement target and a shorter average sort-centre-to-delivery-centre distance{*}.\n\nBut the adoption metric that pays for those is human: a design only realizes its modelled savings if it survives alignment intact and freezes on time.\n\nThe programme explicitly tracks how many routes and vehicles reach the downstream contract stage unmodified — which is why I treated the alignment loop, not the solver UI, as the highest-leverage surface.',
        },
        {
          type: 'text',
          body: '**Route churn is a real cost**: routes becoming contracts means every changed route code triggers vendor re-negotiation and ops re-learning — that is why Historical Weight and the reference-plan mechanism are first-class UI, not advanced settings.\n\n**Solver time is scarce**: full re-plans take hours per sort centre on limited licenses, which is why Simulate honestly shows only metric deltas rather than pretending to re-optimize.\n\n**The freeze date is contractual**: miss it and the network runs another month on the old design, so the Command Center\'s hero is deadline health, not vanity metrics.',
        },
        {
          type: 'text',
          body: 'Trade-offs I accepted knowingly: two-version persistence instead of a full audit log, shallow file-level input validation instead of per-cell editing, and no month-over-month comparison in V1 — each cut scope from the ritual\'s periphery to protect its core.\n\nA phased-release option — shipping the alignment module alone for the next cycle — was kept open, because agreement is the bottleneck the business feels first.',
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
        'Simulate shows metric deltas only — Δ km / cost / time / vehicles — wired inline on each row, never as a footer button.',
      rejected: 'A "re-optimize with this change" button; a batch simulate at the bottom of the table.',
      why: 'A full re-plan is an hours-long solver job on a licensed engine. A delta is cheap, truthful, and sufficient for the actual decision — accept this row or not. Inline placement matters: accept/reject is a per-row judgment; a footer button turns forty small decisions into one vague one.',
    },
    {
      decision:
        'Acknowledge is an irreversible, guarded freeze: a confirmation dialog that names exactly which reviewers get locked. After it, no Ops Lead can edit anything. There is no undo.',
      rejected: 'A silent status flip; a reversible "lock/unlock" toggle.',
      why: 'The freeze is the entire point of the ritual — after it, the design becomes vendor contracts. A reversible lock invites late edits that desynchronize the contract from the plan. Irreversibility is only safe if the UI makes its blast radius visible before the click.',
    },
    {
      decision:
        'Design Review has Push to Alignment and nothing else. A run the planner doesn\'t push simply expires with the cycle.',
      rejected: 'The conventional Approve/Reject pair on every run card.',
      why: 'With three Historical-Weight runs per sort centre, most runs are explorations by design — hundreds of runs{*} funnel into at most ~80 pushed plans. A Reject button forces planners to perform bookkeeping on artifacts that carry no obligation, and wrongly implies a rejected run is a recorded decision someone might audit.',
    },
    {
      decision:
        'The panel auto-carries forward last cycle\'s finalised plan as the reference plan and forces a manual pick only for brand-new sort centres, with bulk-apply for the rest.',
      rejected: 'A per-sort-centre picker as the default path for all 80.',
      why: 'The correct answer is the same ~79 times out of 80 — last month\'s finalised design. Asking for it explicitly at network scale is 80 chances to mis-click before the cycle even starts. Defaults are where a tool proves it understands the job.',
    },
    {
      decision:
        'The system keeps exactly two versions of a plan: the published baseline and the finalised outcome. No per-edit history.',
      rejected: 'A full audit trail of every flag, simulate, and accept/reject.',
      why: 'The alignment loop generates enormous intermediate state, and none of it matters after the freeze. The diff people actually ask for ("what did alignment change?") falls out of two versions for free. V1 scope discipline: build the ritual, not its museum.',
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
