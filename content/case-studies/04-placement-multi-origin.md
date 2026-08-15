---
slug: placement-multi-origin
code: PLC-05
title: Placement & Assignment — the Multi-Origin Route Builder
oneLiner: Six percent of trips were quietly corrupting the data everyone else depended on — and the fix wasn't allowed to cost the other ninety-four percent a single click.
meta: { role: "Product Designer — end-to-end (research, IA, interaction design, prototype)", team: "Valmo TMS — Placement & Assignment pod (design, PM, ops-tech engineering)", timeline: "TBC", platform: "Desktop web panel (internal ops tool, Chrome)" }
---

## TLDR

- problem: The trip-edit screen assumed one source node per trip, so ops teams handling multi-origin routes (~6% of trips, ~20% of national lanes) faked zero-bag challans or deleted and recreated live trips — both flagged in the requirements doc as data corruption.
- outcomes: ["Multi-origin trips became a single editable record — the delete-and-recreate workaround and fake 0-bag challans were designed out", "Node add reduced to 2 clicks in the multi-origin builder; the 94% single-origin flow kept its existing layout with zero added steps", "Trip creation cut from minutes to seconds, with source data accuracy moved above 95%{*}"]
- summary: I redesigned the Trip L2 edit screen so one vehicle collecting from multiple hubs is one trip record with explicit Source / Destination / RTO roles, bounded by an immutable contract snapshot. The single-origin majority renders a near-identical layout to today — the mode is decided once at page load, so 94% of users never see the new machinery.

## STEP 01 — PROBLEM UNDERSTANDING

The Valmo TMS trip-edit screen was built on one assumption: a trip has exactly one source node. That assumption holds for roughly 94% of trips. It fails for national linehaul (NLH) routes where a single vehicle collects freight from two or more hubs before heading to the destination — about 6% of trips, but roughly 20% of national lanes, because multi-origin concentrates on the long-haul routes that carry the most freight.

The tool couldn't express that reality, so ground teams invented one. Two workarounds circulated. The first: delete the trip after the first pickup and recreate it from the second hub — destroying the trip's history and orphaning the first leg's data. The second: raise a fake zero-bag challan at the "extra" hub so the system would let the vehicle through — injecting a fabricated dispatch document into the freight record. The requirements document named both explicitly as data corruption. Every downstream consumer — billing, utilization reporting, transporter payouts — was reading data that a minority of trips had quietly falsified.

The constraint that shaped everything: the fix could not tax the majority. An Assignment Manager touches hundreds of trips a week, and 94% of them are single-origin. A redesign that added even one click, one field, or one moment of "which mode am I in?" to that flow would cost more in aggregate than the 6% problem it solved. The brief I set myself: make the 6% expressible, keep the 94% untouched.

> STAT: multi-origin share | ~6% of trips, ~20% of national lanes
> STAT: workarounds identified | 2 (delete+recreate, fake 0-bag challans) — both flagged as data corruption
> IMG: Before/after diagram — one physical route rendered as fake challans vs. one trip record | placement/specs/Multi-origin/

## STEP 02 — OBJECTIVE

One measurable target with a hard guard-rail: a multi-origin route is managed as a single trip record with explicit node roles (Source, Destination, RTO Destination), and the single-origin flow gains zero additional clicks, fields, or decisions.

Concretely, the design had to satisfy four requirements from the KRD: three node sections on the trip edit page (FR-T02); node additions restricted to the original contract snapshot with no role changes post-creation (FR-T03); RTO destinations always a subset of source nodes (FR-T04); and reordering scoped within a section, never across sections. On top of those, I set my own interaction budget: adding a node in the multi-origin builder must cost at most 2 clicks, because an AM adding the fourth node of a route should not pay a per-node tax that a form designed for one node never charged.

The success measures were direct: the two workarounds become unnecessary (there is now a legitimate, audited path for every real-world case, including dispatching with zero freight); trip creation time drops from minutes to seconds{*}; and source data accuracy — how often the trip record matches what physically happened — moves above 95%{*}. The last two carried the business case: corrupted trip records weren't a hygiene annoyance, they were the input to billing and payout calculations.

> STAT: interaction budget | 2 clicks to add a node
> STAT: accuracy target | source data accuracy >95%{*}

## STEP 03 — USER PERSONA

