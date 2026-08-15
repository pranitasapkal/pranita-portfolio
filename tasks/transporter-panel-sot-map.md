# Transporter Panel — Figma SOT map

Evidence base for `00-transporter-panel.md`. Every line here is read directly off the screens in
`Figma- Assignment module/` (182 PNGs). This is the version live in production.

**Rule for the case study: nothing goes in the narrative that isn't in this file or confirmed by Pranita.**
Verbatim UI copy is quoted `"like this"`. Anything unverified is marked ⟪…⟫.

---

## Screen inventory

| Tab | Folder | Screens |
|---|---|---|
| Pending Assignment | `Pending Assignment/` | 30 |
| Upcoming | `Upcoming Trips/` | 29 |
| In-Transit | `In-Transpit trips/` | 10 |
| Completed | `Completed Trips/` | 102 |
| Cancelled | `Cancelled trips/` | 7 |
| | **Total** | **182** |

Completed Trips carries 56% of the screen set on its own — the confirm/dispute/missing-trip system is
the bulk of the module.

---

## 1. Shell (constant across all five tabs)

- **Platform: desktop web panel.** Fixed dark left nav, wide data table, no mobile frame anywhere in the SOT.
  (Corrects the earlier draft, which described this module as mobile-first.)
- **Left nav:** avatar + user name (`Karan Verma`) · Valmo Support · Home · Trips (active) · Disputes ·
  Contract Management · Log Out · Valmo wordmark pinned bottom.
- **Header:** page title `Trips` · `"How it works?"` with a YouTube glyph · `Search by Trip ID`.
- **Section card:** `"Trip Management"` / `"Manage your trips and monitor performance"` ·
  primary CTA top-right `Report Missing Trips`.
- **Three summary cards**, each with a chevron into its tab:
  - `Pending Assignment (10)` + red pill `⚠ 2 Trip at risk` → `Unassigned Drivers 2 Trips` · `Unassigned Vehicles 3 Trips`
  - `In-Transit Trips (12)` → `On Time 3 Trips` · `Delayed 1 Trip`
  - `Completed Trips` → `Pending Confirmation 3 Trips` · `Trips Under Dispute 10 Trips`
- **Tabs:** `Pending Assignment (10)` · `Upcoming (20)` · `In-Transit (20)` · `Completed (30)` · `Cancelled (20)`
- **Filter/sort row:** `Filter by:` + 3 dropdowns · `Sort by: Newest Trip First` · `Download ⬇`
  (Download is present on Pending / Upcoming / In-Transit / Completed; **absent on Cancelled**.)

## 2. Pending Assignment

**Columns:** Trip ID · Route Details ⓘ · Placement Time · Expected Earnings ⓘ · Vehicle · Primary Driver · Action

- **Bilingual instruction banner** (amber, tab-specific):
  `"Assign vehicle and driver, then Accept the trip, if the trip is not accepted before placement time will be automatically rejected."`
  with a play-button chip `▶ हिंदी में जानकारी`.
- **Trip ID cell** stacks three things: `TR-12345678-1234 | Regular` / `Required Vehicle: 32ft` / an urgency chip.
- **Urgency chips are deadline-based, four bands, colour + text (never colour alone):**
  `Assign by: 03:00 AM` (red) · `Assign by: 5:30 AM` (amber) · `Assign by Today` (grey) · `Assign by Tomorrow` (grey).
- **Route Details:** `BLR — [6 Nodes] → DLS | NLH`, second line `One way · 1200 km` / `Two way · 700 km`.
  Multi-node routes collapse the middle into a `N Nodes` chip.
- **Expected Earnings:** `₹30,000` over `001-RFQ-00944`; when no contract exists → `–` over `No RFQ Linked`.
- **Progressive enablement (the core interaction):** `Vehicle` and `Driver` render as
  `Assign Vehicle ⌄` / `Assign Driver ⌄` outlined pickers while empty, and **`Accept` stays disabled/grey**.
  Once both are filled (`DL 01 AB 1234`, `Prashant Patel`) `Accept` turns solid blue. `Reject` is always available.
- **Assign pickers:** searchable dropdown, `Search No Result` state, `Selected` state, success toast.
  Separate snackbars for `Vehicle Assigned`, `Driver Assigned`, `Trip Assigned`.
- **Reject Trip modal** — consequences *before* the reason field:
  `"Are you sure you want to reject this trip?"` / `"This action cannot be undone and may result in:"`
  · `Trip cancellation fees` · `Impact on your performance ratings` · `Loss of scheduled earnings`
  then `Reason for Rejecting` → `Select the reason`:
  `Vehicle not available` · `Driver unavailable` · `Route conflict` · `Payment concerns` ·
  `Delay in vehicle arrival` · `Other` (Other reveals a free-text detail field).
