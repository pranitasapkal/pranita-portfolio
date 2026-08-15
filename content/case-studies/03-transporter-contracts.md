---
slug: transporter-contract-management
code: TCM-04
title: Transporter Contract Management
oneLiner: Everything that makes an ops power-tool good actively fails a user who reads slowly and trusts the screen literally — so the work was subtraction, with discipline.
meta: { role: "Product Designer — sole designer, end to end", team: "Valmo Transportation (Meesho) — with PM and engineering counterparts", timeline: "TBC", platform: "Desktop web panel (transporter-facing)" }
---

## TLDR

- problem: Transporters handling 15–70 contracts a month — low-literacy, Hindi-first, trusting the screen literally — had no self-serve way to accept, reject, track, or dispute contracts without calling support.
- outcomes: [
  "Cut the interface down to 4 lifecycle tabs, 1 primary CTA per row, and a 34-row state matrix that proves every combination renders correctly",
  "Judge-mode self-review scored my own screens 2.8/5 and catalogued 27 issues — 7 of them ship-blockers I caught before engineering did",
  "3 ADRs lock 13+ structural decisions and a 6-term status vocabulary; validated with a moderated Hindi usability test across 6–8 literacy-mixed transporters"
]
- summary: I designed the vendor-facing contract console for Valmo transporters by systematically removing the patterns ops tools are usually praised for — dense filters, hover-hidden actions, clever conditional layouts. What shipped instead is a panel of named views, deadline-based urgency, and one action per row, hardened by a 27-issue self-audit and a moderated usability test in Hindi.

## STEP 01 — PROBLEM UNDERSTANDING

Valmo — Meesho's transportation arm — issues route contracts to independent Indian transporters. A transporter receives 15–70 contracts per month, mostly in one monthly batch, each with a response deadline, a rate, a vehicle spec, and real money attached. Before this panel, the contract lifecycle lived in phone calls and PDFs: transporters found out about new contracts from a Valmo point of contact, disagreed by calling someone, and had no single place to see what was running, what was ending, or why something disappeared.

The obvious answer was an ops-style contract dashboard. That answer was wrong, and understanding why became the core of the project. This user is not an ops analyst. He runs a small fleet from a mid-range laptop, reads slowly, comprehends critical decisions in Hindi first, and trusts the screen literally — if a chip says "Disputes (0)" he reads it as a fact about his business, not as an empty filter state. Every convention that makes an internal power-tool efficient — stacked filter dropdowns, actions revealed on hover, tabs whose columns reshuffle per filter, status conveyed by color dots — either confuses him or, worse, teaches him the panel lies.

So the design problem was not "build a contract table." It was: take a domain with a genuinely complex lifecycle — Pending → Upcoming → Active → Closed, disputes, terminations with a 3-day trip buffer, performance flags, SLA reminders — and present it so that a slow, literal reader can act on it correctly, alone, on the first monthly batch day. The whole project is subtraction: from a full ops-tool vocabulary down to what survives contact with this persona.

> STAT: contract volume | 15–70 contracts/month, mostly one monthly batch
> STAT: lifecycle states to represent | 4 tabs × 34 distinct row states
> IMG: L1 panel with the four lifecycle tabs | contract-management/figma-sot/final-transporter-panel-v1

## STEP 02 — OBJECTIVE

The objective had two halves — one for the transporter, one for the business — and one measurable bar for each.

For the transporter: complete the four core jobs — accept a contract, reject one, find what needs action today, and check whether an active contract is in trouble — without calling support and without a walkthrough. The proxy metrics I designed against: land on the actionable subset by default (the Urgent chip auto-selects when its count is above zero), never strand the user in an empty filtered view (an "All" fallback chip is always visible on every tab), and keep every row to exactly one primary CTA so the correct next action is never a choice among equals.

For the business: protect SLA compliance on pending contracts (a delayed accept is a breach risk — hence deadline-based urgency at ≤48 hours), and reduce avoidable rejections by showing economic consequences before the reject action commits (the reject-warning pattern, Spotlight 4).

