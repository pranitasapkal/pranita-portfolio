---
slug: assignment-module
code: ASM-01
title: The Assignment Module — moving a transporter's whole trip life out of WhatsApp
oneLiner: Every trip ran on a chat thread and got paid two months later. I designed the panel that replaced both — and its hardest screen is the one where a man who reads English slowly agrees, irreversibly, to what he's owed.
meta: { role: "Product Designer — sole designer, end to end", team: "Valmo Transportation (Meesho) — with PM, FinOps and engineering counterparts", timeline: "Sept – Nov 2025 · design review Nov 2025", platform: "Desktop web panel (transporter-facing) — live" }
---

## TLDR

- problem: Trip assignment ran entirely on WhatsApp — a channel that broke past roughly 20 trips a day per vendor while real transporters were running 20–80 — and payout reconciliation ran on manual invoice-to-tracker matching, so a transporter first saw his own trip data during a reconciliation cycle measured in months. Roughly a third of trips carried a data error before they ever reached finance.
- outcomes: [
  "Replaced the chat thread with a five-state panel — 182 designed screens, 102 of them on Completed, because confirm-or-dispute is where the money and the risk are",
  "Made confirmation the payout trigger: the panel is the transporter's auditable ledger, which is what lets self-invoicing and automated payouts exist at all",
  "Every irreversible action names its cost first — Reject lists three consequences above the reason field, and confirming a trip with an open dispute states exactly what it destroys"
]
- summary: I designed the transporter-facing trip module in Valmo's TMS — the desktop panel where a fleet owner assigns a vehicle and driver, accepts before a deadline, tracks the run, and finally confirms or disputes his earnings. I wrote six table rules for the listing before drawing it, shipped a version that knowingly breaks two of them, and pushed disputes out of the trip row into their own top-level surface so the row could stay readable.

## STEP 01 — PROBLEM UNDERSTANDING

Valmo — Meesho's transportation arm — places linehaul trips with independent Indian transporters. The whole lifecycle after placement ran on chat. Two separate failures met in the middle.

**Bad data going in.** Trips were created in TMS from placement sheets kept by sort-centre staff, and those staff are measured on departures, not on data accuracy — their job is to get a truck out, so a vendor name or vehicle number typed under time pressure is good enough to dispatch and wrong enough to break the payout three weeks later. When a transporter swapped a vehicle at the last minute, nobody updated the sheet. The result: **roughly a third of trips carried a data inaccuracy**, spread across wrong vehicle numbers, wrong transporter mapping, missing GPS, and — the largest single error class — round trips booked as two separate one-way trips.

**No visibility coming out.** After execution, a vendor had no view into which trips Valmo had even acknowledged. Each one kept a private spreadsheet to raise invoices from, and FinOps matched the two by hand over a reconciliation cycle measured in months. Mismatches were resolved by phone. Disputes happened over email and got lost. The transporter's own summary of it, quoted in the requirements: *"I don't know when and how much I'll be paid."*

Before this panel, the team's interim answer to the first problem was a **WhatsApp assignment module** — trips pushed to transporters as messages they could accept, reject, or update vehicle and driver on. It worked, and it worked for the right reason: it moved data ownership from ground ops to the person whose payout depends on the data being right. But it had a hard ceiling. **The flow degrades past roughly 20 trips a day per vendor, and the transporters who matter most run 20–80.** At that volume a POC scrolls a chat thread hunting for what's still unassigned, vehicles get mistagged between trips, and nobody can answer the three questions that actually matter: which trips still need a vehicle, which vehicles are free, and what am I going to be paid.

That ceiling is the design brief. Everything the chat thread structurally could not hold — a sortable list, a filter, a bulk action, a dispute with evidence attached, a payment history — is what the panel exists to do.

> STAT: trips carrying a data inaccuracy | roughly one in three, against a single-digit target
> STAT: where WhatsApp broke | ~20 trips/day per vendor, against transporters running 20–80
> STAT: designed screens in the shipped file | 182, of which 102 are Completed
> IMG: the five-tab panel with the Trip Management summary cards | assignment/pending-default

## STEP 02 — OBJECTIVE

