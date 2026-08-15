# CLH Case Study — full script v3 (for review before build)

**Read this as the finished page.** Headings are plain, not clever. `[SCREEN: filename]` = an exact frame from
`clh-rfq-panel/New SOT CLH panel /`. `[DIAGRAM: …]` = something I need to draw (Excalidraw-style, like the reference).
`[VERIFY]` = a fact I inferred and need you to confirm or correct.

**The spine, in one line:** *Every month, 2,400 truck routes have to go from a planner's spreadsheet to a signed,
running contract before the 1st. This is the system that does it — and what I had to decide to make it hold.*

Target length ~2,000–2,400 words (Mehak Samaiya's Juspay case runs ~2,300 and is the strongest B2B example we found).
That is a real case study, not a portfolio teaser.

---

## 1. What this is

> **Meesho is one of India's largest e-commerce marketplaces. Valmo is the logistics network it built to move its own
> parcels.** Before a parcel reaches a doorstep it travels between warehouses on hired trucks — that leg is called
> linehaul, and Valmo doesn't own those trucks. It rents them, route by route, from trucking companies, on contracts
> that have to be negotiated and signed every single month.
>
> A route contract is one agreement: this vendor, this route, this size of truck, this rate, for this month.
> Valmo needs about **2,400 of them, every month, live before the 1st**.
>
> I was the only designer on the system that does this — from the object model through to a 130-screen handoff.

`ROLE` Sole designer · `TEAM` 1 PM, 1 EM, central ops · `TIMELINE` Mar–Jun 2026 · `SCALE` ~2,400 contracts/month

[DIAGRAM: **The month.** A horizontal timeline — 21st: planners publish next month's routes → ~10 days for the
contracting team to find vendors and get signatures → 1st: every route must be live. Annotate the squeeze.]

---

## 2. The problem

> The planning half was already software. Planners produced the month's routes in a system.
>
> The contracting half was not. One central team took those 2,400 routes and worked them by hand: assignments went out
> as bulk Excel files, vendor follow-ups happened on phone calls, disputes lived in WhatsApp threads. Nothing joined
> the two halves together.
>
> Four things went wrong because of that, and they are the four things the design has to fix:
>
> 1. **Nobody could see what was pending.** With 2,400 routes in flight and no shared view, "what still needs a vendor
>    this week?" was answered by opening a spreadsheet and counting.
> 2. **Contracts went live with the wrong terms.** A rate typed into a sheet is not a rate anyone agreed to. The error
>    surfaced after trips had run, as a dispute over money already spent.
> 3. **Routes went live with no vendor at all.** Nothing stopped a route reaching its start date uncovered.
> 4. **Changes were invisible.** When planners revised the month mid-cycle — a route dropped, a truck removed — the
>    contracting team found out by being told.

[SCREEN: I do not have a "before" artifact. Options: (a) skip the visual here, (b) I draw a simple diagram of the old
flow — Excel → call → WhatsApp → signed PDF. **Recommend (b).**]

---

## 3. What I inherited

> The project was not starting from zero, which turned out to be the problem. There were already **136 Figma screens**,
> drawn against a specification that had since moved, plus a 21-page product requirements doc and several HTML
> prototype iterations.
>
> Treating those screens as an approved baseline would have shipped their structure into engineering. So the first
> thing I produced was not a screen. It was an audit.
>
> I reviewed 50+ of the inherited screens against the current specification and graded every gap:

| Severity | Count | What it was |
|---|---|---|
| P0 | 3 | Navigation-breaking — queue names that no longer matched the spec engineering would build from |
| P1 | 7 | The same idea rendered differently on adjacent screens |
| P2 | 11 | Copy and visual inconsistency |
| P3 | 8 | Missing states — empty, loading, error, no-results |

> Two of the three P0s were **different naming schemes on adjacent screens of the same tab**. Built as-is, engineering
> would have implemented two contradictory navigations.
>
> That audit bought me the argument for doing structure first: diagram, then a written decision record, then Figma.
> Caught in a diagram, a structural mistake costs a redraw. Caught in 130 screens, it costs weeks.

---

## 4. The one thing you have to understand: a route is not a contract

> This is the model everything else follows from.
>
> Planners publish a **design** — one month's batch of routes. Each route in it becomes a **requirement**: this lane,
> this truck size, this many trucks, starting this date. And each *truck* on that route becomes its **own contract**
> with its own vendor and its own rate.
>
> - A **regional** route needs one truck. One requirement, one contract. Simple.
> - A **national** route runs long-distance and needs several trucks. One requirement, four contracts — and each of
>   those four can be at a completely different stage at the same time.
>
> So one route can simultaneously be: one truck's paperwork rejected on upload, one truck with no vendor, one truck
> the vendor turned down, and one truck already out for signature.

[DIAGRAM: **Design → Requirement → Contract**, showing the 1:1 regional case beside the 1:N national case.]

[SCREEN: `How it will look with all possible cases.png` — one route's detail page with exactly that: 1 Upload Error,
1 Unassigned, 1 Rejected, 1 Sent for Approval. Caption: *One route. Four trucks. Four different states at once.*]

---

## 5. Information architecture

> Three levels, and the reason for each:
>
> **Level 1 — Overview.** Opens on what needs attention across everything, grouped by what you'd actually do about it:
> assign a vendor, chase a vendor, or fix a live contract. Not a dashboard of charts — a list of work.
>
> **Level 2 — Queues.** Five stages a contract moves through, each with named sub-queues carrying live counts.
>
> **Level 3 — The route.** Everything about one route: its trucks, each contract's state, and full history.

[DIAGRAM: **The IA.** L1 → L2 (5 stages, their sub-queues) → L3. I'll rebuild this Excalidraw-style rather than reusing
the raw `ia-diagram.png`, which is too dense to read on a case-study page.]

[SCREEN: `Overview.png` — caption: *The day opens as three questions: what needs a vendor, who hasn't replied, what's
broken on a live contract.*]

> The five stages: **Action Required → Sent for Approval → Upcoming → Active → Closed.**
>
> And the rule that governs them: **a route sits at the stage of its least-finished truck.** Three trucks approved and
> one unassigned means the whole route stays in Action Required. That makes every later stage a promise — if a route
> has reached Upcoming, every truck on it is genuinely ready. It also means regional and national routes need no
> separate handling: a regional route is just the one-truck case of the same rule.

---

## 6. The flows

*This is the section that was missing entirely. Each flow = a short paragraph + the real screen sequence.*

### 6.1 Planning a month
> Planners upload the coming month's routes as a file. It is deliberately all-or-nothing: one bad row rejects the whole
> batch, and the system returns an error file naming which rows failed and why. A partially-accepted batch would mean
> a month that is quietly incomplete.
>
> The upload rules live on the page itself, not in a manual — what each column means, why the start date must be at
> least 10 days out (the contracting team needs that long to find vendors), what happens when you edit a design that
> is already live.

[SCREENS: `Network design 1` (the page + rules) → `Network design 3/4` (create design) → `Network design 5` (upload)
→ `Network design 15` (created successfully) → `Network design 16` (creation failed + error file)]

### 6.2 Assigning a vendor — one route at a time
> The queue is sorted most-urgent-first. Assigning happens in the row: the form opens under the route so the
> destination, truck size and deadline stay on screen while you pick a vendor and set a rate. A recommended rate is
> shown beside the field.

[SCREENS: `Action Required _ Unassigned` → `Action Req_ Unassigned _ inline` → `Action Req_ Unassigned _assign`
→ `Action Req_ Unassigned _send success`]

### 6.3 Assigning in bulk
> At 2,400 routes a month, one-at-a-time is not the main path. Download the queue as a file, fill vendor and rate in
> the sheet the team already lives in, upload it back.

[SCREENS: `Action Required _ Unassigned-3` (bulk modal, step 1 download / step 2 upload) → `Unassigned-6`
(contracts uploaded successfully)]

### 6.4 Chasing a vendor who hasn't replied
> Once sent, a contract waits on the vendor. After seven days with no response it moves into its own queue, and
> reminders can be sent across a selection at once.

[SCREENS: `Sent for approval` → `Sent for approval _ No response` → bulk reminder]

### 6.5 When a vendor says no
> A rejection returns the route to Action Required with the reason attached, and reassignment reuses the same inline
> form — deliberately not pre-filled with the vendor who just declined.

[SCREENS: `Action Required _ Rejected` → `Rejected _ VIEW DETAILS` → `Rejected-4` → `Rejected-5` (sent)]

### 6.6 Fixing a bad upload
> Errors are named per field on the row that failed — wrong vendor ID, rate above the ceiling, invalid date range —
> and fixed in place.

[SCREENS: `Action Required _ Upload errors _ see details` → `Action Required _ upload error`]

### 6.7 Verifying before it goes live
> Nothing activates automatically. A contract the vendor has accepted sits in Upcoming until it is checked and
> activated — one deliberate click, because a wrong contract caught here costs nothing and caught after the trucks
> run costs a dispute.

[SCREENS: `Upcoming` → `Upcoming _ Ready _ View Details` → `Upcoming _ Edit contract`]

### 6.8 Monitoring what's running, and changing it
> See §7.3 — the change model is a decision, not just a flow.

[SCREENS: `Active _ On Track _ see details` → the Confirm Changes modal family]

### 6.9 Disputes, termination, closure
> A dispute raised before activation resolves in the route itself — approve and revise the rate, or reject the dispute
> with a reason. Termination states its notice period so a route is never cut without cover. Everything terminal
> lands in Closed, read-only.

[SCREENS: `Disputed before activation2` → `If user clicks on reject dispute` → `Termination` → `CLOSED`]

[DIAGRAM: **The full flow map** — all of the above on one page, Excalidraw-style, showing where each stage hands off
to the next and where exceptions loop back. This is the artifact the reference portfolios all have and mine doesn't.]

---

## 7. The decisions

*Plainly titled. Each: the situation → what I chose → what I rejected → what it cost.*

### 7.1 Where does a half-finished route live?
Covered by the model in §4 — a route sits at its least-finished truck.
**Rejected:** filing it under its best state with a warning badge (badges become wallpaper at fifty rows a day);
listing it in every stage it touches (destroys the counts, and the counts are the whole triage instrument).
**Cost:** progress you've already made stops being visible. Finish three of four trucks and the route sits where it
sat this morning. The counts reward finishing routes, not trucks — correct for the deadline the team is judged
against, and mildly demoralising on a Wednesday.

### 7.2 Assign in the row, not in a modal
**Rejected:** a modal per assignment — open, fill, close, find the next row, repeat. The cost lands on the single most
repeated action in the product. Modals are kept for what genuinely deserves a stop: confirmations and destructive acts.

### 7.3 Not every change breaks a contract  ← *the strongest decision, currently missing*
> A signed contract is an agreement, so "edit" cannot mean what it means in a normal form. I had to decide, per field,
> whether a change is something the vendor already agreed to or something they must agree to again.
>
> - **Rate change** — applies from the next trip. Completed trips keep the old rate. The vendor is notified, but does
>   not have to re-accept.
> - **Placement time** — the vendor is notified. Nothing else moves.
> - **Dates** — the contract is closed and reissued for acceptance, because the period is the substance of the
>   agreement.
> - **Several at once** — the modal says exactly which of the above will happen.
>
> Every one of those modals states the consequence in plain language before you commit.

[SCREENS: `Rate change after activation` · `Date changes-1` · `Date changes-2` (placement time) · `Date changes-4`
(multiple change) — shown as a set of four.]

### 7.4 The vendor column only exists once there's a vendor
**Rejected:** a fixed grid across every stage with dashes in the gaps. At scanning speed a dash reads as a loading
failure and costs an investigation click. A missing column says *this doesn't exist yet*; an empty one says
*something went wrong*.

[SCREENS: `Action Required _ Unassigned` beside `Sent for approval`, cropped to the column headers.]

### 7.5 Teach the rules on the page
> The upload rules, the change-detection logic, what happens when vehicles are reduced — all of it sits on the
> Network Design page as numbered cards, not in a document nobody opens. This is a low-frequency, high-consequence
> task: people do it once a month and cannot afford to get it wrong.

[SCREEN: `Network design 1` — the rules panel.]

---

## 8. States and edge cases

> Every table view was specified with its full set: default, loading, empty because you cleared it, empty because it's
> your first time, no search results, network error, inline row error, and three toast variants. [VERIFY: confirm this
> list matches what shipped.]

[SCREENS: a 4-up grid — `Action Required _ upload error` · `Disputed before activation 5` · `Termination` ·
`preclosed 1`]

---

## 9. How it was made

> Structure diagram → written decision record → Figma → prototype. Four contested structural calls were settled in
> writing before any high-fidelity work, which is why 130+ screens shipped without a structural revision.
>
> The interaction model was proven in a **data-driven prototype** rather than a click-through, because the central
> claim is a data rule: it runs ~75 routes across three monthly batches, with the least-finished-truck rule
> implemented in the filtering logic. Assign three of four trucks and the route genuinely refuses to move.

[EMBED: the live prototype]
[DIAGRAM: the 8-step process as one compact band — the full process ran; it just isn't the story.]

---

## 10. Where it stands, and what I'd test

> **Status: in development.** The design is locked and handed off; engineering is building it now. So there is no
> usage metric yet, and pretending otherwise would be the easiest thing in this case study to catch.
>
> What I can claim honestly today is structural: a locked architecture across 14 flows and 130+ screens, three
> navigation-breaking issues caught before engineering built them, and a change model that makes the consequence of
> every edit explicit.
>
> What I would want before calling it finished:
> - **A measured number.** Time to clear the Action Required queue, before and after. The case currently rests on
>   structure, not on a shipped outcome.
> - **The Wednesday test.** Whether a manager who has just finished three of four trucks reads the unchanged queue as
>   the system being strict, or the system ignoring their work. The prototype demonstrates the rule; it doesn't teach
>   it yet.

---

## Status of open items

1. ~~§10 status~~ — **answered: in development.** Applied.
2. ~~The three diagrams~~ — **drawn.** `dg-month.png` · `dg-model.png` · `dg-flow.png` in `public/work/clh/`.
3. **Any real number** — still open. Queue-clearing time, adoption, error rate, anything measured. This is the case's
   weakest point; if nothing exists yet because it's still in build, we say so (already written that way).
4. **Any real quote** from the ops team — still open. One sentence from a real user beats a paragraph of my prose.
5. **§2 failure modes** — still open. Are those four right (no visibility / wrong terms going live / uncovered routes /
   invisible changes), or is the one that actually hurt most missing?
