---
slug: linehaul-nexus
code: CLH-03
title: Contract Lifecycle Hub
oneLiner: One panel had to hold two contradictory realities — national contracts fan out to many vehicles, regional contracts stay strictly one-to-one — without forking the product in two.
meta: { role: "Product Designer — sole designer, IA through hi-fi", team: "1 PM, 1 EM, central linehaul ops stakeholders", timeline: "TBC", platform: "Internal desktop web panel (Chrome, ~1440×900)" }
---

## TLDR

- problem: Central linehaul managers ran thousands of route contracts every monthly cycle{*} through spreadsheets, WhatsApp threads, and phone calls, with no single surface that told them what needed action right now.
- outcomes: ["Locked a 5-tab lifecycle IA (v4) covering 14 end-to-end flows before any hi-fi work began", "Audited 50+ legacy screens against the spec and caught 10 structural issues pre-handoff — 3 of them IA-breaking", "Shipped a 130+ screen design system-compliant panel plus a data-driven interactive prototype"]
- summary: I designed the central ops panel that moves every route contract from "needs a transporter" to "closed" through one 5-tab lifecycle, governed by a worst-case-slot rule that makes it impossible for half-done work to look finished. The IA was locked in an ADR before Figma started, which is why 130+ screens shipped without a structural revision.

## STEP 01 — PROBLEM UNDERSTANDING

Meesho's Valmo logistics network runs on route contracts: an agreement that a specific transporter will run a specific route with specific vehicles at a specific price. Every monthly cycle, the central linehaul (CLH) team must place thousands of these contracts{*} — assign a transporter, wait for acceptance, verify terms, activate, monitor performance, and eventually close or terminate each one.

Before this panel, that lifecycle lived nowhere. Assignments happened over bulk Excel uploads, acceptance chasing happened over phone calls, and disputes surfaced in WhatsApp threads. The manager's core question — "what needs my attention right now, across everything?" — had no answer short of manually reconciling spreadsheets.

The structural difficulty was that the contract object itself is two different shapes. National linehaul (NLH) routes need multiple vehicles: one requirement fans out to N contracts, one per vehicle slot, each of which can independently be unassigned, rejected, accepted, or disputed. Regional linehaul (RLH) routes are strictly one requirement, one vehicle, one contract. A naive design forks into two products — an NLH panel with slot management and an RLH panel with simple rows. The team could not afford two products, and the manager's day does not split by haul type; both arrive in the same monthly batch.

There was also a legacy: an earlier "RFQ Management" design effort had produced 136 Figma screens and several HTML prototype iterations, built before the product's object model was settled. That work was operationally rich but structurally misaligned with the PRD — which meant the first job was not drawing screens, it was deciding what the existing screens got wrong.

> STAT: monthly contract volume | thousands of route contracts per cycle{*}
> STAT: legacy screens inherited | 136 Figma exports + 6 prototype iterations
> IMG: annotated photo of the pre-panel workflow — Excel sheet beside a WhatsApp thread | recreate as illustration

## STEP 02 — OBJECTIVE

The objective was one panel that answers "what needs my attention" truthfully — where every contract's position in the UI is derived from its actual state, and where NLH and RLH share a single structure without either persona-forking the product or hiding NLH's slot complexity.

Concretely, the design had to guarantee three things. First: nothing half-done can look finished. If 3 of 4 vehicle slots on a national route are approved but 1 is unassigned, the item must not appear anywhere that implies completeness. Second: the manager's landing view is their to-do list, not a dashboard — the default tab is Action Required, and the measurable definition of a good day is clearing it. Third: the structure had to be locked before high-fidelity work began, because the previous effort had demonstrated the cost of the opposite — 136 screens drawn against a drifting spec, which my later audit showed had diverged from it in 10 structural ways.

Process targets I held myself to: a written, versioned IA spec covering every tab, pill, and column (it locked at v4); an ADR recording every contested structural decision (4 were contested); and a P0–P3 severity audit of all legacy screens before any of them were reused as visual reference. The output target was full lifecycle coverage — 14 flows across 5 tabs — in both a Figma screen set and a working data-driven prototype.