- **Route/payment side panel — `Route Timelines`** + `Get Direction`, arrival/departure rails per node:
  `STA: 2:00 PM / ATA:` … `STD: 3:00 PM / ATD:`, node code + full name (`BLR - Bengaluru`), address and
  phone each with a copy affordance, date separators (`16 Jul'25`, `17 Jul'25`), and an explicit
  glossary footnote: `"STA – Scheduled Time of Arrival"` … `"ATD – Actual Time of Departure"`.
  Beside it `Live Fleet Tracking` with the placeholder `"Live tracking map will be displayed here"`.

## 3. Upcoming

Same shell and columns as Pending. Differences:

- No instruction banner.
- Trip ID chip becomes provenance, not urgency: `Assigned Today` / `Assigned on 1 Dec`.
- Vehicle/Driver render as **filled** dropdowns — they are editable, not re-assignable from scratch.
- Action column is `Update` (disabled until a change is made) + `Reject`.
- Edit safety: `Assign Driver - Save Prompt` / `Upcoming - Save Changes Prompt` guard unsaved edits;
  `Snackbar - Trip Updated` on success.
- `Payment Breakup` panel exists on this tab.

## 4. In-Transit

**Columns:** Trip ID · Route Details ⓘ · **Departure Time** ⓘ · **Live Updates** ⓘ · Expected Earnings ⓘ · Vehicle · Primary Driver

- No Action column — the trip is running; there is nothing to do but watch.
- `Placement Time` is renamed `Departure Time` on this tab only.
- Trip ID chip becomes a status chip: `On Time` (blue) · `Delayed by 1hr` (red) · `Delayed by 20min` (red) ·
  **`No GPS Present` (amber)**.
- `Live Updates` shows `40km to NDSL New Delhi Hub`, or `-` when there is no signal.
  The GPS-less case is stated honestly in two places rather than faked with a stale position.
- Vehicle/Driver are plain text now, and the driver's phone number `9012345678` sits under the name
  **with a copy button** — the panel's job here is to let a fleet owner reach the driver in one click.

## 5. Completed — the money tab (102 screens)

**Sub-pills** (counts + value, not bare filters):
`All / 50 trips` · `Pending Confirmation / 10 trips worth ₹37,500` · `Confirmed by You / 20 trips` ·
`No Action Needed / 20 trips (SC-SC, FM Carting & others)`

**Education banner** (illustrated, above the filters):
`"What should I do for my Payments?"` ·
`"For All NLH/RLH trips Confirm or raise dispute here for each trip"` ·
`"For FM Carting/SC-SC/others follow your existing billing process for payment"` · `▶ हिंदी में जानकारी`

**Filters:** Source Node · Billing Type · Placement Time · `More Filters` (progressive disclosure —
this tab has more filters than fit, so the tail is collapsed rather than the row wrapped).

**Columns:** ☐ · Trip Info ⓘ · Route Details ⓘ · Placement Time · Completed Time · Total Earnings ⓘ · Trip Status · Action
(The leading checkbox is the bulk-confirm affordance.)

**Row states seen in one screen — four different billing realities in one table:**

| Billing type | Total Earnings | Trip Status | Action |
|---|---|---|---|
| `Regular` | `₹30,000` / `Contract ID: 001-RFQ-009` | `Pending Confirmation` (amber) + `Dispute Window Open till 1 Apr` | `Confirm Details` + `Raise Dispute` |
| `Regular` (done) | `₹30,000` / `Contract ID: 001-RFQ-009` | `Confirmed by you on 1 Nov` + `Payment will be initiated` (blue) | `Confirmed` (disabled) |
| `Adhoc` | `₹10,000` / `Rate: ₹20/km` | `Pending Confirmation` + `Dispute Window Open till 1 Apr` | `Confirm Details` + `Raise Dispute` |
| `SC-SC` / `FM Carting` | `As per existing Billing Process` | `No action needed on panel` + `Follow regular Billing Process to proceed for payment` | `More info` |

Adhoc **does** get Confirm/Raise Dispute in this SOT (the older annotation asking to suppress it is resolved
in the opposite direction — Adhoc rows carry a per-km rate instead of a contract ID). ⟪confirm this was deliberate⟫

**Confirm-with-active-dispute modal** — the flagship guard, verbatim:
> `Confirm Trip & Dismiss Dispute?`
> ⚠ `You have an active dispute on this trip`
> `Confirming this trip will dismiss your dispute immediately. You won't be able to raise it again, and payment will be based on current trip details.`
> `Are you sure you want to proceed?`
> `[Close]` `[Confirm & Dismiss]`

The destructive path is the *secondary-looking* one you must read past. Also present:
`Confirm - Dispute Failed`, `Confirm Trip Modal`, `Trip Confirmed - Success` (+ alt).