I also set an explicit quality bar for myself rather than for the user: before handoff, the screen set had to survive a judge-mode review against the locked spec, WCAG 2.1 AA, and the persona — scored, catalogued, and written into an ADR. It scored 2.8/5 on the first pass, which is exactly what that gate was for: 27 issues, including 7 ship-blockers, caught by me instead of by engineering or by a transporter in the field.

> STAT: urgency threshold | deadline ≤ 48 hours = urgent
> STAT: self-review gate | 2.8/5, 27 issues, 7 ship-blockers

## STEP 03 — USER PERSONA

The user is an Indian transporter — a delivery partner or small logistics operator running one to a handful of vehicles for Valmo. He works from a mid-range laptop, not a phone; this is a desktop panel, which surprised people who assume "low-literacy" means "mobile." His literacy is low, his comprehension of anything consequential is Hindi-first, and his mental model of the domain is three questions: which contracts do I need to act on right now, which are running, which are over.

Four traits drove every decision in this project:

- **He reads the screen literally.** A count that disagrees with another count on the same screen is not a rendering bug to him — it is evidence the system is untrustworthy. This is why "reconcile all counts to one source" was P0 issue #1 in my self-review (I found `Pending (22)` on a card next to `Pending (10)` on a tab).
- **He has no tolerance for hidden navigation.** Hover-only tooltips, actions behind kebab menus, and filter states with no visible label all fail him. Everything is a named, labelled, counted view.
- **He fears making mistakes.** The usability-test debrief asked directly: "Did you feel safe doing actions here, or were you scared of making mistakes?" That fear shaped the reject warning, the typed-confirmation terminate flow, and the removal of celebratory treatment from the dispute-success modal — a grievance is not a confetti moment.
- **He shares his device.** Staff and points-of-contact use the same logged-in laptop, which is why the contract area got its own session passcode gate (STEP 05).

The moderated usability test (6–8 transporters, literacy-mixed, conducted in Hindi) pressure-tested exactly these traits. [UT-FINDINGS: pending from Pranita]

> STAT: UT sample | 6–8 transporters, new joiners + >1yr experienced, low-literacy + literate mix
> IMG: persona context — transporter at laptop, one-page persona card | to be produced from UT session notes

## STEP 04 — INFORMATION ARCHITECTURE

The IA is the contract lifecycle, stated plainly: four tabs — Pending, Upcoming, Active, Closed — in the order a contract actually moves. No dashboard-first landing, no separate "action center." The tab names are the mental model.

Within each tab, the structure follows three locked rules, each written into an ADR because each was violated in an earlier iteration:

**Chips are named views, not filter toggles (ADR-001).** Pending has `Urgent (X)` and `All Pending (X)`. Active has up to four: `Below Target`, `Disputes`, `Ending Soon`, `All Active`. Action chips hide entirely when their count is zero — a "Disputes (0)" chip is noise that invites a dead-end click — but the "All" fallback is always visible, so the user can never be stranded in a filtered view he doesn't understand. Closed has no chips at all: it is a flat, read-only archive.

**Columns are invariant per tab (ADR-001 §7).** No chip ever restructures the table. All contextual variation is carried by row-level tags, which live in exactly two places: performance tags in the Performance column, co-located with the TAT% and on-time-placement numbers they annotate; lifecycle and dispute tags under the Contract ID. ADR-001 originally put all tags under the Contract ID; ADR-002 corrected it after I found worst-case Active rows stacking 3+ tags in one cell.

**Sub-metrics on overview cards exist only if they map to a real chip (ADR-002).** That rule killed the Estimated Earnings card (not actionable), the "All: X" sub-metric (duplicates the header count), and "Starting Soon" (maps to no view). Four cards became three.

A locked 6-term closure vocabulary — Rejected, Terminated by You, Terminated by Valmo, Cancelled by Valmo, Completed, No Response — replaced ambiguous words like "Auto rejected" and actor-less "Cancelled," because a literal reader needs to know *who* did the thing.

> STAT: status vocabulary | 6 locked terms, 3 retired
> STAT: overview cards | 4 → 3 after the chip-backed sub-metric rule
> IMG: tab + chip structure diagram | contract-management/deck/Contract-Management-Deck.html