> STAT: IA spec versions before lock | 4
> STAT: contested decisions resolved by ADR before Figma | 4

## STEP 03 — USER PERSONA

The CLH Manager is a central operator on Meesho's linehaul team — one person responsible for contracts across all regions, not a regional coordinator. They work on a mid-range laptop in Chrome at roughly 1440×900, desktop only, and they are tech-savvy: dense tables, keyboard navigation, and bulk Excel flows are their comfort zone, not a burden. This is the opposite persona from the transporter-facing apps I design elsewhere — here, information density is welcome and whitespace is waste.

Their day is triage. Work arrives in monthly design batches (business-as-usual plus sale-event batches), and the mental model is portfolio-wide: "what is broken anywhere, right now?" — not "how is route X doing?" This shaped the panel's most consequential defaults. The landing tab is Action Required, sorted most-urgent-first everywhere, with a red-orange-green-neutral chip hierarchy and count badges on every tab so workload triage happens before any click.

Two edge conditions mattered. Urgency is time-boxed: a contract activating within 48 hours with no transporter is a different problem from one activating next month, so urgency chips are computed from the activation countdown, not manually flagged. And while the manager is fluent in English UI, consequence-bearing actions carry real money — so Terminate and Close confirmation modals get a Hindi translation toggle, deliberately nowhere else. Translating the whole panel would have been persona-inappropriate; translating the two irreversible actions is comprehension insurance where a misread costs a live contract.

Accessibility floor: WCAG 2.1 AA (4.5:1 text, 3:1 UI), full Tab/Enter/Esc keyboard operation, screen-reader labels on every chip and icon button.

> STAT: urgency threshold driving red chips | activation within ≤48h
> IMG: persona card — CLH Manager at 1440×900 with the Action Required tab open | figma export or prototype screenshot

## STEP 04 — INFORMATION ARCHITECTURE

The IA is a 5-tab lifecycle, locked in spec v4: **Action Required → Sent for Approval → Approved → Active → Closed**. Three levels sit above and below it: L1 is a cross-program overview with a portfolio-scoped action bar (ADR-001 D1 — aggregated counts across all design batches, because a per-batch action bar would force the manager to mentally sum their own workload), L2 is the 5-tab table and the primary surface, L3 is the single-contract detail page.

The hinge of the whole architecture is the **worst-case-slot rule**: an item's tab placement equals its most-broken slot's state. An NLH contract with 3 slots approved and 1 unassigned sits in Action Required, full stop. This is what lets NLH and RLH share one structure — an RLH contract is simply the degenerate case with one slot, so the same rule places both without a special path. It is also the panel's honesty mechanism: Approved is a clean pre-flight list precisely because nothing can reach it with an unresolved part.

Under each tab, pills are named work-queues, not filters. "Assign Transporter," "Rejected," "No Response (≥7 days)" — each pill is a job with a count, a specific column layout, and exactly one primary CTA per row. Columns 1–5 are a shared identity block across every tab (requirement details, route, vehicles, placement time, activation date); columns 6+ change per pill. Two column rules carry disproportionate weight: the Transporter column is absent wherever no transporter exists yet — an empty column would be a lie about the data model — and Contract ID never gets a standalone L2 column, because the manager triages by requirement, not by contract index.

A second structural act preceded all of this: renaming the module from "RFQ Management" to "Contract Management" before V1 design began, deferring marketplace-bidding concepts to V2 (detail in Spotlights).

> STAT: lifecycle tabs | 5, with 15 pills across them
> STAT: shared identity columns across all tabs | 5
> IMG: IA diagram — L1/L2/L3 with the 5-tab state machine | linehaul-nexus/ia-diagram.png

## STEP 05 — USER FLOW

The primary flow is the assignment loop, and its shape differs by haul type inside one interaction pattern. The manager lands on Action Required > Assign Transporter (the default pill), sorted most-urgent-first. Clicking Assign expands the row inline (~200ms ease-out) — no page change, context preserved. For an RLH route, the expansion is a single form: transporter, amount, confirm. For an NLH route, the same expansion is a slot list — assign per slot, partially if needed, and the Assignment Status column tracks "Unassigned 4/4" down to fully assigned. On send, the item moves to Sent for Approval; per the worst-case-slot rule, a partially-sent NLH item stays in Action Required until every slot is out.

