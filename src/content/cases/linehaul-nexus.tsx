/**
 * CLH-03 — Contract Lifecycle Hub (EDITORIAL, real content, unlisted + noindex)
 *
 * Built from content/case-studies/CLH-SCRIPT-v3.md, approved 2026-08-07; cut onto the
 * ADR-005 section template 2026-08-16. One claim has one home — the flows are carried by
 * their screen captions, the audit by its matrix, the process by its timeline; prose only
 * connects them. No kicker eyebrows; reflections one line each.
 * Checked with `npm run count:copy CLH` and `npm run check:facts check CLH`.
 * Status: in development (design locked and handed off; engineering building).
 *
 * Frames: `clh-rfq-panel/New SOT CLH panel /` (Jul 2026 SOT, trailing space in dir).
 * Diagrams: scripts/gen-clh-diagrams.mjs → dg-month / dg-model / dg-flow.
 */
import type { CaseStudy } from '../types'
import { summaries } from './summaries'

export const clh: CaseStudy = {
  ...summaries['linehaul-nexus'],
  title: 'Contract Lifecycle Hub',
  oneLiner:
    'Every month, 2,400 truck routes go from a planner’s file to signed, running contracts before the 1st. This is the system that does it.',
  layout: 'editorial',
  noindex: true,
  eyebrow: 'INTERNAL TOOL · LOGISTICS OPS · IN DEVELOPMENT',
  domain: 'B2B ops tooling',
  scale: '~2,400 contracts / month',
  meta: {
    role: 'Sole designer, object model → handoff',
    team: '1 PM, 1 engineering manager, central ops',
    timeline: 'Mar–Jun 2026',
    platform: 'Internal desktop panel (Chrome, ~1440×900)',
    skills: ['Product Design', 'Information Architecture', 'Interaction Design', 'Design Systems'],
  },
  tldr: {
    problem:
      'A central team contracted a month’s truck routes through spreadsheets, phone calls and WhatsApp, with no screen that showed what was about to break.',
    outcomes: [
      'Two connected surfaces designed 0→1: route planning and contract management',
      'A locked architecture across 14 flows and 130+ screens, handed off without a structural revision',
      'Three navigation-breaking issues caught in an audit before engineering built them',
    ],
    stats: [{ value: '2,400' }, { value: '14' }, { value: '130+' }],
    summary:
      'I designed the system that turns a month’s planned routes into signed vendor contracts — the planning upload, the contracting queues, and the rules for changing a live contract.',
  },

  chapters: [
    // ── 1 · WHAT THIS IS ─────────────────────────────────────────────────
    {
      id: 'what-this-is',
      step: 1,
      navLabel: 'What this is',
      ghost: 'Context',
      title: 'Valmo doesn’t own its trucks. It contracts them, every month, route by route.',
      blocks: [
        {
          type: 'text',
          body: 'Meesho is one of India’s largest e-commerce marketplaces. **Valmo** is the logistics network it built to move its own parcels.\n\nBefore a parcel reaches a doorstep it rides hired trucks between warehouses — that leg is called **linehaul**.\n\nA route contract is one agreement with a trucking company: this vendor, this route, this truck size, this rate, for this month.',
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
      navLabel: 'Four failures',
      ghost: 'Problem',
      title: 'The planning half was software. The contracting half was WhatsApp.',
      blocks: [
        {
          type: 'text',
          body: 'Planners already produced the month’s routes in a system.\n\nThe team turning those routes into signed contracts worked by hand: assignments as bulk Excel files, follow-ups on phone calls, disputes in WhatsApp threads.\n\nNothing joined the two halves together.\n\nFour things went wrong because of it.',
        },
        {
          type: 'phaseCards',
          items: [
            {
              step: 'Failure 01',
              title: 'Nobody could see what was pending',
              body: 'With the month in flight and no shared view, "what still needs a vendor this week?" meant opening a spreadsheet and counting.',
            },
            {
              step: 'Failure 02',
              title: 'Contracts went live with the wrong terms',
              body: 'A rate typed into a sheet is not a rate anyone agreed to — the error surfaced as a dispute over money already spent.',
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
      navLabel: 'What I inherited',
      ghost: 'Audit',
      title: 'What I inherited, and why I audited it first',
      blocks: [
        {
          type: 'text',
          body: 'The project was not starting from zero, which was the problem.\n\n**136 Figma screens** already existed, drawn against a spec that had since moved, plus a 21-page requirements document and several prototype iterations.\n\nTreating them as an approved baseline would have shipped their structure straight into engineering.\n\nSo the first thing I produced was not a screen: an audit of 50+ of them against the current specification.',
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
          body: 'That audit bought the argument for the sequence: caught in a diagram, a structural mistake costs a redraw; caught in 130 screens, it costs weeks.',
        },
      ],
    },

    // ── 4 · THE OBJECT MODEL ─────────────────────────────────────────────
    {
      id: 'object-model',
      step: 4,
      navLabel: 'The object model',
      ghost: 'Model',
      title: 'A route is not a contract',
      blocks: [
        {
          type: 'text',
          body: 'This is the model everything else follows from.\n\nPlanners publish a **design** — one month’s batch of routes. Each route becomes a requirement: this lane, this truck size, this many trucks, starting this date.\n\nAnd each *truck* on that route becomes its **own contract**, with its own vendor and its own rate.\n\nA **regional** route needs one truck — one requirement, one contract. A **national** route needs several: one requirement, four contracts.',
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
      navLabel: 'Three levels',
      ghost: 'Structure',
      title: 'Three levels, five stages, one rule',
      blocks: [
        {
          type: 'phaseCards',
          items: [
            {
              step: 'Level 1',
              title: 'Overview',
              body: 'Not a dashboard of charts — a list of work, grouped by what you would actually do about it.',
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
              body: 'Three trucks approved, one unassigned — the route stays in Action Required. Every later stage becomes a promise; a regional route is just the one-truck case.',
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
      navLabel: 'Route to contract',
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
          body: '**Planning a month.** The upload is deliberately all-or-nothing — a partial batch is a month quietly incomplete — and start dates sit at least 10 days out.',
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
          body: '**Assigning a vendor.** The route’s destination, truck size and deadline stay on screen throughout.',
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
          body: '**Assigning in bulk** — in the sheet the team already lives in.',
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
          body: '**Chasing a vendor.** Reminders go out across a selection at once.',
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
          body: '**When a vendor says no**, the route returns to Action Required.',
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
          body: '**Nothing activates automatically.** A wrong contract caught in Upcoming costs nothing; caught after the trucks run, it costs a dispute.',
        },
        {
          type: 'screensGrid',
          cols: 2,
          items: [
            { src: '/work/clh/f6-error-detail.png', alt: 'Upload errors named per field', caption: 'Errors name the field — wrong vendor ID, rate above the ceiling, invalid date range — fixed in place' },
            { src: '/work/clh/f7-verify.png', alt: 'Upcoming — verify before activating', caption: 'Upcoming — verified by a person before it goes live' },
          ],
        },
        {
          type: 'text',
          body: '**Exceptions.** Approving a dispute revises the rate; a termination notice period means a route is never cut without cover.',
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
      navLabel: 'Contested calls',
      ghost: 'Decisions',
      title: 'Four calls that shaped the system',
      blocks: [
        {
          type: 'text',
          body: '**1 · A route lives wherever its least-finished truck is.**',
        },
        {
          type: 'rejected',
          items: [
            {
              pattern: 'File it under its best state, with a warning badge',
              reason: 'At fifty rows a day, badges become wallpaper within a week.',
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
          body: '**What it costs:** progress you have already made stops being visible.\n\nThe counts reward finishing routes, not trucks — correct for the deadline the team is judged against, and mildly demoralising on a Wednesday.',
        },
        {
          type: 'text',
          body: '**2 · Not every change breaks a contract.** A signed contract is an agreement — "edit" cannot mean what it means in an ordinary form.\n\nI decided, field by field, what the vendor already agreed to and what they must agree to again; each modal states the consequence before you commit.',
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
              reason: 'Open, fill, close, hunt, repeat — the cost lands on the product’s most repeated action.',
            },
            {
              pattern: 'A filter bar over one master table',
              reason: 'Filters make you rebuild the to-do list every morning; a named queue remembers it.',
            },
          ],
        },
        {
          type: 'text',
          body: '**4 · The vendor column only exists once there is a vendor.** The rejected version kept a fixed grid and filled the gaps with dashes.\n\nAt scanning speed a dash reads as a loading failure and costs an investigation click. A missing column says **this does not exist yet**; an empty one says **something went wrong**.',
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
      navLabel: 'Edge cases',
      ghost: 'States',
      title: 'The states that decide whether it survives a bad week',
      blocks: [
        {
          type: 'text',
          body: 'Every table view was specified with its full set — default, loading, two empties (cleared vs first-time), no results, network error, inline row error, three toast variants.\n\nThe interesting ones only appear when something upstream has gone wrong.',
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
      navLabel: 'How I worked',
      ghost: 'Process',
      title: 'Structure first, pixels after',
      blocks: [
        {
          type: 'text',
          body: 'The full eight-step process ran underneath — problem framing, objective, persona, architecture, flows, wireframes, prototype, business case — it just isn’t the story.',
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
          body: 'The interaction model was proven in a data-driven prototype rather than a click-through, because the central claim is a data rule.\n\nIt runs ~75 routes across three monthly batches, with the least-finished-truck rule live in the filtering logic.',
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

  reflections: [
    {
      title: 'There is no usage number, and inventing one would be the easiest thing to catch.',
      body: 'Engineering is still building; every claim on this page is structural.',
    },
    {
      title: 'The measurement I want is the one I do not have.',
      body: 'Time to clear the Action Required queue, before and after.',
    },
    {
      title: 'The prototype demonstrates the worst-case-slot rule. It does not yet teach it.',
      body: 'Whether an unchanged queue reads as strict, or as ignoring finished work, will only show in a real month.',
    },
  ],

  next: {
    slug: 'transporter-contract-management',
    title: 'Transporter Contract Management',
    code: 'TCM-04',
  },
}