**Other states in this tab:** `Loading State` · `Error State` · `No Data State` · `Missing Trip - Empty State` ·
`Completed Trips - Tooltips` · `Custom Date Range` (empty / partial / filled variants).

## 6. Raise Dispute

Lives under the `Disputes` nav item, reached from a trip row or from `Report Missing Trips`.

- **`Select Dispute Category`** → `Existing Trip` | `Missing Trip`.
- **`Trip ID*`** required field.
- **Multi-select is explained, not assumed:** a blue helper card reads
  `"Select all issues that apply"` / `"You can select multiple issue types if they're all related to the same trip."`
- **`Select Dispute Sub-Category` — every option is bilingual inline, English label over Devanagari:**

  | English | Hindi |
  |---|---|
  | `Wrong trip amount (rate mismatch)` | `ट्रिप रेट गलत है` |
  | `Wrong billing type` | `बिलिंग गलत है` |
  | `Wrong vehicle number` | `गाड़ी का नंबर गलत है` |
  | `Contract ID mismatch / missing` | `कॉन्ट्रैक्ट नंबर गलत है या नहीं दिख रहा` |
  | `Time related issue` | `समय से जुड़ी दिक्कत` |
  | `Route changed / additional stops added` | `रास्ता बदला या बीच में और जगह रुकना पड़ा` |
  | `Other` | `कोई और दिक्कत` |

  This is not a Hindi toggle. Both languages are on screen at once, permanently, on the highest-stakes form
  in the module.

- **False missing-trip guard**, verbatim: entering a Trip ID that already exists returns
  `"This trip isn't missing! Trip TRP1234567890 is currently In-Transit tab."` + a `View Trip` link —
  a redirect instead of a support ticket.
- **`Find your Trip ID on the Challan (see examples below)`** — two photographs of real challan documents
  with the Trip ID box outlined in green. Recognition over recall, using the paper the driver is already holding.
- Dispute lifecycle screens present: `Draft` · `Review` · `Confirm` · `Submitted` · `In Progress` · `Processing` ·
  `Under Review` · `Unassigned 1–3` · `Approved` · `Partial Approved` · `Rejected` · `Reopened` · `Reraise`.
- `Report Missing Trip` is a 3-step flow + `Submit`, with `Report Missing - Upload Failed` covered.
- `Kapture Login - OTP Email` / `OTP Phone` exist in the file — **internal ticketing, never published.**

## 7. Cancelled

**Columns:** Trip ID · Route Details ⓘ · Placement Time · **Missed Earning** · **Remark**

- Read-only. No Action column, no Download, no bulk select.
- The earnings column is renamed to name the loss: `Missed Earning`.
- **Remark is written in the transporter's own words where one exists**, e.g.
  `Rate too low, this route costs ₹14,000 but quoted ₹12,500` — alongside system remarks
  `Auto Cancelled` · `Vehicle not available` · `Payment concerns` · `Route conflict` ·
  `Driver unavailable` · `Cancelled at the source` · `Delay in vehicle arrival`.
- Trip IDs here use the `TRP373833312068` form rather than `TR-…`.
- **Known gap (still true in this SOT):** no empty state and no loading state for this tab.

---

## Cross-cutting patterns worth naming in the narrative

1. **The action column is the tab's thesis.** Pending = Accept/Reject, Upcoming = Update/Reject,
   In-Transit = nothing, Completed = Confirm/Dispute, Cancelled = nothing. The lifecycle is legible
   from the right-hand edge alone.
2. **Consequences precede inputs.** Reject lists the three costs before the reason dropdown;
   Confirm-with-dispute states what is destroyed before the button.
3. **Bilingual where money is at stake**, English-only where it isn't. Hindi appears on the Pending
   instruction banner, the Payments explainer, and every dispute sub-category — not on filter labels.
4. **Empty is a value, not a blank.** `No RFQ Linked`, `No GPS Present`, `As per existing Billing Process`,
   `No action needed on panel` — the panel says why a cell is empty instead of leaving it empty.
5. **The column that changes name changes meaning.** Placement Time → Departure Time (In-Transit),
   Expected Earnings → Total Earnings (Completed) → Missed Earning (Cancelled).

---

## Source documents (added 2026-08-08, in `Figma- Assignment module/`)

| File | Pages | What it gives |
|---|---|---|
| `Transporter Panel (1).pdf` | 3 | The problem-statement doc — PS1 (bad data into TMS) + PS2 (delayed LH invoice reconciliation), WhatsApp interim, module impact, summary table |
| `Valmo Transporter Panel.pdf` | 40 | Pranita's design-review deck — problem breakdown %, user research, phased journey, per-module features, goals, UX initiatives |
| `Transporter Payout and Negotiation (10).pdf` | 253 | The full product doc — V0 user stories, compute-engine logic, dispute mechanism + status model, **her design-ideation pages (the 6 table rules)**, roadmap, impact readout |

