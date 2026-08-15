---
slug: network-design-central
code: NDC-02
title: Network Design Central
oneLiner: The solver designs the routes. I designed the agreement.
meta: { role: "Product Designer — solo design owner", team: "Product, Data Science, Analytics, Tech (linehaul pod)", timeline: "TBC", platform: "Desktop web ops panel (internal)" }
---

## TLDR

- problem: Monthly regional-linehaul network planning — ~80 sort centres feeding 10,000+ delivery centres{*} — ran on Google Sheets, with no shared state between the central planner who generates route designs and the dozens of regional ops leads who must agree to them before an irreversible monthly freeze.
- outcomes: ["Clicks to start the primary task cut from 5 to ≤2", "6 conflicting status vocabularies collapsed into 1 canonical lifecycle", "Time-to-orient target of <30 seconds on the Command Center, enforced by design"]
- summary: I designed a net-new desktop workbench where a central planner triggers optimizer runs, compares them, and drives a structured row-by-row alignment loop with regional ops leads to a guarded, irreversible freeze. 13 locked design decisions and 2 ADRs turned an unstructured monthly negotiation into a repeatable ritual with one status language.

## STEP 01 — PROBLEM UNDERSTANDING

Every month, Valmo redesigns its regional linehaul network: which vehicle leaves which sort centre, visiting which delivery centres, in what sequence. At the scale in scope — ~80 sort centres, 10,000+ delivery centres, hundreds of optimizer runs per cycle{*} — a data-science solver (a vehicle-routing model) already produced the route designs. The bottleneck was never computation.

The bottleneck was agreement. A solver output is a proposal; the people who know whether a route is actually drivable are dozens of regional ops leads, each expert in their own sort centre. Before the tool, that negotiation happened across disconnected Google Sheets: the planner exported solver output, mailed it around, collected contradictory edits, and manually reconciled them against a monthly deadline after which the design becomes a vendor contract and cannot change. In one recent cycle, 32 delivery centres silently fell out of coverage across ~10 sort centres because infeasible vehicle inputs never surfaced to anyone who could catch them.

When I audited the PM-built feature prototype meant to replace this, I found a feature inventory, not a tool: an empty dashboard of 3 navigation cards, an invisible and unenforced Inputs→Creation→Review→Alignment pipeline, six different status vocabularies, and two very different user roles sharing one shell. A planner opening it could not answer three questions: what is happening across my network, what needs me, and where did I leave off.

So I reframed the problem. The tool's real job isn't producing route designs — the solver does that. Its job is getting dozens of regional ops leads to agree with a central planner before an irreversible monthly freeze. Designing the panel meant designing the ritual.

> STAT: Network scale | ~80 sort centres · 10,000+ delivery centres{*}
> STAT: Prior process | Google Sheets + email, no shared state
> IMG: The before state — solver output living in a spreadsheet | /Users/pranitakeshavraosapkal/Claude/network-design/templates/

## STEP 02 — OBJECTIVE

I set measurable process targets in the redesign spec before touching a single screen, because "make it usable" is not a brief:

- Time-to-orient — a planner landing on the dashboard understands the state of the network — under 30 seconds. Previously unmeasurable because the dashboard held nothing.
- Clicks to start the primary task (create a route design) from 5 to ≤2 from the dashboard.
- Status vocabularies from 6 to 1. Six modules had each invented their own words for the same lifecycle ("Planned", "Pending", "Passed with Warnings", "Awaiting"…); amber alone meant four different things.
- "Where is design X?" answerable from one view, without hunting.
- All four states (empty / loading / error / populated) defined on every screen — the prototype faked loading with timeouts and had almost no error states, which is how a real failure mode ("N delivery centres uncovered") stayed invisible.

Behind these sat the business objective the tool serves: full adoption of solver-led design, targeting a double-digit improvement in vehicle utilization and a shorter average network distance{*}. My design metrics were deliberately upstream of those numbers — if the planner can't orient, compare runs, and close alignment before the freeze date, no solver improvement ships.