The user is a Linehaul Assignment Manager — internal Valmo ops, desktop-first, Chrome on a mid-range laptop. He manages hundreds of routes and trips per week: bulk-uploading trip templates, fixing validation failures, assigning vehicles and drivers, and editing live trips when ground reality shifts. He is a power user in the strict sense — he knows the domain vocabulary (NLH, RTO, challan, placement window) better than the tool does, and he measures the tool in seconds per trip because his week is trips multiplied by seconds.

Three traits drove the design. First, throughput dominates: any pattern that adds steps to a repeated action gets felt hundreds of times a week, which is why the 2-click budget and the rejection of every 3-click pattern (Step 07, Decision Spotlights) were non-negotiable. Second, he edits live operational trips — a vehicle may already be on the road when he opens the screen. That rules out any interaction that commits a change without an explicit confirmation gate; a misclick on a live trip has a physical consequence. Third, he is not the villain of the workaround story — he is its victim. The fake zero-bag challans weren't laziness; they were the only move the tool allowed. The persona insight that reframed the project: when a competent operator fabricates data, the tool's model of reality is wrong, not the operator.

I validated the mental model against the existing screen he uses daily: source node at the top of Trip Overview, destination list below. The single-origin render mode preserves that layout deliberately — his muscle memory is an asset the redesign was not allowed to spend.

> STAT: weekly volume | hundreds of routes and trips per AM
> IMG: Persona snapshot — Linehaul AM at desktop with trip listing | placement/specs/Placemet module/

## STEP 04 — INFORMATION ARCHITECTURE

The IA question was: where does "which hub plays which role" live? The answer became a three-layer structure with one immutable anchor.

The anchor is the **contract snapshot** — an immutable record of nodes and their roles (FIRST_ORIGIN / SUBSEQUENT_ORIGIN in the source column) captured at trip creation. Everything the AM can do on the edit screen is bounded by it: he can add only nodes present in the snapshot, and he cannot change a node's role after creation. This single decision collapsed the validation surface — instead of designing rules for arbitrary node graphs, every edit is a selection from a known, finite set.

Above the snapshot sits the **trip edit screen with two render modes**, decided once at page load from `trip.source_nodes.length`. One source node → the existing single-origin layout, near-identical to today: source in Trip Overview, simple destination list, RTO as an auto-mirrored read-only row. Two or more → the multi-origin layout with three visually distinct sections: Source Nodes (indigo accent), Destination Nodes (teal), and RTO Destination Nodes (amber, shown only for round trips). Color accents pair with text labels and section headers — never color alone.

Around the screen sits the **trip lifecycle**: Action Required → Upcoming → Ongoing/In-Transit → Completed → Cancelled, with a source-node global filter gating the listing (no trips render until a node is selected). RFQ auto-trips arrive locked — flagged "Auto-Generated," with only vehicle and driver numbers editable — so the IA distinguishes trips the AM authored from trips the system authored.

> STAT: node sections in multi-origin mode | 3 (Source · Destination · RTO)
> IMG: IA diagram — contract snapshot bounding the edit screen, two render modes branching from source_nodes.length | placement/prototype/trip-edit-multi-origin.html

## STEP 05 — USER FLOW

The core flow is the multi-origin node add, and it is deliberately short. The AM opens a trip; the page reads `source_nodes.length` once and renders the matching mode. In multi-origin mode he sees the three sections populated from the trip, plus one add-node control: a Node Code dropdown and three always-enabled role buttons — Add as Source, Add as Destination, Add as RTO. Pick a node, click a role button. Two clicks. Validation runs on the click, not before: if the action is illegal, a specific inline error appears at the point of action ("RTO must be a subset of Source"), and nothing is committed. Reordering is drag within a section; dragging across sections is impossible by construction, which enforces the no-role-change rule physically rather than through an error message.

Two rules automate the round-trip case. Adding a node to Source auto-adds it to RTO; removing it from Source auto-removes it from RTO. The AM touches RTO only for the one real decision it holds — excluding an origin from return freight — which he does by manually removing that node from the RTO section.

Downstream, the flow legitimizes what the workarounds faked. If a hub genuinely has no freight, the AM dispatches with a 0-challan — an explicit, audited action, not a fabricated document. Loop close (the ops-tech action marking all origins done) triggers a confirmation modal listing any still-open origins, and auto-closure on RTO arrival is disabled for multi-origin trips because forward and return node orders can differ — closing on the first RTO arrival would close a trip that isn't done.

