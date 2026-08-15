/**
 * CLH-03 — Contract Lifecycle Hub (EDITORIAL, real content, unlisted + noindex)
 *
 * Built from content/case-studies/CLH-SCRIPT-v3.md, approved 2026-08-07.
 * Structure: full case study — context → problem → inherited → object model →
 * architecture → the flows (9, each a real screen sequence) → decisions → states →
 * process → status. Plain headings; every domain term defined inline on first use.
 * Status: in development (design locked and handed off; engineering building).
 *
 * Frames: `clh-rfq-panel/New SOT CLH panel /` (Jul 2026 SOT, trailing space in dir).
 * Diagrams: scripts/gen-clh-diagrams.mjs → dg-month / dg-model / dg-flow.
 */
import type { CaseStudy } from '../types'

export const clh: CaseStudy = {
  slug: 'linehaul-nexus',
  code: 'CLH-03',
  title: 'Contract Lifecycle Hub',
  layout: 'editorial',
  noindex: true,
  eyebrow: 'INTERNAL TOOL · LOGISTICS OPS · IN DEVELOPMENT',
  domain: 'B2B ops tooling',
  scale: '~2,400 contracts / month',
  oneLiner:
    'Every month, 2,400 truck routes have to go from a planner’s file to a signed, running contract before the 1st. This is the system that does it.',
  meta: {
    role: 'Sole designer, object model → handoff',
    team: '1 PM, 1 engineering manager, central ops',
    timeline: 'Mar–Jun 2026',
    platform: 'Internal desktop panel (Chrome, ~1440×900)',
  },
  coverBoard: {
    src: '/work/clh/sot-overview.png',
    alt: 'The contracting overview — an action centre grouping items into assign, follow up, and monitor',
    tone: 'light',
    placeholder: false,
  },
  tldr: {
    problem:
      'A central team contracted roughly 2,400 truck routes a month through spreadsheets, phone calls, and WhatsApp, with no screen that showed what was about to break.',
    outcomes: [
      'Two connected surfaces designed 0→1: route planning and contract management',
      'A locked architecture across 14 flows and 130+ screens, handed off without a structural revision',
      'Three navigation-breaking issues caught in an audit before engineering built them',
    ],
    stats: [{ value: '2,400' }, { value: '14' }, { value: '130+' }],
    summary:
      'I designed the system that turns a month’s planned truck routes into signed vendor contracts — the planning upload, the contracting queues, and the rules for what happens when a live contract has to change.',
  },

  chapters: [
    // ── 1 · WHAT THIS IS ─────────────────────────────────────────────────
    {
      id: 'what-this-is',
      step: 1,
      kicker: 'Context',
      ghost: 'Context',
      title: 'What this is',
      blocks: [
        {
          type: 'text',
          body: "**Meesho is one of India's largest e-commerce marketplaces. Valmo is the logistics network it built to move its own parcels.** Before a parcel reaches a doorstep it travels between warehouses on hired trucks — that leg is called linehaul, and Valmo doesn't own those trucks. It rents them, route by route, from trucking companies, on contracts that have to be negotiated and signed every single month.\n\nA route contract is one agreement: this vendor, this route, this size of truck, this rate, for this month. Valmo needs about **2,400 of them, live before the 1st**.\n\nI was the only designer on the system that does this, from the object model through to a 130-screen handoff.",
        },
        {
          type: 'board',
          src: '/work/clh/dg-month.png',
          alt: 'Timeline — planners publish routes on the 21st, about 10 days to find vendors and collect signatures, everything must run by the 1st',
          caption:
            '**The deadline everything serves.** Planners publish on the 21st; every route has to be running by the 1st. The ten days in between are the entire job.',
          tone: 'light',
          placeholder: false,
        },
      ],
    },

    // ── 2 · THE PROBLEM ──────────────────────────────────────────────────
    {
      id: 'the-problem',
      step: 2,
      kicker: 'The problem',
      ghost: 'Problem',
      title: 'The planning half was software. The contracting half was WhatsApp.',
      blocks: [
        {
          type: 'text',
          body: 'Planners already produced the month’s routes in a system. The team that had to turn those routes into signed contracts worked by hand: assignments went out as bulk Excel files, vendor follow-ups happened on phone calls, disputes lived in WhatsApp threads. Nothing joined the two halves together.\n\nFour things went wrong because of that, and they are the four things the design has to fix.',
        },
        {
          type: 'phaseCards',
          items: [
            {
              step: 'Failure 01',
              title: 'Nobody could see what was pending',
              body: 'With 2,400 routes in flight and no shared view, "what still needs a vendor this week?" was answered by opening a spreadsheet and counting.',
            },
            {
              step: 'Failure 02',
              title: 'Contracts went live with the wrong terms',
              body: 'A rate typed into a sheet is not a rate anyone agreed to. The error surfaced after trips had run, as a dispute over money already spent.',
            },
            {
              step: 'Failure 03',
              title: 'Routes went live with no vendor at all',
              body: 'Nothing stopped a route reaching its start date uncovered — the most expensive failure in a logistics network.',
            },
            {
              step: 'Failure 04',
              title: 'Changes were invisible',
              body: 'When planners revised the month mid-cycle — a route dropped, a truck removed — the contracting team found out by being told.',
            },
          ],
        },
      ],
    },

    // ── 3 · WHAT I INHERITED ─────────────────────────────────────────────
    {
      id: 'inherited',
      step: 3,
      kicker: 'Starting point',
      ghost: 'Audit',
      title: 'What I inherited, and why I audited it first',
      blocks: [
        {
          type: 'text',
          body: 'The project was not starting from zero, which turned out to be the problem. There were already **136 Figma screens**, drawn against a specification that had since moved, plus a 21-page requirements document and several prototype iterations.\n\nTreating them as an approved baseline would have shipped their structure into engineering. So the first thing I produced was not a screen. It was an audit of 50+ of those screens against the current specification.',
        },
        {
          type: 'matrix',
          title: 'Audit of the inherited screens',
          columns: ['Severity', 'Count', 'What it was'],
          rows: [
            ['P0', '3', 'Navigation-breaking — queue names that no longer matched the spec engineering would build from'],
            ['P1', '7', 'The same idea rendered differently on adjacent screens'],
            ['P2', '11', 'Copy and visual inconsistency'],
            ['P3', '8', 'Missing states — empty, loading, error, no-results'],
          ],
          totalNote:
            'Two of the three P0s were different naming schemes on adjacent screens of the same tab. Built as-is, engineering would have implemented two contradictory navigations.',
        },
        {
          type: 'text',
          body: 'That audit bought the argument for doing structure first: diagram, then a written decision record, then Figma. Caught in a diagram, a structural mistake costs a redraw. Caught in 130 screens, it costs weeks.',
        },
      ],
    },

    // ── 4 · THE OBJECT MODEL ─────────────────────────────────────────────
    {
      id: 'object-model',
      step: 4,
      kicker: 'The model',
      ghost: 'Model',
      title: 'A route is not a contract',
      blocks: [
        {
          type: 'text',
          body: 'This is the model everything else follows from.\n\nPlanners publish a **design** — one month’s batch of routes. Each route in it becomes a requirement: this lane, this truck size, this many trucks, starting this date. And each *truck* on that route becomes its **own contract**, with its own vendor and its own rate.\n\nA **regional** route needs one truck: one requirement, one contract. A **national** route runs long-distance and needs several — one requirement, four contracts — and each of those four can be at a completely different stage at the same time.',
        },
        {
          type: 'board',
          src: '/work/clh/dg-model.png',
          alt: 'Diagram — a design fans out into requirements, and each truck on a route becomes its own contract',
          caption:
            '**One design, many routes, many contracts.** A regional route is the simple case. A national route is where the design problem lives.',
          tone: 'light',
          placeholder: false,
        },
        {
          type: 'board',
          src: '/work/clh/d1-mixed-states.png',
          alt: 'One route detail page showing four trucks in four different states: upload error, unassigned, rejected, sent for approval',
          caption:
            '**One route. Four trucks. Four different states at once.** An upload error, a truck with no vendor, a vendor who declined, and one already out for signature — on a single route.',
          tone: 'light',
          placeholder: false,
        },
      ],
    },

    // ── 5 · ARCHITECTURE ─────────────────────────────────────────────────
    {
      id: 'architecture',
      step: 5,
      kicker: 'Architecture',
      ghost: 'Structure',
      title: 'Three levels, five stages, one rule',
      blocks: [
        {
          type: 'phaseCards',
          items: [
            {
              step: 'Level 1',
              title: 'Overview',
              body: 'Opens on what needs attention across everything, grouped by what you would actually do about it: assign a vendor, chase a vendor, or fix a live contract. Not a dashboard of charts — a list of work.',
              tags: ['Action centre'],
            },
            {
              step: 'Level 2',
              title: 'Queues',
              body: 'Five stages a contract moves through, each with named sub-queues carrying live counts, so workload is visible before any click.',
              tags: ['5 stages', 'Named queues'],
            },
            {
              step: 'Level 3',
              title: 'The route',
              body: 'Everything about one route: its trucks, each contract’s state, and the full history of what changed and when.',
              tags: ['Detail & history'],
            },
            {
              step: 'The rule',
              title: 'A route sits at the stage of its least-finished truck',
              body: 'Three trucks approved and one unassigned means the whole route stays in Action Required. Every later stage becomes a promise — and a regional route is just the one-truck case of the same rule.',
              tags: ['Holds both route types'],
            },
          ],
        },
        {
          type: 'board',
          src: '/work/clh/sot-overview.png',
          alt: 'Overview screen — action centre grouping 142 items into assign, follow up and monitor, with per-batch progress below',
          caption:
            '**The day opens as three questions:** what needs a vendor, who hasn’t replied, and what’s broken on a live contract.',
          tone: 'light',
          placeholder: false,
        },
      ],
    },

    // ── 6 · THE FLOWS ────────────────────────────────────────────────────
    {
      id: 'flows',
      step: 6,
      kicker: 'The flows',
      ghost: 'Flows',
      title: 'How a route becomes a running contract',
      blocks: [
        {
          type: 'board',
          src: '/work/clh/dg-flow.png',
          alt: 'Flow map — Network Design feeding five stages with their sub-queues, plus the five exception loops that send routes backwards',
          caption:
            '**The whole system on one page.** Five stages forward — and five exceptions that send a route backwards. The exceptions are most of the design work.',
          tone: 'light',
          placeholder: false,
        },
        {
          type: 'text',
          body: '**Planning a month.** Planners upload the coming month’s routes as a file. It is deliberately all-or-nothing: one bad row rejects the whole batch, and the system returns an error file naming which rows failed and why. A partially-accepted batch would mean a month that is quietly incomplete. The rules live on the page itself — what each column means, why the start date must be at least 10 days out, what happens when you edit a design that is already live.',
        },
        {
          type: 'screensGrid',
          cols: 2,
          items: [
            { src: '/work/clh/f1-nd-rules.png', alt: 'Network Design page with upload rules', caption: '1 · The rules sit on the page, not in a manual' },
            { src: '/work/clh/f1-nd-create.png', alt: 'Create new design modal', caption: '2 · Create the month’s design' },
            { src: '/work/clh/f1-nd-upload.png', alt: 'Uploading the route file', caption: '3 · Upload the route file' },
            { src: '/work/clh/f1-nd-success.png', alt: 'Design created successfully', caption: '4 · Clean file — routes go live to the contracting team' },
            { src: '/work/clh/f1-nd-failed.png', alt: 'Design creation failed with downloadable error file', caption: '5 · One bad row rejects the batch, with an error file naming why' },
          ],
        },
        {
          type: 'text',
          body: '**Assigning a vendor.** The queue is sorted most-urgent-first. Assigning happens in the row: the form opens under the route so the destination, truck size and deadline stay on screen while you pick a vendor and set a rate. A recommended rate sits beside the field.',
        },
        {
          type: 'screensGrid',
          cols: 2,
          items: [
            { src: '/work/clh/f2-queue.png', alt: 'Unassigned queue', caption: '1 · The queue, most urgent first' },
            { src: '/work/clh/f2-inline.png', alt: 'Inline assignment form opened under the row', caption: '2 · The form opens under the route, context intact' },
            { src: '/work/clh/f2-filled.png', alt: 'Vendor and rate filled in', caption: '3 · Vendor, rate, dates — with a recommended rate alongside' },
            { src: '/work/clh/f2-sent.png', alt: 'Contract sent confirmation', caption: '4 · Sent for the vendor’s acceptance' },
          ],
        },
        {
          type: 'text',
          body: '**Assigning in bulk.** At 2,400 routes a month, one-at-a-time is not the main path. Download the queue as a file, fill vendor and rate in the sheet the team already lives in, upload it back.',
        },
        {
          type: 'screensGrid',
          cols: 2,
          items: [
            { src: '/work/clh/f3-bulk-modal.png', alt: 'Bulk assign modal with download and upload steps', caption: '1 · Two steps: download the file, upload it filled' },
            { src: '/work/clh/f3-bulk-success.png', alt: 'Contracts uploaded successfully', caption: '2 · The whole batch moves at once' },
          ],
        },
        {
          type: 'text',
          body: '**Chasing a vendor who hasn’t replied.** Once sent, a contract waits on the vendor. After seven days with no response it moves into its own queue, and reminders can be sent across a selection at once.',
        },
        {
          type: 'screensGrid',
          cols: 2,
          items: [
            { src: '/work/clh/f4-awaiting.png', alt: 'Sent for approval, awaiting response', caption: '1 · Waiting on the vendor, with reminder status per row' },
            { src: '/work/clh/f4-no-response.png', alt: 'No response after seven days queue', caption: '2 · After seven days it becomes its own queue' },
          ],
        },
        {
          type: 'text',
          body: '**When a vendor says no.** A rejection returns the route to Action Required with the reason attached, and reassignment reuses the same inline form — deliberately not pre-filled with the vendor who just declined.',
        },
        {
          type: 'screensGrid',
          cols: 2,
          items: [
            { src: '/work/clh/f5-rejected.png', alt: 'Rejected queue', caption: '1 · Rejections come back as their own queue' },
            { src: '/work/clh/f5-reason.png', alt: 'Rejection reason on the route detail', caption: '2 · The reason travels with the route' },
            { src: '/work/clh/f5-reassigned.png', alt: 'Reassigned to a new vendor', caption: '3 · Reassign — not pre-filled with who declined' },
          ],
        },
        {
          type: 'text',
          body: '**Fixing a bad upload, and verifying before go-live.** Errors are named per field on the row that failed — wrong vendor ID, rate above the ceiling, invalid date range. And nothing activates automatically: an accepted contract waits in Upcoming until someone checks and activates it. One deliberate click, because a wrong contract caught here costs nothing and caught after the trucks run costs a dispute.',
        },
        {
          type: 'screensGrid',
          cols: 2,
          items: [
            { src: '/work/clh/f6-error-detail.png', alt: 'Upload errors named per field', caption: 'Errors name the field and the reason, fixed in place' },
            { src: '/work/clh/f7-verify.png', alt: 'Upcoming — verify before activating', caption: 'Upcoming — verified by a person before it goes live' },
          ],
        },
        {
          type: 'text',
          body: '**Exceptions: disputes, termination, closure.** A dispute raised before activation resolves in the route itself — approve and revise the rate, or reject it with a reason. Termination states its notice period, so a route is never cut without cover. Everything terminal lands in Closed, read-only.',
        },
        {
          type: 'screensGrid',
          cols: 2,
          items: [
            { src: '/work/clh/f9-dispute.png', alt: 'Dispute raised before activation', caption: 'A dispute before activation, resolved in the route' },
            { src: '/work/clh/f9-dispute-reject.png', alt: 'Rejecting a dispute with a reason', caption: 'Rejecting a dispute requires a reason' },
            { src: '/work/clh/f9-termination.png', alt: 'Termination with stated notice period', caption: 'Termination states its notice period' },
            { src: '/work/clh/f9-closed.png', alt: 'Closed, read-only', caption: 'Closed — read-only, filtered by outcome' },
          ],
        },
      ],
    },

    // ── 7 · THE DECISIONS ────────────────────────────────────────────────
    {
      id: 'decisions',
      step: 7,
      kicker: 'The decisions',
      ghost: 'Decisions',
      title: 'Four calls that shaped the system',
      blocks: [
        {
          type: 'text',
          body: '**1 · Where a half-finished route lives.** A route sits at the stage of its least-finished truck.',
        },
        {
          type: 'rejected',
          items: [
            {
              pattern: 'File it under its best state, with a warning badge',
              reason: 'At fifty rows a day, badges become wallpaper. The manager stops seeing them within a week.',
            },
            {
              pattern: 'List the route once in every stage it touches',
              reason: 'Tab counts stop meaning anything — and the counts are the entire triage instrument.',
            },
            {
              pattern: 'Split national and regional routes into separate screens',
              reason: 'Two products to build and maintain, and the manager’s day doesn’t split that way.',
            },
          ],
        },
        {
          type: 'text',
          body: '**What it costs:** progress you have already made stops being visible. Finish three of four trucks and the route sits where it sat this morning. The counts reward finishing routes, not trucks — correct for the deadline the team is judged against, and mildly demoralising on a Wednesday.',
        },
        {
          type: 'text',
          body: '**2 · Not every change breaks a contract.** A signed contract is an agreement, so "edit" cannot mean what it means in an ordinary form. I had to decide, field by field, whether a change is something the vendor already agreed to, or something they must agree to again. Every one of these modals states the consequence in plain language before you commit.',
        },
        {
          type: 'screensGrid',
          cols: 2,
          items: [
            { src: '/work/clh/m-rate.png', alt: 'Rate change modal — applies from next trip, completed trips keep the old rate', caption: 'Rate — applies from the next trip. Completed trips keep the old rate. Notified, no re-acceptance.' },
            { src: '/work/clh/m-time.png', alt: 'Placement time change modal — transporter will be notified', caption: 'Placement time — the vendor is notified. Nothing else moves.' },
            { src: '/work/clh/m-date.png', alt: 'Date change modal — closes the current contract and resends it', caption: 'Dates — the contract closes and is reissued for acceptance. The period is the substance of the agreement.' },
            { src: '/work/clh/m-multi.png', alt: 'Multiple change modal listing every consequence', caption: 'Several at once — the modal names exactly which of the above will happen.' },
          ],
        },
        {
          type: 'text',
          body: '**3 · Assign in the row, not in a modal.** Modals are kept for what deserves a full stop: confirmations and destructive acts.',
        },
        {
          type: 'rejected',
          items: [
            {
              pattern: 'A modal for every assignment',
              reason: 'Open, fill, close, hunt for the next row, repeat — the cost lands on the single most repeated action in the product.',
            },
            {
              pattern: 'A filter bar over one master table',
              reason: 'Filters make you rebuild your to-do list every morning. A named queue with a count remembers it for you.',
            },
          ],
        },
        {
          type: 'text',
          body: '**4 · The vendor column only exists once there is a vendor.** The rejected version kept a fixed grid across every stage and filled the gaps with dashes. At scanning speed a dash reads as a loading failure and costs an investigation click. A missing column says **this does not exist yet**; an empty one says **something went wrong**.',
        },
        {
          type: 'screensGrid',
          cols: 2,
          items: [
            { src: '/work/clh/d3-no-transporter-col.png', alt: 'Action Required table with no vendor column', caption: 'Before a vendor exists — no column at all' },
            { src: '/work/clh/d3-has-transporter-col.png', alt: 'Sent for Approval table showing vendor and rate', caption: 'After — vendor and rate arrive together' },
          ],
        },
      ],
    },

    // ── 8 · STATES ───────────────────────────────────────────────────────
    {
      id: 'states',
      step: 8,
      kicker: 'Edge cases',
      ghost: 'States',
      title: 'The states that decide whether it survives a bad week',
      blocks: [
        {
          type: 'text',
          body: 'Every table view was specified with its full set: default, loading, empty because you cleared it, empty because it is your first time, no search results, network error, inline row error, and three toast variants. The interesting ones are the states that only appear when something has gone wrong upstream.',
        },
        {
          type: 'screensGrid',
          cols: 2,
          items: [
            { src: '/work/clh/f6-error-queue.png', alt: 'Upload error queue', caption: 'Upload errors — a queue of its own, not a silent failure' },
            { src: '/work/clh/st-preclosed.png', alt: 'Pre-closed contracts', caption: 'Planners removed the route upstream — its contracts pre-close on notice' },
          ],
        },
      ],
    },

    // ── 9 · HOW IT WAS MADE ──────────────────────────────────────────────
    {
      id: 'how-it-was-made',
      step: 9,
      kicker: 'Process',
      ghost: 'Process',
      title: 'Structure first, pixels after',
      blocks: [
        {
          type: 'text',
          body: 'Structure diagram → written decision record → Figma → prototype. Four contested structural calls were settled in writing before any high-fidelity work, which is why 130+ screens were handed off without a structural revision. The full eight-step process ran underneath — problem framing, objective, persona, architecture, flows, wireframes, prototype, business case — it just isn’t the story.',
        },
        {
          type: 'timeline',
          items: [
            { label: 'Inherited screens', sub: '136, spec had moved' },
            { label: 'Structure diagram', sub: 'before any Figma' },
            { label: 'Decision record', sub: '4 contested calls' },
            { label: 'Severity audit', sub: '50+ screens' },
            { label: 'Structure locked', sub: 'v4' },
            { label: 'Hi-fi + handoff', sub: '130+ screens' },
          ],
        },
        {
          type: 'text',
          body: 'The interaction model was proven in a data-driven prototype rather than a click-through, because the central claim is a data rule. It runs ~75 routes across three monthly batches with the least-finished-truck rule implemented in the filtering logic — assign three of four trucks and the route genuinely refuses to move.',
        },
        {
          type: 'prototype',
          slug: 'clh',
          title: 'Contract Lifecycle Hub — live prototype',
          note: 'Try assigning three of four trucks on a national route and watch where it stays.',
        },
      ],
    },
  ],

  spotlights: [],

  reflection:
    "The system is in development now — the design is locked and handed off, and engineering is building it. So there is no usage number yet, and inventing one would be the easiest thing here to catch. What I can claim is structural: an architecture that held across 14 flows and 130+ screens, three navigation-breaking issues caught before they reached engineering, and a change model that makes the consequence of every edit explicit before anyone commits to it. What I want next is the measurement I don't have — time to clear the Action Required queue, before and after — and one specific answer: whether a manager who has just finished three of four trucks reads the unchanged queue as the system being strict, or as the system ignoring their work. The prototype demonstrates that rule. It does not yet teach it, and the difference will only show up on a bad Wednesday in a real month.",

  next: {
    slug: 'transporter-contract-management',
    title: 'Transporter Contract Management',
    code: 'TCM-04',
  },
}