> STAT: Clicks to primary task | 5 → ≤2
> STAT: Status vocabularies | 6 → 1
> STAT: Time-to-orient | <30s target
> IMG: Objective table from the redesign spec | /Users/pranitakeshavraosapkal/Claude/network-design/ndc-ux-redesign-spec.md

## STEP 03 — USER PERSONA

Two personas, and the single most consequential persona decision was refusing to let them share a shell.

**Central Network Planner (primary).** One person responsible for the whole network. Owns inputs, triggers runs, compares outputs, pushes plans for alignment, and executes the freeze. Their scarce resource is situational awareness: with ~80 sort centres and hundreds of runs per cycle{*}, they need to know what needs them right now, not browse. Expert internal user, desktop, dense tables welcome.

**Ops Lead / Regional PoC (secondary).** Regional operators — typically 3–4 per sort centre, sourced from the sort-centre master — who review a pushed plan row-by-row and flag what won't work on the ground: a vehicle type the local vendor doesn't run, a coordinate that's wrong, a cutoff that's undrivable. They should see exactly one thing: the plan assigned to them, plus a map. Everything else is noise and risk.

The PM prototype handled this with a persona toggle in one shared interface. I locked the opposite: production is real per-user login with two different shells — the Ops Lead gets a stripped interface containing only Ops Alignment and the map (the prototype keeps a clearly-labelled "Demo: view as…" switch, because a prototype has no auth). This is a trust decision as much as a UX one: an alignment ritual only works if reviewers physically cannot touch inputs, runs, or other regions' plans, and if the planner's acknowledge visibly locks the reviewers it names.

> STAT: Ops Leads per sort centre | typically 3–4, max 6
> IMG: Two-shell IA diagram, Planner vs Ops Lead | /Users/pranitakeshavraosapkal/Claude/network-design/prototype/userflow-ia.html

## STEP 04 — INFORMATION ARCHITECTURE

The IA had to make the monthly ritual legible in the navigation itself. Three moves did most of the work.

**One spine: the design lifecycle.** Every design carries a single lifecycle stage — Draft → Running → Created → In Review → Pushed → In Alignment → Acknowledged → Finalised — and every screen reads from it. The dashboard's pipeline chips, the runs view, and each module are projections of the same state, which is what makes "where is design X?" answerable from one view. On top of it sits one status vocabulary (Draft / In Progress / Needs Attention / Blocked / Done) with one rule I enforced ruthlessly: amber means "needs a human decision" and nothing else.

**One scoping container: the Design Cycle.** A named monthly plan group ("July 2026") scopes every upload, run, and alignment, capped at ≤80 runs. Without it, hundreds of runs per cycle{*} stack into an undifferentiated archive; with it, the planner always works inside this month.

**Nav lives in the sidebar, and only there.** The Planner shell reads as the ritual in order: Command Center → Design Inputs → Design Creation → Review & Alignment → Runs → Help. ADR-002 records the correction that got us there: an earlier build also drew a horizontal "lifecycle rail" above every module, duplicating the sidebar — and on the Ops Lead side it rendered dead, non-clickable stages. I deleted it and set the rule: module switching is infrequent, so it lives in the persistent sidebar; filters and sub-views are frequent, so they live in the content. Ops Alignment itself became master-detail — a persistent 300px plan rail with an always-populated detail pane — replacing a two-click drill into a list that looked empty.

> STAT: Design decisions locked before hi-fi | 13
> STAT: Architecture decision records | 2 ADRs
> IMG: Lifecycle state diagram | /Users/pranitakeshavraosapkal/Claude/network-design/ndc-flow.excalidraw
> IMG: Sidebar IA, both shells | /Users/pranitakeshavraosapkal/Claude/network-design/prototype/wireframes-v2.html

## STEP 05 — USER FLOW

The monthly ritual, end to end, with real cycle anchors (volume data lands ~the 10th; design due early the next month; a one-week feedback window; freeze; finalise within three days of freeze):