## STEP 05 — USER FLOW

The flows follow one principle: destructive or consequential actions get friction; everything else gets none.

**Accept** — the highest-frequency action — is one click from the default landing state on batch day: the Urgent chip auto-selects when non-empty, an SLA banner explains why "Reminder from Valmo" rows come first, and each row carries a filled `Accept` button. The accept modal splits into three steps (Review → Assign vehicle/driver, optional → Confirm) so the assignment decision doesn't block acceptance — assignment can also happen later from the detail view, never from the list row.

**Reject** is a text link, deliberately weaker than Accept, and it interrupts: before confirming, the flow shows the economic consequence — the total earning the transporter is walking away from, a lakh-plus figure on a typical contract{*} — plus the performance-rating impact, then asks for a reason from an acceptance-time list (rate, vehicle size, period). Terminate, a different act with different reasons (driver exit, breakdown, route closed), gets a harder gate: a typed-confirmation second step, because it is irreversible and trips must still run for a 3-day buffer afterwards — a countdown the row surfaces as "X days to complete remaining trips."

**Dispute** is reachable only from Active rows without an open dispute; with one open, the CTA disables with a plain-language tooltip. The success state is a neutral document icon and "We've received your dispute. Expect an update within 24 hours" — I removed the confetti treatment from an earlier screen because a grievance acknowledged is not a celebration.

**Session entry** passes through a passcode gate on the contract area only: transporters share their logged-in laptop with staff, and contract rates are confidential. First-time flow is OTP-to-registered-mobile → create password, fronted by an intro screen in three 2–4-word bullets ("Private page / Your contracts and money / Only you can open it") and an amber callout: "Do not tell anyone — not even your staff." Re-lock on every session; sidebar stays usable so the gate never reads as a broken page.

> STAT: terminate buffer | 3 days of trips after termination
> IMG: accept → assign → confirm 3-step modal | contract-management/figma-sot/final-cm-transporter
> IMG: passcode gate intro + OTP + set-password screens | contract-management/new-iteration/transporter-prototype.html

## STEP 06 — LO-FI WIREFRAMES

The lo-fi stage was where most of the subtraction happened, and I kept a written record of what was cut — five rejected patterns, each of which would pass review in a normal ops tool:

1. **An "Assign Pending" chip on Upcoming**, with per-row "Assign Now" buttons. Rejected because it created two primary actions per row and referenced a flow that didn't exist yet from that surface. Upcoming became view-only at list level; assignment lives at acceptance and in the detail view (ADR-001 §4).
2. **A "New Contracts" chip on Pending.** Rejected because contracts arrive in one monthly batch — "new vs. existing" is not a distinction this user acts on. Only "respond now vs. later" matters, so urgency became deadline-based (≤48h), not arrival-based.
3. **All contextual banners shown simultaneously** on the Active tab. Rejected for stacking; one banner per active chip instead.
4. **Tags distributed across columns by topic.** Rejected in ADR-001, partially reinstated in ADR-002 with a stricter rule — performance tags belong with the performance numbers; everything else stays under Contract ID.
5. **A Performance filter dropdown on Active** duplicating the Below Target chip — two controls doing one job. Removed from Active, kept only on Closed where no chip exists.

The wireframes were validated against a 34-row state matrix (7 Pending × urgency/reminder combinations, 8 Upcoming × start-date/dispute, 14 Active × performance/dispute/termination, 5 Closed × closure reason) — every tag, chip, and banner rule had to render correctly against every row before hi-fi started. The matrix is also the prototype's test data, so the spec and the demo can't drift.

> STAT: rejected patterns | 5, each documented with the reason
> STAT: state matrix | 34 rows across 4 tabs
> IMG: row-state matrix table | contract-management/CLAUDE.md §Row State Matrix

## STEP 07 — PROTOTYPE