Sent for Approval is a waiting room with teeth: the No Response pill activates at ≥7 days, and a sticky footer bar supports bulk reminders across selected rows. Acceptance moves the item to Approved — deliberately not straight to Active. ADR-001 D2 locked an explicit activation gate: the manager reviews terms and activates manually, because a disputed contract auto-activating costs far more than one click per contract (the trade-off is recorded in the ADR).

Active splits into performance monitoring (On Track / Below Target via TAT and on-time-placement metrics) and exception handling. Pre-activation disputes resolve inline; Active disputes navigate to L3, because mid-contract dispute resolution — including repricing remaining trips — is too consequential for an inline expand. Termination carries a 3-day buffer, stated in the modal with a computed end date, so routes are never cut without coverage. Everything terminal lands in Closed, read-only, pill-filtered by outcome.

Fourteen flows total, each specified to the modal and toast level in the build spec before prototyping.

> STAT: end-to-end flows specified | 14
> STAT: no-response escalation threshold | ≥7 days
> IMG: flow map — assignment loop with NLH/RLH branch and the activation gate | recreate from CLH-Complete-Flows.html

## STEP 06 — LO-FI WIREFRAMES

I inverted the usual order here deliberately: structure was interrogated in text and diagram before anything visual, because the project's inherited risk was 136 screens of visual work built on unsettled structure. ADR-001 D4 locked the sequence — Excalidraw IA diagram, then ADR, then Figma — with the explicit rationale that rework in a diagram is 5–10x cheaper than rework in high-fidelity.

Two audits functioned as the lo-fi phase. First, a cross-verification of the existing prototype against the 21-page PRD surfaced 10 structural issues (4 HIGH, 4 MEDIUM, 2 LOW) and the 4 decisions that became ADR-001, alongside a requirements gap analysis that enumerated missing states — Draft, Modification Requested, Expiring Soon — so they were designed in from the start rather than retrofitted. Second, once updated screens existed, I ran a P0–P3 severity review of 50+ of them against spec v4: 3 P0 IA-breaking issues (pill names diverging from the locked spec — the navigation backbone engineering would build from), 7 P1 consistency breaks, 11 P2 copy/visual issues, and 8 P3 missing states (empty, loading, error, search-empty, overflow, pagination). The P0s were all spec-vs-screen drift — exactly the failure mode the locked-IA-first sequence exists to catch, caught before handoff instead of in engineering.

The wireframe-level artifacts that came out of this phase: the Excalidraw IA diagram, the v4 spec's column tables (every tab's layout defined as text before pixels), and per-screen guiding-principles notes recording the intent behind each interaction so hi-fi decisions had written rationale to answer to.

> STAT: structural issues caught pre-Figma | 10 (4 HIGH / 4 MEDIUM / 2 LOW)
> STAT: legacy screen audit | 50+ screens → 3 P0 · 7 P1 · 11 P2 · 8 P3
> IMG: P0–P3 scorecard table from the April review | clh-rfq-panel/tasks/design-review-apr16.md

## STEP 07 — PROTOTYPE

The interaction model shipped as a single-file, data-driven HTML prototype (1,445 lines, vanilla JS, no framework or build step) — deliberately not a click-through, because the panel's core claims are data rules, and data rules can only be demonstrated on data. The prototype runs ~75 contract records across 6 transporters, 8 routes with node-level detail, and 3 design batches; the worst-case-slot rule is implemented in the filtering logic itself, so a partially-assigned NLH item genuinely refuses to leave Action Required when you assign 3 of its 4 slots.

Coverage: all 5 tabs and their pills, inline assignment for both haul types (RLH single form, NLH slot list), the slide-out filter panel, route hover popovers showing intermediate nodes, the detail panel, confirmation modals at 480px with a 50% overlay, a three-variant toast system (success auto-dismisses at 4s, errors require manual dismissal — an error you can miss is an error you will miss), and Esc-key dismissal throughout. Every row carries exactly one primary CTA, and the CTA verb shifts with lifecycle stage: Assign → Send Reminder → View Details.