> STAT: node add | 2 clicks (pick node → click role)
> IMG: Flow diagram — add node, validate-on-click error, RTO mirror, 0-challan dispatch, loop close | placement/specs/Multi-origin/

## STEP 06 — LO-FI WIREFRAMES

The lo-fi phase was where the add-node interaction earned its shape, and it took six attempts to get there. I wireframed each candidate pattern and walked it against two test cases: "AM adds the third origin to a live round-trip" and "AM edits a single-origin trip he's edited a hundred times before." Five patterns failed one or both — the full autopsy is in the Decision Spotlights, because the rejections carry more design reasoning than the winner.

The surviving structure: three stacked sections with accent-colored headers and matching dots, one shared add-node row above them (dropdown + three role buttons with dots that echo the section accents, so the button-to-section mapping is visible without reading), and section-scoped drag handles. The RTO section carries an inline info affordance on its button ("Add as RTO ⓘ") because the subset rule is the one constraint an AM can't infer from layout alone.

For the single-origin mode, the wireframe discipline was subtraction: the layout had to diff against the current production screen at near-zero. Source Node stays in Trip Overview at the top; the destination list keeps its existing form; RTO renders as a single auto-mirrored read-only row with no controls. I also iterated the first-view experience through five FTUX mockup versions (v1–v5 in the prototype's mockup folder) to settle how a multi-origin trip introduces its three-section anatomy to an AM seeing it for the first time — the answer was structural clarity over coachmarks: if the sections need a tour, the sections are wrong.

Every screen carried its state set: default, empty section, validation error, locked (RFQ auto-trip), and the loop-close confirmation — 59+ screen states across the module by the end.

> STAT: add-node patterns wireframed | 6 (5 rejected, 1 shipped)
> STAT: FTUX iterations | 5 mockup versions
> IMG: Lo-fi progression — rejected chip-bank and ghost-row sketches beside the shipped three-button row | placement/prototype/.ftux-mockups/

## STEP 07 — PROTOTYPE

The canonical deliverable is a single-file, framework-free HTML prototype (`trip-edit-multi-origin.html`) implementing both render modes end-to-end, driven by real trip data shape — the mode branches on `trip.source_nodes.length`, exactly as production would. Building it as one file with two modes, rather than two prototypes, was itself an argument: it proved to engineering that the 94% and the 6% can share one screen, one codebase, and one data contract, with the mode read once at load and immutable for the trip's lifetime.

The prototype demonstrates the full interaction set: the 2-click node add with all three role buttons always enabled; validate-on-click with specific inline errors including the RTO-subset rule; RTO auto-mirroring on source add/remove with manual RTO removal; section-scoped drag-to-reorder that physically refuses cross-section drags; the amber RTO section appearing only when route type is ROUND_TRIP; and the single-origin mode rendering the legacy-shaped layout with the auto-mirrored read-only RTO row. A second prototype covers the route-sequence builder in isolation.

Prototyping surfaced decisions no static mock would have forced. Always-enabled buttons only work if error messages are specific — a generic "invalid action" would recreate the confusion that smart-disable causes; writing the actual error strings was design work. The mirror rule needed visible feedback (the RTO row appears the instant a source is added) or AMs wouldn't trust it. And clicking through the live-trip scenario is what killed auto-commit-on-select for good: watching a dropdown selection instantly mutate an in-transit trip made the missing confirmation gate viscerally obvious.

Figma remains the visual source of truth; the prototype's three accent colors are placeholders pending design-system token confirmation.

> STAT: render modes in one file | 2, branched on source_nodes.length, read once at load
> STAT: screen states covered | 59+
> IMG: Prototype — multi-origin mode with three sections and add-node row | placement/prototype/trip-edit-multi-origin.html

## STEP 08 — BUSINESS ASPECTS

The business case rests on data integrity, not screen aesthetics. Trip records feed billing, transporter payouts, vehicle utilization reporting, and network planning. When 6% of trips carry fabricated challans or amputated histories, every one of those consumers computes on corrupted input — and because multi-origin concentrates on national lanes (~20% of them), the corruption lands disproportionately on the highest-freight routes. Legitimizing the 0-challan dispatch as an audited action converts an invisible falsification into a visible, queryable event: finance can now distinguish "vehicle dispatched empty from hub B" from "hub B never happened."

The efficiency case: trip creation cut from minutes to seconds, with source data accuracy moved above 95%{*}. At hundreds of trips per AM per week, seconds-per-trip is the unit that compounds — which is why the design's central trade-off was scoped the way it was. I spent complexity on the 6% and defended the 94% absolutely: the two-render-mode decision means the majority flow carries zero new cost, so the module's aggregate time-per-trip improves even before the multi-origin gains are counted.

The trade-offs I accepted: the contract snapshot as a hard bound means an AM cannot handle a truly ad-hoc node mid-trip through this screen — that stays an exception process, by design, because an unbounded node picker would reopen the door to improvised data. Disabling auto-closure for multi-origin trades a small amount of ops-tech manual effort (explicit loop close with a confirmation modal) against the cost of prematurely closed trips corrupting completion data — the same class of corruption this project exists to end. Constraints that prevent bad data are the product here.

> STAT: efficiency | trip creation from minutes to seconds; accuracy >95%{*}
> STAT: lane exposure | ~20% of national lanes affected

## DECISION SPOTLIGHTS

### Spotlight 1 — Five rejected add-node patterns (the centerpiece)

The add-node interaction is one dropdown and three buttons. Getting to that took rejecting five patterns, each of which looked reasonable on a whiteboard and failed a specific test. I keep this table because the rejections define the design more precisely than the solution does.

**Decision:** Node Code dropdown + three always-enabled role buttons (Add as Source · Add as Destination · Add as RTO ⓘ), validate on click with specific inline errors. 2 clicks per add.

**What I rejected, and why each failed:**

| Rejected pattern | How it would work | Why it failed |
|---|---|---|
| **Chip-bank** ("Available from contract" chips) | Render every snapshot node as a clickable chip; tap to add | 1-click — the cheapest option on paper — but it exposes contract internals before the AM knows what's already in the trip. He'd face a wall of node chips with no trip context, and the pattern doesn't exist anywhere in the create flow, so it would be a one-screen dialect. Cheapest click, most expensive comprehension. |
| **Ghost row per section** | Each section ends in an empty placeholder row; click it, pick a node, confirm | 3 clicks per add. On a route with four origins and three destinations, the AM pays a 50% click tax over the shipped pattern on every single node — a per-node cost the power-user persona feels hundreds of times a week. |
| **Smart enable/disable on role buttons** | Disable whichever role buttons are invalid for the selected node | Creates "why can't I click this?" confusion — a disabled button communicates that an action is impossible but not why, and the why (RTO must be a subset of Source) is exactly what the AM needs to learn. Always-enabled + validate-on-click surfaces the rule as a teachable inline error at the moment of intent. |
| **Order-based role inference** (first node added = source, rest = destinations) | Skip role selection entirely; infer role from add order | Breaks in edit mode, where nodes already exist and "first" is meaningless — and it structurally blocks adding a second source, which is the entire multi-origin use case. A pattern that cannot express the problem it was built for. |
| **Auto-commit on dropdown selection** | Selecting a node in the dropdown immediately adds it | Zero-confirmation mutation of a live operational trip. A misclick in the dropdown changes a route a vehicle is currently driving, with no gate between intent and commit. Watching this in the prototype against the live-trip scenario is what killed it — the speed it saves is not worth the class of error it creates. |

The pattern in the failures: three died on comprehension (chip-bank, smart-disable, order-inference), one on throughput (ghost row), one on safety (auto-commit). The shipped design is the only candidate that passed all three axes at once.

### Spotlight 2 — Two render modes, read once at page load

**Decision:** One screen, two layouts, branched on `trip.source_nodes.length` at page load; the mode is immutable for that trip. Single-origin renders near-identical to the current production screen.

**What I rejected:** A single unified layout where every trip shows the three-section structure, and a live-switching variant where the layout upgrades if a second source is added mid-session.

**Why:** The unified layout taxes the 94% — every single-origin AM would parse three sections to use one, violating the project's founding constraint. Live-switching means the screen can restructure itself under the user's hands mid-edit, which is disorienting on any screen and dangerous on a live trip. Reading the mode once makes the layout a stable fact of the trip, not a reactive state — and since source count is fixed by the contract snapshot anyway, mutability would model a transition that cannot legitimately occur.

### Spotlight 3 — Contract snapshot as the hard bound

**Decision:** The AM can add only nodes present in the immutable contract snapshot captured at trip creation, and no node changes role post-creation. Cross-section drag is physically impossible.

**What I rejected:** A free node picker over the full node master, with role reassignment allowed during edit.

**Why:** An unbounded picker recreates the original disease in a new body — improvised trip data that diverges from the contracted route, exactly what the fake challans were. The snapshot collapses validation from "is this arbitrary graph legal?" to "is this node in a known set?", makes every trip auditable against its contract, and keeps genuine ad-hoc changes in the exception process where they carry review. The constraint is the feature.

### Spotlight 4 — RTO auto-mirrors Source

**Decision:** Adding a node to Source auto-adds it to RTO; removing auto-removes. The AM's only manual RTO action is removal — excluding an origin from return freight.

**What I rejected:** Fully manual RTO management, where the AM builds the RTO list node by node.

**Why:** RTO must be a subset of Source (FR-T04), and the overwhelmingly common case is "return freight goes back to every origin." Manual management makes the AM re-enter data the system already knows and opens a validation failure mode (RTO node not in Source) that the mirror makes unrepresentable in the common path. Automation handles the default; the human handles the one real decision. The prototype renders the mirror instantly on source-add so the rule is visible, not just documented.

### Spotlight 5 — Auto-closure disabled for multi-origin; 0-challan dispatch legitimized

**Decision:** Auto-close on RTO arrival stays enabled for regional linehaul and carting but is disabled for NLH multi-origin — closure requires an explicit loop-close action with a confirmation modal listing any open origins. Separately, dispatching with zero freight becomes a first-class audited action.

**What I rejected:** Keeping the existing auto-close rule uniform across trip types, and treating zero-freight dispatch as an edge case to discourage rather than support.

**Why:** In multi-origin, forward and return node orders can differ — the first RTO arrival does not mean the trip is done, so uniform auto-close would prematurely close trips and corrupt completion data, trading one corruption for another. And the fake 0-bag challan existed because "this hub has no freight today" is a real operational state the tool refused to express; refusing to support it wouldn't eliminate it, it would just keep it fraudulent. The fix for fabricated data is not stricter walls — it is a legitimate, logged path for every state that actually occurs on the ground.

## REFLECTION

The uncomfortable truth of this project is that the most important design work was rejection, and rejection is slow. I built or wireframed six add-node patterns to ship one, and for a stretch that felt like churn — the ghost row and the chip-bank were each "done" at some point before a test case killed them. What I'd defend now, and would do faster next time, is naming the evaluation axes up front: comprehension, throughput, and live-trip safety. Once those three were explicit, each rejection took an hour instead of a day, because a pattern only had to fail one axis to die. I also carry some honest uncertainty forward: the design assumes the contract snapshot stores source and destination roles separately, and that assumption was still awaiting engineering confirmation when the prototype shipped for review — if it's wrong, the role-button validation needs a different data source, and I should have forced that conversation before building rather than after. The thing I'm most confident in is the founding constraint. "The 94% pay nothing" sounded like a limitation and behaved like a compass: nearly every rejected pattern died against it, and the two-render-mode architecture — the decision I'd defend hardest — exists only because that constraint made a unified layout unshippable.

## GAPS

- **Timeline** — meta says "TBC"; need actual project dates (KRD receipt → prototype → review).
- **Outcome validation** — the trip-creation-speed and accuracy figures are targets from the map; confirm whether post-launch numbers exist and whether the feature shipped to production.
- **Manager/stakeholder feedback** — SESSION-NOTES shows the review message drafted but no captured feedback; any reviewer quotes or resulting changes would strengthen Steps 07–08.
- **Usability testing** — no UT sessions are recorded for this module; confirm whether any AM walkthroughs happened and with how many participants.
- **59+ screen states** — figure taken from the brief; confirm the exact count and what it comprises (module-wide vs. multi-origin only).
- **Accent-color tokens** — indigo/teal/amber are placeholders pending design-system token confirmation; update Step 07 once locked.
- **Open eng questions** — snapshot role storage and single-origin Source-field editability were unresolved; confirm outcomes so the Reflection stays accurate.
- **Imagery** — all IMG suggestions point at spec/prototype folders; Pranita to select public-safe crops (no internal node codes, vendor names, or Figma keys visible).