Two artifacts carried the interaction design: hi-fi screens in Figma (the visual source of truth — 130+ screens across the two export sets) and a single-file HTML prototype, ~1,450 lines of vanilla JS with no framework and no build step, driven entirely by the 34-row state matrix. The prototype exists because tag-visibility rules, chip auto-hide logic, and banner conditions are behavioral claims — a static mock can't prove that switching to the Below Target chip hides the now-redundant performance tags, or that the Disputes chip disappears when its last dispute resolves.

Before handoff I ran the screen set through a judge-mode review against the locked spec, WCAG 2.1 AA, and the persona — scoring my own work as a hostile reviewer would. It scored **2.8/5**: strong skeleton, not ship-ready. The review catalogued **27 issues** across P0/P1/P2, written into ADR-003 so none could be quietly forgotten. The seven P0 ship-blockers included counts that disagreed across cards, tabs, and chips on the same screen; a duplicated sub-metric where Disputes should have been; Reject and Raise Dispute buttons leaking onto the view-only Upcoming detail; the confetti dispute-success modal; and Closed detail views that showed a bare contract card with no closure reason, timestamp, or next step. ADR-003 also mandated full state coverage: empty, loading, error, and no-results for every list; submitting, error, and success for every modal.

The prototype then went in front of transporters: a moderated, think-aloud usability test in Hindi — 6–8 participants, literacy-mixed, 45–60 minutes each, 8 task scenarios from "find and accept a new contract" to "this contract was terminated — can you still run trips?", with per-task timing, unaided-success scoring, and verbatim confusion quotes. [UT-FINDINGS: pending from Pranita]

> STAT: judge-mode review | 2.8/5 · 27 issues · 7 P0
> STAT: prototype | ~1,450 lines, single file, no framework
> STAT: UT protocol | 8 tasks · 6–8 participants · Hindi, moderated think-aloud
> IMG: judge-mode issue list excerpt | contract-management/tasks/decisions/ADR-003-new-screens-design-review.md
> IMG: prototype Active tab with chip-driven tag hiding | contract-management/prototype/contract-management-prototype.html

## STEP 08 — BUSINESS ASPECTS

The panel's business case rests on three levers.

**SLA protection.** A pending contract that expires unanswered is a route Valmo has to re-source. The deadline-based urgency model (≤48h), the auto-selected Urgent chip, and the "Reminder from Valmo" banner exist to compress response time on exactly the contracts where a delayed accept becomes an SLA breach. Contracts that still expire unanswered get an honest closure label — "No Response," not "Auto rejected" — because mislabelling the system's action as the user's erodes the trust the whole panel depends on.

**Avoidable-rejection reduction.** A rejection costs Valmo a re-sourcing cycle and costs the transporter a contract-length earning stream. The reject warning surfaces both — the full earning loss (a lakh-plus figure on a typical contract{*}) and the performance-rating consequence — before the decision commits. The usability test probed this directly: "What does the earning-loss figure mean to you — would you still reject?" The point is not to block rejection; it is to make sure no transporter rejects a contract without understanding its price. [UT-FINDINGS: pending from Pranita]

**Support-call deflection.** Every flow that previously required a phone call — what's new, why was this closed, raising a rate dispute, when a terminated contract actually stops — has a self-serve path with reason, timestamp, and next action attached. The trade-offs were accepted knowingly: three ADRs' worth of locked constraints slow future feature bolt-ons (any new action must fit "one primary CTA per row"), the passcode gate adds a session-entry step to protect confidential rates on shared devices, and full state coverage (empty/loading/error on every surface) is real engineering cost paid up front to keep the screen from ever contradicting itself in front of a literal reader.

> STAT: decision record | 3 ADRs, 20-gap audit, locked 6-term vocabulary

## DECISION SPOTLIGHTS

**Decision: Chips as named views with an always-visible "All" fallback.**
What I rejected: conventional filter toggles — including zero-count chips and filter states with no labelled escape.
Why: a literal reader treats "Disputes (0)" as a fact and an empty filtered table as a broken page. Every chip is a named view with a count; action chips vanish at zero; the "All" chip never does. The user can always answer "show me everything" without understanding the filter model. (ADR-001 §1–2.)