The business objective is one sentence and everything else follows from it: **make confirmation the payout trigger.** If a transporter agrees on-screen that a trip's route, vehicle and earnings are correct, the invoice can be generated from system data instead of reconstructed from his spreadsheet — which is the precondition for self-invoicing and automated payouts, and therefore for collapsing a payout cycle currently measured in months down to within the same week.

For the transporter that decomposes into four jobs, one per lifecycle state, each of which had to complete without a phone call:

1. **Get a new trip staffed and accepted before its deadline** — and know what rejecting it costs.
2. **Change a vehicle or driver on an accepted trip** — without silently losing the change.
3. **Know where a running truck is** — including knowing when the system genuinely doesn't know.
4. **Confirm or dispute the earnings on a finished trip** — and never destroy a live claim by accident.

The targets set against those jobs were behavioural, not interface-shaped: near-universal vehicle-and-driver confirmation *before* placement, a large drop in missed assignments, and better GPS coverage on tagged trips.

The bar I set for myself, and the one the shipped screens are actually built against:

- **No cell is ever blank without saying why.** `No RFQ Linked`, `No GPS Present`, `As per existing Billing Process`, `No action needed on panel` — an absence is always a labelled value. This came straight out of the research: missing earnings don't read as "pending", they read as anxiety.
- **Consequence before input.** Any irreversible action states its cost above the field that commits it.
- **Hindi where money is at stake, English where it isn't** — inline on the assignment banner, the payments explainer and every dispute category; not on filter labels.

> STAT: urgency bands on Pending | 4 — `Assign by: 03:00 AM` (red), `Assign by: 5:30 AM` (amber), `Assign by Today`, `Assign by Tomorrow`
> STAT: dispute sub-categories, all bilingual | 7
> STAT: rejection reasons offered | 6, the last being `Other` + free text

## STEP 03 — USER PERSONA

This is not the driver's phone. It is a **desktop panel for the person who owns the trucks** — a fleet operator running dozens of trips at once, often through more than one point of contact, who needs a dense table because he is comparing rows rather than reading one.

What transporters actually asked for, from the research that preceded this build:

| They asked for | What it became |
|---|---|
| One central dashboard for all trip types, with route-level status | Five lifecycle tabs plus three summary cards that each drill into one |
| Recorded acknowledgment instead of a verbal yes | `Accept` on Pending, `Confirm Details` on Completed — both timestamped and shown back (`Confirmed by you on 1 Nov`) |
| Rate cards and estimated cost per trip **upfront** | `Expected Earnings` with its `001-RFQ-00944` source visible from the Pending tab onward |
| Real-time payout tracking | `Dispute Window Open till 1 Apr` · `Payment will be initiated` stated in the row |
| Owner vs POC access — hide financial detail from POCs | Not in this release. Named in the gaps. |

Three things about this person changed concrete decisions. He is Hindi-first and reads English slowly, so the two surfaces where he risks money carry Hindi inline rather than behind a toggle. He trusts the interface literally, so a disabled `Accept` has to make its own precondition visible rather than just being grey. And **he works from paper** — the challan in his hand carries the Trip ID he has to type — so the Missing Trip form shows him **photographs of a real challan with the ID box outlined in green** instead of describing the format in words.