1. **Gate the inputs.** The planner uploads volume files and masters; a read-only node source-of-truth surfaces only flagged warnings as a pre-plan gate. The exit is an explicit success state — "✓ Inputs clean · Start Design Creation" — because a gate you can't see pass is a gate people route around.
2. **Trigger runs.** Select sort centres, pick a volume file, set vehicles and Historical Weight — a 0 / 0.5 / 1 dial for how much of last month's routes to preserve versus re-optimize. Each run is one async solver job per sort centre per weight value.
3. **Compare and choose.** Design Review shows per-run metrics (coverage, cost per shipment, utilization, routes, vehicles, distance) with a mandatory side-by-side of the three Historical-Weight runs. There is no reject button — an un-pushed run is just a discarded simulation.
4. **Push to alignment.** The planner names reviewers (PoCs pulled from the sort-centre master) and the plan appears in each Ops Lead's stripped shell.
5. **Row-by-row feedback.** Ops Leads mark each route Pending / Aligned / Needs Change / Blocker and flag specific cells — vehicle type, coordinates, touchpoints, cutoffs — with suggested corrections. ADR-001 locked the review grain at route level, not per delivery centre: a route is one vehicle trip, and its biggest lever (the vehicle) is a route property.
6. **Simulate, decide, freeze.** The planner runs Simulate per row (metric deltas only), accepts or rejects each suggestion, then Acknowledges — the irreversible freeze that locks every reviewer — and Finalises. The finalised design hands off downstream to become vendor contracts.

> STAT: Feedback window | ~1 week between push and freeze
> IMG: End-to-end flow diagram | /Users/pranitakeshavraosapkal/Claude/network-design/prototype/userflow-ia.excalidraw

## STEP 06 — LO-FI WIREFRAMES

I wireframed the panel twice — once to inventory the PM prototype's screens, once to restructure them around the ritual — and wrote a critique document ranking the top 10 fixes before any hi-fi work. Structure first, because most of what was wrong was structural.