Hi-fi execution happened in Figma against Meesho's internal design system{*}, producing 130+ screens across the lifecycle. To keep 130+ screens honest against the locked spec, I built audit tooling into the workflow: automated checks for IA compliance (tab/pill/column correctness, the transporter-column rule, the worst-case-slot rule), design-system compliance (hardcoded values, detached components), and state coverage (default, empty, loading, error, inline edit, modals) — turning the April review's manual findings into repeatable checks.

> STAT: prototype | 1,445 lines, single-file, ~75 records, all 14 flows
> STAT: hi-fi output | 130+ Figma screens
> IMG: prototype — NLH row expanded to slot list with mixed states | linehaul-nexus/route-hover-prototype.html screenshot

## STEP 08 — BUSINESS ASPECTS

The business case for this panel is failure-cost avoidance at volume. Every contract that activates with wrong terms becomes a dispute after trips have run — a negotiation over money already spent. The explicit activation gate (ADR-001 D2) trades one click per contract for catching those before a single trip runs; at thousands of contracts per cycle{*}, the asymmetry is stark, and it aligns directly with the network's cost-predictability goals. The 3-day termination buffer is the same logic in reverse: a hard cut leaves routes uncovered, and uncovered routes are the most expensive kind of failure in a logistics network.

The adhoc decision (D3) protects the system's data integrity. A small share of trips{*} are one-off contracts with no upstream requirement; zero surface for them means they revert to WhatsApp and phone calls — the exact off-system behavior the panel exists to eliminate. A single "Create Adhoc Contract" button captures them in-system at V1 cost, deferring full adhoc management to V2.

Scope discipline was itself a business decision. The vast majority of new contracts auto-match and carry forward from the previous cycle{*}, so the panel is designed around the exceptions — the manager's time goes where automation stops. V1 deliberately excludes the bidding marketplace (the "RFQ" concept), reporting dashboards, and the transporter-facing portal; the ADR records the V2 migration paths so these exclusions are deferrals with a plan, not gaps.

Trade-offs accepted and documented: portfolio-scoped L1 requires cross-batch backend aggregation (flagged for eng in the ADR); the activation gate adds manual work to every contract; adhoc contracts bypass the requirement-linking flow until V2.

> STAT: adhoc trip share captured in-system | a small, real minority{*}
> STAT: locked decisions with recorded trade-offs | 4 (ADR-001 D1–D4)

## DECISION SPOTLIGHTS

**The worst-case-slot rule**
Decision: an item's tab placement equals the state of its most-broken slot. Three approved slots plus one unassigned slot = the whole item stays in Action Required.
What I rejected: best-case or majority-state placement (item shows as Approved with a warning badge), and duplicating the item across tabs (appears in both Approved and Action Required).
Why: badges get ignored at density — a manager scanning dozens of rows filters warnings out within days. Duplication breaks tab counts, and counts are the triage instrument. Worst-case placement makes the Approved tab a guarantee, not a summary: if it's there, every part of it is ready. It's also the mechanism that unifies NLH and RLH — a single-slot RLH item follows the identical rule, so one structure holds both shapes without a special case.