> IMG: the Missing Trip form showing challan photos with the Trip ID outlined | assignment/missing-trip-challan
> GAP: Role-based access (owner sees rates, POC doesn't) was an explicit research ask and is not in this release.

## STEP 04 — INFORMATION ARCHITECTURE

**Five tabs, ordered as the trip actually moves:** Pending Assignment → Upcoming → In-Transit → Completed → Cancelled. Above them, three summary cards that each carry the one number that would make you go there: `Pending Assignment (10)` with a red `2 Trip at risk` pill, `In-Transit Trips (12)` split On Time / Delayed, `Completed Trips` split Pending Confirmation / Trips Under Dispute.

The structural idea I kept returning to: **the action column is the tab's thesis.** Read the right-hand edge and the lifecycle explains itself — Accept/Reject, then Update/Reject, then nothing at all, then Confirm/Raise Dispute, then nothing again. In-Transit and Cancelled have no action column because there is genuinely nothing to do, and I would rather a column disappear than sit there full of disabled buttons.

The vocabulary shifts deliberately with the state, because the same column means a different thing at different points in the trip:

| Column | Pending / Upcoming | In-Transit | Completed | Cancelled |
|---|---|---|---|---|
| Time | Placement Time | **Departure Time** | Placement + Completed Time | Placement Time |
| Money | Expected Earnings | Expected Earnings | **Total Earnings** | **Missed Earning** |

Naming the last one `Missed Earning` rather than reusing `Expected Earnings` is the difference between a log and an explanation.

**The biggest IA call was to take disputes out of the trip.** A dispute can be about a trip, but it can equally be about a rate card that was never agreed, a TDS deduction, a GST mismatch, a bank account, or a POD disagreement. If disputes live inside the trip row, then the trip listing gets cluttered, the payments screen fills with dispute banners, the contract screens need dispute rows, and every module has to carry its own dispute logic forever. So `Disputes` became a **top-level nav item** — one list, raised from anywhere, tracked in one place, backed by the existing support-ticketing system rather than a bespoke workflow. The trip row keeps a single entry point; the machinery lives somewhere it can scale.

Completed carries the most structure because it carries the most risk. It splits into **four sub-pills that state value, not just count** — `All / 50 trips`, `Pending Confirmation / 10 trips worth ₹37,500`, `Confirmed by You / 20 trips`, `No Action Needed / 20 trips (SC-SC, FM Carting & others)`. The one worth money leads with the money. And because four billing realities coexist in that one table — Regular against a contract ID, Adhoc against a per-km rate, and SC-SC / FM Carting which are not settled on this panel at all — the tab opens with a plain-language explainer, `"What should I do for my Payments?"`, that tells you which of the four you are before you touch a row.

Adhoc rows get the full `Confirm Details` / `Raise Dispute` pair, exactly like Regular ones, and that was a deliberate call rather than an oversight. Adhoc is the billing type most likely to have **no linked contract at all** — the great majority of adhoc trips run without an RFQ — so those are precisely the trips whose number a transporter cannot check against anything he agreed to. Suppressing the actions on the rows with the weakest paper trail would have left the least verifiable earnings with no route to correction. Instead the row shows the basis it *does* have — `Rate: ₹20/km` where Regular shows `Contract ID: 001-RFQ-009` — and keeps both actions live. What genuinely doesn't belong on this panel is SC-SC and FM Carting, which settle through an existing billing process elsewhere; those rows say so in words and offer `More info` instead of a button that would do nothing.

> STAT: Completed sub-pills | 4, each showing count and (where relevant) rupee value
> STAT: billing types coexisting in one table | 4 — Regular, Adhoc, SC-SC, FM Carting
> IMG: Completed tab with sub-pills and the payments explainer | assignment/completed-default

## STEP 05 — USER FLOW

**Assign and accept.** A pending row shows `Assign Vehicle ⌄` and `Assign Driver ⌄` as empty outlined pickers, and `Accept` is disabled. Fill both — each a searchable dropdown with a real no-results state, each firing its own confirmation snackbar — and `Accept` turns solid. The button's state *is* the instruction. Above the table, one banner says the rest of it in both languages: `"Assign vehicle and driver, then Accept the trip, if the trip is not accepted before placement time will be automatically rejected."`

**Reject.** The modal leads with consequences, not a form: `"This action cannot be undone and may result in:"` → `Trip cancellation fees` · `Impact on your performance ratings` · `Loss of scheduled earnings`. Only underneath does it ask for a reason, from six options ending in `Other` with a free-text field. The order is the point — a transporter who was going to reject anyway loses nothing; one who didn't understand the cost finds out before he commits. Rejections then persist on Cancelled with the reason attached, so the same conversation doesn't have to happen twice.

**Track.** In-Transit replaces the action column with `Live Updates` — `40km to NDSL New Delhi Hub` when there's a signal, `-` when there isn't, and an amber `No GPS Present` chip on the trip itself. A vehicle without a tracker is stated as a fact about the vehicle rather than hidden behind a stale last-known position. The driver's phone number sits under his name with a copy button: on a running trip the panel's job is to shorten the distance to a phone call, not replace it.

**Confirm or dispute.** Each completed row shows what the payment is based on (`Contract ID: 001-RFQ-009`, or `Rate: ₹20/km` for Adhoc), how long the transporter has (`Dispute Window Open till 1 Apr`), and two actions. Confirming a clean trip flips the row to `Confirmed by you on 1 Nov` / `Payment will be initiated`. A checkbox on every row supports confirming a batch at once, which is the only way this screen works for someone closing out a month.

Confirming a trip that already has an open dispute does not just go through. It raises the guard this module is built around:

> Confirm Trip & Dismiss Dispute?
> You have an active dispute on this trip.
> Confirming this trip will dismiss your dispute immediately. You won't be able to raise it again, and payment will be based on current trip details.

**Raise a dispute.** Category (`Existing Trip` or `Missing Trip`), Trip ID, then sub-categories as a multi-select — with the multi-select behaviour explained rather than assumed: `"You can select multiple issue types if they're all related to the same trip."` All seven options carry their Hindi underneath: `Wrong trip amount (rate mismatch) / ट्रिप रेट गलत है`, `Contract ID mismatch / missing / कॉन्ट्रैक्ट नंबर गलत है या नहीं दिख रहा`, and so on. Those categories are not generic — they were chosen against the actual dispute mix, where the overwhelming majority of weekly disputes were about **rate**, not service.

**Report a missing trip.** A three-step flow with one guard that matters more than the rest: type a Trip ID that already exists and the form refuses to open a ticket — `"This trip isn't missing! Trip TRP1234567890 is currently In-Transit tab."` with a `View Trip` link. The support ticket that never gets created is the best outcome that flow can have.

> STAT: dispute lifecycle states designed | 13 — Draft, Review, Confirm, Submitted, In Progress, Processing, Under Review, Unassigned, Approved, Partial Approved, Rejected, Reopened, Reraise
> IMG: the Confirm & Dismiss Dispute guard | assignment/confirm-active-dispute
> IMG: bilingual dispute sub-category list | assignment/raise-dispute-form

## STEP 06 — LO-FI WIREFRAMES

Before drawing the Completed listing I wrote down what it had to obey, because this is the screen where a layout mistake costs someone money. Six rules:

1. **The transporter scans horizontally, not vertically** — leftmost → middle → earnings → status → action. So the leftmost cell has to let him recognise the trip.
2. **He remembers a trip by route, then vehicle number, then earnings — and by Trip ID almost never**, except when quoting one in a dispute. So Trip ID cannot be the first thing he sees.
3. **Six columns maximum.** Past six, scanning degrades.
4. **Earnings and Action stay right**, following universal table-scanning behaviour.
5. **Vehicle and driver must appear somewhere** — wrong vehicle entry is a dispute cause — but must not take much space.
6. **Listing is signal; the details page is depth.**

**The shipped table breaks rules 2 and 3, and both breaks were chosen.** Completed ships with seven content columns plus a bulk-select checkbox, and `Trip Info` is leftmost.

Rule 2 said Trip ID must not lead, because a transporter recognises a trip by route and vehicle long before he recognises an ID. Rather than reorder the table I made the first cell carry *two* handles — `TR-12345678-1234 | Regular` over `DL 01 AB 1234 | 32 ft` — so vehicle number, the second-strongest memory hook, sits in the column where the eye already lands. The ID stays first because this is the tab where disputes get raised, and a dispute is quoted by ID: the one screen where rule 2's exception applies is this one.

Rule 3 lost to rule 5's underlying reason. The two columns over budget are `Placement Time` and `Completed Time`, and a dispute about timing is unarguable without both — `Time related issue / समय से जुड़ी दिक्कत` is one of the seven categories, and it cannot be checked from a listing that shows only one timestamp. Six columns is the right ceiling for a scanning table; it is the wrong ceiling for an evidence table, and Completed is an evidence table.

The third deviation is the one I'd defend hardest. I'd written that `Raise Dispute` should live inside trip details, not the listing, to keep the row clean. It ships in the row, next to `Confirm Details`. Putting the safe action and the corrective action side by side matters more than column hygiene: a transporter who spots a wrong number should not have to open a detail page to say so, because that friction only ever suppresses the legitimate dispute, never the frivolous one.

What I removed and did not bring back:

- **A language toggle.** Switching the whole panel to Hindi looks like the respectful answer and isn't: it makes the user choose a language before he knows which words he'll struggle with, and it doubles the copy surface I have to keep in sync. Bilingual inline on the few screens that decide money is narrower and never needs a decision.
- **A single unified Completed list with a mixed action column.** One list is one mental model, but a table where the action means "confirm this" on one row and "nothing to do here" on the next teaches a literal reader that the panel is arbitrary. Four sub-pills cost one click and buy an unambiguous action column.
- **Actions revealed on hover.** Every action is visible in the row at rest.
- **Colour-only status.** Every urgency and delay signal is a coloured chip *with text* — `Delayed by 1hr`, `On Time`, `No GPS Present`, `Assign by Today`.
- **A disabled `Raise Dispute` past the window.** The row states the rule (`Dispute Window Open till 1 Apr`) rather than showing a dead control.
- **Blank cells**, replaced everywhere by a named absence.

> STAT: self-imposed table rules | 6 written, 2 deliberately overruled in the shipped version
> STAT: patterns rejected and replaced | 6
> IMG: the action column read down the five tabs | assignment/action-column-thesis

## STEP 07 — PROTOTYPE

The deliverable is the Figma file engineering built from, and it is the version now live. Its weight is distributed the way the risk is: 30 screens for Pending Assignment, 29 for Upcoming, 10 for In-Transit, 7 for Cancelled — and **102 for Completed**, which is 56% of the file for one tab.

State coverage on Completed is met: `Loading State`, `Error State`, `No Data State`, `Missing Trip - Empty State`, `Report Missing - Upload Failed`, `Confirm - Dispute Failed`, plus four variants of the custom date-range picker. Search dropdowns on Pending and Upcoming both carry explicit no-result states. Unsaved edits on Upcoming are guarded by a save prompt. The dispute lifecycle is drawn to its terminal states, including the awkward ones — `Partial Approved`, `Reopened`, `Reraise`.

It is not met everywhere, and I'd rather name that than round it up. **Cancelled has no empty state and no loading state.** That is the honest edge of this file.

> STAT: screens per tab | Pending 30 · Upcoming 29 · In-Transit 10 · Completed 102 · Cancelled 7
> STAT: Completed's share of the file | 56%
> STAT: known state gap | Cancelled — empty + loading undesigned

## STEP 08 — BUSINESS ASPECTS

The commercial case is a chain, and the panel is one link in it: **accurate assignment data makes system-computed payouts possible, and on-screen confirmation makes self-invoicing possible.** Without the first, finance is provisioning against numbers that are wrong a third of the time. Without the second, every invoice still has to be matched by hand against a vendor's private spreadsheet — the manual work that made the reconciliation cycle months long in the first place.

That framing decided the details. The dispute form asks for a category and a trip ID rather than a paragraph, because a structured dispute can be routed, measured and SLA'd while a phone call cannot. The false-missing-trip guard exists because every ticket it prevents is real cost removed from a resolving team. The earnings cell always shows its basis — `Contract ID` or `Rate: ₹20/km` — because a rate the transporter can trace against his own contract is a rate he argues about less, and because the dispute data said the argument was almost always about rate. And `No RFQ Linked` is displayed rather than suppressed: a trip running without a linked contract is precisely the trip that gets disputed later, so the panel says so at assignment time instead of at payout time.

The trade-off I took knowingly: this module never hides a bad number to keep the queue quiet. `Missed Earning` on every cancelled row, `No RFQ Linked` on the pending ones, the dispute window stated in plain text on every completed row. It surfaces more disagreement in the short term, in exchange for disagreement that arrives as a categorised, evidenced dispute instead of a call to FinOps two months later.

> STAT: settlement paths the tab must keep distinct | 2 — panel-settled (NLH/RLH) vs existing billing process (SC-SC, FM Carting, others)
> STAT: dispute mix that shaped the category list | a small single-digit share of trips, but the overwhelming majority of those disputes were about rate
> GAP: The headline TMS-wide improvements (data accuracy, provisioning delta, payout turnaround) belong to the whole system-led trip programme, not to this module alone. I'm not claiming them as this panel's outcome.

## DECISION SPOTLIGHTS

- decision: `Accept` stays disabled until both vehicle and driver are assigned, and the row's own controls are the only instruction needed.
  rejected: An always-enabled Accept that throws a validation error, or a required-fields asterisk pattern.
  why: For a literal reader, an error after the fact reads as the system breaking. The disabled button plus two visibly empty pickers makes the precondition physical — you can see what's missing without reading anything. This is also the whole point of the module: the interim WhatsApp flow proved transporters will supply accurate vehicle and driver data when their payout depends on it, and the panel's job is to make supplying it the path of least resistance rather than a message someone has to remember to send.

- decision: Confirming a trip that has an open dispute triggers a full-stop modal that names the loss — `"You won't be able to raise it again, and payment will be based on current trip details."` — with `Close` as the visually dominant option.
  rejected: A toast-with-undo, or silently blocking Confirm while a dispute is open.
  why: Confirmation freezes the trip for payout: data final, dispute window closed. That makes it the one action in the module that can destroy a legitimate money claim in a single click, and it's reachable from a row that otherwise looks routine. An undo toast assumes the user notices it; blocking silently teaches him the button is broken. Naming the consequence and making the safe choice the easy one is the only version that survives a user who trusts the screen.

- decision: Disputes got their own top-level nav item and their own list, instead of living inside the trip row.
  rejected: Managing disputes inline per module — a dispute section on trips, another on payments, another on contracts.
  why: Only some disputes are about a trip. Rate cards, TDS and GST, bank details, POD disagreements — a trip listing cannot scale to hold any of that elegantly, and the inline version means every module maintains its own dispute UI and logic forever. One consolidated surface on top of the existing ticketing backend gave a single place to raise from anywhere and track in one list, and it kept the trip row readable, which rules 3 and 6 were already under pressure from.

- decision: Hindi is printed under every dispute sub-category and inside both money banners, permanently — not behind a toggle.
  rejected: A full Hindi locale switch for the panel.
  why: A toggle asks the user to predict where he'll struggle, and it doubles the copy surface for the entire panel to serve the four screens that actually matter. Printing both languages at the point of highest stakes costs vertical space on one form and nothing else, and it means a Hindi-first user and an English-first user read the same screen without either changing state.

- decision: The Missing Trip form validates the Trip ID against live trips and redirects instead of filing — `"This trip isn't missing! Trip TRP1234567890 is currently In-Transit tab."` — and shows photographs of a challan with the ID location outlined.
  rejected: Accepting the report and letting the resolving team close it as invalid.
  why: A "missing" trip is usually a trip the transporter couldn't find, not one the system lost — most often because he mistyped an ID he was reading off paper. Fixing the lookup at the point of entry converts a support ticket into a link, and showing the actual document beats describing an ID format to someone who is holding that document.

## REFLECTION

The lesson I keep from this module is about where design effort belongs. Five tabs, and one of them holds more than half the screens — not because Completed is visually complicated, but because it's the only tab where being wrong costs the user money he has already earned. Effort should be allocated by consequence, not by surface area.

The second is about my own rules. I wrote six constraints for the listing table and shipped a version that breaks two of them. That isn't a failure of the rules; it's what rules are for — they made the cost of each violation explicit, so the compromise was chosen rather than drifted into. A rule you never break was probably never load-bearing.

And the third, which I now use constantly: **an empty cell is a design decision you haven't made yet.** `No RFQ Linked`, `No GPS Present`, `As per existing Billing Process` — each started as a blank space in a table, and each one, once named, stopped generating a phone call.

## GAPS

Stated plainly rather than papered over:

1. **Cancelled has no empty or loading state.** Known, undesigned.
2. **Disputes can only be raised from Completed.** A rate disagreement that is obvious at assignment time has to wait until the trip finishes to become a formal dispute.
3. **Role-based access is not in this release.** Transporters explicitly asked to hide rate and payout detail from their POCs; the panel currently shows everyone the same view.
4. **No module-level outcome numbers published.** The system-wide programme metrics exist but belong to more than this panel, so I've attributed nothing here that this module can't own.