**Decision: Hide the tag that matches the active chip.**
What I rejected: showing every row's full tag set in every view, the standard "more information is safer" table pattern.
Why: inside the Below Target view, a "Below Target" tag on every row is pure redundancy — and for a slow reader, redundancy is cost, not reassurance. Hiding the implied tag leaves only the tags that add information (a dispute, an expiry) and cut worst-case tag stacks from 3+ to 2. The rule is mechanical enough to verify against all 34 matrix rows. (ADR-001 §6, extended to Upcoming in ADR-003.)

**Decision: Deadline-based urgency (≤48h), not arrival-based.**
What I rejected: a "New Contracts" chip — the default recency model in every inbox-shaped tool.
Why: contracts arrive in one monthly batch, so on batch day everything is "new" and the distinction carries zero signal. The only question the transporter acts on is "respond now or later," which is a property of the deadline, not the arrival. Urgent = deadline within 48 hours, colour-graded red/amber/grey by proximity. (ADR-001 §2.)

**Decision: Exactly one primary CTA per row.**
What I rejected: per-row action clusters — Assign Now on Upcoming, Raise Dispute buttons alongside View, the standard ops-tool action column.
Why: two buttons of equal weight is a decision the persona shouldn't have to make on every row. Pending gets Accept (filled) with Reject demoted to a text link; Upcoming and Closed get View only; Active gets View plus one conditional dispute link. My judge-mode review caught this rule being violated on the Upcoming detail screen — Reject and Raise Dispute had crept back in — and removing them was P0 #3. (ADR-001 §5, ADR-003 P0.)

**Decision: Show the economics before allowing rejection.**
What I rejected: a bare confirm dialog ("Are you sure?") — and, at the other extreme, a dark-pattern guilt screen.
Why: rejecting a contract forfeits a contract-length earning stream — a lakh-plus figure on a typical contract{*} — and affects the transporter's performance rating. A user who fears the screen will click through a vague confirm; a user shown the actual number makes an informed call. The reason list is acceptance-time-specific (rate, vehicle size, period) so the data Valmo gets back is usable for re-sourcing. (ADR-003 P1 #13; UT Task 3.)

## REFLECTION

The 2.8/5 I gave my own screens is the most useful number in this case study, and the least comfortable one. The structural thinking was done — three ADRs, a locked vocabulary, a 34-row matrix — and the screens still shipped to review with counts that contradicted each other on a single viewport and a confetti animation on a grievance flow. The lesson I took is that for this persona, spec discipline and screen discipline are different skills: rules I had written myself were violated in my own Figma files within a day, which is why the judge-mode pass is now a standing gate in my process rather than a one-off. I also carry forward a genuine open question ADR-003 raised but deferred: four lifecycle tabs may be one too many for this user, and the honest answer waits on the usability-test evidence rather than on my preference. The discipline this project taught me was not subtraction itself — cutting features is easy — but writing down why each thing was cut, so the next iteration can't quietly add it back.

## GAPS

- **[UT-FINDINGS: pending from Pranita]** — the moderated Hindi usability test was conducted; findings, per-task success rates, and verbatim quotes need to be inserted in STEP 03 (persona validation), STEP 07 (test outcomes), and STEP 08 (reject-warning comprehension probe). Placeholders are marked in-text.
- **Timeline** — meta.timeline is "TBC"; need actual project start/end months.
- **Adoption/outcome metrics** — no post-launch numbers in source files (support-call deflection, SLA response time, rejection rate before/after). Confirm whether any exist and are publishable.
- **Team credits** — PM/engineering counterpart roles described generically per NDA rules; confirm the phrasing Pranita wants for the meta.team line.
- **Reject-warning figure** — fuzzed to "a lakh-plus figure on a typical contract{*}" per NDA map; confirm this level of specificity is acceptable.
- **Image assets** — IMG lines reference source files (Figma exports, prototype, deck); actual cropped/annotated images need to be selected and produced by Pranita.
- **Four-tab vs three-tab question** — the Reflection references the deferred restructure; if the UT findings resolved it, update the Reflection accordingly.