**Renaming the mental model before the screens: RFQ → Contract Management**
Decision: rename the module from "RFQ Management" to "Contract Management" before V1 design began, deferring all bidding/marketplace concepts to V2.
What I rejected: keeping RFQ terminology (matching the legacy 136-screen set and the spec's internal vocabulary) and designing a stubbed bidding surface "for later."
Why: V1 has no bidding — a manager assigns a transporter directly. Calling that an RFQ names a workflow that doesn't exist and trains a mental model V1 can't honor. Renaming first meant every label, breadcrumb, and empty state was written against the true V1 object model. The cost, recorded in the ADR: V2 must reintroduce RFQ terminology carefully. Cheaper than shipping V1 with a name that lies.

**Pills as named work-queues, not filters**
Decision: each sub-pill under a tab is a job with a name, a count, its own column layout, and one primary CTA — "Assign Transporter (23)" is a queue you clear, not a facet you toggle.
What I rejected: a generic filter bar over one master table (status dropdown + saved views).
Why: filters make the user construct their to-do list every session; queues persist the construction. The count on the pill is workload measurement before any click, and per-queue column layouts mean each view carries exactly the data that job needs — the Rejected queue shows rejection reason, the Upload Errors queue shows the error summary. The April audit validated how load-bearing this is: pill-name drift between spec and screens was the single biggest P0, because pills are the navigation backbone engineering builds against.

**Transporter column absent until a transporter exists**
Decision: the Transporter column does not render in Action Required queues where no transporter has been assigned — with one deliberate exception, AR > Disputed, where a transporter exists but disputed pre-activation.
What I rejected: a fixed column grid across all tabs with "—" placeholders for consistency.
Why: an empty column is a claim that data is missing; an absent column is a statement that the data does not exist yet. At this persona's scan speed the difference is real — dashes read as load failures or data errors and cost investigation clicks. The exception proves the rule is semantic rather than cosmetic: Disputed rows show the column because the underlying object genuinely has a transporter.

**Audit before hi-fi: the P0–P3 gate**
Decision: no Figma work until the IA was locked (Excalidraw → ADR → Figma), and no legacy screen reused as reference until it passed a severity-graded audit — 50+ screens reviewed, 10 structural issues from the PRD cross-check, a ~20-item gap analysis of missing states and requirements.
What I rejected: iterating directly in Figma from the existing 136 screens, treating them as an approved baseline.
Why: the audit found 3 IA-breaking deviations in the legacy set — including two different pill-naming schemes on adjacent screens of the same tab. Built as-is, engineering would have implemented a navigation structure that contradicted the spec. Catching structure in a diagram costs a redraw; catching it in 130+ hi-fi screens costs weeks.

## REFLECTION

The thing I'd defend hardest about this project is also the thing that made it slow to show: I spent the first phase producing text — a versioned spec, an ADR, two audits — while stakeholders had 136 existing screens they could already look at. Arguing that those screens were a liability rather than a head start was uncomfortable, and I didn't win it with taste; I won it with the audit's severity table, which is a lesson in itself about how designers earn structural authority. What I'd do differently: the P0 pill-naming drift happened partly because the spec lived in a text file while design moved in Figma — the sync between the two was manual, and manual sync drifts. Building the compliance checks earlier, rather than after the April review exposed the gap, would have caught the divergence at the first renamed pill instead of the fiftieth screen. I also carry an honest unknown: the worst-case-slot rule is architecturally clean, but I have not yet watched enough real managers hit a "3 of 4 assigned, why is this still in my to-do list" moment to know how much explanation the UI owes them at that instant. The prototype demonstrates the rule; usage will test whether it also needs to teach it.

## GAPS

- **Timeline** — meta.timeline is "TBC"; need actual project date range (IA lock was Mar 2026, screen audit Apr 2026 — confirm start and current status).
- **Team composition** — I assumed "1 PM, 1 EM + ops stakeholders"; confirm actual collaborators (no names will be published).
- **20-item requirements gap analysis** — the brief cites this figure but I could not locate the artifact in the repo; ADR-001 references missing states (Draft, Modification Requested, Expiring Soon) from the PRD cross-check. Confirm the count and source doc, or I'll soften to "a requirements gap analysis."
- **Outcome metrics** — no adoption/usage numbers exist in the source docs (panel appears pre-launch or newly launched). If there are early results (assignment time, dispute catch rate at the activation gate, off-system contract reduction), they'd strengthen TLDR outcomes.
- **Usability testing** — no UT sessions are documented for this project specifically; the fuzzing map allows "6–8 UT participants" verbatim but I found no CLH UT artifact, so I omitted it. Confirm whether UT ran on this panel.
- **Image assets** — all IMG suggestions need export/screenshot passes; the ia-diagram.png and prototype screenshots exist, the flow map and persona card need creating.
- **Design system naming** — I used the public phrasing "Meesho's internal design system" per the fuzzing map; confirm whether "Crystal" by name is acceptable on the public site (map rates it low sensitivity).