The wireframe that mattered most was the **Command Center**. The old dashboard was 3 nav cards; the lo-fi replaced it with a cockpit answering the three planner questions in fixed positions: a deadline-health hero ("18 days to freeze · At risk" with the cycle's milestone timeline), a "Needs You" queue where every item is a state requiring the planner (failed runs, plans awaiting acknowledge, overdue alignments), pipeline chips showing counts per lifecycle stage — each a click-through filter, not a decoration — and a Start Something strip that puts run creation ≤2 clicks from landing.

Second: the **grouping rule**. At this scale, a flat list of 80+ items is a design failure, so I made it a standing convention — every list groups by sort centre or zone with roll-up progress headers, collapsible groups, segment filters, and "showing N of M". This rule alone did more for orientation than any visual treatment.

Third: the **unified wizard chrome**. Three multi-step flows had each invented their own stepper; I collapsed them into one pattern — stepper on top, step body, persistent footer with the validation summary bottom-left and the primary action bottom-right, later steps locked until earned. Locked steps are the pipeline's dependency model made physical.

The lo-fi IA record (`wireframes-v2.html`) is preserved as a reference artifact — I don't overwrite it, so the structural argument stays auditable against what shipped.

> STAT: Prioritized fixes from critique | top 10, tagged P0–P2
> IMG: Command Center lo-fi | /Users/pranitakeshavraosapkal/Claude/network-design/prototype/wireframes-v2.html
> IMG: Unified wizard chrome sketch | /Users/pranitakeshavraosapkal/Claude/network-design/ndc-ux-redesign-spec.md

## STEP 07 — PROTOTYPE

The canonical deliverable is a single-file interactive HTML prototype — the full V1 panel, both persona shells, running against seeded data at realistic scale: ~80 sort centres, ~239 runs, ~11.5k delivery centres, ~41 plans. I prototype at scale deliberately; a design that works with 5 mock rows tells you nothing about a tool whose whole problem is 80.

Two rules governed the build. **No dead controls** — every button, filter, and action is wired; backend-dependent writes surface an honest "coming soon" toast rather than a silent nothing. And **every list ships grouped** per the Step-06 convention, with breadcrumbs on every drill-in returning to the persona's home.

The two hero views got the most iterations. The **3-run comparison** puts the three Historical-Weight variants of a sort centre side-by-side — route stability against cost — so choosing a weight is a visible trade-off, not a config field. The **Ops Alignment loop** implements the full stateful machine on both shells: route rows with per-cell flag drill-downs, inline per-row Simulate, a per-reviewer submission tracker with a nudge that reflects on the Ops Lead's side as a "reminder from planner" chip, and the guarded Acknowledge dialog.

Visual system: Meesho's internal design system{*} with the product's navy override, 13px base type, dense tables with a deliberate hierarchy, WCAG 2.1 AA contrast, and status never conveyed by colour alone. FTUX is sparing by locked decision: a 4-step dismissible tour plus contextual tooltips on exactly the six genuinely non-obvious concepts (Historical Weight, reference plan, validation flags, Design Cycle, Acknowledge, Simulate).

Every edit round is verified — template-tag balance, script syntax, zero binding leaks, screenshot-confirmed flows for both personas — and backed up before touching.

> STAT: Seeded prototype scale | ~80 SCs · ~239 runs · ~11.5k DCs · ~41 plans
> IMG: Command Center, populated state | /Users/pranitakeshavraosapkal/Claude/network-design/prototype/Network-Design-Central-v1.0/ndc.dc.html
> IMG: 3-run Historical-Weight comparison | /Users/pranitakeshavraosapkal/Claude/network-design/prototype/Network-Design-Central-v1.0/ndc.dc.html
> IMG: Ops Alignment master-detail, Ops Lead shell | /Users/pranitakeshavraosapkal/Claude/network-design/prototype/Network-Design-Central-v1.0/ndc.dc.html

## STEP 08 — BUSINESS ASPECTS

The tool exists to make solver-led network design the default, and the solver exists to cut cost per shipment — via a double-digit vehicle-utilization improvement target and a shorter average sort-centre-to-delivery-centre distance{*}. But the adoption metric that pays for those is human: a design only realizes its modelled savings if it survives alignment intact and freezes on time. The programme explicitly tracks how many routes and vehicles reach the downstream contract stage unmodified — which is why I treated the alignment loop, not the solver UI, as the highest-leverage surface.

Three business constraints shaped the design directly. **Route churn is a real cost**: routes becoming contracts means every changed route code triggers vendor re-negotiation and ops re-learning — that is why Historical Weight and the reference-plan mechanism are first-class UI, not advanced settings. **Solver time is scarce**: full re-plans take hours per sort centre on limited licenses, which is why Simulate honestly shows only metric deltas rather than pretending to re-optimize (Decision Spotlight 1). **The freeze date is contractual**: miss it and the network runs another month on the old design, so the Command Center's hero is deadline health, not vanity metrics.

Trade-offs I accepted knowingly: two-version persistence instead of a full audit log (Spotlight 5), shallow file-level input validation instead of per-cell editing, and no month-over-month comparison in V1 — each cut scope from the ritual's periphery to protect its core. A phased-release option — shipping the alignment module alone for the next cycle — was kept open, because agreement is the bottleneck the business feels first.

> STAT: Cost lever | double-digit utilization improvement target{*}
> IMG: Deadline-health hero on the Command Center | /Users/pranitakeshavraosapkal/Claude/network-design/prototype/Network-Design-Central-v1.0/ndc.dc.html

## DECISION SPOTLIGHTS

**1. Simulate shows metric deltas only — honesty about solver cost.**
Decision: When an Ops Lead suggests a change, the planner's per-row Simulate shows only the metric movement (Δ km / cost / time / vehicles) — never a re-drawn plan — and it is wired inline on each row, not as a footer button.
What I rejected: A "re-optimize with this change" button, and a batch simulate at the bottom of the table.
Why: A full re-plan is an hours-long solver job on a licensed engine; a button implying instant re-optimization would lie about the system's physics, and planners would learn to distrust it the first time reality diverged. A delta is cheap, truthful, and exactly sufficient for the actual decision — accept this row or not. Inline placement matters because accept/reject is a per-row judgment; a footer button turns forty small decisions into one vague one.

**2. Acknowledge is an irreversible, guarded freeze — and looks like one.**
Decision: Acknowledge is a first-class action with a confirmation dialog that names exactly which reviewers get locked. After it, no Ops Lead can edit anything. There is no undo.
What I rejected: A silent status flip, and a reversible "lock/unlock" toggle.
Why: The freeze is the entire point of the ritual — after it, the design becomes vendor contracts. A reversible lock invites late edits that desynchronize the contract from the plan, recreating the exact sheet-era failure. Irreversibility is only safe if the UI makes its blast radius visible before the click, so the dialog states the consequence in terms of people, not state names.

**3. No Reject button — un-pushed runs are discarded simulations.**
Decision: Design Review has Push to Alignment and nothing else. A run the planner doesn't push simply expires with the cycle.
What I rejected: The conventional Approve/Reject pair on every run card.
Why: With three Historical-Weight runs per sort centre, most runs are explorations by design — hundreds of runs{*} funnel into at most ~80 pushed plans. A Reject button would force planners to perform bookkeeping on artifacts that carry no obligation, and would wrongly imply a rejected run is a recorded decision someone might audit. Removing it made the mental model honest: runs are cheap questions; pushing is the first commitment.

**4. Reference-plan smart defaults — never 80 manual picks.**
Decision: Any run preserving history needs a reference plan per sort centre; the panel auto-carries forward last cycle's finalised plan and forces a manual pick only for brand-new sort centres, with bulk-apply for the rest.
What I rejected: A per-sort-centre picker as the default path.
Why: The correct answer is the same ~79 times out of 80 — last month's finalised design. Asking for it explicitly at network scale is 80 chances to mis-click before the cycle even starts, in a flow the planner runs under deadline. Defaults are where a tool proves it understands the job; this one encodes "stability unless you say otherwise," which is also the business's route-churn posture.

**5. Two-version persistence over an audit log.**
Decision: The system keeps exactly two versions of a plan — the published baseline and the finalised outcome. No per-edit history.
What I rejected: A full audit trail of every flag, simulate, and accept/reject.
Why: The alignment loop generates enormous intermediate state, and none of it matters after the freeze — what the network runs on is the finalised plan, and what it changed from is the baseline. An audit log is engineering cost and UI surface spent on a forensic need nobody articulated, while the diff people actually ask for ("what did alignment change?") falls out of two versions for free. V1 scope discipline: build the ritual, not its museum.

## REFLECTION

The honest account is that I inherited a prototype where every feature existed and nothing was usable, and most of my contribution was subtraction and sequencing rather than invention: deleting a duplicate navigation tier, collapsing six status vocabularies into one, removing a Reject button, refusing an audit log. Two things I'd flag against myself. First, several structural calls — the route-grain review in ADR-001, the master-detail rethink in ADR-002 — were corrections I made after building the wrong thing once; the evidence was in the requirements the whole time, and reading it harder earlier would have saved a rebuild of both persona shells. Second, the design is validated so far by spec-fidelity checks and stakeholder review, not by a planner running a live cycle through it — the <30s and ≤2-click targets are design-enforced, not field-measured, and the first real monthly cycle will tell me whether the alignment ritual I designed matches the negotiation ops leads actually have. I designed the ritual; the network hasn't voted yet.

## GAPS

- Timeline is "TBC" — need actual project start/end months for the meta block.
- No field validation data yet: has a live cycle run through the panel? Any measured time-to-orient, alignment-completion, or freeze-date adherence numbers to replace the design-target framing?
- Usability testing: were the 6–8 UT participants (from the process-metrics list) used on this project or another? If NDC was tested, I need findings to cite.
- Image exports: all IMG suggestions point at source HTML/spec files — need actual PNG exports (Command Center, 3-HW comparison, Ops Alignment both shells, Acknowledge dialog, map) at public-safe fidelity.
- The map module (arc map) is listed as high priority but was still open at last status — confirm whether to mention it as shipped, in-progress, or cut from the narrative.
- Confirm the "hundreds of optimizer runs{*}" framing is comfortable, and whether "double-digit utilization improvement target{*}" is acceptable or should be vaguer.
- Confirm role phrasing ("solo design owner") and the team credit line reflect how Pranita wants collaboration represented.
- ADR count: the fuzzing map's process metrics say "2/3 ADRs" — this project has exactly 2; confirm the site-wide stat handles that.