Text extracted with PyMuPDF (`python3 -c "import fitz"`) — `pdftotext`/`markitdown` are unavailable here.

### Numbers that must be fuzzed on the public site
New pairs added to `content/fuzzing-map.json`: `tms_data_quality`, `payout_reconciliation`, `finops_load`,
`provisioning_delta`, `dispute_mix`, `assignment_targets`, `ticketing_backend`. New banned scan strings
include `Kapture`, `₹150 Cr`, `₹13 Cr`, `1200+ hours`, `55+ days`, `+40 NPS`.

### Attribution caveat
The headline programme numbers (data-accuracy improvement, provisioning delta recovered, payout turnaround,
billing discounts) are for the **whole system-led trip programme**, not this panel alone. The case study
states this explicitly and claims none of them as the module's outcome.

---

## Where the docs and the live SOT disagree — Figma wins

The user's instruction: the Figma SOT is the live version; the decks describe earlier or parallel thinking.

| Doc says | Live SOT says | Resolution |
|---|---|---|
| Tab named `Ongoing Trips` | `In-Transit` | Use In-Transit |
| `Opt-Out` with fee/rating/earnings consequences | `Reject` modal with `Trip cancellation fees` / `Impact on your performance ratings` / `Loss of scheduled earnings` | Same pattern, shipped name is Reject |
| Payment states `Confirmed, Scheduled, Initiated, Credited, Failed` and a `Payments` tab | No Payments tab; nav is Home · Trips · Disputes · Contract Management. Row shows `Payment will be initiated` only | Don't describe a payments module |
| Dispute categories `Payout incorrect, GPS mismatch, SC delays, route deviation, other` | 7 bilingual sub-categories (rate / billing type / vehicle number / contract ID / time / route change / other) | Use the SOT's seven |
| Dispute card CTAs `Confirm Earnings` (secondary) + `Raise Dispute` (primary) | Row CTAs `Confirm Details` (primary, solid) + `Raise Dispute` (secondary link) | Use the SOT — primacy is inverted |
| Report Missing Trip fields: route, touch points, route name, date range, vehicle number | Flow keyed on **Trip ID** with challan photos + false-missing guard | Use the SOT |
| Mobile app screens (onboarding, driver app, fleet management) | Not part of this module | Out of scope for TPN-01 |

## Her own rules vs what shipped (the honest bit)

From the design-ideation pages, six rules for the Completed listing:

1. Scan is horizontal: leftmost → middle → earnings → status → action
2. Recognition order is route > vehicle > earnings > Trip ID — **"Trip ID cannot be the first thing they see"**
3. **Six columns maximum**
4. Earnings + Action stay right
5. Vehicle + driver must appear, but small
6. Listing = signal, details page = depth

Plus Goal 2: *"Allow 'Raise Dispute' inside trip details (not directly in listing)."*

**Shipped Completed tab breaks rules 2 and 3, and Goal 2:** 7 content columns + a bulk checkbox;
`Trip Info` is leftmost (mitigated by stacking the vehicle number into that same cell);
`Raise Dispute` sits in the row. The case study names all three deviations rather than restating the rules
as if they held.

---

## Resolved calls — SOT is authoritative (decided 2026-08-08)

Where the SOT and the earlier docs disagreed, **the live Figma is the settled decision.** No hedging in the
published narrative.

- **Timeline:** Sept – Nov 2025, design review 18 Nov 2025.
- **Adhoc rows carry `Confirm Details` / `Raise Dispute` — intentional.** Adhoc is the billing type most
  likely to have no linked RFQ, so those are the trips whose earnings the transporter can least verify.
  Suppressing the actions there would strand the weakest paper trail with no route to correction.
  The row shows `Rate: ₹20/km` as its basis where Regular shows `Contract ID`. SC-SC / FM Carting keep
  `More info` only, because they settle off-panel.
- **Rules 2 and 3 were deliberately overruled, not missed.**
  - *Rule 2 (Trip ID must not lead):* overruled on this tab only — Completed is where disputes are raised
    and a dispute is quoted by ID. Mitigated by stacking the vehicle number into the same leftmost cell.
  - *Rule 3 (6 columns max):* overruled for `Placement Time` + `Completed Time`, because
    `Time related issue / समय से जुड़ी दिक्कत` is a dispute category that cannot be checked from one
    timestamp. Six columns is the right ceiling for a scanning table, the wrong one for an evidence table.
  - *Goal 2 (`Raise Dispute` in details, not listing):* overruled everywhere — friction on the corrective
    action suppresses only legitimate disputes.

## Do not publish

- Kapture screens or the name `Kapture`, internal ticket fields, `SetuX`
  (use the fuzz pairs `ticketing_backend` / `transporter_platform`).
- Any programme-level metric (data accuracy, provisioning delta, payout turnaround, billing discounts)
  attributed to this module alone.
